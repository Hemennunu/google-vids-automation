/**
 * OCR module entry point.
 *
 * Re-exports the provider interface and provides a factory function.
 */
export type { OcrOptions, OcrProvider, OcrResult, PageResult } from "./types.js";
import { HuggingFaceOcrProvider } from "./huggingface.js";
import type { OcrProvider } from "./types.js";

export type OcrProviderName = "huggingface";

/** Configuration for creating an OCR provider. */
export type OcrConfig = {
  provider?: OcrProviderName;
  /** HF API token (optional — the public Space works without one). */
  apiKey?: string;
};

/**
 * Create an OCR provider from config.
 *
 * Currently only "huggingface" (HF Spaces, free, no key) is implemented.
 * Adding more is a matter of implementing `OcrProvider` and wiring it here.
 */
export function createOcrProvider(config: OcrConfig = {}): OcrProvider {
  const name = config.provider ?? "huggingface";

  switch (name) {
    case "huggingface":
      return new HuggingFaceOcrProvider();
    default:
      throw new Error(`Unknown OCR provider: "${name}". Available: huggingface`);
  }
}
