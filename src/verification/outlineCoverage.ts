/**
 * Make sure Gemini's Storyboard outline ("Edit the outline" step) covers every
 * must-cover item BEFORE the draft is created. Missing items get their own
 * scene ("Add scene" before the closing scene), written as "<item>: …".
 * The outline and what was added are saved to output/outlines/<name>.md.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { Locator, Page } from "playwright";
import { log } from "../googleVids.js";
import { extractKeywords } from "../lms/textbookMatcher.js";
import { isCovered, stem } from "./sectionCoverage.js";

export const OUTLINES_DIR = path.join(process.cwd(), "output", "outlines");

export type OutlineCoverage = { scenes: string[]; added: string[]; stillMissing: string[] };

function outlineDialog(page: Page): Locator {
  return page.getByRole("dialog").filter({ hasText: /edit the outline/i }).last();
}

/** Scene lines of the outline (the outline's text areas, in order). */
async function readOutline(page: Page): Promise<string[]> {
  return outlineDialog(page)
    .locator("textarea")
    .evaluateAll((els) => els.map((e) => (e as HTMLTextAreaElement).value.trim()));
}

function missingItems(items: string[], scenes: string[]): string[] {
  const stems = new Set(extractKeywords(scenes.join(" ")).map(stem));
  return items.filter((item) => !isCovered(item, stems).covered);
}

/** Insert a scene before the closing one and type `text` into it. */
async function addScene(page: Page, text: string): Promise<boolean> {
  const dialog = outlineDialog(page);
  const addButtons = dialog.getByRole("button", { name: /^add scene$/i });
  const count = await addButtons.count();
  if (!count) return false;
  const before = await dialog.locator("textarea").count();
  // Each outline row is one scene with its own "+" (adds a scene after that row).
  // Insert after the row just above the closing part ("Conclusion…", "Summary…"),
  // else after the second-to-last row.
  const marked = await dialog.locator("textarea").evaluateAll((els) => {
    document.querySelectorAll("[data-outline-add-target]").forEach((e) => e.removeAttribute("data-outline-add-target"));
    const values = els.map((e) => (e as HTMLTextAreaElement).value.trim());
    let closing = values.findIndex((v, i) => i > 1 && /^(conclusion|summary|wrap[- ]?up|recap|review)\b/i.test(v));
    if (closing < 0) closing = els.length - 1;
    const row = els[Math.max(1, closing - 1)];
    // Walk up from the text area to the row that owns an "Add scene" button.
    for (let node = row?.parentElement; node; node = node.parentElement) {
      const add = Array.from(node.querySelectorAll("[aria-label]")).find((b) => /^add scene$/i.test(b.getAttribute("aria-label") ?? ""));
      if (add) {
        add.setAttribute("data-outline-add-target", "1");
        return true;
      }
    }
    return false;
  });
  if (marked) await dialog.locator('[data-outline-add-target="1"]').click();
  else await addButtons.nth(Math.max(0, count - 2)).click();
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline && (await dialog.locator("textarea").count()) <= before) {
    await page.waitForTimeout(300);
  }
  // The new scene is the empty text area.
  const areas = dialog.locator("textarea");
  const n = await areas.count();
  for (let i = 0; i < n; i++) {
    const area = areas.nth(i);
    if (!(await area.inputValue()).trim()) {
      await area.fill(text);
      return true;
    }
  }
  return false;
}

export async function ensureOutlineCoverage(page: Page, items: string[], reportName: string): Promise<OutlineCoverage> {
  const initial = await readOutline(page);
  const missing = missingItems(items, initial);
  const added: string[] = [];
  for (const item of missing) {
    if (await addScene(page, `${item}: explain it clearly with a concrete example`)) added.push(item);
    else log("warn", `Outline: could not add a scene for "${item}".`);
  }
  const scenes = await readOutline(page);
  const stillMissing = missingItems(items, scenes);

  log(
    "info",
    `Outline: ${initial.length} scenes, ${items.length - missing.length}/${items.length} checklist items covered by Gemini` +
      (added.length ? `; added scenes for: ${added.join("; ")}` : "") +
      (stillMissing.length ? `; STILL MISSING: ${stillMissing.join("; ")}` : ""),
  );

  await fs.mkdir(OUTLINES_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTLINES_DIR, `${reportName}.md`),
    [
      `# Outline — ${reportName}`,
      "",
      `Checklist items covered by Gemini's outline: ${items.length - missing.length}/${items.length}`,
      `Scenes added for missing items: ${added.length ? added.join("; ") : "none"}`,
      `Still missing after adding: ${stillMissing.length ? stillMissing.join("; ") : "none"}`,
      "",
      "## Final outline",
      ...scenes.map((s, i) => `${i + 1}. ${s}`),
      "",
    ].join("\n"),
    "utf8",
  );
  return { scenes, added, stillMissing };
}
