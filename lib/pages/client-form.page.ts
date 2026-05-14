import { Page } from "@playwright/test";

export class ClientFormPage {
  constructor(readonly page: Page) {}

  // -- Locators --
  readonly newHeading = this.page.getByRole("heading", { name: "New Client" });
  readonly editHeading = this.page.getByRole("heading", { name: "Edit Client" });
  readonly nameField = this.page.getByRole("textbox", { name: "Name" });
  readonly createButton = this.page.getByRole("button", { name: "Create Client" });
  readonly updateButton = this.page.getByRole("button", { name: "Update Client" });
  readonly cancelLink = this.page.getByRole("link", { name: "Cancel" });
  readonly errorSummary = this.page.getByRole("heading", { name: /error/i });

  // -- Actions --
  getErrorMessage(text: string) {
    return this.page.getByRole("listitem").filter({ hasText: text });
  }

  // -- Flows --
  async gotoNew(): Promise<void> {
    await this.page.goto("/clients/new");
  }

  async gotoEdit(id: number): Promise<void> {
    await this.page.goto(`/clients/${id}/edit`);
  }

  async disableHtml5Validation(): Promise<void> {
    await this.page.evaluate(() => {
      const form = document.querySelector("form");
      if (form) form.noValidate = true;
    });
  }
}
