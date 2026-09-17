import { expect, test } from "@playwright/test";

test("publishes Pocket across every authorized public surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Pocket\./ })).toHaveAttribute("href", "/updates/pocket");

  await page.goto("/companies#pocket");
  const companyCard = page.locator("#pocket");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.locator("img")).toHaveAttribute("alt", "Pocket");
  await expect(companyCard.getByRole("link", { name: "Visit Pocket" })).toHaveAttribute("href", "https://heypocket.com/");

  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Akshay Narisetti" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gabriel Dymowski" })).toBeVisible();

  const response = await page.goto("/updates/pocket");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pocket.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$25,000", "$500M", "AngelList", "carry", "valuation", "annualized revenue", "run rate"]) {
    expect(article).not.toContain(confidential);
  }
});
