import type { CSSProperties } from "react";
import {
  LP_LETTER_THEMES,
  LP_LETTER_US_GDP,
} from "@/data/lp-investor-letter";

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function barStyle(value: number): CSSProperties {
  return { "--lp-letter-value": `${value}%` } as CSSProperties;
}

export function LpLetterAiScale() {
  return (
    <figure className="lp-letter-figure lp-letter-ai-figure">
      <figcaption>
        <span>AI at scale</span>
        <strong>Capital, adoption, and infrastructure are compounding together.</strong>
      </figcaption>
      <div className="lp-letter-ai-grid">
        <div>
          <strong>+127.5%</strong>
          <span>Private AI investment growth in 2025</span>
        </div>
        <div>
          <strong>88%</strong>
          <span>Organizations reporting AI use</span>
        </div>
        <div>
          <strong>17.1M</strong>
          <span>H100-equivalents of global AI compute</span>
        </div>
        <div>
          <strong>5,427</strong>
          <span>Data centers hosted in the United States</span>
        </div>
      </div>
      <div className="lp-letter-ratio" role="img" aria-label="United States private AI investment was 23 times China's private AI investment in 2025">
        <div>
          <span>U.S.</span>
          <div className="lp-letter-ratio-dots" aria-hidden="true">
            {Array.from({ length: 23 }, (_, index) => <i key={index} />)}
          </div>
          <strong>23×</strong>
        </div>
        <div>
          <span>China</span>
          <div className="lp-letter-ratio-dots" aria-hidden="true"><i /></div>
          <strong>1×</strong>
        </div>
      </div>
      <p>Relative private AI investment, 2025. Source: Stanford HAI 2026 AI Index.</p>
    </figure>
  );
}

export function LpLetterPowerDemand() {
  return (
    <figure className="lp-letter-figure lp-letter-power-figure">
      <figcaption>
        <span>The physical bill comes due</span>
        <strong>Electricity generation supplying global data centers</strong>
      </figcaption>
      <div className="lp-letter-power-bars" role="img" aria-label="Electricity generation supplying data centers rises from about 460 terawatt-hours in 2024 to more than 1,000 terawatt-hours in 2030">
        <div>
          <span className="lp-letter-power-bar" style={barStyle(46)} />
          <small>2024</small>
          <strong>≈460 TWh</strong>
        </div>
        <div>
          <span className="lp-letter-power-bar" style={barStyle(100)} />
          <small>2030</small>
          <strong>&gt;1,000 TWh</strong>
        </div>
      </div>
      <p>IEA base case. The 2030 figure is a projection, not an observed result.</p>
    </figure>
  );
}

export function LpLetterMacroPulse() {
  const maxGdp = 2.4;

  return (
    <figure className="lp-letter-figure lp-letter-macro-figure">
      <figcaption>
        <span>Macro pulse</span>
        <strong>Growth continues, but neither money nor geopolitics is easy.</strong>
      </figcaption>
      <div className="lp-letter-macro-grid">
        <div className="lp-letter-gdp-chart" role="img" aria-label="United States annualized real GDP growth was 0.5 percent in the fourth quarter of 2025, 2.1 percent in the first quarter of 2026, and 1.5 percent in the second quarter of 2026">
          <p>U.S. real GDP, annualized</p>
          <div>
            {LP_LETTER_US_GDP.map((item) => (
              <span key={item.period}>
                <i style={barStyle((item.value / maxGdp) * 100)} />
                <strong>{item.value.toFixed(1)}%</strong>
                <small>{item.period}</small>
              </span>
            ))}
          </div>
        </div>
        <dl>
          <div><dt>Federal-funds target</dt><dd>3.50–3.75%</dd><small>July 29, 2026</small></div>
          <div><dt>Global growth</dt><dd>3.0%</dd><small>IMF 2026 projection</small></div>
          <div><dt>Global growth</dt><dd>3.4%</dd><small>IMF 2027 projection</small></div>
        </dl>
      </div>
      <p>Sources: U.S. BEA, Federal Reserve, and IMF. Q2 2026 U.S. GDP is an advance estimate.</p>
    </figure>
  );
}

export function LpLetterFundAllocation() {
  return (
    <figure className="lp-letter-figure lp-letter-fund-figure">
      <figcaption>
        <span>Portfolio construction</span>
        <strong>Invested cost by Manager-classified theme</strong>
      </figcaption>
      <div className="lp-letter-theme-chart">
        {LP_LETTER_THEMES.map((theme) => (
          <div key={theme.label}>
            <div>
              <strong>{theme.label}</strong>
              <span>{theme.positions} {theme.positions === 1 ? "position" : "positions"} · {currency(theme.amount)}</span>
            </div>
            <span className="lp-letter-theme-track" aria-hidden="true">
              <i style={barStyle(theme.share)} />
            </span>
            <b>{theme.share.toFixed(1)}%</b>
          </div>
        ))}
      </div>
      <p>As of August 13, 2026. H256 is shown as a vehicle; this chart does not estimate its look-through exposure.</p>
    </figure>
  );
}
