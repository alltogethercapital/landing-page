import {
  LETTER_ACCESS_CHANNEL_SPLIT,
  LETTER_ALLOCATION,
  LETTER_COMPANY_COUNT,
  LETTER_CONCENTRATION_CURVE,
  LETTER_DEPLOYMENT,
  LETTER_ENTRY_BUCKETS,
  LETTER_ENTRY_HIGH,
  LETTER_ENTRY_LOW,
  LETTER_ENTRY_MEDIAN,
  LETTER_ENTRY_ROUND_SPLIT,
  LETTER_ENTRY_SPREAD,
  LETTER_INVESTED_TOTAL,
  LETTER_POOLED_SHARE,
  LETTER_POSITION_TYPE_SPLIT,
  LETTER_POSITIONS,
  LETTER_PRICED_COST,
  LETTER_PRICED_POSITIONS,
  LETTER_PRIMARY_EQUITY_SHARE,
  LETTER_REMAINDER_AVERAGE,
  LETTER_SECONDARY_EQUITY_SHARE,
  LETTER_TOP_FIVE_SHARE,
  LETTER_TOP_POSITIONS,
  LETTER_TOP_TEN_SHARE,
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

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

// Sentences do not open on a numeral.
function spellOut(value: number) {
  const word = NUMBER_WORDS[value];
  return word ? word[0].toUpperCase() + word.slice(1) : String(value);
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

function PortfolioAtAGlance({
  grossValue,
  positionCount,
}: {
  grossValue: number;
  positionCount: number;
}) {
  const allocationScale = Math.max(...LETTER_ALLOCATION.map((row) => row.share));
  const sortedCost = [...LETTER_POSITIONS].sort((a, b) => a.investedCost - b.investedCost);
  const medianPosition =
    (sortedCost[positionCount / 2 - 1].investedCost + sortedCost[positionCount / 2].investedCost) / 2;
  const smallPositions = LETTER_POSITIONS.filter((p) => p.investedCost <= 10_000).length;

  const deploymentMax = LETTER_DEPLOYMENT[LETTER_DEPLOYMENT.length - 1].cumulative;
  const start = Date.UTC(2025, 9, 1);
  const end = Date.UTC(2026, 7, 31);
  const chartX = (date: string) =>
    ((new Date(`${date}T00:00:00Z`).getTime() - start) / (end - start)) * 100;
  const chartY = (value: number) => 100 - (value / deploymentMax) * 100;
  const gridValues = [0, 0.25, 0.5, 0.75, 1];
  const axisMonths = ["2025-10-01", "2025-12-01", "2026-02-01", "2026-04-01", "2026-06-01", "2026-08-01"];

  const stats = [
    { label: "Invested capital", value: currency(LETTER_INVESTED_TOTAL), note: `across ${positionCount} positions` },
    { label: "Companies", value: String(LETTER_COMPANY_COUNT), note: "1X held in two rounds" },
    { label: "Directional gross view", value: currency(grossValue), note: `${(grossValue / LETTER_INVESTED_TOTAL).toFixed(2)}× invested cost` },
    { label: "Unrealized", value: `+${currency(grossValue - LETTER_INVESTED_TOTAL)}`, note: "sourced comparable marks" },
    { label: "Median position", value: dollars(medianPosition), note: `${smallPositions} positions at $10k or less` },
    { label: "Deployment window", value: "10 months", note: "Oct 2025 – Aug 2026" },
  ];

  return (
    <FigureSection id="portfolio-at-a-glance" title="Portfolio at a glance">
      <div className="lp-figure-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
            <p>{stat.note}</p>
          </div>
        ))}
      </div>

      <FigureHeading
        title="Allocation by sector"
        note={`Share of invested cost · ${currency(LETTER_INVESTED_TOTAL)}`}
      />
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
              index === 0
                ? `${percent(H256_VEHICLE_ALLOCATION.deployedShare, 0)} ${H256_VEHICLE_ALLOCATION.deployedCompany} · ${percent(H256_VEHICLE_ALLOCATION.awaitingShare, 0)} in vehicle pending next company`
                : undefined
            }
          />
        ))}
      </div>
      <p className="lp-figure-note">
        The $200,000 H256 LLC Series 3 vehicle remains one portfolio position. As of August 17, 2026,
        {` ${percent(H256_VEHICLE_ALLOCATION.deployedShare, 0)}`} had been deployed into{" "}
        {H256_VEHICLE_ALLOCATION.deployedCompany}; the remaining{" "}
        {percent(H256_VEHICLE_ALLOCATION.awaitingShare, 0)} remained in the vehicle awaiting its next
        underlying company, for which it is evaluating Applied Intuition or Atoms. All Together&apos;s
        separate direct Atoms investment is listed independently in the <a href="/lp">portfolio</a>.
      </p>

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
          Cumulative invested cost rising from {currency(LETTER_DEPLOYMENT[0].cumulative)} in October
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
      <p className="lp-figure-note">
        Two positions predate the fund&apos;s active period (1X, October 2025; Figure AI, December
        2025). The remaining {positionCount - 2} were made between April and August 2026.
      </p>
    </FigureSection>
  );
}

/* 02 — Concentration and structure ------------------------------------------ */

function ConcentrationAndStructure({ positionCount }: { positionCount: number }) {
  const scale = Math.max(...LETTER_TOP_POSITIONS.map((row) => row.share));
  return (
    <FigureSection id="concentration-and-structure" title="Concentration and structure">
      <FigureHeading title="Ten largest positions" note="Share of invested cost" />
      <div className="lp-figure-bars">
        {LETTER_TOP_POSITIONS.map((row, index) => (
          <BarRow
            key={row.id}
            label={row.label}
            share={row.share}
            scale={scale}
            amount={row.amount}
            lead={index === 0}
            detail={
              row.id === "09-h256-series-3"
                ? `${percent(H256_VEHICLE_ALLOCATION.deployedShare, 0)} ${H256_VEHICLE_ALLOCATION.deployedCompany} · ${percent(H256_VEHICLE_ALLOCATION.awaitingShare, 0)} in vehicle pending next company`
                : undefined
            }
          />
        ))}
      </div>
      <p className="lp-figure-note">
        The five largest positions are {percent(LETTER_TOP_FIVE_SHARE)} of invested cost; the ten
        largest are {percent(LETTER_TOP_TEN_SHARE)}. The remaining {positionCount - 10} positions
        average {dollars(LETTER_REMAINDER_AVERAGE)}.
      </p>

      <div className="lp-figure-triptych">
        <CompactBars title="Position type" rows={LETTER_POSITION_TYPE_SPLIT} />
        <CompactBars title="Entry round" rows={LETTER_ENTRY_ROUND_SPLIT} />
        <CompactBars title="Access channel" rows={LETTER_ACCESS_CHANNEL_SPLIT} />
      </div>
      <p className="lp-figure-note">
        Primary and secondary company equity together account for{" "}
        {percent(LETTER_PRIMARY_EQUITY_SHARE + LETTER_SECONDARY_EQUITY_SHARE)} of invested cost. Fund
        / SPV interests — the H256 series, Hark and Blue Origin — account for{" "}
        {percent(LETTER_POOLED_SHARE)} and are presented as the legal positions All Together owns, not
        as direct ownership of the vehicles&apos; underlying company shares.
      </p>
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
      <p className="lp-figure-lede">
        The portfolio is a barbell. We hold seed companies priced in the tens of millions alongside a
        small number of the largest private companies in the world, and very little in between.
      </p>

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
          Entry prices for {LETTER_PRICED_POSITIONS.length} priced positions, from{" "}
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
      <p className="lp-figure-note">
        {LETTER_PRICED_POSITIONS.length} of {LETTER_POSITIONS.length} positions carry a company price
        at entry. Three do not: the H256 vehicle is sized on its fund, Lance AI was an uncapped SAFE,
        and Maven Robotics priced against a financing model. The spread from lowest to highest entry
        price is roughly{" "}
        <strong>{new Intl.NumberFormat("en-US").format(Math.round(LETTER_ENTRY_SPREAD / 1000) * 1000)}×</strong>;
        the median is <strong>{valuationLabel(LETTER_ENTRY_MEDIAN)}</strong>.
      </p>

      <div className="lp-figure-pair">
        <div>
          <FigureHeading title="Cost by entry valuation" />
          <div className="lp-figure-bars lp-figure-bars--tight">
            {LETTER_ENTRY_BUCKETS.map((row) => (
              <BarRow key={row.key} label={row.label} share={row.share} scale={bucketScale} />
            ))}
          </div>
          <p className="lp-figure-note">
            Share of the {currency(LETTER_PRICED_COST, 0)} that carries a company price.
          </p>
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
          <p className="lp-figure-note">
            Cumulative share of invested cost. The diagonal is a perfectly even portfolio.
          </p>
        </div>
      </div>
    </FigureSection>
  );
}

/* 04 — Valuation evidence --------------------------------------------------- */

function ValuationEvidence({ grossValue }: { grossValue: number }) {
  const marks = Object.entries(LP_PROJECTED_VALUATION_MARKS).map(([id, mark]) => {
    const position = LP_INVESTMENTS.find((entry) => entry.id === id)!;
    const multiple = mark.latestValuationAmount / mark.entryValuationAmount;
    return {
      id,
      company: position.company,
      round: position.round,
      cost: position.investedCost,
      entry: position.entryValuation,
      mark,
      multiple,
      carried: position.investedCost * multiple,
    };
  });
  const markedCost = marks.reduce((sum, mark) => sum + mark.cost, 0);
  const heldAtCost = LETTER_INVESTED_TOTAL - markedCost;
  const heldCount = LETTER_POSITIONS.length - marks.length;

  return (
    <FigureSection id="valuation-evidence" title="Valuation evidence">
      <p className="lp-figure-lede">
        We mark a position only where a sourced comparable financing gives us something to mark
        against. {spellOut(marks.length)} do. The other {heldCount} are held at cost.
      </p>

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
              <th scope="row">{heldCount} positions held at cost</th>
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
              <td className="is-number">{currency(LETTER_INVESTED_TOTAL)}</td>
              <td className="is-number">{(grossValue / LETTER_INVESTED_TOTAL).toFixed(2)}×</td>
              <td className="is-number">{currency(grossValue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="lp-figure-note">
        Every mark above is drawn from a priced round at a company we already hold. None of it is a
        mark we set ourselves. Where a company has re-rated since we bought and we could not source
        the round, we have not taken credit for it.
      </p>

    </FigureSection>
  );
}

/* ---------------------------------------------------------------------------- */

export function LpLetterFigures({
  grossValue,
  positionCount,
}: {
  grossValue: number;
  positionCount: number;
}) {
  return (
    <div className="lp-figure-suite">
      <PortfolioAtAGlance grossValue={grossValue} positionCount={positionCount} />
      <ConcentrationAndStructure positionCount={positionCount} />
      <WhereWeBought />
      <ValuationEvidence grossValue={grossValue} />
    </div>
  );
}
