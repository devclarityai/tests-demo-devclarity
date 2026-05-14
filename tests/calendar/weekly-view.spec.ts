import { test, expect } from "@playwright/test";
import { CalendarPage } from "@pages/calendar.page";

test.describe("Calendar - Weekly View", () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page);
    await calendarPage.gotoWeeklyView();
  });

  test("should load weekly calendar page with navigation", async ({ page }) => {
    await expect(page).toHaveURL("/calendar/work_blocks_weekly");
    await expect(calendarPage.pageHeading).toBeVisible();
    await expect(calendarPage.subtitle).toBeVisible();
    await expect(
      calendarPage.breadcrumb.getByText("Work Blocks Weekly"),
    ).toBeVisible();
    await expect(calendarPage.legendHeading).toBeVisible();
    await expect(calendarPage.birdsEyeViewLink).toBeVisible();
    await expect(calendarPage.calendarTable).toBeVisible();
  });

  test("should display all work block type column headers", async () => {
    const expectedColumns = [
      "Project Kickoff",
      "Discovery",
      "Design",
      "Development",
      "Testing",
      "Project Wrap-up",
      "Other",
    ];
    for (const column of expectedColumns) {
      await expect(
        calendarPage.calendarTable.getByRole("columnheader", { name: column }),
      ).toBeVisible();
    }
  });

  test("should display week date rows", async () => {
    await expect(calendarPage.calendarTable.getByRole("rowgroup").last()).toBeVisible();
    const rows = calendarPage.calendarTable.locator("tbody").getByRole("row");
    await expect(rows).toHaveCount(12);
  });

  test("should display quick action links", async () => {
    await expect(calendarPage.page.getByRole("link", { name: "Resources" })).toBeVisible();
    await expect(calendarPage.page.getByRole("link", { name: "Projects" })).toBeVisible();
    await expect(calendarPage.page.getByRole("link", { name: "Clients" })).toBeVisible();
  });
});
