# Existing Test Cases - Work Block form (DCD-318)

| ID | Title | Steps | Expected |
|---|---|---|---|
| WB-01 | Create a work block with all fields | Open New Work Block, enter Title "Kickoff call", pick a Project, pick Type "Project Kickoff", pick a weekday Date, pick Status "Held", Save | Work block is created; redirected to the project with a success message |
| WB-02 | Title is required | Leave Title blank, fill the rest, Save | Validation error, not saved |
| WB-03 | Project is required | Leave Project unselected, fill the rest, Save | Validation error, not saved |
| WB-04 | Date is required | Leave Date blank, fill the rest, Save | Validation error, not saved |
| WB-05 | Edit a work block title | Open an existing work block, change the Title, Save | Title is updated |
| WB-06 | Delete a work block | Open an existing work block, click Delete, confirm | Work block is removed |
| WB-07 | Selecting a type shows resource assignments | Pick Type "Discovery" | The resource-assignment section appears with that type's roles |

## Coverage notes (from the previous tester)

- Covered the required-field validations from AC #3 and the basic create/edit/delete
  happy paths.
- Did not get to: status options, resource assignment in depth, or anything about
  which dates or staffing levels are actually allowed. Ran out of time.
