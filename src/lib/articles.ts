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
export const ARTICLES: Article[] = [
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

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
