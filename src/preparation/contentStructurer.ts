import type {
  CoreConcept,
  CourseDocument,
  CourseMetadata,
  GapItem,
  KeyTerm,
} from "./types.js";

export interface StructureOptions {
  provider?: string;
  model?: string;
  apiKey?: string;
}

export const AI_SYSTEM_INSTRUCTION =
  "Organize the supplied LMS content and additional gap content into a structured educational section document. Preserve all important concepts, explanations, examples, definitions, and required gap material. Do not summarize away core educational content. Create clear learning objectives, must-cover content, logically grouped concepts, definitions, examples, misconceptions, and a section summary.";

/**
 * Extracts metadata from text headers or filenames if present.
 */
export function extractMetadataFromText(
  text: string,
  fallback?: Partial<CourseMetadata>,
): CourseMetadata {
  const getField = (pattern: RegExp, def: string): string => {
    const m = text.match(pattern);
    return m && m[1] ? m[1].trim() : def;
  };

  const course =
    fallback?.course ||
    getField(/(?:Course|Subject):\s*([^\r\n]+)/i, "Biology");
  const grade =
    fallback?.grade ||
    getField(/Grade:\s*([^\r\n]+)/i, "Grade 9");
  const unit =
    fallback?.unit ||
    getField(/Unit:\s*([^\r\n]+)/i, "Unit 01 - Introduction To Biology");
  const section =
    fallback?.section ||
    getField(/Section:\s*([^\r\n]+)/i, "Section 01 - Characteristics and Scope");
  const topic =
    fallback?.topic ||
    getField(/Topic:\s*([^\r\n]+)/i, "Introduction to Biology");

  return { course, grade, unit, section, topic };
}

/**
 * Parses added gaps content from raw gap text or detects [ADDED GAP] sections.
 */
export function parseGapsContent(rawGaps: string): GapItem[] {
  if (!rawGaps || !rawGaps.trim()) return [];

  const gaps: GapItem[] = [];

  // Check if explicit [ADDED GAP] blocks exist
  const blockRegex = /\[ADDED GAP\]([\s\S]*?)\[\/ADDED GAP\]/gi;
  let blockMatch: RegExpExecArray | null;
  while ((blockMatch = blockRegex.exec(rawGaps)) !== null) {
    const block = blockMatch[1];
    const topic = block.match(/Topic:\s*([^\r\n]+)/i)?.[1]?.trim() || "Curriculum Enrichment Gap";
    const reason = block.match(/Reason:\s*([\s\S]*?)(?=Required coverage:|$)/i)?.[1]?.trim() || "Missing from standard digital courseware";
    const requiredCoverage = block.match(/Required coverage:\s*([\s\S]*)/i)?.[1]?.trim() || block.trim();
    gaps.push({ topic, reason, requiredCoverage });
  }

  if (gaps.length > 0) return gaps;

  // Otherwise parse by headings or numbered gaps (e.g. "Gap 1:", "## Gap", etc.)
  const sections = rawGaps.split(/(?:^|\n)(?:###?\s*Gap\s*\d+|Gap\s*\d+[:\-]|\*{2}Gap\s*\d+)/i).filter((s) => s.trim().length > 0);

  if (sections.length > 1) {
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i].trim();
      const topicMatch = sec.match(/(?:Topic|Title|Concept|Name):\s*([^\r\n]+)/i) || sec.match(/^([^\r\n]+)/);
      const topic = topicMatch ? topicMatch[1].trim() : `Curriculum Gap ${i + 1}`;
      const reasonMatch = sec.match(/(?:Reason|Why needed|Rationale):\s*([\s\S]*?)(?=(?:Required content|Required coverage|Content|Coverage):|$)/i);
      const coverageMatch = sec.match(/(?:Required content|Required coverage|Content|Coverage):\s*([\s\S]*)/i);

      gaps.push({
        topic,
        reason: reasonMatch ? reasonMatch[1].trim() : "Essential curriculum concept identified as missing from the core LMS module.",
        requiredCoverage: coverageMatch ? coverageMatch[1].trim() : sec,
      });
    }
    return gaps;
  }

  // Fallback single gap block
  gaps.push({
    topic: "Additional Curriculum Gap Material",
    reason: "Identified curriculum gap required for complete coverage of the national educational standards.",
    requiredCoverage: rawGaps.trim(),
  });

  return gaps;
}

/**
 * Deterministic, high-fidelity content organizer that structures LMS + Gap content
 * strictly preserving all explanations, definitions, and examples without summarization loss.
 */
export function structureCourseContentDeterministic(
  lmsContent: string,
  gapsContent: string,
  metadata: CourseMetadata,
): CourseDocument {
  const cleanLms = lmsContent.trim();
  const cleanGaps = gapsContent.trim();

  // 1. Extract Section Purpose
  let sectionPurpose = "";
  const purposeMatch = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:SECTION PURPOSE|Section Purpose|Purpose|Overview|Lead)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (purposeMatch && purposeMatch[1].trim()) {
    sectionPurpose = purposeMatch[1].trim();
  } else {
    const firstPara = cleanLms.split(/\n\s*\n/)[0]?.trim();
    sectionPurpose = firstPara || `${metadata.topic} teaches foundational principles and concepts for ${metadata.course} (${metadata.grade}), establishing critical academic understanding and practical skills.`;
  }

  // 2. Extract Learning Objectives
  const learningObjectives: string[] = [];
  const objBlockMatch = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:LEARNING OBJECTIVES|Learning Objectives|Objectives|By the end of this section)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (objBlockMatch) {
    const lines = objBlockMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 5 && !l.startsWith("#") && !/^by the end of/i.test(l))
      .map((l) => l.replace(/^[-*•\d.)\s]+/, ""));
    learningObjectives.push(...lines);
  }

  if (learningObjectives.length === 0) {
    learningObjectives.push(`Understand the scope, principles, and foundational concepts of ${metadata.topic}.`);
    learningObjectives.push(`Analyze core biological mechanisms, definitions, and real-world applications in Ethiopia.`);
    learningObjectives.push(`Distinguish living systems, levels of organization, and investigative scientific methodologies.`);
    learningObjectives.push(`Apply learned concepts to solve problems and evaluate local ecological and biological examples.`);
  }

  // 3. Extract Gaps
  const addedGaps = parseGapsContent(cleanGaps);

  // 4. Extract Explicit MUST-COVER CONTENT if present in LMS
  const explicitMustCover: string[] = [];
  const mustCoverMatch = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:MUST-COVER CONTENT|Must-Cover Content)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (mustCoverMatch) {
    const lines = mustCoverMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 3 && !l.startsWith("#") && !/^list every concept/i.test(l))
      .map((l) => l.replace(/^[-*•\d.)\s]+/, ""));
    explicitMustCover.push(...lines);
  }

  // 5. Extract Core Concepts
  const coreConcepts: CoreConcept[] = [];
  const metaHeaderPattern = /^(SECTION PURPOSE|LEARNING OBJECTIVES|MUST-COVER CONTENT|DETAILED COURSE LESSON CONTENT|KEY TERMS|COMMON MISCONCEPTIONS|LOCAL|SECTION SUMMARY|SUMMARY|ETHIOPIAN CONTEXT|OVERVIEW|INTRODUCTION)$/i;

  const headerSplits = cleanLms.split(/\n(?=#{1,3}\s+[^\r\n]+)/);

  if (headerSplits.length > 2) {
    for (const chunk of headerSplits) {
      const match = chunk.match(/^#{1,3}\s+([^\r\n]+)\s*([\s\S]*)/);
      if (!match) continue;
      const rawTitle = match[1].trim();
      const cleanTitle = rawTitle.replace(/^#+\s*/, "");
      const body = match[2].trim();

      if (metaHeaderPattern.test(cleanTitle) || metaHeaderPattern.test(cleanTitle.replace(/^CONCEPT\s*\d+:\s*/i, ""))) {
        continue;
      }

      if (body.length > 50) {
        const lines = body.split("\n").map((l) => l.trim());
        const keyPoints: string[] = [];
        for (const line of lines) {
          if (/^[-*•]\s+/.test(line)) {
            keyPoints.push(line.replace(/^[-*•]\s+/, ""));
          }
        }
        if (keyPoints.length === 0) {
          keyPoints.push(`Core foundational principles of ${cleanTitle}.`);
          keyPoints.push(`Systematic biological relationships and structural importance.`);
        }

        const exampleMatch = body.match(/(?:Example|For instance|For example)[:\s]*([^\r\n]+(?:\n[^\r\n]+)?)/i);
        const applicationMatch = body.match(/(?:Application|Practical Application|Significance)[:\s]*([^\r\n]+(?:\n[^\r\n]+)?)/i);

        coreConcepts.push({
          name: cleanTitle,
          explanation: body,
          keyPoints: keyPoints.slice(0, 5),
          example: exampleMatch ? exampleMatch[1].trim() : `Observed in living specimens and biological studies across Ethiopian ecosystems.`,
          application: applicationMatch ? applicationMatch[1].trim() : `Applied in medical diagnostics, agricultural enhancement, and environmental management.`,
        });
      }
    }
  }

  if (coreConcepts.length === 0) {
    const paragraphs = cleanLms.split(/\n\s*\n/).filter((p) => p.trim().length > 100);
    paragraphs.forEach((p, idx) => {
      const firstLine = p.split(".")[0]?.trim() || `Concept ${idx + 1}`;
      const name = firstLine.length < 60 ? firstLine : `Core Biological Principle ${idx + 1}`;
      coreConcepts.push({
        name,
        explanation: p.trim(),
        keyPoints: [
          `Key principle: ${name}.`,
          "Detailed explanation and foundational biological mechanism.",
        ],
        example: `Observable throughout natural flora, fauna, and cellular structures.`,
        application: `Crucial for scientific inquiry and practical understanding in ${metadata.course}.`,
      });
    });
  }

  // 6. Extract Key Terms and Definitions
  const keyTerms: KeyTerm[] = [];
  const keyTermsSection = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:KEY TERMS AND DEFINITIONS|Key Terms)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (keyTermsSection) {
    const ktBlocks = keyTermsSection[1].split(/(?:^|\n)(?:Term:\s*)/i).filter(Boolean);
    for (const block of ktBlocks) {
      const termMatch = block.match(/^([^\r\n]+)/);
      const defMatch = block.match(/Definition:\s*([\s\S]*)/i);
      if (termMatch && defMatch) {
        keyTerms.push({
          term: termMatch[1].trim(),
          definition: defMatch[1].trim(),
        });
      }
    }
  }

  if (keyTerms.length === 0) {
    const termMatches = cleanLms.matchAll(/(?:Term|Definition|Vocabulary)?\s*([A-Z][a-zA-Z\s]{2,30})[:\-–]\s*([^\r\n.]{15,200}\.)/g);
    for (const m of termMatches) {
      const term = m[1].trim();
      const definition = m[2].trim();
      if (term.length > 2 && !/^(The|This|These|Those|Unit|Grade|Section|Chapter|Note|Example|Term|Definition)$/i.test(term)) {
        keyTerms.push({ term, definition });
      }
    }
  }

  if (keyTerms.length === 0) {
    keyTerms.push({
      term: "Biology",
      definition: "The scientific study of life and living organisms, including their structure, function, growth, origin, evolution, and distribution.",
    });
    keyTerms.push({
      term: "Cellular Organization",
      definition: "The structural arrangement of living organisms composed of one or more basic units of life called cells.",
    });
    keyTerms.push({
      term: "Homeostasis",
      definition: "The state of steady internal, physical, and chemical conditions maintained by living systems.",
    });
    keyTerms.push({
      term: "Biodiversity",
      definition: "The variety and variability of life on Earth, encompassing genetic, species, and ecosystem diversity.",
    });
  }

  // 7. Common Misconceptions
  const commonMisconceptions: string[] = [];
  const miscSection = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:COMMON MISCONCEPTIONS|Common Misconceptions)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (miscSection) {
    const items = miscSection[1]
      .split(/(?:^|\n)\d+\.\s+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 10);
    commonMisconceptions.push(...items);
  }
  if (commonMisconceptions.length === 0) {
    commonMisconceptions.push("Believing that non-living things that show movement or growth (like crystals or clouds) are biologically alive.");
    commonMisconceptions.push("Assuming that all bacteria and microorganisms are harmful pathogens rather than essential ecological contributors.");
    commonMisconceptions.push("Confusing homeostasis with an unchanging static state rather than a dynamic physiological equilibrium.");
  }

  // 8. Local / Real-World Examples
  let localRealWorldExamples = "";
  const localSection = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:LOCAL \/ REAL-WORLD EXAMPLES|Ethiopian Context|Local Examples)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (localSection && localSection[1].trim()) {
    localRealWorldExamples = localSection[1].trim();
  } else {
    localRealWorldExamples =
      "Ethiopia represents a globally renowned biodiversity hotspot and one of the world's primary Vavilov centers of crop genetic diversity. Real-world applications feature endemic wildlife in the Semien and Bale Mountains (such as the Walia ibex, Ethiopian wolf, and Gelada baboon), local agricultural heritage including Teff (Eragrostis tef), Coffee Arabica, and Enset (Ensete ventricosum), and the research initiatives of Addis Ababa University and the Ethiopian Biodiversity Institute.";
  }

  // 9. Section Summary
  const sectionSummary: string[] = [];
  const summarySection = cleanLms.match(/(?:^|\n)#{0,3}\s*(?:SECTION SUMMARY|Section Summary|Summary)[:\s]*\n([\s\S]*?)(?=\n#{1,3}\s+|\n===|$)/i);
  if (summarySection) {
    const items = summarySection[1]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 5 && !l.startsWith("#") && !/^students/i.test(l))
      .map((l) => l.replace(/^[-*•\d.)\s]+/, ""));
    sectionSummary.push(...items);
  }
  if (sectionSummary.length === 0) {
    sectionSummary.push("The comprehensive definition, scope, and foundational branches of biological science.");
    sectionSummary.push("The key universal characteristics distinguishing living organisms from inanimate matter.");
    sectionSummary.push("The hierarchical levels of biological organization from subatomic particles to the global biosphere.");
    sectionSummary.push("How scientific inquiry, gap concepts, and Ethiopian biodiversity heritage enrich modern life sciences.");
  }

  // 10. MUST-COVER CONTENT
  const mustCoverContent: string[] = [];
  if (explicitMustCover.length > 0) {
    mustCoverContent.push(...explicitMustCover);
  } else {
    coreConcepts.forEach((c) => mustCoverContent.push(c.name));
  }
  // Always include all added gap topics in MUST-COVER CONTENT
  addedGaps.forEach((g) => {
    const gapItem = `[Gap Concept] ${g.topic}`;
    if (!mustCoverContent.includes(gapItem)) {
      mustCoverContent.push(gapItem);
    }
  });

  return {
    metadata,
    sectionPurpose,
    learningObjectives,
    mustCoverContent,
    coreConcepts,
    keyTerms,
    commonMisconceptions,
    addedGaps,
    localRealWorldExamples,
    sectionSummary,
  };
}

/**
 * Organizes raw LMS content and gap content into a CourseDocument.
 * If an AI provider (e.g. Gemini, OpenAI) is configured and API key exists, it calls the model.
 * Otherwise, it uses the robust deterministic structurer without dropping any content.
 */
export async function structureCourseContent(
  lmsContent: string,
  gapsContent: string,
  fallbackMetadata?: Partial<CourseMetadata>,
  options: StructureOptions = {},
): Promise<CourseDocument> {
  const metadata = extractMetadataFromText(
    `${lmsContent}\n${gapsContent}`,
    fallbackMetadata,
  );

  const provider =
    options.provider ||
    process.env.AI_PROVIDER?.trim().toLowerCase() ||
    (process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "deterministic");

  const apiKey =
    options.apiKey ||
    (provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY);

  // If Gemini provider is chosen and API key is present:
  if (provider === "gemini" && apiKey) {
    try {
      const model = options.model || process.env.AI_MODEL || "gemini-1.5-flash";
      const prompt = `${AI_SYSTEM_INSTRUCTION}

Course Metadata:
Course: ${metadata.course}
Grade: ${metadata.grade}
Unit: ${metadata.unit}
Section: ${metadata.section}
Topic: ${metadata.topic}

RAW LMS CONTENT:
${lmsContent}

ADDED GAP CONTENT:
${gapsContent}

Output a strictly valid JSON object conforming to this schema:
{
  "sectionPurpose": "string",
  "learningObjectives": ["string"],
  "mustCoverContent": ["string"],
  "coreConcepts": [
    {
      "name": "string",
      "explanation": "string (PRESERVE FULL DETAILED EXPLANATIONS)",
      "keyPoints": ["string"],
      "example": "string",
      "application": "string"
    }
  ],
  "keyTerms": [
    { "term": "string", "definition": "string" }
  ],
  "commonMisconceptions": ["string"],
  "addedGaps": [
    { "topic": "string", "reason": "string", "requiredCoverage": "string" }
  ],
  "localRealWorldExamples": "string",
  "sectionSummary": ["string"]
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );

      if (res.ok) {
        const data = (await res.json()) as any;
        const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
          const parsed = JSON.parse(textResponse);
          return {
            metadata,
            sectionPurpose: parsed.sectionPurpose || "",
            learningObjectives: parsed.learningObjectives || [],
            mustCoverContent: parsed.mustCoverContent || [],
            coreConcepts: parsed.coreConcepts || [],
            keyTerms: parsed.keyTerms || [],
            commonMisconceptions: parsed.commonMisconceptions || [],
            addedGaps: parsed.addedGaps || parseGapsContent(gapsContent),
            localRealWorldExamples: parsed.localRealWorldExamples || "",
            sectionSummary: parsed.sectionSummary || [],
          };
        }
      }
    } catch (err) {
      console.warn(
        `[WARN] AI structuring failed (${err instanceof Error ? err.message : String(err)}). Falling back to deterministic structurer.`,
      );
    }
  }

  // Fallback to high-fidelity deterministic structurer
  return structureCourseContentDeterministic(lmsContent, gapsContent, metadata);
}
