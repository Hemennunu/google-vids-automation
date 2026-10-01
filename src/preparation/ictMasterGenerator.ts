/**
 * ICT Master Teaching Document Generator.
 * Implements full 18-part pedagogical specification for educational teaching video generation.
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

export interface IctMustTeachConcept {
  concept: string;
  definition: string;
  explanation: string;
  howItWorks: string;
  keyCharacteristics: string[];
  relationshipToOtherConcepts: string;
  example: string;
  application: string;
  importantDetails: string[];
}

export interface IctComparisonItem {
  feature: string;
  itemA: string;
  itemB: string;
  notes?: string;
}

export interface IctComparison {
  title: string;
  headers: [string, string, string, string?];
  rows: IctComparisonItem[];
}

export interface IctProcedureStep {
  stepNumber: number;
  stepTitle: string;
  explanation: string;
  keyAction: string;
}

export interface IctProcedure {
  title: string;
  purpose: string;
  steps: IctProcedureStep[];
}

export interface IctGapItem {
  topic: string;
  source: string;
  whyRelevant: string;
  requiredTeachingContent: string;
}

export interface IctMasterTeachingDocument {
  courseInfo: {
    course: string;
    grade: string;
    unit: string;
    section: string;
    topic: string;
    sourceLms: string;
    sourceTextbook: string;
    textbookChapterPages: string;
  };
  sectionPurpose: string;
  learningObjectives: string[];
  prerequisiteKnowledge: string[];
  teachingSequence: string[];
  mustTeachConcepts: IctMustTeachConcept[];
  detailedTeachingContent: {
    sectionHeading: string;
    contentParagraphs: string[];
  }[];
  comparisons: IctComparison[];
  procedures: IctProcedure[];
  concreteExamples: {
    title: string;
    context: string;
    walkthrough: string;
  }[];
  practicalApplications: string[];
  keyTerminology: {
    term: string;
    definition: string;
  }[];
  commonMisconceptions: string[];
  gaps: IctGapItem[];
  realWorldLocalExamples: string[];
  knowledgeChecks: string[];
  sectionSummary: string[];
  sourceTraceability: {
    lmsSource: string;
    textbookSource: string;
    gapSource: string;
    pageRange: string;
  };
}

/** Formats the Master Teaching Document into the standardized Markdown structure. */
export function formatIctMasterMarkdown(doc: IctMasterTeachingDocument): string {
  const lines: string[] = [];

  // 1. COURSE INFORMATION
  lines.push("================================================");
  lines.push("COURSE INFORMATION");
  lines.push("==================");
  lines.push("");
  lines.push(`Course: ${doc.courseInfo.course}`);
  lines.push(`Grade: ${doc.courseInfo.grade}`);
  lines.push(`Unit: ${doc.courseInfo.unit}`);
  lines.push(`Section: ${doc.courseInfo.section}`);
  lines.push(`Topic: ${doc.courseInfo.topic}`);
  lines.push("");
  lines.push(`Source LMS: ${doc.courseInfo.sourceLms}`);
  lines.push(`Source textbook: ${doc.courseInfo.sourceTextbook}`);
  lines.push(`Textbook chapter/pages: ${doc.courseInfo.textbookChapterPages}`);
  lines.push("");

  // 2. SECTION PURPOSE
  lines.push("================================================");
  lines.push("SECTION PURPOSE");
  lines.push("===============");
  lines.push("");
  lines.push(doc.sectionPurpose.trim());
  lines.push("");

  // 3. LEARNING OBJECTIVES
  lines.push("================================================");
  lines.push("LEARNING OBJECTIVES");
  lines.push("===================");
  lines.push("");
  lines.push("By the end of this lesson, students should be able to:");
  lines.push("");
  doc.learningObjectives.forEach((obj, idx) => {
    lines.push(`${idx + 1}. ${obj.trim()}`);
  });
  lines.push("");

  // 4. PREREQUISITE KNOWLEDGE
  lines.push("================================================");
  lines.push("PREREQUISITE KNOWLEDGE");
  lines.push("======================");
  lines.push("");
  doc.prerequisiteKnowledge.forEach((prereq, idx) => {
    lines.push(`${idx + 1}. ${prereq.trim()}`);
  });
  lines.push("");

  // 5. TEACHING SEQUENCE
  lines.push("================================================");
  lines.push("TEACHING SEQUENCE");
  lines.push("=================");
  lines.push("");
  doc.teachingSequence.forEach((seq, idx) => {
    lines.push(`${idx + 1}. ${seq.trim()}`);
  });
  lines.push("");

  // 6. MUST-TEACH CONCEPTS
  lines.push("================================================");
  lines.push("MUST-TEACH CONCEPTS");
  lines.push("===================");
  lines.push("");
  doc.mustTeachConcepts.forEach((item, idx) => {
    lines.push(`### Concept ${idx + 1}: ${item.concept.trim()}`);
    lines.push("");
    lines.push(`Definition: ${item.definition.trim()}`);
    lines.push("");
    lines.push(`Explanation: ${item.explanation.trim()}`);
    lines.push("");
    lines.push(`How it works: ${item.howItWorks.trim()}`);
    lines.push("");
    lines.push("Key characteristics:");
    item.keyCharacteristics.forEach((kc) => lines.push(`* ${kc.trim()}`));
    lines.push("");
    lines.push(`Relationship to other concepts: ${item.relationshipToOtherConcepts.trim()}`);
    lines.push("");
    lines.push(`Example: ${item.example.trim()}`);
    lines.push("");
    lines.push(`Application: ${item.application.trim()}`);
    lines.push("");
    lines.push("Important details:");
    item.importantDetails.forEach((id) => lines.push(`* ${id.trim()}`));
    lines.push("");
  });

  // 7. DETAILED TEACHING CONTENT
  lines.push("================================================");
  lines.push("DETAILED TEACHING CONTENT");
  lines.push("=========================");
  lines.push("");
  doc.detailedTeachingContent.forEach((section) => {
    lines.push(`## ${section.sectionHeading.trim()}`);
    lines.push("");
    section.contentParagraphs.forEach((p) => {
      lines.push(p.trim());
      lines.push("");
    });
  });

  // 8. COMPARISONS
  lines.push("================================================");
  lines.push("COMPARISONS");
  lines.push("===========");
  lines.push("");
  doc.comparisons.forEach((comp) => {
    lines.push(`### ${comp.title}`);
    lines.push("");
    const hasNotes = !!comp.headers[3];
    if (hasNotes) {
      lines.push(`| ${comp.headers[0]} | ${comp.headers[1]} | ${comp.headers[2]} | ${comp.headers[3]} |`);
      lines.push("|---|---|---|---|");
      comp.rows.forEach((r) => {
        lines.push(`| **${r.feature}** | ${r.itemA} | ${r.itemB} | ${r.notes || "-"} |`);
      });
    } else {
      lines.push(`| ${comp.headers[0]} | ${comp.headers[1]} | ${comp.headers[2]} |`);
      lines.push("|---|---|---|");
      comp.rows.forEach((r) => {
        lines.push(`| **${r.feature}** | ${r.itemA} | ${r.itemB} |`);
      });
    }
    lines.push("");
  });

  // 9. PROCESSES / PROCEDURES
  lines.push("================================================");
  lines.push("PROCESSES / PROCEDURES");
  lines.push("======================");
  lines.push("");
  doc.procedures.forEach((proc) => {
    lines.push(`### ${proc.title}`);
    lines.push(`Purpose: ${proc.purpose}`);
    lines.push("");
    proc.steps.forEach((st) => {
      lines.push(`Step ${st.stepNumber}: ${st.stepTitle}`);
      lines.push(`Explanation: ${st.explanation}`);
      lines.push(`Key Action: ${st.keyAction}`);
      lines.push("");
    });
  });

  // 10. EXAMPLES
  lines.push("================================================");
  lines.push("EXAMPLES");
  lines.push("========");
  lines.push("");
  doc.concreteExamples.forEach((ex, idx) => {
    lines.push(`### Example ${idx + 1}: ${ex.title}`);
    lines.push(`Context: ${ex.context}`);
    lines.push(`Walkthrough: ${ex.walkthrough}`);
    lines.push("");
  });

  // 11. PRACTICAL APPLICATIONS
  lines.push("================================================");
  lines.push("PRACTICAL APPLICATIONS");
  lines.push("======================");
  lines.push("");
  doc.practicalApplications.forEach((app, idx) => {
    lines.push(`${idx + 1}. ${app.trim()}`);
  });
  lines.push("");

  // 12. KEY TERMINOLOGY
  lines.push("================================================");
  lines.push("KEY TERMINOLOGY");
  lines.push("===============");
  lines.push("");
  doc.keyTerminology.forEach((kt) => {
    lines.push(`Term: ${kt.term.trim()}`);
    lines.push(`Definition: ${kt.definition.trim()}`);
    lines.push("");
  });

  // 13. COMMON MISCONCEPTIONS
  lines.push("================================================");
  lines.push("COMMON MISCONCEPTIONS");
  lines.push("=====================");
  lines.push("");
  doc.commonMisconceptions.forEach((misc, idx) => {
    lines.push(`${idx + 1}. ${misc.trim()}`);
  });
  lines.push("");

  // 14. LMS + TEXTBOOK GAPS
  lines.push("================================================");
  lines.push("LMS + TEXTBOOK GAPS");
  lines.push("===================");
  lines.push("");
  doc.gaps.forEach((g) => {
    lines.push("[ADDED GAP]");
    lines.push(`Topic: ${g.topic.trim()}`);
    lines.push(`Source: ${g.source.trim()}`);
    lines.push(`Why it is relevant: ${g.whyRelevant.trim()}`);
    lines.push(`Required teaching content: ${g.requiredTeachingContent.trim()}`);
    lines.push("[/ADDED GAP]");
    lines.push("");
  });

  // 15. REAL-WORLD / LOCAL EXAMPLES
  lines.push("================================================");
  lines.push("REAL-WORLD / LOCAL EXAMPLES");
  lines.push("===========================");
  lines.push("");
  doc.realWorldLocalExamples.forEach((ex, idx) => {
    lines.push(`${idx + 1}. ${ex.trim()}`);
  });
  lines.push("");

  // 16. KNOWLEDGE CHECKS
  lines.push("================================================");
  lines.push("KNOWLEDGE CHECKS");
  lines.push("================");
  lines.push("");
  doc.knowledgeChecks.forEach((kc, idx) => {
    lines.push(`${idx + 1}. ${kc.trim()}`);
  });
  lines.push("");

  // 17. SECTION SUMMARY
  lines.push("================================================");
  lines.push("SECTION SUMMARY");
  lines.push("===============");
  lines.push("");
  doc.sectionSummary.forEach((s) => {
    lines.push(`* ${s.trim()}`);
  });
  lines.push("");

  // 18. SOURCE TRACEABILITY
  lines.push("================================================");
  lines.push("SOURCE TRACEABILITY");
  lines.push("===================");
  lines.push("");
  lines.push(`LMS source: ${doc.sourceTraceability.lmsSource}`);
  lines.push(`Textbook source: ${doc.sourceTraceability.textbookSource}`);
  lines.push(`Gap source: ${doc.sourceTraceability.gapSource}`);
  lines.push(`Textbook Page Range: ${doc.sourceTraceability.pageRange}`);
  lines.push("");
  lines.push("================================================");
  lines.push("END OF MASTER TEACHING DOCUMENT");
  lines.push("================================================");
  lines.push("");

  return lines.join("\n");
}

/** Formats the Master Teaching Document into Microsoft Word .docx */
export async function formatIctMasterDocx(doc: IctMasterTeachingDocument): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  const h1 = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
    });

  const h2 = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 80 },
    });

  const p = (text: string, bold = false) =>
    new Paragraph({
      children: [new TextRun({ text, bold })],
      spacing: { after: 100 },
    });

  children.push(h1(`COURSE INFORMATION: ${doc.courseInfo.topic}`));
  children.push(p(`Course: ${doc.courseInfo.course} | Grade: ${doc.courseInfo.grade} | Unit: ${doc.courseInfo.unit}`));
  children.push(p(`Section: ${doc.courseInfo.section} | Textbook: ${doc.courseInfo.textbookChapterPages}`));

  children.push(h1("SECTION PURPOSE"));
  children.push(p(doc.sectionPurpose));

  children.push(h1("LEARNING OBJECTIVES"));
  doc.learningObjectives.forEach((obj, idx) => children.push(p(`${idx + 1}. ${obj}`)));

  children.push(h1("MUST-TEACH CONCEPTS"));
  doc.mustTeachConcepts.forEach((item, idx) => {
    children.push(h2(`${idx + 1}. ${item.concept}`));
    children.push(p(`Definition: ${item.definition}`));
    children.push(p(`Explanation: ${item.explanation}`));
    children.push(p(`How it works: ${item.howItWorks}`));
    children.push(p(`Example: ${item.example}`));
  });

  children.push(h1("DETAILED TEACHING CONTENT"));
  doc.detailedTeachingContent.forEach((sec) => {
    children.push(h2(sec.sectionHeading));
    sec.contentParagraphs.forEach((para) => children.push(p(para)));
  });

  children.push(h1("LMS + TEXTBOOK GAPS"));
  doc.gaps.forEach((g) => {
    children.push(p(`[ADDED GAP] Topic: ${g.topic}`, true));
    children.push(p(`Source: ${g.source}`));
    children.push(p(`Why relevant: ${g.whyRelevant}`));
    children.push(p(`Required content: ${g.requiredTeachingContent}`));
    children.push(p("[/ADDED GAP]\n"));
  });

  children.push(h1("KEY TERMINOLOGY"));
  doc.keyTerminology.forEach((kt) => children.push(p(`${kt.term}: ${kt.definition}`)));

  children.push(h1("SECTION SUMMARY"));
  doc.sectionSummary.forEach((s) => children.push(p(`• ${s}`)));

  const wordDoc = new Document({
    sections: [{ properties: {}, children }],
  });

  return await Packer.toBuffer(wordDoc);
}
