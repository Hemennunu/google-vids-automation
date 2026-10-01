/**
 * Standard Storyboard prompt instruction configuration.
 */

export const LEGACY_STORYBOARD_INSTRUCTION = `Create an educational video based on the attached source document.

Treat the complete source document as the authoritative educational content.

Cover all learning objectives and all items listed under MUST-COVER CONTENT.

Do not omit core concepts, required gap content, important definitions, explanations, examples, or applications merely to make the lesson shorter.

Use the source document to create a logical educational progression.

Organize related concepts into coherent scenes. Each scene should have a clear teaching purpose.

Use examples immediately after or alongside the concepts they explain.

Include important definitions and clarify common misconceptions where relevant.

Maintain the intended grade level and educational context of the course.

Use the available video duration effectively. Do not unnecessarily compress the lesson.

When the content is too large for a single lesson, use multiple logical scenes and sections rather than silently deleting important information.`;

export const COVERAGE_FIRST_STORYBOARD_INSTRUCTION = `Create a complete educational video from the attached source document.

The attached document is the authoritative source for this lesson. Do not treat it as background reading or as material to summarize aggressively.

FIRST PRIORITY: COVERAGE

Cover every item listed in MUST-COVER CONTENT.

Every major concept, required definition, explanation, example, application, misconception, and ADDED GAP marked in the source should appear meaningfully in the lesson.

Do not omit important supporting details when they are necessary to correctly understand a required concept.

Do not replace detailed explanations with only a short mention of the topic.

SECOND PRIORITY: LEARNING OBJECTIVES

Ensure every Learning Objective has a clear teaching path in the generated scenes.

THIRD PRIORITY: TEACHING STRUCTURE

Organize the lesson in a logical teaching progression:

concept → explanation → example/application → clarification where useful.

Keep related material together, but do not merge separate concepts so aggressively that important distinctions disappear.

IMPORTANT DETAIL PRESERVATION

Where the source provides specific examples, mechanisms, comparisons, terminology, calculations, or cause-and-effect relationships that are important to the concept, retain them.

Do not unnecessarily compress:

* definitions
* mechanisms/processes
* examples
* comparisons
* classifications
* cause-and-effect explanations
* scientific terminology
* required gap content

ADDED GAPS

All [ADDED GAP] sections contain intentionally required curriculum additions.

Do not treat them as optional supplementary material.

Give each major gap enough coverage to communicate its central concept accurately.

VIDEO LENGTH

Use as much of the available video duration as is appropriate for complete teaching coverage.

Do not attempt to make the video short merely because the source document is long.

Do not remove important educational content simply to reduce scene count.

The goal is a complete lesson, not a compressed summary.

If two concepts require separate explanations, keep them as separate scenes or clearly distinct portions of scenes.

The final lesson should remain coherent and appropriate for the target grade level.`;

export const ICT_TEACHING_STORYBOARD_INSTRUCTION = `Create a detailed educational teaching video from the attached ICT Master Teaching Document.

The document contains the authoritative course content from the LMS, relevant textbook material, and explicitly identified curriculum gaps.

This must be a TEACHING VIDEO, not a summary video.

Teach the student the concepts progressively.

Start with the necessary context and definitions, then explain the concepts in a logical order.

For every major concept, provide sufficient explanation for a student encountering the concept for the first time.

Where the source provides a mechanism, process, comparison, procedure, example, application, or relationship between concepts, explain it rather than merely naming it.

Use concrete ICT examples to make abstract concepts understandable.

Preserve important technical terminology and explain it in student-friendly language.

Cover every item under MUST-TEACH CONCEPTS.

Cover every learning objective.

Cover all required [ADDED GAP] content.

Do not collapse multiple distinct concepts into one sentence merely to reduce scene count.

Do not convert the lesson into a high-level summary.

Use multiple scenes when necessary to properly teach a concept.

A scene should have a clear teaching purpose.

Prefer this instructional pattern when appropriate:

introduce → explain → demonstrate/example → clarify → connect to next concept.

Use the available video duration to teach the material adequately.

Do not artificially shorten the lesson.

The goal is student understanding and complete teaching coverage, not brevity.`;

/**
 * For the per-section source document attached from Drive with "@"
 * (src/lms/sectionDocument.ts). Kept short: the document carries the content.
 */
export const ICT_SECTION_STORYBOARD_INSTRUCTION = [
  "Create a complete teaching video for Grade {GRADE} ICT students in Ethiopia on \"{TITLE}\",",
  "using the attached source document as the complete and authoritative content.",
  "Teach EVERY item in its MUST-COVER CHECKLIST, each with a clear explanation and an example;",
  "use as many scenes as needed and do not merge or skip items to shorten the video.",
  "Follow the LMS lesson and the textbook content; do not invent facts.",
  "Visuals: choose each image or clip to show the concept the scene teaches (e.g. a database table,",
  "a network diagram, a robot arm, code on a screen); do not add people where the concept does not need them.",
  "Only when a scene shows people or places, make them Ethiopian or African",
  "(e.g. \"Ethiopian students in a computer lab\", \"African farmer using a smartphone\").",
  "Do not mention textbook figure or page numbers.",
  "Source document:",
].join(" ");

export function sectionStoryboardInstruction(grade: string, title: string): string {
  return ICT_SECTION_STORYBOARD_INSTRUCTION.replace("{GRADE}", grade).replace("{TITLE}", title.replace(/"/g, "'"));
}

export const DEFAULT_STORYBOARD_INSTRUCTION = ICT_TEACHING_STORYBOARD_INSTRUCTION;

/**
 * Returns the active Storyboard prompt instruction, allowing override via environment variable.
 */
export function getStoryboardInstruction(overrideType?: "ict-teaching" | "coverage-first" | "legacy" | string): string {
  if (overrideType === "legacy") return LEGACY_STORYBOARD_INSTRUCTION;
  if (overrideType === "coverage-first") return COVERAGE_FIRST_STORYBOARD_INSTRUCTION;
  if (overrideType === "ict-teaching") return ICT_TEACHING_STORYBOARD_INSTRUCTION;

  const envPrompt = process.env.STORYBOARD_INSTRUCTION?.trim();
  if (envPrompt && envPrompt.length > 20) {
    return envPrompt;
  }
  return DEFAULT_STORYBOARD_INSTRUCTION;
}
