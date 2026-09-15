import { expect, test } from "@playwright/test";
import { PORTFOLIO, slugify } from "../../src/lib/portfolio";

test("lists every public portfolio company exactly once", async ({ page }) => {
  await page.goto("/companies");

  const cards = page.locator(".cog-company-card");
  await expect(cards).toHaveCount(PORTFOLIO.length);

  for (const company of PORTFOLIO) {
    const card = page.locator(`article[id="${slugify(company.name)}"]`);
    await expect(card).toHaveCount(1);
    await expect(card.getByRole("link", { name: `Visit ${company.name}` })).toBeVisible();
  }
});

test("keeps Astro Mechanica named and Path Robotics legible", async ({ page }) => {
  await page.goto("/companies");

  const astro = page.locator("#astro-mechanica");
  await expect(astro.getByText("Astro Mechanica", { exact: true })).toBeVisible();

  const pathLogo = page.locator("#path-robotics img");
  await expect(pathLogo).toBeVisible();
  await expect(pathLogo).toHaveAttribute("src", /path-robotics\.svg\?v=20260915/);
  await expect(pathLogo).toHaveJSProperty("complete", true);
});
