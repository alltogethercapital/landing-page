import { expect, test } from "@playwright/test";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";

test("protects, authenticates, filters, and opens an investment", async ({ page }) => {
  await page.goto("/lp");
  await expect(page).toHaveURL(/\/lp-login$/);
  await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();

  await page.getByLabel("Access password").fill("incorrect-password");
  await page.getByRole("button", { name: /Enter portal/ }).click();
  await expect(page).toHaveURL(/\/lp-login\?error=invalid$/);
  await expect(page.locator("#lp-login-error")).toContainText("not valid");

  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Enter portal/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.getByRole("heading", { name: "Investments" })).toBeVisible();
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

test("renders the login, portfolio, and detail views at every supported layout", async ({ browser }) => {
  test.setTimeout(90_000);

  const viewports = [
    { name: "phone", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 1000 },
    { name: "wide", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    await page.goto("/lp-login");
    await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();
    await expect(page.getByLabel("Access password")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/login-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByLabel("Access password").fill(password);
    await page.getByRole("button", { name: /Enter portal/ }).click();
    await expect(page).toHaveURL(/\/lp$/);
    await expect(page.getByRole("heading", { name: "Investments" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    const navBox = await page.locator(".lp-portal-nav").boundingBox();
    expect(navBox).not.toBeNull();
    if (viewport.width <= 719) {
      expect(navBox!.height).toBeLessThanOrEqual(60);
    } else {
      expect(navBox!.height).toBeGreaterThan(120);
      await expect(page.getByText("Documents", { exact: true })).toBeVisible();
      await expect(page.getByText("Updates", { exact: true })).toBeVisible();
    }

    await page.screenshot({
      path: `output/playwright/lp-portal/portfolio-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: "View Blue Origin" }).click();
    await expect(page).toHaveURL(/44-blue-origin$/);
    await expect(page.getByRole("heading", { name: "Blue Origin" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/detail-${viewport.name}.png`,
      fullPage: true,
    });

    await context.close();
  }
});
