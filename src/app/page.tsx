import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AsciiHero } from "@/components/ascii-hero";
import {
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { UpdatesCarousel } from "@/components/updates-carousel";
import { ARTICLES } from "@/lib/articles";
import { PORTFOLIO } from "@/lib/portfolio";

// Lead with recognizable companies and keep the homepage preview scannable.
// The complete portfolio remains available on /companies.
const featuredCompanyNames = [
  "OpenAI",
  "Anduril",
  "Blue Origin",
  "Shield AI",
  "Replit",
  "1X",
  "Figure AI",
  "Apptronik",
  "Applied Intuition",
  "Supabase",
  "Aalo Atomics",
  "Path Robotics",
] as const;
// Normalize perceived logo size without distorting each company's artwork.
// Compact marks need less of the shared cell than long, lightweight wordmarks.
const homepageLogoScale: Record<string, number> = {
  OpenAI: 0.76,
  Anduril: 0.88,
  "Blue Origin": 1.16,
  "Shield AI": 0.86,
  Replit: 0.76,
  "1X": 0.7,
  "Figure AI": 0.9,
  Apptronik: 1,
  "Applied Intuition": 1.08,
  Supabase: 0.9,
  "Aalo Atomics": 0.64,
  "Path Robotics": 0.96,
};
const logoCompanies = featuredCompanyNames.flatMap((name) => {
  const company = PORTFOLIO.find((entry) => entry.name === name);
  return company && (company.cardLogo ?? company.logo) ? [company] : [];
});
const homepageUpdates = ARTICLES.map(
  ({ slug, title, date, dateISO, category, image }) => ({
    slug,
    title,
    date,
    dateISO,
    category,
    image,
  }),
);

export default function Home() {
  return (
    <CognitionPage>
      <SiteNav />

      <AsciiHero />

      <CognitionSection
        title="Investing in founders building legendary companies."
        className="cog-hero-section"
      >
        <div className="cog-copy-stack">
          <p>
            All Together backs the founders rebuilding the hard frontier
            across AI, defense, energy, robotics, semiconductors, and space.
          </p>
          <p>
            Investing in America&apos;s companies, resurgence, and future. We
            are based in Seattle, WA.
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
                style={
                  {
                    "--homepage-logo-scale":
                      homepageLogoScale[company.name] ?? 1,
                  } as CSSProperties
                }
              >
                {company.logoLabel ? (
                  <span className="cog-logo-lockup">
                    <Image
                      src={logo}
                      alt=""
                      width={38}
                      height={38}
                      unoptimized
                      className="cog-logo-lockup-mark"
                    />
                    <span>{company.logoLabel}</span>
                  </span>
                ) : (
                  <Image
                    src={logo}
                    alt={company.name}
                    fill
                    sizes="(max-width: 899px) calc((100vw - 64px) / 3), 152px"
                    unoptimized
                    className="object-contain"
                  />
                )}
              </a>
            );
          })}
        </div>
        <Link href="/companies" className="cog-logo-directory-link">
          View all {PORTFOLIO.length} companies
          <span aria-hidden="true">↗</span>
        </Link>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <UpdatesCarousel articles={homepageUpdates} />
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
