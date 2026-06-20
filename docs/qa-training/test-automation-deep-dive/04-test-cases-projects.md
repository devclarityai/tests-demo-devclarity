# Test Cases: Create a Project (DCD-125) — via Road 1: ticket + acceptance criteria

## Happy path

| ID | Title | Steps | Expected |
|---|---|---|---|
| PROJ-01 | Open New Project from the Projects list | From the Projects list, click New Project | The New Project form opens |
| PROJ-02 | Create a project with all fields | Pick a Client (type-ahead), pick a Project Type, pick a Status, set Desired Start Date, Desired End Date, and First Anchor Date, Save | Project is created; user is redirected to the project detail page with a confirmation message (AC #4) |
| PROJ-03 | Project Type defaults to "Consulting Project" | Open New Project, inspect the Project Type field before changing it | Project Type is pre-selected as "Consulting Project" |
| PROJ-04 | Status shows the placeholder | Open New Project, inspect the Status field before selecting | Status shows the placeholder "Select a status" |
| PROJ-05 | First Anchor Date helper text is visible | Open New Project, inspect the First Anchor Date field | Helper text "All work blocks will be scheduled relative to this anchor date" is visible |
| PROJ-06 | Client type-ahead returns matching clients | In the Client field, type part of an existing client's name | Matching existing clients are offered for selection |
| PROJ-07 | Cancel returns to the Projects list | Open New Project, click Cancel | User is returned to the Projects list; nothing is saved (AC #5) |

## Edge cases

| ID | Title | Steps | Expected |
|---|---|---|---|
| PROJ-08 | Client type-ahead with no match | Type a string that matches no existing client | No client is selectable; behavior is well-defined (verify — not specified) |
| PROJ-09 | Desired End Date before Desired Start Date | Set End Date earlier than Start Date, Save | Date-ordering behavior is well-defined (verify — AC does not state a rule) |
| PROJ-10 | First Anchor Date relative to start/end | Set First Anchor Date outside the start–end range, Save | Anchor-date constraint behavior is well-defined (verify — not specified) |

## Negative / error

| ID | Title | Steps | Expected |
|---|---|---|---|
| PROJ-11 | Required fields blank shows a validation error | Leave required fields blank, Save | Validation error shown and the project is not saved (AC #3) |
| PROJ-12 | Client is required | Leave Client unselected, fill the rest, Save | Validation error, not saved (verify Client is required) |
| PROJ-13 | Status is required | Leave Status on its placeholder, fill the rest, Save | Validation error, not saved (verify Status is required) |
| PROJ-14 | Cannot create a client inline | On the New Project form, look for a way to create a new client | No inline client creation is available (out of scope per ticket) |

## Assumptions / Possible hallucinations / What this road missed

**Assumptions (inferred, not stated in the ticket):**
- The form's Save/Cancel controls are labeled and reachable from the Projects list.
- "Required fields" in AC #3 includes Client and Status — the AC says required
  fields are enforced but does **not** enumerate which fields are required.

**Possible hallucinations (verify these exist before asserting):**
- The exact confirmation message on save (AC #4 says "a confirmation message" but
  gives no text).
- That the Status placeholder reads exactly "Select a status" and the default
  Project Type reads exactly "Consulting Project" (from AC — confirm verbatim).

**What this road (ticket + AC) probably missed:**
- **Which fields are actually required** — the single biggest gap; only the running
  app or the model reveals it. PROJ-11/12/13 are written against an assumption.
- **Date validation rules** — start/end ordering, anchor-date constraints, past
  dates. The AC states none, so PROJ-09/PROJ-10 are open questions, not assertions.
- **What the First Anchor Date actually does** — the ticket says it drives work
  block scheduling; that downstream effect is untestable from this form alone.
- **Type-ahead mechanics** — min characters, debounce, max results.
