import { Page } from "@playwright/test";

const baseUrl = () => process.env.BASE_URL!;

export async function createClient(page: Page, name: string): Promise<number> {
  await page.goto(`${baseUrl()}/clients/new`);
  await page.getByRole("textbox", { name: "Name" }).fill(name);
  await page.getByRole("button", { name: "Create Client" }).click();
  await page.waitForURL(`${baseUrl()}/clients`);

  const link = page
    .locator("tbody")
    .getByRole("row")
    .filter({ hasText: name })
    .last()
    .getByRole("link", { name: "View" });
  await link.click();
  await page.waitForURL(/\/clients\/\d+/);

  const id = parseInt(page.url().match(/\/clients\/(\d+)/)?.[1] ?? "0");
  if (!id)
    throw new Error(`Created client "${name}" but could not extract its ID`);
  return id;
}

export async function deleteClient(page: Page, id: number): Promise<void> {
  await page.goto(`${baseUrl()}/clients`);
  const row = page
    .locator("tbody")
    .getByRole("row")
    .filter({
      has: page.locator(`a[href="/clients/${id}"]`),
    });
  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: "Delete" }).click();
  await page.waitForURL(`${baseUrl()}/clients`);
}
