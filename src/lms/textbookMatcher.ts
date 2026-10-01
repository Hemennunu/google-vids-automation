/**
 * Textbook Matcher:
 * Parses OCR-extracted textbook pages and matches them against LMS sections.
 */
import fs from "node:fs/promises";
import path from "node:path";

export interface TextbookPage {
  pageNumber: number;
  text: string;
  headings: string[];
}

export interface TextbookIndex {
  grade: string;
  sourceFile: string;
  pages: TextbookPage[];
}

export interface MatchResult {
  pages: TextbookPage[];
  matchedPageNumbers: number[];
  pageRangeStr: string;
  score: number;
  matchedKeywords: string[];
}

const COMMON_STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "cannot", "could", "did", "do",
  "does", "doing", "don't", "down", "during", "each", "few", "for", "from", "further",
  "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
  "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself",
  "let's", "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off",
  "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
  "over", "own", "same", "she", "should", "so", "some", "such", "than", "that",
  "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they",
  "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
  "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why",
  "with", "won't", "would", "you", "your", "yours", "yourself", "yourselves",
  "section", "unit", "grade", "lesson", "student", "textbook", "ethiopia", "ethiopian"
]);

/** Tokenize and normalize text into meaningful keywords. */
export function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !COMMON_STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

/** Extract prominent uppercase or heading-like phrases. */
export function extractHeadings(pageText: string): string[] {
  const lines = pageText.split("\n").map((l) => l.trim()).filter(Boolean);
  const headings: string[] = [];
  for (const line of lines) {
    if (line.length > 3 && line.length < 80) {
      if (/^[0-9]+(\.[0-9]+)*\s+[A-Z]/.test(line) || /^UNIT\s+[0-9]+/i.test(line) || /^[A-Z\s]{4,}$/.test(line)) {
        headings.push(line);
      }
    }
  }
  return headings;
}

/** Parse an OCR output file into indexed TextbookPages. */
export async function parseTextbookOcr(filePath: string, grade: string): Promise<TextbookIndex> {
  const content = await fs.readFile(filePath, "utf8");
  const pages: TextbookPage[] = [];

  // Match pages demarcated by "## Page N" or "--- Page Break ---"
  const pageRegex = /## Page\s+(\d+)([\s\S]*?)(?=(?:## Page\s+\d+|$))/g;
  let match: RegExpExecArray | null = null;

  while ((match = pageRegex.exec(content)) !== null) {
    const pageNumber = Number.parseInt(match[1], 10);
    const text = match[2].trim();
    const headings = extractHeadings(text);
    pages.push({ pageNumber, text, headings });
  }

  // Fallback: If not separated by "## Page", try splitting by "--- Page Break ---"
  if (pages.length === 0) {
    const parts = content.split(/--- Page Break ---/i);
    for (let i = 0; i < parts.length; i++) {
      const text = parts[i].trim();
      if (text.length > 0) {
        pages.push({
          pageNumber: i + 1,
          text,
          headings: extractHeadings(text),
        });
      }
    }
  }

  return {
    grade,
    sourceFile: filePath,
    pages,
  };
}

/**
 * Matches an LMS section title and content against the indexed textbook pages.
 */
export function matchSectionToTextbook(
  title: string,
  lmsText: string,
  unitNum: number,
  index: TextbookIndex,
  options: { maxPagesWindow?: number } = {},
): MatchResult {
  const maxWindow = options.maxPagesWindow ?? 4;
  const titleKeywords = extractKeywords(title);
  const contentKeywords = extractKeywords(lmsText).slice(0, 30);

  if (index.pages.length === 0) {
    return {
      pages: [],
      matchedPageNumbers: [],
      pageRangeStr: "None (Textbook not yet OCR-indexed)",
      score: 0,
      matchedKeywords: [],
    };
  }

  // Score each page
  const pageScores: { page: TextbookPage; score: number; hits: string[] }[] = [];

  for (const page of index.pages) {
    const pageTextLower = page.text.toLowerCase();
    let score = 0;
    const hits: string[] = [];

    // Title keywords score high
    for (const kw of titleKeywords) {
      if (pageTextLower.includes(kw)) {
        score += 5;
        hits.push(kw);
      }
    }

    // Content keywords score moderate
    for (const kw of contentKeywords) {
      if (pageTextLower.includes(kw)) {
        score += 1;
        if (!hits.includes(kw)) hits.push(kw);
      }
    }

    // Bonus for Unit number match in headings
    const unitPattern = new RegExp(`unit\\s*0?${unitNum}\\b`, "i");
    for (const h of page.headings) {
      if (unitPattern.test(h)) {
        score += 8;
      }
    }

    pageScores.push({ page, score, hits });
  }

  // Sort by highest score
  pageScores.sort((a, b) => b.score - a.score);
  const best = pageScores[0];

  if (!best || best.score <= 3) {
    return {
      pages: [],
      matchedPageNumbers: [],
      pageRangeStr: "No confident match found",
      score: best ? best.score : 0,
      matchedKeywords: best ? best.hits : [],
    };
  }

  // Collect a window around the best page (up to maxWindow pages)
  const centerPageNum = best.page.pageNumber;
  const minPage = Math.max(1, centerPageNum - 1);
  const maxPage = centerPageNum + maxWindow - 2;

  const windowPages = index.pages.filter(
    (p) => p.pageNumber >= minPage && p.pageNumber <= maxPage,
  );

  const matchedNums = windowPages.map((p) => p.pageNumber);
  const pageRangeStr =
    matchedNums.length === 1
      ? `Page ${matchedNums[0]}`
      : `Pages ${Math.min(...matchedNums)}–${Math.max(...matchedNums)}`;

  return {
    pages: windowPages,
    matchedPageNumbers: matchedNums,
    pageRangeStr,
    score: best.score,
    matchedKeywords: best.hits,
  };
}
