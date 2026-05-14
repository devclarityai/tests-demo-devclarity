---
name: e2e-testing
description: Guides the creation of Playwright E2E tests from planning through implementation. Covers test plan creation, data seeding, Page Object Model development, and test writing with human checkpoints at each stage.
---

# Writing E2E Tests

> Before starting, read `.claude/skills/e2e-testing/REFERENCE.md` for project-specific patterns, application context, POM rules, assertion conventions.

## Pre-flight checks

Run these before starting any test work:

```bash
# 1. Verify Playwright version is 1.59 or higher
npx playwright --version
```

---

Create Playwright end-to-end tests for a feature or workflow, from plan
through passing tests. Follow this workflow step by step. **Stop after
each step and check in with the user before proceeding.**

## Workflow checklist

```
E2E Test Progress:
- [ ] Step 1: Create the test plan
- [ ] Step 2: Seed test data (skip if not needed)
- [ ] Step 3: Create/update Page Object Models
- [ ] Step 4: Write the tests
```

## Step 1: Create the test plan

Read and analyze the feature or workflow to be tested. Identify key
interaction points, required test data, page objects, and test scenarios.

If the user provides specific test scenarios, use ONLY those. Do not
invent additional scenarios.

Present the plan in chat using this structure:

    # Test Plan for [Feature]
    [Overview]

    ## Setup Required
    - [Entity]: [Quantity], [Attributes], [Relationships]

    ## POM Modifications & Creations
    - [Page Object]: [Changes or new methods needed]

    ## Test Cases to Implement
    - **[Test Case]**: [Description]
      - Steps: [Numbered steps]
      - Expected Result: [Outcome]

Include exact data requirements — quantities, attributes, relationships.
Use timestamps in test identifiers to avoid conflicts. Do NOT write the
plan to a file. Document assumptions about existing system state.

**-> STOP. Present the plan. Confirm scope, test cases, and data
requirements with the user before proceeding.**

## Step 2: Seed test data

_Skip if the test plan requires no new data. Tell the user immediately
and move to Step 3._

1. Read and review the existing API helper methods in the project's
   test helpers lib/helpers or data factory directories lib/datafactory.
2. If the needed entity type isn't supported, extend the data factory helpers
   with a TypeScript interface and creation method.
3. Create a test spec file that seeds the data with meaningful,
   varied values and console logging for visibility.
4. Run the seed to verify data creation.

**-> STOP. Confirm data was created successfully or that this step was
skipped. Share a summary of what was seeded.**

## Step 3: Create/update Page Object Models

1. Read existing POM files to identify what can be reused or extended.
   Review current locator strategies.
2. For each page/component in the plan, create or update a POM class.
3. Use Playwright MCP to validate locators — navigate to the page,
   take browser snapshots, and verify elements exist. If locators need
   discovery, explore the feature: snapshot before and after key
   interactions, test locator reliability across multiple attempts.
4. Document assumptions about page state or prerequisites.

Locator priority: `getByRole` > `getByLabel` > `getByTestId` > CSS
(last resort). Never use auto-generated classes (e.g., `css-1x2y3z`).

Follow the Page Object Pattern in `REFERENCE.md` for the exact POM template and rules.

**-> STOP. Present the POM classes. Review locator strategies and
method signatures with the user.**

## Step 4: Write the tests

1. Read the test plan to identify the specific test case to implement.
2. Read the relevant POMs to understand available methods.
3. Write the test. Do NOT reference application source code to generate
   locators — use only what the POMs provide.
4. Run the tests to confirm they pass.

**-> STOP. Share test results. Confirm the test passes and covers the
intended scenario.**

## Critical rules

- Plan stays in chat, never written to a file
- If user provides test scenarios, use ONLY those — no extras
- Timestamps in test identifiers for isolation
- Validate locators via Playwright MCP, not by reading source code
- Run tests after seeding data AND after writing tests
- Set realistic scope — avoid feature creep

## Anti-patterns

- Generating locators by reading application source code
- Using auto-generated CSS classes as selectors
- Using positional selectors (nth-child) or exact text matches
- Putting business logic in Page Object Models
- Writing the test plan to a file instead of keeping it in chat
- Inventing test scenarios when the user provided specific ones
