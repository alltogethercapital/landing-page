import { expect, test } from "@playwright/test";

test("cycles persistently between brand 025 and 069 across public and LP surfaces", async ({
  page,
}) => {
  await page.goto("/");

  const root = page.locator("html");
  const logo025 = page.locator(".cog-wordmark-logo--025").first();
  const logo069 = page.locator(".cog-wordmark-logo--069").first();

  await expect(root).toHaveAttribute("data-brand-theme", "025");
  await expect(logo025).toHaveCSS("opacity", "1");
  await expect(logo069).toHaveCSS("opacity", "0");

  await page.getByRole("button", { name: "069" }).click();
  await expect(root).toHaveAttribute("data-brand-theme", "069");
  await expect(logo025).toHaveCSS("opacity", "0");
  await expect(logo069).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--cog-accent").trim(),
      ),
    )
    .toBe("#d92cff");

  await page.reload();
  await expect(root).toHaveAttribute("data-brand-theme", "069");

  await page.goto("/lp-login");
  await expect(root).toHaveAttribute("data-brand-theme", "069");
  await expect(page.locator(".cog-wordmark-logo--069").first()).toHaveCSS("opacity", "1");

  await page.getByRole("button", { name: "025" }).click();
  await expect(root).toHaveAttribute("data-brand-theme", "025");
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--cog-accent").trim(),
      ),
    )
    .toBe("#111");
});
