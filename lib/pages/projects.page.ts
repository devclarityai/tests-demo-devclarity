import { Page } from "@playwright/test";

export class ProjectsPage {
  constructor(readonly page: Page) {}

  readonly pageHeading = this.page.getByRole("heading", { name: "Projects" });
  readonly projectsList = this.page.getByRole("table");
  readonly newProjectButton = this.page.getByRole("link", {
    name: "New Project",
  });
  readonly projectItems = this.page.locator("tbody").getByRole("row");
  readonly clientSearchField = this.page.getByRole("textbox", { name: "Type to search clients..." });

  // -- Actions --
  getProjectByIndex(index: number) {
    return this.projectItems.nth(index);
  }

  getViewLinkForClient(clientName: string) {
    return this.page
      .locator("tbody")
      .getByRole("row")
      .filter({ hasText: clientName })
      .first()
      .getByRole("link", { name: "View" });
  }

  // -- Flows --
  async goto(): Promise<void> {
    await this.page.goto("/projects");
  }
}
