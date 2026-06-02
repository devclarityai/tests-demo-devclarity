---
name: qa-test-cases
description: Turns a feature input (ticket + acceptance criteria, existing cases, a screenshot, observed app behavior, or a recorded walkthrough) into test cases or lighter test scenarios. Use when a tester needs to generate test coverage from any of the "five roads" inputs. Carried from Day 1 of the QA Foundational training; the road-1 input for Day 2.
argument-hint: "[ticket file, image, or description of the input]"
---

# QA Test Cases

> Core principle: **You are the oracle. AI is the amplifier.** AI drafts coverage fast from whatever input you give it. The tester decides what is real, what is missing, and what is worth writing down.

This skill produces test cases OR scenarios from one input "road." It does not assume the ticket is the whole truth. Every input is a different lens, and no single road finds everything (see `reference/test-design-context.md`).

## Inputs this skill accepts (the five roads)

1. **Feature ticket + acceptance criteria** - a markdown ticket or pasted AC. The documented happy path.
2. **Existing test cases** - generate _additional_ cases (for gap analysis, prefer the `/qa-gap-analysis` skill).
3. **Screenshot of the app** - a pasted image. Generate from what is actually on screen.
4. **Observed app behavior** - drive the running app (Playwright MCP or the `/playwright-cli` skill) and generate from real states and validation messages. If this path is chosen, to give visibility into the process go ahead and run a background command `playwright-cli show` so we can see what the agent is doing.
5. **Recorded walkthrough** - a Chrome Recorder JSON replay or step list. Turn manual steps into structured cases.

State which road you are running so the output can be compared against the others.

## Formal case vs scenario - pick on purpose

AI makes writing either one cheap, so the skill is the judgment, not the typing.

- **Formal step-by-step case** - explicit steps, data, expected result. Use for compliance, regulated work, handoffs to another tester, or anything that must reproduce exactly.
- **Lighter scenario** - a one-line charter plus rationale. Use for fast-moving teams, exploratory follow-up, or low-risk areas.

Ask the user which they want. If unspecified, default to scenarios and offer to expand the high-risk ones into formal cases.

## Workflow

```
QA Test Cases Progress:
- [ ] Step 1: Identify the road (input type) and read it
- [ ] Step 2: Load relevant context (reference file + any target-area notes)
- [ ] Step 3: Generate cases/scenarios in layers
- [ ] Step 4: Flag assumptions and self-critique
```

### Step 1: Identify the road and read the input

Name the input type out loud (road 1-5 above). Read the input fully. For behavior/screenshot roads, describe what you actually observed before generating - do not generate from memory of "apps like this."

### Step 2: Load context

Read `reference/test-design-context.md`. If the target area has its own context notes (e.g. a field schema or product notes), read those too. Grounded output beats output running on hallucinated assumptions - call out where you are guessing.

### Step 3: Generate in layers

    # Test Cases / Scenarios: [Area] (via Road N: [input type])

    ## Happy path
    - **[name]**: [steps or charter] -> Expected: [oracle]

    ## Edge cases
    - **[name]**: [...] -> Expected: [...]

    ## Negative / error
    - **[name]**: [...] -> Expected: [...]

Every case needs an **oracle** - the explicit expected result. A case with a vague oracle ("works correctly") is a weak case; flag it.

### Step 4: Flag assumptions and self-critique

**-> STOP.** Before handing back, list:

- **Assumptions** - any rule, field, or value you inferred that is not in the input.
- **Possible hallucinations** - fields/states/messages you are not certain exist.
- **What this road probably missed** - what a different input would likely catch.

This list is the point. Present everything and wait for the tester to judge it.

## Critical rules

- Always name the road and surface what it likely missed - no single road finds everything.
- Never invent fields, validation messages, or states without flagging them as unverified.
- Every case carries an explicit oracle.
- For behavior/screenshot roads, generate from what was observed, not from assumptions.
- Stay tool-generic: this workflow runs the same with Claude, Copilot, or any assistant.

## Anti-patterns

- Restating the acceptance criteria as the entire test set.
- Confident cases with no oracle or with an invented expected value.
- Skipping the assumptions/hallucination list.
- Treating one road's output as complete coverage.
