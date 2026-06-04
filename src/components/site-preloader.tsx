"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FOUNDERS } from "@/lib/founders";
import { HERO_VIDEOS } from "@/lib/hero-video-assets";
import { PORTFOLIO } from "@/lib/portfolio";
import { LEGAL, NAV } from "@/lib/site";

const TEAM_IMAGES = [
  "/leadership/robert-team-studio.png",
  "/leadership/hisham-team-studio.png",
  "/leadership/neo-team-studio.png",
];

const STATIC_IMAGES = [
  "/hero-drones.jpg",
  "/hero-robots.jpg",
  "/logo-orange.png",
  "/logo-white.png",
  "/logo-black.png",
];

const INTERNAL_ROUTES = Array.from(
  new Set([
    "/",
    ...NAV.map((item) => item.href).filter((href) => href.startsWith("/")),
    ...LEGAL.map((item) => item.href),
  ]),
);

const IMAGE_ASSETS = Array.from(
  new Set(
    [
      ...STATIC_IMAGES,
      ...TEAM_IMAGES,
      ...PORTFOLIO.flatMap((company) => [
        company.logo,
        company.cardLogo,
        company.image,
        company.cardImage,
      ]),
      ...FOUNDERS.flatMap((founder) =>
        founder.headshot
          ? [
              founder.headshot,
              founder.headshot.replace("/founders/cutouts/", "/founders/white/"),
            ]
          : [],
      ),
    ].filter((asset): asset is string => Boolean(asset?.startsWith("/"))),
  ),
);

const VIDEO_ASSETS = Array.from(
  new Set(Object.values(HERO_VIDEOS).flatMap((sources) => sources.map((source) => source.src))),
);

const PRECONNECT_ORIGINS = [
  "https://www.youtube-nocookie.com",
  "https://www.youtube.com",
  "https://i.ytimg.com",
];

type PriorityElement = {
  fetchPriority?: "high" | "low" | "auto";
};

type IdleHandle = ReturnType<typeof setTimeout> | number;

declare global {
  interface Window {
    __allTogetherPreloadStarted?: boolean;
  }
}

function scheduleIdle(callback: () => void, timeout = 1600): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback?.(handle);
  }

  const handle: IdleHandle = window.setTimeout(callback, Math.min(timeout, 800));
  return () => window.clearTimeout(handle);
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function addPreconnect(origin: string) {
  if (document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;

  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = origin;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

function addPrefetch(href: string, as: "document" | "image" | "video", type?: string) {
  if (document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;

  const link = document.createElement("link") as HTMLLinkElement & PriorityElement;
  link.rel = "prefetch";
  link.href = href;
  link.as = as;
  link.fetchPriority = "low";
  if (type) link.type = type;
  document.head.appendChild(link);
}

function warmImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image() as HTMLImageElement & PriorityElement;
    image.decoding = "async";
    image.fetchPriority = "low";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

async function warmImages(cancelled: () => boolean) {
  const batchSize = 4;

  for (let index = 0; index < IMAGE_ASSETS.length && !cancelled(); index += batchSize) {
    const batch = IMAGE_ASSETS.slice(index, index + batchSize);
    batch.forEach((src) => addPrefetch(src, "image"));
    await Promise.all(batch.map(warmImage));
    await wait(60);
  }
}

export function SitePreloader() {
  const router = useRouter();

  useEffect(() => {
    if (window.__allTogetherPreloadStarted) return;
    window.__allTogetherPreloadStarted = true;

    let cancelled = false;
    const isCancelled = () => cancelled;

    INTERNAL_ROUTES.forEach((href) => {
      router.prefetch(href);
      addPrefetch(href, "document");
    });

    const cancelIdle = scheduleIdle(() => {
      PRECONNECT_ORIGINS.forEach(addPreconnect);
      VIDEO_ASSETS.forEach((src) => addPrefetch(src, "video", "video/mp4"));

      void warmImages(isCancelled);
    });

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [router]);

  return null;
}
