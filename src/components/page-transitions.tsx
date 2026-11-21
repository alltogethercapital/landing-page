"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Quick, direction-aware page transitions on top of the View Transitions API.
 *
 * Same-origin link clicks are routed through document.startViewTransition so the
 * sidebar and logo (named in transitions.css) morph between the public site and the
 * LP portal while the page content slides a few pixels in from the right (deeper)
 * or the left (back toward Home). Browsers without the API, and visitors who prefer
 * reduced motion, get the ordinary instant navigation.
 *
 * The browser holds the old frame only until the new route commits, capped at
 * MAX_HOLD_MS, so a slow server render never blocks navigation behind the animation.
 */
const MAX_HOLD_MS = 300;

type Direction = "forward" | "back" | "same";

function depth(pathname: string) {
  return pathname.split("/").filter(Boolean).length;
}

function directionFor(from: string, to: string): Direction {
  if (to === "/" && from !== "/") return "back";
  const delta = depth(to) - depth(from);
  if (delta > 0) return "forward";
  if (delta < 0) return "back";
  return "same";
}

type StartViewTransition = (
  callback: () => Promise<void> | void,
) => { finished: Promise<void> };

export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const settleRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
    settleRef.current?.();
    settleRef.current = null;
  }, [pathname]);

  useEffect(() => {
    const doc = document as Document & { startViewTransition?: StartViewTransition };
    if (typeof doc.startViewTransition !== "function") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (reducedMotion.matches) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return;
      // Same page (hash or query only): let the app handle it instantly.
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      const from = pathnameRef.current;
      const root = document.documentElement;
      root.dataset.navDirection = directionFor(from, url.pathname);

      const transition = doc.startViewTransition!(
        () =>
          new Promise<void>((resolve) => {
            const timer = window.setTimeout(resolve, MAX_HOLD_MS);
            settleRef.current = () => {
              window.clearTimeout(timer);
              // The new route has committed. (No rAF here: frames are paused during the
              // view-transition update, so waiting on one would stall until the timeout.)
              resolve();
            };
            router.push(url.pathname + url.search + url.hash);
          }),
      );
      transition.finished.finally(() => {
        delete root.dataset.navDirection;
      });
    };

    // Capture phase: run before next/link handles the click in the bubble phase.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
