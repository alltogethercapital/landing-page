"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PORTFOLIO } from "@/lib/portfolio";
import { HERO_VIDEOS, type HeroVideoSource } from "@/lib/hero-video-assets";
import { SoundOffIcon, SoundOnIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

// Each hero slide is a portfolio company. The image comes from the shared
// portfolio data; the background video is a local full-length MP4 so the hero
// never exposes third-party iframe chrome.
type Slide = {
  name: string;
  img: string;
  title: string;
  href: string;
  heroVideo?: readonly HeroVideoSource[];
  heroVideoStart?: number;
};

const SLIDE_COPY: Pick<
  Slide,
  "name" | "title" | "href" | "heroVideo" | "heroVideoStart"
>[] = [
  {
    name: "Shield AI",
    title: "Shield AI X-BAT",
    href: "https://shield.ai/x-bat/",
    heroVideo: HERO_VIDEOS.shieldAiXbat,
    heroVideoStart: 30,
  },
  {
    name: "1X",
    title: "1X NEO",
    href: "https://www.1x.tech/",
    heroVideo: HERO_VIDEOS.oneXNeoFactory,
  },
  {
    name: "Figure AI",
    title: "Figure 03",
    href: "https://www.figure.ai/",
    heroVideo: HERO_VIDEOS.figure03,
  },
];

const SLIDES: Slide[] = SLIDE_COPY.map((c) => {
  const company = PORTFOLIO.find((p) => p.name === c.name);
  return {
    ...c,
    img: company?.image ?? "",
  };
});

const IMAGE_HOLD_MS = 2000; // show each company image for two seconds before video
const FADE_MS = 850; // crossfade from the ending video to the next company image
const HOME_INTRO_SESSION_KEY = "all-together-home-intro-seen";
const INTRO_VARIANTS = [
  { id: "ascii-boot", label: "ASCII Boot" },
  { id: "blue-smoke", label: "Blue Smoke" },
  { id: "terminal-rain", label: "Terminal Rain" },
  { id: "satellite-scan", label: "Satellite Scan" },
  { id: "quantum-grid", label: "Quantum Grid" },
  { id: "orbit-iris", label: "Orbit Iris" },
  { id: "signal-bloom", label: "Signal Bloom" },
  { id: "star-map", label: "Star Map" },
  { id: "drone-swarm", label: "Drone Swarm" },
  { id: "blueprint-fold", label: "Blueprint Fold" },
  { id: "magnetic-field", label: "Magnetic Field" },
  { id: "lidar-sweep", label: "LiDAR Sweep" },
  { id: "launch-bay", label: "Launch Bay" },
  { id: "ion-curtain", label: "Ion Curtain" },
  { id: "encrypted-wipe", label: "Encrypted Wipe" },
  { id: "plasma-rift", label: "Plasma Rift" },
  { id: "stealth-cloak", label: "Stealth Cloak" },
  { id: "command-line", label: "Command Line" },
  { id: "constellation-shatter", label: "Constellation Shatter" },
  { id: "frontier-sunrise", label: "Frontier Sunrise" },
] as const;
type IntroVariantId = (typeof INTRO_VARIANTS)[number]["id"];
const DEFAULT_INTRO_VARIANT: IntroVariantId = "blue-smoke";
const INTRO_ASCII = [
  "ALL_TOGETHER",
  "FRONTIER",
  "AI",
  "ROBOTICS",
  "DEFENSE",
  "ENERGY",
  "SPACE",
  "0101",
  "BUILD",
  "USA",
  "CAPITAL",
  "SEATTLE",
];

let homeIntroSeenInRuntime = false;

function forceIntroFromUrl() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("intro");
}

function hasSeenHomeIntroThisSession() {
  if (typeof window === "undefined" || forceIntroFromUrl()) return false;
  if (homeIntroSeenInRuntime) return true;

  try {
    return window.sessionStorage.getItem(HOME_INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberHomeIntroSeen() {
  homeIntroSeenInRuntime = true;

  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(HOME_INTRO_SESSION_KEY, "true");
  } catch {
    /* Ignore browsers that block session storage. */
  }
}

function getIntroVariantFromUrl(): IntroVariantId {
  if (typeof window === "undefined") return DEFAULT_INTRO_VARIANT;
  const requested = new URLSearchParams(window.location.search).get("intro");
  return INTRO_VARIANTS.some((variant) => variant.id === requested)
    ? (requested as IntroVariantId)
    : DEFAULT_INTRO_VARIANT;
}

function layoutIntroColumns(
  panels: HTMLElement[],
  count: number,
  vars: gsap.TweenVars = {},
) {
  panels.slice(0, count).forEach((panel, index) => {
    gsap.set(panel, {
      autoAlpha: 1,
      top: 0,
      left: `${(index * 100) / count}%`,
      width: `${100 / count + 0.08}%`,
      height: "100%",
      backgroundColor: "#0b0b0d",
      borderRight:
        index === count - 1 ? "0" : "1px solid rgba(255,255,255,0.1)",
      ...vars,
    });
  });
}

function layoutIntroRows(
  panels: HTMLElement[],
  count: number,
  vars: gsap.TweenVars = {},
) {
  panels.slice(0, count).forEach((panel, index) => {
    gsap.set(panel, {
      autoAlpha: 1,
      top: `${(index * 100) / count}%`,
      left: 0,
      width: "100%",
      height: `${100 / count + 0.08}%`,
      backgroundColor: "#0b0b0d",
      borderBottom:
        index === count - 1 ? "0" : "1px solid rgba(255,255,255,0.1)",
      ...vars,
    });
  });
}

function layoutIntroTiles(
  tiles: HTMLElement[],
  columns = 8,
  rows = 6,
  vars: gsap.TweenVars = {},
) {
  tiles.slice(0, columns * rows).forEach((tile, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    gsap.set(tile, {
      autoAlpha: 1,
      top: `${(row * 100) / rows}%`,
      left: `${(col * 100) / columns}%`,
      width: `${100 / columns + 0.08}%`,
      height: `${100 / rows + 0.08}%`,
      backgroundColor: "#0b0b0d",
      borderRight: "1px solid rgba(255,255,255,0.08)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      ...vars,
    });
  });
}

function layoutIntroGlyphs(
  glyphs: HTMLElement[],
  columns = 8,
  rows = 5,
  vars: gsap.TweenVars = {},
) {
  glyphs.slice(0, columns * rows).forEach((glyph, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    glyph.textContent = INTRO_ASCII[index % INTRO_ASCII.length];
    gsap.set(glyph, {
      autoAlpha: 1,
      top: `${8 + (row * 84) / rows}%`,
      left: `${3 + (col * 94) / columns}%`,
      width: `${88 / columns}%`,
      height: `${60 / rows}%`,
      color: "rgba(181,228,248,0.78)",
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "clamp(10px,1vw,18px)",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textAlign: "center",
      textShadow: "0 0 18px rgba(95,182,218,0.55)",
      ...vars,
    });
  });
}

function layoutIntroWisps(wisps: HTMLElement[]) {
  wisps.forEach((wisp, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    gsap.set(wisp, {
      autoAlpha: 1,
      top: `${row * 18 - 12}%`,
      left: `${col * 27 - 12}%`,
      width: `${42 + ((index * 7) % 18)}vw`,
      height: `${34 + ((index * 11) % 16)}vh`,
      background:
        "radial-gradient(circle at 50% 50%, rgba(95,182,218,0.42), rgba(95,182,218,0.16) 38%, rgba(4,19,30,0) 72%)",
      filter: "blur(34px)",
      opacity: 0.76,
    });
  });
}

function layoutIntroRings(rings: HTMLElement[]) {
  rings.forEach((ring, index) => {
    const size = 22 + index * 17;
    gsap.set(ring, {
      autoAlpha: 1,
      top: `${50 - size / 2}%`,
      left: `${50 - size / 2}%`,
      width: `${size}%`,
      height: `${size}%`,
      border: "1px solid rgba(95,182,218,0.34)",
      borderRadius: "9999px",
      boxShadow: "0 0 34px rgba(95,182,218,0.14)",
      opacity: 0.75,
    });
  });
}

function playIntroVariant(
  root: HTMLDivElement,
  variant: IntroVariantId,
  onComplete: () => void,
) {
  const panels = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-intro-panel]"),
  );
  const tiles = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-intro-tile]"),
  );
  const glyphs = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-intro-glyph]"),
  );
  const wisps = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-intro-wisp]"),
  );
  const rings = gsap.utils.toArray<HTMLElement>(
    root.querySelectorAll("[data-intro-ring]"),
  );
  const mark = root.querySelector<HTMLElement>("[data-intro-mark]");
  const allPieces = [
    ...panels,
    ...tiles,
    ...glyphs,
    ...wisps,
    ...rings,
    mark,
  ].filter(Boolean);

  gsap.killTweensOf([root, ...allPieces]);
  root.style.display = "block";
  gsap.set(root, {
    autoAlpha: 1,
    clearProps: "clipPath,transform,backgroundImage,backgroundSize",
    backgroundColor: "transparent",
  });
  gsap.set(allPieces, { clearProps: "all" });
  gsap.set([...panels, ...tiles, ...glyphs, ...wisps, ...rings], {
    autoAlpha: 0,
  });
  if (mark) {
    mark.textContent = "All Together";
    gsap.set(mark, {
      autoAlpha: 0,
      scale: 0.96,
      color: "#ff4400",
      textShadow: "0 0 34px rgba(255,68,0,0.32)",
    });
  }

  const finish = () => {
    gsap.set(root, { autoAlpha: 0 });
    onComplete();
  };
  const timers: number[] = [];
  const intervals: number[] = [];
  let finishMs = 0;
  const offscreenY = `${Math.ceil(window.innerHeight * 1.08)}px`;
  const offscreenX = `${Math.ceil(window.innerWidth * 1.08)}px`;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const techTexture = {
    backgroundColor: "#07090d",
    backgroundImage:
      "linear-gradient(rgba(95,182,218,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(95,182,218,0.12) 1px, transparent 1px)",
    backgroundSize: "52px 52px",
  };
  type NumericAnimation = {
    end: number;
    property: string;
    start: number;
    unit: string;
  };
  const animations: {
    delay: number;
    duration: number;
    element: HTMLElement;
    nonNumeric?: [string, string][];
    numeric?: NumericAnimation[];
    started?: boolean;
    styles: Record<string, string>;
  }[] = [];
  const transitionTo = (
    element: HTMLElement | undefined | null,
    styles: Record<string, string>,
    duration: number,
    delay = 0,
  ) => {
    if (!element) return;
    element.style.transition = "none";
    animations.push({ delay, duration, element, styles });
    finishMs = Math.max(finishMs, delay + duration);
  };
  const startAnimations = () => {
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      let done = true;
      animations.forEach((animation) => {
        if (elapsed < animation.delay) {
          done = false;
          return;
        }
        if (!animation.started) {
          const computed = getComputedStyle(animation.element);
          animation.numeric = Object.entries(animation.styles)
            .map(([property, value]) => {
              if (
                !["top", "right", "bottom", "left", "height", "width", "opacity"].includes(
                  property,
                )
              ) {
                return null;
              }
              const start =
                property === "opacity"
                  ? Number.parseFloat(computed.opacity) || 0
                  : Number.parseFloat(computed.getPropertyValue(property)) || 0;
              return {
                property,
                start,
                end: Number.parseFloat(value),
                unit: property === "opacity" ? "" : "px",
              };
            })
            .filter((item): item is NumericAnimation => Boolean(item));
          animation.nonNumeric = Object.entries(animation.styles).filter(
            ([property]) =>
              !["top", "right", "bottom", "left", "height", "width", "opacity"].includes(
                property,
              ),
          );
          animation.nonNumeric.forEach(([property, value]) => {
            const cssProperty = property.replace(
              /[A-Z]/g,
              (letter) => `-${letter.toLowerCase()}`,
            );
            animation.element.style.setProperty(cssProperty, value);
          });
          animation.started = true;
        }
        const progress = Math.min(1, (elapsed - animation.delay) / animation.duration);
        const eased = easeOut(progress);
        animation.numeric?.forEach(({ property, start, end, unit }) => {
          const next = start + (end - start) * eased;
          animation.element.style.setProperty(property, `${next}${unit}`);
        });
        if (progress < 1) {
          done = false;
        } else {
          animation.numeric?.forEach(({ property, end, unit }) => {
            animation.element.style.setProperty(property, `${end}${unit}`);
          });
        }
      });
      if (done) window.clearInterval(interval);
    }, 16);
    intervals.push(interval);
  };
  const animateClipCircle = (
    element: HTMLElement,
    from: number,
    to: number,
    duration: number,
    delay = 0,
  ) => {
    timers.push(
      window.setTimeout(() => {
        const startedAt = performance.now();
        const interval = window.setInterval(() => {
          const progress = Math.min(
            1,
            (performance.now() - startedAt) / duration,
          );
          const eased = easeOut(progress);
          const radius = from + (to - from) * eased;
          element.style.clipPath = `circle(${radius}% at 50% 50%)`;
          if (progress >= 1) window.clearInterval(interval);
        }, 16);
        intervals.push(interval);
      }, delay),
    );
    finishMs = Math.max(finishMs, delay + duration);
  };
  const animateClipInset = (
    element: HTMLElement,
    from: [number, number, number, number],
    to: [number, number, number, number],
    duration: number,
    delay = 0,
  ) => {
    timers.push(
      window.setTimeout(() => {
        const startedAt = performance.now();
        const interval = window.setInterval(() => {
          const progress = Math.min(
            1,
            (performance.now() - startedAt) / duration,
          );
          const eased = easeOut(progress);
          const inset = from.map((value, index) => value + (to[index] - value) * eased);
          element.style.clipPath = `inset(${inset
            .map((value) => `${value}%`)
            .join(" ")})`;
          if (progress >= 1) window.clearInterval(interval);
        }, 16);
        intervals.push(interval);
      }, delay),
    );
    finishMs = Math.max(finishMs, delay + duration);
  };
  const finishAfter = (delay = 100) => {
    timers.push(window.setTimeout(finish, finishMs + delay));
  };

  switch (variant) {
    case "blue-smoke":
      layoutIntroColumns(panels, 1, { backgroundColor: "#02070c" });
      layoutIntroWisps(wisps);
      wisps.forEach((wisp, index) => {
        transitionTo(
          wisp,
          {
            left: `${(index % 4) * window.innerWidth * 0.19}px`,
            top: `${((index % 3) - 1) * window.innerHeight * 0.16}px`,
            width: `${window.innerWidth * 0.42}px`,
            height: `${window.innerHeight * 0.42}px`,
            opacity: "0",
          },
          1900,
          index * 58,
        );
      });
      transitionTo(panels[0], { opacity: "0" }, 1050, 1180);
      break;

    case "terminal-rain":
      layoutIntroColumns(panels, 1, techTexture);
      layoutIntroGlyphs(glyphs, 6, 8, {
        color: "rgba(183,237,255,0.72)",
        textShadow: "0 0 20px rgba(95,182,218,0.7)",
      });
      glyphs.slice(0, 48).forEach((glyph, index) => {
        glyph.textContent =
          INTRO_ASCII[(index * 5) % INTRO_ASCII.length].slice(0, 6);
        transitionTo(
          glyph,
          { top: `${window.innerHeight}px`, opacity: "0" },
          960,
          (index % 6) * 44 + Math.floor(index / 6) * 18,
        );
      });
      transitionTo(panels[0], { opacity: "0" }, 280, 1120);
      break;

    case "satellite-scan":
      layoutIntroRows(panels, 5, techTexture);
      panels.slice(0, 5).forEach((panel, index) => {
        transitionTo(
          panel,
          { left: index % 2 === 0 ? `-${offscreenX}` : `${window.innerWidth}px` },
          1040,
          index * 92,
        );
      });
      layoutIntroGlyphs(glyphs, 5, 3, { color: "rgba(255,255,255,0.6)" });
      glyphs.slice(0, 15).forEach((glyph, index) => {
        glyph.textContent = `SAT-${index.toString().padStart(2, "0")}`;
        transitionTo(glyph, { opacity: "0" }, 460, 420 + index * 36);
      });
      break;

    case "quantum-grid":
      layoutIntroTiles(tiles, 8, 6, {
        backgroundColor: "#03080d",
        borderBottom: "1px solid rgba(95,182,218,0.12)",
        borderRight: "1px solid rgba(95,182,218,0.12)",
      });
      tiles.slice(0, 48).forEach((tile, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        transitionTo(
          tile,
          {
            left: `${window.innerWidth / 2}px`,
            top: `${window.innerHeight / 2}px`,
            width: "0px",
            height: "0px",
            opacity: "0",
          },
          940,
          (Math.abs(col - 3.5) + Math.abs(row - 2.5)) * 45,
        );
      });
      break;

    case "orbit-iris":
      gsap.set(root, {
        backgroundColor: "#04070c",
        clipPath: "circle(155% at 50% 50%)",
      });
      layoutIntroRings(rings);
      rings.forEach((ring, index) => {
        transitionTo(
          ring,
          {
            top: `${50 - (40 + index * 19) / 2}%`,
            left: `${50 - (40 + index * 19) / 2}%`,
            width: `${40 + index * 19}%`,
            height: `${40 + index * 19}%`,
            opacity: "0",
          },
          880,
          index * 85,
        );
      });
      animateClipCircle(root, 155, 0, 1240);
      transitionTo(root, { opacity: "0" }, 260, 1240);
      break;

    case "signal-bloom":
      layoutIntroRows(panels, 7, techTexture);
      layoutIntroWisps(wisps);
      wisps.slice(0, 6).forEach((wisp, index) => {
        transitionTo(wisp, { opacity: "0" }, 780, index * 68);
      });
      panels.slice(0, 7).forEach((panel, index) => {
        transitionTo(
          panel,
          { height: "0px", opacity: "0.2" },
          940,
          Math.abs(index - 3) * 70,
        );
      });
      break;

    case "star-map":
      layoutIntroColumns(panels, 1, { backgroundColor: "#01040a" });
      layoutIntroGlyphs(glyphs, 8, 6, {
        color: "rgba(205,241,255,0.9)",
        fontSize: "clamp(16px,1.8vw,28px)",
      });
      glyphs.slice(0, 48).forEach((glyph, index) => {
        glyph.textContent = [".", "+", "*", "·"][index % 4];
        transitionTo(
          glyph,
          {
            left: `${((index % 8) - 3.5) * window.innerWidth * 0.18}px`,
            top: `${(Math.floor(index / 8) - 2.5) * window.innerHeight * 0.24}px`,
            opacity: "0",
          },
          1120,
          ((index * 13) % 19) * 28,
        );
      });
      transitionTo(panels[0], { opacity: "0" }, 420, 940);
      break;

    case "drone-swarm":
      layoutIntroTiles(tiles, 12, 4, {
        backgroundColor: "rgba(4,14,22,0.96)",
        borderBottom: "1px solid rgba(95,182,218,0.1)",
        borderRight: "1px solid rgba(95,182,218,0.1)",
      });
      tiles.slice(0, 48).forEach((tile, index) => {
        const col = index % 12;
        const row = Math.floor(index / 12);
        transitionTo(
          tile,
          {
            left: `${(col - 5.5) * window.innerWidth * 0.24}px`,
            top: `${(row - 1.5) * window.innerHeight * 0.48}px`,
            width: "6px",
            height: "6px",
            opacity: "0",
          },
          920,
          ((index * 7) % 23) * 25,
        );
      });
      break;

    case "blueprint-fold":
      layoutIntroRows(panels, 8, techTexture);
      panels.slice(0, 8).forEach((panel, index) => {
        transitionTo(
          panel,
          {
            left: index % 2 === 0 ? `-${offscreenX}` : `${window.innerWidth}px`,
            opacity: "0.65",
          },
          1080,
          index * 52,
        );
      });
      break;

    case "magnetic-field":
      layoutIntroColumns(panels, 10, {
        backgroundColor: "#03070d",
        borderRight: "1px solid rgba(95,182,218,0.14)",
      });
      panels.slice(0, 10).forEach((panel, index) => {
        transitionTo(
          panel,
          { top: index % 2 === 0 ? `-${offscreenY}` : `${window.innerHeight}px` },
          1020,
          Math.abs(index - 4.5) * 44,
        );
      });
      break;

    case "lidar-sweep":
      layoutIntroTiles(tiles, 8, 6, {
        backgroundColor: "#02090e",
        borderBottom: "1px solid rgba(95,182,218,0.18)",
        borderRight: "1px solid rgba(95,182,218,0.18)",
      });
      tiles.slice(0, 48).forEach((tile, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        transitionTo(
          tile,
          { height: "0px", opacity: "0" },
          700,
          Math.hypot(col, row) * 78,
        );
      });
      break;

    case "launch-bay":
      layoutIntroColumns(panels, 4, {
        backgroundColor: "#05070b",
        borderRight: "1px solid rgba(255,255,255,0.12)",
      });
      transitionTo(panels[0], { left: `-${offscreenX}` }, 1150, 80);
      transitionTo(panels[3], { left: `${window.innerWidth}px` }, 1150, 80);
      transitionTo(panels[1], { top: `-${offscreenY}` }, 1120, 180);
      transitionTo(panels[2], { top: `${window.innerHeight}px` }, 1120, 180);
      break;

    case "ion-curtain":
      layoutIntroColumns(panels, 12, {
        backgroundColor: "#030b12",
        borderRight: "1px solid rgba(95,182,218,0.16)",
      });
      panels.slice(0, 12).forEach((panel, index) => {
        transitionTo(
          panel,
          { height: "0px", opacity: "0.15" },
          860,
          ((index * 5) % 12) * 44,
        );
      });
      break;

    case "encrypted-wipe":
      layoutIntroColumns(panels, 1, techTexture);
      layoutIntroGlyphs(glyphs, 8, 6, {
        color: "rgba(180,230,245,0.75)",
        fontSize: "clamp(9px,0.9vw,15px)",
      });
      glyphs.slice(0, 48).forEach((glyph, index) => {
        glyph.textContent = `${INTRO_ASCII[index % INTRO_ASCII.length]}_${(
          index * 73
        )
          .toString(16)
          .toUpperCase()}`;
        transitionTo(glyph, { opacity: "0" }, 420, ((index * 31) % 24) * 28);
      });
      transitionTo(panels[0], { top: `-${offscreenY}` }, 1060, 460);
      break;

    case "plasma-rift":
      layoutIntroColumns(panels, 2, {
        backgroundColor: "#02060a",
        borderRight: "1px solid rgba(95,182,218,0.2)",
      });
      layoutIntroWisps(wisps);
      wisps.slice(0, 8).forEach((wisp, index) => {
        transitionTo(
          wisp,
          { width: `${window.innerWidth * 0.7}px`, opacity: "0" },
          960,
          index * 52,
        );
      });
      transitionTo(panels[0], { left: `-${offscreenX}` }, 1120, 130);
      transitionTo(panels[1], { left: `${window.innerWidth}px` }, 1120, 130);
      break;

    case "stealth-cloak":
      gsap.set(root, {
        backgroundColor: "#020406",
        clipPath: "inset(0% 0% 0% 0%)",
      });
      layoutIntroGlyphs(glyphs, 6, 4, {
        color: "rgba(255,255,255,0.42)",
      });
      glyphs.slice(0, 24).forEach((glyph, index) => {
        glyph.textContent = "STEALTH";
        transitionTo(glyph, { opacity: "0" }, 360, index * 22);
      });
      animateClipInset(root, [0, 0, 0, 0], [0, 50, 0, 50], 1120, 120);
      transitionTo(root, { opacity: "0" }, 260, 1240);
      break;

    case "command-line":
      layoutIntroColumns(panels, 1, techTexture);
      if (mark) {
        mark.textContent = "ALL_TOGETHER.EXE";
        gsap.set(mark, {
          autoAlpha: 1,
          color: "rgba(219,244,255,0.92)",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: "clamp(32px,6vw,96px)",
          letterSpacing: "0.02em",
          textShadow: "0 0 26px rgba(95,182,218,0.5)",
        });
      }
      transitionTo(mark, { opacity: "0" }, 430, 720);
      transitionTo(panels[0], { top: `-${offscreenY}` }, 980, 520);
      break;

    case "constellation-shatter":
      layoutIntroColumns(panels, 1, { backgroundColor: "#010409" });
      layoutIntroGlyphs(glyphs, 8, 6, {
        color: "rgba(215,244,255,0.92)",
        fontSize: "clamp(18px,1.7vw,30px)",
      });
      glyphs.slice(0, 48).forEach((glyph, index) => {
        glyph.textContent = index % 5 === 0 ? "+" : "·";
        transitionTo(
          glyph,
          {
            left: `${((index % 8) - 3.5) * window.innerWidth * 0.22}px`,
            top: `${(Math.floor(index / 8) - 2.5) * window.innerHeight * 0.28}px`,
            opacity: "0",
          },
          1020,
          ((index * 17) % 21) * 28,
        );
      });
      transitionTo(panels[0], { opacity: "0" }, 360, 980);
      break;

    case "frontier-sunrise":
      layoutIntroRows(panels, 7, {
        backgroundColor: "#05070b",
        backgroundImage:
          "linear-gradient(180deg, rgba(95,182,218,0.18), rgba(255,68,0,0.12))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      });
      panels.slice(0, 7).forEach((panel, index) => {
        transitionTo(
          panel,
          { top: `-${offscreenY}`, opacity: "0.2" },
          1020,
          (6 - index) * 70,
        );
      });
      break;

    case "ascii-boot":
    default:
      layoutIntroColumns(panels, 1, techTexture);
      layoutIntroGlyphs(glyphs, 8, 5);
      glyphs.slice(0, 40).forEach((glyph, index) => {
        transitionTo(
          glyph,
          { top: `-${offscreenY}`, opacity: "0" },
          950,
          ((index * 11) % 20) * 32,
        );
      });
      transitionTo(panels[0], { opacity: "0" }, 380, 1040);
      break;
  }

  startAnimations();
  finishAfter();
  return {
    kill() {
      timers.forEach((timer) => window.clearTimeout(timer));
      intervals.forEach((interval) => window.clearInterval(interval));
      [...panels, ...tiles, ...glyphs, ...wisps, ...rings, mark].forEach((piece) => {
        if (piece) piece.style.transition = "none";
      });
    },
  };
}

function Chevron({ dir, className }: { dir: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-[22px]", className)}
    >
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

// ── Full-bleed native background video ──────────────────────
// Native video keeps the hero free of third-party iframe chrome, including the
// center play/pause overlay YouTube can paint inside its own frame.
function HeroVideoPlayer({
  sources,
  startAt = 0,
  muted,
  visible,
  onEnded,
  onRevealChange,
}: {
  sources: readonly HeroVideoSource[];
  startAt?: number;
  muted: boolean;
  visible: boolean;
  onEnded: () => void;
  onRevealChange?: (revealed: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<number | undefined>(undefined);
  const doneRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const reveal = visible && playing;
  const sourceKey = sources.map((source) => source.src).join("|");
  const seekToStart = useCallback((video: HTMLVideoElement) => {
    if (Math.abs(video.currentTime - startAt) < 0.15) return;
    try {
      video.currentTime = startAt;
    } catch {
      /* Safari may reject seeks before metadata is loaded; loadedmetadata retries. */
    }
  }, [startAt]);

  useEffect(() => {
    onRevealChange?.(reveal);
  }, [reveal, onRevealChange]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPlaying(false);
    onEnded();
  }, [onEnded]);

  const fadeVolumeTo = useCallback((target: number, ms = 400) => {
    const video = videoRef.current;
    if (!video) return;
    window.clearInterval(fadeRef.current);
    const start = video.volume;
    const steps = Math.max(1, Math.round(ms / 25));
    let i = 0;
    if (target > 0) video.muted = false;
    fadeRef.current = window.setInterval(() => {
      i += 1;
      const next = start + (target - start) * (i / steps);
      video.volume = Math.min(1, Math.max(0, next));
      if (i >= steps) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = undefined;
        video.volume = target;
        if (target === 0) video.muted = true;
      }
    }, 25);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    window.clearInterval(fadeRef.current);
    doneRef.current = false;
    setPlaying(false);

    if (!visible) {
      video.pause();
      seekToStart(video);
      video.volume = 0;
      video.muted = true;
      onRevealChange?.(false);
      return;
    }

    video.load();
    seekToStart(video);
    video.volume = 0;
    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        video.muted = true;
        video.volume = 0;
        video.play().catch(finish);
      });
    }

    return () => {
      window.clearInterval(fadeRef.current);
      video.pause();
    };
  }, [finish, onRevealChange, seekToStart, sourceKey, visible]);

  useEffect(() => {
    if (!visible || !playing) return;
    fadeVolumeTo(muted ? 0 : 1, muted ? 250 : 700);
  }, [fadeVolumeTo, muted, playing, visible]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] bg-black",
        reveal ? "opacity-100" : "opacity-0",
        (reveal || !visible) && "transition-opacity duration-700 ease-in-out",
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        playsInline
        preload={visible ? "auto" : "metadata"}
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) seekToStart(video);
        }}
        onPlaying={() => setPlaying(true)}
        onCanPlay={() => {
          const video = videoRef.current;
          if (!video) return;
          if (visible) seekToStart(video);
          if (visible && !video.paused) setPlaying(true);
        }}
        onPause={() => {
          const video = videoRef.current;
          if (!visible || !video || video.ended) return;
          video.play().catch(() => undefined);
        }}
        onEnded={finish}
        onError={finish}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
      {/* Brand-blue tint over the video — keyed to the logo's background blue
          (#025C80), lightened and low-opacity so it tints the footage without
          making it feel darker. Fades in/out with the reveal via the parent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "#5fb6da", opacity: 0.18 }}
      />
    </div>
  );
}

export function Hero() {
  const [skipIntroOnMount] = useState(hasSeenHomeIntroThisSession);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"image" | "video" | "fade">("image");
  const [muted, setMuted] = useState(true);
  // Brief "sound lives here" highlight on the audio button — pulsed on each
  // video start while still muted (see the flash effect below).
  const [flash, setFlash] = useState(false);
  const [introComplete, setIntroComplete] = useState(skipIntroOnMount);
  // Whether the native video has visually revealed (faded in) for the current
  // slide — keeps atmosphere layers on screen until the video actually appears,
  // not just when the phase flips internally.
  const [revealed, setRevealed] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Intro unveil: one of the selectable cinematic reveal variants. The default
  // is the blue-smoke reveal, and the hero image timer waits until this clears.
  useEffect(() => {
    const el = curtainRef.current;
    if (!el) return;
    if (skipIntroOnMount) {
      el.style.display = "none";
      return;
    }

    const hide = () => {
      if (curtainRef.current) curtainRef.current.style.display = "none";
      setIntroComplete(true);
    };
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      rememberHomeIntroSeen();
      hide();
      return;
    }
    rememberHomeIntroSeen();
    const variant = getIntroVariantFromUrl();
    const tween = playIntroVariant(el, variant, hide);
    const fallback = window.setTimeout(hide, 4200); // never leave it covering
    return () => {
      tween.kill();
      window.clearTimeout(fallback);
    };
  }, [skipIntroOnMount]);

  // Headline reveal: a masked character-rise at >=768px (where the headline is
  // whitespace-normal and SplitText behaves), and a simple, reliable fade-rise on
  // mobile (SplitText + the responsive nowrap headline can leave chars hidden).
  // A safety timer guarantees the headline is never left invisible.
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;
    let safety: number | undefined;
    const show = () => gsap.set(el, { autoAlpha: 1 });
    if (skipIntroOnMount) {
      show();
      return;
    }

    const fallback = window.setTimeout(show, 2500); // never leave it hidden
    const run = () => {
      window.clearTimeout(fallback);
      const fancy = window.matchMedia("(min-width: 768px)").matches;
      try {
        if (fancy) {
          split = SplitText.create(el, { type: "lines,chars", mask: "lines" });
          show();
          tween = gsap.from(split.chars, {
            yPercent: 115,
            opacity: 0,
            stagger: 0.02,
            duration: 0.9,
            ease: "power4.out",
            delay: 0.5, // start as the intro curtain clears the headline
            onComplete: () => split?.revert(), // restore normal, responsive markup
          });
          // Never leave the headline hidden if the tween can't finish.
          safety = window.setTimeout(() => {
            try {
              split?.revert();
            } catch {
              /* ignore */
            }
            show();
          }, 3200);
        } else {
          // Mobile: just reveal it (the intro curtain provides the entrance).
          // A per-element gsap.from can strand the headline at its hidden "from"
          // state here, so keep it bulletproof.
          show();
        }
      } catch {
        show();
      }
    };
    const ready =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();
    ready.then(run);
    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(safety);
      tween?.kill();
      split?.revert();
    };
  }, [skipIntroOnMount]);

  const slide = SLIDES[active];
  // Atmosphere layers stay on screen while the image is visible and fade once
  // the native video has actually revealed.
  const showDecor = phase === "image" || (phase === "video" && !revealed);
  // During the end "fade", show the NEXT company's image underneath the video
  // (which is fading out), so it crossfades video -> next image seamlessly.
  const shownImage = phase === "fade" ? (active + 1) % SLIDES.length : active;

  const go = (i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
    setPhase("image");
  };

  // Touch swipe — mobile users flick left/right to advance / go back, like
  // Instagram. Snap-on-release; the actual visual transition is the same
  // horizontal slide that the auto-cycle uses (see the image strip below).
  // Require a clear horizontal motion (>40px and more horizontal than
  // vertical) so vertical scrolling still works.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onSwipeStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };
  const onSwipeEnd = (e: React.TouchEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? active + 1 : active - 1);
    }
  };

  // Per company: image → video → "fade" (crossfade to the NEXT company).
  // The video phase advances on the native ended event, with no wall-clock cap,
  // so full clips play through before the next slide.
  useEffect(() => {
    if (phase === "video") return;
    if (!introComplete && phase === "image") return;
    const id = setTimeout(
      () => {
        if (phase === "image" && slide.heroVideo) {
          setPhase("video");
        } else {
          setActive((i) => (i + 1) % SLIDES.length);
          setPhase("image");
        }
      },
      phase === "image" ? IMAGE_HOLD_MS : FADE_MS,
    );
    return () => clearTimeout(id);
  }, [phase, active, introComplete, slide.heroVideo]);

  const handleVideoEnd = useCallback(() => setPhase("fade"), []);

  // Each time a company's video begins while the hero is still muted, briefly
  // flash the audio button orange — a quick "sound is available here" nudge.
  // It only fires while muted, so it stops nagging the moment the user unmutes.
  useEffect(() => {
    if (phase !== "video" || !muted) return;
    const show = window.setTimeout(() => setFlash(true), 0);
    const hide = window.setTimeout(() => setFlash(false), 1500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [phase, muted]);

  // Audio toggle — small and glassy, tucked beside the thesis lockup.
  const renderMute = (extra: string) => (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Unmute video" : "Mute video"}
      className={cn(
        "pointer-events-auto inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white/85 backdrop-blur-sm [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.55))] transition-colors duration-200 hover:border-[#ff4400]/70 hover:bg-black/45 hover:text-[#ff4400]",
        flash && "unmute-flash",
        extra,
      )}
    >
      {muted ? (
        <SoundOffIcon className="size-6" />
      ) : (
        <SoundOnIcon className="size-6" />
      )}
    </button>
  );

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black text-white"
      onTouchStart={onSwipeStart}
      onTouchEnd={onSwipeEnd}
    >
      {/* Intro unveil curtain — selectable cinematic reveals for local testing.
          Removed once the animation ends so it never blocks the page. */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        suppressHydrationWarning
        className="intro-curtain pointer-events-none fixed inset-0 z-[200] overflow-hidden bg-[#0b0b0d]"
        style={skipIntroOnMount ? { display: "none" } : undefined}
      >
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`intro-panel-${index}`}
              data-intro-panel=""
              className="absolute bg-[#0b0b0d]"
            />
          ))}
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 48 }).map((_, index) => (
            <div
              key={`intro-tile-${index}`}
              data-intro-tile=""
              className="absolute bg-[#0b0b0d]"
            />
          ))}
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 48 }).map((_, index) => (
            <div
              key={`intro-glyph-${index}`}
              data-intro-glyph=""
              className="absolute"
            />
          ))}
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`intro-wisp-${index}`}
              data-intro-wisp=""
              className="absolute rounded-full"
            />
          ))}
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`intro-ring-${index}`}
              data-intro-ring=""
              className="absolute"
            />
          ))}
        </div>
        <div
          data-intro-mark=""
          className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-[clamp(56px,12vw,180px)] font-[900] leading-none tracking-[-0.06em] text-[#ff4400]"
        >
          All Together
        </div>
      </div>
      <noscript>
        <style>{`.intro-curtain{display:none!important}`}</style>
      </noscript>

      {/* Cycling background photos — horizontal strip. The whole strip
          translates by `shownImage * 100%` so every transition reads as a
          smooth horizontal slide (Instagram-style) on auto-cycle AND on
          mobile swipe. */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <div
          className="flex h-full w-full transition-transform duration-[450ms] ease-out"
          style={{ transform: `translateX(-${shownImage * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div key={s.img} className="relative h-full w-full shrink-0">
              <Image
                src={s.img}
                alt=""
                fill
                priority={i === 0}
                quality={90}
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full-bleed video — starts after the two-second image hold and advances
          only when the full native file ends. */}
      {slide.heroVideo && (
        <HeroVideoPlayer
          key={slide.name}
          sources={slide.heroVideo}
          startAt={slide.heroVideoStart}
          muted={muted}
          visible={phase === "video"}
          onEnded={handleVideoEnd}
          onRevealChange={setRevealed}
        />
      )}

      {/* Per-slide drifting smoke — hidden while the video plays */}
      {SLIDES.map((s, i) => (
        <div
          key={`${s.img}-smoke`}
          aria-hidden="true"
          className={cn(
            "hero-smoke absolute inset-0 z-[1] transition-opacity duration-[700ms] ease-in-out",
            i % 2 === 0 ? "hero-smoke--a" : "hero-smoke--b",
          )}
          style={{ opacity: showDecor && i === active ? 1 : 0 }}
        />
      ))}

      {/* Animated light rays — hidden while the video plays */}
      <div
        className="light-rays pointer-events-none absolute inset-0 z-[1] transition-opacity duration-700"
        style={{ opacity: showDecor ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* (Top scrim removed per request — the headline, nav, and thesis note
          rely on their own text-shadows for legibility over bright slides.) */}

      {/* HERO CONTENT (flows on mobile, absolute on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="h-full">
          {/* Headline */}
          <div className="hero-headline-wrap absolute top-[clamp(116px,14svh,152px)] right-6 left-6 max-w-[560px] md:top-[clamp(122px,12svh,160px)] md:right-auto md:left-[var(--site-frame-x)] md:max-w-[640px] lg:top-[175px] lg:left-[var(--hero-frame-x)]">
            <h1
              ref={headlineRef}
              className="hero-headline whitespace-nowrap text-[clamp(19px,5.8vw,34px)] font-medium leading-[1.18] tracking-normal text-white opacity-0 [text-shadow:0_1px_16px_rgba(0,0,0,0.5)] md:whitespace-normal md:text-[38px] md:leading-[1.14]"
            >
              The future is built together.
              <br />
              The future is built now.
            </h1>

            <div className="mt-7 flex w-fit max-w-full items-center gap-2 sm:gap-3 md:mt-8">
              {/* Investment thesis — flag + two-line text lockup, left-aligned
                  under the main headline. */}
              <div className="hero-thesis-wrap inline-flex min-w-0 max-w-[520px] items-center gap-[0.55em] text-[14px] sm:text-[16px] md:text-[17px] lg:text-[16px]">
                {/* US flag — to the left of the text, sized to span the full
                    two-line block so its top/bottom align with the text. */}
                <svg
                  viewBox="0 0 19 10"
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label="United States"
                  className="h-[2em] w-auto shrink-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.5))]"
                >
                  <rect width="19" height="10" fill="#fff" />
                  <g fill="#b22234">
                    <rect width="19" height="0.769" y="0" />
                    <rect width="19" height="0.769" y="1.538" />
                    <rect width="19" height="0.769" y="3.077" />
                    <rect width="19" height="0.769" y="4.615" />
                    <rect width="19" height="0.769" y="6.154" />
                    <rect width="19" height="0.769" y="7.692" />
                    <rect width="19" height="0.769" y="9.231" />
                  </g>
                  <rect width="7.6" height="5.385" fill="#3c3b6e" />
                </svg>
                <p className="[font-family:var(--font-rosart)] font-normal leading-[1.3] tracking-normal text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] lg:leading-[1.16]">
                  Investing in America&rsquo;s companies,
                  <br />
                  resurgence, and future.
                </p>
              </div>
              {renderMute(
                "size-9 shrink-0 border-white/25 bg-black/25 text-white/85 backdrop-blur-md [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.48))] hover:bg-black/40 sm:size-10 md:size-11",
              )}
            </div>
          </div>

          {/* Side slide controls — aligned to the site frame and kept minimal. */}
          <div
            className={cn(
              "absolute inset-y-0 right-4 left-4 z-20 flex items-center justify-between transition-opacity duration-500 md:right-[var(--site-frame-x)] md:left-[var(--site-frame-x)] lg:right-[var(--hero-frame-x)] lg:left-[var(--hero-frame-x)]",
              phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100",
            )}
          >
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className="pointer-events-auto flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/[0.18] text-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-colors duration-200 hover:border-[#ff4400]/70 hover:bg-black/[0.32] hover:text-[#ff4400] md:size-[52px]"
            >
              <Chevron dir="left" className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className="pointer-events-auto flex size-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/[0.18] text-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-colors duration-200 hover:border-[#ff4400]/70 hover:bg-black/[0.32] hover:text-[#ff4400] md:size-[52px]"
            >
              <Chevron dir="right" className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Giant wordmark + Capital lockup */}
      <div className="hero-brand-lockup pointer-events-none absolute inset-x-[var(--site-frame-x)] z-[8] mx-auto flex max-w-[1920px] justify-center [container-type:inline-size] max-md:inset-x-3">
        <div className="hero-brand-lockup-inner flex w-fit max-w-full flex-col items-end">
          <div className="hero-wordmark whitespace-nowrap text-center font-[900] text-[#ff4400]">
            All Together
          </div>
          <div className="hero-brand-capital leading-none">
            <span className="font-mono font-semibold uppercase text-white">
              Capital
            </span>
            <span className="ml-[0.35em] align-super text-[0.6em] font-semibold text-white/75">
              ®
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
