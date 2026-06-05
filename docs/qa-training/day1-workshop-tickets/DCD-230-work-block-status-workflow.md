# DCD-230 - Work block status workflow (Available -> Held -> Booked)

**Type:** Story
**Component:** Work Blocks
**Reported by:** Resourcing Lead
**Priority:** High
**Feature status:** Live (already in the app - verify against it)

## Description

Work blocks move through a lifecycle: Available (open slot), Held (tentatively reserved), Booked (confirmed). Planners need to move blocks between these states as a project firms up.

## Acceptance Criteria

- A planner can change a work block's status between Available, Held, and Booked.
- Booked and Held blocks count against the assigned resource's weekly capacity. Available blocks do not.
- The current status is visible on the work block and reflected on the calendar.

## Notes

This is how we stop promising the same person to two projects in the same week.
