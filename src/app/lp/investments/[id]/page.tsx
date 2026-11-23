import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UIIcon } from "@/components/icons";
import { LP_COMPANY_REVIEW_AS_OF } from "@/data/lp-company-updates";
import { getCompanyContext, getLpInvestment, getLpSnapshot } from "@/lib/lp-data";
import { pageTitle } from "@/lib/page-metadata";
import { LpCompanyDetailView } from "@/components/lp-company-detail";
import { getLpCompanyDetail } from "@/lib/lp-company-detail";
import { lpCompanyKey, lpCompanySlug } from "@/lib/lp-company-key";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const investment = await getLpInvestment(id);

  return {
    title: pageTitle(investment?.company ?? "Investment Detail"),
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
  const companyDetail = await getLpCompanyDetail(lpCompanySlug(lpCompanyKey(investment)));

  return (
    <div className="lp-portal-shell lp-detail-shell">
      <Link href="/lp" className="lp-back-link"><UIIcon name="arrow-left" /> Portfolio</Link>

      <header className="lp-detail-hero">
        <div className={`lp-detail-logo${investment.logoTreatment === "inverse" ? " lp-logo--inverse" : ""}`}>
          <Image src={investment.logo} alt="" width={280} height={100} unoptimized />
        </div>
        <div className="lp-detail-heading">
          <h1 className="sr-only">{investment.company}</h1>
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
              Company website <UIIcon name="arrow-up-right" />
            </a>
          )}
        </div>
      </header>

      <dl className="lp-detail-facts" aria-label="Investment facts">
        <div><dt>Amount invested</dt><dd>{investment.gift ? "Gift" : currency(investment.investedCost)}</dd></div>
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
                Finalizing allocation · {wholePercent(investment.vehicleAllocation.awaitingShare)} of
                the vehicle · Atoms or Applied Intuition
              </span>
            </div>
          </div>
        </section>
      ) : null}

      <section className="lp-company-update lp-company-update--detail" aria-labelledby="lp-company-update-heading">
        <header>
          <h2 id="lp-company-update-heading">Company update</h2>
          <span>Reviewed {date(LP_COMPANY_REVIEW_AS_OF)}</span>
        </header>
        <h3>{investment.companyUpdate.headline}</h3>
        {investment.companyUpdate.sourceDate && <p className="lp-company-update-date">Source date: {date(investment.companyUpdate.sourceDate)}</p>}
        <p>{investment.companyUpdate.summary}</p>
        <a className="lp-company-update-source" href={investment.companyUpdate.sourceUrl} target="_blank" rel="noreferrer">{investment.companyUpdate.source} ↗</a>
      </section>

      <section className="lp-performance" aria-labelledby="lp-performance-heading">
        <header>
          <h2 id="lp-performance-heading">Position</h2>
          <span>Projection as of {date(snapshot.projectionAsOf)}</span>
        </header>
        <dl>
          <div>
            <dt>Projected value</dt>
            <dd>{currency(projection.projectedValue)}</dd>
          </div>
          <div>
            <dt>Valuation reference</dt>
            <dd>{projection.latestCompanyValuation}</dd>
            {projection.basis !== "cost" && <small>As of {date(projection.valuationAsOf)}</small>}
          </div>
          <div>
            <dt>Distributions</dt>
            <dd>{currency(projection.distributions)}</dd>
          </div>
          <div>
            <dt>Current value multiple</dt>
            <dd>{projection.grossMultiple.toFixed(2)}×</dd>
          </div>
        </dl>
        <p className="lp-projection-source">
          Source: {projection.source}
          {projection.sourceUrl && (
            <> · <a href={projection.sourceUrl} target="_blank" rel="noreferrer">View source <UIIcon name="arrow-up-right" /></a></>
          )}
        </p>
      </section>

      {companyDetail ? (
        <section className="lp-cd-page" aria-label="Company history">
          <LpCompanyDetailView detail={companyDetail} headingId="lp-company-history-title" showPosition={false} />
        </section>
      ) : null}

      <footer className="lp-portal-footer">
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
