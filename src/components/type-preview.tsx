"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { UIIcon } from "@/components/icons";
import { getTypeFont, type FontId } from "@/lib/type-fonts";
import { TYPE_OPTIONS, type TypeTag } from "@/lib/type-options";

const SESSION_KEY = "machine-spirit-type-preview";
const FAVORITES_KEY = "machine-spirit-type-favorites";
const FONT_PROPERTIES = ["--preview-heading", "--preview-nav", "--preview-body"];
const TAGS: TypeTag[] = ["Minimal", "Technical", "Mono", "Editorial", "Expressive"];
const fontLoads = new Map<FontId, Promise<void>>();

function parseOption(value: string | null): number | null {
  if (!value || !/^\d{1,3}$/.test(value)) return null;
  const id = Number(value);
  return id >= 0 && id <= TYPE_OPTIONS.length ? id : null;
}

function fontStack(id: FontId) {
  const font = getTypeFont(id);
  return `"${font.family}", ${font.kind === "mono" ? 'ui-monospace, "SF Mono", monospace' : 'Arial, sans-serif'}`;
}

function loadFont(id: FontId): Promise<void> {
  const existing = fontLoads.get(id);
  if (existing) return existing;
  const font = getTypeFont(id);
  const pending = new FontFace(font.family, `url("${font.file}")`, {
    weight: font.weight,
    style: "normal",
    display: "swap",
  }).load().then((face) => {
    document.fonts.add(face);
  }).catch((error: unknown) => {
    fontLoads.delete(id);
    throw error;
  });
  fontLoads.set(id, pending);
  return pending;
}

/** Opt-in via ?type=1. A session keeps the comparison active between pages. */
export function TypePreview() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filter, setFilter] = useState<"All" | "Saved" | TypeTag>("All");
  const [collapsed, setCollapsed] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState<{ id: number; message: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const option = TYPE_OPTIONS[selectedId - 1];
  const visibleOptions = useMemo(() => TYPE_OPTIONS.filter((item) =>
    filter === "All" || (filter === "Saved" ? favorites.includes(item.id) : item.tag === filter),
  ), [filter, favorites]);
  const selectedIsVisible = visibleOptions.some((item) => item.id === selectedId);
  const saved = favorites.includes(selectedId);
  const pending = enabled && appliedId !== selectedId && error?.id !== selectedId;

  useEffect(() => {
    const initialize = () => {
      const requested = parseOption(new URLSearchParams(window.location.search).get("type"));
      let stored: number | null = null;
      try {
        stored = parseOption(window.sessionStorage.getItem(SESSION_KEY));
        const list: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
        if (Array.isArray(list)) {
          setFavorites([...new Set(list.filter((id): id is number =>
            typeof id === "number" && Number.isInteger(id) && id >= 1 && id <= 200,
          ))]);
        }
      } catch { /* The preview also works without browser storage. */ }
      const id = requested ?? stored;
      if (id !== null) {
        setSelectedId(id);
        setEnabled(true);
      }
    };
    const frame = window.requestAnimationFrame(initialize);
    const onPopState = () => {
      const id = parseOption(new URLSearchParams(window.location.search).get("type"));
      if (id !== null) {
        setSelectedId(id);
        setEnabled(true);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const apply = () => {
      if (cancelled) return;
      const root = document.documentElement;
      if (selectedId === 0) {
        for (const property of FONT_PROPERTIES) {
          document.body.style.setProperty(property, 'var(--font-space-grotesk), Arial, sans-serif');
        }
        root.dataset.typeHeadingKind = "sans";
      } else {
        document.body.style.setProperty("--preview-heading", fontStack(option.heading));
        document.body.style.setProperty("--preview-nav", fontStack(option.nav));
        document.body.style.setProperty("--preview-body", fontStack(option.body));
        root.dataset.typeHeadingKind = getTypeFont(option.heading).kind;
      }
      root.dataset.typePreview = String(selectedId);
      setAppliedId(selectedId);
      setError((current) => current?.id === selectedId ? null : current);
    };
    if (selectedId === 0) {
      const frame = window.requestAnimationFrame(apply);
      return () => { cancelled = true; window.cancelAnimationFrame(frame); };
    }
    void Promise.all([...new Set([option.heading, option.nav, option.body])].map(loadFont))
      .then(apply)
      .catch(() => {
        if (!cancelled) setError({ id: selectedId, message: "This option could not load. Try another." });
      });
    return () => { cancelled = true; };
  }, [enabled, option, selectedId]);

  useEffect(() => {
    if (!enabled) return;
    const url = new URL(window.location.href);
    url.searchParams.set("type", String(selectedId));
    window.history.replaceState(window.history.state, "", url);
    try { window.sessionStorage.setItem(SESSION_KEY, String(selectedId)); } catch { /* Optional. */ }
  }, [enabled, selectedId, pathname]);

  useEffect(() => {
    if (!enabled || !panelRef.current) return;
    const panel = panelRef.current;
    const measure = () => document.body.style.setProperty("--type-preview-space", `${Math.ceil(panel.getBoundingClientRect().height) + 36}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    measure();
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!copyMessage) return;
    const timer = window.setTimeout(() => setCopyMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [copyMessage]);

  useEffect(() => () => {
    delete document.documentElement.dataset.typePreview;
    delete document.documentElement.dataset.typeHeadingKind;
    for (const property of [...FONT_PROPERTIES, "--type-preview-space"]) document.body.style.removeProperty(property);
  }, []);

  function cycle(direction: -1 | 1) {
    if (!visibleOptions.length) return;
    const current = visibleOptions.findIndex((item) => item.id === selectedId);
    const next = current < 0 ? (direction === 1 ? 0 : visibleOptions.length - 1)
      : (current + direction + visibleOptions.length) % visibleOptions.length;
    setSelectedId(visibleOptions[next].id);
  }

  function toggleFavorite() {
    if (!selectedId) return;
    const next = saved ? favorites.filter((id) => id !== selectedId) : [...favorites, selectedId].sort((a, b) => a - b);
    setFavorites(next);
    try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* Optional. */ }
  }

  function closePreview() {
    setEnabled(false);
    delete document.documentElement.dataset.typePreview;
    delete document.documentElement.dataset.typeHeadingKind;
    for (const property of [...FONT_PROPERTIES, "--type-preview-space"]) document.body.style.removeProperty(property);
    try { window.sessionStorage.removeItem(SESSION_KEY); } catch { /* Optional. */ }
    const url = new URL(window.location.href);
    url.searchParams.delete("type");
    window.history.replaceState(window.history.state, "", url);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMessage("Copied");
    } catch { setCopyMessage("Use the address bar to copy"); }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("select, input, textarea, [contenteditable]")) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      cycle(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  if (!enabled) return null;

  return (
    <div className="type-preview" ref={panelRef} onKeyDown={onKeyDown} role="region" aria-label="Typography preview">
      {collapsed ? (
        <button className="type-preview-reopen" onClick={() => setCollapsed(false)}>
          Fonts · {selectedId === 0 ? "Original" : `${selectedId} / 200`} <UIIcon name="chevron-right" />
        </button>
      ) : (
        <>
          <div className="type-preview-top">
            <p className="type-preview-label">Typography <span>{selectedId === 0 ? "Original" : `${String(selectedId).padStart(3, "0")} / 200`}</span></p>
            <div className="type-preview-actions">
              <button onClick={toggleFavorite} disabled={!selectedId} aria-label={saved ? "Unsave font combination" : "Save font combination"} aria-pressed={saved}>
                <UIIcon name={saved ? "favorite-filled" : "favorite"} />
              </button>
              <button onClick={() => setCollapsed(true)} aria-label="Collapse font controls"><UIIcon name="chevron-down" /></button>
              <button onClick={closePreview} aria-label="Exit font preview"><UIIcon name="close" /></button>
            </div>
          </div>
          <div className="type-preview-cycle">
            <button onClick={() => cycle(-1)} disabled={!visibleOptions.length} aria-label="Previous font combination"><UIIcon name="chevron-left" /></button>
            <select aria-label="Choose font combination" value={selectedId} onChange={(event) => setSelectedId(Number(event.target.value))}>
              <option value={0}>Original site font</option>
              {!selectedIsVisible && selectedId > 0 && <option value={selectedId} hidden>{selectedId}. {option.name}</option>}
              {visibleOptions.map((item) => <option key={item.id} value={item.id}>{String(item.id).padStart(3, "0")} · {item.name}</option>)}
            </select>
            <button onClick={() => cycle(1)} disabled={!visibleOptions.length} aria-label="Next font combination"><UIIcon name="chevron-right" /></button>
          </div>
          <p className="type-preview-roles">
            <span><small>Head</small> {selectedId ? getTypeFont(option.heading).name : "Space Grotesk"}</span>
            <span><small>Nav</small> {selectedId ? getTypeFont(option.nav).name : "Space Grotesk"}</span>
            <span><small>Text</small> {selectedId ? getTypeFont(option.body).name : "Space Grotesk"}</span>
          </p>
          <div className="type-preview-bottom">
            <select aria-label="Filter font combinations" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
              <option value="All">All 200</option>
              <option value="Saved">Saved ({favorites.length})</option>
              {TAGS.map((tag) => <option key={tag}>{tag}</option>)}
            </select>
            <button onClick={() => setSelectedId(0)}>Original</button>
            <button onClick={copyLink}>{copyMessage || "Copy link"}</button>
          </div>
          <p className="type-preview-status" role="status" aria-live="polite">
            {pending ? "Loading fonts…" : error?.id === selectedId ? error.message : filter === "Saved" && !visibleOptions.length ? "Star a combination to save it here." : selectedId ? option.note : "The current site font, for comparison."}
          </p>
        </>
      )}
    </div>
  );
}
