import Link from "next/link";
import {
  LP_COMPANY_REVIEW_AS_OF,
  LP_RELATED_COMPANY_UPDATES,
} from "@/data/lp-company-updates";
import type { LpInvestmentDto } from "@/lib/lp-data";

export function companyUpdateDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function LpCompanyUpdates({ investments }: { investments: LpInvestmentDto[] }) {
  const companies = [...new Map(investments.map((investment) => [investment.company, investment])).values()]
    .sort((a, b) => a.company.localeCompare(b.company));

  return (
    <section className="lp-company-updates" aria-labelledby="lp-company-updates-heading">
      <header className="lp-company-updates-heading">
        <h2 id="lp-company-updates-heading">Company updates</h2>
        <p>Reviewed {companyUpdateDate(LP_COMPANY_REVIEW_AS_OF)} · All {investments.length} positions covered across {companies.length} issuers and vehicles.</p>
        <p>Dated announcements and current product checks are labeled separately. Company claims are attributed to their sources. An operating milestone or financing amount alone does not change a position&apos;s value.</p>
      </header>
      <div className="lp-company-update-list">
        {companies.map((investment) => {
          const update = investment.companyUpdate;
          const positionCount = investments.filter((item) => item.company === investment.company).length;
          return (
            <article className="lp-company-update" key={investment.company}>
              <header>
                <Link href={`/lp/investments/${investment.id}`}>{investment.company}</Link>
                <span>{update.sourceDate
                  ? companyUpdateDate(update.sourceDate)
                  : update.kind === "limited-disclosure" ? "Limited public disclosure" : "Current product check"}
                  {positionCount > 1 ? ` · ${positionCount} positions` : ""}</span>
              </header>
              <h3>{update.headline}</h3>
              <p>{update.summary}</p>
              {update.valuationNote && <p className="lp-company-update-valuation">{update.valuationNote}</p>}
              <a className="lp-company-update-source" href={update.sourceUrl} target="_blank" rel="noreferrer">{update.source} ↗</a>
            </article>
          );
        })}
      </div>
      <section className="lp-company-updates-related" aria-labelledby="lp-related-updates-heading">
        <h2 id="lp-related-updates-heading">Other portfolio relationships</h2>
        <p>These public portfolio names have no separate funded row in the Schedule of Investments. They add no cost or projected value to this snapshot.</p>
        {LP_RELATED_COMPANY_UPDATES.map((update) => (
          <article className="lp-company-update" key={update.company}>
            <header><strong>{update.company}</strong><span>Outside the financial snapshot</span></header>
            <h3>{update.headline}</h3>
            <p>{update.summary}</p>
            <a className="lp-company-update-source" href={update.sourceUrl} target="_blank" rel="noreferrer">{update.source} ↗</a>
          </article>
        ))}
      </section>
    </section>
  );
}
