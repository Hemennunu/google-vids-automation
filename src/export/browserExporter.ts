import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { BrowserContext, Download, Locator, Page } from "playwright";
import {
  SCREENSHOTS_DIR,
  captureFailure,
  ensureDir,
  firstVisible,
  log,
  forceFreshRender,
  openFileMenu,
  waitForMediaLoadable,
} from "../googleVids.js";
import { assertVideoHasVisuals } from "./videoCheck.js";
import {
  type ExportRequest,
  type ExportResult,
  type VideoExporter,
  describeExportResult,
} from "./types.js";

const UI_POLL_MS = 500;
/** Downloads of the same draft when the MP4 looks blank (media still generating). */
const BLANK_RETRY_ATTEMPTS = 3;
const BLANK_RETRY_WAIT_MS = 60_000;
/** How long we keep retrying File → Download while the menu item is disabled. */
export const MENU_READY_TIMEOUT_MS = 10 * 60_000;

export function exportTimeoutMsFromEnv(): number {
  /** Vids renders server-side before the download starts; long videos take a while. */
  const raw = process.env.VIDS_EXPORT_TIMEOUT_MIN?.trim();
  const minutes = raw ? Number.parseFloat(raw) : 30;
  return (Number.isFinite(minutes) && minutes > 0 ? minutes : 30) * 60_000;
}

export class ExportFailure extends Error {
  constructor(
    message: string,
    readonly screenshotPath?: string,
    readonly diagnosticsPath?: string,
  ) {
    super(message);
    this.name = "ExportFailure";
  }
}

/**
 * Resolves with the first download started by any page in the context
 * (Vids may trigger it from the editor tab or from a new tab).
 */
function captureNextDownload(context: BrowserContext): {
  next: () => Download | null;
  dispose: () => void;
} {
  let captured: Download | null = null;
  const onDownload = (d: Download) => {
    captured ??= d;
  };
  const attach = (p: Page) => p.on("download", onDownload);
  context.pages().forEach(attach);
  context.on("page", attach);

  return {
    next: () => captured,
    dispose: () => {
      context.off("page", attach);
      for (const p of context.pages()) {
        p.off("download", onDownload);
      }
    },
  };
}

type CdpDownload = { guid: string; suggestedFilename: string };

/**
 * Download capture for the user's own Chrome (connectOverCDP). Playwright does
 * not deliver those files, so tell Chrome itself to save downloads into `dir`
 * (named by GUID) and follow its Browser.download* events.
 */
async function captureCdpDownload(page: Page, dir: string) {
  const browser = page.context().browser();
  if (!browser) throw new Error("No browser handle for CDP download capture.");
  await ensureDir(dir);
  const cdp = await browser.newBrowserCDPSession();
  await cdp.send("Browser.setDownloadBehavior", {
    behavior: "allowAndName",
    downloadPath: dir,
    eventsEnabled: true,
  });

  let begun: CdpDownload | null = null;
  const states = new Map<string, string>();
  cdp.on("Browser.downloadWillBegin", (e) => {
    begun ??= { guid: e.guid, suggestedFilename: e.suggestedFilename };
  });
  cdp.on("Browser.downloadProgress", (e) => {
    states.set(e.guid, e.state);
  });

  return {
    next: (): CdpDownload | null => begun,
    /** Resolves with the saved file path once Chrome reports the download completed. */
    async finished(d: CdpDownload, timeoutMs: number): Promise<string> {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const state = states.get(d.guid);
        if (state === "completed") return locateDownloadedFile(dir, d.guid);
        if (state === "canceled") throw new Error("Chrome canceled the download.");
        await page.waitForTimeout(UI_POLL_MS);
      }
      throw new Error("Download did not complete in time.");
    },
    async dispose(): Promise<void> {
      // Give the user's Chrome its normal download behaviour back.
      await cdp.send("Browser.setDownloadBehavior", { behavior: "default" }).catch(() => undefined);
      await cdp.detach().catch(() => undefined);
    },
  };
}

/**
 * Chrome names the file by GUID in our folder — unless Playwright's own
 * per-context download setting wins, in which case it lands in a
 * "playwright-artifacts-…" folder under the system temp dir, named by the same
 * GUID. Look in both (briefly, while it is renamed).
 */
async function locateDownloadedFile(dir: string, guid: string): Promise<string> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const candidates = [path.join(dir, guid)];
    const tmp = os.tmpdir();
    for (const entry of await fs.readdir(tmp).catch(() => [] as string[])) {
      if (entry.startsWith("playwright-artifacts-")) candidates.push(path.join(tmp, entry, guid));
    }
    for (const file of candidates) {
      if (await fs.access(file).then(() => true, () => false)) return file;
    }
    await new Promise((r) => setTimeout(r, 1_000));
  }
  throw new Error(`Download ${guid} completed but the file was not found in ${dir} or Playwright's temp folders.`);
}

/** Move a finished download into place via a .part name, then verify size. */
async function placeFile(
  sourcePath: string,
  outputPath: string,
): Promise<Extract<ExportResult, { destination: "local" }>> {
  await ensureDir(path.dirname(outputPath));
  const tmpPath = `${outputPath}.part`;
  await fs.rm(tmpPath, { force: true });
  await fs.copyFile(sourcePath, tmpPath);
  await fs.rm(sourcePath, { force: true });
  await fs.rm(outputPath, { force: true });
  await fs.rename(tmpPath, outputPath);
  const { size } = await fs.stat(outputPath);
  if (size <= 0) throw new Error(`Downloaded file is empty: ${outputPath}`);
  return { destination: "local", filePath: outputPath, sizeBytes: size };
}

export async function isDisabled(item: Locator): Promise<boolean> {
  if ((await item.getAttribute("aria-disabled").catch(() => null)) === "true") {
    return true;
  }
  return !(await item.isEnabled().catch(() => true));
}

export async function closeMenus(page: Page): Promise<void> {
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.keyboard.press("Escape").catch(() => undefined);
}

/**
 * File → Download → MP4.
 * Retries while "Download" is disabled (e.g. media still generating).
 */
async function triggerDownloadFromMenu(page: Page): Promise<void> {
  const deadline = Date.now() + MENU_READY_TIMEOUT_MS;
  let lastLog = 0;

  while (Date.now() < deadline) {
    await openFileMenu(page);

    const downloadItem = await firstVisible(
      page,
      "File → Download menu item",
      [
        (p) => p.getByRole("menuitem", { name: /^download/i }),
        (p) => p.getByRole("menuitem", { name: /download/i }),
      ],
      15_000,
    );

    if (await isDisabled(downloadItem)) {
      if (Date.now() - lastLog > 15_000) {
        log("info", "File → Download is disabled (video may still be processing) — retrying…");
        lastLog = Date.now();
      }
      await closeMenus(page);
      await page.waitForTimeout(5_000);
      continue;
    }

    // Docs-style submenus open on hover; click also works on most builds.
    await downloadItem.hover().catch(() => undefined);
    await downloadItem.click().catch(() => undefined);

    const mp4Item = await firstVisible(
      page,
      "MP4 download option",
      [
        (p) => p.getByRole("menuitem", { name: /mp4/i }),
        (p) => p.getByRole("menuitemradio", { name: /mp4/i }),
        (p) => p.getByRole("button", { name: /mp4/i }),
      ],
      10_000,
    ).catch(() => null);

    if (!mp4Item) {
      // Some builds start the download / open a dialog directly from "Download".
      log("info", "No MP4 submenu item found — assuming Download started export directly.");
      return;
    }

    if (await isDisabled(mp4Item)) {
      if (Date.now() - lastLog > 15_000) {
        log("info", "MP4 download option is disabled — retrying…");
        lastLog = Date.now();
      }
      await closeMenus(page);
      await page.waitForTimeout(5_000);
      continue;
    }

    await mp4Item.click();
    log("info", "Clicked File → Download → MP4.");
    return;
  }

  throw new Error("File → Download → MP4 stayed unavailable (disabled) until timeout.");
}

/**
 * After choosing MP4, Vids may render first and then show a dialog/toast with a
 * Download button, or start the download itself. Poll until a real download event.
 */
async function waitForDownloadEvent<T>(
  page: Page,
  capture: { next: () => T | null },
  timeoutMs: number,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let confirmClicks = 0;
  let lastLog = 0;

  while (Date.now() < deadline) {
    const download = capture.next();
    if (download) {
      return download;
    }

    const errorText = page
      .getByText(
        /(couldn't|could not|unable to|failed to) (download|export|render)|download failed|export failed/i,
      )
      .first();
    if (await errorText.isVisible().catch(() => false)) {
      const text = (await errorText.textContent().catch(() => ""))?.trim();
      throw new Error(`Google Vids reported an export error: "${text}"`);
    }

    // Confirmation dialog / "ready" toast with a Download button.
    if (confirmClicks < 3) {
      const confirm = await firstVisible(
        page,
        "export Download confirmation",
        [
          (p) => p.getByRole("dialog").getByRole("button", { name: /^download$/i }),
          (p) => p.getByRole("alertdialog").getByRole("button", { name: /^download$/i }),
          (p) => p.getByRole("alert").getByRole("button", { name: /^download$/i }),
          (p) => p.getByRole("status").getByRole("button", { name: /^download$/i }),
        ],
        1_000,
      ).catch(() => null);
      if (confirm && !(await isDisabled(confirm))) {
        confirmClicks++;
        await confirm.click().catch(() => undefined);
        log("info", `Clicked Download confirmation (${confirmClicks}).`);
        await page.waitForTimeout(2_000);
        continue;
      }
    }

    if (Date.now() - lastLog > 30_000) {
      const progress = await page
        .getByText(/preparing|rendering|processing|exporting|downloading/i)
        .first()
        .textContent({ timeout: 500 })
        .catch(() => null);
      const remainingMin = Math.round((deadline - Date.now()) / 60_000);
      log(
        "info",
        `Waiting for download to start${progress ? ` (UI: "${progress.trim().slice(0, 80)}")` : ""}… ~${remainingMin} min left`,
      );
      lastLog = Date.now();
    }

    if (/accounts\.google\.com|signin/i.test(page.url())) {
      throw new Error("Redirected to Google sign-in during export. Run: npm run login:cdp");
    }

    await page.waitForTimeout(UI_POLL_MS);
  }

  throw new Error(`No download started within ${Math.round(timeoutMs / 60_000)} minutes.`);
}

/** Save download to a temp name, then rename — output/ never holds a partial file. */
async function saveAndVerify(
  download: Download,
  outputPath: string,
): Promise<Extract<ExportResult, { destination: "local" }>> {
  await ensureDir(path.dirname(outputPath));
  const suggested = download.suggestedFilename();
  log("info", `Download started: "${suggested}" — waiting for it to complete…`);

  if (!/\.mp4$/i.test(suggested)) {
    log("warn", `Suggested filename is not .mp4 ("${suggested}") — saving anyway for inspection.`);
  }

  const tmpPath = `${outputPath}.part`;
  // saveAs() resolves only once the download has finished.
  await download.saveAs(tmpPath);
  const failure = await download.failure();
  if (failure) {
    await fs.rm(tmpPath, { force: true });
    throw new Error(`Download failed: ${failure}`);
  }

  await fs.rm(outputPath, { force: true });
  await fs.rename(tmpPath, outputPath);

  const { size } = await fs.stat(outputPath);
  if (size <= 0) {
    throw new Error(`Downloaded file is empty: ${outputPath}`);
  }
  return { destination: "local", filePath: outputPath, sizeBytes: size };
}

/** Writes URL, dialogs, menus, buttons and console errors next to the screenshot. */
export async function writeDiagnostics(
  page: Page,
  error: unknown,
  consoleErrors: string[],
): Promise<string | undefined> {
  try {
    await ensureDir(SCREENSHOTS_DIR);
    const visibleTexts = async (selector: string, limit: number): Promise<string[]> =>
      page
        .locator(selector)
        .evaluateAll(
          (els, max) =>
            (els as unknown as Array<{
              offsetParent: unknown;
              innerText?: string;
              getAttribute(name: string): string | null;
            }>)
              .filter((e) => e.offsetParent !== null)
              .slice(0, max)
              .map((e) => (e.getAttribute("aria-label") || e.innerText || "").trim().slice(0, 300))
              .filter(Boolean),
          limit,
        )
        .catch(() => []);

    const diagnostics = {
      time: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      url: page.url(),
      title: await page.title().catch(() => ""),
      dialogs: await visibleTexts('[role="dialog"], [role="alertdialog"]', 10),
      alerts: await visibleTexts('[role="alert"], [role="status"]', 10),
      menuItems: await visibleTexts('[role="menuitem"], [role="menuitemradio"]', 60),
      buttons: await visibleTexts('[role="button"], button', 120),
      consoleErrors: consoleErrors.slice(-30),
    };

    const file = path.join(SCREENSHOTS_DIR, `${Date.now()}-export-diagnostics.json`);
    await fs.writeFile(file, JSON.stringify(diagnostics, null, 2), "utf8");
    log("error", `Export diagnostics saved: ${file}`);
    return file;
  } catch (err) {
    log("warn", `Could not write export diagnostics: ${String(err)}`);
    return undefined;
  }
}

/** Exports via File → Download → MP4, captured by Playwright into output/. */
export class BrowserVideoExporter implements VideoExporter {
  readonly name = "browser-ui";

  async exportVideo({ page, context, outputPath, cdpDownloads }: ExportRequest): Promise<ExportResult> {
    const consoleErrors: string[] = [];
    const onConsole = (msg: { type(): string; text(): string }) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    };
    page.on("console", onConsole);

    try {
      for (let attempt = 1; ; attempt++) {
        const result = cdpDownloads
          ? await this.downloadOnceViaCdp(page, outputPath)
          : await this.downloadOnce(page, context, outputPath);
        log("info", `Export complete: ${describeExportResult(result)}`);

        try {
          await assertVideoHasVisuals(result.filePath);
          return result;
        } catch (err) {
          if (attempt >= BLANK_RETRY_ATTEMPTS) throw err;
          // Same draft, no new generation. Vids re-serves its last render until the
          // content changes, so wait for the clips, then force a fresh render.
          log(
            "warn",
            `${err instanceof Error ? err.message : String(err)} — forcing a fresh render and re-downloading (attempt ${attempt + 1}/${BLANK_RETRY_ATTEMPTS})…`,
          );
          await page.waitForTimeout(BLANK_RETRY_WAIT_MS);
          await waitForMediaLoadable(page);
          await forceFreshRender(page);
        }
      }
    } catch (err) {
      const screenshotPath = await captureFailure(page, "export-failure").catch(() => undefined);
      const diagnosticsPath = await writeDiagnostics(page, err, consoleErrors);
      const message = err instanceof Error ? err.message : String(err);
      throw new ExportFailure(`MP4 export failed: ${message}`, screenshotPath, diagnosticsPath);
    } finally {
      page.off("console", onConsole);
    }
  }

  private async downloadOnce(
    page: Page,
    context: BrowserContext,
    outputPath: string,
  ): Promise<Extract<ExportResult, { destination: "local" }>> {
    const capture = captureNextDownload(context);
    try {
      log("info", `Exporting MP4 via Vids UI → ${outputPath}`);
      await triggerDownloadFromMenu(page);
      const download = await waitForDownloadEvent(page, capture, exportTimeoutMsFromEnv());
      return await saveAndVerify(download, outputPath);
    } finally {
      capture.dispose();
    }
  }

  private async downloadOnceViaCdp(
    page: Page,
    outputPath: string,
  ): Promise<Extract<ExportResult, { destination: "local" }>> {
    const capture = await captureCdpDownload(page, path.join(path.dirname(outputPath), ".downloading"));
    try {
      log("info", `Exporting MP4 via Vids UI (your Chrome) → ${outputPath}`);
      await triggerDownloadFromMenu(page);
      const started = await waitForDownloadEvent(page, capture, exportTimeoutMsFromEnv());
      log("info", `Download started: "${started.suggestedFilename}" — waiting for it to complete…`);
      const saved = await capture.finished(started, exportTimeoutMsFromEnv());
      return await placeFile(saved, outputPath);
    } finally {
      await capture.dispose();
    }
  }
}
