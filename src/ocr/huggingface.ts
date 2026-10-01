/**
 * Unlimited-OCR via the free Hugging Face Spaces demo.
 *
 * Uses the public Gradio API at `baidu/Unlimited-OCR`:
 *   /explode_pdf  — PDF → per-page images  (CPU, no GPU)
 *   /run_ocr      — image → text            (GPU, streaming)
 *
 * No API key required. The Space runs on ZeroGPU so requests may queue
 * when traffic is high; we handle retries and timeouts gracefully.
 */
import fs from "node:fs";
import path from "node:path";
import { Client } from "@gradio/client";
import type { OcrOptions, OcrProvider, OcrResult, PageResult } from "./types.js";
import { log } from "../googleVids.js";

/** Seconds to wait for a single page OCR before giving up. */
const PAGE_TIMEOUT_MS = 180_000; // 3 min (ZeroGPU cold starts can be slow)
/** Seconds between reconnection attempts. */
const RECONNECT_DELAY_MS = 5_000;
/** Max reconnection attempts. */
const MAX_RECONNECT = 3;

const SPACE_ID = "baidu/Unlimited-OCR";

export class HuggingFaceOcrProvider implements OcrProvider {
  readonly name = "huggingface-spaces";
  private client: Awaited<ReturnType<typeof Client.connect>> | null = null;

  /** Lazily connect (and reconnect on failure). */
  private async getClient(): Promise<Awaited<ReturnType<typeof Client.connect>>> {
    if (this.client) return this.client;
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RECONNECT; attempt++) {
      try {
        log("info", `Connecting to HF Space "${SPACE_ID}" (attempt ${attempt}/${MAX_RECONNECT})…`);
        this.client = await Client.connect(SPACE_ID);
        log("info", `Connected to HF Space "${SPACE_ID}".`);
        return this.client;
      } catch (err) {
        lastError = err;
        log("warn", `Connection attempt ${attempt} failed: ${err instanceof Error ? err.message : String(err)}`);
        if (attempt < MAX_RECONNECT) {
          await sleep(RECONNECT_DELAY_MS);
        }
      }
    }
    throw new Error(
      `Failed to connect to HF Space "${SPACE_ID}" after ${MAX_RECONNECT} attempts: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  // ── Single image ──────────────────────────────────────────────

  async parseImage(imagePath: string, options?: OcrOptions): Promise<OcrResult> {
    const absPath = path.resolve(imagePath);
    if (!fs.existsSync(absPath)) {
      throw new Error(`Image file not found: ${absPath}`);
    }

    const started = Date.now();
    const mode = options?.mode ?? "gundam";
    const prompt = options?.prompt ?? "document parsing.";

    log("info", `OCR (${mode}): ${path.basename(absPath)}`);
    const text = await this.runOcrOnFile(absPath, mode, prompt);

    const page: PageResult = { pageNumber: 1, text };
    options?.onPageDone?.(page, 1);

    return {
      sourcePath: absPath,
      text,
      pages: [page],
      elapsedMs: Date.now() - started,
    };
  }

  // ── Multi-page PDF ────────────────────────────────────────────

  async parsePdf(pdfPath: string, options?: OcrOptions): Promise<OcrResult> {
    const absPath = path.resolve(pdfPath);
    if (!fs.existsSync(absPath)) {
      throw new Error(`PDF file not found: ${absPath}`);
    }

    const started = Date.now();
    const mode = options?.mode ?? "gundam";
    const prompt = options?.prompt ?? "document parsing.";
    const maxPages = options?.maxPages;

    log("info", `Exploding PDF: ${path.basename(absPath)}`);
    const pageImages = await this.explodePdf(absPath);

    const totalPages = maxPages ? Math.min(pageImages.length, maxPages) : pageImages.length;
    log("info", `PDF has ${pageImages.length} page(s), processing ${totalPages}.`);

    const pages: PageResult[] = [];
    for (let i = 0; i < totalPages; i++) {
      const pageImg = pageImages[i];
      log("info", `  Page ${i + 1}/${totalPages}…`);
      const text = await this.runOcrOnUrl(pageImg, mode, prompt);
      const page: PageResult = { pageNumber: i + 1, text };
      pages.push(page);
      options?.onPageDone?.(page, totalPages);
    }

    const fullText = pages.map((p) => p.text).join("\n\n--- Page Break ---\n\n");
    return {
      sourcePath: absPath,
      text: fullText,
      pages,
      elapsedMs: Date.now() - started,
    };
  }

  // ── Low-level calls ───────────────────────────────────────────

  /**
   * Upload a PDF and get back an array of page-image URLs.
   * Uses the /explode_pdf endpoint (CPU, fast).
   */
  private async explodePdf(pdfPath: string): Promise<string[]> {
    const client = await this.getClient();
    const fileBlob = new Blob([fs.readFileSync(pdfPath)], { type: "application/pdf" });

    const result = await withTimeout(
      client.predict("/explode_pdf", { pdf_file: fileBlob }),
      PAGE_TIMEOUT_MS,
      `PDF explode timed out after ${PAGE_TIMEOUT_MS / 1000}s`,
    );

    // The result.data is a dict with page info; extract image URLs.
    const data = (result as { data: unknown[] }).data[0] as Record<string, unknown>;
    return extractPageUrls(data);
  }

  /** OCR a local file: upload it, then call /run_ocr. */
  private async runOcrOnFile(filePath: string, mode: string, prompt: string): Promise<string> {
    const client = await this.getClient();
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = filePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
    const fileBlob = new Blob([fileBuffer], { type: mimeType });

    return this.callRunOcr(client, fileBlob, mode, prompt);
  }

  /** OCR a URL returned by /explode_pdf. */
  private async runOcrOnUrl(imageUrl: string, mode: string, prompt: string): Promise<string> {
    const client = await this.getClient();

    // Download the image from the HF Space's file server
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download page image: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], { type: "image/png" });

    return this.callRunOcr(client, blob, mode, prompt);
  }

  /**
   * Call /run_ocr using the streaming submit() API.
   *
   * `client.predict()` wraps the SSE stream in a single promise that rejects
   * on any mid-stream EOF ("stream reading error: unexpected EOF"). Using
   * `client.submit()` lets us consume every token event as it arrives and
   * return whatever text we have collected — even if the stream cuts early.
   *
   * The Space yields events like:
   *   { type: "data", data: [{ text: "...", done: false }] }
   *   { type: "data", data: [{ text: "full result", done: true }] }
   *   { type: "status", ... }
   */
  private async callRunOcr(
    client: Awaited<ReturnType<typeof Client.connect>>,
    imageBlob: Blob,
    mode: string,
    prompt: string,
  ): Promise<string> {
    const maxRetries = 4; // more retries — ZeroGPU queues & EOF are transient

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const text = await withTimeout(
          this.streamRunOcr(client, imageBlob, mode, prompt),
          PAGE_TIMEOUT_MS,
          `OCR timed out after ${PAGE_TIMEOUT_MS / 1000}s`,
        );
        if (text.length > 0) return text;
        throw new Error("OCR returned empty text");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isEof = /unexpected eof|stream reading error|network error|socket hang up/i.test(msg);
        const isLast = attempt >= maxRetries;

        if (isLast) {
          throw new Error(`OCR failed after ${maxRetries} attempt(s): ${msg}`);
        }

        // Reconnect on EOF/network errors — the Gradio WS connection is stale.
        if (isEof) {
          log("warn", `OCR attempt ${attempt} — stream EOF, reconnecting…`);
          this.client = null;
          // Fresh client for next attempt
          try { client = await this.getClient(); } catch { /* will retry anyway */ }
        } else {
          log("warn", `OCR attempt ${attempt} failed (${msg}), retrying in ${RECONNECT_DELAY_MS / 1000}s…`);
        }

        await sleep(RECONNECT_DELAY_MS * attempt); // exponential back-off
      }
    }
    // TypeScript requires a return; unreachable.
    throw new Error("OCR: exceeded retries");
  }

  /**
   * Submit one /run_ocr request and consume the SSE stream to completion.
   * Returns the last non-empty `text` value seen across all events.
   */
  private async streamRunOcr(
    client: Awaited<ReturnType<typeof Client.connect>>,
    imageBlob: Blob,
    mode: string,
    prompt: string,
  ): Promise<string> {
    const job = client.submit("/run_ocr", {
      image_path: imageBlob,
      mode,
      prompt,
    });

    let lastText = "";

    for await (const event of job) {
      // event shape varies by @gradio/client version; normalise defensively.
      const ev = event as Record<string, unknown>;

      if (ev["type"] === "status") {
        const status = ev["status"] as Record<string, unknown> | undefined;
        if (status?.["stage"] === "error") {
          const detail = String(status["message"] ?? status["stage"]);
          throw new Error(`HF Space error: ${detail}`);
        }
        continue;
      }

      // "data" event — payload is ev.data (an array, first element is the result)
      const payload = (ev["data"] ?? ev) as unknown;
      const first = Array.isArray(payload) ? payload[0] : payload;

      if (typeof first === "string" && first.length > 0) {
        lastText = first;
      } else if (first && typeof first === "object") {
        const obj = first as Record<string, unknown>;
        if (typeof obj["text"] === "string" && obj["text"].length > 0) {
          lastText = obj["text"];
        }
      }
    }

    return lastText;
  }

  async close(): Promise<void> {
    this.client = null;
  }
}

// ── Helpers ──────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/**
 * The /explode_pdf endpoint returns a dict like:
 *   { pages: [...urls], count: N }
 * or sometimes the URLs are nested differently. This normalises them.
 */
function extractPageUrls(data: Record<string, unknown>): string[] {
  // Shape 1: { pages: [url1, url2, ...] }
  if (Array.isArray(data.pages)) {
    return (data.pages as unknown[]).map((p) => {
      if (typeof p === "string") return p;
      if (p && typeof p === "object" && "url" in (p as Record<string, unknown>)) {
        return String((p as Record<string, unknown>).url);
      }
      if (p && typeof p === "object" && "path" in (p as Record<string, unknown>)) {
        return String((p as Record<string, unknown>).path);
      }
      return String(p);
    });
  }

  // Shape 2: dict is itself {0: url, 1: url, count: N}
  const urls: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (/^\d+$/.test(key)) {
      if (typeof val === "string") urls.push(val);
      else if (val && typeof val === "object") {
        const obj = val as Record<string, unknown>;
        urls.push(String(obj.url ?? obj.path ?? val));
      }
    }
  }
  if (urls.length) return urls;

  // Shape 3: entire data is an array
  if (Array.isArray(data)) {
    return (data as unknown[]).map(String);
  }

  throw new Error(`Could not extract page URLs from /explode_pdf response: ${JSON.stringify(data).slice(0, 500)}`);
}
