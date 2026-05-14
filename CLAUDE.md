# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
- Playwright (TypeScript) test suite targeting the **Demo DevClarity** app, a Rails-based application served at `http://localhost:3001` by default
- Test types: UI E2E (clients, projects, calendar, auth) and HTTP-level API tests (`tests/api/`)
- Target environments: local Rails server; `BASE_URL` is read from `.playwright.env` (or the file pointed to by `ENV_PATH`)
- Critical flows validated: login/session, client CRUD, project CRUD, weekly calendar view

## Test Levels & Coverage Shape
- E2E UI tests dominate; a small API layer covers session/CSRF endpoints directly via `request` fixture
- API session spec opts out of stored auth with `test.use({ storageState: { cookies: [], origins: [] } })`
- Known product bugs are encoded as `test.skip("BUG-N: ...")` placeholders in the relevant spec until the app is fixed
- No unit, visual, or performance layers in this repo

## Architecture & Patterns
- `tests/<feature>/` holds spec files, one feature area per folder (`auth`, `api`, `clients`, `projects`, `calendar`, `resources`, `setup`)
- `lib/pages/` is a classic Page Object Model. Each page exposes locator fields and small action/flow methods. Use these instead of inline selectors
- `lib/datafactory/` (`client.factory.ts`, `project.factory.ts`) creates and deletes records through the UI and returns IDs - call these for arrange/teardown rather than crafting fixtures by hand
- `lib/fixtures/test-data.ts` holds shared constants (`testUsers`, `testProjects`, `testClients`, `testResources`). `testUsers.admin` and `testUsers.testUser` both read `ADMIN_EMAIL`/`ADMIN_PASSWORD` from env
- `lib/helpers/`:
  - `auth.helper.ts` — programmatic login via `LoginPage`
  - `csrf.helper.ts` — scrapes the Rails `authenticity_token` from a form page before posting
  - `clickAndGetAPIData.ts` — pairs a click with `waitForResponse` and captures both request and response
  - `arrays.ts` — small array utilities
- TypeScript path aliases (defined in `tsconfig.json`): `@pages/*`, `@datafactory/*`, `@helpers/*`, `@fixtures/*`. Always import via these, not relative paths

## Stack Best Practices
- Playwright `@playwright/test` ^1.60; Node 24, TypeScript 5
- Locator strategy: prefer `getByRole`, `getByLabel`, and `getByText`. CSS only when DOM has no semantic hook (e.g. `locator("tbody")` for the rows scope)
- All page objects expose locators as readonly fields built off `this.page` - mirror that pattern when adding new pages
- Rely on web-first assertions (`toBeVisible`, `toHaveURL`, `toHaveValue`). No `waitForTimeout` except the deliberate 1s warm-up in `clickAndGetAPIData`
- Rails delete buttons trigger a native confirm dialog - register `page.once("dialog", d => d.accept())` immediately before the click
- For Rails form validation tests, call `formPage.disableHtml5Validation()` so the server-side error path is exercised
- Single worker, zero retries (see `playwright.config.ts`). Tests must be independent and clean up after themselves

## Anti-Patterns
- Do not import via relative paths when an `@pages` / `@helpers` / `@fixtures` / `@datafactory` alias exists
- Do not create test data with raw SQL or seeds - go through the factory functions so the UI path stays exercised
- Do not hardcode the admin credentials or `BASE_URL` - read from env via `testUsers` or `process.env`
- Do not leave records behind. Every `createClient` / `createProject` must have a matching delete (the factories provide `deleteClient` / `deleteProject`)
- Do not branch with `if/else` around assertions - assert the expected state directly
- Do not enable browsers other than chromium in `playwright.config.ts` without coordinating; the others are intentionally commented out

## Test Layout Conventions
- Spec naming: `<feature>.spec.ts` under the matching `tests/<feature>/` folder; setup files use `.setup.ts` and are picked up by the `setup` project via `testMatch: /.*\.setup\.ts/`
- Group tests inside a spec with `// ---- HAPPY PATH ----`, `// ---- EDGE CASES ----`, `// ---- NEGATIVE / ERROR TESTS ----`, `// ---- BUG TESTS ----` banner comments (see `tests/clients/clients.spec.ts`)
- Known-broken behavior is captured as `test.skip("BUG-N: ...", ...)` with an `Expected` vs `Actual` comment block inside the body
- Unique names for created records use `` `${prefix} ${Date.now()}` `` to avoid collisions across parallel runs

## Test Data Hygiene
- Generate test data through `lib/datafactory/*` (UI-driven, returns the new ID). Delete via the same factory before the test ends
- Some specs reference seeded records by hard-coded ID/name (e.g. `CLOUD_BRIDGE_ID = 2`, `CLOUD_BRIDGE_NAME = "CloudBridge Systems"`). These rely on the app's default seed data - do not delete them
- Env vars live in `.playwright.env` (gitignored). `.playwright.env.example` documents the required keys: `BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `playwright.config.ts` calls `loadEnvFile(process.env.ENV_PATH ?? "./.playwright.env")` at startup
- The `.auth/` directory holds the persisted login storage state and is gitignored

## Authentication & Session Handling
- `tests/setup/auth.setup.ts` runs once as the `setup` project: it logs in with `testUsers.testUser`, asserts the session landed, and writes `.auth/user.json` via `context.storageState`
- The `chromium` project depends on `setup` and applies `storageState: ".auth/user.json"`, so every UI spec starts already authenticated
- API tests that must hit unauthenticated endpoints opt out per-spec with `test.use({ storageState: { cookies: [], origins: [] } })` and obtain a CSRF token via `getCsrfToken()` before POSTing
- Credentials only come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars - never hardcode

## Test Reporters & Metrics
- Reporters: `html` (written to `playwright-report/`, never auto-opens) and `list`
- `screenshot`, `video`, and `trace` are all set to `"on"` - every run records full artifacts to `test-results/`. Keep this in mind on long suites
- View the last report with `npm run test:e2e:report`

## Commands & Scripts
- Install: `npm install && npx playwright install`
- Run full suite: `npm run test:e2e`
- Headed: `npm run test:e2e:headed`  ·  UI mode: `npm run test:e2e:ui`  ·  Debug: `npm run test:e2e:debug`
- Single spec: `npx playwright test tests/clients/clients.spec.ts`
- Single test by title: `npx playwright test -g "create client with valid name"`
- Run just the API tests: `npx playwright test tests/api/`
- Codegen against the configured base URL: `npx playwright codegen $BASE_URL`
- Open trace: `npx playwright show-trace test-results/<path>/trace.zip`
- Report: `npm run test:e2e:report`
- Point at a non-default env file: `ENV_PATH=./.playwright.staging.env npx playwright test`
