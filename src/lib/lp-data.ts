import "server-only";

import { cache } from "react";
import { LP_INVESTMENTS, LP_SNAPSHOT } from "@/data/lp-investments";
import { PORTFOLIO } from "@/lib/portfolio";

export type LpInvestmentDto = Omit<
  (typeof LP_INVESTMENTS)[number],
  "driveFolderId"
>;

const publicPortfolio = new Map(
  PORTFOLIO.map((company) => [company.name.toLocaleLowerCase(), company]),
);

function assertLpData() {
  const ids = new Set<string>();
  const chronologies = new Set<number>();
  let investedCostTotal = 0;

  for (const investment of LP_INVESTMENTS) {
    if (ids.has(investment.id)) throw new Error(`Duplicate LP investment id: ${investment.id}`);
    if (chronologies.has(investment.chronology)) {
      throw new Error(`Duplicate LP chronology: ${investment.chronology}`);
    }
    if (investment.investedCost <= 0) throw new Error(`Invalid invested cost: ${investment.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(investment.investmentDate)) {
      throw new Error(`Invalid investment date: ${investment.id}`);
    }
    if (!investment.logo.startsWith("/logos/cards/")) {
      throw new Error(`Invalid local logo path: ${investment.id}`);
    }
    if (investment.performance) {
      const mark = investment.performance;
      if (mark.currentValue < 0 || mark.distributions < 0) {
        throw new Error(`Invalid performance value: ${investment.id}`);
      }
      if (!mark.asOf || !mark.method || !mark.source || !mark.approvedBy || !mark.approvedAt) {
        throw new Error(`Incomplete performance approval: ${investment.id}`);
      }
    }
    ids.add(investment.id);
    chronologies.add(investment.chronology);
    investedCostTotal += investment.investedCost;
  }

  if (LP_INVESTMENTS.length !== LP_SNAPSHOT.recordCount) {
    throw new Error(
      `LP snapshot count mismatch: expected ${LP_SNAPSHOT.recordCount}, received ${LP_INVESTMENTS.length}`,
    );
  }
  for (let chronology = 1; chronology <= LP_SNAPSHOT.recordCount; chronology += 1) {
    if (!chronologies.has(chronology)) throw new Error(`Missing LP chronology: ${chronology}`);
  }
  if (Math.round(investedCostTotal * 100) !== Math.round(LP_SNAPSHOT.investedCostTotal * 100)) {
    throw new Error(
      `LP snapshot cost mismatch: expected ${LP_SNAPSHOT.investedCostTotal}, received ${investedCostTotal}`,
    );
  }
}

assertLpData();

function toDto(investment: (typeof LP_INVESTMENTS)[number]): LpInvestmentDto {
  const { driveFolderId: _privateDriveFolderId, ...safeInvestment } = investment;
  void _privateDriveFolderId;
  return safeInvestment;
}
export const getLpPortfolio = cache(async () => {
  return LP_INVESTMENTS.map(toDto);
});

export const getLpInvestment = cache(async (id: string) => {
  const investment = LP_INVESTMENTS.find((record) => record.id === id);
  return investment ? toDto(investment) : null;
});

export function getCompanyContext(name: string) {
  const company = publicPortfolio.get(name.toLocaleLowerCase());
  if (!company) return null;
  return {
    sectors: company.sectors,
    website: company.href,
    description: company.blurb,
  };
}

export function getLpSnapshot() {
  const { sourceId: _privateSourceId, ...safeSnapshot } = LP_SNAPSHOT;
  void _privateSourceId;
  return safeSnapshot;
}
