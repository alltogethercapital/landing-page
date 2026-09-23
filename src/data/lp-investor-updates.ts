export type LpInvestorUpdateSummary = {
  slug: string;
  issue: number;
  title: string;
  subtitle: string;
  published: string;
  publishedAt: string;
  excerpt: string;
};

export const LP_INVESTOR_UPDATES: LpInvestorUpdateSummary[] = [
  {
    slug: "september-2026",
    issue: 2,
    title: "The Work Moves Into the World",
    subtitle: "What Fifteen New Positions Reveal About Intelligence, Infrastructure, and the Application Layer",
    published: "September 17, 2026",
    publishedAt: "2026-09-17",
    excerpt:
      "The portfolio's latest additions, the operating systems forming around AI, and where we are becoming more selective.",
  },
  {
    slug: "august-2026",
    issue: 1,
    title: "Beyond the Anthropocene",
    subtitle: "Betting Together on the Post-Labor AI Economy",
    published: "August 14, 2026",
    publishedAt: "2026-08-14",
    excerpt:
      "Why All Together exists, the thesis behind the portfolio, and how we will invest from here.",
  },
];

export const LP_AUGUST_2026_PORTFOLIO_AS_OF = "August 18, 2026";

// Figures of record, reconciled to the live portfolio after the August 18,
// 2026 portfolio-wide valuation review. Eight sourced company comparisons and
// one owner-directed Anduril scenario are applied; all other positions remain
// at cost. H256's allocation being finalized is included at cost in both totals.
export const LP_AUGUST_2026_FUND_SNAPSHOT = {
  investedCost: 660_236.25,
  projectedGrossValue: 740_918.54,
  projectedGrossMultiple: 1.12,
  positions: 44,
  companies: 43,
  markedPositions: 9,
} as const;

export const LP_SEPTEMBER_2026_PORTFOLIO_AS_OF = "September 16, 2026";

// Reconciled to the live Schedule of Investments after the recent amount
// corrections. The change from the August letter comprises $170,000 across fifteen new
// positions plus a $15,000 correction to Positron's recorded cost. New and
// corrected cost remains at cost in the current value estimate.
export const LP_SEPTEMBER_2026_FUND_SNAPSHOT = {
  investedCost: 845_236.25,
  projectedGrossValue: 925_918.54,
  projectedGrossMultiple: 1.10,
  grossValueChange: 80_682.29,
  positions: 59,
  companies: 58,
  newPositionsSinceAugust: 15,
  newInvestedCostSinceAugust: 170_000,
  reconciliationAdjustmentSinceAugust: 15_000,
} as const;
