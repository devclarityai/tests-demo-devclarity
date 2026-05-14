import { Page } from "@playwright/test";

export class CalendarPage {
  constructor(readonly page: Page) {}

  readonly pageHeading = this.page.getByRole("heading", { name: "Weekly Work Block Planning", level: 1 });
  readonly subtitle = this.page.getByText("12-week view organized by work block types with resource availability");
  readonly breadcrumb = this.page.getByRole("navigation", { name: "Breadcrumb" });
  readonly calendarTable = this.page.getByRole("table");
  readonly legendHeading = this.page.getByRole("heading", { name: "Legend:", level: 3 });
  readonly birdsEyeViewLink = this.page.getByRole("link", { name: "Bird's Eye View" });
  readonly workBlocks = this.page.locator("[data-work-block-id]");
  readonly weekHeaders = this.page.locator("tbody tr td:first-child");
  readonly newWorkBlockButton = this.page.getByRole("link", { name: "New Work Block" });

  // -- Actions --
  getWorkBlockByIndex(index: number) {
    return this.workBlocks.nth(index);
  }

  // -- Flows --
  async gotoWeeklyView(): Promise<void> {
    await this.page.goto("/calendar/work_blocks_weekly");
  }

  async gotoBirdsEyeView(): Promise<void> {
    await this.page.goto("/calendar/birds_eye_work_blocks");
  }
}
