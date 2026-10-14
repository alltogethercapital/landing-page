import type { FontId } from "@/lib/type-fonts";

export type TypeTag = "Minimal" | "Technical" | "Mono" | "Editorial" | "Expressive";

export type TypeOption = Readonly<{
  id: number;
  name: string;
  heading: FontId;
  nav: FontId;
  body: FontId;
  tag: TypeTag;
  note: string;
}>;

type BodyFont = {
  name: string;
  character: string;
};

// Reading faces stay restrained while the headings carry the technical character.
// These are curated comparisons, rather than a claim that every pairing is proven.
const READING_FONTS = {
  inter: { name: "Inter", character: "crisp, familiar reading text" },
  "source-sans-3": { name: "Source Sans 3", character: "open, humanist reading text" },
  "public-sans": { name: "Public Sans", character: "quiet, clear reading text" },
  "ibm-plex-sans": { name: "IBM Plex Sans", character: "measured, technical reading text" },
  "dm-sans": { name: "DM Sans", character: "soft, uncluttered reading text" },
  manrope: { name: "Manrope", character: "precise, modern reading text" },
  "work-sans": { name: "Work Sans", character: "practical, spacious reading text" },
  figtree: { name: "Figtree", character: "warm, straightforward reading text" },
  lato: { name: "Lato", character: "warm, humanist reading text" },
  "open-sans": { name: "Open Sans", character: "open, familiar reading text" },
  "nunito-sans": { name: "Nunito Sans", character: "gentle, generous reading text" },
  "atkinson-hyperlegible-next": { name: "Atkinson Hyperlegible Next", character: "distinct, easy-to-scan reading text" },
  roboto: { name: "Roboto", character: "familiar, economical reading text" },
  "libre-franklin": { name: "Libre Franklin", character: "clear, editorial reading text" },
} satisfies Partial<Record<FontId, BodyFont>>;

type ReadingFontId = keyof typeof READING_FONTS;

type HeadingGroup = {
  id: FontId;
  name: string;
  nav?: FontId;
  tag: TypeTag;
  character: string;
  bodies: readonly ReadingFontId[];
};

// Ten deliberate reading partners per heading face. Keep this order stable:
// option IDs are shareable and must continue to identify the same combination.
const HEADING_GROUPS: readonly HeadingGroup[] = [
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    tag: "Technical",
    character: "Geometric headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "figtree", "lato", "libre-franklin"],
  },
  {
    id: "sora",
    name: "Sora",
    tag: "Technical",
    character: "Precise, open headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "figtree", "open-sans", "nunito-sans", "atkinson-hyperlegible-next"],
  },
  {
    id: "manrope",
    name: "Manrope",
    tag: "Minimal",
    character: "Understated geometric headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "figtree", "lato", "roboto", "libre-franklin"],
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    tag: "Minimal",
    character: "Quiet, balanced headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "manrope", "work-sans", "figtree", "open-sans", "atkinson-hyperlegible-next", "libre-franklin"],
  },
  {
    id: "plus-jakarta-sans",
    name: "Plus Jakarta Sans",
    tag: "Minimal",
    character: "Polished geometric headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "lato", "nunito-sans", "roboto"],
  },
  {
    id: "outfit",
    name: "Outfit",
    tag: "Technical",
    character: "Clean, circular headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "figtree", "open-sans", "atkinson-hyperlegible-next", "libre-franklin"],
  },
  {
    id: "urbanist",
    name: "Urbanist",
    tag: "Minimal",
    character: "Light, architectural headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "figtree", "lato", "roboto"],
  },
  {
    id: "ibm-plex-sans",
    name: "IBM Plex Sans",
    tag: "Technical",
    character: "Measured, engineered headings",
    bodies: ["inter", "source-sans-3", "public-sans", "dm-sans", "manrope", "work-sans", "figtree", "open-sans", "atkinson-hyperlegible-next", "libre-franklin"],
  },
  {
    id: "archivo",
    name: "Archivo",
    tag: "Editorial",
    character: "Firm, economical headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "lato", "open-sans", "roboto", "libre-franklin"],
  },
  {
    id: "barlow",
    name: "Barlow",
    tag: "Editorial",
    character: "Tall, industrial headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "figtree", "lato", "nunito-sans", "libre-franklin"],
  },
  {
    id: "exo-2",
    name: "Exo 2",
    tag: "Technical",
    character: "Sculpted technical headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "figtree", "open-sans", "atkinson-hyperlegible-next", "roboto"],
  },
  {
    id: "oxanium",
    name: "Oxanium",
    tag: "Technical",
    character: "Angular, futuristic headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "figtree", "lato", "libre-franklin"],
  },
  {
    id: "rajdhani",
    name: "Rajdhani",
    tag: "Technical",
    character: "Narrow, squared headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "open-sans", "nunito-sans", "roboto"],
  },
  {
    id: "chakra-petch",
    name: "Chakra Petch",
    tag: "Technical",
    character: "Clipped, squared headings",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "figtree", "lato", "atkinson-hyperlegible-next", "libre-franklin"],
  },
  {
    id: "michroma",
    name: "Michroma",
    nav: "ibm-plex-mono",
    tag: "Technical",
    character: "Wide technical headings; precise mono navigation",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "figtree", "open-sans", "roboto"],
  },
  {
    id: "orbitron",
    name: "Orbitron",
    nav: "chakra-petch",
    tag: "Technical",
    character: "Instrument-like headings; compact angular navigation",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "lato", "open-sans", "atkinson-hyperlegible-next", "libre-franklin"],
  },
  {
    id: "syne",
    name: "Syne",
    nav: "space-grotesk",
    tag: "Expressive",
    character: "Distinctive display headings; calm geometric navigation",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "figtree", "nunito-sans", "libre-franklin"],
  },
  {
    id: "unbounded",
    name: "Unbounded",
    nav: "manrope",
    tag: "Expressive",
    character: "Wide, structural headings; restrained navigation",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "work-sans", "figtree", "lato", "open-sans", "roboto"],
  },
  {
    id: "space-mono",
    name: "Space Mono",
    tag: "Mono",
    character: "Characterful mono headings and navigation",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "figtree", "nunito-sans", "libre-franklin"],
  },
  {
    id: "ibm-plex-mono",
    name: "IBM Plex Mono",
    tag: "Mono",
    character: "Precise mono headings and navigation",
    bodies: ["inter", "source-sans-3", "public-sans", "ibm-plex-sans", "dm-sans", "manrope", "work-sans", "lato", "atkinson-hyperlegible-next", "libre-franklin"],
  },
];

export const TYPE_OPTIONS: readonly TypeOption[] = HEADING_GROUPS.flatMap((heading, headingIndex) =>
  heading.bodies.map((body, bodyIndex) => ({
    id: headingIndex * 10 + bodyIndex + 1,
    name: `${heading.name} / ${READING_FONTS[body].name}`,
    heading: heading.id,
    nav: heading.nav ?? heading.id,
    body,
    tag: heading.tag,
    note: `${heading.character} with ${READING_FONTS[body].character}.`,
  })),
);
