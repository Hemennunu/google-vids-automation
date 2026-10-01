/**
 * Links textbook figures (output/ict_figures/manifest.json, produced by
 * scripts/extract_textbook_figures.py) to ICT LMS sections.
 *
 * "Figure 2.10" belongs to textbook Unit 2, and textbook units 1–6 line up with
 * LMS units 1–6, so a figure is only compared with sections of its own unit.
 * Within the unit, the figure goes to the section whose text best matches the
 * figure's caption (weighted ×3) and the textbook text on the figure's page.
 * Keywords common to many sections of the unit count less (IDF weighting).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { extractKeywords } from "../lms/textbookMatcher.js";

export const FIGURES_DIR = path.join(process.cwd(), "output", "ict_figures");
const SOURCE_DIR = path.join(process.cwd(), "input", "_source");

export type TextbookFigure = {
  grade: string;
  unit: number;
  figure: string;
  caption: string;
  page: number;
  /** Textbook sub-chapter the figure sits in, e.g. "2.2 Augmented Reality and Virtual Reality". */
  subchapter?: string;
  method: string;
  file?: string;
  width_px?: number;
  height_px?: number;
};

export type SectionFigure = TextbookFigure & { score: number; matchedKeywords: string[] };

export type IctSection = {
  code: string;
  grade: string;
  unit: number;
  title: string;
  keywords: Set<string>;
  /** Normalised title terms, compared with the figure's textbook sub-chapter heading. */
  titleTerms: Set<string>;
};

const CAPTION_WEIGHT = 3;
/** Textbook sub-chapter heading ↔ LMS section title: the strongest signal. */
const HEADING_WEIGHT = 12;

/**
 * Title terms: keywords with plurals folded, plus joined neighbours so "Big Data"
 * matches "Bigdata" and "Data Models" matches "Data Model".
 */
/** Textbook heading words ↔ LMS title words that mean the same thing (after plural folding). */
const TITLE_SYNONYMS: Record<string, string> = {
  basic: "fundamental",
  intro: "introduction",
  speedup: "speed",
};

export function titleTerms(text: string): Set<string> {
  // Drop a leading "2.2." / "Section 4: 1." numbering, then fold plurals.
  const words = extractKeywords(text.replace(/^(section\s*\d+:\s*)?(\d+(\.\d+)*\.?\s*)/i, ""))
    .map((w) => (w.length > 4 ? w.replace(/s$/, "") : w))
    .map((w) => TITLE_SYNONYMS[w] ?? w);
  const terms = new Set(words);
  for (let i = 0; i + 1 < words.length; i++) terms.add(words[i]! + words[i + 1]!);
  return terms;
}

export async function loadFigures(): Promise<TextbookFigure[]> {
  const raw = await fs.readFile(path.join(FIGURES_DIR, "manifest.json"), "utf8");
  return (JSON.parse(raw) as { figures: TextbookFigure[] }).figures.filter((f) => f.file);
}

/** input/_source/ICT_G11_U02_S04.txt → section with title + keyword set. */
export async function loadIctSections(): Promise<IctSection[]> {
  const files = (await fs.readdir(SOURCE_DIR)).filter((f) => /^ICT_G1[12]_U\d+_S\d+\.txt$/.test(f)).sort();
  const sections: IctSection[] = [];
  for (const file of files) {
    const [, grade, unit] = /^ICT_G(\d+)_U(\d+)_S\d+/.exec(file)!;
    const text = await fs.readFile(path.join(SOURCE_DIR, file), "utf8");
    const title = (text.split(/\r?\n/).find((l) => l.startsWith("# ")) ?? file).replace(/^#\s*(Section\s*\d+:\s*)?/i, "").trim();
    // Title words appear in the text too; repeat them so they also count via the set.
    sections.push({
      code: file.replace(/\.txt$/, ""),
      grade: grade!,
      unit: Number(unit),
      title,
      keywords: new Set(extractKeywords(`${title} ${title} ${text}`)),
      titleTerms: titleTerms(title),
    });
  }
  return sections;
}

/** Page text per page number from input/_source/textbook_G<grade>_ICT.txt. */
export async function loadTextbookPages(grade: string): Promise<Map<number, string>> {
  const raw = await fs.readFile(path.join(SOURCE_DIR, `textbook_G${grade}_ICT.txt`), "utf8").catch(() => "");
  const pages = new Map<number, string>();
  for (const chunk of raw.split(/^## Page /m).slice(1)) {
    const n = Number.parseInt(chunk, 10);
    if (Number.isFinite(n)) pages.set(n, chunk.slice(String(n).length));
  }
  return pages;
}

export type FigureAssignment = {
  figure: TextbookFigure;
  best?: { code: string; title: string; score: number; matchedKeywords: string[] };
  runnerUp?: { code: string; score: number };
};

/**
 * Core teaching sections only (the numbered topic sections). Overviews, summaries,
 * worked examples, practicals and extensions reuse topics rather than introduce
 * them, and the excluded types never get videos.
 */
const NON_CORE_TITLES =
  /unit overview|objectives|worked examples|practical|cambridge|summary|heading links|interactive|semester|key vocabulary|^unit \d+:/i;
/** Unit-level intro section; receives the figures of units whose topic sections are missing in the LMS. */
const UNIT_INTRO_TITLES = /unit overview|^unit \d+: (?!learning objectives)/i;

const sectionNumber = (code: string) => Number(/_S(\d+)$/.exec(code)?.[1] ?? 0);
const figureOrder = (f: TextbookFigure) => Number(f.figure.split(".")[1]);

type Scored = { code: string; title: string; score: number; matchedKeywords: string[] };

/**
 * Within a unit, textbook figures run in chapter order and the LMS core sections
 * follow the same order. Assign each figure a section such that figure order and
 * section order agree (non-decreasing), maximising the total keyword score
 * (dynamic programming). Strong matches pin the boundaries; weak figures in
 * between ("Chatbot") follow their neighbours.
 */
export function assignFigures(
  figures: TextbookFigure[],
  sections: IctSection[],
  pagesByGrade: Map<string, Map<number, string>>,
): FigureAssignment[] {
  const results: FigureAssignment[] = [];
  const units = new Map<string, TextbookFigure[]>();
  for (const f of figures) {
    const key = `${f.grade}/${f.unit}`;
    (units.get(key) ?? units.set(key, []).get(key)!).push(f);
  }

  for (const unitFigures of units.values()) {
    const { grade, unit } = unitFigures[0]!;
    unitFigures.sort((a, b) => figureOrder(a) - figureOrder(b));
    const core = sections
      .filter((s) => s.grade === grade && s.unit === unit && !NON_CORE_TITLES.test(s.title))
      .sort((a, b) => sectionNumber(a.code) - sectionNumber(b.code));
    if (!core.length) {
      // The LMS has no topic sections for this unit: use the unit overview video.
      const intro = sections
        .filter((s) => s.grade === grade && s.unit === unit && UNIT_INTRO_TITLES.test(s.title))
        .sort((a, b) => sectionNumber(a.code) - sectionNumber(b.code))[0];
      for (const figure of unitFigures) {
        results.push({
          figure,
          best: intro && { code: intro.code, title: intro.title, score: 0, matchedKeywords: ["fallback: unit has no LMS topic sections"] },
        });
      }
      continue;
    }

    // IDF over this unit's core sections: a word in every section says little.
    const df = new Map<string, number>();
    for (const s of core) for (const k of s.keywords) df.set(k, (df.get(k) ?? 0) + 1);
    const idf = (k: string) => Math.log(1 + core.length / (df.get(k) ?? core.length));

    const matrix: Scored[][] = unitFigures.map((figure) => {
      const captionKeys = extractKeywords(figure.caption);
      const headingTerms = figure.subchapter ? [...titleTerms(figure.subchapter)] : [];
      const pageKeys = extractKeywords(pagesByGrade.get(figure.grade)?.get(figure.page) ?? "");
      return core.map((s) => {
        const matched: string[] = [];
        let score = 0;
        for (const k of headingTerms) if (s.titleTerms.has(k)) { score += HEADING_WEIGHT; matched.push(`§${k}`); }
        for (const k of captionKeys) if (s.keywords.has(k)) { score += CAPTION_WEIGHT * idf(k); matched.push(k); }
        for (const k of pageKeys) if (s.keywords.has(k)) score += idf(k) / 4;
        return { code: s.code, title: s.title, score: Math.round(score * 100) / 100, matchedKeywords: matched };
      });
    });

    // Figures of one textbook sub-chapter move together: one DP item per run of
    // consecutive figures with the same sub-chapter, scored as the sum of members.
    const groups: number[][] = [];
    unitFigures.forEach((f, i) => {
      const last = groups[groups.length - 1];
      if (last && f.subchapter && unitFigures[last[0]!]!.subchapter === f.subchapter) last.push(i);
      else groups.push([i]);
    });
    const groupScore = groups.map((g) => core.map((_, j) => g.reduce((sum, i) => sum + matrix[i]![j]!.score, 0)));

    // best[g][j]: max total score for groups 0..g with group g in section j.
    const n = groups.length;
    const m = core.length;
    const best: number[][] = Array.from({ length: n }, () => new Array<number>(m).fill(-Infinity));
    const from: number[][] = Array.from({ length: n }, () => new Array<number>(m).fill(0));
    for (let j = 0; j < m; j++) best[0]![j] = groupScore[0]![j]!;
    for (let g = 1; g < n; g++) {
      let runMax = -Infinity;
      let runArg = 0;
      for (let j = 0; j < m; j++) {
        if (best[g - 1]![j]! > runMax) { runMax = best[g - 1]![j]!; runArg = j; }
        best[g]![j] = runMax + groupScore[g]![j]!;
        from[g]![j] = runArg;
      }
    }
    const groupChoice = new Array<number>(n);
    groupChoice[n - 1] = best[n - 1]!.indexOf(Math.max(...best[n - 1]!));
    for (let g = n - 1; g > 0; g--) groupChoice[g - 1] = from[g]![groupChoice[g]!]!;
    const chosen = new Array<number>(unitFigures.length);
    groups.forEach((members, g) => members.forEach((i) => (chosen[i] = groupChoice[g]!)));

    unitFigures.forEach((figure, i) => {
      const pick = matrix[i]![chosen[i]!]!;
      const alt = [...matrix[i]!].sort((a, b) => b.score - a.score).find((s) => s.code !== pick.code);
      results.push({
        figure,
        best: pick,
        runnerUp: alt ? { code: alt.code, score: alt.score } : undefined,
      });
    });
  }
  return results;
}
