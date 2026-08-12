"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FOUNDERS } from "@/lib/founders";
import { PORTFOLIO } from "@/lib/portfolio";
import { LEGAL, NAV } from "@/lib/site";

const TEAM_IMAGES = [
  "/leadership/webp/robert-team-studio.webp",
  "/leadership/webp/hisham-team-studio.webp",
  "/leadership/webp/neo-team-studio.webp",
];

const STATIC_IMAGES: string[] = [];

const INTERNAL_ROUTES = Array.from(
  new Set([
    "/",
    ...NAV.map((item) => item.href).filter(
      (href) => href.startsWith("/") && href !== "/lp-login",
    ),
    ...LEGAL.map((item) => item.href),
  ]),
);

const COMPANY_IMAGES = PORTFOLIO.flatMap((company) => [
  company.logo,
  company.cardLogo,
  company.image,
  company.cardImage,
]);

const FOUNDER_PAGE_IMAGES = FOUNDERS.flatMap((founder) =>
  founder.headshot
    ? [
        founder.headshot
          .replace("/founders/cutouts/", "/founders/white-webp/")
          .replace(/\.png$/, ".webp"),
      ]
    : [],
);

const FOUNDER_SEARCH_IMAGES = FOUNDERS.flatMap((founder) =>
  founder.headshot
    ? [
        founder.headshot
          .replace("/founders/cutouts/", "/founders/cutouts-webp/")
          .replace(/\.png$/, ".webp"),
      ]
    : [],
);

const IMAGE_ASSETS = Array.from(
  new Set(
    [
      ...STATIC_IMAGES,
      ...TEAM_IMAGES,
      ...FOUNDER_PAGE_IMAGES,
      ...COMPANY_IMAGES,
      ...FOUNDER_SEARCH_IMAGES,
    ].filter((asset): asset is string => Boolean(asset?.startsWith("/"))),
  ),
);

type PriorityElement = {
  fetchPriority?: "high" | "low" | "auto";
};

type IdleHandle = ReturnType<typeof setTimeout> | number;
type CancelFn = () => void;

const IMAGE_BATCH_SIZE = 8;
const IMAGE_BATCH_GAP_MS = 35;
const MEDIA_START_DELAY_MS = 250;
const INTERACTION_QUIET_MS = 900;

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

async function waitForQuiet(cancelled: () => boolean, shouldPause: () => boolean) {
  while (!cancelled() && shouldPause()) {
    await wait(180);
  }
}

function addPrefetch(href: string, as: "document" | "image", type?: string) {
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

async function warmImages(cancelled: () => boolean, shouldPause: () => boolean) {
  IMAGE_ASSETS.forEach((src) => addPrefetch(src, "image"));

  for (let index = 0; index < IMAGE_ASSETS.length && !cancelled(); index += IMAGE_BATCH_SIZE) {
    await waitForQuiet(cancelled, shouldPause);
    if (cancelled()) break;

    const batch = IMAGE_ASSETS.slice(index, index + IMAGE_BATCH_SIZE);
    await Promise.all(batch.map(warmImage));
    await wait(IMAGE_BATCH_GAP_MS);
  }
}

export function SitePreloader() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/lp")) return;
    if (window.__allTogetherPreloadStarted) return;
    window.__allTogetherPreloadStarted = true;

    let cancelled = false;
    const isCancelled = () => cancelled;
    let lastInteractionAt = 0;

    const markInteraction = () => {
      lastInteractionAt = window.performance.now();
    };

    const shouldPauseMediaPreload = () =>
      document.visibilityState !== "visible" ||
      window.performance.now() - lastInteractionAt < INTERACTION_QUIET_MS;

    INTERNAL_ROUTES.forEach((href) => {
      router.prefetch(href);
      addPrefetch(href, "document");
    });

    const interactionEvents = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    interactionEvents.forEach((eventName) =>
      window.addEventListener(eventName, markInteraction, { passive: true }),
    );

    let cancelMediaIdle: CancelFn | null = null;

    const mediaTimer = window.setTimeout(() => {
      if (cancelled) return;
      cancelMediaIdle = scheduleIdle(() => {
        void warmImages(isCancelled, shouldPauseMediaPreload);
      }, 2400);
    }, MEDIA_START_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(mediaTimer);
      cancelMediaIdle?.();
      interactionEvents.forEach((eventName) =>
        window.removeEventListener(eventName, markInteraction),
      );
    };
  }, [pathname, router]);

  return null;
}
