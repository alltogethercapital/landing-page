import { expect, test } from "@playwright/test";

const password = process.env.LP_TEST_PASSWORD || "StagingPortalPassphrase-2026";

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/lp");
  await page.getByLabel("Access password").fill(password);
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(page).toHaveURL(/\/lp$/);
}

async function expectDrawerFits(page: import("@playwright/test").Page) {
  const panel = page.locator(".lp-drawer-panel");
  await expect(panel).toBeVisible();
  const overflow = await panel.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(element).paddingRight);
    const issues: string[] = [];
    if (element.scrollWidth > element.clientWidth + 1) issues.push("panel scrolls horizontally");
    for (const node of element.querySelectorAll<HTMLElement>(".lp-cd *")) {
      const rect = node.getBoundingClientRect();
      if (rect.width && rect.right > box.right - pad + 1) issues.push(`overflow: ${node.textContent?.slice(0, 40)}`);
      if (node.matches(".lp-cd-news a, .lp-cd-table td, .lp-cd-table th") && node.getClientRects().length > 1) {
        issues.push(`wraps: ${node.textContent?.slice(0, 40)}`);
      }
    }
    return issues;
  });
  expect(overflow).toEqual([]);
}

for (const width of [1440, 390]) {
  test(`company detail drawer opens from both tables and fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await signIn(page);

    await page.locator(".lp-company-allocation-view a[href='/lp?company=anduril']").first().click();
    await expect(page).toHaveURL(/company=anduril/);
    await expect(page.locator(".lp-drawer-panel h2")).toHaveText("Anduril");
    await expect(page.locator(".lp-cd-rounds tbody tr").first()).toContainText("Series H");
    await expect(page.locator(".lp-cd-chart svg")).toBeVisible();
    await expectDrawerFits(page);
    await page.keyboard.press("Escape");
    await expect(page.locator(".lp-drawer")).toHaveCount(0);
    await expect(page).toHaveURL(/\/lp$/);

    await page.goto("/lp?section=performance");
    await page.locator(".lp-figure-table--perf a.lp-company-link").filter({ hasText: "Shield AI" }).click();
    await expect(page).toHaveURL(/section=performance&company=shield-ai/);
    const stats = page.locator(".lp-cd-stats").first();
    await expect(stats).toContainText("$10.5B");
    await expect(stats).toContainText("$28.8B");
    await expect(page.locator(".lp-cd-news li")).not.toHaveCount(0);
    await expectDrawerFits(page);
    await page.locator(".lp-drawer-close").click();
    await expect(page.locator(".lp-drawer")).toHaveCount(0);
    await expect(page).toHaveURL(/section=performance$/);

    // Undisclosed valuations render as text, never as a number.
    await page.goto("/lp?company=quaise-energy");
    await expect(page.locator(".lp-cd-rounds")).toContainText("undisclosed");
    await expectDrawerFits(page);
  });
}
