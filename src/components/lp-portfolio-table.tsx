import type { ReactNode } from "react";
import Link from "next/link";
import type { LpInvestmentDto } from "@/lib/lp-data";

type CompanyAllocationRow = {
  id: string;
  label: string;
  amount: number;
  detail?: ReactNode;
  href: string;
  searchText: string;
};

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
        href: `/lp/investments/${investment.id}`,
        searchText: allocation.deployedCompany.toLocaleLowerCase(),
        positionCount: 1,
      });
      rows.set(`${investment.id}-pending`, {
        id: `${investment.id}-pending`,
        label: "Finalizing allocation",
        amount: allocation.pendingAmount,
        detail: (
          <>
            Will go to <Link href="/companies#applied-intuition">
              Applied Intuition<span className="lp-link-arrow" aria-hidden="true">↗</span>
            </Link>
            {" or "}
            <Link href="/lp/investments/41-atoms">
              Atoms<span className="lp-link-arrow" aria-hidden="true">↗</span>
            </Link>
          </>
        ),
        href: `/lp/investments/${investment.id}`,
        searchText: "finalizing allocation Atoms Applied Intuition",
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

export function LpPortfolioTable({
  investments,
  query,
}: {
  investments: LpInvestmentDto[];
  query?: string;
}) {
  const normalizedQuery = query?.trim().toLocaleLowerCase() || "";
  const companyAllocationRows = buildCompanyAllocationRows(investments);
  const filteredCompanyAllocationRows = normalizedQuery
    ? companyAllocationRows.filter((row) => row.searchText.includes(normalizedQuery))
    : companyAllocationRows;
  const totalCapital = investments.reduce((sum, investment) => sum + investment.investedCost, 0);
  const allocationScale = companyAllocationRows[0]?.amount || 1;

  return (
    <section className="lp-portfolio-section" aria-labelledby="lp-portfolio-heading">
      <h2 id="lp-portfolio-heading" className="sr-only">Investments</h2>
      <section className="lp-company-allocation-view" aria-label="Investments by company">
        <div className="lp-company-allocation-head" aria-hidden="true">
          <span>Company</span>
          <span>Amount</span>
          <span>AUM share</span>
        </div>
        {filteredCompanyAllocationRows.length > 0 ? (
          <div className="lp-figure-bars" role="list" aria-label="Allocation by company across total capital">
            {filteredCompanyAllocationRows.map((row) => (
              <div
                key={row.id}
                className="lp-figure-bar-row"
                role="listitem"
                aria-label={`${row.label}: ${formatWholeCurrency(row.amount)}, ${formatPercent(row.amount / totalCapital)} of total capital`}
              >
                <span className="lp-figure-bar-label">
                  <Link href={row.href}>
                    {row.label}<span className="lp-link-arrow" aria-hidden="true">↗</span>
                  </Link>
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
            <Link href="/lp">
              Clear search<span className="lp-link-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </section>
    </section>
  );
}
