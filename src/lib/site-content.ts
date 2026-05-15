export const philosophyTenets = [
  {
    title: "Conviction over consensus",
    body: "The best companies look inevitable in hindsight and impossible up front. We back founders the room hasn't caught up to yet, and write the first check.",
  },
  {
    title: "The American rebuild",
    body: "AI is the biggest industrial shift in a century, and it's happening on American soil. We back the founders rewriting what gets made here: models, autonomy, robotics, energy, and the factories putting it all back together.",
  },
  {
    title: "Evaluate from the command line",
    body: "We read the code before the deck. We talk to customers before the cap table. Demos are signal. The product is the truth.",
  },
  {
    title: "Operators, not observers",
    body: "Capital is the easy part. We've shipped products, hired teams, and lived through the quiet years. We show up for the work that never makes the press release.",
  },
  {
    title: "Long arcs, patient capital",
    body: "The companies worth building don't fit a fund cycle. We hold for decades. Founders should optimize for the next fifteen years, not the next fifteen months.",
  },
];

export function logoSources(domain: string, simpleIcon?: string, localSrc?: string) {
  const sources: string[] = [];
  if (localSrc) sources.push(localSrc);
  if (simpleIcon) sources.push(`https://cdn.simpleicons.org/${simpleIcon}/F4F0E8`);
  sources.push(
    `https://icon.horse/icon/${domain}`,
    `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  );
  return sources;
}

export type Investment = {
  name: string;
  fallback: string;
  meta: string;
  href: string;
  logoSources: string[];
  linkedin?: string;
  youtube?: string;
};

export const investments: Investment[] = [
  {
    name: "OpenAI",
    fallback: "OpenAI",
    meta: "AI",
    href: "https://openai.com/",
    logoSources: logoSources("openai.com", "openai", "/design-assets/logos/openai.svg"),
    linkedin: "https://www.linkedin.com/company/openai",
  },
  {
    name: "Anthropic",
    fallback: "Anthropic",
    meta: "AI",
    href: "https://www.anthropic.com/",
    logoSources: logoSources("anthropic.com", "anthropic"),
    linkedin: "https://www.linkedin.com/company/anthropicresearch",
  },
  {
    name: "Anduril",
    fallback: "Anduril",
    meta: "Defense · AI",
    href: "https://www.anduril.com/",
    logoSources: logoSources("anduril.com"),
    linkedin: "https://www.linkedin.com/company/anduril",
  },
  {
    name: "Shield AI",
    fallback: "Shield AI",
    meta: "Defense · AI",
    href: "https://shield.ai/",
    logoSources: logoSources("shield.ai", undefined, "/design-assets/logos/shield-ai.svg"),
    linkedin: "https://www.linkedin.com/company/shield-ai",
  },
  {
    name: "Aurelius Systems",
    fallback: "Aurelius",
    meta: "Defense · Directed Energy",
    href: "https://www.aureliussystems.com/",
    logoSources: logoSources("aureliussystems.com", undefined, "/design-assets/logos/aurelius.webp"),
    linkedin: "https://www.linkedin.com/company/aurelius-systems",
  },
  {
    name: "Salient Motion",
    fallback: "Salient Motion",
    meta: "Defense · Aerospace",
    href: "https://salientmotion.com/",
    logoSources: logoSources("salientmotion.com", undefined, "/design-assets/logos/salient-motion.svg"),
    linkedin: "https://www.linkedin.com/company/salient-motion",
  },
  {
    name: "Replit",
    fallback: "Replit",
    meta: "Software · AI",
    href: "https://replit.com/",
    logoSources: logoSources("replit.com", "replit"),
    linkedin: "https://www.linkedin.com/company/repl-it",
  },
  {
    name: "Applied Intuition",
    fallback: "Applied Intuition",
    meta: "AI · Robotics",
    href: "https://www.appliedintuition.com/",
    logoSources: logoSources("appliedintuition.com"),
    linkedin: "https://www.linkedin.com/company/applied-intuition-inc",
  },
  {
    name: "Figure AI",
    fallback: "Figure",
    meta: "AI · Robotics",
    href: "https://www.figure.ai/",
    logoSources: [],
    linkedin: "https://www.linkedin.com/company/figure-ai",
  },
  {
    name: "1X",
    fallback: "1X",
    meta: "AI · Robotics",
    href: "https://www.1x.tech/",
    logoSources: [],
    linkedin: "https://www.linkedin.com/company/1x-technologies",
  },
  {
    name: "Apptronik",
    fallback: "Apptronik",
    meta: "AI · Robotics",
    href: "https://apptronik.com/",
    logoSources: logoSources("apptronik.com", undefined, "/design-assets/logos/apptronik.svg"),
    linkedin: "https://www.linkedin.com/company/apptronik-inc",
  },
  {
    name: "Volantis",
    fallback: "Volantis",
    meta: "AI · Semiconductors",
    href: "https://www.volantissemi.ai/",
    logoSources: logoSources("volantissemi.ai", undefined, "/design-assets/logos/volantis.webp"),
    linkedin: "https://www.linkedin.com/company/volantis-semiconductor",
  },
  {
    name: "Starcloud",
    fallback: "Starcloud",
    meta: "Space · Compute",
    href: "https://www.starcloud.com/",
    logoSources: logoSources("starcloud.com", undefined, "/design-assets/logos/starcloud.png"),
    linkedin: "https://www.linkedin.com/company/starcloudinc",
    youtube: "https://www.youtube.com/watch?v=FKHENV75b9Q",
  },
  {
    name: "Exowatt",
    fallback: "Exowatt",
    meta: "Energy",
    href: "https://www.exowatt.com/",
    logoSources: logoSources("exowatt.com", undefined, "/design-assets/logos/exowatt.png"),
    linkedin: "https://www.linkedin.com/company/exowatt",
  },
  {
    name: "Aalo Atomics",
    fallback: "Aalo",
    meta: "Energy · Nuclear",
    href: "https://www.aalo.com/",
    logoSources: logoSources("aalo.com", undefined, "/design-assets/logos/aalo.png"),
    linkedin: "https://www.linkedin.com/company/aalo-atomics",
  },
  {
    name: "Quaise Energy",
    fallback: "Quaise",
    meta: "Energy · Geothermal",
    href: "https://quaise.energy/",
    logoSources: logoSources("quaise.energy", undefined, "/design-assets/logos/quaise.svg"),
    linkedin: "https://www.linkedin.com/company/quaise-energy",
  },
  {
    name: "Unspun",
    fallback: "Unspun",
    meta: "Robotics · Manufacturing",
    href: "https://www.unspun.io/",
    logoSources: logoSources("unspun.io", undefined, "/design-assets/logos/unspun.png"),
    linkedin: "https://www.linkedin.com/company/unspun-",
    youtube: "https://www.youtube.com/watch?v=nc9TdnficlY",
  },
  {
    name: "Lance",
    fallback: "Lance",
    meta: "Software",
    href: "https://www.lance.live/",
    logoSources: logoSources("lance.live"),
    linkedin: "https://www.linkedin.com/company/trylance",
    youtube: "https://www.youtube.com/watch?v=b_EoZzE7KJ0",
  },
  {
    name: "Samply",
    fallback: "Samply",
    meta: "Software · Audio",
    href: "https://samply.app/",
    logoSources: logoSources("samply.app", undefined, "/design-assets/logos/samply.svg"),
    linkedin: "https://www.linkedin.com/company/samplyaudio",
  },
  {
    name: "Hark",
    fallback: "Hark",
    meta: "AI · Consumer",
    href: "https://hark.com/",
    logoSources: logoSources("hark.com", undefined, "/design-assets/logos/hark.svg"),
    linkedin: "https://www.linkedin.com/company/hark-ai",
  },
  {
    name: "Bud Break Innovations",
    fallback: "Bud Break",
    meta: "Bio · Agriculture",
    href: "https://www.budbreakinnovations.com/",
    logoSources: logoSources("budbreakinnovations.com"),
    linkedin: "https://www.linkedin.com/company/budbreak-innovations",
    youtube: "https://www.youtube.com/watch?v=ljWvvz_wFrc",
  },
];

export const founders = [
  {
    index: "01 / Founding Partner",
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    bioBefore: "Hisham builds at the intersection of software, AI, and capital.",
    emphasis: "University of Washington",
    bioAfter:
      "grad, previously shipping product at Layer3 and across the web3 and AI tooling stack. He partners earliest with technical founders, the kind who answer questions in code, not slideware.",
    image: "/design-assets/founder-hisham.png",
    linkedin: "https://www.linkedin.com/in/hisham-el-husseini/",
    email: "hisham@all2capital.com",
  },
  {
    index: "02 / Founding Partner",
    name: "Robert Neir",
    role: "Founding Partner",
    bioBefore: "Robert is a multi-time founder and former",
    emphasis: "Microsoft",
    bioAfter:
      "game developer. He's built across DeFi, decentralized identity, and consumer products, most recently at Riot IQ. He invests in founders who would build their company whether or not capital ever showed up.",
    image: "/design-assets/founder-robert.png",
    linkedin: "https://www.linkedin.com/in/robertmneir/",
    email: "robert@all2capital.com",
  },
];

export const warmupImageSources = [
  "/design-assets/philosophy.jpg",
  "/design-assets/bg-investments-underwater.png",
  "/design-assets/bg-team-desert.png",
  "/design-assets/founder-hisham.png",
  "/design-assets/founder-robert.png",
  "/design-assets/logos/openai.svg",
  "/design-assets/logos/exowatt.png",
  "/design-assets/logos/aalo.png",
  "/design-assets/logos/starcloud.png",
  "/design-assets/logos/quaise.svg",
  "/design-assets/logos/shield-ai.svg",
  "/design-assets/logos/aurelius.webp",
  "/design-assets/logos/salient-motion.svg",
  "/design-assets/logos/samply.svg",
  "/design-assets/logos/hark.svg",
  "/design-assets/logos/apptronik.svg",
  "/design-assets/logos/volantis.webp",
  "/design-assets/logos/unspun.png",
  ...investments.flatMap((company) => company.logoSources.slice(0, 1)),
];

export const driftUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay },
});
