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
const homepageLogoFrame: Record<
  string,
  { width: number; height: number; mobileWidth: number; mobileHeight: number }
> = {
  OpenAI: { width: 104, height: 28, mobileWidth: 86, mobileHeight: 23 },
  Anduril: { width: 130, height: 28, mobileWidth: 94, mobileHeight: 21 },
  "Blue Origin": { width: 106, height: 36, mobileWidth: 82, mobileHeight: 28 },
  "Shield AI": { width: 130, height: 28, mobileWidth: 94, mobileHeight: 21 },
  Replit: { width: 104, height: 29, mobileWidth: 84, mobileHeight: 23 },
  "1X": { width: 44, height: 30, mobileWidth: 38, mobileHeight: 26 },
  "Figure AI": { width: 135, height: 24, mobileWidth: 94, mobileHeight: 17 },
  Apptronik: { width: 142, height: 19, mobileWidth: 98, mobileHeight: 14 },
  "Applied Intuition": { width: 144, height: 23, mobileWidth: 98, mobileHeight: 16 },
  Supabase: { width: 110, height: 30, mobileWidth: 88, mobileHeight: 24 },
  "Aalo Atomics": { width: 64, height: 28, mobileWidth: 52, mobileHeight: 23 },
  "Path Robotics": { width: 130, height: 28, mobileWidth: 94, mobileHeight: 20 },
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
            const frame = homepageLogoFrame[company.name];
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
                  <span
                    className="cog-logo-frame"
                    style={
                      frame
                        ? ({
                            "--logo-frame-width": `${frame.width}px`,
                            "--logo-frame-height": `${frame.height}px`,
                            "--logo-frame-mobile-width": `${frame.mobileWidth}px`,
                            "--logo-frame-mobile-height": `${frame.mobileHeight}px`,
                          } as CSSProperties)
                        : undefined
                    }
                  >
                    <Image
                      src={logo}
                      alt={company.name}
                      fill
                      sizes="(max-width: 899px) 96px, 156px"
                      unoptimized
                      className="object-contain"
                    />
                  </span>
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
