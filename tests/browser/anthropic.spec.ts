import { expect, test } from "@playwright/test";
import { PORTFOLIO } from "../../src/lib/portfolio";

test("publishes Anthropic and tags every company card Public or Private from data", async ({ page }) => {
  // Anthropic is the one public-market position; every other company is tagged Private.
  expect(PORTFOLIO.filter((company) => company.publicListing).map((company) => company.name)).toEqual(["Anthropic"]);

  await page.goto("/");
  const cell = page.getByRole("link", { name: "Anthropic", exact: true });
  await expect(cell).toHaveAttribute("href", "https://www.anthropic.com/");
  const mosaicTags = page.locator(".cog-logo-mosaic .market-tag");
  await expect(mosaicTags).toHaveCount(PORTFOLIO.length);
  await expect(page.locator('.cog-logo-mosaic .market-tag[data-market="public"]')).toHaveCount(1);
  await expect(page.locator('.cog-logo-mosaic .market-tag[data-market="private"]')).toHaveCount(PORTFOLIO.length - 1);
  await expect(page.getByRole("link", { name: "Prometheus", exact: true }).locator(".market-tag")).toHaveText("Private");
  const tag = cell.locator(".market-tag");
  await expect(tag).toHaveText("Public · Nasdaq: ANT");
  await expect(tag.locator(".market-tag-label")).toHaveText("Public");
  const ticker = tag.locator(".market-tag-ticker");
  await expect(ticker).toHaveCSS("opacity", "0");
  await cell.hover();
  await expect(ticker).toHaveCSS("opacity", "1");
  await expect(page.getByRole("link", { name: /Anthropic\./ })).toHaveAttribute("href", "/updates/anthropic");

  await page.goto("/companies#anthropic");
  const card = page.locator("#anthropic");
  await expect(card.getByRole("link", { name: "Visit Anthropic" })).toHaveAttribute("href", "https://www.anthropic.com/");
  await expect(card.locator(".company-logo-image--transparent")).toBeVisible();
  await expect(page.locator(".cog-company-list .market-tag")).toHaveCount(PORTFOLIO.length);
  await expect(page.locator('.cog-company-list .market-tag[data-market="public"]')).toHaveCount(1);
  await expect(card.locator(".market-tag-label")).toHaveText("Public");
  await expect(page.locator("#commons-clinic .market-tag")).toHaveText("Private");

  const response = await page.goto("/updates/anthropic");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Anthropic.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$100,000", "111.50", "896", "Fidelity"]) {
    expect(article).not.toContain(confidential);
  }
});
