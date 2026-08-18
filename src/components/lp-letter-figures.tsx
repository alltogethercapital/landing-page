import {
  LETTER_ACCESS_CHANNEL_SPLIT,
  LETTER_ALLOCATED_TOTAL,
  LETTER_ALLOCATION,
  LETTER_CONCENTRATION_CURVE,
  LETTER_DEPLOYMENT,
  LETTER_ENTRY_BUCKETS,
  LETTER_ENTRY_HIGH,
  LETTER_ENTRY_LOW,
  LETTER_ENTRY_ROUND_SPLIT,
  LETTER_H256_DEPLOYED_AMOUNT,
  LETTER_H256_PENDING_AMOUNT,
  LETTER_SECURITY_TYPE_SPLIT,
  LETTER_POSITIONS,
  LETTER_PRICED_POSITIONS,
  LETTER_TOP_FIVE_SHARE,
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

// $6M, $312.5M, $8.6B, $852B, $1T — the letter's shorthand for company prices.
function valuationLabel(value: number) {
  const [divisor, suffix] =
    value >= 1e12 ? [1e12, "T"] : value >= 1e9 ? [1e9, "B"] : [1e6, "M"];
  const scaled = value / divisor;
  return `$${scaled.toFixed(scaled % 1 === 0 ? 0 : 1)}${suffix}`;
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
      <div className="lp-figure-section-head">
        <h2 id={`lp-figure-${id}`}>{title}</h2>
      </div>
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
  lead,
  detail,
}: {
  label: string;
  share: number;
  scale: number;
  amount?: number;
  lead?: boolean;
  detail?: string;
}) {
  // When a row carries a dollar label the bar gives up its last fifth, so the
  // longest bar cannot run into the label that trails it.
  const reserve = amount === undefined ? 1 : 0.8;
  return (
    <div className={`lp-figure-bar-row${lead ? " is-lead" : ""}`}>
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
        {LETTER_ALLOCATION.map((row, index) => (
          <BarRow
            key={row.key}
            label={row.label}
            share={row.share}
            scale={allocationScale}
            amount={row.amount}
            lead={index === 0}
            detail={
              row.key === "aerospace"
                ? `Includes ${dollars(LETTER_H256_DEPLOYED_AMOUNT)} deployed to ${H256_VEHICLE_ALLOCATION.deployedCompany} in its ${H256_VEHICLE_ALLOCATION.deployedRound} through H256`
                : row.key === "pending"
                  ? `${dollars(LETTER_H256_PENDING_AMOUNT)} in H256 not yet deployed`
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
      <div className="lp-figure-triptych">
        <CompactBars title="Security type" rows={LETTER_SECURITY_TYPE_SPLIT} />
        <CompactBars title="Entry round" rows={LETTER_ENTRY_ROUND_SPLIT} />
        <CompactBars title="Access channel" rows={LETTER_ACCESS_CHANNEL_SPLIT} />
      </div>
    </FigureSection>
  );
}

/* 03 — Where we bought ------------------------------------------------------ */

function WhereWeBought() {
  // Log scale: $5M through $1T, so every entry price from MAV Unlimited to OpenAI
  // lands on one axis.
  const domainMin = Math.log10(5e6);
  const domainMax = Math.log10(1e12);
  const tickX = (value: number) =>
    ((Math.log10(value) - domainMin) / (domainMax - domainMin)) * 100;
  const maxCost = Math.max(...LETTER_PRICED_POSITIONS.map((p) => p.investedCost));
  const axisTicks = [1e7, 1e8, 1e9, 1e10, 1e11, 1e12];
  const bucketScale = Math.max(...LETTER_ENTRY_BUCKETS.map((row) => row.share));

  const curvePoints = LETTER_CONCENTRATION_CURVE.map(
    (point) =>
      `${((point.positions / LETTER_POSITIONS.length) * 100).toFixed(2)},${(
        100 - point.share * 100
      ).toFixed(2)}`,
  ).join(" ");
  const fiveX = (5 / LETTER_POSITIONS.length) * 100;

  return (
    <FigureSection id="where-we-bought" title="Where we bought">
      <FigureHeading
        title="Entry valuation of every priced position"
        note="Log scale · tick height = cost"
      />
      <figure className="lp-figure-chart lp-figure-chart--ticks">
        <svg viewBox="0 0 100 34" preserveAspectRatio="none" role="img" aria-hidden="true">
          {LETTER_PRICED_POSITIONS.map((position) => {
            const height = Math.max((position.investedCost / maxCost) * 30, 1.2);
            const isEdge =
              position.chronology === LETTER_ENTRY_LOW.chronology ||
              position.chronology === LETTER_ENTRY_HIGH.chronology;
            return (
              <line
                key={position.id}
                x1={tickX(position.entryValuationAmount).toFixed(2)}
                x2={tickX(position.entryValuationAmount).toFixed(2)}
                y1={(32 - height).toFixed(2)}
                y2="32"
                className={isEdge ? "lp-figure-tick is-edge" : "lp-figure-tick"}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          <line x1="0" x2="100" y1="32" y2="32" className="lp-figure-axis" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="sr-only">
          Entry prices for {LETTER_PRICED_POSITIONS.length} priced exposures, from{" "}
          {valuationLabel(LETTER_ENTRY_LOW.entryValuationAmount)} to{" "}
          {valuationLabel(LETTER_ENTRY_HIGH.entryValuationAmount)}.
        </span>
        <div className="lp-figure-tick-callouts" aria-hidden="true">
          <span style={{ insetInlineStart: `${tickX(LETTER_ENTRY_LOW.entryValuationAmount).toFixed(2)}%` }}>
            {LETTER_ENTRY_LOW.company} · {valuationLabel(LETTER_ENTRY_LOW.entryValuationAmount)}
          </span>
          <span
            className="is-end"
            style={{ insetInlineEnd: `${(100 - tickX(LETTER_ENTRY_HIGH.entryValuationAmount)).toFixed(2)}%` }}
          >
            {LETTER_ENTRY_HIGH.company} · {valuationLabel(LETTER_ENTRY_HIGH.entryValuationAmount)}
          </span>
        </div>
        <div className="lp-figure-chart-x" aria-hidden="true">
          {axisTicks.map((tick) => (
            <span key={tick} style={{ insetInlineStart: `${tickX(tick).toFixed(2)}%` }}>
              {valuationLabel(tick)}
            </span>
          ))}
        </div>
      </figure>
      <div className="lp-figure-pair">
        <div>
          <FigureHeading title="Cost by entry valuation" />
          <div className="lp-figure-bars lp-figure-bars--tight">
            {LETTER_ENTRY_BUCKETS.map((row) => (
              <BarRow key={row.key} label={row.label} share={row.share} scale={bucketScale} />
            ))}
          </div>
        </div>

        <div>
          <FigureHeading title="Concentration curve" />
          <figure className="lp-figure-chart lp-figure-chart--curve">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-hidden="true">
              <line x1="0" y1="100" x2="100" y2="0" className="lp-figure-diagonal" vectorEffect="non-scaling-stroke" />
              <polyline points={curvePoints} className="lp-figure-line" vectorEffect="non-scaling-stroke" />
              <circle
                cx={fiveX.toFixed(2)}
                cy={(100 - LETTER_TOP_FIVE_SHARE * 100).toFixed(2)}
                r="1.6"
                className="lp-figure-dot"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="sr-only">
              Cumulative share of invested cost by position, largest first. Five positions reach{" "}
              {percent(LETTER_TOP_FIVE_SHARE)}.
            </span>
            <div className="lp-figure-chart-y" aria-hidden="true">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            <span
              className="lp-figure-curve-callout"
              style={{ insetInlineStart: `${fiveX.toFixed(2)}%`, insetBlockStart: `${(100 - LETTER_TOP_FIVE_SHARE * 100).toFixed(2)}%` }}
              aria-hidden="true"
            >
              5 positions · {percent(LETTER_TOP_FIVE_SHARE, 0)}
            </span>
            <div className="lp-figure-chart-x is-static" aria-hidden="true">
              <span>Positions, largest first</span>
            </div>
          </figure>
        </div>
      </div>
    </FigureSection>
  );
}

/* 04 — Performance ---------------------------------------------------------- */

function ValuationEvidence({ grossValue }: { grossValue: number }) {
  const marks = Object.entries(LP_PROJECTED_VALUATION_MARKS).map(([id, mark]) => {
    const position = LP_INVESTMENTS.find((entry) => entry.id === id)!;
    const multiple = mark.latestValuationAmount / mark.entryValuationAmount;
    const cost = mark.costBasisAmount ?? position.investedCost;
    return {
      id,
      company: mark.positionLabel ?? position.company,
      round: position.round,
      cost,
      entry: mark.entryValuation ?? position.entryValuation,
      mark,
      multiple,
      carried: cost * multiple,
    };
  });
  const markedCost = marks.reduce((sum, mark) => sum + mark.cost, 0);
  const heldAtCost = LETTER_ALLOCATED_TOTAL - markedCost;

  return (
    <FigureSection id="valuation-evidence" title="Performance">
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
            {marks.map((mark) => (
              <tr key={mark.id} className="is-marked">
                <th scope="row">
                  <strong>{mark.company}</strong>
                  <small>{mark.mark.source}</small>
                </th>
                <td>{mark.entry}</td>
                <td>
                  {mark.mark.sourceUrl ? (
                    <a href={mark.mark.sourceUrl} target="_blank" rel="noreferrer">
                      {mark.mark.latestValuation}
                    </a>
                  ) : (
                    mark.mark.latestValuation
                  )}
                  <small>{mark.mark.asOf}</small>
                </td>
                <td className="is-number">{currency(mark.cost)}</td>
                <td className="is-number">{mark.multiple.toFixed(2)}×</td>
                <td className="is-number">{currency(mark.carried)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Remaining cost held at cost</th>
              <td>—</td>
              <td>—</td>
              <td className="is-number">{currency(heldAtCost)}</td>
              <td className="is-number">1.00×</td>
              <td className="is-number">{currency(heldAtCost)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td />
              <td />
              <td className="is-number">{currency(LETTER_ALLOCATED_TOTAL)}</td>
              <td className="is-number">{(grossValue / LETTER_ALLOCATED_TOTAL).toFixed(2)}×</td>
              <td className="is-number">{currency(grossValue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </FigureSection>
  );
}

/* ---------------------------------------------------------------------------- */

export function LpLetterFigures({
  grossValue,
}: {
  grossValue: number;
}) {
  return (
    <div className="lp-figure-suite">
      <PortfolioAtAGlance />
      <ConcentrationAndStructure />
      <WhereWeBought />
      <ValuationEvidence grossValue={grossValue} />
    </div>
  );
}
