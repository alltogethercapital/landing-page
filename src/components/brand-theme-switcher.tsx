"use client";

import { useSyncExternalStore } from "react";

type BrandTheme = "025" | "069";

const STORAGE_KEY = "all-together-brand-theme";
const CHANGE_EVENT = "all-together-brand-theme-change";

function getThemeSnapshot(): BrandTheme {
  return window.localStorage.getItem(STORAGE_KEY) === "069" ? "069" : "025";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function applyTheme(theme: BrandTheme) {
  document.documentElement.dataset.brandTheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function BrandThemeSwitcher() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "025");

  const selectTheme = (nextTheme: BrandTheme) => {
    applyTheme(nextTheme);
  };

  return (
    <div className="brand-theme-switcher" role="group" aria-label="Preview brand concept">
      <span className="brand-theme-switcher__label">Brand</span>
      {(["025", "069"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={theme === option}
          className={theme === option ? "is-active" : undefined}
          onClick={() => selectTheme(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
