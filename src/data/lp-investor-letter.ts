export const LP_LETTER_PUBLISHED = "August 14, 2026";
export const LP_LETTER_PORTFOLIO_AS_OF = "August 13, 2026";

export const LP_LETTER_FUND_SNAPSHOT = {
  investedCost: 676_014.25,
  projectedGrossValue: 689_867.04,
  projectedGrossMultiple: 1.02,
  positions: 44,
  companies: 43,
} as const;

export const LP_LETTER_THEMES = [
  { label: "Diversified frontier vehicle", positions: 1, amount: 200_000, share: 29.6 },
  { label: "Robotics and industrial systems", positions: 13, amount: 152_944.38, share: 22.6 },
  { label: "AI and compute", positions: 11, amount: 124_427.7, share: 18.4 },
  { label: "Aerospace, defense and autonomy", positions: 9, amount: 116_675.85, share: 17.3 },
  { label: "Energy and hard infrastructure", positions: 4, amount: 55_000, share: 8.1 },
  { label: "Applications and resilience", positions: 6, amount: 26_966.32, share: 4.0 },
] as const;

export const LP_LETTER_US_GDP = [
  { period: "Q4 2025", value: 0.5 },
  { period: "Q1 2026", value: 2.1 },
  { period: "Q2 2026", value: 1.5 },
] as const;

export const LP_LETTER_SOURCES = [
  {
    id: "ai-economy",
    title: "2026 AI Index: Economy",
    publisher: "Stanford Institute for Human-Centered AI",
    url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/economy",
    accessed: "August 14, 2026",
  },
  {
    id: "ai-research",
    title: "2026 AI Index: Research and Development",
    publisher: "Stanford Institute for Human-Centered AI",
    url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development",
    accessed: "August 14, 2026",
  },
  {
    id: "ai-performance",
    title: "2026 AI Index: Technical Performance",
    publisher: "Stanford Institute for Human-Centered AI",
    url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance",
    accessed: "August 14, 2026",
  },
  {
    id: "ai-policy",
    title: "2026 AI Index: Policy and Governance",
    publisher: "Stanford Institute for Human-Centered AI",
    url: "https://hai.stanford.edu/ai-index/2026-ai-index-report/policy-and-governance",
    accessed: "August 14, 2026",
  },
  {
    id: "iea-power",
    title: "Energy and AI: Energy supply for AI",
    publisher: "International Energy Agency",
    url: "https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai",
    accessed: "August 14, 2026",
  },
  {
    id: "us-gdp",
    title: "Gross Domestic Product, advance estimate for Q2 2026",
    publisher: "U.S. Bureau of Economic Analysis",
    url: "https://www.bea.gov/data/gdp/gross-domestic-product",
    accessed: "August 14, 2026",
  },
  {
    id: "fed",
    title: "FOMC statement, July 29, 2026",
    publisher: "Board of Governors of the Federal Reserve System",
    url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm",
    accessed: "August 14, 2026",
  },
  {
    id: "world-growth",
    title: "World Economic Outlook Update, July 2026",
    publisher: "International Monetary Fund",
    url: "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
    accessed: "August 14, 2026",
  },
  {
    id: "venture-monitor",
    title: "PitchBook-NVCA Venture Monitor, Q2 2026",
    publisher: "National Venture Capital Association and PitchBook",
    url: "https://nvca.org/pitchbook-nvca-venture-monitor/",
    accessed: "August 14, 2026",
  },
] as const;

export type LpLetterSourceId = (typeof LP_LETTER_SOURCES)[number]["id"];
