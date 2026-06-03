---
name: qa-context-personas
description: Builds the context an AI needs to test an app well - product/area notes and user personas - and writes them into a reusable reference file. Use to turn a thin, generic AI run into a grounded one. Day 1 context live-build of the QA Foundational training.
argument-hint: "[app area to build context for]"
---

# QA Context & Personas

> Core principle: **Context compounds. Garbage context, garbage tests.** AI with no
> context guesses; AI with the right context tests like someone who knows the product.
> The lift comes from _relevant_ context, not _more_ context.

This skill builds two things into a reference file the other QA skills read:

1. **Area context** - what this part of the app does, what it is not, key terms, rules,
   conventions.
2. **Personas** - who uses it (and one anti-persona), reused later to rank risk by "who
   is hurt if this breaks."

## Workflow

## Pre-flight checks

Run these before starting any work:

```bash
# 1. Verify playwright-cli is installed
playwright-cli --version

# 2. Ensure playwright-cli skills are installed
playwright-cli install --skills

# 3. Session name — use -s=<output> for all playwright-cli calls this run
echo "personas-$RANDOM"
```

If `playwright-cli` is not found, install it first: `npm install -g @playwright/cli@latest && playwright-cli install --skills`

Use the output from step 3 as your `-s=` value for every `playwright-cli` call this run.

```
Context Progress:
- [ ] Step 1: Draft tight area context
- [ ] Step 2: Generate personas (1-2 + one anti-persona)
- [ ] Step 3: Write it to the reference file
- [ ] Step 4: Re-run and compare
```

### Step 1: Draft area context

Write a **tight** description of the area. Progressive disclosure, not a data dump:

- What it does and what it is explicitly _not_ for.
- Key domain terms and their meaning in this product.
- Known rules/constraints (the non-obvious ones earn their place).
- Testing conventions for this area.

If you can, observe the running app (using playwright-cli) or read the
relevant code to ground this - do not invent product facts.

To give visibility into the process go ahead and run a background command `playwright-cli show` so we can see what the agent is doing.

### Step 2: Generate personas

Draft 1-2 primary personas and **one anti-persona** (someone who misuses or stresses
the feature). Each: who they are, what they need, what breaks their day. Review them as
a team before keeping - reject generic filler.

    ## Persona: [name / role]
    - **Goal:** ...
    - **Cares most about:** ...
    - **Hurt if this breaks:** ...   <- this line feeds risk ranking later

### Step 3: Write to the reference file

Fold the area context and personas into the skill's reference file (e.g. a
`reference/*.md` the QA skills read, or a layered CLAUDE.md / rules file). Keep it
layered and lean. Flag what belongs in a rules file vs a skill reference.

### Step 4: Re-run and compare

**-> STOP.** Re-run the same task against the now-populated reference file. Put the
naive output and the grounded output side by side. Name specific improvements - and if
it did _not_ improve, that is the lesson too: relevant beats more. Trim and re-run once.

## Critical rules

- Relevant context over volume - model restraint, do not stuff.
- Ground product facts in the app or code, not assumption.
- Every persona carries a "hurt if this breaks" line for later risk work.
- Personas reviewed by a human before they are kept.

## Anti-patterns

- Dumping everything you know into one giant context blob.
- Generic personas ("busy professional") with no testable stakes.
- Skipping the before/after comparison - the comparison is the lesson.
