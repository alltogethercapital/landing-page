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
            AI will reunderwrite the entire world
          </a>
          {"—not only how we produce, but how we work, build, and live—and "}we wanted the people close to us
          to own what comes next, not just watch it happen. Our aim is to invest alongside you in the builders
          who can carry civilization beyond the{" "}
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
          You can see that thesis in the portfolio. Starcloud is building data centers in orbit, where solar
          power and the vacuum of space become part of the compute stack. OpenAI needs little introduction; it
          gives us exposure to the frontier intelligence layer itself. Through H256, Anduril combines AI,
          autonomous systems, and manufacturing capacity to help rebuild American defense. Each sits at a
          different layer, but each is assembling capabilities that are difficult to reproduce.
        </p>

        <p>
          We are participating across the humanoid robotics movement through 1X, Figure AI, Apptronik, and
          Weave Robotics: machines for the home, the workforce, industry, and everyday household work. Some
          of these companies will compete with one another. That is intentional. We believe the category can
          experience a rising tide, so we have deliberately indexed its strongest expressions rather than
          pretending we can already know the single winner.
        </p>

        <p>
          The opportunity extends well beyond humanoids. Aformic moves pallets, carts, and racks through
          factories and warehouses. Maven Robotics brings general-purpose robots into manufacturing and
          logistics. Budbreak Innovations sends autonomous scouting robots through vineyards and orchards,
          turning every plant into a stream of actionable agricultural data. These companies are hard to
          replicate because their moats live in deployed hardware, supply chains, safety systems, field data,
          and integration with real-world workflows—and AI can make each layer more capable over time.
        </p>

        <p>
          Physical infrastructure is not the only durable moat. We also invest selectively in software where
          network effects, proprietary data, distribution, or deep workflow integration strengthen with every
          customer. The test is the same: as intelligence becomes cheaper, does the company retain a point of
          control that becomes harder, not easier, to displace?
        </p>

        <p>
          Energy is the foundation underneath all of it. Aalo Atomics and Apollo Atomics are turning nuclear
          power into a factory-built product. Quaise Energy is pursuing superhot geothermal at depths ordinary
          drilling cannot reach. Exowatt is building modular solar-thermal power and storage for the AI compute
          era. These companies—and others in the portfolio—address the power constraint that every serious AI
          system eventually meets. We believe their infrastructure will remain critical and their moats can
          deepen as demand grows.
        </p>

        <p>
          A compelling market is only the starting point. Within those areas, we look for a durable point of
          control: a technical advantage that compounds, a product embedded in a critical workflow,
          infrastructure others must build on, or an operating system for a newly possible market. Founder
          ambition, technical truth, capital efficiency, price, and structure matter more than attention.
        </p>

        <p>
          Another part of our strategy is to follow respected institutional investors into a round or invest
          alongside them when our own underwriting agrees. Y Combinator, Sequoia Capital, Khosla Ventures,
          Andreessen Horowitz (a16z), and firms like them bring governance, recruiting reach, follow-on capital,
          and experience navigating acquisitions, secondary sales, and public markets. Their business is also
          to create returns for their own investors, which can align the shareholder base around building a
          durable company and eventually creating liquidity. Their presence never replaces our judgment or
          guarantees an exit, but we believe it can improve the odds that a strong company produces a future
          exit opportunity for all of its shareholders, including us.
        </p>

        <p>
          As of {LP_AUGUST_2026_PORTFOLIO_AS_OF}, AUM at recorded cost was {currency(snapshot.investedCost)},
          and projected NAV was {currency(snapshot.projectedGrossValue)}, for a{" "}
          {snapshot.projectedGrossMultiple.toFixed(2)}× gross value multiple. We will keep this financial
          checkpoint concise and use these letters to share the thinking behind the portfolio, including what
          is changing our minds.
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
