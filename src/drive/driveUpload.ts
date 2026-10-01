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
    await page.getByRole("button", { name: /^new$/i }).first().click();
    const chooserPromise = page.waitForEvent("filechooser", { timeout: 20_000 });
    await page.getByRole("menuitem", { name: /file upload/i }).first().click();
    await (await chooserPromise).setFiles(filePath);
    const { size } = await fs.stat(filePath);
    log("info", `Uploading ${path.basename(filePath)} to Drive (${size} bytes)…`);
    await page.getByText(/upload(s)? complete/i).first().waitFor({ timeout: 180_000 });
    log("info", "Drive confirmed the upload.");
  } finally {
    await page.close().catch(() => undefined);
  }
}
