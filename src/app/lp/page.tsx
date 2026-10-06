import type { Metadata } from "next";
import Link from "next/link";
import {
  LpPortfolioInsights,
  LpPortfolioPerformance,
} from "@/components/lp-letter-figures";
import { LpPortfolioTable } from "@/components/lp-portfolio-table";
import { getLpPortfolio } from "@/lib/lp-data";

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
    title: section,
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
        <span className="lp-summary-info" aria-hidden="true">i</span>
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
              description={`Assets under management (AUM) at recorded cost: all ${investments.length} legal positions in the Schedule of Investments, including the ${currency(pendingAllocation)} H256 allocation being finalized between Atoms and Applied Intuition. This is not a fair-value or regulatory AUM calculation.`}
            />
          </dt>
          <dd>{currency(investedCost)}</dd>
        </div>
        <div className="lp-summary-metric--primary">
          <dt>
            <MetricLabel
              label="NAV"
              tooltipId="lp-nav-tooltip"
              description={`Net asset value (NAV) is assets minus liabilities. This projected NAV includes H256's ${currency(pendingAllocation)} allocation being finalized between Atoms and Applied Intuition at cost and assumes no fund liabilities or other deductions. It is a gross scenario estimate, not administrator-reported NAV.`}
            />
          </dt>
          <dd>{currency(totalProjectedValue)}</dd>
        </div>
        <div>
          <dt>
            <MetricLabel
              label="Finalizing allocation"
              tooltipId="lp-pending-allocation-tooltip"
              description={`The ${currency(pendingAllocation)} portion of H256 is being finalized between Atoms and Applied Intuition. It remains included at recorded cost in both AUM and projected NAV until the allocation is deployed.`}
            />
          </dt>
          <dd>{currency(pendingAllocation)}</dd>
        </div>
        <div>
          <dt>
            <MetricLabel
              label="Gross value multiple"
              tooltipId="lp-gross-value-multiple-tooltip"
              description={`Gross value multiple is projected NAV divided by AUM at recorded cost: ${currency(totalProjectedValue)} ÷ ${currency(investedCost)} = ${currentValueMultiple.toFixed(2)}×. It is before fees, carry, liabilities, and other deductions.`}
            />
          </dt>
          <dd>{currentValueMultiple.toFixed(2)}×</dd>
        </div>
      </dl>

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

      <footer className="lp-portal-footer">
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
