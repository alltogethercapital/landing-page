import { expect, test } from "@playwright/test";

const companies = [
  ["Molagri", "https://molagri.com/"],
  ["TryNearby", "https://trynearby.com/"],
  ["Familiar Labs", "https://www.thefamiliarlab.com/"],
  ["CarSignal", "https://trycarsignal.com/"],
  ["Datoric", "https://www.datoric.com/"],
  ["Rasyn", "https://www.rasyn.ai/"],
] as const;

test("publishes the six-company portfolio intake", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Molagri\./ })).toHaveAttribute("href", "/updates/molagri");

  await page.goto("/companies");
  for (const [name, href] of companies) {
    await expect(page.locator(`#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`).getByRole("link", { name: `Visit ${name}` })).toHaveAttribute("href", href);
  }

  await page.goto("/founders");
  for (const founder of ["Zaky Hassan", "Yousef Abdelfattah", "An Zhu Liu", "Nikhil Reddy", "Ansh Tiwari"]) {
    await expect(page.getByRole("heading", { name: founder })).toBeVisible();
  }

  await page.goto("/updates");
  for (const [name] of companies) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await expect(page.getByRole("link", { name: new RegExp(`${name}\\.`) })).toHaveAttribute("href", `/updates/${slug}`);
    const response = await page.goto(`/updates/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`${name}.`);
    const article = await page.locator("main").innerText();
    for (const confidential of ["$5,000", "$10,000", "AngelList", "SPV", "management fee", "20% carry"]) expect(article).not.toContain(confidential);
    await page.goto("/updates");
  }
});
