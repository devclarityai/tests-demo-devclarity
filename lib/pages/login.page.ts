import { Page } from "@playwright/test";

export class LoginPage {
  constructor(readonly page: Page) {}

  readonly emailInput = this.page.getByLabel("Email address");
  readonly passwordInput = this.page.getByLabel("Password");
  readonly signInButton = this.page.getByRole("button", { name: "Sign In" });
  readonly signInPrompt = this.page.getByText("Please sign in to continue");
  readonly errorMessage = this.page.getByRole("alert");
  readonly signOutButton = this.page.getByRole("button", { name: "Sign Out" });
  readonly userEmailDisplay = this.page.locator("header").locator("span", { hasText: /@/ });

  // -- Flows --
  async goto(): Promise<void> {
    await this.page.goto("/session/new");
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
