# Google Vids automation (proof of concept)

Small **Node.js + TypeScript + Playwright** prototype to create **one** Google Vids draft from a course script using the **Storyboard / Help me create** flow.

This is intentionally limited:

- One script, one draft — no batch processing
- No Google Drive API
- One MP4 export per run via the normal Vids UI (default: File → Export to Drive and File → Download → output/)
- No quota or security bypass — use **your** Google account and normal product limits

> [!TIP]
> **ICT Curriculum Enrichment Pipeline**: To combine scraped LMS courseware with printed textbook OCR content into unified documents with gap analysis, see the complete guide: [docs/ICT_PIPELINE_EXPLANATION.md](file:///c:/Users/hp/OneDrive/Desktop/google-vids-automation/docs/ICT_PIPELINE_EXPLANATION.md).

## Prerequisites

- **Node.js 20+**
- **WSL Ubuntu 24.04** (recommended on Windows) or Windows Node directly
- A Google account with access to **Google Vids** and AI/Storyboard features (Workspace availability varies)

## Project layout

```text
google-vids-automation/
├── src/
│   ├── main.ts          # CLI entry (login vs automation)
│   └── googleVids.ts    # Playwright flow + locators
├── input/
│   └── biology-001.txt  # Sample Biology course script
├── screenshots/         # Failure screenshots (gitignored)
├── playwright/
│   └── .auth/           # Saved browser session (gitignored)
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## 1. Install dependencies

From the project root (in WSL):

```bash
cd /mnt/c/Users/hp/OneDrive/Desktop/google-vids-automation
npm run setup
```

`npm run setup` runs `npm install` and installs **Chromium** for Playwright.

On first WSL use, Playwright may ask for OS libraries. If launch fails, follow Playwright’s Linux deps hint, for example:

```bash
npx playwright install-deps chromium
```

## 2. First manual Google login (recommended: CDP)

Google often blocks Playwright-launched browsers (`signin/rejected`, banner about **`--no-sandbox`**). The reliable approach is: **you start Chrome**, Playwright only connects to save the session.

Run these from **Windows PowerShell** in the project folder (not WSL), if Chrome is installed on Windows:

```powershell
cd C:\Users\hp\OneDrive\Desktop\google-vids-automation
npm run chrome:debug
```

1. A normal **Google Chrome** window opens at `https://vids.new` (no Playwright flags).
2. Sign in manually (2FA if prompted). Confirm you are **not** on “Couldn’t sign you in”.
3. In the same PowerShell window:

```powershell
npm run login:cdp
```

4. Press **Enter** when signed in. Session is saved to `playwright/.auth/user.json`.

### Alternate: `npm run login`

Uses Playwright to launch Chrome/Edge with automation flags stripped where possible. Use only if CDP login is unavailable.

```bash
npm run login
```

Profile data may also live under `playwright/.user-data/` (gitignored).

### “Couldn’t sign you in” / `signin/rejected`

1. Do **not** use WSL for login if Chrome is on Windows — use PowerShell steps above.
2. Close all Chrome windows from failed attempts.
3. Use **`npm run chrome:debug`** then **`npm run login:cdp`** (recommended).
4. If port 9222 is busy, close other debug Chrome instances or set `CDP_URL=http://127.0.0.1:9333` and change the port in `scripts/open-chrome-for-login.ps1`.

## 3. How authentication state is saved

- Path: `playwright/.auth/user.json`
- Created by `context.storageState()` after you confirm login
- Loaded automatically on `npm run start` (unless you run `npm run login` again)
- Listed in `.gitignore` — **do not commit or share** this file

Treat it like a password: anyone with this file may access your Google session until it expires or is revoked.

## 4. Run the automation

Default script: `input/biology-001.txt`

```bash
npm run start
```

Options (via `tsx src/main.ts`):

| Flag | Purpose |
|------|---------|
| `--login` | Save auth state after manual sign-in (`npm run login`) |
| `--headless` | Run without UI (harder to debug; default is headed) |
| `--script=path/to/file.txt` | Alternate script file |
| `--format=Landscape` | Start-screen format if shown (`Portrait`, `Square`) |
| `--slow-mo=100` | Slow Playwright actions (ms) for debugging |
| `--export=both` | Default: Export to Drive and download to `output/` |
| `--export=drive` | File → Export to Drive only |
| `--export=download` | File → Download → MP4, saved to `output/<input-name>.mp4` |
| `--skip-export` | Stop after draft creation (previous behavior) |
| `--no-pause` | Close Chrome automatically at the end |

Env: `VIDS_EXPORT_TIMEOUT_MIN` (default 30) caps how long to wait for Vids to render the MP4.

Example:

```bash
npx tsx src/main.ts --script=input/biology-001.txt --slow-mo=50
```

### What the run does

1. Launches Chromium with saved auth
2. Opens `https://vids.new`
3. Tries to open **Help me create** or **File → Storyboard**
4. Pastes your script into the prompt field
5. Clicks **Next**, waits for outline
6. Clicks **Create the draft video** (or picks a design when needed)
7. Waits for editor signals
8. Verifies draft-like UI
9. Exports via **File → Export to Drive** and waits for Vids to confirm the export (logs the Drive link if the UI shows one). With `--export=download`: File → Download → MP4 into `output/<input-name>.mp4`, size-checked
10. On export failure: screenshot + `screenshots/*-export-diagnostics.json` (URL, dialogs, menu items, buttons, console errors)

The exporter lives in `src/export/` behind a `VideoExporter` interface so it can later be swapped for a Drive API implementation.

## 4b. Build a brief from a MyMarian LMS section

Reads one section's `content_LMS.htm` from SharePoint (sharing link in gitignored `sharepoint.local.json`) and writes a Storyboard brief named with the MyMarian code (`SUB_Gnn_Unn_Snn`):

```bash
npm run prepare:section -- "--section=Biology/Grade 09/Unit 01 - Introduction To Biology/Section_01_Intro"
npm run start -- --script=input/BIO_G09_U01_S01.txt
```

- `input/<CODE>.txt` — the brief (lesson text condensed, Ethiopian context, vocabulary tables, target length by section type)
- `input/_source/<CODE>.txt` — everything extracted, for review
- If the library is synced locally with OneDrive, use `--local-root=<path to MYMARIAN_LMS_Ready>` (or `"localRoot"` in `sharepoint.local.json`) instead of the sharing link.

## 4c. Batch: many sections → videos

```bash
npm run batch -- --subject=Biology --grade=09 --types=Intro,Unit_Summary --limit=2 --dry-run
npm run batch -- --subject=Biology --grade=09 --types=Intro,Unit_Summary --limit=2
```

- Lists sections from SharePoint, writes a brief per section, then makes one Vids draft at a time and exports it (default `--export=both`: File → Export to Drive **and** File → Download → `output/<Subject>/<Grade>/<Unit>/<CODE>_<SectionType>.mp4`, one video per section).
- `--subject=all` works subject by subject (then grade, unit, section) and prints progress per subject; `--grade=09,10`, `--types=all`, `--unit=03`, `--limit=all`, `--delay=30` seconds between videos.
- Default `--types`: Intro, Unit_Overview, Main_Lesson_Content, Practical_Investigation, Unit_Summary. Worked_Examples and Key_Vocabulary sections are never made into videos (even with `--types=all`).
- Progress: `output/batch-log.csv` (code, status, seconds, draft URL, result, error). Re-running the same command skips sections marked `done`, so a stopped batch resumes; `failed` ones are retried.
- Stops on sign-in / usage-limit messages or 3 failures in a row. One account only; no quota workarounds.

## 5. Troubleshoot selector failures

Google Vids UI changes often. This repo uses **role- and name-based** locators aligned with [Google’s Help me create docs](https://support.google.com/a/users/answer/14819770), not brittle CSS.

If a step fails:

1. Check `screenshots/` for a full-page capture.
2. Re-run headed (default): `npm run start`
3. Use Playwright Inspector:

   **WSL / bash:**

   ```bash
   PWDEBUG=1 npm run start
   ```

   **Windows PowerShell:**

   ```powershell
   $env:PWDEBUG="1"; npm run start
   ```

4. In the browser DevTools **Accessibility** tree, note the control’s **role** and **accessible name**.
5. Update the candidate locators in `src/googleVids.ts` (functions like `openStoryboardWorkflow`, `findPromptInput`, `createDraftFromOutline`).
6. Re-run until the draft completes.

If your account shows a different start path (e.g. only **Blank vid**), complete that path once manually and record the exact labels you see — then add matching `getByRole` / `getByText` entries.

## 6. Safely delete saved authentication

When you want to sign out locally or rotate credentials:

```bash
rm -f playwright/.auth/user.json
rm -rf playwright/.user-data
```

Optional: clear saved screenshots that may show account UI:

```bash
rm -f screenshots/*.png
```

Revoke active sessions in your [Google Account security](https://myaccount.google.com/security) if the machine was shared or the auth file may have leaked.

## Scripts reference

| Command | Description |
|---------|-------------|
| `npm run setup` | Install npm packages + Chromium |
| `npm run chrome:debug` | Open Chrome with remote debugging (Windows) |
| `npm run login:cdp` | Save auth from that Chrome (recommended) |
| `npm run login` | Playwright-launched login (may be blocked by Google) |
| `npm run start` | Run one draft flow (headed) |
| `npm run start:headless` | Same flow, headless |
| `npm run typecheck` | TypeScript check |

## Legal and usage notes

- Use only accounts and quotas you are entitled to.
- Do not commit `.env`, `playwright/.auth/`, or sensitive screenshots.
- Expand to batch jobs only after this single-draft path is stable and selectors are verified on your UI.
