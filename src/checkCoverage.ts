/**
 * Check a finished Vids draft against everything its ICT section must teach.
 *
 *   npm run chrome:debug
 *   npm run coverage:draft -- --section=ICT_G11_U02_S04 --draft=https://docs.google.com/videos/d/<id>/edit
 *
 * Writes output/coverage/<CODE>.md and .json.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { cliValue } from "./cliArgs.js";
import { closeLaunchResult, launchBrowserViaCdp, log, waitForVidsEditor } from "./googleVids.js";
import {
  type SectionCoverageReport,
  evaluateCoverage,
  formatCoverageReport,
  lmsItems,
  readDraftContent,
  textbookSideForSection,
} from "./verification/sectionCoverage.js";
import type { Page } from "playwright";

export const COVERAGE_DIR = path.join(process.cwd(), "output", "coverage");

/** Reusable from the batch: page must be able to open the draft URL. */
export async function checkSectionCoverage(page: Page, code: string, draftUrl: string): Promise<SectionCoverageReport> {
  if (!/^ICT_G1[12]_/.test(code)) throw new Error(`Not an ICT section code: ${code}`);
  const { title, items: lms } = await lmsItems(code);
  const side = await textbookSideForSection(code, title);

  await page.goto(draftUrl.replace(/[?#].*$/, ""), { waitUntil: "domcontentloaded" });
  await waitForVidsEditor(page);
  const draft = await readDraftContent(page);

  const report = evaluateCoverage(code, draftUrl, side.label, side.items, lms, draft);
  await fs.mkdir(COVERAGE_DIR, { recursive: true });
  await fs.writeFile(path.join(COVERAGE_DIR, `${code}.json`), JSON.stringify(report, null, 2), "utf8");
  await fs.writeFile(path.join(COVERAGE_DIR, `${code}.md`), formatCoverageReport(report), "utf8");
  return report;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const code = cliValue(argv, "section");
  const draft = cliValue(argv, "draft");
  if (!code || !draft) throw new Error("Usage: npm run coverage:draft -- --section=ICT_G11_U02_S04 --draft=<Vids URL>");

  const launch = await launchBrowserViaCdp(undefined, { newPage: true });
  try {
    const r = await checkSectionCoverage(launch.page, code, draft);
    log("info", `${code}: ${r.coveragePercent}% — textbook ${r.textbook.covered}/${r.textbook.total}, LMS ${r.lms.covered}/${r.lms.total}, ${r.scenes} scenes (sub-chapter: ${r.subchapter ?? "none"})`);
    if (r.missing.length) log("info", `Missing: ${r.missing.map((m) => m.item).join("; ")}`);
    log("info", `Stock media: ${r.stock.total}, Ethiopian/African: ${r.stock.ethiopiaOrAfrica}`);
    log("info", `Report: ${path.join(COVERAGE_DIR, `${code}.md`)}`);
  } finally {
    await launch.page.close().catch(() => undefined);
    await closeLaunchResult(launch);
  }
}

if (process.argv[1] && /checkCoverage\.ts$/.test(process.argv[1])) {
  main().catch((err: unknown) => {
    log("error", err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
}
