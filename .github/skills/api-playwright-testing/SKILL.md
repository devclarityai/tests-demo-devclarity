---
name: api-playwright-testing
description: Guides the creation of Playwright API tests from exploration through implementation. Covers API discovery, test plan creation, helper/data factory development, and test writing with human checkpoints at each stage.
---

# Writing API Tests

Create Playwright API tests for an endpoint or resource, from exploration
through passing tests. Follow this workflow step by step. **Stop after
each step and check in with the user before proceeding.**

## Workflow checklist

```
API Test Progress:
- [ ] Step 1: Explore the API
- [ ] Step 2: Create the test plan
- [ ] Step 3: Create/update helpers & data factories
- [ ] Step 4: Write the tests
```

## Step 1: Explore the API

Understand the API before writing any tests. Gather information through
one or more of these methods:

1. **OpenAPI / Swagger spec** - Ask the user if an OpenAPI spec or
   Swagger URL is available. If yes, fetch and analyze it to extract
   endpoints, request/response schemas, required fields, auth
   mechanisms, and status codes.
2. **Exploratory API calls** - If no spec is available, make requests
   against the API using Playwright's `request` context or curl.
   Document endpoints, methods, auth requirements, request shapes,
   and response shapes by observing actual behavior.
3. **Existing test code** - Read any existing test files, helpers, or
   data factories in the project to understand what's already covered
   and what patterns are established.

For each endpoint discovered, document:

    # API Exploration: [Resource]
    [Overview of the resource and its purpose]

    ## Endpoints Discovered
    - [METHOD] [path] - [description]
      - Auth: [required | optional | none]
      - Request body: [shape or "none"]
      - Response: [status code] [shape]

    ## Authentication Mechanism
    - [cookie | token | bearer | API key | none]
    - [How to obtain credentials]

    ## Data Models
    - [Model name]: [key fields, types, required vs optional]

    ## Dependencies Between Resources
    - [e.g., "Booking requires a Room to exist first"]

**-> STOP. Present the exploration findings. Confirm endpoints, auth mechanism, and data models with the user before proceeding.**

## Step 2: Create the test plan

Based on the exploration, plan which endpoints to test and what
scenarios to cover. If the user provides specific test scenarios, use
ONLY those. Do not invent additional scenarios.

Present the plan in chat using this structure:

    # Test Plan for [Resource]
    [Overview]

    ## Setup Required
    - [Dependencies]: [What must exist before tests run]
    - [Auth]: [How auth headers/cookies will be created]

    ## Data Factories Needed
    - [Factory name]: [What it creates, with what randomization]

    ## Helper Modifications
    - [Helper]: [New methods or changes needed]

    ## Test Files to Create
    - [resource].[method].spec.ts
      - **[Test Case]**: [Description]
        - Arrange: [Setup steps]
        - Act: [Request details]
        - Assert: [Expected status, body, headers]

For each endpoint, consider these test categories:

- **Happy path** - Valid request with all required fields
- **Authentication** - Missing auth, invalid auth, expired auth
- **Validation** - Missing required fields, invalid types, boundary values
- **Not found** - Non-existent resource IDs
- **Integration** - Create-then-read, update-then-verify workflows

Include exact data requirements. Use Faker.js for realistic randomized
data. Do NOT write the plan to a file.

**-> STOP. Present the plan. Confirm scope, test cases, and data requirements with the user before proceeding.**
requirements with the user before proceeding.**

## Step 3: Create/update helpers & data factories

1. Read existing helper and data factory files to identify what can be
   reused or extended.
2. For authentication, create or update header-creation helpers that
   return ready-to-use auth headers (cookies, tokens, or API keys).
   Include an invalid-auth helper for negative tests.
3. For test data, create factory functions that generate randomized
   request bodies using Faker.js. Each factory should:
   - Return a complete, valid request body by default
   - Accept optional overrides for specific fields
   - Handle resource dependencies (e.g., create a room before a booking)
4. Run any unit tests for helpers to verify they work.

Helper patterns to follow:

    // Data factory with Faker.js
    export async function createRandomResourceBody(
      parentId: number
    ) {
      return {
        parentId: parentId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        active: Math.random() < 0.5,
      };
    }

    // Auth header helper
    export async function createHeaders(): Promise<object> {
      // Handle login flow and return ready-to-use headers
      const token = await getAuthToken(username, password);
      return { Authorization: `Bearer ${token}` };
    }

    export async function createInvalidHeaders(): Promise<object> {
      return { Authorization: "Bearer invalid-token" };
    }

Rules:

- Factories generate randomized but valid data by default
- Auth helpers handle the full login flow internally
- Keep helpers focused - one responsibility per function

**-> STOP. Present the helpers and data factories. Review signatures, data shapes, and auth flow with the user.**

## Step 4: Write the tests

1. Read the test plan to identify the test cases to implement.
2. Read the relevant helpers and factories to understand available
   methods.
3. Write test files organized by resource and HTTP method:
   `tests/[resource]/[resource].[method].spec.ts`
4. Run the tests to confirm they pass.

Test file structure to follow:

    import { test, expect } from "@playwright/test";

    test.describe("resource/ GET requests", async () => {
      let headers;

      test.beforeAll(async () => {
        headers = await createHeaders();
      });

      test("GET all resources", async ({ request }) => {
        const response = await request.get("resource/", {
          headers: headers,
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.length).toBeGreaterThan(0);
      });

      test("GET resource without auth", async ({ request }) => {
        const response = await request.get("resource/");
        expect(response.status()).toBe(403);
      });
    });

Rules:

- One test file per resource + HTTP method combination
- `test.describe` groups tests by endpoint and method
- `test.beforeAll` / `test.beforeEach` for shared setup
- Use `test.step()` for multi-step integration tests
- Each request should assert status code first, then body
- Use `request.newContext()` when tests need isolated cookie state

**-> STOP. Share test results. Confirm tests pass and cover the intended scenarios.**

## Critical rules

- Plan stays in chat, never written to a file
- If user provides test scenarios, use ONLY those - no extras
- Always ask about OpenAPI spec or Swagger before exploratory calls
- Use Faker.js for randomized test data, not hardcoded values
- Organize tests by resource and HTTP method
- Run tests after creating helpers AND after writing tests
- Set realistic scope - avoid feature creep

## Anti-patterns

- Hardcoding test data instead of using factories with Faker.js
- Skipping auth testing (missing, invalid, expired)
- Testing only happy paths without negative scenarios
- Putting request logic in test files instead of helpers/factories
- Writing the test plan to a file instead of keeping it in chat
- Inventing test scenarios when the user provided specific ones
- Using `test.fixme()` or `test.skip()` to hide failures
- Not cleaning up created test data when the API requires it
