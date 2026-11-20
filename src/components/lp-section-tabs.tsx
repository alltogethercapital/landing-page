"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type LpSectionKey = "investments" | "analysis" | "performance";

export type LpSectionTab = {
  key: LpSectionKey;
  label: string;
  content: ReactNode;
};

const SECTION_PARAM = "section";

function sectionFromUrl(tabs: LpSectionTab[]): LpSectionKey {
  const value = new URLSearchParams(window.location.search).get(SECTION_PARAM);
  return tabs.find((tab) => tab.key === value)?.key ?? tabs[0].key;
}

/**
 * Client-side tabs for the LP portfolio. Every panel is server-rendered once and
 * stays mounted, so switching is instant and nothing above the tab bar moves.
 * The active tab is mirrored to `?section=` without a navigation or scroll.
 */
export function LpSectionTabs({ tabs, initial }: { tabs: LpSectionTab[]; initial: LpSectionKey }) {
  const [active, setActive] = useState<LpSectionKey>(initial);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<LpSectionKey, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const tab = tabRefs.current.get(active);
    const list = listRef.current;
    if (!tab || !list) return;
    const inset = parseFloat(getComputedStyle(tab).paddingLeft) || 0;
    setIndicator({ left: tab.offsetLeft - list.scrollLeft + inset, width: tab.offsetWidth - inset * 2 });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const onPopState = () => setActive(sectionFromUrl(tabs));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [tabs]);

  const select = (key: LpSectionKey, focus = false) => {
    setActive(key);
    if (focus) tabRefs.current.get(key)?.focus();
    const url = new URL(window.location.href);
    if (key === tabs[0].key) url.searchParams.delete(SECTION_PARAM);
    else url.searchParams.set(SECTION_PARAM, key);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.key === active);
    const next =
      event.key === "ArrowRight" ? (index + 1) % tabs.length
        : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
          : event.key === "Home" ? 0
            : event.key === "End" ? tabs.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    select(tabs[next].key, true);
  };

  return (
    <div className="lp-tabs">
      <div
        ref={listRef}
        className="lp-tabs-list"
        role="tablist"
        aria-label="Portfolio sections"
        onKeyDown={onKeyDown}
        onScroll={measure}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={(node) => {
              if (node) tabRefs.current.set(tab.key, node);
              else tabRefs.current.delete(tab.key);
            }}
            type="button"
            role="tab"
            id={`lp-tab-${tab.key}`}
            aria-selected={tab.key === active}
            aria-controls={`lp-panel-${tab.key}`}
            tabIndex={tab.key === active ? 0 : -1}
            className="lp-tab"
            onClick={() => select(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <span
          className="lp-tabs-indicator"
          aria-hidden="true"
          style={indicator ? { transform: `translateX(${indicator.left}px)`, width: indicator.width } : { opacity: 0 }}
        />
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          id={`lp-panel-${tab.key}`}
          role="tabpanel"
          aria-labelledby={`lp-tab-${tab.key}`}
          className="lp-tab-panel"
          hidden={tab.key !== active}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
