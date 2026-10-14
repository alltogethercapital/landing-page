"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { UIIcon } from "@/components/icons";
import {
  DEFAULT_WORDMARK,
  WORDMARK_HEIGHT,
  WORDMARK_OPTIONS,
  WORDMARK_WIDTH,
  parseWordmark,
  type WordmarkId,
} from "@/lib/wordmark-options";

const STORAGE_KEY = "machine-spirit-wordmark-preview-v1";
const CHANGE_EVENT = "machine-spirit-wordmark-change";
const listeners = new Set<() => void>();
let sessionWordmark: WordmarkId | null = null;

function isLocalPreview() {
  return ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
}

function getWordmark(): WordmarkId {
  const requested = parseWordmark(new URLSearchParams(window.location.search).get("wordmark"));
  if (requested) return requested;
  if (!isLocalPreview()) return DEFAULT_WORDMARK;
  if (sessionWordmark) return sessionWordmark;
  try {
    const saved = parseWordmark(window.localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch {
    // The default and in-memory selection also work with storage disabled.
  }
  return DEFAULT_WORDMARK;
}

function getServerWordmark() { return DEFAULT_WORDMARK; }
function getServerPreview() { return false; }

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  sessionWordmark = null;
  notify();
}

/** One browser subscription serves every public, mobile and portal logo. */
function subscribe(onChange: () => void) {
  if (listeners.size === 0) {
    window.addEventListener(CHANGE_EVENT, notify);
    window.addEventListener("storage", onStorage);
    window.addEventListener("popstate", notify);
  }
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.removeEventListener(CHANGE_EVENT, notify);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("popstate", notify);
    }
  };
}

function rememberWordmark(id: WordmarkId) {
  sessionWordmark = id;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(id));
  } catch {
    // Keep the selected lettering for this browsing session.
  }
}

function chooseWordmark(id: WordmarkId) {
  rememberWordmark(id);
  const url = new URL(window.location.href);
  url.searchParams.set("wordmark", String(id));
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Only the lettering changes; LogoMark retains its current live wing symbol. */
export function WordmarkLettering() {
  const id = useSyncExternalStore(subscribe, getWordmark, getServerWordmark);
  const option = WORDMARK_OPTIONS[id - 1];

  return (
    <Image
      src={option.src}
      alt="MACHINE SPIRIT"
      width={WORDMARK_WIDTH}
      height={WORDMARK_HEIGHT}
      loading="eager"
      unoptimized
      className="cog-wordmark-lettering"
      data-wordmark={id}
    />
  );
}

export function WordmarkPreview() {
  const pathname = usePathname();
  const requestedWordmark = useSearchParams().get("wordmark");
  const id = useSyncExternalStore(subscribe, getWordmark, getServerWordmark);
  const preview = useSyncExternalStore(subscribe, isLocalPreview, getServerPreview);
  const option = WORDMARK_OPTIONS[id - 1];

  useEffect(() => {
    if (!preview) return;
    rememberWordmark(id);
    // Path and query-only app navigation can change a choice without popstate.
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [id, pathname, preview, requestedWordmark]);

  useEffect(() => {
    if (!preview) return;
    // Local previews keep both neighboring choices ready when the user flips.
    const neighbors = [
      WORDMARK_OPTIONS[(id + WORDMARK_OPTIONS.length - 2) % WORDMARK_OPTIONS.length],
      WORDMARK_OPTIONS[id % WORDMARK_OPTIONS.length],
    ];
    neighbors.forEach((neighbor) => {
      const image = new window.Image();
      image.src = neighbor.src;
    });
  }, [id, preview]);

  if (!preview) return null;

  return (
    <div className="site-wordmark-picker" role="group" aria-label="Logo lettering preview">
      <button
        type="button"
        aria-label="Previous logo lettering"
        onClick={() => chooseWordmark(WORDMARK_OPTIONS[(id + WORDMARK_OPTIONS.length - 2) % WORDMARK_OPTIONS.length].id)}
      >
        <UIIcon name="chevron-left" />
      </button>
      <span className="site-wordmark-picker-readout" role="status" aria-live="polite" aria-atomic="true">
        <small>Wordmark {id}/{WORDMARK_OPTIONS.length}</small>
        <span>{option.name}</span>
      </span>
      <button
        type="button"
        aria-label="Next logo lettering"
        onClick={() => chooseWordmark(WORDMARK_OPTIONS[id % WORDMARK_OPTIONS.length].id)}
      >
        <UIIcon name="chevron-right" />
      </button>
    </div>
  );
}
