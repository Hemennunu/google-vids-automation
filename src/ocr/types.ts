/**
 * OCR provider abstraction.
 *
 * Every concrete provider (HF Spaces, local GPU, future cloud) implements
 * `OcrProvider` so the rest of the pipeline stays backend-agnostic.
 */

/** Per-page OCR result. */
export type PageResult = {
  /** 1-indexed page number. */
  pageNumber: number;
  /** Raw extracted text from the OCR model. */
  text: string;
};

/** Full OCR result for a document (single image or multi-page PDF). */
export type OcrResult = {
  /** Source file that was processed. */
  sourcePath: string;
  /** Concatenated text from all pages. */
  text: string;
  /** Per-page results (single-image inputs have exactly one entry). */
  pages: PageResult[];
  /** Total processing time in milliseconds. */
  elapsedMs: number;
};

/** Options passed to the OCR provider. */
export type OcrOptions = {
  /**
   * OCR mode.
   * - `gundam`: fast, 640 px crop (default, ZeroGPU-friendly)
   * - `base`:   accurate, 1024 px
   */
  mode?: "gundam" | "base";
  /** Prompt sent to the model. Defaults to "document parsing." */
  prompt?: string;
  /** Maximum pages to process from a PDF (default: all). */
  maxPages?: number;
  /** Called after each page completes. */
  onPageDone?: (page: PageResult, total: number) => void;
};

/** Backend-agnostic OCR provider. */
export interface OcrProvider {
  readonly name: string;

  /** Extract text from a single image file. */
  parseImage(imagePath: string, options?: OcrOptions): Promise<OcrResult>;

  /** Extract text from a multi-page PDF. */
  parsePdf(pdfPath: string, options?: OcrOptions): Promise<OcrResult>;

  /** Graceful shutdown (close connections, etc.). */
  close(): Promise<void>;
}
