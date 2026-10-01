/**
 * Builds a Storyboard brief for ONE MyMarian LMS section (see src/lms/sections.ts).
 *
 *   npm run prepare:section -- "--section=Biology/Grade 09/Unit 01 - Introduction To Biology/Section_01_Intro"
 */
import { cliValue } from "./cliArgs.js";
import { log } from "./googleVids.js";
import { LmsSource, parseSectionPath, prepareBrief, readSourceConfig } from "./lms/sections.js";

function parseArgs(argv: string[]) {
  const get = (name: string) => cliValue(argv, name);
  return {
    section: get("section"),
    shareUrl: get("share-url"),
    localRoot: get("local-root"),
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.section) {
    throw new Error(
      'Missing --section, e.g. --section="Biology/Grade 09/Unit 01 - Introduction To Biology/Section_01_Intro"',
    );
  }

  const id = parseSectionPath(args.section);
  const source = await LmsSource.open(
    await readSourceConfig({ shareUrl: args.shareUrl, localRoot: args.localRoot }),
  );
  try {
    const prepared = await prepareBrief(source, id);
    if (!prepared) {
      process.exitCode = 1;
      return;
    }
    log("info", `Next: npm run start -- --script=input/${prepared.code}.txt`);
  } finally {
    await source.close();
  }
}

main().catch((err: unknown) => {
  log("error", err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
