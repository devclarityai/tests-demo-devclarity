# AGENTS.md

This file provides guidance to GitHub Copilot and coding agents when working in this repository.

## Repository Snapshot
- Playwright + TypeScript test suite for Demo DevClarity (Rails app at `BASE_URL`).
- This repository stores tests only, not application source.
- Main focus areas: auth/session, clients CRUD, projects flow, weekly calendar.
- Test suite doubles as QA training material under `docs/qa-training/`.

## Architecture
- UI specs live in `tests/<feature>/<feature>.spec.ts`.
- Setup specs use `.setup.ts` and run in the Playwright `setup` project.
- Page objects live in `lib/pages/` and should contain locators, actions, and flows only, no assertions.
- UI data setup/teardown uses `lib/datafactory/` (`create*` and matching `delete*`).
- Shared data/constants are in `lib/fixtures/test-data.ts`.
- Helper utilities are in `lib/helpers/`.
- Import via path aliases from `tsconfig.json`: `@pages/*`, `@datafactory/*`, `@helpers/*`, `@fixtures/*`.

## Hard Rules For Agents
- Prefer semantic locators (`getByRole`, `getByLabel`, `getByText`) over CSS.
- Use Playwright web-first assertions (`toHaveURL`, `toBeVisible`, `toHaveText`, etc.).
- Do not add hard waits (`waitForTimeout`) except the existing sanctioned warm-up in `clickAndGetAPIData`.
- Do not hardcode credentials or base URLs; use env vars/test fixtures.
- Keep tests independent and self-cleaning.
- Do not delete seeded records used by other specs (`CLOUD_BRIDGE_ID = 2`, `Apex Digital Partners`, `DataStream Technologies`).
- Keep imports alias-based, avoid relative imports where aliases exist.

## Authentication Model
- Session setup is done once in `tests/setup/auth.setup.ts` and stored in `.auth/user.json`.
- UI projects reuse the stored session (`dependencies: ["setup"]`, `storageState: ".auth/user.json"`).
- Anonymous tests opt out with empty `storageState` (see auth/API session specs).
- Login is rate-limited; avoid repeated UI logins within test bodies.

## API Coverage Notes
- Current API coverage is minimal (`tests/api/session.api.spec.ts`, session + CSRF).
- `/api/v1` bearer-key endpoints in `docs/api/` are mostly untested.

## Commands
- Install: `npm install && npx playwright install`
- Full run: `npm run test:e2e`
- Single spec: `npx playwright test tests/clients/clients.spec.ts`
- Single test: `npx playwright test -g "create client with valid name"`
- API-only run: `npx playwright test tests/api/`
- Report: `npm run test:e2e:report`
- Typecheck: `npx tsc --noEmit`

## Output And Evidence
- Reporters: `html` and `list`.
- Artifacts are intentionally always on (`screenshot`, `video`, `trace`) for training runs.
- Known product bugs should be represented as `test.skip("BUG-N: ...")` with `Expected` and `Actual` notes.
