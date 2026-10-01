# ICT Content Enrichment & Google Vids Automation Pipeline

## 1. Executive Summary

This project implements an end-to-end automated pipeline that bridges the **digital LMS courseware (MyMarian/SharePoint)** and the **official printed textbooks (Ministry of Education Grade 11 & 12 ICT)** to produce comprehensive, gap-enriched educational documents and automated **Google Vids** video lessons.

---

## 2. Complete Pipeline Architecture

The pipeline consists of five interconnected phases:

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: LMS Scraper (SharePoint / Local Courseware)       │
│  - Extracts lessons, units, sections, exercises             │
│  - Stores: input/_source/ICT_*.txt                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│  Phase 2: Textbook OCR Pipeline (HuggingFace ZeroGPU)       │
│  - Scans printed PDFs: input/Textbooks/grade-11/12-*.pdf    │
│  - Extracts full OCR text: input/_source/textbook_G*.txt    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│  Phase 3: Topic & Section Matcher                           │
│  - Tokenizes section titles, headings, and keywords         │
│  - Maps each LMS section to exact textbook page windows     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│  Phase 4: Gap Detection & Enrichment Engine                 │
│  - Identifies terms, diagrams, and exercises missing in LMS │
│  - Generates: output/ict_enriched/ICT_<CODE>.md             │
│  - Generates: output/ict_enriched/_enrichment_report.csv    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│  Phase 5: Automated Google Vids Video Production            │
│  - Playwright browser automation creates video drafts       │
│  - Storyboard prompt injection + custom theme styling       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Breakdown

### Phase 1: LMS Courseware Ingestion
- **Module**: `src/lms/sections.ts` & `src/prepareSection.ts`
- **Source**: SharePoint courseware folder or local sync (`sharepoint.local.json`).
- **Function**:
  - Parses HTML content cards (`content_LMS.htm`).
  - Cleans formatting, extracts key definitions, Ethiopian context callouts, worked examples, and learning objectives.
  - Outputs full verbatim text to `input/_source/ICT_<CODE>.txt` (e.g. `ICT_G11_U01_S04.txt`).
  - Prepares condensed video briefs in `input/ICT_<CODE>.txt`.

### Phase 2: Textbook OCR Pipeline
- **Module**: `src/ocrTextbooks.ts` & `src/ocr/hfProvider.ts`
- **Source**: `input/Textbooks/grade-11-information-technology-new-curriculum--student-textbook.pdf` and `grade-12-*.pdf`.
- **Engine**: Hugging Face Spaces (`baidu/Unlimited-OCR`) using ZeroGPU acceleration.
- **Features**:
  - Automatically splits PDF into individual pages or batches.
  - Preserves page boundaries: outputs `## Page <N>` headers for precise referencing.
  - Exponential backoff retry logic for ZeroGPU queues and rate limits.
  - Generates `input/_source/textbook_G11_ICT.txt` and `input/_source/textbook_G12_ICT.txt`.

### Phase 3: Textbook-to-Section Matcher
- **Module**: `src/lms/textbookMatcher.ts`
- **Function**:
  - Parses textbook OCR files into indexed pages with headings and paragraphs.
  - Tokenizes LMS section titles and source text, removing stop-words and prioritizing domain-specific keywords (e.g., "DIKW", "Ethernet", "Relational Database", "CPU").
  - Evaluates matching confidence using weighted keyword frequency, heading tags, and Unit number proximity.
  - Resolves the exact page window (e.g., `Pages 12–15`) for each section.

### Phase 4: Gap Detection & Document Enrichment
- **Module**: `src/lms/enricher.ts` & `src/enrichIct.ts`
- **Function**:
  - **Gap Detection**: Identifies technical terms, acronyms, and concepts present in the printed textbook that are absent from the LMS.
  - **Visual & Activity Extraction**: Extracts references to figures (`Figure 1.2: ...`) and classroom activities (`Activity 1.4: ...`).
  - **Output Generation**: Produces a rich Markdown document (`output/ict_enriched/ICT_<CODE>.md`) containing:
    1. **Metadata Summary**: Section code, grade, unit, matched textbook pages, word counts.
    2. **Primary LMS Content**: Clean text from the LMS courseware.
    3. **Textbook Supplement**: Verbatim textbook content for the matched page window.
    4. **Curriculum Gap Analysis**: Missing key terms, diagram callouts, and recommendations for lesson delivery.
  - **CSV Report**: Generates `output/ict_enriched/_enrichment_report.csv` detailing word counts and gap statistics across all 149 ICT sections.

### Phase 5: Google Vids Video Generation
- **Module**: `src/main.ts` & `src/batch.ts`
- **Function**:
  - Launches Playwright with your Google Chrome profile (CDP mode supported).
  - Navigates to Google Vids (`vids.google.com`).
  - Enters storyboard prompts using the enriched section briefs.
  - Configures video style (Ethiopian curriculum theme, professional corporate design).
  - Generates Google Vids draft ready for export and sharing.

---

## 4. How to Run Every Step

### Step 1: Ingest or Verify LMS Sections
```bash
# Verify LMS source files exist
dir input\_source\ICT_*.txt
```

### Step 2: OCR the Printed Textbooks
```bash
# OCR both Grade 11 and Grade 12 textbooks
npm run ocr:textbooks

# Or OCR a single grade
npm run ocr:textbooks -- --grade=11
npm run ocr:textbooks -- --grade=12

# Test with first 10 pages only
npm run ocr:textbooks -- --grade=11 --max-pages=10
```

### Step 3: Run Content Gap Enrichment
```bash
# Enrich all 149 ICT sections
npm run enrich:ict

# Enrich a specific grade or unit
npm run enrich:ict -- --grade=11
npm run enrich:ict -- --grade=11 --unit=01

# Enrich a single section
npm run enrich:ict -- --section=ICT_G11_U01_S04

# Run on the first 10 sections
npm run enrich:ict -- --limit=10
```

### Step 4: Inspect Enriched Documents and Report
- Enriched documents: `output/ict_enriched/ICT_*.md`
- Summary report: `output/ict_enriched/_enrichment_report.csv`

### Step 5: Generate Google Vids Videos
```bash
# Single section video generation
npm run start:cdp -- --input=input/ICT_G11_U01_S04.txt

# Batch processing
npm run batch:cdp -- --grade=11 --unit=01
```

---

## 5. Directory & File Reference

| Path | Purpose |
|---|---|
| `input/Textbooks/` | Source PDF textbooks (Grade 11 & 12 ICT) |
| `input/_source/ICT_*.txt` | Verbatim scraped LMS content for each section |
| `input/_source/textbook_G11_ICT.txt` | OCR text from Grade 11 textbook |
| `input/_source/textbook_G12_ICT.txt` | OCR text from Grade 12 textbook |
| `output/ict_enriched/` | Enriched Markdown files combining LMS + Textbook |
| `output/ict_enriched/_enrichment_report.csv` | Content gap & word count analysis report |
| `src/ocrTextbooks.ts` | OCR runner for textbook PDFs |
| `src/lms/textbookMatcher.ts` | Algorithm for matching sections to textbook pages |
| `src/lms/enricher.ts` | Content diffing & gap analysis engine |
| `src/enrichIct.ts` | CLI entry point for the enrichment workflow |
