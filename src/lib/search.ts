import { ARTICLES } from "./articles";
import { FOUNDERS, founderAnchor } from "./founders";
import { PORTFOLIO, slugify, type Company } from "./portfolio";

export type SearchResultSection = "Companies" | "Founders" | "Updates";

export type SearchResult = {
  id: string;
  section: SearchResultSection;
  title: string;
  subtitle: string;
  description?: string;
  logoSrc: string;
  href: string;
  searchText: string;
};

function searchableText(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function companyLogo(company: Company | undefined) {
  return company?.cardLogo ?? company?.logo ?? "/brand/machine-spirit-live-symbol.png";
}

export function buildSearchIndex(): SearchResult[] {
  const companiesByName = new Map(PORTFOLIO.map((company) => [company.name, company]));
  const companiesBySlug = new Map(PORTFOLIO.map((company) => [slugify(company.name), company]));

  const companies: SearchResult[] = PORTFOLIO.map((company) => ({
    id: `company-${slugify(company.name)}`,
    section: "Companies",
    title: company.name,
    subtitle: company.sectors.join(" · "),
    description: company.blurb,
    logoSrc: companyLogo(company),
    href: `/companies#${slugify(company.name)}`,
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
    logoSrc: companyLogo(companiesByName.get(founder.companyName)),
    href: `/founders#${founderAnchor(founder)}`,
    searchText: searchableText([founder.name, founder.companyName]),
  }));

  const updates: SearchResult[] = ARTICLES.map((article) => ({
    id: `update-${article.slug}`,
    section: "Updates",
    title: article.title,
    subtitle: `${article.category} · ${article.date}`,
    description: article.excerpt,
    logoSrc: companyLogo(companiesBySlug.get(article.slug)),
    href: `/updates/${article.slug}`,
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
