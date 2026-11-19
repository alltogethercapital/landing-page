import { expect, test } from "@playwright/test";
import { PORTFOLIO } from "../../src/lib/portfolio";

test("publishes Anthropic with a single Public pill on its /companies card only", async ({ page }) => {
  // Anthropic is the one public-market position: a plain Public pill on /companies, nothing on the homepage.
  expect(PORTFOLIO.filter((company) => company.publicListing).map((company) => company.name)).toEqual(["Anthropic"]);

  await page.goto("/");
  const cell = page.getByRole("link", { name: "Anthropic", exact: true });
  await expect(cell).toHaveAttribute("href", "https://www.anthropic.com/");
  await expect(page.locator(".cog-logo-mosaic .market-tag, .cog-logo-mosaic .company-public-pill")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Anthropic\./ })).toHaveAttribute("href", "/updates/anthropic");

  await page.goto("/companies#anthropic");
  const card = page.locator("#anthropic");
  await expect(card.getByRole("link", { name: "Visit Anthropic" })).toHaveAttribute("href", "https://www.anthropic.com/");
  await expect(card.locator(".company-logo-image--transparent")).toBeVisible();
  await expect(page.locator(".market-tag, .public-listing-mark")).toHaveCount(0);
  await expect(page.locator(".company-public-pill")).toHaveCount(1);
  await expect(card.locator(".company-public-pill")).toHaveText("Public");
  await expect(card).not.toContainText("Nasdaq");
  await expect(page.locator(".cog-company-list")).not.toContainText("Private");
  const response = await page.goto("/updates/anthropic");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Anthropic.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$100,000", "111.50", "896", "Fidelity"]) {
    expect(article).not.toContain(confidential);
  }
});
