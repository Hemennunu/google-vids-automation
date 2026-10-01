import path from "node:path";
import { cliFlag, cliValue } from "../cliArgs.js";
import { BrowserVideoExporter } from "./browserExporter.js";
import { CompositeVideoExporter } from "./compositeExporter.js";
import { DriveUiVideoExporter } from "./driveUiExporter.js";
import type { VideoExporter } from "./types.js";

export const OUTPUT_DIR = path.join(process.cwd(), "output");

/** input/biology-001.txt → <cwd>/output/biology-001.mp4 */
export function outputPathForScript(scriptPath: string): string {
  return path.join(OUTPUT_DIR, `${path.parse(scriptPath).name}.mp4`);
}

/** both = File → Download → MP4 into output/ (visual check), then File → Export to Drive. */
export type ExportMode = "both" | "drive" | "download" | "none";

export function parseExportMode(argv: string[]): ExportMode {
  if (cliFlag(argv, "skip-export")) return "none";
  const raw = cliValue(argv, "export");
  return raw === "drive" || raw === "download" || raw === "none" ? raw : "both";
}

export function createExporter(mode: ExportMode): VideoExporter | undefined {
  switch (mode) {
    case "both":
      // Download first: it is checked for blank media (and re-tried) before the Drive copy is made.
      return new CompositeVideoExporter([new BrowserVideoExporter(), new DriveUiVideoExporter()]);
    case "drive":
      return new DriveUiVideoExporter();
    case "download":
      return new BrowserVideoExporter();
    case "none":
      return undefined;
  }
}
