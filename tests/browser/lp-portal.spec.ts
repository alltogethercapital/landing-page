import { expect, test } from "@playwright/test";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";

test("protects, authenticates, filters, and opens an investment", async ({ page }) => {
  await page.goto("/lp");
  await expect(page).toHaveURL(/\/lp-login$/);
  await expect(page.getByRole("heading", { name: "Information, clearly held." })).toBeVisible();

  await page.getByLabel("Access password").fill("incorrect-password");
  await page.getByRole("button", { name: /Enter portal/ }).click();
  await expect(page).toHaveURL(/\/lp-login\?error=invalid$/);
  await expect(page.locator("#lp-login-error")).toContainText("not valid");

  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Enter portal/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.getByRole("heading", { name: "The portfolio, at a glance." })).toBeVisible();
  await expect(page.getByText("44 investment records")).toBeVisible();
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-desktop.png", fullPage: true });

  const search = page.getByPlaceholder("Search company, round, instrument…");
  await search.fill("Blue Origin");
  await search.press("Enter");
  await expect(page.getByText(/1 of 44 records/)).toBeVisible();
  await page.getByRole("link", { name: "View Blue Origin" }).click();
  await expect(page).toHaveURL(/44-blue-origin$/);
  await expect(page.getByText("Pending acceptance", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Awaiting approved valuation data." })).toBeVisible();
  await page.screenshot({ path: "output/playwright/lp-portal/detail-desktop.png", fullPage: true });
});

test("renders a usable mobile portal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lp-login");
  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Enter portal/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.getByRole("heading", { name: "The portfolio, at a glance." })).toBeVisible();
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-mobile.png", fullPage: true });
});
