import { expect, test } from "@playwright/test";

test("uses the wing mark across public and LP surfaces", async ({ page }) => {
  for (const route of ["/", "/companies", "/lp-login"]) {
    await page.goto(route);
    const logo = page.locator('.cog-wordmark-logo[src*="machine-spirit-wing-mark.png"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS("border-radius", "0px");
    await expect(logo).toHaveCSS("width", "22px");
    await expect(logo).toHaveCSS("height", "11px");
    await expect(page.locator(".cog-theme-toggle")).toHaveCount(1);
  }
});
