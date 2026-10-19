import { expect, test } from "@playwright/test";

test("publishes the September investor update with a dated portfolio snapshot", async ({ page }) => {
  await page.goto("/lp-login");
  await page.getByLabel("Access password").fill(process.env.LP_TEST_PASSWORD || "");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);

  await page.goto("/lp/updates");
  const septemberUpdate = page.getByRole("link", {
    name: /The Work Moves Into the World: What Fourteen New Positions Reveal/,
  });
  await expect(septemberUpdate).toBeVisible();
  await expect(septemberUpdate).toHaveAttribute("href", "/lp/updates/september-2026");
  await expect(page.getByText("Investor Update #2", { exact: true })).toBeVisible();
  await expect(page.getByText("September 17, 2026", { exact: true })).toBeVisible();

  await septemberUpdate.click();
  await expect(page).toHaveURL(/\/lp\/updates\/september-2026$/);
  await expect(page.getByRole("heading", { name: "The Work Moves Into the World" })).toBeVisible();
  const copy = page.locator(".lp-update-article-copy");
  await expect(copy).toContainText("58 recorded positions across 57 companies");
  await expect(copy).toContainText("$821,645.98");
  await expect(copy).toContainText("$901,638.00");
  await expect(copy).toContainText("1.10× current value multiple");
  await expect(copy).toContainText("$79,992.02 above recorded cost");
  await expect(copy).toContainText("$154,883.97 across the fourteen additions");
  await expect(copy).toContainText("$15,000.00 correction to Positron");
  await expect(copy).toContainText("Restated October 19, 2026");
  await expect(copy).toContainText("final allocation is $20,766.24");
  await expect(copy).toContainText("no additional refund or platform credit is recorded without transaction evidence");
  await expect(copy).toContainText("backed out of Pocket");
  await expect(copy).toContainText("withdrawn $15,000.00 commitment has therefore been removed");
  await expect(copy).toContainText("No Pocket-labelled cash movement exists in the bank ledger");
  await expect(copy).toContainText("revised the final Rasyn allocation from $9,993.59 to $9,994.00");
  await expect(copy).toContainText("no separate $6.00 refund or AngelList account-balance credit is recorded without transaction evidence");
  await expect(copy).toContainText("revised the second Blue Origin allocation from $25,000.00 to $24,975.00");
  await expect(copy).toContainText("no separate $25.00 refund or AngelList account credit is recorded without transaction evidence");
  await expect(copy).toContainText("the Pocket withdrawal and the remaining allocation corrections");
  await expect(copy).toContainText("not audited NAV");
  await expect(copy).toContainText("do not convert a commitment");
  await expect(copy).not.toContainText("quarterly");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
});
