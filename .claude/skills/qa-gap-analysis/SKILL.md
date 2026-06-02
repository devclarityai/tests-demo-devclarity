---
name: qa-gap-analysis
description: Takes an existing set of test cases for a feature and returns what is missing - uncovered states, boundaries, negative paths, and unstated rules. Use when inheriting a test suite or auditing coverage. This is road 2 of the QA Foundational Day 2 "five roads."
argument-hint: "[file or pasted list of existing test cases]"
---

# QA Gap Analysis

> Core principle: existing cases inherit the blind spots of whoever wrote them. AI is good at asking "what else?" - you judge which gaps matter.

Input: a set of existing test cases (a file, a pasted list, or a test management export).
Output: the cases that are _missing_, organized so a tester can decide what to add.

## Workflow

## Pre-flight checks

Run these before starting any work:

```bash
# 1. Verify playwright-cli is installed
playwright-cli --version

# 2. Verify Playwright version is 1.59 or higher
npx playwright --version

# 3. Ensure playwright-cli skills are installed
playwright-cli install --skills
```

If `playwright-cli` is not found, install it first: `npm install -g @playwright/cli@latest && playwright-cli install --skills`

**Evidence capture:** you may save screenshots and walkthrough captures into the `.playwright-cli/` directory (e.g. `playwright-cli screenshot --filename=.playwright-cli/<name>.png`). Embed these in any HTML report generated from this analysis.

```
Gap Analysis Progress:
- [ ] Step 1: Read the existing cases and the feature under test
- [ ] Step 2: Map coverage onto a grid
- [ ] Step 3: Name the gaps
- [ ] Step 4: Prioritize and self-critique
```

### Step 1: Read the existing cases

Read every existing case. Summarize what they cover in one or two lines so the user can confirm you read them correctly. If you can observe the running feature (using `playwright-cli show`) or have a field schema, use it - gaps are easier to see against the real thing.

### Step 2: Map coverage onto a grid

Build a quick coverage map. Mark each cell covered / partial / missing:

| Dimension                                                             | Covered? |
| --------------------------------------------------------------------- | -------- |
| Happy path                                                            |          |
| Each field's valid range                                              |          |
| Each field's boundaries (on / just inside / just outside)             |          |
| Each invalid input per field                                          |          |
| Each state / status the feature can be in                             |          |
| Negative + error paths                                                |          |
| Permissions / who can do this                                         |          |
| Cross-feature side effects                                            |          |
| Unstated business rules (rules the app enforces but the cases ignore) |          |

### Step 3: Name the gaps

For each missing or partial cell:

    ## Gap: [short name]
    - **What is not covered:** [...]
    - **Why it matters / who is hurt:** [...]
    - **Suggested case:** [charter or steps + oracle]

Pay special attention to **unstated rules**: a restriction the app enforces (a forbidden value, a required minimum, a blocked state) that none of the existing cases touch. These are the highest-value gaps and the easiest to miss.

### Step 4: Prioritize and self-critique

**-> STOP.** Rank the gaps by risk (severity x priority). Then list:

- Gaps you are **confident** are real.
- Gaps that **depend on an assumption** you could not verify.
- Any "gap" that might already be covered indirectly.

Present and wait for the tester to judge.

## Critical rules

- Confirm what the existing cases cover before claiming gaps.
- Distinguish a true coverage gap from a rule you assumed exists.
- Every suggested case carries an oracle.
- Rank by risk, not by what is easy to test.

## Anti-patterns

- Listing more happy-path variations as if they were gaps.
- Inventing missing rules without flagging them as unverified.
- A flat undifferentiated list with no risk ranking.
