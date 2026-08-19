import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LP_AUGUST_2026_FUND_SNAPSHOT,
  LP_AUGUST_2026_PORTFOLIO_AS_OF,
  LP_INVESTOR_UPDATES,
} from "@/data/lp-investor-updates";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return LP_INVESTOR_UPDATES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const update = LP_INVESTOR_UPDATES.find((entry) => entry.slug === slug);
  if (!update) {
    return {
      title: "Page Not Found",
      robots: { index: false, follow: false, nocache: true },
    };
  }
  return {
    title: update.title,
    description: update.excerpt,
    robots: { index: false, follow: false, nocache: true },
  };
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function LpInvestorUpdatePage({ params }: PageProps) {
  const { slug } = await params;
  const update = LP_INVESTOR_UPDATES.find((entry) => entry.slug === slug);
  if (!update || slug !== "august-2026") notFound();
  const snapshot = LP_AUGUST_2026_FUND_SNAPSHOT;

  return (
    <article className="lp-portal-shell lp-update-article">
      <Link href="/lp/updates" className="lp-update-back-link">
        ← All investor updates
      </Link>

      <header className="lp-update-article-header">
        <div className="lp-update-article-meta">
          <span>Investor Update #{update.issue}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={update.publishedAt}>{update.published}</time>
        </div>
        <h1>{update.title}</h1>
        <p className="lp-update-article-subtitle">{update.subtitle}</p>
      </header>

      <div className="lp-update-article-copy">
        <p>To our investors,</p>

        <p>
          This is our first formal update since we began investing, and it should have come sooner. We will
          publish at least twice per year, with shorter notes when something material changes.
        </p>

        <p>
          One reason we started All Together is that we believe{" "}
          <a
            href="https://www.imf.org/en/publications/staff-discussion-notes/issues/2024/01/14/gen-ai-artificial-intelligence-and-the-future-of-work-542379"
            target="_blank"
            rel="noreferrer"
          >
            AI will change the basic economics of production
          </a>. Models already perform cognitive tasks that once required people. As they improve and move into
          machines, more physical work will become machine-produced. Human judgment and ambition will remain
          essential, but each unit of output will require fewer human hours. This is what we mean by a
          post-labor economy.
        </p>

        <p>
          Intelligence is becoming abundant, but the physical world remains scarce. The marginal cost of
          cognition is falling while power, chips, manufacturing capacity, reliable machines, and permission
          to operate remain difficult to build. We believe value will move toward the bottlenecks that turn
          cheap intelligence into dependable real-world capability.
        </p>

        <p>
          That shift changes who captures the value. As intelligence and labor are produced by compute,
          models, robots, factories, and energy systems, the owners of those systems participate most
          directly in what they create. The ownership question is also personal. We wanted the people close
          to us to
          participate in the technologies that could carry civilization beyond the{" "}
          <a
            href="https://humanorigins.si.edu/research/age-humans-evolutionary-perspectives-anthropocene"
            target="_blank"
            rel="noreferrer"
          >
            Anthropocene
          </a>{" "}
          and into whatever comes next—not merely watch from the sidelines. We want to support its builders
          and bring our investors into the ownership layer of the consequential companies they create.
        </p>

        <p>
          The current landscape reinforces that view. The{" "}
          <a href="https://hai.stanford.edu/ai-index/2026-ai-index-report/economy" target="_blank" rel="noreferrer">
            Stanford AI Index
          </a>{" "}
          shows adoption spreading across the economy, while the{" "}
          <a href="https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai" target="_blank" rel="noreferrer">
            International Energy Agency
          </a>{" "}
          documents the energy system behind it. Models and applications diffuse quickly; power, factories,
          regulation, distribution, and trust do not. The investment question is no longer whether AI
          matters. It is where scarcity, control, and pricing power persist as intelligence gets cheaper.
        </p>

        <p>
          As of {LP_AUGUST_2026_PORTFOLIO_AS_OF}, we had invested {currency(snapshot.investedCost)} across
          {` ${snapshot.positions} positions`}. Our directional gross view was{" "}
          {(snapshot.projectedGrossValue / snapshot.investedCost).toFixed(2)}× invested cost. Most positions
          remain held at cost; a small number reflect sourced comparable financings. This is not audited net
          asset value, and it is too early to call it performance.
        </p>

        <p>
          The portfolio began broad by design. We used it as a listening system while the market was
          forming: to learn which founders could turn technical possibility into institutions, which layers
          were becoming commodities, and which constraints would endure. Breadth gave us a map. Now we are
          turning that map into concentration of thought, not simply concentration of capital.
        </p>

        <p>
          All Together backs the companies building civilization in an age of abundant intelligence. We
          focus on efficient compute and inference, robotics and physical automation, power and industrial
          infrastructure, and defense and aerospace. Compute makes intelligence cheaper. Robots turn it
          into physical work. Energy and industry let both scale. Defense and aerospace test reliability.
        </p>

        <p>
          Within those areas, we look for a durable point of control: a technical advantage that compounds,
          a product embedded in a critical workflow, infrastructure others must build on, or an operating
          system for a newly possible market. We care about founder ambition, technical truth, capital
          efficiency, price, structure, and enduring leverage rather than temporary attention.
        </p>

        <p>
          Access alone is not an advantage when capital is crowded. Price, structure, technical judgment,
          and the willingness to pass matter. We will favor fewer direct positions, clearer economics,
          better information rights, and room to support the companies that earn conviction. You trusted
          us before there was a record; we owe you disciplined decisions and plain reporting. The outcomes
          that matter will take years. We will keep showing you what we learn.
        </p>

        <p>Thank you for building this with us.</p>

        <p className="lp-update-article-signature">Robert and Hisham</p>
      </div>

      <footer className="lp-update-article-footer">
        <p>
          Private and confidential. This update is not an offer to sell or a solicitation to buy any
          security. Portfolio values are directional gross estimates, not audited net asset value, and
          exclude fees, carry, taxes, future dilution, instrument terms, and liquidity adjustments.
          Forward-looking statements involve risks and may differ materially from actual results.
        </p>
        <Link href="/lp/updates">All investor updates</Link>
      </footer>
    </article>
  );
}
