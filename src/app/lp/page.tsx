import type { Metadata } from "next";
import { LpPortfolioTable, type LpTableSort } from "@/components/lp-portfolio-table";
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
  const sort: LpTableSort = ["chronology", "company", "investedCost", "investmentDate"].includes(requestedSort || "")
    ? requestedSort as LpTableSort
    : "chronology";
  const view = {
    query: value("query"),
    sort,
    direction: value("direction") === "asc" ? "asc" as const : "desc" as const,
  };
  const snapshot = getLpSnapshot();
  const investedCost = investments.reduce((total, item) => total + item.investedCost, 0);
  const uniqueCompanies = new Set(investments.map((item) => item.company.toLocaleLowerCase())).size;
  const sourceDate = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles",
  }).format(new Date(snapshot.sourceModifiedAt));

  return (
    <div className="lp-portal-shell">
      <h1 className="sr-only">Portfolio</h1>

      <dl className="lp-summary-grid" aria-label="Portfolio summary">
        <div><dt>Invested cost</dt><dd>{currency(investedCost)}</dd></div>
        <div><dt>Companies</dt><dd>{uniqueCompanies}</dd></div>
        <div><dt>As of</dt><dd>{sourceDate}</dd></div>
      </dl>

      <div className="lp-disclosure">
        <p>
          Cost basis and entry terms from the Schedule of Investments. Current value and
          performance are shown only after approval.
        </p>
      </div>

      <LpPortfolioTable investments={investments} view={view} />

      <footer className="lp-portal-footer">
        <span>{snapshot.source} · Updated {sourceDate}</span>
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
