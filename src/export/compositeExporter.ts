import { log } from "../googleVids.js";
import {
  type ExportRequest,
  type ExportResult,
  type VideoExporter,
  describeExportResult,
} from "./types.js";

/** Runs several exporters in order (e.g. Drive, then local download). */
export class CompositeVideoExporter implements VideoExporter {
  readonly name: string;

  constructor(private readonly exporters: VideoExporter[]) {
    this.name = exporters.map((e) => e.name).join("+");
  }

  async exportVideo(request: ExportRequest): Promise<ExportResult> {
    const results: ExportResult[] = [];
    for (const exporter of this.exporters) {
      try {
        results.push(await exporter.exportVideo(request));
      } catch (err) {
        const done = results.length
          ? ` (already succeeded: ${results.map(describeExportResult).join(" | ")})`
          : "";
        throw Object.assign(
          new Error(`${err instanceof Error ? err.message : String(err)}${done}`),
          { screenshotPath: (err as { screenshotPath?: string }).screenshotPath },
        );
      }
      log("info", `Exporter "${exporter.name}" done.`);
    }
    return { destination: "multiple", results };
  }
}
