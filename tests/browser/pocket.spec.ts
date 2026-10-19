import { expect, test } from "@playwright/test";

test("removes the withdrawn Pocket opportunity from every active surface", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Pocket\./ })).toHaveCount(0);

  await page.goto("/companies");
  await expect(page.locator("#pocket")).toHaveCount(0);
  await expect(page.getByText("Pocket", { exact: true })).toHaveCount(0);

  await page.goto("/founders");
  await expect(page.getByRole("heading", { name: "Akshay Narisetti" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Gabriel Dymowski" })).toHaveCount(0);

  const response = await page.goto("/updates/pocket");
  expect(response?.status()).toBe(404);

});
