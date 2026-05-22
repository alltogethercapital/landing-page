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

const CYCLE_MS = 3000; // image shown before the video takes over
const FADE_MS = 850; // crossfade from the ending video to the next company image
// Seconds of each company's video to play before advancing. Kept short so the
// hero stays snappy AND so playback never reaches the final ~20s where YouTube
// shows its end-screen "more videos" cards (chrome we never want on the hero).
const VIDEO_CLIP_S = 12;
// Hard cap on the video phase (wall-clock). The player normally advances itself
// after the clip; this guarantees the slideshow never hangs if a video can't
// autoplay or never reports finishing (slow link, autoplay-blocked browser).
const VIDEO_MAX_MS = 14000;

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
}: {
  videoId: string;
  start?: number;
  muted: boolean;
  visible: boolean;
  onEnded: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const doneRef = useRef(false);
  const fadeRef = useRef<number | undefined>(undefined);
  const wasVisibleRef = useRef(false);
  // The video preloads + plays hidden during the image phase; it's only shown
  // once it has PLAYED enough that YouTube's start play/pause indicator is gone.
  const [played, setPlayed] = useState(false);
  // True only while the player reports an explicit PAUSED state. The video hides
  // instantly whenever it's paused, so YouTube's center play/pause button can
  // never be seen — but it defaults false so a normal reveal is never blocked.
  const [paused, setPaused] = useState(false);

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
        p.unMute();
        p.setVolume(0);
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

  // Poll playback: reveal once enough content has actually played (so YouTube's
  // start indicator is gone — robust across devices), and end ~2s early so its
  // end screen never appears. The ~2s playback gate keeps the image to ~3s
  // before the video reveals (paired with CYCLE_MS) while still hiding the indicator.
  useEffect(() => {
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p?.getDuration || !p.getCurrentTime) return;
      const dur = p.getDuration();
      const cur = p.getCurrentTime();
      if (cur >= start + 2) setPlayed(true);
      // Advance after the short clip, or before the end-screen zone for short
      // videos — whichever comes first — so YouTube chrome never appears.
      if (cur >= start + VIDEO_CLIP_S || (dur > 0 && cur >= dur - 2)) {
        window.clearInterval(id);
        finish();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [finish, start]);

  // Mute (instantly) while preloading hidden so audio never plays under the
  // image; once shown, fade the audio in/out quickly so there are no abrupt
  // jumps when the user toggles sound.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    if (visible) {
      wasVisibleRef.current = true;
      fadeTo(muted ? 0 : 100);
    } else if (wasVisibleRef.current) {
      fadeTo(0); // was shown, now leaving (end fade) → fade the audio out
    } else {
      window.clearInterval(fadeRef.current);
      try {
        p.mute(); // still preloading hidden → silent instantly
      } catch {
        /* not ready */
      }
    }
  }, [muted, visible, fadeTo]);

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

  // Only ever show a cleanly-playing video that has played past the start
  // indicator. Fade in when revealing, and fade out when leaving for the next
  // slide (the seamless end crossfade); but on a mid-play pause (visible yet not
  // playing) hide INSTANTLY so YouTube's play/pause button is never seen.
  const reveal = visible && played && !paused;
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
    </div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"image" | "video" | "fade">("image");
  const [muted, setMuted] = useState(true);
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
          delay: 0.5, // start as the intro curtain clears the headline
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
  const showDecor = phase === "image";
  const playingVideo = phase === "video" && Boolean(slide.video);
  // During the end "fade", show the NEXT company's image underneath the video
  // (which is fading out), so it crossfades video -> next image seamlessly.
  const shownImage = phase === "fade" ? (active + 1) % SLIDES.length : active;

  const go = (i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
    setPhase("image");
  };

  // Per company: image → video → "fade" (crossfade to the NEXT company).
  useEffect(() => {
    if (phase === "video") {
      // Normally the player advances itself after the clip; this is the safety
      // net that keeps the slideshow moving even if a video never plays/finishes.
      const id = setTimeout(() => setPhase("fade"), VIDEO_MAX_MS);
      return () => clearTimeout(id);
    }
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

  // Mute/unmute control — placed under the "American companies" note on
  // tablet/desktop and bottom-right on mobile, so it's easy to reach everywhere.
  const renderMute = (extra: string) => (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Unmute video" : "Mute video"}
      className={cn(
        "unmute-flash pointer-events-auto inline-flex items-center gap-2 bg-black/50 px-3.5 py-2 text-[13px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-200 hover:bg-[#ff4400] hover:text-black hover:ring-[#ff4400] md:text-[14px]",
        extra,
      )}
    >
      {muted ? (
        <SoundOffIcon className="size-4" />
      ) : (
        <SoundOnIcon className="size-4" />
      )}
      {muted ? "Tap to unmute" : "Mute"}
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

      {/* White sunrise rays rising from the bottom — sits behind the wordmark
          and content so the "All Together" lettering is never recolored. */}
      <div
        className="sun-rays-bottom pointer-events-none absolute inset-0 z-[1] transition-opacity duration-700"
        style={{ opacity: showDecor ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Top scrim — keeps the headline + captions readable over bright slides */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.3)_16%,rgba(0,0,0,0.1)_32%,transparent_44%)]"
        aria-hidden="true"
      />

      {/* Decorative 0/1 glyph field — fades out (not a hard cut) when the
          video takes over, and fades back in on the next image. */}
      <GlyphField active={showDecor} />

      {/* HERO CONTENT (flows on mobile, absolute on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* On mobile the column reserves bottom room (scaled to the wordmark's
            cqw height) so the caption cluster sits just above the wordmark. */}
        <div className="flex h-full flex-col gap-7 px-6 pt-[96px] pb-[calc(34px_+_16.5vw)] lg:block lg:p-0">
          {/* Headline */}
          <div className="lg:absolute lg:left-[100px] lg:top-[175px] lg:max-w-[640px]">
            <h1
              ref={headlineRef}
              className="hero-headline whitespace-nowrap text-[clamp(18px,7vw,40px)] font-medium leading-[1.12] tracking-[-1.1px] text-white opacity-0 md:whitespace-normal md:text-[45.66px] md:leading-[54.79px] md:tracking-[-1.83px]"
            >
              The future is built together.
              <br />
              The future is built now.
            </h1>
          </div>

          {/* Investment thesis — secondary side note */}
          <div className="lg:absolute lg:right-[100px] lg:top-[214px] lg:text-right">
            <p className="[font-family:var(--font-playfair)] text-[16px] font-normal leading-[1.3] tracking-[-0.1px] text-white/80 sm:text-[18px] lg:text-[30px] lg:leading-[1.12] lg:tracking-[-0.4px] lg:text-white/90">
              Investing in America&rsquo;s
              <br />
              companies and resurgence
              <br />
              <svg
                viewBox="0 0 19 10"
                role="img"
                aria-label="United States"
                className="mt-[0.25em] inline-block h-[1.2em] w-auto [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.5))]"
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
            {/* Mute control — under the note on tablet/desktop */}
            {playingVideo && renderMute("mt-3 hidden md:inline-flex lg:mt-4")}
          </div>

          {/* Cycling caption (links to product) + slide nav — pinned to the
              bottom (above the wordmark) on mobile, absolute on desktop */}
          <div className="mt-auto lg:absolute lg:left-[100px] lg:top-[330px] lg:mt-0 lg:max-w-[540px]">
            {/* Mobile unmute — above the caption so it never overlaps the wordmark */}
            {playingVideo && (
              <div className="mb-4 md:hidden">{renderMute("")}</div>
            )}
            <div
              className={cn(
                "flex items-start gap-[18px] transition-opacity duration-500 md:gap-[22px]",
                phase === "fade" ? "opacity-0" : "opacity-100",
              )}
            >
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
        className="pointer-events-auto absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center bg-black/35 text-white/90 ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-black/55 md:hidden"
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        onClick={() => go(active + 1)}
        aria-label="Next slide"
        className="pointer-events-auto absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center bg-black/35 text-white/90 ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-black/55 md:hidden"
      >
        <Chevron dir="right" />
      </button>

      {/* Giant wordmark + Capital lockup */}
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
