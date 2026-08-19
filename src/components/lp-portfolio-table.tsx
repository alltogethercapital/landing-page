"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LpInvestmentDto } from "@/lib/lp-data";

export type LpTableSort = "chronology" | "company" | "investedCost" | "investmentDate";
export type LpPortfolioDisplay = "positions" | "companies";

export type LpTableView = {
  query?: string;
  sort?: LpTableSort;
  direction?: "asc" | "desc";
  display?: LpPortfolioDisplay;
};

type CompanyAllocationRow = {
  id: string;
  label: string;
  amount: number;
  detail?: string;
  href: string;
  searchText: string;
};

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

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

function formatWholePercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatWholeCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildCompanyAllocationRows(investments: LpInvestmentDto[]): CompanyAllocationRow[] {
  const rows = new Map<string, CompanyAllocationRow & { positionCount: number }>();

  for (const investment of investments) {
    if (investment.vehicleAllocation) {
      const allocation = investment.vehicleAllocation;
      rows.set(`${investment.id}-deployed`, {
        id: `${investment.id}-deployed`,
        label: allocation.deployedCompany,
        amount: allocation.deployedAmount,
        detail: `Through H256 · ${formatWholePercent(allocation.deployedShare)} of vehicle`,
        href: `/lp/investments/${investment.id}`,
        searchText: `${allocation.deployedCompany} H256 deployed`.toLocaleLowerCase(),
        positionCount: 1,
      });
      rows.set(`${investment.id}-pending`, {
        id: `${investment.id}-pending`,
        label: "Not yet allocated",
        amount: allocation.pendingAmount,
        detail: `H256 · ${formatWholePercent(allocation.awaitingShare)} of vehicle`,
        href: `/lp/investments/${investment.id}`,
        searchText: "H256 not yet allocated pending allocation not yet deployed",
        positionCount: 1,
      });
      continue;
    }

    const key = investment.company.toLocaleLowerCase();
    const existing = rows.get(key);
    if (existing) {
      existing.amount += investment.investedCost;
      existing.positionCount += 1;
      existing.detail = `${existing.positionCount} positions`;
      existing.href = `/lp?query=${encodeURIComponent(investment.company)}`;
      existing.searchText += ` ${investment.round} ${investment.investmentDate}`.toLocaleLowerCase();
      continue;
    }

    rows.set(key, {
      id: investment.id,
      label: investment.company,
      amount: investment.investedCost,
      href: `/lp/investments/${investment.id}`,
      searchText: `${investment.company} ${investment.round} ${investment.investmentDate}`.toLocaleLowerCase(),
      positionCount: 1,
    });
  }

  return [...rows.values()]
    .map((row) => ({
      id: row.id,
      label: row.label,
      amount: row.amount,
      detail: row.detail,
      href: row.href,
      searchText: row.searchText,
    }))
    .sort((left, right) => right.amount - left.amount || left.label.localeCompare(right.label));
}

function sortHref(view: LpTableView, key: LpTableSort) {
  const params = new URLSearchParams();
  if (view.query) params.set("query", view.query);
  if (view.display) params.set("display", view.display);
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
  const [query, setQuery] = useState(view.query?.trim() || "");
  const [display, setDisplay] = useState<LpPortfolioDisplay>(view.display || "companies");
  const isInteractive = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const sort = view.sort || "chronology";
  const ascending = view.direction === "asc";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = investments
    .filter((investment) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          investment.company,
          investment.round,
          investment.investmentAccess,
          investment.ownershipType,
          investment.valuationWhenInvested,
          investment.vehicleAllocation?.deployedCompany,
        ]
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
  const companyAllocationRows = buildCompanyAllocationRows(investments);
  const filteredCompanyAllocationRows = normalizedQuery
    ? companyAllocationRows.filter((row) => row.searchText.includes(normalizedQuery))
    : companyAllocationRows;
  const totalCapital = investments.reduce((sum, investment) => sum + investment.investedCost, 0);
  const allocationScale = companyAllocationRows[0]?.amount || 1;
  function sortLabel(key: LpTableSort, label: string) {
    return `${label}${sort === key ? (ascending ? " ↑" : " ↓") : ""}`;
  }

  return (
    <section className="lp-portfolio-section" aria-labelledby="lp-portfolio-heading">
      <div className="lp-table-heading">
        <h2 id="lp-portfolio-heading">Investments</h2>
        <div className="lp-portfolio-view-switch" role="group" aria-label="Investment view">
          <button
            type="button"
            disabled={!isInteractive}
            aria-pressed={display === "companies"}
            onClick={() => setDisplay("companies")}
          >
            Graph view
          </button>
          <button
            type="button"
            disabled={!isInteractive}
            aria-pressed={display === "positions"}
            onClick={() => setDisplay("positions")}
          >
            Table view
          </button>
        </div>
      </div>

      <form className="lp-table-controls" action="/lp" method="get">
        <input type="hidden" name="display" value={display} />
        <label>
          <span className="sr-only">Search investments</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.4 15.4 4.1 4.1" /></svg>
          <input
            name="query"
            type="search"
            placeholder="Search investments…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button type="submit" className="lp-filter-submit">Search</button>
      </form>

      {display === "positions" ? (
        <>
          <div className="lp-table-wrap">
            <table className="lp-portfolio-table">
              <thead>
                <tr>
                  <th scope="col"><Link href={sortHref({ ...view, query, display }, "company")}>{sortLabel("company", "Company")}</Link></th>
                  <th scope="col"><Link href={sortHref({ ...view, query, display }, "investmentDate")}>{sortLabel("investmentDate", "Date invested")}</Link></th>
                  <th scope="col">Round</th>
                  <th scope="col">Ownership</th>
                  <th scope="col">Valuation when invested</th>
                  <th scope="col" className="is-number"><Link href={sortHref({ ...view, query, display }, "investedCost")}>{sortLabel("investedCost", "Amount invested")}</Link></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((investment) => (
                  <tr key={investment.id}>
                    <td>
                      <Link href={`/lp/investments/${investment.id}`} className="lp-company-cell" aria-label={`View ${investment.company}`}>
                        <span className={`lp-company-logo${investment.logoTreatment === "inverse" ? " lp-logo--inverse" : ""}`}>
                          <Image src={investment.logo} alt="" width={92} height={36} unoptimized />
                        </span>
                        <span className="lp-company-name">
                          <strong>{investment.company}</strong>
                          <small>
                            {investment.investmentAccess}
                          </small>
                          {investment.vehicleAllocation ? (
                            <small className="lp-company-allocation">
                              {formatCurrency(investment.vehicleAllocation.deployedAmount)} to {investment.vehicleAllocation.deployedCompany}
                              {" in its "}{investment.vehicleAllocation.deployedRound}
                              {" ("}{formatWholePercent(investment.vehicleAllocation.deployedShare)})
                              {" · "}{formatCurrency(investment.vehicleAllocation.pendingAmount)} not yet allocated
                              {" ("}{formatWholePercent(investment.vehicleAllocation.awaitingShare)})
                            </small>
                          ) : null}
                        </span>
                      </Link>
                    </td>
                    <td className="lp-date-cell">{formatDate(investment.investmentDate)}</td>
                    <td>{investment.round}</td>
                    <td>{investment.ownershipType}</td>
                    <td>{investment.valuationWhenInvested}</td>
                    <td className="is-number">{formatCurrency(investment.investedCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <div className="lp-table-empty">
                <p>No investments match this view.</p>
                <Link href="/lp?display=positions" onClick={() => setQuery("")}>Clear search</Link>
              </div>
            ) : null}
          </div>

          <div className="lp-portfolio-mobile" aria-label="Investment records">
            {filtered.map((investment) => (
              <article key={investment.id}>
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
                        {investment.investmentAccess} · {investment.ownershipType}
                      </small>
                      {investment.vehicleAllocation ? (
                        <small className="lp-company-allocation">
                          {formatCurrency(investment.vehicleAllocation.deployedAmount)} to {investment.vehicleAllocation.deployedCompany}
                          {" in its "}{investment.vehicleAllocation.deployedRound}
                          {" ("}{formatWholePercent(investment.vehicleAllocation.deployedShare)})
                          {" · "}{formatCurrency(investment.vehicleAllocation.pendingAmount)} not yet allocated
                          {" ("}{formatWholePercent(investment.vehicleAllocation.awaitingShare)})
                        </small>
                      ) : null}
                    </span>
                    <span className="lp-mobile-investment-arrow" aria-hidden="true">→</span>
                  </span>
                  <dl className="lp-mobile-investment-facts">
                    <div><dt>Date invested</dt><dd>{formatDate(investment.investmentDate)}</dd></div>
                    <div><dt>Amount invested</dt><dd>{formatCurrency(investment.investedCost)}</dd></div>
                    <div><dt>Round</dt><dd>{investment.round}</dd></div>
                    <div><dt>Valuation when invested</dt><dd>{investment.valuationWhenInvested}</dd></div>
                  </dl>
                </Link>
              </article>
            ))}
            {filtered.length === 0 ? (
              <div className="lp-table-empty">
                <p>No investments match this view.</p>
                <Link href="/lp" onClick={() => setQuery("")}>Clear search</Link>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <section className="lp-company-allocation-view" aria-label="Investments by company">
          {filteredCompanyAllocationRows.length > 0 ? (
            <div className="lp-figure-bars" role="list" aria-label="Allocation by company across total capital">
              {filteredCompanyAllocationRows.map((row, index) => (
                <div
                  key={row.id}
                  className={`lp-figure-bar-row${index === 0 && !normalizedQuery ? " is-lead" : ""}`}
                  role="listitem"
                  aria-label={`${row.label}: ${formatWholeCurrency(row.amount)}, ${formatPercent(row.amount / totalCapital)} of total capital`}
                >
                  <span className="lp-figure-bar-label">
                    <Link href={row.href}>{row.label}</Link>
                    {row.detail ? <small>{row.detail}</small> : null}
                  </span>
                  <span className="lp-figure-bar-track" aria-hidden="true">
                    <span
                      className="lp-figure-bar-fill"
                      style={{ inlineSize: `${(row.amount / allocationScale) * 80}%` }}
                    />
                    <span className="lp-figure-bar-amount">{formatWholeCurrency(row.amount)}</span>
                  </span>
                  <span className="lp-figure-bar-value">{formatPercent(row.amount / totalCapital)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="lp-table-empty">
              <p>No company allocations match this view.</p>
              <Link href="/lp?display=companies" onClick={() => setQuery("")}>Clear search</Link>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
