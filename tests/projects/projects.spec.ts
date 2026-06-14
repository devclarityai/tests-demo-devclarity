import { test, expect } from "@playwright/test";
import { ProjectsPage } from "@pages/projects.page";
import { ProjectFormPage } from "@pages/project-form.page";
import { ProjectDetailPage } from "@pages/project-detail.page";
import { createClient, deleteClient } from "@datafactory/client.factory";
import { createProject, deleteProject } from "@datafactory/project.factory";

const APEX_DIGITAL_CLIENT = "Apex Digital Partners";
const APEX_DIGITAL_PROJECT_NAME = "Apex Digital Partners - Consulting Project";

test("projects index shows heading, table, and seeded rows", async ({
  page,
}) => {
  const projectsPage = new ProjectsPage(page);

  await projectsPage.goto();

  await expect(projectsPage.pageHeading).toBeVisible();
  await expect(projectsPage.projectsList).toBeVisible();
  await expect(projectsPage.projectItems.first()).toBeVisible();
});

test("create project with client and status redirects to detail page", async ({
  page,
}) => {
  const formPage = new ProjectFormPage(page);
  const detailPage = new ProjectDetailPage(page);
  const clientName = `Test Client ${Date.now()}`;
  const clientId = await createClient(page, clientName);

  await formPage.gotoNew();
  await formPage.clientSearchInput.fill(clientName);
  await formPage.getClientOption(clientName).click();
  await formPage.statusSelect.selectOption("Execution");
  await formPage.firstAnchorDateInput.fill("2026-06-14");
  await formPage.createButton.click();

  await expect(page).toHaveURL(/\/projects\/\d+/);
  await expect(detailPage.pageHeading).toContainText(clientName);
  await expect(detailPage.projectDetailsHeading).toBeVisible();
  await expect(detailPage.getDetailValue("Status:")).toHaveText("Execution");
  await expect(
    detailPage.getDetailValue("Client:").getByRole("link"),
  ).toHaveText(clientName);

  const projectId = parseInt(page.url().match(/\/projects\/(\d+)/)?.[1] ?? "0");
  await deleteProject(page, projectId);
  await deleteClient(page, clientId);
});

test("view project from index navigates to detail page", async ({ page }) => {
  const projectsPage = new ProjectsPage(page);
  const detailPage = new ProjectDetailPage(page);

  await projectsPage.goto();
  await projectsPage.getViewLinkForClient(APEX_DIGITAL_CLIENT).click();

  await expect(page).toHaveURL(/\/projects\/\d+$/);
  await expect(detailPage.pageHeading).toHaveText(APEX_DIGITAL_PROJECT_NAME);
  await expect(detailPage.projectDetailsHeading).toBeVisible();
});
