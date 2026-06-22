"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { LogoMark } from "@/components/cognition-layout";
import { CONTACT_MAILTO, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

function isNavItemActive(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const TRACKED_NAV_LINK_SELECTOR = "a.cog-nav-link, a.cog-mobile-menu-link";

function getTrackedNavLink(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(TRACKED_NAV_LINK_SELECTOR);
}

function NavLink({
  href,
  className,
  onClick,
  ariaCurrent,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  ariaCurrent?: "page";
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick} aria-current={ariaCurrent}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick} aria-current={ariaCurrent}>
      {children}
    </a>
  );
}

export function SiteNav({ showLogo = false }: { showLogo?: boolean }) {
  void showLogo;

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const desktopNavLinksRef = useRef<HTMLElement>(null);
  const mobileNavLinksRef = useRef<HTMLElement>(null);

  const syncHoverPlate = useCallback((nav: HTMLElement | null, target?: HTMLElement | null) => {
    if (!nav) return;

    const link =
      target ??
      nav.querySelector<HTMLElement>('[aria-current="page"]') ??
      nav.querySelector<HTMLElement>(TRACKED_NAV_LINK_SELECTOR);

    if (!link) {
      nav.dataset.hoverReady = "false";
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    nav.style.setProperty("--nav-hover-left", `${linkRect.left - navRect.left}px`);
    nav.style.setProperty("--nav-hover-top", `${linkRect.top - navRect.top}px`);
    nav.style.setProperty("--nav-hover-width", `${linkRect.width}px`);
    nav.style.setProperty("--nav-hover-height", `${linkRect.height}px`);
    nav.dataset.hoverReady = "true";
  }, []);

  const resetHoverPlate = useCallback(
    (nav: HTMLElement | null) => {
      syncHoverPlate(nav);
    },
    [syncHoverPlate],
  );

  const handleNavPointerOver = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const link = getTrackedNavLink(event.target);
      if (!link || !event.currentTarget.contains(link)) return;
      syncHoverPlate(event.currentTarget, link);
    },
    [syncHoverPlate],
  );

  const handleNavPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      resetHoverPlate(event.currentTarget);
    },
    [resetHoverPlate],
  );

  const handleNavFocus = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const link = getTrackedNavLink(event.target);
      if (!link || !event.currentTarget.contains(link)) return;
      syncHoverPlate(event.currentTarget, link);
    },
    [syncHoverPlate],
  );

  const handleNavBlur = useCallback(
    (event: FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
      resetHoverPlate(event.currentTarget);
    },
    [resetHoverPlate],
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const syncAll = () => {
      syncHoverPlate(desktopNavLinksRef.current);
      syncHoverPlate(mobileNavLinksRef.current);
    };

    syncAll();
    window.addEventListener("resize", syncAll);
    return () => window.removeEventListener("resize", syncAll);
  }, [open, pathname, syncHoverPlate]);

  return (
    <>
      <aside className="cog-desktop-nav" aria-label="Primary">
        <Link href="/" aria-label="All Together home" className="cog-nav-logo">
          <LogoMark />
        </Link>

        <nav
          className="cog-nav-links"
          ref={desktopNavLinksRef}
          onPointerOver={handleNavPointerOver}
          onPointerLeave={handleNavPointerLeave}
          onFocus={handleNavFocus}
          onBlur={handleNavBlur}
        >
          <span className="cog-nav-hover-plate" aria-hidden="true" />
          {NAV.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <NavLink
                key={item.label}
                href={item.href}
                ariaCurrent={active ? "page" : undefined}
                className={cn("cog-nav-link", active && "is-active")}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <NavLink className="cog-nav-button" href={CONTACT_MAILTO}>
          Email
        </NavLink>
      </aside>

      <header className="cog-mobile-header">
        <Link
          href="/"
          aria-label="All Together home"
          className="cog-mobile-logo"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="cog-mobile-menu-button"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      {open && (
        <div className="cog-mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <nav
            className="cog-mobile-menu-links"
            ref={mobileNavLinksRef}
            onPointerOver={handleNavPointerOver}
            onPointerLeave={handleNavPointerLeave}
            onFocus={handleNavFocus}
            onBlur={handleNavBlur}
          >
            <span className="cog-nav-hover-plate" aria-hidden="true" />
            {NAV.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <NavLink
                  key={item.label}
                  href={item.href}
                  ariaCurrent={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn("cog-mobile-menu-link", active && "is-active")}
                >
                  {item.label}
                </NavLink>
              );
            })}
            <NavLink
              href={CONTACT_MAILTO}
              onClick={() => setOpen(false)}
              className="cog-mobile-menu-link"
            >
              Email
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
}
