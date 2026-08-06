---
name: exploratory-scenario-generation
description: Generates exploratory test scenarios that go beyond ticket requirements. Uses playwright-cli for live browser exploration to surface system-wide impacts testers would otherwise miss. Supports two modes — explore from a prompt or from a ticket (Jira/Linear ID).
---

# Exploratory Scenario Generation

> Core principle: Testers often test to the card and miss broader system impacts. After understanding what a ticket or prompt asks for, step back and ask:
> - What else in the system could this change affect?
> - What user behavior is likely but not described?
> - What happens at the boundaries — empty state, max input, concurrent use?
> - What could go wrong that the developer did not consider?

## Modes

**Mode A — Explore from prompt**: User describes a feature, flow, or area to explore.
**Mode B — Explore from ticket**: User provides a Jira or Linear ticket ID. _(See Ticket Mode section below.)_

Detect which mode based on whether the input looks like a ticket ID (e.g., `PROJ-123`, `ENG-456`) or free-form text.

---

## Workflow checklist

```
Exploratory Scenario Progress:
- [ ] Step 1: Parse input and ask follow-up questions
- [ ] Step 2: Analyze scope and build exploration plan
- [ ] Step 3: Explore with playwright-cli
- [ ] Step 4: Draft scenarios in layers
```

---

## Step 1: Parse input and ask follow-up questions

Read the prompt or ticket carefully. Identify:
- The feature or workflow being changed
- The user role(s) involved
- Any explicit acceptance criteria or edge cases already mentioned

Then ask the user any clarifying questions needed to explore effectively. Good follow-up questions:
- Which user role is the primary actor?
- Is there a specific starting state or data dependency?
- Are there known related features that share this data or UI?
- Is this a new flow or a change to an existing one?

If the prompt is clear enough to proceed without questions, state your assumptions and move on.

**-> STOP. Ask follow-up questions or state assumptions. Wait for the user to confirm before proceeding.**

---

## Step 2: Analyze scope and build exploration plan

Think beyond the ticket. Consider:
- **Direct impact**: The feature or flow described
- **Indirect impact**: Other areas of the app that share data, state, or UI with this feature
- **User paths**: Likely flows a real user would take before or after this interaction
- **Boundaries**: Empty state, max values, invalid input, concurrent sessions
- **Negative cases**: What the feature should reject or protect against

Present the plan in chat:

    # Exploration Plan: [Feature or Ticket]

    ## What the ticket/prompt asks for
    [1-2 sentence summary]

    ## Scope of exploration
    - [Area 1]: [Why it could be affected]
    - [Area 2]: [Why it could be affected]
    ...

    ## Routes / pages to explore
    - [URL or page name]: [What to look for]
    ...

    ## Questions the exploration should answer
    - [Question 1]
    - [Question 2]
    ...

**-> STOP. Present the plan. Confirm the scope and exploration targets with the user before proceeding.**

---

## Step 3: Explore with the `/playwright-cli` skill

Use the `/playwright-cli` skill (invoke via Skill tool) to navigate the live application and gather evidence. Do NOT use MCP playwright tools — always drive exploration through the skill.

### 3a. Open the dashboard in a separate terminal

Before starting exploration, launch `playwright-cli show` in a background terminal so the user can watch the agent browse in real time:

```bash
osascript -e 'tell application "Terminal" to do script "playwright-cli show"'
```

This opens a new Terminal window running the dashboard. Tell the user: "I've opened a playwright-cli dashboard window so you can follow along."

### 3b. Run exploration

Exploration approach:
1. Navigate to each route in the plan
2. Take snapshots at key states (page load, after interaction, error states)
3. Interact with the feature as described in the plan
4. Also interact with related areas that could be affected
5. Note anything unexpected, inconsistent, or missing

Useful commands:

```bash
# Attach to a running browser session
playwright-cli attach <session-id>

# Take a snapshot of the current page state
playwright-cli --session <id> snapshot

# Step through an interaction
playwright-cli --session <id> step-over
```

Document your findings as you go — note what you saw, what worked, what broke, and what was ambiguous.

**-> STOP. Share a brief summary of what you observed during exploration before drafting scenarios.**

### 3c. Close the dashboard (after scenarios are confirmed)

Once the user has confirmed the final scenario list, ask before closing:

> "The exploration session is complete. OK to close the playwright-cli dashboard terminal?"

If the user confirms, close it:

```bash
pkill -f "playwright-cli show"
```

---

## Step 4: Draft scenarios in layers

Using the exploration findings, draft test scenarios organized by layer:

**Layer 1 — Happy path**: The core flow works as described when inputs are valid and state is clean.

**Layer 2 — Edge cases**: Boundary values, empty state, maximum input, unexpected data combinations.

**Layer 3 — Negative / error tests**: Invalid input, unauthorized access, missing required data, concurrent modifications.

Present scenarios in this format:

    # Test Scenarios: [Feature or Ticket]

    ## Happy Path
    - **[Scenario name]**: [One-line description] | _Rationale: [why this goes beyond the ticket]_

    ## Edge Cases
    - **[Scenario name]**: [One-line description] | _Rationale: [why this goes beyond the ticket]_

    ## Negative / Error Tests
    - **[Scenario name]**: [One-line description] | _Rationale: [why this goes beyond the ticket]_

Include a rationale for any scenario that is not explicitly required by the ticket. This is what makes the list valuable — surfacing what the ticket missed.

**-> STOP. Present the full scenario list. Confirm with the user before writing detailed test steps or passing to another skill.**

---

## Ticket Mode (Jira / Linear)

_Placeholder — not yet implemented._

When a ticket ID is provided:
- **Jira**: _(integration to be added)_
- **Linear**: _(integration to be added — see `/linear` skill for current Linear access)_

For now, ask the user to paste the ticket title and description directly and proceed with Mode A.

---

## Critical rules

- Never test only to the ticket — always expand scope in Step 2
- Scenarios stay in chat during drafting, never written to a file until the user confirms
- Rationale is required for every scenario that goes beyond the ticket
- Always invoke the `/playwright-cli` skill via the Skill tool for browser exploration — never use MCP playwright tools directly
- Use playwright-cli for live exploration, not source code reading, to understand current behavior
- If playwright-cli is unavailable, note it and proceed with analysis only

## Anti-patterns

- Listing only the happy path scenarios described in the ticket
- Writing scenarios to a file before the user confirms the list
- Skipping the exploration step and drafting from assumptions alone
- Generating locators or test steps by reading source code instead of observing the live app
