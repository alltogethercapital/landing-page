import { expect, test } from "@playwright/test";
import { LP_INVESTOR_UPDATES } from "../../src/data/lp-investor-updates";
import { ARTICLES } from "../../src/lib/articles";
import { LEGAL_DOCS } from "../../src/lib/legal";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";
const suffix = " | All Together Capital";

test("uses the page name and All Together Capital suffix on every page", async ({ page }) => {
  test.setTimeout(180_000);

  const publicPages = [
    { path: "/", name: "Home" },
    { path: "/companies", name: "Our companies" },
    { path: "/founders", name: "Our entrepreneurs" },
    { path: "/team", name: "Our team" },
    { path: "/updates", name: "Updates" },
    ...ARTICLES.map((article) => ({
      path: `/updates/${article.slug}`,
      name: article.title,
    })),
    ...Object.entries(LEGAL_DOCS).map(([slug, doc]) => ({
      path: `/legal/${slug}`,
      name: doc.title,
    })),
  ];

  for (const route of publicPages) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(`${route.name}${suffix}`);
  }

  await page.goto("/lp-login");
  await expect(page).toHaveTitle(`LP Login${suffix}`);
  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
  await expect(page).toHaveTitle(`Portfolio${suffix}`);
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("button", { name: "Table view" })).toBeEnabled();
  await page.getByRole("button", { name: "Table view" }).click();
  await expect(page.getByRole("button", { name: "Table view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".lp-portfolio-table tbody tr")).toHaveCount(44);
  const investmentPaths = await page
    .locator('a[href^="/lp/investments/"]')
    .evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute("href")))].filter(Boolean));

  const privatePages = [
    { path: "/lp", name: "Portfolio" },
    { path: "/lp?section=analysis", name: "Insights" },
    { path: "/lp?section=performance", name: "Performance" },
    { path: "/lp/updates", name: "Investor Updates" },
    ...LP_INVESTOR_UPDATES.map((update) => ({
      path: `/lp/updates/${update.slug}`,
      name: update.title,
    })),
  ];

  for (const route of privatePages) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(`${route.name}${suffix}`);
  }

  expect(investmentPaths).toHaveLength(44);
  for (const path of investmentPaths) {
    await page.goto(path!);
    const pageName = await page.getByRole("heading", { level: 1 }).textContent();
    expect(pageName).not.toBeNull();
    await expect(page).toHaveTitle(`${pageName}${suffix}`);
  }
});
