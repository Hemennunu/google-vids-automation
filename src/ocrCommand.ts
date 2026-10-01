/**
 * Standalone OCR command.
 *
 * Reads an image or PDF file, sends it to Unlimited-OCR via the free
 * Hugging Face Spaces demo, and writes the extracted text to `input/`.
 *
 * Usage:
 *   npm run ocr -- --input=textbook.pdf
 *   npm run ocr -- --input=scan.jpg --mode=base
 *   npm run ocr -- --input=scans/           # all images in a folder
 *   npm run ocr -- --input=textbook.pdf --output=input/ICT_G11.txt
 *   npm run ocr -- --input=textbook.pdf --max-pages=5
 */
import fs from "node:fs/promises";
import path from "node:path";
import { cliFlag, cliValue } from "./cliArgs.js";
import { ensureDir, log } from "./googleVids.js";
import { createOcrProvider } from "./ocr/index.js";
import type { OcrOptions, OcrResult } from "./ocr/types.js";

const INPUT_DIR = path.join(process.cwd(), "input");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".webp"]);
const PDF_EXT = ".pdf";

function isImage(file: string): boolean {
  return IMAGE_EXTS.has(path.extname(file).toLowerCase());
}

function isPdf(file: string): boolean {
  return path.extname(file).toLowerCase() === PDF_EXT;
}

interface OcrArgs {
  inputPath: string;
  outputPath?: string;
  mode: "gundam" | "base";
  prompt: string;
  maxPages?: number;
  dryRun: boolean;
}

function parseArgs(argv: string[]): OcrArgs {
  const inputPath = cliValue(argv, "input");
  if (!inputPath) {
    console.error(`
Unlimited-OCR — extract text from images and PDFs (free, via HuggingFace Spaces)

Usage:
  npm run ocr -- --input=<file-or-folder> [options]

Options:
  --input=<path>     Image, PDF, or folder of images (required)
  --output=<path>    Output text file path (default: input/<filename>.txt)
  --mode=gundam      Fast mode, 640px crop (default)
  --mode=base        Accurate mode, 1024px
  --prompt=<text>    Custom prompt (default: "document parsing.")
  --max-pages=<N>    Max pages to OCR from a PDF
  --dry-run          Show what would be processed without calling OCR

Examples:
  npm run ocr -- --input=textbook.pdf
  npm run ocr -- --input=chapter1.jpg --mode=base
  npm run ocr -- --input=scans/ --max-pages=10
`);
    process.exit(1);
  }

  const modeRaw = cliValue(argv, "mode") ?? "gundam";
  const mode = modeRaw === "base" ? "base" : "gundam";

  return {
    inputPath: path.resolve(inputPath),
    outputPath: cliValue(argv, "output") ? path.resolve(cliValue(argv, "output")!) : undefined,
    mode,
    prompt: cliValue(argv, "prompt") ?? "document parsing.",
    maxPages: cliValue(argv, "max-pages") ? Number.parseInt(cliValue(argv, "max-pages")!, 10) : undefined,
    dryRun: cliFlag(argv, "dry-run"),
  };
}

/** Determine the output path for a given input file. */
function defaultOutputPath(inputFile: string): string {
  const base = path.basename(inputFile, path.extname(inputFile));
  return path.join(INPUT_DIR, `${base}.txt`);
}

/** Collect processable files from a directory. */
async function collectFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.isFile()) {
      const full = path.join(dirPath, entry.name);
      if (isImage(full) || isPdf(full)) {
        files.push(full);
      }
    }
  }
  return files.sort();
}

/** Format milliseconds as "Xm Ys". */
function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

/** Write OCR result to a text file. */
async function writeResult(result: OcrResult, outputPath: string): Promise<void> {
  await ensureDir(path.dirname(outputPath));

  const header = [
    `# OCR Output`,
    `# Source: ${path.basename(result.sourcePath)}`,
    `# Pages: ${result.pages.length}`,
    `# Processing time: ${formatDuration(result.elapsedMs)}`,
    `# Generated: ${new Date().toISOString()}`,
    ``,
  ].join("\n");

  let body: string;
  if (result.pages.length === 1) {
    body = result.pages[0].text;
  } else {
    body = result.pages
      .map((p) => `\n## Page ${p.pageNumber}\n\n${p.text}`)
      .join("\n");
  }

  await fs.writeFile(outputPath, header + body + "\n", "utf8");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  // Check if input exists
  let stat: Awaited<ReturnType<typeof fs.stat>>;
  try {
    stat = await fs.stat(args.inputPath);
  } catch {
    log("error", `Input not found: ${args.inputPath}`);
    process.exitCode = 1;
    return;
  }

  // Collect files to process
  let files: { input: string; output: string }[];

  if (stat.isDirectory()) {
    const collected = await collectFiles(args.inputPath);
    if (collected.length === 0) {
      log("error", `No image or PDF files found in: ${args.inputPath}`);
      process.exitCode = 1;
      return;
    }
    files = collected.map((f) => ({
      input: f,
      output: args.outputPath
        ? path.join(args.outputPath, `${path.basename(f, path.extname(f))}.txt`)
        : defaultOutputPath(f),
    }));
  } else {
    files = [
      {
        input: args.inputPath,
        output: args.outputPath ?? defaultOutputPath(args.inputPath),
      },
    ];
  }

  // Show plan
  log("info", "╔══════════════════════════════════════════════════════════╗");
  log("info", "║           Unlimited-OCR (HuggingFace Spaces)           ║");
  log("info", "╚══════════════════════════════════════════════════════════╝");
  log("info", `Mode: ${args.mode} (${args.mode === "gundam" ? "fast, 640px" : "accurate, 1024px"})`);
  log("info", `Files to process: ${files.length}`);
  if (args.maxPages) log("info", `Max pages per PDF: ${args.maxPages}`);
  log("info", "");

  for (const { input, output } of files) {
    log("info", `  📄 ${path.basename(input)} → ${path.relative(process.cwd(), output)}`);
  }
  log("info", "");

  if (args.dryRun) {
    log("info", "Dry run — no OCR calls made.");
    return;
  }

  // Process each file
  const provider = createOcrProvider();
  const overallStart = Date.now();
  let successCount = 0;
  let failCount = 0;

  try {
    for (const [i, { input, output }] of files.entries()) {
      log("info", `[${i + 1}/${files.length}] Processing: ${path.basename(input)}`);

      const ocrOptions: OcrOptions = {
        mode: args.mode,
        prompt: args.prompt,
        maxPages: args.maxPages,
        onPageDone: (page, total) => {
          log("info", `    ✓ Page ${page.pageNumber}/${total} done (${page.text.length} chars)`);
        },
      };

      try {
        let result: OcrResult;

        if (isPdf(input)) {
          result = await provider.parsePdf(input, ocrOptions);
        } else if (isImage(input)) {
          result = await provider.parseImage(input, ocrOptions);
        } else {
          log("warn", `  Skipping unsupported file: ${input}`);
          continue;
        }

        await writeResult(result, output);
        successCount++;

        const totalChars = result.pages.reduce((sum, p) => sum + p.text.length, 0);
        log("info", `  ✔ Done in ${formatDuration(result.elapsedMs)} — ${totalChars} chars, ${result.pages.length} page(s) → ${path.relative(process.cwd(), output)}`);
      } catch (err) {
        failCount++;
        log("error", `  ✖ Failed: ${err instanceof Error ? err.message : String(err)}`);
      }

      log("info", "");
    }
  } finally {
    await provider.close();
  }

  // Summary
  const totalTime = formatDuration(Date.now() - overallStart);
  log("info", "────────────────────────────────────────");
  log("info", `Done: ${successCount} succeeded, ${failCount} failed (${totalTime} total)`);

  if (successCount > 0) {
    log("info", "");
    log("info", "Next steps:");
    log("info", "  • Review the extracted text in input/");
    log("info", "  • Run a video: npm run start -- --script=input/<filename>.txt");
    log("info", "  • Or batch:    npm run batch -- --subject=ICT --grade=11");
  }

  if (failCount > 0) process.exitCode = 1;
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
