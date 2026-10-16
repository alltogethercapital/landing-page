"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { HERO_STYLES } from "@/lib/hero-styles";
import { UIIcon } from "@/components/icons";
import "@/app/hero-style-picker.css";

type HeroStylePickerProps = {
  value: number;
  onChange: (value: number) => void;
  paused: boolean;
  onTogglePause?: () => void;
};

/** Temporary audition controls; the selected treatment belongs to the hero. */
export function HeroStylePicker({ value, onChange, paused, onTogglePause }: HeroStylePickerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const selectId = useId();
  const descriptionId = useId();
  const selectRef = useRef<HTMLSelectElement>(null);
  const collapsedRef = useRef<HTMLButtonElement>(null);
  const index = Math.max(0, Math.min(HERO_STYLES.length - 1, value));
  const style = HERO_STYLES[index];
  const count = `${String(index + 1).padStart(2, "0")} / ${HERO_STYLES.length}`;

  function step(direction: number) {
    onChange((index + direction + HERO_STYLES.length) % HERO_STYLES.length);
  }

  function minimize() {
    setCollapsed(true);
    window.requestAnimationFrame(() => collapsedRef.current?.focus({ preventScroll: true }));
  }

  function expand() {
    setCollapsed(false);
    window.requestAnimationFrame(() => selectRef.current?.focus({ preventScroll: true }));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && !collapsed) {
      event.preventDefault();
      minimize();
      return;
    }
    // The native select owns its arrow keys; buttons can cycle without a mouse.
    if (event.target instanceof HTMLSelectElement) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  if (!style) return null;

  return (
    <aside
      className={`hero-style-picker${collapsed ? " hero-style-picker--collapsed" : ""}`}
      aria-label="Hero style preview"
      onKeyDown={handleKeyDown}
    >
      {collapsed ? (
        <button
          ref={collapsedRef}
          className="hero-style-picker__restore"
          type="button"
          onClick={expand}
          aria-label={`Show hero style options. Current: ${style.name}, ${count}`}
          aria-expanded="false"
        >
          <span>Hero <span className="hero-style-picker__count">{count}</span></span>
          <UIIcon name="arrow-up" />
        </button>
      ) : (
        <>
          <div className="hero-style-picker__heading">
            <label htmlFor={selectId}>Hero studies</label>
            <span className="hero-style-picker__count" aria-hidden="true">{count}</span>
            {onTogglePause && (
              <button
                className="hero-style-picker__button hero-style-picker__playback"
                type="button"
                onClick={onTogglePause}
                aria-label={paused ? "Play hero video" : "Pause hero video"}
                title={paused ? "Play" : "Pause to compare styles"}
              >
                <UIIcon name={paused ? "play" : "pause"} />
              </button>
            )}
            <button
              className="hero-style-picker__button hero-style-picker__minimize"
              type="button"
              onClick={minimize}
              aria-label="Minimize hero style options"
              title="Minimize"
            >
              <UIIcon name="close" animateOnHover />
            </button>
          </div>
          <div className="hero-style-picker__controls">
            <button
              className="hero-style-picker__button"
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous hero style"
              title="Previous style"
            >
              <UIIcon name="chevron-left" />
            </button>
            <div className="hero-style-picker__select-wrap">
              <select
                ref={selectRef}
                id={selectId}
                className="hero-style-picker__select"
                value={index}
                onChange={(event) => onChange(Number(event.target.value))}
                aria-describedby={descriptionId}
              >
                {HERO_STYLES.map((option, optionIndex) => (
                  <option key={option.id} value={optionIndex}>
                    {String(optionIndex + 1).padStart(2, "0")} · {option.name}
                  </option>
                ))}
              </select>
              <UIIcon name="chevron-down" className="hero-style-picker__select-icon" />
            </div>
            <button
              className="hero-style-picker__button"
              type="button"
              onClick={() => step(1)}
              aria-label="Next hero style"
              title="Next style"
            >
              <UIIcon name="chevron-right" />
            </button>
          </div>
          <p
            className="hero-style-picker__description"
            id={descriptionId}
            title={style.description}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="hero-style-picker__sr-only">{style.name}. </span>
            {style.description}
          </p>
        </>
      )}
    </aside>
  );
}
