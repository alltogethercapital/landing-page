"use client";

import { MorphIcon } from "morphicons/react";
import { useEffect, useRef, useState } from "react";
import { UI_ICON_HOVER_PATHS, UI_ICON_PATHS, type UIIconName } from "@/lib/icon-paths";

type IconProps = { className?: string; animateOnHover?: boolean; active?: boolean };
const ICON_SPRING = { stiffness: 460, damping: 43 } as const;

/** One renderer, size and stroke for every interface icon. */
export function UIIcon({ name, className = "", animateOnHover = true, active = false }: IconProps & { name: UIIconName }) {
  if (animateOnHover && UI_ICON_HOVER_PATHS[name]) {
    return <HoverUIIcon name={name} className={className} active={active} />;
  }
  return <IconGlyph name={name} className={className} engaged={active} />;
}

function IconGlyph({ name, className, engaged = false }: { name: UIIconName; className: string; engaged?: boolean }) {
  return (
    <MorphIcon
      icon={engaged ? UI_ICON_HOVER_PATHS[name] ?? UI_ICON_PATHS[name] : UI_ICON_PATHS[name]}
      size={20}
      strokeWidth={1.5}
      spring={ICON_SPRING}
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeMiterlimit={3}
      reducedMotion="user"
      className={`morphicon ${className}`}
      data-icon={name}
      data-icon-hover={engaged ? "true" : undefined}
      aria-hidden="true"
      focusable="false"
    />
  );
}

function HoverUIIcon({ name, className, active }: { name: UIIconName; className: string; active: boolean }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const control = containerRef.current?.closest<HTMLElement>("button, a, [role='button']");
    if (!control) return;

    let hovered = window.matchMedia("(hover: hover)").matches && control.matches(":hover");
    let focused = control.matches(":focus-visible");
    const sync = () => setEngaged(hovered || focused);
    const initialFrame = hovered || focused ? window.requestAnimationFrame(sync) : 0;
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hovered = true;
      sync();
    };
    const leave = () => {
      hovered = false;
      sync();
    };
    const focus = () => {
      focused = control.matches(":focus-visible");
      sync();
    };
    const blur = () => {
      focused = false;
      sync();
    };

    control.addEventListener("pointerenter", enter);
    control.addEventListener("pointerleave", leave);
    control.addEventListener("pointercancel", leave);
    control.addEventListener("focus", focus);
    control.addEventListener("blur", blur);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      control.removeEventListener("pointerenter", enter);
      control.removeEventListener("pointerleave", leave);
      control.removeEventListener("pointercancel", leave);
      control.removeEventListener("focus", focus);
      control.removeEventListener("blur", blur);
    };
  }, []);

  return (
    <span ref={containerRef} style={{ display: "contents" }}>
      <IconGlyph name={name} className={className} engaged={active || engaged} />
    </span>
  );
}

export function XIcon(props: IconProps) { return <UIIcon name="x" {...props} />; }
export function LinkedInIcon(props: IconProps) { return <UIIcon name="linkedin" {...props} />; }
export function MailIcon(props: IconProps) { return <UIIcon name="mail" {...props} />; }
export function ArrowUpRight(props: IconProps) { return <UIIcon name="arrow-up-right" {...props} />; }
