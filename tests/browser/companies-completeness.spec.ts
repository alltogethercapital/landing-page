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

test("publishes Prometheus without retaining Applied Intuition as a public investment", async ({ page }) => {
  await page.goto("/companies");

  const prometheus = page.locator("#prometheus");
  await expect(prometheus.getByRole("link", { name: "Visit Prometheus" })).toHaveAttribute(
    "href",
    "https://www.prometheus.ai/",
  );
  await expect(prometheus.getByText("Prometheus", { exact: true })).toBeVisible();
  await expect(page.locator("#applied-intuition")).toHaveCount(0);
});

test("keeps every sourced logo monochrome at rest and reveals source color on engagement", async ({ page }) => {
  test.setTimeout(120_000);

  for (const theme of ["light", "dark"] as const) {
    await page.goto(`/companies?theme=${theme}`);

    const cards = page.locator(".cog-company-card");
    for (let index = 0; index < await cards.count(); index += 1) {
      const card = cards.nth(index);
      const image = card.locator(".company-logo-image");
      if (await image.count() === 0) continue;

      await card.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      expect(await image.evaluate((node) => getComputedStyle(node).filter)).not.toBe("none");

      await card.locator(".cog-company-card-link").hover();
      if (await image.evaluate((node) => node.classList.contains("company-logo-image--baked"))) {
        expect(await image.evaluate((node) => getComputedStyle(node).filter)).not.toBe("none");
      } else if (theme === "dark") {
        await expect(image).toHaveCSS("filter", "contrast(1.3) saturate(1.05)");
      } else {
        await expect(image).toHaveCSS("filter", "none");
      }
      if (theme === "dark") {
        await expect(card.locator(".company-logo-artwork")).toHaveCSS(
          "background-color",
          "rgb(244, 242, 237)",
        );
      }
    }
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
    await expect(card.locator(".company-logo--lockup img")).toBeVisible();
    await expect(card.getByText(company, { exact: true })).toBeVisible();
  }

  const logos = page.locator(".cog-company-logo-wrap img");
  for (let index = 0; index < await logos.count(); index += 1) {
    await logos.nth(index).scrollIntoViewIfNeeded();
    await expect(logos.nth(index)).toHaveJSProperty("complete", true);
  }

  const unloadedLogos = await logos.evaluateAll((logos) =>
    logos.filter((logo) => !(logo as HTMLImageElement).complete || (logo as HTMLImageElement).naturalWidth === 0).length,
  );
  expect(unloadedLogos).toBe(0);
});
