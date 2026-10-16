import { CompanyLogo } from "@/components/company-logo";
import {
  ArrowLink,
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ArrowUpRight } from "@/components/icons";
import { PORTFOLIO, slugify, type Company } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Our companies",
  "Companies creating and stewarding the technologies that will define the machine age.",
  "/companies",
);

function CompanyArticle({ company }: { company: Company }) {
  const logo = company.cardLogo ?? company.logo;

  return (
    <article id={slugify(company.name)} className="cog-company-card">
      <a
        href={company.href}
        target="_blank"
        rel="noopener noreferrer"
        className="cog-company-card-link"
        aria-label={`Visit ${company.name}`}
      >
        <span className="cog-company-card-arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
        <span className="cog-company-card-content">
          <span className="cog-company-logo-wrap">
            <CompanyLogo name={company.name} src={logo} label={company.logoLabel} size="card" decorative />
          </span>
          {company.blurb && (
            <span className="cog-company-card-description">{company.blurb}</span>
          )}
        </span>
      </a>
    </article>
  );
}

export default function CompaniesPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Our companies" title="Our companies." hideTitle>
        <p className="cog-body-copy">
          Companies creating and stewarding the technologies that will define
          the machine age, across AI, defense, energy, robotics,
          semiconductors, and space.
        </p>
        <ArrowLink href="/founders" className="mt-8">
          Meet the entrepreneurs
        </ArrowLink>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset cog-strip--portfolio">
        <div className="cog-company-list">
          {PORTFOLIO.map((company) => (
            <CompanyArticle key={company.name} company={company} />
          ))}
        </div>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
