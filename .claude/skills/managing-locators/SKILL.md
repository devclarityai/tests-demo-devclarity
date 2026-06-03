---
name: managing-locators
description: Explores features to discover stable locators and fixes broken locators in Playwright tests. Two modes — explore (proactive discovery) and fix (reactive repair) — both using playwright-cli for live browser interaction.
---

# Managing Locators

Discover or repair Playwright locators using live browser interaction via
playwright-cli. Determine the mode from the user's request:

- **Explore mode**: User wants to investigate a feature/page for locators
- **Fix mode**: User has a failing test or broken locator to repair

## Pre-flight checks

Run these before starting any work:

```bash
# 1. Verify playwright-cli is installed
playwright-cli --version

# 2. Verify Playwright version is 1.59 or higher
npx playwright --version

# 3. Ensure playwright-cli skills are installed
playwright-cli install --skills

# 4. Session name — use -s=<output> for all playwright-cli calls this run
echo "locators-$RANDOM"
```

If `playwright-cli` is not found, install it first: `npm install -g @playwright/cli@latest && playwright-cli install --skills`

Use the output from step 4 as your `-s=` value for every `playwright-cli` call this run.

## Locator priority (both modes)

1. `getByRole` with accessible name
2. `getByLabel`
3. `getByTestId` data attributes
4. CSS selectors — last resort only

Never use auto-generated classes (e.g., `css-1x2y3z`), positional
selectors (`nth-child`), or exact text matches on dynamic content.

## Explore mode

call View on `./references/explore.md`

1. Navigate to the target page/feature via playwright-cli
2. Snapshot before and after key interactions (dialogs, dropdowns, forms)
3. Catalog discovered locators organized by element purpose
4. Test reliability — verify each locator across multiple attempts

**-> STOP. Present discovered locators and recommended strategies. Confirm with the user before documenting or using them.**

## Fix mode

call View on `./references/fix.md`

1. Analyze the error — identify the broken locator and its intent
2. Navigate to the affected page via playwright-cli and snapshot
3. Classify the root cause before writing any code
4. Find a replacement locator following the priority above
5. Verify the replacement selects exactly one element and works across states

**-> STOP. Present the root cause classification and proposed fix. Confirm with the user before updating test files.**

6. Update the locator in the test/POM file and run the test to confirm

## Critical rules

- Always use playwright-cli for live verification — never guess from source code
- Snapshot before AND after interactions to capture state changes
- For dialogs: wait for inner form fields, not the dialog wrapper
- For repeated elements (tables, lists): use parent context + child selector
- Verify new locators work in different states (empty, populated, loading)
- Check downstream effects — other tests may use the same locator

## Anti-patterns

- Reading application source code to guess locators instead of using playwright-cli
- Using auto-generated CSS classes or positional selectors
- Fixing one locator without checking if similar ones are also broken
- Skipping verification across different page states
- Classifying root cause after writing code instead of before
