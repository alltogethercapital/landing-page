import { expect, test } from "@playwright/test";

const BACKGROUND_NAMES = [
  "Tropical Ascii Cam",
  "Ascii Tunnel 3",
  "ASCII Peaks",
  "Ascii Tunnel 5",
  "Ascii Tunnel 1",
  "Ascii Tunnel 2",
  "Ascii Tunnel 6",
  "Ascii Tunnel 4",
  "Ascii Wave 1",
  "Ascii Wave 3",
  "Bad Signal 2",
  "Realigning 3",
  "Ascii Wave 4",
  "Realigning 5",
  "Realigning 1",
  "Ascii Wave 2",
  "Container Ship",
  "Static Noise 1",
  "Realigning 4",
  "Arrow Skies 2",
  "Realigning 2",
  "Bad Signal 1",
  "Free Stars and Stripes 1",
  "Free Stars and Stripes 2",
  "Pistons 1",
  "Photocopied 7",
  "Pistons 4",
  "Matrix Rain",
  "Bad Signal 3",
  "Enter The Matrix 2",
  "Enter The Matrix 3",
  "Free Arrow Grid 1",
  "Static Noise 2",
  "Free Arrow Grid 2",
  "Digital Activation 5",
  "Arrow Skies 4",
  "Realigning 6",
  "Enter The Matrix 1",
  "Digital Activation 3",
  "Arrow Skies 5",
  "Glitch Trail",
  "Arrow Skies 3",
  "Pistons 3",
] as const;

const DEFAULT_NAME = "Ascii Wave 3";
const STORAGE_KEY = "all-together-ascii-background-v1";

test.beforeEach(async ({ page }) => {
  await page.addInitScript((key) => {
    window.localStorage.removeItem(key);
    (
      window as typeof window & {
        __allTogetherPreloadStarted?: boolean;
      }
    ).__allTogetherPreloadStarted = true;
  }, STORAGE_KEY);
});

test("cycles through and persists all 43 ASCII backgrounds", async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const stage = page.locator(".ascii-background-stage");
  const toggle = page.getByRole("button", { name: /Show next ASCII background/ });

  await expect(stage).toHaveAttribute("data-ascii-background-name", DEFAULT_NAME, {
    timeout: 30_000,
  });
  await expect(toggle).toContainText("10/43");
  await expect(page.locator(".ascii-background-shader")).toBeVisible({ timeout: 30_000 });

  const styles = await page.evaluate(() => {
    const stage = getComputedStyle(document.querySelector<HTMLElement>(".ascii-background-stage")!);
    const shader = getComputedStyle(document.querySelector<HTMLElement>(".ascii-background-shader")!);
    return {
      stagePosition: stage.position,
      stagePointerEvents: stage.pointerEvents,
      stageZIndex: stage.zIndex,
      shaderOpacity: shader.opacity,
    };
  });

  expect(styles).toEqual({
    stagePosition: "fixed",
    stagePointerEvents: "none",
    stageZIndex: "0",
    shaderOpacity: "0.16",
  });

  await page.screenshot({ path: "output/playwright/ascii-backgrounds/home-desktop.png" });

  const visited = new Set<string>([DEFAULT_NAME]);
  for (let click = 0; click < BACKGROUND_NAMES.length - 1; click += 1) {
    const previous = await stage.getAttribute("data-ascii-background-name");
    await toggle.click();
    await expect(stage).not.toHaveAttribute("data-ascii-background-name", previous ?? "");
    visited.add((await stage.getAttribute("data-ascii-background-name")) ?? "");
  }

  expect([...visited].sort()).toEqual([...BACKGROUND_NAMES].sort());
  await toggle.click();
  await expect(stage).toHaveAttribute("data-ascii-background-name", DEFAULT_NAME);

  await page.goto("/companies");
  await expect(page.locator(".ascii-background-stage")).toHaveAttribute(
    "data-ascii-background-name",
    DEFAULT_NAME,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "output/playwright/ascii-backgrounds/companies-phone.png" });
});

test("uses a static treatment when reduced motion is requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const stage = page.locator(".ascii-background-stage");
  await expect(stage).toHaveClass(/is-static/);
  await expect(stage.locator(".ascii-background-fallback")).toBeVisible();
  await expect(stage.locator(".ascii-background-shader")).toHaveCount(0);
});
