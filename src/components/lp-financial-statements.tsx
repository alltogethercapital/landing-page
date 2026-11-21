import { LpSectionTabs } from "@/components/lp-section-tabs";
import {
  LP_FIN_ENTITY,
  LP_FIN_PERIOD_DETAIL,
  LP_FINANCIAL_STATEMENTS,
  type LpStatement,
} from "@/data/lp-financials";

export type LpStatementKey = LpStatement["key"];

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const exact = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

// Whole dollars, accounting style: negatives in parentheses, zero as a dash,
// a $ sign on the first amount and on grand totals only.
function statementAmount(value: number, currency: boolean) {
  const rounded = Math.round(value);
  if (rounded === 0) return "—";
  const text = `${currency ? "$" : ""}${number.format(Math.abs(rounded))}`;
  return rounded < 0 ? `(${text})` : text;
}

function Label({ row }: { row: LpStatement["rows"][number] }) {
  if (!row.shortLabel) return <>{row.label}</>;
  return (
    <>
      <span className="lp-fin-full">{row.label}</span>
      <span className="lp-fin-short" aria-hidden="true">{row.shortLabel}</span>
    </>
  );
}

function Statement({ statement }: { statement: LpStatement }) {
  const firstAmountIndex = statement.rows.findIndex((row) => row.amount !== undefined);
  const dateShort = statement.key === "balance-sheet" ? "As of Nov 20, 2026" : "Period ended Nov 20, 2026";
  return (
    <section className="lp-fin-statement" aria-label={`${statement.title}, ${LP_FIN_ENTITY}`}>
      <table className="lp-fin-table">
        <colgroup>
          <col />
          <col className="lp-fin-col-amount" />
        </colgroup>
        <tbody>
          {statement.rows.map((row, index) => {
            const kind = row.kind ?? "item";
            const indent = row.indent ?? 0;
            const className = `lp-fin-row lp-fin-row--${kind} lp-fin-indent-${indent}`;
            if (kind === "heading" || kind === "label") {
              return (
                <tr key={`${row.label}-${index}`} className={className}>
                  <th scope={kind === "heading" ? "rowgroup" : "row"} colSpan={2} title={row.title ?? row.label}><Label row={row} /></th>
                </tr>
              );
            }
            const amount = row.amount ?? 0;
            const currency = index === firstAmountIndex || kind === "total";
            return (
              <tr key={`${row.label}-${index}`} className={className} title={row.title ?? exact(amount)} data-label={row.label}>
                <th scope="row"><Label row={row} /></th>
                <td className="is-number" data-cents={Math.round(amount * 100)}>
                  <span>{statementAmount(amount, currency)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="lp-fin-note" title={`${statement.key === "balance-sheet" ? statement.dateLine : LP_FIN_PERIOD_DETAIL}. Amounts in USD. Unaudited. Investments at latest comparable valuations (positions without one at cost); not NAV. Gifted positions held outside the fund are excluded.`}>
        <span className="lp-fin-full">{dateShort} · USD · Unaudited · Investments at latest comparable valuations, not NAV</span>
        <span className="lp-fin-short" aria-hidden="true">{dateShort} · USD · Unaudited</span>
      </p>
    </section>
  );
}

export function LpFinancialStatements({ initial }: { initial: LpStatementKey }) {
  return (
    <div className="lp-fin">
      <LpSectionTabs<LpStatementKey>
        param="statement"
        label="Financial statements"
        variant="sub"
        initial={initial}
        tabs={LP_FINANCIAL_STATEMENTS.map((statement) => ({
          key: statement.key,
          label: statement.tab,
          content: <Statement statement={statement} />,
        }))}
      />
    </div>
  );
}
