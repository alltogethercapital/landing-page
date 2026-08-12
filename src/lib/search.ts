import { ARTICLES } from "./articles";
import { FOUNDERS, founderAnchor } from "./founders";
import { PORTFOLIO, slugify } from "./portfolio";

export type SearchResultSection = "Companies" | "Founders" | "Updates";

export type SearchResult = {
  id: string;
  section: SearchResultSection;
  title: string;
  subtitle: string;
  description?: string;
  href: string;
  image?: string;
  searchText: string;
};

function searchableText(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function buildSearchIndex(): SearchResult[] {
  const companies: SearchResult[] = PORTFOLIO.map((company) => ({
    id: `company-${slugify(company.name)}`,
    section: "Companies",
    title: company.name,
    subtitle: company.sectors.join(" · "),
    description: company.blurb,
    href: `/companies#${slugify(company.name)}`,
    image: company.cardImage ?? company.image,
    searchText: searchableText([
      company.name,
      company.sectors.join(" "),
      company.blurb,
    ]),
  }));

  const founders: SearchResult[] = FOUNDERS.map((founder) => ({
    id: `founder-${founderAnchor(founder)}`,
    section: "Founders",
    title: founder.name,
    subtitle: founder.companyName,
    href: `/founders#${founderAnchor(founder)}`,
    image: founder.headshot,
    searchText: searchableText([founder.name, founder.companyName]),
  }));

  const updates: SearchResult[] = ARTICLES.map((article) => ({
    id: `update-${article.slug}`,
    section: "Updates",
    title: article.title,
    subtitle: `${article.category} · ${article.date}`,
    description: article.excerpt,
    href: `/updates/${article.slug}`,
    image: article.image,
    searchText: searchableText([
      article.title,
      article.category,
      article.author,
      article.excerpt,
      ...article.sections.flatMap((section) => [section.heading, ...section.body]),
    ]),
  }));

  return [...companies, ...founders, ...updates];
}
