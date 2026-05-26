import { PORTFOLIO, slugify, type Company } from "./portfolio";

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
    headshot: "/founders/brandon-tseng.jpg",
    linkedin: "https://www.linkedin.com/in/brandontseng/",
  },
  {
    // Co-founder; President & Chief Strategy Officer (founding CEO).
    name: "Ryan Tseng",
    companyName: "Shield AI",
    linkedin: "https://www.linkedin.com/in/ryantseng",
  },
  {
    name: "Bernt Børnich",
    companyName: "1X",
    headshot: "/founders/bernt-bornich.jpg",
    x: "https://x.com/BerntBornich",
  },
  {
    name: "Dario Amodei",
    companyName: "Anthropic",
    headshot: "/founders/dario-amodei.jpg",
    linkedin: "https://www.linkedin.com/in/dario-amodei-3934934/",
    x: "https://x.com/DarioAmodei",
  },
  {
    // Co-founder & President of Anthropic (sister of Dario).
    name: "Daniela Amodei",
    companyName: "Anthropic",
    linkedin: "https://www.linkedin.com/in/daniela-amodei-790bb22a/",
  },
  {
    name: "Palmer Luckey",
    companyName: "Anduril",
    headshot: "/founders/palmer-luckey.jpg",
    linkedin: "https://www.linkedin.com/in/palmer-luckey-21a16959/",
    x: "https://x.com/PalmerLuckey",
  },
  {
    // Co-founder & Executive Chairman; partner at Founders Fund.
    name: "Trae Stephens",
    companyName: "Anduril",
    linkedin: "https://www.linkedin.com/in/trae-stephens-485a811/",
  },
  {
    name: "Vishaal Mali",
    companyName: "Salient Motion",
    headshot: "/founders/vishaal-mali.jpg",
    linkedin: "https://www.linkedin.com/in/vishaalmali/",
  },
  {
    name: "Amjad Masad",
    companyName: "Replit",
    headshot: "/founders/amjad-masad.jpg",
    linkedin: "https://www.linkedin.com/in/amjadmasad/",
    x: "https://x.com/amasad",
  },
  {
    name: "Qasar Younis",
    companyName: "Applied Intuition",
    headshot: "/founders/qasar-younis.jpg",
    linkedin: "https://www.linkedin.com/in/qasar/",
  },
  {
    name: "Brett Adcock",
    companyName: "Figure AI",
    headshot: "/founders/brett-adcock.jpg",
    linkedin: "https://www.linkedin.com/in/brettadcock/",
    x: "https://x.com/adcock_brett",
  },
  {
    name: "Jeff Cardenas",
    companyName: "Apptronik",
    headshot: "/founders/jeff-cardenas.jpg",
    linkedin: "https://www.linkedin.com/in/jeffrey-cardenas",
  },
  {
    // Co-founder & CTO.
    name: "Nick Paine",
    companyName: "Apptronik",
    linkedin: "https://www.linkedin.com/in/nipaine/",
  },
  {
    name: "Tapa Ghosh",
    companyName: "Volantis",
    headshot: "/founders/tapa-ghosh.jpg",
    linkedin: "https://www.linkedin.com/in/tapa-ghosh-156640102/",
    x: "https://x.com/semiDL",
  },
  {
    name: "Philip Johnston",
    companyName: "Starcloud",
    headshot: "/founders/philip-johnston.jpg",
    linkedin: "https://www.linkedin.com/in/johnstonphilip/",
  },
  {
    name: "Hannan Happi",
    companyName: "Exowatt",
    headshot: "/founders/hannan-happi.jpg",
    linkedin: "https://www.linkedin.com/in/hannanhappi/",
  },
  {
    name: "Matt Loszak",
    companyName: "Aalo Atomics",
    headshot: "/founders/matt-loszak.jpg",
    linkedin: "https://www.linkedin.com/in/matt-loszak/",
    x: "https://x.com/MattLoszak",
  },
  {
    name: "Carlos Araque",
    companyName: "Quaise Energy",
    headshot: "/founders/carlos-araque.jpg",
    linkedin: "https://www.linkedin.com/in/quaise/",
  },
  {
    name: "Beth Esponnette",
    companyName: "Unspun",
    headshot: "/founders/beth-esponnette.jpg",
    linkedin: "https://www.linkedin.com/in/beth-esponnette-66763023/",
  },
  {
    name: "Caleb Chan",
    companyName: "Lance",
    headshot: "/founders/caleb-chan.jpg",
    linkedin: "https://www.linkedin.com/in/caleb-chan-327b14239/",
    x: "https://x.com/calebychan",
  },
  {
    name: "Eric Schirtzinger",
    companyName: "Samply",
    headshot: "/founders/eric-schirtzinger.jpg",
    linkedin: "https://www.linkedin.com/in/eschirtz/",
    x: "https://x.com/eschirtz",
  },
  {
    // Brett Adcock founded both Figure AI and Hark (his AI lab).
    name: "Brett Adcock",
    companyName: "Hark",
    headshot: "/founders/brett-adcock.jpg",
    linkedin: "https://www.linkedin.com/in/brettadcock/",
    x: "https://x.com/adcock_brett",
  },
  {
    name: "Jonathan Moon",
    companyName: "Bud Break Innovations",
    headshot: "/founders/jonathan-moon.jpg",
    linkedin: "https://www.linkedin.com/in/jmoon0714/",
    x: "https://x.com/jmoonio",
  },
  {
    name: "Hamza Derbas",
    companyName: "Maven Robotics",
    headshot: "/founders/hamza-derbas.jpg",
    linkedin: "https://www.linkedin.com/in/hamzaderbas",
  },
  {
    // Co-founder & CEO (Paulo da Costa is co-founder/COO).
    name: "Nick Aubin",
    companyName: "Commons Clinic",
    headshot: "/founders/nick-aubin.jpg",
    linkedin: "https://www.linkedin.com/in/nick-aubin-56883647/",
  },
  {
    // Co-founder & COO of Commons Clinic.
    name: "Paulo da Costa",
    companyName: "Commons Clinic",
    linkedin: "https://www.linkedin.com/in/paulo-da-costa-9abb739/",
  },
  {
    // Co-founder & CEO (Jose Isaac Robledo is the other co-founder). No headshot yet.
    name: "Andrew Peterson",
    companyName: "Array Labs",
    linkedin: "https://www.linkedin.com/in/andrew-peterson-array-labs/",
  },
  {
    // Corgi co-founders — Nico (CEO/CTO) first so the company card deep-links to him.
    name: "Nico Laqua",
    companyName: "Corgi",
    linkedin: "https://www.linkedin.com/in/nico-laqua-302b17233/",
  },
  {
    name: "Emily Yuan",
    companyName: "Corgi",
    linkedin: "https://www.linkedin.com/in/emilyyuan96",
  },
  {
    // Founder & CEO of xAI.
    name: "Elon Musk",
    companyName: "xAI",
    x: "https://x.com/elonmusk",
  },
  {
    // Co-founder & CEO of Crusoe.
    name: "Chase Lochmiller",
    companyName: "Crusoe",
    linkedin: "https://www.linkedin.com/in/chase-lochmiller-604483341/",
  },
  {
    // Co-founder & President of Crusoe.
    name: "Cully Cavness",
    companyName: "Crusoe",
    linkedin: "https://www.linkedin.com/in/ccavness",
  },
  {
    // Co-founder & CEO of Sierra (formerly co-CEO of Salesforce).
    name: "Bret Taylor",
    companyName: "Sierra",
    x: "https://x.com/btaylor",
  },
  {
    // Co-founder of Sierra (formerly Google VR/AR lead).
    name: "Clay Bavor",
    companyName: "Sierra",
    linkedin: "https://www.linkedin.com/in/claybavor",
  },
  {
    // Co-founder & CEO of Legora.
    name: "Max Junestrand",
    companyName: "Legora",
    linkedin: "https://www.linkedin.com/in/maxjunestrand/",
  },
  {
    // Founder & CEO of Vercel.
    name: "Guillermo Rauch",
    companyName: "Vercel",
    linkedin: "https://www.linkedin.com/in/rauchg/",
    x: "https://x.com/rauchg",
  },
  // Moved toward the bottom by request — shown after everyone else.
  {
    name: "Sam Altman",
    companyName: "OpenAI",
    headshot: "/founders/sam-altman.jpg",
    x: "https://x.com/sama",
  },
  {
    // Co-founder & President of OpenAI.
    name: "Greg Brockman",
    companyName: "OpenAI",
    x: "https://x.com/gdb",
  },
  {
    name: "Michael LaFramboise",
    companyName: "Aurelius Systems",
    headshot: "/founders/michael-laframboise.jpg",
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
