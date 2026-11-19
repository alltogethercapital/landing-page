import { expect, test } from "@playwright/test";
import { PORTFOLIO } from "../../src/lib/portfolio";

test("publishes Anthropic and marks only it as bought on the public market", async ({ page }) => {
  // Anthropic is the one public-market position; every other company stays unlabeled.
  expect(PORTFOLIO.filter((company) => company.publicListing).map((company) => company.name)).toEqual(["Anthropic"]);

  await page.goto("/");
  const cell = page.getByRole("link", { name: "Anthropic", exact: true });
  await expect(cell).toHaveAttribute("href", "https://www.anthropic.com/");
  await expect(page.locator(".cog-logo-mosaic .public-listing-mark")).toHaveCount(1);
  const tip = cell.locator(".public-listing-mark-tip");
  await expect(tip).toHaveText("Public market · Nasdaq: ANT");
  await expect(tip).toHaveCSS("opacity", "0");
  await cell.hover();
  await expect(tip).toHaveCSS("opacity", "1");
  await expect(page.getByRole("link", { name: /Anthropic\./ })).toHaveAttribute("href", "/updates/anthropic");

  await page.goto("/companies#anthropic");
  const card = page.locator("#anthropic");
  await expect(card.getByRole("link", { name: "Visit Anthropic" })).toHaveAttribute("href", "https://www.anthropic.com/");
  await expect(card.locator(".company-logo-image--transparent")).toBeVisible();
  await expect(page.locator(".cog-company-list .public-listing-mark")).toHaveCount(1);
  await expect(page.locator(".cog-company-list")).not.toContainText(/\bprivate\b/i);

  const response = await page.goto("/updates/anthropic");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Anthropic.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$100,000", "111.50", "896", "Fidelity"]) {
    expect(article).not.toContain(confidential);
  }
});
