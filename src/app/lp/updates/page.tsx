import type { Metadata } from "next";
import Link from "next/link";
import {
  LpLetterAiScale,
  LpLetterFundAllocation,
  LpLetterMacroPulse,
  LpLetterPowerDemand,
} from "@/components/lp-letter-charts";
import {
  LP_LETTER_FUND_SNAPSHOT,
  LP_LETTER_PORTFOLIO_AS_OF,
  LP_LETTER_PUBLISHED,
  LP_LETTER_SOURCES,
  type LpLetterSourceId,
} from "@/data/lp-investor-letter";

export const metadata: Metadata = {
  title: "August 2026 Investor Letter — All Together Investor Portal",
  description: "All Together's inaugural private investor update.",
  robots: { index: false, follow: false, nocache: true },
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function Citation({ source }: { source: LpLetterSourceId }) {
  const index = LP_LETTER_SOURCES.findIndex((item) => item.id === source);
  if (index < 0) return null;

  return (
    <a
      className="lp-letter-citation"
      href={`#source-${source}`}
      aria-label={`See source ${index + 1}`}
    >
      {index + 1}
    </a>
  );
}

export default function LpInvestorUpdatePage() {
  const snapshot = LP_LETTER_FUND_SNAPSHOT;

  return (
    <article className="lp-portal-shell lp-letter-shell">
      <header className="lp-letter-hero">
        <div className="lp-letter-issue" aria-hidden="true">01</div>
        <div>
          <p className="lp-eyebrow">Investor letter · August 2026</p>
          <h1>The bottleneck moved.</h1>
          <p className="lp-letter-deck">
            Intelligence is getting cheaper and more capable. The scarce assets are shifting to
            power, compute, machines, industrial capacity, and the right to operate.
          </p>
        </div>
        <dl className="lp-letter-dateline">
          <div><dt>Published</dt><dd>{LP_LETTER_PUBLISHED}</dd></div>
          <div><dt>Portfolio data</dt><dd>{LP_LETTER_PORTFOLIO_AS_OF}</dd></div>
          <div><dt>Audience</dt><dd>All Together investors</dd></div>
        </dl>
      </header>

      <div className="lp-letter-body">
        <aside className="lp-letter-margin-note">
          <span>From the Managers</span>
          <p>Robert Neir<br />Hisham El-Husseini</p>
        </aside>

        <div className="lp-letter-prose">
          <p className="lp-letter-salutation">To our investors,</p>
          <p className="lp-letter-opening">
            We should have written sooner. This is our first formal update since we began deploying
            capital, and the omission is ours. A portfolio deserves more than a dashboard. It needs
            an account of what we believe, where the facts have changed, and how those changes affect
            the way we invest.
          </p>
          <p>
            Our central view is simple. The model layer of artificial intelligence remains important,
            but the economic contest around it has widened. The next durable companies will not all
            look like software companies. Many will sell electricity, chips, cooling, robots, sensors,
            manufacturing capacity, security, and access to places that are difficult to reach.
          </p>
        </div>
      </div>

      <section className="lp-letter-section" aria-labelledby="state-of-ai">
        <div className="lp-letter-section-number">I</div>
        <div className="lp-letter-section-copy">
          <p className="lp-eyebrow">The state of AI</p>
          <h2 id="state-of-ai">Capability is compounding. So is the bill.</h2>
          <p>
            Global corporate AI investment more than doubled in 2025. Private investment rose
            127.5%, and 88% of surveyed organizations said they were using AI somewhere in the
            business.<Citation source="ai-economy" /> Those figures settle one question: adoption is
            real. They do not settle the harder question of where returns will accrue.
          </p>
          <p>
            The best models are clustered more tightly than the public narrative suggests. As of
            March, the leading U.S. model was only 2.7% ahead of the leading Chinese model on the
            AI Index&rsquo;s composite measure.<Citation source="ai-performance" /> When model quality
            converges, cost, reliability, distribution, proprietary data, and physical infrastructure
            matter more.
          </p>
        </div>
      </section>

      <LpLetterAiScale />

      <div className="lp-letter-body lp-letter-body--after-figure">
        <aside className="lp-letter-margin-note">
          <span>What changed</span>
          <p>The debate moved from whether AI works to who can supply it economically and at scale.</p>
        </aside>
        <div className="lp-letter-prose">
          <p>
            Compute capacity grew at roughly 3.3 times per year from 2022 through 2025, reaching an
            estimated 17.1 million H100-equivalents.<Citation source="ai-research" /> That is an
            extraordinary industrial buildout. It also means AI is no longer separable from the
            power grid, semiconductor supply, water, construction, and permitting.
          </p>
          <p>
            Software still matters. We own exposure to frontier models, development tools, data
            infrastructure, and inference systems. But we think the less crowded opportunities are
            increasingly found one or two layers away from the obvious winner: lower-cost inference,
            purpose-built hardware, energy, robotics, and the industrial systems that turn intelligence
            into useful work.
          </p>
        </div>
      </div>

      <LpLetterPowerDemand />

      <section className="lp-letter-section" aria-labelledby="state-of-america">
        <div className="lp-letter-section-number">II</div>
        <div className="lp-letter-section-copy">
          <p className="lp-eyebrow">The state of America</p>
          <h2 id="state-of-america">The lead is real. It is not guaranteed.</h2>
          <p>
            The United States attracted approximately $285.9 billion of private AI investment in
            2025.<Citation source="ai-policy" /> It produced 59 notable models to China&rsquo;s 35, and it
            hosts 5,427 data centers, more than ten times any other country.<Citation source="ai-research" />
            The combination of capital, research institutions, cloud infrastructure, and ambitious
            founders remains difficult to match.
          </p>
          <p>
            Yet the economy is not frictionless. Real GDP grew at a 1.5% annualized rate in the
            second quarter, down from 2.1% in the first.<Citation source="us-gdp" /> The federal-funds
            target remains 3.50% to 3.75%.<Citation source="fed" /> Capital is available, but it is not
            cheap. That is healthy pressure on companies whose economics depend on permanent subsidy
            or repeated valuation expansion.
          </p>
        </div>
      </section>

      <LpLetterMacroPulse />

      <div className="lp-letter-body lp-letter-body--after-figure">
        <aside className="lp-letter-margin-note">
          <span>Our American thesis</span>
          <p>Back builders who deepen the country&rsquo;s productive capacity, not only its digital consumption.</p>
        </aside>
        <div className="lp-letter-prose">
          <p>
            We are constructive on the United States because it can still assemble talent, capital,
            research, and customers at unusual speed. We are cautious because the constraints are
            visible: power availability, transmission, skilled labor, advanced manufacturing,
            permitting, and concentrated semiconductor supply.
          </p>
          <p>
            Those constraints are investable. Energy, defense, space, robotics, and domestic
            manufacturing are not side themes to the AI boom. They are part of the same system.
          </p>
        </div>
      </div>

      <section className="lp-letter-section" aria-labelledby="state-of-world">
        <div className="lp-letter-section-number">III</div>
        <div className="lp-letter-section-copy">
          <p className="lp-eyebrow">The state of the world</p>
          <h2 id="state-of-world">Technology is becoming state capacity.</h2>
          <p>
            The IMF expects global growth of 3.0% in 2026 and 3.4% in 2027, but describes a deeply
            uneven outlook shaped by war, energy exposure, and technology demand.<Citation source="world-growth" />
            The world is not separating into clean blocs. It is reorganizing around the supply chains
            that governments and companies cannot afford to lose.
          </p>
          <p>
            Semiconductors, energy, communications, autonomous systems, launch capacity, and cyber
            defense now sit inside national strategy. This can create durable demand, but it also
            creates export controls, procurement risk, political scrutiny, and long sales cycles.
            We want exposure to these markets without pretending that government demand removes
            execution risk.
          </p>
        </div>
      </section>

      <aside className="lp-letter-pullquote">
        <p>
          The venture market is open at the top and selective everywhere else. That is a better
          environment for discipline than the headline numbers suggest.
        </p>
      </aside>

      <div className="lp-letter-body">
        <aside className="lp-letter-margin-note">
          <span>Venture capital</span>
          <strong>&gt;$400B</strong>
          <p>Raised by U.S. startups in the first half of 2026.</p>
        </aside>
        <div className="lp-letter-prose">
          <p>
            U.S. startups raised more than $400 billion in the first half of 2026, already more than
            any prior full year. The same report says the overwhelming majority went to AI companies
            and rounds of at least $100 million.<Citation source="venture-monitor" /> This is not a
            broad return to easy venture financing. It is a concentration event.
          </p>
          <p>
            For us, that means access alone is not an edge. Price, structure, information rights,
            technical judgment, and the ability to walk away matter more when capital crowds into a
            small set of names.
          </p>
        </div>
      </div>

      <section className="lp-letter-section lp-letter-section--fund" aria-labelledby="state-of-fund">
        <div className="lp-letter-section-number">IV</div>
        <div className="lp-letter-section-copy">
          <p className="lp-eyebrow">The state of the fund</p>
          <h2 id="state-of-fund">Broad enough to learn. Young enough to stay humble.</h2>
          <p>
            As of {LP_LETTER_PORTFOLIO_AS_OF}, we had deployed {currency(snapshot.investedCost)} across
            {` ${snapshot.positions} positions in ${snapshot.companies} companies`}. The portfolio&rsquo;s
            directional gross value was {currency(snapshot.projectedGrossValue)}, or approximately
            {` ${snapshot.projectedGrossMultiple.toFixed(2)}×`} invested cost. That figure uses sourced
            comparable financings for six positions and holds the rest at cost. It is not audited NAV,
            and it is far too early to call it performance.
          </p>
        </div>
      </section>

      <dl className="lp-letter-fund-stats" aria-label="Fund snapshot">
        <div><dt>Invested cost</dt><dd>{currency(snapshot.investedCost)}</dd></div>
        <div><dt>Positions</dt><dd>{snapshot.positions}</dd></div>
        <div><dt>Companies</dt><dd>{snapshot.companies}</dd></div>
        <div><dt>Directional gross view</dt><dd>{snapshot.projectedGrossMultiple.toFixed(2)}×</dd></div>
      </dl>

      <LpLetterFundAllocation />

      <div className="lp-letter-body lp-letter-body--after-figure">
        <aside className="lp-letter-margin-note">
          <span>Construction note</span>
          <p>Our five largest positions represent approximately half of invested cost.</p>
        </aside>
        <div className="lp-letter-prose">
          <p>
            We built breadth quickly. That gave us a live map of the market across models, compute,
            robotics, energy, aerospace, defense, and applications. It also gave us a clearer view of
            where we need to improve. H256 alone represents 29.6% of invested cost and does not give
            us the same look-through clarity as a direct position. We will not treat that concentration
            as a template for future construction.
          </p>
          <p>
            Forty-four positions are enough breadth for this stage. The next phase should be more
            selective, not simply more active. We intend to favor direct exposure, clearer economics,
            better information rights, and companies where technical progress can compound faster
            than capital requirements.
          </p>
        </div>
      </div>

      <section className="lp-letter-section" aria-labelledby="where-going">
        <div className="lp-letter-section-number">V</div>
        <div className="lp-letter-section-copy">
          <p className="lp-eyebrow">Where we are going</p>
          <h2 id="where-going">Fewer additions. Higher conviction.</h2>
          <p>
            Our strongest interest remains in four connected areas: efficient compute and inference;
            robotics and physical automation; power and industrial infrastructure; and defense,
            aerospace, and sovereign technology. We will still invest outside those areas when a
            founder has unusual insight, but we will not stretch the thesis to justify activity.
          </p>
        </div>
      </section>

      <ol className="lp-letter-priorities">
        <li><span>01</span><div><strong>Own the bottlenecks.</strong><p>Power, inference efficiency, chips, manufacturing, and deployment capacity should capture more of our attention.</p></div></li>
        <li><span>02</span><div><strong>Prefer direct understanding.</strong><p>We want cleaner access to company information, economics, and follow-on decisions.</p></div></li>
        <li><span>03</span><div><strong>Raise the proof threshold.</strong><p>A strong narrative is not enough. We want technical evidence, customer pull, or a credible route to both.</p></div></li>
        <li><span>04</span><div><strong>Protect flexibility.</strong><p>We will keep room for follow-ons and for opportunities that emerge when crowded markets reset.</p></div></li>
      </ol>

      <div className="lp-letter-body lp-letter-closing">
        <aside className="lp-letter-margin-note">
          <span>Next letter</span>
          <p>Our intention is to establish a quarterly cadence, with shorter notes when material events warrant them.</p>
        </aside>
        <div className="lp-letter-prose">
          <p>
            We are grateful that you trusted us before there was a long history to point to. That
            trust deserves candor. The portfolio is early, the marks are limited, and some of the most
            important outcomes are years away. What we can do now is show our work, state our risks,
            and keep improving the quality of each decision.
          </p>
          <p>Thank you for building this with us.</p>
          <p className="lp-letter-signoff">Robert and Hisham<br /><span>Joint Chancellery LLC · Manager</span></p>
        </div>
      </div>

      <section className="lp-letter-sources" aria-labelledby="letter-sources">
        <p className="lp-eyebrow">Notes and sources</p>
        <h2 id="letter-sources">The numbers behind the letter</h2>
        <ol>
          {LP_LETTER_SOURCES.map((source) => (
            <li key={source.id} id={`source-${source.id}`}>
              <span>{source.publisher}</span>
              <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
              <small>Accessed {source.accessed}</small>
            </li>
          ))}
        </ol>
      </section>

      <div className="lp-letter-disclaimer">
        <p>
          Private and confidential. For discussion purposes only. This letter is not an offer to sell
          or a solicitation to buy any security. Portfolio values are directional gross estimates,
          not audited NAV, and exclude fees, carry, taxes, future dilution, instrument-specific terms,
          and liquidity adjustments. Forward-looking statements involve risks and may differ materially
          from actual results.
        </p>
        <Link href="/lp">Return to portfolio</Link>
      </div>

      <footer className="lp-portal-footer">
        <span>All Together · Investor Letter 01</span>
        <span>Private and confidential</span>
      </footer>
    </article>
  );
}
