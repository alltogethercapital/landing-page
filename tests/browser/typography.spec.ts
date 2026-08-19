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

test("keeps navigation hover feedback snappy", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const nav = page.locator(".cog-nav-links");
  const hoverPlate = nav.locator(".cog-nav-hover-plate");
  await nav.locator(".cog-nav-link").nth(1).hover();

  await expect(nav).toHaveAttribute("data-hover-ready", "true");
  await expect(hoverPlate).toHaveCSS("opacity", "1");

  const transitionDurations = await hoverPlate.evaluate((element) =>
    getComputedStyle(element)
      .transitionDuration.split(",")
      .map((duration) => Number.parseFloat(duration) * 1000),
  );

  expect(Math.max(...transitionDurations)).toBeLessThanOrEqual(60);
});

test("uses subtle press and email cues for navigation", async ({ page }) => {
  await page.addInitScript(() => {
    const probe = { noiseLayers: 0, toneLayers: 0 };
    Object.assign(window, { __cuelumeProbe: probe });

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;

    const createBufferSource = AudioContextConstructor.prototype.createBufferSource;
    const createOscillator = AudioContextConstructor.prototype.createOscillator;

    AudioContextConstructor.prototype.createBufferSource = function (this: AudioContext) {
      probe.noiseLayers += 1;
      return createBufferSource.call(this);
    };
    AudioContextConstructor.prototype.createOscillator = function (this: AudioContext) {
      probe.toneLayers += 1;
      return createOscillator.call(this);
    };
  });

  const readProbe = () =>
    page.evaluate(
      () =>
        (
          window as typeof window & {
            __cuelumeProbe: { noiseLayers: number; toneLayers: number };
          }
        ).__cuelumeProbe,
    );

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const pageLink = page.locator(".cog-nav-link").nth(1);
  await pageLink.hover();
  await page.mouse.down();
  await expect.poll(readProbe).toEqual({ noiseLayers: 1, toneLayers: 0 });
  await page.mouse.up();
  await expect(page).toHaveURL(/\/companies$/);

  const emailLink = page.locator(".cog-nav-button");
  await emailLink.hover();
  await page.mouse.down();
  await expect.poll(readProbe).toEqual({ noiseLayers: 2, toneLayers: 1 });
});
