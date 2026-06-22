export type AsciiHeroClip = {
  /** Company/product represented by the clip. Used only for internal clip identity. */
  label: string;
  /** Short, low-res (480×270) loop encoded specifically for the ASCII shader. */
  src: string;
  /** Still frame used when autoplay is blocked or motion is reduced. */
  poster: string;
};

export const ASCII_HERO_CLIPS: AsciiHeroClip[] = [
  {
    label: "Shield AI",
    src: "/hero-videos/ascii-shield-ai.mp4",
    poster: "/hero-videos/ascii-shield-ai-poster.jpg",
  },
  {
    label: "1X",
    src: "/hero-videos/ascii-1x.mp4",
    poster: "/hero-videos/ascii-1x-poster.jpg",
  },
  {
    label: "Figure AI",
    src: "/hero-videos/ascii-figure.mp4",
    poster: "/hero-videos/ascii-figure-poster.jpg",
  },
];
