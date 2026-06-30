import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLink,
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ArrowUpRight } from "@/components/icons";
import { glyphFor } from "@/lib/glyphs";
import { PORTFOLIO, slugify, type Company } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Our companies — All Together",
  description:
    "Our companies, across AI, defense, energy, robotics, semiconductors, and space.",
};

function CompanyArticle({ company, eager = false }: { company: Company; eager?: boolean }) {
  const image = company.cardImage ?? company.image;
  const logo = company.cardLogo ?? company.logo;
  const isPending = company.investmentStatus === "pending";

  return (
    <article id={slugify(company.name)} className="cog-company-row">
      <a
        href={company.href}
        target="_blank"
        rel="noopener noreferrer"
        className="cog-company-media"
        aria-label={`Visit ${company.name}`}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 899px) 34vw, 420px"
            unoptimized
            loading={eager ? "eager" : "lazy"}
            className="object-cover"
          />
        ) : logo ? (
          <Image
            src={logo}
            alt=""
            fill
            sizes="(max-width: 899px) 34vw, 420px"
            unoptimized
            loading={eager ? "eager" : "lazy"}
            className="object-contain p-12"
          />
        ) : (
          <span className="cog-article-fallback">{company.name}</span>
        )}
      </a>

      <div className="cog-company-copy">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="cog-article-meta">
              <span className="cog-glyph-chip" aria-hidden="true">
                {glyphFor(company.name)}
              </span>
              {isPending ? "Pending / " : ""}
              {company.sectors.join(" / ")}
            </p>
            <h2 className="cog-company-title">{company.name}</h2>
          </div>
          <a
            href={company.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${company.name}`}
            className="cog-arrow-icon"
          >
            <ArrowUpRight className="size-4" />
          </a>
        </div>
        {company.blurb && <p className="cog-company-blurb">{company.blurb}</p>}
      </div>
    </article>
  );
}

export default function CompaniesPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Our companies" title="Our companies.">
        <p className="cog-body-copy">
          Across AI, defense, energy, robotics, semiconductors, and space.
        </p>
        <ArrowLink href="/founders" className="mt-8">
          Meet the founders
        </ArrowLink>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <div className="cog-company-list">
          {PORTFOLIO.map((company, index) => (
            <CompanyArticle key={company.name} company={company} eager={index < 4} />
          ))}
        </div>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
