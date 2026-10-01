/**
 * MyMarian LMS sections → Storyboard briefs.
 *
 *   SharePoint (or a locally synced copy)
 *     Subject/Grade/Unit/Section_NN_Type/content_LMS.htm
 *   → input/<CODE>.txt          brief fed to Storyboard (e.g. BIO_G09_U01_S01.txt)
 *   → input/_source/<CODE>.txt  full extracted text, for review
 *
 * Also supports OCR-sourced briefs:
 *   npm run ocr -- --input=textbook.pdf   → input/<name>.txt  (OCR output)
 *   prepareOcrBrief()                     → input/<name>_brief.txt  (video brief)
 *
 * No Google login is involved; this only reads the LMS content.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { type Browser, type Page, chromium } from "playwright";
import { ensureDir, log } from "../googleVids.js";

export const INPUT_DIR = path.join(process.cwd(), "input");
const SOURCE_DIR = path.join(INPUT_DIR, "_source");
export const LOCAL_CONFIG_PATH = path.join(process.cwd(), "sharepoint.local.json");

/** Marker written by `npm run ocr` at the top of every output file. */
const OCR_HEADER_MARKER = "# OCR Output";

/** Upper bound on source text inside the brief; keeps the Storyboard prompt focused. */
const MAX_SOURCE_CHARS = 2_500;
/** Per-paragraph budget when condensing the lesson text. */
const MAX_PARAGRAPH_CHARS = 450;
/** The lead paragraph and Ethiopian callouts carry the named places/species — keep more of them. */
const MAX_LOCAL_CONTEXT_CHARS = 900;
/** Vocabulary tables can be long; a 1–2 minute video covers ~20 terms at most. */
const MAX_TABLE_ROWS = 20;
/** Total budget across all Ethiopian-context callouts / example boxes. */
const MAX_CALLOUTS_TOTAL_CHARS = 1_200;

/** Target narrated length per section archetype (the part after Section_NN_). */
const TARGET_LENGTH: Record<string, string> = {
  Intro: "About 1–2 minutes when narrated",
  Unit_Overview: "About 1–2 minutes when narrated",
  Learning_Objectives: "About 1 minute when narrated",
  Key_Vocabulary: "About 1–2 minutes when narrated",
  Main_Lesson_Content: "About 3–4 minutes when narrated",
  Worked_Examples: "About 2–3 minutes when narrated",
  Practical_Investigation: "About 2–3 minutes when narrated",
  Cambridge_IGCSE_Extension: "About 2 minutes when narrated",
  Unit_Summary: "About 1–2 minutes when narrated",
};

export type SectionId = {
  subject: string;
  grade: string;
  unit: string;
  section: string;
};

type Extracted = {
  title: string;
  definition: string | null;
  lead: string | null;
  paragraphs: string[];
  ethiopianContext: string[];
  keyConcepts: string[];
  definitions: string[];
  examples: string[];
  listItems: string[];
  tableRows: string[];
};

export type SourceConfig = { shareUrl?: string; localRoot?: string };

export async function readSourceConfig(overrides: SourceConfig = {}): Promise<SourceConfig> {
  let file: SourceConfig = {};
  try {
    file = JSON.parse(await fs.readFile(LOCAL_CONFIG_PATH, "utf8")) as SourceConfig;
  } catch {
    // no local config
  }
  return {
    localRoot: overrides.localRoot ?? file.localRoot,
    shareUrl: overrides.shareUrl ?? process.env.SHAREPOINT_SHARE_URL ?? file.shareUrl,
  };
}

/** "Biology/Grade 09/Unit 01 - Introduction To Biology/Section_01_Intro" */
export function parseSectionPath(raw: string): SectionId {
  const parts = raw.replace(/\\/g, "/").split("/").filter(Boolean);
  if (parts.length !== 4) {
    throw new Error(
      `--section must be Subject/Grade/Unit/Section (4 parts), got ${parts.length}: "${raw}"`,
    );
  }
  const [subject, grade, unit, section] = parts as [string, string, string, string];
  return { subject, grade, unit, section };
}

export function sectionRelPath(id: SectionId): string {
  return [id.subject, id.grade, id.unit, id.section].join("/");
}

/** Same scheme as _VideoGen/MASTER_T2V_PROMPT.md: SUB_Gnn_Unn_Snn */
export function sectionCode({ subject, grade, unit, section }: SectionId): string {
  const num = (s: string, re: RegExp) => {
    const m = re.exec(s);
    if (!m?.[1]) throw new Error(`Cannot read number from "${s}"`);
    return m[1].padStart(2, "0");
  };
  const sub = subject.slice(0, 3).toUpperCase();
  return `${sub}_G${num(grade, /(\d+)/)}_U${num(unit, /unit\s*(\d+)/i)}_S${num(section, /section_(\d+)/i)}`;
}

export function sectionType(section: string): string {
  return section.replace(/^section_\d+_/i, "");
}

/** tsx/esbuild injects __name() into functions passed to page.evaluate; define it in the page. */
async function shimEsbuildHelpers(page: Page): Promise<void> {
  await page.evaluate("globalThis.__name = globalThis.__name || ((fn) => fn)");
}

/**
 * Read access to the LMS library, via the anonymous SharePoint sharing link
 * (REST calls made from inside a headless page holding the guest cookie) or a
 * locally synced folder. Also owns a blank page used for HTML parsing.
 */
export class LmsSource {
  private constructor(
    private readonly browser: Browser,
    private readonly parserPage: Page,
    private readonly sharePage: Page | null,
    private readonly libraryRoot: string | null,
    private readonly localRoot: string | null,
  ) {}

  static async open(config: SourceConfig): Promise<LmsSource> {
    if (!config.localRoot && !config.shareUrl) {
      throw new Error(
        `No source configured. Set "shareUrl" or "localRoot" in ${LOCAL_CONFIG_PATH}, or pass --share-url= / --local-root=`,
      );
    }
    const browser = await chromium.launch({ headless: true });
    const parserPage = await browser.newPage();

    if (config.localRoot) {
      return new LmsSource(browser, parserPage, null, null, config.localRoot);
    }

    const sharePage = await browser.newPage();
    log("info", "Opening SharePoint sharing link…");
    await sharePage.goto(config.shareUrl!, { waitUntil: "domcontentloaded" });
    await sharePage.waitForURL(/[?&]id=/, { timeout: 60_000 });
    // The redirect lands on AllItems.aspx?id=/<site>/<library>/<folder>
    const libraryRoot = new URL(sharePage.url()).searchParams.get("id");
    if (!libraryRoot) {
      await browser.close();
      throw new Error(`Could not determine library root from ${sharePage.url()}`);
    }
    await shimEsbuildHelpers(sharePage);
    return new LmsSource(browser, parserPage, sharePage, libraryRoot, null);
  }

  async close(): Promise<void> {
    await this.browser.close().catch(() => undefined);
  }

  private async rest(apiPath: string): Promise<{ status: number; body: string }> {
    return this.sharePage!.evaluate(async (url) => {
      const res = await fetch(url, { headers: { Accept: "application/json;odata=nometadata" } });
      return { status: res.status, body: await res.text() };
    }, apiPath);
  }

  private serverPath(relPath: string): string {
    return `${this.libraryRoot}/${relPath}`.replace(/'/g, "''");
  }

  /** Sub-folder names of relPath ("" = library root), sorted by name. */
  async listFolders(relPath: string): Promise<string[]> {
    let names: string[];
    if (this.localRoot) {
      const entries = await fs.readdir(path.join(this.localRoot, ...relPath.split("/").filter(Boolean)), {
        withFileTypes: true,
      });
      names = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    } else {
      const folder = this.serverPath(relPath).replace(/\/$/, "");
      const res = await this.rest(
        `/_api/web/GetFolderByServerRelativeUrl('${encodeURIComponent(folder)}')/Folders?$select=Name`,
      );
      if (res.status !== 200) {
        throw new Error(`SharePoint returned HTTP ${res.status} listing "${relPath}"`);
      }
      names = (JSON.parse(res.body) as { value: Array<{ Name: string }> }).value.map((f) => f.Name);
    }
    return names.filter((n) => n !== "Forms").sort((a, b) => a.localeCompare(b));
  }

  /** content_LMS.htm for a section, or null if the section has none. */
  async readSectionHtml(relPath: string): Promise<string | null> {
    if (this.localRoot) {
      const file = path.join(this.localRoot, ...relPath.split("/"), "content_LMS.htm");
      return fs.readFile(file, "utf8").catch(() => null);
    }
    const file = this.serverPath(`${relPath}/content_LMS.htm`);
    const res = await this.sharePage!.evaluate(async (url) => {
      const r = await fetch(url);
      return { status: r.status, body: await r.text() };
    }, `/_api/web/GetFileByServerRelativeUrl('${encodeURIComponent(file)}')/$value`);
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200) {
      throw new Error(`SharePoint returned HTTP ${res.status} for ${relPath}/content_LMS.htm`);
    }
    return res.body;
  }

  /**
   * DOM-based extraction of the lesson text. Keeps the parts the MyMarian
   * master prompt lists as authoritative (.mm-lead, <p>, .eth-context,
   * .definition, .key-concept, .example-box, tables) and drops page chrome.
   */
  async extract(html: string): Promise<Extracted> {
    await shimEsbuildHelpers(this.parserPage);
    return this.parserPage.evaluate((source) => {
      const doc = new DOMParser().parseFromString(source, "text/html");
      const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
      const texts = (sel: string) =>
        Array.from(doc.querySelectorAll(sel))
          .map((e) => clean(e.textContent))
          .filter(Boolean);

      const title =
        clean(doc.querySelector(".mm-visual-hero h2")?.textContent) ||
        clean(doc.querySelector("h1, h2")?.textContent) ||
        clean(doc.title);
      const definition = clean(doc.querySelector(".mm-diagram-card p")?.textContent) || null;
      const lead = clean(doc.querySelector(".mm-lead")?.textContent) || null;

      // Remove chrome and callouts so the remaining <p> are the lesson body.
      doc
        .querySelectorAll(
          "style, script, nav, .mm-visual-hero, .mm-lesson-map, .mm-learning-boost, .completion-banner",
        )
        .forEach((e) => e.remove());

      const ethiopianContext = texts(".eth-context").map((t) =>
        t.replace(/^ethiopian context:\s*/i, ""),
      );
      const keyConcepts = texts(".key-concept");
      const definitions = texts(".definition");
      const examples = texts(".example-box");

      const inCallout = (e: Element) =>
        Boolean(e.closest(".eth-context, .key-concept, .definition, .example-box, .mm-lead"));
      const paragraphs = Array.from(doc.body.querySelectorAll("p"))
        .filter((p) => !inCallout(p) && !p.classList.contains("mm-lead"))
        .map((p) => clean(p.textContent))
        .filter((t) => t.length > 40);
      const listItems = Array.from(doc.body.querySelectorAll("li"))
        .filter((li) => !inCallout(li))
        .map((li) => clean(li.textContent))
        .filter(Boolean);
      // Data rows only (skip header rows made of <th>), cells joined as "A: B".
      const tableRows = Array.from(doc.body.querySelectorAll("tr"))
        .filter((tr) => !inCallout(tr) && tr.querySelector("td"))
        .map((tr) =>
          Array.from(tr.querySelectorAll("td, th"))
            .map((c) => clean(c.textContent))
            .filter(Boolean)
            .join(": "),
        )
        .filter(Boolean);

      return {
        title,
        definition,
        lead,
        paragraphs,
        ethiopianContext,
        keyConcepts,
        definitions,
        examples,
        listItems,
        tableRows,
      };
    }, html);
  }
}

/** Whole sentences from the start of text, up to maxChars. */
function leadingSentences(text: string, maxChars: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    if (out && out.length + s.length > maxChars) break;
    out += s;
  }
  return out.trim();
}

/** Condense each item, then keep items in order while the total fits the budget. */
function withinBudget(items: string[], perItem: number, total: number): string[] {
  const out: string[] = [];
  let used = 0;
  for (const item of items) {
    const piece = leadingSentences(item, perItem);
    if (out.length && used + piece.length > total) break;
    out.push(piece);
    used += piece.length;
  }
  return out;
}

function buildBrief(id: SectionId, x: Extracted): string {
  const type = sectionType(id.section);
  const gradeNum = Number.parseInt(/(\d+)/.exec(id.grade)?.[1] ?? "", 10);
  const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");

  // Condensed lesson body, in source order, within MAX_SOURCE_CHARS.
  const body: string[] = [];
  let used = 0;
  for (const p of [x.lead, ...x.paragraphs].filter((p): p is string => Boolean(p))) {
    const piece = leadingSentences(p, p === x.lead ? MAX_LOCAL_CONTEXT_CHARS : MAX_PARAGRAPH_CHARS);
    if (used + piece.length > MAX_SOURCE_CHARS) break;
    body.push(piece);
    used += piece.length;
  }

  const lines: string[] = [
    `Create a short educational video for Grade ${gradeNum} ${id.subject} students in Ethiopia (MyMarian learning platform).`,
    "",
    `Topic: ${x.title}`,
    `Unit: ${id.unit}`,
    `Section: ${type.replace(/_/g, " ")}`,
  ];

  if (x.definition) {
    lines.push("", `Key idea: ${x.definition}`);
  }
  // Lists are the main content on summary/objective pages, or when a page has no paragraphs.
  if (x.listItems.length && (/objective|vocabulary|summary|overview/i.test(type) || body.length === 0)) {
    lines.push("", "Points to cover:", bullets(x.listItems.slice(0, 8)));
  }
  if (x.definitions.length) {
    lines.push("", "Key definitions:", bullets(x.definitions.slice(0, 5)));
  }
  if (x.keyConcepts.length) {
    lines.push("", "Key concepts:", bullets(x.keyConcepts.slice(0, 5)));
  }
  if (x.tableRows.length) {
    lines.push(
      "",
      "Terms and facts to cover (from the lesson table — use these exact definitions):",
      bullets(x.tableRows.slice(0, MAX_TABLE_ROWS)),
    );
  }

  if (body.length) {
    lines.push(
      "",
      "Lesson content (authoritative — stay accurate and do not add facts beyond it):",
      body.join("\n\n"),
    );
  }

  if (x.ethiopianContext.length) {
    lines.push(
      "",
      "Ethiopian context to feature (use these specific places, species and initiatives, not generic African imagery):",
      bullets(withinBudget(x.ethiopianContext, MAX_LOCAL_CONTEXT_CHARS, MAX_CALLOUTS_TOTAL_CHARS)),
    );
  }
  if (x.examples.length) {
    lines.push("", "Examples to use:", bullets(withinBudget(x.examples, 400, MAX_CALLOUTS_TOTAL_CHARS / 2)));
  }

  lines.push(
    "",
    "Tone: Clear, warm and encouraging, suitable for secondary-school students. Use simple language.",
    `Target length: ${TARGET_LENGTH[type] ?? "About 2 minutes when narrated"}.`,
    "",
    "Do not include quiz questions; focus on explaining the ideas above.",
  );

  return lines.join("\n") + "\n";
}

function fullSourceText(x: Extracted): string {
  const block = (title: string, items: string[]) =>
    items.length ? [`## ${title}`, ...items, ""] : [];
  return [
    `# ${x.title}`,
    "",
    ...block("Definition", x.definition ? [x.definition] : []),
    ...block("Lead", x.lead ? [x.lead] : []),
    ...block("Paragraphs", x.paragraphs),
    ...block("Ethiopian context", x.ethiopianContext),
    ...block("Definitions", x.definitions),
    ...block("Key concepts", x.keyConcepts),
    ...block("Examples", x.examples),
    ...block("List items", x.listItems),
    ...block("Table rows", x.tableRows),
  ].join("\n\n");
}

export type PreparedBrief = { code: string; briefPath: string; words: number };

/** Reads one section and writes its brief. Null when the section has no usable lesson text. */
export async function prepareBrief(source: LmsSource, id: SectionId): Promise<PreparedBrief | null> {
  const relPath = sectionRelPath(id);
  const code = sectionCode(id);

  const html = await source.readSectionHtml(relPath);
  if (!html) {
    log("warn", `${code}: no content_LMS.htm in ${relPath} — skipping.`);
    return null;
  }

  const extracted = await source.extract(html);
  if (
    !extracted.lead &&
    extracted.paragraphs.length === 0 &&
    extracted.tableRows.length === 0 &&
    extracted.listItems.length === 0
  ) {
    log("warn", `${code}: no lesson text found in ${relPath}/content_LMS.htm — skipping.`);
    return null;
  }

  await ensureDir(SOURCE_DIR);
  const briefPath = path.join(INPUT_DIR, `${code}.txt`);
  const brief = buildBrief(id, extracted);
  await fs.writeFile(briefPath, brief, "utf8");
  await fs.writeFile(path.join(SOURCE_DIR, `${code}.txt`), fullSourceText(extracted), "utf8");

  const words = brief.split(/\s+/).filter(Boolean).length;
  log("info", `${code}: brief written (${words} words) → ${briefPath}`);
  return { code, briefPath, words };
}

// ── OCR-sourced briefs ─────────────────────────────────────────────────────────

/**
 * Scan input/ for `.txt` files produced by `npm run ocr`.
 * OCR files start with the `# OCR Output` header marker.
 * Returns full paths to all OCR output files found.
 */
export async function listOcrInputs(): Promise<string[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(INPUT_DIR);
  } catch {
    return [];
  }
  const results: string[] = [];
  for (const name of entries) {
    if (!name.endsWith(".txt")) continue;
    // Skip files that already look like briefs (_brief.txt) or are in _source/
    if (name.endsWith("_brief.txt")) continue;
    const fullPath = path.join(INPUT_DIR, name);
    try {
      // Only read the first line to check for the marker (fast).
      const handle = await fs.open(fullPath, "r");
      const buf = Buffer.alloc(64);
      await handle.read(buf, 0, 64, 0);
      await handle.close();
      if (buf.toString("utf8").trimStart().startsWith(OCR_HEADER_MARKER)) {
        results.push(fullPath);
      }
    } catch {
      // unreadable — skip
    }
  }
  return results.sort();
}

/**
 * Build a video-generation brief from a raw OCR output file.
 *
 * The OCR file is the plain `.txt` produced by `npm run ocr`; it may contain
 * page-break markers inserted by `parsePdf`. This function:
 *   1. Strips the `# OCR Output` metadata header.
 *   2. Joins and cleans the raw text.
 *   3. Wraps it in a standard brief prompt.
 *   4. Writes `input/<stem>_brief.txt` (ready for `npm run start`).
 *
 * @param ocrFilePath  Absolute path to the OCR output .txt file.
 * @param topic        Human-readable topic / title for the video prompt.
 * @param grade        Optional grade label, e.g. "11" (defaults to "secondary school").
 * @param subject      Optional subject label, e.g. "ICT" (defaults to "General").
 * @returns            PreparedBrief or null if the file is empty / unreadable.
 */
export async function prepareOcrBrief(
  ocrFilePath: string,
  topic: string,
  grade?: string,
  subject?: string,
): Promise<PreparedBrief | null> {
  const stem = path.basename(ocrFilePath, ".txt");
  const code = stem.replace(/[^\w]/g, "_").toUpperCase();

  let raw: string;
  try {
    raw = await fs.readFile(ocrFilePath, "utf8");
  } catch {
    log("warn", `prepareOcrBrief: cannot read ${ocrFilePath}`);
    return null;
  }

  // Strip the metadata header block (lines starting with #) at the top of the file.
  const lines = raw.split(/\r?\n/);
  let contentStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#") || lines[i].trim() === "") {
      contentStart = i + 1;
    } else {
      break;
    }
  }
  const bodyLines = lines.slice(contentStart);

  // Remove page-break markers inserted by parsePdf.
  const cleanedText = bodyLines
    .join("\n")
    .replace(/^--- Page Break ---$/gm, "")
    .replace(/^## Page \d+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleanedText.length < 50) {
    log("warn", `prepareOcrBrief: ${stem} appears empty after stripping header — skipping.`);
    return null;
  }

  // Truncate the raw body to the budget so the prompt stays focused.
  const snippet =
    cleanedText.length > MAX_SOURCE_CHARS
      ? leadingSentences(cleanedText, MAX_SOURCE_CHARS)
      : cleanedText;

  const gradeLabel = grade ? `Grade ${grade}` : "Secondary school";
  const subjectLabel = subject ?? "General";

  const brief = [
    `Create a short educational video for ${gradeLabel} ${subjectLabel} students in Ethiopia (MyMarian learning platform).`,
    "",
    `Topic: ${topic}`,
    "",
    "Lesson content (authoritative — stay accurate and do not add facts beyond it):",
    snippet,
    "",
    "Tone: Clear, warm and encouraging, suitable for secondary-school students. Use simple language.",
    "Target length: About 3–4 minutes when narrated.",
    "",
    "Do not include quiz questions; focus on explaining the ideas above.",
  ].join("\n") + "\n";

  await ensureDir(INPUT_DIR);
  const briefPath = path.join(INPUT_DIR, `${stem}_brief.txt`);
  await fs.writeFile(briefPath, brief, "utf8");

  const words = brief.split(/\s+/).filter(Boolean).length;
  log("info", `prepareOcrBrief: brief written (${words} words) → ${briefPath}`);
  return { code, briefPath, words };
}
