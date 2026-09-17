import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LP_AUGUST_2026_FUND_SNAPSHOT,
  LP_AUGUST_2026_PORTFOLIO_AS_OF,
  LP_INVESTOR_UPDATES,
  LP_SEPTEMBER_2026_FUND_SNAPSHOT,
  LP_SEPTEMBER_2026_PORTFOLIO_AS_OF,
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

function SeptemberUpdateCopy() {
  const snapshot = LP_SEPTEMBER_2026_FUND_SNAPSHOT;

  return (
    <>
      <p>To our investors,</p>

      <p>
        A month ago, we wrote that cheaper intelligence would not make every AI company more valuable. It
        would reward the companies that control something difficult to replace: a workflow, a physical
        system, proprietary data, distribution, or infrastructure that compounds as the models improve. The
        thirteen positions added since that letter make the next part of the thesis clearer. Intelligence is
        leaving the chat window and entering the systems where work actually happens.
      </p>

      <p>
        This is not a change in direction. It is a sharper expression of the same view. The model layer still
        matters, but the economic value created by AI will increasingly be captured by companies that turn
        model capability into a complete operating loop: observe the work, make a decision, take an action,
        learn from the result, and become harder to displace with every cycle.
      </p>

      <p>
        <strong>The portfolio since our last letter.</strong> We added {snapshot.newPositionsSinceAugust} positions
        representing {currency(snapshot.newInvestedCostSinceAugust)} of new recorded cost. They span creative
        production, organizational measurement, aerospace, agriculture, local commerce, media localization,
        automotive service, licensed training data, chemistry, manufacturing, advanced materials, behavioral
        health, and ambient computing. The range is broad; the underlying question is not. In each case, we
        are looking for a product that owns more of the job than a thin interface to someone else&apos;s model.
      </p>

      <p>
        Higgsfield is the clearest example of an application becoming a production system. We invested again
        as the company expanded from AI video generation into an integrated workspace for images, video,
        audio, reusable assets, direction, editing, and multi-step creative work. The models beneath that
        workspace will change. The durable opportunity is the environment in which a creator or enterprise
        team can direct those models and reliably produce finished work.
      </p>

      <p>
        Autostep attacks the same transition from inside the enterprise. As companies add agents, the scarce
        layer becomes measurement: which work consumes time, which workflow should be removed or redesigned,
        where an agent actually returns capacity, and whether the intervention improved an economic outcome.
        Autostep is building a current map of organizational work and a scorecard for what changes it. In a
        world with abundant automation, knowing what to automate—and proving the result—becomes infrastructure.
      </p>

      <p>
        Pocket carries AI into conversations that never begin as software events. Its device captures
        in-person and phone conversations, then turns them into transcripts, summaries, action items, and
        searchable context. The important product decision is not simply recording. It is closing the loop
        between what was said and what happens next while allowing the user to remain present in the room.
      </p>

      <p>
        Several additions apply that operating-system idea to specific industries. CarSignal connects intake,
        diagnosis, estimates, scheduling, payments, and follow-up for independent auto shops. Allia Health
        brings intake, documentation, referrals, outcomes, scheduling, and billing into one behavioral-health
        workflow. TryNearby coordinates local creators and local businesses as a recurring distribution
        network. These are attractive when the product becomes the place where the job is completed, not a
        feature a system of record can absorb without consequence.
      </p>

      <p>
        The data layer is also becoming more specialized. Datoric is building licensed, traceable multimodal
        datasets for robotics, world models, and voice systems, where provenance and consent have to travel
        with the data. Familiar Labs is treating dubbing as preservation of a performance across languages,
        not merely translation. Rasyn combines computational candidate generation with experimental
        validation for chemical discovery. In each case, the moat depends on the production process and
        feedback loop around the data, not the existence of a model endpoint.
      </p>

      <p>
        <strong>Physical systems remain central.</strong> Path Robotics is building adaptive autonomous welding
        around a purpose-built foundation model. Ultrasonium is pursuing a new metals-manufacturing process.
        Molagri is engineering precise biological crop protection. We also added a second Blue Origin position
        through a separate vehicle, increasing our exposure to reusable launch, engines, lunar systems, and
        space infrastructure. These companies face slower iteration, manufacturing risk, regulation, and
        capital intensity. Those constraints are real, but they can also create durable advantage once a
        system works in production.
      </p>

      <p>
        This mix clarifies how we think about software and hard technology together. AI lowers the cost of
        reasoning, design, and control. Physical systems give that intelligence leverage in the world. Vertical
        software organizes a complete job around it. Specialized data improves it. Distribution determines
        whether it reaches the customer. The best companies increasingly combine several of these layers.
      </p>

      <p>
        <strong>Where we are becoming more selective.</strong> A compelling demo is not enough, and neither is
        rapid early revenue by itself. We want evidence that usage creates retention, that the product expands
        into a broader workflow, that gross margin can support the business, and that the company&apos;s advantage
        grows rather than shrinks as foundation models improve. For physical companies, we add manufacturing
        yield, deployment reliability, regulatory path, and the capital required to reach the next proof point.
      </p>

      <p>
        We are also distinguishing more carefully between exposure and conviction. A broad portfolio has
        helped us learn quickly across layers of the stack. Follow-on capital should be harder to earn. It will
        go to companies that convert technical progress into customer dependence, reach milestones without
        continuously resetting the capital plan, and strengthen the portfolio rather than duplicate an
        existing bet.
      </p>

      <p>
        <strong>Portfolio checkpoint.</strong> As of {LP_SEPTEMBER_2026_PORTFOLIO_AS_OF}, the portfolio contained{" "}
        {snapshot.positions} recorded positions across {snapshot.companies} companies. AUM at recorded cost was{" "}
        {currency(snapshot.investedCost)}. The current directional gross value estimate was{" "}
        {currency(snapshot.projectedGrossValue)}, or a {snapshot.projectedGrossMultiple.toFixed(2)}× current
        value multiple, representing {currency(snapshot.grossValueChange)} above recorded cost.
      </p>

      <p>
        The change from the August letter includes {currency(snapshot.newInvestedCostSinceAugust)} across the
        thirteen additions and a {currency(snapshot.reconciliationAdjustmentSinceAugust)}{" "}correction to
        Positron&apos;s recorded cost. Those additions and the correction remain at cost in the current estimate.
        That is why gross value increased while the current value multiple moved from 1.12× to 1.10×: the
        denominator grew, not because an existing mark was reduced.
      </p>

      <p>
        The estimate remains deliberately simple. It applies sourced company-level comparisons to a limited
        set of positions, keeps the rest at cost, and includes one clearly labeled Anduril scenario assumption.
        It is not audited NAV, does not forecast returns, and does not incorporate fees, carry, taxes, future
        dilution, liquidity, or the detailed terms of each instrument.
      </p>

      <p>
        There is also an evidence distinction worth making explicit. Several recent positions are
        owner-confirmed and recorded in the Schedule of Investments while final executed documents, transfer
        evidence, or fund-administrator acceptance remain pending. We show those positions with their evidence
        caveats in the portal and do not convert a commitment, a generic offering document, or a wire
        instruction into a claim of legal acceptance or completed cash movement.
      </p>

      <p>
        The work now is to turn breadth into judgment. We will keep learning across the portfolio, but the bar
        for the next dollar is rising: durable control, evidence of real workflow ownership, disciplined entry
        price, and a credible path from technical possibility to an enduring company.
      </p>

      <p>Thank you for building this with us.</p>

      <p className="lp-update-article-signature">Robert and Hisham</p>
    </>
  );
}

export default async function LpInvestorUpdatePage({ params }: PageProps) {
  const { slug } = await params;
  const update = LP_INVESTOR_UPDATES.find((entry) => entry.slug === slug);
  if (!update || !["august-2026", "september-2026"].includes(slug)) notFound();
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
        {slug === "september-2026" ? <SeptemberUpdateCopy /> : <>
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
        </>}
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
