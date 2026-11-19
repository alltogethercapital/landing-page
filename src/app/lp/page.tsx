import type { Metadata } from "next";
import Link from "next/link";
import { UIIcon } from "@/components/icons";
import {
  LpPortfolioInsights,
  LpPortfolioPerformance,
} from "@/components/lp-letter-figures";
import { LpPortfolioTable } from "@/components/lp-portfolio-table";
import { LpCompanyUpdates } from "@/components/lp-company-updates";
import { LpAllocationDonut, type LpAllocationSlice } from "@/components/lp-allocation-donut";
import { LETTER_ALLOCATION } from "@/data/lp-letter-figures";
import { getLpPortfolio, type LpInvestmentDto } from "@/lib/lp-data";
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
      : params.section === "updates"
        ? "Company updates"
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

function MetricLabel({
  label,
  description,
  tooltipId,
}: {
  label: string;
  description: string;
  tooltipId: string;
}) {
  return (
    <span className="lp-summary-label">
      <span>{label}</span>
      <span
        className="lp-summary-term"
        tabIndex={0}
        aria-label={`About ${label}`}
        aria-describedby={tooltipId}
      >
        <span className="lp-summary-info" aria-hidden="true"><UIIcon name="info" /></span>
        <span className="lp-summary-tooltip" id={tooltipId} role="tooltip">
          {description}
        </span>
      </span>
    </span>
  );
}

export default async function LpPortfolioPage({ searchParams }: LpPortfolioPageProps) {
  const [investments, params] = await Promise.all([getLpPortfolio(), searchParams]);
  const value = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
  const section = value("section") === "analysis"
    ? "analysis"
    : value("section") === "performance"
      ? "performance"
      : value("section") === "updates"
        ? "updates"
        : "investments";
  const investedCost = investments.reduce((total, item) => total + item.investedCost, 0);
  const pendingAllocation = investments.reduce(
    (total, item) => total + (item.vehicleAllocation?.pendingAmount ?? 0),
    0,
  );
  const totalProjectedValue = investments.reduce(
    (total, item) => total + item.projection.projectedValue,
    0,
  );
  const currentValueMultiple = totalProjectedValue / investedCost;
  return (
    <div className="lp-portal-shell">
      <h1 className="sr-only">Portfolio</h1>

      <dl className="lp-summary-grid lp-summary-grid--four" aria-label="Portfolio summary">
        <div className="lp-summary-metric--primary">
          <dt>
            <MetricLabel
              label="AUM"
              tooltipId="lp-aum-tooltip"
              description={`Recorded cost of all ${investments.length} positions, including ${currency(pendingAllocation)} of H256 still being allocated. Not a fair-value or regulatory AUM figure.`}
            />
          </dt>
          <dd>{currency(investedCost)}</dd>
        </div>
        <div className="lp-summary-metric--primary">
          <dt>
            <MetricLabel
              label="Projected"
              tooltipId="lp-nav-tooltip"
              description="Estimated gross value from latest comparable valuations; positions without one stay at cost. Not administrator-reported NAV; before fees, carry, taxes and dilution."
            />
          </dt>
          <dd>{currency(totalProjectedValue)}</dd>
        </div>
        <div>
          <dt>
            <MetricLabel
              label="Pending"
              tooltipId="lp-pending-allocation-tooltip"
              description={`${currency(pendingAllocation)} of H256 being finalized between Atoms and Applied Intuition. Held at cost in AUM and Projected until deployed.`}
            />
          </dt>
          <dd>{currency(pendingAllocation)}</dd>
        </div>
        <div>
          <dt>
            <MetricLabel
              label="Multiple"
              tooltipId="lp-gross-value-multiple-tooltip"
              description={`Projected ÷ AUM: ${currency(totalProjectedValue)} ÷ ${currency(investedCost)}. Gross estimate.`}
            />
          </dt>
          <dd>{currentValueMultiple.toFixed(2)}×</dd>
        </div>
      </dl>

      {section === "investments" && (
        <LpAllocationDonut
          positionCount={investments.length}
          views={[
            { key: "company", label: "By company", slices: companySlices(investments) },
            {
              key: "sector",
              label: "By sector",
              slices: LETTER_ALLOCATION.map(({ key, label, amount }) => ({ key, label, amount })),
            },
          ]}
        />
      )}

      <nav className="lp-portfolio-tabs" aria-label="Portfolio sections">
        <Link
          href="/lp"
          aria-current={section === "investments" ? "page" : undefined}
        >
          Investments
        </Link>
        <Link
          href="/lp?section=analysis"
          aria-current={section === "analysis" ? "page" : undefined}
        >
          Insights
        </Link>
        <Link
          href="/lp?section=performance"
          aria-current={section === "performance" ? "page" : undefined}
        >
          Performance
        </Link>
        <Link href="/lp?section=updates" aria-current={section === "updates" ? "page" : undefined}>
          Company updates
        </Link>
      </nav>

      {section === "investments" && (
        <LpPortfolioTable investments={investments} query={value("query")} />
      )}
      {section === "analysis" && (
        <div className="lp-portfolio-analysis">
          <LpPortfolioInsights />
        </div>
      )}
      {section === "performance" && (
        <div className="lp-portfolio-analysis">
          <LpPortfolioPerformance />
        </div>
      )}
      {section === "updates" && <LpCompanyUpdates investments={investments} />}

      <footer className="lp-portal-footer">
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
