"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PORTFOLIO } from "@/lib/portfolio";
import { SoundOffIcon, SoundOnIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

// Each hero slide is a portfolio company. The image comes from the shared
// portfolio data; the background video is a local full-length MP4 so the hero
// never exposes third-party iframe chrome.
type Slide = {
  name: string;
  img: string;
  title: string;
  href: string;
  heroVideo?: string;
};

const SLIDE_COPY: Pick<
  Slide,
  "name" | "title" | "href" | "heroVideo"
>[] = [
  {
    name: "Shield AI",
    title: "Shield AI X-BAT",
    href: "https://shield.ai/x-bat/",
    heroVideo: "/hero-videos/shield-ai-xbat.mp4",
  },
  {
    name: "1X",
    title: "1X NEO",
    href: "https://www.1x.tech/",
    heroVideo: "/hero-videos/1x-neo-factory.mp4",
  },
  {
    name: "Figure AI",
    title: "Figure 03",
    href: "https://www.figure.ai/",
    heroVideo: "/hero-videos/figure-03.mp4",
  },
];

const SLIDES: Slide[] = SLIDE_COPY.map((c) => {
  const company = PORTFOLIO.find((p) => p.name === c.name);
  return {
    ...c,
    img: company?.image ?? "",
  };
});

const IMAGE_HOLD_MS = 2000; // show each company image for two seconds before video
const FADE_MS = 850; // crossfade from the ending video to the next company image

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

// ── Full-bleed native background video ──────────────────────
// Native video keeps the hero free of third-party iframe chrome, including the
// center play/pause overlay YouTube can paint inside its own frame.
function HeroVideoPlayer({
  src,
  muted,
  visible,
  onEnded,
  onRevealChange,
}: {
  src: string;
  muted: boolean;
  visible: boolean;
  onEnded: () => void;
  onRevealChange?: (revealed: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<number | undefined>(undefined);
  const doneRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const reveal = visible && playing;

  useEffect(() => {
    onRevealChange?.(reveal);
  }, [reveal, onRevealChange]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPlaying(false);
    onEnded();
  }, [onEnded]);

  const fadeVolumeTo = useCallback((target: number, ms = 400) => {
    const video = videoRef.current;
    if (!video) return;
    window.clearInterval(fadeRef.current);
    const start = video.volume;
    const steps = Math.max(1, Math.round(ms / 25));
    let i = 0;
    if (target > 0) video.muted = false;
    fadeRef.current = window.setInterval(() => {
      i += 1;
      const next = start + (target - start) * (i / steps);
      video.volume = Math.min(1, Math.max(0, next));
      if (i >= steps) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = undefined;
        video.volume = target;
        if (target === 0) video.muted = true;
      }
    }, 25);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    window.clearInterval(fadeRef.current);
    doneRef.current = false;
    setPlaying(false);

    if (!visible) {
      video.pause();
      video.currentTime = 0;
      video.volume = 0;
      video.muted = true;
      onRevealChange?.(false);
      return;
    }

    video.currentTime = 0;
    video.volume = 0;
    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => {
        video.muted = true;
        video.volume = 0;
        video.play().catch(finish);
      });
    }

    return () => {
      window.clearInterval(fadeRef.current);
      video.pause();
    };
  }, [finish, onRevealChange, src, visible]);

  useEffect(() => {
    if (!visible || !playing) return;
    fadeVolumeTo(muted ? 0 : 1, muted ? 250 : 700);
  }, [fadeVolumeTo, muted, playing, visible]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] bg-black",
        reveal ? "opacity-100" : "opacity-0",
        (reveal || !visible) && "transition-opacity duration-700 ease-in-out",
      )}
    >
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 size-full object-cover"
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        onPlaying={() => setPlaying(true)}
        onCanPlay={() => {
          const video = videoRef.current;
          if (visible && video && !video.paused) setPlaying(true);
        }}
        onPause={() => {
          const video = videoRef.current;
          if (!visible || !video || video.ended) return;
          video.play().catch(() => undefined);
        }}
        onEnded={finish}
        onError={finish}
      />
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
  // Whether the native video has visually revealed (faded in) for the current
  // slide — keeps atmosphere layers on screen until the video actually appears,
  // not just when the phase flips internally.
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
  // Atmosphere layers stay on screen while the image is visible and fade once
  // the native video has actually revealed.
  const showDecor = phase === "image" || (phase === "video" && !revealed);
  // During the end "fade", show the NEXT company's image underneath the video
  // (which is fading out), so it crossfades video -> next image seamlessly.
  const shownImage = phase === "fade" ? (active + 1) % SLIDES.length : active;

  const go = (i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
    setPhase("image");
  };

  // Touch swipe — mobile users flick left/right to advance / go back, like
  // Instagram. Snap-on-release; the actual visual transition is the same
  // horizontal slide that the auto-cycle uses (see the image strip below).
  // Require a clear horizontal motion (>40px and more horizontal than
  // vertical) so vertical scrolling still works.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onSwipeStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };
  const onSwipeEnd = (e: React.TouchEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? active + 1 : active - 1);
    }
  };

  // Per company: image → video → "fade" (crossfade to the NEXT company).
  // The video phase advances on the native ended event, with no wall-clock cap,
  // so full clips play through before the next slide.
  useEffect(() => {
    if (phase === "video") return;
    const id = setTimeout(
      () => {
        if (phase === "image" && slide.heroVideo) {
          setPhase("video");
        } else {
          setActive((i) => (i + 1) % SLIDES.length);
          setPhase("image");
        }
      },
      phase === "image" ? IMAGE_HOLD_MS : FADE_MS,
    );
    return () => clearTimeout(id);
  }, [phase, active, slide.heroVideo]);

  const handleVideoEnd = useCallback(() => setPhase("fade"), []);

  // Each time a company's video begins while the hero is still muted, briefly
  // flash the audio button orange — a quick "sound is available here" nudge.
  // It only fires while muted, so it stops nagging the moment the user unmutes.
  useEffect(() => {
    if (phase !== "video" || !muted) return;
    const show = window.setTimeout(() => setFlash(true), 0);
    const hide = window.setTimeout(() => setFlash(false), 1500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [phase, muted]);

  // Audio toggle — small and glassy, used inside the compact slide rail.
  const renderMute = (extra: string) => (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Unmute video" : "Mute video"}
      className={cn(
        "pointer-events-auto inline-flex size-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white/85 backdrop-blur-sm [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.55))] transition-colors duration-200 hover:border-[#ff4400]/70 hover:bg-black/45 hover:text-[#ff4400]",
        flash && "unmute-flash",
        extra,
      )}
    >
      {muted ? (
        <SoundOffIcon className="size-6" />
      ) : (
        <SoundOnIcon className="size-6" />
      )}
    </button>
  );

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black text-white"
      onTouchStart={onSwipeStart}
      onTouchEnd={onSwipeEnd}
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

      {/* Cycling background photos — horizontal strip. The whole strip
          translates by `shownImage * 100%` so every transition reads as a
          smooth horizontal slide (Instagram-style) on auto-cycle AND on
          mobile swipe. */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <div
          className="flex h-full w-full transition-transform duration-[450ms] ease-out"
          style={{ transform: `translateX(-${shownImage * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div key={s.img} className="relative h-full w-full shrink-0">
              <Image
                src={s.img}
                alt=""
                fill
                priority={i === 0}
                quality={90}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Full-bleed video — starts after the two-second image hold and advances
          only when the full native file ends. */}
      {slide.heroVideo && (
        <HeroVideoPlayer
          key={slide.name}
          src={slide.heroVideo}
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

      {/* HERO CONTENT (flows on mobile, absolute on md+) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="h-full">
          {/* Headline */}
          <div className="hero-headline-wrap absolute top-[clamp(116px,14svh,152px)] right-6 left-6 max-w-[560px] md:top-[clamp(122px,12svh,160px)] md:right-auto md:left-[var(--site-frame-x)] md:max-w-[640px] lg:top-[175px] lg:left-[var(--hero-frame-x)]">
            <h1
              ref={headlineRef}
              className="hero-headline whitespace-nowrap text-[clamp(19px,5.8vw,34px)] font-medium leading-[1.18] tracking-normal text-white opacity-0 [text-shadow:0_1px_16px_rgba(0,0,0,0.5)] md:whitespace-normal md:text-[38px] md:leading-[1.14]"
            >
              The future is built together.
              <br />
              The future is built now.
            </h1>

            {/* Investment thesis — flag + two-line text lockup, left-aligned
                under the main headline. */}
            <div className="hero-thesis-wrap mt-7 inline-flex max-w-[520px] items-center gap-[0.55em] text-[14px] sm:text-[16px] md:mt-8 md:text-[17px] lg:text-[16px]">
              {/* US flag — to the left of the text, sized to span the full
                  two-line block so its top/bottom align with the text. */}
              <svg
                viewBox="0 0 19 10"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="United States"
                className="h-[2em] w-auto shrink-0 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.5))]"
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
              <p className="[font-family:var(--font-playfair)] font-normal leading-[1.3] tracking-normal text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] lg:leading-[1.16]">
                Investing in America&rsquo;s companies,
                <br />
                resurgence, and future.
              </p>
            </div>
          </div>

          {/* Compact slide rail — kept out of the center so the footage breathes. */}
          <div className="hero-caption-wrap absolute right-4 bottom-[calc(16.5vw_+_92px)] z-20 md:right-[var(--site-frame-x)] md:bottom-[calc(min(16.5vw,27svh)_+_96px)] lg:right-[var(--hero-frame-x)] lg:bottom-[calc(min(16.5vw,27svh)_+_76px)]">
            <div
              className={cn(
                "pointer-events-auto flex w-[258px] max-w-[calc(100vw-32px)] items-center gap-1 rounded-full border border-white/15 bg-black/25 px-1.5 py-1.5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md transition-opacity duration-500",
                phase === "fade" ? "opacity-0" : "opacity-100",
              )}
            >
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous slide"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-[#ff4400]"
              >
                <Chevron dir="left" className="size-5" />
              </button>

              <a
                key={active}
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${slide.name} — visit site`}
                className="min-w-0 flex-1 px-2 text-center text-[12px] font-medium leading-none text-white/90 transition-colors hover:text-[#ff4400] md:text-[13px]"
              >
                <span className="block truncate">{slide.title}</span>
              </a>

              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next slide"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-[#ff4400]"
              >
                <Chevron dir="right" className="size-5" />
              </button>

              <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-white/15" />
              {renderMute(
                "size-8 border-0 bg-transparent text-white/80 backdrop-blur-none [filter:none] hover:bg-white/10 hover:text-[#ff4400]",
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Giant wordmark + Capital lockup */}
      <div className="pointer-events-none absolute inset-x-[var(--site-frame-x)] bottom-[22px] z-[8] mx-auto max-w-[1920px] [container-type:inline-size] max-md:inset-x-3 max-md:bottom-2">
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
    </section>
  );
}
