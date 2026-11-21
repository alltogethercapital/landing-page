export type Company = {
  name: string;
  href: string;
  sectors: string[];
  investmentStatus?: "complete" | "pending"; // omitted means complete
  blurb?: string; // telegraphic one-liner; must fit one card line with no ellipsis
  logo?: string; // /public path to the company's logo mark
  image?: string; // /public product image — falls back to a sector gradient when absent
  cardImage?: string; // product image used on the /companies page
  cardLogo?: string; // /public path to a transparent-PNG wordmark for the /companies card
  logoLabel?: string; // text paired with an icon-only logo to form a complete wordmark
  video?: string; // YouTube video id (11 chars) — shows a "Watch video" button when present
  videoStart?: number; // optional start time (seconds) for the video
  // Set only for a position bought on the public markets. Absent means the
  // default, so private positions carry no label of their own.
  publicListing?: { exchange: string; ticker: string };
};

// Machine Spirit Capital portfolio (machinespirit.com/portfolio)
// Card blurbs are telegraphic fragments (no trailing period). They must fit
// one unwrapped line in the narrowest card: 216px at 13.5px Source Sans 3
// (600px 2-col) and 228px at 14px (3-col min around 1381px). Hard budget:
// 200px at 13.5px / 208px at 14px, leaving room for subpixel rounding.
export const PORTFOLIO: Company[] = [
  { name: "Anthropic", href: "https://www.anthropic.com/", sectors: ["AI", "Research"], blurb: "Frontier AI safety, Claude", logo: "/logos/anthropic.svg", cardLogo: "/logos/cards/anthropic.svg", publicListing: { exchange: "Nasdaq", ticker: "ANT" } },
  { name: "Summer Engine", href: "https://www.summerengine.com/", sectors: ["AI", "Gaming", "Software"], blurb: "AI 2D and 3D game engine", logo: "/logos/summer-engine.svg", cardLogo: "/logos/cards/summer-engine.svg", image: "/work/cards/summer-engine.jpg", cardImage: "/work/cards/summer-engine.jpg" },
  { name: "Standard Bots", href: "https://standardbots.com/", sectors: ["Robotics", "AI", "Manufacturing"], blurb: "AI-native industrial robots", logo: "/logos/standard-bots.png", cardLogo: "/logos/cards/standard-bots.svg", logoLabel: "Standard Bots", image: "/work/cards/standard-bots.png", cardImage: "/work/cards/standard-bots.png" },
  { name: "Chef Robotics", href: "https://www.chefrobotics.ai/", sectors: ["Robotics", "AI", "Manufacturing"], blurb: "Food production robots", logo: "/logos/chef-robotics.png", cardLogo: "/logos/cards/chef-robotics.png", logoLabel: "Chef Robotics", image: "/work/cards/chef-robotics.jpg", cardImage: "/work/cards/chef-robotics.jpg" },
  { name: "Ultrasonium", href: "https://www.ultrasonium.com/", sectors: ["Manufacturing", "Materials", "Robotics"], blurb: "High-value metal parts", cardLogo: "/logos/cards/ultrasonium.png" },
  { name: "Path Robotics", href: "https://www.path-robotics.com/", sectors: ["Robotics", "AI", "Manufacturing"], blurb: "Autonomous welding robots", logo: "/logos/path-robotics.svg?v=20260915", cardLogo: "/logos/cards/path-robotics.svg?v=20260915", image: "/work/cards/path-robotics.jpg", cardImage: "/work/cards/path-robotics.jpg" },
  { name: "Molagri", href: "https://molagri.com/", sectors: ["Bio", "Agriculture"], blurb: "Crop-safe biopesticides", logo: "/logos/molagri.svg", cardLogo: "/logos/cards/molagri.svg" },
  { name: "Atomarine", href: "https://atomarine.co/", sectors: ["Energy", "Infrastructure", "AI"], blurb: "Floating data-center campuses", logo: "/logos/atomarine.png", cardLogo: "/logos/cards/atomarine.png", logoLabel: "Atomarine", image: "/work/cards/atomarine.jpg", cardImage: "/work/cards/atomarine.jpg" },
  { name: "Astro Mechanica", href: "https://www.astromecha.co/", sectors: ["Aerospace", "Energy", "Defense"], blurb: "Turboelectric adaptive engines", logo: "/logos/astro-mechanica.png", cardLogo: "/logos/cards/astro-mechanica.png", logoLabel: "Astro Mechanica", image: "/work/cards/astro-mechanica.jpg", cardImage: "/work/cards/astro-mechanica.jpg" },
  { name: "TryNearby", href: "https://trynearby.com/", sectors: ["Software", "AI"], blurb: "Local creator word-of-mouth", logo: "/logos/trynearby.svg", cardLogo: "/logos/cards/trynearby.svg" },
  { name: "Familiar Labs", href: "https://www.thefamiliarlab.com/", sectors: ["AI", "Video"], blurb: "AI dubbing with lip sync", logo: "/logos/familiar-labs.svg", cardLogo: "/logos/cards/familiar-labs.svg" },
  { name: "CarSignal", href: "https://trycarsignal.com/", sectors: ["AI", "Software"], blurb: "AI OS for auto shops", logo: "/logos/carsignal.png", cardLogo: "/logos/cards/carsignal.png", logoLabel: "CarSignal" },
  { name: "Datoric", href: "https://www.datoric.com/", sectors: ["AI", "Robotics"], blurb: "Robotics training data", logo: "/logos/datoric.png", cardLogo: "/logos/cards/datoric.png", logoLabel: "Datoric" },
  { name: "Rasyn", href: "https://www.rasyn.ai/", sectors: ["AI", "Bio"], blurb: "AI chemical discovery", logo: "/logos/rasyn.svg", cardLogo: "/logos/cards/rasyn-mark.png", logoLabel: "Rasyn" },
  {
    name: "Autostep",
    href: "https://www.autostep.ai/",
    sectors: ["AI", "Software"],
    blurb: "Work-process cost mapping",
    logo: "/logos/autostep.png",
    cardLogo: "/logos/cards/autostep.png",
    logoLabel: "AUTOSTEP",
    image: "/work/cards/autostep.png",
    cardImage: "/work/cards/autostep.png",
  },
  {
    name: "Shield AI",
    href: "https://shield.ai/",
    sectors: ["Defense", "AI"],
    blurb: "AI pilots, autonomous fighters",
    logo: "/logos/shield-ai.png",
    cardLogo: "/logos/cards/shield-ai.png",
    image: "/hero-drones.jpg",
    cardImage: "/work/cards/shield-ai.jpg",
    video: "OnpuNlE3UxU", // X‑BAT: Earth Is Our Runway (Shield AI)
    videoStart: 32,
  },
  {
    name: "1X",
    href: "https://www.1x.tech/",
    sectors: ["AI", "Robotics"],
    blurb: "Home humanoid robots",
    logo: "/logos/1x.png",
    cardLogo: "/logos/cards/1x.png",
    image: "/hero-robots.jpg",
    cardImage: "/work/cards/1x.jpg",
    video: "ag_rFhvSNmE", // NEO Factory | Hayward, California (1X)
  },
  {
    name: "OpenAI",
    href: "https://openai.com/",
    sectors: ["AI"],
    blurb: "Frontier AI, ChatGPT",
    logo: "/logos/openai.png",
    cardLogo: "/logos/cards/openai.png",
    image: "/work/openai.jpg",
    cardImage: "/work/cards/openai.jpg",
    video: "HK6y8DAPN_0", // Introducing Sora (OpenAI)
  },
  {
    name: "Blue Origin",
    href: "https://www.blueorigin.com/",
    sectors: ["Space", "Aerospace"],
    blurb: "Reusable rockets",
    cardLogo: "/logos/cards/blue-origin.png",
    image: "/work/cards/blue-origin.jpg",
    cardImage: "/work/cards/blue-origin.jpg",
  },
  {
    name: "Longshot Space",
    href: "https://www.longshotspace.com/",
    sectors: ["Space", "Aerospace", "Defense"],
    blurb: "Hypersonic ground testing",
    cardLogo: "/logos/cards/longshot-space.png",
    image: "/work/cards/longshot-space.jpg",
    cardImage: "/work/cards/longshot-space.jpg",
  },
  { name: "Positron", href: "https://www.positron.ai/", sectors: ["AI", "Semiconductors", "Infrastructure"], blurb: "Memory-first AI inference", cardLogo: "/logos/cards/positron-ai.svg" },
  {
    name: "Weave Robotics",
    href: "https://www.weaverobotics.com/",
    sectors: ["Robotics", "AI"],
    blurb: "Laundry-folding home robots",
    cardLogo: "/logos/cards/weave-robotics.png",
    image: "/work/cards/weave-robotics.jpg",
    cardImage: "/work/cards/weave-robotics.jpg",
  },
  {
    name: "Supabase",
    href: "https://supabase.com/",
    sectors: ["Software", "Infrastructure"],
    blurb: "Open-source Postgres backend",
    logo: "/logos/supabase.png",
    cardLogo: "/logos/cards/supabase.png",
    image: "/work/cards/supabase.jpg",
    cardImage: "/work/cards/supabase.jpg",
  },
  {
    name: "Valstad",
    href: "https://valstad.com/",
    sectors: ["Defense", "Robotics"],
    blurb: "Robotic ship fabrication",
    logo: "/logos/valstad.png",
    cardLogo: "/logos/cards/valstad.png",
    image: "/work/cards/valstad.jpg",
    cardImage: "/work/cards/valstad.jpg",
  },
  {
    name: "Sunflower Labs",
    href: "https://sunflower-labs.com/",
    sectors: ["Robotics", "Security"],
    blurb: "Drone home security",
    logo: "/logos/sunflower-labs.png",
    cardLogo: "/logos/cards/sunflower-labs.svg",
    image: "/work/cards/sunflower-labs.jpg",
    cardImage: "/work/cards/sunflower-labs.jpg",
  },
  {
    name: "Atoms",
    href: "https://atoms.co/",
    sectors: ["Robotics", "AI"],
    blurb: "Food, mining, transport robots",
    logo: "/logos/atoms.png",
    cardLogo: "/logos/cards/atoms.png",
    image: "/work/cards/atoms.jpg",
    cardImage: "/work/cards/atoms.jpg",
  },
  {
    name: "Higgsfield",
    href: "https://higgsfield.ai/",
    sectors: ["AI", "Video"],
    blurb: "AI video generation",
    logo: "/logos/higgsfield.png",
    cardLogo: "/logos/cards/higgsfield-mark.png",
    logoLabel: "Higgsfield",
    image: "/work/cards/higgsfield.jpg",
    cardImage: "/work/cards/higgsfield.jpg",
  },
  {
    name: "Decart",
    href: "https://decart.ai/",
    sectors: ["AI", "Infrastructure"],
    blurb: "Real-time world models",
    cardLogo: "/logos/cards/decart.svg",
    cardImage: "/work/cards/decart.jpg",
  },
  { name: "Matforge", href: "https://discoveredmaterials.com/", sectors: ["AI", "Semiconductors", "Materials"], blurb: "AI scientists for materials", cardLogo: "/logos/cards/matforge.svg" },
  { name: "Raspire", href: "https://raspire.com/", sectors: ["Security", "AI", "Software"], blurb: "Mobile app runtime security", cardLogo: "/logos/cards/raspire.svg?v=20261014", logoLabel: "Raspire" },
  { name: "Rendezvous Robotics", href: "https://www.rdvrobotics.com/", sectors: ["Space", "Robotics", "Defense"], blurb: "Modular in-orbit spacecraft", cardLogo: "/logos/cards/rendezvous-robotics-ink.svg" },
  { name: "Compresr", href: "https://www.compresr.com/", sectors: ["AI", "Infrastructure", "Software"], blurb: "AI context compression", cardLogo: "/logos/cards/compresr.svg", logoLabel: "Compresr" },
  {
    name: "Core Automation",
    href: "https://www.coreauto.com/",
    sectors: ["AI", "Research"],
    blurb: "Automated AI lab",
    cardLogo: "/logos/cards/core-automation-mark.svg",
    logoLabel: "Core Automation",
    cardImage: "/work/cards/core-automation.jpg",
  },
  {
    name: "Anduril",
    href: "https://www.anduril.com/",
    sectors: ["Defense", "AI"],
    blurb: "Autonomous defense systems",
    logo: "/logos/anduril.png",
    cardLogo: "/logos/cards/anduril.png",
    image: "/work/anduril.jpg",
    cardImage: "/work/cards/anduril.jpg",
    video: "RpFFScTovII", // Lattice for Mission Autonomy (Anduril Industries)
  },
  {
    name: "Aurelius Systems",
    href: "https://www.aureliussystems.com/",
    sectors: ["Defense", "Directed Energy"],
    blurb: "Archimedes counter-drone laser",
    logo: "/logos/aurelius.png",
    cardLogo: "/logos/cards/aurelius-ink.png",
    image: "/work/aurelius.jpg",
    cardImage: "/work/cards/aurelius.jpg",
    video: "Oym5abej2qw", // This Startup Shoots Down Drones With Lasers (Cerebral Valley)
  },
  {
    name: "Salient Motion",
    href: "https://salientmotion.com/",
    sectors: ["Defense", "Aerospace"],
    blurb: "Aviation, defense actuation",
    logo: "/logos/salient.png",
    cardLogo: "/logos/cards/salient.png",
    image: "/work/salient-jet.jpg",
    cardImage: "/work/cards/salient.jpg",
  },
  {
    name: "Replit",
    href: "https://replit.com/",
    sectors: ["Software", "AI"],
    blurb: "AI-native coding platform",
    logo: "/logos/replit.png",
    cardLogo: "/logos/cards/replit.png",
    image: "/work/replit.jpg",
    cardImage: "/work/cards/replit.jpg",
    video: "-2xHmkpmCBM", // Replit Agent 4 Launch Announcement (Replit)
  },
  {
    name: "Figure AI",
    href: "https://www.figure.ai/",
    sectors: ["AI", "Robotics"],
    blurb: "Workforce humanoid robots",
    logo: "/logos/figure.png",
    cardLogo: "/logos/cards/figure.png",
    image: "/work/figure-ai.jpg",
    cardImage: "/work/cards/figure.jpg",
    // Figure 03 trailer — embeddable upload (playableInEmbed:true, 0 end-screen
    // cards, verified). NOTE: third-party re-upload (channel "rmn-t1x"), not
    // Figure's official channel, so it could be removed by YouTube at any time.
    video: "CvHQ6qENEkQ", // Figure AI 3 (embeddable re-upload)
  },
  {
    name: "Apptronik",
    href: "https://apptronik.com/",
    sectors: ["AI", "Robotics"],
    blurb: "Apollo industrial humanoids",
    logo: "/logos/apptronik.png",
    cardLogo: "/logos/cards/apptronik.png",
    image: "/work/apptronik.jpg",
    cardImage: "/work/cards/apptronik.jpg",
    video: "uJOA5IDaL5g", // Hello Apollo (Apptronik)
  },
  {
    name: "Volantis",
    href: "https://www.volantissemi.ai/",
    sectors: ["AI", "Semiconductors"],
    blurb: "AI semiconductor design",
    logo: "/logos/volantis.png",
    cardLogo: "/logos/cards/volantis-orange.png",
    image: "/work/volantis.jpg",
    cardImage: "/work/cards/volantis.jpg",
  },
  {
    name: "Starcloud",
    href: "https://www.starcloud.com/",
    sectors: ["Space", "Compute"],
    blurb: "Orbital solar data centers",
    logo: "/logos/starcloud.png",
    cardLogo: "/logos/cards/starcloud-ink.svg",
    image: "/work/starcloud.jpg",
    cardImage: "/work/cards/starcloud.jpg",
    video: "u9m6tCZa2-k", // Starcloud Constellation (Starcloud)
  },
  {
    name: "Reflect Orbital",
    href: "https://www.reflectorbital.com/",
    sectors: ["Space", "Energy"],
    blurb: "Sunlight after dark",
    cardLogo: "/logos/cards/reflect-orbital.png",
    cardImage: "/work/cards/reflect-orbital.jpg",
  },
  {
    name: "Exowatt",
    href: "https://www.exowatt.com/",
    sectors: ["Energy"],
    blurb: "Solar-thermal for AI compute",
    logo: "/logos/exowatt.png",
    cardLogo: "/logos/cards/exowatt.svg",
    image: "/work/exowatt.jpg",
    cardImage: "/work/cards/exowatt.jpg",
    video: "kQgvCo5XG18", // Exowatt Power Summit 25 Sizzle Reel (Exowatt)
  },
  {
    name: "Apollo Atomics",
    href: "https://www.apolloatomics.com/",
    sectors: ["Energy", "Nuclear"],
    blurb: "Compact factory-built reactors",
    cardLogo: "/logos/cards/apollo-atomics-ink.png",
    cardImage: "/work/cards/apollo-atomics.jpg",
  },
  {
    name: "Aalo Atomics",
    href: "https://www.aalo.com/",
    sectors: ["Energy", "Nuclear"],
    blurb: "Modular nuclear reactors",
    logo: "/logos/aalo.png",
    cardLogo: "/logos/cards/aalo.png",
    image: "/work/aalo.jpg",
    cardImage: "/work/cards/aalo.jpg",
    video: "LuhHQshC7Xk", // Unveiling the Aalo-1 Prototype and Aalo Pod (Aalo Atomics)
  },
  {
    name: "Quaise Energy",
    href: "https://quaise.energy/",
    sectors: ["Energy", "Geothermal"],
    blurb: "Ultra-deep geothermal energy",
    logo: "/logos/quaise.png",
    cardLogo: "/logos/cards/quaise.svg",
    image: "/work/quaise.jpg",
    cardImage: "/work/cards/quaise.jpg",
    video: "5U8-KoKB6_8", // Lab to Field Testing of Millimeter Wave Drilling (Quaise Energy)
  },
  {
    name: "Unspun",
    href: "https://www.unspun.io/",
    sectors: ["Robotics", "Manufacturing"],
    blurb: "On-demand robotic apparel",
    logo: "/logos/unspun.png",
    cardLogo: "/logos/cards/unspun.png",
    image: "/work/unspun.jpg",
    cardImage: "/work/cards/unspun.jpg",
    video: "lLvn0o-jhuI", // 3D weaving | Vega by unspun (unspun)
  },
  {
    name: "MAV Unlimited",
    href: "https://mav-unlimited.com/",
    sectors: ["Manufacturing", "Materials"],
    blurb: "Volumetric 3D printing",
    cardLogo: "/logos/cards/mav-unlimited.svg",
    cardImage: "/work/cards/mav-unlimited.jpg",
  },
  {
    name: "Lance",
    href: "https://www.lance.live/",
    sectors: ["Software"],
    blurb: "Future of hospitality",
    logo: "/logos/lance.png",
    cardLogo: "/logos/cards/lance-ink.png",
    image: "/work/lance.jpg",
    cardImage: "/work/cards/lance.jpg",
    video: "4lfd34piGiE", // guests got places to be (Lance)
  },
  {
    name: "Samply",
    href: "https://samply.app/",
    sectors: ["Software", "Audio"],
    blurb: "Music sample management",
    logo: "/logos/samply.png",
    cardLogo: "/logos/cards/samply-mark.svg",
    logoLabel: "Samply",
    image: "/work/samply.jpg",
    cardImage: "/work/cards/samply.jpg",
    video: "0MT2smBqloI", // Getting started with Samply (Samply)
  },
  {
    name: "Hark",
    href: "https://hark.com/",
    sectors: ["AI", "Consumer"],
    blurb: "AI-powered work tools",
    logo: "/logos/hark.png",
    cardLogo: "/logos/cards/hark.png",
    image: "/work/hark.jpg",
    cardImage: "/work/cards/hark.jpg",
    video: "0H1LSLipOVI", // Introducing Hark (Hark)
  },
  {
    name: "Campus",
    href: "https://campus.edu/",
    sectors: ["Education", "AI"],
    blurb: "Accredited online college",
    logo: "/logos/campus.png",
    cardLogo: "/logos/cards/campus.svg",
    cardImage: "/work/cards/campus.jpg",
  },
  {
    name: "Bud Break Innovations",
    href: "https://www.budbreakinnovations.com/",
    sectors: ["Bio", "Agriculture"],
    blurb: "Robotics for agriculture",
    logo: "/logos/budbreak.png",
    cardLogo: "/logos/cards/budbreak.svg",
    image: "/work/budbreak.jpg",
    cardImage: "/work/cards/budbreak.jpg",
    video: "8sLI-XocJFw", // I Built a Robot to Save the Wine Industry (Budbreak Innovations)
  },
  {
    name: "Maven Robotics",
    href: "https://www.mavenrobotics.ai/",
    sectors: ["AI", "Robotics"],
    blurb: "Industrial AI working robots",
    logo: "/logos/maven.png",
    cardLogo: "/logos/cards/maven.svg",
    cardImage: "/work/cards/maven.jpg",
  },
  {
    name: "Eccentric Machines",
    href: "https://www.eccentricmachines.com/",
    sectors: ["Robotics", "AI"],
    blurb: "Intelligent robotic motion",
    cardLogo: "/logos/cards/eccentric.png",
    image: "/work/eccentric.jpg",
    cardImage: "/work/cards/eccentric.jpg",
  },
  {
    name: "Array Labs",
    href: "https://www.arraylabs.io/",
    sectors: ["Space", "Defense"],
    blurb: "Real-time 3D Earth maps",
    cardLogo: "/logos/cards/array-labs.png",
    cardImage: "/work/cards/array-labs.jpg",
    video: "SS0a_KjvDis", // Introducing Site3D, from Array Labs
  },
  {
    name: "Commons Clinic",
    href: "https://commonsclinic.com/",
    sectors: ["Healthcare"],
    blurb: "Value-based specialty care",
    cardLogo: "/logos/cards/commons-clinic.png",
    cardImage: "/work/cards/commons-clinic.jpg",
  },
  {
    name: "Plena Health",
    href: "https://www.plena.health/",
    sectors: ["Healthcare", "AI"],
    blurb: "AI OS for specialty practices",
    cardLogo: "/logos/cards/plena-health-wordmark.png",
    cardImage: "/work/cards/plena-health.jpg",
  },
  {
    name: "Aformic",
    href: "https://aformic.com/",
    sectors: ["Robotics", "Logistics"],
    blurb: "Warehouse and factory robots",
    cardLogo: "/logos/cards/aformic.png",
    cardImage: "/work/cards/aformic.jpg",
  },
];

// sector → gradient (for cards without a product image)
const SECTOR_GRADIENTS: Record<string, string> = {
  AI: "from-[#06212e] via-[#072c3a] to-[#0a3b4d]",
  Defense: "from-[#15181d] via-[#1d222a] to-[#2b323c]",
  Energy: "from-[#2a1505] via-[#3d1f06] to-[#5a2c09]",
  Robotics: "from-[#121417] via-[#1b1e23] to-[#2a2f37]",
  Space: "from-[#0c0a1e] via-[#141233] to-[#241f4a]",
  Semiconductors: "from-[#08140f] via-[#0d2019] to-[#143329]",
  Software: "from-[#0b1016] via-[#121a24] to-[#1c2734]",
  Infrastructure: "from-[#08140f] via-[#0d2019] to-[#143329]",
  "Supply Chain": "from-[#0a1714] via-[#10261f] to-[#173c31]",
  Manufacturing: "from-[#11140f] via-[#1b2119] to-[#273021]",
  Materials: "from-[#12130f] via-[#1f211a] to-[#303126]",
  Bio: "from-[#091505] via-[#10240b] to-[#1a3a14]",
  Compute: "from-[#0c0a1e] via-[#141233] to-[#241f4a]",
  Education: "from-[#0c1724] via-[#102338] to-[#17324d]",
  Healthcare: "from-[#06241f] via-[#0a352f] to-[#114a40]",
  Insurance: "from-[#0a1b2b] via-[#0e2a3f] to-[#163c54]",
  Research: "from-[#161616] via-[#202020] to-[#2a2a2a]",
  Security: "from-[#071815] via-[#0c2923] to-[#123d34]",
};

export function gradientFor(company: Company): string {
  for (const s of company.sectors) {
    if (SECTOR_GRADIENTS[s]) return SECTOR_GRADIENTS[s];
  }
  return "from-[#141414] via-[#1c1c1c] to-[#262626]";
}

export function isCompleteInvestment(company: Company): boolean {
  return company.investmentStatus !== "pending";
}

// URL-safe slug from a name (e.g. "Shield AI" → "shield-ai").
// Used to anchor a founder's card on /founders and deep-link to it from a company card.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
