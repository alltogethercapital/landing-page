import type { Metadata } from "next";
import Link from "next/link";
import { LpLetterFigures } from "@/components/lp-letter-figures";
import {
  LpPortfolioTable,
  type LpPortfolioDisplay,
  type LpTableSort,
} from "@/components/lp-portfolio-table";
import { getLpPortfolio, getLpSnapshot } from "@/lib/lp-data";

export const metadata: Metadata = {
  title: "Portfolio — All Together Investor Portal",
  robots: { index: false, follow: false, nocache: true },
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function LpPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
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
  const projectedValue = investments.reduce((total, item) => total + item.projection.projectedValue, 0);
  const currentValueMultiple = projectedValue / investedCost;
  const sourceDate = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles",
  }).format(new Date(snapshot.sourceModifiedAt));

  return (
    <div className="lp-portal-shell">
      <h1 className="sr-only">Portfolio</h1>

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
          Portfolio analysis
        </Link>
      </nav>

      {section === "investments" ? (
        <>
          <dl className="lp-summary-grid" aria-label="Portfolio summary">
            <div><dt>Amount invested</dt><dd>{currency(investedCost)}</dd></div>
            <div><dt>Projected value</dt><dd>{currency(projectedValue)}</dd></div>
            <div><dt>Current value multiple</dt><dd>{currentValueMultiple.toFixed(2)}×</dd></div>
          </dl>

          <div className="lp-disclosure">
            <p>
              Projection as of {snapshot.projectionAsOf}: investments with a newer, sourced company
              valuation use that valuation; all others remain at the amount invested. This estimate
              is before fund fees, profit share, taxes, and future ownership dilution. It is not the
              fund&apos;s audited net asset value.
            </p>
          </div>

          <LpPortfolioTable investments={investments} view={view} />
        </>
      ) : (
        <div className="lp-portfolio-analysis">
          <LpLetterFigures
            grossValue={projectedValue}
            positionCount={investments.length}
          />
        </div>
      )}

      <footer className="lp-portal-footer">
        <span>{snapshot.source} · Updated {sourceDate}</span>
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
