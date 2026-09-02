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

// 25 fills the desktop mosaic exactly (5 columns x 5 rows). The 3-column
// mobile grid hides the last one, so 24 divides evenly there too — neither
// breakpoint is left with an orphan cell. Order is the portfolio's own
// most-known-first ordering; the mosaic is a selection, not the full list.
const logoCompanies = PORTFOLIO.filter((company) => company.cardLogo ?? company.logo).slice(0, 25);
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
        title={
          <>
            <span className="cog-title-line">
              <span className="cog-title-keep">The future is built</span>{" "}
              <span>together.</span>
            </span>
            <span className="cog-title-line">
              <span className="cog-title-keep">The future is built</span>{" "}
              <span>now.</span>
            </span>
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
