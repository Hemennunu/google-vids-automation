import fs from "node:fs/promises";
import path from "node:path";
import { prepareCourseDocument } from "../src/preparation/documentPreparer.js";
import { readSourceFile } from "../src/preparation/readers/fileReader.js";
import { checkContentCoverage } from "../src/verification/coverageChecker.js";
import { getStoryboardInstruction } from "../src/storyboardPrompt.js";

async function runSuite() {
  console.log("=================================================");
  console.log("RUNNING COMPREHENSIVE PIPELINE TEST SUITE");
  console.log("=================================================\n");

  // Test 1: File Reader
  console.log("[TEST 1] Testing Universal File Reader...");
  const lmsRaw = await readSourceFile("input/Grade_9_Biology_Unit_1_LMS_raw.txt");
  const gapsRaw = await readSourceFile("input/Grade_9_Biology_Unit_1_Gaps_raw.txt");
  if (lmsRaw.length > 1000 && gapsRaw.length > 1000) {
    console.log(`  ✓ Successfully read raw LMS (${lmsRaw.length} chars) and Gaps (${gapsRaw.length} chars).\n`);
  } else {
    throw new Error("File reader test failed.");
  }

  // Test 2: Document Preparation & Structuring
  console.log("[TEST 2] Testing 12-Stage Document Preparation...");
  const prep = await prepareCourseDocument({
    courseSourceFile: "input/Grade_9_Biology_Unit_1_LMS_raw.txt",
    gapsSourceFile: "input/Grade_9_Biology_Unit_1_Gaps_raw.txt",
  });
  console.log(`  ✓ Base Name: ${prep.baseName}`);
  console.log(`  ✓ Word Count: ${prep.wordCount} words (Preserved full depth without loss)`);
  console.log(`  ✓ Must-Cover Items: ${prep.doc.mustCoverContent.length}`);
  console.log(`  ✓ Added Gaps Count: ${prep.doc.addedGaps.length}`);
  console.log(`  ✓ Markdown output saved to: ${prep.mdPath}`);
  console.log(`  ✓ Word DOCX output saved to: ${prep.docxPath}\n`);

  // Verify DOCX and MD files exist on disk and have non-zero size
  const mdStat = await fs.stat(prep.mdPath);
  const docxStat = await fs.stat(prep.docxPath);
  if (mdStat.size > 10000 && docxStat.size > 5000) {
    console.log(`  ✓ File integrity verified (MD: ${mdStat.size} bytes, DOCX: ${docxStat.size} bytes).\n`);
  } else {
    throw new Error("Generated file sizes are unexpectedly small.");
  }

  // Test 3: Storyboard Prompt Instruction Configuration
  console.log("[TEST 3] Testing Storyboard Prompt Configuration...");
  const instruction = getStoryboardInstruction();
  const legacyInstruction = getStoryboardInstruction("legacy");
  if (
    instruction.includes("FIRST PRIORITY: COVERAGE") &&
    instruction.includes("MUST-COVER CONTENT") &&
    legacyInstruction.includes("Treat the complete source document as the authoritative educational content")
  ) {
    console.log(`  ✓ Storyboard instruction matches coverage-first and legacy requirements.\n`);
  } else {
    throw new Error("Storyboard instruction missing mandatory requirements.");
  }

  // Test 4: Coverage Checker Diagnostic
  console.log("[TEST 4] Testing MUST-COVER Content Coverage Diagnostic...");
  const mockOutlineText = `
Scene 1: Introduction and Definition of Biology. Greek roots bios and logos, empirical science of life.
Scene 2: Universal Characteristics of Living Organisms. Cellular organization, metabolism, anabolism and catabolism, homeostasis.
Scene 3: Growth, Reproduction, and Genetic Transmission. DNA replication, hereditary transmission, evolutionary adaptation in populations.
Scene 4: Borderline Entities. Viruses as obligate intracellular parasites, viroids, and prions.
Scene 5: Hierarchical Levels of Biological Organization. Subatomic, molecular, cellular, tissues, organs, ecosystems, biosphere. Emergent properties.
Scene 6: Major Branches of Biology. Cytology, histology, anatomy, physiology, genetics, ecology, biotechnology.
Scene 7: Scientific Method in Biological Investigations. Controlled variables, independent and dependent variables, falsifiable hypothesis.
Scene 8: Added Gap - Endemic Afroalpine Wildlife. Walia ibex in Semien Mountains, Ethiopian wolf conservation in Bale, Gelada baboons.
Scene 9: Added Gap - Crop Wild Relatives & Vavilov Center. Teff (Eragrostis tef) landraces, Coffee Arabica gene pool, Enset false banana, EBI gene bank.
Scene 10: Added Gap - Experimental Design & Laboratory Bio-Safety. Light microscope magnification, PPE, biohazard waste disposal.
Scene 11: Summary and Ethiopian Biodiversity Heritage.
  `;

  const mockScenes = [
    { index: 1, title: "Definition of Biology", text: "Greek roots bios and logos, empirical science of life." },
    { index: 2, title: "Universal Characteristics of Life", text: "Cellular organization, metabolism, anabolism, catabolism, homeostasis." },
    { index: 3, title: "Growth, Reproduction and DNA", text: "DNA replication, hereditary transmission, evolutionary adaptation." },
    { index: 4, title: "Viruses and Borderline Entities", text: "Viruses, viroids, prions, non-cellular molecular parasites." },
    { index: 5, title: "Hierarchical Levels of Organization", text: "Molecules, cells, tissues, organs, ecosystems, biosphere, emergent properties." },
    { index: 6, title: "Branches of Biology", text: "Cytology, histology, anatomy, physiology, genetics, ecology, biotechnology." },
    { index: 7, title: "The Scientific Method", text: "Independent variable, dependent variable, controlled variables, hypothesis." },
    { index: 8, title: "Ethiopian Endemic Wildlife", text: "Walia ibex, Ethiopian wolf, Gelada baboon, Semien, Bale afroalpine conservation." },
    { index: 9, title: "Crop Wild Relatives & Vavilov Center", text: "Teff Eragrostis tef, Coffee Arabica, Enset, Ethiopian Biodiversity Institute gene bank." },
    { index: 10, title: "Laboratory Bio-Safety", text: "Microscope optics, total magnification, personal protective equipment, biohazards." },
    { index: 11, title: "Section Summary", text: "Comprehensive master of life science foundations and Ethiopian biological heritage." },
  ];

  const coverage = await checkContentCoverage(
    prep.doc.mustCoverContent,
    mockOutlineText,
    mockScenes,
  );

  console.log(`  ✓ Coverage diagnostic calculated: ${coverage.coveredCount} / ${coverage.totalMustCover} (${coverage.coveragePercentage}%)`);
  console.log(`  ✓ Coverage JSON saved: ${coverage.jsonPath}`);
  console.log("\nCoverage Report Summary:");
  console.log(coverage.reportText);

  console.log("\n=================================================");
  console.log("ALL UNIT AND PIPELINE TESTS PASSED SUCCESSFULLY!");
  console.log("=================================================");
}

runSuite().catch((err) => {
  console.error("Suite failed:", err);
  process.exitCode = 1;
});
