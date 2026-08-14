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
          We should have written sooner. This is our first formal letter since we began investing,
          and the delay is ours. A portfolio page can show where the money went, but it cannot explain
          what we are learning or how those lessons are changing our decisions. We intend to write
          quarterly from here, with shorter notes when something material happens between letters.
        </p>

        <p>
          We started All Together with a straightforward belief: artificial intelligence would become
          more capable, less expensive, and more widely used, and that shift would create important
          companies far beyond the model layer. That is happening. The useful question now is not
          whether AI will matter. It is which businesses will still have durable value when intelligence
          itself is abundant.
        </p>

        <p>
          Our answer is increasingly physical. Compute, power, chips, cooling, robots, manufacturing,
          security, and access to difficult environments are becoming more important, not less. The
          <a href="https://hai.stanford.edu/ai-index/2026-ai-index-report/economy" target="_blank" rel="noreferrer">
            Stanford AI Index
          </a>
          reports that 88% of organizations now use AI. The
          <a href="https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai" target="_blank" rel="noreferrer">
            International Energy Agency
          </a>
          expects electricity generation supplying data centers to rise from roughly 460 terawatt-hours
          in 2024 to more than 1,000 by 2030. Adoption is moving quickly, but the infrastructure required
          to support it cannot be created at software speed.
        </p>

        <p>
          We are deliberately investing toward a post-labor economy. We do not mean that work disappears
          on a schedule or that human ambition becomes irrelevant. We mean that AI will steadily reduce
          the cost of cognitive work, while robotics does the same for more forms of physical work. Over
          time, a larger share of economic output will come from models, compute, machines, and energy
          rather than from additional hours of human labor.
        </p>

        <p>
          The ownership question is critical. If intelligence and labor become increasingly produced by
          capital, the people who own that productive capital will participate most directly in the value
          it creates. Our ambition is not only to identify the technologies that make a post-labor economy
          possible. It is to bring our investors into the ownership layer of that future.
        </p>

        <p>
          As of {LP_LETTER_PORTFOLIO_AS_OF}, we had invested {currency(snapshot.investedCost)} across
          {` ${snapshot.positions} positions in ${snapshot.companies} companies`}. Our directional gross
          view was {currency(snapshot.projectedGrossValue)}, or {snapshot.projectedGrossMultiple.toFixed(2)}×
          invested cost. Six positions use sourced comparable financings; the remainder are held at cost.
          This is not audited net asset value, and it is too early to call it performance.
        </p>

        <p>
          At invested cost, 29.6% of the portfolio is in a diversified frontier vehicle, 22.6% is in
          robotics and industrial systems, 18.4% is in AI and compute, 17.3% is in aerospace, defense,
          and autonomy, 8.1% is in energy and hard infrastructure, and 4.0% is in applications and
          resilience. The categories are imperfect, but the direction is intentional: intelligence,
          the machines that turn it into work, and the infrastructure that makes both possible.
        </p>

        <p>
          We built a broad first portfolio because we wanted direct exposure to the market as it formed.
          That breadth helped us learn quickly across compute, robotics, energy, aerospace, defense, and
          applications. It also showed us where our construction can improve. Our largest pooled vehicle
          position represents 29.6% of invested cost, and our five largest positions represent about half.
          We will not use that concentration as a model for the next phase.
        </p>

        <p>
          Forty-four positions are enough breadth for now. We expect the next phase to be more selective.
          We will favor direct positions, clearer company economics, better information rights, and room
          to support the businesses that earn greater conviction. Access alone is not an advantage when
          capital is crowded. Price, structure, technical judgment, and the willingness to pass matter.
        </p>

        <p>
          Our strongest interest remains in efficient compute and inference, robotics and physical
          automation, power and industrial infrastructure, and defense and aerospace. These are not
          separate themes. Compute makes intelligence cheaper. Robots turn that intelligence into useful
          physical work. Energy and industrial capacity allow both to scale. Defense and aerospace push
          these systems into environments where reliability matters most.
        </p>

        <p>
          We are grateful that you trusted us before there was a long history to point to. The portfolio
          is young, the marks are limited, and the outcomes that matter most are years away. Our job now
          is to stay disciplined, show our work, communicate plainly, and make each new decision better
          than the last.
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
