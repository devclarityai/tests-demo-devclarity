# Heal a Broken Test — Maintenance Exercise

The two commands. Note that Fix mode has logic to classify whether it's a
changed locator or an actual bug in the system before proposing a fix.

Run the projects tests (Fix mode may go straight to the failure without this):

    npx playwright test tests/projects

Fix the locator with /managing-locators
