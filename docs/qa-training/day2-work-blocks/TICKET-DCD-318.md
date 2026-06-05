# DCD-318: Schedule work blocks on a project

**Type:** Feature
**Status:** Live (built - verify against the running app)
**Component:** Scheduling / Work Blocks
**Reporter:** Product
**Priority:** High

## Summary

Project managers need to schedule the individual work blocks that make up a
project (kickoff, discovery, design, development, testing, wrap-up) and assign
people to them. Add a form to create and edit a work block from a project.

## Background

A project is delivered as a sequence of **work blocks**. Each work block happens
on a specific day, has a type, and has people assigned to it. Today PMs track this
in a spreadsheet. We want it in the app.

## Acceptance Criteria

1. A user can open a "New Work Block" form from a project and from the Work Blocks
   list.
2. The form captures:
   - **Title** (free text)
   - **Project** (choose from existing projects)
   - **Work Block Type** (choose from existing types: Project Kickoff, Discovery,
     Design, Development, Testing, Project Wrap-up, Other)
   - **Date**
   - **Status** (Held or Booked)
3. Title, Project, Work Block Type, Date, and Status are all required. Submitting
   with any of them blank shows a validation error and does not save.
4. When a Work Block Type is selected, the form shows the resource-assignment
   section for that type, where the user can assign people to the roles for that
   type.
5. On successful save, the user is returned to the project page (or the Work Blocks
   list) with a "Work block was successfully created" confirmation.
6. A user can edit an existing work block and change any field, and can delete a
   work block (with a confirmation prompt).
7. Validation errors are shown together at the top of the form, listing each
   problem.

## Out of scope

- Recurring work blocks
- Calendar drag-and-drop (handled by the Birds-Eye view)
- Notifications

## Notes

- "Status" reflects whether the slot is tentatively **Held** or confirmed **Booked**.
- Reuse the existing project, type, and status lists - do not add new admin screens.
