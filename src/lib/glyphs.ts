import { PORTFOLIO } from "@/lib/portfolio";

// The brand alphabet.
//
// This is the luminance ramp that renders the landing-page hero: video frames
// become pictures made of these 69 characters, dense ("$") through empty (" ").
// The same ramp doubles as the firm's index — every portfolio company is
// assigned one character from it, permanently. Individually the glyphs are
// almost nothing; arranged together they render the whole picture. That is the
// thesis of the firm, so it is the thesis of the design system.
export const GLYPH_RAMP =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYZXcvunxrj/ft\\|()1{}[]?_-+~<>i!lI;:\",^'. ";

// Characters legible enough to stand alone as a company's mark (the faint tail
// of the ramp — quotes, dots, space — stays unassigned).
const ASSIGNABLE = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYZXcvunxrj";

function hashName(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return h;
}

// Deterministic per-name assignment with linear probing so no two companies
// share a character. Stable for a given portfolio: a company's glyph only
// changes if its name does.
export const COMPANY_GLYPHS: ReadonlyMap<string, string> = (() => {
  const taken = new Set<string>();
  const map = new Map<string, string>();
  for (const company of PORTFOLIO) {
    let i = hashName(company.name) % ASSIGNABLE.length;
    while (taken.has(ASSIGNABLE[i])) i = (i + 1) % ASSIGNABLE.length;
    taken.add(ASSIGNABLE[i]);
    map.set(company.name, ASSIGNABLE[i]);
  }
  return map;
})();

export const COMPANY_BY_GLYPH: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const [name, glyph] of COMPANY_GLYPHS) map.set(glyph, name);
  return map;
})();

export function glyphFor(name: string): string | undefined {
  return COMPANY_GLYPHS.get(name);
}
