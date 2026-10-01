import type { CourseDocument } from "../types.js";

/**
 * Formats a CourseDocument into the standardized standardized course document format
 * with exact section boundaries and [ADDED GAP] ... [/ADDED GAP] labeling.
 */
export function formatCourseDocumentAsMarkdown(doc: CourseDocument): string {
  const parts: string[] = [];

  // COURSE INFORMATION
  parts.push("================================================");
  parts.push("COURSE INFORMATION");
  parts.push("==================");
  parts.push("");
  parts.push(`Course: ${doc.metadata.course || "Biology"}`);
  parts.push(`Grade: ${doc.metadata.grade || "Grade 9"}`);
  parts.push(`Unit: ${doc.metadata.unit || "Unit 01"}`);
  parts.push(`Section: ${doc.metadata.section || "Section 01"}`);
  parts.push(`Topic: ${doc.metadata.topic || "Introduction"}`);
  parts.push("");

  // SECTION PURPOSE
  parts.push("================================================");
  parts.push("SECTION PURPOSE");
  parts.push("===============");
  parts.push("");
  parts.push(doc.sectionPurpose.trim());
  parts.push("");

  // LEARNING OBJECTIVES
  parts.push("================================================");
  parts.push("LEARNING OBJECTIVES");
  parts.push("===================");
  parts.push("");
  parts.push("By the end of this section, students should be able to:");
  parts.push("");
  doc.learningObjectives.forEach((obj, idx) => {
    parts.push(`${idx + 1}. ${obj.trim()}`);
  });
  parts.push("");

  // MUST-COVER CONTENT
  parts.push("================================================");
  parts.push("MUST-COVER CONTENT");
  parts.push("==================");
  parts.push("");
  parts.push("List every concept that must appear in the generated lesson.");
  parts.push("");
  doc.mustCoverContent.forEach((item, idx) => {
    parts.push(`${idx + 1}. ${item.trim()}`);
  });
  parts.push("");

  // CORE CONCEPTS
  parts.push("================================================");
  parts.push("CORE CONCEPTS");
  parts.push("=============");
  parts.push("");
  doc.coreConcepts.forEach((concept, idx) => {
    parts.push(`${idx + 1}. ${concept.name.trim()}`);
    parts.push("");
    parts.push("Explanation:");
    parts.push(concept.explanation.trim());
    parts.push("");
    parts.push("Key points:");
    if (concept.keyPoints && concept.keyPoints.length > 0) {
      concept.keyPoints.forEach((kp) => parts.push(`- ${kp.trim()}`));
    } else {
      parts.push("- Essential foundational knowledge for this topic.");
    }
    parts.push("");
    parts.push("Example:");
    parts.push(concept.example.trim());
    parts.push("");
    parts.push("Application:");
    parts.push(concept.application.trim());
    parts.push("");
  });

  // KEY TERMS AND DEFINITIONS
  parts.push("================================================");
  parts.push("KEY TERMS AND DEFINITIONS");
  parts.push("=========================");
  parts.push("");
  doc.keyTerms.forEach((kt) => {
    parts.push(`Term: ${kt.term.trim()}`);
    parts.push(`Definition: ${kt.definition.trim()}`);
    parts.push("");
  });

  // COMMON MISCONCEPTIONS
  parts.push("================================================");
  parts.push("COMMON MISCONCEPTIONS");
  parts.push("=====================");
  parts.push("");
  doc.commonMisconceptions.forEach((misc, idx) => {
    parts.push(`${idx + 1}. ${misc.trim()}`);
  });
  parts.push("");

  // ADDED GAPS / REQUIRED ADDITIONS
  parts.push("================================================");
  parts.push("ADDED GAPS / REQUIRED ADDITIONS");
  parts.push("===============================");
  parts.push("");
  if (doc.addedGaps && doc.addedGaps.length > 0) {
    doc.addedGaps.forEach((gap, idx) => {
      parts.push(`Gap ${idx + 1}`);
      parts.push("");
      parts.push("[ADDED GAP]");
      parts.push("");
      parts.push(`Topic: ${gap.topic.trim()}`);
      parts.push("");
      parts.push("Reason:");
      parts.push(gap.reason.trim());
      parts.push("");
      parts.push("Required coverage:");
      parts.push(gap.requiredCoverage.trim());
      parts.push("");
      parts.push("[/ADDED GAP]");
      parts.push("");
    });
  } else {
    parts.push("No added gaps required for this section.");
    parts.push("");
  }

  // LOCAL / REAL-WORLD EXAMPLES
  parts.push("================================================");
  parts.push("LOCAL / REAL-WORLD EXAMPLES");
  parts.push("===========================");
  parts.push("");
  parts.push(doc.localRealWorldExamples.trim());
  parts.push("");

  // SECTION SUMMARY
  parts.push("================================================");
  parts.push("SECTION SUMMARY");
  parts.push("===============");
  parts.push("");
  parts.push("Students should finish the section understanding:");
  parts.push("");
  doc.sectionSummary.forEach((sum, idx) => {
    parts.push(`${idx + 1}. ${sum.trim()}`);
  });
  parts.push("");

  // END OF SOURCE CONTENT
  parts.push("================================================");
  parts.push("END OF SOURCE CONTENT");
  parts.push("=====================");
  parts.push("");

  return parts.join("\n");
}
