export const LIGHT_MODE_STORAGE_KEY = "machine-spirit-light-preview-v1";
export const LIGHT_MODE_CHANGE_EVENT = "machine-spirit-light-preview-change";

/** Every option uses solid ink for reading; only the material and light change. */
export const LIGHT_MODE_OPTIONS = [
  { id: "1", name: "Stone / Ink", note: "Stone grey, clear ink and softly moving machine static.", bg: "#d2d7cd", field: "#d9ddd4", edge: "#bfc6b9", ink: "#161d15", muted: "#343d2f", fine: 0.07, coarse: 0.035 },
  { id: "2", name: "Warm Paper", note: "Warm ivory, soft charcoal and softly drifting paper grain.", bg: "#efede6", field: "#f7f5ef", edge: "#e4e0d6", ink: "#28251f", muted: "#524c41", fine: 0.07, coarse: 0.03 },
  { id: "3", name: "Silver", note: "Cool industrial grey with crisp ink and living static.", bg: "#d9dee0", field: "#e6e9e9", edge: "#c8cfd1", ink: "#1b252a", muted: "#37444b", fine: 0.065, coarse: 0.032 },
  { id: "4", name: "Porcelain", note: "Pale porcelain, deep ink and visible, fine machine grain.", bg: "#f5f6f2", field: "#fcfcf9", edge: "#e9ece4", ink: "#1b211a", muted: "#4b5346", fine: 0.075, coarse: 0.035 },
  { id: "5", name: "Concrete", note: "Deeper concrete grey with bold ink and gently restless static.", bg: "#bfc3be", field: "#cbd0c9", edge: "#b1b8af", ink: "#0a1009", muted: "#2b3526", fine: 0.065, coarse: 0.03 },
  { id: "6", name: "Fog", note: "A luminous centre with a very slow drift through fine static.", bg: "#e1e3de", field: "#f8f8f3", edge: "#c7cec2", ink: "#1e251c", muted: "#384332", fine: 0.07, coarse: 0.032 },
  { id: "7", name: "Limestone", note: "Warm architectural grey with soft, shifting machine grain.", bg: "#dcd8cd", field: "#eae6db", edge: "#cbc5b7", ink: "#1f1d15", muted: "#3f3b2e", fine: 0.07, coarse: 0.035 },
  { id: "8", name: "Blue Steel", note: "Pale blue-grey, midnight ink and quietly moving static.", bg: "#e0e7ec", field: "#eef3f5", edge: "#ccd7de", ink: "#182b3a", muted: "#354958", fine: 0.065, coarse: 0.03 },
  { id: "9", name: "Ink Rail", note: "White navigation on graphite, with a lightly living grey canvas.", bg: "#e1e4dc", field: "#edf0e7", edge: "#d0d6c9", ink: "#1d261b", muted: "#3d4937", fine: 0.065, coarse: 0.032 },
  { id: "10", name: "Reading Field", note: "White navigation and ivory, with soft static across the whole field.", bg: "#cdd2c9", field: "#d9ded3", edge: "#bec6b8", ink: "#161d13", muted: "#333d2d", fine: 0.07, coarse: 0.035 },
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
