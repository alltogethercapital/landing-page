import { expect, test } from "@playwright/test";

test("publishes the October investor update with the current portfolio snapshot", async ({ page }) => {
  await page.goto("/lp-login");
  await page.getByLabel("Access password").fill(process.env.LP_TEST_PASSWORD || "");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);

  await page.goto("/lp/updates");
  const octoberUpdate = page.getByRole("link", {
    name: /Intelligence Meets the Production Line: Chef Robotics, Physical AI/,
  });
  await expect(octoberUpdate).toBeVisible();
  await expect(octoberUpdate).toHaveAttribute("href", "/lp/updates/october-2026");
  await expect(page.getByText("Investor Update #3", { exact: true })).toBeVisible();
  await expect(page.getByText("October 16, 2026", { exact: true })).toBeVisible();

  await octoberUpdate.click();
  await expect(page).toHaveURL(/\/lp\/updates\/october-2026$/);
  await expect(page.getByRole("heading", { name: "Intelligence Meets the Production Line" })).toBeVisible();
  const copy = page.locator(".lp-update-article-copy");
  await expect(copy).toContainText("60 recorded positions across 59 companies");
  await expect(copy).toContainText("$855,236.66");
  await expect(copy).toContainText("$935,228.68");
  await expect(copy).toContainText("1.09× current value multiple");
  await expect(copy).toContainText("$79,992.02 above recorded cost");
  await expect(copy).toContainText("$18,590.75");
  await expect(copy).toContainText("completed cash movement are not yet evidenced");
  await expect(copy).toContainText("no bank-ledger movement has been created without transaction evidence");
  await expect(copy).toContainText("not audited NAV");
  await expect(copy).toContainText("at least twice per year");
  await expect(copy).not.toContainText("quarterly");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
});
