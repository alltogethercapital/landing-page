import Image from "next/image";
import Link from "next/link";
import { AsciiHero } from "@/components/ascii-hero";
import {
  ArrowLink,
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ARTICLES } from "@/lib/articles";
import { PORTFOLIO } from "@/lib/portfolio";

const logoCompanies = PORTFOLIO.filter((company) => company.cardLogo ?? company.logo).slice(0, 24);
const latestUpdates = ARTICLES.slice(0, 4);

export default function Home() {
  return (
    <CognitionPage>
      <SiteNav />

      <AsciiHero />

      <CognitionSection
        title={
          <>
            The future is built together.
            <br />
            The future is built now.
          </>
        }
        className="cog-hero-section"
      >
        <div className="cog-copy-stack">
          <p>
            All Together backs the founders rebuilding the hard frontier
            across AI, defense, energy, robotics, semiconductors, and space.
          </p>
          <p>
            Investing in America&apos;s companies, resurgence, and future.
            We are based in Seattle, WA.
          </p>
        </div>
      </CognitionSection>

      <CognitionSection wide className="cog-logo-section">
        <div className="cog-logo-mosaic" aria-label="All Together companies">
          {logoCompanies.map((company) => {
            const logo = company.cardLogo ?? company.logo;
            if (!logo) return null;
            return (
              <a
                key={company.name}
                href={company.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cog-logo-cell"
                aria-label={company.name}
              >
                <Image
                  src={logo}
                  alt={company.name}
                  fill
                  sizes="(max-width: 768px) 28vw, 152px"
                  unoptimized
                  className="object-contain"
                />
              </a>
            );
          })}
        </div>
      </CognitionSection>

      <CognitionStrip>
        <h2 className="cog-strip-heading">Updates</h2>
        <div className="cog-article-grid">
          {latestUpdates.map((article) => (
            <Link
              key={article.slug}
              href={`/updates/${article.slug}`}
              className="cog-article-card"
            >
              <span className="cog-article-media">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 82vw, 303px"
                  unoptimized
                  className="cog-cover object-cover"
                />
              </span>
              <span className="cog-article-title">{article.title}</span>
              <span className="cog-article-meta">
                <time dateTime={article.dateISO}>{article.date}</time> ·{" "}
                {article.category}
              </span>
            </Link>
          ))}
        </div>
        <ArrowLink href="/updates" className="mt-10">
          All updates
        </ArrowLink>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
