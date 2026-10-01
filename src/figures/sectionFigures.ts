/**
 * Read side of the figure pipeline: which textbook figures belong to a section.
 * Produced by `npm run figures:extract` + `npm run figures:match`.
 */
import fs from "node:fs";
import path from "node:path";
import { FIGURES_DIR, type SectionFigure } from "./figureMatcher.js";

export type SectionFigureFile = {
  figure: string;
  caption: string;
  page: number;
  subchapter?: string;
  /** Absolute path of the cropped PNG. */
  imagePath: string;
  widthPx: number;
  heightPx: number;
};

let cache: Record<string, SectionFigure[]> | null = null;

/** Figures for a section code like "ICT_G11_U02_S04" (empty if none or not built yet). */
export function getSectionFigures(code: string): SectionFigureFile[] {
  if (!cache) {
    const file = path.join(FIGURES_DIR, "section_figures.json");
    cache = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, SectionFigure[]>) : {};
  }
  return (cache[code] ?? [])
    .filter((f) => f.file && fs.existsSync(path.join(FIGURES_DIR, f.file)))
    .map((f) => ({
      figure: f.figure,
      caption: f.caption,
      page: f.page,
      subchapter: f.subchapter,
      imagePath: path.join(FIGURES_DIR, f.file!),
      widthPx: f.width_px ?? 800,
      heightPx: f.height_px ?? 600,
    }));
}

/** "input/_source/ICT_G11_U02_S04.txt (…)" → "ICT_G11_U02_S04". */
export function sectionCodeFromSource(source: string): string | null {
  return /ICT_G1[12]_U\d+_S\d+/.exec(source)?.[0] ?? null;
}
