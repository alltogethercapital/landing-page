export type DitherPattern =
  | "bayer2"
  | "bayer4"
  | "bayer8"
  | "clusteredDot"
  | "blueNoise"
  | "whiteNoise"
  | "floydSteinberg";

type WaveConfig = {
  angle: number;
  amplitude: number;
  frequency: number;
  position: { x: number; y: number };
  softness: number;
  speed: number;
  thickness: number;
};

type MotionConfig = WaveConfig & {
  name: string;
  pattern: DitherPattern;
  pixelSize: number;
  secondary?: WaveConfig;
  spread: number;
  threshold: number;
};

type PaletteConfig = {
  accent: string;
  background: string;
  dither: string;
  name: string;
  tone: "dark" | "light";
  wash: number;
  wave: string;
};

export type SiteShaderOption = Omit<MotionConfig, "name"> &
  Omit<PaletteConfig, "name"> & {
    id: string;
    motionName: string;
    paletteName: string;
  };

const PALETTES: PaletteConfig[] = [
  {
    name: "Graphite Ink",
    background: "#ffffff",
    wave: "#17171c",
    dither: "#c9c9c9",
    accent: "#006fce",
    tone: "light",
    wash: 0,
  },
  {
    name: "Cobalt Ink",
    background: "#ffffff",
    wave: "#244969",
    dither: "#c7dcf0",
    accent: "#ffc62c",
    tone: "light",
    wash: 0,
  },
  {
    name: "Paper Graphite",
    background: "#ffffff",
    wave: "#17171c",
    dither: "#d8d8d8",
    accent: "#006fce",
    tone: "light",
    wash: 0,
  },
  {
    name: "Paper Cobalt",
    background: "#ffffff",
    wave: "#006fce",
    dither: "#d5e7f5",
    accent: "#ffc62c",
    tone: "light",
    wash: 0,
  },
  {
    name: "Porcelain Solar",
    background: "#ffffff",
    wave: "#b78a00",
    dither: "#f4e2a4",
    accent: "#006fce",
    tone: "light",
    wash: 0,
  },
  {
    name: "Blue Gold",
    background: "#ffffff",
    wave: "#006fce",
    dither: "#f5dc81",
    accent: "#12243a",
    tone: "light",
    wash: 0,
  },
  {
    name: "Ice Ink",
    background: "#ffffff",
    wave: "#15324c",
    dither: "#cfe0eb",
    accent: "#ffc62c",
    tone: "light",
    wash: 0,
  },
  {
    name: "Mist Signal",
    background: "#ffffff",
    wave: "#006fce",
    dither: "#d4d4d1",
    accent: "#17171c",
    tone: "light",
    wash: 0,
  },
  {
    name: "Silver Cobalt",
    background: "#ffffff",
    wave: "#145d9a",
    dither: "#cbd5dc",
    accent: "#ffc62c",
    tone: "light",
    wash: 0,
  },
  {
    name: "Salt Sun",
    background: "#ffffff",
    wave: "#d8a400",
    dither: "#c7dff2",
    accent: "#006fce",
    tone: "light",
    wash: 0,
  },
];

const MOTIONS: MotionConfig[] = [
  {
    name: "Faded Tide",
    angle: 24,
    amplitude: 0.15,
    frequency: 0.5,
    position: { x: 0.69, y: 0.7 },
    softness: 0.7,
    speed: 0.4,
    thickness: 0.4,
    pattern: "bayer8",
    pixelSize: 4,
    threshold: 0.41,
    spread: 1,
  },
  {
    name: "Horizon Sweep",
    angle: 4,
    amplitude: 0.12,
    frequency: 0.7,
    position: { x: 0.48, y: 0.66 },
    softness: 0.82,
    speed: 0.22,
    thickness: 0.34,
    pattern: "blueNoise",
    pixelSize: 3,
    threshold: 0.48,
    spread: 0.85,
  },
  {
    name: "North Current",
    angle: 112,
    amplitude: 0.18,
    frequency: 1.1,
    position: { x: 0.72, y: 0.5 },
    softness: 0.75,
    speed: 0.26,
    thickness: 0.28,
    pattern: "bayer4",
    pixelSize: 4,
    threshold: 0.46,
    spread: 0.9,
  },
  {
    name: "Long Arc",
    angle: 332,
    amplitude: 0.28,
    frequency: 0.35,
    position: { x: 0.64, y: 0.42 },
    softness: 0.86,
    speed: 0.18,
    thickness: 0.52,
    pattern: "clusteredDot",
    pixelSize: 5,
    threshold: 0.45,
    spread: 0.82,
  },
  {
    name: "Signal Line",
    angle: 60,
    amplitude: 0.08,
    frequency: 1.7,
    position: { x: 0.78, y: 0.68 },
    softness: 0.5,
    speed: 0.32,
    thickness: 0.18,
    pattern: "bayer2",
    pixelSize: 3,
    threshold: 0.5,
    spread: 0.72,
  },
  {
    name: "Wide Drift",
    angle: 154,
    amplitude: 0.34,
    frequency: 0.6,
    position: { x: 0.62, y: 0.74 },
    softness: 0.9,
    speed: 0.12,
    thickness: 0.66,
    pattern: "floydSteinberg",
    pixelSize: 4,
    threshold: 0.43,
    spread: 0.78,
  },
  {
    name: "Crosscurrent",
    angle: 28,
    amplitude: 0.14,
    frequency: 0.78,
    position: { x: 0.34, y: 0.68 },
    softness: 0.72,
    speed: 0.2,
    thickness: 0.32,
    pattern: "bayer8",
    pixelSize: 3,
    threshold: 0.45,
    spread: 0.84,
    secondary: {
      angle: 142,
      amplitude: 0.1,
      frequency: 1.25,
      position: { x: 0.78, y: 0.38 },
      softness: 0.78,
      speed: -0.14,
      thickness: 0.24,
    },
  },
  {
    name: "Parallel Echo",
    angle: 12,
    amplitude: 0.11,
    frequency: 0.82,
    position: { x: 0.52, y: 0.34 },
    softness: 0.8,
    speed: 0.16,
    thickness: 0.28,
    pattern: "whiteNoise",
    pixelSize: 3,
    threshold: 0.47,
    spread: 0.8,
    secondary: {
      angle: 12,
      amplitude: 0.11,
      frequency: 0.82,
      position: { x: 0.52, y: 0.74 },
      softness: 0.8,
      speed: 0.16,
      thickness: 0.28,
    },
  },
];

export const SITE_SHADER_OPTIONS: SiteShaderOption[] = MOTIONS.flatMap(
  (motion, motionIndex) =>
    PALETTES.map((palette, paletteIndex) => {
      const { name: paletteName, ...paletteValues } = palette;
      const { name: motionName, ...motionValues } = motion;

      return {
        ...paletteValues,
        ...motionValues,
        paletteName,
        motionName,
        id: String(motionIndex * PALETTES.length + paletteIndex + 1).padStart(
          2,
          "0",
        ),
      };
    }),
);
