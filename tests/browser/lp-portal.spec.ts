import { expect, test } from "@playwright/test";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";

test("shows the complete public portfolio and removes the footer glyph strip", async ({ page }) => {
  await page.goto("/");

  const companies = page.locator(".cog-logo-cell");
  await expect(companies).toHaveCount(41);
  await expect(page.locator(".cog-footer-ramp")).toHaveCount(0);
  await expect(page.getByText("Every company is a character.")).toHaveCount(0);
  await expect.poll(() => companies.locator("img").evaluateAll((logos) =>
    logos.filter((logo) => (logo as HTMLImageElement).complete && (logo as HTMLImageElement).naturalWidth > 0).length,
  )).toBe(41);
});

test("renders a standardized portrait for every verified founder", async ({ page }) => {
  await page.setViewportSize({ width: 1300, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/founders");

  const cards = page.locator(".cog-person-card");
  const portraits = cards.locator(".cog-person-media img");
  await expect(cards).toHaveCount(64);
  await expect(portraits).toHaveCount(64);
  await expect(page.locator(".cog-person-initials")).toHaveCount(0);

  const portraitUrls = await portraits.evaluateAll((images) =>
    [...new Set(images.map((image) => (image as HTMLImageElement).src))],
  );
  const responses = await Promise.all(portraitUrls.map((url) => page.request.get(url)));
  expect(responses.every((response) => response.ok() && response.headers()["content-type"]?.startsWith("image/"))).toBe(true);

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }
  await expect.poll(() => portraits.evaluateAll((images) =>
    images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
  )).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "output/playwright/lp-portal/founders-complete.png",
    fullPage: true,
  });
});

test("keeps the public navigation integrated while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1195, height: 788 });

  for (const route of ["/companies", "/founders", "/team", "/updates"]) {
    await page.goto(route);
    const nav = page.locator(".cog-desktop-nav");
    await expect(nav).toBeVisible();
    const initialBox = await nav.boundingBox();
    expect(initialBox).not.toBeNull();

    await page.evaluate(() => window.scrollTo(0, 900));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(250);
    const scrolledBox = await nav.boundingBox();
    expect(scrolledBox).not.toBeNull();
    expect(scrolledBox!.x).toBeCloseTo(initialBox!.x, 0);
    expect(scrolledBox!.y).toBeCloseTo(initialBox!.y, 0);
    expect(await nav.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, boxShadow: style.boxShadow, position: style.position };
    })).toEqual({ background: "rgba(0, 0, 0, 0)", boxShadow: "none", position: "fixed" });
  }
});

test("uses a slow, restrained orb glow and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1195, height: 788 });
  await page.goto("/companies");

  const mark = page.locator(".cog-character-mark-wrap:visible").first();
  await expect(mark).toBeVisible();
  const glow = await mark.evaluate((element) => {
    const radiance = getComputedStyle(element, "::before");
    const core = getComputedStyle(element, "::after");
    return {
      radianceAnimation: radiance.animationName,
      coreAnimation: core.animationName,
      duration: radiance.animationDuration,
      radianceOpacity: Number.parseFloat(radiance.opacity),
      coreOpacity: Number.parseFloat(core.opacity),
    };
  });
  expect(glow.radianceAnimation).toBe("cog-orb-radiance");
  expect(glow.coreAnimation).toBe("cog-orb-core");
  expect(glow.duration).toBe("10.5s");
  expect(glow.radianceOpacity).toBeLessThanOrEqual(0.4);
  expect(glow.coreOpacity).toBeLessThanOrEqual(0.4);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await mark.evaluate((element) => ({
    radianceAnimation: getComputedStyle(element, "::before").animationName,
    coreAnimation: getComputedStyle(element, "::after").animationName,
  }))).toEqual({ radianceAnimation: "none", coreAnimation: "none" });
});

test("protects, authenticates, searches, and opens an investment", async ({ page }) => {
  await page.goto("/lp");
  await expect(page).toHaveURL(/\/lp-login$/);
  await expect(page.getByRole("heading", { name: "Investor portal." })).toBeVisible();

  await page.getByLabel("Access password").fill("incorrect-password");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp-login\?error=invalid$/);
  await expect(page.locator("#lp-login-error")).toContainText("not valid");

  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page.getByRole("heading", { name: "Investments" })).toBeVisible();
  await expect(page.getByText("44 of 44 records")).toBeVisible();
  await expect(page.getByText("$676,014.25", { exact: true })).toBeVisible();
  await expect(page.getByText("$689,867.04", { exact: true })).toBeVisible();
  await expect(page.getByText("1.02×", { exact: true })).toBeVisible();
  await expect(page.getByText(/not audited NAV/i)).toBeVisible();
  await expect(page.getByText("Stripe", { exact: true })).toHaveCount(0);
  await expect(page.locator(".lp-portfolio-table").getByText("Positron", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-portfolio-table").getByText("No co. val; $50M fund / $1M SPV", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-portfolio-table").getByText("No val; $50M model financing", { exact: true })).toBeVisible();
  await expect(page.locator(".lp-portfolio-table .lp-company-logo img")).toHaveCount(44);
  await expect.poll(() => page.locator(".lp-portfolio-table .lp-company-logo img").evaluateAll((logos) =>
    logos.filter((logo) => (logo as HTMLImageElement).complete && (logo as HTMLImageElement).naturalWidth > 0).length,
  )).toBe(44);
  await page.screenshot({ path: "output/playwright/lp-portal/portfolio-desktop.png", fullPage: true });

  const search = page.getByPlaceholder("Search investments…");
  await search.fill("Blue Origin");
  await search.press("Enter");
  await expect(page.getByText(/1 of 44 records/)).toBeVisible();
  await page.getByRole("link", { name: "View Blue Origin" }).click();
  await expect(page).toHaveURL(/43-blue-origin$/);
  await expect(page.getByText("Pending acceptance", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Data status", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Visit Blue Origin website" })).toHaveAttribute("href", "https://www.blueorigin.com/");
  await expect(page.getByRole("heading", { name: "Position" })).toBeVisible();
  await expect(page.getByText("$15,000", { exact: true })).toHaveCount(2);
  await expect(page.getByText("$130B pre-money", { exact: true })).toHaveCount(2);
  await expect(page.getByText("$0", { exact: true })).toBeVisible();
  await expect(page.getByText("1.00×", { exact: true })).toBeVisible();
  await expect(page.getByText(/not audited NAV/i)).toBeVisible();
  await page.screenshot({ path: "output/playwright/lp-portal/detail-desktop.png", fullPage: true });

  await page.locator(".lp-back-link").click();
  await page.getByPlaceholder("Search investments…").fill("Positron");
  await page.getByPlaceholder("Search investments…").press("Enter");
  await page.getByRole("link", { name: "View Positron" }).click();
  await expect(page).toHaveURL(/44-positron$/);
  await expect(page.getByRole("link", { name: "Visit Positron website" })).toHaveAttribute("href", "https://www.positron.ai/");
  await expect(page.getByText("$4.5B pre-money", { exact: true })).toHaveCount(2);
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
