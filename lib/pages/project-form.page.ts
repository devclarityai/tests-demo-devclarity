import { Page } from "@playwright/test";

export class ProjectFormPage {
  constructor(readonly page: Page) {}

  // -- Locators --
  readonly clientSearchInput = this.page.getByRole("textbox", {
    name: "Type to search clients...",
  });
  readonly statusSelect = this.page.getByRole("combobox", { name: "Status" });
  readonly firstAnchorDateInput = this.page.getByRole("textbox", {
    name: "First Anchor Date",
  });
  readonly createButton = this.page.getByRole("button", {
    name: "Create Project",
  });

  // -- Actions --
  getClientOption(name: string) {
    return this.page.getByRole("button", { name });
  }

  // -- Flows --
  async gotoNew(): Promise<void> {
    await this.page.goto("/projects/new");
  }
}
