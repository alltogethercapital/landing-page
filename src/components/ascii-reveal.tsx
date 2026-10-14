"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const SWEEP_MS = 600;
const JITTER_MS = 120;
const SETTLE_MS = 180;
const CROSSFADE_MS = 800;
const SCRAMBLE_TICK_MS = 110;
const visitedPages = new Set<string>();

type RevealSession = {
  decide: (page: string) => void;
  subscribe: (listener: (animate: boolean) => void) => () => void;
};

const RevealSessionContext = createContext<RevealSession | null>(null);

function createRevealSession(): RevealSession {
  let decision: boolean | null = null;
  const listeners = new Set<(animate: boolean) => void>();

  return {
    decide(page) {
      // Retain the decision through StrictMode's effect replay. All portraits
      // on this visit share it, including those further down the page.
      if (decision !== null) return;
      const storageKey = `machine-spirit-portrait-visit:${page}`;
      let visited = visitedPages.has(page);
      try {
        visited ||= window.sessionStorage.getItem(storageKey) === "seen";
        window.sessionStorage.setItem(storageKey, "seen");
      } catch {
        // In-memory visits still prevent route replays if storage is blocked.
      }
      visitedPages.add(page);
      decision = !visited;
      const shouldAnimate = decision;
      listeners.forEach((listener) => listener(shouldAnimate));
    },
    subscribe(listener) {
      listeners.add(listener);
      if (decision !== null) listener(decision);
      return () => { listeners.delete(listener); };
    },
  };
}

export function PortraitRevealSession({ page, children }: { page: string; children: ReactNode }) {
  const [session] = useState(createRevealSession);

  useEffect(() => { session.decide(page); }, [page, session]);

  return (
    <RevealSessionContext.Provider value={session}>
      <noscript>
        <style>{".portrait-reveal > img { opacity: 1 !important; }"}</style>
      </noscript>
      {children}
    </RevealSessionContext.Provider>
  );
}

type Cell = {
  x: number;
  y: number;
  glyph: string;
  alpha: number;
  resolveAt: number;
};

export function AsciiReveal({
  src,
  children,
  fit = "contain",
}: {
  src: string;
  children: ReactNode;
  fit?: "contain" | "cover";
}) {
  const session = useContext(RevealSessionContext);
  const revealRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reveal = revealRef.current;
    const canvas = canvasRef.current;
    const photo = reveal?.querySelector("img");
    if (!reveal || !canvas || !photo) return;

    let disposed = false;
    let finished = false;
    let started = false;
    let raf = 0;
    let fadeTimer = 0;
    let loadTimer = 0;
    let io: IntersectionObserver | null = null;
    let themeObserver: MutationObserver | null = null;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactPreference = window.matchMedia("(max-width: 899px)");
    const palette = { ink: "#f7f6f3" };

    const finish = () => {
      if (disposed) return;
      finished = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(loadTimer);
      io?.disconnect();
      themeObserver?.disconnect();
      reveal.dataset.revealState = "complete";
    };
    const handlePreference = () => {
      if (motionPreference.matches || compactPreference.matches) finish();
    };
    const handleVisibility = () => {
      if (document.hidden) finish();
    };
    const updatePalette = () => {
      palette.ink = getComputedStyle(canvas).getPropertyValue("--cog-ink").trim() || "#f7f6f3";
    };

    const prepare = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const cols = 52;
      const cellW = canvas.width / cols;
      const rows = Math.max(2, Math.ceil(canvas.height / (cellW / 0.6)));
      const cellH = canvas.height / rows;
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return null;

      // Match each photograph's CSS geometry during the binary crossfade:
      // full portraits cover and center; cutouts contain and sit at the bottom.
      const scale = (fit === "cover" ? Math.max : Math.min)(
        canvas.width / photo.naturalWidth,
        canvas.height / photo.naturalHeight,
      );
      const destW = photo.naturalWidth * scale;
      const destH = photo.naturalHeight * scale;
      const destY = fit === "cover" ? (canvas.height - destH) / 2 : canvas.height - destH;
      sctx.drawImage(
        photo,
        ((canvas.width - destW) / 2 / canvas.width) * cols,
        (destY / canvas.height) * rows,
        (destW / canvas.width) * cols,
        (destH / canvas.height) * rows,
      );
      const data = sctx.getImageData(0, 0, cols, rows).data;
      const cells: Cell[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const o = (y * cols + x) * 4;
          const alpha = data[o + 3] / 255;
          if (alpha < 0.03) continue;
          const lum = (0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]) / 255;
          cells.push({
            x,
            y,
            glyph: Math.random() < 0.5 ? "0" : "1",
            alpha: alpha * (0.2 + 0.75 * lum),
            resolveAt: (y / rows) * SWEEP_MS + Math.random() * JITTER_MS,
          });
        }
      }
      return { cells, cellW, cellH };
    };

    const animate = () => {
      const layout = prepare();
      const ctx = canvas.getContext("2d");
      if (!layout || !ctx) { finish(); return; }
      const { cells, cellW, cellH } = layout;
      const font = `${Math.floor(cellH * 0.9)}px ui-monospace, 'SF Mono', Menlo, Consolas, monospace`;
      const total = SWEEP_MS + JITTER_MS + SETTLE_MS;
      const start = performance.now();
      let scrambleTick = -1;
      let scrambles: string[] = [];
      updatePalette();
      themeObserver = new MutationObserver(updatePalette);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-site-theme"],
      });

      const frame = (now: number) => {
        if (disposed || finished) return;
        const t = now - start;
        const tick = Math.floor(t / SCRAMBLE_TICK_MS);
        if (tick !== scrambleTick) {
          scrambleTick = tick;
          scrambles = cells.map(() => Math.random() < 0.5 ? "0" : "1");
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = palette.ink;

        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const since = t - cell.resolveAt;
          const emergence = Math.max(0, Math.min(1, since / SETTLE_MS));
          ctx.globalAlpha = cell.alpha * (0.08 + 0.92 * emergence);
          ctx.fillText(since < 0 ? scrambles[i] : cell.glyph, (cell.x + 0.5) * cellW, (cell.y + 0.5) * cellH);
        }
        ctx.globalAlpha = 1;

        if (t < total) {
          raf = requestAnimationFrame(frame);
        } else {
          reveal.dataset.revealState = "crossfade";
          // Leave the resolved binary frame in place while CSS blends both
          // layers. No flash, continued chatter, or sudden photograph swap.
          fadeTimer = window.setTimeout(finish, CROSSFADE_MS);
        }
      };

      reveal.dataset.revealState = "binary";
      raf = requestAnimationFrame(frame);
    };

    const begin = async () => {
      if (started || disposed || finished) return;
      started = true;
      window.clearTimeout(loadTimer);
      loadTimer = window.setTimeout(finish, 8000);
      try { await photo.decode(); } catch { /* A loaded photo can still be drawable. */ }
      if (disposed || finished) return;
      window.clearTimeout(loadTimer);
      if (motionPreference.matches || compactPreference.matches || document.hidden || !photo.naturalWidth) {
        finish();
        return;
      }
      try { animate(); } catch { finish(); }
    };

    const unsubscribe = session?.subscribe((shouldAnimate) => {
      if (!shouldAnimate || motionPreference.matches || compactPreference.matches || document.hidden) {
        finish();
        return;
      }
      // StrictMode may set up this effect again before the first frame.
      reveal.dataset.revealState = "waiting";
      motionPreference.addEventListener("change", handlePreference);
      compactPreference.addEventListener("change", handlePreference);
      document.addEventListener("visibilitychange", handleVisibility);
      io = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting || finished) return;
        io?.disconnect();
        if (photo.complete) {
          if (photo.naturalWidth) void begin();
          else finish();
        } else {
          photo.addEventListener("load", begin, { once: true });
          photo.addEventListener("error", finish, { once: true });
          loadTimer = window.setTimeout(finish, 8000);
        }
      }, { threshold: 0.2 });
      io.observe(reveal);
    });
    if (!session) finish();

    return () => {
      disposed = true;
      unsubscribe?.();
      io?.disconnect();
      themeObserver?.disconnect();
      motionPreference.removeEventListener("change", handlePreference);
      compactPreference.removeEventListener("change", handlePreference);
      document.removeEventListener("visibilitychange", handleVisibility);
      photo.removeEventListener("load", begin);
      photo.removeEventListener("error", finish);
      cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(loadTimer);
    };
  }, [fit, session, src]);

  return (
    <span ref={revealRef} className="portrait-reveal" data-reveal-state="waiting">
      {children}
      <canvas ref={canvasRef} className="ascii-reveal" aria-hidden="true" />
    </span>
  );
}
