import { expect, test } from "@playwright/test";

test("publishes Allia Health across every authorized surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Allia Health\./ })).toHaveAttribute("href", "/updates/allia-health");

  await page.goto("/companies#allia-health");
  const companyCard = page.locator("#allia-health");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.getByRole("link", { name: "Visit Allia Health" })).toHaveAttribute("href", "https://allia.health/");

  await page.goto("/founders");
  for (const founder of ["Amie Leighton", "Saroosh Khan", "Lucas Volini"]) {
    await expect(page.getByRole("heading", { name: founder })).toBeVisible();
  }

  const response = await page.goto("/updates/allia-health");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Allia Health.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$10,000", "$50M", "AngelList", "SAFE", "management fee", "carry"]) {
    expect(article).not.toContain(confidential);
  }
});
