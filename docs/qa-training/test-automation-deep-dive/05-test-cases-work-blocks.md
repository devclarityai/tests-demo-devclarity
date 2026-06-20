# Test Cases: Work Blocks (DCD-318) — via Road 1: ticket + acceptance criteria

## Happy path

| ID | Title | Steps | Expected |
|---|---|---|---|
| WB-01 | Open New Work Block from a project | From a project page, click New Work Block | The New Work Block form opens |
| WB-02 | Open New Work Block from the Work Blocks list | From the Work Blocks list, click New Work Block | The New Work Block form opens |
| WB-03 | Create a work block with all required fields | Enter Title, pick a Project, pick a Work Block Type, pick a Date, pick Status "Held", Save | Work block is created; user is returned to the project (or Work Blocks list) with a "Work block was successfully created" confirmation |
| WB-04 | Create a work block with status "Booked" | As WB-03 but pick Status "Booked", Save | Work block is created with status Booked; confirmation shown |
| WB-05 | Selecting a type reveals its resource-assignment section | Pick Work Block Type "Discovery" | The resource-assignment section for that type appears, with the roles for that type |
| WB-06 | Assign people to roles and save | Pick a type, assign a person to a role in the resource-assignment section, complete the rest, Save | Work block is created with the assignment retained |
| WB-07 | Edit an existing work block | Open an existing work block, change the Title (or any field), Save | The change is saved and reflected on the work block |
| WB-08 | Delete a work block | Open an existing work block, click Delete, confirm the prompt | The work block is removed |
| WB-09 | Cancel the delete confirmation | Click Delete, dismiss the confirmation prompt | The work block is NOT deleted |

## Edge cases

| ID | Title | Steps | Expected |
|---|---|---|---|
| WB-10 | Type "Other" resource-assignment behavior | Pick Work Block Type "Other" | The resource-assignment section behaves per that type's roles (verify whether any roles are shown) |
| WB-11 | Change type after assigning resources | Pick a type, assign a person, then change the Work Block Type | Behavior of the existing assignments when the type changes is well-defined (verify — not specified in AC) |
| WB-12 | Switch each work block type | Select each type in turn (Project Kickoff, Discovery, Design, Development, Testing, Project Wrap-up, Other) | The resource-assignment section updates to the roles for each selected type |

## Negative / error

| ID | Title | Steps | Expected |
|---|---|---|---|
| WB-13 | Title is required | Leave Title blank, fill the rest, Save | Validation error, not saved |
| WB-14 | Project is required | Leave Project unselected, fill the rest, Save | Validation error, not saved |
| WB-15 | Work Block Type is required | Leave Type unselected, fill the rest, Save | Validation error, not saved |
| WB-16 | Date is required | Leave Date blank, fill the rest, Save | Validation error, not saved |
| WB-17 | Status is required | Leave Status unselected, fill the rest, Save | Validation error, not saved |
| WB-18 | Multiple required fields blank list all errors together | Leave Title, Project, and Date blank, Save | All validation errors are shown together at the top of the form, listing each problem (AC #7) |

## Assumptions / Possible hallucinations / What this road missed

**Assumptions (inferred, not stated in the ticket):**
- "Status" offers exactly Held and Booked as selectable options (AC #2 lists these two).
- The resource-assignment section lets you pick from existing people; the ticket
  says "assign people to the roles" but does not define the picker.

**Possible hallucinations (verify these exist before asserting):**
- The exact confirmation text "Work block was successfully created" (taken from AC #5
  — confirm it matches the running app verbatim).
- That Delete shows a native confirmation prompt vs an in-page confirm.

**What this road (ticket + AC) probably missed:**
- **Date rules.** The AC says only "Date" — it does not mention weekday-only,
  past dates, or holidays. Observed-behavior (Road 4) or the field schema would
  catch a weekday-only rule.
- **Required minimum staffing per role.** AC #4 says the section appears but does
  not say any role is *required* or has a minimum count — a real rule that only
  surfaces by driving the app.
- **Title length limits** — no max stated.
- **Edit-mode validation parity** — whether the same required/validation rules
  apply on edit as on create.
