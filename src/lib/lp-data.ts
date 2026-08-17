import "server-only";

import { cache } from "react";
import {
  LP_INVESTMENTS,
  LP_PROJECTED_VALUATION_MARKS,
  LP_PROJECTION_AS_OF,
  LP_SNAPSHOT,
} from "@/data/lp-investments";
import {
  formatLpRound,
  formatLpValuation,
  getLpInvestmentLanguage,
} from "@/lib/lp-investment-language";
import { PORTFOLIO } from "@/lib/portfolio";

export type LpInvestmentProjectionDto = {
  projectedValue: number;
  grossMultiple: number;
  distributions: number;
  latestCompanyValuation: string;
  valuationAsOf: string;
  source: string;
  sourceUrl?: string;
  basis: "approved" | "comparable" | "cost";
};

export type LpInvestmentDto = Omit<
  (typeof LP_INVESTMENTS)[number],
  "driveFolderId" | "entryValuation" | "instrument" | "platform" | "round"
> & {
  investmentAccess: string;
  ownershipType: string;
  projection: LpInvestmentProjectionDto;
  round: string;
  valuationWhenInvested: string;
};

const publicPortfolio = new Map(
  PORTFOLIO.map((company) => [company.name.toLocaleLowerCase(), company]),
);
const publicPortfolioAliases = new Map([
  ["budbreak innovations", "bud break innovations"],
  ["decart.ai", "decart"],
  ["lance ai", "lance"],
]);
const lpWebsiteFallbacks = new Map([
  ["compresr", "https://www.compresr.com/"],
  ["matforge", "https://discoveredmaterials.com/"],
  ["positron", "https://www.positron.ai/"],
  ["raspire", "https://raspire.com/"],
  ["rendezvous robotics", "https://www.rdvrobotics.com/"],
]);
const investmentsWithoutCompanyWebsite = new Set(["09-h256-series-3"]);

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
    if (!investmentsWithoutCompanyWebsite.has(investment.id) && !getCompanyContext(investment.company)?.website) {
      throw new Error(`Missing LP company website: ${investment.id}`);
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
    if (investment.vehicleAllocation) {
      const allocation = investment.vehicleAllocation;
      if (
        allocation.deployedShare <= 0 ||
        allocation.awaitingShare <= 0 ||
        Math.abs(allocation.deployedShare + allocation.awaitingShare - 1) > Number.EPSILON ||
        !/^\d{4}-\d{2}-\d{2}$/.test(allocation.asOf) ||
        !allocation.deployedCompany ||
        allocation.candidateCompanies.length === 0
      ) {
        throw new Error(`Invalid vehicle allocation: ${investment.id}`);
      }
    }
    ids.add(investment.id);
    chronologies.add(investment.chronology);
    investedCostTotal += investment.investedCost;
  }

  for (const [id, mark] of Object.entries(LP_PROJECTED_VALUATION_MARKS)) {
    if (!ids.has(id)) throw new Error(`Projection mark has no LP investment: ${id}`);
    if (mark.entryValuationAmount <= 0 || mark.latestValuationAmount <= 0) {
      throw new Error(`Invalid projected valuation mark: ${id}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(mark.asOf) || !mark.latestValuation || !mark.source) {
      throw new Error(`Incomplete projected valuation mark: ${id}`);
    }
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
  const {
    driveFolderId: _privateDriveFolderId,
    entryValuation,
    instrument,
    platform,
    round,
    ...safeInvestment
  } = investment;
  const language = getLpInvestmentLanguage(platform, instrument);
  const mark = LP_PROJECTED_VALUATION_MARKS[investment.id];
  const approvedPerformance = investment.performance;
  const projectedValue = approvedPerformance
    ? approvedPerformance.currentValue + approvedPerformance.distributions
    : mark
      ? investment.investedCost * (mark.latestValuationAmount / mark.entryValuationAmount)
      : investment.investedCost;
  const projection: LpInvestmentProjectionDto = {
    projectedValue,
    grossMultiple: projectedValue / investment.investedCost,
    distributions: approvedPerformance?.distributions ?? 0,
    latestCompanyValuation: formatLpValuation(mark?.latestValuation ?? entryValuation),
    valuationAsOf: approvedPerformance?.asOf ?? mark?.asOf ?? investment.investmentDate,
    source: approvedPerformance?.source ?? mark?.source ?? "Recorded investment terms",
    sourceUrl: mark?.sourceUrl,
    basis: approvedPerformance ? "approved" : mark ? "comparable" : "cost",
  };
  void _privateDriveFolderId;
  return {
    ...safeInvestment,
    ...language,
    projection,
    round: formatLpRound(round),
    valuationWhenInvested: formatLpValuation(entryValuation),
  };
}
export const getLpPortfolio = cache(async () => {
  return LP_INVESTMENTS.map(toDto);
});

export const getLpInvestment = cache(async (id: string) => {
  const investment = LP_INVESTMENTS.find((record) => record.id === id);
  return investment ? toDto(investment) : null;
});

export function getCompanyContext(name: string) {
  const requestedName = name.toLocaleLowerCase();
  const portfolioName = publicPortfolioAliases.get(requestedName) || requestedName;
  const company = publicPortfolio.get(portfolioName);
  const website = company?.href || lpWebsiteFallbacks.get(requestedName);
  if (!company && !website) return null;
  return {
    sectors: company?.sectors || [],
    website,
    description: company?.blurb,
  };
}

export function getLpSnapshot() {
  const { sourceId: _privateSourceId, ...safeSnapshot } = LP_SNAPSHOT;
  void _privateSourceId;
  return { ...safeSnapshot, projectionAsOf: LP_PROJECTION_AS_OF };
}
