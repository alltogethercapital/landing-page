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

test("keeps icon-only company marks readable as complete lockups", async ({ page }) => {
  await page.goto("/companies");

  for (const company of [
    "Allia Health",
    "Raspire",
    "Rendezvous Robotics",
    "Compresr",
    "Core Automation",
  ]) {
    const card = page.locator(`article[id="${slugify(company)}"]`);
    await expect(card.locator(".cog-company-logo-lockup img")).toBeVisible();
    await expect(card.getByText(company, { exact: true })).toBeVisible();
  }

  const unloadedLogos = await page.locator(".cog-company-logo-wrap img").evaluateAll((logos) =>
    logos.filter((logo) => !(logo as HTMLImageElement).complete || (logo as HTMLImageElement).naturalWidth === 0).length,
  );
  expect(unloadedLogos).toBe(0);
});
