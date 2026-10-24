import type { InvestmentRecord, ProjectedValuationMark } from "@/data/lp-investments";

// Round each position once so the displayed rows, their totals and the summary
// reconcile to the same cents. Partial vehicle marks leave the balance at cost.
export function projectedPositionValue(
  investedCost: number,
  mark?: ProjectedValuationMark,
  performance?: InvestmentRecord["performance"],
) {
  const markedCost = mark?.costBasisAmount ?? investedCost;
  const value = performance
    ? performance.currentValue + performance.distributions
    : mark
      ? investedCost - markedCost + markedCost * mark.latestValuationAmount / mark.entryValuationAmount
      : investedCost;
  return Math.round(value * 100) / 100;
}
