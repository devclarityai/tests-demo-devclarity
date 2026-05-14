# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo purpose

Playwright (TypeScript) E2E and API tests against the Demo DevClarity Rails app. There is no application source here, tests only.

## Commands

- `npm install && npx playwright install` - one time setup
- `npm run test:e2e` - run all tests (chromium only by default)
- `npm run test:e2e:headed` / `:ui` / `:debug` - headed, UI mode, debug mode
- `npm run test:e2e:report` - open the last HTML report
- `npx playwright test tests/clients/clients.spec.ts` - run a single spec file
- `npx playwright test -g "create client with valid name"` - run a single test by title
- `npx playwright test --project=chromium` - run only the chromium project (skip setup project)

## Environment

`playwright.config.ts` loads env vars via `loadEnvFile()` from `./.playwright.env` (or `$ENV_PATH` if set). Required keys: `BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. See `.playwright.env.example`. Default `BASE_URL` falls back to `http://localhost:3001`.

## Architecture

### Auth via storage state

`tests/setup/auth.setup.ts` runs as the `setup` Playwright project. It logs in once using `LoginPage`, then writes the session to `.auth/user.json`. The `chromium` project declares `dependencies: ["setup"]` and `storageState: ".auth/user.json"`, so every spec starts already authenticated.

API specs that need an unauthenticated context override this with `test.use({ storageState: { cookies: [], origins: [] } })` (see `tests/api/session.api.spec.ts`). Rails CSRF tokens are scraped from the login form via `lib/helpers/csrf.helper.ts`.

### Page Object Model + factories

- `lib/pages/*.page.ts` - one class per page. Locators declared as readonly fields on the class; flow methods compose them. Pattern: `getRowByName(name)`, `getViewLinkForClient(name)`, etc.
- `lib/datafactory/*.factory.ts` - `createClient(page, name)` / `deleteClient(page, id)` style helpers used to set up and tear down state inside tests. These drive the UI (not the API) and return the created row's numeric ID parsed out of the redirect URL.
- `lib/fixtures/test-data.ts` - centralized test users / projects / clients constants. `testUsers.testUser` reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env.
- `lib/helpers/` - cross-cutting utilities (csrf, auth, arrays, request interception).

### TypeScript path aliases

`tsconfig.json` defines:

- `@pages/*` -> `./lib/pages/*`
- `@datafactory/*` -> `./lib/datafactory/*`
- `@fixtures/*` -> `./lib/fixtures/*`
- `@helpers/*` -> `./lib/helpers/*`

Use these aliases in imports rather than relative paths.

### Test layout convention

Specs are grouped by feature area under `tests/<feature>/<feature>.spec.ts` (clients, projects, calendar, resources). API specs live under `tests/api/`. Within a spec, tests are sectioned with comment banners: `HAPPY PATH`, `EDGE CASES`, `NEGATIVE / ERROR TESTS`, and `BUG TESTS`. Known bugs are kept as `test.skip("BUG-N: ...")` entries documenting expected vs actual until fixed, do not delete them.

### Test data hygiene

Tests that create rows must clean up. Pattern: `const id = await createClient(...)` at the start, `await deleteClient(page, id)` at the end. Unique names use `` `Name ${Date.now()}` `` to avoid cross-run collisions while `fullyParallel: true` is enabled.

### Reporters and artifacts

`screenshot: "on"`, `video: "on"`, `trace: "on"` for all runs. HTML report does not auto-open (`open: "never"`). Test timeout is 20s.

## Conventions

- Conventional commits (`feat:`, `fix:`, `docs:`).
- American English, prefer commas over em dashes.
- When adding a new feature area, mirror the structure: page objects in `lib/pages/`, factories in `lib/datafactory/`, specs in `tests/<feature>/`.
