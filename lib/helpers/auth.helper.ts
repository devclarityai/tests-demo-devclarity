import { Page } from "@playwright/test";
import { LoginPage } from "@pages/login.page";

export interface TestUser {
  email: string;
  password: string;
}

export const DEFAULT_TEST_USER: TestUser = {
  email: process.env.ADMIN_EMAIL ?? "",
  password: process.env.ADMIN_PASSWORD ?? "",
};

export async function login(
  page: Page,
  user: TestUser = DEFAULT_TEST_USER,
): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
}
