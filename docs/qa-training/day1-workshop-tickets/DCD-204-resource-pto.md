# DCD-204 - Resource unavailability (PTO) entry

**Type:** Story
**Component:** Resources
**Reported by:** Resource Manager
**Priority:** Medium
**Feature status:** Live (already in the app - verify against it)

## Description

Managers need to record when a resource is unavailable (PTO, holidays, leave) so the scheduler stops placing work on those days. Today this lives in a spreadsheet and people forget to check it, so we keep booking people who are out.

## Acceptance Criteria

- From a resource's detail page, a manager can add an unavailability with a start date, an end date, and a reason.
- The unavailability shows in a list on the resource page with its date range and reason.
- A resource who is unavailable for a date range is not auto-scheduled into work blocks on those dates.
- A manager can edit and delete an existing unavailability.

## Notes

We want this in before the holiday season planning push next month.
