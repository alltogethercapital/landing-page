import { ValuationText } from "@/components/lp-letter-figures";
import {
  formatLpDetailDate,
  type LpCompanyChartPoint,
  type LpCompanyDetail,
} from "@/lib/lp-company-detail";
import { formatCompactUsd, formatWholeUsd } from "@/lib/lp-format";

const CHART = { width: 440, height: 132, left: 46, right: 12, top: 14, bottom: 20 };

function tone(multiple: number) {
  return multiple > 1.00005 ? " is-gain" : multiple < 0.99995 ? " is-loss" : " is-flat";
}

function yearLabel(time: number) {
  return String(new Date(time).getUTCFullYear());
}

// Post-money valuation over time on a log scale, so seed-to-growth rounds
// stay readable. Undisclosed rounds are not plotted.
function ValuationChart({ rounds, entries, name }: { rounds: LpCompanyChartPoint[]; entries: LpCompanyChartPoint[]; name: string }) {
  const all = [...rounds, ...entries];
  const values = all.map((point) => Math.log10(point.value));
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (maxValue - minValue < 0.3) {
    minValue -= 0.15;
    maxValue += 0.15;
  }
  const valuePad = (maxValue - minValue) * 0.12;
  minValue -= valuePad;
  maxValue += valuePad;
  let minTime = Math.min(...all.map((point) => point.time));
  let maxTime = Math.max(...all.map((point) => point.time));
  const day = 86_400_000;
  if (maxTime - minTime < 120 * day) {
    minTime -= 60 * day;
    maxTime += 60 * day;
  }
  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  const x = (time: number) => CHART.left + ((time - minTime) / (maxTime - minTime)) * plotWidth;
  const y = (value: number) => CHART.top + (1 - (Math.log10(value) - minValue) / (maxValue - minValue)) * plotHeight;
  const path = rounds.map((point, index) => `${index ? "L" : "M"}${x(point.time).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
  const top = Math.max(...all.map((point) => point.value));
  const bottom = Math.min(...all.map((point) => point.value));
  const last = rounds[rounds.length - 1];
  const showBottom = bottom !== top && y(bottom) - y(top) >= 14;
  const firstYear = yearLabel(minTime);
  const lastYear = yearLabel(maxTime);
  const summary = rounds.map((point) => `${formatLpDetailDate(point.date, "month")} ${point.label}`).join(", ");

  return (
    <figure className="lp-cd-chart">
      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        role="img"
        aria-label={`${name} post-money valuation: ${summary}`}
      >
        <line className="lp-cd-chart-grid" x1={CHART.left} x2={CHART.width - CHART.right} y1={y(top)} y2={y(top)} />
        {showBottom ? (
          <line className="lp-cd-chart-grid" x1={CHART.left} x2={CHART.width - CHART.right} y1={y(bottom)} y2={y(bottom)} />
        ) : null}
        <text className="lp-cd-chart-axis" x={CHART.left - 6} y={y(top) + 4} textAnchor="end">{formatCompactUsd(top)}</text>
        {showBottom ? (
          <text className="lp-cd-chart-axis" x={CHART.left - 6} y={y(bottom) + 4} textAnchor="end">{formatCompactUsd(bottom)}</text>
        ) : null}
        <text className="lp-cd-chart-axis" x={CHART.left} y={CHART.height - 4} textAnchor="start">{firstYear}</text>
        {lastYear !== firstYear ? (
          <text className="lp-cd-chart-axis" x={CHART.width - CHART.right} y={CHART.height - 4} textAnchor="end">{lastYear}</text>
        ) : null}
        {rounds.length > 1 ? <path className="lp-cd-chart-line" d={path} /> : null}
        {rounds.map((point) => (
          <circle key={`r-${point.date}-${point.value}`} className="lp-cd-chart-dot" cx={x(point.time)} cy={y(point.value)} r={3} />
        ))}
        {entries.map((point) => (
          <circle key={`e-${point.date}-${point.value}`} className="lp-cd-chart-entry" cx={x(point.time)} cy={y(point.value)} r={5.5} />
        ))}
        {last ? (
          <text
            className="lp-cd-chart-value"
            x={Math.min(x(last.time), CHART.width - CHART.right)}
            y={Math.max(y(last.value) - 9, 11)}
            textAnchor={x(last.time) > CHART.width - 70 ? "end" : "middle"}
          >
            {last.label}
          </text>
        ) : null}
      </svg>
      <figcaption className="lp-cd-chart-legend">
        <span><i className="lp-cd-key-dot" aria-hidden="true" />Post-money</span>
        {entries.length ? <span><i className="lp-cd-key-entry" aria-hidden="true" />Our entry</span> : null}
      </figcaption>
    </figure>
  );
}

export function LpCompanyDetailView({
  detail,
  headingId,
  showPosition = true,
}: {
  detail: LpCompanyDetail;
  headingId: string;
  showPosition?: boolean;
}) {
  return (
    <div className="lp-cd">
      <header className="lp-cd-head">
        <h2 id={headingId}>{showPosition ? detail.name : "Funding history"}</h2>
        {showPosition ? (
          <p className="lp-cd-meta">
            <span>{detail.descriptor}</span>
          </p>
        ) : null}
        <p className="lp-cd-meta lp-cd-meta--sub">
          <span>{detail.sector}</span>
          {detail.website ? (
            <a href={detail.website} target="_blank" rel="noreferrer">
              Website ↗
            </a>
          ) : null}
        </p>
      </header>

      {showPosition ? (
      <section className="lp-cd-section" aria-label="Our position">
        <h3>{detail.positions.length > 1 ? "Positions" : "Position"}</h3>
        {detail.positions.map((position) => (
          <div key={position.id} className="lp-cd-position">
            <p className="lp-cd-position-label">
              {position.label}
              {position.gift ? <small className="lp-gift-label">Gift</small> : null}
            </p>
            <dl className="lp-cd-stats">
              <div><dt>Entry</dt><dd title={position.entry.detail}><ValuationText cell={position.entry} /></dd></div>
              <div>
                <dt>Mark</dt>
                <dd title={position.mark.detail}>
                  {position.markUrl ? (
                    <a href={position.markUrl} target="_blank" rel="noreferrer"><ValuationText cell={position.mark} /></a>
                  ) : (
                    <ValuationText cell={position.mark} />
                  )}
                </dd>
              </div>
              <div>
                <dt>Cost</dt>
                <dd title={position.gift ? "Gifted: $0 cost to the fund" : formatWholeUsd(position.cost)}>
                  {position.gift ? "$0" : formatCompactUsd(position.cost)}
                </dd>
              </div>
              <div><dt>Value</dt><dd title={formatWholeUsd(position.value)}>{formatCompactUsd(position.value)}</dd></div>
              <div>
                <dt>Multiple</dt>
                <dd className={`lp-performance-change${tone(position.multiple)}`}>{position.multiple.toFixed(2)}×</dd>
              </div>
            </dl>
          </div>
        ))}
      </section>
      ) : null}

      {detail.chart ? (
        <section className="lp-cd-section" aria-label="Valuation over time">
          <h3>Valuation</h3>
          <ValuationChart rounds={detail.chart.rounds} entries={detail.chart.entries} name={detail.name} />
        </section>
      ) : null}

      <section className="lp-cd-section" aria-label="Funding rounds">
        <h3>Rounds</h3>
        <table className="lp-cd-table lp-cd-rounds">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Round</th>
              <th scope="col" className="is-number">Raised</th>
              <th scope="col" className="is-number">Post</th>
              <th scope="col" className="lp-cd-lead">Lead</th>
            </tr>
          </thead>
          <tbody>
            {detail.rounds.map((round) => (
              <tr key={`${round.date}-${round.round}-${round.entryRow}`} className={round.ours ? "is-ours" : undefined}>
                <td>{formatLpDetailDate(round.date, "month")}</td>
                <th scope="row">
                  {round.sourceUrl ? (
                    <a href={round.sourceUrl} target="_blank" rel="noreferrer">{round.round}</a>
                  ) : round.round}
                </th>
                <td className={`is-number${round.raised === "undisclosed" ? " is-undisclosed" : ""}`}>{round.raised}</td>
                <td className={`is-number${round.valuation === "undisclosed" ? " is-undisclosed" : ""}`}>{round.valuation}</td>
                <td className="lp-cd-lead">{round.lead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {detail.news.length ? (
        <section className="lp-cd-section" aria-label="Recent news">
          <h3>News</h3>
          <ul className="lp-cd-news">
            {detail.news.map((item) => (
              <li key={item.url + item.title}>
                <span className="lp-cd-news-date">{formatLpDetailDate(item.date)}</span>
                <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                <span className="lp-cd-news-source">{item.source}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="lp-cd-foot">Public sources · reviewed {formatLpDetailDate(detail.lastReviewed)}</p>
    </div>
  );
}
