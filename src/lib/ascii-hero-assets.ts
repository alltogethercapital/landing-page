export type AsciiHeroClip = {
  /** Company/product represented by the clip. Used only for internal clip identity. */
  label: string;
  /** Short, low-res (480×270) loop encoded specifically for the ASCII shader. */
  src: string;
  /** Still frame used when autoplay is blocked or motion is reduced. */
  poster: string;
};

// One continuous montage cut from the per-company 1080p masters — the whole
// portfolio assembled into a single picture, which is the brand idea rather
// than a decorative loop. Rebuild it with `scripts/build-hero-montage.sh`,
// which holds the shot list and the reasoning behind each window.
//
// Two things matter for how this reads. Source: always the 1080p masters in
// heesh/processed-video, never the 720p proxies — 1920→480 is an exact 4:1 box
// average, which resolves more detail and averages out noise for a shader that
// point-samples once per cell. Shot choice: clear silhouettes and strong
// luminance separation survive a character ramp. Screen content can work well —
// a code editor or a terminal reads as one — but a subject that only reads
// correctly at full resolution does not, which is why a smooth humanoid torso
// or a robot doing housework comes out looking like a person.
//
// The filename carries a content hash so a re-encode is never served from a
// stale cache — regenerate it whenever the file changes.
export const ASCII_HERO_CLIPS: AsciiHeroClip[] = [
  {
    label: "All Together — portfolio montage",
    src: "/hero-videos/ascii-homepage.1738e13b.mp4",
    poster: "/hero-videos/ascii-homepage.1738e13b.jpg",
  },
];
