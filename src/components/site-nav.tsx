"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LogoMark } from "@/components/cognition-layout";
import { SiteGrain } from "@/components/site-appearance";
import { MailIcon, UIIcon, XIcon } from "@/components/icons";
import { CONTACT_MAILTO, NAV, X_PROFILE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function isNavItemActive(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  if (href === "/lp" && pathname === "/lp-login") return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const OVERLAY_EVENT = "machine-spirit-overlay-open";

function ContactLinks({ onClick }: { onClick?: () => void }) {
  return (
    <div className="cog-nav-contacts">
      <a
        href={CONTACT_MAILTO}
        className="cog-nav-contact-link"
        aria-label="Email us"
        onClick={onClick}
      >
        <MailIcon animateOnHover />
      </a>
      <a
        href={X_PROFILE_URL}
        className="cog-nav-contact-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Machine Spirit on X"
        onClick={onClick}
      >
        <XIcon animateOnHover />
      </a>
    </div>
  );
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
      <Link
        href={href}
        prefetch={!href.startsWith("/lp")}
        className={className}
        onClick={onClick}
        aria-current={ariaCurrent}
      >
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
  const [menu, setMenu] = useState({ pathname, open: false });
  const open = menu.pathname === pathname && menu.open;
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const openFrameRef = useRef<number | null>(null);
  const restoreFocusRef = useRef(false);

  // Route changes close the menu without a delayed, stale overlay or scroll lock.
  if (menu.pathname !== pathname) setMenu({ pathname, open: false });

  const closeMenu = useCallback((restoreFocus = false) => {
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }
    restoreFocusRef.current = restoreFocus;
    setMenu((current) => ({ ...current, open: false }));
  }, []);

  function toggleMenu() {
    if (open || openFrameRef.current !== null) {
      closeMenu(true);
      return;
    }
    window.dispatchEvent(new CustomEvent(OVERLAY_EVENT, { detail: "menu" }));
    // Let another overlay release its focus and scroll lock before taking ownership.
    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = null;
      restoreFocusRef.current = false;
      setMenu({ pathname, open: true });
    });
  }

  useEffect(() => {
    const onOverlayOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "menu") closeMenu();
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    const onViewportChange = () => {
      if (desktop.matches) closeMenu();
    };
    window.addEventListener(OVERLAY_EVENT, onOverlayOpen);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      window.removeEventListener(OVERLAY_EVENT, onOverlayOpen);
      desktop.removeEventListener("change", onViewportChange);
      if (openFrameRef.current !== null) {
        window.cancelAnimationFrame(openFrameRef.current);
      }
    };
  }, [closeMenu]);

  useEffect(() => {
    const dialog = mobileNavRef.current;
    if (!open || !dialog) return;

    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    const backgroundElements: { element: HTMLElement; inert: boolean }[] = [];
    // This dialog sits inside the page. Disable siblings at every ancestor level,
    // rather than making its own parent (and the menu) inert.
    let branch: HTMLElement = dialog;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of parent.children) {
        if (sibling instanceof HTMLElement && sibling !== branch) {
          backgroundElements.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      if (parent === document.body) break;
      branch = parent;
    }
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      dialog.querySelector<HTMLElement>(".cog-mobile-menu-link")?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      const focusOutside = !dialog.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      if (restoreFocusRef.current && menuButton?.isConnected) menuButton.focus();
      restoreFocusRef.current = false;
    };
  }, [closeMenu, open]);

  return (
    <>
      <aside className="cog-desktop-nav" aria-label="Primary">
        <Link href="/" aria-label="Machine Spirit home" className="cog-nav-logo">
          <LogoMark />
        </Link>

        <nav className="cog-nav-links" aria-label="Primary">
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

        <ContactLinks />
      </aside>

      <div
        ref={mobileNavRef}
        className="cog-mobile-nav"
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? "Site menu" : undefined}
      >
        <header className="cog-mobile-header">
          <Link
            href="/"
            aria-label="Machine Spirit home"
            className="cog-mobile-logo"
            onClick={() => closeMenu()}
          >
            <LogoMark />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={open ? "site-mobile-menu" : undefined}
            aria-haspopup="dialog"
            onClick={toggleMenu}
            className="cog-mobile-menu-button"
          >
            <UIIcon name={open ? "close" : "menu"} />
          </button>
        </header>

        {open && (
          <div id="site-mobile-menu" className="cog-mobile-menu">
            <SiteGrain className="site-grain--surface" />
            <nav className="cog-mobile-menu-links" aria-label="Primary">
              {NAV.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    ariaCurrent={active ? "page" : undefined}
                    onClick={() => closeMenu()}
                    className={cn("cog-mobile-menu-link", active && "is-active")}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
              <ContactLinks onClick={() => closeMenu()} />
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
