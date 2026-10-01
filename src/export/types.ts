import type { BrowserContext, Page } from "playwright";

/**
 * Everything an exporter might need. The browser exporters use page/context;
 * a future Google Drive API exporter would use only the editor URL (file id).
 */
export type ExportRequest = {
  page: Page;
  context: BrowserContext;
  /** Vids editor URL, e.g. https://docs.google.com/videos/d/<id>/edit */
  editorUrl: string;
  /** Name derived from the input file, e.g. "biology-001" */
  baseName: string;
  /** Absolute local destination for exporters that save files, e.g. <cwd>/output/biology-001.mp4 */
  outputPath: string;
  /**
   * True when driving the user's own Chrome over CDP: Playwright's download
   * handling does not deliver files there, so Chrome's own download events are used.
   */
  cdpDownloads?: boolean;
};

export type ExportResult =
  | { destination: "local"; filePath: string; sizeBytes: number }
  /** driveUrl is set when the Vids UI exposes a link to the exported file. */
  | { destination: "drive"; driveUrl?: string; message?: string }
  | { destination: "multiple"; results: ExportResult[] };

/** Swap implementations (browser UI today, Drive API later) behind this. */
export interface VideoExporter {
  readonly name: string;
  exportVideo(request: ExportRequest): Promise<ExportResult>;
}

export function describeExportResult(result: ExportResult): string {
  if (result.destination === "multiple") {
    return result.results.map(describeExportResult).join(" | ");
  }
  if (result.destination === "local") {
    return `${result.filePath} (${result.sizeBytes} bytes)`;
  }
  return result.driveUrl
    ? `Google Drive: ${result.driveUrl}`
    : `Google Drive (no link exposed in UI${result.message ? `; UI said: "${result.message}"` : ""})`;
}
