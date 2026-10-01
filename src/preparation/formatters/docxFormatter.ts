import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { CourseDocument } from "../types.js";

/**
 * Creates a .docx representation of the standardized course document.
 */
export async function formatCourseDocumentAsDocx(doc: CourseDocument): Promise<Buffer> {
  const children: Paragraph[] = [];

  const addHeader = (text: string) => {
    children.push(
      new Paragraph({
        text,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      }),
    );
  };

  const addSubHeader = (text: string) => {
    children.push(
      new Paragraph({
        text,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 },
      }),
    );
  };

  const addPara = (text: string, bold = false) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text, bold })],
        spacing: { after: 100 },
      }),
    );
  };

  const addBullet = (text: string) => {
    children.push(
      new Paragraph({
        text: `• ${text}`,
        indent: { left: 360 },
        spacing: { after: 60 },
      }),
    );
  };

  // Title / Course Information
  addHeader("COURSE INFORMATION");
  addPara(`Course: ${doc.metadata.course || "Biology"}`);
  addPara(`Grade: ${doc.metadata.grade || "Grade 9"}`);
  addPara(`Unit: ${doc.metadata.unit || "Unit 01"}`);
  addPara(`Section: ${doc.metadata.section || "Section 01"}`);
  addPara(`Topic: ${doc.metadata.topic || "Introduction"}`);

  // Section Purpose
  addHeader("SECTION PURPOSE");
  addPara(doc.sectionPurpose);

  // Learning Objectives
  addHeader("LEARNING OBJECTIVES");
  addPara("By the end of this section, students should be able to:");
  doc.learningObjectives.forEach((obj, idx) => {
    addPara(`${idx + 1}. ${obj}`);
  });

  // Must-Cover Content
  addHeader("MUST-COVER CONTENT");
  addPara("List every concept that must appear in the generated lesson:");
  doc.mustCoverContent.forEach((item, idx) => {
    addPara(`${idx + 1}. ${item}`);
  });

  // Core Concepts
  addHeader("CORE CONCEPTS");
  doc.coreConcepts.forEach((concept, idx) => {
    addSubHeader(`${idx + 1}. ${concept.name}`);
    addPara("Explanation:", true);
    addPara(concept.explanation);
    addPara("Key points:", true);
    (concept.keyPoints || []).forEach((kp) => addBullet(kp));
    addPara("Example:", true);
    addPara(concept.example);
    addPara("Application:", true);
    addPara(concept.application);
  });

  // Key Terms and Definitions
  addHeader("KEY TERMS AND DEFINITIONS");
  doc.keyTerms.forEach((kt) => {
    addPara(`${kt.term}: `, true);
    addPara(kt.definition);
  });

  // Common Misconceptions
  addHeader("COMMON MISCONCEPTIONS");
  doc.commonMisconceptions.forEach((misc, idx) => {
    addPara(`${idx + 1}. ${misc}`);
  });

  // Added Gaps
  addHeader("ADDED GAPS / REQUIRED ADDITIONS");
  if (doc.addedGaps && doc.addedGaps.length > 0) {
    doc.addedGaps.forEach((gap, idx) => {
      addSubHeader(`Gap ${idx + 1}: ${gap.topic}`);
      addPara("[ADDED GAP]", true);
      addPara(`Topic: ${gap.topic}`);
      addPara("Reason:", true);
      addPara(gap.reason);
      addPara("Required coverage:", true);
      addPara(gap.requiredCoverage);
      addPara("[/ADDED GAP]", true);
    });
  } else {
    addPara("No added gaps required for this section.");
  }

  // Local / Real-World Examples
  addHeader("LOCAL / REAL-WORLD EXAMPLES");
  addPara(doc.localRealWorldExamples);

  // Section Summary
  addHeader("SECTION SUMMARY");
  addPara("Students should finish the section understanding:");
  doc.sectionSummary.forEach((sum, idx) => {
    addPara(`${idx + 1}. ${sum}`);
  });

  addHeader("END OF SOURCE CONTENT");

  const docxDoc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBuffer(docxDoc);
}
