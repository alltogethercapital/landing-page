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
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function LpPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const investments = await getLpPortfolio();
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
  const requestedSort = value("sort");
  const sort: LpTableSort = ["chronology", "company", "investedCost", "investmentDate"].includes(requestedSort || "")
    ? requestedSort as LpTableSort
    : "chronology";
  const view = {
    query: value("query"),
    platform: value("platform"),
    sort,
    direction: value("direction") === "asc" ? "asc" as const : "desc" as const,
  };
  const snapshot = getLpSnapshot();
  const investedCost = investments.reduce((total, item) => total + item.investedCost, 0);
  const uniqueCompanies = new Set(investments.map((item) => item.company.toLocaleLowerCase())).size;
  const pending = investments.filter((item) => item.reviewStatus !== "verified").length;

  return (
    <div className="lp-portal-shell">
      <h1 className="sr-only">Portfolio</h1>

      <section className="lp-summary-grid" aria-label="Portfolio summary">
        <article>
          <p>Invested cost</p>
          <strong>{currency(investedCost)}</strong>
          <span>Across all recorded investments</span>
        </article>
        <article>
          <p>Portfolio companies</p>
          <strong>{uniqueCompanies}</strong>
          <span>{investments.length} investment records</span>
        </article>
        <article>
          <p>Latest investment</p>
          <strong>Aug 12</strong>
          <span>Blue Origin · pending acceptance</span>
        </article>
        <article>
          <p>Items to review</p>
          <strong>{pending}</strong>
          <span>Excluded from approved reporting</span>
        </article>
      </section>

      <div className="lp-disclosure">
        <span>i</span>
        <p>
          This staging view reports invested cost and entry terms from the Drive schedule.
          It does not present current fair value, NAV, IRR, or LP capital accounts until
          those figures are supported by an approved accounting and valuation process. Source
          updated Aug 12, 2026 at 12:58 PM PT · {snapshot.status}.
        </p>
      </div>

      <LpPortfolioTable investments={investments} view={view} />

      <footer className="lp-portal-footer">
        <span>{snapshot.source}</span>
        <span>Private and confidential · Preliminary staging view</span>
      </footer>
    </div>
  );
}
