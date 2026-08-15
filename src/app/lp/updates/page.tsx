import type { Metadata } from "next";
import Link from "next/link";
import { LP_INVESTOR_UPDATES } from "@/data/lp-investor-updates";

export const metadata: Metadata = {
  title: "Investor Updates — All Together Investor Portal",
  description: "Private updates for All Together investors.",
  robots: { index: false, follow: false, nocache: true },
};

export default function LpInvestorUpdatesPage() {
  const updates = [...LP_INVESTOR_UPDATES].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );

  return (
    <section className="lp-portal-shell lp-updates-index">
      <header className="lp-updates-index-header">
        <span>Private investor communications</span>
        <h1>Investor Updates</h1>
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
              aria-label={`${update.title} — Investor Update #${update.issue} — ${update.published}`}
            >
              <span className="lp-update-list-meta">
                <span>Investor Update #{update.issue}</span>
                <time dateTime={update.publishedAt}>{update.published}</time>
              </span>
              <strong>{update.title}</strong>
              <span className="lp-update-list-arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
