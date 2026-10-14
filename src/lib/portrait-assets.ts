// Existing cutouts retain their original pixels. Older opaque sources use
// separate background-extracted siblings across the page, search, and preload.
const EXTRACTED_PORTRAITS = new Set([
  "aaron-pempel", "ahmed-al-mudarris", "alex-mashrabov", "alex-pachikov",
  "anmol-gulati", "ant-wilson", "assil-halimi", "ben-nowack",
  "chris-eheim", "dean-leitersdorf", "drew-walker", "dustin-walper",
  "evan-wineland", "eyad-abdalla", "jeff-bezos", "jerry-tworek",
  "joanne-jang", "julia-villagra", "kaan-dogrusoz", "mahi-de-silva",
  "moshe-shalev", "nick-de-palezieux", "orian-leitersdorf", "paul-copplestone",
  "peter-cetale", "robert-shepherd", "rohan-anil", "tade-oyerinde",
  "tj-wallin", "travis-kalanick", "tristan-semmelhack", "yerzat-dulat",
]);

export function founderPortraitSrc(headshot: string) {
  // Newer catalog portraits already have their own checked local assets.
  if (headshot.startsWith("/founders/portraits/")) return headshot;
  const slug = headshot.split("/").at(-1)?.replace(/\.(png|webp|jpe?g)$/, "") ?? "";
  return EXTRACTED_PORTRAITS.has(slug)
    ? `/founders/transparent/${slug}.webp`
    : `/founders/cutouts-webp/${slug}.webp`;
}
