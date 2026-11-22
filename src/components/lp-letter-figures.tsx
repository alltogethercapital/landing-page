import { LpTip } from "@/components/lp-tip";
import { requireLpSession } from "@/lib/lp-auth";
import { projectedPositionValue } from "@/lib/lp-projection";
import {
  LETTER_ACCESS_CHANNEL_SPLIT,
  LETTER_ALLOCATION,
  LETTER_DEPLOYMENT,
  LETTER_ENTRY_BUCKETS,
  LETTER_ENTRY_ROUND_SPLIT,
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

// Short cell label for a valuation string: "$25M" + " cap", "$9B", "$111.50" + "/sh".
// The suffix is dropped on phones; the cell title keeps the full terms.
type ValuationCell = { label: string; suffix?: string; narrow?: string; detail: string };

function valuationLabel(value: string): ValuationCell {
  const detail = value.replace(/\s*\(held at cost\)\s*$/i, "").trim();
  if (/\/share/i.test(detail)) {
    const price = detail.match(/\$[\d,.]+/);
    if (price) return { label: price[0], suffix: "/sh", detail };
  }
  if (/^uncapped\b/i.test(detail)) return { label: "Uncapped", narrow: "No cap", detail };
  const match = detail.match(/^(~?)\$([\d.]+)([KMBT])\b/i);
  if (match) {
    const amount = Number(match[2]);
    const rounded = amount >= 100 ? amount.toFixed(1).replace(/\.0$/, "") : String(Number(amount.toFixed(2)));
    const label = `${match[1]}$${rounded}${match[3].toUpperCase()}`;
    const rest = detail.slice(match[0].length);
    return /\bcap\b/i.test(rest) ? { label, suffix: " cap", detail } : { label, detail };
  }
  return { label: abbreviateLpValuation(detail).label, detail };
}

function ValuationText({ cell }: { cell: ValuationCell }) {
  return (
    <>
      {cell.narrow ? (
        <>
          <span className="lp-perf-wide">{cell.label}</span>
          <span className="lp-perf-narrow">{cell.narrow}</span>
        </>
      ) : cell.label}
      {cell.suffix ? <span className="lp-perf-suffix">{cell.suffix}</span> : null}
    </>
  );
}

type PerformanceRow = {
  key: string;
  company: string;
  companyNarrow?: string;
  entry: ValuationCell;
  mark: ValuationCell;
  markTip?: string;
  markUrl?: string;
  cost: number;
  value: number;
  multiple: number;
  gift?: true;
  pending?: true;
};

function performanceRows(): PerformanceRow[] {
  const rows: PerformanceRow[] = [];
  for (const position of LP_INVESTMENTS) {
    const mark = LP_PROJECTED_VALUATION_MARKS[position.id];
    const entry = valuationLabel(mark?.entryValuation ?? position.entryValuation);
    const markCell = mark ? valuationLabel(mark.latestValuation) : entry;
    const markDetail = mark
      ? `${markCell.detail} · ${mark.asOf} · ${mark.source}`
      : `${entry.detail} · no newer priced round · held at cost`;
    if (position.vehicleAllocation && mark) {
      // H256: the Anduril slice carries the scenario mark; the balance being
      // finalized stays at cost.
      const slice = mark.costBasisAmount ?? position.investedCost * position.vehicleAllocation.deployedShare;
      const sliceValue = projectedPositionValue(slice, { ...mark, costBasisAmount: undefined });
      rows.push({
        key: `${position.id}-anduril`,
        company: `${position.vehicleAllocation.deployedCompany} (H256)`,
        entry,
        mark: { ...markCell, detail: markDetail },
        markTip: mark.basis === "assumption"
          ? `Owner-directed $100B scenario from reported talks; not a closed round. ${formatWholeUsd(slice)} × ${markCell.label} ÷ ${entry.label}.`
          : undefined,
        markUrl: mark.sourceUrl,
        cost: slice,
        value: sliceValue,
        multiple: sliceValue / slice,
      });
      const pendingCost = position.investedCost - slice;
      rows.push({
        key: `${position.id}-pending`,
        company: "Finalizing allocation",
        companyNarrow: "Pending (H256)",
        entry: { label: "Pending", detail: "H256 balance being finalized between Atoms and Applied Intuition" },
        mark: { label: "Pending", detail: "Held at cost until deployed" },
        cost: pendingCost,
        value: pendingCost,
        multiple: 1,
        pending: true,
      });
      continue;
    }
    const value = projectedPositionValue(position.investedCost, mark, position.performance);
    rows.push({
      key: position.id,
      company: position.company,
      entry,
      mark: { ...markCell, detail: markDetail },
      markUrl: mark?.sourceUrl,
      cost: position.gift ? 0 : position.investedCost,
      value,
      // Gifts cost the fund $0; their multiple is mark ÷ entry.
      multiple: position.gift
        ? (mark ? mark.latestValuationAmount / mark.entryValuationAmount : 1)
        : value / position.investedCost,
      gift: position.gift,
    });
  }
  return rows.sort((left, right) =>
    right.multiple - left.multiple || right.value - left.value || left.company.localeCompare(right.company),
  );
}

function ValuationEvidence() {
  const rows = performanceRows();
  const fundCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const fundValue = rows.filter((row) => !row.gift).reduce((sum, row) => sum + row.value, 0);
  const giftValue = rows.filter((row) => row.gift).reduce((sum, row) => sum + row.value, 0);
  const totalValue = Math.round((fundValue + giftValue) * 100) / 100;
  const totalMultiple = totalValue / fundCost;
  if (Math.abs(fundCost - LETTER_INVESTED_TOTAL) > 0.005) {
    throw new Error(`Performance cost ${fundCost} does not tie to fund cost ${LETTER_INVESTED_TOTAL}`);
  }
  const tone = (multiple: number) => multiple > 1.00005 ? " is-gain" : multiple < 0.99995 ? " is-loss" : " is-flat";

  return (
    <section
      className="lp-figure-section lp-figure-section--standalone"
      aria-labelledby="lp-performance-section-title"
    >
      <h2 id="lp-performance-section-title" className="sr-only">Performance</h2>
      <LpScrollArea className="lp-figure-table-wrap">
        <table className="lp-figure-table lp-figure-table--marks lp-figure-table--perf">
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th scope="col" className="is-number" title="Valuation, cap or price at entry">Entry</th>
              <th scope="col" className="is-number" title="Latest verifiable valuation or price; no newer round = entry">Mark</th>
              <th scope="col" className="is-number">Cost</th>
              <th scope="col" className="is-number">
                Value
                <LpTip label="Value column" text="Cost × mark ÷ entry. No newer round: mark = entry, value = cost." />
              </th>
              <th scope="col" className="is-number">
                <span className="lp-perf-wide">Multiple</span>
                <span className="lp-perf-narrow">Mult</span>
                <LpTip label="Multiple column" text="Value ÷ cost. Gifts ($0 cost): mark ÷ entry." />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const markContent = row.markUrl ? (
                <a href={row.markUrl} target="_blank" rel="noreferrer"><ValuationText cell={row.mark} /></a>
              ) : (
                <ValuationText cell={row.mark} />
              );
              const className = [
                row.multiple > 1.00005 ? "has-gain" : null,
                row.gift ? "is-gift" : null,
                row.pending ? "lp-performance-pending-row" : null,
              ].filter(Boolean).join(" ") || undefined;
              return (
                <tr key={row.key} className={className}>
                  <th scope="row">
                    {row.companyNarrow ? (
                      <strong>
                        <span className="lp-perf-wide">{row.company}</span>
                        <span className="lp-perf-narrow">{row.companyNarrow}</span>
                      </strong>
                    ) : (
                      <strong>{row.company}</strong>
                    )}
                  </th>
                  <td className="is-number" title={row.entry.detail}><ValuationText cell={row.entry} /></td>
                  <td className="is-number" title={row.mark.detail}>
                    {markContent}
                    {row.markTip ? <span className="lp-perf-mark-tip"><LpTip label={`${row.company} mark`} text={row.markTip} /></span> : null}
                  </td>
                  <td className="is-number" title={row.gift ? "Gifted: $0 cost to the fund" : formatWholeUsd(row.cost)}>
                    {row.gift ? <small className="lp-gift-label">Gift</small> : formatCompactUsd(row.cost)}
                  </td>
                  <td className="is-number" title={formatWholeUsd(row.value)} data-carried={Math.round(row.value * 100)}>
                    {formatCompactUsd(row.value)}
                  </td>
                  <td className={`is-number lp-performance-change${tone(row.multiple)}`}>
                    {row.multiple.toFixed(2)}×
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="lp-performance-total-row">
              <th scope="row">Total</th>
              <td />
              <td />
              <td className="is-number" title={formatWholeUsd(fundCost)}>
                <span className="lp-perf-wide">{formatWholeUsd(fundCost)}</span>
                <span className="lp-perf-narrow">{formatCompactUsd(fundCost)}</span>
              </td>
              <td className="is-number" title={formatWholeUsd(totalValue)} data-carried={Math.round(totalValue * 100)}>
                <span className="lp-perf-wide">{formatWholeUsd(totalValue)}</span>
                <span className="lp-perf-narrow">{totalValue >= 1_000_000 ? `$${(totalValue / 1_000_000).toFixed(2)}M` : formatCompactUsd(totalValue)}</span>
              </td>
              <td className={`is-number lp-performance-change${tone(totalMultiple)}`}>
                {totalMultiple.toFixed(2)}×
                <LpTip
                  up
                  label="Total multiple"
                  text={`(Fund ${formatWholeUsd(fundValue)} + gifted ${formatWholeUsd(giftValue)}) ÷ fund cost ${formatWholeUsd(fundCost)} = ${totalMultiple.toFixed(2)}×. Value = Projected.`}
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
