import { Page } from "@playwright/test";

export class ClientDetailPage {
  constructor(readonly page: Page) {}

  // -- Locators --
  readonly editClientLink = this.page.getByRole("link", { name: "Edit Client" });
  readonly backToClientsLink = this.page.getByRole("link", { name: "Back to Clients" });
  readonly newProjectLink = this.page.getByRole("link", { name: "New Project" });
  readonly projectsTable = this.page.getByRole("table");
  readonly projectRows = this.page.locator("tbody").getByRole("row");
  readonly workBlockScheduleHeading = this.page.getByRole("heading", { name: "Work Blocks Schedule" });

  readonly totalProjectsCard = this.page.getByText("Total Projects");
  readonly totalWorkBlocksCard = this.page.getByText("Total Work Blocks");
  readonly assignedWorkBlocksCard = this.page.getByText("Assigned Work Blocks", { exact: true });
  readonly unassignedWorkBlocksCard = this.page.getByText("Unassigned Work Blocks", { exact: true });

  // -- Actions --
  clientHeading(name: string) {
    return this.page.getByRole("heading", { name, level: 1 });
  }

  async getStatValue(label: string): Promise<string> {
    const value = await this.page
      .getByText(label, { exact: true })
      .locator("xpath=..")
      .locator("div")
      .first()
      .textContent();
    return value?.trim() ?? "";
  }

  // -- Flows --
  async goto(id: number): Promise<void> {
    await this.page.goto(`/clients/${id}`);
  }
}
