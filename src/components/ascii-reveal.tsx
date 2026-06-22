"use client";

import { useEffect, useRef } from "react";
import { GLYPH_RAMP } from "@/lib/glyphs";

// Portrait develop: when a card scrolls into view the photo arrives as live
// type — every cell starts as scrambled characters, then resolves in an
// organic top-down sweep. A cell flashes accent green at the moment it
// settles, like a developing edge moving down the print, and once the whole
// frame has settled the characters dissolve into the photograph.

const SCRAMBLE = "$@B%8&WM#*ZOQXkbdpqwmcvunxrj?+~<>!;:";
const SWEEP_MS = 1400; // top row → bottom row resolve spread
const JITTER_MS = 460; // per-cell randomness inside the sweep
const FLASH_MS = 160; // green flash when a cell settles
const HOLD_MS = 420; // settled frame, before the dissolve
const SCRAMBLE_TICK_MS = 64; // how often unresolved cells re-randomize

type Cell = {
  x: number;
  y: number;
  glyph: string;
  alpha: number;
  resolveAt: number;
};

export function AsciiReveal({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    let revealed = false;
    let raf = 0;
    let fadeTimer = 0;

    const prepare = (img: HTMLImageElement): { cells: Cell[]; cellW: number; cellH: number } | null => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const cols = 52;
      const cellW = canvas.width / cols;
      const cellH = cellW / 0.6;
      const rows = Math.max(2, Math.ceil(canvas.height / cellH));

      // Sample the photo at one pixel per cell, laid out exactly like the
      // photo it becomes: object-contain, bottom-anchored, white around.
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return null;

      const scale = Math.min(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight,
      );
      const destW = img.naturalWidth * scale;
      const destH = img.naturalHeight * scale;
      const destX = (canvas.width - destW) / 2;
      const destY = canvas.height - destH;

      sctx.fillStyle = "#fff";
      sctx.fillRect(0, 0, cols, rows);
      sctx.drawImage(
        img,
        (destX / canvas.width) * cols,
        (destY / canvas.height) * rows,
        (destW / canvas.width) * cols,
        (destH / canvas.height) * rows,
      );
      const data = sctx.getImageData(0, 0, cols, rows).data;

      const cells: Cell[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const o = (y * cols + x) * 4;
          const lum =
            (0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]) / 255;
          const idx = Math.round(lum * (GLYPH_RAMP.length - 1));
          const glyph = GLYPH_RAMP[idx];
          if (glyph === " ") continue; // paper stays paper
          cells.push({
            x,
            y,
            glyph,
            alpha: 0.55 + 0.45 * (1 - lum),
            resolveAt: (y / rows) * SWEEP_MS + Math.random() * JITTER_MS,
          });
        }
      }
      return { cells, cellW, cellH };
    };

    const animate = (img: HTMLImageElement) => {
      const layout = prepare(img);
      const ctx = canvas.getContext("2d");
      if (!layout || !ctx) {
        canvas.classList.add("is-developed");
        return;
      }
      const { cells, cellW, cellH } = layout;
      const font = `${Math.floor(cellH * 0.92)}px ui-monospace, 'SF Mono', Menlo, Consolas, monospace`;
      const total = SWEEP_MS + JITTER_MS;
      const start = performance.now();
      let scrambleTick = -1;
      let scrambles: string[] = [];

      const frame = (now: number) => {
        const t = now - start;

        // Unresolved cells re-randomize on a coarse tick (typewriter chatter,
        // not per-frame noise).
        const tick = Math.floor(t / SCRAMBLE_TICK_MS);
        if (tick !== scrambleTick) {
          scrambleTick = tick;
          scrambles = cells.map(
            () => SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0],
          );
        }

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const since = t - cell.resolveAt;
          if (since < 0) {
            // Still scrambling: dim, restless.
            ctx.fillStyle = "rgba(0, 0, 0, 0.30)";
            ctx.fillText(
              scrambles[i],
              (cell.x + 0.5) * cellW,
              (cell.y + 0.5) * cellH,
            );
          } else if (since < FLASH_MS) {
            // The developing edge: settles in green, then fades to ink.
            ctx.fillStyle = "#00E100";
            ctx.fillText(
              cell.glyph,
              (cell.x + 0.5) * cellW,
              (cell.y + 0.5) * cellH,
            );
          } else {
            ctx.fillStyle = `rgba(0, 0, 0, ${(0.82 * cell.alpha).toFixed(3)})`;
            ctx.fillText(
              cell.glyph,
              (cell.x + 0.5) * cellW,
              (cell.y + 0.5) * cellH,
            );
          }
        }

        if (t < total + FLASH_MS) {
          raf = requestAnimationFrame(frame);
        } else {
          fadeTimer = window.setTimeout(() => {
            canvas.classList.add("is-developed");
          }, HOLD_MS);
        }
      };

      // Background tabs get the finished state immediately — no rAF there.
      if (document.hidden) {
        canvas.classList.add("is-developed");
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || revealed) return;
        revealed = true;
        io.disconnect();
        const img = new Image();
        img.onload = () => {
          try {
            animate(img);
          } catch {
            canvas.classList.add("is-developed");
          }
        };
        img.onerror = () => canvas.classList.add("is-developed");
        img.src = src;
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
    };
  }, [src]);

  return <canvas ref={canvasRef} className="ascii-reveal" aria-hidden="true" />;
}
