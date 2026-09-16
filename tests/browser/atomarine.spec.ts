import { expect, test } from "@playwright/test";

test("publishes Atomarine across every authorized public surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Atomarine\./ })).toHaveAttribute("href", "/updates/atomarine");

  await page.goto("/companies#atomarine");
  const companyCard = page.locator("#atomarine");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.getByText("Atomarine", { exact: true })).toBeVisible();
  await expect(companyCard.getByRole("link", { name: "Visit Atomarine" })).toHaveAttribute("href", "https://atomarine.co/");

  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Dimitris Koutentakis" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Emile Germonpre" })).toBeVisible();

  const response = await page.goto("/updates/atomarine");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Atomarine.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$200k", "$200,000", "$125M", "$16M", "AngelList", "Exitfund", "20.0%", "carry", "$4B", "LOI"]) {
    expect(article).not.toContain(confidential);
  }
});
