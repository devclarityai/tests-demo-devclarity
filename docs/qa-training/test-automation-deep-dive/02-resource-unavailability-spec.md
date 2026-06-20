# Resource Unavailability (PTO) E2E Test Specification

## Goal
Test adding, listing, editing, and deleting a resource unavailability (PTO)
entry from a resource's detail page.

## Happy Path Tests
1. Add an unavailability with a start date, an end date, and a reason; verify it
   appears in the unavailability list with its date range and reason
2. Edit an existing unavailability (change the reason or a date) and verify the
   list reflects the change
3. Delete an unavailability and verify it is removed from the list

## Validation Tests
1. Required fields: attempt to save an unavailability with the dates or reason
   blank, expect a validation error and no save

## Notes
- Pick a seeded resource to work against; do the add/edit/delete on the same
  resource so the test cleans up after itself.
- Out of scope for 25 min: verifying the resource is excluded from
  auto-scheduling on those dates (AC #3). Leave it out unless you have time.
