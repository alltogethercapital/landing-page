"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 7;
const ROWS = 9;
const COUNT = COLS * ROWS;

// A faint field of 0/1 glyphs laid over a card image — a nod to the hero's binary
// field. While the parent card is hovered, a few glyphs flip at random,
// continuously, with no need to mouse over individual glyphs.
export function CardGlyphs() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  // Deterministic starting pattern so server and client markup match (no hydration mismatch).
  const [bits, setBits] = useState<number[]>(() =>
    Array.from({ length: COUNT }, (_, i) => ((i * 1103515245 + 12345) >>> 8) & 1),
  );

  // This overlay is pointer-events-none, so listen for hover on the parent card.
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    parent.addEventListener("pointerenter", enter);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Flip a few random glyphs each tick while hovered. Honors reduced motion.
  useEffect(() => {
    if (!hovered) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setBits((prev) => {
        const next = prev.slice();
        for (let k = 0; k < 5; k++) {
          const i = Math.floor(Math.random() * next.length);
          next[i] = next[i] ? 0 : 1;
        }
        return next;
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [hovered]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="card-glyphs pointer-events-none absolute inset-0 grid place-items-center p-[8%] font-mono text-[12px] leading-none text-white/40 opacity-0 transition-opacity duration-200 [text-shadow:0_0_5px_rgba(0,0,0,0.45)] group-hover:opacity-100 md:text-[13px]"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {bits.map((b, i) => (
        <span key={`${i}-${b}`} className="card-glyph">
          {b}
        </span>
      ))}
    </div>
  );
}
