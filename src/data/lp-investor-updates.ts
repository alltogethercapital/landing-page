export type LpInvestorUpdateSummary = {
  slug: string;
  issue: number;
  title: string;
  published: string;
  publishedAt: string;
  excerpt: string;
};

export const LP_INVESTOR_UPDATES: LpInvestorUpdateSummary[] = [
  {
    slug: "august-2026",
    issue: 1,
    title: "Owning the Post-Labor Future",
    published: "August 14, 2026",
    publishedAt: "2026-08-14",
    excerpt:
      "Our founding thesis, the portfolio today, and how we plan to invest and report from here.",
  },
];

export const LP_AUGUST_2026_PORTFOLIO_AS_OF = "August 14, 2026";

// Figures of record, matching the August 2026 letter as mailed: three sourced
// marks (Figure AI, Shield AI, Apptronik), the other 41 positions at cost.
export const LP_AUGUST_2026_FUND_SNAPSHOT = {
  investedCost: 661_014.25,
  projectedGrossValue: 671_574.11,
  projectedGrossMultiple: 1.02,
  positions: 44,
  companies: 43,
} as const;
