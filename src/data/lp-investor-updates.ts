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
    slug: "october-2026",
    issue: 3,
    title: "Intelligence Meets the Production Line",
    subtitle: "Chef Robotics, Physical AI, and the Next Operating Layer",
    published: "October 16, 2026",
    publishedAt: "2026-10-16",
    excerpt:
      "Why physical AI becomes valuable when it owns a production loop, and how Chef Robotics extends that thesis into food manufacturing.",
  },
  {
    slug: "september-2026",
    issue: 2,
    title: "The Work Moves Into the World",
    subtitle: "What Fourteen New Positions Reveal About Intelligence, Infrastructure, and the Application Layer",
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
      "Why Machine Spirit Capital exists, the thesis behind the portfolio, and how we will invest from here.",
  },
];

export const LP_AUGUST_2026_PORTFOLIO_AS_OF = "August 18, 2026";

// Figures of record, reconciled to the live portfolio after the August 18,
// 2026 portfolio-wide valuation review. Eight sourced company comparisons and
// one owner-directed Anduril scenario are applied; all other positions remain
// at cost. H256's allocation being finalized is included at cost in both totals.
export const LP_AUGUST_2026_FUND_SNAPSHOT = {
  investedCost: 651_762.01,
  projectedGrossValue: 731_754.03,
  projectedGrossMultiple: 1.12,
  positions: 44,
  companies: 43,
  markedPositions: 9,
} as const;

export const LP_SEPTEMBER_2026_PORTFOLIO_AS_OF = "September 16, 2026";

// Reconciled to the live Schedule of Investments after the recent amount
// corrections and the Pocket withdrawal. The change from the August letter comprises $154,883.97 across fourteen new
// positions plus a $15,000 correction to Positron's recorded cost. Supabase's final
// allocation is $18.48 below its originally recorded cost; that pre-August correction
// is reflected in both historical snapshots. Apptronik's final allocation is $8,455.76
// below its prior allocation and its directional mark changes proportionally. The second Blue
// Origin allocation is $25.00 below the original $25,000 allocation. Rasyn's final allocation is
// $6.00 and Ultrasonium's is $85.03 below initially recorded cost.
export const LP_SEPTEMBER_2026_FUND_SNAPSHOT = {
  investedCost: 821_645.98,
  projectedGrossValue: 901_638.00,
  projectedGrossMultiple: 1.10,
  grossValueChange: 79_992.02,
  positions: 58,
  companies: 57,
  newPositionsSinceAugust: 14,
  newInvestedCostSinceAugust: 154_883.97,
  reconciliationAdjustmentSinceAugust: 15_000,
} as const;

export const LP_OCTOBER_2026_PORTFOLIO_AS_OF = "October 16, 2026";

// Current snapshot after adding Chef Robotics at owner-confirmed recorded cost.
// Chef Robotics remains at cost because company-specific investment terms,
// execution evidence, and completed cash movement have not yet been supplied.
export const LP_OCTOBER_2026_FUND_SNAPSHOT = {
  investedCost: 840_236.73,
  projectedGrossValue: 920_228.75,
  projectedGrossMultiple: 1.10,
  grossValueChange: 79_992.02,
  positions: 59,
  companies: 58,
  newPositionsSinceSeptember: 1,
  newInvestedCostSinceSeptember: 18_590.75,
} as const;
