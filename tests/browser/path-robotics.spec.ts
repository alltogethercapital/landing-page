import { expect, test } from "@playwright/test";

test("publishes Path Robotics across every authorized surface", async ({ page }) => {
  await page.goto("/");
  const previewCompanies = page.locator(".cog-logo-cell");
  await expect(previewCompanies).toHaveCount(12);
  await expect(previewCompanies.nth(0)).toHaveAttribute("aria-label", "OpenAI");
  await expect(previewCompanies.nth(1)).toHaveAttribute("aria-label", "Anduril");
  await expect(page.getByRole("link", { name: "View all 50 companies" })).toHaveAttribute("href", "/companies");
  await expect(previewCompanies.nth(0).locator("img")).toHaveCSS("object-position", "0% 50%");
  await expect(previewCompanies.nth(0).locator(".cog-logo-frame")).toHaveCSS("width", "104px");
  await expect(page.locator('a[aria-label="Blue Origin"] .cog-logo-frame')).toHaveCSS("width", "106px");
  await expect(page.locator('a[aria-label="1X"] .cog-logo-frame')).toHaveCSS("width", "44px");
  const homeLogo = page.locator('a[aria-label="Path Robotics"] img');
  await expect(homeLogo).toBeVisible();
  await expect(homeLogo).toHaveJSProperty("complete", true);
  await expect(page.locator('a[aria-label="Path Robotics"]')).toHaveAttribute("href", "https://www.path-robotics.com/");
  await expect(page.getByRole("link", { name: /Path Robotics\./ })).toHaveAttribute("href", "/updates/path-robotics");

  await page.goto("/companies#path-robotics");
  const companyCard = page.locator("#path-robotics");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.locator("img")).toHaveJSProperty("complete", true);
  await expect(companyCard.getByRole("link", { name: "Visit Path Robotics" })).toHaveAttribute("href", "https://www.path-robotics.com/");

  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Andy Lonsberry" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Alex Lonsberry" })).toBeVisible();

  const response = await page.goto("/updates/path-robotics");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Path Robotics.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$10,000", "$2.15", "$300M", "AngelList", "SPV", "management fee", "carry"]) {
    expect(article).not.toContain(confidential);
  }
});
