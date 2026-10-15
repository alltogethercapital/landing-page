import type { Metadata } from "next";
import Link from "next/link";
import { UIIcon } from "@/components/icons";
import { requireLpSession } from "@/lib/lp-auth";
import { LP_INVESTOR_UPDATES } from "@/data/lp-investor-updates";
import { pageTitle } from "@/lib/page-metadata";

export const metadata: Metadata = {
  title: pageTitle("Investor Updates"),
  description: "Private updates for Machine Spirit Capital investors.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LpInvestorUpdatesPage() {
  await requireLpSession();
  const updates = [...LP_INVESTOR_UPDATES].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );

  return (
    <section className="lp-portal-shell lp-updates-index">
      <header className="lp-updates-index-header">
        <h1 className="sr-only">Investor Updates</h1>
        <p>
          Notes on the portfolio, our investment thinking, and what we are learning. We publish at least
          twice per year, with shorter updates when something material changes.
        </p>
      </header>

      <ol className="lp-updates-list" aria-label="Investor updates, newest first">
        {updates.map((update) => (
          <li key={update.slug}>
            <Link
              href={`/lp/updates/${update.slug}`}
              aria-label={`${update.title}: ${update.subtitle} — Investor Update #${update.issue} — ${update.published}`}
            >
              <span className="lp-update-list-meta">
                <span>Investor Update #{update.issue}</span>
                <time dateTime={update.publishedAt}>{update.published}</time>
              </span>
              <span className="lp-update-list-heading">
                <strong>{update.title}</strong>
                <span className="lp-update-list-subtitle">{update.subtitle}</span>
              </span>
              <span className="lp-update-list-arrow" aria-hidden="true"><UIIcon name="arrow-up-right" /></span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
