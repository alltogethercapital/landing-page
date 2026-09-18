import { expect, test } from "@playwright/test";

const missingCompanies = [
  "Ultrasonium",
  "Positron",
  "Matforge",
  "Raspire",
  "Rendezvous Robotics",
  "Compresr",
];

test("publishes every SOI company found missing in the Drive reconciliation", async ({ page }) => {
  await page.goto("/companies");
  for (const company of missingCompanies) {
    const card = page.getByRole("link", { name: `Visit ${company}` });
    await expect(card).toBeVisible();
    const logo = card.locator("img");
    await expect(logo).toHaveCount(1);
    expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await page.goto("/founders");
  for (const founder of [
    "Jack Qiu",
    "Thomas Sohmers",
    "Akash Ramdas",
    "Kareem Selim",
    "Ariel Ekblaw",
    "Ivan Zakazov",
  ]) {
    await expect(page.getByRole("heading", { name: founder, exact: true })).toBeVisible();
  }

  await page.goto("/updates");
  for (const company of missingCompanies) {
    await expect(page.getByRole("link", { name: new RegExp(`^${company}\\.`, "i") })).toBeVisible();
  }

  for (const slug of ["ultrasonium", "positron", "matforge", "raspire", "rendezvous-robotics", "compresr"]) {
    const response = await page.goto(`/updates/${slug}`);
    expect(response?.status()).toBe(200);
  }
});
