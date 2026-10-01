import fs from "node:fs/promises";
import path from "node:path";
import {
  type Browser,
  type BrowserContext,
  type Locator,
  type Page,
  chromium,
} from "playwright";
import { type VideoExporter, describeExportResult } from "./export/types.js";
import {
  captureStoryboardOutline,
  type StoryboardOutlineData,
} from "./verification/outlineCapture.js";
import {
  checkContentCoverage,
  type CoverageReport,
} from "./verification/coverageChecker.js";
import { getStoryboardInstruction } from "./storyboardPrompt.js";

/** Official entry points for a new Vids project */
export const VIDS_NEW_URL = "https://vids.new";
export const VIDS_HOME_URL = "https://vids.google.com";

export const AUTH_STATE_PATH = path.join(
  process.cwd(),
  "playwright",
  ".auth",
  "user.json",
);

/** Isolated Chrome profile for manual login (gitignored). */
export const USER_DATA_DIR = path.join(
  process.cwd(),
  "playwright",
  ".user-data",
);

export const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");

type BrowserChannel = "chrome" | "msedge" | "chrome-beta" | "msedge-beta";

const VIEWPORT = { width: 1440, height: 900 };

/** Flags Playwright adds that trigger Google "browser not secure" / signin/rejected. */
const IGNORED_CHROMIUM_DEFAULT_ARGS = [
  "--enable-automation",
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
];

const DEFAULT_CDP_URL = "http://127.0.0.1:9222";

const DEFAULT_NAV_TIMEOUT_MS = 120_000;
const DEFAULT_ACTION_TIMEOUT_MS = 60_000;
const GENERATION_TIMEOUT_MS = 15 * 60_000;
/** Safety cap only — steps proceed as soon as the UI is ready. */
const GEMINI_STEP_TIMEOUT_MS = 5 * 60_000;
const UI_POLL_MS = 300;

export type RunOptions = {
  headless: boolean;
  scriptPath: string;
  videoFormat: "Landscape" | "Portrait" | "Square";
  slowMoMs: number;
  pauseAtEnd?: boolean;
  /** Drive your own Chrome started with `npm run chrome:debug` instead of launching one. */
  useCdp?: boolean;
  /** Export this already-generated Vids draft instead of creating a new one. */
  existingDraftUrl?: string;
  /** When set, the draft is exported to outputPath after creation. */
  exporter?: VideoExporter;
  outputPath?: string;
  /** Path to prepared course document (.docx or .md) */
  preparedDocPath?: string;
  /** Raw text of prepared document */
  preparedMarkdown?: string;
  /** Items to verify in outline coverage diagnostic */
  mustCoverItems?: string[];
  /** When true, stop before exporting/publishing */
  testMode?: boolean;
  /** Directory for outlines, coverage reports, and logs */
  outputDir?: string;
  /** Path to raw course source file */
  courseSourceFile?: string;
  /** Path to raw added gaps source file */
  gapsSourceFile?: string;
  /** Custom storyboard prompt instruction */
  storyboardInstruction?: string;
  /** Attach this Drive document (by name) with "@" instead of pasting the source text. */
  driveDocName?: string;
};

export type FlowResult = {
  success: boolean;
  screenshotPath?: string;
  outputPath?: string;
  editorUrl?: string;
  outlineData?: StoryboardOutlineData;
  coverageReport?: CoverageReport;
  error?: string;
};

export type LaunchResult = {
  /** Null when using a persistent context (login mode). */
  browser: Browser | null;
  context: BrowserContext;
  page: Page;
  kind: "launch" | "persistent" | "cdp";
};

function browserChannelFromEnv(): BrowserChannel | undefined {
  const raw = process.env.PLAYWRIGHT_BROWSER_CHANNEL?.trim();
  if (!raw) {
    return undefined;
  }
  return raw as BrowserChannel;
}

function channelAttemptOrder(): BrowserChannel[] {
  const preferred = browserChannelFromEnv();
  const order: BrowserChannel[] = preferred ? [preferred] : [];
  for (const channel of ["chrome", "msedge"] as const) {
    if (!order.includes(channel)) {
      order.push(channel);
    }
  }
  return order;
}

async function launchBrowserWithChannel(
  options: Pick<RunOptions, "headless" | "slowMoMs">,
): Promise<Browser> {
  let lastError: unknown;
  for (const channel of channelAttemptOrder()) {
    try {
      log("info", `Launching browser (channel: ${channel})…`);
      return await chromium.launch({
        headless: options.headless,
        slowMo: options.slowMoMs,
        channel,
        ignoreDefaultArgs: IGNORED_CHROMIUM_DEFAULT_ARGS,
      });
    } catch (err) {
      lastError = err;
      log("warn", `Channel "${channel}" unavailable: ${String(err)}`);
    }
  }

  throw new Error(
    [
      "Could not launch Google Chrome or Microsoft Edge for Playwright.",
      "Google sign-in blocks Playwright's bundled Chromium.",
      "Install Google Chrome, or set PLAYWRIGHT_BROWSER_CHANNEL=msedge",
      `Last error: ${String(lastError)}`,
    ].join(" "),
  );
}

async function launchPersistentContextWithChannel(
  userDataDir: string,
  options: Pick<RunOptions, "slowMoMs">,
): Promise<BrowserContext> {
  let lastError: unknown;
  for (const channel of channelAttemptOrder()) {
    try {
      log(
        "info",
        `Launching persistent profile for login (channel: ${channel})…`,
      );
      return await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        slowMo: options.slowMoMs,
        channel,
        viewport: VIEWPORT,
        ignoreDefaultArgs: IGNORED_CHROMIUM_DEFAULT_ARGS,
      });
    } catch (err) {
      lastError = err;
      log("warn", `Channel "${channel}" unavailable: ${String(err)}`);
    }
  }

  throw new Error(
    [
      "Could not launch Google Chrome or Microsoft Edge for login.",
      "Install Google Chrome, or set PLAYWRIGHT_BROWSER_CHANNEL=msedge",
      `Last error: ${String(lastError)}`,
    ].join(" "),
  );
}

export async function closeLaunchResult(result: LaunchResult): Promise<void> {
  if (result.kind === "cdp") {
    // Disconnect only — leaves the user's Chrome window open.
    await result.browser?.close().catch(() => undefined);
    return;
  }
  if (result.kind === "persistent") {
    await result.context.close().catch(() => undefined);
    return;
  }
  await result.context.close().catch(() => undefined);
  if (result.browser) {
    await result.browser.close().catch(() => undefined);
  }
}

export async function launchBrowserViaCdp(
  cdpUrl = process.env.CDP_URL?.trim() || DEFAULT_CDP_URL,
  options: { newPage?: boolean } = {},
): Promise<LaunchResult> {
  log(
    "info",
    `Connecting over CDP to ${cdpUrl} (Chrome must be started by you — see npm run chrome:debug).`,
  );

  let browser: Browser;
  try {
    browser = await chromium.connectOverCDP(cdpUrl);
  } catch (err) {
    throw new Error(
      [
        `Could not connect to Chrome at ${cdpUrl}.`,
        "Start Chrome first: npm run chrome:debug",
        "Then sign in manually and run: npm run login:cdp",
        `Details: ${String(err)}`,
      ].join(" "),
    );
  }

  const context = browser.contexts()[0];
  if (!context) {
    await browser.close().catch(() => undefined);
    throw new Error(
      "Connected to Chrome but no browser context found. Restart with npm run chrome:debug",
    );
  }

  const page = options.newPage
    ? await context.newPage()
    : (context.pages()[0] ?? (await context.newPage()));
  context.setDefaultNavigationTimeout(DEFAULT_NAV_TIMEOUT_MS);
  context.setDefaultTimeout(DEFAULT_ACTION_TIMEOUT_MS);

  return { browser, context, page, kind: "cdp" };
}

export function log(level: "info" | "warn" | "error", message: string): void {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level.toUpperCase()}] ${message}`;
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function authStateExists(): Promise<boolean> {
  try {
    await fs.access(AUTH_STATE_PATH);
    return true;
  } catch {
    return false;
  }
}

export async function readScript(scriptPath: string): Promise<string> {
  const absolute = path.isAbsolute(scriptPath)
    ? scriptPath
    : path.join(process.cwd(), scriptPath);
  const text = await fs.readFile(absolute, "utf8");
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(`Script file is empty: ${absolute}`);
  }
  return trimmed;
}

export async function captureFailure(
  page: Page,
  label: string,
): Promise<string> {
  await ensureDir(SCREENSHOTS_DIR);
  const safe = label.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80);
  const file = path.join(
    SCREENSHOTS_DIR,
    `${Date.now()}-${safe}.png`,
  );
  await page.screenshot({ path: file, fullPage: true });
  log("error", `Screenshot saved: ${file}`);
  return file;
}

export async function captureCheckpoint(
  page: Page,
  label: string,
): Promise<string> {
  await ensureDir(SCREENSHOTS_DIR);
  const safe = label.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80);
  const file = path.join(
    SCREENSHOTS_DIR,
    `${Date.now()}-${safe}.png`,
  );
  await page.screenshot({ path: file, fullPage: true });
  log("info", `Checkpoint screenshot saved: ${file}`);
  return file;
}

/**
 * Try several accessible locators in order. Logs each attempt for debugging.
 * Do not add guessed CSS selectors here until you verify them in headed mode.
 */
export async function firstVisible(
  page: Page,
  label: string,
  factories: Array<(page: Page) => Locator>,
  timeoutMs = DEFAULT_ACTION_TIMEOUT_MS,
): Promise<Locator> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    for (const factory of factories) {
      const locator = factory(page);
      try {
        if (await locator.first().isVisible({ timeout: 2_000 })) {
          log("info", `Located "${label}" using: ${locator.toString()}`);
          return locator.first();
        }
      } catch (err) {
        lastError = err;
      }
    }
    await page.waitForTimeout(500);
  }

  throw new Error(
    `Could not find visible element for "${label}". Last error: ${String(lastError)}`,
  );
}

async function clickNamedControl(
  page: Page,
  label: string,
  names: RegExp[],
): Promise<void> {
  const factories = names.flatMap((name) => [
    (p: Page) => p.getByRole("button", { name }),
    (p: Page) => p.getByRole("menuitem", { name }),
    (p: Page) => p.getByRole("link", { name }),
    (p: Page) => p.getByRole("tab", { name }),
  ]);

  const target = await firstVisible(page, label, factories);
  await target.click();
}

export async function launchBrowser(
  options: Pick<RunOptions, "headless" | "slowMoMs"> & { forLogin?: boolean },
): Promise<LaunchResult> {
  await ensureDir(path.dirname(AUTH_STATE_PATH));

  if (options.forLogin) {
    await ensureDir(USER_DATA_DIR);
    const context = await launchPersistentContextWithChannel(USER_DATA_DIR, {
      slowMoMs: options.slowMoMs,
    });
    context.setDefaultNavigationTimeout(DEFAULT_NAV_TIMEOUT_MS);
    context.setDefaultTimeout(DEFAULT_ACTION_TIMEOUT_MS);
    const page = context.pages()[0] ?? (await context.newPage());
    return { browser: null, context, page, kind: "persistent" };
  }

  const browser = await launchBrowserWithChannel({
    headless: options.headless,
    slowMoMs: options.slowMoMs,
  });

  const hasAuth = await authStateExists();
  const context = await browser.newContext({
    storageState: hasAuth ? AUTH_STATE_PATH : undefined,
    viewport: VIEWPORT,
  });

  context.setDefaultNavigationTimeout(DEFAULT_NAV_TIMEOUT_MS);
  context.setDefaultTimeout(DEFAULT_ACTION_TIMEOUT_MS);

  const page = await context.newPage();
  return { browser, context, page, kind: "launch" };
}

export async function saveAuthState(context: BrowserContext): Promise<void> {
  await ensureDir(path.dirname(AUTH_STATE_PATH));
  await context.storageState({ path: AUTH_STATE_PATH });
  log("info", `Saved authentication state to ${AUTH_STATE_PATH}`);
}

export async function waitForManualLogin(
  page: Page,
  options: { navigateToVids?: boolean } = {},
): Promise<void> {
  const navigateToVids = options.navigateToVids ?? true;

  if (navigateToVids) {
    log(
      "info",
      "Complete Google sign-in in the browser window. When Google Vids loads and you are signed in, return here.",
    );
    await page.goto(VIDS_NEW_URL, { waitUntil: "domcontentloaded" });
  } else {
    log(
      "info",
      "Complete Google sign-in in the Chrome window you opened, then return here.",
    );
  }

  if (/signin\/rejected/i.test(page.url())) {
    throw new Error(
      [
        "Google rejected sign-in (signin/rejected), often due to --no-sandbox or automation flags.",
        "Use CDP login instead:",
        "  1. npm run chrome:debug",
        "  2. Sign in in that Chrome window",
        "  3. npm run login:cdp",
        "Run login from Windows PowerShell if Chrome is on Windows (not WSL).",
      ].join("\n"),
    );
  }

  await waitForEnter(
    "Press Enter in this terminal after you have finished signing in… ",
  );

  if (/accounts\.google\.com/i.test(page.url())) {
    log(
      "warn",
      "Browser is still on accounts.google.com — auth may be incomplete.",
    );
  }
}

function waitForEnter(prompt: string): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.resume();
    process.stdout.write(prompt);
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}

async function dismissObviousOverlays(page: Page): Promise<void> {
  const dismissLabels = [/close/i, /dismiss/i, /got it/i, /ok/i];
  for (const pattern of dismissLabels) {
    const btn = page.getByRole("button", { name: pattern });
    if (await btn.first().isVisible().catch(() => false)) {
      await btn.first().click().catch(() => undefined);
    }
  }
}

/** Matches "Let's" with straight or curly apostrophe (Google UI). */
function startCreatingHeading(page: Page): Locator {
  // .first(): the newer dialog ("Hello, <name>. Let’s start creating.") matches several
  // elements, and a multi-match makes isVisible() throw (strict mode) → read as "absent".
  return page.getByText(/let.start creating/i).first();
}

async function isGeminiStoryboardPromptVisible(page: Page): Promise<boolean> {
  return page
    .getByPlaceholder(/describe your video/i)
    .first()
    .isVisible({ timeout: 1_000 })
    .catch(() => false);
}

/** Tile picker modal (Blank vid grid) — not the Gemini storyboard dialog. */
async function isStartCreatingModalOpen(page: Page): Promise<boolean> {
  if (!(await startCreatingHeading(page).isVisible({ timeout: 1_000 }).catch(() => false))) {
    return false;
  }
  if (await isGeminiStoryboardPromptVisible(page)) {
    return false;
  }
  return page
    .getByText("Blank vid", { exact: true })
    .isVisible({ timeout: 1_000 })
    .catch(() => false);
}

function storyboardPromptFactories(): Array<(page: Page) => Locator> {
  return [
    (p) => p.getByPlaceholder(/describe your video in a few sentences/i),
    (p) => p.getByPlaceholder(/describe your video/i),
    (p) => p.getByPlaceholder(/type "@" to include files/i),
    (p) =>
      p.getByRole("textbox", {
        name: /describe your video|prompt|storyboard|help me create/i,
      }),
    (p) => p.getByRole("dialog").getByRole("textbox").first(),
    (p) => p.locator('[aria-placeholder*="Describe your video" i]'),
    (p) => p.locator('[contenteditable="true"][role="textbox"]'),
    (p) => p.locator('[contenteditable="true"]').first(),
  ];
}

export async function waitForVidsEditor(page: Page): Promise<void> {
  log("info", "Waiting for Google Vids editor to load…");

  await page
    .waitForURL(/docs\.google\.com\/videos\/d\//, {
      timeout: DEFAULT_NAV_TIMEOUT_MS,
    })
    .catch(() => undefined);

  // Share/menubar are often hidden behind the first-run modal; treat modal as ready too.
  await firstVisible(
    page,
    "Vids editor",
    [
      (p) => startCreatingHeading(p),
      (p) => p.getByRole("dialog").filter({ hasText: /start creating/i }),
      (p) => p.getByRole("button", { name: /^share$/i }),
      (p) => p.getByRole("menubar"),
      (p) => p.getByRole("button", { name: /^play$/i }),
      (p) => p.getByRole("button", { name: /^show timing$/i }),
    ],
    DEFAULT_NAV_TIMEOUT_MS,
  );

  log("info", `Editor ready: ${page.url()}`);
}

/**
 * Vids can be in compact "Hide the menus" mode (Ctrl+Shift+F, remembered per
 * user), which removes the File/Edit/... menubar. Turn the menus back on.
 */
async function ensureMenusVisible(page: Page): Promise<void> {
  const menubar = page.getByRole("menubar").first();
  if (await menubar.isVisible().catch(() => false)) return;

  // Not reachable via getByRole (hidden from the accessibility tree) — use id / label.
  const showMenus = page.locator('#viewModeButton, [aria-label^="Show the menus" i]').first();
  if (await showMenus.isVisible().catch(() => false)) {
    log("info", 'Menus are hidden (compact mode) — clicking "Show the menus".');
    await showMenus.click();
  } else {
    log("info", "Menus are hidden — pressing Ctrl+Shift+F to show them.");
    await page.keyboard.press("Control+Shift+F");
  }
  await menubar.waitFor({ state: "visible", timeout: 10_000 }).catch(() => {
    log("warn", "Menubar still not visible after trying to show the menus.");
  });
}

/** Opens the editor's top-level File menu (shared by Storyboard and export). */
export async function openFileMenu(page: Page): Promise<void> {
  await ensureMenusVisible(page);
  const fileMenu = await firstVisible(page, "File menu", [
    (p) => p.getByRole("menubar").getByRole("menuitem", { name: /^file$/i }),
    (p) => p.getByRole("menuitem", { name: /^file$/i }),
    (p) => p.getByRole("button", { name: /^file$/i }),
  ]);

  await fileMenu.click();
}

export async function openFileStoryboard(page: Page): Promise<void> {
  await openFileMenu(page);

  const storyboardItem = await firstVisible(page, "Storyboard menu item", [
    (p) => p.getByRole("menuitem", { name: /^storyboard$/i }),
    (p) => p.getByRole("menuitem", { name: /storyboard/i }),
  ]);
  await storyboardItem.click();
  log("info", "Opened File → Storyboard.");
}

export async function waitForStoryboardPromptSurface(page: Page): Promise<void> {
  log("info", "Waiting for Storyboard prompt UI (Gemini)…");
  await firstVisible(
    page,
    "Storyboard prompt surface",
    storyboardPromptFactories(),
    DEFAULT_ACTION_TIMEOUT_MS,
  );
}

/** First-run modal: "Let's start creating" — use Blank vid, then File → Storyboard. */
async function clickBlankVid(page: Page): Promise<void> {
  const blankVid = await firstVisible(
    page,
    "Blank vid",
    [
      (p) => p.getByRole("button", { name: /blank vid/i }),
      (p) =>
        p
          .locator('[role="button"], [role="link"]')
          .filter({ hasText: /^Blank vid$/i }),
      (p) => p.getByText("Blank vid", { exact: true }),
    ],
    DEFAULT_ACTION_TIMEOUT_MS,
  );

  try {
    await blankVid.click();
  } catch {
    await page.getByText("Blank vid", { exact: true }).click({ force: true });
  }
}

/**
 * The welcome dialog renders its tiles a few seconds after the editor loads,
 * and isVisible() does not wait — so poll for a while before concluding it is absent.
 */
async function waitForStartCreatingModal(page: Page, timeoutMs = 10_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isStartCreatingModalOpen(page)) return true;
    // Menubar reachable and no modal backdrop → editor is free, no dialog coming.
    const backdrop = await page.locator(".goog-modalpopup-bg").first().isVisible().catch(() => false);
    if (!backdrop && (await page.getByRole("menubar").first().isVisible().catch(() => false))) return false;
    await page.waitForTimeout(UI_POLL_MS);
  }
  return false;
}

export async function handleStartCreatingModal(
  page: Page,
  format: RunOptions["videoFormat"],
): Promise<void> {
  if (!(await waitForStartCreatingModal(page))) {
    // A modal we don't recognise may still be blocking the editor — close it.
    const dialog = page.getByRole("dialog").filter({ hasText: /start creating/i }).first();
    if (await dialog.isVisible().catch(() => false)) {
      log("warn", 'Welcome dialog open without a "Blank vid" tile — closing it.');
      const close = dialog.getByRole("button", { name: /^close$/i }).first();
      if (await close.isVisible().catch(() => false)) await close.click();
      else await page.keyboard.press("Escape");
    }
    return;
  }

  log(
    "info",
    'Closing "Let\'s start creating" modal (Blank vid) so File → Storyboard is available…',
  );

  await selectVideoFormat(page, format);
  await clickBlankVid(page);

  await startCreatingHeading(page)
    .waitFor({ state: "hidden", timeout: DEFAULT_ACTION_TIMEOUT_MS })
    .catch(async () => {
      log("warn", "Modal still open after Blank vid — trying Close / Escape…");
      const close = page.getByRole("button", { name: /^close$/i });
      if (await close.isVisible().catch(() => false)) {
        await close.click();
      } else {
        await page.keyboard.press("Escape");
      }
    });

  if (await isStartCreatingModalOpen(page)) {
    throw new Error(
      'Could not dismiss "Let\'s start creating" modal. Click Blank vid manually, then re-run.',
    );
  }

  log("info", "Start modal dismissed.");
}

async function selectVideoFormat(
  page: Page,
  format: RunOptions["videoFormat"],
): Promise<void> {
  log("info", `Selecting video format (if prompted): ${format}`);

  try {
    await clickNamedControl(page, `format ${format}`, [
      new RegExp(`^${format}$`, "i"),
    ]);
    await page.waitForLoadState("domcontentloaded");
  } catch {
    log(
      "warn",
      "Format picker not found — you may already be past the start screen, or the UI changed.",
    );
  }
}

/**
 * Opens Storyboard / Help me create per Google Vids help docs:
 * File → Storyboard, then enter a prompt.
 */
async function openStoryboardWorkflow(
  page: Page,
  format: RunOptions["videoFormat"],
): Promise<void> {
  log("info", "Opening Storyboard / Help me create workflow…");

  await dismissObviousOverlays(page);
  await handleStartCreatingModal(page, format);

  const inEditor = /docs\.google\.com\/videos\/d\//.test(page.url());

  if (inEditor) {
    await openFileStoryboard(page);
    await waitForStoryboardPromptSurface(page);
    return;
  }

  try {
    await clickNamedControl(page, "Help me create", [/help me create/i]);
    await waitForStoryboardPromptSurface(page);
    return;
  } catch {
    log("info", '"Help me create" not found on start screen.');
  }

  await openFileStoryboard(page);
  await waitForStoryboardPromptSurface(page);
}

export async function findPromptInput(page: Page): Promise<Locator> {
  return firstVisible(
    page,
    "storyboard prompt input",
    storyboardPromptFactories(),
  );
}

function geminiDialog(page: Page): Locator {
  return page
    .getByRole("dialog")
    .filter({ hasText: /gemini|start creating/i })
    .first();
}

async function fillPrompt(page: Page, script: string): Promise<void> {
  log("info", "Entering course script into the prompt field…");
  await waitForStoryboardPromptSurface(page).catch(() => undefined);

  const input = await findPromptInput(page);
  await input.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Backspace");
  try {
    await input.fill(script);
  } catch {
    await page.keyboard.type(script, { delay: 0 });
  }

  const nextInDialog = geminiDialog(page).getByRole("button", { name: /^next$/i });
  const next = (await nextInDialog.isVisible().catch(() => false))
    ? nextInDialog
    : page.getByRole("button", { name: /^next$/i }).first();

  const enabledDeadline = Date.now() + 30_000;
  while (Date.now() < enabledDeadline) {
    if (await next.isEnabled()) {
      log("info", "Prompt entered — Next is enabled.");
      return;
    }
    await page.waitForTimeout(250);
  }

  log("warn", "Next is still disabled after entering the prompt.");
}

/**
 * Instruction text + an "@" attachment of a Drive document. The attachment is
 * added last and verified (a file chip in the prompt); nothing clears the prompt
 * afterwards. `driveName` must match the file name shown in the "@" picker.
 */
export async function attachDriveDocument(page: Page, instruction: string, driveName: string): Promise<void> {
  await waitForStoryboardPromptSurface(page).catch(() => undefined);
  const input = await findPromptInput(page);
  await input.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Backspace");
  await input.fill(instruction);

  // Search by the section code; a freshly uploaded file can take a minute or two
  // to appear in Drive search, so clear and retype until the picker offers it.
  const search = /^[A-Z]+_G\d+_U\d+_S\d+/.exec(driveName)?.[0] ?? driveName.slice(0, 20);
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const option = page
    .locator('[role="option"], [role="menuitem"]')
    .filter({ hasText: new RegExp(escape(driveName.slice(0, 24)), "i") })
    .first();
  let offered = false;
  for (let attempt = 1; attempt <= 8 && !offered; attempt++) {
    await input.click();
    await page.keyboard.press("Control+End");
    await page.keyboard.type(` @${search}`, { delay: 40 });
    offered = await option.waitFor({ state: "visible", timeout: 15_000 }).then(() => true, () => false);
    if (!offered) {
      log("info", `"${driveName}" not in the @ picker yet (attempt ${attempt}/8) — waiting for Drive to index it…`);
      // No Escape here: it closes the whole Gemini dialog, not just the suggestions.
      await input.click();
      await page.keyboard.press("Control+End");
      for (let i = 0; i < search.length + 2; i++) await page.keyboard.press("Backspace");
      await page.waitForTimeout(20_000);
    }
  }
  if (!offered) throw new Error(`"${driveName}" not offered in the Storyboard @ picker after ~5 minutes.`);
  await option.click();
  await page.waitForTimeout(1_500);

  const chips = await input.locator('[contenteditable="false"], a, [data-file-id], [role="link"]').count();
  if (!chips) throw new Error("Drive document chip missing from the Storyboard prompt after selecting it.");
  log("info", `Attached Drive document "${driveName}" to the Storyboard prompt.`);
}

export async function attachDocumentAndInstruction(
  page: Page,
  documentName: string,
  documentContent: string,
  instruction: string,
): Promise<void> {
  log("info", `Entering Storyboard instruction and attaching document "${documentName}"…`);
  await waitForStoryboardPromptSurface(page).catch(() => undefined);

  const input = await findPromptInput(page);
  await input.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Backspace");

  // Attempt to mention/attach file via Google Workspace @ mention menu
  if (documentName) {
    try {
      const cleanDocName = path.basename(documentName, path.extname(documentName));
      await input.type(`@${cleanDocName}`, { delay: 50 });
      await page.waitForTimeout(1500);

      // Check for suggestions in menu
      const menuItem = page
        .locator('[role="menuitem"], [role="option"], .docs-material-menu-item')
        .filter({ hasText: new RegExp(cleanDocName.slice(0, 20), "i") })
        .first();

      if (await menuItem.isVisible({ timeout: 2000 }).catch(() => false)) {
        await menuItem.click();
        log("info", `Attached source document "${cleanDocName}" via Drive mention menu.`);
        await page.waitForTimeout(500);
      } else {
        await page.keyboard.press("Escape").catch(() => undefined);
      }
    } catch (err) {
      log("info", `Drive mention check: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Combine instruction with complete authoritative document content
  const fullPrompt = [
    instruction.trim(),
    "",
    "================================================",
    "ATTACHED SOURCE DOCUMENT",
    "================================================",
    "",
    documentContent.trim(),
  ].join("\n");

  await input.click();
  await page.keyboard.press("Control+a");
  await page.keyboard.press("Backspace");

  try {
    await input.fill(fullPrompt);
  } catch {
    await page.keyboard.type(fullPrompt, { delay: 0 });
  }

  const nextInDialog = geminiDialog(page).getByRole("button", { name: /^next$/i });
  const next = (await nextInDialog.isVisible().catch(() => false))
    ? nextInDialog
    : page.getByRole("button", { name: /^next$/i }).first();

  const enabledDeadline = Date.now() + 30_000;
  while (Date.now() < enabledDeadline) {
    if (await next.isEnabled()) {
      log("info", "Document and prompt instruction entered — Next is enabled.");
      return;
    }
    await page.waitForTimeout(250);
  }

  log("warn", "Next button is still disabled after entering prompt.");
}

export async function clickNext(page: Page): Promise<void> {
  const nextInDialog = geminiDialog(page).getByRole("button", { name: /^next$/i });
  const next = (await nextInDialog.isVisible().catch(() => false))
    ? nextInDialog
    : page.getByRole("button", { name: /^next$/i }).first();

  await next.waitFor({ state: "visible", timeout: DEFAULT_ACTION_TIMEOUT_MS });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (await next.isEnabled()) {
      break;
    }
    await page.waitForTimeout(250);
  }

  if (!(await next.isEnabled())) {
    throw new Error("Next is disabled — prompt may be empty or blocked.");
  }

  await next.click();
  log("info", "Clicked Next — Gemini is generating the outline…");
}

async function isEditOutlineStep(page: Page): Promise<boolean> {
  return page
    .getByText(/edit the outline/i)
    .isVisible({ timeout: 1_000 })
    .catch(() => false);
}

async function isPromptStepVisible(page: Page): Promise<boolean> {
  if (await isEditOutlineStep(page)) {
    return false;
  }
  if (await isDesignSelectionStep(page)) {
    return false;
  }
  return page
    .locator('[aria-placeholder*="Describe your video" i]')
    .first()
    .isVisible({ timeout: 500 })
    .catch(() => false);
}

async function isNextClickable(btn: Locator): Promise<boolean> {
  if (!(await btn.isVisible().catch(() => false))) {
    return false;
  }
  const ariaDisabled = await btn.getAttribute("aria-disabled");
  if (ariaDisabled === "true") {
    return false;
  }
  if (await btn.isEnabled().catch(() => false)) {
    return true;
  }
  return ariaDisabled === "false" || ariaDisabled === null;
}

/** Footer Next on outline/design steps (last matching control). */
async function locateClickableFooterNext(page: Page): Promise<Locator | null> {
  const footerNext = page.getByRole("button", { name: /^next$/i }).last();

  if (await isEditOutlineStep(page)) {
    if (await footerNext.isVisible().catch(() => false)) {
      const aria = await footerNext.getAttribute("aria-disabled");
      if (aria !== "true") {
        return footerNext;
      }
    }
  }

  const enabled = page
    .getByRole("button", { name: /^next$/i, disabled: false })
    .last();
  if (await enabled.isVisible().catch(() => false)) {
    return enabled;
  }

  const buttons = page.getByRole("button", { name: /^next$/i });
  const count = await buttons.count();
  for (let i = count - 1; i >= 0; i--) {
    const btn = buttons.nth(i);
    if (await isNextClickable(btn)) {
      return btn;
    }
  }
  return null;
}

async function clickFooterNextWhenReady(
  page: Page,
  stepLabel: string,
): Promise<void> {
  const deadline = Date.now() + GEMINI_STEP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const next = await locateClickableFooterNext(page);
    if (next) {
      try {
        await next.click({ timeout: 5_000 });
      } catch {
        await next.click({ force: true });
      }
      log("info", `Clicked Next (${stepLabel}).`);
      return;
    }
    await page.waitForTimeout(UI_POLL_MS);
  }
  throw new Error(`No enabled Next button found (${stepLabel}).`);
}

export async function waitForOutlineReady(page: Page): Promise<void> {
  log("info", "Waiting for outline (blue Next or design step)…");

  const deadline = Date.now() + GEMINI_STEP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (await isDesignSelectionStep(page)) {
      log("info", "Outline UI is ready (design step).");
      return;
    }

    if (
      await page
        .getByRole("button", { name: /create the draft video/i })
        .isVisible()
        .catch(() => false)
    ) {
      log("info", "Outline UI is ready (create draft).");
      return;
    }

    if (await isPromptStepVisible(page)) {
      await page.waitForTimeout(UI_POLL_MS);
      continue;
    }

    if (await isEditOutlineStep(page)) {
      if (await locateClickableFooterNext(page)) {
        log("info", "Outline UI is ready (Next enabled).");
        return;
      }
    }

    const tryAgain = page.getByRole("button", { name: /try again/i });
    if (
      (await tryAgain.isVisible().catch(() => false)) &&
      !(await isEditOutlineStep(page))
    ) {
      log("warn", "Gemini outline generation encountered an issue ('Try again' shown). Auto-clicking Try again…");
      await tryAgain.click().catch(() => undefined);
      await page.waitForTimeout(2000);
      continue;
    }

    await page.waitForTimeout(UI_POLL_MS);
  }

  throw new Error("Timed out waiting for Gemini outline generation.");
}

async function isDesignSelectionStep(page: Page): Promise<boolean> {
  return page
    .getByText(/select a design to start with/i)
    .isVisible({ timeout: 1_000 })
    .catch(() => false);
}

async function waitForDesignOrCreateStep(page: Page): Promise<void> {
  await firstVisible(
    page,
    "design or create-draft step",
    [
      (p: Page) => p.getByText(/select a design to start with/i),
      (p: Page) => p.getByRole("button", { name: /create the draft video/i }),
      (p: Page) => p.getByText(/choose a design|pick a (design|style)/i),
    ],
    3 * 60_000,
  );
}

function designTemplateIndexFromEnv(): number {
  /** 1-based in env. Default 5 = center “three people / Your title bar” tile. */
  const raw = process.env.VIDS_DESIGN_INDEX?.trim();
  const oneBased = raw ? Number.parseInt(raw, 10) : 5;
  if (Number.isNaN(oneBased) || oneBased < 1) {
    return 4;
  }
  return oneBased - 1;
}

async function designPickerScope(page: Page): Promise<Locator> {
  const dialog = page
    .getByRole("dialog")
    .filter({ hasText: /select a design to start with/i })
    .last();
  if (await dialog.isVisible().catch(() => false)) {
    return dialog;
  }

  const byRole = page
    .locator('[role="dialog"]')
    .filter({ hasText: /select a design/i })
    .last();
  if (await byRole.isVisible().catch(() => false)) {
    return byRole;
  }

  return page.locator("body");
}

async function isChromeControlButton(btn: Locator): Promise<boolean> {
  const label = (
    (await btn.getAttribute("aria-label")) ??
    (await btn.textContent()) ??
    ""
  ).toLowerCase();
  return /^(close|back|next|help|menu|file|share|play)$/.test(label.trim());
}

async function collectLargeTemplateButtons(scope: Locator): Promise<Locator[]> {
  const buttons = scope.locator('[role="button"], button');
  const total = await buttons.count();
  const tiles: Locator[] = [];

  for (let i = 0; i < total; i++) {
    const btn = buttons.nth(i);
    if (!(await btn.isVisible().catch(() => false))) {
      continue;
    }
    if (await isChromeControlButton(btn)) {
      continue;
    }
    const box = await btn.boundingBox().catch(() => null);
    if (box && box.width >= 90 && box.height >= 55) {
      tiles.push(btn);
    }
  }

  return tiles;
}

async function collectYourTitleTemplateButtons(
  scope: Locator,
): Promise<Locator[]> {
  const labels = scope.getByText(/your title/i);
  const total = await labels.count();
  const tiles: Locator[] = [];

  for (let i = 0; i < total; i++) {
    const label = labels.nth(i);
    if (!(await label.isVisible().catch(() => false))) {
      continue;
    }
    const buttonAncestor = label.locator("xpath=ancestor::*[@role='button'][1]");
    if (await buttonAncestor.count()) {
      tiles.push(buttonAncestor.first());
      continue;
    }
    tiles.push(label);
  }

  return tiles;
}

async function pickAndClickDesignTemplate(
  page: Page,
  index: number,
): Promise<void> {
  const deadline = Date.now() + GEMINI_STEP_TIMEOUT_MS;
  let lastLog = 0;

  while (Date.now() < deadline) {
    const scope = await designPickerScope(page);
    const largeButtons = await collectLargeTemplateButtons(scope);
    if (largeButtons.length >= 3) {
      const pick = Math.min(index, largeButtons.length - 1);
      log(
        "info",
        `Design grid: ${largeButtons.length} large tiles — clicking #${pick + 1}.`,
      );
      const tile = largeButtons[pick]!;
      try {
        await tile.click({ timeout: 10_000 });
      } catch {
        await tile.click({ force: true });
      }
      return;
    }

    const titleButtons = await collectYourTitleTemplateButtons(scope);
    if (titleButtons.length >= 3) {
      const pick = Math.min(index, titleButtons.length - 1);
      log(
        "info",
        `Design grid: ${titleButtons.length} "Your title" tiles — clicking #${pick + 1}.`,
      );
      const tile = titleButtons[pick]!;
      try {
        await tile.click({ timeout: 10_000 });
      } catch {
        await tile.click({ force: true });
      }
      return;
    }

    if (Date.now() - lastLog > 10_000) {
      log(
        "info",
        `Waiting for design templates (${largeButtons.length} large buttons, ${titleButtons.length} title labels)…`,
      );
      lastLog = Date.now();
    }

    await page.waitForTimeout(UI_POLL_MS);
  }

  throw new Error("Design templates did not become visible in time.");
}

async function confirmDesignSelection(page: Page): Promise<void> {
  const createDraft = page.getByRole("button", {
    name: /create the draft video|create video draft|create draft/i,
  });
  if (
    await createDraft
      .waitFor({ state: "visible", timeout: 60_000 })
      .then(() => true)
      .catch(() => false)
  ) {
    await createDraft.click();
    log("info", "Clicked Create the draft video after template selection.");
    return;
  }

  const next = page
    .getByRole("button", { name: /^next$/i, disabled: false })
    .last();
  if (await next.isVisible().catch(() => false)) {
    await next.click();
    log("info", "Clicked Next after template selection.");
  }
}

async function selectDesignTemplate(page: Page): Promise<void> {
  await page
    .getByText(/select a design to start with/i)
    .waitFor({ state: "visible", timeout: DEFAULT_ACTION_TIMEOUT_MS });

  const index = designTemplateIndexFromEnv();
  log(
    "info",
    `Selecting design template #${index + 1} (override with VIDS_DESIGN_INDEX=1..9)…`,
  );

  await pickAndClickDesignTemplate(page, index);
  await confirmDesignSelection(page);
}

export async function createDraftFromOutline(page: Page): Promise<void> {
  log("info", "Selecting a design and creating the draft (if design step appears)…");

  if (
    (await isEditOutlineStep(page)) &&
    !(await isDesignSelectionStep(page))
  ) {
    log("info", "On Edit the outline — advancing with Next…");
    await clickFooterNextWhenReady(page, "outline editor");
    await waitForDesignOrCreateStep(page);
  }

  if (await isDesignSelectionStep(page)) {
    await selectDesignTemplate(page);
    if (!(await isDesignSelectionStep(page))) {
      return;
    }
  }

  const createDraft = page.getByRole("button", {
    name: /create the draft video|create video draft|create draft/i,
  });

  if (await createDraft.isVisible().catch(() => false)) {
    await createDraft.click();
    log("info", "Clicked Create the draft video.");
    return;
  }

  const createAfterStep = page.getByRole("button", {
    name: /create the draft video|create video draft|create draft/i,
  });
  if (
    await createAfterStep
      .waitFor({ state: "visible", timeout: 60_000 })
      .then(() => true)
      .catch(() => false)
  ) {
    await createAfterStep.click();
    log("info", "Clicked Create the draft video.");
    return;
  }

  const designTile = page
    .getByRole("button")
    .filter({ hasText: /design|theme|style|template/i })
    .first();
  if (await designTile.isVisible().catch(() => false)) {
    log("info", "Selecting a design theme…");
    await designTile.click();
  }

  await clickNamedControl(page, "Create the draft video", [
    /create the draft video/i,
    /create video draft/i,
    /create draft/i,
    /^create$/i,
  ]);
}

export async function waitForDraftReady(page: Page): Promise<void> {
  log(
    "info",
    `Waiting up to ${GENERATION_TIMEOUT_MS / 60_000} minutes for draft generation…`,
  );

  const deadline = Date.now() + GENERATION_TIMEOUT_MS;
  let autoRetries = 0;

  while (Date.now() < deadline) {
    // 1. Check for error banners / toasts / "Something went wrong"
    const errorElem = page
      .getByText(/something went wrong|unable to (generate|create)|couldn't (generate|create)|failed to create/i)
      .first();
    if (await errorElem.isVisible().catch(() => false)) {
      const errorText = (await errorElem.textContent().catch(() => ""))?.trim() || "Something went wrong";
      log("warn", `Google Vids error detected: "${errorText}"`);

      const tryAgainBtn = page.getByRole("button", { name: /try again|retry/i }).first();
      if (await tryAgainBtn.isVisible().catch(() => false)) {
        if (autoRetries < 3) {
          autoRetries++;
          log("info", `Auto-clicking 'Try again' button in Google Vids (attempt ${autoRetries}/3)…`);
          await tryAgainBtn.click().catch(() => undefined);
          await page.waitForTimeout(3000);
          continue;
        }
      }

      throw new Error(
        `Google Vids draft generation failed with error: "${errorText}". This is usually a temporary Google Workspace AI backend timeout or quota issue.`,
      );
    }

    // 2. Check for editor success signals.
    // (Not the Share button: it is visible in the editor immediately, long before
    // Gemini has finished — exporting then produced videos with empty media slots.)
    const playBtn = page.getByRole("button", { name: /^play$/i }).first();
    if (await playBtn.isVisible().catch(() => false)) {
      log("info", 'Located "draft editor ready signal" using: play button');
      return;
    }

    // Current Vids editor: Play is not exposed as a button, but the timeline's
    // "Show timing" control (and aria-labelled Play controls) are.
    const showTiming = page.getByRole("button", { name: /^show timing$/i }).first();
    if (await showTiming.isVisible().catch(() => false)) {
      log("info", 'Located "draft editor ready signal" using: timeline "Show timing" control');
      return;
    }

    const playControl = page.locator('[aria-label^="Play" i]').first();
    if (await playControl.isVisible().catch(() => false)) {
      log("info", 'Located "draft editor ready signal" using: aria-label Play control');
      return;
    }

    const sceneTab = page.getByRole("tab", { name: /edit|scenes|timeline/i }).first();
    if (await sceneTab.isVisible().catch(() => false)) {
      log("info", 'Located "draft editor ready signal" using: scenes/timeline tab');
      return;
    }

    const sceneText = page.getByText(/timeline|scene \d+/i).first();
    if (await sceneText.isVisible().catch(() => false)) {
      log("info", 'Located "draft editor ready signal" using: timeline text');
      return;
    }

    // 3. Check for sign-in redirect
    if (/accounts\.google\.com|signin/i.test(page.url())) {
      throw new Error(
        "Google sign-in session expired during draft generation. Run: npm run login:cdp",
      );
    }

    await page.waitForTimeout(1000);
  }

  throw new Error("Timed out waiting for draft video generation.");
}

/** Text Vids shows while Gemini is still producing scenes, media, voiceover, uploading or saving. */
const MEDIA_BUSY_TEXT =
  /generating|creating your|adding (media|images|visuals|video|voiceover|music)|loading media|finding (media|images|visuals)|processing|finishing up|almost (done|there)|please wait|this may take|saving\.\.\.|uploading|uploaded|collaborators|medias until|they're uploaded/i;
/** Text suggesting a media slot failed to generate or load. */
const MEDIA_ERROR_TEXT =
  /content failed to load|(couldn't|could not|unable to|failed to) (load|generate|find|add) (media|image|video|visual)|media (is )?unavailable/i;

type FailedRequest = { host: string; path: string; status: string; type: string };
const failedRequestLog = new WeakMap<BrowserContext, FailedRequest[]>();
/** Telemetry/ads hosts whose failures are irrelevant to media loading. */
const IGNORED_FAILURE_HOSTS = /(^|\.)(play\.google\.com|google-analytics\.com|googletagmanager\.com|doubleclick\.net|googleadservices\.com)$/i;

/** Records failed / 4xx-5xx requests in the context so media load problems can be diagnosed. */
export function recordFailedRequests(context: BrowserContext): void {
  const list: FailedRequest[] = [];
  failedRequestLog.set(context, list);
  const push = (url: string, status: string, type: string) => {
    try {
      const u = new URL(url);
      if (IGNORED_FAILURE_HOSTS.test(u.hostname) || u.protocol === "data:") return;
      list.push({ host: u.hostname, path: u.pathname.slice(0, 80), status, type });
      if (list.length > 300) list.shift();
    } catch {
      // unparsable URL
    }
  };
  context.on("requestfailed", (r) => push(r.url(), r.failure()?.errorText ?? "failed", r.resourceType()));
  context.on("response", (res) => {
    if (res.status() >= 400) push(res.url(), String(res.status()), res.request().resourceType());
  });
}

/** "host status type ×count" lines, most frequent first. */
export function failedRequestSummary(context: BrowserContext, top = 10): string[] {
  const counts = new Map<string, number>();
  for (const f of failedRequestLog.get(context) ?? []) {
    const key = `${f.host} ${f.status} ${f.type}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([k, n]) => `${k} ×${n}`);
}

async function writeNetworkDiagnostics(context: BrowserContext, label: string): Promise<string | undefined> {
  const entries = failedRequestLog.get(context) ?? [];
  if (!entries.length) return undefined;
  await ensureDir(SCREENSHOTS_DIR);
  const file = path.join(SCREENSHOTS_DIR, `${Date.now()}-${label}-network.json`);
  await fs.writeFile(
    file,
    JSON.stringify({ summary: failedRequestSummary(context, 30), recent: entries.slice(-100) }, null, 2),
    "utf8",
  );
  return file;
}

function mediaTimeoutMsFromEnv(): number {
  const raw = process.env.VIDS_MEDIA_TIMEOUT_MIN?.trim();
  const minutes = raw ? Number.parseFloat(raw) : 15;
  return (Number.isFinite(minutes) && minutes > 0 ? minutes : 15) * 60_000;
}

/** Visible busy indicators right now (progress bars, aria-busy, "Generating…" text). */
async function visibleBusySignals(page: Page): Promise<string[]> {
  return page
    .evaluate((busySource) => {
      const busy = new RegExp(busySource, "i");
      const visible = (el: Element) => {
        const box = (el as HTMLElement).getBoundingClientRect();
        const style = getComputedStyle(el);
        return box.width > 0 && box.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      };
      const out: string[] = [];
      for (const el of Array.from(document.querySelectorAll('[role="progressbar"], [aria-busy="true"]'))) {
        if (visible(el)) out.push(`${el.getAttribute("role") ?? "aria-busy"}:${(el.getAttribute("aria-label") ?? "").slice(0, 60)}`);
      }
      // Short leaf-ish text nodes only (status toasts / overlays), not the script text.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = (n.textContent ?? "").trim();
        if (text.length < 4 || text.length > 120 || !busy.test(text)) continue;
        const parent = n.parentElement;
        if (parent && visible(parent) && !parent.closest('[contenteditable="true"], textarea')) out.push(text);
      }
      return Array.from(new Set(out)).slice(0, 8);
    }, MEDIA_BUSY_TEXT.source)
    .catch(() => []);
}

/**
 * The editor appears long before Gemini has finished adding media. Wait until no
 * busy indicator has been visible for a continuous stability window, so the
 * export renders real images/video instead of empty placeholders.
 * Logs every change in busy signals so the real Vids UI states are visible in the log.
 */
export async function waitForDraftMediaReady(page: Page): Promise<void> {
  const STABLE_MS = 45_000;
  const MIN_WAIT_MS = 60_000;
  const timeoutMs = mediaTimeoutMsFromEnv();
  const started = Date.now();
  const deadline = started + timeoutMs;
  let quietSince: number | null = null;
  let lastSignals = "";

  log("info", "Waiting for Gemini to finish adding media/voiceover before export…");

  while (Date.now() < deadline) {
    const signals = await visibleBusySignals(page);
    const key = signals.join(" | ");
    if (key !== lastSignals) {
      log("info", signals.length ? `Still working: ${key}` : "No busy indicators visible.");
      lastSignals = key;
    }

    if (signals.length) {
      quietSince = null;
    } else {
      quietSince ??= Date.now();
      const quietFor = Date.now() - quietSince;
      if (quietFor >= STABLE_MS && Date.now() - started >= MIN_WAIT_MS) {
        log("info", `Media looks settled (quiet for ${Math.round(quietFor / 1000)}s, ${Math.round((Date.now() - started) / 1000)}s total).`);
        break;
      }
    }

    if (/accounts\.google\.com|signin/i.test(page.url())) {
      throw new Error("Google sign-in session expired while waiting for media. Run: npm run login:cdp");
    }
    await page.waitForTimeout(2_000);
  }

  if (Date.now() >= deadline) {
    log("warn", `Media still busy after ${Math.round(timeoutMs / 60_000)} min — exporting anyway (set VIDS_MEDIA_TIMEOUT_MIN to wait longer).`);
  }

  const mediaError = page.getByText(MEDIA_ERROR_TEXT).first();
  if (await mediaError.isVisible().catch(() => false)) {
    log("warn", `Vids reports a media problem: "${(await mediaError.textContent().catch(() => ""))?.trim()}"`);
    const failures = failedRequestSummary(page.context());
    log(
      "warn",
      failures.length
        ? `Failed requests (host status type): ${failures.join("; ")}`
        : "No failed network requests were recorded.",
    );
    const file = await writeNetworkDiagnostics(page.context(), "media-load").catch(() => undefined);
    if (file) log("warn", `Network diagnostics saved: ${file}`);
  }
}

type MediaLoadState = {
  failureToast: boolean;
  uploadingOrSaving: boolean;
  uploadDetail: string;
  total: number;
  notReady: number;
  errored: number;
};

async function isMediaUploadingOrSaving(page: Page): Promise<{ uploading: boolean; detail: string }> {
  return page
    .evaluate(() => {
      const text = document.body.innerText || "";
      const isUploading = /collaborators won't see|until they're uploaded|saving\.\.\.|uploading media/i.test(text);
      if (!isUploading) return { uploading: false, detail: "" };
      const match = text.match(/(collaborators won't see[^\n\r]*|saving\.\.\.|uploading[^\n\r]*)/i);
      return { uploading: true, detail: match ? match[1].slice(0, 80) : "Media uploading/saving in progress" };
    })
    .catch(() => ({ uploading: false, detail: "" }));
}

async function mediaLoadState(page: Page): Promise<MediaLoadState> {
  const failureToast = await page.getByText(MEDIA_ERROR_TEXT).first().isVisible().catch(() => false);
  const uploadInfo = await isMediaUploadingOrSaving(page);
  const videos = await page
    .evaluate(() =>
      Array.from(document.querySelectorAll("video")).map((v) => ({
        ready: v.readyState >= 2,
        errored: v.error !== null,
      })),
    )
    .catch(() => [] as Array<{ ready: boolean; errored: boolean }>);
  return {
    failureToast,
    uploadingOrSaving: uploadInfo.uploading,
    uploadDetail: uploadInfo.detail,
    total: videos.length,
    notReady: videos.filter((v) => !v.ready).length,
    errored: videos.filter((v) => v.errored).length,
  };
}

/**
 * Right after generation Vids points stock clips at temporary copies while Google
 * processes them into Drive; exporting then yields empty placeholders and the
 * editor shows "Content failed to load". Only a *fresh* load of the editor picks
 * up the processed clips. So: reload, let clips load, and export only when a
 * fresh load is clean and uploads are complete; otherwise wait and try again.
 */
export async function waitForMediaLoadable(page: Page): Promise<void> {
  const RETRY_WAIT_MS = 2 * 60_000;
  const SETTLE_MS = 90_000;
  const deadline = Date.now() + mediaTimeoutMsFromEnv();

  for (let attempt = 1; ; attempt++) {
    await reloadEditor(page);

    let state = await mediaLoadState(page);
    const settleDeadline = Date.now() + SETTLE_MS;
    while (Date.now() < settleDeadline) {
      if (state.failureToast || (!state.uploadingOrSaving && state.total > 0 && state.notReady === 0)) break;
      await page.waitForTimeout(3_000);
      state = await mediaLoadState(page);
    }
    // A failure toast can appear shortly after clips report loaded.
    await page.waitForTimeout(5_000);
    state = await mediaLoadState(page);

    const summary = `${state.total} clips, ${state.notReady} not loaded, ${state.errored} errored, failure message: ${state.failureToast ? "yes" : "no"}, uploading/saving: ${state.uploadingOrSaving ? `yes (${state.uploadDetail})` : "no"}`;
    if (!state.failureToast && !state.uploadingOrSaving && state.errored === 0 && state.notReady === 0) {
      log("info", `Media loads cleanly on a fresh editor load (attempt ${attempt}; ${summary}).`);
      return;
    }

    if (Date.now() + RETRY_WAIT_MS > deadline) {
      log("warn", `Media still not loading/uploading cleanly (${summary}) — exporting anyway; the visual check will catch a blank result.`);
      return;
    }
    log("info", `Stock media still processing/uploading (${summary}). Checking again in ${RETRY_WAIT_MS / 60_000} min…`);
    await page.waitForTimeout(RETRY_WAIT_MS);
  }
}

/** Reloads the editor so media gets a fresh chance to load (draft is saved server-side). */
export async function reloadEditor(page: Page): Promise<void> {
  log("info", "Reloading the Vids editor to retry loading media…");
  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForVidsEditor(page);
}

/** Forces Vids to trigger a new render by refreshing the editor state after media settles. */
export async function forceFreshRender(page: Page): Promise<void> {
  log("info", "Ensuring fresh render by checking editor state after media settles…");
  await reloadEditor(page);
}

async function verifyDraftCreated(page: Page): Promise<boolean> {
  const url = page.url();
  const onVids =
    url.includes("vids.google.com") ||
    url.includes("docs.google.com/videos") ||
    url.includes("google.com/videos");

  const editorVisible = await firstVisible(
    page,
    "draft verification",
    [
      (p) => p.getByRole("button", { name: /export|download|share/i }),
      (p) => p.getByText(/timeline|scene \d+/i),
      (p) => p.getByRole("tab", { name: /edit|scenes|timeline/i }),
    ],
    30_000,
  ).catch(() => null);

  const ok = Boolean(onVids && editorVisible);
  log(
    ok ? "info" : "warn",
    ok
      ? "Draft appears to be created (editor signals detected)."
      : `Draft verification inconclusive. URL: ${url}`,
  );
  return ok;
}

export class SelectorFailure extends Error {
  constructor(
    message: string,
    readonly screenshotPath?: string,
  ) {
    super(message);
    this.name = "SelectorFailure";
  }
}

export async function runGoogleVidsDraftFlow(
  options: RunOptions,
): Promise<FlowResult> {
  const launch = options.useCdp
    ? await launchBrowserViaCdp(undefined, { newPage: true })
    : await launchBrowser({
        headless: options.headless,
        slowMoMs: options.slowMoMs,
      });
  const { page, context } = launch;
  recordFailedRequests(context);
  let exportedPath: string | undefined;
  let outlineData: StoryboardOutlineData | undefined;
  let coverageReport: CoverageReport | undefined;

  try {
    if (!options.useCdp && !(await authStateExists())) {
      throw new Error(
        `No saved auth state at ${AUTH_STATE_PATH}. Run: npm run login`,
      );
    }

    if (options.existingDraftUrl) {
      // Export-only: reuse a draft that was already generated (no new Gemini generation).
      await page.goto(options.existingDraftUrl, { waitUntil: "domcontentloaded" });
      log("info", `Opened existing draft ${options.existingDraftUrl}`);
      if (/accounts\.google\.com|signin/i.test(page.url())) {
        throw new Error("Redirected to Google sign-in. Session may have expired — run: npm run login:cdp");
      }
      await waitForVidsEditor(page);
      await waitForDraftReady(page);
    } else {
      let script = "";
      if (options.preparedMarkdown) {
        script = options.preparedMarkdown;
      } else if (options.scriptPath) {
        script = await readScript(options.scriptPath);
      }
      log("info", `Source content ready (${script.length} chars)`);

      await page.goto(VIDS_NEW_URL, { waitUntil: "domcontentloaded" });
      log("info", `Opened ${VIDS_NEW_URL}`);

      if (/accounts\.google\.com|signin/i.test(page.url())) {
        throw new Error(
          "Redirected to Google sign-in. Session may have expired — run: npm run login:cdp",
        );
      }

      await waitForVidsEditor(page);
      await handleStartCreatingModal(page, options.videoFormat);
      await openStoryboardWorkflow(page, options.videoFormat);
      await captureCheckpoint(page, "checkpoint-1-storyboard-opened");

      const docName = options.preparedDocPath || options.scriptPath || "course_document";
      const instruction = options.storyboardInstruction || getStoryboardInstruction();

      if (options.driveDocName) {
        await attachDriveDocument(page, instruction, options.driveDocName);
      } else {
        await attachDocumentAndInstruction(page, path.basename(docName), script, instruction);
      }
      await captureCheckpoint(page, "checkpoint-2-source-document-attached");

      await clickNext(page);
      await waitForOutlineReady(page);
      await captureCheckpoint(page, "checkpoint-3-outline-generated");

      // Capture outline
      outlineData = await captureStoryboardOutline(
        page,
        path.basename(docName),
        options.outputDir,
      );
      log("info", `Captured Storyboard outline with ${outlineData.scene_count} scenes.`);

      // Check MUST-COVER CONTENT coverage
      if (options.mustCoverItems && options.mustCoverItems.length > 0) {
        coverageReport = await checkContentCoverage(
          options.mustCoverItems,
          outlineData.raw_text,
          outlineData.scenes,
          options.outputDir,
          outlineData.timestamp,
        );
        log("info", `Coverage diagnostic: ${coverageReport.coveredCount}/${coverageReport.totalMustCover} covered (${coverageReport.coveragePercentage}%).`);
        console.log(`\n${coverageReport.reportText}\n`);
      }

      await createDraftFromOutline(page);
      await captureCheckpoint(page, "checkpoint-4-design-selected");

      await waitForDraftReady(page);
      await captureCheckpoint(page, "checkpoint-5-draft-created");
    }

    const success = await verifyDraftCreated(page);
    if (!success) {
      const screenshotPath = await captureFailure(page, "draft-verification");
      return { success: false, screenshotPath, editorUrl: page.url(), error: "Draft verification inconclusive" };
    }

    if (options.testMode) {
      log("info", "[TEST MODE] Stopping before export/publishing as TEST_MODE=true is set.");
      if (options.pauseAtEnd) {
        log("info", "Test mode completed. Keeping Chrome open so you can inspect the draft in Google Vids.");
        await waitForEnter("\nPress Enter in this terminal to close Chrome and finish... ");
      }
      return {
        success: true,
        editorUrl: page.url(),
        outlineData,
        coverageReport,
      };
    }

    if (options.exporter && options.outputPath) {
      await waitForDraftMediaReady(page);
      await waitForMediaLoadable(page);
      log("info", `Draft ready — exporting with "${options.exporter.name}" exporter…`);
      try {
        const result = await options.exporter.exportVideo({
          page,
          context,
          editorUrl: page.url(),
          baseName: path.parse(options.scriptPath || "video").name,
          outputPath: options.outputPath,
          cdpDownloads: launch.kind === "cdp",
        });
        exportedPath = describeExportResult(result);
        log("info", `FINAL MP4: ${exportedPath}`);
      } catch (err) {
        // Exporter already saved screenshot + diagnostics; keep the draft visible.
        log("error", err instanceof Error ? err.message : String(err));
        if (options.pauseAtEnd) {
          await waitForEnter(
            "\nExport failed. Press Enter to close Chrome (the draft is saved in Vids)... ",
          );
        }
        return {
          success: false,
          screenshotPath: (err as { screenshotPath?: string }).screenshotPath,
          editorUrl: page.url(),
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }

    if (options.pauseAtEnd) {
      log(
        "info",
        exportedPath
          ? "Draft created and exported. Keeping Chrome open."
          : "Draft video created! Keeping Chrome open so you can view, edit, or export.",
      );
      await waitForEnter(
        "\nPress Enter in this terminal to close Chrome and finish the script... ",
      );
    } else if (!exportedPath) {
      log("info", "Stopping after draft creation (no export/download).");
    }

    return {
      success: true,
      outputPath: exportedPath,
      editorUrl: page.url(),
      outlineData,
      coverageReport,
    };
  } catch (err) {
    const screenshotPath = await captureFailure(
      page,
      err instanceof Error ? err.name : "error",
    ).catch(() => undefined);

    const hint =
      err instanceof Error && /Could not find visible element/i.test(err.message)
        ? [
            "",
            "Selector troubleshooting:",
            "  1. Re-run with headed mode (default): npm run start",
            "  2. Open Playwright Inspector: PWDEBUG=1 npm run start  (WSL/macOS/Linux)",
            "     Windows PowerShell: $env:PWDEBUG=1; npm run start",
            "  3. In DevTools, note role/aria-label of the control and update src/googleVids.ts",
            "  4. See README.md section \"Troubleshoot selector failures\"",
          ].join("\n")
        : "";

    if (err instanceof SelectorFailure) {
      log("error", err.message);
    } else if (err instanceof Error) {
      log("error", `${err.message}${hint}`);
    } else {
      log("error", String(err));
    }

    throw Object.assign(err instanceof Error ? err : new Error(String(err)), {
      screenshotPath,
      editorUrl: page.url(),
    });
  } finally {
    if (launch.kind === "cdp") {
      // Your own Chrome stays open; close only the tab this run created.
      await page.close().catch(() => undefined);
    }
    await closeLaunchResult(launch);
  }
}
