"use client";

import { useEffect, useRef, useState } from "react";
import { UIIcon } from "@/components/icons";

// Portfolio header label with an info tooltip: hover or focus on desktop,
// tap to toggle on touch.
export function LpMetricLabel({ label, description, tooltipId }: { label: string; description: string; tooltipId: string }) {
  const [open, setOpen] = useState(false);
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
    <span className="lp-summary-label">
      <span>{label}</span>
      <span
        ref={ref}
        className={`lp-summary-term${open ? " is-open" : ""}`}
        tabIndex={0}
        role="button"
        aria-label={`About ${label}`}
        aria-describedby={tooltipId}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="lp-summary-info" aria-hidden="true"><UIIcon name="info" /></span>
        <span className="lp-summary-tooltip" id={tooltipId} role="tooltip">
          {description}
        </span>
      </span>
    </span>
  );
}
