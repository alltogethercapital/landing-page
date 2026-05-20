import { PORTFOLIO, type Company } from "./portfolio";

export type Founder = {
  name: string; // founder's name
  companyName: string; // must match a company `name` in PORTFOLIO
  headshot?: string; // /founders/<slug>.jpg — omit to render a placeholder
  linkedin?: string; // full URL to LinkedIn profile
  x?: string; // full URL to X (Twitter) profile
};

// One representative founder per company.
// NOTE: names + profile links are from public record — please verify each.
// Headshots are intentionally omitted (placeholders render) — drop image files
// into /public/founders/ and set `headshot: "/founders/<file>.jpg"` to use them.
export const FOUNDERS: Founder[] = [
  {
    name: "Brandon Tseng",
    companyName: "Shield AI",
    linkedin: "https://www.linkedin.com/in/brandontseng/",
  },
  {
    name: "Bernt Børnich",
    companyName: "1X",
    x: "https://x.com/BerntBornich",
  },
  {
    name: "Sam Altman",
    companyName: "OpenAI",
    x: "https://x.com/sama",
  },
  {
    name: "Dario Amodei",
    companyName: "Anthropic",
    linkedin: "https://www.linkedin.com/in/dario-amodei-3934934/",
    x: "https://x.com/DarioAmodei",
  },
  {
    name: "Palmer Luckey",
    companyName: "Anduril",
    linkedin: "https://www.linkedin.com/in/palmer-luckey-21a16959/",
    x: "https://x.com/PalmerLuckey",
  },
  {
    name: "Michael LaFramboise",
    companyName: "Aurelius Systems",
    linkedin: "https://www.linkedin.com/in/michael-laframboise/",
    x: "https://x.com/LaFrogman",
  },
  {
    name: "Amjad Masad",
    companyName: "Replit",
    linkedin: "https://www.linkedin.com/in/amjadmasad/",
    x: "https://x.com/amasad",
  },
  {
    name: "Qasar Younis",
    companyName: "Applied Intuition",
    linkedin: "https://www.linkedin.com/in/qasar/",
  },
  {
    name: "Brett Adcock",
    companyName: "Figure AI",
    linkedin: "https://www.linkedin.com/in/brettadcock/",
    x: "https://x.com/adcock_brett",
  },
  {
    name: "Jeff Cardenas",
    companyName: "Apptronik",
    linkedin: "https://www.linkedin.com/in/jeffrey-cardenas",
  },
  {
    name: "Tapa Ghosh",
    companyName: "Volantis",
    linkedin: "https://www.linkedin.com/in/tapa-ghosh-156640102/",
    x: "https://x.com/semiDL",
  },
  {
    name: "Philip Johnston",
    companyName: "Starcloud",
    linkedin: "https://www.linkedin.com/in/johnstonphilip/",
  },
  {
    name: "Hannan Happi",
    companyName: "Exowatt",
    linkedin: "https://www.linkedin.com/in/hannanhappi/",
  },
  {
    name: "Matt Loszak",
    companyName: "Aalo Atomics",
    linkedin: "https://www.linkedin.com/in/matt-loszak/",
    x: "https://x.com/MattLoszak",
  },
  {
    name: "Carlos Araque",
    companyName: "Quaise Energy",
    linkedin: "https://www.linkedin.com/in/quaise/",
  },
  {
    name: "Beth Esponnette",
    companyName: "Unspun",
    linkedin: "https://www.linkedin.com/in/beth-esponnette-66763023/",
  },
  // TODO — founders to confirm/add: Salient Motion, Lance, Samply, Hark, Bud Break Innovations
];

export function companyForFounder(f: Founder): Company | undefined {
  return PORTFOLIO.find((c) => c.name === f.companyName);
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
