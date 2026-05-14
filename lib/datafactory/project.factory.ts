import { Page } from "@playwright/test";

const baseUrl = () => process.env.BASE_URL!;

export async function createProject(
  page: Page,
  clientName: string,
  status: string
): Promise<number> {
  await page.goto(`${baseUrl()}/projects/new`);

  await page.getByRole("textbox", { name: "Type to search clients..." }).fill(clientName);
  await page.getByRole("button", { name: clientName }).click();
  await page.getByRole("combobox", { name: "Status" }).selectOption(status);
  await page.getByRole("button", { name: "Create Project" }).click();
  await page.waitForURL(/\/projects\/\d+/);

  const id = parseInt(page.url().match(/\/projects\/(\d+)/)?.[1] ?? "0");
  if (!id)
    throw new Error(`Created project for "${clientName}" but could not extract its ID`);
  return id;
}

export async function deleteProject(page: Page, id: number): Promise<void> {
  await page.goto(`${baseUrl()}/projects/${id}`);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(`${baseUrl()}/projects`);
}
