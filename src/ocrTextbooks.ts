/**
 * OCR the ICT printed textbooks (Grade 11 & 12 PDFs) and write the extracted
 * text to input/_source/ so the enrichment pipeline can use them.
 *
 * Usage:
 *   npm run ocr:textbooks                   # Both grades
 *   npm run ocr:textbooks -- --grade=11     # Grade 11 only
 *   npm run ocr:textbooks -- --grade=12     # Grade 12 only
 *   npm run ocr:textbooks -- --max-pages=20 # Limit pages (useful for testing)
 *   npm run ocr:textbooks -- --mode=base    # Accurate 1024px mode (slower)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { cliFlag, cliValue } from "./cliArgs.js";
import { ensureDir, log } from "./googleVids.js";
import { createOcrProvider } from "./ocr/index.js";
import type { OcrOptions, OcrResult } from "./ocr/types.js";

const SOURCE_DIR = path.join(process.cwd(), "input", "_source");
const TEXTBOOK_DIR = path.join(process.cwd(), "input", "Textbooks");

interface TextbookEntry {
  grade: string;
  pdfPath: string;
  outputPath: string;
}

const ALL_TEXTBOOKS: TextbookEntry[] = [
  {
    grade: "11",
    pdfPath: path.join(
      TEXTBOOK_DIR,
      "grade-11-information-technology-new-curriculum--student-textbook.pdf",
    ),
    outputPath: path.join(SOURCE_DIR, "textbook_G11_ICT.txt"),
  },
  {
    grade: "12",
    pdfPath: path.join(
      TEXTBOOK_DIR,
      "grade-12-information-technology-new-curriculum--student-textbook.pdf",
    ),
    outputPath: path.join(SOURCE_DIR, "textbook_G12_ICT.txt"),
  },
];

/** Format milliseconds as "Xm Ys". */
function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

/** Write OCR result to file with a structured header. */
async function writeTextbookOcr(
  result: OcrResult,
  outputPath: string,
  grade: string,
): Promise<void> {
  await ensureDir(path.dirname(outputPath));

  const header = [
    `# OCR Output`,
    `# Source: Grade ${grade} ICT Textbook`,
    `# File: ${path.basename(result.sourcePath)}`,
    `# Pages: ${result.pages.length}`,
    `# Processing time: ${formatDuration(result.elapsedMs)}`,
    `# Generated: ${new Date().toISOString()}`,
    ``,
  ].join("\n");

  const body = result.pages
    .map((p) => `\n## Page ${p.pageNumber}\n\n${p.text}`)
    .join("\n");

  await fs.writeFile(outputPath, header + body + "\n", "utf8");
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const gradeFilter = cliValue(argv, "grade");
  const maxPagesRaw = cliValue(argv, "max-pages");
  const maxPages = maxPagesRaw ? Number.parseInt(maxPagesRaw, 10) : undefined;
  const modeRaw = cliValue(argv, "mode") ?? "gundam";
  const mode: "gundam" | "base" = modeRaw === "base" ? "base" : "gundam";
  const dryRun = cliFlag(argv, "dry-run");

  // Filter by grade if requested
  let books = gradeFilter
    ? ALL_TEXTBOOKS.filter((b) => b.grade === gradeFilter)
    : [...ALL_TEXTBOOKS];

  if (books.length === 0) {
    log("error", `No textbook found for --grade=${gradeFilter}. Available: 11, 12`);
    process.exitCode = 1;
    return;
  }

  log("info", "╔══════════════════════════════════════════════════════════╗");
  log("info", "║        ICT Textbook OCR (HuggingFace Spaces)           ║");
  log("info", "╚══════════════════════════════════════════════════════════╝");
  log("info", `Mode:      ${mode} (${mode === "gundam" ? "fast, 640px" : "accurate, 1024px"})`);
  if (maxPages) log("info", `Max pages: ${maxPages}`);
  log("info", "");

  for (const book of books) {
    log("info", `  📚 Grade ${book.grade}: ${path.basename(book.pdfPath)}`);
    log("info", `      → ${path.relative(process.cwd(), book.outputPath)}`);
  }
  log("info", "");

  if (dryRun) {
    log("info", "Dry run — no OCR calls made.");
    return;
  }

  // Skip already-completed outputs
  const toProcess: TextbookEntry[] = [];
  for (const book of books) {
    try {
      await fs.access(book.outputPath);
      log("warn", `Grade ${book.grade} output already exists — skipping: ${path.relative(process.cwd(), book.outputPath)}`);
      log("warn", "  (Delete the file to re-run OCR for this grade.)");
    } catch {
      toProcess.push(book);
    }
  }

  if (toProcess.length === 0) {
    log("info", "All textbook OCR outputs already exist. Nothing to do.");
    return;
  }

  const provider = createOcrProvider();
  const overallStart = Date.now();
  let successCount = 0;
  let failCount = 0;

  try {
    for (const [i, book] of toProcess.entries()) {
      log("info", `[${i + 1}/${toProcess.length}] OCR-ing Grade ${book.grade} ICT textbook…`);

      try {
        await fs.access(book.pdfPath);
      } catch {
        log("error", `  PDF not found: ${book.pdfPath}`);
        failCount++;
        continue;
      }

      const options: OcrOptions = {
        mode,
        prompt: "document parsing.",
        maxPages,
        onPageDone: (page, total) => {
          log("info", `    ✓ Page ${page.pageNumber}/${total} (${page.text.length} chars)`);
        },
      };

      try {
        const result = await provider.parsePdf(book.pdfPath, options);
        await writeTextbookOcr(result, book.outputPath, book.grade);
        successCount++;

        const totalChars = result.pages.reduce((s, p) => s + p.text.length, 0);
        log(
          "info",
          `  ✔ Grade ${book.grade} done — ${result.pages.length} pages, ${totalChars.toLocaleString()} chars, ${formatDuration(result.elapsedMs)}`,
        );
      } catch (err) {
        failCount++;
        log("error", `  ✖ Grade ${book.grade} failed: ${err instanceof Error ? err.message : String(err)}`);
      }

      log("info", "");
    }
  } finally {
    await provider.close();
  }

  log("info", "──────────────────────────────────────────");
  log("info", `Done: ${successCount} succeeded, ${failCount} failed (${formatDuration(Date.now() - overallStart)} total)`);

  if (successCount > 0) {
    log("info", "");
    log("info", "Next step:  npm run enrich:ict");
  }

  if (failCount > 0) process.exitCode = 1;
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
