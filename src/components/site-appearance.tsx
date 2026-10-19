"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { SITE_THEME_STORAGE_KEY } from "@/lib/site-theme";
import { UIIcon } from "@/components/icons";

type SiteTheme = "light" | "dark";
const STORAGE_KEY = SITE_THEME_STORAGE_KEY;
const CHANGE_EVENT = "machine-spirit-theme-change";
let sessionTheme: SiteTheme | null = null;

function getTheme(): SiteTheme {
  const requested = new URLSearchParams(window.location.search).get("theme");
  if (requested === "light" || requested === "dark") return requested;
  if (sessionTheme) return sessionTheme;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Light remains the default when storage is disabled.
  }
  return "light";
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    sessionTheme = null;
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("popstate", onChange);
  };
}

function getServerTheme(): SiteTheme {
  return "light";
}

export function setSiteTheme(nextTheme: SiteTheme) {
  sessionTheme = nextTheme;
  document.documentElement.dataset.siteTheme = nextTheme;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, nextTheme);
  } catch {
    // The selected appearance still works for this browsing session.
  }
  const url = new URL(window.location.href);
  if (url.searchParams.has("theme") || url.searchParams.has("light")) {
    url.searchParams.set("theme", nextTheme);
    window.history.replaceState(window.history.state, "", url);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Shared static plates match the selected kit without a full-screen bitmap. */
export function SiteGrain({ className = "" }: { className?: string }) {
  return (
    <div className={`site-grain ${className}`} data-grain="coarse" aria-hidden="true">
      <span className="site-grain-layer site-grain-layer--coarse" />
      <span className="site-grain-layer site-grain-layer--fine" />
    </div>
  );
}

export function SiteThemeToggle() {
  const pathname = usePathname();
  const isPortalRoute = pathname === "/lp" || pathname.startsWith("/lp/");
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  useEffect(() => {
    const selectedTheme = getTheme();
    sessionTheme = selectedTheme;
    document.documentElement.dataset.siteTheme = selectedTheme;
  }, [pathname, theme]);

  function toggleTheme() {
    setSiteTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button
      type="button"
      className={`site-theme-toggle${isPortalRoute ? " site-theme-toggle--portal" : ""}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
    >
      <UIIcon name={theme === "light" ? "moon" : "sun"} animateOnHover />
    </button>
  );
}

export function SiteAppearance() {
  return (
    <>
      <SiteGrain className="site-grain--background" />
      <SiteThemeToggle />
    </>
  );
}
