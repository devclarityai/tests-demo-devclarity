# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Overview
- Playwright (TypeScript) test suite targeting the **Demo DevClarity** app, a Rails project/capacity-planning dashboard served at `BASE_URL`. This repo holds tests only; the app lives elsewhere.
- Test types: UI E2E (`tests/auth`, `tests/clients`, `tests/projects`, `tests/calendar`) and HTTP-level API tests (`tests/api`).
- Environments: `BASE_URL` is read from `.playwright.env` (or the file at `ENV_PATH`); defaults to `http://localhost:3001`.
- Critical journeys: login/session, client CRUD, project create/view, weekly work-block calendar.
- Doubles as QA training material: `docs/qa-training/` (workshop tickets, specs, a deliberately broken test) and `.cursor/skills/` (QA + Playwright authoring skills).

## Test Levels & Coverage Shape
- E2E UI dominates. API coverage is thin: `tests/api/session.api.spec.ts` only (session + CSRF). The `/api/v1` bearer-token API documented in `docs/api/` has no tests yet.
- Assertions go past the UI where it matters: detail-page stat values, `dl/dd` field values, breadcrumbs, and post-redirect URLs, not just visibility.
- Known product bugs are encoded as `test.skip("BUG-N: ...")` with `Expected` vs `Actual` comments in the body (see `tests/clients/clients.spec.ts`).
- No unit, visual, contract, or performance layers. No traceability links to Jira; workshop tickets in `docs/qa-training/` carry the DCD-* IDs.

## Architecture & Patterns
- `tests/<feature>/<feature>.spec.ts` — one folder per feature area. Setup files use `.setup.ts` and are matched by the `setup` project.
- `lib/pages/` — classic Page Object Model. Each class takes `readonly page: Page`, exposes locators as readonly fields, then `// -- Actions --` (parameterized locator getters) and `// -- Flows --` (`goto*`, multi-step actions). No assertions inside page objects.
- `lib/datafactory/` — `createClient`/`deleteClient`, `createProject`/`deleteProject`. UI-driven arrange/teardown that returns the new record ID parsed from the URL.
- `lib/fixtures/test-data.ts` — shared constants (`testUsers`, `testClients`, `testProjects`, `testResources`). Credentials come from env.
- `lib/helpers/` — `auth.helper.ts` (programmatic login), `csrf.helper.ts` (scrapes the Rails `authenticity_token`), `clickAndGetAPIData.ts` (pairs a click with `waitForResponse`, returns request + response), `arrays.ts`.
- Path aliases in `tsconfig.json`: `@pages/*`, `@datafactory/*`, `@helpers/*`, `@fixtures/*`. Import through these, never relative paths.
- `lib/pages/resources.page.ts` exists with no spec behind it — a starting point, not dead code.
- Agent skills for this repo live under `.cursor/skills/`.

## Stack Best Practices
- `@playwright/test` ^1.60, TypeScript 5, Node 24. Chromium only; other browsers and mobile viewports are intentionally commented out in `playwright.config.ts`.
- Locators: `getByRole` / `getByLabel` / `getByText` first. CSS only where the DOM offers no semantic hook (`locator("tbody")` to scope rows, `[data-work-block-id]`).
- Web-first assertions only (`toBeVisible`, `toHaveURL`, `toHaveText`, `toHaveValue`, `toHaveCount`) — they carry the auto-wait.
- Rails delete buttons fire a native confirm. Register `page.once("dialog", d => d.accept())` immediately before the click.
- Config runs `workers: 1`, `retries: 0`, 20s test timeout. Tests must still be independent and self-cleaning.
- Login is rate-limited (10 attempts / 3 minutes). Reuse the stored session; do not log in per test.

## Anti-Patterns
- Relative imports where an alias exists.
- `waitForTimeout` and other hard waits. The only sanctioned one is the 1s warm-up inside `clickAndGetAPIData`.
- Creating data by seeds or raw SQL instead of the factories, or leaving records behind — every `create*` needs its matching `delete*`.
- Hardcoded credentials or base URLs. Read from `testUsers` / `process.env`.
- `if/else` around assertions. Assert the expected state directly.
- Deleting the seeded records other specs pin by ID/name (`CLOUD_BRIDGE_ID = 2`, `"Apex Digital Partners"`, `"DataStream Technologies"`).
- Enabling extra browser projects without coordinating; single-worker config assumes one.

## Test Layout Conventions
- Naming: `<feature>.spec.ts`; API specs use `<resource>.api.spec.ts`. Test titles are behavioral sentences ("create client with valid name appears in the index").
- Section banners inside a spec: `// ---- HAPPY PATH ----`, `// ---- EDGE CASES ----`, `// ---- NEGATIVE / ERROR TESTS ----`, `// ---- BUG TESTS ----`.
- No tag system (`@smoke`/`@regression`) in use. Select with `-g` or a path.
- Page objects are instantiated per test (or in `beforeEach`), not shared across files.
- Unique record names use `` `${prefix} ${Date.now()}` ``.

## Test Data Hygiene
- Create through `lib/datafactory/*`, which returns the ID; delete through the same module before the test ends.
- Seeded records are read-only fixtures referenced by module-level constants at the top of each spec.
- Env vars live in `.playwright.env` (gitignored). `.playwright.env.example` documents `BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `API_WRITE_KEY`.
- `.auth/user.json` (storage state) and `test-results/` are gitignored; never commit them.
- Use synthetic names only. The XSS-escaping spec deliberately stores a `<script>` payload, then deletes it.

## Authentication & Session Handling
- `tests/setup/auth.setup.ts` runs once as the `setup` project: logs in via `LoginPage`, asserts the session landed, writes `.auth/user.json` with `context.storageState`.
- The `chromium` project declares `dependencies: ["setup"]` and `storageState: ".auth/user.json"`, so every UI spec starts authenticated. Cost is one login per run.
- Specs that need an anonymous session opt out with `test.use({ storageState: { cookies: [], origins: [] } })` — see `tests/auth/login.spec.ts` and `tests/api/session.api.spec.ts`.
- Session-cookie auth for the app (`POST /session`, `DELETE /session`); form posts need a CSRF token from `getCsrfToken()`. The separate `/api/v1` surface uses `sk_*` bearer keys (`API_WRITE_KEY`) and no CSRF.
- Single admin role. No multi-role matrix.

## Test Reporters & Metrics
- Reporters: `html` (to `playwright-report/`, `open: "never"`) and `list`.
- `screenshot`, `video`, and `trace` are all `"on"` — full artifacts every run, into `test-results/`. Heavy by design for training; trim before adding CI.
- No flake quarantine and no retries, so a red test is a real signal.
- No CI workflow in this repo (only `.github/dependabot.yml`); runs are local.

## Commands & Scripts
- Install: `npm install && npx playwright install`
- Full suite: `npm run test:e2e` · headed: `npm run test:e2e:headed` · UI mode: `npm run test:e2e:ui` · debug: `npm run test:e2e:debug`
- Single spec: `npx playwright test tests/clients/clients.spec.ts`
- Single test: `npx playwright test -g "create client with valid name"`
- API only: `npx playwright test tests/api/`
- Report: `npm run test:e2e:report` · trace: `npx playwright show-trace test-results/<path>/trace.zip`
- Codegen: `npx playwright codegen $BASE_URL`
- Alternate environment: `ENV_PATH=./.playwright.staging.env npx playwright test`
- Typecheck: `npx tsc --noEmit`
