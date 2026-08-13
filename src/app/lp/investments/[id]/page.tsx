import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyContext, getLpInvestment, getLpSnapshot } from "@/lib/lp-data";

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

export default async function LpInvestmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investment = await getLpInvestment(id);
  if (!investment) notFound();
  const context = getCompanyContext(investment.company);
  const snapshot = getLpSnapshot();
  const performance = investment.performance;
  const grossMoic = performance
    ? (performance.currentValue + performance.distributions) / investment.investedCost
    : null;

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
          <p className="lp-detail-meta">{investment.platform} · {investment.instrument}</p>
        </div>
        {investment.reviewStatus !== "verified" && (
          <div className={`lp-detail-status lp-detail-status--${investment.reviewStatus}`}>
            <span />
            {investment.reviewStatus === "pending" ? "Pending acceptance" : "Needs review"}
          </div>
        )}
      </header>

      {investment.reviewNote && (
        <aside className={`lp-review-note lp-review-note--${investment.reviewStatus}`}>
          <p className="lp-eyebrow">Data status</p>
          <strong>{investment.reviewNote}</strong>
        </aside>
      )}

      <dl className="lp-detail-facts" aria-label="Investment facts">
        <div><dt>Invested cost</dt><dd>{currency(investment.investedCost)}</dd></div>
        <div><dt>Investment date</dt><dd>{date(investment.investmentDate)}</dd></div>
        <div><dt>Round</dt><dd>{investment.round}</dd></div>
        <div><dt>Entry valuation</dt><dd>{investment.entryValuation}</dd></div>
      </dl>

      <section className="lp-performance" aria-labelledby="lp-performance-heading">
        <header>
          <h2 id="lp-performance-heading">Performance</h2>
          <span>{performance ? `As of ${date(performance.asOf)}` : "Awaiting approved mark"}</span>
        </header>
        <dl>
          <div><dt>Current value</dt><dd>{performance ? currency(performance.currentValue) : "—"}</dd></div>
          <div><dt>Distributions</dt><dd>{performance ? currency(performance.distributions) : "—"}</dd></div>
          <div><dt>Gross MOIC</dt><dd>{grossMoic === null ? "—" : `${grossMoic.toFixed(2)}×`}</dd></div>
        </dl>
        {!performance && <p>Published after the quarter-end mark is sourced and approved.</p>}
      </section>

      <footer className="lp-portal-footer">
        <span>{snapshot.source}</span>
        <span>Private and confidential</span>
      </footer>
    </div>
  );
}
