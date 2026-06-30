import { PORTFOLIO, slugify, type Company } from "./portfolio";

export type Founder = {
  name: string; // founder's name
  companyName: string; // must match a company `name` in PORTFOLIO
  headshot?: string; // /founders/cutouts/<slug>.png — omit to render a placeholder
  linkedin?: string; // full URL to LinkedIn profile
  x?: string; // full URL to X (Twitter) profile
};

// One representative founder per company.
// NOTE: names + profile links are from public record — please verify each.
// Headshots are intentionally omitted (placeholders render) — drop image files
// into /public/founders/cutouts/ and set `headshot` to the cutout PNG.
export const FOUNDERS: Founder[] = [
  {
    name: "Brandon Tseng",
    companyName: "Shield AI",
    headshot: "/founders/cutouts/brandon-tseng.png",
    linkedin: "https://www.linkedin.com/in/brandontseng/",
  },
  {
    // Co-founder; President & Chief Strategy Officer (founding CEO).
    name: "Ryan Tseng",
    companyName: "Shield AI",
    headshot: "/founders/cutouts/ryan-tseng.png",
    linkedin: "https://www.linkedin.com/in/ryantseng",
  },
  {
    name: "Bernt Børnich",
    companyName: "1X",
    headshot: "/founders/cutouts/bernt-bornich.png",
    x: "https://x.com/BerntBornich",
  },
  {
    name: "Palmer Luckey",
    companyName: "Anduril",
    headshot: "/founders/cutouts/palmer-luckey.png",
    linkedin: "https://www.linkedin.com/in/palmer-luckey-21a16959/",
    x: "https://x.com/PalmerLuckey",
  },
  {
    // Co-founder & Executive Chairman; partner at Founders Fund.
    name: "Trae Stephens",
    companyName: "Anduril",
    headshot: "/founders/cutouts/trae-stephens.png",
    linkedin: "https://www.linkedin.com/in/trae-stephens-485a811/",
  },
  {
    name: "Vishaal Mali",
    companyName: "Salient Motion",
    headshot: "/founders/cutouts/vishaal-mali.png",
    linkedin: "https://www.linkedin.com/in/vishaalmali/",
  },
  {
    name: "Amjad Masad",
    companyName: "Replit",
    headshot: "/founders/cutouts/amjad-masad.png",
    linkedin: "https://www.linkedin.com/in/amjadmasad/",
    x: "https://x.com/amasad",
  },
  {
    name: "Jeffrey Quesnelle",
    companyName: "Nous Research",
    linkedin: "https://www.linkedin.com/in/jeffrey-quesnelle-2490a524",
    x: "https://x.com/theemozilla",
  },
  {
    name: "Karan Malhotra",
    companyName: "Nous Research",
  },
  {
    name: "Teknium",
    companyName: "Nous Research",
    x: "https://x.com/Teknium1",
  },
  {
    name: "Shivani Mitra",
    companyName: "Nous Research",
    linkedin: "https://www.linkedin.com/in/shivani-mitra",
  },
  {
    name: "Jerry Tworek",
    companyName: "Core Automation",
    x: "https://x.com/MillionInt",
  },
  {
    name: "Rohan Anil",
    companyName: "Core Automation",
    x: "https://x.com/_arohan_",
  },
  {
    name: "Joanne Jang",
    companyName: "Core Automation",
    x: "https://x.com/joannejang",
  },
  {
    name: "Anmol Gulati",
    companyName: "Core Automation",
    x: "https://x.com/anmol01gulati",
  },
  {
    name: "Julia Villagra",
    companyName: "Core Automation",
    x: "https://x.com/juliacvillagra",
  },
  {
    name: "Qasar Younis",
    companyName: "Applied Intuition",
    headshot: "/founders/cutouts/qasar-younis.png",
    linkedin: "https://www.linkedin.com/in/qasar/",
  },
  {
    name: "Brett Adcock",
    companyName: "Figure AI",
    headshot: "/founders/cutouts/brett-adcock.png",
    linkedin: "https://www.linkedin.com/in/brettadcock/",
    x: "https://x.com/adcock_brett",
  },
  {
    name: "Jeff Cardenas",
    companyName: "Apptronik",
    headshot: "/founders/cutouts/jeff-cardenas.png",
    linkedin: "https://www.linkedin.com/in/jeffrey-cardenas",
  },
  {
    // Co-founder & CTO.
    name: "Nick Paine",
    companyName: "Apptronik",
    headshot: "/founders/cutouts/nick-paine.png",
    linkedin: "https://www.linkedin.com/in/nipaine/",
  },
  {
    name: "Tapa Ghosh",
    companyName: "Volantis",
    headshot: "/founders/cutouts/tapa-ghosh.png",
    linkedin: "https://www.linkedin.com/in/tapa-ghosh-156640102/",
    x: "https://x.com/semiDL",
  },
  {
    name: "Philip Johnston",
    companyName: "Starcloud",
    headshot: "/founders/cutouts/philip-johnston.png",
    linkedin: "https://www.linkedin.com/in/johnstonphilip/",
  },
  {
    name: "Ben Nowack",
    companyName: "Reflect Orbital",
    linkedin: "https://www.linkedin.com/in/ben-nowack/",
  },
  {
    name: "Tristan Semmelhack",
    companyName: "Reflect Orbital",
    linkedin: "https://www.linkedin.com/in/tristan-semmelhack-6a1ba0149/",
  },
  {
    name: "Hannan Happi",
    companyName: "Exowatt",
    headshot: "/founders/cutouts/hannan-happi.png",
    linkedin: "https://www.linkedin.com/in/hannanhappi/",
  },
  {
    name: "Matt Loszak",
    companyName: "Aalo Atomics",
    headshot: "/founders/cutouts/matt-loszak.png",
    linkedin: "https://www.linkedin.com/in/matt-loszak/",
    x: "https://x.com/MattLoszak",
  },
  {
    name: "Carlos Araque",
    companyName: "Quaise Energy",
    headshot: "/founders/cutouts/carlos-araque.png",
    linkedin: "https://www.linkedin.com/in/quaise/",
  },
  {
    name: "Beth Esponnette",
    companyName: "Unspun",
    headshot: "/founders/cutouts/beth-esponnette.png",
    linkedin: "https://www.linkedin.com/in/beth-esponnette-66763023/",
  },
  {
    name: "Caleb Chan",
    companyName: "Lance",
    headshot: "/founders/cutouts/caleb-chan.png",
    linkedin: "https://www.linkedin.com/in/caleb-chan-327b14239/",
    x: "https://x.com/calebychan",
  },
  {
    name: "Eric Schirtzinger",
    companyName: "Samply",
    headshot: "/founders/cutouts/eric-schirtzinger.png",
    linkedin: "https://www.linkedin.com/in/eschirtz/",
    x: "https://x.com/eschirtz",
  },
  {
    // Brett Adcock founded both Figure AI and Hark (his AI lab).
    name: "Brett Adcock",
    companyName: "Hark",
    headshot: "/founders/cutouts/brett-adcock.png",
    linkedin: "https://www.linkedin.com/in/brettadcock/",
    x: "https://x.com/adcock_brett",
  },
  {
    name: "Jonathan Moon",
    companyName: "Bud Break Innovations",
    headshot: "/founders/cutouts/jonathan-moon.png",
    linkedin: "https://www.linkedin.com/in/jmoon0714/",
    x: "https://x.com/jmoonio",
  },
  {
    name: "Hamza Derbas",
    companyName: "Maven Robotics",
    headshot: "/founders/cutouts/hamza-derbas.png",
    linkedin: "https://www.linkedin.com/in/hamzaderbas",
  },
  {
    // Co-founder & CEO (Paulo da Costa is co-founder/COO).
    name: "Nick Aubin",
    companyName: "Commons Clinic",
    headshot: "/founders/cutouts/nick-aubin.png",
    linkedin: "https://www.linkedin.com/in/nick-aubin-56883647/",
  },
  {
    // Co-founder & COO of Commons Clinic.
    name: "Paulo da Costa",
    companyName: "Commons Clinic",
    headshot: "/founders/cutouts/paulo-da-costa.png",
    linkedin: "https://www.linkedin.com/in/paulo-da-costa-9abb739/",
  },
  {
    name: "Eyad Abdalla",
    companyName: "Plena Health",
    linkedin: "https://www.linkedin.com/in/eyadabd/",
    x: "https://x.com/eebadaeebada",
  },
  {
    name: "Ahmed Al Mudarris",
    companyName: "Plena Health",
    linkedin: "https://ca.linkedin.com/in/ahmed-al-mudarris-11a5381bb",
  },
  {
    // Co-founder & CEO (Jose Isaac Robledo is the other co-founder).
    name: "Andrew Peterson",
    companyName: "Array Labs",
    headshot: "/founders/cutouts/andrew-peterson.png",
    linkedin: "https://www.linkedin.com/in/andrew-peterson-array-labs/",
  },
  {
    // Corgi co-founders — Nico (CEO/CTO) first so the company card deep-links to him.
    name: "Nico Laqua",
    companyName: "Corgi",
    headshot: "/founders/cutouts/nico-laqua.png",
    linkedin: "https://www.linkedin.com/in/nico-laqua-302b17233/",
  },
  {
    name: "Emily Yuan",
    companyName: "Corgi",
    headshot: "/founders/cutouts/emily-yuan.png",
    linkedin: "https://www.linkedin.com/in/emilyyuan96",
  },
  {
    name: "Tade Oyerinde",
    companyName: "Campus",
    headshot: "/founders/cutouts/tade-oyerinde.png",
    linkedin: "https://www.linkedin.com/in/tadeoyerinde",
  },
  {
    // President of Aformic and of the AIUT Group (Aformic's parent — the
    // US arm of a Polish industrial automation company).
    name: "Marek Gabryś",
    companyName: "Aformic",
    headshot: "/founders/cutouts/marek-gabrys.png",
    linkedin: "https://pl.linkedin.com/in/marek-gabry%C5%9B-11b0b51",
  },
  {
    // CEO of Aformic.
    name: "Michal Fiuk",
    companyName: "Aformic",
    headshot: "/founders/cutouts/michal-fiuk.png",
    linkedin: "https://www.linkedin.com/in/michalfiuk",
  },
  // Moved toward the bottom by request — shown after everyone else.
  {
    name: "Sam Altman",
    companyName: "OpenAI",
    headshot: "/founders/cutouts/sam-altman.png",
    x: "https://x.com/sama",
  },
  {
    // Co-founder & President of OpenAI.
    name: "Greg Brockman",
    companyName: "OpenAI",
    headshot: "/founders/cutouts/greg-brockman.png",
    x: "https://x.com/gdb",
  },
  {
    name: "Michael LaFramboise",
    companyName: "Aurelius Systems",
    headshot: "/founders/cutouts/michael-laframboise.png",
    linkedin: "https://www.linkedin.com/in/michael-laframboise/",
    x: "https://x.com/LaFrogman",
  },
  // Eccentric Machines — founder not public (company is in stealth); no card until confirmed.
];

export function companyForFounder(f: Founder): Company | undefined {
  return PORTFOLIO.find((c) => c.name === f.companyName);
}

export function founderForCompany(companyName: string): Founder | undefined {
  return FOUNDERS.find((f) => f.companyName === companyName);
}

// Unique per-founder anchor/key: name + company, so multiple founders can share
// a company (e.g. Corgi) without their card ids/keys colliding. Company cards
// deep-link to their (first) founder's card via this same scheme.
export function founderAnchor(f: Founder): string {
  return slugify(`${f.name} ${f.companyName}`);
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
