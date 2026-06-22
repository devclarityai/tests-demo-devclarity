# E2E Testing Reference

Reference material for writing and debugging Playwright E2E tests in this project.

---

## Application Under Test

**Project Management Dashboard** — capacity planning and resource management system.

- **Base URL**: `http://localhost:3001` if localhost else (set via `BASE_URL` env var in `.playwright.env`)
- **Config**: `playwright.config.ts` | **Tests**: `tests/**/*.spec.ts`

---

## Application Conventions

### Authentication

Session-based (no JWT). Users are seeded — no public registration.

- Sign in: `POST /session` with `email_address` and `password`
- Sign out: `DELETE /session`
- Rate limit: **10 login attempts per 3 minutes**
- Test credentials: `@fixtures/test-data` → `testUsers.testUser`

### Key Routes

| Route | Purpose |
|-------|---------|
| `/session/new` | Login page |
| `/calendar/work_blocks_weekly` | Main 12-week calendar |
| `/calendar/birds_eye_work_blocks` | High-level overview |
| `/projects` | Project management |
| `/resources` | Resource management |
| `/clients` | Client management |
| `/work_blocks` | Work block management |

### CSRF Tokens

All form `POST` requests require an `authenticity_token`. For API tests use the helper:

```typescript
import { getCsrfToken } from "@helpers/csrf.helper";

const token = await getCsrfToken(request, baseUrl + "/session/new");
const response = await request.post(baseUrl + "/session", {
  form: { authenticity_token: token, email_address: "...", password: "..." },
});
```

### SPA-Style Navigation

The app uses progressive-enhancement navigation (intercepted form submits and link clicks). After form submissions:
- Use `page.waitForURL(...)` not `waitForLoadState('networkidle')`
- Wait for specific elements to appear — network idle does not mean DOM is ready

### Delete Confirmation

After a delete action with an in-page confirmation, wait for DOM removal rather than network idle:

```typescript
await page.waitForFunction(
  (name) => !Array.from(document.querySelectorAll("tbody tr"))
    .some((row) => row.textContent?.includes(name)),
  itemName,
  { timeout: 10000 }
);
```

### Checkbox Defaults

Checkboxes may default to **unchecked** regardless of visual state. Always verify and explicitly set checkbox state — never assume.

Never use `form.submit()` directly — it bypasses the app's navigation interception and loses session cookies.

### Text Content

`textContent()` includes HTML whitespace. Always `.trim()`:

```typescript
const text = (await cell.textContent())?.trim();
```

---

## Commands

```bash
npm run test:e2e          # Run all tests (headless)
npm run test:e2e:headed   # Run with visible browser
npm run test:e2e:ui       # Playwright UI mode
npm run test:e2e:debug    # Step-through debug mode
npm run test:e2e:report   # View last report
```

---

## Structure

```
tests/
├── api/             ← Raw HTTP/API tests (*.api.spec.ts)
├── auth/            ← Auth flow tests
└── calendar/        ← Feature tests
lib/
│   ├── pages/           ← Page Object Models
│   ├── fixtures/        ← Test data (test-data.ts)
│   └── helpers/         ← Shared utilities (csrf.helper.ts)
└── .auth/               ← Saved auth state (gitignored)
```

Import aliases (defined in `tsconfig.json`):
- `@pages/*` → `lib/pages/*`
- `@fixtures/*` → `lib/fixtures/*`
- `@helpers/*` → `lib/helpers/*`
- `@datafactory/*` → `lib/datafactory/*`

---

## Authentication (Playwright Setup)

Auth uses a **setup project** — `tests/auth.setup.ts` runs before all tests and saves session to `.auth/user.json`. The `chromium` project depends on `setup` and reads `storageState` automatically.

Tests that need no auth (login tests, API tests):
```typescript
test.use({ storageState: { cookies: [], origins: [] } });
```

---

## Page Object Pattern

Every page object follows this exact structure:

```typescript
import { Page } from "@playwright/test";

export class ExamplePage {
  constructor(readonly page: Page) {}

  // -- Locators --
  readonly heading = this.page.getByRole("heading", { name: "Example" });
  readonly table = this.page.getByRole("table");
  readonly newButton = this.page.getByRole("link", { name: "New Example" });
  readonly rows = this.page.locator("tbody").getByRole("row");

  // -- Actions (only when dynamic — requires a parameter) --
  getRowByIndex(index: number) {
    return this.rows.nth(index);
  }

  // -- Flows (multi-step sequences used across tests) --
  async goto(): Promise<void> {
    await this.page.goto("/example");
  }
}
```

Rules:
- `constructor(readonly page: Page) {}` — always this shorthand
- Locators as inline class fields, not assigned inside the constructor body
- No `BasePage` — each page is self-contained
- Single-step actions (click, fill) belong in tests, not POMs
- Navigation methods named `goto()` or `gotoViewName()` (e.g., `gotoWeeklyView()`)

### Locator Priority

1. `getByRole` — buttons, links, headings, tables, rows, form controls
2. `getByLabel` — form fields with associated labels
3. `getByTestId` — elements with `data-testid` (add to view if needed)
4. CSS attribute selector — `[data-work-block-id]`
5. CSS class — last resort, never Tailwind utility classes

---

## Assertions

Always use web-first assertions — they auto-wait and produce better failure messages.

```typescript
// Page URL
await expect(page).toHaveURL(/\/projects/);
await expect(page).not.toHaveURL(/.*\/session\/new/);

// Locator state
await expect(locator).toBeVisible();
await expect(locator).toHaveText("Expected");
await expect(locator).toBeEnabled();

// API responses
await expect(response).toBeOK();  // status 200-299
```

Never use synchronous assertions for page/locator state:
```typescript
// BAD
expect(page.url()).toContain("/path");
expect(await locator.isVisible()).toBeTruthy();

// GOOD
await expect(page).toHaveURL(/\/path/);
await expect(locator).toBeVisible();
```

Exception: `APIResponse.url()` has no web-first equivalent:
```typescript
expect(response.url()).toContain("/session");  // correct for APIResponse
```

---

## tsconfig.json Notes

- `"useDefineForClassFields": false` — required for inline locator fields that reference `this.page`. Without this, TypeScript emits fields before the constructor runs, causing TS error 2729 "Property used before initialization".
- If VS Code shows unresolved `@pages/*` imports: run "TypeScript: Restart TS Server".

---

## playwright-cli (Debugging Tool)

`playwright-cli` is a standalone CLI for interacting with running Playwright browsers — useful for debugging agentic test runs and attaching to paused tests.

### Install

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Run `playwright-cli install --skills` after installing to enable skill support for the CLI.

### Debug a paused test

Run tests with `--debug=cli` to pause at each step and attach via CLI:

```bash
npx playwright test --debug=cli
# Output: Run "playwright-cli attach tw-87b59e" to attach

playwright-cli attach tw-87b59e
playwright-cli --session tw-87b59e step-over
playwright-cli --session tw-87b59e snapshot
```

### Open the Dashboard

Shows all bound browsers, their status, and allows manual interaction:

```bash
playwright-cli show
```

### Analyze a trace from the CLI

Useful for understanding failing tests without opening the HTML report:

```bash
npx playwright trace open test-results/example-chromium/trace.zip

# List actions matching a filter
npx playwright trace actions --grep="expect"

# Inspect a specific action by number
npx playwright trace action 9

# Get the DOM snapshot at that point
npx playwright trace snapshot 9 --name after

npx playwright trace close
```

---

## Playwright 1.59 — Features Useful for Testing and Debugging

### `page.pickLocator()` — interactive locator discovery

Enters an interactive mode where hovering over elements highlights them and shows the best locator. Click to capture it. Use instead of reading source HTML to find selectors:

```typescript
const locator = await page.pickLocator();
// hover over element in browser, click to capture
await page.cancelPickLocator();
```

### `locator.normalize()` — improve existing locators

Converts a locator to follow best practices (test IDs, aria roles):

```typescript
const better = await page.locator('input.email-field').normalize();
```

### `page.ariaSnapshot()` — capture aria tree

Useful for understanding what roles and names are available on a page when building POMs:

```typescript
const snapshot = await page.ariaSnapshot();
console.log(snapshot);
```

### `browserContext.setStorageState()` — reset auth mid-test

Clears existing cookies, local storage, and IndexedDB and sets new state without creating a new context:

```typescript
await context.setStorageState({ cookies: [], origins: [] });
```

### Screencast — video recording with annotations

Alternative to `recordVideo` with precise start/stop control:

```typescript
await page.screencast.start({ path: 'video.webm' });
await page.screencast.showActions({ position: 'top-right' });
// ... perform actions ...
await page.screencast.stop();
```

---

## Anti-Patterns

- `expect(page.url())` or `expect(await locator.isVisible())` — use web-first assertions
- Locators from Tailwind CSS classes — change with styling
- Generating locators by reading source code instead of browser inspection
- Single submit method for both happy path and validation cases
- Assuming checkbox default states without checking the model
- Writing test plans to files — keep in chat
- Any kind of HTML5 validation bypass, all interactions should go through the UI as a user would
