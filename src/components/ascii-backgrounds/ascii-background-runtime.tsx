"use client";

import { useEffect, useState } from "react";
import {
  ASCII_BACKGROUND_CATALOG,
  DEFAULT_ASCII_BACKGROUND_INDEX,
} from "@/components/ascii-backgrounds/catalog";

const STORAGE_KEY = "all-together-ascii-background-v1";

function normalizeIndex(index: number) {
  return (index + ASCII_BACKGROUND_CATALOG.length) % ASCII_BACKGROUND_CATALOG.length;
}

function readInitialIndex() {
  try {
    const storedId = window.localStorage.getItem(STORAGE_KEY);
    const storedIndex = ASCII_BACKGROUND_CATALOG.findIndex(({ id }) => id === storedId);
    return storedIndex >= 0 ? storedIndex : DEFAULT_ASCII_BACKGROUND_INDEX;
  } catch {
    return DEFAULT_ASCII_BACKGROUND_INDEX;
  }
}

export function AsciiBackgroundRuntime() {
  const [selectedIndex, setSelectedIndex] = useState(readInitialIndex);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const selected = ASCII_BACKGROUND_CATALOG[selectedIndex];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, selected.id);
    } catch {
      // The selected background still works for this page view without storage.
    }

    const previous = ASCII_BACKGROUND_CATALOG[normalizeIndex(selectedIndex - 1)];
    const next = ASCII_BACKGROUND_CATALOG[normalizeIndex(selectedIndex + 1)];
    void Promise.all([previous.preload(), next.preload()]).catch(() => undefined);
  }, [selected.id, selectedIndex]);

  const cycleBackground = () => {
    setSelectedIndex((current) => normalizeIndex(current + 1));
  };

  const ActivePreset = selected.Component;
  const position = String(selectedIndex + 1).padStart(2, "0");
  const total = String(ASCII_BACKGROUND_CATALOG.length).padStart(2, "0");

  return (
    <>
      <div
        className={`ascii-background-stage${reducedMotion ? " is-static" : ""}`}
        data-ascii-background={selected.id}
        data-ascii-background-name={selected.name}
        aria-hidden="true"
      >
        {reducedMotion ? (
          <div className="ascii-background-fallback" />
        ) : (
          <ActivePreset key={selected.id} />
        )}
      </div>

      <button
        type="button"
        className="ascii-background-toggle"
        onClick={cycleBackground}
        aria-label={`Show next ASCII background. Current background: ${selected.name}, ${
          selectedIndex + 1
        } of ${ASCII_BACKGROUND_CATALOG.length}.`}
      >
        <span className="ascii-background-toggle-label">ASCII</span>
        <span className="ascii-background-toggle-name">{selected.name}</span>
        <span className="ascii-background-toggle-count" aria-hidden="true">
          {position}/{total} →
        </span>
      </button>

      <span className="sr-only" aria-live="polite">
        ASCII background {selectedIndex + 1} of {ASCII_BACKGROUND_CATALOG.length}: {selected.name}
      </span>
    </>
  );
}
