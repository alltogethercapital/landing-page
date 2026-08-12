import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyContext, getLpInvestment } from "@/lib/lp-data";

export const metadata: Metadata = {
  title: "Investment detail — All Together Investor Portal",
  robots: { index: false, follow: false, nocache: true },
};

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

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default async function LpInvestmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investment = await getLpInvestment(id);
  if (!investment) notFound();
  const context = getCompanyContext(investment.company);

  return (
    <div className="lp-portal-shell lp-detail-shell">
      <Link href="/lp" className="lp-back-link">← Portfolio</Link>

      <header className="lp-detail-hero">
        <div className="lp-detail-logo">
          {investment.logo ? (
            <Image src={investment.logo} alt="" width={280} height={100} unoptimized />
          ) : (
            <span>{initials(investment.company)}</span>
          )}
        </div>
        <div className="lp-detail-heading">
          <p className="lp-eyebrow">Investment {String(investment.chronology).padStart(2, "0")}</p>
          <h1>{investment.company}</h1>
          <p>{investment.description || context?.description || "Portfolio investment."}</p>
          <div className="lp-detail-tags">
            {context?.sectors.map((sector) => <span key={sector}>{sector}</span>)}
            <span>{investment.platform}</span>
            <span>{investment.instrument}</span>
          </div>
        </div>
        <div className={`lp-detail-status lp-detail-status--${investment.reviewStatus}`}>
          <span />
          {investment.reviewStatus === "verified"
            ? "Source verified"
            : investment.reviewStatus === "pending"
              ? "Pending acceptance"
              : "Needs review"}
        </div>
      </header>

      {investment.reviewNote && (
        <aside className={`lp-review-note lp-review-note--${investment.reviewStatus}`}>
          <p className="lp-eyebrow">Data status</p>
          <strong>{investment.reviewNote}</strong>
        </aside>
      )}

      <section className="lp-detail-facts" aria-label="Investment facts">
        <article><p>Invested cost</p><strong>{currency(investment.investedCost)}</strong><span>Recorded cost basis</span></article>
        <article><p>Investment date</p><strong>{date(investment.investmentDate)}</strong><span>Initial recorded close</span></article>
        <article><p>Round</p><strong>{investment.round}</strong><span>{investment.instrument}</span></article>
        <article><p>Entry valuation</p><strong>{investment.entryValuation}</strong><span>As recorded at investment</span></article>
      </section>

      <section className="lp-detail-grid">
        <article className="lp-detail-card">
          <div className="lp-detail-card-head"><p className="lp-eyebrow">Investment activity</p><span>1 event</span></div>
          <div className="lp-timeline">
            <span className="lp-timeline-dot" />
            <div>
              <time dateTime={investment.investmentDate}>{date(investment.investmentDate)}</time>
              <strong>Initial investment recorded</strong>
              <p>{currency(investment.investedCost)} via {investment.platform} · {investment.instrument}</p>
            </div>
          </div>
        </article>

        <article className="lp-detail-card">
          <div className="lp-detail-card-head"><p className="lp-eyebrow">Source & freshness</p><span>Drive</span></div>
          <dl className="lp-source-list">
            <div><dt>Primary source</dt><dd>Schedule of Investments</dd></div>
            <div><dt>Closing folder</dt><dd>Matched</dd></div>
            <div><dt>Source modified</dt><dd>Aug 12, 2026</dd></div>
            <div><dt>Publication state</dt><dd>{investment.reviewStatus === "verified" ? "Included" : "Flagged"}</dd></div>
          </dl>
        </article>
      </section>

      <section className="lp-value-placeholder">
        <div>
          <p className="lp-eyebrow">Current value</p>
          <h2>Awaiting approved valuation data.</h2>
        </div>
        <p>
          Current fair value, ownership, proceeds, and performance metrics will appear here
          after the fund administrator and valuation owner approve the underlying data.
        </p>
      </section>

      <footer className="lp-portal-footer">
        <span>All Together · Investor portal</span>
        <span>Private and confidential · Preliminary staging view</span>
      </footer>
    </div>
  );
}
