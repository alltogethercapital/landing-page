import "server-only";

import { LP_INVESTMENTS, type InvestmentRecord } from "@/data/lp-investments";

// Figure data for the August 2026 investor letter.
//
// Everything below is derived from LP_INVESTMENTS so the figures move with the
// Schedule of Investments rather than drifting from it. Two fields the schedule
// does not carry are declared here:
//
//   allocation category — internal taxonomy for deployed company exposure
//   entryValuationAmount — the entry price as a number, for the log-scale chart
//
// Three positions carry no company price at entry and are excluded from every
// price-based figure: the H256 vehicle is sized on its fund, Lance AI was an
// uncapped SAFE, and Maven Robotics priced against a financing model.

export type LetterAllocationCategory =
  | "ai"
  | "robotics"
  | "aerospace"
  | "energy"
  | "applications"
  | "pending";

export const LETTER_ALLOCATION_LABELS: Record<LetterAllocationCategory, string> = {
  ai: "AI and compute",
  robotics: "Robotics and industrial systems",
  aerospace: "Defense and aerospace",
  energy: "Energy and hard infrastructure",
  applications: "Applications and resilience",
  pending: "Pending allocation",
};

// Same categories, cased to sit inside a sentence in the letter body.
export const LETTER_ALLOCATION_PROSE: Record<LetterAllocationCategory, string> = {
  ai: "AI and compute",
  robotics: "robotics and industrial systems",
  aerospace: "defense and aerospace",
  energy: "energy and hard infrastructure",
  applications: "applications and resilience",
  pending: "pending allocation",
};

// Allocation category is an internal classification and is not a field on the
// Schedule of Investments. Direct positions spanning more than one category sit
// with the primary business. Keyed by the schedule's chronology number.
const CATEGORY_BY_CHRONOLOGY: Record<number, LetterAllocationCategory> = {
  1: "robotics", 2: "energy", 3: "robotics", 4: "ai", 5: "ai",
  6: "energy", 7: "aerospace", 8: "applications", 9: "aerospace", 10: "ai",
  11: "ai", 12: "robotics", 13: "ai", 14: "aerospace", 15: "energy",
  16: "aerospace", 17: "robotics", 18: "robotics", 19: "robotics", 20: "aerospace",
  21: "applications", 22: "robotics", 23: "robotics", 24: "robotics", 25: "robotics",
  26: "applications", 27: "ai", 28: "aerospace", 29: "applications", 30: "robotics",
  31: "applications", 32: "ai", 33: "energy", 34: "energy", 35: "ai",
  36: "ai", 37: "aerospace", 38: "ai", 39: "applications", 40: "aerospace",
  41: "applications", 42: "robotics", 43: "aerospace", 44: "ai",
};

// Entry valuation as reported at the time of investment. These are entry prices,
// not marks. Positions absent from this map carry no company price at entry.
const ENTRY_VALUATION_BY_CHRONOLOGY: Record<number, number> = {
  1: 25e6, 2: 695e6, 3: 27e6, 4: 8.6e9,
  6: 312.5e6, 7: 10.5e9, 8: 10e6, 10: 2e9,
  11: 852e9, 12: 4.9e9, 13: 250e6, 14: 160e6, 15: 3e9,
  16: 70e6, 17: 5.775e9, 18: 15e6, 20: 90e6,
  21: 2.5e9, 22: 35e6, 23: 10e9, 24: 4.59e9, 25: 30e9,
  26: 500e6, 27: 30e6, 28: 35e6, 29: 35e6, 30: 60e6,
  31: 50e6, 32: 3.4e9, 33: 600e6, 34: 120e6, 35: 3.8e9,
  36: 60e6, 37: 6e6, 38: 10.5e9, 39: 30e6, 40: 50e6,
  41: 15.9e9, 42: 180e6, 43: 130e9, 44: 4.5e9,
};

export type LetterEntryRound =
  | "No company round"
  | "Series C+"
  | "Series A"
  | "Series B"
  | "Pre-seed / Seed"
  | "Other";

// Round labels collapse into the entry-round view used in the letter. A+ and
// B+ extensions sit with their base round; pooled positions without a stated
// underlying company round are reported plainly as having no company round.
function entryRoundOf(round: string): LetterEntryRound {
  if (round === "N/A") return "No company round";
  if (/^Pre-seed|^Seed/.test(round)) return "Pre-seed / Seed";
  if (/^Series A/.test(round)) return "Series A";
  if (/^Series B/.test(round)) return "Series B";
  if (/^Series [C-Z]/.test(round)) return "Series C+";
  return "Other";
}

// The letter prints shorter labels than the schedule's internal vocabulary.
const PLATFORM_LABELS: Record<string, string> = {
  "Capital Company": "Capital Co.",
};

type LetterPositionType =
  | "Primary equity"
  | "Secondary equity"
  | "Fund / SPV interests"
  | "SAFEs"
  | "Convertible notes";

function positionTypeOf(instrument: InvestmentRecord["instrument"]): LetterPositionType {
  if (instrument === "Equity") return "Primary equity";
  if (instrument === "Secondary") return "Secondary equity";
  if (instrument === "SPV") return "Fund / SPV interests";
  if (instrument === "SAFE") return "SAFEs";
  return "Convertible notes";
}

export type LetterPosition = InvestmentRecord & {
  allocationCategory: LetterAllocationCategory;
  allocationCategoryLabel: string;
  entryRound: LetterEntryRound;
  positionType: LetterPositionType;
  platformLabel: string;
  entryValuationAmount?: number;
};

export const LETTER_POSITIONS: LetterPosition[] = LP_INVESTMENTS.map((record) => ({
  ...record,
  allocationCategory: CATEGORY_BY_CHRONOLOGY[record.chronology],
  allocationCategoryLabel: LETTER_ALLOCATION_LABELS[CATEGORY_BY_CHRONOLOGY[record.chronology]],
  entryRound: entryRoundOf(record.round),
  positionType: positionTypeOf(record.instrument),
  platformLabel: PLATFORM_LABELS[record.platform] ?? record.platform,
  entryValuationAmount: ENTRY_VALUATION_BY_CHRONOLOGY[record.chronology],
}));

export const LETTER_INVESTED_TOTAL = LETTER_POSITIONS.reduce(
  (sum, position) => sum + position.investedCost,
  0,
);

export const LETTER_COMPANY_COUNT = new Set(
  LETTER_POSITIONS.map((position) => position.company),
).size;

export type LetterShare = {
  key: string;
  label: string;
  amount: number;
  share: number;
};

function shareOf(amount: number) {
  return amount / LETTER_INVESTED_TOTAL;
}

function groupShares<T extends string>(
  keyOf: (position: LetterPosition) => T,
  labelOf: (key: T) => string = (key) => key,
): LetterShare[] {
  const totals = new Map<T, number>();
  for (const position of LETTER_POSITIONS) {
    const key = keyOf(position);
    totals.set(key, (totals.get(key) ?? 0) + position.investedCost);
  }
  return [...totals.entries()]
    .map(([key, amount]) => ({ key, label: labelOf(key), amount, share: shareOf(amount) }))
    .sort((left, right) => right.amount - left.amount);
}

/* 01 — Portfolio at a glance ---------------------------------------------- */

const H256_POSITION = LETTER_POSITIONS.find((position) => position.id === "09-h256-series-3");
if (!H256_POSITION?.vehicleAllocation) {
  throw new Error("Missing H256 vehicle allocation");
}

export const LETTER_H256_DEPLOYED_AMOUNT =
  H256_POSITION.investedCost * H256_POSITION.vehicleAllocation.deployedShare;
export const LETTER_H256_PENDING_AMOUNT =
  H256_POSITION.investedCost - LETTER_H256_DEPLOYED_AMOUNT;
export const LETTER_H256_POSITION_SHARE = shareOf(H256_POSITION.investedCost);

// The Schedule of Investments continues to carry H256 as one legal position.
// For allocation reporting, look through that position only far enough to show the
// amount already deployed to Anduril and the capital that is not yet deployed.
export const LETTER_ALLOCATION = (() => {
  const totals = new Map<LetterAllocationCategory, number>();
  const add = (category: LetterAllocationCategory, amount: number) =>
    totals.set(category, (totals.get(category) ?? 0) + amount);

  for (const position of LETTER_POSITIONS) {
    if (position.id === H256_POSITION.id) {
      add("aerospace", LETTER_H256_DEPLOYED_AMOUNT);
      add("pending", LETTER_H256_PENDING_AMOUNT);
    } else {
      add(position.allocationCategory, position.investedCost);
    }
  }

  return [...totals.entries()]
    .map(([key, amount]) => ({
      key,
      label: LETTER_ALLOCATION_LABELS[key],
      amount,
      share: shareOf(amount),
    }))
    .sort((left, right) => right.amount - left.amount);
})();

// Cumulative invested cost by month. Two positions predate the fund's active
// period, so the series opens at the earliest investment date on the schedule.
export const LETTER_DEPLOYMENT = (() => {
  const byDate = [...LETTER_POSITIONS].sort((left, right) =>
    left.investmentDate.localeCompare(right.investmentDate),
  );
  let cumulative = 0;
  return byDate.map((position) => {
    cumulative += position.investedCost;
    return { date: position.investmentDate, cumulative, company: position.company };
  });
})();

/* 02 — Concentration and structure ---------------------------------------- */

export const LETTER_TOP_POSITIONS = [...LETTER_POSITIONS]
  .sort((left, right) => right.investedCost - left.investedCost)
  .slice(0, 10)
  .map((position) => ({
    id: position.id,
    // Two 1X positions sit in the schedule; the year disambiguates them.
    label:
      LETTER_POSITIONS.filter((entry) => entry.company === position.company).length > 1
        ? `${position.company} (${position.investmentDate.slice(0, 7)})`
        : position.company,
    amount: position.investedCost,
    share: shareOf(position.investedCost),
  }));

function cumulativeShare(count: number) {
  const sorted = [...LETTER_POSITIONS].sort(
    (left, right) => right.investedCost - left.investedCost,
  );
  return shareOf(
    sorted.slice(0, count).reduce((sum, position) => sum + position.investedCost, 0),
  );
}

export const LETTER_TOP_FIVE_SHARE = cumulativeShare(5);
export const LETTER_TOP_TEN_SHARE = cumulativeShare(10);
export const LETTER_REMAINDER_AVERAGE =
  (LETTER_INVESTED_TOTAL - cumulativeShare(10) * LETTER_INVESTED_TOTAL) /
  (LETTER_POSITIONS.length - 10);

export const LETTER_POSITION_TYPE_SPLIT = groupShares((position) => position.positionType);
export const LETTER_ENTRY_ROUND_SPLIT = groupShares((position) => position.entryRound);
export const LETTER_ACCESS_CHANNEL_SPLIT = groupShares((position) => position.platformLabel);

export const LETTER_POOLED_SHARE = shareOf(
  LETTER_POSITIONS.filter((position) => position.instrument === "SPV").reduce(
    (sum, position) => sum + position.investedCost,
    0,
  ),
);

export const LETTER_PRIMARY_EQUITY_SHARE = shareOf(
  LETTER_POSITIONS.filter((position) => position.instrument === "Equity").reduce(
    (sum, position) => sum + position.investedCost,
    0,
  ),
);

export const LETTER_SECONDARY_EQUITY_SHARE = shareOf(
  LETTER_POSITIONS.filter((position) => position.instrument === "Secondary").reduce(
    (sum, position) => sum + position.investedCost,
    0,
  ),
);

/* 03 — Where we bought ----------------------------------------------------- */

export const LETTER_PRICED_POSITIONS = LETTER_POSITIONS.filter(
  (position): position is LetterPosition & { entryValuationAmount: number } =>
    typeof position.entryValuationAmount === "number",
).sort((left, right) => left.entryValuationAmount - right.entryValuationAmount);

export const LETTER_PRICED_COST = LETTER_PRICED_POSITIONS.reduce(
  (sum, position) => sum + position.investedCost,
  0,
);

export const LETTER_ENTRY_LOW = LETTER_PRICED_POSITIONS[0];
export const LETTER_ENTRY_HIGH =
  LETTER_PRICED_POSITIONS[LETTER_PRICED_POSITIONS.length - 1];
export const LETTER_ENTRY_SPREAD =
  LETTER_ENTRY_HIGH.entryValuationAmount / LETTER_ENTRY_LOW.entryValuationAmount;
export const LETTER_ENTRY_MEDIAN =
  LETTER_PRICED_POSITIONS[Math.floor(LETTER_PRICED_POSITIONS.length / 2)]
    .entryValuationAmount;

const ENTRY_BUCKETS: { label: string; max: number }[] = [
  { label: "Under $100M", max: 100e6 },
  { label: "$100M – $1B", max: 1e9 },
  { label: "$1B – $10B", max: 10e9 },
  { label: "Over $10B", max: Infinity },
];

export const LETTER_ENTRY_BUCKETS: LetterShare[] = ENTRY_BUCKETS.map((bucket, index) => {
  const floor = index === 0 ? 0 : ENTRY_BUCKETS[index - 1].max;
  const amount = LETTER_PRICED_POSITIONS.filter(
    (position) =>
      position.entryValuationAmount >= floor && position.entryValuationAmount < bucket.max,
  ).reduce((sum, position) => sum + position.investedCost, 0);
  return {
    key: bucket.label,
    label: bucket.label,
    amount,
    // Share of priced cost, not of the whole portfolio.
    share: amount / LETTER_PRICED_COST,
  };
});

// Lorenz curve of invested cost, largest position first.
export const LETTER_CONCENTRATION_CURVE = (() => {
  const sorted = [...LETTER_POSITIONS].sort(
    (left, right) => right.investedCost - left.investedCost,
  );
  let cumulative = 0;
  return [
    { positions: 0, share: 0 },
    ...sorted.map((position, index) => {
      cumulative += position.investedCost;
      return { positions: index + 1, share: shareOf(cumulative) };
    }),
  ];
})();
