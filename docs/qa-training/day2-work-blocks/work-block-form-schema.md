# Work Block Form - Field Schema

> Input for the test-data block. Feed this to the `/qa-test-data` skill to generate
> valid / boundary / invalid data using equivalence partitioning and boundary value
> analysis. Then judge what AI produced against these rules.
>
> These rules describe the form at `/work_blocks/new` and `/work_blocks/:id/edit`.

## Fields

| Field | Type | Required | Allowed values / rules |
|---|---|---|---|
| Title | free text | Yes | Any non-blank string. No documented max length. |
| Project | select | Yes | One of the existing projects (e.g. "Apex Digital Partners - Consulting Project"). |
| Work Block Type | select | Yes | One of: Project Kickoff, Discovery, Design, Development, Testing, Project Wrap-up, Other. |
| Date | date | Yes | A calendar date. **Must be a weekday** - Saturday and Sunday are rejected with: "Date cannot be on a weekend (Saturday or Sunday). Please select a weekday." |
| Status | select | Yes | One of: Held, Booked. |
| Resource assignments | per-role | Depends on type | When a type is selected, the form shows that type's roles. Some roles are *required* with a minimum count (see below); others are optional. |

## Role requirements by Work Block Type

The minimum staffing each type is supposed to have:

| Work Block Type | Required roles (min count) | Optional roles |
|---|---|---|
| Project Kickoff | Project Lead (1) | Facilitator |
| Discovery | Tech Lead (1) | Facilitator |
| Design | Trainer (1) | Facilitator |
| Development | Trainer (1) **and** Facilitator (1) | - |
| Testing | Tech Lead (1) | Facilitator |
| Project Wrap-up | Project Lead (1) | Facilitator |
| Other | none defined | - |

## Boundary hot spots (where bugs live)

- **Date around the weekend:** Friday, Saturday, Sunday, Monday. The boundary here is
  a *kind of day*, not a numeric range edge.
- **Date in the past vs future:** is a date last year allowed? Nothing in the schema
  forbids it - verify.
- **Title length:** empty (invalid), one char, very long. No documented max - is there
  a real one?
- **Role count:** zero assigned vs the required minimum vs one below it.

## Things the schema does not say (probe these)

- Is the "weekday only" rule applied on **edit** as well as **create**?
- Is the role **minimum** actually enforced on save, or only displayed?
- Are there holidays, or only weekends?
