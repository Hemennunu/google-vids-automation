/**
 * ICT Section Enricher:
 * Combines LMS source text with matched textbook OCR content, computes content gaps,
 * and formats the final enriched document.
 */
import { MatchResult, extractKeywords } from "./textbookMatcher.js";

export interface SectionMetadata {
  code: string;
  grade: string;
  unit: string;
  section: string;
  title: string;
}

export interface EnrichmentReportItem {
  code: string;
  grade: string;
  unit: string;
  section: string;
  title: string;
  lmsWords: number;
  textbookWordsAdded: number;
  gapTermsCount: number;
  gapTermsSample: string;
  textbookPages: string;
}

export interface EnrichedDocument {
  metadata: SectionMetadata;
  markdown: string;
  reportItem: EnrichmentReportItem;
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/** Extract technical/capitalized terms or domain keywords. */
function extractTechnicalTerms(text: string): string[] {
  // Capture capitalized multi-word phrases or standalone acronyms (e.g., "DIKW", "Local Area Network")
  const matches = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+|[A-Z]{2,6})\b/g) || [];
  const unique = Array.from(new Set(matches.map((m) => m.trim())));
  return unique.filter((term) => term.length > 2 && !/^(The|This|These|Those|Unit|Grade|Section|Chapter)$/i.test(term));
}

/** Find figures and exercises in textbook text. */
function extractTextbookFeatures(text: string) {
  const figures: string[] = [];
  const activities: string[] = [];

  const lines = text.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (/^Figure\s+[0-9]+(\.[0-9]+)*[:.]?/i.test(line)) {
      figures.push(line.slice(0, 100));
    }
    if (/^(Activity|Review Questions?|Exercise|Self-Check)\s+[0-9]*/i.test(line)) {
      activities.push(line.slice(0, 100));
    }
  }

  return {
    figures: Array.from(new Set(figures)),
    activities: Array.from(new Set(activities)),
  };
}

/**
 * Enriches LMS content with matched textbook pages and detects gaps.
 */
export function enrichSection(
  meta: SectionMetadata,
  lmsText: string,
  match: MatchResult,
): EnrichedDocument {
  const lmsWords = countWords(lmsText);
  const textbookCombinedText = match.pages.map((p) => p.text).join("\n\n");
  const textbookWordsAdded = countWords(textbookCombinedText);

  // Identify terms in textbook missing from LMS
  const lmsKeywords = new Set(extractKeywords(lmsText));
  const textbookTerms = extractTechnicalTerms(textbookCombinedText);
  const missingTerms: string[] = [];

  for (const term of textbookTerms) {
    const termLowerWords = term.toLowerCase().split(/\s+/);
    // If none of the words in the term appear in LMS, mark as gap
    if (!termLowerWords.some((w) => lmsKeywords.has(w))) {
      missingTerms.push(term);
    }
  }

  const uniqueMissingTerms = Array.from(new Set(missingTerms)).slice(0, 15);
  const features = extractTextbookFeatures(textbookCombinedText);

  // Build Markdown Document
  const lines: string[] = [];
  lines.push(`# ${meta.code} — ${meta.title}`);
  lines.push("");
  lines.push(`| Property | Value |`);
  lines.push(`|---|---|`);
  lines.push(`| **Grade** | Grade ${meta.grade} |`);
  lines.push(`| **Unit** | Unit ${meta.unit} |`);
  lines.push(`| **Section** | Section ${meta.section} |`);
  lines.push(`| **Matched Textbook Pages** | ${match.pageRangeStr} |`);
  lines.push(`| **LMS Word Count** | ${lmsWords} words |`);
  lines.push(`| **Textbook Supplement Words** | ${textbookWordsAdded} words |`);
  lines.push(`| **Curriculum Gap Terms Found** | ${uniqueMissingTerms.length} terms |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push("## 1. Primary LMS Content");
  lines.push("> *Source: MyMarian SharePoint Courseware Archive*");
  lines.push("");
  lines.push(lmsText.trim());
  lines.push("");
  lines.push("---");
  lines.push("");

  lines.push(`## 2. Textbook Supplementary Content (${match.pageRangeStr})`);
  lines.push(`> *Source: Ministry of Education Grade ${meta.grade} Information Technology Student Textbook*`);
  lines.push("");

  if (match.pages.length === 0) {
    lines.push("*No matching textbook pages were found or textbook has not been OCR indexed yet.*");
  } else {
    for (const page of match.pages) {
      lines.push(`### Page ${page.pageNumber}`);
      lines.push("");
      lines.push(page.text.trim());
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("## 3. Curriculum Gap Analysis & Missing Elements");
  lines.push("");

  if (uniqueMissingTerms.length > 0) {
    lines.push("### Missing Key Terms & Concepts in LMS");
    lines.push("The following terms and concepts are emphasized in the textbook but were omitted or under-explained in the LMS:");
    for (const term of uniqueMissingTerms) {
      lines.push(`- **${term}**`);
    }
    lines.push("");
  } else {
    lines.push("### Key Terms Coverage");
    lines.push("Core textbook terminology aligns well with the LMS content for this topic.");
    lines.push("");
  }

  if (features.figures.length > 0) {
    lines.push("### Textbook Visuals & Diagrams");
    lines.push("The printed textbook includes visual diagrams for this section that should be incorporated into the Google Vids storyboard:");
    for (const fig of features.figures) {
      lines.push(`- 🖼️ \`${fig}\``);
    }
    lines.push("");
  }

  if (features.activities.length > 0) {
    lines.push("### Textbook Practical Activities & Review Questions");
    for (const act of features.activities) {
      lines.push(`- 📝 \`${act}\``);
    }
    lines.push("");
  }

  lines.push("### Recommendation for Video Production");
  lines.push("- Ensure the narrator covers both the high-level LMS summary and the specific textbook concepts highlighted above.");
  if (features.figures.length > 0) {
    lines.push("- Integrate visual slide cards corresponding to textbook figures.");
  }
  lines.push("");

  const reportItem: EnrichmentReportItem = {
    code: meta.code,
    grade: meta.grade,
    unit: meta.unit,
    section: meta.section,
    title: meta.title,
    lmsWords,
    textbookWordsAdded,
    gapTermsCount: uniqueMissingTerms.length,
    gapTermsSample: uniqueMissingTerms.slice(0, 5).join("; "),
    textbookPages: match.pageRangeStr,
  };

  return {
    metadata: meta,
    markdown: lines.join("\n"),
    reportItem,
  };
}
