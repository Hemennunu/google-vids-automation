import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "playwright";

export interface SceneOutlineItem {
  index: number;
  title: string;
  text: string;
}

export interface StoryboardOutlineData {
  source_document: string;
  timestamp: string;
  scene_count: number;
  scenes: SceneOutlineItem[];
  raw_text: string;
  txtPath?: string;
  jsonPath?: string;
}

function timestampString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

/**
 * Extracts scenes and complete outline text from Google Vids "Edit the outline" DOM.
 */
export async function captureStoryboardOutline(
  page: Page,
  sourceDocument: string,
  outputDir = path.join(process.cwd(), "outputs"),
): Promise<StoryboardOutlineData> {
  await fs.mkdir(outputDir, { recursive: true });
  // Also ensure output/ exists
  const altOutDir = path.join(process.cwd(), "output");
  await fs.mkdir(altOutDir, { recursive: true });

  const ts = timestampString();

  // Extract outline text from the active outline dialog or container
  const rawText = await page
    .evaluate(() => {
      // Find the dialog containing "Edit the outline" or the main outline container
      const dialog = document.querySelector('[role="dialog"]') || document.body;
      return (dialog as HTMLElement).innerText || "";
    })
    .catch(() => "");

  // Detect individual scenes from DOM or text
  const scenes: SceneOutlineItem[] = await page
    .evaluate(() => {
      const items: Array<{ index: number; title: string; text: string }> = [];

      // Approach 1: Look for elements with scene indicators or list items
      const candidateElements = Array.from(
        document.querySelectorAll(
          '[role="listitem"], [data-scene-id], .scene-card, .outline-scene, [aria-label*="Scene"]',
        ),
      );

      if (candidateElements.length > 0) {
        candidateElements.forEach((el, idx) => {
          const t = (el as HTMLElement).innerText?.trim() || "";
          if (t) {
            const firstLine = t.split("\n")[0] || `Scene ${idx + 1}`;
            items.push({
              index: idx + 1,
              title: firstLine.slice(0, 80),
              text: t,
            });
          }
        });
      }

      // Approach 2: If approach 1 found nothing, parse scene blocks from text
      if (items.length === 0) {
        const full = (document.body as HTMLElement).innerText || "";
        const regex = /(?:Scene\s+(\d+)[:\s\-–]|(\d+)\.\s+Scene)([\s\S]*?)(?=(?:Scene\s+\d+|Create the draft video|Next|$))/gi;
        let match: RegExpExecArray | null;
        let idx = 1;
        while ((match = regex.exec(full)) !== null) {
          const content = match[3]?.trim();
          if (content && content.length > 5) {
            const titleLine = content.split("\n")[0]?.trim() || `Scene ${idx}`;
            items.push({
              index: idx++,
              title: titleLine.slice(0, 80),
              text: content,
            });
          }
        }
      }

      return items;
    })
    .catch(() => []);

  // If DOM scene extraction found 0 scenes, use heuristic text splitting on rawText
  if (scenes.length === 0 && rawText) {
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
    let currentTitle = "Introduction";
    let currentBuffer: string[] = [];
    let idx = 1;

    for (const line of lines) {
      if (/^(Scene\s+\d+|\d+\.\s+|Sub-topic|Section)/i.test(line)) {
        if (currentBuffer.length > 0) {
          scenes.push({
            index: idx++,
            title: currentTitle,
            text: currentBuffer.join("\n"),
          });
          currentBuffer = [];
        }
        currentTitle = line;
      } else {
        currentBuffer.push(line);
      }
    }
    if (currentBuffer.length > 0) {
      scenes.push({
        index: idx,
        title: currentTitle,
        text: currentBuffer.join("\n"),
      });
    }
  }

  const outlineData: StoryboardOutlineData = {
    source_document: sourceDocument,
    timestamp: ts,
    scene_count: scenes.length,
    scenes,
    raw_text: rawText,
  };

  const txtFileName = `storyboard-outline-${ts}.txt`;
  const jsonFileName = `storyboard-outline-${ts}.json`;

  const txtPath = path.join(outputDir, txtFileName);
  const jsonPath = path.join(outputDir, jsonFileName);

  // Formatted human-readable TXT
  const txtLines: string[] = [
    `STORYBOARD OUTLINE`,
    `Source Document: ${sourceDocument}`,
    `Generated At: ${new Date().toISOString()}`,
    `Scene Count: ${scenes.length}`,
    `================================================`,
    "",
  ];

  if (scenes.length > 0) {
    scenes.forEach((s) => {
      txtLines.push(`--- SCENE ${s.index}: ${s.title} ---`);
      txtLines.push(s.text);
      txtLines.push("");
    });
  } else {
    txtLines.push("RAW OUTLINE TEXT CAPTURED:");
    txtLines.push(rawText);
  }

  await fs.writeFile(txtPath, txtLines.join("\n"), "utf8");
  await fs.writeFile(jsonPath, JSON.stringify(outlineData, null, 2), "utf8");

  // Mirror to output/
  await fs.writeFile(path.join(altOutDir, txtFileName), txtLines.join("\n"), "utf8");
  await fs.writeFile(path.join(altOutDir, jsonFileName), JSON.stringify(outlineData, null, 2), "utf8");

  outlineData.txtPath = txtPath;
  outlineData.jsonPath = jsonPath;

  return outlineData;
}
