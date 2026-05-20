"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Each slide pairs a portfolio company's image with a caption + link.
type Slide = { img: string; title: string; subtitle: string; href: string };

const SLIDES: Slide[] = [
  {
    img: "/hero-robots.jpg",
    title: "1X NEO — the humanoid robot",
    subtitle: "engineered for the home",
    href: "https://www.1x.tech/",
  },
  {
    img: "/hero-drones.jpg",
    title: "Shield AI X-BAT — the first",
    subtitle: "AI-piloted VTOL fighter jet",
    href: "https://shield.ai/x-bat/",
  },
];

const CYCLE_MS = 5000;

// Glyphs: A/T (All Together) + 0/1 (binary).
const GLYPHS = ["A", "T", "0", "1"] as const;
const PROXIMITY_RADIUS = 160; // px — how near the cursor must be to flip a glyph
const FLIP_COOLDOWN = 800; // ms — min time before the same glyph re-flips

// seeded PRNG so the scattered field is identical on server + client
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// orderly, evenly-spaced grid (8×5) of positions + starting characters
const GLYPH_FIELD = (() => {
  const cols = 8;
  const rows = 5;
  const rand = mulberry32(20260521);
  const cells: { left: string; top: string; char: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const left = ((c + 0.5) / cols) * 100;
      const top = ((r + 0.5) / rows) * 100;
      cells.push({
        left: `${left.toFixed(2)}%`,
        top: `${top.toFixed(2)}%`,
        char: GLYPHS[Math.floor(rand() * GLYPHS.length)],
      });
    }
  }
  return cells;
})();

type GlyphHandle = {
  el: HTMLElement;
  flip: () => void;
  last: number;
  cx: number;
  cy: number;
};

function GridGlyph({
  initial,
  style,
  register,
}: {
  initial: string;
  style: React.CSSProperties;
  register: (h: GlyphHandle) => () => void;
}) {
  const [char, setChar] = useState(initial);
  const [flipping, setFlipping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const flip = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setFlipping(true);
    window.setTimeout(
      () =>
        setChar((c) => {
          let n = c;
          while (n === c) n = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          return n;
        }),
      150,
    );
    window.setTimeout(() => {
      busy.current = false;
      setFlipping(false);
    }, 340);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    return register({ el: ref.current, flip, last: 0, cx: 0, cy: 0 });
  }, [register, flip]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      onPointerDown={flip}
      style={style}
      className={cn(
        "pointer-events-auto absolute flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-default select-none items-center justify-center font-mono text-[14px] leading-none text-white/75",
        flipping && "grid-glyph--flip",
      )}
    >
      {char}
    </span>
  );
}

function GlyphField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const handles = useRef<GlyphHandle[]>([]);

  const register = useCallback((h: GlyphHandle) => {
    handles.current.push(h);
    return () => {
      handles.current = handles.current.filter((x) => x !== h);
    };
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const measure = () => {
      for (const h of handles.current) {
        h.cx = h.el.offsetLeft;
        h.cy = h.el.offsetTop;
      }
    };
    measure();

    let frame = 0;
    let queued = false;
    let mx = 0;
    let my = 0;
    const r2 = PROXIMITY_RADIUS * PROXIMITY_RADIUS;

    const onMove = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(() => {
        queued = false;
        const now = performance.now();
        for (const h of handles.current) {
          const dx = mx - h.cx;
          const dy = my - h.cy;
          if (dx * dx + dy * dy < r2 && now - h.last > FLIP_COOLDOWN) {
            h.last = now;
            h.flip();
          }
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      className="pointer-events-none absolute inset-0 z-[5]"
      aria-hidden="true"
    >
      {GLYPH_FIELD.map((cell, i) => (
        <GridGlyph
          key={i}
          initial={cell.char}
          style={{ left: cell.left, top: cell.top }}
          register={register}
        />
      ))}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);

  const go = (i: number) => setActive((i + SLIDES.length) % SLIDES.length);

  // Auto-advance — resets whenever `active` changes (so manual nav restarts it).
  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const id = setTimeout(
      () => setActive((i) => (i + 1) % SLIDES.length),
      CYCLE_MS,
    );
    return () => clearTimeout(id);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black text-white"
    >
      {/* Cycling background photos */}
      <div className="absolute inset-0 z-0 bg-black">
        {SLIDES.map((s, i) => (
          <Image
            key={s.img}
            src={s.img}
            alt=""
            fill
            priority={i === 0}
            quality={90}
            sizes="100vw"
            className="object-cover object-center transition-opacity duration-[700ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Animated light rays — subtle "god rays" + breathing glow from the top */}
      <div
        className="light-rays pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
      />

      {/* Decorative glyph field (A/T/0/1) — flips when the cursor comes near */}
      <GlyphField />

      {/* HERO CONTENT (flows on mobile, absolute on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="flex h-full flex-col gap-7 px-6 pt-[96px] md:block md:p-0">
          {/* Headline */}
          <div className="md:absolute md:left-[100px] md:top-[175px] md:max-w-[640px]">
            <h1 className="text-[29px] font-medium leading-[1.12] tracking-[-1.1px] text-white md:text-[45.66px] md:leading-[54.79px] md:tracking-[-1.83px]">
              The future is built together.
              <br />
              The future starts now.
            </h1>
          </div>

          {/* Focused on American companies */}
          <div className="md:absolute md:right-[100px] md:top-[209px] md:text-right">
            <p className="[font-family:var(--font-playfair)] text-[40px] font-normal leading-[1.05] tracking-[-0.5px] text-white md:text-[44px] md:leading-[1.06]">
              Focused on
              <br />
              American companies{" "}
              <span className="text-[0.72em]">🇺🇸</span>
            </p>
          </div>

          {/* Cycling caption (links to product) + slide nav */}
          <div className="md:absolute md:left-[100px] md:top-[330px] md:max-w-[540px]">
            <div className="flex items-start gap-[18px] md:gap-[22px]">
              <span className="mt-[7px] inline-block size-[14px] shrink-0 rounded-[2px] bg-[#ff4400] md:mt-[10px]" />
              <a
                key={active}
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group pointer-events-auto block animate-in fade-in duration-700"
              >
                <p className="text-[18px] font-medium leading-[1.25] tracking-[-0.8px] text-white underline-offset-[6px] group-hover:underline md:text-[28px] md:leading-[33.6px] md:tracking-[-1.12px]">
                  {slide.title}
                  <br />
                  {slide.subtitle}
                  <svg
                    className="ml-[0.4em] inline size-[0.78em] -translate-y-[0.05em] transition-transform group-hover:translate-x-[0.1em] group-hover:-translate-y-[0.15em]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </p>
              </a>
            </div>

            {/* Slide controls */}
            <div className="pointer-events-auto mt-6 flex items-center gap-4 md:pl-[36px]">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous slide"
                className="text-white/75 transition-colors hover:text-white"
              >
                <Chevron dir="left" />
              </button>
              <div className="flex items-center gap-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.img}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                    className={cn(
                      "h-[3px] rounded-full transition-all duration-300",
                      i === active
                        ? "w-7 bg-[#ff4400]"
                        : "w-3 bg-white/45 hover:bg-white/80",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next slide"
                className="text-white/75 transition-colors hover:text-white"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark + Capital lockup */}
      <div className="pointer-events-none absolute inset-x-[40px] bottom-[22px] z-[8] max-md:inset-x-3 max-md:bottom-2">
        <div className="whitespace-nowrap text-[15.6vw] font-[900] leading-[1.0] tracking-[-0.05em] text-[#ff4400]">
          All Together
        </div>
        <div className="mt-[0.04em] text-right leading-none">
          <span className="text-[clamp(12px,1.2vw,17px)] font-semibold uppercase tracking-[0.4em] text-white">
            Capital
          </span>
          <span className="ml-[0.35em] align-super text-[0.6em] font-semibold text-white/75">
            ®
          </span>
        </div>
      </div>
    </section>
  );
}
