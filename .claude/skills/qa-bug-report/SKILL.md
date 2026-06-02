---
name: qa-bug-report
description: Drafts a structured, reproducible bug report from behavior observed in the running app. Use after a tester reproduces a defect and wants a clean report another tester could file without a follow-up conversation. Day 2 bug-reporting block of the QA Foundational training.
argument-hint: "[describe the bug, or point at observed behavior / a Playwright session]
---

# QA Bug Report

> Core principle: **AI drafts from evidence. Observed behavior beats a guessed repro.** Ground every field in what actually happened, not what probably happens.

Input: behavior observed in the running app (using the `playwright-cli` skill, or a recorded walkthrough / screenshots).
Output: a structured bug report using `template.md` that another tester could file and reproduce cold.

## Workflow

## Pre-flight checks

Run these before starting any work:

```bash
# 1. Verify playwright-cli is installed
playwright-cli --version

# 2. Ensure playwright-cli skills are installed
playwright-cli install --skills
```

If `playwright-cli` is not found, install it first: `npm install -g @playwright/cli@latest && playwright-cli install --skills`

**Evidence capture:** you may save screenshots and walkthrough captures into the `.playwright-cli/` directory (e.g. `playwright-cli screenshot --filename=.playwright-cli/<name>.png`). Embed these in the bug report and any HTML report generated from it.

To give visibility into the process go ahead and run a background command `playwright-cli show` so we can see what the agent is doing.

```
Bug Report Progress:
- [ ] Step 1: Observe and capture the real behavior
- [ ] Step 2: Establish expected vs actual
- [ ] Step 3: Draft the report from the template
- [ ] Step 4: Judge it - could someone file this without asking you a question?
```

### Step 1: Observe and capture

Reproduce the bug against the running app and capture **real** evidence:

- The exact steps taken (URLs, fields, values entered).
- The actual result - real error text, real state, real selectors/values, a screenshot or trace if available.

Do not paraphrase from memory. If you did not observe a step, do not write it as if you did.

### Step 2: Expected vs actual

- **Expected** - cite the source of the expectation (a ticket, an AC, a stated rule, or app behavior elsewhere). The oracle.
- **Actual** - what the app did, in concrete terms.

If the bug is that the app _allows_ something it should block, say what rule is being violated and where that rule comes from.

### Step 3: Draft from the template

Fill `template.md`: title, environment, preconditions, steps to reproduce, expected, actual, severity, priority, evidence. Keep steps numbered and literal - real data values, not "enter a date."

### Step 4: Judge it

**-> STOP.** Read the report back and ask:

- Could another tester reproduce this with **only** what is written here?
- What did I **assume** that is not in the evidence? Mark or remove it.
- Is the severity/priority justified by impact, or guessed?

Present the report plus this judgment. The evidence-vs-assumption check is the skill.

## Critical rules

- Every step and value comes from observed behavior, not assumption.
- Expected result cites its source (ticket, rule, or app behavior).
- Steps are literal and numbered with real data.
- Severity and priority are justified, not decorative.

## Anti-patterns

- A repro with vague steps ("set up the data, then trigger the bug").
- Expected/actual that restate each other without a real oracle.
- Inventing error text or state that was not observed.
- Filing severity "critical" with no impact statement.
