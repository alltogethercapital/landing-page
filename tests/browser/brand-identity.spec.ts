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

test("uses the animated static background across public pages", async ({ page }) => {
  await page.goto("/");
  const themeColor = page.locator('meta[name="theme-color"]');
  await expect(themeColor).toHaveAttribute("content", "#f1efe9");
  await page.locator(".cog-theme-toggle").click();
  await expect(themeColor).toHaveAttribute("content", "#0f0f0e");

  for (const route of ["/", "/companies", "/founders", "/updates"]) {
    await page.goto(route);
    const animationName = await page.locator(".cog-page").evaluate((element) =>
      window.getComputedStyle(element, "::after").animationName,
    );

    expect(animationName).toBe("cog-signal-static");
    await expect(page.getByRole("group", { name: "Background style" })).toHaveCount(0);
  }
});
