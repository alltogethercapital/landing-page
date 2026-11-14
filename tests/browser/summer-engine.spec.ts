import { expect, test } from "@playwright/test";

test("publishes Summer Engine across every authorized surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Summer Engine\./ })).toHaveAttribute("href", "/updates/summer-engine");

  await page.goto("/companies#summer-engine");
  const companyCard = page.locator("#summer-engine");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.getByRole("link", { name: "Visit Summer Engine" })).toHaveAttribute(
    "href",
    "https://www.summerengine.com/",
  );

  const response = await page.goto("/updates/summer-engine");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Summer Engine.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$25,000", "Not evidenced", "Not specified", "management fee", "carry"]) {
    expect(article).not.toContain(confidential);
  }

  await page.goto("/founders#summer-engine");
  await expect(page.getByText("Mathias Heide", { exact: true })).toBeVisible();
  await expect(page.getByText("Marcus Teller", { exact: true })).toBeVisible();
});
