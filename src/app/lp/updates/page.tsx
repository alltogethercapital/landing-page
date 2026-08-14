import type { Metadata } from "next";
import Link from "next/link";
import {
  LP_LETTER_FUND_SNAPSHOT,
  LP_LETTER_PORTFOLIO_AS_OF,
  LP_LETTER_PUBLISHED,
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

export default function LpInvestorUpdatePage() {
  const snapshot = LP_LETTER_FUND_SNAPSHOT;

  return (
    <article className="lp-portal-shell lp-letter-simple">
      <header className="lp-letter-simple-header">
        <h1>Investor Letter</h1>
        <time dateTime="2026-08">{LP_LETTER_PUBLISHED}</time>
      </header>

      <div className="lp-letter-simple-copy">
        <p>To our investors,</p>

        <p>
          We owe you an update. This is our first formal letter since we began investing, and it should
          have come sooner. We will write quarterly from here, with shorter notes when something material
          changes between letters.
        </p>

        <p>
          The ownership question is critical. If intelligence and labor become increasingly produced by
          capital, the people who own that productive capital will participate most directly in the value
          it creates. Our ambition is not only to identify the technologies that make a post-labor economy
          possible. It is to bring our investors into the ownership layer of that future.
        </p>

        <p>
          Our thesis starts with AI making cognitive work cheaper and robotics doing the same for physical
          work. We do not expect work or human ambition to disappear. We expect more economic output to
          come from models, compute, machines, and energy instead of additional hours of labor.
        </p>

        <p>
          AI adoption is no longer the question. The
          <a href="https://hai.stanford.edu/ai-index/2026-ai-index-report/economy" target="_blank" rel="noreferrer">
            Stanford AI Index
          </a>
          reports that 88% of organizations now use it. The constraint is increasingly physical. The
          <a href="https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai" target="_blank" rel="noreferrer">
            International Energy Agency
          </a>
          expects electricity supplying data centers to rise from roughly 460 terawatt-hours in 2024 to
          more than 1,000 by 2030. Software spreads instantly; power, chips, cooling, robots, and factories
          do not.
        </p>

        <p>
          As of {LP_LETTER_PORTFOLIO_AS_OF}, we had invested {currency(snapshot.investedCost)} across
          {` ${snapshot.positions} positions in ${snapshot.companies} companies`}. Our directional gross
          view was {currency(snapshot.projectedGrossValue)}, or {snapshot.projectedGrossMultiple.toFixed(2)}×
          invested cost. Six positions use sourced comparable financings; the remainder are held at cost.
          This is not audited net asset value, and it is too early to call it performance.
        </p>

        <p>
          The portfolio reflects that thesis. At invested cost, 29.6% is in a diversified frontier
          vehicle, 22.6% in robotics and industrial systems, 18.4% in AI and compute, 17.3% in aerospace,
          defense, and autonomy, 8.1% in energy and hard infrastructure, and 4.0% in applications and
          resilience. Together, these positions span the intelligence, machines, and infrastructure of a
          post-labor economy.
        </p>

        <p>
          We built broadly to learn while the market was forming. Forty-four positions gave us enough
          breadth. Our largest pooled vehicle represents 29.6% of invested cost, and our five largest
          positions represent about half; that is not the construction we want to repeat. The next phase
          will favor fewer direct positions, clearer economics, better information rights, and room to
          support the companies that earn conviction.
        </p>

        <p>
          Our priorities are efficient compute and inference, robotics and physical automation, power and
          industrial infrastructure, and defense and aerospace. Compute makes intelligence cheaper. Robots
          turn it into physical work. Energy and industry let both scale. Defense and aerospace test these
          systems where reliability matters most.
        </p>

        <p>
          Access alone is not an advantage when capital is crowded. Price, structure, technical judgment,
          and the willingness to pass matter. You trusted us before there was a record; we owe you
          disciplined decisions and plain reporting. The portfolio is young, and the outcomes that matter
          will take years. We will keep showing you what we learn.
        </p>

        <p>Thank you for building this with us.</p>

        <p className="lp-letter-simple-signature">Robert and Hisham</p>
      </div>

      <footer className="lp-letter-simple-footer">
        <p>
          Private and confidential. This letter is not an offer to sell or a solicitation to buy any
          security. Portfolio values are directional gross estimates, not audited net asset value, and
          exclude fees, carry, taxes, future dilution, instrument terms, and liquidity adjustments.
          Forward-looking statements involve risks and may differ materially from actual results.
        </p>
        <Link href="/lp">Return to portfolio</Link>
      </footer>
    </article>
  );
}
