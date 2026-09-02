import { expect, test } from "@playwright/test";

test("publishes Autostep across every public portfolio surface", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('a[aria-label="Autostep"]')).toHaveAttribute(
    "href",
    "https://www.autostep.ai/",
  );
  await expect(page.getByRole("link", { name: /Autostep\./ })).toHaveAttribute(
    "href",
    "/updates/autostep",
  );

  await page.goto("/companies");
  const companyCard = page.locator("#autostep");
  await expect(
    companyCard.getByRole("link", { name: "Visit Autostep" }),
  ).toHaveAttribute("href", "https://www.autostep.ai/");

  await page.goto("/founders");
  const founder = page.locator("#aidan-pratt-autostep");
  await expect(founder.getByRole("heading", { name: "Aidan Pratt" })).toBeVisible();
  await expect(
    founder.getByRole("link", { name: "Aidan Pratt on LinkedIn" }).first(),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/aidan-pratt");

  await page.goto("/updates");
  await expect(page.getByRole("link", { name: /Autostep\./ })).toHaveAttribute(
    "href",
    "/updates/autostep",
  );

  const articleResponse = await page.goto("/updates/autostep");
  expect(articleResponse?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Autostep.");
  await expect(page.getByText("We invested in Autostep.", { exact: false })).toBeVisible();
  await expect(page.getByText("Why we backed the founder and team")).toBeVisible();

  const articleText = await page.locator("main").innerText();
  for (const confidentialTerm of [
    "$25M",
    "$200K",
    "Exitfund",
    "AngelList",
    "carry",
    "management fee",
  ]) {
    expect(articleText).not.toContain(confidentialTerm);
  }
});
