"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PORTFOLIO } from "@/lib/portfolio";
import { ArrowUpRight, SoundOffIcon, SoundOnIcon } from "@/components/icons";
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
    title: "Shield AI X-BAT",
    subtitle: "The first AI-piloted VTOL fighter jet",
    href: "https://shield.ai/x-bat/",
  },
  {
    name: "1X",
    title: "1X NEO",
    subtitle: "The humanoid robot engineered for the home",
    href: "https://www.1x.tech/",
  },
  {
    name: "Figure AI",
    title: "Figure 03",
    subtitle: "The humanoid robot built for work and the home",
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

const CYCLE_MS = 1500; // image leads in; the video reveals after the bezel-clear gate
const FADE_MS = 850; // crossfade from the ending video to the next company image
// Play each video essentially to its end before advancing — a tiny pad so the
// crossfade to the next slide begins just before the final frame.
const VIDEO_END_PAD_S = 2;
// If playback can't progress for this long (autoplay blocked / stalled), advance
// anyway so the slideshow never hangs.
const VIDEO_STALL_MS = 8000;

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

function GlyphField({ active }: { active: boolean }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const handles = useRef<GlyphHandle[]>([]);
  const activeRef = useRef(active);
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

  // Mirror `active` into a ref so the global pointermove handler can read the
  // latest value without re-subscribing.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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
      if (!activeRef.current) return; // no flips while faded out (video phase)
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
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] transition-opacity duration-700 ease-in-out",
        active ? "opacity-100" : "opacity-0 [&_*]:!pointer-events-none",
      )}
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

function Chevron({ dir, className }: { dir: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-[22px]", className)}
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
  getVolume: () => number;
  setVolume: (v: number) => void;
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
  visible,
  onEnded,
  onRevealChange,
}: {
  videoId: string;
  start?: number;
  muted: boolean;
  visible: boolean;
  onEnded: () => void;
  onRevealChange?: (revealed: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const doneRef = useRef(false);
  const fadeRef = useRef<number | undefined>(undefined);
  const wasShownRef = useRef(false);
  const lastTimeRef = useRef(0); // last getCurrentTime — for stall detection
  const lastProgressRef = useRef(0); // wall-clock of last real progress
  // The video preloads + plays hidden during the image phase; it's only shown
  // once it has PLAYED enough that YouTube's start play/pause indicator is gone.
  const [played, setPlayed] = useState(false);
  // True only while the player reports an explicit PAUSED state. The video hides
  // instantly whenever it's paused, so YouTube's center play/pause button can
  // never be seen — but it defaults false so a normal reveal is never blocked.
  const [paused, setPaused] = useState(false);
  // The video is visually shown only in the video phase, once played past the
  // start-indicator window, and while not paused. Audio is tied to this so sound
  // and visuals switch together.
  const reveal = visible && played && !paused;

  // Notify the parent whenever the video's reveal state changes — keeps the
  // decorative layers (glyph field, light rays, smoke) visible until the
  // video actually fades in, not just when the phase flips to "video".
  useEffect(() => {
    onRevealChange?.(reveal);
  }, [reveal, onRevealChange]);

  // Advance to the next slide exactly once (whether via the end-poll or events).
  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onEnded();
  }, [onEnded]);

  // Quick volume ramp so sound never snaps on/off abruptly.
  const fadeTo = useCallback((target: number, ms = 400) => {
    const p = playerRef.current;
    if (!p?.setVolume) return;
    window.clearInterval(fadeRef.current);
    const fadingIn = target > 0;
    let cur: number;
    if (fadingIn) {
      try {
        // Volume to 0 BEFORE unmuting, so unmuting can't pop at full volume for a
        // frame — the ramp then brings sound up cleanly from true silence.
        p.setVolume(0);
        p.unMute();
      } catch {
        /* not ready */
      }
      cur = 0;
    } else {
      try {
        cur = p.getVolume?.() ?? 100;
      } catch {
        cur = 100;
      }
    }
    const steps = Math.max(1, Math.round(ms / 25));
    let i = 0;
    fadeRef.current = window.setInterval(() => {
      i += 1;
      const v = Math.round(cur + (target - cur) * (i / steps));
      try {
        p.setVolume(v);
      } catch {
        /* player gone */
      }
      if (i >= steps) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = undefined;
        if (!fadingIn) {
          try {
            p.mute();
          } catch {
            /* player gone */
          }
        }
      }
    }, 25);
  }, []);

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
            // Always start muted — it preloads hidden; the mute effect applies
            // the real preference once the video is actually shown.
            e.target.mute();
          },
          onStateChange: (e: YTPlayerEvent) => {
            const s = e.data;
            // Hide the video the instant it pauses so YouTube's center play/pause
            // button is never seen; it shows again as soon as it's playing.
            setPaused(s === YT.PlayerState.PAUSED);
            // Never sit on a paused frame — resume on the NEXT tick (after it's
            // hidden) so the resume can't flash the indicator on screen.
            if (s === YT.PlayerState.PAUSED) {
              window.setTimeout(() => {
                try {
                  e.target.playVideo();
                } catch {
                  /* player gone */
                }
              }, 60);
            }
            if (s === YT.PlayerState.ENDED) finish();
          },
          onError: () => finish(),
        },
      });
    });
    return () => {
      cancelled = true;
      window.clearInterval(fadeRef.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* player already gone */
      }
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, start]);

  // Poll playback: the video plays HIDDEN behind the image from the moment the
  // slide loads; we only REVEAL it once it has played ~3.5s. YouTube renders a
  // center play/pause "bezel" inside its iframe for the first ~1-2s of any
  // playback and gives us no embed parameter to hide it (controls=0,
  // modestbranding=1, iv_load_policy=3, disablekb=1, fs=0 all already set; none
  // suppress the bezel). The only reliable way to avoid showing it is to wait
  // for it to fade before unhiding the video — hence 3.5s. Don't drop this
  // below ~3s or the bezel becomes visible at reveal time.
  // Then play through to the end before advancing; and advance if playback stalls
  // so the slideshow never hangs.
  useEffect(() => {
    lastTimeRef.current = start;
    lastProgressRef.current = Date.now();
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p?.getDuration || !p.getCurrentTime) return;
      const dur = p.getDuration();
      const cur = p.getCurrentTime();
      if (cur >= start + 3.5) setPlayed(true);
      // Track real progress for hang protection.
      if (cur > lastTimeRef.current + 0.05) {
        lastTimeRef.current = cur;
        lastProgressRef.current = Date.now();
      }
      if (dur > 0 && cur >= dur - VIDEO_END_PAD_S) {
        // Played to (effectively) the end → advance to the next slide.
        window.clearInterval(id);
        finish();
      } else if (Date.now() - lastProgressRef.current > VIDEO_STALL_MS) {
        // Can't progress (autoplay blocked / stalled) → advance so it never hangs.
        window.clearInterval(id);
        finish();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [finish, start]);

  // Audio follows the VISUAL reveal — not the phase — so sound switches in step
  // with the picture: silent while the video plays hidden behind the image, then
  // fades in exactly as the video fades in, and fades out as it leaves.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (reveal) {
      wasShownRef.current = true;
      // Clear, audible fade-in as the video appears (quick fade to silent if muted).
      fadeTo(muted ? 0 : 100, muted ? 250 : 700);
    } else if (wasShownRef.current) {
      fadeTo(0); // was shown, now leaving → fade the audio out with the visuals
    } else {
      window.clearInterval(fadeRef.current);
      try {
        p.mute(); // still preloading hidden → silent instantly
      } catch {
        /* not ready */
      }
    }
  }, [muted, reveal, fadeTo]);

  // object-cover: size a 16:9 box to overflow + center within the viewport.
  // The 1.4x overscale crops the iframe's top/bottom edges out of view — that's
  // where YouTube renders its title bar and "more videos"/share chrome, so it's
  // never visible (the wrap is overflow-hidden).
  useEffect(() => {
    const wrap = wrapRef.current;
    const cover = coverRef.current;
    if (!wrap || !cover) return;
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const scale = Math.max(w / 16, h / 9) * 1.4;
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

  // Fade in when revealing, fade out when leaving (the seamless end crossfade);
  // but on a mid-play pause (visible yet not playing) hide INSTANTLY so YouTube's
  // play/pause button is never seen.
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] bg-black",
        reveal ? "opacity-100" : "opacity-0",
        (reveal || !visible) && "transition-opacity duration-700 ease-in-out",
      )}
    >
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
        <div ref={coverRef} className="absolute">
          <div ref={holderRef} className="size-full" />
        </div>
      </div>
      {/* Brand-blue tint over the video — keyed to the logo's background blue
          (#025C80), lightened and low-opacity so it tints the footage without
          making it feel darker. Fades in/out with the reveal via the parent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "#5fb6da", opacity: 0.18 }}
      />
    </div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"image" | "video" | "fade">("image");
  const [muted, setMuted] = useState(true);
  // Brief "sound lives here" highlight on the audio button — pulsed on each
  // video start while still muted (see the flash effect below).
  const [flash, setFlash] = useState(false);
  // Whether the YouTube video has visually revealed (faded in) for the current
  // slide — keeps decorations (glyphs, rays, smoke) on screen until the video
  // actually appears, not just when the phase flips internally.
  const [revealed, setRevealed] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Intro unveil: a brand-dark curtain wipes UP on load, revealing the page from
  // the bottom with a thin orange scan line at its leading edge — techy + swift.
  // GSAP (already in the stack) → GPU-friendly transform, smooth easing, and it
  // coordinates with the headline reveal. Respects reduced motion.
  useEffect(() => {
    const el = curtainRef.current;
    if (!el) return;
    const hide = () => {
      if (curtainRef.current) curtainRef.current.style.display = "none";
    };
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      hide();
      return;
    }
    const tween = gsap.to(el, {
      yPercent: -100,
      duration: 0.9,
      ease: "power3.inOut",
      delay: 0.05,
      onComplete: hide,
    });
    const fallback = window.setTimeout(hide, 2200); // never leave it covering
    return () => {
      tween.kill();
      window.clearTimeout(fallback);
    };
  }, []);

  // Headline reveal: a masked character-rise at >=768px (where the headline is
  // whitespace-normal and SplitText behaves), and a simple, reliable fade-rise on
  // mobile (SplitText + the responsive nowrap headline can leave chars hidden).
  // A safety timer guarantees the headline is never left invisible.
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;
    let safety: number | undefined;
    const show = () => gsap.set(el, { autoAlpha: 1 });
    const fallback = window.setTimeout(show, 2500); // never leave it hidden
    const run = () => {
      window.clearTimeout(fallback);
      const fancy = window.matchMedia("(min-width: 768px)").matches;
      try {
        if (fancy) {
          split = SplitText.create(el, { type: "lines,chars", mask: "lines" });
          show();
          tween = gsap.from(split.chars, {
            yPercent: 115,
            opacity: 0,
            stagger: 0.02,
            duration: 0.9,
            ease: "power4.out",
            delay: 0.5, // start as the intro curtain clears the headline
            onComplete: () => split?.revert(), // restore normal, responsive markup
          });
          // Never leave the headline hidden if the tween can't finish.
          safety = window.setTimeout(() => {
            try {
              split?.revert();
            } catch {
              /* ignore */
            }
            show();
          }, 3200);
        } else {
          // Mobile: just reveal it (the intro curtain provides the entrance).
          // A per-element gsap.from can strand the headline at its hidden "from"
          // state here, so keep it bulletproof.
          show();
        }
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
      window.clearTimeout(safety);
      tween?.kill();
      split?.revert();
    };
  }, []);

  const slide = SLIDES[active];
  // Decorations (glyphs, rays, smoke) stay on screen while the IMAGE is visible
  // — through the image phase AND the video phase before the video has actually
  // revealed. They fade only when the video itself fades in.
  const showDecor = phase === "image" || (phase === "video" && !revealed);
  // During the end "fade", show the NEXT company's image underneath the video
  // (which is fading out), so it crossfades video -> next image seamlessly.
  const shownImage = phase === "fade" ? (active + 1) % SLIDES.length : active;

  const go = (i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
    setPhase("image");
  };

  // Per company: image → video → "fade" (crossfade to the NEXT company).
  // The video phase is advanced by the player itself (plays through, then its
  // poll calls onEnded near the end or on a stall) — no wall-clock cap here, so
  // videos are never cut short.
  useEffect(() => {
    if (phase === "video") return;
    const id = setTimeout(
      () => {
        if (phase === "image" && slide.video) {
          setPhase("video");
        } else {
          setActive((i) => (i + 1) % SLIDES.length);
          setPhase("image");
        }
      },
      phase === "image" ? CYCLE_MS : FADE_MS,
    );
    return () => clearTimeout(id);
  }, [phase, active, slide.video]);

  const handleVideoEnd = useCallback(() => setPhase("fade"), []);

  // Each time a company's video begins while the hero is still muted, briefly
  // flash the audio button orange — a quick "sound is available here" nudge.
  // It only fires while muted, so it stops nagging the moment the user unmutes.
  useEffect(() => {
    if (phase !== "video" || !muted) return;
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 1500);
    return () => window.clearTimeout(t);
  }, [phase, muted]);

  // Audio toggle — a large, icon-only, see-through control (no background) so the
  // video shows through. Positioned bottom-right of the hero.
  const renderMute = (extra: string) => (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Unmute video" : "Mute video"}
      className={cn(
        "pointer-events-auto inline-flex size-14 items-center justify-center text-white/85 [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.55))] transition-colors duration-200 hover:text-[#ff4400] md:size-[68px]",
        flash && "unmute-flash",
        extra,
      )}
    >
      {muted ? (
        <SoundOffIcon className="size-8 md:size-11" />
      ) : (
        <SoundOnIcon className="size-8 md:size-11" />
      )}
    </button>
  );

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black text-white"
    >
      {/* Intro unveil curtain — wipes up to reveal the page from the bottom on
          load, led by a thin orange scan line. Removed once the animation ends. */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="intro-curtain pointer-events-none fixed inset-0 z-[200] bg-[#0b0b0d]"
      >
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#ff4400] shadow-[0_0_26px_7px_rgba(255,68,0,0.6)]" />
      </div>
      <noscript>
        <style>{`.intro-curtain{display:none!important}`}</style>
      </noscript>

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
            className={cn(
              "object-cover object-center",
              // Instant swap during the fade (hidden under the fading video) so
              // the previous image never flashes; smooth crossfade otherwise.
              phase === "fade" ? "" : "transition-opacity duration-[700ms] ease-in-out",
            )}
            style={{ opacity: i === shownImage ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Full-bleed video — preloads/plays hidden during the image phase, then
          reveals once it's played enough (so YouTube's start indicator is gone). */}
      {slide.video && (
        <HeroVideoPlayer
          key={slide.name}
          videoId={slide.video}
          start={slide.videoStart}
          muted={muted}
          visible={phase === "video"}
          onEnded={handleVideoEnd}
          onRevealChange={setRevealed}
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

      {/* (Top scrim removed per request — the headline, nav, and thesis note
          rely on their own text-shadows for legibility over bright slides.) */}

      {/* Decorative 0/1 glyph field — fades out (not a hard cut) when the
          video takes over, and fades back in on the next image. */}
      <GlyphField active={showDecor} />

      {/* HERO CONTENT (flows on mobile, absolute on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* On mobile the column reserves bottom room (scaled to the wordmark's
            cqw height) so the caption cluster sits just above the wordmark. */}
        <div className="flex h-full flex-col gap-7 px-6 pt-[96px] pb-[calc(34px_+_16.5vw)] lg:block lg:p-0">
          {/* Headline */}
          <div className="hero-headline-wrap lg:absolute lg:left-[100px] lg:top-[175px] lg:max-w-[640px]">
            <h1
              ref={headlineRef}
              className="hero-headline whitespace-nowrap text-[clamp(17px,6vw,34px)] font-medium leading-[1.12] tracking-[-1px] text-white opacity-0 [text-shadow:0_1px_16px_rgba(0,0,0,0.5)] md:whitespace-normal md:text-[38px] md:leading-[44px] md:tracking-[-1.5px]"
            >
              The future is built together.
              <br />
              The future is built now.
            </h1>
          </div>

          {/* Investment thesis — flag + two-line text lockup. The flag height is
              tied to the same font-size/line-height as the text, so it matches
              the two-line block's height exactly at every breakpoint. */}
          <div className="hero-thesis-wrap lg:absolute lg:right-[100px] lg:top-[183px] lg:flex lg:flex-col lg:items-end">
            <div className="inline-flex items-center gap-[0.55em] text-[16px] sm:text-[18px] lg:text-[15px]">
              {/* US flag — to the left of the text, sized to span the full
                  two-line block so its top/bottom align with the text (no float) */}
              <svg
                viewBox="0 0 19 10"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="United States"
                className="h-[2em] w-auto shrink-0 lg:h-[1.86em] [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.5))]"
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
              <p className="[font-family:var(--font-playfair)] font-normal leading-[1.3] tracking-[-0.1px] text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] lg:leading-[1.12] lg:tracking-[-0.4px]">
                Investing in America&rsquo;s companies,
                <br />
                resurgence, and future.
              </p>
            </div>
          </div>

          {/* Cycling caption (links to product) + slide nav — pinned to the
              bottom (above the wordmark) on mobile, absolute on desktop */}
          <div className="hero-caption-wrap mt-auto lg:absolute lg:left-[100px] lg:bottom-[calc(16.5vw_+_70px)] lg:mt-0 lg:max-w-[680px]">
            {/* Mobile audio toggle — above the caption, right-aligned, always
                visible so the control is discoverable (md+ uses the bottom-right one) */}
            <div className="mb-3 flex justify-end md:hidden">{renderMute("")}</div>
            <div
              className={cn(
                "flex items-start gap-[14px] transition-opacity duration-500 md:gap-[18px]",
                phase === "fade" ? "opacity-0" : "opacity-100",
              )}
            >
              {/* Re-keyed on `active` so the eyebrow → name → text → arrow animate in
                  on every slide switch, pulling the eye to the company we're showing. */}
              <a
                key={active}
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${slide.name} — visit site`}
                className="group pointer-events-auto block"
              >
                {/* Eyebrow — labels the company the hero is featuring */}
                <span className="hero-line-in mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff4400] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] md:mb-2.5 md:text-[13px]">
                  Featuring
                </span>
                {/* Company / product name — the focal point, revealed word-by-word */}
                <span className="flex items-center gap-3.5 md:gap-5">
                  <span className="flex flex-wrap items-baseline gap-x-[0.26em] text-[34px] font-semibold leading-[1.0] tracking-[-1.5px] text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] md:text-[56px] md:tracking-[-2.4px]">
                    {slide.title.split(" ").map((word, i) => (
                      <span
                        key={i}
                        className="hero-name-word"
                        style={{ animationDelay: `${i * 85}ms` }}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                  <span
                    className="hero-pop-in flex size-11 shrink-0 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:size-[60px]"
                    style={{ animationDelay: "360ms" }}
                  >
                    <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-7" />
                  </span>
                </span>
                {/* Supporting line — augments the name */}
                <span
                  className="hero-line-in mt-3 block max-w-[500px] text-[15px] leading-[1.4] text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] md:text-[20px] md:leading-[1.45]"
                  style={{ animationDelay: "240ms" }}
                >
                  {slide.subtitle}
                </span>
              </a>
            </div>

            {/* Slide controls */}
            <div className="pointer-events-auto mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous slide"
                className="text-white/75 transition-colors hover:text-white max-md:hidden"
              >
                <Chevron dir="left" />
              </button>
              <div className="flex items-center gap-2.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.img}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active}
                    className="group/dot flex items-center py-2"
                  >
                    <span
                      className={cn(
                        "block h-[5px] rounded-full transition-all duration-300",
                        i === active
                          ? "w-10 bg-[#ff4400]"
                          : "w-5 bg-white/45 group-hover/dot:bg-white/80",
                      )}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next slide"
                className="text-white/75 transition-colors hover:text-white max-md:hidden"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile slide arrows — pinned to the screen edges, vertically centered
          so they're easy to see/reach. Desktop keeps the inline arrows + dots. */}
      <button
        type="button"
        onClick={() => go(active - 1)}
        aria-label="Previous slide"
        className="pointer-events-auto absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center text-white [filter:drop-shadow(0_1px_5px_rgba(0,0,0,0.85))] transition-transform duration-150 active:scale-90 md:hidden"
      >
        <Chevron dir="left" className="size-8" />
      </button>
      <button
        type="button"
        onClick={() => go(active + 1)}
        aria-label="Next slide"
        className="pointer-events-auto absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center text-white [filter:drop-shadow(0_1px_5px_rgba(0,0,0,0.85))] transition-transform duration-150 active:scale-90 md:hidden"
      >
        <Chevron dir="right" className="size-8" />
      </button>

      {/* Giant wordmark + Capital lockup */}
      <div className="pointer-events-none absolute inset-x-[40px] bottom-[22px] z-[8] mx-auto max-w-[1920px] [container-type:inline-size] max-md:inset-x-3 max-md:bottom-2">
        <div className="hero-wordmark whitespace-nowrap text-[16.5cqw] font-[900] leading-[1.0] tracking-[-0.05em] text-[#ff4400]">
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

      {/* Audio toggle — large, see-through, bottom-right above the wordmark.
          Always visible; it flashes briefly on each video start while muted. */}
      {renderMute(
        "absolute z-20 bottom-[calc(min(16.5vw,27svh)_+_56px)] max-md:hidden md:right-[40px] lg:right-[100px]",
      )}
    </section>
  );
}
