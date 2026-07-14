---
name: codebase-analysis
description: Analyze a test automation codebase and produce a single-page HTML "model of what exists" report covering assertion depth, test levels, run mechanics, environments, test data, authentication, network handling, dependencies and security, run commands, locators and consistency, and AI tooling artifacts.
disable-model-invocation: true
---

# Test Codebase Analysis

You are a QA practice consultant analyzing a test automation codebase. Your job is to produce a concise "model of what exists" report that a human consultant can use to coach the team and inform context rules (`AGENTS.md`, `CLAUDE.md`, or equivalent) for AI tooling.

The audience for your report is a senior QA consultant who is going to spend 25 minutes with the team reviewing your findings. They need accurate, cited observations more than they need polished prose.

## Output

Write the final report as a single, self-contained HTML file to `test-codebase-analysis.html` in the repo root. After writing, output one summary line: `Report written to test-codebase-analysis.html. <N> tests sampled across <M> folders.`

The HTML must:

- Be a single file with all CSS inlined in a `<style>` block in the `<head>`. No external CSS, no external JS, no remote fonts, no remote images.
- Render cleanly when opened directly from disk in a browser (double-click).
- Use a readable, neutral design: a max content width around 900px, generous line height, system font stack, clear section headings, monospace styling for inline code and code blocks with subtle background.
- Include a top-of-page metadata block with repo name, generation date, and sample size.
- Use a small sticky or fixed table of contents (anchor links) for the 13 sections so the consultant can jump around in the 25-minute review.
- Use simple HTML for content: `<h2>` / `<h3>` for sections and subsections, `<ul>` for bullets, `<pre><code>` for code examples, `<table>` for any breakdowns like locator strategy distribution.
- Cite files inline as `<code>path/to/file.ext:42</code>`.
- No emojis. No JavaScript. No remote dependencies of any kind.

The report has these sections in this order:

0. Summary (3-5 bullets, written last)
1. Assertion depth
2. Test levels
3. How tests are run
4. Environments under test
5. Test data
6. Authentication and session handling
7. Network handling and mocking
8. Dependencies and security
9. Run commands
10. Locators and test consistency
11. AI tooling artifacts (only if present)
12. Sampling notes

## Process

### Step 1. Orient

Stop orienting once you can name the framework, runner, CI provider, and at least 3 test directories. Look at:

- Manifest files to identify framework: `package.json`, `requirements.txt`, `Pipfile`, `pyproject.toml`, `Gemfile`, `pom.xml`, `*.csproj`, `go.mod`
- Test framework version
- Top-level test directories: `tests/`, `test/`, `e2e/`, `spec/`, `cypress/`, `playwright/`, `__tests__/`, `features/`
- `README.md`, `CONTRIBUTING.md`, anything under `docs/`
- CI config: `.github/workflows/*`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `Jenkinsfile`, `circle.yml`, `.circleci/config.yml`
- Framework config: `playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, `jest.config.*`, `pytest.ini`, `conftest.py`

### Step 2. Sample tests

Aim for roughly 20% of test files for deep analysis. If the suite is over 500 tests, scale down to ~1 file per folder. Do not read every test.

Distribute the sample:

- At least 2 of the oldest tests (use `git log --diff-filter=A --follow -- <path>` or file mtime)
- At least 2 of the most recently modified tests
- A mix across folders if tests are organized by domain or feature
- If multiple test levels exist (unit / integration / e2e / api), include at least 1 of each

Capture the full list of sampled files in the sampling notes section of the report.

### Step 3. Read supporting code

For the sampled tests, also read:

- Page objects, fixtures, or helpers they reference
- Test data factories or fixture files
- Custom matchers, custom reporters, shared setup files
- Authentication helpers, login flows, session-reuse mechanisms
- Network mocking, route interception, fixture cassettes, MSW handlers

While reading, also note:

- Synchronization patterns: hard waits (`waitForTimeout`, `sleep()`, `Thread.sleep`) vs framework auto-wait vs custom polling
- Locator strategy: `data-testid`, role-based, CSS, XPath, text-based

Stop when you have enough to answer the questions. You are not auditing the codebase.

### Step 4. Run optional security and secrets checks

Run what is available for the language in front of you. If a tool is not installed, note it and move on. Do not install tooling.

- JavaScript/TypeScript: `npm audit --json` (or `pnpm audit --json` / `yarn audit --json`)
- Python: `pip-audit` if available
- Ruby: `bundler-audit` if available
- .NET: `dotnet list package --vulnerable`
- Java: OWASP `dependency-check` if available

Also scan for:

- Secrets or credentials in test files (`grep -rE "password|api[_-]?key|secret|token" tests/` style heuristic; review hits, do not just count)
- Committed `.env`, `.envrc`, or credential files
- Hardcoded URLs pointing at production systems

### Step 5. Write the report

Use the structure below. Write the Summary section last.

## Required report structure

The content questions below are what each section must answer. Render them in the HTML file as the sections listed at the top of this skill, in order. Use the skeleton further down as a starting template.

### Section content

**0. Summary** (write last) - 3 to 5 `<li>` bullets capturing the most important findings.

**1. Assertion depth**

- Dominant pattern (one line)
- Examples (2-3 file:line citations)
- UI-only vs underlying state breakdown
- Multi-step validation: yes/no, examples

**2. Test levels**

- Levels present (unit / integration / API / e2e / contract / etc.)
- Coverage concentration (rough breakdown)
- Cross-level overlap (example, or "none observed")
- Risk observations (where the current shape creates risk, e.g. "UI-only assertions on payment flow, no API-level coverage of same path")

**3. How tests are run**

- Local command and source
- CI provider, workflow file, trigger model
- Sharding / parallelization
- Retry strategy
- Reporting and artifacts (HTML report / Allure / JUnit XML / custom; traces, videos, screenshots; where artifacts land in CI)

**4. Environments under test**

- Environments referenced (local / dev / staging / etc.)
- Selection mechanism (env var, config flag, CLI arg) with file:line citation
- Pinned tests bound to a specific env

**5. Test data**

- Strategy (inline literals / factories / faker / seeded DB / API-driven setup)
- Cleanup approach
- PII concerns (hardcoded names, emails, payment data, real-looking PII)
- Cross-test shared state

**6. Authentication and session handling**

- Login mechanism (UI form per test / API token / storage state reuse / SSO mock / etc.)
- Where it lives (fixture, helper, setup file with file:line)
- Per-test cost (once globally / once per worker / once per test)
- Multi-role handling, or "single user only"
- Secrets source (env var / vault / hardcoded - flag the last one)

**7. Network handling and mocking** - If nothing observed in sample, write one sentence: "None observed in sample." Otherwise:

- Approach (route interception / MSW / WireMock / VCR / nock / Playwright `page.route` / etc.)
- Mocked vs real-network breakdown across the sample
- Where mocks or routes are defined (file:line)
- Contract drift risk

**8. Dependencies and security**

- Lockfile committed (which one)
- Version pinning (pinned / floating / mixed)
- Test deps mixed with prod
- Audit results (summary counts or "audit not run because X")
- Secrets in tests (findings from grep heuristic, or "none observed")
- Committed env / credential files
- Hardcoded production URLs
- Red flags

**9. Run commands** - Render as a `<table>` with command and source columns.

- Run all tests
- Run a single file
- Run by tag or grep (or "not documented")
- Run a single test by name
- Documentation quality (README / scripts / both / neither)

**10. Locators and test consistency**

- Locator strategy breakdown across sample - render as a `<table>` (strategy, count, example file:line). Example row: `data-testid | 8 | tests/checkout/checkout.spec.ts:14`
- Synchronization patterns (auto-wait only / mixed / hard waits present - cite file:line for hard waits)
- Dominant test-shape patterns (2-3, with file:line)
- Outliers (2-3, with file:line)
- Different-authors / different-eras signal (yes/no, evidence)
- Consistency score (high / mixed / low - name the signals that drove the score)
- Include two `<pre><code>` blocks:
  - **Example: standard test in this repo** - paste a representative 10-30 line test from the sample, with a comment line at the top showing the file path (e.g. `// tests/checkout/checkout.spec.ts`)
  - **Example: locator handling / page object pattern** - paste a representative 10-30 line slice showing how locators are defined and reused, with a path comment at the top

**11. AI tooling artifacts** - Include this section only if AI tooling artifacts are present. Otherwise omit it entirely.

- Context files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.aider.conf.yml`, etc. with file:line)
- Custom skills, slash commands, or prompts (location, purpose)
- MCP configuration (`.mcp.json` or equivalent, which servers configured)
- Prompt templates, AI review checklists, generation scripts (location, purpose)

**12. Sampling notes**

- Files sampled (full list)
- Files referenced but not deeply read
- Files that could not be read (permissions, encoding, missing) or "none"
- Caveats (anything that would change the report with more time)

### HTML skeleton

Use this as a starting point. Adjust styles to taste but keep it single-file, dependency-free, and readable.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test Codebase Analysis - <repo name></title>
<style>
  :root {
    --fg: #1a1a1a;
    --muted: #5a5a5a;
    --rule: #e3e3e3;
    --accent: #1f5fa8;
    --code-bg: #f5f5f5;
    --risk-bg: #fff6e5;
    --risk-border: #d49a1a;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--fg);
    line-height: 1.55;
    margin: 0;
    padding: 0 1rem 4rem;
    background: #fff;
  }
  .wrap { max-width: 900px; margin: 0 auto; }
  header {
    border-bottom: 1px solid var(--rule);
    padding: 2rem 0 1.25rem;
    margin-bottom: 1.5rem;
  }
  header h1 { margin: 0 0 .5rem; font-size: 1.7rem; }
  header .meta { color: var(--muted); font-size: .92rem; }
  nav.toc {
    background: #fafafa;
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: .75rem 1rem;
    margin-bottom: 2rem;
    font-size: .92rem;
  }
  nav.toc strong { display: block; margin-bottom: .35rem; }
  nav.toc ol { margin: 0; padding-left: 1.25rem; columns: 2; column-gap: 2rem; }
  nav.toc a { color: var(--accent); text-decoration: none; }
  nav.toc a:hover { text-decoration: underline; }
  h2 {
    font-size: 1.2rem;
    margin: 2.25rem 0 .75rem;
    padding-bottom: .3rem;
    border-bottom: 1px solid var(--rule);
    scroll-margin-top: 1rem;
  }
  h3 { font-size: 1rem; margin: 1.25rem 0 .5rem; color: var(--muted); }
  ul { padding-left: 1.25rem; }
  li { margin: .2rem 0; }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: .88em;
    background: var(--code-bg);
    padding: .1em .35em;
    border-radius: 3px;
  }
  pre {
    background: var(--code-bg);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: .85rem 1rem;
    overflow-x: auto;
    font-size: .85rem;
    line-height: 1.45;
  }
  pre code { background: transparent; padding: 0; }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: .5rem 0 1rem;
    font-size: .92rem;
  }
  th, td {
    text-align: left;
    padding: .45rem .65rem;
    border-bottom: 1px solid var(--rule);
  }
  th { background: #fafafa; font-weight: 600; }
  .risk {
    background: var(--risk-bg);
    border-left: 3px solid var(--risk-border);
    padding: .55rem .85rem;
    margin: .5rem 0;
    font-size: .94rem;
  }
  .note { color: var(--muted); font-style: italic; }
</style>
</head>
<body>
<div class="wrap">

<header>
  <h1>Test Codebase Analysis - <repo name></h1>
  <div class="meta">Generated <date>. Sample size: <N> tests across <M> folders.</div>
</header>

<nav class="toc">
  <strong>Contents</strong>
  <ol>
    <li><a href="#summary">Summary</a></li>
    <li><a href="#assertion-depth">Assertion depth</a></li>
    <li><a href="#test-levels">Test levels</a></li>
    <li><a href="#how-tests-are-run">How tests are run</a></li>
    <li><a href="#environments">Environments under test</a></li>
    <li><a href="#test-data">Test data</a></li>
    <li><a href="#auth">Authentication and session handling</a></li>
    <li><a href="#network">Network handling and mocking</a></li>
    <li><a href="#deps-security">Dependencies and security</a></li>
    <li><a href="#run-commands">Run commands</a></li>
    <li><a href="#locators-consistency">Locators and test consistency</a></li>
    <li><a href="#ai-tooling">AI tooling artifacts</a></li>
    <li><a href="#sampling">Sampling notes</a></li>
  </ol>
</nav>

<h2 id="summary">Summary</h2>
<ul>
  <li>...write last...</li>
</ul>

<h2 id="assertion-depth">1. Assertion depth</h2>
<!-- bullets per content spec -->

<!-- ... sections 2 through 12, following the section content spec above ... -->

<h2 id="locators-consistency">10. Locators and test consistency</h2>
<!-- bullets + a locator-strategy table -->
<h3>Example: standard test in this repo</h3>
<pre><code>// tests/checkout/checkout.spec.ts
... representative test ...</code></pre>
<h3>Example: locator handling / page object pattern</h3>
<pre><code>// pages/checkout.page.ts
... representative slice ...</code></pre>

<!-- continue through section 12 -->

</div>
</body>
</html>
```

## Operating guidelines

- **Cite evidence.** Use `path/to/file.ext:42` format. A claim without a citation must be qualified ("appears to", "likely", "based on the sample").
- **Do not hallucinate.** If you did not see it, say so. Better to write "Not determined" than to fabricate.
- **Be specific.** "Uses Page Object Model" is weak. "POM lives in `pages/`, one class per page, e.g. `pages/login.page.ts:1`" is useful.
- **Quantify the sample.** "8 of 12 sampled tests use `data-testid` selectors; 3 use CSS classes; 1 uses XPath."
- **Length cap.** Keep total content equivalent to 2-3 printed pages. Long reports get ignored. Skip sections that genuinely do not apply with a one-line `<p class="note">` note.
- **Targeted risk observations, not prescriptions.** You may flag where the current shape creates risk (e.g. "no API-level coverage of payment path"). Do not recommend specific fixes. Recommendations are for the human consultant to make with the team.
- **Tool agnostic.** This skill works for Playwright, Cypress, WebdriverIO, Selenium, pytest, RSpec, JUnit, MSTest, etc. Translate the questions to the framework in front of you.

## When you cannot answer a question

If a question genuinely does not apply or the answer cannot be determined from the sample, write one line in the relevant section: `Not determined - <one-line reason>`. Move on. Do not pad.

## Final reminders

- Write the Summary section last.
- Single self-contained HTML file. No external CSS, JS, fonts, or images.
- Verify the file opens cleanly in a browser before finishing (mentally walk the structure - balanced tags, no broken anchors, all 13 sections present or intentionally omitted with a `<p class="note">` line).
- Output the one-line completion message after writing the file.
- Do not modify any other files in the repo.
