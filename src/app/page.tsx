import Image from "next/image";
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

// The homepage mosaic is the complete public portfolio. Its dense responsive
// grid keeps every company visible without turning the section into a long
// directory; the full company cards remain available on /companies.
const logoCompanies = PORTFOLIO.filter((company) => company.cardLogo ?? company.logo);
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
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <UpdatesCarousel articles={homepageUpdates} />
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
