import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { testUsers } from "@fixtures/test-data";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should display login form", async () => {
    await expect(loginPage.signInPrompt).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test("should redirect to dashboard and show authenticated state on valid login", async ({ page }) => {
    await loginPage.login(testUsers.testUser.email, testUsers.testUser.password);

    await expect(page).not.toHaveURL(/\/session\/new/);
    await expect(loginPage.signOutButton).toBeVisible();
    await expect(loginPage.userEmailDisplay).toHaveText(testUsers.testUser.email);
  });

  test("should show error message on invalid credentials", async ({ page }) => {
    await loginPage.login("invalid@example.com", "wrongpassword");

    await expect(page).toHaveURL(/\/session\/new/);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText("Try another email address or password.");
  });

  test("should keep user on login page when form is submitted empty", async ({ page }) => {
    await loginPage.signInButton.click();

    await expect(page).toHaveURL(/\/session\/new/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });
});
