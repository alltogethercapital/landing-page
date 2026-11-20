"use client";

import { useState, type CSSProperties } from "react";

export type LpAllocationSlice = {
  key: string;
  label: string;
  amount: number;
};

export type LpAllocationView = {
  key: string;
  label: string;
  slices: LpAllocationSlice[];
};

const RADIUS = 42;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 0.5;

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

// Grayscale ramp: the largest slice is darkest. "Other" always sits lightest.
function shade(index: number, count: number) {
  if (count <= 1) return 82;
  return Math.round(82 - (index / (count - 1)) * 66);
}

export function LpAllocationDonut({ views, positionCount }: { views: LpAllocationView[]; positionCount: number }) {
  const [viewKey, setViewKey] = useState(views[0]?.key);
  const [active, setActive] = useState<string | null>(null);
  const view = views.find((item) => item.key === viewKey) ?? views[0];
  if (!view) return null;

  const total = view.slices.reduce((sum, slice) => sum + slice.amount, 0);
  const activeSlice = view.slices.find((slice) => slice.key === active);
  const lengths = view.slices.map((slice) => (slice.amount / total) * CIRCUMFERENCE);
  const arcs = view.slices.map((slice, index) => ({
    ...slice,
    share: slice.amount / total,
    dash: Math.max(lengths[index] - GAP, 0.01),
    offset: lengths.slice(0, index).reduce((sum, length) => sum + length, 0),
    tone: shade(index, view.slices.length),
  }));

  return (
    <section className="lp-allocation" aria-labelledby="lp-allocation-heading">
      <header className="lp-allocation-head">
        <h2 id="lp-allocation-heading">Allocation</h2>
        {views.length > 1 && (
          <div className="lp-allocation-toggle" role="group" aria-label="Allocation view">
            {views.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={item.key === view.key}
                onClick={() => {
                  setViewKey(item.key);
                  setActive(null);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="lp-allocation-body">
        <div className="lp-allocation-chart">
          <svg viewBox="0 0 120 120" role="img" aria-label={`Allocation ${view.label.toLowerCase()}`}>
            <g transform="rotate(-90 60 60)">
              {arcs.map((arc) => (
                <circle
                  key={arc.key}
                  className="lp-allocation-arc"
                  data-active={active === arc.key ? "true" : undefined}
                  data-dim={active && active !== arc.key ? "true" : undefined}
                  cx="60"
                  cy="60"
                  r={RADIUS}
                  fill="none"
                  strokeWidth={STROKE}
                  strokeDasharray={`${arc.dash} ${CIRCUMFERENCE - arc.dash}`}
                  strokeDashoffset={-arc.offset}
                  style={{ "--lp-allocation-tone": `${arc.tone}%` } as CSSProperties}
                  onMouseEnter={() => setActive(arc.key)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(active === arc.key ? null : arc.key)}
                >
                  <title>{`${arc.label} · ${currency(arc.amount)} · ${percent(arc.share)}`}</title>
                </circle>
              ))}
            </g>
          </svg>
          <div className="lp-allocation-center" aria-live="polite">
            {activeSlice ? (
              <>
                <span className="lp-allocation-center-label">{activeSlice.label}</span>
                <strong>{currency(activeSlice.amount)}</strong>
                <span className="lp-allocation-center-share">{percent(activeSlice.amount / total)}</span>
              </>
            ) : (
              <>
                <strong>{positionCount}</strong>
                <span className="lp-allocation-center-label">positions</span>
              </>
            )}
          </div>
        </div>

        <ol className="lp-allocation-legend">
          {arcs.map((arc) => (
            <li
              key={arc.key}
              data-active={active === arc.key ? "true" : undefined}
              onMouseEnter={() => setActive(arc.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(arc.key)}
              onBlur={() => setActive(null)}
              tabIndex={0}
            >
              <span
                className="lp-allocation-swatch"
                aria-hidden="true"
                style={{ "--lp-allocation-tone": `${arc.tone}%` } as CSSProperties}
              />
              <span className="lp-allocation-name" title={arc.label}>{arc.label}</span>
              <span className="lp-allocation-amount">{currency(arc.amount)}</span>
              <span className="lp-allocation-share">{percent(arc.share)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
