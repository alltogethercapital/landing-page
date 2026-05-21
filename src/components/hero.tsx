"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PORTFOLIO } from "@/lib/portfolio";
import { SoundOffIcon, SoundOnIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

// Each hero slide is a portfolio company. The image + video come from the
// shared PORTFOLIO data (single source of truth — same videos as /companies);
// the caption is hero-specific copy. Latest company first.
type Slide = {
  name: string;
  img: string;
  title: string;
  subtitle: string;
  href: string;
  video?: string;
  videoStart?: number;
};

const SLIDE_COPY: Pick<Slide, "name" | "title" | "subtitle" | "href">[] = [
  {
    name: "Shield AI",
    title: "Shield AI X-BAT — the first",
    subtitle: "AI-piloted VTOL fighter jet",
    href: "https://shield.ai/x-bat/",
  },
  {
    name: "1X",
    title: "1X NEO — the humanoid robot",
    subtitle: "engineered for the home",
    href: "https://www.1x.tech/",
  },
  {
    name: "Figure AI",
    title: "Figure 03 — the humanoid robot",
    subtitle: "built for work and the home",
    href: "https://www.figure.ai/",
  },
];

const SLIDES: Slide[] = SLIDE_COPY.map((c) => {
  const company = PORTFOLIO.find((p) => p.name === c.name);
  return {
    ...c,
    img: company?.image ?? "",
    video: company?.video,
    videoStart: company?.videoStart,
  };
});

const CYCLE_MS = 5000; // image shown before the video takes over
const OUTRO_MS = 2600; // image shown again after the video, before advancing

// Glyphs: binary 0/1.
const GLYPHS = ["0", "1"] as const;
const PROXIMITY_RADIUS = 160; // px — how near the cursor must be to flip a glyph
const FLIP_COOLDOWN = 800; // ms — min time before the same glyph re-flips

// Target spacing (px) between glyphs. Column/row counts are derived from the
// viewport using this, so spacing stays ~square AND the density (sparseness) is
// consistent across screens — phones get fewer glyphs, desktops more.
const GLYPH_CELL = 168;

// Deterministic starting glyph per cell (stable across resizes — no reshuffle).
function charFor(r: number, c: number) {
  const h = (((r * 73856093) ^ (c * 19349663)) >>> 0) % GLYPHS.length;
  return GLYPHS[h];
}

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
  const [dims, setDims] = useState<{
    w: number;
    h: number;
    cols: number;
    rows: number;
  } | null>(null);

  const register = useCallback((h: GlyphHandle) => {
    handles.current.push(h);
    return () => {
      handles.current = handles.current.filter((x) => x !== h);
    };
  }, []);

  // Derive an even, square grid from the field's actual size (consistent density).
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const compute = () => {
      const { width, height } = field.getBoundingClientRect();
      if (!width || !height) return;
      const cols = Math.max(2, Math.round(width / GLYPH_CELL));
      const rows = Math.max(2, Math.round(height / GLYPH_CELL));
      setDims((prev) =>
        prev &&
        prev.w === width &&
        prev.h === height &&
        prev.cols === cols &&
        prev.rows === rows
          ? prev
          : { w: width, h: height, cols, rows },
      );
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(field);
    return () => ro.disconnect();
  }, []);

  // Track cursor proximity → flip nearby glyphs. Re-measures when the grid changes.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field || !dims) return;

    const measure = () => {
      for (const h of handles.current) {
        h.cx = h.el.offsetLeft;
        h.cy = h.el.offsetTop;
      }
    };
    const raf = requestAnimationFrame(measure);

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
      cancelAnimationFrame(raf);
    };
  }, [dims]);

  const cells = useMemo(() => {
    if (!dims) return [];
    const { w, h, cols, rows } = dims;
    // Center the grid with exact GLYPH_CELL spacing on both axes (true squares).
    const offX = (w - (cols - 1) * GLYPH_CELL) / 2;
    const offY = (h - (rows - 1) * GLYPH_CELL) / 2;
    const out: { key: string; left: string; top: string; char: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offX + c * GLYPH_CELL;
        const y = offY + r * GLYPH_CELL;
        out.push({
          key: `${r}-${c}`,
          left: `${((x / w) * 100).toFixed(3)}%`,
          top: `${((y / h) * 100).toFixed(3)}%`,
          char: charFor(r, c),
        });
      }
    }
    return out;
  }, [dims]);

  return (
    <div
      ref={fieldRef}
      className="pointer-events-none absolute inset-0 z-[5]"
      aria-hidden="true"
    >
      {cells.map((cell) => (
        <GridGlyph
          key={cell.key}
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

// ── Full-bleed YouTube background player ──────────────────────
// Loads the IFrame API once, autoplays muted, fills the viewport (object-cover),
// supports a mute toggle, and reports when the clip ends.
type YTPlayer = {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};
type YTPlayerEvent = { target: YTPlayer; data: number };
type YTNamespace = {
  Player: new (el: HTMLElement, opts: unknown) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTNamespace | null> | null = null;
function loadYouTubeApi(): Promise<YTNamespace | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT ?? null);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

function HeroVideoPlayer({
  videoId,
  start = 0,
  muted,
  onEnded,
}: {
  videoId: string;
  start?: number;
  muted: boolean;
  onEnded: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const doneRef = useRef(false);
  const revealTimer = useRef<number | undefined>(undefined);
  // The video is revealed a beat AFTER playback starts (and hidden the instant
  // it isn't playing), so YouTube's center play/pause flash, poster button, and
  // end screen are never visible over the hero.
  const [revealed, setRevealed] = useState(false);

  // Advance to the next slide exactly once (whether via the end-poll or events).
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onEnded();
  }, [onEnded]);

  // Create the player.
  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT || !holderRef.current) return;
      playerRef.current = new YT.Player(holderRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: YTPlayerEvent) => {
            // NB: do NOT call playVideo() here — an explicit API play makes
            // YouTube flash its center play/pause indicator. Muted autoplay
            // (autoplay=1 & mute=1) starts it without any indicator.
            if (muted) e.target.mute();
            else e.target.unMute();
          },
          onStateChange: (e: YTPlayerEvent) => {
            if (e.data === YT.PlayerState.PLAYING) {
              // Reveal only after YouTube's center play/pause indicator (shown
              // for ~1.5s when playback starts) is fully gone — otherwise it
              // flashes during the fade-in.
              window.clearTimeout(revealTimer.current);
              revealTimer.current = window.setTimeout(
                () => setRevealed(true),
                2200,
              );
            } else if (e.data === YT.PlayerState.PAUSED) {
              // Never sit on a paused frame (which shows a play button) — hide
              // the layer immediately and resume.
              window.clearTimeout(revealTimer.current);
              setRevealed(false);
              e.target.playVideo();
            } else if (e.data === YT.PlayerState.ENDED) {
              finish();
            }
          },
          onError: () => finish(),
        },
      });
    });
    return () => {
      cancelled = true;
      window.clearTimeout(revealTimer.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* player already gone */
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, start]);

  // End ~2s early so YouTube's end screen (replay button + suggested videos)
  // never gets a chance to appear over the background.
  useEffect(() => {
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p?.getDuration || !p.getCurrentTime) return;
      const dur = p.getDuration();
      const cur = p.getCurrentTime();
      if (dur > 0 && cur >= dur - 2) {
        window.clearInterval(id);
        finish();
      }
    }, 400);
    return () => window.clearInterval(id);
  }, [finish]);

  // Reflect the mute toggle.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) p.mute();
    else p.unMute();
  }, [muted]);

  // object-cover: size a 16:9 box to overflow + center within the viewport.
  useEffect(() => {
    const wrap = wrapRef.current;
    const cover = coverRef.current;
    if (!wrap || !cover) return;
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const scale = Math.max(w / 16, h / 9);
      const vw = 16 * scale;
      const vh = 9 * scale;
      cover.style.width = `${vw}px`;
      cover.style.height = `${vh}px`;
      cover.style.left = `${(w - vw) / 2}px`;
      cover.style.top = `${(h - vh) / 2}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] bg-black transition-opacity duration-700 ease-in-out",
        revealed ? "opacity-100" : "opacity-0",
      )}
    >
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
        <div ref={coverRef} className="absolute">
          <div ref={holderRef} className="size-full" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"image" | "video" | "outro">("image");
  const [muted, setMuted] = useState(true);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Epic headline reveal: mask each line and stagger the characters upward.
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;
    const show = () => gsap.set(el, { autoAlpha: 1 });
    const fallback = window.setTimeout(show, 2500); // never leave it hidden
    const run = () => {
      window.clearTimeout(fallback);
      try {
        split = SplitText.create(el, { type: "lines,chars", mask: "lines" });
        show();
        tween = gsap.from(split.chars, {
          yPercent: 115,
          opacity: 0,
          stagger: 0.02,
          duration: 0.9,
          ease: "power4.out",
          delay: 0.15,
          onComplete: () => split?.revert(), // restore normal, responsive markup
        });
      } catch {
        show();
      }
    };
    const ready =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();
    ready.then(run);
    return () => {
      window.clearTimeout(fallback);
      tween?.kill();
      split?.revert();
    };
  }, []);

  const slide = SLIDES[active];
  const showDecor = phase !== "video";
  const playingVideo = phase === "video" && Boolean(slide.video);

  const go = (i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
    setPhase("image");
  };

  // Per company: image (5s) → video (until it ends) → image again (outro) → next.
  useEffect(() => {
    if (phase === "video") return; // advanced by the player's onEnded handler
    const id = setTimeout(
      () => {
        if (phase === "image" && slide.video) {
          setPhase("video");
        } else {
          setActive((i) => (i + 1) % SLIDES.length);
          setPhase("image");
        }
      },
      phase === "image" ? CYCLE_MS : OUTRO_MS,
    );
    return () => clearTimeout(id);
  }, [phase, active, slide.video]);

  const handleVideoEnd = useCallback(() => setPhase("outro"), []);

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

      {/* Full-bleed video takeover — replaces the background image until it ends */}
      {playingVideo && (
        <HeroVideoPlayer
          key={slide.name}
          videoId={slide.video as string}
          start={slide.videoStart}
          muted={muted}
          onEnded={handleVideoEnd}
        />
      )}

      {/* Per-slide drifting smoke — hidden while the video plays */}
      {SLIDES.map((s, i) => (
        <div
          key={`${s.img}-smoke`}
          aria-hidden="true"
          className={cn(
            "hero-smoke absolute inset-0 z-[1] transition-opacity duration-[700ms] ease-in-out",
            i % 2 === 0 ? "hero-smoke--a" : "hero-smoke--b",
          )}
          style={{ opacity: showDecor && i === active ? 1 : 0 }}
        />
      ))}

      {/* Animated light rays — hidden while the video plays */}
      <div
        className="light-rays pointer-events-none absolute inset-0 z-[1] transition-opacity duration-700"
        style={{ opacity: showDecor ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Top scrim — keeps the headline + captions readable over bright slides */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.3)_16%,rgba(0,0,0,0.1)_32%,transparent_44%)]"
        aria-hidden="true"
      />

      {/* Decorative glyph field (A/T/0/1) — hidden while the video plays */}
      {showDecor && <GlyphField />}

      {/* HERO CONTENT (flows on mobile, absolute on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="flex h-full flex-col gap-7 px-6 pt-[96px] lg:block lg:p-0">
          {/* Headline */}
          <div className="lg:absolute lg:left-[100px] lg:top-[175px] lg:max-w-[640px]">
            <h1
              ref={headlineRef}
              className="hero-headline text-[29px] font-medium leading-[1.12] tracking-[-1.1px] text-white opacity-0 md:text-[45.66px] md:leading-[54.79px] md:tracking-[-1.83px]"
            >
              The future is built together.
              <br />
              The future is built now.
            </h1>
          </div>

          {/* Focused on American companies — secondary side note */}
          <div className="lg:absolute lg:right-[100px] lg:top-[214px] lg:text-right">
            <p className="[font-family:var(--font-playfair)] text-[16px] font-normal leading-[1.3] tracking-[-0.1px] text-white/80 sm:text-[18px] lg:text-[30px] lg:leading-[1.12] lg:tracking-[-0.4px] lg:text-white/90">
              Focused on
              <br />
              American companies{" "}
              <svg
                viewBox="0 0 19 10"
                role="img"
                aria-label="United States"
                className="ml-[0.18em] inline-block h-[0.6em] w-auto align-[-0.04em]"
              >
                <rect width="19" height="10" fill="#fff" />
                <g fill="#b22234">
                  <rect width="19" height="0.769" y="0" />
                  <rect width="19" height="0.769" y="1.538" />
                  <rect width="19" height="0.769" y="3.077" />
                  <rect width="19" height="0.769" y="4.615" />
                  <rect width="19" height="0.769" y="6.154" />
                  <rect width="19" height="0.769" y="7.692" />
                  <rect width="19" height="0.769" y="9.231" />
                </g>
                <rect width="7.6" height="5.385" fill="#3c3b6e" />
              </svg>
            </p>
          </div>

          {/* Cycling caption (links to product) + slide nav */}
          <div className="lg:absolute lg:left-[100px] lg:top-[330px] lg:max-w-[540px]">
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
                    onClick={() => go(i)}
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

              {/* Sound toggle — sits with the slide controls while a video plays */}
              {playingVideo && (
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute video" : "Mute video"}
                  className={cn(
                    "ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md transition-colors duration-200 md:ml-3 md:gap-2 md:px-3.5 md:py-2 md:text-[13px]",
                    muted
                      ? "bg-[#ff4400] text-black hover:bg-[#ff5a1f]"
                      : "bg-white/15 text-white hover:bg-white/25",
                  )}
                >
                  {muted ? (
                    <SoundOffIcon className="size-4" />
                  ) : (
                    <SoundOnIcon className="size-4" />
                  )}
                  {muted ? "Tap for sound" : "Mute"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark + Capital lockup — always visible, even over the video */}
      <div className="pointer-events-none absolute inset-x-[40px] bottom-[22px] z-[8] mx-auto max-w-[1920px] [container-type:inline-size] max-md:inset-x-3 max-md:bottom-2">
        <div className="whitespace-nowrap text-[16.5cqw] font-[900] leading-[1.0] tracking-[-0.05em] text-[#ff4400]">
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
