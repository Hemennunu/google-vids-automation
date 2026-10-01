import fs from "node:fs/promises";
import path from "node:path";

/**
 * Universal file reader supporting .txt, .md, and .docx formats.
 */
export async function readSourceFile(filePath: string): Promise<string> {
  const resolved = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  try {
    await fs.access(resolved);
  } catch {
    throw new Error(`Source file does not exist: ${resolved}`);
  }

  const ext = path.extname(resolved).toLowerCase();

  if (ext === ".docx") {
    try {
      // Dynamic import of mammoth for reading Word documents
      const mammothModule = await import("mammoth");
      const mammoth = mammothModule.default ?? mammothModule;
      const buffer = await fs.readFile(resolved);
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      if (!text) {
        throw new Error(`DOCX file contains no readable text: ${resolved}`);
      }
      return text;
    } catch (err) {
      throw new Error(
        `Failed to parse DOCX file "${resolved}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  if (ext === ".txt" || ext === ".md" || ext === "") {
    const text = await fs.readFile(resolved, "utf8");
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error(`Source file is empty: ${resolved}`);
    }
    return trimmed;
  }

  throw new Error(
    `Unsupported file format "${ext}" for "${resolved}". Supported formats: .txt, .md, .docx`,
  );
}
