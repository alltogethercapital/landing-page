import { expect, test } from "@playwright/test";

test("states the safe, globally collaborative, human-flourishing manifesto", async ({ page }) => {
  await page.goto("/");

  const manifesto = page.locator(".cog-manifesto-section");
  await expect(manifesto).toContainText("safe AI");
  await expect(manifesto).toContainText("intelligent global teamwork");
  await expect(manifesto).toContainText("abundant future of human flourishing—not an AI-centric one");
});
