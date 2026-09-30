import { expect, test } from "@playwright/test";

test("uses the single hard-edged color mark across public and LP surfaces", async ({ page }) => {
  for (const route of ["/", "/companies", "/lp-login"]) {
    await page.goto(route);
    const logo = page.locator('.cog-wordmark-logo[src*="all-together-a-069.svg"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS("border-radius", "0px");
    await expect(logo).toHaveCSS("width", "20px");
    await expect(logo).toHaveCSS("height", "20px");
    await expect(page.locator(".brand-theme-switcher")).toHaveCount(0);
  }
});
