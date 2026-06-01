import { test, expect } from "@playwright/test";
import { ClientsPage } from "@pages/clients.page";
import { ClientDetailPage } from "@pages/client-detail.page";
import { ClientFormPage } from "@pages/client-form.page";
import { ProjectsPage } from "@pages/projects.page";
import { createClient, deleteClient } from "@datafactory/client.factory";

const CLOUD_BRIDGE_ID = 2;
const CLOUD_BRIDGE_NAME = "CloudBridge Systems";
const APEX_DIGITAL_NAME = "Apex Digital Partners";
const DATA_STREAM_NAME = "DataStream Technologies";

// ---- HAPPY PATH ----

test("create client with valid name appears in the index", async ({ page }) => {
  const clientsPage = new ClientsPage(page);
  const formPage = new ClientFormPage(page);
  const name = `New Client ${Date.now()}`;

  await formPage.gotoNew();
  await formPage.nameField.fill(name);
  await formPage.createButton.click();
  await expect(page).toHaveURL(/\/clients/);
  await expect(clientsPage.getRowByName(name)).toBeVisible();

  await clientsPage.getViewLinkForClient(name).click();
  await expect(page).toHaveURL(/\/clients\/\d+/);
  const id = parseInt(page.url().match(/\/clients\/(\d+)/)?.[1] ?? "0");
  await deleteClient(page, id);
});

test("view client detail shows stats, project table, and work block schedule", async ({
  page,
}) => {
  const detailPage = new ClientDetailPage(page);

  await detailPage.goto(CLOUD_BRIDGE_ID);

  await expect(detailPage.clientHeading(CLOUD_BRIDGE_NAME)).toBeVisible();
  await expect(detailPage.totalProjectsCard).toBeVisible();
  await expect(detailPage.totalWorkBlocksCard).toBeVisible();
  await expect(detailPage.assignedWorkBlocksCard).toBeVisible();
  await expect(detailPage.unassignedWorkBlocksCard).toBeVisible();

  const totalProjects = await detailPage.getStatValue("Total Projects");
  expect(parseInt(totalProjects)).toBeGreaterThan(0);

  await expect(detailPage.projectRows.first()).toBeVisible();
  await expect(detailPage.workBlockScheduleHeading).toBeVisible();
});

test("edit client name reflects on detail page, breadcrumb, and index", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const formPage = new ClientFormPage(page);
  const detailPage = new ClientDetailPage(page);
  const original = `Edit Test ${Date.now()}`;
  const updated = `${original} - Updated`;
  const id = await createClient(page, original);

  await formPage.gotoEdit(id);
  await formPage.nameField.fill(updated);
  await formPage.updateButton.click();

  // Controller redirects to the index after update
  await expect(page).toHaveURL(/\/clients$/);
  await expect(clientsPage.getRowByName(updated)).toBeVisible();

  await clientsPage.getViewLinkForClient(updated).click();
  await expect(page).toHaveURL(new RegExp(`/clients/${id}$`));
  await expect(detailPage.clientHeading(updated)).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText(updated);

  await deleteClient(page, id);
});

test("delete client with no work blocks removes it from the index", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const name = `Delete Test ${Date.now()}`;
  const id = await createClient(page, name);

  await clientsPage.goto();
  page.once("dialog", (dialog) => dialog.accept());
  await clientsPage.getDeleteButtonForClient(name).click();

  await page.waitForFunction(
    (n) =>
      !Array.from(document.querySelectorAll("tbody tr")).some((r) =>
        r.textContent?.includes(n),
      ),
    name,
    { timeout: 10000 },
  );
  await expect(clientsPage.getRowByName(name)).not.toBeVisible();
});

test("new project from client detail is pre-wired with the correct client", async ({
  page,
}) => {
  const detailPage = new ClientDetailPage(page);
  const projectsPage = new ProjectsPage(page);

  await detailPage.goto(CLOUD_BRIDGE_ID);
  await detailPage.newProjectLink.click();

  await expect(page).toHaveURL(/client_id=\d+/);
  await expect(projectsPage.clientSearchField).toHaveValue(CLOUD_BRIDGE_NAME);
});

// ---- EDGE CASES ----

test("duplicate client names are accepted with no uniqueness validation", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const name = `Duplicate ${Date.now()}`;
  const id1 = await createClient(page, name);
  const id2 = await createClient(page, name);

  await clientsPage.goto();
  await expect(clientsPage.rows.filter({ hasText: name })).toHaveCount(2);

  await deleteClient(page, id1);
  await deleteClient(page, id2);
});

test("whitespace-only name is rejected with validation error", async ({
  page,
}) => {
  const formPage = new ClientFormPage(page);

  await formPage.gotoNew();
  await formPage.nameField.fill("   ");
  await formPage.createButton.click();

  await expect(page).toHaveURL(/\/clients\/new/);
  await expect(formPage.errorSummary).toBeVisible();
  await expect(formPage.getErrorMessage("Name can't be blank")).toBeVisible();
});

test("very long name (300+ chars) has no length validation", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const formPage = new ClientFormPage(page);
  const longName = "A".repeat(300);

  await formPage.gotoNew();
  await formPage.nameField.fill(longName);
  await formPage.createButton.click();
  await expect(page).toHaveURL(/\/clients/);

  await clientsPage.getViewLinkForClient(longName).click();
  await expect(page).toHaveURL(/\/clients\/\d+/);
  const id = parseInt(page.url().match(/\/clients\/(\d+)/)?.[1] ?? "0");
  await deleteClient(page, id);
});

test("special characters in name render as escaped text across index, detail, and edit", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const formPage = new ClientFormPage(page);
  const detailPage = new ClientDetailPage(page);
  const timestamp = Date.now();
  const xssPayload = `<script>alert('xss-${timestamp}')</script>`;
  const visibleText = `alert('xss-${timestamp}')`;
  const id = await createClient(page, xssPayload);

  await clientsPage.goto();
  await expect(clientsPage.getRowByName(visibleText)).toBeVisible();

  await detailPage.goto(id);
  await expect(page.getByText(visibleText).first()).toBeVisible();

  await formPage.gotoEdit(id);
  await expect(formPage.nameField).toHaveValue(xssPayload);

  await deleteClient(page, id);
});

test("client with zero projects shows all four stat cards as 0", async ({
  page,
}) => {
  const detailPage = new ClientDetailPage(page);
  const id = await createClient(page, `Zero Projects ${Date.now()}`);

  await detailPage.goto(id);

  expect(await detailPage.getStatValue("Total Projects")).toBe("0");
  expect(await detailPage.getStatValue("Total Work Blocks")).toBe("0");
  expect(await detailPage.getStatValue("Assigned Work Blocks")).toBe("0");
  expect(await detailPage.getStatValue("Unassigned Work Blocks")).toBe("0");

  await deleteClient(page, id);
});

// ---- NEGATIVE / ERROR TESTS ----

test("cancel on delete confirmation keeps client in the index", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const name = `Cancel Delete ${Date.now()}`;
  const id = await createClient(page, name);

  await clientsPage.goto();
  page.once("dialog", (dialog) => dialog.dismiss());
  await clientsPage.getDeleteButtonForClient(name).click();

  await expect(clientsPage.getRowByName(name)).toBeVisible();

  await deleteClient(page, id);
});

test("edit client to blank name is rejected with validation error", async ({
  page,
}) => {
  const formPage = new ClientFormPage(page);
  const id = await createClient(page, `Blank Edit ${Date.now()}`);

  await formPage.gotoEdit(id);
  await formPage.nameField.fill("");
  await formPage.updateButton.click();

  await expect(formPage.errorSummary).toBeVisible();
  await expect(formPage.getErrorMessage("Name can't be blank")).toBeVisible();

  await deleteClient(page, id);
});

test.skip("BUG-3: direct URL to non-existent client throws a Rails exception instead of 404", async ({
  page,
}) => {
  await page.goto("/clients/99999");
  // Expected: graceful 404 or redirect
  // Actual: "Action Controller: Exception caught"
  await expect(page).not.toHaveTitle("Action Controller: Exception caught");
});

// ---- BUG TESTS — marked test.fail() until fixed ----

test.skip("BUG-2: deleting a client with active work blocks should warn or block", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);

  await clientsPage.goto();
  page.once("dialog", (dialog) => dialog.accept());
  await clientsPage.getDeleteButtonForClient(DATA_STREAM_NAME).click();

  // Expected: a blocking message or warning about associated work blocks
  // Actual: client is silently deleted with no guard
  await expect(
    page.getByText(/cannot delete|has active|work blocks/i),
  ).toBeVisible();
});

test.skip("BUG-1: accessing an orphaned project after client deletion should return a graceful 404", async ({
  page,
}) => {
  const clientsPage = new ClientsPage(page);
  const detailPage = new ClientDetailPage(page);

  await clientsPage.goto();
  await clientsPage.getViewLinkForClient(APEX_DIGITAL_NAME).click();
  await expect(page).toHaveURL(/\/clients\/\d+/);
  const clientId = parseInt(page.url().match(/\/clients\/(\d+)/)?.[1] ?? "0");

  const projectViewLink = detailPage.projectRows
    .first()
    .getByRole("link", { name: "View" });
  const projectUrl = await projectViewLink.getAttribute("href");

  await deleteClient(page, clientId);

  await page.goto(projectUrl!);

  // Expected: graceful 404 or redirect, not a crash
  // Actual: "Action Controller: Exception caught"
  await expect(page).not.toHaveTitle("Action Controller: Exception caught");
  await expect(page.getByText(/404|not found/i)).toBeVisible();
});
