import "server-only";

// Public funding and news history for each portfolio company, shown in the LP
// portal company detail view. Public sources only: never AngelList memo terms
// beyond the entry terms the portal already shows. Omit `raised` or
// `postMoney` when the company or a major outlet has not disclosed it; the UI
// shows "undisclosed" and the chart skips the point. Never estimate a value.
//
// Weekly refresh (Sunday routine): append new rounds and news, newest last for
// rounds and newest first for news, keep at most 5 news items, set
// `lastReviewed` on every company checked and bump LP_COMPANY_HISTORY_REVIEWED.

export type LpCompanyRound = {
  /** YYYY-MM-DD, or YYYY-MM when only the month is public. */
  date: string;
  round: string;
  /** USD raised in the round. Omit when undisclosed. */
  raised?: number;
  /** USD post-money valuation. Omit when undisclosed. */
  postMoney?: number;
  /** Short display override for an inexact figure, e.g. "$1B+". */
  postLabel?: string;
  /** Lead investor(s), short. */
  lead?: string;
  /** True when this is the round the fund entered (highlighted, no synthetic entry row). */
  ours?: true;
  sourceUrl: string;
};

export type LpCompanyNews = {
  /** YYYY-MM-DD, or YYYY-MM when only the month is public. */
  date: string;
  /** Short headline, one line (keep under ~44 characters). */
  title: string;
  source: string;
  url: string;
};

export type LpCompanyHistory = {
  /** One-line sector label. */
  sector: string;
  lastReviewed: string;
  rounds: LpCompanyRound[];
  news: LpCompanyNews[];
};

export const LP_COMPANY_HISTORY_REVIEWED = "2026-11-22";

const K = 1_000;
const M = 1_000_000;
const B = 1_000_000_000;
const R = LP_COMPANY_HISTORY_REVIEWED;

// Keyed by the company name used in LP_INVESTMENTS. H256 LLC Series 3 looks
// through to Anduril (its deployed allocation).
export const LP_COMPANY_HISTORY: Record<string, LpCompanyHistory> = {
  Anthropic: {
    sector: "AI",
    lastReviewed: R,
    rounds: [
      { date: "2021-05", round: "Series A", raised: 124 * M, lead: "Jaan Tallinn", sourceUrl: "https://www.useluminix.com/reports/company-overviews/anthropic-valuation-history" },
      { date: "2022-04", round: "Series B", raised: 580 * M, lead: "FTX", sourceUrl: "https://www.useluminix.com/reports/company-overviews/anthropic-valuation-history" },
      { date: "2023-05", round: "Series C", raised: 450 * M, lead: "Spark Capital", sourceUrl: "https://www.useluminix.com/reports/company-overviews/anthropic-valuation-history" },
      { date: "2025-03-03", round: "Series E", raised: 3.5 * B, postMoney: 61.5 * B, lead: "Lightspeed", sourceUrl: "https://www.anthropic.com/news/anthropic-raises-series-e-at-usd61-5b-post-money-valuation" },
      { date: "2025-09-02", round: "Series F", raised: 13 * B, postMoney: 183 * B, lead: "ICONIQ", sourceUrl: "https://www.anthropic.com/news/anthropic-raises-series-f-at-usd183b-post-money-valuation" },
      { date: "2026-02-12", round: "Series G", raised: 30 * B, postMoney: 380 * B, lead: "GIC, Coatue", sourceUrl: "https://www.reuters.com/technology/anthropics-path-ai-startup-industry-defining-ipo-2026-09-28/" },
      { date: "2026-05-28", round: "Series H", raised: 65 * B, postMoney: 965 * B, lead: "Altimeter", sourceUrl: "https://capital.com/en-gb/learn/ipo/anthropic-ipo" },
      { date: "2026-11-18", round: "IPO at $83/sh", lead: "Nasdaq: ANT", sourceUrl: "https://www.anthropic.com/news/anthropic-prices-initial-public-offering" },
    ],
    news: [
      { date: "2026-11-20", title: "ANT closes at $88.91 in AI sell-off", source: "CNBC", url: "https://www.cnbc.com/2026/11/20/anthropic-stock-ai-amd-nvidia.html" },
      { date: "2026-11-18", title: "IPO priced at $83; lists on Nasdaq as ANT", source: "Anthropic", url: "https://www.anthropic.com/news/anthropic-prices-initial-public-offering" },
      { date: "2026-09-28", title: "Path from startup to record IPO", source: "Reuters", url: "https://www.reuters.com/technology/anthropics-path-ai-startup-industry-defining-ipo-2026-09-28/" },
    ],
  },
  "Summer Engine": {
    sector: "AI · Gaming",
    lastReviewed: R,
    rounds: [
      { date: "2026-08-27", round: "Pre-seed", lead: "Undisclosed", sourceUrl: "https://recentfunding.com/companies/summer-engine/" },
    ],
    news: [
      { date: "2026-11-13", title: "Joins Y Combinator Fall 2026 batch", source: "Summer Engine", url: "https://www.summerengine.com/press" },
      { date: "2026-11", title: "Launch YC: make games by chatting", source: "Y Combinator", url: "https://www.ycombinator.com/launches/XJ4-summer-engine-make-and-play-games-together-by-chatting-with-ai" },
    ],
  },
  "Budbreak Innovations": {
    sector: "Robotics · Agriculture",
    lastReviewed: R,
    rounds: [],
    news: [
      { date: "2026", title: "Emma field deployments; 2026 closed beta", source: "Budbreak", url: "https://www.budbreakinnovations.com/" },
    ],
  },
  Exowatt: {
    sector: "Energy",
    lastReviewed: R,
    rounds: [
      { date: "2024-04", round: "Seed", raised: 20 * M, sourceUrl: "https://research.contrary.com/report/exowatt" },
      { date: "2025-04", round: "Series A", raised: 70 * M, sourceUrl: "https://www.exowatt.com/news/exowatt-closes-70-million-in-series-a-funding-to-deploy-and-scale-the-exowatt-p3" },
      { date: "2025-11", round: "Series A ext.", raised: 50 * M, sourceUrl: "https://research.contrary.com/report/exowatt" },
    ],
    news: [
      { date: "2026-11", title: "Unveils P3 Gen 2 and 1 MW Exobloc", source: "Unite.AI", url: "https://www.unite.ai/exowatt-redesigns-p3-solar-thermal-system-for-ai-data-centers/" },
      { date: "2026-10-15", title: "P3 named a TIME Best Invention 2026", source: "Exowatt", url: "https://www.exowatt.com/news/exowatt-p3-named-time-best-inventions-2026" },
      { date: "2026", title: "Launches ExoRise powered land for AI", source: "Exowatt", url: "https://www.exowatt.com/news/exowatt-launches-exorise-to-deliver-turnkey-powered-land-and-energy-for-the-ai-era" },
    ],
  },
  Unspun: {
    sector: "Robotics · Manufacturing",
    lastReviewed: R,
    rounds: [
      { date: "2023-03", round: "Series A", raised: 14 * M, lead: "Lowercarbon", sourceUrl: "https://sosv.us/unspun-vega-3d-weaving-machines-aim-to-fix-apparel-waste-and-huge-carbon-footprint/" },
      { date: "2024-07", round: "Series B", raised: 32 * M, lead: "DCVC", sourceUrl: "https://www.prnewswire.com/news-releases/unspun-raises-32m-in-oversubscribed-series-b-funding-to-transform-fashion-supply-chains-with-groundbreaking-3d-weaving-technology-302208798.html" },
      { date: "2026-07-20", round: "Series B (Form D)", raised: 14.4 * M, sourceUrl: "https://www.sec.gov/Archives/edgar/data/2033020/000203302026000003/0002033020-26-000003.txt" },
    ],
    news: [
      { date: "2026-07-30", title: "Walmart and REI back US hub plans", source: "unspun", url: "https://www.unspun.io/blog/post/leading-apparel-brands-back-unspuns-plans-to-build-domestic-manufacturing-hubs-in-the-u-s" },
    ],
  },
  Replit: {
    sector: "AI · Software",
    lastReviewed: R,
    rounds: [
      { date: "2023-04-25", round: "Series B ext.", raised: 97.4 * M, postMoney: 1.16 * B, lead: "a16z", sourceUrl: "https://replit.com/blog/b-extension" },
      { date: "2025-09-10", round: "Series C", raised: 250 * M, postMoney: 3 * B, lead: "Prysm Capital", sourceUrl: "https://replit.com/news/funding-announcement-series-c" },
      { date: "2026-03-11", round: "Series D", raised: 400 * M, postMoney: 9 * B, lead: "Georgian", ours: true, sourceUrl: "https://techcrunch.com/2026/03/11/replit-snags-9b-valuation-6-months-after-hitting-3b/" },
    ],
    news: [
      { date: "2026-11", title: "Introduces Missions for multi-agent work", source: "Replit", url: "https://replit.com/blog/introducing-replit-missions" },
      { date: "2026-10-30", title: "Cloud Agents open PRs for any teammate", source: "Replit", url: "https://replit.com/blog/anyone-can-bring-ideas-to-company-codebase" },
      { date: "2026-10-17", title: "Makes OpenAI its default model", source: "TechCrunch", url: "https://techcrunch.com/2026/10/17/replit-is-no-longer-working-with-anthropic-ceo-says/" },
      { date: "2026-03-11", title: "$400M Series D at $9B", source: "TechCrunch", url: "https://techcrunch.com/2026/03/11/replit-snags-9b-valuation-6-months-after-hitting-3b/" },
    ],
  },
  "Lance AI": {
    sector: "AI · Hospitality",
    lastReviewed: R,
    rounds: [
      { date: "2026-04-28", round: "Seed", raised: 5 * M, lead: "YC, SV Angel", ours: true, sourceUrl: "https://www.lance.live/news/announcing-our-seed-round" },
    ],
    news: [
      { date: "2026-04-28", title: "$5M seed for hotel operations agents", source: "Lance", url: "https://www.lance.live/news/announcing-our-seed-round" },
    ],
  },
  "Quaise Energy": {
    sector: "Energy · Geothermal",
    lastReviewed: R,
    rounds: [
      { date: "2022-02-08", round: "Series A", raised: 52 * M, sourceUrl: "https://www.businesswire.com/news/home/20220208005403/en/Quaise-Energy-Secures-%2440M-Series-A-to-Unlock-Terawatt-Scale-Geothermal-Energy" },
      { date: "2024-03", round: "Series A1", raised: 21 * M, sourceUrl: "https://www.quaise.com/news/quaise-energy-raises-21-million-to-accelerate-terawatt-scale-deep-geothermal-energy" },
      { date: "2026-08-27", round: "Series B", raised: 180 * M, ours: true, sourceUrl: "https://www.quaise.com/news/quaise-energy-closes-180-million-series-b-with-35-million-investment-by-nabors-industries" },
    ],
    news: [
      { date: "2026-09-22", title: "Selected for up to $25M DOE support", source: "Quaise", url: "https://www.quaise.com/news/quaise-energy-selected-for-up-to-25-million-in-u-s-department-of-energy-support-to-advance-worlds-first-commercial-superhot-geothermal-power-plant" },
      { date: "2026-08-27", title: "Closes $180M Series B; Nabors in", source: "Business Wire", url: "https://www.businesswire.com/news/home/20260827266829/en/Quaise-Energy-Closes-%24180-Million-Series-B-with-%2435-Million-Investment-from-Nabors-Industries-and-Strategic-Framework-to-Build-Worlds-First-Superhot-Geothermal-Power-Plant" },
    ],
  },
  "Shield AI": {
    sector: "Defense · Autonomy",
    lastReviewed: R,
    rounds: [
      { date: "2021-08-24", round: "Series D", raised: 210 * M, postMoney: 1.25 * B, sourceUrl: "https://stockanalysis.com/private/shield-ai/valuation/" },
      { date: "2022-06-09", round: "Series E", raised: 90 * M, postMoney: 2.3 * B, sourceUrl: "https://stockanalysis.com/private/shield-ai/valuation/" },
      { date: "2023-10-31", round: "Series F", raised: 200 * M, postMoney: 2.7 * B, lead: "Riot Ventures", sourceUrl: "https://stockanalysis.com/private/shield-ai/valuation/" },
      { date: "2025-03-06", round: "Series F-1", raised: 240 * M, postMoney: 5.3 * B, lead: "L3Harris", sourceUrl: "https://shield.ai/shield-ai-raises-240m-at-5-3b-valuation-to-scale-hivemind-enterprise-an-ai-powered-autonomy-developer-platform/" },
      { date: "2026-03-26", round: "Series G", raised: 1.5 * B, postMoney: 12.7 * B, lead: "Advent", ours: true, sourceUrl: "https://shield.ai/shield-ai-to-acquire-software-simulation-company-aechelon-and-raise-2b-at-12-7b-valuation/" },
      { date: "2026-11-05", round: "Series H", raised: 1 * B, postMoney: 28.8 * B, lead: "Innovation X", sourceUrl: "https://shield.ai/shield-to-acquire-echodyne-in-a-transaction-valued-at-5-3-billion-and-raise-2-5-billion-at-a-28-8-billion-valuation/" },
    ],
    news: [
      { date: "2026-11-17", title: "Innovation X co-leads $1B Series H", source: "Business Wire", url: "https://www.businesswire.com/news/home/20261117448003/en/Innovation-X-Co-Leads-Shield-Series-H-to-Fund-Echodyne-Acquisition" },
      { date: "2026-11-05", title: "Buys Echodyne; raises at $28.8B", source: "Shield AI", url: "https://shield.ai/shield-to-acquire-echodyne-in-a-transaction-valued-at-5-3-billion-and-raise-2-5-billion-at-a-28-8-billion-valuation/" },
      { date: "2026-03-26", title: "Series G at $12.7B; buys Aechelon", source: "Shield AI", url: "https://shield.ai/shield-ai-to-acquire-software-simulation-company-aechelon-and-raise-2b-at-12-7b-valuation/" },
    ],
  },
  Samply: {
    sector: "Software · Audio",
    lastReviewed: R,
    rounds: [
      { date: "2026-07-20", round: "Seed (Form D)", raised: 3.33 * M, ours: true, sourceUrl: "https://www.takeoffradar.com/f/0002148970-26-000001/" },
    ],
    news: [
      { date: "2026-08-06", title: "Files Form D for $3.3M seed", source: "SEC", url: "https://www.sec.gov/Archives/edgar/data/2148970/0002148970-26-000001.txt" },
    ],
  },
  Anduril: {
    sector: "Defense",
    lastReviewed: R,
    rounds: [
      { date: "2024-08", round: "Series F", raised: 1.5 * B, postMoney: 14 * B, sourceUrl: "https://www.anduril.com/news/anduril-raises-usd1-5-billion-to-rebuild-the-arsenal-of-democracy" },
      { date: "2025-06-05", round: "Series G", raised: 2.5 * B, postMoney: 30.5 * B, lead: "Founders Fund", sourceUrl: "https://techcrunch.com/2025/06/05/anduril-raises-2-5b-at-30-5b-valuation-led-by-founders-fund/" },
      { date: "2026-05-13", round: "Series H", raised: 5 * B, postMoney: 61 * B, lead: "Thrive, a16z", ours: true, sourceUrl: "https://www.anduril.com/news/anduril-announces-usd5b-series-h-raise" },
    ],
    news: [
      { date: "2026-11", title: "Says IPO possible in next few years", source: "Benzinga", url: "https://www.benzinga.com/markets/private-markets/26/11/63369119/anduril-says-it-could-hit-public-markets-in-next-few-years" },
      { date: "2026-11", title: "Air Force picks Anduril missile launcher", source: "Anduril", url: "https://www.anduril.com/news/u-s-air-force-selects-anduril-to-develop-launcher-for-counter-air-missile-program" },
      { date: "2026-10-06", title: "$6.6B Navy submarine base investment", source: "Anduril", url: "https://www.anduril.com/news/anduril-u-s-navy-invest-usd6-6-billion-to-expand-america-s-submarine-industrial-base" },
      { date: "2026-05-13", title: "$5B Series H doubles value to $61B", source: "TechCrunch", url: "https://techcrunch.com/2026/05/13/anduril-raises-5b-doubles-valuation-to-61b/" },
    ],
  },
  Starcloud: {
    sector: "Space · Compute",
    lastReviewed: R,
    rounds: [
      { date: "2024-12-11", round: "Seed", raised: 11 * M, sourceUrl: "https://techcrunch.com/2024/12/11/200-vcs-wanted-to-get-into-lumen-orbits-11m-seed-round/" },
      { date: "2026-03-30", round: "Series A", raised: 170 * M, postMoney: 1.1 * B, lead: "Benchmark, EQT", sourceUrl: "https://techcrunch.com/2026/03/30/starcloud-raises-170-million-series-ato-build-data-centers-in-space/" },
      { date: "2026-08-21", round: "Series A ext.", postMoney: 2.3 * B, lead: "Benchmark, EQT", sourceUrl: "https://www.reuters.com/business/media-telecom/orbital-data-center-startup-starcloud-valued-23-billion-latest-funding-2026-08-21/" },
    ],
    news: [
      { date: "2026-11", title: "Joins Space Commerce certification pilot", source: "Office of Space Commerce", url: "https://space.commerce.gov/osc-announces-the-space-commerce-certification-pilot-phase-cohort/" },
      { date: "2026-08-21", title: "Valued at $2.3B in Series A extension", source: "Reuters", url: "https://www.reuters.com/business/media-telecom/orbital-data-center-startup-starcloud-valued-23-billion-latest-funding-2026-08-21/" },
      { date: "2026-03-30", title: "$170M Series A at $1.1B", source: "TechCrunch", url: "https://techcrunch.com/2026/03/30/starcloud-raises-170-million-series-ato-build-data-centers-in-space/" },
    ],
  },
  OpenAI: {
    sector: "AI",
    lastReviewed: R,
    rounds: [
      { date: "2024-10-02", round: "Primary", raised: 6.6 * B, postMoney: 157 * B, lead: "Thrive", sourceUrl: "https://openai.com/index/scale-the-benefits-of-ai/" },
      { date: "2025-03-31", round: "Primary", raised: 40 * B, postMoney: 300 * B, lead: "SoftBank", sourceUrl: "https://openai.com/index/march-funding-updates/" },
      { date: "2025-10-02", round: "Secondary", raised: 6.6 * B, postMoney: 500 * B, lead: "Thrive, SoftBank", sourceUrl: "https://www.reuters.com/technology/openai-hits-500-billion-valuation-after-share-sale-source-says-2025-10-02/" },
      { date: "2026-03-31", round: "Primary", raised: 122 * B, postMoney: 852 * B, lead: "Amazon", ours: true, sourceUrl: "https://openai.com/index/accelerating-the-next-phase-ai/" },
      { date: "2026-11-06", round: "Primary (1st close)", raised: 11 * B, postMoney: 1.25e12, sourceUrl: "https://www.bloomberg.com/news/articles/2026-11-06/openai-completes-11-billion-portion-of-funding-at-1-25-trillion-value" },
    ],
    news: [
      { date: "2026-11", title: "Launches GPT-6.2 Astra and Sol", source: "OpenAI", url: "https://openai.com/index/introducing-gpt-6-2-astra-sol/" },
      { date: "2026-11", title: "Introduces ChatGPT Wallet", source: "OpenAI", url: "https://openai.com/index/introducing-chatgpt-wallet/" },
      { date: "2026-11", title: "To acquire Pierre Computer Company", source: "OpenAI", url: "https://openai.com/index/openai-to-acquire-pierre/" },
      { date: "2026-11-06", title: "$11B first close at $1.25T", source: "Bloomberg", url: "https://www.bloomberg.com/news/articles/2026-11-06/openai-completes-11-billion-portion-of-funding-at-1-25-trillion-value" },
    ],
  },
  Apptronik: {
    sector: "Robotics · Humanoids",
    lastReviewed: R,
    rounds: [
      { date: "2025-02", round: "Series A", raised: 403 * M, sourceUrl: "https://apptronik.com/news-collection/apptronik-closes-additional-series-a-funding" },
      { date: "2026-02-11", round: "Series A-X", raised: 520 * M, postMoney: 5.3 * B, postLabel: "~$5.3B", sourceUrl: "https://apptronik.com/news-collection/apptronik-closes-over-935-million-series-a" },
    ],
    news: [
      { date: "2026-11", title: "GXO expands humanoid partnership", source: "GXO", url: "https://investors.gxo.com/news-releases/news-release-details/gxo-and-apptronik-expand-partnership-scale-humanoid-deployment/" },
      { date: "2026-10-22", title: "DeepMind teaches Apollo skills from video", source: "Robotics & Automation News", url: "https://roboticsandautomationnews.com/2026/10/22/google-deepmind-uses-gemini-4-argon-to-teach-apptroniks-apollo-humanoid-new-skills-from-video/106227/" },
      { date: "2026-02-11", title: "$520M A-X; Series A tops $935M", source: "TechCrunch", url: "https://techcrunch.com/2026/02/11/humanoid-robot-startup-apptronik-has-now-raised-935m-at-a-5b-valuation/" },
    ],
  },
  Volantis: {
    sector: "Semiconductors · Photonics",
    lastReviewed: R,
    rounds: [
      { date: "2025-06-11", round: "Seed", raised: 9 * M, sourceUrl: "https://www.businesswire.com/news/home/20250611870483/en/Volantis-Unveils-Photonic-Compute-Platform-for-the-AI-Era-Raises-%249M-in-Seed-Round-With-Alex-Wang-Trevor-Blackwell-and-Others" },
      { date: "2026-09-29", round: "Series A", raised: 88 * M, lead: "Lachy Groom", ours: true, sourceUrl: "https://volantissemi.ai/news-insights/our-88m-series-a-demolishing-the-memory-wall-with-photonics-post" },
    ],
    news: [
      { date: "2026-09-29", title: "$88M Series A for photonic inference", source: "Volantis", url: "https://volantissemi.ai/news-insights/our-88m-series-a-demolishing-the-memory-wall-with-photonics-post" },
    ],
  },
  "Aurelius Systems": {
    sector: "Defense · Counter-drone",
    lastReviewed: R,
    rounds: [
      { date: "2025-09-03", round: "Seed", raised: 10 * M, lead: "General Catalyst", sourceUrl: "https://www.axios.com/2025/09/03/aurelius-lasers-cuas-seed-money" },
      { date: "2026-08-05", round: "Series A", raised: 40 * M, lead: "Draper, KAS", ours: true, sourceUrl: "https://www.aureliussystems.com/newsroom/seriesaraise" },
    ],
    news: [
      { date: "2026-08-05", title: "$40M Series A for counter-drone lasers", source: "Aurelius", url: "https://www.aureliussystems.com/newsroom/seriesaraise" },
      { date: "2026-08", title: "Raises $40M Series A for laser weapons", source: "Tectonic", url: "https://www.tectonicdefense.com/aurelius-raises-40m-series-a-for-laser-weapons/" },
    ],
  },
  "Aalo Atomics": {
    sector: "Energy · Nuclear",
    lastReviewed: R,
    rounds: [
      { date: "2024-07", round: "Series A", raised: 27 * M, sourceUrl: "https://www.aalo.com/post/aalo-atomics-raises-27m-series-a" },
      { date: "2025-08", round: "Series B", raised: 100 * M, sourceUrl: "https://www.aalo.com/post/aalo-closes-100m-series-b" },
    ],
    news: [
      { date: "2026-07-30", title: "Crusoe partnership for 2027 INL demo", source: "Aalo", url: "https://www.aalo.com/post/crusoe-and-aalo-atomics-form-strategic-partnership" },
      { date: "2026-07-04", title: "Test reactor reaches criticality at INL", source: "Aalo", url: "https://www.aalo.com/post/aalo-achieves-first-criticality" },
    ],
  },
  "Salient Motion": {
    sector: "Aerospace · Actuators",
    lastReviewed: R,
    rounds: [
      { date: "2024-10-01", round: "Seed", raised: 12 * M, lead: "Cantos", sourceUrl: "https://www.businesswire.com/news/home/20241001351008/en/Salient-Motion-Raises-%2412-Million-to-Scale-Motion-Control-Business" },
    ],
    news: [
      { date: "2026-09-28", title: "Launches Saginaw Precision ball screws", source: "Salient Motion", url: "https://salientmotion.com/blog/salient-motion-launches-saginaw-precision" },
      { date: "2026", title: "Lands first production contract", source: "MarketScreener", url: "https://www.marketscreener.com/news/aerospace-supplier-startup-lands-first-production-contract-ce7e5cdbdf8bff25" },
    ],
  },
  Hark: {
    sector: "AI · Devices",
    lastReviewed: R,
    rounds: [
      { date: "2026-05-21", round: "Series A", raised: 700 * M, postMoney: 6 * B, lead: "Parkway", ours: true, sourceUrl: "https://hark.com/articles/hark-announces-usd700-million-fundraising-round" },
    ],
    news: [
      { date: "2026-10-06", title: "Launches Hark Pro assistant", source: "TechCrunch", url: "https://techcrunch.com/2026/10/06/hark-releases-an-ai-personal-assistant-with-a-focus-on-privacy/" },
      { date: "2026-05-21", title: "$700M Series A at $6B", source: "TechCrunch", url: "https://techcrunch.com/2026/05/21/hark-raises-700m-series-a-for-its-secretive-universal-ai-interface/" },
    ],
  },
  "Eccentric Machines": {
    sector: "Robotics · Actuators",
    lastReviewed: R,
    rounds: [
      { date: "2026-06", round: "Seed", raised: 5 * M, lead: "RoboStrategy", ours: true, sourceUrl: "https://specstream.ai/data/form-d/company/eccentric-machines-inc-2141182" },
    ],
    news: [
      { date: "2026", title: "Sentor actuator development continues", source: "Eccentric Machines", url: "https://www.eccentricmachines.com/" },
    ],
  },
  "Maven Robotics": {
    sector: "Robotics · Industrial",
    lastReviewed: R,
    rounds: [
      { date: "2026-09-10", round: "Series A", raised: 100 * M, lead: "RoboStrategy", ours: true, sourceUrl: "https://www.globenewswire.com/news-release/2026/09/10/3359782/0/en/maven-robotics-raises-100m-series-a-for-the-world-s-first-general-purpose-robotics-system-for-industrial-work.html" },
    ],
    news: [
      { date: "2026-09-10", title: "$100M Series A for industrial robots", source: "GlobeNewswire", url: "https://www.globenewswire.com/news-release/2026/09/10/3359782/0/en/maven-robotics-raises-100m-series-a-for-the-world-s-first-general-purpose-robotics-system-for-industrial-work.html" },
      { date: "2026-09-10", title: "Wants to own robot deployment", source: "TechCrunch", url: "https://techcrunch.com/2026/09/10/maven-robotics-wants-to-steal-your-robot-deployment-deal/" },
    ],
  },
  "Array Labs": {
    sector: "Space · Radar",
    lastReviewed: R,
    rounds: [
      { date: "2026-01", round: "Series A", raised: 20 * M, sourceUrl: "https://www.arraylabs.io/updates/array-labs-raises-20m-to-scale-radar-manufacturing-prepare-for-launch" },
      { date: "2026-07-27", round: "Series A+", raised: 21 * M, lead: "Mitsubishi Electric", ours: true, sourceUrl: "https://www.arraylabs.io/updates/1" },
    ],
    news: [
      { date: "2026-07-28", title: "Mitsubishi Electric invests", source: "Mitsubishi Electric", url: "https://www.mitsubishielectric.com/en/pr/2026/0728_ds/" },
      { date: "2026-07-27", title: "$21M strategic round", source: "Array Labs", url: "https://www.arraylabs.io/updates/1" },
    ],
  },
  Aformic: {
    sector: "Robotics · Logistics",
    lastReviewed: R,
    rounds: [
      { date: "2026-11", round: "Seed", raised: 6.95 * M, lead: "Veteran Ventures", sourceUrl: "https://aformic.com/aformic-raises-6-95-million-seed-round-to-automate-the-industries-that-matter/" },
    ],
    news: [
      { date: "2026-11", title: "$6.95M seed to move into data centers", source: "TNW", url: "https://thenextweb.com/news/aformic-6-95m-seed-industrial-robots-veteran-ventures" },
      { date: "2026-05-04", title: "Automotive intralogistics and Qursor", source: "Aformic", url: "https://aformic.com/blog/" },
    ],
  },
  "1X": {
    sector: "Robotics · Humanoids",
    lastReviewed: R,
    rounds: [
      { date: "2024-01", round: "Series B", raised: 100 * M, lead: "EQT Ventures", sourceUrl: "https://www.1x.tech/discover/1x-secures-100m-in-series-b-funding" },
    ],
    news: [
      { date: "2026-11-21", title: "What NEO does before deliveries", source: "Technology.org", url: "https://www.technology.org/2026/11/21/1x-neo-home-robot-what-it-can-do-2026/" },
      { date: "2026-11", title: "NEO to ship to developers in December", source: "Humanoids Daily", url: "https://www.humanoidsdaily.com/news/1x-neo-developers-december-runtime-2026-bornich" },
      { date: "2026", title: "NEO factory update", source: "1X", url: "https://www.1x.tech/discover/neo-factory" },
    ],
  },
  "Figure AI": {
    sector: "Robotics · Humanoids",
    lastReviewed: R,
    rounds: [
      { date: "2023-05-24", round: "Series A", raised: 70 * M, lead: "Parkway", sourceUrl: "https://www.prnewswire.com/news-releases/figure-announces-70m-series-a-to-support-commercialization-of-figure-01-humanoid-robot-301832819.html" },
      { date: "2024-02-29", round: "Series B", raised: 675 * M, postMoney: 2.6 * B, sourceUrl: "https://techcrunch.com/2024/02/29/figure-rides-the-humanoid-robot-hype-wave-to-2-6b-valuation-and-openai-collab/" },
      { date: "2025-09-16", round: "Series C", raised: 1 * B, postMoney: 39 * B, lead: "Parkway", sourceUrl: "https://www.figure.ai/news/series-c" },
    ],
    news: [
      { date: "2026-11", title: "Targets any-home tasks within 6 months", source: "Humanoids Daily", url: "https://www.humanoidsdaily.com/news/brett-adcock-moonshots-helix-3-homes-six-months" },
      { date: "2026-11", title: "Figure 03 robots at F1 Las Vegas", source: "HumanoidMegaHub", url: "https://www.humanoidmegahub.com/news/figure-humanoid-robots-formula-1" },
      { date: "2026-09-03", title: "Nscale compute partnership", source: "Figure", url: "https://www.figure.ai/news/figure-and-nscale-sign-strategic-partnership" },
    ],
  },
  Campus: {
    sector: "Education",
    lastReviewed: R,
    rounds: [
      { date: "2025-03", round: "Series B", raised: 46 * M, lead: "General Catalyst", sourceUrl: "https://campus.edu/blog/press-release/general-catalyst-leads-46-million-investment-in-2-year-college-built-for-gen-z" },
    ],
    news: [
      { date: "2026-07-16", title: "Applied AI in every associate degree", source: "Campus", url: "https://campus.edu/blog/press-release/campus-the-two-year-online-college-makes-applied-ai-part-of-every-associate-degree" },
    ],
  },
  Compresr: {
    sector: "AI · Infrastructure",
    lastReviewed: R,
    rounds: [
      { date: "2026", round: "YC W26", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.ycombinator.com/companies/compresr" },
    ],
    news: [
      { date: "2026", title: "Context compression via SDK and on-prem", source: "Compresr", url: "https://www.compresr.com/" },
    ],
  },
  "Rendezvous Robotics": {
    sector: "Space · Robotics",
    lastReviewed: R,
    rounds: [
      { date: "2026-10-28", round: "Seed", raised: 20 * M, lead: "MaC VC, Toyota", ours: true, sourceUrl: "https://www.rdvrobotics.com/news/rendezvous-robotics-seed-round-announcement/" },
    ],
    news: [
      { date: "2026-10-28", title: "$20M seed for self-assembling craft", source: "Rendezvous", url: "https://www.rdvrobotics.com/news/rendezvous-robotics-seed-round-announcement/" },
      { date: "2026-10-28", title: "Shifts to self-building spacecraft", source: "Via Satellite", url: "https://www.satellitetoday.com/finance/2026/10/28/rendezvous-robotics-shifts-focus-to-spacecraft-that-autonomously-build-themselves-in-orbit/" },
    ],
  },
  Raspire: {
    sector: "Software · Security",
    lastReviewed: R,
    rounds: [
      { date: "2026-04", round: "YC", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.ycombinator.com/companies/raspire" },
    ],
    news: [
      { date: "2026-06-01", title: "SHIELD 2.0 mobile runtime protection", source: "Raspire", url: "https://raspire.com/blog/introducing-shield-2.0" },
    ],
  },
  Matforge: {
    sector: "Materials · Semiconductors",
    lastReviewed: R,
    rounds: [
      { date: "2026-08-10", round: "Seed", raised: 9 * M, lead: "Lightspeed India", ours: true, sourceUrl: "https://www.businesswire.com/news/home/20260810167426/en/Discovered-Materials-Closes-%249M-Seed-Round-to-Accelerate-the-Adoption-of-New-Materials-for-Semiconductor-Chips" },
    ],
    news: [
      { date: "2026-08-10", title: "Renamed Discovered Materials; $9M seed", source: "Business Wire", url: "https://www.businesswire.com/news/home/20260810167426/en/Discovered-Materials-Closes-%249M-Seed-Round-to-Accelerate-the-Adoption-of-New-Materials-for-Semiconductor-Chips" },
    ],
  },
  "Plena Health": {
    sector: "AI · Healthcare",
    lastReviewed: R,
    rounds: [
      { date: "2026", round: "YC S26", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.ycombinator.com/companies/plena-health" },
    ],
    news: [],
  },
  "Core Automation": {
    sector: "AI · Research",
    lastReviewed: R,
    rounds: [
      { date: "2026-07", round: "Series A (Form D)", raised: 432.1 * M, ours: true, sourceUrl: "https://www.sec.gov/Archives/edgar/data/2148145/000214814526000001/0002148145-26-000001.txt" },
    ],
    news: [
      { date: "2026-09-09", title: "One Layer Deeper competition results", source: "Core Automation", url: "https://www.coreauto.com/blog" },
    ],
  },
  "Reflect Orbital": {
    sector: "Space · Energy",
    lastReviewed: R,
    rounds: [
      { date: "2024-09", round: "Seed", raised: 6.5 * M, lead: "Sequoia", sourceUrl: "https://www.reflectorbital.com/press/announcing-our-6-5-million-seed-round" },
      { date: "2025-05", round: "Series A", raised: 20 * M, lead: "Lux", sourceUrl: "https://www.reflectorbital.com/press/reflect-orbital-secures-20-million-in-series-a-funding-led-by-lux-capital" },
      { date: "2026-11", round: "Series A+", raised: 73.5 * M, lead: "Sequoia, Lux", sourceUrl: "https://www.reflectorbital.com/blog-posts/reflect-orbital-announces-73-5-million-in-new-funding" },
    ],
    news: [
      { date: "2026-11-18", title: "$73.5M ahead of first mirror test", source: "VC Post", url: "https://www.vcpost.com/articles/130992/20261118/reflect-orbital-raises-735-million-sequoia-lux-salesforce-ventures-ahead-its-first-space.htm" },
      { date: "2026-07-17", title: "FCC license for demo satellite", source: "Reflect Orbital", url: "https://www.reflectorbital.com/blog-posts/humanity-has-an-energy-problem" },
    ],
  },
  "Apollo Atomics": {
    sector: "Energy · Nuclear",
    lastReviewed: R,
    rounds: [
      { date: "2026-08", round: "Seed", raised: 31 * M, lead: "FCVC", ours: true, sourceUrl: "https://www.prnewswire.com/news-releases/apollo-atomics-secures-31-million-to-turn-proven-reactor-technology-into-a-factory-built-product-302856089.html" },
    ],
    news: [
      { date: "2026-08-20", title: "Shrinking nuclear's overlooked part", source: "TechCrunch", url: "https://techcrunch.com/2026/08/20/apollo-atomics-wants-to-make-nuclear-power-cheaper-by-shrinking-an-overlooked-part/" },
      { date: "2026-08", title: "$31M seed for factory-built reactors", source: "PR Newswire", url: "https://www.prnewswire.com/news-releases/apollo-atomics-secures-31-million-to-turn-proven-reactor-technology-into-a-factory-built-product-302856089.html" },
    ],
  },
  "Decart.ai": {
    sector: "AI · World models",
    lastReviewed: R,
    rounds: [
      { date: "2024-10", round: "Seed", raised: 21 * M, lead: "Sequoia", sourceUrl: "https://decart.ai/about" },
      { date: "2024-12-19", round: "Series A", raised: 32 * M, postMoney: 500 * M, postLabel: "$500M+", lead: "Benchmark", sourceUrl: "https://techcrunch.com/2024/12/19/decart-adds-another-32m-at-a-500m-valuation/" },
      { date: "2025-08-07", round: "Series A+", raised: 100 * M, postMoney: 3.1 * B, sourceUrl: "https://fortune.com/2025/08/07/exclusive-decart-raises-100-million-at-a-3-1-billion-valuation-chasing-the-future-of-real-time-creative-ai/" },
      { date: "2026-05-18", round: "Series B", raised: 300 * M, postMoney: 3.8 * B, ours: true, sourceUrl: "https://decart.ai/publications/decart-raises-300m-tech-leaders-back-the-company-as-both-customers-and-investors" },
    ],
    news: [
      { date: "2026-10-22", title: "Live AI demo at NVIDIA GTC", source: "Decart", url: "https://decart.ai/events/nvidia-gtc-emea-2026" },
      { date: "2026-05-18", title: "$300M Series B; customers invest", source: "Decart", url: "https://decart.ai/publications/decart-raises-300m-tech-leaders-back-the-company-as-both-customers-and-investors" },
    ],
  },
  "MAV Unlimited": {
    sector: "Defense · Drones",
    lastReviewed: R,
    rounds: [
      { date: "2026-01", round: "Pre-seed notes", raised: 426 * K, lead: "Intrepid Oregon", ours: true, sourceUrl: "https://www.formds.com/issuers/mav-unlimited-inc" },
    ],
    news: [
      { date: "2026", title: "Selected for MassChallenge Security", source: "MAV Unlimited", url: "https://mav-unlimited.com/updates" },
    ],
  },
  Supabase: {
    sector: "Software · Databases",
    lastReviewed: R,
    rounds: [
      { date: "2024-09-25", round: "Series C", raised: 80 * M, sourceUrl: "https://techcrunch.com/2024/09/25/supabase-a-postgres-centric-developer-platform-raises-80m-series-c/" },
      { date: "2025-04", round: "Series D", raised: 200 * M, postMoney: 2 * B, sourceUrl: "https://techcrunch.com/2025/10/03/supabase-nabs-5b-valuation-four-months-after-hitting-2b/" },
      { date: "2025-10-03", round: "Series E", raised: 100 * M, postMoney: 5 * B, sourceUrl: "https://techcrunch.com/2025/10/03/supabase-nabs-5b-valuation-four-months-after-hitting-2b/" },
      { date: "2026-06-05", round: "Series F", raised: 500 * M, postMoney: 10.5 * B, ours: true, sourceUrl: "https://supabase.com/blog/series-f" },
      { date: "2026-10-02", round: "Series F ext.", raised: 150 * M, postMoney: 10.65 * B, lead: "GIC", sourceUrl: "https://www.nbr.co.nz/tech/supabase-raises-another-us150m/" },
    ],
    news: [
      { date: "2026-10-02", title: "Acquiring Turso; $150M new funding", source: "Supabase", url: "https://supabase.com/blog/supabase-is-acquiring-turso" },
      { date: "2026-06-05", title: "Doubles valuation to $10B", source: "TechCrunch", url: "https://techcrunch.com/2026/06/05/supabase-doubles-valuation-to-10b-in-8-months/" },
    ],
  },
  Valstad: {
    sector: "Maritime · Manufacturing",
    lastReviewed: R,
    rounds: [
      { date: "2026-08-03", round: "Seed (Form D)", raised: 8.62 * M, ours: true, sourceUrl: "https://filingflow.app/filings/0002149540-26-000001" },
    ],
    news: [
      { date: "2026", title: "Distributed robotic shipbuilding", source: "Valstad", url: "https://valstad.com/" },
    ],
  },
  "Sunflower Labs": {
    sector: "Drones · Security",
    lastReviewed: R,
    rounds: [
      { date: "2025-11-04", round: "Series B", raised: 16 * M, lead: "Sequoia", sourceUrl: "https://sunflower-labs.com/post/press-release-2025-11-04" },
      { date: "2026-09", round: "Form D", raised: 14.9 * M, sourceUrl: "https://www.sec.gov/Archives/edgar/data/1876339/000187633926000003/0001876339-26-000003.txt" },
    ],
    news: [
      { date: "2026-10-05", title: "API controls and camera-triggered missions", source: "Sunflower Labs", url: "https://sunflower-labs.com/release-notes" },
      { date: "2025-11-04", title: "FAA nationwide waiver; Sequoia invests", source: "Sunflower Labs", url: "https://sunflower-labs.com/post/press-release-2025-11-04" },
    ],
  },
  Atoms: {
    sector: "Robotics",
    lastReviewed: R,
    rounds: [
      { date: "2026-07-22", round: "Growth", raised: 1.7 * B, lead: "a16z", ours: true, sourceUrl: "https://techcrunch.com/2026/07/22/travis-kalanicks-robotics-company-raises-1-7b-led-by-a16z/" },
    ],
    news: [
      { date: "2026-07-22", title: "Raises $1.7B led by a16z; Uber joins", source: "TechCrunch", url: "https://techcrunch.com/2026/07/22/travis-kalanicks-robotics-company-raises-1-7b-led-by-a16z/" },
    ],
  },
  "Weave Robotics": {
    sector: "Robotics · Home",
    lastReviewed: R,
    rounds: [
      { date: "2024", round: "Seed (YC)", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://sacra.com/c/weave-robotics/" },
    ],
    news: [
      { date: "2026", title: "Isaac 0 shipping; Isaac 1 this fall", source: "Weave", url: "https://www.weaverobotics.com/" },
    ],
  },
  "Blue Origin": {
    sector: "Space",
    lastReviewed: R,
    rounds: [
      { date: "2026-09", round: "First outside round", raised: 10 * B, postMoney: 140 * B, lead: "Coatue", ours: true, sourceUrl: "https://finance.yahoo.com/markets/stocks/articles/blue-origin-raises-10b-bezos-205521748.html" },
    ],
    news: [
      { date: "2026-11-05", title: "New Glenn return pushed to 2027", source: "CNBC", url: "https://www.cnbc.com/2026/11/05/blue-origin-launch-new-glenn.html" },
      { date: "2026-11", title: "Unveils Northstar booster engine", source: "Blue Origin", url: "https://www.blueorigin.com/news/introducing-northstar-new-booster-engine" },
      { date: "2026-11", title: "GS3 third stage for direct-to-GEO", source: "Blue Origin", url: "https://www.blueorigin.com/news/new-glenn-expands-reach-with-gs3" },
      { date: "2026-07-08", title: "First outside round at $130B", source: "CNBC", url: "https://www.cnbc.com/2026/07/08/blue-origin-bezos-fundraising.html" },
    ],
  },
  Positron: {
    sector: "Semiconductors · AI inference",
    lastReviewed: R,
    rounds: [
      { date: "2025-02-11", round: "Seed", raised: 23.5 * M, sourceUrl: "https://www.reuters.com/technology/artificial-intelligence/ai-chip-startup-positron-raises-235-million-seed-round-take-nvidia-2025-02-11/" },
      { date: "2025-07", round: "Series A", raised: 51.6 * M, sourceUrl: "https://www.banyan-vc.com/insights/positronai" },
      { date: "2026-02-04", round: "Series B", raised: 230 * M, postMoney: 1 * B, postLabel: "$1B+", sourceUrl: "https://www.businesswire.com/news/home/20260204250472/en/Positron-AI-Raises-$230-Million-Series-B-at-Over-$1-Billion-Valuation-to-Scale-Energy-Efficient-AI-Inference" },
      { date: "2026-09-10", round: "Series C", raised: 875 * M, postMoney: 5 * B, ours: true, sourceUrl: "https://www.prnewswire.com/news-releases/positron-ai-raises-875-million-at-a-5-billion-valuation-to-bring-its-next-generation-inference-silicon-to-market-302874601.html" },
    ],
    news: [
      { date: "2026-09-10", title: "$875M at $5B for inference silicon", source: "PR Newswire", url: "https://www.prnewswire.com/news-releases/positron-ai-raises-875-million-at-a-5-billion-valuation-to-bring-its-next-generation-inference-silicon-to-market-302874601.html" },
      { date: "2026-09-10", title: "Valuation skyrockets in new round", source: "Reuters", url: "https://www.reuters.com/business/ai-chip-startup-positrons-valuation-skyrockets-latest-funding-round-2026-09-10/" },
      { date: "2026-02-04", title: "$230M Series B at $1B+", source: "Business Wire", url: "https://www.businesswire.com/news/home/20260204250472/en/Positron-AI-Raises-$230-Million-Series-B-at-Over-$1-Billion-Valuation-to-Scale-Energy-Efficient-AI-Inference" },
    ],
  },
  "Longshot Space": {
    sector: "Space · Launch",
    lastReviewed: "2026-11-24",
    rounds: [
      { date: "2026-06", round: "Seed", raised: 5 * M, lead: "South Park Commons", sourceUrl: "https://longshotspace.com/newsroom/longshot-secures-5-million-investment-from-south-park-commons-bringing-total-funding-to-20-million" },
      // Entry terms from the AngelList material-terms notice of 2026-11-24 (deal page is not public). $180M post is already the portal entry valuation.
      { date: "2026-11-10", round: "Series A", raised: 30 * M, postMoney: 180 * M, ours: true, sourceUrl: "https://www.longshotspace.com/" },
    ],
    news: [
      { date: "2026-10-13", title: "Gun-launched cargo at TC Disrupt", source: "TechCrunch", url: "https://techcrunch.com/2026/10/13/forget-rockets-longshot-wants-to-fire-cargo-into-space-from-a-gun-see-it-at-techcrunch-disrupt-2026/" },
      { date: "2026-06", title: "$5M from South Park Commons", source: "Longshot", url: "https://longshotspace.com/newsroom/longshot-secures-5-million-investment-from-south-park-commons-bringing-total-funding-to-20-million" },
    ],
  },
  Higgsfield: {
    sector: "AI · Video",
    lastReviewed: R,
    rounds: [
      { date: "2025-09", round: "Series A", raised: 50 * M, sourceUrl: "https://www.prnewswire.com/news-releases/higgsfield-announces-130m-series-a-and-reports-200m-annual-run-rate-302661805.html" },
      { date: "2026-01", round: "Series A ext.", raised: 80 * M, postMoney: 1.3 * B, postLabel: "$1.3B+", sourceUrl: "https://www.prnewswire.com/news-releases/higgsfield-announces-130m-series-a-and-reports-200m-annual-run-rate-302661805.html" },
      { date: "2026-08-17", round: "Series B", raised: 400 * M, postMoney: 5.4 * B, lead: "DST Global", ours: true, sourceUrl: "https://techcrunch.com/2026/08/17/higgsfield-raises-400m-series-b-quadrupling-its-valuation-in-8-months-to-5-4b/" },
      { date: "2026-10-23", round: "Series B ext.", lead: "TCV, NVIDIA", sourceUrl: "https://www.prnewswire.com/news-releases/higgsfield-extends-series-b-with-new-investment-from-tcv-and-nvidia-302918071.html" },
    ],
    news: [
      { date: "2026-10-23", title: "TCV and NVIDIA join Series B", source: "Higgsfield", url: "https://higgsfield.ai/blog/higgsfield-series-b-extension-tcv-nvidia" },
      { date: "2026-08-17", title: "$400M Series B at $5.4B", source: "TechCrunch", url: "https://techcrunch.com/2026/08/17/higgsfield-raises-400m-series-b-quadrupling-its-valuation-in-8-months-to-5-4b/" },
    ],
  },
  Autostep: {
    sector: "AI · Operations",
    lastReviewed: R,
    rounds: [
      { date: "2026-06", round: "Pre-seed (YC)", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://fundediq.co/autostep-autostep-ai-funding/" },
    ],
    news: [],
  },
  Molagri: {
    sector: "Agriculture · Biotech",
    lastReviewed: R,
    rounds: [
      { date: "2026-10-14", round: "Pre-seed + seed", raised: 5.8 * M, lead: "Convective", sourceUrl: "https://molagri.com/blog/seed-round/" },
    ],
    news: [
      { date: "2026-10-14", title: "$5.8M for updatable biopesticides", source: "AgFunderNews", url: "https://agfundernews.com/molagri-raises-5-8m-to-build-updatable-biopesticides" },
    ],
  },
  TryNearby: {
    sector: "Software · Restaurants",
    lastReviewed: R,
    rounds: [
      { date: "2026", round: "YC S26", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.ycombinator.com/companies/trynearby" },
    ],
    news: [
      { date: "2026", title: "Launch YC: local creators for restaurants", source: "Y Combinator", url: "https://www.ycombinator.com/launches/Src-trynearby-every-local-business-needs-to-be-discoverable-that-150b-market-is-moving-toward-local-creators" },
    ],
  },
  "Familiar Labs": {
    sector: "AI · Media",
    lastReviewed: R,
    rounds: [
      { date: "2026", round: "YC S26", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.crunchbase.com/organization/familiar-labs" },
    ],
    news: [
      { date: "2026", title: "BMW i Ventures invests", source: "BMW i Ventures", url: "https://www.bmwiventures.com/news/voice-interactions-that-feel-familiar-why-we-invested-in-familiar-labs" },
      { date: "2026-08-10", title: "Research behind joint audio-video", source: "Familiar", url: "https://www.thefamiliarlab.com/blog/research" },
    ],
  },
  CarSignal: {
    sector: "Software · Automotive",
    lastReviewed: R,
    rounds: [
      { date: "2026-08", round: "YC S26", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.ycombinator.com/companies/carsignal" },
    ],
    news: [
      { date: "2026", title: "Launch YC: AI OS for auto shops", source: "Y Combinator", url: "https://www.ycombinator.com/launches/Sil-carsignal-the-ai-operating-system-for-auto-shops" },
    ],
  },
  Datoric: {
    sector: "AI · Robotics data",
    lastReviewed: R,
    rounds: [
      { date: "2026", round: "YC S26", raised: 500 * K, lead: "Y Combinator", sourceUrl: "https://www.ycombinator.com/companies/datoric" },
      { date: "2026-09-24", round: "Seed", raised: 8 * M, sourceUrl: "https://pitchbook.com/profiles/company/1414727-74" },
    ],
    news: [],
  },
  Rasyn: {
    sector: "AI · Chemistry",
    lastReviewed: R,
    rounds: [
      { date: "2026-08", round: "Pre-seed (YC S26)", raised: 500 * K, lead: "Array Ventures", sourceUrl: "https://www.array.vc/portfolio/rasyn" },
    ],
    news: [
      { date: "2026", title: "Three provisional patent filings", source: "Rasyn", url: "https://www.rasyn.ai/news/patent-applications" },
    ],
  },
  "Path Robotics": {
    sector: "Robotics · Manufacturing",
    lastReviewed: R,
    rounds: [
      { date: "2021-07", round: "Series C", raised: 100 * M, sourceUrl: "https://stockanalysis.com/private/path-robotics/valuation/" },
      { date: "2024-10", round: "Series D", raised: 100 * M, sourceUrl: "https://stockanalysis.com/private/path-robotics/valuation/" },
      { date: "2026-11", round: "Series E", raised: 300 * M, postMoney: 2.45 * B, lead: "Georgian", ours: true, sourceUrl: "https://www.path-robotics.com/news/path-robotics-announces-300-million-series-e-led-by-georgian" },
    ],
    news: [
      { date: "2026-11", title: "$300M Series E led by Georgian", source: "Path Robotics", url: "https://www.path-robotics.com/news/path-robotics-announces-300-million-series-e-led-by-georgian" },
      { date: "2026-10-23", title: "Autonomous welding demos at FABTECH", source: "Path Robotics", url: "https://www.path-robotics.com/about/events" },
    ],
  },
  Ultrasonium: {
    sector: "Hardware · Ultrasonics",
    lastReviewed: R,
    rounds: [
      { date: "2026-03", round: "TigerLaunch prize", raised: 20 * K, sourceUrl: "https://ultrasonium.com/news" },
      { date: "2026-09", round: "Seed", lead: "YC, Rebel Fund", ours: true, sourceUrl: "https://www.crunchbase.com/organization/ultrasonium/financial_details" },
    ],
    news: [
      { date: "2026-03", title: "Wins TigerLaunch Boston regional", source: "Ultrasonium", url: "https://ultrasonium.com/news" },
    ],
  },
  "Astro Mechanica": {
    sector: "Aerospace · Propulsion",
    lastReviewed: R,
    rounds: [
      { date: "2025-04", round: "Series A", raised: 27.1 * M, lead: "a16z", sourceUrl: "https://www.tectonicdefense.com/exclusive-astro-mechanica-raises-27-1m-for-supersonic-flight/" },
    ],
    news: [
      { date: "2026-07-15", title: "Raising $250M to power data centers", source: "Axios", url: "https://www.axios.com/pro/climate-deals/2026/07/15/astro-mechanica-jet-engines-data-centers" },
      { date: "2026", title: "United engine talks; new concepts", source: "Astro Mechanica", url: "https://www.astromecha.co/news" },
    ],
  },
  Atomarine: {
    sector: "Energy · Compute",
    lastReviewed: R,
    rounds: [
      { date: "2026-11-06", round: "Seed", raised: 19 * M, lead: "Y Combinator", ours: true, sourceUrl: "https://www.datacenterdynamics.com/en/news/atomarine-raises-19m-for-nuclear-powered-floating-data-centers/" },
    ],
    news: [
      { date: "2026-11-11", title: "$19M for nuclear floating data centers", source: "DCD", url: "https://www.datacenterdynamics.com/en/news/atomarine-raises-19m-for-nuclear-powered-floating-data-centers/" },
      { date: "2026-11", title: "Plans SMR-powered offshore campuses", source: "NEI Magazine", url: "https://www.neimagazine.com/news/atomarine-plans-smr-powered-floating-data-centres/" },
    ],
  },
  "Chef Robotics": {
    sector: "Robotics · Food",
    lastReviewed: R,
    rounds: [
      { date: "2021-05-13", round: "Seed", raised: 7.7 * M, sourceUrl: "https://techcrunch.com/2021/05/13/chef-robotics-raises-7-7m-to-help-automate-kitchens/" },
      { date: "2023-03", round: "Seed+", raised: 11.2 * M, sourceUrl: "https://embodyvc.com/companies/chef-robotics/" },
      { date: "2025-03", round: "Series A", raised: 43.1 * M, sourceUrl: "https://techcrunch.com/2025/04/10/how-chef-robotics-found-success-by-turning-away-its-original-customers/" },
    ],
    news: [
      { date: "2026-10-07", title: "NVIDIA Isaac for food manipulation", source: "Chef Robotics", url: "https://www.chefrobotics.ai/resources" },
    ],
  },
  "Standard Bots": {
    sector: "Robotics · Industrial",
    lastReviewed: R,
    rounds: [
      { date: "2023-03", round: "Series A", raised: 14 * M, lead: "Lachy Groom", sourceUrl: "https://standardbots.com/articles/standard-bots-raises-14m-in-series-a-funding-from-lachy-groom" },
      { date: "2024-07", round: "Series B", raised: 63 * M, sourceUrl: "https://standardbots.com/articles/standard-bots-raises-63m-to-accelerate-ai-in-robotics" },
      { date: "2026-06-09", round: "Series C", raised: 200 * M, postMoney: 1 * B, lead: "RoboStrategy", ours: true, sourceUrl: "https://standardbots.com/articles/standard-bots-raises-200m-series-c-at-1b-valuation-as-americas-largest-manufacturer-of-ai-native-industrial-robots" },
    ],
    news: [
      { date: "2026-06-09", title: "$200M Series C at $1B", source: "Standard Bots", url: "https://standardbots.com/articles/standard-bots-raises-200m-series-c-at-1b-valuation-as-americas-largest-manufacturer-of-ai-native-industrial-robots" },
    ],
  },
  "Commons Clinic": {
    sector: "Healthcare",
    lastReviewed: R,
    rounds: [
      { date: "2025-06-12", round: "Series B", raised: 26 * M, sourceUrl: "https://www.prnewswire.com/news-releases/commons-clinic-raises-26m-series-b-launches-wholebody-multi-specialty-care-platform-302479773.html" },
      { date: "2026-07-06", round: "Series B-II (Form D)", raised: 10.12 * M, sourceUrl: "https://www.sec.gov/Archives/edgar/data/1865996/000186599626000003/0001865996-26-000003.txt" },
    ],
    news: [
      { date: "2025-06-12", title: "$26M Series B; launches Wholebody", source: "PR Newswire", url: "https://www.prnewswire.com/news-releases/commons-clinic-raises-26m-series-b-launches-wholebody-multi-specialty-care-platform-302479773.html" },
    ],
  },
  "T3 Code": {
    sector: "Developer Tools",
    lastReviewed: "2026-11-27",
    rounds: [
      { date: "2022-03", round: "YC W22", lead: "Y Combinator", sourceUrl: "https://t3.tools/blog/yc-announcement" },
      { date: "2026-11-27", round: "Series A SAFE (uncapped MFN)", ours: true, sourceUrl: "https://t3.codes/" },
    ],
    news: [
      { date: "2026-11-21", title: "Adds multi-repo project support", source: "Hacker News", url: "https://news.ycombinator.com/item?id=50588007" },
      { date: "2026-03-07", title: "Launches open-source T3 Code", source: "X / Theo Browne", url: "https://x.com/theo/status/2030071716530245800" },
      { date: "2026-02-08", title: "T3 Code repo created on GitHub", source: "GitHub", url: "https://github.com/pingdotgg/t3code" },
      { date: "2022-03-03", title: "Joins Y Combinator Winter 2022", source: "T3 Tools", url: "https://t3.tools/blog/yc-announcement" },
    ],
  },
};
