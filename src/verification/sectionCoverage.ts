/**
 * Coverage check of a FINISHED Vids draft against what the section must teach.
 *
 * Must-cover list, built automatically per ICT section:
 *  - Textbook: the section's sub-chapter (e.g. "2.1 Artificial Intelligence") →
 *    its sub-topic headings ("2.1.1 Branches of AI"), labelled items
 *    ("a. Machine Learning", "i. Online Shopping") and bulleted terms ("• Spam Detection:").
 *  - LMS: defined terms and key concepts from input/_source/<CODE>.txt.
 *
 * Draft side: every scene's on-screen text and narration (speaker notes), read
 * from the editor's model chunks on a fresh load.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "playwright";
import { extractKeywords } from "../lms/textbookMatcher.js";
import { FIGURES_DIR, type SectionFigure, titleTerms } from "../figures/figureMatcher.js";

const SOURCE_DIR = path.join(process.cwd(), "input", "_source");

export type Subchapter = { id: string; unit: number; title: string; text: string };
export type MustCoverItem = { item: string; source: "textbook" | "lms" };
export type CoverageItem = MustCoverItem & { covered: boolean; matched: string[] };

export type StockSummary = { total: number; ethiopiaOrAfrica: number; samples: string[] };

export type SectionCoverageReport = {
  code: string;
  draftUrl: string;
  subchapter?: string;
  scenes: number;
  textbook: { covered: number; total: number };
  lms: { covered: number; total: number };
  coveragePercent: number;
  missing: CoverageItem[];
  items: CoverageItem[];
  stock: StockSummary;
};

// ── Textbook outline ─────────────────────────────────────────────

/** Split textbook_G<grade>_ICT.txt into "n.m Title" sub-chapters (table-of-contents lines skipped). */
export async function loadSubchapters(grade: string): Promise<Subchapter[]> {
  const raw = await fs.readFile(path.join(SOURCE_DIR, `textbook_G${grade}_ICT.txt`), "utf8");
  const lines = raw.split(/\r?\n/);
  const subs: Subchapter[] = [];
  let current: { id: string; unit: number; title: string; start: number } | null = null;
  const flush = (end: number) => {
    if (current) subs.push({ ...current, text: lines.slice(current.start, end).join("\n") });
  };
  lines.forEach((line, i) => {
    const m = /^\s*(\d+)\.(\d+)\.?\s+([A-Z][^\n]{2,90}?)\s*$/.exec(line);
    if (m && !line.includes("...")) {
      flush(i);
      current = { id: `${m[1]}.${m[2]}`, unit: Number(m[1]), title: m[3]!.trim(), start: i };
    }
  });
  flush(lines.length);
  // Keep the longest body per id (the TOC entry, if matched, is tiny).
  const best = new Map<string, Subchapter>();
  for (const s of subs) if ((best.get(s.id)?.text.length ?? 0) < s.text.length) best.set(s.id, s);
  return [...best.values()];
}

/** Textbook sub-chapter for a section: via its matched figures, else by title overlap within the unit. */
export async function subchapterForSection(code: string, title: string, subs: Subchapter[]): Promise<Subchapter | undefined> {
  const unit = Number(/_U(\d+)_/.exec(code)?.[1]);
  try {
    const mapping = JSON.parse(await fs.readFile(path.join(FIGURES_DIR, "section_figures.json"), "utf8")) as Record<string, SectionFigure[]>;
    const viaFigure = mapping[code]?.[0]?.subchapter?.split(" ")[0];
    const hit = subs.find((s) => s.id === viaFigure);
    if (hit) return hit;
  } catch {
    // no figure mapping yet
  }
  const want = titleTerms(title);
  let best: { s: Subchapter; score: number } | undefined;
  for (const s of subs.filter((x) => x.unit === unit)) {
    // Sub-chapter title counts double; its sub-topic headings ("6.1.3 Loops",
    // "Relational Operators") catch sections named after a sub-topic.
    const titleScore = [...titleTerms(s.title)].filter((t) => want.has(t)).length * 2;
    const subTopicTerms = new Set(textbookItems(s).flatMap((i) => [...titleTerms(i)]));
    const score = titleScore + [...want].filter((t) => subTopicTerms.has(t)).length;
    if (score > 0 && (!best || score > best.score)) best = { s, score };
  }
  return best?.s;
}

/** Must-cover items from the sub-chapter body: n.m.k headings, labelled items, bulleted terms. */
export function textbookItems(sub: Subchapter): string[] {
  const items = new Set<string>();
  for (const raw of sub.text.split(/\r?\n/)) {
    const line = raw.replace(/\t/g, " ").trim();
    let m = /^\d+\.\d+\.\d+\.?\s+(.{3,70})$/.exec(line);
    if (!m) m = /^(?:[a-h]|[ivx]{1,4})\.\s+([A-Z][^.:]{2,50})$/.exec(line); // "a. Machine Learning", "iv. Surveillance"
    if (!m) m = /^[•●▪-]\s+([A-Z][^:]{2,40}):/.exec(line); // "• Spam Detection: …"
    if (m) items.add(m[1]!.trim().replace(/\s+/g, " "));
  }
  return [...items];
}

export type TextbookSide = { label?: string; items: string[]; text: string };

/**
 * What the textbook says a section must teach:
 *  - topic sections → their sub-chapter's sub-topics and items (+ its full text);
 *  - unit overviews / summaries → every sub-chapter of the unit (+ each one's opening).
 * Shared by the section document and the coverage check so both use one list.
 */
export async function textbookSideForSection(code: string, title: string): Promise<TextbookSide> {
  const grade = /^ICT_G(\d+)_/.exec(code)![1]!;
  const unit = Number(/_U(\d+)_/.exec(code)?.[1]);
  const subs = await loadSubchapters(grade);

  // Not "introduction": "Introduction to Information Systems" is a topic section.
  if (/overview|summary|^unit \d+/i.test(title)) {
    const unitSubs = subs.filter((s) => s.unit === unit).sort((a, b) => Number(a.id.split(".")[1]) - Number(b.id.split(".")[1]));
    if (unitSubs.length) {
      return {
        label: `Unit ${unit}: ${unitSubs.map((s) => s.id).join(", ")}`,
        items: unitSubs.map((s) => s.title),
        text: unitSubs.map((s) => `${s.id} ${s.title}\n${s.text.split(/\r?\n/).slice(1, 8).join(" ")}`).join("\n\n"),
      };
    }
  }
  const sub = await subchapterForSection(code, title, subs);
  return sub ? { label: `${sub.id} ${sub.title}`, items: textbookItems(sub), text: sub.text } : { items: [], text: "" };
}

/** Sentence subjects that are not concepts ("This is…", "It is…", "Students are…"). */
const LMS_TERM_STOP = /^(this|that|these|those|it|there|they|we|you|students?|learners?|each|every|one|another|such|both|many|most|some|which|what|here)\b/i;

/** Captures that ran into a verb clause, or organisation names. */
const LMS_TERM_NOISE = /\b(describes?|includes?|uses?|provides?|how|that|which|when|institute|organi[sz]ation|university|ministry)\b/i;

/** Must-cover items from the LMS source: defined terms, key concepts, table terms. */
export async function lmsItems(code: string): Promise<{ title: string; items: string[] }> {
  const raw = await fs.readFile(path.join(SOURCE_DIR, `${code}.txt`), "utf8");
  const title = (raw.split(/\r?\n/).find((l) => l.startsWith("# ")) ?? code).replace(/^#\s*(Section\s*[\d.]+:\s*)?(\d+\.\s*)?/i, "").trim();
  const items = new Map<string, string>(); // lower-case key → display form
  const add = (term: string) => {
    const t = term.replace(/\s+/g, " ").trim().replace(/^(the|a|an)\s+/i, "");
    const words = t.split(" ").length;
    if (t.length < 3 || words > 5 || LMS_TERM_STOP.test(t) || LMS_TERM_NOISE.test(t)) return;
    if (!items.has(t.toLowerCase())) items.set(t.toLowerCase(), t);
  };
  let block = "";
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("## ")) { block = line.slice(3).toLowerCase(); continue; }
    const t = line.trim();
    if (!t || /ethiopian context|examples/.test(block)) continue;
    if (/definitions|key concepts|table rows/.test(block)) {
      // "Term: definition" / "Term — definition" → the term.
      const term = /^([A-Z][\w()/ .’'-]{2,50}?)\s*[:—–]\s/.exec(t)?.[1];
      if (term) add(term);
    }
    // Terms the LMS defines inside its prose:
    //   "Machine learning (ML) …", "Natural Language Processing (NLP) …"
    for (const m of t.matchAll(/\b([A-Z]?[a-z]+(?:[ -][A-Za-z][a-z]+){0,4}) \(([A-Z][A-Za-z]{1,6})\)/g)) add(m[1]!);
    //   "Expert systems are …", "Algorithmic bias occurs when …", "Robotics is the branch …"
    for (const sentence of t.split(/(?<=[.!?])\s+/)) {
      const m = /^(?:In |With )?([A-Z][A-Za-z-]+(?: [a-zA-Z-]+){0,3}?) (?:is|are|refers to|occurs when|enables|describes|means)\b/.exec(sentence);
      if (m) add(m[1]!);
    }
  }
  return { title, items: [...items.values()].slice(0, 30) };
}

// ── Draft side ───────────────────────────────────────────────────

/** On-screen text + narration of every scene, plus stock media credits/search terms. */
export async function readDraftContent(page: Page): Promise<{ scenes: string[]; stock: string[] }> {
  const chunks = await page.evaluate(() =>
    Array.from(document.scripts).map((s) => s.textContent ?? "").filter((t) => t.includes("modelChunk")),
  );
  const scenes: string[] = [];
  const stock: string[] = [];
  for (const chunk of chunks) {
    if (!/\[\[12,"[^"]+",\d+/.test(chunk)) continue;
    const texts = [...chunk.matchAll(/\[15,"[^"]+",null,0,"((?:[^"\\]|\\.)*)"\]/g)].map((m) => m[1]!);
    scenes.push(texts.join(" / ").replace(/\\u([0-9a-f]{4})/gi, (_, h: string) => String.fromCharCode(Number.parseInt(h, 16))));
    for (const m of chunk.matchAll(/\[44,"[^"]+","[^"]*","((?:[^"\\]|\\.)+)"\]/g)) stock.push(m[1]!);
    for (const m of chunk.matchAll(/,182,"((?:[^"\\]|\\.){3,})"/g)) stock.push(`query: ${m[1]!}`);
  }
  return { scenes, stock };
}

// ── Matching ─────────────────────────────────────────────────────

export const stem = (w: string) => w.replace(/(ing|ies|es|s)$/, "");

export function isCovered(item: string, draftStems: Set<string>): { covered: boolean; matched: string[] } {
  const tokens = [...new Set(extractKeywords(item).map(stem))].filter((t) => t.length > 2);
  if (!tokens.length) return { covered: true, matched: [] };
  const matched = tokens.filter((t) => draftStems.has(t));
  // Short items (1–2 words) need every word; longer ones 60%.
  const needed = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * 0.6);
  return { covered: matched.length >= needed, matched };
}

const ETHIOPIA_AFRICA = /ethiopia|ethiopian|addis|amhar|afric|kenya|nigeria|ghana|rwanda|tanzania|uganda|black (?:man|woman|student|teacher|people|person)/i;

export function evaluateCoverage(
  code: string,
  draftUrl: string,
  subchapterLabel: string | undefined,
  textbook: string[],
  lms: string[],
  draft: { scenes: string[]; stock: string[] },
): SectionCoverageReport {
  const draftStems = new Set(extractKeywords(draft.scenes.join(" ")).map(stem));
  const items: CoverageItem[] = [
    ...textbook.map((item) => ({ item, source: "textbook" as const, ...isCovered(item, draftStems) })),
    ...lms.map((item) => ({ item, source: "lms" as const, ...isCovered(item, draftStems) })),
  ];
  const count = (src: "textbook" | "lms") => ({
    covered: items.filter((i) => i.source === src && i.covered).length,
    total: items.filter((i) => i.source === src).length,
  });
  // Judge Gemini's stock search terms (one per visual); fall back to credits if none recorded.
  const queries = draft.stock.filter((s) => s.startsWith("query: "));
  const visuals = queries.length ? queries : draft.stock;
  return {
    code,
    draftUrl,
    subchapter: subchapterLabel,
    scenes: draft.scenes.length,
    textbook: count("textbook"),
    lms: count("lms"),
    coveragePercent: items.length ? Math.round((items.filter((i) => i.covered).length / items.length) * 100) : 100,
    missing: items.filter((i) => !i.covered),
    items,
    stock: {
      total: visuals.length,
      ethiopiaOrAfrica: visuals.filter((s) => ETHIOPIA_AFRICA.test(s)).length,
      samples: draft.stock.slice(0, 12),
    },
  };
}

export function formatCoverageReport(r: SectionCoverageReport): string {
  const lines = [
    `# Coverage — ${r.code}`,
    "",
    `Draft: ${r.draftUrl}`,
    `Textbook sub-chapter: ${r.subchapter ?? "not found"}`,
    `Scenes: ${r.scenes}`,
    "",
    `**Overall: ${r.coveragePercent}%** — textbook items ${r.textbook.covered}/${r.textbook.total}, LMS items ${r.lms.covered}/${r.lms.total}`,
    "",
    "## Missing",
    ...(r.missing.length ? r.missing.map((m) => `- [${m.source}] ${m.item}`) : ["- (none)"]),
    "",
    "## All items",
    ...r.items.map((i) => `- ${i.covered ? "✓" : "✗"} [${i.source}] ${i.item}`),
    "",
    `## Stock media: ${r.stock.total} items, ${r.stock.ethiopiaOrAfrica} with Ethiopian/African subjects`,
    ...r.stock.samples.map((s) => `- ${s}`),
    "",
  ];
  return lines.join("\n");
}
