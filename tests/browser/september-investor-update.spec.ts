import { expect, test } from "@playwright/test";

test("publishes the September investor update with a dated portfolio snapshot", async ({ page }) => {
  await page.goto("/lp-login");
  await page.getByLabel("Access password").fill(process.env.LP_TEST_PASSWORD || "");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);

  await page.goto("/lp/updates");
  const septemberUpdate = page.getByRole("link", {
    name: /The Work Moves Into the World: What Fifteen New Positions Reveal/,
  });
  await expect(septemberUpdate).toBeVisible();
  await expect(septemberUpdate).toHaveAttribute("href", "/lp/updates/september-2026");
  await expect(page.getByText("Investor Update #2", { exact: true })).toBeVisible();
  await expect(page.getByText("September 17, 2026", { exact: true })).toBeVisible();

  await septemberUpdate.click();
  await expect(page).toHaveURL(/\/lp\/updates\/september-2026$/);
  await expect(page.getByRole("heading", { name: "The Work Moves Into the World" })).toBeVisible();
  const copy = page.locator(".lp-update-article-copy");
  await expect(copy).toContainText("59 recorded positions across 58 companies");
  await expect(copy).toContainText("$855,236.25");
  await expect(copy).toContainText("$935,918.54");
  await expect(copy).toContainText("1.09× current value multiple");
  await expect(copy).toContainText("$80,682.29 above recorded cost");
  await expect(copy).toContainText("$180,000.00 across the fifteen additions");
  await expect(copy).toContainText("$15,000.00 correction to Positron");
  await expect(copy).toContainText("Restated September 22, 2026");
  await expect(copy).toContainText("reduced our allocation from $30,000.00 to $29,222.00");
  await expect(copy).toContainText("credited to our AngelList Investor Account, not returned to our bank");
  await expect(copy).toContainText("not audited NAV");
  await expect(copy).toContainText("do not convert a commitment");
  await expect(copy).not.toContainText("quarterly");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
});
