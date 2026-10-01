/**
 * ICT Enrichment Runner:
 * Processes LMS section source files (input/_source/ICT_*.txt), matches them
 * with textbook OCR text, generates enriched markdown files in output/ict_enriched/,
 * and outputs a summary CSV report.
 *
 * Usage:
 *   npm run enrich:ict
 *   npm run enrich:ict -- --grade=11
 *   npm run enrich:ict -- --grade=12
 *   npm run enrich:ict -- --section=ICT_G11_U01_S04
 *   npm run enrich:ict -- --limit=10
 */
import fs from "node:fs/promises";
import path from "node:path";
import { cliFlag, cliValue } from "./cliArgs.js";
import { ensureDir, log } from "./googleVids.js";
import { enrichSection, type EnrichmentReportItem } from "./lms/enricher.js";
import {
  matchSectionToTextbook,
  parseTextbookOcr,
  type TextbookIndex,
} from "./lms/textbookMatcher.js";

const SOURCE_DIR = path.join(process.cwd(), "input", "_source");
const OUTPUT_DIR = path.join(process.cwd(), "output", "ict_enriched");

const TEXTBOOK_G11_PATH = path.join(SOURCE_DIR, "textbook_G11_ICT.txt");
const TEXTBOOK_G12_PATH = path.join(SOURCE_DIR, "textbook_G12_ICT.txt");

interface RawSection {
  filename: string;
  code: string;
  grade: string;
  unit: string;
  section: string;
  title: string;
  content: string;
}

function parseSectionFile(filename: string, content: string): RawSection {
  // Filename format: ICT_G11_U01_S04.txt
  const base = path.basename(filename, ".txt");
  const match = base.match(/^ICT_G(\d+)_U(\d+)_S(\d+)/i);
  const grade = match ? match[1] : "11";
  const unit = match ? match[2] : "01";
  const section = match ? match[3] : "01";

  // Extract title from first line "# Section ...: Title"
  let title = base;
  const firstLine = content.split("\n")[0] || "";
  const titleMatch = firstLine.match(/^#\s*(?:Section\s*\d+:\s*)?(.*)/i);
  if (titleMatch && titleMatch[1]?.trim()) {
    title = titleMatch[1].trim();
  }

  return {
    filename,
    code: base,
    grade,
    unit,
    section,
    title,
    content,
  };
}

function escapeCsvField(val: string | number): string {
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

async function writeCsvReport(
  items: EnrichmentReportItem[],
  csvPath: string,
): Promise<void> {
  const headers = [
    "code",
    "grade",
    "unit",
    "section",
    "title",
    "lms_words",
    "textbook_words_added",
    "gap_terms_count",
    "gap_terms_sample",
    "textbook_pages",
  ];

  const rows = items.map((item) =>
    [
      escapeCsvField(item.code),
      escapeCsvField(item.grade),
      escapeCsvField(item.unit),
      escapeCsvField(item.section),
      escapeCsvField(item.title),
      escapeCsvField(item.lmsWords),
      escapeCsvField(item.textbookWordsAdded),
      escapeCsvField(item.gapTermsCount),
      escapeCsvField(item.gapTermsSample),
      escapeCsvField(item.textbookPages),
    ].join(","),
  );

  const csvContent = [headers.join(","), ...rows].join("\n");
  await fs.writeFile(csvPath, csvContent, "utf8");
}

async function loadTextbookIndex(
  grade: string,
  filePath: string,
): Promise<TextbookIndex> {
  try {
    await fs.access(filePath);
    log("info", `📖 Loading OCR index for Grade ${grade}: ${path.basename(filePath)}`);
    return await parseTextbookOcr(filePath, grade);
  } catch {
    log(
      "warn",
      `⚠️ OCR textbook file not found for Grade ${grade}: ${path.basename(filePath)}`,
    );
    log("warn", `   Run 'npm run ocr:textbooks -- --grade=${grade}' to extract textbook pages.`);
    return {
      grade,
      sourceFile: filePath,
      pages: [],
    };
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const gradeFilter = cliValue(argv, "grade");
  const unitFilter = cliValue(argv, "unit");
  const sectionFilter = cliValue(argv, "section");
  const limitRaw = cliValue(argv, "limit");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  log("info", "╔══════════════════════════════════════════════════════════╗");
  log("info", "║       ICT LMS + Textbook Enrichment Pipeline            ║");
  log("info", "╚══════════════════════════════════════════════════════════╝");

  await ensureDir(OUTPUT_DIR);

  // Load Textbook OCR indexes
  const indexG11 = await loadTextbookIndex("11", TEXTBOOK_G11_PATH);
  const indexG12 = await loadTextbookIndex("12", TEXTBOOK_G12_PATH);

  // List all ICT files in input/_source
  const files = await fs.readdir(SOURCE_DIR);
  let ictFiles = files.filter((f) => /^ICT_.*\.txt$/i.test(f)).sort();

  if (gradeFilter) {
    ictFiles = ictFiles.filter((f) => f.includes(`_G${gradeFilter}_`));
  }
  if (unitFilter) {
    const formattedUnit = unitFilter.padStart(2, "0");
    ictFiles = ictFiles.filter((f) => f.includes(`_U${formattedUnit}_`));
  }
  if (sectionFilter) {
    ictFiles = ictFiles.filter((f) => f.includes(sectionFilter));
  }
  if (limit && limit > 0) {
    ictFiles = ictFiles.slice(0, limit);
  }

  if (ictFiles.length === 0) {
    log("warn", "No matching ICT section files found in input/_source/");
    return;
  }

  log("info", `Found ${ictFiles.length} ICT section file(s) to process.`);
  log("info", `Output directory: ${path.relative(process.cwd(), OUTPUT_DIR)}`);
  log("info", "");

  const reportItems: EnrichmentReportItem[] = [];
  let processedCount = 0;

  for (const filename of ictFiles) {
    const fullPath = path.join(SOURCE_DIR, filename);
    const content = await fs.readFile(fullPath, "utf8");
    const section = parseSectionFile(filename, content);

    const index = section.grade === "12" ? indexG12 : indexG11;
    const unitNum = Number.parseInt(section.unit, 10) || 1;

    // Match section with textbook
    const match = matchSectionToTextbook(section.title, section.content, unitNum, index);

    // Enrich section
    const enriched = enrichSection(
      {
        code: section.code,
        grade: section.grade,
        unit: section.unit,
        section: section.section,
        title: section.title,
      },
      section.content,
      match,
    );

    // Save enriched markdown document
    const outMarkdownPath = path.join(OUTPUT_DIR, `${section.code}.md`);
    await fs.writeFile(outMarkdownPath, enriched.markdown, "utf8");
    reportItems.push(enriched.reportItem);
    processedCount++;

    const pagesNote = match.matchedPageNumbers.length > 0 ? `(${match.pageRangeStr})` : "";
    log(
      "info",
      `  [${processedCount}/${ictFiles.length}] ✔ ${section.code} — ${section.title.slice(0, 40)} ${pagesNote}`,
    );
  }

  // Write CSV Report
  const csvReportPath = path.join(OUTPUT_DIR, "_enrichment_report.csv");
  await writeCsvReport(reportItems, csvReportPath);

  log("info", "");
  log("info", "══════════════════════════════════════════════════════════");
  log("info", `✅ Successfully enriched ${processedCount} sections!`);
  log("info", `📄 Enriched files written to: ${path.relative(process.cwd(), OUTPUT_DIR)}`);
  log("info", `📊 Summary report generated: ${path.relative(process.cwd(), csvReportPath)}`);
  log("info", "══════════════════════════════════════════════════════════");
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
