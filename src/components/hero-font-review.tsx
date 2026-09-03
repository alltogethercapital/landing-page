"use client";

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";

type FontOption = {
  name: string;
  category: "sans-serif" | "monospace";
  scale?: number;
  tracking?: string;
};

const FONT_OPTIONS: FontOption[] = [
  { name: "Pitch Sans", category: "sans-serif" },
  { name: "Space Grotesk", category: "sans-serif" },
  { name: "Sora", category: "sans-serif", scale: 0.94 },
  { name: "Manrope", category: "sans-serif" },
  { name: "Plus Jakarta Sans", category: "sans-serif", scale: 0.94 },
  { name: "DM Sans", category: "sans-serif" },
  { name: "Inter", category: "sans-serif" },
  { name: "IBM Plex Sans", category: "sans-serif" },
  { name: "IBM Plex Mono", category: "monospace", scale: 0.84 },
  { name: "Azeret Mono", category: "monospace", scale: 0.78 },
  { name: "Geist", category: "sans-serif" },
  { name: "Geist Mono", category: "monospace", scale: 0.84 },
  { name: "Instrument Sans", category: "sans-serif" },
  { name: "Outfit", category: "sans-serif" },
  { name: "Urbanist", category: "sans-serif" },
  { name: "Red Hat Display", category: "sans-serif" },
  { name: "Red Hat Mono", category: "monospace", scale: 0.84 },
  { name: "Chivo", category: "sans-serif" },
  { name: "Archivo", category: "sans-serif" },
  { name: "Archivo Narrow", category: "sans-serif", scale: 1.08 },
  { name: "Barlow", category: "sans-serif" },
  { name: "Barlow Condensed", category: "sans-serif", scale: 1.08 },
  { name: "Roboto Flex", category: "sans-serif" },
  { name: "Roboto Mono", category: "monospace", scale: 0.84 },
  { name: "Noto Sans", category: "sans-serif" },
  { name: "Noto Sans Mono", category: "monospace", scale: 0.82 },
  { name: "Figtree", category: "sans-serif" },
  { name: "Onest", category: "sans-serif" },
  { name: "Wix Madefor Display", category: "sans-serif" },
  { name: "Schibsted Grotesk", category: "sans-serif", scale: 0.96 },
  { name: "Albert Sans", category: "sans-serif" },
  { name: "Commissioner", category: "sans-serif" },
  { name: "Exo 2", category: "sans-serif", scale: 0.96 },
  { name: "Rajdhani", category: "sans-serif", scale: 1.06 },
  { name: "Oxanium", category: "sans-serif", scale: 0.92 },
  { name: "Michroma", category: "sans-serif", scale: 0.72, tracking: "-0.05em" },
  { name: "Orbitron", category: "sans-serif", scale: 0.8 },
  { name: "Quantico", category: "sans-serif", scale: 0.94 },
  { name: "Share Tech", category: "sans-serif", scale: 1.02 },
  { name: "Share Tech Mono", category: "monospace", scale: 0.9 },
  { name: "Space Mono", category: "monospace", scale: 0.78 },
  { name: "Spline Sans", category: "sans-serif" },
  { name: "Spline Sans Mono", category: "monospace", scale: 0.82 },
  { name: "JetBrains Mono", category: "monospace", scale: 0.8 },
  { name: "Martian Mono", category: "monospace", scale: 0.72 },
  { name: "Fragment Mono", category: "monospace", scale: 0.84 },
  { name: "Fira Sans", category: "sans-serif" },
  { name: "Fira Mono", category: "monospace", scale: 0.86 },
  { name: "Titillium Web", category: "sans-serif", scale: 1.02 },
  { name: "Tomorrow", category: "sans-serif", scale: 0.9 },
];

const REVIEW_PARAM = "font-review";
const SELECTED_PARAM = "font";

function googleFontsUrl(name: string) {
  return `https://fonts.googleapis.com/css2?family=${name.replaceAll(" ", "+")}:wght@400;500;600&display=swap`;
}

function optionStyle(option: FontOption): CSSProperties {
  if (option.name === "Pitch Sans") {
    return {
      fontFamily: 'var(--font-pitch-sans), "Helvetica Neue", Arial, sans-serif',
    };
  }

  return {
    fontFamily: `"${option.name}", ${option.category}`,
    fontSize: option.scale ? `calc(1em * ${option.scale})` : undefined,
    letterSpacing: option.tracking,
  };
}

export function HeroFontReview({ children }: { children: ReactNode }) {
  const [reviewMode, setReviewMode] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(REVIEW_PARAM) !== "1") return;

    const requested = Number.parseInt(params.get(SELECTED_PARAM) ?? "1", 10);
    const initialSelection = Number.isFinite(requested)
      ? Math.min(FONT_OPTIONS.length - 1, Math.max(0, requested - 1))
      : 0;
    const frame = window.requestAnimationFrame(() => {
      setReviewMode(true);
      setSelected(initialSelection);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const choose = useCallback((index: number) => {
    const next = (index + FONT_OPTIONS.length) % FONT_OPTIONS.length;
    setSelected(next);
    const url = new URL(window.location.href);
    url.searchParams.set(REVIEW_PARAM, "1");
    url.searchParams.set(SELECTED_PARAM, String(next + 1));
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    if (!reviewMode) return;
    const option = FONT_OPTIONS[selected];
    if (option.name === "Pitch Sans") return;

    const id = `hero-font-${option.name.toLowerCase().replaceAll(" ", "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = googleFontsUrl(option.name);
    document.head.appendChild(link);
  }, [reviewMode, selected]);

  useEffect(() => {
    if (!reviewMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") choose(selected - 1);
      if (event.key === "ArrowRight") choose(selected + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, reviewMode, selected]);

  const option = FONT_OPTIONS[selected];

  return (
    <>
      <span style={reviewMode ? optionStyle(option) : undefined}>{children}</span>
      {reviewMode && (
        <div className="hero-font-review" aria-label="Hero font review">
          <button type="button" onClick={() => choose(selected - 1)} aria-label="Previous font">
            ←
          </button>
          <div className="hero-font-review-label" aria-live="polite">
            <span>{String(selected + 1).padStart(2, "0")} / {FONT_OPTIONS.length}</span>
            <strong>{option.name}</strong>
          </div>
          <button type="button" onClick={() => choose(selected + 1)} aria-label="Next font">
            →
          </button>
        </div>
      )}
    </>
  );
}
