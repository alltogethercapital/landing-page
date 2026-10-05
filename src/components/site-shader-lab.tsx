"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SITE_SHADER_OPTIONS } from "@/components/site-shader-options";

const SiteShaderLabCanvas = dynamic(
  () =>
    import("@/components/site-shader-lab-canvas").then(
      (module) => module.SiteShaderLabCanvas,
    ),
  { ssr: false },
);

const STORAGE_KEY = "all-together-shader-option";

type ShaderLabStyle = CSSProperties & {
  "--shader-background": string;
  "--shader-wash": string;
};

export function SiteShaderLab() {
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const option = SITE_SHADER_OPTIONS[index];
  const hidden = pathname.startsWith("/lp");

  const select = useCallback((nextIndex: number) => {
    const count = SITE_SHADER_OPTIONS.length;
    setIndex((nextIndex + count) % count);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (hidden) {
      delete document.documentElement.dataset.shaderLab;
      delete document.documentElement.dataset.shaderTone;
      return;
    }

    document.documentElement.dataset.shaderLab = "true";
    document.documentElement.dataset.shaderTone = option.tone;

    try {
      window.localStorage.setItem(STORAGE_KEY, String(index + 1));
    } catch {
      // The preview remains usable when storage is unavailable.
    }

    const url = new URL(window.location.href);
    url.searchParams.set("shader", String(index + 1));
    window.history.replaceState(window.history.state, "", url);

    return () => {
      delete document.documentElement.dataset.shaderLab;
      delete document.documentElement.dataset.shaderTone;
    };
  }, [hidden, index, option.tone]);

  useEffect(() => {
    if (hidden) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        select(index - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        select(index + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hidden, index, select]);

  const style = useMemo<ShaderLabStyle>(
    () => ({
      "--shader-background": option.background,
      "--shader-wash": String(option.wash),
    }),
    [option.background, option.wash],
  );

  if (hidden) return null;

  return (
    <>
      <div className="site-shader-lab" style={style} aria-hidden="true">
        <SiteShaderLabCanvas option={option} reducedMotion={reducedMotion} />
        <div className="site-shader-lab-wash" />
      </div>

      <div className="site-shader-lab-controls" role="group" aria-label="Shader options">
        <button
          type="button"
          className="site-shader-lab-button"
          aria-label="Previous shader"
          title="Previous shader"
          onClick={() => select(index - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <div className="site-shader-lab-readout" aria-live="polite">
          <span className="site-shader-lab-count">
            {option.id} / {SITE_SHADER_OPTIONS.length}
          </span>
          <span className="site-shader-lab-name">
            {option.paletteName} / {option.motionName}
          </span>
          <span className="site-shader-lab-swatches" aria-hidden="true">
            <span style={{ background: option.wave }} />
            <span style={{ background: option.dither }} />
          </span>
        </div>

        <button
          type="button"
          className="site-shader-lab-button"
          aria-label="Next shader"
          title="Next shader"
          onClick={() => select(index + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
