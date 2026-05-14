import { Page } from "@playwright/test";

export class ClientsPage {
  constructor(readonly page: Page) {}

  // -- Locators --
  readonly heading = this.page.getByRole("heading", { name: "Clients" });
  readonly newClientLink = this.page.getByRole("link", { name: "New Client" });
  readonly table = this.page.getByRole("table");
  readonly rows = this.page.locator("tbody").getByRole("row");

  // -- Actions --
  getRowByName(name: string) {
    return this.page.locator("tbody").getByRole("row").filter({ hasText: name });
  }

  getViewLinkForClient(name: string) {
    return this.getRowByName(name).first().getByRole("link", { name: "View" });
  }

  getEditLinkForClient(name: string) {
    return this.getRowByName(name).first().getByRole("link", { name: "Edit" });
  }

  getDeleteButtonForClient(name: string) {
    return this.getRowByName(name).first().getByRole("button", { name: "Delete" });
  }

  // -- Flows --
  async goto(): Promise<void> {
    await this.page.goto("/clients");
  }
}
