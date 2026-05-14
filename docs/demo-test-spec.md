# Test Specification: Resource Model Name Validation

## Objective
Write a test for the `Resource` model to verify that the `name` field is required.

## Requirements

### Test Case 1: Name is required
- **Given**: A new Resource instance without a name
- **When**: Validations are run
- **Then**: The resource should be invalid
- **And**: The errors collection should include a validation error for the name field

### Test Case 2: Name is provided
- **Given**: A new Resource instance with a name and other required fields
- **When**: Validations are run
- **Then**: The resource should be valid

## Implementation Notes
- Write the test for the Resource model following the project's testing conventions
- The Resource model is located at `app/models/resource.rb`
- The test file should be located in the appropriate test directory for model tests
- Use the project's standard assertions and testing patterns

## Acceptance Criteria
- Test runs successfully with the project's test runner
- Test accurately validates the name presence requirement
- Test follows the project's code style and conventions
