"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "machine-spirit-theme";

function setThemeAssets(theme: Theme) {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const favicon = `/brand/machine-spirit-favicon-${theme}.png`;
  document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((link) => {
    link.href = favicon;
  });

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = isDark ? "#141412" : "#f4f2ee";
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const initialTheme: Theme = root.classList.contains("dark") ? "dark" : "light";
    let assetTimer = 0;
    const frame = window.requestAnimationFrame(() => {
      setTheme(initialTheme);
      setThemeAssets(initialTheme);
      assetTimer = window.setTimeout(() => {
        setThemeAssets(root.classList.contains("dark") ? "dark" : "light");
      }, 250);
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem(STORAGE_KEY)) return;

      const nextTheme: Theme = event.matches ? "dark" : "light";
      setTheme(nextTheme);
      setThemeAssets(nextTheme);
    };

    media.addEventListener("change", handleSystemThemeChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(assetTimer);
      media.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  function toggleTheme() {
    const currentlyDark = theme
      ? theme === "dark"
      : document.documentElement.classList.contains("dark");
    const nextTheme: Theme = currentlyDark ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    setThemeAssets(nextTheme);
  }

  return (
    <button
      type="button"
      className="cog-theme-toggle"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      onClick={toggleTheme}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
