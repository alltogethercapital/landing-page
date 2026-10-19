export const LIGHT_MODE_STORAGE_KEY = "machine-spirit-light-preview-v1";
export const LIGHT_MODE_CHANGE_EVENT = "machine-spirit-light-preview-change";

/** Every option uses solid ink for reading; only the material and light change. */
export const LIGHT_MODE_OPTIONS = [
  { id: "1", name: "Stone / Ink", note: "The grey you liked, with clear ink and quieter static.", bg: "#d2d7cd", field: "#d9ddd4", edge: "#bfc6b9", ink: "#1c231b", muted: "#3d4638", fine: 0.035, coarse: 0.018 },
  { id: "2", name: "Warm Paper", note: "Warm ivory, soft charcoal and a fine paper texture.", bg: "#efede6", field: "#f7f5ef", edge: "#e4e0d6", ink: "#28251f", muted: "#595348", fine: 0.025, coarse: 0.012 },
  { id: "3", name: "Silver", note: "Cool industrial grey with crisp graphite lettering.", bg: "#d9dee0", field: "#e6e9e9", edge: "#c8cfd1", ink: "#1b252a", muted: "#3e4b52", fine: 0.03, coarse: 0.015 },
  { id: "4", name: "Porcelain", note: "Near-white, deep ink and barely visible machine grain.", bg: "#f5f6f2", field: "#fcfcf9", edge: "#e9ece4", ink: "#1b211a", muted: "#50584b", fine: 0.015, coarse: 0.006 },
  { id: "5", name: "Concrete", note: "A deeper neutral grey with bold, solid black type.", bg: "#bfc3be", field: "#cbd0c9", edge: "#b1b8af", ink: "#161c15", muted: "#303a2b", fine: 0.035, coarse: 0.02 },
  { id: "6", name: "Fog", note: "A luminous reading centre fading into soft grey edges.", bg: "#e1e3de", field: "#f8f8f3", edge: "#c7cec2", ink: "#232a21", muted: "#444f3e", fine: 0.02, coarse: 0.008 },
  { id: "7", name: "Limestone", note: "Warm architectural grey with quiet, earthy graphite.", bg: "#dcd8cd", field: "#eae6db", edge: "#cbc5b7", ink: "#2a2820", muted: "#484437", fine: 0.035, coarse: 0.015 },
  { id: "8", name: "Blue Steel", note: "Pale blue-grey with readable midnight-blue text.", bg: "#e0e7ec", field: "#eef3f5", edge: "#ccd7de", ink: "#182b3a", muted: "#3e5261", fine: 0.025, coarse: 0.012 },
  { id: "9", name: "Ink Rail", note: "White navigation on a graphite rail; a light reading canvas.", bg: "#e1e4dc", field: "#edf0e7", edge: "#d0d6c9", ink: "#1d261b", muted: "#424e3c", fine: 0.025, coarse: 0.012 },
  { id: "10", name: "Reading Field", note: "White navigation on graphite, with a smooth ivory reading field.", bg: "#cdd2c9", field: "#d9ded3", edge: "#bec6b8", ink: "#20271d", muted: "#3d4737", fine: 0.03, coarse: 0.015 },
] as const;

export function getLightModeOption(id: string | null | undefined) {
  return LIGHT_MODE_OPTIONS.find((option) => option.id === id);
}

/** Shared data keeps the preview, pre-hydration palette and contrast audit aligned. */
export const LIGHT_MODE_CSS = LIGHT_MODE_OPTIONS.map((option) => `
html[data-site-theme="light"][data-light-option="${option.id}"] {
  --cog-bg: ${option.bg};
  --cog-field: ${option.field};
  --cog-edge: ${option.edge};
  --cog-ink: ${option.ink};
  --cog-muted: ${option.muted};
  --cog-dark: ${option.ink};
  --cog-static-fine: ${option.fine};
  --cog-static-coarse: ${option.coarse};
}`).join("\n");
