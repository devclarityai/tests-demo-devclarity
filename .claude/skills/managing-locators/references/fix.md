# Fix Mode Reference

## Inputs
- Test file path with the failing test
- Error message showing the broken locator
- Optional: description of the element's purpose

## Steps

1. **Analyze the error**
   - Identify the broken locator and what element it targeted
   - Read the test file and relevant POM to see how the locator is used

2. **Navigate and snapshot** using playwright-cli

   ```bash
   playwright-cli goto <url-of-failing-page>
   playwright-cli snapshot
   ```

   Use the snapshot to:
   - Verify elements exist with expected roles and names
   - Check that locators in the POM still match current UI
   - Identify text or structure changes that broke assertions

3. **Root cause analysis** — classify the failure before writing any code:

   | Category | Symptoms | Fix direction |
   |---|---|---|
   | **Stale locator** | `No element found` or timeout on a known element | Update the POM locator using browser inspection |
   | **Text/label change** | `toHaveText` assertion fails with wrong actual value | Update the expected value or use regex for dynamic text |
   | **Timing / async** | Intermittent failures, element found but stale | Add web-first assertion before the interaction |
   | **Auth / session** | Redirected to login page unexpectedly | Check auth setup ran correctly; verify storageState is loaded |
   | **Test data** | Record not found, wrong count, missing prerequisite | Review test setup; ensure `beforeEach`/`beforeAll` creates required state |
   | **App regression** | Feature behavior changed | Update the test to match new behavior OR flag as regression |
   | **POM structure** | Method missing, wrong import, TypeScript error | Fix the POM following project conventions |

   **-> STOP. State the classified root cause and the specific file and line you plan to change. Confirm the fix direction with the user before writing any code.**

4. **Find a replacement locator** using playwright-cli's locator picker:

   ```bash
   playwright-cli locator <element description>
   ```

   Follow locator priority:
   - `getByRole` with accessible name
   - `getByLabel`
   - `getByTestId` / data attributes
   - CSS selectors (last resort)

5. **Verify the replacement**
   - Confirm it selects exactly one element
   - Test across different states (empty, populated, loading)
   - For repeated elements: use parent context + child selector
   - For dialogs: target inner form fields, not the dialog wrapper

6. **Update and run**
   - Replace the broken locator in the test or POM file
   - Check if similar locators nearby need the same fix
   - Run the failing test, then run related tests for downstream breakage

## Tips
- [Dialog timing: wait for a specific inner field to be visible after opening — the wrapper appears before contents are ready]
- [Repeated elements: scope with a parent locator first (e.g., `page.locator('tr', { hasText: 'Row' }).locator('button')`) then target the child]
- [Bulk breakage: fix one representative case first and apply the pattern to the rest]
- [Root cause first: classifying the failure type before touching code prevents chasing symptoms]
