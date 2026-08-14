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
  await expect(page.getByText("44 of 44 records")).toBeVisible();
  await expect(page.locator(".lp-portfolio-table .lp-company-logo img")).toHaveCount(44);
  await expect.poll(() => page.locator(".lp-portfolio-table .lp-company-logo img").evaluateAll((logos) =>
    logos.filter((logo) => (logo as HTMLImageElement).complete && (logo as HTMLImageElement).naturalWidth > 0).length,
  )).toBe(44);
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-desktop.png", fullPage: true });

  const search = page.getByPlaceholder("Search company, round, instrument…");
  await search.fill("Blue Origin");
  await search.press("Enter");
  await expect(page.getByText(/1 of 44 records/)).toBeVisible();
  await page.getByRole("link", { name: "View Blue Origin" }).click();
  await expect(page).toHaveURL(/44-blue-origin$/);
  await expect(page.getByText("Pending acceptance", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Performance" })).toBeVisible();
  await expect(page.getByText("Awaiting approved mark", { exact: true })).toBeVisible();
  await page.screenshot({ path: "output/playwright/lp-portal/detail-desktop.png", fullPage: true });
});

test("renders the login, portfolio, and detail views at every supported layout", async ({ browser }) => {
  test.setTimeout(150_000);

  const viewports = [
    { name: "phone-small", width: 320, height: 700 },
    { name: "phone", width: 390, height: 844 },
    { name: "phone-large", width: 430, height: 932 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "tablet-wide", width: 820, height: 1111 },
    { name: "laptop", width: 1024, height: 768 },
    { name: "compact-desktop", width: 1321, height: 1111 },
    { name: "desktop", width: 1440, height: 1000 },
    { name: "wide", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    await page.goto("/lp-login");
    await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();
    await expect(page.getByLabel("Access password")).toBeVisible();
    const visibleCharacterMark = page.locator(".cog-character-mark:visible").first();
    await expect(visibleCharacterMark).toBeVisible();
    expect(await visibleCharacterMark.evaluate((image) =>
      (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
    )).toBe(true);
    expect(await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--cog-accent").trim().toUpperCase(),
    )).toBe("#1E37D9");
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
    if (viewport.width <= 1360) {
      expect(navBox!.height).toBeLessThanOrEqual(65);
      expect(navBox!.width).toBeGreaterThanOrEqual(viewport.width - 1);
    } else {
      expect(navBox!.height).toBeGreaterThan(120);
    }

    const shellBox = await page.locator(".lp-portal-shell").boundingBox();
    expect(shellBox).not.toBeNull();
    const expectedShellRatio = viewport.width <= 1360 ? 0.9 : viewport.width <= 1520 ? 0.79 : 0.63;
    expect(shellBox!.width).toBeGreaterThanOrEqual(
      viewport.width * expectedShellRatio,
    );

    if (viewport.width <= 719) {
      await expect(page.locator(".lp-portfolio-mobile")).toBeVisible();
      await expect(page.locator(".lp-table-wrap")).toBeHidden();
    } else {
      await expect(page.locator(".lp-table-wrap")).toBeVisible();
      expect(await page.locator(".lp-table-wrap").evaluate((element) =>
        element.scrollWidth <= element.clientWidth + 1,
      )).toBe(true);
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
