---
name: qa-context-personas
description: Builds the context an AI needs to test an app well - product/area notes and user personas - and writes them into a reusable reference file. Use to turn a thin, generic AI run into a grounded one. Day 1 context live-build of the QA Foundational training.
argument-hint: "[app area to build context for]"
---

# QA Context & Personas

> Core principle: **Context compounds. Garbage context, garbage tests.** AI with no
> context guesses; AI with the right context tests like someone who knows the product.
> The lift comes from *relevant* context, not *more* context.

This skill builds two things into a reference file the other QA skills read:
1. **Area context** - what this part of the app does, what it is not, key terms, rules,
   conventions.
2. **Personas** - who uses it (and one anti-persona), reused later to rank risk by "who
   is hurt if this breaks."

## Workflow

```
Context Progress:
- [ ] Step 1: Show the naive baseline (optional, for the teaching moment)
- [ ] Step 2: Draft tight area context
- [ ] Step 3: Generate personas (1-2 + one anti-persona)
- [ ] Step 4: Write it to the reference file
- [ ] Step 5: Re-run and compare
```

### Step 1: Naive baseline (optional but powerful)

Before adding context, run the target task (e.g. `/qa-test-cases`) against a thin or
empty reference file. Keep the output. It will be generic and maybe hallucinated. This
is the "before" - most teams stop here and decide AI is useless.

### Step 2: Draft area context

Write a **tight** description of the area. Progressive disclosure, not a data dump:
- What it does and what it is explicitly *not* for.
- Key domain terms and their meaning in this product.
- Known rules/constraints (the non-obvious ones earn their place).
- Testing conventions for this area.

If you can, observe the running app (Playwright MCP or `/playwright-cli`) or read the
relevant code to ground this - do not invent product facts.

### Step 3: Generate personas

Draft 1-2 primary personas and **one anti-persona** (someone who misuses or stresses
the feature). Each: who they are, what they need, what breaks their day. Review them as
a team before keeping - reject generic filler.

    ## Persona: [name / role]
    - **Goal:** ...
    - **Cares most about:** ...
    - **Hurt if this breaks:** ...   <- this line feeds risk ranking later

### Step 4: Write to the reference file

Fold the area context and personas into the skill's reference file (e.g. a
`reference/*.md` the QA skills read, or a layered CLAUDE.md / rules file). Keep it
layered and lean. Flag what belongs in a rules file vs a skill reference.

### Step 5: Re-run and compare

**-> STOP.** Re-run the same task against the now-populated reference file. Put the
naive output and the grounded output side by side. Name specific improvements - and if
it did *not* improve, that is the lesson too: relevant beats more. Trim and re-run once.

## Critical rules

- Relevant context over volume - model restraint, do not stuff.
- Ground product facts in the app or code, not assumption.
- Every persona carries a "hurt if this breaks" line for later risk work.
- Personas reviewed by a human before they are kept.

## Anti-patterns

- Dumping everything you know into one giant context blob.
- Generic personas ("busy professional") with no testable stakes.
- Skipping the before/after comparison - the comparison is the lesson.
