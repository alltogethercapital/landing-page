import { expect, test } from "@playwright/test";

test("publishes Chef Robotics across every authorized public surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Chef Robotics\./ })).toHaveAttribute("href", "/updates/chef-robotics");

  await page.goto("/companies#chef-robotics");
  const companyCard = page.locator("#chef-robotics");
  await expect(companyCard.locator("img")).toBeVisible();
  await expect(companyCard.getByText("Chef Robotics", { exact: true })).toBeVisible();
  await expect(companyCard.getByRole("link", { name: "Visit Chef Robotics" })).toHaveAttribute(
    "href",
    "https://www.chefrobotics.ai/",
  );

  const response = await page.goto("/updates/chef-robotics");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chef Robotics.");
  const article = await page.locator("main").innerText();
  for (const confidential of ["$18,590.75", "Not evidenced", "Not specified", "management fee", "carry"]) {
    expect(article).not.toContain(confidential);
  }
});
