/**
 * Upload a file to My Drive through Drive's own UI (New → File upload) and wait
 * for Drive to confirm. Used for the per-section source documents that Storyboard
 * attaches with "@". Unlike BrowserDriveService, failures are reported, not hidden.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { BrowserContext } from "playwright";
import { log } from "../googleVids.js";

export async function uploadToDrive(context: BrowserContext, filePath: string): Promise<void> {
  const page = await context.newPage();
  try {
    await page.goto("https://drive.google.com/drive/my-drive", { waitUntil: "domcontentloaded" });
    if (/accounts\.google\.com/.test(page.url())) throw new Error("Not signed in to Google Drive.");
    let newBtn = page.getByRole("button", { name: /^new$/i }).first();
    const isVis = await newBtn.isVisible().catch(() => false);
    if (!isVis) {
      const fallback = page.locator('button[aria-label*="New" i], button[data-tooltip*="New" i], div[role="button"][aria-label*="New" i], [data-target="new-menu"]').first();
      if (await fallback.isVisible({ timeout: 15_000 }).catch(() => false)) {
        newBtn = fallback;
      }
    }
    await newBtn.waitFor({ state: "visible", timeout: 30_000 });
    for (let i = 0; i < 30; i++) {
      const disabled = await newBtn.getAttribute("aria-disabled").catch(() => null);
      if (disabled !== "true") break;
      await page.waitForTimeout(500);
    }
    await newBtn.click();
    const chooserPromise = page.waitForEvent("filechooser", { timeout: 20_000 });
    const uploadItem = page.locator('[role="menuitem"]').filter({ hasText: /file upload/i }).first();
    await uploadItem.waitFor({ state: "visible", timeout: 15_000 });
    await uploadItem.click();
    await (await chooserPromise).setFiles(filePath);
    const { size } = await fs.stat(filePath);
    log("info", `Uploading ${path.basename(filePath)} to Drive (${size} bytes)…`);

    // Same name already in My Drive → Drive asks "Replace existing file / Keep both".
    // Replace keeps one current copy per section (no stale duplicates in the @ picker).
    const complete = page.getByText(/upload(s)? complete/i).first();
    const replace = page.getByText(/replace existing file/i).first();
    const deadline = Date.now() + 180_000;
    let done = false;
    while (Date.now() < deadline && !done) {
      if (await complete.isVisible().catch(() => false)) {
        done = true;
        break;
      }
      if (await replace.isVisible().catch(() => false)) {
        log("info", "File already in Drive — replacing it with the new version.");
        await replace.click();
        await page.getByRole("button", { name: /^upload$/i }).first().click();
      }
      await page.waitForTimeout(1_000);
    }
    if (!done) throw new Error(`Drive did not confirm the upload of ${path.basename(filePath)} within 3 minutes.`);
    log("info", "Drive confirmed the upload.");
  } finally {
    await page.close().catch(() => undefined);
  }
}
