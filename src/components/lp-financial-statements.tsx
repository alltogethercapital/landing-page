import { LpSectionTabs } from "@/components/lp-section-tabs";
import { LP_FINANCIAL_STATEMENTS, type LpStatement } from "@/data/lp-financials";

export type LpStatementKey = LpStatement["key"];

const trim = (value: number, digits: number) =>
  value.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");

// Abbreviated, accounting style: negatives in parentheses, exact in the tooltip.
function statementAmount(value: number) {
  const abs = Math.abs(value);
  const text = abs < 0.005
    ? "—"
    : abs < 1_000
      ? `$${Math.round(abs).toLocaleString("en-US")}`
      : abs < 1_000_000
        ? `$${trim(abs / 1_000, 1)}K`
        : `$${trim(abs / 1_000_000, 3)}M`;
  return value < -0.005 ? `(${text})` : text;
}

const exact = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function Statement({ statement }: { statement: LpStatement }) {
  return (
    <section className="lp-figure-section lp-figure-section--standalone" aria-labelledby={`lp-fin-${statement.key}`}>
      <div className="lp-figure-heading">
        <h3 id={`lp-fin-${statement.key}`}>{statement.title}</h3>
        <span>{statement.period}</span>
      </div>
      <table className="lp-fin-table">
        <tbody>
          {statement.rows.map((row, index) => {
            const kind = row.kind ?? "item";
            if (kind === "heading") {
              return (
                <tr key={`${row.label}-${index}`} className="lp-fin-row lp-fin-row--heading">
                  <th scope="rowgroup" colSpan={2}>{row.label}</th>
                </tr>
              );
            }
            const amount = row.amount ?? 0;
            return (
              <tr
                key={`${row.label}-${index}`}
                className={`lp-fin-row lp-fin-row--${kind}${row.indent ? " is-indented" : ""}`}
                title={row.title ?? exact(amount)}
              >
                <th scope="row">{row.label}</th>
                <td className="is-number" data-cents={Math.round(amount * 100)}>{statementAmount(amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
      <p className="lp-fin-note">Unaudited · USD · Outer Rim Ventures LLC · Investments at latest comparable valuations, not NAV</p>
    </div>
  );
}
