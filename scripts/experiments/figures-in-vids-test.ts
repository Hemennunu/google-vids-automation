/**
 * Experiment: do textbook figures embedded in a master .docx end up in a Vids video?
 *
 *   npx tsx scripts/experiments/figures-in-vids-test.ts --step=upload
 *   npx tsx scripts/experiments/figures-in-vids-test.ts --step=generate
 *
 * Runs in the debug Chrome (npm run chrome:debug), signed in to Google.
 * upload:   copies the AI master .docx under a unique name and uploads it via
 *           Drive's own New → File upload, waiting for Drive to confirm.
 * generate: vids.new → File → Storyboard → short instruction + "@<doc>" attachment
 *           (attachment added last and verified, unlike attachDocumentAndInstruction)
 *           → outline → design → draft, then saves editor screenshots.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import { cliValue } from "../../src/cliArgs.js";
import {
  clickNext,
  createDraftFromOutline,
  findPromptInput,
  handleStartCreatingModal,
  log,
  openFileStoryboard,
  waitForDraftReady,
  waitForOutlineReady,
  waitForStoryboardPromptSurface,
  waitForVidsEditor,
} from "../../src/googleVids.js";

const ROOT = process.cwd();
const SOURCE_DOCX = path.join(ROOT, "outputs/ict-prepared/Grade_11_ICT_Unit_02_Section_04_master.docx");
const DOC_NAME = "ICT_G11_U02_S04_AI_master_with_textbook_figures";
const UPLOAD_COPY = path.join(ROOT, "output/experiments", `${DOC_NAME}.docx`);
const SHOTS = path.join(ROOT, "output/experiments");

const INSTRUCTION = [
  "Create a teaching video for Grade 11 ICT students in Ethiopia on Artificial Intelligence,",
  "using the attached master teaching document as the complete and authoritative source.",
  "The document contains official textbook figures (Figure 2.1 to 2.16).",
  "Show these textbook figures as the visuals in the scenes that teach the matching concept,",
  "instead of stock footage, and keep each figure's caption as on-screen text.",
  "Source document: ",
].join(" ");

async function connect(): Promise<{ page: Page; close: () => Promise<void> }> {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
  const page = await browser.contexts()[0]!.newPage();
  return { page, close: async () => { await page.close().catch(() => undefined); await browser.close(); } };
}

async function upload(): Promise<void> {
  await fs.mkdir(path.dirname(UPLOAD_COPY), { recursive: true });
  await fs.copyFile(SOURCE_DOCX, UPLOAD_COPY);
  const { page, close } = await connect();
  try {
    await page.goto("https://drive.google.com/drive/my-drive", { waitUntil: "domcontentloaded" });
    if (/accounts\.google\.com/.test(page.url())) throw new Error("Not signed in to Drive in the debug Chrome.");
    await page.getByRole("button", { name: /^new$/i }).first().click();
    const chooserPromise = page.waitForEvent("filechooser", { timeout: 20_000 });
    await page.getByRole("menuitem", { name: /file upload/i }).first().click();
    const chooser = await chooserPromise;
    await chooser.setFiles(UPLOAD_COPY);
    log("info", `Uploading ${path.basename(UPLOAD_COPY)} (${(await fs.stat(UPLOAD_COPY)).size} bytes)…`);
    await page.getByText(/upload(s)? complete/i).first().waitFor({ timeout: 180_000 });
    log("info", "Drive reports the upload complete.");
    await page.screenshot({ path: path.join(SHOTS, "1-drive-upload.png") });
  } finally {
    await close();
  }
}

/** Types "@<name>", picks the matching Drive source, and checks a chip was inserted. */
async function attachSource(page: Page): Promise<void> {
  const input = await findPromptInput(page);
  await input.click();
  await page.keyboard.press("End");
  await page.keyboard.type(`@${DOC_NAME.slice(0, 24)}`, { delay: 40 });
  const option = page
    .locator('[role="option"], [role="menuitem"]')
    .filter({ hasText: new RegExp(DOC_NAME.slice(0, 24), "i") })
    .first();
  await option.waitFor({ state: "visible", timeout: 30_000 });
  await option.click();
  await page.waitForTimeout(1_500);
  const promptText = await input.innerText();
  const chip = await input.locator('[contenteditable="false"], a, [data-file-id], [role="link"]').count();
  log("info", `Prompt after attach: chips=${chip}, text ends "…${promptText.slice(-80).replace(/\s+/g, " ")}"`);
  if (!chip && !promptText.includes(DOC_NAME.slice(0, 20))) {
    throw new Error("Attachment chip not found in the prompt after selecting the Drive source.");
  }
}

async function generate(): Promise<void> {
  const { page, close } = await connect();
  try {
    await page.goto("https://vids.new", { waitUntil: "domcontentloaded" });
    await waitForVidsEditor(page);
    await handleStartCreatingModal(page, "Landscape");
    await openFileStoryboard(page);
    await waitForStoryboardPromptSurface(page);

    const input = await findPromptInput(page);
    await input.click();
    await input.fill(INSTRUCTION);
    await attachSource(page);
    await page.screenshot({ path: path.join(SHOTS, "2-prompt-with-attachment.png") });

    await clickNext(page);
    await waitForOutlineReady(page);
    await page.screenshot({ path: path.join(SHOTS, "3-outline.png") });
    await createDraftFromOutline(page);
    await waitForDraftReady(page);
    log("info", `Draft: ${page.url()}`);
    await fs.writeFile(path.join(SHOTS, "draft-url.txt"), page.url(), "utf8");

    // Give Gemini time to place media, then capture the editor for inspection.
    await page.waitForTimeout(90_000);
    await page.screenshot({ path: path.join(SHOTS, "4-editor.png") });
    const images = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img, image"))
        .map((e) => (e.getAttribute("src") || e.getAttribute("href") || "").slice(0, 80))
        .filter((s) => /googleusercontent|blob:|drive/.test(s)),
    );
    log("info", `Editor image sources (sample): ${JSON.stringify(images.slice(0, 8))}`);
  } finally {
    await close();
  }
}

const step = cliValue(process.argv.slice(2), "step");
(step === "upload" ? upload() : step === "generate" ? generate() : Promise.reject(new Error("--step=upload|generate")))
  .catch((err: unknown) => {
    log("error", err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
