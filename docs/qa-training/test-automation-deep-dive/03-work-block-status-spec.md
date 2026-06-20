# Work Block Status Workflow E2E Test Specification

## Goal
Test creating a work block and moving it through its status workflow, and
verify the status is reflected on the work block and the calendar.

## Happy Path Tests
1. Create a work block with a title, project, type, a weekday date, and status
   "Held"; verify it is created
2. Edit the work block and change its status from "Held" to "Booked"; verify the
   status updates on the work block detail
3. Verify the work block's current status is visible on the calendar

## Validation Tests
1. Date must be a weekday: enter a Saturday or Sunday date, expect the error
   "Date cannot be on a weekend (Saturday or Sunday). Please select a weekday."

## Notes
- Use a weekday date computed from today (not a hardcoded calendar date) so the
  test stays valid over time.
- DCD-230 mentions an "Available" status, but the form schema lists only Held
  and Booked - verify what the form actually offers before asserting on it.
- Use a timestamped title for isolation and delete the work block at the end.
