import { expect, test } from "@playwright/test";

test("publishes Standard Bots across every authorized public surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Standard Bots\./ })).toHaveAttribute("href", "/updates/standard-bots");

  await page.goto("/companies#standard-bots");
  const companyCard = page.locator("#standard-bots");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.getByText("Standard Bots", { exact: true })).toBeVisible();
  await expect(companyCard.getByRole("link", { name: "Visit Standard Bots" })).toHaveAttribute(
    "href",
    "https://standardbots.com/",
  );

  const response = await page.goto("/updates/standard-bots");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Standard Bots.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$15,000", "$1B", "$1 billion", "Not specified", "management fee", "carry"]) {
    expect(article).not.toContain(confidential);
  }

  await page.goto("/founders#standard-bots");
  await expect(page.getByText("Evan Beard", { exact: true })).toBeVisible();
  await expect(page.getByText("David Golden", { exact: true })).toBeVisible();
});
