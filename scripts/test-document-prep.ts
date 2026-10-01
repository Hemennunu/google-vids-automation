import { prepareCourseDocument } from "../src/preparation/documentPreparer.js";

async function run() {
  console.log("Starting test document preparation...");
  const result = await prepareCourseDocument({
    courseSourceFile: "input/Grade_9_Biology_Unit_1_LMS_raw.txt",
    gapsSourceFile: "input/Grade_9_Biology_Unit_1_Gaps_raw.txt",
  });

  console.log("=== PREPARATION SUCCESSFUL ===");
  console.log("Base Name:", result.baseName);
  console.log("Word Count:", result.wordCount);
  console.log("Markdown Path:", result.mdPath);
  console.log("DOCX Path:", result.docxPath);
  console.log("Must-Cover Items Count:", result.doc.mustCoverContent.length);
  console.log("Must-Cover Items:");
  result.doc.mustCoverContent.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item}`);
  });
  console.log("Added Gaps Count:", result.doc.addedGaps.length);
  result.doc.addedGaps.forEach((gap, idx) => {
    console.log(`  Gap ${idx + 1}: ${gap.topic}`);
  });
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exitCode = 1;
});
