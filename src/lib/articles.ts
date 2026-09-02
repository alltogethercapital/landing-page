import { COMPANY_ARTICLES } from "./company-articles";

export type ArticleSection = { heading?: string; body: string[] };
export type Article = {
  slug: string;
  title: string;
  /** Display date, e.g. "June 11, 2026" */
  date: string;
  /** ISO date for <time datetime> and sorting */
  dateISO: string;
  category: string;
  author: string;
  excerpt: string;
  /** Card image on the landing page and notes index */
  image: string;
  sections: ArticleSection[];
};

// Updates: the firm's writing. Newest first.
const ARTICLE_ENTRIES: Article[] = [
  {
    slug: "autostep",
    title: "Autostep.",
    date: "September 1, 2026",
    dateISO: "2026-09-01",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "We invested in Autostep, the P&L for knowledge work and the measurement layer for human and agent workflows.",
    image: "/updates/covers/autostep.png",
    sections: [
      {
        body: [
          "We invested in Autostep. The company maps how work actually happens across an organization, measures the cost and impact of human and agent tasks, and shows teams where a process should be removed, changed, routed to existing software, or rebuilt with an agent.",
          "Most companies can see what they spend on software and AI. Far fewer can trace what came back. Autostep starts from the work itself: repeated tasks, bottlenecks, waiting, and administrative loops. It turns that activity into a ranked view of what costs the organization time and what is worth fixing first.",
        ],
      },
      {
        heading: "What they're building",
        body: [
          "Autostep installs across a company and maps real workflows without requiring teams to assemble a clean system of integrations first. Its operational-intelligence layer organizes work by department, role, and task, then connects each pattern to cost and impact.",
          "The product does not assume that every problem needs a new agent. It can recommend removing a step, standardizing a process, using software the company already has, or building an agent inside the existing workflow. Over time, that creates a current, queryable record of how the company works and whether each intervention produced a measurable result.",
        ],
      },
      {
        heading: "Why we backed the founder and team",
        body: [
          "Aidan Pratt founded Autostep after years of building and shipping developer tools, automation products, and AI agents. He studied machine learning and computer science at Georgia Tech, and he has approached this problem from the product layer: watch the work, find the bottleneck, and prove what changed.",
          "As agents spread through companies, measurement becomes part of the infrastructure. Teams need to know which workflows return capacity, which ones add cost, and which work should disappear entirely. Autostep is building that scorecard and the action layer behind it. We backed Aidan and the team because they are making AI adoption accountable to outcomes rather than activity.",
        ],
      },
    ],
  },
  {
    slug: "higgsfield-series-b",
    title: "Higgsfield, again.",
    date: "August 21, 2026",
    dateISO: "2026-08-21",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "We invested again in Higgsfield, the AI-native creative platform for professional video, images, and visual production.",
    image: "/updates/covers/higgsfield.jpg",
    sections: [
      {
        body: [
          "We invested again in Higgsfield. The company has moved from an impressive AI video product into a broad creative operating system for creators, brands, agencies, and studios, and it is doing so at unusual speed.",
          "On August 17, Higgsfield announced a $400 million Series B at a $5.4 billion valuation, led by DST Global. The company says it has passed 30 million users across 238 countries and territories, reached $700 million in annualized revenue, and now powers visual production for 390 of the Fortune 500. Those are public milestones, but the more important signal is what sits underneath them: a new production workflow is moving from experimentation into daily commercial use.",
        ],
      },
      {
        heading: "What they're building",
        body: [
          "Higgsfield is not betting the company on one generation model. It brings more than 50 image, video, and audio models into one workspace, then builds the professional controls around them: shared projects, reusable characters and assets, camera direction, editing, enterprise administration, and agentic workflows that can carry an idea through multiple scenes and formats.",
          "Cinema Studio makes that product philosophy visible. Instead of asking a filmmaker to describe a look in vague language, it exposes cameras, lenses, focal lengths, pacing, and genre, then preserves those choices across a project. Supercomputer pushes the same idea further by automating multi-step creative work. The underlying models will keep changing. Higgsfield is building the layer where a team can direct them, combine them, and turn the output into finished work.",
        ],
      },
      {
        heading: "Why we invested again",
        body: [
          "Our first investment was a bet that the application layer in generative media would matter as much as the models. Better models expand what is possible, but professional adoption depends on everything around them: control, consistency, speed, collaboration, distribution, and trust. Higgsfield has kept assembling those pieces while the model frontier moves underneath it.",
          "Alex, Yerzat, Mahi, and the team have paired a fast product cadence with real commercial pull. They are building for the creator with taste and no production budget, and for the enterprise team that needs hundreds of assets to stay coherent and usable. That span is difficult to earn. We invested again because Higgsfield is turning frontier capability into a creative system people can use every day.",
        ],
      },
    ],
  },
  {
    slug: "the-future-is-built-together",
    title: "The future is built together.",
    date: "June 11, 2026",
    dateISO: "2026-06-11",
    category: "Letter",
    author: "Robert Neir & Hisham El-Husseini",
    excerpt:
      "Why we started All Together: nothing important gets built alone, and the things that matter most are being built right now.",
    image: "/updates/covers/the-future-is-built-together.jpg",
    sections: [
      {
        body: [
          "All Together is a venture firm in Seattle. We back founders building the hard frontier: AI, defense, energy, robotics, semiconductors, and space.",
          "This is the firm's founding letter, so it should answer the obvious question. Why start another venture firm? There are thousands, and most of them say the same things in the same fonts about the same companies. The honest answer is that we wanted to spend our working lives close to a certain kind of company, the kind that flies, welds, enriches, fabricates, and launches. That generation of companies is being built right now.",
        ],
      },
      {
        heading: "The name is the thesis",
        body: [
          "Nothing important gets built alone. An aircraft is tens of thousands of parts and hundreds of suppliers. A foundry is a town's worth of people agreeing on nanometers. A company is founders, early believers, first hires, customers who take a chance, and investors who stay when it gets hard. The picture only appears when the parts come together.",
          "That's the name. We don't mean all together as in consensus, since frontier companies are built by people who disagree with the consensus. We mean assembly. Many small parts, arranged with intent, until suddenly there is a picture where there wasn't one.",
        ],
      },
      {
        heading: "Why now",
        body: [
          "For thirty years the cheapest way to build the future was software alone. That era did its work. What's scarce now is energy, compute, autonomy, manufacturing capacity, and the will to deploy them. The countries and companies that build physical capability in the next decade will set the terms for the rest of the century.",
          "America is re-learning how to build. You can see it in the order books of defense startups, in new reactor designs actually getting licensed, in humanoid robots walking off assembly lines in California and Texas. We think this is the most consequential industrial moment since the postwar boom, and it is not a spectator sport.",
        ],
      },
      {
        heading: "How we work",
        body: [
          "We are a small firm and intend to stay one. We invest early, concentrate, and work for the founders we back. That means introductions, recruiting, customers, and the unglamorous middle years when the frontier is mostly paperwork and welding. We write when we have something to say, not on a content calendar.",
          "We live in Seattle, a city that built bombers, then operating systems, then the store that sells everything. It knows something about assembling the future from parts.",
          "The future is built together. The future is built now.",
        ],
      },
    ],
  },
  ...COMPANY_ARTICLES,
];

export const ARTICLES: Article[] = [...ARTICLE_ENTRIES].sort((a, b) =>
  b.dateISO.localeCompare(a.dateISO),
);

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
