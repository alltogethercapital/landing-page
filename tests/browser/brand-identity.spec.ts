import { expect, test } from "@playwright/test";

test("uses the wing mark across public and LP surfaces", async ({ page }) => {
  for (const route of ["/", "/companies", "/lp-login"]) {
    await page.goto(route);
    const logo = page.locator('.cog-wordmark-logo[src*="machine-spirit-wing-mark.png"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS("border-radius", "0px");
    await expect(logo).toHaveCSS("width", "64px");
    await expect(logo).toHaveCSS("height", "31px");
    await expect(page.locator(".cog-theme-toggle")).toHaveCount(1);
  }
});

test("aligns the two-line group wordmark with the desktop navigation", async ({ page }) => {
  await page.goto("/");

  const desktopWordmark = page.locator(".cog-desktop-nav .cog-wordmark");
  await expect(desktopWordmark.locator(".cog-wordmark-line")).toHaveText([
    "MACHINE SPIRIT",
    "GROUP",
  ]);

  const alignment = await page.locator(".cog-desktop-nav").evaluate((nav) => {
    const wordmarkText = nav.querySelector<HTMLElement>(".cog-wordmark-text");
    const symbol = nav.querySelector<HTMLElement>(".cog-wordmark-symbol");
    const firstLink = nav.querySelector<HTMLElement>(".cog-nav-link");
    if (!wordmarkText || !symbol || !firstLink) throw new Error("Missing desktop identity elements");

    const linkText = document.createRange();
    linkText.selectNodeContents(firstLink);
    return {
      wordmarkLeft: wordmarkText.getBoundingClientRect().left,
      navTextLeft: linkText.getBoundingClientRect().left,
      symbolRight: symbol.getBoundingClientRect().right,
    };
  });

  expect(Math.abs(alignment.wordmarkLeft - alignment.navTextLeft)).toBeLessThanOrEqual(1);
  expect(alignment.symbolRight).toBeLessThan(alignment.wordmarkLeft);
});

test("uses the animated static background across public pages", async ({ page }) => {
  await page.goto("/");
  const themeColor = page.locator('meta[name="theme-color"]');
  await expect(themeColor).toHaveAttribute("content", "#f1efe9");
  await page.locator(".cog-theme-toggle").click();
  await expect(themeColor).toHaveAttribute("content", "#0f0f0e");

  for (const route of ["/", "/companies", "/founders", "/updates"]) {
    await page.goto(route);
    const staticStyle = await page.locator(".cog-page").evaluate((element) => {
      const style = window.getComputedStyle(element, "::after");
      return {
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationTimingFunction: style.animationTimingFunction,
        backgroundImage: style.backgroundImage,
        opacity: style.opacity,
      };
    });

    expect(staticStyle.animationName).toBe("cog-signal-static");
    expect(staticStyle.animationDuration).toBe("60s");
    expect(staticStyle.animationTimingFunction).toBe("ease-in-out");
    expect(staticStyle.backgroundImage).toContain("machine-spirit-static-noise.png");
    expect(staticStyle.opacity).toBe("0.22");
    await expect(page.getByRole("group", { name: "Background style" })).toHaveCount(0);
  }
});
