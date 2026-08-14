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
  if (!update) return {};
  return {
    title: `${update.published} Investor Update — All Together Investor Portal`,
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
        <span>Investor Update</span>
        <h1>{update.title}</h1>
        <time dateTime={update.publishedAt}>{update.published}</time>
      </header>

      <div className="lp-update-article-copy">
        <p>To our investors,</p>

        <p>
          We owe you an update. This is our first formal investor update since we began investing, and it
          should have come sooner. We will publish at least twice per year from here, with shorter updates
          when something material changes between them.
        </p>

        <p>
          One reason we started All Together is that we believe{" "}
          <a
            href="https://www.imf.org/en/publications/staff-discussion-notes/issues/2024/01/14/gen-ai-artificial-intelligence-and-the-future-of-work-542379"
            target="_blank"
            rel="noreferrer"
          >
            AI will change the basic economics of production
          </a>. Models can already perform cognitive tasks that once required people. As those models improve
          and move into robots, more physical work will become machine-produced as well. Human judgment
          and ambition will remain essential, but each unit of output will require fewer human hours. This
          is what we mean by a post-labor economy.
        </p>

        <p>
          That shift changes who captures the value. If intelligence and labor are increasingly produced
          by capital—compute, models, robots, factories, and energy systems—the owners of that capital will
          participate most directly in what it creates.
        </p>

        <p>
          Another reason is personal. We wanted our friends, families, and the people close to us to
          participate in the technologies that could carry civilization beyond the{" "}
          <a
            href="https://humanorigins.si.edu/research/age-humans-evolutionary-perspectives-anthropocene"
            target="_blank"
            rel="noreferrer"
          >
            Anthropocene
          </a>{" "}
          and into whatever comes next—not merely watch that transition from the sidelines. We do not know
          what kind of civilization will emerge on the other side. We do want to support its builders and
          bring our investors into the ownership layer of the productive, consequential companies they
          create.
        </p>

        <p>
          AI adoption is no longer the question. The{" "}
          <a href="https://hai.stanford.edu/ai-index/2026-ai-index-report/economy" target="_blank" rel="noreferrer">
            Stanford AI Index
          </a>{" "}
          reports that 88% of organizations now use it. The constraint is increasingly physical. The{" "}
          <a href="https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai" target="_blank" rel="noreferrer">
            International Energy Agency
          </a>{" "}
          expects electricity supplying data centers to rise from roughly 460 terawatt-hours in 2024 to
          more than 1,000 by 2030. Software spreads instantly; power, chips, cooling, robots, and factories
          do not.
        </p>

        <p>
          As of {LP_AUGUST_2026_PORTFOLIO_AS_OF}, we had invested {currency(snapshot.investedCost)} across
          {` ${snapshot.positions} positions in ${snapshot.companies} companies`}. Our directional gross
          view was {currency(snapshot.projectedGrossValue)}, or {snapshot.projectedGrossMultiple.toFixed(2)}×
          invested cost. Six positions use{" "}
          <a
            href="https://www.privateequityvaluation.com/Portals/0/Documents/Guidelines/IPEV%20Valuation%20Guidelines%20-%20December%202022.pdf"
            target="_blank"
            rel="noreferrer"
          >
            sourced comparable financings
          </a>; the remainder are held at cost. This is not audited net asset value, and it is too early to
          call it performance.
        </p>

        <p>
          The portfolio reflects that thesis. At invested cost, 30.3% is in a diversified frontier
          vehicle, 20.8% in robotics and industrial systems, 18.8% in AI and compute, 17.7% in aerospace,
          defense, and autonomy, 8.3% in energy and hard infrastructure, and 4.1% in applications and
          resilience. Together, these positions span the intelligence, machines, and infrastructure of a
          post-labor economy.
        </p>

        <p>
          We built broadly to learn while the market was forming. Forty-four positions gave us enough
          breadth. Our largest pooled vehicle represents 30.3% of invested cost, and our five largest
          positions represent about half; that is not the construction we want to repeat. The next phase
          will favor fewer direct positions, clearer economics, better information rights, and room to
          support the companies that earn conviction.
        </p>

        <p>
          Our priorities are efficient compute and{" "}
          <a href="https://developers.google.com/machine-learning/glossary/#inference" target="_blank" rel="noreferrer">
            inference
          </a>, robotics and physical automation, power and industrial infrastructure, and defense and
          aerospace. Compute makes intelligence cheaper. Robots turn it into physical work. Energy and
          industry let both scale. Defense and aerospace test these systems where reliability matters most.
        </p>

        <p>
          Access alone is not an advantage when capital is crowded. Price, structure, technical judgment,
          and the willingness to pass matter. You trusted us before there was a record; we owe you
          disciplined decisions and plain reporting. The portfolio is young, and the outcomes that matter
          will take years. We will keep showing you what we learn.
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
