# Resource Creation E2E Test Specification

## Goal
Test the path to create a new resource using the form and verify the resource appears correctly in the list after creation.

## Happy Path Tests
1. Minimal required fields
2. All fields populated
3. Inactive resource
4. Part-time resource with decimal hours

## Validation Tests
1. Required field: name
2. Required field: billable hours
3. Business rule: billable hours > 0