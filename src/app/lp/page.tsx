import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LpMetricLabel } from "@/components/lp-metric-label";
import {
  LpPortfolioInsights,
  LpPortfolioPerformance,
} from "@/components/lp-letter-figures";
import { LpPortfolioTable } from "@/components/lp-portfolio-table";
import { LpSectionTabs } from "@/components/lp-section-tabs";
import { LpAllocationDonut, type LpAllocationSlice } from "@/components/lp-allocation-donut";
import { LETTER_ALLOCATION } from "@/data/lp-letter-figures";
import { getLpPortfolio, LP_AUM, type LpInvestmentDto } from "@/lib/lp-data";
import { pageTitle } from "@/lib/page-metadata";

type LpPortfolioPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: LpPortfolioPageProps): Promise<Metadata> {
  const params = await searchParams;
  const section = params.section === "performance"
    ? "Performance"
    : params.section === "analysis"
      ? "Insights"
      : "Portfolio";
  return {
    title: pageTitle(section),
    robots: { index: false, follow: false, nocache: true },
  };
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const TOP_COMPANY_SLICES = 8;

// Invested cost by company. H256 looks through to the amount deployed to Anduril
// and the balance still being finalized, matching the Investments table.
function companySlices(investments: LpInvestmentDto[]): LpAllocationSlice[] {
  const totals = new Map<string, number>();
  const add = (label: string, amount: number) => totals.set(label, (totals.get(label) ?? 0) + amount);
  for (const investment of investments) {
    if (investment.gift) continue;
    const allocation = investment.vehicleAllocation;
    if (allocation) {
      add(allocation.deployedCompany, allocation.deployedAmount);
      add("Finalizing allocation", allocation.pendingAmount);
    } else {
      add(investment.company, investment.investedCost);
    }
  }
  const sorted = [...totals.entries()].sort((left, right) => right[1] - left[1]);
  const top = sorted.slice(0, TOP_COMPANY_SLICES).map(([label, amount]) => ({ key: label, label, amount }));
  const rest = sorted.slice(TOP_COMPANY_SLICES);
  if (rest.length > 0) {
    top.push({
      key: "other",
      label: `Other (${rest.length})`,
      amount: rest.reduce((sum, [, amount]) => sum + amount, 0),
    });
  }
  return top;
}

export default async function LpPortfolioPage({ searchParams }: LpPortfolioPageProps) {
  const [investments, params] = await Promise.all([getLpPortfolio(), searchParams]);
  const value = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
  if (value("section") === "updates") redirect("/lp");
  if (value("section") === "financials") {
    const statement = value("statement");
    redirect(statement ? `/lp/financials?statement=${encodeURIComponent(statement)}` : "/lp/financials");
  }
  const section = value("section") === "analysis"
    ? "analysis"
    : value("section") === "performance"
      ? "performance"
      : "investments";
  // Gifted positions: $0 cost to the fund, carried at fair value, excluded
  // from AUM. Their value lifts Projected and the Multiple; cost is fund cost.
  const fundInvestments = investments.filter((item) => !item.gift);
  const giftedValue = investments.filter((item) => item.gift).reduce(
    (total, item) => total + item.projection.projectedValue,
    0,
  );
  const investedCost = fundInvestments.reduce((total, item) => total + item.investedCost, 0);
  const pendingAllocation = fundInvestments.reduce(
    (total, item) => total + (item.vehicleAllocation?.pendingAmount ?? 0),
    0,
  );
  const fundProjectedValue = fundInvestments.reduce(
    (total, item) => total + item.projection.projectedValue,
    0,
  );
  const totalProjectedValue = fundProjectedValue + giftedValue;
  const currentValueMultiple = totalProjectedValue / investedCost;
  return (
    <div className="lp-portal-shell">
      <h1 className="sr-only">Portfolio</h1>

      <dl className="lp-summary-grid lp-summary-grid--four" aria-label="Portfolio summary">
        <div className="lp-summary-metric--primary">
          <dt>
            <LpMetricLabel
              label="AUM"
              tooltipId="lp-aum-tooltip"
              description="Capital contributed by LPs: $925,000 cash. Excludes the $4,145 expense deposits and gifted positions."
            />
          </dt>
          <dd>{currency(LP_AUM)}</dd>
        </div>
        <div className="lp-summary-metric--primary">
          <dt>
            <LpMetricLabel
              label="Projected"
              tooltipId="lp-nav-tooltip"
              description={`Estimated gross value from latest comparable valuations: fund-purchased ${currency(fundProjectedValue)} + gifted ${currency(giftedValue)} ($0 cost). Positions without one at cost. Gross, not NAV.`}
            />
          </dt>
          <dd>{currency(totalProjectedValue)}</dd>
        </div>
        <div>
          <dt>
            <LpMetricLabel
              label="Pending"
              tooltipId="lp-pending-allocation-tooltip"
              description={`${currency(pendingAllocation)} of H256 being finalized between Atoms and Applied Intuition. Held at cost in Projected until deployed.`}
            />
          </dt>
          <dd>{currency(pendingAllocation)}</dd>
        </div>
        <div>
          <dt>
            <LpMetricLabel
              label="Multiple"
              tooltipId="lp-gross-value-multiple-tooltip"
              description={`Projected ÷ cost basis: (fund-purchased ${currency(fundProjectedValue)} + gifted ${currency(giftedValue)}) ÷ fund cost ${currency(investedCost)}. Gifts at $0 cost; excluded from AUM.`}
            />
          </dt>
          <dd>{currentValueMultiple.toFixed(2)}×</dd>
        </div>
      </dl>

      <LpAllocationDonut
        positionCount={fundInvestments.length}
        views={[
          { key: "company", label: "By company", slices: companySlices(investments) },
          {
            key: "sector",
            label: "By sector",
            slices: LETTER_ALLOCATION.map(({ key, label, amount }) => ({ key, label, amount })),
          },
        ]}
      />

      <LpSectionTabs
        initial={section}
        tabs={[
          {
            key: "investments",
            label: "Investments",
            content: <LpPortfolioTable investments={investments} query={value("query")} />,
          },
          {
            key: "performance",
            label: "Performance",
            content: (
              <div className="lp-portfolio-analysis">
                <LpPortfolioPerformance />
              </div>
            ),
          },
          {
            key: "analysis",
            label: "Insights",
            content: (
              <div className="lp-portfolio-analysis">
                <LpPortfolioInsights />
              </div>
            ),
          },
        ]}
      />

      <footer className="lp-portal-footer">
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
