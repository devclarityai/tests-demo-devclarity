# API Testing Reference

## Project Structure
- [Test directory, e.g., `tests/` - organized by resource (`tests/booking/`, `tests/room/`)]
- [Test file naming, e.g., `[resource].[method].spec.ts` (`booking.post.spec.ts`)]
- [Data factories, e.g., `lib/datafactory/` - one file per resource]
- [Helpers, e.g., `lib/helpers/` - auth, date, and utility functions]
- [Config file, e.g., `playwright.config.ts`]

## Authentication Strategy
- [Auth mechanism, e.g., cookie-based, bearer token, API key]
- [How to obtain credentials, e.g., POST to `/auth/login` returns token]
- [How auth headers are constructed, e.g., `{ Authorization: "Bearer <token>" }`]
- [Invalid auth helper for negative tests, e.g., returns expired or malformed token]
- [Credentials source, e.g., environment variables via `.env`]

## Environment Configuration
- [Env var file, e.g., `.env` with `URL`, `ADMIN_NAME`, `ADMIN_PASSWORD`]
- [Environment switching, e.g., `test_env=staging npm test` loads `.env.staging`]
- [How baseURL is configured, e.g., set in `playwright.config.ts` so tests use relative paths]

## Data Factory Pattern
- [Factory location, e.g., `lib/datafactory/` with one file per resource]
- [Randomization library, e.g., `@faker-js/faker`]
- [Factory return shape, e.g., complete valid request body with randomized fields]
- [Dependency handling, e.g., create parent resource before child]

## Test Data Dependencies
- [Resource relationships, e.g., "Booking requires a Room to exist first"]
- [Setup strategy, e.g., `test.beforeAll` creates shared prerequisites]
- [Isolation strategy, e.g., `test.beforeEach` creates per-test data]

## Common Test Patterns

### Happy Path CRUD
```typescript
test("POST resource with valid data", async ({ request }) => {
  const response = await request.post("resource/", {
    headers: headers,
    data: requestBody,
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.id).toBeGreaterThan(0);
  expect(body.name).toBe(requestBody.name);
});
```

### Missing Auth
```typescript
test("GET resource without auth", async ({ request }) => {
  const response = await request.get("resource/");
  expect(response.status()).toBe(403);
});
```

### Invalid Auth
```typescript
test("PUT resource with invalid auth", async ({ request }) => {
  const invalidHeaders = await createInvalidHeaders();
  const response = await request.put(`resource/${id}`, {
    headers: invalidHeaders,
    data: requestBody,
  });
  expect(response.status()).toBe(403);
});
```

### Missing Required Field
```typescript
test("POST resource without required field", async ({ request }) => {
  const invalidBody = { ...requestBody };
  delete invalidBody.name;

  const response = await request.post("resource/", {
    headers: headers,
    data: invalidBody,
  });

  expect(response.status()).toBe(400);
});
```

### Multi-Step Integration (Create then Verify)
```typescript
test("POST then GET resource", async ({ request }) => {
  let resourceId: number;

  await test.step("Create resource", async () => {
    const response = await request.post("resource/", {
      headers: headers,
      data: requestBody,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    resourceId = body.id;
  });

  await test.step("Verify resource exists", async () => {
    const response = await request.get(`resource/${resourceId}`, {
      headers: headers,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(requestBody.name);
  });
});
```

### Non-Existent Resource
```typescript
test("GET non-existent resource returns 404", async ({ request }) => {
  const response = await request.get("resource/999999", {
    headers: headers,
  });
  expect(response.status()).toBe(404);
});
```

## Test Template
```
[Paste a real, representative test from the codebase that shows
the auth handling, assertions, data factory usage, and setup/teardown
style your team uses. This anchors Claude to the project's actual style.]
```

## Functions & Patterns to Avoid
- Never hardcode test data - use Faker.js factories
- Never share mutable state between tests without `beforeEach` reset
- Don't assert on auto-incrementing IDs beyond existence checks
- Don't rely on database state from prior test runs - create what you need
- Avoid sleeping or polling - use `expect().toPass()` with retry intervals for eventual consistency

## Framework-Specific Gotchas
- `response.json()` throws if body is empty - check `response.text()` first for endpoints that return empty bodies (e.g., login, delete)
- `request.newContext()` is needed when tests require isolated cookie jars
- PUT/PATCH may require the full object, not just changed fields - check API behavior
- Some APIs return different status codes for the same error depending on auth state (e.g., 403 vs 401)
- Date fields may be timezone-sensitive - use UTC helpers for consistency
- [Add project-specific gotchas here]
