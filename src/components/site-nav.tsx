"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/cognition-layout";
import { CONTACT_MAILTO, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

function isNavItemActive(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
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

  return (
    <>
      <aside className="cog-desktop-nav" aria-label="Primary">
        <Link href="/" aria-label="All Together home" className="cog-nav-logo">
          <LogoMark />
        </Link>

        <nav className="cog-nav-links">
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
          <nav className="cog-mobile-menu-links">
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
