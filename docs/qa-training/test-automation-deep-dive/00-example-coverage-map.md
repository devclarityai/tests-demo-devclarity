# Workshop Example Coverage & Overlap Map

Context for picking a workshop example. Shows, per example: the feature it
touches, what the existing test suite **already automates** in that area (so you
know what's a fresh write vs. extending coverage), and what's net-new for the
attendee. Use it to spread attendees across areas so two people aren't healing
the same functionality.

## Pickable examples (01–03 + 06)

| # | Example | Feature area | Already-automated overlap | Net-new for the attendee | POM status |
|---|---------|--------------|---------------------------|--------------------------|------------|
| 01 | Create a project | New Project form: client type-ahead, project type, status, dates, anchor | `projects.spec.ts` already automates the basic create → redirect-to-detail happy path (client search + status + anchor date + submit), plus index and view-detail | Project Type default ("Consulting Project"), Status placeholder, First Anchor Date helper text, Desired Start/End dates, Cancel path, required-field validation | `ProjectFormPage` exists (client / status / anchor / submit locators) — **extend** for type, start/end dates, cancel, validation errors |
| 02 | Resource unavailability (PTO) | Resource detail → add / list / edit / delete a PTO entry | **None** — no resource specs exist | Entire feature | `ResourcesPage` is index-only — **build** a resource-detail POM + methods via exploration |
| 03 | Work block status workflow | Work block create + Held → Booked + status shown on calendar | `calendar/weekly-view.spec.ts` exercises the calendar (structure, type columns, 12 week rows) but **not** work-block status; no work-block specs exist | Work block form + create/edit/status flow; reading a specific block's status on the calendar | **No** work-block POM — build via exploration; `CalendarPage` exists, **extend** to read a block's status |
| 06 | Heal a broken test (maintenance / Fix mode) | A failing locator in an existing project or calendar test | The opposite of overlap — you **repair existing** automated coverage rather than add new | Diagnosing root cause + replacing a broken locator via live inspection; no new test authored | Edits a locator in an existing POM/spec in place |

## How to run each section

All paths are from the repo root. The three picks run through the `/e2e-testing`
skill; the generated test-case docs were produced with `/qa-test-cases`.

### 01 — Create a project

```
/e2e-testing @docs/qa-training/test-automation-deep-dive/01-create-project-spec.md
```

Example: automate the create-project flow, extending the existing `ProjectFormPage` with the type-default, helper-text, cancel, and validation cases the current suite doesn't cover.

### 02 — Resource unavailability (PTO)

```
/e2e-testing @docs/qa-training/test-automation-deep-dive/02-resource-unavailability-spec.md
```

Example: explore the resource detail page, build a new resource-detail POM, then automate add / list / edit / delete of a PTO entry.

### 03 — Work block status workflow

```
/e2e-testing @docs/qa-training/test-automation-deep-dive/03-work-block-status-spec.md
```

Example: explore the work-block form to build a brand-new POM, create a block, move it Held → Booked, and verify the status shows on the calendar.

### Generating the test-case docs (how 04 & 05 were produced)

```
/qa-test-cases @docs/qa-training/day1-workshop-tickets/DCD-125-create-new-project.md @docs/context/projects-context.md
```

Example: regenerate the project test cases (`04`) from the ticket + acceptance criteria via Road 1.

```
/qa-test-cases @docs/qa-training/day2-work-blocks/TICKET-DCD-318.md
```

Example: regenerate the work-block test cases (`05`) from the ticket via Road 1.

### 06 — Heal a broken test (maintenance)

```
npx playwright test tests/projects
```

```
/managing-locators
```

Example: run the failing project tests, then use Fix mode to diagnose the broken locator with live inspection (`playwright-cli show`) and repair it — without reading the app source. (Break a `getByRole` name in a POM yourself if no test is currently failing.)

## Support files map back to the picks

| File | Type | Maps to example | Shares functionality with |
|------|------|-----------------|---------------------------|
| `04-test-cases-projects.md` | Generated test cases (Road 1, DCD-125) | 01 — Projects | 01 |
| `05-test-cases-work-blocks.md` | Generated test cases (Road 1, DCD-318) | 03 — Work blocks | 03 |

## Shared-functionality groups (assign across these so picks don't collide)

- **Projects:** 01 + `04-test-cases-projects.md`
- **Work blocks / calendar:** 03 + `05-test-cases-work-blocks.md`
- **Resources:** 02 (standalone — no overlap with anything else)
- **Maintenance / healing:** 06 (repairs an existing project or calendar test — non-destructive)

## Existing automated tests referenced above

| Spec file | What it covers today |
|-----------|----------------------|
| `tests/projects/projects.spec.ts` | Projects index; create project (client + status + anchor) → detail; view project detail |
| `tests/calendar/weekly-view.spec.ts` | Weekly calendar loads; all 7 work-block-type column headers; 12 week rows; quick-action links |
| `tests/clients/clients.spec.ts` | Client create / edit / delete / validation (why the client example was dropped — already fully automated) |
