import type { Metadata } from "next";
import { LpFinancialStatements, type LpStatementKey } from "@/components/lp-financial-statements";
import { requireLpSession } from "@/lib/lp-auth";
import { pageTitle } from "@/lib/page-metadata";

export const metadata: Metadata = {
  title: pageTitle("Financials"),
  description: "Financial statements for Outer Rim Ventures LLC.",
  robots: { index: false, follow: false, nocache: true },
};

const STATEMENT_KEYS: LpStatementKey[] = ["balance-sheet", "operations", "cash-flow"];

export default async function LpFinancialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireLpSession();
  const params = await searchParams;
  const initial = STATEMENT_KEYS.find((key) => key === params.statement) ?? "balance-sheet";

  return (
    <section className="lp-portal-shell lp-financials-page">
      <h1 className="sr-only">Financials</h1>
      <LpFinancialStatements initial={initial} />
    </section>
  );
}
