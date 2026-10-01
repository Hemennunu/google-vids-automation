import fs from "node:fs/promises";
import path from "node:path";
import { formatCourseDocumentAsDocx } from "./formatters/docxFormatter.js";
import { formatCourseDocumentAsMarkdown } from "./formatters/markdownFormatter.js";
import { readSourceFile } from "./readers/fileReader.js";
import { structureCourseContent } from "./contentStructurer.js";
import type {
  CourseDocument,
  CourseMetadata,
  PreparedDocumentResult,
} from "./types.js";

export interface PrepareOptions {
  courseSourceFile: string;
  gapsSourceFile?: string;
  outputDir?: string;
  fallbackMetadata?: Partial<CourseMetadata>;
  aiProvider?: string;
  aiModel?: string;
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
}

/**
 * 12-Stage modular Course Document Preparation Engine.
 *
 * Stage 1: Load LMS content.
 * Stage 2: Load added-gap content.
 * Stage 3: Extract/identify course metadata.
 * Stage 4: Organize the material into sections.
 * Stage 5: Identify learning objectives.
 * Stage 6: Identify major concepts.
 * Stage 7: Identify definitions and examples.
 * Stage 8: Insert added gaps.
 * Stage 9: Create MUST-COVER CONTENT.
 * Stage 10: Generate the final structured document.
 * Stage 11: Save the resulting file locally (.docx and .md).
 * Stage 12: Prepare result for Google Drive workflow.
 */
export async function prepareCourseDocument(
  options: PrepareOptions,
): Promise<PreparedDocumentResult> {
  // Stage 1: Load LMS content
  if (!options.courseSourceFile) {
    throw new Error("No course source file specified for document preparation.");
  }
  const lmsContent = await readSourceFile(options.courseSourceFile);

  // Stage 2: Load added-gap content (if provided)
  let gapsContent = "";
  if (options.gapsSourceFile) {
    gapsContent = await readSourceFile(options.gapsSourceFile);
  }

  // Stages 3 through 9: Structure the complete document preserving all content
  const doc: CourseDocument = await structureCourseContent(
    lmsContent,
    gapsContent,
    options.fallbackMetadata,
    {
      provider: options.aiProvider,
      model: options.aiModel,
    },
  );

  // Stage 10: Generate formatted representations
  const markdownText = formatCourseDocumentAsMarkdown(doc);
  const docxBuffer = await formatCourseDocumentAsDocx(doc);

  // Stage 11: Save the resulting files locally
  const outDir =
    options.outputDir ||
    path.join(process.cwd(), "outputs", "prepared");
  await fs.mkdir(outDir, { recursive: true });

  // Also ensure output/prepared exists if outputs/ is used, for consistency
  const altOutDir = path.join(process.cwd(), "output", "prepared");
  await fs.mkdir(altOutDir, { recursive: true });

  const rawBaseName = `${doc.metadata.grade}_${doc.metadata.course}_${doc.metadata.unit}_${doc.metadata.section}`
    .replace(/\s+/g, "_");
  const baseName = sanitizeFileName(rawBaseName) || "Course_Section";

  const mdFileName = `${baseName}_prepared.md`;
  const docxFileName = `${baseName}_prepared.docx`;

  const mdPath = path.join(outDir, mdFileName);
  const docxPath = path.join(outDir, docxFileName);

  await fs.writeFile(mdPath, markdownText, "utf8");
  await fs.writeFile(docxPath, docxBuffer);

  // Mirror to output/prepared for maximum compatibility
  await fs.writeFile(path.join(altOutDir, mdFileName), markdownText, "utf8");
  await fs.writeFile(path.join(altOutDir, docxFileName), docxBuffer);

  const wordCount = countWords(markdownText);

  // Stage 12: Result ready for Google Drive / Storyboard
  return {
    doc,
    markdownText,
    mdPath,
    docxPath,
    baseName,
    wordCount,
  };
}
