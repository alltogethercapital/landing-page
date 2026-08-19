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
          This is our first formal update, and it should have come sooner. From here, we will write at least
          twice per year and whenever something material changes. Thank you for trusting us while we found our
          footing.
        </p>

        <p>
          We started All Together because we believe{" "}
          <a
            href="https://www.imf.org/en/publications/staff-discussion-notes/issues/2024/01/14/gen-ai-artificial-intelligence-and-the-future-of-work-542379"
            target="_blank"
            rel="noreferrer"
          >
            AI will change the basic economics of production
          </a>
          {", "}and we wanted the people close to us to own what comes next, not just watch it happen. Our aim is
          to invest alongside you in the builders who can carry civilization beyond the{" "}
          <a
            href="https://humanorigins.si.edu/research/age-humans-evolutionary-perspectives-anthropocene"
            target="_blank"
            rel="noreferrer"
          >
            Anthropocene
          </a>
          {". "}That is the personal reason for the firm and the idea behind its name.
        </p>

        <p>
          At the center of our thesis is the post-labor economy. We do not mean that people stop mattering.
          Human judgment, ambition, and relationships remain essential. But as models take on cognitive tasks
          and intelligence moves into machines, each unit of output can require fewer human hours.
        </p>

        <p>
          Intelligence is becoming abundant, but the physical world remains scarce. Power, chips,
          manufacturing capacity, reliable machines, and permission to operate are still difficult to build.
          We believe durable value will move toward the bottlenecks that turn cheap intelligence into dependable
          real-world capability. Their owners sit in the ownership layer of the new economy.
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
          documents the energy system required to support it. Models and applications spread quickly; power,
          factories, regulation, distribution, and trust do not. The investment question is no longer whether
          AI matters. It is where scarcity, control, and pricing power persist as intelligence gets cheaper.
        </p>

        <p>
          That leads us to efficient compute and inference, robotics and physical automation, power and
          industrial infrastructure, and defense and aerospace. Compute makes intelligence cheaper. Robots
          turn it into physical work. Energy and industry let both scale. Defense and aerospace demand real
          reliability. All Together backs the companies building civilization in an age of abundant
          intelligence.
        </p>

        <p>
          A compelling market is only the starting point. Within those areas, we look for a durable point of
          control: a technical advantage that compounds, a product embedded in a critical workflow,
          infrastructure others must build on, or an operating system for a newly possible market. Founder
          ambition, technical truth, capital efficiency, price, and structure matter more than attention.
        </p>

        <p>
          The portfolio began broad by design. In a market forming this quickly, each investment helped us
          see which founders could turn technical possibility into an institution and which constraints would
          endure. Breadth gave us a map. Now we are using it to become more selective and to concentrate our
          thinking before we concentrate capital.
        </p>

        <p>
          As of {LP_AUGUST_2026_PORTFOLIO_AS_OF}, AUM at recorded cost was {currency(snapshot.investedCost)},
          and projected NAV was {currency(snapshot.projectedGrossValue)}, for a{" "}
          {snapshot.projectedGrossMultiple.toFixed(2)}× gross value multiple. We will keep this financial
          checkpoint concise and use these letters to share the thinking behind the portfolio, including what
          is changing our minds.
        </p>

        <p>
          Access alone is not an advantage when capital is crowded. Price, structure, technical judgment,
          and the willingness to pass matter. We will favor fewer direct positions, clearer economics,
          better information rights, and room to support the companies that earn conviction. You trusted us
          before there was a record, and we do not take that lightly. We owe you disciplined decisions, plain
          reporting, and an honest account of what we learn. The outcomes that matter will take years. We are
          grateful to be building toward them with you.
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
