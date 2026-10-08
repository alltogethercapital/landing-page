import { PORTFOLIO, slugify, type Company } from "./portfolio";

export type Founder = {
  name: string; // founder's name
  companyName: string; // must match a company `name` in PORTFOLIO
  headshot: string; // Local image required for every founder.
  linkedin?: string; // full URL to LinkedIn profile
  x?: string; // full URL to X (Twitter) profile
};

// Founder names, profiles, and portraits are grounded in public company,
// investor, publication, LinkedIn, or founder-owned social sources.
export const FOUNDERS: Founder[] = [
  { name: "Akshay Narisetti", headshot: "/founders/portraits/akshay-narisetti.webp", companyName: "Pocket", linkedin: "https://www.linkedin.com/in/akshaynarisetti" },
  { name: "Gabriel Dymowski", headshot: "/founders/portraits/gabriel-dymowski.webp", companyName: "Pocket", linkedin: "https://www.linkedin.com/in/gabrieldymowski" },
  { name: "Jack Qiu", headshot: "/founders/portraits/jack-qiu.webp", companyName: "Ultrasonium" },
  { name: "Christopher Carter", headshot: "/founders/portraits/christopher-carter.webp", companyName: "Ultrasonium" },
  { name: "Hunter Brown", headshot: "/founders/portraits/hunter-brown.webp", companyName: "Ultrasonium" },
  { name: "Alexander Urbanski", headshot: "/founders/portraits/alexander-urbanski.webp", companyName: "Ultrasonium" },
  { name: "Thomas Sohmers", headshot: "/founders/portraits/thomas-sohmers.webp", companyName: "Positron", linkedin: "https://www.linkedin.com/in/trsohmers" },
  { name: "Akash Ramdas", headshot: "/founders/portraits/akash-ramdas.webp", companyName: "Matforge" },
  { name: "Advaith Sridhar", headshot: "/founders/portraits/advaith-sridhar.webp", companyName: "Matforge" },
  { name: "Kareem Selim", headshot: "/founders/portraits/kareem-selim.webp", companyName: "Raspire" },
  { name: "Hassan Mostafa", headshot: "/founders/portraits/hassan-mostafa.webp", companyName: "Raspire" },
  { name: "Ariel Ekblaw", headshot: "/founders/portraits/ariel-ekblaw.webp", companyName: "Rendezvous Robotics", linkedin: "https://www.linkedin.com/in/arielekblaw" },
  { name: "Phil C. Frank", headshot: "/founders/portraits/phil-c-frank.webp", companyName: "Rendezvous Robotics" },
  { name: "Joe Landon", headshot: "/founders/portraits/joe-landon.webp", companyName: "Rendezvous Robotics", linkedin: "https://www.linkedin.com/in/joelandon" },
  { name: "Ivan Zakazov", headshot: "/founders/portraits/ivan-zakazov.webp", companyName: "Compresr" },
  { name: "Oussama Gabouj", headshot: "/founders/portraits/oussama-gabouj.webp", companyName: "Compresr" },
  { name: "Berke Argin", headshot: "/founders/portraits/berke-argin.webp", companyName: "Compresr" },
  { name: "Kamel Charaf", headshot: "/founders/portraits/kamel-charaf.webp", companyName: "Compresr" },
  { name: "Dimitris Koutentakis", headshot: "/founders/portraits/dimitris-koutentakis.webp", companyName: "Atomarine", linkedin: "https://www.linkedin.com/in/dkoutentakis/" },
  { name: "Emile Germonpre", headshot: "/founders/portraits/emile-germonpre.webp", companyName: "Atomarine", linkedin: "https://www.linkedin.com/in/emile-germonpr%C3%A9-766045245/" },
  { name: "Ian Brooke", headshot: "/founders/portraits/ian-brooke.webp", companyName: "Astro Mechanica", linkedin: "https://www.linkedin.com/in/ian-brooke-b7496325/" },
  { name: "Amie Leighton", headshot: "/founders/portraits/amie-leighton.webp", companyName: "Allia Health", linkedin: "https://www.linkedin.com/in/amieleighton/" },
  { name: "Saroosh Khan", headshot: "/founders/portraits/saroosh-khan.webp", companyName: "Allia Health", linkedin: "https://www.linkedin.com/in/saroosh-khan/" },
  { name: "Lucas Volini", headshot: "/founders/portraits/lucas-volini.webp", companyName: "Allia Health" },
  { name: "Andy Lonsberry", headshot: "/founders/portraits/andy-lonsberry.webp", companyName: "Path Robotics", linkedin: "https://www.linkedin.com/in/andrew-lonsberry-32154448/" },
  { name: "Alex Lonsberry", headshot: "/founders/portraits/alex-lonsberry.webp", companyName: "Path Robotics", linkedin: "https://www.linkedin.com/in/alex-lonsberry-a41020a8/" },
  { name: "Zaky Hassan", headshot: "/founders/portraits/zaky-hassan.webp", companyName: "Molagri" },
  { name: "Min Jin", headshot: "/founders/portraits/min-jin.webp", companyName: "Molagri" },
  { name: "Yousef Abdelfattah", headshot: "/founders/portraits/yousef-abdelfattah.webp", companyName: "TryNearby" },
  { name: "Obaida Albaroudi", headshot: "/founders/portraits/obaida-albaroudi.webp", companyName: "TryNearby" },
  { name: "Ahmad Ibrahim", headshot: "/founders/portraits/ahmad-ibrahim.webp", companyName: "TryNearby" },
  { name: "An Zhu Liu", headshot: "/founders/portraits/an-zhu-liu.webp", companyName: "Familiar Labs" },
  { name: "Mingi Kwon", headshot: "/founders/portraits/mingi-kwon.webp", companyName: "Familiar Labs" },
  { name: "Xu Zheng", headshot: "/founders/portraits/xu-zheng.webp", companyName: "Familiar Labs" },
  { name: "Nikhil Reddy", headshot: "/founders/portraits/nikhil-reddy.webp", companyName: "Datoric" },
  { name: "Jeffrey Lin", headshot: "/founders/portraits/jeffrey-lin.webp", companyName: "Datoric" },
  { name: "Ansh Tiwari", headshot: "/founders/portraits/ansh-tiwari.webp", companyName: "Rasyn" },
  { name: "Ayush Chauhan", headshot: "/founders/portraits/ayush-chauhan.webp", companyName: "Rasyn" },
  { name: "Daood Hashmi", headshot: "/founders/portraits/daood-hashmi.webp", companyName: "Rasyn" },
  {
    name: "Aidan Pratt",
    headshot: "/founders/portraits/aidan-pratt.webp",
    companyName: "Autostep",
    linkedin: "https://www.linkedin.com/in/aidan-pratt",
    x: "https://x.com/aidan__pratt",
  },
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
    name: "Jeff Bezos",
    companyName: "Blue Origin",
    headshot: "/founders/cutouts/jeff-bezos.png",
  },
  {
    name: "Mike Grace",
    companyName: "Longshot Space",
    headshot: "/founders/cutouts/mike-grace.png",
    linkedin: "https://www.linkedin.com/in/mike-grace-03452614",
  },
  {
    name: "Kaan Dogrusoz",
    companyName: "Weave Robotics",
    headshot: "/founders/cutouts/kaan-dogrusoz.png",
    linkedin: "https://www.linkedin.com/in/kaan-dogrusoz-073b748a/",
  },
  {
    name: "Evan Wineland",
    companyName: "Weave Robotics",
    headshot: "/founders/cutouts/evan-wineland.png",
    linkedin: "https://www.linkedin.com/in/ecwineland/",
  },
  {
    name: "Paul Copplestone",
    companyName: "Supabase",
    headshot: "/founders/cutouts/paul-copplestone.png",
    linkedin: "https://www.linkedin.com/in/paulcopplestone",
    x: "https://x.com/kiwicopple",
  },
  {
    name: "Ant Wilson",
    companyName: "Supabase",
    headshot: "/founders/cutouts/ant-wilson.png",
    linkedin: "https://uk.linkedin.com/in/ant-wilson-46179937",
    x: "https://x.com/AntWilson",
  },
  {
    name: "Dustin Walper",
    companyName: "Valstad",
    headshot: "/founders/cutouts/dustin-walper.png",
    linkedin: "https://www.linkedin.com/in/dustinwalper",
    x: "https://x.com/DustinWalper",
  },
  {
    name: "Alex Pachikov",
    companyName: "Sunflower Labs",
    headshot: "/founders/cutouts/alex-pachikov.png",
    linkedin: "https://www.linkedin.com/in/alexpach",
  },
  {
    name: "Chris Eheim",
    companyName: "Sunflower Labs",
    headshot: "/founders/cutouts/chris-eheim.png",
    linkedin: "https://ch.linkedin.com/in/ceheim",
  },
  {
    name: "Nick de Palézieux",
    companyName: "Sunflower Labs",
    headshot: "/founders/cutouts/nick-de-palezieux.png",
    linkedin:
      "https://ch.linkedin.com/in/nicolas-de-pal%C3%A9zieux-a8a4b598",
  },
  {
    name: "Travis Kalanick",
    companyName: "Atoms",
    headshot: "/founders/cutouts/travis-kalanick.png",
    x: "https://x.com/travisk",
  },
  {
    name: "Alex Mashrabov",
    companyName: "Higgsfield",
    headshot: "/founders/cutouts/alex-mashrabov.png",
    linkedin: "https://www.linkedin.com/in/amashrabov",
    x: "https://x.com/alexmashrabov",
  },
  {
    name: "Yerzat Dulat",
    companyName: "Higgsfield",
    headshot: "/founders/cutouts/yerzat-dulat.png",
    x: "https://x.com/codentropy",
  },
  {
    name: "Mahi de Silva",
    companyName: "Higgsfield",
    headshot: "/founders/cutouts/mahi-de-silva.png",
    linkedin: "https://www.linkedin.com/in/mdesilva",
  },
  {
    name: "Dean Leitersdorf",
    companyName: "Decart",
    headshot: "/founders/cutouts/dean-leitersdorf.png",
    linkedin: "https://www.linkedin.com/in/dean-leitersdorf",
  },
  {
    name: "Orian Leitersdorf",
    companyName: "Decart",
    headshot: "/founders/cutouts/orian-leitersdorf.png",
    linkedin: "https://il.linkedin.com/in/orian-leitersdorf-11956a240",
  },
  {
    name: "Moshe Shalev",
    companyName: "Decart",
    headshot: "/founders/cutouts/moshe-shalev.png",
    linkedin: "https://il.linkedin.com/in/moshe-shalev",
  },
  {
    name: "Jerry Tworek",
    companyName: "Core Automation",
    headshot: "/founders/cutouts/jerry-tworek.png",
    x: "https://x.com/MillionInt",
  },
  {
    name: "Rohan Anil",
    companyName: "Core Automation",
    headshot: "/founders/portraits/rohan-anil.webp",
    x: "https://x.com/_arohan_",
  },
  {
    name: "Joanne Jang",
    companyName: "Core Automation",
    headshot: "/founders/cutouts/joanne-jang.png",
    x: "https://x.com/joannejang",
  },
  {
    name: "Anmol Gulati",
    companyName: "Core Automation",
    headshot: "/founders/cutouts/anmol-gulati.png",
    x: "https://x.com/anmol01gulati",
  },
  {
    name: "Julia Villagra",
    companyName: "Core Automation",
    headshot: "/founders/cutouts/julia-villagra.png",
    x: "https://x.com/juliacvillagra",
  },
  {
    name: "Qasar Younis",
    companyName: "Applied Intuition",
    headshot: "/founders/cutouts/qasar-younis.png",
    linkedin: "https://www.linkedin.com/in/qasar/",
  },
  {
    name: "Peter Cetale",
    companyName: "Sourcerer",
    headshot: "/founders/cutouts/peter-cetale.png",
    linkedin: "https://www.linkedin.com/in/petercetale",
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
    headshot: "/founders/cutouts/ben-nowack.png",
    linkedin: "https://www.linkedin.com/in/ben-nowack/",
  },
  {
    name: "Tristan Semmelhack",
    companyName: "Reflect Orbital",
    headshot: "/founders/cutouts/tristan-semmelhack.png",
    linkedin: "https://www.linkedin.com/in/tristan-semmelhack-6a1ba0149/",
  },
  {
    name: "Hannan Happi",
    companyName: "Exowatt",
    headshot: "/founders/cutouts/hannan-happi.png",
    linkedin: "https://www.linkedin.com/in/hannanhappi/",
  },
  {
    name: "Assil Halimi",
    companyName: "Apollo Atomics",
    headshot: "/founders/cutouts/assil-halimi.png",
    linkedin: "https://www.linkedin.com/in/aahalimi/",
  },
  {
    name: "Drew Walker",
    companyName: "Apollo Atomics",
    headshot: "/founders/cutouts/drew-walker.png",
    linkedin: "https://www.linkedin.com/in/drewwalkerrr/",
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
    name: "Aaron Pempel",
    companyName: "MAV Unlimited",
    headshot: "/founders/cutouts/aaron-pempel.png",
    linkedin: "https://www.linkedin.com/in/aaron-pempel",
  },
  {
    name: "Robert Shepherd",
    companyName: "MAV Unlimited",
    headshot: "/founders/cutouts/robert-shepherd.png",
    linkedin: "https://www.linkedin.com/in/rob-shepherd-phd-mba-7743683",
  },
  {
    name: "T.J. Wallin",
    companyName: "MAV Unlimited",
    headshot: "/founders/cutouts/tj-wallin.png",
    linkedin: "https://www.linkedin.com/in/thomas-wallin-689a9228",
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
    headshot: "/founders/cutouts/eyad-abdalla.png",
    linkedin: "https://www.linkedin.com/in/eyadabd/",
    x: "https://x.com/eebadaeebada",
  },
  {
    name: "Ahmed Al Mudarris",
    companyName: "Plena Health",
    headshot: "/founders/cutouts/ahmed-al-mudarris.png",
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
