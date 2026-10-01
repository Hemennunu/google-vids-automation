import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

async function extractTextbook(grade: "11" | "12", pdfFileName: string, outputFileName: string) {
  const pdfPath = path.join(process.cwd(), "input", "Textbooks", pdfFileName);
  const outputPath = path.join(process.cwd(), "input", "_source", outputFileName);

  console.log(`[Textbook Extraction] Processing Grade ${grade} (${pdfFileName})...`);
  const buf = await fs.readFile(pdfPath);
  const parser = new PDFParse({ data: buf });
  await parser.load();
  const info = await parser.getInfo();
  const textResult = await parser.getText();
  const rawText = textResult.text;

  // Split pages by the delimiter pattern "-- N of M --"
  const pages: { pageNum: number; content: string }[] = [];
  const regex = /--\s*(\d+)\s*of\s*(\d+)\s*--/g;
  let lastIndex = 0;
  let lastPageNum = 1;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    if (lastIndex > 0) {
      const pageText = rawText.slice(lastIndex, match.index).trim();
      pages.push({ pageNum: lastPageNum, content: pageText });
    }
    lastPageNum = parseInt(match[1], 10);
    lastIndex = match.index + match[0].length;
  }
  // Add the last page
  if (lastIndex < rawText.length) {
    const pageText = rawText.slice(lastIndex).trim();
    pages.push({ pageNum: lastPageNum, content: pageText });
  }

  console.log(`  ✓ Extracted ${pages.length} pages (Total declared: ${info.total})`);

  let formattedOutput = `================================================================================\n`;
  formattedOutput += `ETHIOPIAN MOE CURRICULUM - GRADE ${grade} INFORMATION TECHNOLOGY STUDENT TEXTBOOK\n`;
  formattedOutput += `Total Pages: ${pages.length}\n`;
  formattedOutput += `Source: ${pdfFileName}\n`;
  formattedOutput += `================================================================================\n\n`;

  for (const p of pages) {
    formattedOutput += `## Page ${p.pageNum}\n\n${p.content}\n\n`;
  }

  await fs.writeFile(outputPath, formattedOutput, "utf8");
  console.log(`  ✓ Saved: ${outputPath} (${formattedOutput.length} characters)\n`);
}

async function main() {
  await extractTextbook(
    "11",
    "grade-11-information-technology-new-curriculum--student-textbook.pdf",
    "textbook_G11_ICT.txt"
  );
  await extractTextbook(
    "12",
    "grade-12-information-technology-new-curriculum--student-textbook.pdf",
    "textbook_G12_ICT.txt"
  );
  console.log("All textbooks extracted successfully!");
}

main().catch(console.error);
