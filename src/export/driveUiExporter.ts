import type { Page } from "playwright";
import { captureFailure, firstVisible, log, openFileMenu } from "../googleVids.js";
import {
  ExportFailure,
  MENU_READY_TIMEOUT_MS,
  closeMenus,
  exportTimeoutMsFromEnv,
  isDisabled,
  writeDiagnostics,
} from "./browserExporter.js";
import {
  type ExportRequest,
  type ExportResult,
  type VideoExporter,
  describeExportResult,
} from "./types.js";

const UI_POLL_MS = 500;

const EXPORT_DONE_TEXT =
  /exported to (google )?drive|saved to (your )?(google )?drive|export (is )?(complete|finished|done)|(is|now) (ready|available) in (google )?drive/i;
const EXPORT_ERROR_TEXT =
  /(couldn't|could not|unable to|failed to) export|export (failed|was unsuccessful)|(couldn't|could not) (save|upload) to drive/i;
const EXPORT_PROGRESS_TEXT = /exporting|preparing|rendering|processing|saving to drive/i;

/** File → Export to Drive, retrying while the item is disabled (media still generating). */
async function clickExportToDrive(page: Page): Promise<void> {
  const deadline = Date.now() + MENU_READY_TIMEOUT_MS;
  let lastLog = 0;

  while (Date.now() < deadline) {
    await openFileMenu(page);

    const item = await firstVisible(
      page,
      "File → Export to Drive menu item",
      [
        (p) => p.getByRole("menuitem", { name: /^export to drive/i }),
        (p) => p.getByRole("menuitem", { name: /export to drive/i }),
      ],
      15_000,
    );

    if (await isDisabled(item)) {
      if (Date.now() - lastLog > 15_000) {
        log("info", "File → Export to Drive is disabled (video may still be processing) — retrying…");
        lastLog = Date.now();
      }
      await closeMenus(page);
      await page.waitForTimeout(5_000);
      continue;
    }

    await item.click();
    log("info", "Clicked File → Export to Drive.");
    return;
  }

  throw new Error("File → Export to Drive stayed disabled until timeout.");
}

/** Drive / Docs link that the success notice may expose (e.g. "Open in Drive"). */
async function findDriveLink(page: Page): Promise<string | undefined> {
  const link = page
    .getByRole("link", { name: /open|view|go to|show in drive|drive/i })
    .filter({ hasNotText: /^help/i });
  const count = await link.count().catch(() => 0);
  for (let i = count - 1; i >= 0; i--) {
    const candidate = link.nth(i);
    if (!(await candidate.isVisible().catch(() => false))) {
      continue;
    }
    const href = await candidate.getAttribute("href").catch(() => null);
    if (href && /drive\.google\.com|docs\.google\.com\/file/i.test(href)) {
      return href;
    }
  }
  return undefined;
}

/**
 * After clicking Export to Drive, Vids may show a confirm dialog (options +
 * "Export" button), then render server-side and show a completion notice.
 */
async function waitForDriveExport(page: Page, timeoutMs: number): Promise<ExportResult> {
  const deadline = Date.now() + timeoutMs;
  let confirmClicks = 0;
  let lastLog = 0;

  while (Date.now() < deadline) {
    const error = page.getByText(EXPORT_ERROR_TEXT).first();
    if (await error.isVisible().catch(() => false)) {
      const text = (await error.textContent().catch(() => ""))?.trim();
      throw new Error(`Google Vids reported an export error: "${text}"`);
    }

    const done = page.getByText(EXPORT_DONE_TEXT).first();
    if (await done.isVisible().catch(() => false)) {
      const message = (await done.textContent().catch(() => ""))?.trim() || undefined;
      const driveUrl = await findDriveLink(page);
      return { destination: "drive", driveUrl, message };
    }

    if (confirmClicks < 2) {
      const confirm = await firstVisible(
        page,
        "Export to Drive confirmation button",
        [
          (p) => p.getByRole("dialog").getByRole("button", { name: /^(export|export to drive|save)$/i }),
          (p) => p.getByRole("alertdialog").getByRole("button", { name: /^(export|export to drive|save)$/i }),
        ],
        1_000,
      ).catch(() => null);
      if (confirm && !(await isDisabled(confirm))) {
        confirmClicks++;
        await confirm.click().catch(() => undefined);
        log("info", `Clicked Export confirmation in dialog (${confirmClicks}).`);
        await page.waitForTimeout(2_000);
        continue;
      }
    }

    if (Date.now() - lastLog > 30_000) {
      const progress = await page
        .getByText(EXPORT_PROGRESS_TEXT)
        .first()
        .textContent({ timeout: 500 })
        .catch(() => null);
      const remainingMin = Math.round((deadline - Date.now()) / 60_000);
      log(
        "info",
        `Waiting for Drive export to finish${progress ? ` (UI: "${progress.trim().slice(0, 80)}")` : ""}… ~${remainingMin} min left`,
      );
      lastLog = Date.now();
    }

    if (/accounts\.google\.com|signin/i.test(page.url())) {
      throw new Error("Redirected to Google sign-in during export. Run: npm run login:cdp");
    }

    await page.waitForTimeout(UI_POLL_MS);
  }

  throw new Error(
    `No "exported to Drive" confirmation seen within ${Math.round(timeoutMs / 60_000)} minutes. ` +
      "The export may still finish in the background — check Google Drive.",
  );
}

/** Exports via File → Export to Drive; the MP4 lands in the user's Google Drive. */
export class DriveUiVideoExporter implements VideoExporter {
  readonly name = "drive-ui";

  async exportVideo({ page }: ExportRequest): Promise<ExportResult> {
    const consoleErrors: string[] = [];
    const onConsole = (msg: { type(): string; text(): string }) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    };
    page.on("console", onConsole);

    try {
      log("info", "Exporting via Vids UI → Google Drive…");
      await clickExportToDrive(page);
      const result = await waitForDriveExport(page, exportTimeoutMsFromEnv());
      log("info", `Export complete: ${describeExportResult(result)}`);
      return result;
    } catch (err) {
      const screenshotPath = await captureFailure(page, "drive-export-failure").catch(() => undefined);
      const diagnosticsPath = await writeDiagnostics(page, err, consoleErrors);
      const message = err instanceof Error ? err.message : String(err);
      throw new ExportFailure(`Drive export failed: ${message}`, screenshotPath, diagnosticsPath);
    } finally {
      page.off("console", onConsole);
    }
  }
}
