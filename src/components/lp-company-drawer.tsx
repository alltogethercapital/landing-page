"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Company detail drawer: right-hand panel on desktop, full-screen sheet on
 * phones. Opened by `?company=` so every view is deep-linkable; closing drops
 * the param without scrolling the page underneath.
 */
export function LpCompanyDrawer({
  closeHref,
  labelledBy,
  children,
}: {
  closeHref: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLElement>(null);
  // Portaled to <body> so page transitions and the site header never sit above it.
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.body), []);
  const close = useCallback(() => router.replace(closeHref, { scroll: false }), [router, closeHref]);

  useEffect(() => {
    if (!host) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (document.querySelector(".lp-tip.is-open")) return;
      event.preventDefault();
      close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [close, host]);

  if (!host) return null;
  return createPortal(
    <div className="lp-drawer" role="presentation">
      <Link
        href={closeHref}
        replace
        scroll={false}
        className="lp-drawer-backdrop"
        aria-hidden="true"
        tabIndex={-1}
      />
      <aside
        ref={panelRef}
        className="lp-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <Link href={closeHref} replace scroll={false} className="lp-drawer-close" aria-label="Close">
          <span aria-hidden="true">×</span>
        </Link>
        {children}
      </aside>
    </div>,
    host,
  );
}
