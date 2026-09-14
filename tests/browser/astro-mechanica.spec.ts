import { expect, test } from "@playwright/test";

test("publishes Astro Mechanica across every authorized public surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Astro Mechanica\./ })).toHaveAttribute("href", "/updates/astro-mechanica");

  await page.goto("/companies#astro-mechanica");
  const companyCard = page.locator("#astro-mechanica");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.getByRole("link", { name: "Visit Astro Mechanica" })).toHaveAttribute("href", "https://www.astromecha.co/");

  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Ian Brooke" })).toBeVisible();

  const response = await page.goto("/updates/astro-mechanica");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Astro Mechanica.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$5M", "$25,000", "$500M", "AngelList", "Pax", "20.0%", "carry"]) {
    expect(article).not.toContain(confidential);
  }
});
