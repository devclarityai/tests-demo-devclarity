# DCD-125: Create a new project

**Type:** Story
**Component:** Projects
**Reported by:** Project Manager
**Priority:** High
**Feature status:** Live (already in the app - verify against it)

## Description

Project managers need to create new projects in the app and associate them with a client, project type, status, and scheduling dates. Today this is tracked in spreadsheets and the information is inconsistent across teams.

## Acceptance Criteria

1. A user can navigate to a "New Project" form from the Projects list.
2. The form captures:
   - **Client** (type-ahead search against existing clients)
   - **Project Type** (dropdown; default is "Consulting Project")
   - **Status** (dropdown; placeholder is "Select a status")
   - **Desired Start Date** (date picker)
   - **Desired End Date** (date picker)
   - **First Anchor Date** (date picker; helper text: "All work blocks will be scheduled relative to this anchor date")
3. Submitting with required fields blank shows a validation error and does not save.
4. On successful save, the user is redirected to the project detail page with a confirmation message.
5. Canceling the form returns the user to the Projects list without saving.

## Out of scope

- Creating a new client inline from this form
- Bulk project import
- Project templates

## Notes

- The First Anchor Date drives work block scheduling - its helper text must remain visible on the form.
- Reuse the existing client search, project type, and status lists - do not add new admin screens.
