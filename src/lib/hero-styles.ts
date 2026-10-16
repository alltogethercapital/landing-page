/** Hero treatments are auditioned at /?hero=1 through /?hero=10. */
export const HERO_STYLES = [
  { id: 1, name: "Reference", description: "Paper, ink, and a trail of color from the footage.", cellSize: 4.6 },
  { id: 2, name: "Binary Signal", description: "A crisp image built entirely from zeros and ones.", cellSize: 5.2 },
  { id: 3, name: "Ghost Circuit", description: "Faint contours emerge through a soft digital veil.", cellSize: 5.8 },
  { id: 4, name: "Terminal", description: "Phosphor green, binary characters, and quiet scanlines.", cellSize: 5.2 },
  { id: 5, name: "Wireframe", description: "Fine electric contours trace the machines in motion.", cellSize: 5.6 },
  { id: 6, name: "Blueprint", description: "An architectural study in midnight blue and ice.", cellSize: 6.4 },
  { id: 7, name: "Spectral", description: "Violet and cyan carry a luminous binary signal.", cellSize: 4.8 },
  { id: 8, name: "Heat Signature", description: "Warm thermal tones reveal movement in the dark.", cellSize: 5.8 },
  { id: 9, name: "Halftone", description: "A restrained, printed pattern of dots and light.", cellSize: 5 },
  { id: 10, name: "Raw Transmission", description: "Dense live telemetry with the film's original color.", cellSize: 3.8 },
] as const;

export const HERO_STYLE_EVENT = "machine-spirit-hero-style-change";

export function getHeroStyle(): number | null {
  const value = new URLSearchParams(window.location.search).get("hero");
  return value && /^(?:[1-9]|10)$/.test(value) ? Number(value) - 1 : null;
}

export function subscribeHeroStyle(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(HERO_STYLE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(HERO_STYLE_EVENT, onChange);
  };
}
