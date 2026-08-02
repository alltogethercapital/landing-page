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

// Characters legible enough to stand alone as a company's mark. Keep this
// derived from the full ramp so adding companies cannot silently exhaust the
// fixed glyph pool and trap the build in the probing loop.
const ASSIGNABLE = Array.from(
  new Set([...GLYPH_RAMP].filter((glyph) => glyph !== " ")),
);

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
    let probes = 0;
    while (taken.has(ASSIGNABLE[i]) && probes < ASSIGNABLE.length) {
      i = (i + 1) % ASSIGNABLE.length;
      probes += 1;
    }
    const glyph = ASSIGNABLE[i];
    if (!glyph || taken.has(glyph)) {
      throw new Error("Not enough unique glyphs for the portfolio index.");
    }
    taken.add(glyph);
    map.set(company.name, glyph);
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
