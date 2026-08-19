import { expect, test } from "@playwright/test";

test("uses the Sequoia font families in their intended roles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const typography = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryFamily = (variable: string) =>
      rootStyles.getPropertyValue(variable).split(",")[0]?.replace(/["']/g, "").trim() ?? "";
    const familyOf = (selector: string) =>
      getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontFamily;

    return {
      rosart: primaryFamily("--font-rosart"),
      unica: primaryFamily("--font-unica"),
      pitch: primaryFamily("--font-pitch-sans"),
      heading: familyOf(".cog-title"),
      body: familyOf(".cog-copy-stack p"),
      wordmark: familyOf(".cog-wordmark"),
      nav: familyOf(".cog-nav-link"),
      navSize: getComputedStyle(document.querySelector<HTMLElement>(".cog-nav-link")!).fontSize,
      navTransform: getComputedStyle(
        document.querySelector<HTMLElement>(".cog-nav-link")!,
      ).textTransform,
    };
  });

  expect(typography.rosart).not.toBe("");
  expect(typography.unica).not.toBe("");
  expect(typography.pitch).not.toBe("");
  expect(typography.heading).toContain(typography.rosart);
  expect(typography.body).toContain(typography.unica);
  expect(typography.wordmark).toContain(typography.unica);
  expect(typography.nav).toContain(typography.pitch);
  expect(typography.navSize).toBe("14px");
  expect(typography.navTransform).toBe("uppercase");

  await page.screenshot({
    path: "output/playwright/typography/home-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({
    path: "output/playwright/typography/home-phone.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileNav = await page.locator(".cog-mobile-menu-link").first().evaluate((element) => {
    const styles = getComputedStyle(element);
    return { family: styles.fontFamily, transform: styles.textTransform };
  });
  expect(mobileNav.family).toContain(typography.pitch);
  expect(mobileNav.transform).toBe("uppercase");
  await page.screenshot({
    path: "output/playwright/typography/home-phone-menu.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/lp-login");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const portalTypography = await page.evaluate(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryFamily = (variable: string) =>
      rootStyles.getPropertyValue(variable).split(",")[0]?.replace(/["']/g, "").trim() ?? "";
    const familyOf = (selector: string) =>
      getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontFamily;

    return {
      rosart: primaryFamily("--font-rosart"),
      pitch: primaryFamily("--font-pitch-sans"),
      heading: familyOf(".cog-title"),
      label: familyOf(".lp-login-form > label"),
      action: familyOf(".lp-login-input-row button"),
    };
  });

  expect(portalTypography.heading).toContain(portalTypography.rosart);
  expect(portalTypography.label).toContain(portalTypography.pitch);
  expect(portalTypography.action).toContain(portalTypography.pitch);
});
