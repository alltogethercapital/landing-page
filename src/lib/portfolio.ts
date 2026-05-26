export type Company = {
  name: string;
  href: string;
  sectors: string[];
  blurb?: string; // short one-liner (revealed on hover)
  logo?: string; // /public path to the company's logo mark
  image?: string; // /public product image — falls back to a sector gradient when absent
  cardImage?: string; // /public image for the /companies card only (hero keeps using `image`)
  video?: string; // YouTube video id (11 chars) — shows a "Watch video" button when present
  videoStart?: number; // optional start time (seconds) for the video
};

// All Together Capital portfolio (alltogethercapital.com/portfolio)
export const PORTFOLIO: Company[] = [
  {
    name: "Shield AI",
    href: "https://shield.ai/",
    sectors: ["Defense", "AI"],
    blurb: "AI pilots for aircraft, and the X-BAT autonomous fighter jet.",
    logo: "/logos/shield-ai.png",
    image: "/hero-drones.jpg",
    video: "OnpuNlE3UxU", // X-BAT: Earth Is Our Runway (Shield AI)
    videoStart: 32,
  },
  {
    name: "1X",
    href: "https://www.1x.tech/",
    sectors: ["AI", "Robotics"],
    blurb: "Humanoid robots engineered for the home.",
    logo: "/logos/1x.png",
    image: "/hero-robots.jpg",
    cardImage: "/work/cards/1x.jpg",
    video: "ag_rFhvSNmE", // NEO Factory | Hayward, California (1X)
  },
  {
    name: "OpenAI",
    href: "https://openai.com/",
    sectors: ["AI"],
    blurb: "Frontier AI research — creators of ChatGPT and the GPT models.",
    logo: "/logos/openai.png",
    image: "/work/openai.jpg",
    cardImage: "/work/cards/openai.jpg",
    video: "HK6y8DAPN_0", // Introducing Sora (OpenAI)
  },
  {
    name: "Anthropic",
    href: "https://www.anthropic.com/",
    sectors: ["AI"],
    blurb: "AI safety research and Claude, a frontier AI assistant.",
    logo: "/logos/anthropic.png",
    image: "/work/anthropic.jpg",
    cardImage: "/work/cards/anthropic.jpg",
    video: "oqUclC3gqKs", // A day with Claude (Anthropic)
  },
  {
    name: "Anduril",
    href: "https://www.anduril.com/",
    sectors: ["Defense", "AI"],
    blurb: "Autonomous defense systems built on the Lattice platform.",
    logo: "/logos/anduril.png",
    image: "/work/anduril.jpg",
    cardImage: "/work/cards/anduril.jpg",
    video: "RpFFScTovII", // Lattice for Mission Autonomy (Anduril Industries)
  },
  {
    name: "Aurelius Systems",
    href: "https://www.aureliussystems.com/",
    sectors: ["Defense", "Directed Energy"],
    blurb: "Archimedes — an autonomous directed-energy counter-drone laser.",
    logo: "/logos/aurelius.png",
    image: "/work/aurelius.jpg",
    cardImage: "/work/cards/aurelius.jpg",
    video: "Oym5abej2qw", // This Startup Shoots Down Drones With Lasers (Cerebral Valley)
  },
  {
    name: "Salient Motion",
    href: "https://salientmotion.com/",
    sectors: ["Defense", "Aerospace"],
    blurb: "Critical actuation systems for aviation and defense.",
    logo: "/logos/salient.png",
    image: "/work/salient-jet.jpg",
    cardImage: "/work/cards/salient.jpg",
  },
  {
    name: "Replit",
    href: "https://replit.com/",
    sectors: ["Software", "AI"],
    blurb: "The AI-native platform for building and shipping software.",
    logo: "/logos/replit.png",
    image: "/work/replit.jpg",
    cardImage: "/work/cards/replit.jpg",
    video: "-2xHmkpmCBM", // Replit Agent 4 Launch Announcement (Replit)
  },
  {
    name: "Applied Intuition",
    href: "https://www.appliedintuition.com/",
    sectors: ["AI", "Robotics"],
    blurb: "Simulation and tooling for autonomous vehicles and machines.",
    logo: "/logos/applied.png",
    image: "/work/applied.jpg",
    cardImage: "/work/cards/applied.jpg",
    video: "eL-YnfG4K_0", // Inside 2025: Applied Intuition's Year of Building Physical AI
  },
  {
    name: "Figure AI",
    href: "https://www.figure.ai/",
    sectors: ["AI", "Robotics"],
    blurb: "General-purpose humanoid robots for the workforce.",
    logo: "/logos/figure.png",
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
    blurb: "Apollo — a general-purpose humanoid robot for industry.",
    logo: "/logos/apptronik.png",
    image: "/work/apptronik.jpg",
    cardImage: "/work/cards/apptronik.jpg",
    video: "uJOA5IDaL5g", // Hello Apollo (Apptronik)
  },
  {
    name: "Volantis",
    href: "https://www.volantissemi.ai/",
    sectors: ["AI", "Semiconductors"],
    blurb: "AI-driven semiconductor design.",
    logo: "/logos/volantis.png",
    image: "/work/volantis.jpg",
    cardImage: "/work/cards/volantis.jpg",
  },
  {
    name: "Starcloud",
    href: "https://www.starcloud.com/",
    sectors: ["Space", "Compute"],
    blurb: "Data centers in orbit, powered by the sun.",
    logo: "/logos/starcloud.png",
    image: "/work/starcloud.jpg",
    cardImage: "/work/cards/starcloud.jpg",
    video: "u9m6tCZa2-k", // Starcloud Constellation (Starcloud)
  },
  {
    name: "Exowatt",
    href: "https://www.exowatt.com/",
    sectors: ["Energy"],
    blurb: "Modular solar-thermal energy for the AI compute era.",
    logo: "/logos/exowatt.png",
    image: "/work/exowatt.jpg",
    cardImage: "/work/cards/exowatt.jpg",
    video: "kQgvCo5XG18", // Exowatt Power Summit 25 Sizzle Reel (Exowatt)
  },
  {
    name: "Aalo Atomics",
    href: "https://www.aalo.com/",
    sectors: ["Energy", "Nuclear"],
    blurb: "Factory-built modular nuclear reactors for clean power.",
    logo: "/logos/aalo.png",
    image: "/work/aalo.jpg",
    cardImage: "/work/cards/aalo.jpg",
    video: "LuhHQshC7Xk", // Unveiling the Aalo-1 Prototype and Aalo Pod (Aalo Atomics)
  },
  {
    name: "Quaise Energy",
    href: "https://quaise.energy/",
    sectors: ["Energy", "Geothermal"],
    blurb: "Ultra-deep geothermal to unlock clean baseload energy.",
    logo: "/logos/quaise.png",
    image: "/work/quaise.jpg",
    cardImage: "/work/cards/quaise.jpg",
    video: "5U8-KoKB6_8", // Lab to Field Testing of Millimeter Wave Drilling (Quaise Energy)
  },
  {
    name: "Unspun",
    href: "https://www.unspun.io/",
    sectors: ["Robotics", "Manufacturing"],
    blurb: "Robotic, on-demand apparel manufacturing.",
    logo: "/logos/unspun.png",
    image: "/work/unspun.jpg",
    cardImage: "/work/cards/unspun.jpg",
    video: "lLvn0o-jhuI", // 3D weaving | Vega by unspun (unspun)
  },
  {
    name: "Lance",
    href: "https://www.lance.live/",
    sectors: ["Software"],
    blurb: "Building the future of hospitality.",
    logo: "/logos/lance.png",
    image: "/work/lance.jpg",
    cardImage: "/work/cards/lance.jpg",
    video: "4lfd34piGiE", // guests got places to be (Lance)
  },
  {
    name: "Samply",
    href: "https://samply.app/",
    sectors: ["Software", "Audio"],
    blurb: "Sample management for modern music producers.",
    logo: "/logos/samply.png",
    image: "/work/samply.jpg",
    cardImage: "/work/cards/samply.jpg",
    video: "0MT2smBqloI", // Getting started with Samply (Samply)
  },
  {
    name: "Hark",
    href: "https://hark.com/",
    sectors: ["AI", "Consumer"],
    blurb: "AI-powered tools for the way people work.",
    logo: "/logos/hark.png",
    image: "/work/hark.jpg",
    cardImage: "/work/cards/hark.jpg",
    video: "0H1LSLipOVI", // Introducing Hark (Hark)
  },
  {
    name: "Bud Break Innovations",
    href: "https://www.budbreakinnovations.com/",
    sectors: ["Bio", "Agriculture"],
    blurb: "The robotics platform for agriculture.",
    logo: "/logos/budbreak.png",
    image: "/work/budbreak.jpg",
    cardImage: "/work/cards/budbreak.jpg",
    video: "8sLI-XocJFw", // I Built a Robot to Save the Wine Industry (Budbreak Innovations)
  },
  {
    name: "Maven Robotics",
    href: "https://www.mavenrobotics.ai/",
    sectors: ["AI", "Robotics"],
    blurb: "A new kind of working robot — general-purpose AI for industry.",
    logo: "/logos/maven.png",
    cardImage: "/work/cards/maven.jpg",
  },
  {
    name: "Eccentric Machines",
    href: "https://www.eccentricmachines.com/",
    sectors: ["Robotics", "AI"],
    blurb: "Unlocking intelligent robotic motion.",
    image: "/work/eccentric.jpg",
    cardImage: "/work/cards/eccentric.jpg",
  },
  {
    name: "Array Labs",
    href: "https://www.arraylabs.io/",
    sectors: ["Space", "Defense"],
    blurb: "Satellite swarms building a real-time 3D map of Earth.",
    cardImage: "/work/cards/array-labs.jpg",
    video: "SS0a_KjvDis", // Introducing Site3D, from Array Labs
  },
  {
    name: "Commons Clinic",
    href: "https://commonsclinic.com/",
    sectors: ["Healthcare"],
    blurb: "Value-based specialty care, from orthopedics to whole-body health.",
  },
  {
    name: "Corgi",
    href: "https://www.corgi.insure/",
    sectors: ["Insurance", "AI"],
    blurb: "AI-native, full-stack insurance built for startups.",
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
  Bio: "from-[#091505] via-[#10240b] to-[#1a3a14]",
  Compute: "from-[#0c0a1e] via-[#141233] to-[#241f4a]",
  Healthcare: "from-[#06241f] via-[#0a352f] to-[#114a40]",
  Insurance: "from-[#0a1b2b] via-[#0e2a3f] to-[#163c54]",
};

export function gradientFor(company: Company): string {
  for (const s of company.sectors) {
    if (SECTOR_GRADIENTS[s]) return SECTOR_GRADIENTS[s];
  }
  return "from-[#141414] via-[#1c1c1c] to-[#262626]";
}

// URL-safe slug from a name (e.g. "Shield AI" → "shield-ai").
// Used to anchor a founder's card on /founders and deep-link to it from a company card.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
