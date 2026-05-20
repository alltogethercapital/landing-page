export type Company = {
  name: string;
  href: string;
  sectors: string[];
  blurb?: string; // short one-liner (revealed on hover)
  logo?: string; // /public path to the company's logo mark
  image?: string; // /public product image — falls back to a sector gradient when absent
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
  },
  {
    name: "1X",
    href: "https://www.1x.tech/",
    sectors: ["AI", "Robotics"],
    blurb: "Humanoid robots engineered for the home.",
    logo: "/logos/1x.png",
    image: "/hero-robots.jpg",
  },
  {
    name: "OpenAI",
    href: "https://openai.com/",
    sectors: ["AI"],
    blurb: "Frontier AI research — creators of ChatGPT and the GPT models.",
    logo: "/logos/openai.png",
    image: "/work/openai.jpg",
  },
  {
    name: "Anthropic",
    href: "https://www.anthropic.com/",
    sectors: ["AI"],
    blurb: "AI safety research and Claude, a frontier AI assistant.",
    logo: "/logos/anthropic.png",
    image: "/work/anthropic.jpg",
  },
  {
    name: "Anduril",
    href: "https://www.anduril.com/",
    sectors: ["Defense", "AI"],
    blurb: "Autonomous defense systems built on the Lattice platform.",
    logo: "/logos/anduril.png",
    image: "/work/anduril.jpg",
  },
  {
    name: "Aurelius Systems",
    href: "https://www.aureliussystems.com/",
    sectors: ["Defense", "Directed Energy"],
    blurb: "Archimedes — an autonomous directed-energy counter-drone laser.",
    logo: "/logos/aurelius.png",
    image: "/work/aurelius.jpg",
  },
  {
    name: "Salient Motion",
    href: "https://salientmotion.com/",
    sectors: ["Defense", "Aerospace"],
    blurb: "Critical actuation systems for aviation and defense.",
    logo: "/logos/salient.png",
    image: "/work/salient-jet.jpg",
  },
  {
    name: "Replit",
    href: "https://replit.com/",
    sectors: ["Software", "AI"],
    blurb: "The AI-native platform for building and shipping software.",
    logo: "/logos/replit.png",
    image: "/work/replit.jpg",
  },
  {
    name: "Applied Intuition",
    href: "https://www.appliedintuition.com/",
    sectors: ["AI", "Robotics"],
    blurb: "Simulation and tooling for autonomous vehicles and machines.",
    logo: "/logos/applied.png",
    image: "/work/applied.jpg",
  },
  {
    name: "Figure AI",
    href: "https://www.figure.ai/",
    sectors: ["AI", "Robotics"],
    blurb: "General-purpose humanoid robots for the workforce.",
    logo: "/logos/figure.png",
    image: "/work/figure.jpg",
  },
  {
    name: "Apptronik",
    href: "https://apptronik.com/",
    sectors: ["AI", "Robotics"],
    blurb: "Apollo — a general-purpose humanoid robot for industry.",
    logo: "/logos/apptronik.png",
    image: "/work/apptronik.jpg",
  },
  {
    name: "Volantis",
    href: "https://www.volantissemi.ai/",
    sectors: ["AI", "Semiconductors"],
    blurb: "AI-driven semiconductor design.",
    logo: "/logos/volantis.png",
    image: "/work/volantis.jpg",
  },
  {
    name: "Starcloud",
    href: "https://www.starcloud.com/",
    sectors: ["Space", "Compute"],
    blurb: "Data centers in orbit, powered by the sun.",
    logo: "/logos/starcloud.png",
    image: "/work/starcloud.jpg",
  },
  {
    name: "Exowatt",
    href: "https://www.exowatt.com/",
    sectors: ["Energy"],
    blurb: "Modular solar-thermal energy for the AI compute era.",
    logo: "/logos/exowatt.png",
    image: "/work/exowatt.jpg",
  },
  {
    name: "Aalo Atomics",
    href: "https://www.aalo.com/",
    sectors: ["Energy", "Nuclear"],
    blurb: "Factory-built modular nuclear reactors for clean power.",
    logo: "/logos/aalo.png",
    image: "/work/aalo.jpg",
  },
  {
    name: "Quaise Energy",
    href: "https://quaise.energy/",
    sectors: ["Energy", "Geothermal"],
    blurb: "Ultra-deep geothermal to unlock clean baseload energy.",
    logo: "/logos/quaise.png",
    image: "/work/quaise.jpg",
  },
  {
    name: "Unspun",
    href: "https://www.unspun.io/",
    sectors: ["Robotics", "Manufacturing"],
    blurb: "Robotic, on-demand apparel manufacturing.",
    logo: "/logos/unspun.png",
    image: "/work/unspun.jpg",
  },
  {
    name: "Lance",
    href: "https://www.lance.live/",
    sectors: ["Software"],
    blurb: "Building the future of hospitality.",
    logo: "/logos/lance.png",
    image: "/work/lance.jpg",
  },
  {
    name: "Samply",
    href: "https://samply.app/",
    sectors: ["Software", "Audio"],
    blurb: "Sample management for modern music producers.",
    logo: "/logos/samply.png",
    image: "/work/samply.jpg",
  },
  {
    name: "Hark",
    href: "https://hark.com/",
    sectors: ["AI", "Consumer"],
    blurb: "AI-powered tools for the way people work.",
    logo: "/logos/hark.png",
    image: "/work/hark.jpg",
  },
  {
    name: "Bud Break Innovations",
    href: "https://www.budbreakinnovations.com/",
    sectors: ["Bio", "Agriculture"],
    blurb: "The robotics platform for agriculture.",
    logo: "/logos/budbreak.png",
    image: "/work/budbreak.jpg",
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
};

export function gradientFor(company: Company): string {
  for (const s of company.sectors) {
    if (SECTOR_GRADIENTS[s]) return SECTOR_GRADIENTS[s];
  }
  return "from-[#141414] via-[#1c1c1c] to-[#262626]";
}
