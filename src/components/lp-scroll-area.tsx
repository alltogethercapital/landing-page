"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

type OverflowEdges = {
  start: boolean;
  end: boolean;
};

function measure(element: HTMLElement): OverflowEdges {
  const max = Math.max(element.scrollWidth - element.clientWidth, 0);
  if (max <= 1) {
    if (element.scrollLeft !== 0) element.scrollLeft = 0;
    return { start: false, end: false };
  }
  return {
    start: element.scrollLeft > 1,
    end: element.scrollLeft < max - 1,
  };
}

export function LpScrollArea({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<OverflowEdges>({ start: false, end: false });

  const update = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const next = measure(view);
    setEdges((current) => (
      current.start === next.start && current.end === next.end ? current : next
    ));
  }, []);

  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.scrollLeft = 0;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(view);
    if (view.firstElementChild) observer.observe(view.firstElementChild);
    view.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      view.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div
      className={["lp-scroll-area", className].filter(Boolean).join(" ")}
      data-overflow-start={edges.start ? "true" : undefined}
      data-overflow-end={edges.end ? "true" : undefined}
    >
      <div className="lp-scroll-area-view" ref={viewRef}>
        {children}
      </div>
    </div>
  );
}
