---
name: qa-html-report
description: Turns markdown or QA skill output into a simple, consistently styled standalone HTML report. Saves it to a qa-reports folder on the Desktop and opens it in the default browser. Works on Mac and Windows. Use when output from a qa-xxx skill (AC analysis, bug report, test cases, gap analysis) needs to be shared as an HTML file.
argument-hint: "[file or content to convert] [optional title]"
---

# QA HTML Report

One basic, consistent way to turn QA output into a single self-contained HTML file. No config, no themes, no layouts - the template is the template.

## Workflow

### Step 1: Get the content and title

- If the argument is a file path, read it. Otherwise use the markdown/output already produced in this conversation. If neither exists, ask.
- Title: use the provided title, or derive one from the content's first heading.

### Step 2: Build the HTML

Read `template.html` (next to this file). Replace:

- `{{TITLE}}` - the report title
- `{{DATE}}` - today's date (e.g. `June 2, 2026`)
- `{{CONTENT}}` - the content converted to HTML (headings, lists, tables, code blocks)

Convert the markdown to HTML yourself - do not add scripts, external stylesheets, or fonts. Severity/priority values may use the badge classes: `<span class="badge high">High</span>` (also `medium`, `low`).

**Screenshots:** if the content references screenshots (e.g. files in `.playwright-cli/`), embed them as base64 data URIs so the report stays a single file:

```bash
node -e "process.stdout.write(require('fs').readFileSync(process.argv[1]).toString('base64'))" .playwright-cli/example.png
```

Then: `<img src="data:image/png;base64,...." alt="...">` wrapped in a `<figure>` with a short `<figcaption>`.

### Step 3: Save to the html directory

Save to the `html/` directory at the repo root.

```bash
# run if needed to create the directory
mkdir -p html
```

Filename: `<kebab-case-title>-<YYYY-MM-DD-HHmm>.html` (timestamp avoids overwriting earlier reports). Write the file there.

### Step 4: Open it

```bash
# Mac
open "<file>"

# Windows (Git Bash)
cmd.exe /c start "" "<file>"
```

(If running in PowerShell instead of Git Bash: `Start-Process "<file>"`.)

Tell the user the full path of the saved file.

## Critical rules

- One self-contained file: inline CSS from the template only, images as base64 data URIs, no external resources.
- Do not modify `template.html` per report - consistency is the point.
- Never overwrite an existing report; the timestamped filename handles this.
- Keep it basic: no JS, no print buttons, no table of contents.
