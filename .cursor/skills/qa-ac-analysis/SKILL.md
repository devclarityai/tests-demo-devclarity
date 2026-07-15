---
name: qa-ac-analysis
description: Reads a ticket's acceptance criteria and surfaces gaps, ambiguity, unstated assumptions, and missing cases - then ranks what to test by risk (severity x priority). Use before writing any tests, to interrogate the spec. Day 1 acceptance-criteria + risk block of the QA Foundational training.
argument-hint: "[ticket file or pasted acceptance criteria]"
---

# QA Acceptance-Criteria Analysis

> Core principle: **AI is a spec reader before it's a test writer.** Point it at the
> acceptance criteria first and let it ask the questions a careful tester would - then
> you judge which questions matter. This is shift-left: find holes before code, or
> before you waste tests on the wrong things.

Input: a ticket + acceptance criteria (a markdown file or pasted text).
Output: a list of gaps/ambiguities, then a risk ranking of what to test first.

This is **not** the same as `/qa-gap-analysis` (which audits an existing _test suite_).
This skill interrogates the _requirements_.

## Live vs Proposed - know which mode you are in

- **Live feature** (already built): verify each gap against the running app. For each
  AI claim decide - **product bug, wrong expectation, or genuine spec gap?**
- **Proposed feature** (not built): pure analysis, nothing to observe. The only check
  is judgment about the spec. Do not assert app behavior you cannot see.

State the mode before you start.

## Workflow

## Pre-flight checks

Run these before starting any work:

```bash
# 1. Verify playwright-cli is installed
playwright-cli --version

# 2. Ensure playwright-cli skills are installed
playwright-cli install --skills

# 3. Session name — use -s=<output> for all playwright-cli calls this run
node -e "console.log('ac-analysis-' + Date.now())"
```

If `playwright-cli` is not found, install it by running these two commands separately (chaining with `&&` can fail on Windows):

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Use the output from step 3 as your `-s=` value for every `playwright-cli` call this run.

**Evidence capture:** you may save screenshots and walkthrough captures into the `.playwright-cli/` directory (e.g. `playwright-cli screenshot --filename=.playwright-cli/<name>.png`). Embed these in any HTML report generated from this analysis.

To give visibility into the process go ahead and run a background command `playwright-cli show` so we can see what the agent is doing.

```
AC Analysis Progress:
- [ ] Step 1: Read the ticket and restate what it asks for
- [ ] Step 2: Interrogate the acceptance criteria
- [ ] Step 3: Verify against the app (Live only)
- [ ] Step 4: Rank what to test by risk
- [ ] Step 5: Self-critique
```

### Step 1: Restate the ask

One or two sentences: what change is this, who is it for, what is explicitly in scope.
Note the Feature status (Live / Proposed).

### Step 2: Interrogate the acceptance criteria

For each criterion and the gaps between them, ask:

- **Ambiguity** - words that could mean two things ("at or above" -> `>=` or `>`?).
- **Unstated rules** - boundaries, limits, formats, required fields the AC assumes.
- **Missing states / paths** - error cases, empty states, permissions, concurrency.
- **Side effects** - what _else_ in the system this change touches (existing data,
  other features that share it).
- **Untestable criteria** - anything with no observable oracle.

Output each as: _the gap_ -> _the question it raises_ -> _why it matters / who is hurt_.

### Step 3: Verify against the app (Live features only)

Where you can, check the claim against the running app (using the `playwright-cli` skill). For each: product bug / wrong expectation / spec gap? Drop "gaps" that are actually already handled.

### Step 4: Rank what to test by risk

Use a simple **severity x priority** model:

- **Severity** - how badly the customer is affected if it breaks.
- **Priority** - how much they care / will tolerate it.

Pull in personas if available (see `/qa-context-personas`): "who is hurt if this
breaks?" Risk is about people, not features. Challenge the _reporter's_ stated priority
when severity says otherwise.

    | Gap / area | Severity | Priority | Test first? | Who is hurt |

### Step 5: Self-critique

**-> STOP.** List which gaps you are confident are real, which depend on an unverified
assumption, and any place you may be inventing a requirement the ticket never implied.
Present everything; the tester judges.

## Critical rules

- Name Live vs Proposed and never assert behavior you did not observe.
- Distinguish a real spec gap from an assumed requirement.
- Rank by risk, not by what is easy to test; separate severity from stated priority.
- Tie risk to who is hurt (personas), not to feature labels.

## Anti-patterns

- Jumping straight to test cases without interrogating the spec.
- Treating every ambiguity as equally important (no risk ranking).
- Asserting "the app does X" for a Proposed feature.
- Accepting the reporter's priority without challenge when severity is high.
