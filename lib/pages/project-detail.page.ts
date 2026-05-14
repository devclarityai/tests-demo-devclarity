import { Page } from "@playwright/test";

export class ProjectDetailPage {
  constructor(readonly page: Page) {}

  // -- Locators --
  readonly pageHeading = this.page.getByRole("heading", { level: 1 });
  readonly projectDetailsHeading = this.page.getByRole("heading", {
    name: "Project Details",
  });

  // -- Actions --
  getDetailValue(termName: string) {
    return this.page
      .locator("dl > div")
      .filter({ has: this.page.locator("dt", { hasText: termName }) })
      .locator("dd");
  }

  // -- Flows --
  async goto(id: number): Promise<void> {
    await this.page.goto(`/projects/${id}`);
  }
}
