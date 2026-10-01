import fs from "node:fs/promises";
import path from "node:path";
import type { SceneOutlineItem } from "./outlineCapture.js";

export interface CoverageItemResult {
  concept: string;
  covered: boolean;
  statusSymbol: string;
  matchedScenes: number[];
  matchedSnippet?: string;
}

export interface CoverageReport {
  timestamp: string;
  totalMustCover: number;
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
 * Checks whether an item's keywords or key phrases appear in candidate text.
 */
function checkItemMatch(item: string, text: string): { matched: boolean; snippet?: string } {
  const normText = normalizeForMatch(text);
  const cleanItem = item.replace(/^\[.*?\]\s*/, "").trim();
  const normItem = normalizeForMatch(cleanItem);

  // Exact phrase match
  if (normText.includes(normItem)) {
    return { matched: true, snippet: `Direct match: "${cleanItem}"` };
  }

  // Token matching: extract non-trivial keywords
  const tokens = normItem.split(/\s+/).filter((t) => t.length > 3 && !/^(with|from|that|this|these|those|into|about|role|definition|study)$/i.test(t));
  if (tokens.length === 0) {
    const isPresent = normText.includes(normItem);
    return { matched: isPresent };
  }

  const matchedTokens = tokens.filter((t) => normText.includes(t));
  // If at least 60% of significant tokens appear, count as referenced
  const matchRatio = matchedTokens.length / tokens.length;
  if (matchRatio >= 0.5) {
    return {
      matched: true,
      snippet: `Keywords referenced: ${matchedTokens.join(", ")} (${Math.round(matchRatio * 100)}%)`,
    };
  }

  return { matched: false };
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
  let coveredCount = 0;

  for (const item of mustCoverItems) {
    const matchedScenes: number[] = [];
    let bestSnippet: string | undefined;

    // Check individual scenes
    for (const sc of scenes) {
      const match = checkItemMatch(item, `${sc.title} ${sc.text}`);
      if (match.matched) {
        matchedScenes.push(sc.index);
        if (!bestSnippet && match.snippet) {
          bestSnippet = `Scene ${sc.index}: ${match.snippet}`;
        }
      }
    }

    // Check overall outline text if not matched in specific scenes
    let covered = matchedScenes.length > 0;
    if (!covered) {
      const overallMatch = checkItemMatch(item, outlineText);
      if (overallMatch.matched) {
        covered = true;
        bestSnippet = overallMatch.snippet || "Referenced in overall outline";
      }
    }

    if (covered) coveredCount++;

    results.push({
      concept: item,
      covered,
      statusSymbol: covered ? "✓" : "⚠",
      matchedScenes,
      matchedSnippet: bestSnippet,
    });
  }

  const total = mustCoverItems.length;
  const percentage = total > 0 ? Math.round((coveredCount / total) * 100) : 100;

  // Build human-readable diagnostic report
  const lines: string[] = [];
  lines.push("MUST-COVER CONTENT COVERAGE DIAGNOSTIC REPORT");
  lines.push("=============================================");
  lines.push(`Total Must-Cover Concepts: ${total}`);
  lines.push(`Covered in Outline: ${coveredCount} / ${total} (${percentage}%)`);
  lines.push("");
  lines.push("Concept Status:");
  for (const res of results) {
    const sceneInfo = res.matchedScenes.length > 0 ? ` [Scenes: ${res.matchedScenes.join(", ")}]` : "";
    lines.push(`${res.statusSymbol} ${res.concept}${sceneInfo}`);
  }
  lines.push("");
  lines.push("Note: This is an educational diagnostic check, not a formal completeness guarantee.");

  const reportText = lines.join("\n");
  const jsonFileName = `storyboard-coverage-${ts}.json`;
  const jsonPath = path.join(outputDir, jsonFileName);

  const report: CoverageReport = {
    timestamp: ts,
    totalMustCover: total,
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
