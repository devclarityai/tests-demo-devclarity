import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { testUsers } from "@fixtures/test-data";

const authFile = ".auth/user.json";

setup("authenticate", async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUsers.testUser.email, testUsers.testUser.password);

  await expect(page).not.toHaveURL(/.*\/session/);
  await expect(loginPage.signOutButton).toBeVisible();
  await expect(loginPage.userEmailDisplay).toHaveText(testUsers.testUser.email);

  await context.storageState({ path: authFile });
});
