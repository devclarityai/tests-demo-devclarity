# Create Project E2E Test Specification

## Goal
Test creating a new project from the Projects list and verify it lands on the
project detail page after a successful save.

## Happy Path Tests
1. Create a project with all required fields (client via type-ahead, project
   type, status, desired start date, desired end date, first anchor date)
2. Cancel the form and verify the user returns to the Projects list without
   saving

## Validation Tests
1. Required fields blank: submit with required fields empty, expect a validation
   error and no save

## Notes
- Client is a type-ahead search against existing clients - select a seeded
  client (do not create one inline).
- Project Type defaults to "Consulting Project"; Status placeholder is
  "Select a status".
- Use a timestamped project name for isolation, and delete it via the project
  factory at the end.
