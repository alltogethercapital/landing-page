import { createMorph } from "./vendor/morphicons/dom.js";
import { UI_ICON_PATHS } from "./gallery-icon-paths.js";

const drivers = new Map();

export function icon(name, hoverName) {
  const path = UI_ICON_PATHS[name];
  if (!path) throw new Error(`Unknown gallery icon: ${name}`);
  return `<svg class="ui-icon" data-icon="${name}"${hoverName ? ` data-hover-icon="${hoverName}"` : ""} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
}

export function setIcon(element, name, animate = true) {
  const svg = element.matches("[data-icon]") ? element : element.querySelector("[data-icon]");
  if (!svg) return;
  const path = UI_ICON_PATHS[name];
  if (!path) throw new Error(`Unknown gallery icon: ${name}`);
  svg.dataset.icon = name;
  const record = drivers.get(svg);
  if (record) {
    if (animate) record.driver.morphTo(path, "smooth");
    else record.driver.set(path);
  } else {
    svg.querySelector("path").setAttribute("d", path);
  }
}

export function destroyIcons(root) {
  for (const [svg, record] of drivers) {
    if (!root.contains(svg)) continue;
    record.driver.destroy();
    record.cleanup();
    drivers.delete(svg);
  }
}

export function mountIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((svg) => {
    if (drivers.has(svg)) return;
    const driver = createMorph(svg.querySelector("path"), UI_ICON_PATHS[svg.dataset.icon], { reducedMotion: "user" });
    const control = svg.closest("button, a");
    const hover = () => {
      if (svg.dataset.hoverIcon && !control?.disabled) driver.morphTo(UI_ICON_PATHS[svg.dataset.hoverIcon], "smooth");
    };
    const rest = () => driver.morphTo(UI_ICON_PATHS[svg.dataset.icon], "smooth");
    if (control && svg.dataset.hoverIcon) {
      control.addEventListener("pointerenter", hover);
      control.addEventListener("pointerleave", rest);
      control.addEventListener("focus", hover);
      control.addEventListener("blur", rest);
    }
    drivers.set(svg, {
      driver,
      cleanup() {
        control?.removeEventListener("pointerenter", hover);
        control?.removeEventListener("pointerleave", rest);
        control?.removeEventListener("focus", hover);
        control?.removeEventListener("blur", rest);
      },
    });
  });
}
