import { Page } from "@playwright/test";

export class ResourcesPage {
  constructor(readonly page: Page) {}

  readonly pageHeading = this.page.getByRole("heading", { name: "Resources" });
  readonly resourcesList = this.page.getByRole("table");
  readonly newResourceButton = this.page.getByRole("link", {
    name: "New Resource",
  });
  readonly resourceItems = this.page.locator("tbody").getByRole("row");

  // -- Actions --
  getResourceByIndex(index: number) {
    return this.resourceItems.nth(index);
  }

  // -- Flows --
  async goto(): Promise<void> {
    await this.page.goto("/resources");
  }
}
