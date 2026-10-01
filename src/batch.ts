/**
 * Batch: MyMarian LMS sections → briefs → Google Vids drafts → MP4 exports.
 *
 *   npm run batch -- --subject=all --types=all --limit=all
 *   npm run batch -- --subject=Biology --grade=09 --types=Intro,Unit_Summary --limit=2
 *
 * Works subject by subject (then grade, unit, section), one video at a time on
 * one account. Progress is recorded in output/batch-log.csv; re-running skips
 * sections already marked "done", so a stopped batch resumes where it left off.
 * Stops cleanly on sign-in / usage-limit signals instead of retrying.
 */
import fs from "node:fs/promises";
import { cliFlag, cliValue } from "./cliArgs.js";
import path from "node:path";
import { type ExportMode, OUTPUT_DIR, createExporter, parseExportMode } from "./export/index.js";
import { authStateExists, ensureDir, log, runGoogleVidsDraftFlow } from "./googleVids.js";
import {
  LmsSource,
  type SectionId,
  prepareBrief,
  readSourceConfig,
  sectionCode,
  sectionType,
} from "./lms/sections.js";

const BATCH_LOG_PATH = path.join(OUTPUT_DIR, "batch-log.csv");
const LOG_COLUMNS = ["timestamp", "code", "section", "status", "seconds", "editor_url", "result", "error"];
const MAX_CONSECUTIVE_FAILURES = 3;

/** Section types that never get a video (project decision), even with --types=all. */
const EXCLUDED_TYPES = new Set(["worked_examples", "key_vocabulary"]);

/** Used when --types is not given. */
const DEFAULT_TYPES = "Intro,Unit_Overview,Main_Lesson_Content,Practical_Investigation,Unit_Summary";

/** Signals that continuing would only fail again (or hammer Google). */
const STOP_PATTERN =
  /sign-in|signin|session (may have )?expired|reached (your|the) (daily )?limit|usage limit|quota (exceeded|reached)|too many requests|try again tomorrow/i;

type BatchArgs = {
  /** Folder names, or "all" = every subject folder in the library. */
  subjects: string[] | "all";
  /** Grade numbers ("09"), or "all". */
  grades: string[] | "all";
  types: string[] | "all";
  unit?: string;
  limit: number;
  exportMode: ExportMode;
  dryRun: boolean;
  delaySeconds: number;
  /** Drive your own Chrome (npm run chrome:debug) instead of launching one. */
  useCdp: boolean;
};

const listOrAll = (raw: string, normalize: (s: string) => string = (s) => s): string[] | "all" =>
  raw.toLowerCase() === "all"
    ? "all"
    : raw.split(",").map((s) => normalize(s.trim())).filter(Boolean);

function parseArgs(argv: string[]): BatchArgs {
  const get = (name: string) => cliValue(argv, name);

  const subjectRaw = get("subject");
  if (!subjectRaw) {
    throw new Error(
      "Usage: npm run batch -- --subject=all|Biology[,Chemistry] [--grade=all|09[,10]] [--types=all|Intro,Unit_Summary] [--unit=01] [--limit=all|N] [--export=both|drive|download] [--dry-run]",
    );
  }

  const limitRaw = get("limit") ?? "1";
  const limit = limitRaw.toLowerCase() === "all" ? Number.POSITIVE_INFINITY : Number.parseInt(limitRaw, 10);
  const delaySeconds = Number.parseInt(get("delay") ?? "30", 10);

  return {
    subjects: listOrAll(subjectRaw),
    grades: listOrAll(get("grade") ?? "all", (g) => (/(\d+)/.exec(g)?.[1] ?? g).padStart(2, "0")),
    types: listOrAll(get("types") ?? DEFAULT_TYPES, (t) => t.toLowerCase()),
    unit: get("unit"),
    limit: Number.isFinite(limit) && limit > 0 ? limit : limit === Number.POSITIVE_INFINITY ? limit : 1,
    exportMode: parseExportMode(argv),
    dryRun: cliFlag(argv, "dry-run"),
    useCdp: cliFlag(argv, "cdp") || process.env.VIDS_USE_CDP === "1",
    delaySeconds: Number.isFinite(delaySeconds) && delaySeconds >= 0 ? delaySeconds : 30,
  };
}

function csvCell(value: string | number | undefined): string {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Codes already exported successfully (status "done") in previous runs. */
async function readDoneCodes(): Promise<Set<string>> {
  const done = new Set<string>();
  const text = await fs.readFile(BATCH_LOG_PATH, "utf8").catch(() => "");
  for (const line of text.split(/\r?\n/).slice(1)) {
    // code (col 2) and status (col 4) never contain commas or quotes.
    const cols = line.split(",");
    if (cols[3] === "done" && cols[1]) done.add(cols[1]);
  }
  return done;
}

async function appendLog(row: Record<string, string | number | undefined>): Promise<void> {
  await ensureDir(OUTPUT_DIR);
  const exists = await fs.access(BATCH_LOG_PATH).then(() => true, () => false);
  const line = LOG_COLUMNS.map((c) => csvCell(row[c])).join(",") + "\n";
  await fs.appendFile(BATCH_LOG_PATH, (exists ? "" : LOG_COLUMNS.join(",") + "\n") + line, "utf8");
}

/** Subject → grade → unit → section, in folder order. */
async function listSections(source: LmsSource, args: BatchArgs): Promise<SectionId[]> {
  const allSubjects = (await source.listFolders("")).filter((s) => !/^[_.]|^assets$/i.test(s));
  const subjects =
    args.subjects === "all"
      ? allSubjects
      : args.subjects.map((wanted) => {
          const match = allSubjects.find((s) => s.toLowerCase() === wanted.toLowerCase());
          if (!match) throw new Error(`Unknown subject "${wanted}". Available: ${allSubjects.join(", ")}`);
          return match;
        });

  const sections: SectionId[] = [];
  for (const subject of subjects) {
    const grades = (await source.listFolders(subject)).filter((g) => {
      const n = /^grade\s*(\d+)/i.exec(g)?.[1];
      return n !== undefined && (args.grades === "all" || args.grades.includes(n.padStart(2, "0")));
    });
    for (const grade of grades) {
      const units = (await source.listFolders(`${subject}/${grade}`)).filter((u) => {
        const n = /unit\s*(\d+)/i.exec(u)?.[1];
        if (n === undefined) return false;
        return !args.unit || Number.parseInt(n, 10) === Number.parseInt(args.unit, 10);
      });
      for (const unit of units) {
        for (const section of await source.listFolders(`${subject}/${grade}/${unit}`)) {
          if (!/^section_\d+_/i.test(section)) continue; // e.g. Assessment_OLX
          const type = sectionType(section).toLowerCase();
          if (EXCLUDED_TYPES.has(type)) continue;
          if (args.types !== "all" && !args.types.includes(type)) continue;
          sections.push({ subject, grade, unit, section });
        }
      }
    }
    log("info", `Found sections: ${subject} → ${sections.filter((s) => s.subject === subject).length}`);
  }
  return sections;
}

/**
 * One video per section, mirroring the LMS folders:
 * output/Biology/Grade 09/Unit 01 - Introduction To Biology/BIO_G09_U01_S01_Intro.mp4
 */
function sectionVideoPath(id: SectionId, code: string): string {
  return path.join(OUTPUT_DIR, id.subject, id.grade, id.unit, `${code}_${sectionType(id.section)}.mp4`);
}

function countBySubject(items: SectionId[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const s of items) counts.set(s.subject, (counts.get(s.subject) ?? 0) + 1);
  return counts;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.dryRun && !args.useCdp && !(await authStateExists())) {
    throw new Error("No Google authentication state found. Run first: npm run login:cdp");
  }

  const done = await readDoneCodes();
  const source = await LmsSource.open(await readSourceConfig());
  const exporter = createExporter(args.exportMode);

  try {
    const sections = await listSections(source, args);
    const pending = sections.filter((s) => !done.has(sectionCode(s)));
    const planned = pending.slice(0, args.limit);
    log("info", args.useCdp ? "Browser: your own Chrome via CDP (npm run chrome:debug must be open)." : "Browser: Playwright-launched Chrome.");

    // Plan summary, per subject.
    const totals = countBySubject(sections);
    const plannedBySubject = countBySubject(planned);
    log("info", "──────── Plan ────────");
    for (const [subject, total] of totals) {
      const doneCount = sections.filter((s) => s.subject === subject && done.has(sectionCode(s))).length;
      log("info", `${subject.padEnd(12)} total ${total}, done ${doneCount}, this run ${plannedBySubject.get(subject) ?? 0}`);
    }
    log("info", `This run: ${planned.length} of ${pending.length} remaining sections.`);

    if (planned.length === 0) return;

    let consecutiveFailures = 0;
    let succeeded = 0;
    let failed = 0;
    let skipped = 0;
    let currentSubject = "";
    let subjectIndex = 0;
    const batchStarted = Date.now();

    for (const [i, id] of planned.entries()) {
      if (id.subject !== currentSubject) {
        currentSubject = id.subject;
        subjectIndex = 0;
        log("info", `════════ Subject: ${currentSubject} (${plannedBySubject.get(currentSubject)} videos this run) ════════`);
      }
      subjectIndex++;
      const code = sectionCode(id);
      const tag = `[${currentSubject} ${subjectIndex}/${plannedBySubject.get(currentSubject)} | overall ${i + 1}/${planned.length}]`;
      log("info", `${tag} ${code} — ${id.grade} / ${id.unit} / ${id.section}`);

      const prepared = await prepareBrief(source, id);
      if (!prepared) {
        skipped++;
        if (!args.dryRun) {
          await appendLog({
            timestamp: new Date().toISOString(),
            code,
            section: `${id.grade}/${id.unit}/${id.section}`,
            status: "skipped",
            error: "no lesson content",
          });
        }
        continue;
      }
      if (args.dryRun) continue;

      const started = Date.now();
      let result: Awaited<ReturnType<typeof runGoogleVidsDraftFlow>>;
      try {
        result = await runGoogleVidsDraftFlow({
          headless: false,
          scriptPath: prepared.briefPath,
          videoFormat: "Landscape",
          slowMoMs: 0,
          pauseAtEnd: false,
          useCdp: args.useCdp,
          exporter,
          outputPath: sectionVideoPath(id, code),
        });
      } catch (err) {
        result = {
          success: false,
          error: err instanceof Error ? err.message : String(err),
          editorUrl: (err as { editorUrl?: string }).editorUrl,
        };
      }

      const seconds = Math.round((Date.now() - started) / 1000);
      await appendLog({
        timestamp: new Date().toISOString(),
        code,
        section: `${id.grade}/${id.unit}/${id.section}`,
        status: result.success ? "done" : "failed",
        seconds,
        editor_url: result.editorUrl,
        result: result.outputPath,
        error: result.error,
      });

      if (result.success) {
        succeeded++;
        consecutiveFailures = 0;
        log("info", `${tag} ✔ ${code} done in ${Math.round(seconds / 60)} min → ${result.outputPath ?? "(no export)"}`);
      } else {
        failed++;
        consecutiveFailures++;
        log("error", `${tag} ✖ ${code} failed: ${result.error ?? "unknown error"}`);

        if (result.error && STOP_PATTERN.test(result.error)) {
          log("error", "Stopping: sign-in or usage-limit problem. Fix it, then re-run the same command to resume.");
          break;
        }
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          log("error", `Stopping: ${consecutiveFailures} failures in a row. Check screenshots/ and ${BATCH_LOG_PATH}.`);
          break;
        }
      }

      const processed = succeeded + failed;
      const avgMin = (Date.now() - batchStarted) / 60_000 / Math.max(processed, 1);
      const remaining = planned.length - (i + 1);
      log(
        "info",
        `Progress: ${succeeded} done, ${failed} failed, ${skipped} skipped, ${remaining} left (~${Math.round((avgMin * remaining) / 60)} h at current pace).`,
      );

      if (remaining > 0 && args.delaySeconds > 0) {
        await new Promise((r) => setTimeout(r, args.delaySeconds * 1000));
      }
    }

    if (args.dryRun) {
      log("info", `Dry run — briefs written, no videos created (${skipped} sections had no content).`);
      return;
    }
    log("info", `Batch finished: ${succeeded} done, ${failed} failed, ${skipped} skipped. Log: ${BATCH_LOG_PATH}`);
    if (failed > 0) process.exitCode = 1;
  } finally {
    await source.close();
  }
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
