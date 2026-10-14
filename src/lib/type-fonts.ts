/** Licensed, self-hosted families for the opt-in typography preview. */
export const TYPE_FONTS = [
  {"id": "space-grotesk", "name": "Space Grotesk", "family": "MS Type space-grotesk", "file": "/fonts/type-lab/space-grotesk.woff2", "weight": "300 700", "kind": "sans"},
  {"id": "sora", "name": "Sora", "family": "MS Type sora", "file": "/fonts/type-lab/sora.woff2", "weight": "100 800", "kind": "sans"},
  {"id": "manrope", "name": "Manrope", "family": "MS Type manrope", "file": "/fonts/type-lab/manrope.woff2", "weight": "200 800", "kind": "sans"},
  {"id": "dm-sans", "name": "DM Sans", "family": "MS Type dm-sans", "file": "/fonts/type-lab/dm-sans.woff2", "weight": "100 1000", "kind": "sans"},
  {"id": "plus-jakarta-sans", "name": "Plus Jakarta Sans", "family": "MS Type plus-jakarta-sans", "file": "/fonts/type-lab/plus-jakarta-sans.woff2", "weight": "200 800", "kind": "sans"},
  {"id": "outfit", "name": "Outfit", "family": "MS Type outfit", "file": "/fonts/type-lab/outfit.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "urbanist", "name": "Urbanist", "family": "MS Type urbanist", "file": "/fonts/type-lab/urbanist.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "ibm-plex-sans", "name": "IBM Plex Sans", "family": "MS Type ibm-plex-sans", "file": "/fonts/type-lab/ibm-plex-sans.woff2", "weight": "100 700", "kind": "sans"},
  {"id": "archivo", "name": "Archivo", "family": "MS Type archivo", "file": "/fonts/type-lab/archivo.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "barlow", "name": "Barlow", "family": "MS Type barlow", "file": "/fonts/type-lab/barlow.woff2", "weight": "400", "kind": "sans"},
  {"id": "exo-2", "name": "Exo 2", "family": "MS Type exo-2", "file": "/fonts/type-lab/exo-2.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "oxanium", "name": "Oxanium", "family": "MS Type oxanium", "file": "/fonts/type-lab/oxanium.woff2", "weight": "200 800", "kind": "display"},
  {"id": "rajdhani", "name": "Rajdhani", "family": "MS Type rajdhani", "file": "/fonts/type-lab/rajdhani.woff2", "weight": "400", "kind": "sans"},
  {"id": "chakra-petch", "name": "Chakra Petch", "family": "MS Type chakra-petch", "file": "/fonts/type-lab/chakra-petch.woff2", "weight": "400", "kind": "sans"},
  {"id": "michroma", "name": "Michroma", "family": "MS Type michroma", "file": "/fonts/type-lab/michroma.woff2", "weight": "400", "kind": "display"},
  {"id": "orbitron", "name": "Orbitron", "family": "MS Type orbitron", "file": "/fonts/type-lab/orbitron.woff2", "weight": "400 900", "kind": "display"},
  {"id": "syne", "name": "Syne", "family": "MS Type syne", "file": "/fonts/type-lab/syne.woff2", "weight": "400 800", "kind": "display"},
  {"id": "unbounded", "name": "Unbounded", "family": "MS Type unbounded", "file": "/fonts/type-lab/unbounded.woff2", "weight": "200 900", "kind": "display"},
  {"id": "space-mono", "name": "Space Mono", "family": "MS Type space-mono", "file": "/fonts/type-lab/space-mono.woff2", "weight": "400", "kind": "mono"},
  {"id": "ibm-plex-mono", "name": "IBM Plex Mono", "family": "MS Type ibm-plex-mono", "file": "/fonts/type-lab/ibm-plex-mono.woff2", "weight": "400", "kind": "mono"},
  {"id": "inter", "name": "Inter", "family": "MS Type inter", "file": "/fonts/type-lab/inter.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "source-sans-3", "name": "Source Sans 3", "family": "MS Type source-sans-3", "file": "/fonts/type-lab/source-sans-3.woff2", "weight": "200 900", "kind": "sans"},
  {"id": "public-sans", "name": "Public Sans", "family": "MS Type public-sans", "file": "/fonts/type-lab/public-sans.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "work-sans", "name": "Work Sans", "family": "MS Type work-sans", "file": "/fonts/type-lab/work-sans.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "figtree", "name": "Figtree", "family": "MS Type figtree", "file": "/fonts/type-lab/figtree.woff2", "weight": "300 900", "kind": "sans"},
  {"id": "lato", "name": "Lato", "family": "MS Type lato", "file": "/fonts/type-lab/lato.woff2", "weight": "400", "kind": "sans"},
  {"id": "open-sans", "name": "Open Sans", "family": "MS Type open-sans", "file": "/fonts/type-lab/open-sans.woff2", "weight": "300 800", "kind": "sans"},
  {"id": "nunito-sans", "name": "Nunito Sans", "family": "MS Type nunito-sans", "file": "/fonts/type-lab/nunito-sans.woff2", "weight": "200 1000", "kind": "sans"},
  {"id": "atkinson-hyperlegible-next", "name": "Atkinson Hyperlegible Next", "family": "MS Type atkinson-hyperlegible-next", "file": "/fonts/type-lab/atkinson-hyperlegible-next.woff2", "weight": "200 800", "kind": "sans"},
  {"id": "roboto", "name": "Roboto", "family": "MS Type roboto", "file": "/fonts/type-lab/roboto.woff2", "weight": "100 900", "kind": "sans"},
  {"id": "libre-franklin", "name": "Libre Franklin", "family": "MS Type libre-franklin", "file": "/fonts/type-lab/libre-franklin.woff2", "weight": "100 900", "kind": "sans"},
] as const;

export type TypeFont = (typeof TYPE_FONTS)[number];
export type FontId = TypeFont["id"];

export function getTypeFont(id: FontId): TypeFont {
  return TYPE_FONTS.find((font) => font.id === id)!;
}
