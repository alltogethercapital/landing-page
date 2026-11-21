"use client";

import { useEffect, useId, useRef, useState } from "react";

// Small info tip for calculated figures: hover or keyboard focus on desktop,
// tap to toggle on touch. The bubble anchors to the nearest positioned
// ancestor (the table row), so cell overflow never clips it.
export function LpTip({ text, label, up = false }: { text: string; label: string; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof PointerEvent && ref.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  return (
    <span ref={ref} className={`lp-tip${open ? " is-open" : ""}${up ? " lp-tip--up" : ""}`}>
      <button
        type="button"
        className="lp-tip-trigger"
        aria-label={`About ${label}`}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="lp-tip-dot" aria-hidden="true">i</span>
      </button>
      <span role="tooltip" id={id} className="lp-tip-bubble">{text}</span>
    </span>
  );
}
