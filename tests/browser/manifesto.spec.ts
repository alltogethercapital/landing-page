import { expect, test } from "@playwright/test";

test("states the safe, globally collaborative, human-centric manifesto", async ({ page }) => {
  await page.goto("/");

  const manifesto = page.locator(".cog-manifesto-section");
  await expect(manifesto).toContainText("safe AI");
  await expect(manifesto).toContainText("intelligent global teamwork");
  await expect(manifesto).toContainText("abundant, human-centric future—not an AI-centric one");
});
