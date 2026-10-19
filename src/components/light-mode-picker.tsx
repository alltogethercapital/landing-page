"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { UIIcon } from "@/components/icons";
import { setSiteTheme } from "@/components/site-appearance";
import { getLightModeOption, LIGHT_MODE_CHANGE_EVENT, LIGHT_MODE_OPTIONS, LIGHT_MODE_STORAGE_KEY } from "@/lib/light-mode-options";

function getSnapshot() {
  const root = document.documentElement;
  return root.dataset.lightPreview === "true" ? root.dataset.lightOption ?? "1" : "";
}

function getServerSnapshot() { return ""; }

function subscribe(onChange: () => void) {
  const onNavigation = () => {
    const requested = new URLSearchParams(window.location.search).get("light");
    const requestedOption = getLightModeOption(requested);
    if (requestedOption) {
      document.documentElement.dataset.lightOption = requestedOption.id;
      document.documentElement.dataset.lightPreview = "true";
    }
    onChange();
  };
  window.addEventListener(LIGHT_MODE_CHANGE_EVENT, onChange);
  window.addEventListener("popstate", onNavigation);
  return () => {
    window.removeEventListener(LIGHT_MODE_CHANGE_EVENT, onChange);
    window.removeEventListener("popstate", onNavigation);
  };
}

export function LightModePicker() {
  const pathname = usePathname();
  const id = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [collapsed, setCollapsed] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const index = LIGHT_MODE_OPTIONS.findIndex((option) => option.id === id);
  const option = LIGHT_MODE_OPTIONS[Math.max(0, index)];

  // Keep the preview available while following the site's ordinary navigation.
  useEffect(() => {
    if (!id) return;
    const url = new URL(window.location.href);
    url.searchParams.set("light", id);
    url.searchParams.set("theme", document.documentElement.dataset.siteTheme ?? "light");
    window.history.replaceState(window.history.state, "", url);
  }, [id, pathname]);

  if (!id) return null;

  function select(nextIndex: number) {
    const next = LIGHT_MODE_OPTIONS[(nextIndex + LIGHT_MODE_OPTIONS.length) % LIGHT_MODE_OPTIONS.length];
    document.documentElement.dataset.lightOption = next.id;
    try { window.sessionStorage.setItem(LIGHT_MODE_STORAGE_KEY, next.id); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("light", next.id);
    url.searchParams.set("theme", "light");
    window.history.replaceState(window.history.state, "", url);
    setSiteTheme("light");
    setCopyStatus("");
    window.dispatchEvent(new Event(LIGHT_MODE_CHANGE_EVENT));
  }

  function exit() {
    const root = document.documentElement;
    root.dataset.lightOption = "1";
    delete root.dataset.lightPreview;
    try { window.sessionStorage.removeItem(LIGHT_MODE_STORAGE_KEY); } catch {}
    const url = new URL(window.location.href);
    url.searchParams.delete("light");
    window.history.replaceState(window.history.state, "", url);
    setSiteTheme("light");
    window.dispatchEvent(new Event(LIGHT_MODE_CHANGE_EVENT));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Use address bar");
    }
  }

  return (
    <section className="light-mode-picker" aria-label="Light mode previews">
      <div className="light-mode-picker-top">
        <span aria-live="polite">Light mode {id.padStart(2, "0")} / 10</span>
        <div className="light-mode-picker-tools">
          <button type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand light mode picker" : "Minimize light mode picker"} aria-expanded={!collapsed}>
            <UIIcon name="chevron-down" className={collapsed ? "is-collapsed" : ""} />
          </button>
          <button type="button" onClick={exit} aria-label="Exit previews and return to Stone / Ink" title="Return to the default light mode"><UIIcon name="close" /></button>
        </div>
      </div>
      {!collapsed && <>
        <div className="light-mode-picker-selection">
          <button type="button" onClick={() => select(index - 1)} aria-label="Previous light mode"><UIIcon name="chevron-left" /></button>
          <select value={id} onChange={(event) => select(LIGHT_MODE_OPTIONS.findIndex((item) => item.id === event.target.value))} aria-label="Choose a light mode">
            {LIGHT_MODE_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.id.padStart(2, "0")} · {item.name}</option>)}
          </select>
          <button type="button" onClick={() => select(index + 1)} aria-label="Next light mode"><UIIcon name="chevron-right" /></button>
        </div>
        <p>{option.note}</p>
        <div className="light-mode-picker-bottom">
          <span className="light-mode-picker-swatches" aria-hidden="true"><i style={{ background: option.bg }} /><i style={{ background: option.ink }} /><i style={{ background: option.muted }} /></span>
          <button type="button" onClick={copyLink}>{copyStatus || "Copy link"}</button>
        </div>
      </>}
    </section>
  );
}
