"use client";

import { play, type SoundName } from "cuelume";
import { useEffect } from "react";

const NAVIGATION_LINK_SELECTOR = "a[href]";
const NAVIGATION_VOLUME = 0.18;
const EMAIL_VOLUME = 0.22;

type NavigationCue = {
  name: SoundName;
  volume: number;
};

function getNavigationCue(target: EventTarget | null): NavigationCue | null {
  if (!(target instanceof Element)) return null;

  const link = target.closest<HTMLAnchorElement>(NAVIGATION_LINK_SELECTOR);
  if (!link || link.getAttribute("aria-disabled") === "true") return null;

  const href = link.getAttribute("href")?.trim();
  if (!href || href === "#") return null;

  return href.toLowerCase().startsWith("mailto:")
    ? { name: "whisper", volume: EMAIL_VOLUME }
    : { name: "press", volume: NAVIGATION_VOLUME };
}

function playNavigationCue(target: EventTarget | null) {
  const cue = getNavigationCue(target);
  if (cue) play(cue.name, { volume: cue.volume });
}

export function SiteInteractionSounds() {
  useEffect(() => {
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (event.button !== 0) return;
      playNavigationCue(event.target);
    };

    const handleKeyboardClick = (event: MouseEvent) => {
      if (event.detail !== 0) return;
      playNavigationCue(event.target);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", handleKeyboardClick, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", handleKeyboardClick, true);
    };
  }, []);

  return null;
}
