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
          This is our first formal update, and it should have come sooner. Thank you for trusting us while we
          found our footing. From here, we will write at least twice per year and whenever something material
          changes.
        </p>

        <p>
          We started All Together for a simple reason: we believe AI will change who produces economic value
          and who owns it. We wanted our friends, families, and the people close to us to participate in that
          change, not watch it from the sidelines. That is the personal reason for the firm and the idea behind
          its name.
        </p>

        <p>
          Our thesis is simple: AI will make intelligence cheaper and move more cognitive and physical work
          into software and machines. When less human time is needed to produce something, the benefit flows to
          whoever owns the systems that do the work and the scarce inputs they depend on. All Together exists
          to give our investors ownership in those companies.
        </p>

        <p>
          We call this the post-labor economy. It does not mean people stop working or stop mattering. It means
          that human time becomes a smaller part of producing more goods and services. That distinction matters
          for investing: cheaper intelligence will not make every AI company more valuable. It will make weak
          moats easier to copy.
        </p>

        <p>
          Every investment therefore has to answer a direct question: what does this company control that will
          become harder to replace? The answer might be a technical lead, a scarce physical asset, a deployed
          network, a proprietary data loop, distribution, or a critical workflow. If AI commoditizes the
          product, we should pass. If AI compounds the advantage, we then underwrite the team, price, structure,
          and capital required to reach the next proof point.
        </p>

        <p>
          The portfolio reflects that test. OpenAI gives us exposure to the frontier model layer. Starcloud is
          trying to move data centers into orbit, where power and the physical environment become part of the
          compute system. Anduril combines autonomy, software, and manufacturing into defense products that
          must work outside a demo. These companies operate at different layers, but each controls more than an
          application interface.
        </p>

        <p>
          Robotics is the clearest expression of the thesis. Our positions in 1X, Figure AI, Apptronik, and
          Weave Robotics are competing approaches to turning models into useful physical work. Aformic in
          logistics and Budbreak Innovations in agriculture apply the same idea to narrower jobs. The value is
          not the demo. It is the deployed hardware, manufacturing, field data, workflow integration, and
          customer trust accumulated over time.
        </p>

        <p>
          AI systems and automation need large amounts of reliable power. Aalo Atomics and Apollo Atomics are
          working to make nuclear power repeatable and factory-built. Quaise Energy is pursuing superhot
          geothermal, while Exowatt is building modular power and storage. We do not own them simply because
          energy demand is rising. Each still has to prove a credible technical path, the ability to build, and
          economics that can support a durable company.
        </p>

        <p>
          We began with a broad portfolio because the market was forming and we wanted direct evidence. That
          breadth helped us see where technical progress survives contact with customers, manufacturing, and
          capital. We will be more selective from here. A new position should strengthen the portfolio rather
          than repeat it, offer clear economics, and deserve follow-on capital if the company earns it.
        </p>

        <p>
          We also pay attention to who else is on the cap table. Strong institutional investors can improve
          governance, recruiting, and access to future capital. Their presence is evidence, not a thesis. We
          invest alongside them only when our own underwriting agrees.
        </p>

        <p>
          As of {LP_AUGUST_2026_PORTFOLIO_AS_OF}, AUM at recorded cost was {currency(snapshot.investedCost)},
          and projected NAV was {currency(snapshot.projectedGrossValue)}, for a{" "}
          {snapshot.projectedGrossMultiple.toFixed(2)}× gross value multiple. We will keep this financial
          checkpoint concise and use these letters to share the thinking behind the portfolio, including what
          is changing our minds.
        </p>

        <p>
          We do not know exactly which companies will define this transition. We do know the standard: own
          durable points of control, pay sensible prices, and change our minds when the facts change. That is
          how we will invest from here and how we will report to you.
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
