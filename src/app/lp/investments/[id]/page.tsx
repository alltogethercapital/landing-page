import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyContext, getLpInvestment, getLpSnapshot } from "@/lib/lp-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const investment = await getLpInvestment(id);

  return {
    title: investment?.company ?? "Investment Detail",
    robots: { index: false, follow: false, nocache: true },
  };
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function date(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function wholePercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default async function LpInvestmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const investment = await getLpInvestment(id);
  if (!investment) notFound();
  const context = getCompanyContext(investment.company);
  const snapshot = getLpSnapshot();
  const projection = investment.projection;

  return (
    <div className="lp-portal-shell lp-detail-shell">
      <Link href="/lp" className="lp-back-link">← Portfolio</Link>

      <header className="lp-detail-hero">
        <div className={`lp-detail-logo${investment.logoTreatment === "inverse" ? " lp-logo--inverse" : ""}`}>
          <Image src={investment.logo} alt="" width={280} height={100} unoptimized />
        </div>
        <div className="lp-detail-heading">
          <h1>{investment.company}</h1>
          <p>{investment.description || context?.description || "Portfolio investment."}</p>
          <p className="lp-detail-meta">
            {investment.investmentAccess} · {investment.ownershipType}
          </p>
        </div>
        <div className="lp-detail-actions">
          {context?.website && (
            <a
              href={context.website}
              target="_blank"
              rel="noreferrer"
              className="lp-company-website"
              aria-label={`Visit ${investment.company} website`}
            >
              Company website <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </header>

      <dl className="lp-detail-facts" aria-label="Investment facts">
        <div><dt>Amount invested</dt><dd>{currency(investment.investedCost)}</dd></div>
        <div><dt>Investment date</dt><dd>{date(investment.investmentDate)}</dd></div>
        <div><dt>Round</dt><dd>{investment.round}</dd></div>
        <div><dt>Company valuation when invested</dt><dd>{investment.valuationWhenInvested}</dd></div>
      </dl>

      {investment.vehicleAllocation ? (
        <section className="lp-vehicle-allocation" aria-labelledby="lp-vehicle-allocation-heading">
          <header>
            <h2 id="lp-vehicle-allocation-heading">Vehicle allocation</h2>
            <span>As of {date(investment.vehicleAllocation.asOf)}</span>
          </header>
          <div className="lp-vehicle-allocation-grid">
            <div>
              <strong>{currency(investment.vehicleAllocation.deployedAmount)}</strong>
              <span>
                {wholePercent(investment.vehicleAllocation.deployedShare)} deployed to{" "}
                {investment.vehicleAllocation.deployedCompany} in its{" "}
                {investment.vehicleAllocation.deployedRound}
              </span>
            </div>
            <div>
              <strong>{currency(investment.vehicleAllocation.pendingAmount)}</strong>
              <span>
                {wholePercent(investment.vehicleAllocation.awaitingShare)} not yet allocated to an
                underlying company
              </span>
            </div>
          </div>
          <p>
            This {currency(investment.investedCost)} vehicle investment remains one legal portfolio
            position. The remaining {currency(investment.vehicleAllocation.pendingAmount)} has not
            yet been allocated or deployed to an underlying company.
          </p>
        </section>
      ) : null}

      <section className="lp-performance" aria-labelledby="lp-performance-heading">
        <header>
          <h2 id="lp-performance-heading">Position</h2>
          <span>Projection as of {date(snapshot.projectionAsOf)}</span>
        </header>
        <dl>
          <div>
            <dt>Projected value</dt>
            <dd>{currency(projection.projectedValue)}</dd>
            <small>
              {projection.basis === "cost"
                ? "Held at invested cost"
                : projection.basis === "assumption"
                  ? "Based on a stated scenario assumption"
                  : "Based on valuation reference"}
            </small>
          </div>
          <div>
            <dt>Latest company valuation</dt>
            <dd>{projection.latestCompanyValuation}</dd>
            <small>
              {projection.basis === "cost"
                ? "Entry terms; no newer comparable mark"
                : `${projection.basis === "assumption" ? "Scenario" : "As of"} ${date(projection.valuationAsOf)}`}
            </small>
          </div>
          <div>
            <dt>Distributions</dt>
            <dd>{currency(projection.distributions)}</dd>
            <small>Assumed in this projection</small>
          </div>
          <div>
            <dt>Current value multiple</dt>
            <dd>{projection.grossMultiple.toFixed(2)}×</dd>
            <small>Before fund fees, profit share, taxes, and ownership dilution</small>
          </div>
        </dl>
        <p className="lp-projection-source">
          Estimate based on: {projection.source}
          {projection.sourceUrl && (
            <> · <a href={projection.sourceUrl} target="_blank" rel="noreferrer">View source ↗</a></>
          )}
          . This is an unaudited estimate, not the fund&apos;s official net asset value.
        </p>
      </section>

      <footer className="lp-portal-footer">
        <span>{snapshot.source}</span>
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
