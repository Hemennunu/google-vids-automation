import path from "node:path";
import { cliFlag, cliValue } from "./cliArgs.js";
import {
  type FlowResult,
  type RunOptions,
  authStateExists,
  closeLaunchResult,
  launchBrowser,
  launchBrowserViaCdp,
  log,
  runGoogleVidsDraftFlow,
  saveAuthState,
  waitForManualLogin,
} from "./googleVids.js";
import {
  type ExportMode,
  createExporter,
  outputPathForScript,
  parseExportMode,
} from "./export/index.js";
import { prepareCourseDocument } from "./preparation/documentPreparer.js";
import { BrowserDriveService } from "./drive/driveService.js";

function parseArgs(argv: string[]): {
  login: boolean;
  loginCdp: boolean;
  headless: boolean;
  exportMode: ExportMode;
  scriptPath: string;
  courseSourceFile?: string;
  gapsSourceFile?: string;
  testMode: boolean;
  videoFormat: RunOptions["videoFormat"];
  slowMoMs: number;
  pauseAtEnd: boolean;
  useCdp: boolean;
  existingDraftUrl?: string;
  designIndex?: string;
} {
  const login = argv.includes("--login");
  const loginCdp = argv.includes("--login-cdp");
  const headless = cliFlag(argv, "headless");
  const exportMode = parseExportMode(argv);
  const noPause = cliFlag(argv, "no-pause") || cliFlag(argv, "auto-close");
  const pauseExplicit = cliFlag(argv, "pause") || cliFlag(argv, "keep-open");
  const pauseAtEnd = pauseExplicit || (!headless && !noPause);

  const courseSourceFile =
    cliValue(argv, "course-file") ||
    cliValue(argv, "source") ||
    process.env.COURSE_SOURCE_FILE;

  const gapsSourceFile =
    cliValue(argv, "gaps-file") ||
    cliValue(argv, "gaps") ||
    process.env.GAPS_SOURCE_FILE;

  const testMode =
    cliFlag(argv, "test-mode") ||
    cliFlag(argv, "test") ||
    process.env.TEST_MODE === "true";

  const scriptPath =
    cliValue(argv, "script") ?? path.join("input", "biology-001.txt");

  const formatRaw = cliValue(argv, "format") ?? "Landscape";
  const videoFormat = (
    ["Landscape", "Portrait", "Square"] as const
  ).includes(formatRaw as RunOptions["videoFormat"])
    ? (formatRaw as RunOptions["videoFormat"])
    : "Landscape";

  const slowMoRaw = cliValue(argv, "slow-mo");
  const slowMoMs = slowMoRaw ? Number.parseInt(slowMoRaw, 10) : 0;

  const useCdp = cliFlag(argv, "cdp");
  const existingDraftUrl = cliValue(argv, "draft");

  const designIndex = cliValue(argv, "design-index");
  if (designIndex) {
    process.env.VIDS_DESIGN_INDEX = designIndex;
  }

  return {
    login,
    loginCdp,
    headless,
    exportMode,
    scriptPath,
    courseSourceFile,
    gapsSourceFile,
    testMode,
    videoFormat,
    slowMoMs,
    pauseAtEnd,
    useCdp,
    existingDraftUrl,
    designIndex,
  };
}

async function finishLoginSave(
  launch: Awaited<ReturnType<typeof launchBrowser>>,
): Promise<void> {
  const { context, page } = launch;

  if (/accounts\.google\.com|signin/i.test(page.url())) {
    log(
      "warn",
      "Still on a Google sign-in URL. Save only if you are sure login finished.",
    );
  }

  await saveAuthState(context);
  log(
    "info",
    "Login complete. Auth state saved for future runs. Run: npm run start",
  );
}

async function runLogin(headless: boolean, slowMoMs: number): Promise<void> {
  log("info", "Login mode — browser will stay headed even if --headless is passed.");
  log(
    "info",
    "If Google shows signin/rejected, use: npm run chrome:debug then npm run login:cdp",
  );

  const launch = await launchBrowser({
    headless: false,
    slowMoMs,
    forLogin: true,
  });

  try {
    await waitForManualLogin(launch.page);
    await finishLoginSave(launch);
  } finally {
    await closeLaunchResult(launch);
  }
}

async function runLoginCdp(): Promise<void> {
  log("info", "CDP login — Playwright will not launch Chrome (avoids --no-sandbox).");

  const launch = await launchBrowserViaCdp();

  try {
    await waitForManualLogin(launch.page, { navigateToVids: false });
    await finishLoginSave(launch);
  } finally {
    await closeLaunchResult(launch);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.loginCdp) {
    await runLoginCdp();
    return;
  }

  if (args.login) {
    await runLogin(args.headless, args.slowMoMs);
    return;
  }

  if (!args.useCdp && !(await authStateExists())) {
    log(
      "error",
      "No authentication state found. Run first: npm run login (or chrome:debug + login:cdp)",
    );
    process.exitCode = 1;
    return;
  }

  let preparedDocPath: string | undefined;
  let preparedMarkdown: string | undefined;
  let mustCoverItems: string[] | undefined;

  // PART 1 & 5: Check if document preparation is requested or needed
  if (args.courseSourceFile) {
    log("info", `=== PART 1: DOCUMENT PREPARATION STAGE ===`);
    log("info", `Loading raw course source: ${args.courseSourceFile}`);
    if (args.gapsSourceFile) {
      log("info", `Loading added gaps source: ${args.gapsSourceFile}`);
    }

    const prepResult = await prepareCourseDocument({
      courseSourceFile: args.courseSourceFile,
      gapsSourceFile: args.gapsSourceFile,
      outputDir: path.join(process.cwd(), "outputs", "prepared"),
    });

    log("info", `Structured course document prepared: ${prepResult.wordCount} words.`);
    log("info", `Saved Markdown: ${prepResult.mdPath}`);
    log("info", `Saved Word Doc: ${prepResult.docxPath}`);

    preparedDocPath = prepResult.docxPath;
    preparedMarkdown = prepResult.markdownText;
    mustCoverItems = prepResult.doc.mustCoverContent;

    // PART 8: Google Drive Integration
    log("info", `=== PART 8: GOOGLE DRIVE STAGE ===`);
    const driveService = new BrowserDriveService();
    const driveRes = await driveService.uploadFile(prepResult.docxPath);
    log("info", `Drive Status [${driveRes.status}]: ${driveRes.message || driveRes.fileName}`);
  }

  // PART 9, 10, 11, 12, 13: Google Vids Storyboard Automation Flow
  log("info", `=== GOOGLE VIDS STORYBOARD AUTOMATION ===`);
  if (args.testMode) {
    log("info", `[TEST MODE ACTIVE] Draft will be verified in editor; stop before publishing.`);
  }

  const result: FlowResult = await runGoogleVidsDraftFlow({
    headless: args.headless,
    scriptPath: args.scriptPath,
    courseSourceFile: args.courseSourceFile,
    gapsSourceFile: args.gapsSourceFile,
    preparedDocPath,
    preparedMarkdown,
    mustCoverItems,
    testMode: args.testMode,
    videoFormat: args.videoFormat,
    slowMoMs: args.slowMoMs,
    pauseAtEnd: args.pauseAtEnd,
    useCdp: args.useCdp,
    existingDraftUrl: args.existingDraftUrl,
    exporter: args.testMode ? undefined : createExporter(args.exportMode),
    outputPath: outputPathForScript(args.scriptPath),
    outputDir: path.join(process.cwd(), "outputs"),
  });

  if (!result.success) {
    process.exitCode = 1;
    log("error", `Draft generation was unsuccessful: ${result.error || "Unknown error"}`);
  } else {
    log("info", `Workflow completed successfully.`);
    if (result.editorUrl) {
      log("info", `Final Google Vids Editor URL: ${result.editorUrl}`);
    }
    if (result.outlineData) {
      log("info", `Outline saved: ${result.outlineData.jsonPath || "outputs"}`);
      log("info", `Scenes detected: ${result.outlineData.scene_count}`);
    }
    if (result.coverageReport) {
      log("info", `Coverage Report saved: ${result.coverageReport.jsonPath || "outputs"}`);
      log("info", `Coverage: ${result.coverageReport.coveredCount}/${result.coverageReport.totalMustCover} (${result.coverageReport.coveragePercentage}%)`);
    }
    if (result.outputPath) {
      log("info", `Done. MP4 exported to: ${result.outputPath}`);
    }
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  log("error", message);
  process.exitCode = 1;
});
