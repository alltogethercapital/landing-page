import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UIIcon } from "@/components/icons";
import { requireLpSession } from "@/lib/lp-auth";
import { pageTitle } from "@/lib/page-metadata";
import {
  LP_AUGUST_2026_FUND_SNAPSHOT,
  LP_AUGUST_2026_PORTFOLIO_AS_OF,
  LP_INVESTOR_UPDATES,
  LP_OCTOBER_2026_FUND_SNAPSHOT,
  LP_OCTOBER_2026_PORTFOLIO_AS_OF,
  LP_SEPTEMBER_2026_FUND_SNAPSHOT,
  LP_SEPTEMBER_2026_PORTFOLIO_AS_OF,
} from "@/data/lp-investor-updates";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await requireLpSession();
  const { slug } = await params;
  const update = LP_INVESTOR_UPDATES.find((entry) => entry.slug === slug);
  if (!update) {
    return {
      title: pageTitle("Not Found"),
      robots: { index: false, follow: false, nocache: true },
    };
  }
  return {
    title: pageTitle(update.title),
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

function OctoberUpdateCopy() {
  const snapshot = LP_OCTOBER_2026_FUND_SNAPSHOT;

  return (
    <>
      <p>To our investors,</p>

      <p>
        Our thesis is becoming more concrete: intelligence creates durable value when it owns a complete
        operating loop. A useful system has to observe the work, make a decision, act in the physical or
        digital world, learn from the result, and improve the next cycle. The most defensible companies do
        not stop at a model or interface. They become part of how production actually runs.
      </p>

      <p>
        That is especially important in physical AI. Models are improving quickly, but a production robot
        still has to handle variation, integrate with an existing line, operate reliably, and produce an
        economic outcome every shift. Hardware, deployment data, customer workflow, and service operations
        compound together. The hard part is not showing that a robot can perform a task once. It is making
        the system useful every day in an environment that was not designed for automation.
      </p>

      <p>
        <strong>We invested in Chef Robotics.</strong> The company builds flexible AI-enabled robotic systems
        for food production. Its robots are designed to portion, assemble, and package meals across changing
        menus and ingredients, bringing automation to production work that has historically resisted rigid,
        single-purpose machinery.
      </p>

      <p>
        Food manufacturing is a compelling proving ground for physical AI. The market is large, labor is
        difficult to recruit and retain, and the work combines repetition with real-world variability. A
        system that can adapt across products and production lines can create value through throughput,
        consistency, labor availability, and better use of existing facilities. Each deployment can also
        generate the data needed to improve perception, manipulation, and operating performance.
      </p>

      <p>
        Chef Robotics reports more than 150 million servings produced and deployments across North America
        and Europe. Those are company-reported operating milestones, not our own measurements, but they are
        relevant because they point to the transition from prototype to production. The company&apos;s 2025
        financing also brought together equity and equipment financing, a structure suited to a business
        where software intelligence and deployed hardware have to scale together.
      </p>

      <p>
        The investment extends an existing portfolio theme rather than opening a new one. Apptronik, 1X,
        Figure AI, Path Robotics, Aformic, Weave Robotics, and Chef Robotics approach different labor and
        production problems, but the underwriting question is consistent: does the company control a
        deployment loop that becomes more valuable and harder to replace as the intelligence improves?
      </p>

      <p>
        The risks are equally concrete. Food production demands reliability, sanitation, safety, service,
        and customer-specific integration. Hardware businesses can consume capital before deployments become
        repeatable. The investment will be judged by production uptime, customer expansion, unit economics,
        deployment speed, and whether the data advantage compounds across sites.
      </p>

      <p>
        <strong>Portfolio checkpoint.</strong> As of {LP_OCTOBER_2026_PORTFOLIO_AS_OF}, the portfolio contained{" "}
        {snapshot.positions} recorded positions across {snapshot.companies} companies. Recorded cost was{" "}
        {currency(snapshot.investedCost)}. The current directional gross value estimate was{" "}
        {currency(snapshot.projectedGrossValue)}, or a {snapshot.projectedGrossMultiple.toFixed(2)}× current
        value multiple, representing {currency(snapshot.grossValueChange)} above recorded cost.
      </p>

      <p>
        Since the September portfolio snapshot, we added one position at {currency(snapshot.newInvestedCostSinceSeptember)}
        of recorded cost. Chef Robotics remains at cost in the estimate. The investment amount and date are
        owner-confirmed; the round, entry valuation, instrument, investment route, executed acceptance, and
        completed cash movement are not yet evidenced. The Schedule of Investments and portal show that
        distinction explicitly, and no bank-ledger movement has been created without transaction evidence.
      </p>

      <p>
        This estimate remains deliberately simple. It applies sourced company-level comparisons to a limited
        set of positions, keeps the rest at cost, and includes one clearly labeled Anduril scenario
        assumption. It is not audited NAV, does not forecast returns, and does not incorporate fees, carry,
        taxes, future dilution, liquidity, or the detailed terms of each instrument.
      </p>

      <p>
        We will continue to report at least twice per year and whenever something material changes. The bar
        for new capital remains the same: control a durable part of the operating loop, prove that it works in
        production, and build an advantage that compounds as intelligence becomes cheaper.
      </p>

      <p>Thank you for building this with us.</p>

      <p className="lp-update-article-signature">Robert and Hisham</p>
    </>
  );
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
        fourteen positions added since that letter make the next part of the thesis clearer. Intelligence is
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
        <strong>Restated October 19, 2026.</strong> AngelList previously confirmed that the Apptronik SPV was
        oversubscribed, reducing our $30,000.00 allocation to $29,222.00 and crediting $778.00 to our AngelList
        Investor Account. The owner has now confirmed the final allocation is $20,766.24. We reduced recorded
        cost by another $8,455.76 and updated the directional value estimate proportionally. The original
        $30,000.00 outflow and evidenced $778.00 platform credit remain recorded; no additional refund or platform
        credit is recorded without transaction evidence. On October 19, 2026, the owner confirmed that All
        Together backed out of Pocket. The withdrawn $15,000.00 commitment has therefore been removed from the
        portfolio and from these restated figures. No Pocket-labelled cash movement exists in the bank ledger,
        so no refund or reversal was invented. The owner subsequently revised the final Rasyn allocation from
        $9,993.59 to $9,994.00; the original $10,000.00 outflow remains in the bank ledger, and no separate
        $6.00 refund or AngelList account-balance credit is recorded without transaction evidence. The owner
        also revised the second Blue Origin allocation from $25,000.00 to $24,975.00. The actual $25,000.00
        AngelList outflow remains in the bank ledger, and no separate $25.00 refund or AngelList account credit
        is recorded without transaction evidence. The figures in this update now reflect the Pocket withdrawal
        and the remaining allocation corrections.
      </p>

      <p>
        The change from the August letter includes {currency(snapshot.newInvestedCostSinceAugust)} across the
        fourteen additions and a {currency(snapshot.reconciliationAdjustmentSinceAugust)}{" "}correction to
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
  await requireLpSession();
  const { slug } = await params;
  const update = LP_INVESTOR_UPDATES.find((entry) => entry.slug === slug);
  if (!update || !["august-2026", "september-2026", "october-2026"].includes(slug)) notFound();
  const snapshot = LP_AUGUST_2026_FUND_SNAPSHOT;

  return (
    <article className="lp-portal-shell lp-update-article">
      <Link href="/lp/updates" className="lp-update-back-link">
        <UIIcon name="arrow-left" /> All investor updates
      </Link>

      <header className="lp-update-article-header">
        <div className="lp-update-article-meta">
          <span>Investor Update #{update.issue}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={update.publishedAt}>{update.published}</time>
        </div>
        <h1 className="sr-only">{update.title}</h1>
        <p className="lp-update-article-subtitle">{update.subtitle}</p>
      </header>

      <div className="lp-update-article-copy">
        {slug === "october-2026" ? <OctoberUpdateCopy /> : slug === "september-2026" ? <SeptemberUpdateCopy /> : <>
        <p>To our investors,</p>

        <p>
          This is our first formal update, and it should have come sooner. Thank you for trusting us while we
          found our footing. From here, we will write at least twice per year and whenever something material
          changes.
        </p>

        <p>
          We started Machine Spirit Capital for a simple reason: we believe AI will change who produces economic value
          and who owns it. We wanted our friends, families, and the people close to us to participate in that
          change, not watch it from the sidelines. That is the personal reason for the firm and the idea behind
          its name.
        </p>

        <p>
          Our thesis is simple: AI will make intelligence cheaper and move more cognitive and physical work
          into software and machines. When less human time is needed to produce something, the benefit flows to
          whoever owns the systems that do the work and the scarce inputs they depend on. Machine Spirit Capital exists
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
          <strong>Restated October 13, 2026.</strong> AngelList previously confirmed that the Apptronik SPV was
          oversubscribed, reducing our $30,000.00 allocation to $29,222.00 and crediting $778.00 to our AngelList
          Investor Account. The owner has now confirmed the final allocation is $20,766.24. The figures above
          reflect the additional $8,455.76 reduction and the proportional change to the directional value
          estimate. The original $30,000.00 outflow and evidenced $778.00 platform credit remain recorded; no
          additional refund or platform credit is recorded without transaction evidence.
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
