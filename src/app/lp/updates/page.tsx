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

function shortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

export default async function LpInvestorUpdatesPage() {
  await requireLpSession();
  const updates = [...LP_INVESTOR_UPDATES].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );

  return (
    <section className="lp-portal-shell lp-updates-index">
      <header className="lp-updates-index-header">
        <h1 className="sr-only">Investor Updates</h1>
      </header>

      <ol className="lp-update-rows" aria-label="Investor updates, newest first">
        {updates.map((update) => (
          <li key={update.slug}>
            <Link
              href={`/lp/updates/${update.slug}`}
              title={`${update.title}: ${update.subtitle}`}
              aria-label={`${update.title}: ${update.subtitle} — Investor Update #${update.issue} — ${update.published}`}
            >
              <span className="lp-update-row-issue">#{update.issue}</span>
              <time dateTime={update.publishedAt}>{shortDate(update.publishedAt)}</time>
              <span className="lp-update-row-title">{update.title}</span>
              <UIIcon name="arrow-up-right" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
