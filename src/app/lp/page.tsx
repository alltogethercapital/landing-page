import type { Metadata } from "next";
import Link from "next/link";
import { LpLetterFigures } from "@/components/lp-letter-figures";
import {
  LpPortfolioTable,
  type LpPortfolioDisplay,
  type LpTableSort,
} from "@/components/lp-portfolio-table";
import { getLpPortfolio, getLpSnapshot } from "@/lib/lp-data";

type LpPortfolioPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: LpPortfolioPageProps): Promise<Metadata> {
  const params = await searchParams;
  return {
    title: params.section === "analysis" ? "Insights" : "Portfolio",
    robots: { index: false, follow: false, nocache: true },
  };
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function MetricTerm({
  label,
  description,
  tooltipId,
}: {
  label: string;
  description: string;
  tooltipId: string;
}) {
  return (
    <span className="lp-summary-term" tabIndex={0} aria-describedby={tooltipId}>
      <abbr>{label}</abbr>
      <span className="lp-summary-tooltip" id={tooltipId} role="tooltip">
        {description}
      </span>
    </span>
  );
}

export default async function LpPortfolioPage({ searchParams }: LpPortfolioPageProps) {
  const [investments, params] = await Promise.all([getLpPortfolio(), searchParams]);
  const value = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
  const requestedSort = value("sort");
  const section = value("section") === "analysis" ? "analysis" : "investments";
  const display: LpPortfolioDisplay = value("display") === "positions" ? "positions" : "companies";
  const sort: LpTableSort = ["chronology", "company", "investedCost", "investmentDate"].includes(requestedSort || "")
    ? requestedSort as LpTableSort
    : "chronology";
  const view = {
    query: value("query"),
    sort,
    direction: value("direction") === "asc" ? "asc" as const : "desc" as const,
    display,
  };
  const snapshot = getLpSnapshot();
  const investedCost = investments.reduce((total, item) => total + item.investedCost, 0);
  const notYetAllocated = investments.reduce(
    (total, item) => total + (item.vehicleAllocation?.pendingAmount ?? 0),
    0,
  );
  const totalProjectedValue = investments.reduce(
    (total, item) => total + item.projection.projectedValue,
    0,
  );
  const currentValueMultiple = totalProjectedValue / investedCost;
  const sourceDate = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles",
  }).format(new Date(snapshot.sourceModifiedAt));

  return (
    <div className="lp-portal-shell">
      <h1 className="sr-only">Portfolio</h1>

      <dl className="lp-summary-grid lp-summary-grid--four" aria-label="Portfolio summary">
        <div className="lp-summary-metric--primary">
          <dt>
            <MetricTerm
              label="AUM"
              tooltipId="lp-aum-tooltip"
              description={`Assets under management (AUM), shown at recorded cost: all ${investments.length} legal positions in the Schedule of Investments, including ${currency(notYetAllocated)} in H256 awaiting underlying allocation. This is not a fair-value or regulatory AUM calculation.`}
            />
            <span> · at cost</span>
          </dt>
          <dd>{currency(investedCost)}</dd>
        </div>
        <div className="lp-summary-metric--primary">
          <dt>
            Projected{" "}
            <MetricTerm
              label="NAV"
              tooltipId="lp-nav-tooltip"
              description={`Net asset value (NAV) is assets minus liabilities. This projected NAV includes H256's pending ${currency(notYetAllocated)} at cost and assumes no fund liabilities or other deductions. It is a gross scenario estimate, not administrator-reported NAV.`}
            />
          </dt>
          <dd>{currency(totalProjectedValue)}</dd>
        </div>
        <div><dt>Pending allocation</dt><dd>{currency(notYetAllocated)}</dd></div>
        <div><dt>Gross value multiple</dt><dd>{currentValueMultiple.toFixed(2)}×</dd></div>
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
      </nav>

      {section === "investments" ? (
        <LpPortfolioTable investments={investments} view={view} />
      ) : (
        <div className="lp-portfolio-analysis">
          <LpLetterFigures />
        </div>
      )}

      <footer className="lp-portal-footer">
        <span>{snapshot.source} · Updated {sourceDate}</span>
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
