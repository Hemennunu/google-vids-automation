/**
 * Per-section source document for Storyboard (attached from Drive with "@").
 *
 *   1. MUST-COVER CHECKLIST — textbook sub-topics/items + LMS-defined terms
 *      (the same list the post-generation coverage check uses).
 *   2. LMS lesson text (verbatim, from input/_source/<CODE>.txt).
 *   3. Textbook sub-chapter text, without page headers, figure captions or
 *      "(See Figure 2.2)" references — the video has no textbook figures, so
 *      narration must not point at them.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import {
  type MustCoverItem,
  lmsItems,
  textbookSideForSection,
} from "../verification/sectionCoverage.js";

const SOURCE_DIR = path.join(process.cwd(), "input", "_source");
export const SECTION_DOCS_DIR = path.join(process.cwd(), "output", "section-docs");

export type SectionDocument = {
  code: string;
  title: string;
  subchapter?: string;
  mustCover: MustCoverItem[];
  docxPath: string;
  markdownPath: string;
  /** File name as it appears in Drive (and in the Storyboard "@" picker). */
  driveName: string;
};

/** Textbook text without running headers, page markers and figure references. */
export function cleanTextbookText(text: string): string {
  return text
    .split(/\r?\n/)
    .filter((l) => !/^## Page \d+/.test(l))
    .filter((l) => !/INFORMATION\s+TECHNOLOGY.*TEXTBOOK/i.test(l))
    .filter((l) => !/^UNIT[-\s]*\d+\b/.test(l.trim()))
    .filter((l) => !/^\s*(Figure|Fig\.)\s*\d+\.\d+/i.test(l))
    .join("\n")
    .replace(/\s*\((?:see\s+)?(?:also\s+)?fig(?:ure|\.)\s*\d+\.\d+\)/gi, "")
    .replace(/,?\s*(?:as\s+)?shown\s+in\s+fig(?:ure|\.)\s*\d+\.\d+,?/gi, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** LMS body without the "# Section…" title line and the "## Definition" diagram caption. */
async function lmsBody(code: string): Promise<string> {
  const raw = await fs.readFile(path.join(SOURCE_DIR, `${code}.txt`), "utf8");
  const out: string[] = [];
  let block = "";
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      block = line.slice(3).trim();
      if (!/^definition$/i.test(block)) out.push("", block.toUpperCase());
      continue;
    }
    if (/^definition$/i.test(block)) continue; // caption of the LMS diagram, not lesson content
    out.push(line);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export async function buildSectionDocument(code: string): Promise<SectionDocument> {
  const grade = /^ICT_G(\d+)_/.exec(code)?.[1];
  if (!grade) throw new Error(`Not an ICT section code: ${code}`);

  const { title, items: lms } = await lmsItems(code);
  const side = await textbookSideForSection(code, title);
  const textbook = side.items;
  const mustCover: MustCoverItem[] = [
    ...textbook.map((item) => ({ item, source: "textbook" as const })),
    ...lms
      .filter((t) => !textbook.some((x) => x.toLowerCase() === t.toLowerCase()))
      .map((item) => ({ item, source: "lms" as const })),
  ];
  const lmsText = await lmsBody(code);
  const textbookText = cleanTextbookText(side.text);

  const heading = `${code} — ${title}`;
  const md = [
    `# ${heading}`,
    "",
    `Grade ${grade} ICT (Ethiopian curriculum). Textbook sub-chapter: ${side.label ?? "none matched"}.`,
    "",
    "## MUST-COVER CHECKLIST (teach every item)",
    ...mustCover.map((m) => `- ${m.item}`),
    "",
    "## LMS LESSON (authoritative)",
    lmsText,
    "",
    ...(textbookText ? ["## TEXTBOOK CONTENT (authoritative)", textbookText, ""] : []),
  ].join("\n");

  const para = (text: string, bold = false) => new Paragraph({ children: [new TextRun({ text, bold })], spacing: { after: 80 } });
  const h = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } });
  const children: Paragraph[] = [
    new Paragraph({ text: heading, heading: HeadingLevel.TITLE }),
    para(`Grade ${grade} ICT (Ethiopian curriculum). Textbook sub-chapter: ${side.label ?? "none matched"}.`),
    h("MUST-COVER CHECKLIST (teach every item)"),
    ...mustCover.map((m) => para(`• ${m.item}`)),
    h("LMS LESSON (authoritative)"),
    ...lmsText.split(/\n+/).filter(Boolean).map((l) => para(l, /^[A-Z][A-Z ]+$/.test(l))),
    ...(textbookText ? [h("TEXTBOOK CONTENT (authoritative)"), ...textbookText.split(/\n+/).filter(Boolean).map((l) => para(l))] : []),
  ];

  await fs.mkdir(SECTION_DOCS_DIR, { recursive: true });
  const driveName = `${code}_section_source`;
  const docxPath = path.join(SECTION_DOCS_DIR, `${driveName}.docx`);
  const markdownPath = path.join(SECTION_DOCS_DIR, `${driveName}.md`);
  await fs.writeFile(docxPath, await Packer.toBuffer(new Document({ sections: [{ children }] })));
  await fs.writeFile(markdownPath, md, "utf8");

  return { code, title, subchapter: side.label, mustCover, docxPath, markdownPath, driveName };
}
