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
    subtitle: "Chef Robotics, Standard Bots, and the Next Operating Layer",
    published: "October 16, 2026",
    publishedAt: "2026-10-16",
    excerpt:
      "Why physical AI becomes valuable when it owns a production loop, and how Chef Robotics and Standard Bots extend that thesis across food production and American manufacturing.",
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
// 2026 portfolio-wide valuation review and restated to remove Stripe, which was
// not an investment. Eight sourced company comparisons and
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

// Reconciled to the live Schedule of Investments after removing Stripe,
// which was not an investment, the recent amount corrections, and the Pocket
// withdrawal. The change from the August letter comprises $154,187.03 across fourteen new
// positions plus a $15,000 correction to Positron's recorded cost. Supabase's final
// allocation is $18.48 below its originally recorded cost; that pre-August correction
// is reflected in both historical snapshots. Apptronik's final allocation is $8,455.76
// below its prior allocation and its directional mark changes proportionally. The second Blue
// Origin allocation is $25.00 below the original $25,000 allocation. Rasyn's final allocation is
// $6.00 and Ultrasonium's is $85.03 below initially recorded cost. Restated November 16,
// 2026 for Atomarine's $696.94 final allocation reduction and owner-confirmed AngelList
// Investor Account credit. Atomarine remains at cost; the credit is outside invested cost
// and projected gross value. The August snapshot predates Atomarine and is unchanged.
export const LP_SEPTEMBER_2026_FUND_SNAPSHOT = {
  investedCost: 820_949.04,
  projectedGrossValue: 900_941.06,
  projectedGrossMultiple: 1.10,
  grossValueChange: 79_992.02,
  positions: 58,
  companies: 57,
  newPositionsSinceAugust: 14,
  newInvestedCostSinceAugust: 154_187.03,
  reconciliationAdjustmentSinceAugust: 15_000,
} as const;

export const LP_OCTOBER_2026_PORTFOLIO_AS_OF = "October 29, 2026";

// Current dated snapshot after adding Standard Bots at owner-confirmed recorded
// cost and removing Stripe, which was not an investment. Restated November 16, 2026
// for the same $696.94 Atomarine reduction reflected in the September snapshot.
// Standard Bots remains at cost because no later company valuation, approved
// administrator mark, execution evidence, or completed cash movement is supplied.
export const LP_OCTOBER_2026_FUND_SNAPSHOT = {
  investedCost: 854_539.79,
  projectedGrossValue: 934_531.81,
  projectedGrossMultiple: 1.09,
  grossValueChange: 79_992.02,
  positions: 60,
  companies: 59,
  newPositionsSinceSeptember: 2,
  newInvestedCostSinceSeptember: 33_590.75,
} as const;
