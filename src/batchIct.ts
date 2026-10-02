/**
 * ICT batch: one Storyboard video per section, Grade 11 and 12.
 *
 *   npm run chrome:debug                       # your own Chrome, signed in
 *   npm run batch:ict -- --grade=11 --unit=2 --limit=1 --dry-run
 *   npm run batch:ict -- --grade=all --limit=all
 *
 * Per section:
 *   1. Section document (must-cover checklist + LMS + textbook)  → output/section-docs/
 *   2. Upload it to Drive (skipped when this exact version was already uploaded)
 *   3. Storyboard: short instruction + "@" attached document → draft
 *   4. Export MP4 (output/ICT/G11/U02/<CODE>.mp4 and Drive)
 *   5. Coverage check of the finished draft → output/coverage/<CODE>.md
 * Progress: output/ict-batch-log.csv. Re-running skips sections marked "done".
 */
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { checkSectionCoverage } from "./checkCoverage.js";
import { cliFlag, cliValue } from "./cliArgs.js";
import { uploadToDrive } from "./drive/driveUpload.js";
import { OUTPUT_DIR, createExporter, parseExportMode } from "./export/index.js";
import { closeLaunchResult, launchBrowserViaCdp, log, runGoogleVidsDraftFlow } from "./googleVids.js";
import { buildSectionDocument } from "./lms/sectionDocument.js";
import { sectionStoryboardInstruction } from "./storyboardPrompt.js";

const SOURCE_DIR = path.join(process.cwd(), "input", "_source");
const LOG_PATH = path.join(OUTPUT_DIR, "ict-batch-log.csv");
const LOG_COLUMNS = [
  "timestamp", "code", "title", "status", "seconds", "editor_url",
  "coverage_pct", "textbook_items", "lms_items", "ethiopian_stock", "result", "error",
];
const MAX_CONSECUTIVE_FAILURES = 3;
const STOP_PATTERN =
  /sign-in|signin|session (may have )?expired|reached (your|the) (daily )?limit|usage limit|quota (exceeded|reached)|too many requests|try again tomorrow|not signed in/i;

/** Section kinds that get no video. */
const SKIP_TITLES =
  /learning objectives|interactive tools|heading links|semester exam|worked examples|key vocabulary|cambridge|\bmarks?\b|short answer|multiple choice|extended response|data response|true\s*\/\s*false|answer key|about this document|^assessment$/i;

type Section = { code: string; grade: string; unit: number; title: string };

async function listSections(grade: string | "all", unit?: number): Promise<Section[]> {
  const files = (await fs.readdir(SOURCE_DIR)).filter((f) => /^ICT_G1[12]_U\d+_S\d+\.txt$/.test(f));
  const sections: Section[] = [];
  const seenTitles = new Set<string>();
  for (const file of files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    const [, g, u] = /^ICT_G(\d+)_U(\d+)_/.exec(file)!;
    if (grade !== "all" && g !== grade) continue;
    if (unit !== undefined && Number(u) !== unit) continue;
    const firstLine = (await fs.readFile(path.join(SOURCE_DIR, file), "utf8")).split(/\r?\n/).find((l) => l.startsWith("# ")) ?? "";
    const title = firstLine.replace(/^#\s*(Section\s*[\d.]+:\s*)?(\d+\.?\s*)?/i, "").trim();
    if (SKIP_TITLES.test(title)) continue;
    // Some units have the same section twice ("Section 11: 8. Unit Summary" / "8 Unit Summary").
    const key = `${g}/${u}/${title.toLowerCase().replace(/[^a-z]+/g, " ").trim()}`;
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);
    sections.push({ code: file.replace(/\.txt$/, ""), grade: g!, unit: Number(u), title });
  }
  return sections;
}

const csv = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** One CSV line → cells (handles quoted cells containing commas, e.g. section titles). */
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { cells.push(cur); cur = ""; }
    else cur += ch;
  }
  cells.push(cur);
  return cells;
}

async function doneCodes(): Promise<Set<string>> {
  const text = await fs.readFile(LOG_PATH, "utf8").catch(() => "");
  return new Set(
    text.split(/\r?\n/).slice(1).filter(Boolean).map(parseCsvLine).filter((c) => c[3] === "done").map((c) => c[1]!),
  );
}

async function appendLog(row: Record<string, unknown>): Promise<void> {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const exists = await fs.access(LOG_PATH).then(() => true, () => false);
  await fs.appendFile(LOG_PATH, (exists ? "" : `${LOG_COLUMNS.join(",")}\n`) + LOG_COLUMNS.map((c) => csv(row[c])).join(",") + "\n", "utf8");
}

/** X.mp4 if free, else X_v2.mp4, X_v3.mp4 … — earlier versions are never overwritten. */
async function nextVersionPath(file: string): Promise<string> {
  const exists = (p: string) => fs.access(p).then(() => true, () => false);
  if (!(await exists(file))) return file;
  const { dir, name, ext } = path.parse(file);
  for (let v = 2; ; v++) {
    const candidate = path.join(dir, `${name}_v${v}${ext}`);
    if (!(await exists(candidate))) return candidate;
  }
}

/** Upload only if this exact document version has not been uploaded before. */
async function ensureUploaded(docxPath: string): Promise<boolean> {
  const hash = createHash("sha256").update(await fs.readFile(docxPath)).digest("hex").slice(0, 16);
  const marker = `${docxPath}.uploaded`;
  if ((await fs.readFile(marker, "utf8").catch(() => "")) === hash) return false;
  const launch = await launchBrowserViaCdp(undefined, { newPage: true });
  try {
    await uploadToDrive(launch.context, docxPath);
  } finally {
    await launch.page.close().catch(() => undefined);
    await closeLaunchResult(launch);
  }
  await fs.writeFile(marker, hash, "utf8");
  return true;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const grade = (cliValue(argv, "grade") ?? "all").replace(/^0/, "");
  const unitRaw = cliValue(argv, "unit");
  const limitRaw = cliValue(argv, "limit") ?? "1";
  const only = cliValue(argv, "sections")?.split(",").map((s) => s.trim());
  const dryRun = cliFlag(argv, "dry-run");
  // --redo: generate again even if done (new files get _v2, _v3… so earlier versions are kept).
  const redo = cliFlag(argv, "redo") || process.env.ICT_REDO === "1";
  const delaySec = Number.parseInt(cliValue(argv, "delay") ?? "30", 10);
  const limit = limitRaw === "all" ? Number.POSITIVE_INFINITY : Math.max(1, Number.parseInt(limitRaw, 10) || 1);
  if (!["11", "12", "all"].includes(grade)) throw new Error("--grade must be 11, 12 or all");

  let sections = await listSections(grade as "11" | "12" | "all", unitRaw ? Number(unitRaw) : undefined);
  if (only) sections = sections.filter((s) => only.includes(s.code));
  const done = await doneCodes();
  const queue = sections.filter((s) => redo || !done.has(s.code)).slice(0, limit);
  log("info", `ICT sections selected: ${sections.length} (${done.size} already done) — this run: ${queue.length}.`);

  if (dryRun) {
    for (const s of queue) {
      const doc = await buildSectionDocument(s.code);
      log("info", `  ${s.code} — ${s.title} | sub-chapter: ${doc.subchapter ?? "none"} | must-cover: ${doc.mustCover.length}`);
    }
    log("info", "Dry run — documents written to output/section-docs/, nothing uploaded or generated.");
    return;
  }

  const exporter = createExporter(parseExportMode(argv));
  let failures = 0;
  for (const [i, s] of queue.entries()) {
    log("info", `════ [${i + 1}/${queue.length}] ${s.code} — ${s.title} ════`);
    const started = Date.now();
    const row: Record<string, unknown> = { code: s.code, title: s.title };
    try {
      const doc = await buildSectionDocument(s.code);
      log("info", `Section document: ${doc.mustCover.length} must-cover items (sub-chapter: ${doc.subchapter ?? "none"}).`);
      if (await ensureUploaded(doc.docxPath)) await new Promise((r) => setTimeout(r, 15_000)); // let Drive index it for "@"

      const videoPath = await nextVersionPath(
        path.join(OUTPUT_DIR, "ICT", `G${s.grade}`, `U${String(s.unit).padStart(2, "0")}`, `${s.code}.mp4`),
      );
      const result = await runGoogleVidsDraftFlow({
        headless: false,
        useCdp: true,
        pauseAtEnd: false,
        slowMoMs: 0,
        videoFormat: "Landscape",
        scriptPath: doc.markdownPath,
        driveDocName: doc.driveName,
        driveDocPath: doc.docxPath,
        mustCoverItems: doc.mustCover.map((m) => m.item),
        storyboardInstruction: sectionStoryboardInstruction(s.grade, s.title),
        exporter,
        outputPath: videoPath,
      });
      row.editor_url = result.editorUrl;
      row.result = result.outputPath;
      if (!result.success) throw Object.assign(new Error(result.error ?? "Video flow failed"), { editorUrl: result.editorUrl });

      if (result.editorUrl) {
        const launch = await launchBrowserViaCdp(undefined, { newPage: true });
        try {
          const cov = await checkSectionCoverage(launch.page, s.code, result.editorUrl, path.parse(videoPath).name);
          Object.assign(row, {
            coverage_pct: cov.coveragePercent,
            textbook_items: `${cov.textbook.covered}/${cov.textbook.total}`,
            lms_items: `${cov.lms.covered}/${cov.lms.total}`,
            ethiopian_stock: `${cov.stock.ethiopiaOrAfrica}/${cov.stock.total}`,
          });
          log("info", `Coverage ${cov.coveragePercent}% (textbook ${row.textbook_items}, LMS ${row.lms_items}); Ethiopian/African stock ${row.ethiopian_stock}.`);
        } finally {
          await launch.page.close().catch(() => undefined);
          await closeLaunchResult(launch);
        }
      }
      row.status = "done";
      failures = 0;
    } catch (err) {
      row.status = "failed";
      row.error = err instanceof Error ? err.message : String(err);
      row.editor_url ??= (err as { editorUrl?: string }).editorUrl;
      failures++;
      log("error", `${s.code} failed: ${row.error}`);
    }
    row.timestamp = new Date().toISOString();
    row.seconds = Math.round((Date.now() - started) / 1000);
    await appendLog(row);

    if (row.status === "failed" && STOP_PATTERN.test(String(row.error))) {
      log("error", "Stopping: sign-in or usage-limit problem. Re-run the same command later to resume.");
      break;
    }
    if (failures >= MAX_CONSECUTIVE_FAILURES) {
      log("error", `Stopping: ${failures} failures in a row. See ${LOG_PATH} and screenshots/.`);
      break;
    }
    if (i < queue.length - 1 && delaySec > 0) await new Promise((r) => setTimeout(r, delaySec * 1000));
  }
  log("info", `ICT batch finished. Log: ${LOG_PATH}`);
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
