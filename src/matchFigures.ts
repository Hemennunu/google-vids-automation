/**
 * Assign textbook figures to ICT sections.
 *
 *   npm run figures:extract   # PDF → output/ict_figures/**.png + manifest.json
 *   npm run figures:match     # → section_figures.json + FIGURE_MAPPING.md (review)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { log } from "./googleVids.js";
import {
  FIGURES_DIR,
  type SectionFigure,
  assignFigures,
  loadFigures,
  loadIctSections,
  loadTextbookPages,
} from "./figures/figureMatcher.js";

async function main(): Promise<void> {
  const figures = await loadFigures();
  const sections = await loadIctSections();
  const pagesByGrade = new Map([
    ["11", await loadTextbookPages("11")],
    ["12", await loadTextbookPages("12")],
  ]);

  const assignments = assignFigures(figures, sections, pagesByGrade);

  const bySection: Record<string, SectionFigure[]> = {};
  for (const a of assignments) {
    if (!a.best) continue;
    (bySection[a.best.code] ??= []).push({ ...a.figure, score: a.best.score, matchedKeywords: a.best.matchedKeywords });
  }
  await fs.writeFile(path.join(FIGURES_DIR, "section_figures.json"), JSON.stringify(bySection, null, 2), "utf8");

  // Human review report (open in VS Code / any Markdown viewer to see thumbnails).
  const titles = new Map(sections.map((s) => [s.code, s.title]));
  const lines = [
    "# Textbook figures → ICT sections",
    "",
    `${assignments.filter((a) => a.best).length} of ${assignments.length} figures assigned to ${Object.keys(bySection).length} sections.`,
    "Check each section's figures; low scores and close runner-ups are the ones to double-check.",
    "",
  ];
  for (const code of Object.keys(bySection).sort()) {
    lines.push(`## ${code} — ${titles.get(code) ?? ""}`, "");
    for (const f of bySection[code]!) {
      const a = assignments.find((x) => x.figure === figures.find((y) => y.grade === f.grade && y.figure === f.figure));
      const close = a?.runnerUp && a.runnerUp.score >= f.score * 0.8 ? ` ⚠ close runner-up: ${a.runnerUp.code} (${a.runnerUp.score})` : "";
      lines.push(
        `- **Fig ${f.figure}** — ${f.caption} _(p${f.page}, score ${f.score}: ${f.matchedKeywords.join(", ") || "page text only"})_${close}`,
        `  <img src="${f.file}" height="110">`,
      );
    }
    lines.push("");
  }
  const unassigned = assignments.filter((a) => !a.best);
  if (unassigned.length) {
    lines.push("## Not assigned (no section matched well enough)", "");
    for (const a of unassigned) {
      lines.push(`- G${a.figure.grade} Fig ${a.figure.figure} — ${a.figure.caption} (p${a.figure.page}; best ${a.runnerUp ? "candidate below threshold" : "no candidate section"})`);
    }
  }
  const reportPath = path.join(FIGURES_DIR, "FIGURE_MAPPING.md");
  await fs.writeFile(reportPath, lines.join("\n") + "\n", "utf8");

  const ict11 = Object.keys(bySection).filter((c) => c.startsWith("ICT_G11")).length;
  const ict12 = Object.keys(bySection).filter((c) => c.startsWith("ICT_G12")).length;
  log("info", `${assignments.length - unassigned.length}/${assignments.length} figures assigned — G11: ${ict11} sections, G12: ${ict12} sections.`);
  log("info", `Mapping: ${path.join(FIGURES_DIR, "section_figures.json")}`);
  log("info", `Review report: ${reportPath}`);
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
