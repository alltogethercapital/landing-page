import { expect, test } from "@playwright/test";

test("publishes Summer Engine across every authorized surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Summer Engine\./ })).toHaveAttribute("href", "/updates/summer-engine");

  await page.goto("/companies#summer-engine");
  const companyCard = page.locator("#summer-engine");
  const companyLogo = companyCard.locator("img");
  await expect(companyLogo).toBeVisible();
  const logoBox = await companyLogo.boundingBox();
  const mediaBox = await companyCard.locator(".cog-company-logo-wrap").boundingBox();
  expect(logoBox).not.toBeNull();
  expect(mediaBox).not.toBeNull();
  expect(logoBox!.width).toBeLessThanOrEqual(mediaBox!.width * 0.9);
  expect(logoBox!.height).toBeLessThanOrEqual(mediaBox!.height * 0.55);
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
  for (const name of ["Mathias Heide", "Marcus Teller"]) {
    const card = page.locator("article", { has: page.getByText(name, { exact: true }) });
    const linkedIn = card.getByRole("link", { name: `${name} on LinkedIn` });
    const x = card.getByRole("link", { name: `${name} on X` });
    await expect(linkedIn).toHaveText("");
    await expect(x).toHaveText("");
    await expect(linkedIn.locator("svg.morphicon")).toHaveCount(1);
    await expect(x.locator("svg.morphicon")).toHaveCount(1);
  }
  const socialLinks = page.locator(".cog-person-links a");
  expect(await socialLinks.count()).toBeGreaterThan(0);
  for (const link of await socialLinks.all()) {
    await expect(link).toHaveText("");
    await expect(link.locator("svg.morphicon")).toHaveCount(1);
  }
});
