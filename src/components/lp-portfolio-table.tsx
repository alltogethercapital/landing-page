import Image from "next/image";
import Link from "next/link";
import type { LpInvestmentDto } from "@/lib/lp-data";

export type LpTableSort = "chronology" | "company" | "investedCost" | "investmentDate";

export type LpTableView = {
  query?: string;
  sort?: LpTableSort;
  direction?: "asc" | "desc";
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function sortHref(view: LpTableView, key: LpTableSort) {
  const params = new URLSearchParams();
  if (view.query) params.set("query", view.query);
  params.set("sort", key);
  params.set("direction", view.sort === key && view.direction !== "asc" ? "asc" : "desc");
  return `/lp?${params}`;
}

export function LpPortfolioTable({
  investments,
  view,
}: {
  investments: LpInvestmentDto[];
  view: LpTableView;
}) {
  const query = view.query?.trim() || "";
  const sort = view.sort || "chronology";
  const ascending = view.direction === "asc";
  const normalizedQuery = query.toLocaleLowerCase();
  const filtered = investments
    .filter((investment) => {
      const matchesQuery =
        !normalizedQuery ||
        [investment.company, investment.round, investment.instrument, investment.platform]
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      return matchesQuery;
    })
    .sort((left, right) => {
      const direction = ascending ? 1 : -1;
      if (sort === "investedCost" || sort === "chronology") {
        return (left[sort] - right[sort]) * direction;
      }
      return left[sort].localeCompare(right[sort]) * direction;
    });

  function sortLabel(key: LpTableSort, label: string) {
    return `${label}${sort === key ? (ascending ? " ↑" : " ↓") : ""}`;
  }

  return (
    <section className="lp-portfolio-section" aria-labelledby="lp-portfolio-heading">
      <div className="lp-table-heading">
        <h2 id="lp-portfolio-heading">Investments</h2>
        <p>{filtered.length} of {investments.length} records</p>
      </div>

      <form className="lp-table-controls" action="/lp" method="get">
        <label>
          <span className="sr-only">Search investments</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.4 15.4 4.1 4.1" /></svg>
          <input
            name="query"
            type="search"
            placeholder="Search investments…"
            defaultValue={query}
          />
        </label>
        <button type="submit" className="lp-filter-submit">Search</button>
      </form>

      <div className="lp-table-wrap">
        <table className="lp-portfolio-table">
          <thead>
            <tr>
              <th scope="col"><Link href={sortHref(view, "company")}>{sortLabel("company", "Company")}</Link></th>
              <th scope="col"><Link href={sortHref(view, "investmentDate")}>{sortLabel("investmentDate", "Invested")}</Link></th>
              <th scope="col">Round</th>
              <th scope="col">Instrument</th>
              <th scope="col">Entry valuation</th>
              <th scope="col" className="is-number"><Link href={sortHref(view, "investedCost")}>{sortLabel("investedCost", "Cost")}</Link></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((investment) => (
              <tr key={investment.id} data-status={investment.reviewStatus}>
                <td>
                  <Link href={`/lp/investments/${investment.id}`} className="lp-company-cell" aria-label={`View ${investment.company}`}>
                    <span className={`lp-company-logo${investment.logoTreatment === "inverse" ? " lp-logo--inverse" : ""}`}>
                      <Image src={investment.logo} alt="" width={92} height={36} unoptimized />
                    </span>
                    <span className="lp-company-name">
                      <strong>{investment.company}</strong>
                      <small>
                        {investment.platform}
                        {investment.reviewStatus !== "verified" && (
                          <span className={`lp-status lp-status--${investment.reviewStatus}`}>
                            {investment.reviewStatus === "pending" ? "Pending" : "Review"}
                          </span>
                        )}
                      </small>
                    </span>
                  </Link>
                </td>
                <td className="lp-date-cell">{formatDate(investment.investmentDate)}</td>
                <td>{investment.round}</td>
                <td>{investment.instrument}</td>
                <td>{investment.entryValuation}</td>
                <td className="is-number">{formatCurrency(investment.investedCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="lp-table-empty">
            <p>No investments match this view.</p>
            <Link href="/lp">Clear search</Link>
          </div>
        )}
      </div>

      <div className="lp-portfolio-mobile" aria-label="Investment records">
        {filtered.map((investment) => (
          <article key={investment.id} data-status={investment.reviewStatus}>
            <Link
              href={`/lp/investments/${investment.id}`}
              className="lp-mobile-investment-link"
              aria-label={`View ${investment.company}`}
            >
              <span className="lp-mobile-investment-head">
                <span className={`lp-company-logo${investment.logoTreatment === "inverse" ? " lp-logo--inverse" : ""}`}>
                  <Image src={investment.logo} alt="" width={92} height={36} unoptimized />
                </span>
                <span className="lp-mobile-investment-title">
                  <strong>{investment.company}</strong>
                  <small>
                    {investment.platform}
                    {investment.reviewStatus !== "verified" && (
                      <span className={`lp-status lp-status--${investment.reviewStatus}`}>
                        {investment.reviewStatus === "pending" ? "Pending" : "Review"}
                      </span>
                    )}
                  </small>
                </span>
                <span className="lp-mobile-investment-arrow" aria-hidden="true">→</span>
              </span>
              <dl className="lp-mobile-investment-facts">
                <div><dt>Invested</dt><dd>{formatDate(investment.investmentDate)}</dd></div>
                <div><dt>Cost</dt><dd>{formatCurrency(investment.investedCost)}</dd></div>
                <div><dt>Round</dt><dd>{investment.round}</dd></div>
                <div><dt>Entry valuation</dt><dd>{investment.entryValuation}</dd></div>
              </dl>
            </Link>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="lp-table-empty">
            <p>No investments match this view.</p>
            <Link href="/lp">Clear search</Link>
          </div>
        )}
      </div>
    </section>
  );
}
