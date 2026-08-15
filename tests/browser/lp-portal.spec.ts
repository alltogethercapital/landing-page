import { expect, test } from "@playwright/test";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";

test("protects, authenticates, searches, and opens an investment", async ({ page }) => {
  await page.goto("/lp/updates");
  await expect(page).toHaveURL(/\/lp-login$/);
  await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();
  const publicLogoBox = await page.locator(".cog-nav-logo").boundingBox();
  expect(publicLogoBox).not.toBeNull();

  await page.getByLabel("Access password").fill("incorrect-password");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp-login\?error=invalid$/);
  await expect(page.locator("#lp-login-error")).toContainText("not valid");

  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.getByRole("heading", { name: "Investments" })).toBeVisible();
  await expect(page.getByText("44 of 44 records")).toBeVisible();
  await expect(page.getByText("$661,014.25", { exact: true })).toBeVisible();
  await expect(page.getByText("$674,867.04", { exact: true })).toBeVisible();
  await expect(page.getByText("Current value multiple", { exact: true })).toBeVisible();
  await expect(page.getByText("Projected value multiple", { exact: true })).toHaveCount(0);
  await expect(page.getByText("1.02×", { exact: true })).toBeVisible();
  const portalLogoBox = await page.locator(".lp-portal-nav-logo").boundingBox();
  expect(portalLogoBox).not.toBeNull();
  expect(Math.abs(portalLogoBox!.x - publicLogoBox!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(portalLogoBox!.y - publicLogoBox!.y)).toBeLessThanOrEqual(1);
  await expect(page.getByText(/not the fund's audited net asset value/i)).toBeVisible();
  await expect(page.getByText("Stripe", { exact: true })).toHaveCount(0);
  await expect(page.getByText("AngelList", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Sydecar", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Capital Company", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Equity", { exact: true })).toHaveCount(0);
  await expect(page.getByText("SAFE", { exact: true })).toHaveCount(0);
  await expect(page.getByText("SPV", { exact: true })).toHaveCount(0);
  await expect(page.locator(".lp-portfolio-table").getByText("Positron", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-portfolio-table").getByText("No company valuation; $50M fund / $1M investment entity", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-portfolio-table").getByText("No company valuation; $50M model financing", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-portfolio-table .lp-company-logo img")).toHaveCount(44);
  await page.locator(".lp-portfolio-table .lp-company-logo img").last().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".lp-portfolio-table .lp-company-logo img").evaluateAll((logos) =>
    logos.filter((logo) => (logo as HTMLImageElement).complete && (logo as HTMLImageElement).naturalWidth > 0).length,
  )).toBe(44);
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-desktop.png", fullPage: true });

  const updatesResponse = await page.goto("/lp/updates");
  expect(updatesResponse?.status()).toBe(200);
  expect(updatesResponse?.headers()["x-robots-tag"]).toBe("noindex, nofollow, noarchive");
  await expect(page.getByRole("heading", { name: "Investor Updates" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Investor Updates" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText(/at least twice per year/i)).toBeVisible();
  const augustUpdateLink = page.getByRole("link", { name: /Why we started All Together Capital/ });
  await expect(augustUpdateLink).toHaveAttribute("href", "/lp/updates/august-2026");
  await expect(page.getByText("Investor Update #1", { exact: true })).toBeVisible();
  await expect(page.getByText("August 14, 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("01", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Our founding thesis/i)).toHaveCount(0);
  await expect(page.getByText(/Read update/i)).toHaveCount(0);
  await expect(page.getByText(/published update/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Return to portfolio/i })).toHaveCount(0);
  await page.screenshot({ path: "output/playwright/lp-portal/updates-index-desktop.png", fullPage: true });

  await augustUpdateLink.click();
  await expect(page).toHaveURL(/\/lp\/updates\/august-2026$/);
  await expect(page.getByRole("heading", { name: "Why we started All Together Capital" })).toBeVisible();
  await expect(page.getByText("Investor Update #1", { exact: true })).toBeVisible();
  await expect(page.getByText("August 14, 2026", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-update-article-copy")).toContainText("$661,014.25");
  await expect(page.locator(".lp-update-article-copy")).toContainText("$674,867.04");
  await expect(page.locator(".lp-update-article-copy")).toContainText("1.02×");
  await expect(page.locator(".lp-update-article-copy")).toContainText("post-labor economy");
  await expect(page.locator(".lp-update-article-copy")).toContainText("ownership layer");
  await expect(page.locator(".lp-update-article-copy")).toContainText("at least twice per year");
  const updateParagraphs = page.locator(".lp-update-article-copy > p");
  await expect(updateParagraphs.nth(2)).toContainText("This is what we mean by a post-labor economy");
  await expect(updateParagraphs.nth(3)).toContainText("That shift changes who captures the value");
  await expect(updateParagraphs.nth(4)).toContainText("Another reason is personal");
  await expect(updateParagraphs.nth(4)).toContainText("beyond the Anthropocene");
  await expect(updateParagraphs.nth(4)).toContainText("ownership layer");
  await expect(page.locator(".lp-update-article-copy")).toContainText("30.3%");
  const updateWordCount = await page.locator(".lp-update-article-copy").evaluate((element) =>
    (element.textContent ?? "").trim().split(/\s+/).length,
  );
  expect(updateWordCount).toBeLessThan(600);
  await expect(page.getByText(/not audited net asset value/i)).toHaveCount(2);
  await expect(page.locator(".lp-update-article-copy a")).toHaveCount(6);
  await expect(page.locator(".lp-update-article figure")).toHaveCount(0);
  await expect(page.locator(".lp-update-article aside")).toHaveCount(0);
  await expect(page.locator(".lp-update-article ol, .lp-update-article ul, .lp-update-article dl")).toHaveCount(0);
  expect(await page.locator(".lp-update-article-copy a").evaluateAll((links) =>
    links.every((link) => link.getAttribute("target") === "_blank" && link.getAttribute("rel") === "noreferrer"),
  )).toBe(true);
  await page.screenshot({ path: "output/playwright/lp-portal/update-august-2026-desktop.png", fullPage: true });

  await expect(page.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".cog-nav-button")).toHaveText("Email us");
  const lpPortalLink = page.getByLabel("Primary").getByRole("link", { name: "LP Portal" });
  await expect(lpPortalLink).toHaveAttribute("href", "/lp");
  await lpPortalLink.click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.getByRole("heading", { name: "Investments" })).toBeVisible();

  const search = page.getByPlaceholder("Search investments…");
  await search.fill("Blue");
  await expect(page.getByText(/1 of 44 records/)).toBeVisible();
  await search.fill("");
  await expect(page.getByText(/44 of 44 records/)).toBeVisible();
  await search.fill("not an investment");
  await expect(page.getByText(/0 of 44 records/)).toBeVisible();
  await page.locator(".lp-table-wrap").getByRole("link", { name: "Clear search" }).click();
  await expect(page.getByText(/44 of 44 records/)).toBeVisible();
  await search.fill("Blue Origin");
  await expect(page.getByText(/1 of 44 records/)).toBeVisible();
  await search.press("Enter");
  await expect(page.getByText(/1 of 44 records/)).toBeVisible();
  await page.getByRole("link", { name: "View Blue Origin" }).click();
  await expect(page).toHaveURL(/43-blue-origin$/);
  await expect(page.getByText("Pending acceptance", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Data status", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Visit Blue Origin website" })).toHaveAttribute("href", "https://www.blueorigin.com/");
  await expect(page.getByRole("heading", { name: "Position" })).toBeVisible();
  await expect(page.getByText("$15,000", { exact: true })).toHaveCount(2);
  await expect(page.getByText("$130B before the round", { exact: true })).toHaveCount(2);
  await expect(page.getByText("Invested with a group · Investment held through a dedicated company", { exact: true })).toBeVisible();
  await expect(page.getByText("$0", { exact: true })).toBeVisible();
  await expect(page.getByText("Current value multiple", { exact: true })).toBeVisible();
  await expect(page.getByText("Projected value multiple", { exact: true })).toHaveCount(0);
  await expect(page.getByText("1.00×", { exact: true })).toBeVisible();
  await expect(page.getByText(/not the fund's official net asset value/i)).toBeVisible();
  await page.screenshot({ path: "output/playwright/lp-portal/detail-desktop.png", fullPage: true });

  await page.locator(".lp-back-link").click();
  await page.getByPlaceholder("Search investments…").fill("Positron");
  await page.getByPlaceholder("Search investments…").press("Enter");
  await page.getByRole("link", { name: "View Positron" }).click();
  await expect(page).toHaveURL(/44-positron$/);
  await expect(page.getByRole("link", { name: "Visit Positron website" })).toHaveAttribute("href", "https://www.positron.ai/");
  await expect(page.getByText("$4.5B before the round", { exact: true })).toHaveCount(2);

  await page.goto("/lp/investments/35-decart-ai");
  await expect(page.getByRole("heading", { name: "Decart.ai" })).toBeVisible();
  await expect(page.getByText("Invested with a group · Shares in the company", { exact: true })).toBeVisible();
  await expect(page.getByText("AngelList", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Equity", { exact: true })).toHaveCount(0);

  await page.goto("/lp/investments/42-weave-robotics");
  await expect(page.getByRole("heading", { name: "Weave Robotics" })).toBeVisible();
  await expect(page.getByText("$5,000", { exact: true })).toHaveCount(2);
});

test("renders the login, portfolio, and detail views at every supported layout", async ({ browser }) => {
  test.setTimeout(90_000);

  const viewports = [
    { name: "phone", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "compact-desktop", width: 1285, height: 1320 },
    { name: "review-desktop", width: 1297, height: 1297 },
    { name: "desktop", width: 1440, height: 1000 },
    { name: "wide", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    await page.goto("/lp-login");
    await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();
    await expect(page.getByLabel("Access password")).toBeVisible();
    const loginFrame = page.locator(".lp-login-input-row");
    await expect(loginFrame).toHaveCSS("border-left-width", "1px");
    await expect(loginFrame).toHaveCSS("border-left-style", "solid");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/login-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByLabel("Access password").fill(password);
    await page.getByRole("button", { name: /Sign in/ }).click();
    await expect(page).toHaveURL(/\/lp$/);
    await expect(page.getByRole("heading", { name: "Investments" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    const portalGuideCount = await page.locator(".lp-portal-page").evaluate((element) =>
      (getComputedStyle(element, "::before").backgroundImage.match(/linear-gradient/g) ?? []).length,
    );
    expect(portalGuideCount).toBe(2);

    const pageBox = await page.locator(".lp-portal-page").boundingBox();
    const summaryBox = await page.locator(".lp-summary-grid").boundingBox();
    expect(pageBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    const rightGutter = pageBox!.x + pageBox!.width - summaryBox!.x - summaryBox!.width;
    if (viewport.width <= 719) {
      expect(Math.abs(summaryBox!.x - pageBox!.x - rightGutter)).toBeLessThanOrEqual(1);
    } else {
      const railEnd = await page.locator(".lp-portal-page").evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).getPropertyValue("--lp-rail-end")),
      );
      const leftGutter = summaryBox!.x - pageBox!.x - railEnd;
      expect(Math.abs(leftGutter - rightGutter)).toBeLessThanOrEqual(1);
    }

    const navBox = await page.locator(".lp-portal-nav").boundingBox();
    expect(navBox).not.toBeNull();
    if (viewport.width <= 719) {
      expect(navBox!.height).toBeLessThanOrEqual(60);
    } else {
      expect(navBox!.height).toBeGreaterThan(120);
    }

    await page.screenshot({
      path: `output/playwright/lp-portal/portfolio-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: "Investor Updates" }).click();
    await expect(page).toHaveURL(/\/lp\/updates$/);
    await expect(page.getByRole("heading", { name: "Investor Updates" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Investor Updates" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("link", { name: /Why we started All Together Capital/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/updates-index-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: /Why we started All Together Capital/ }).click();
    await expect(page).toHaveURL(/\/lp\/updates\/august-2026$/);
    await expect(page.getByRole("heading", { name: "Why we started All Together Capital" })).toBeVisible();
    await expect(page.locator(".lp-update-article-copy")).toContainText("$661,014.25");
    await expect(page.locator(".lp-update-article-copy")).toContainText("at least twice per year");
    const updateCopyBox = await page.locator(".lp-update-article-copy").boundingBox();
    expect(updateCopyBox).not.toBeNull();
    expect(updateCopyBox!.width).toBeLessThanOrEqual(761);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/update-august-2026-${viewport.name}.png`,
      fullPage: true,
    });

    await page.getByRole("link", { name: "All investor updates", exact: true }).first().click();
    await expect(page).toHaveURL(/\/lp\/updates$/);
    await page.getByRole("link", { name: "Portfolio", exact: true }).click();
    await expect(page).toHaveURL(/\/lp$/);

    await page.getByRole("link", { name: "View Blue Origin" }).click();
    await expect(page).toHaveURL(/43-blue-origin$/);
    await expect(page.getByRole("heading", { name: "Blue Origin" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Visit Blue Origin website" })).toBeVisible();
    await expect(page.getByText("1.00×", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `output/playwright/lp-portal/detail-${viewport.name}.png`,
      fullPage: true,
    });

    await context.close();
  }
});
