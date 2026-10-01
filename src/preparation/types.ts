/**
 * Core type definitions for the Course Document Preparation pipeline.
 */

export interface CourseMetadata {
  course: string;
  grade: string;
  unit: string;
  section: string;
  topic: string;
}

export interface CoreConcept {
  name: string;
  explanation: string;
  keyPoints: string[];
  example: string;
  application: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface GapItem {
  topic: string;
  reason: string;
  requiredCoverage: string;
}

export interface CourseDocument {
  metadata: CourseMetadata;
  sectionPurpose: string;
  learningObjectives: string[];
  mustCoverContent: string[];
  coreConcepts: CoreConcept[];
  keyTerms: KeyTerm[];
  commonMisconceptions: string[];
  addedGaps: GapItem[];
  localRealWorldExamples: string;
  sectionSummary: string[];
}

export interface PreparedDocumentResult {
  doc: CourseDocument;
  markdownText: string;
  mdPath: string;
  docxPath: string;
  baseName: string;
  wordCount: number;
}
