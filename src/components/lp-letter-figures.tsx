import { LpTip } from "@/components/lp-tip";
import { requireLpSession } from "@/lib/lp-auth";
import { projectedPositionValue } from "@/lib/lp-projection";
import {
  LETTER_ACCESS_CHANNEL_SPLIT,
  LETTER_ALLOCATION,
  LETTER_DEPLOYMENT,
  LETTER_ENTRY_BUCKETS,
  LETTER_ENTRY_ROUND_SPLIT,
  LETTER_H256_PENDING_AMOUNT,
  LETTER_INVESTED_TOTAL,
  LETTER_SECURITY_TYPE_SPLIT,
  type LetterShare,
} from "@/data/lp-letter-figures";
import {
  LP_PROJECTED_VALUATION_MARKS,
  LP_INVESTMENTS,
} from "@/data/lp-investments";
import { LpScrollArea } from "@/components/lp-scroll-area";
import {
  abbreviateLpValuation,
  formatCompactUsd,
  formatSignedWholeUsd,
  formatWholeUsd,
} from "@/lib/lp-format";

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

function monthYearLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
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
      <span className="lp-figure-bar-label" title={label}>
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
            <dt title={row.label}>{row.label}</dt>
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
  // The x-axis spans the first month of deployment to the latest investment, so
  // the line always ends exactly at the chart's right edge as positions are added.
  const firstDate = new Date(`${LETTER_DEPLOYMENT[0].date}T00:00:00Z`);
  const lastDate = LETTER_DEPLOYMENT[LETTER_DEPLOYMENT.length - 1].date;
  const start = Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), 1);
  const end = new Date(`${lastDate}T00:00:00Z`).getTime();
  const chartX = (date: string) =>
    Math.min(100, Math.max(0, ((new Date(`${date}T00:00:00Z`).getTime() - start) / (end - start)) * 100));
  const chartY = (value: number) => 100 - (value / deploymentMax) * 100;
  const gridValues = [0, 0.25, 0.5, 0.75, 1];
  const axisMonths: string[] = [];
  for (let month = new Date(start); month.getTime() <= end; month.setUTCMonth(month.getUTCMonth() + 2)) {
    axisMonths.push(month.toISOString().slice(0, 10));
  }
  // Edge labels hug the chart bounds instead of centring past them.
  const axisLabelShift = (x: number) => (x < 4 ? "0%" : x > 92 ? "-100%" : "-50%");

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
          Cumulative invested capital rising from {currency(LETTER_DEPLOYMENT[0].cumulative)} in{" "}
          {monthYearLabel(LETTER_DEPLOYMENT[0].date)} to {currency(deploymentMax)} in {monthYearLabel(lastDate)}.
        </span>
        <div className="lp-figure-chart-y" aria-hidden="true">
          {[...gridValues].reverse().map((value) => (
            <span key={value}>{compactDollars(deploymentMax * value)}</span>
          ))}
        </div>
        <div className="lp-figure-chart-x" aria-hidden="true">
          {axisMonths.map((month) => (
            <span
              key={month}
              style={{
                insetInlineStart: `${chartX(month).toFixed(2)}%`,
                transform: `translateX(${axisLabelShift(chartX(month))})`,
              }}
            >
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

function formatMarkCell(entry: string, latest?: string) {
  const from = abbreviateLpValuation(entry);
  if (!latest) return { label: from.label, title: from.detail };
  const to = abbreviateLpValuation(latest);
  if (from.label === to.label) return { label: from.label, title: to.detail };
  return {
    label: `${from.label} → ${to.label}`,
    title: `${from.detail} → ${to.detail}`,
  };
}

function ValuationEvidence() {
  const positions = LP_INVESTMENTS.filter((recordedPosition) => !recordedPosition.gift).map((recordedPosition) => {
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
    const carried = projectedPositionValue(position.investedCost, mark, position.performance);
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
  // Gifted positions: $0 cost to the fund, carried at fair value on the same
  // marks, excluded from AUM. Their whole value lifts the total multiple.
  const gifts = LP_INVESTMENTS.filter((recordedPosition) => recordedPosition.gift).map((position) => {
    const mark = LP_PROJECTED_VALUATION_MARKS[position.id];
    return { position, mark, carried: projectedPositionValue(position.investedCost, mark, position.performance) };
  });
  const giftCarried = gifts.reduce((sum, gift) => sum + gift.carried, 0);
  const fundCarried = positions.reduce((sum, position) => sum + position.carried, 0)
    + LETTER_H256_PENDING_AMOUNT;
  const totalCarried = fundCarried + giftCarried;
  const totalDelta = totalCarried - LETTER_INVESTED_TOTAL;
  const totalMultiple = totalCarried / LETTER_INVESTED_TOTAL;

  return (
    <section
      className="lp-figure-section lp-figure-section--standalone"
      aria-labelledby="lp-performance-section-title"
    >
      <h2 id="lp-performance-section-title" className="sr-only">Performance</h2>
      <LpScrollArea className="lp-figure-table-wrap">
        <table className="lp-figure-table lp-figure-table--marks">
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th
                scope="col"
                title="Entry valuation → current mark. Post-money, cap, assumed, reported, and at-cost detail is in each row tooltip."
              >
                Entry → Mark
                <LpTip label="Entry → Mark" text="Entry post-money → latest documented round. Value = cost × latest ÷ entry (ASC 820); no newer round = at cost." />
              </th>
              <th scope="col" className="is-number">Cost</th>
              <th
                scope="col"
                className="is-number"
                title="Gross multiple of projected value to cost. Projected value and dollar change are in each row tooltip."
              >
                Multiple
                <LpTip label="Multiple" text="Projected value ÷ cost. Gifts show their value instead ($0 cost)." />
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map(({ position, mark, carried, delta, multiple, hasGain, hasLoss }) => {
              const markCell = formatMarkCell(mark?.entryValuation ?? position.entryValuation, mark?.latestValuation);
              const markTitle = [
                markCell.title,
                mark ? `As of ${mark.asOf}` : "Held at cost · No approved mark",
                mark?.costBasisAmount && position.investedCost !== mark.costBasisAmount
                  ? `${formatWholeUsd(mark.costBasisAmount)} marked slice`
                  : null,
              ].filter(Boolean).join(" · ");
              const multipleTitle = `${formatWholeUsd(carried)} projected · ${
                hasGain || hasLoss ? formatSignedWholeUsd(delta) : "at cost"
              }`;
              const markContent = mark?.sourceUrl ? (
                <a href={mark.sourceUrl} target="_blank" rel="noreferrer">{markCell.label}</a>
              ) : (
                markCell.label
              );
              return (
                <tr key={position.id} className={hasGain ? "has-gain" : undefined}>
                  <th scope="row" title={position.company}>
                    <strong>{position.company}</strong>
                  </th>
                  <td title={markTitle}>{markContent}</td>
                  <td className="is-number" title={formatWholeUsd(position.investedCost)}>
                    {formatCompactUsd(position.investedCost)}
                  </td>
                  <td
                    className={`is-number lp-performance-change${hasGain ? " is-gain" : hasLoss ? " is-loss" : " is-flat"}`}
                    title={multipleTitle}
                    data-carried={Math.round(carried * 100)}
                  >
                    {multiple.toFixed(2)}×
                  </td>
                </tr>
              );
            })}
            {gifts.map(({ position, mark, carried }) => {
              const markCell = formatMarkCell(mark?.entryValuation ?? position.entryValuation, mark?.latestValuation);
              const markContent = mark?.sourceUrl ? (
                <a href={mark.sourceUrl} target="_blank" rel="noreferrer">{markCell.label}</a>
              ) : (
                markCell.label
              );
              return (
                <tr key={position.id} className="is-gift">
                  <th scope="row" title={`${position.company} · ${position.round} · gifted to the fund`}>
                    <strong>{position.company}</strong>
                  </th>
                  <td title={[markCell.title, mark ? `As of ${mark.asOf}` : "Latest documented round"].join(" · ")}>{markContent}</td>
                  <td className="is-number" title="Gifted: $0 cost to the fund">
                    <small className="lp-gift-label">Gift</small>
                  </td>
                  <td
                    className="is-number lp-performance-change is-gain"
                    title={`${formatWholeUsd(carried)} at fair value · $0 cost · excluded from AUM`}
                    data-carried={Math.round(carried * 100)}
                  >
                    {formatCompactUsd(carried)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="lp-performance-pending-row">
              <th scope="row">
                <strong>Finalizing allocation</strong>
              </th>
              <td title="H256 · Atoms or Applied Intuition · included at cost">—</td>
              <td className="is-number" title={formatWholeUsd(LETTER_H256_PENDING_AMOUNT)}>
                {formatCompactUsd(LETTER_H256_PENDING_AMOUNT)}
              </td>
              <td
                className="is-number lp-performance-change is-flat"
                title={`${formatWholeUsd(LETTER_H256_PENDING_AMOUNT)} projected · at cost`}
                data-carried={Math.round(LETTER_H256_PENDING_AMOUNT * 100)}
              >
                1.00×
              </td>
            </tr>
            <tr className="lp-performance-total-row">
              <th scope="row">Total</th>
              <td />
              <td className="is-number" title={formatWholeUsd(LETTER_INVESTED_TOTAL)}>
                {formatCompactUsd(LETTER_INVESTED_TOTAL)}
              </td>
              <td
                className={`is-number lp-performance-change${totalDelta > 0.005 ? " is-gain" : totalDelta < -0.005 ? " is-loss" : " is-flat"}`}
                title={`${formatWholeUsd(totalCarried)} projected (fund-purchased ${formatWholeUsd(fundCarried)} + gifted ${formatWholeUsd(giftCarried)} at $0 cost) · ${formatSignedWholeUsd(totalDelta)}`}
                data-carried={Math.round(totalCarried * 100)}
              >
                {totalMultiple.toFixed(2)}×
                <LpTip
                  up
                  label="Total multiple"
                  text={`(Fund-purchased ${formatWholeUsd(fundCarried)} + gifted ${formatWholeUsd(giftCarried)}) ÷ fund cost ${formatWholeUsd(LETTER_INVESTED_TOTAL)} = ${totalMultiple.toFixed(2)}×. Pending H256 ${formatCompactUsd(LETTER_H256_PENDING_AMOUNT)} at cost.`}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </LpScrollArea>
    </section>
  );
}

/* ---------------------------------------------------------------------------- */

export async function LpPortfolioInsights() {
  await requireLpSession();
  return (
    <div className="lp-figure-suite">
      <PortfolioAtAGlance />
      <ConcentrationAndStructure />
    </div>
  );
}

export async function LpPortfolioPerformance() {
  await requireLpSession();
  return (
    <div className="lp-figure-suite">
      <ValuationEvidence />
    </div>
  );
}
