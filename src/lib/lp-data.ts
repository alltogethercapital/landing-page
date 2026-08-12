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
