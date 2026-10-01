import fs from "node:fs/promises";
import path from "node:path";
import type { SceneOutlineItem } from "./outlineCapture.js";

export type CoverageStatus = "taught" | "under_explained" | "missing";

export interface CoverageItemResult {
  concept: string;
  covered: boolean;
  status: CoverageStatus;
  statusSymbol: "✓" | "⚠" | "✗";
  matchedScenes: number[];
  matchedSnippet?: string;
  explanationDepth?: string;
}

export interface CoverageReport {
  timestamp: string;
  totalMustCover: number;
  taughtCount: number;
  underExplainedCount: number;
  missingCount: number;
  coveredCount: number;
  coveragePercentage: number;
  items: CoverageItemResult[];
  reportText: string;
  jsonPath?: string;
}

function timestampString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/**
 * Normalizes text for keyword matching.
 */
function normalizeForMatch(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

/**
 * Evaluates whether an item is thoroughly taught, briefly mentioned, or missing.
 */
function evaluateConceptTeachingDepth(
  item: string,
  matchingText: string,
): { status: CoverageStatus; snippet: string } {
  const normText = normalizeForMatch(matchingText);
  const cleanItem = item.replace(/^\[.*?\]\s*/, "").trim();
  const normItem = normalizeForMatch(cleanItem);

  const tokens = normItem
    .split(/\s+/)
    .filter((t) => t.length > 3 && !/^(with|from|that|this|these|those|into|about|role|definition|study)$/i.test(t));

  if (tokens.length === 0) {
    if (normText.includes(normItem)) {
      return { status: "taught", snippet: `Direct match: "${cleanItem}"` };
    }
    return { status: "missing", snippet: "Concept not found" };
  }

  const matchedTokens = tokens.filter((t) => normText.includes(t));
  const matchRatio = matchedTokens.length / tokens.length;

  if (matchRatio < 0.4) {
    return { status: "missing", snippet: "No significant keywords found" };
  }

  // Check explanatory depth indicators (explanation words, process, examples, definitions)
  const explanatorySignals = [
    "because", "works by", "such as", "for example", "process", "difference",
    "defined as", "consists of", "steps", "translates", "converts", "mechanism",
    "architecture", "hierarchy", "normalization", "protocol", "algorithm"
  ];
  const hasExplanatoryDetail = explanatorySignals.some((signal) => normText.includes(signal)) || matchingText.length > 120;

  if (matchRatio >= 0.7 && hasExplanatoryDetail) {
    return {
      status: "taught",
      snippet: `Substantively taught (${Math.round(matchRatio * 100)}% keyword match with explanatory detail)`,
    };
  }

  return {
    status: "under_explained",
    snippet: `Mentioned but under-explained (${Math.round(matchRatio * 100)}% keyword match; brief summary only)`,
  };
}

/**
 * Verifies coverage of MUST-COVER CONTENT against the generated outline scenes and text.
 */
export async function checkContentCoverage(
  mustCoverItems: string[],
  outlineText: string,
  scenes: SceneOutlineItem[] = [],
  outputDir = path.join(process.cwd(), "outputs"),
  existingTimestamp?: string,
): Promise<CoverageReport> {
  await fs.mkdir(outputDir, { recursive: true });
  const altOutDir = path.join(process.cwd(), "output");
  await fs.mkdir(altOutDir, { recursive: true });

  const ts = existingTimestamp || timestampString();
  const results: CoverageItemResult[] = [];
  let taughtCount = 0;
  let underExplainedCount = 0;
  let missingCount = 0;

  for (const item of mustCoverItems) {
    const matchedScenes: number[] = [];
    let combinedMatchingText = "";

    // Check individual scenes
    for (const sc of scenes) {
      const sceneCombined = `${sc.title} ${sc.text}`;
      const evalResult = evaluateConceptTeachingDepth(item, sceneCombined);
      if (evalResult.status !== "missing") {
        matchedScenes.push(sc.index);
        combinedMatchingText += " " + sceneCombined;
      }
    }

    if (matchedScenes.length === 0 && outlineText) {
      combinedMatchingText = outlineText;
    }

    const evaluation = evaluateConceptTeachingDepth(item, combinedMatchingText);
    let statusSymbol: "✓" | "⚠" | "✗" = "✗";

    if (evaluation.status === "taught") {
      taughtCount++;
      statusSymbol = "✓";
    } else if (evaluation.status === "under_explained") {
      underExplainedCount++;
      statusSymbol = "⚠";
    } else {
      missingCount++;
      statusSymbol = "✗";
    }

    const isCovered = evaluation.status !== "missing";

    results.push({
      concept: item,
      covered: isCovered,
      status: evaluation.status,
      statusSymbol,
      matchedScenes,
      matchedSnippet: evaluation.snippet,
      explanationDepth: evaluation.status === "taught" ? "In-depth teaching" : evaluation.status === "under_explained" ? "High-level mention" : "Omitted",
    });
  }

  const total = mustCoverItems.length;
  const coveredCount = taughtCount + underExplainedCount;
  const percentage = total > 0 ? Math.round((taughtCount / total) * 100) : 100;

  // Build human-readable diagnostic report
  const lines: string[] = [];
  lines.push("ICT MUST-TEACH CONTENT COVERAGE DIAGNOSTIC REPORT");
  lines.push("=================================================");
  lines.push(`Total Must-Teach Concepts: ${total}`);
  lines.push(`✓ Substantively Taught: ${taughtCount} / ${total} (${percentage}%)`);
  lines.push(`⚠ Mentioned but Under-Explained: ${underExplainedCount} / ${total}`);
  lines.push(`✗ Missing / Omitted: ${missingCount} / ${total}`);
  lines.push("");
  lines.push("Concept Status Detail:");
  for (const res of results) {
    const sceneInfo = res.matchedScenes.length > 0 ? ` [Scenes: ${res.matchedScenes.join(", ")}]` : "";
    lines.push(`${res.statusSymbol} [${res.status.toUpperCase()}] ${res.concept}${sceneInfo}`);
  }
  lines.push("");
  lines.push("Note: This is an educational diagnostic check, not a formal completeness guarantee.");

  const reportText = lines.join("\n");
  const jsonFileName = `storyboard-coverage-${ts}.json`;
  const jsonPath = path.join(outputDir, jsonFileName);

  const report: CoverageReport = {
    timestamp: ts,
    totalMustCover: total,
    taughtCount,
    underExplainedCount,
    missingCount,
    coveredCount,
    coveragePercentage: percentage,
    items: results,
    reportText,
    jsonPath,
  };

  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");
  await fs.writeFile(path.join(altOutDir, jsonFileName), JSON.stringify(report, null, 2), "utf8");

  return report;
}
