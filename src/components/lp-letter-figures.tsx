import {
  LETTER_ACCESS_CHANNEL_SPLIT,
  LETTER_ALLOCATION,
  LETTER_DEPLOYMENT,
  LETTER_ENTRY_BUCKETS,
  LETTER_ENTRY_ROUND_SPLIT,
  LETTER_H256_DEPLOYED_AMOUNT,
  LETTER_H256_PENDING_AMOUNT,
  LETTER_INVESTED_TOTAL,
  LETTER_SECURITY_TYPE_SPLIT,
  type LetterShare,
} from "@/data/lp-letter-figures";
import {
  H256_VEHICLE_ALLOCATION,
  LP_PROJECTED_VALUATION_MARKS,
  LP_INVESTMENTS,
} from "@/data/lp-investments";

/* Formatting ---------------------------------------------------------------- */

function currency(value: number, fractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function signedCurrency(value: number) {
  return `${value > 0 ? "+" : ""}${currency(value)}`;
}

function dollars(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value: number, fractionDigits = 1) {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

// $0, $165k, $661k — chart axes stay legible at 10px.
function compactDollars(value: number) {
  if (value === 0) return "$0";
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${Math.round(value / 1e3)}k`;
}

function monthLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/* Shared pieces ------------------------------------------------------------- */

function FigureSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="lp-figure-section" aria-labelledby={`lp-figure-${id}`}>
      <h2 id={`lp-figure-${id}`} className="sr-only">{title}</h2>
      {children}
    </section>
  );
}

function FigureHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className="lp-figure-heading">
      <h3>{title}</h3>
      {note ? <span>{note}</span> : null}
    </div>
  );
}

// A labelled proportional bar. `scale` lets a row group share one axis so bar
// lengths stay comparable across rows rather than each filling its own track.
function BarRow({
  label,
  share,
  scale,
  amount,
  detail,
}: {
  label: string;
  share: number;
  scale: number;
  amount?: number;
  detail?: string;
}) {
  // When a row carries a dollar label the bar gives up its last fifth, so the
  // longest bar cannot run into the label that trails it.
  const reserve = amount === undefined ? 1 : 0.8;
  return (
    <div className="lp-figure-bar-row">
      <span className="lp-figure-bar-label">
        {label}
        {detail ? <small>{detail}</small> : null}
      </span>
      <span className="lp-figure-bar-track">
        <span
          className="lp-figure-bar-fill"
          style={{ inlineSize: `${(share / scale) * reserve * 100}%` }}
        />
        {amount !== undefined ? (
          <span className="lp-figure-bar-amount">{dollars(amount)}</span>
        ) : null}
      </span>
      <span className="lp-figure-bar-value">{percent(share)}</span>
    </div>
  );
}

function CompactBars({ title, rows }: { title: string; rows: LetterShare[] }) {
  const scale = Math.max(...rows.map((row) => row.share));
  return (
    <div className="lp-figure-compact">
      <h4>{title}</h4>
      <dl>
        {rows.map((row) => (
          <div key={row.key}>
            <dt>{row.label}</dt>
            <dd>
              <span className="lp-figure-compact-track">
                <span
                  className="lp-figure-compact-fill"
                  style={{ inlineSize: `${(row.share / scale) * 100}%` }}
                />
              </span>
              <span className="lp-figure-compact-value">
                {row.share < 0.005 ? "<1%" : percent(row.share, 0)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* 01 — Portfolio at a glance ------------------------------------------------ */

function PortfolioAtAGlance() {
  const allocationScale = Math.max(...LETTER_ALLOCATION.map((row) => row.share));

  const deploymentMax = LETTER_DEPLOYMENT[LETTER_DEPLOYMENT.length - 1].cumulative;
  const start = Date.UTC(2025, 9, 1);
  const end = Date.UTC(2026, 7, 31);
  const chartX = (date: string) =>
    ((new Date(`${date}T00:00:00Z`).getTime() - start) / (end - start)) * 100;
  const chartY = (value: number) => 100 - (value / deploymentMax) * 100;
  const gridValues = [0, 0.25, 0.5, 0.75, 1];
  const axisMonths = ["2025-10-01", "2025-12-01", "2026-02-01", "2026-04-01", "2026-06-01", "2026-08-01"];

  return (
    <FigureSection id="portfolio-at-a-glance" title="Portfolio at a glance">
      <FigureHeading title="Allocation by category" />
      <div className="lp-figure-bars">
        {LETTER_ALLOCATION.map((row) => (
          <BarRow
            key={row.key}
            label={row.label}
            share={row.share}
            scale={allocationScale}
            amount={row.amount}
            detail={
              row.key === "aerospace"
                ? `Includes ${dollars(LETTER_H256_DEPLOYED_AMOUNT)} deployed to ${H256_VEHICLE_ALLOCATION.deployedCompany} in its ${H256_VEHICLE_ALLOCATION.deployedRound} through H256`
                : row.key === "pending"
                  ? `Pending allocation: ${dollars(LETTER_H256_PENDING_AMOUNT)} in H256`
                : undefined
            }
          />
        ))}
      </div>
      <FigureHeading title="Capital deployed" note="Cumulative, at cost" />
      <figure className="lp-figure-chart">
        <svg viewBox="0 0 100 46" preserveAspectRatio="none" role="img" aria-hidden="true">
          {gridValues.map((value) => (
            <line
              key={value}
              x1="0"
              x2="100"
              y1={((1 - value) * 100 * 0.46).toFixed(2)}
              y2={((1 - value) * 100 * 0.46).toFixed(2)}
              className="lp-figure-grid"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polyline
            points={LETTER_DEPLOYMENT.map(
              (point) => `${chartX(point.date).toFixed(2)},${(chartY(point.cumulative) * 0.46).toFixed(2)}`,
            ).join(" ")}
            className="lp-figure-line"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="sr-only">
          Cumulative invested capital rising from {currency(LETTER_DEPLOYMENT[0].cumulative)} in October
          2025 to {currency(deploymentMax)} in August 2026.
        </span>
        <div className="lp-figure-chart-y" aria-hidden="true">
          {[...gridValues].reverse().map((value) => (
            <span key={value}>{compactDollars(deploymentMax * value)}</span>
          ))}
        </div>
        <div className="lp-figure-chart-x" aria-hidden="true">
          {axisMonths.map((month) => (
            <span key={month} style={{ insetInlineStart: `${chartX(month).toFixed(2)}%` }}>
              {monthLabel(month)}
            </span>
          ))}
        </div>
      </figure>
    </FigureSection>
  );
}

/* 02 — Concentration and structure ------------------------------------------ */

function ConcentrationAndStructure() {
  return (
    <FigureSection id="concentration-and-structure" title="Concentration and structure">
      <div className="lp-figure-quad">
        <CompactBars title="Security type" rows={LETTER_SECURITY_TYPE_SPLIT} />
        <CompactBars title="Entry round" rows={LETTER_ENTRY_ROUND_SPLIT} />
        <CompactBars title="Access channel" rows={LETTER_ACCESS_CHANNEL_SPLIT} />
        <CompactBars title="Cost by entry valuation" rows={LETTER_ENTRY_BUCKETS} />
      </div>
    </FigureSection>
  );
}

/* 03 — Performance ---------------------------------------------------------- */

function ValuationEvidence() {
  const positions = LP_INVESTMENTS.map((recordedPosition) => {
    const mark = LP_PROJECTED_VALUATION_MARKS[recordedPosition.id];
    const position = recordedPosition.vehicleAllocation && mark
      ? {
          ...recordedPosition,
          id: `${recordedPosition.id}-anduril`,
          company: recordedPosition.vehicleAllocation.deployedCompany,
          investedCost: mark.costBasisAmount
            ?? recordedPosition.investedCost * recordedPosition.vehicleAllocation.deployedShare,
          round: `Via H256 · ${recordedPosition.vehicleAllocation.deployedRound}`,
          entryValuation: mark.entryValuation ?? recordedPosition.entryValuation,
        }
      : recordedPosition;
    const markedMultiple = mark
      ? mark.latestValuationAmount / mark.entryValuationAmount
      : 1;
    const markedCostBasis = mark?.costBasisAmount ?? position.investedCost;
    const carried = mark
      ? position.investedCost - markedCostBasis + markedCostBasis * markedMultiple
      : position.investedCost;
    const delta = carried - position.investedCost;
    return {
      position,
      mark,
      carried,
      delta,
      multiple: carried / position.investedCost,
      hasGain: delta > 0.005,
      hasLoss: delta < -0.005,
    };
  }).sort((left, right) =>
    Number(right.hasGain) - Number(left.hasGain)
      || right.delta - left.delta
      || left.position.chronology - right.position.chronology,
  );
  const totalCarried = positions.reduce((sum, position) => sum + position.carried, 0)
    + LETTER_H256_PENDING_AMOUNT;
  const totalDelta = totalCarried - LETTER_INVESTED_TOTAL;

  return (
    <section
      className="lp-figure-section lp-figure-section--standalone"
      aria-labelledby="lp-performance-section-title"
    >
      <h2 id="lp-performance-section-title" className="sr-only">Performance</h2>
      <FigureHeading title="Allocated positions" note="Green delta = gain vs. cost" />
      <div className="lp-figure-table-wrap">
        <table className="lp-figure-table lp-figure-table--marks">
          <thead>
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Entry price</th>
              <th scope="col">Marked to</th>
              <th scope="col" className="is-number">Cost</th>
              <th scope="col" className="is-number">Multiple</th>
              <th scope="col" className="is-number">Carried</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(({ position, mark, carried, delta, multiple, hasGain, hasLoss }) => (
              <tr key={position.id} className={hasGain ? "has-gain" : undefined}>
                <th scope="row">
                  <strong>{position.company}</strong>
                  <small>
                    {mark?.positionLabel && mark.positionLabel !== position.company
                      ? `${mark.positionLabel} mark`
                      : mark?.source ?? position.round}
                  </small>
                </th>
                <td>
                  {mark?.entryValuation ?? position.entryValuation}
                  {mark?.costBasisAmount && position.investedCost !== mark.costBasisAmount ? (
                    <small>{currency(mark.costBasisAmount)} marked slice</small>
                  ) : null}
                </td>
                <td>
                  {mark?.sourceUrl ? (
                    <a href={mark.sourceUrl} target="_blank" rel="noreferrer">
                      {mark.latestValuation}
                    </a>
                  ) : mark ? (
                    mark.latestValuation
                  ) : (
                    "Held at cost"
                  )}
                  <small>{mark?.asOf ?? "No approved mark"}</small>
                </td>
                <td className="is-number">{currency(position.investedCost)}</td>
                <td className={`is-number lp-performance-change${hasGain ? " is-gain" : hasLoss ? " is-loss" : ""}`}>
                  <strong>{multiple.toFixed(2)}×</strong>
                  <small>
                    {hasGain ? `↑ ${signedCurrency(delta)}` : hasLoss ? `↓ ${signedCurrency(delta)}` : "At cost"}
                  </small>
                </td>
                <td className="is-number">{currency(carried)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="lp-performance-pending-row">
              <th scope="row">
                <strong>Pending allocation</strong>
                <small>H256 · excluded from performance until deployed</small>
              </th>
              <td>Awaiting an underlying company</td>
              <td>
                Included at cost
                <small>In AUM, NAV, and total math</small>
              </td>
              <td className="is-number">{currency(LETTER_H256_PENDING_AMOUNT)}</td>
              <td className="is-number lp-performance-change">
                <strong>—</strong>
                <small>No performance</small>
              </td>
              <td className="is-number">{currency(LETTER_H256_PENDING_AMOUNT)}</td>
            </tr>
            <tr className="lp-performance-total-row">
              <th scope="row">Total</th>
              <td />
              <td />
              <td className="is-number">{currency(LETTER_INVESTED_TOTAL)}</td>
              <td className="is-number lp-performance-change is-gain">
                <strong>{(totalCarried / LETTER_INVESTED_TOTAL).toFixed(2)}×</strong>
                <small>↑ {signedCurrency(totalDelta)}</small>
              </td>
              <td className="is-number">{currency(totalCarried)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------- */

export function LpPortfolioInsights() {
  return (
    <div className="lp-figure-suite">
      <PortfolioAtAGlance />
      <ConcentrationAndStructure />
    </div>
  );
}

export function LpPortfolioPerformance() {
  return (
    <div className="lp-figure-suite">
      <ValuationEvidence />
    </div>
  );
}
