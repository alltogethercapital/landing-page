import { AsciiHero } from "@/components/ascii-hero";
import { CompanyLogo } from "@/components/company-logo";
import {
  ArrowLink,
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { UpdatesCarousel } from "@/components/updates-carousel";
import { ARTICLES } from "@/lib/articles";
import { PORTFOLIO } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Home",
  "Machine Spirit Capital backs the founders creating and stewarding the hard frontier across AI, defense, energy, robotics, semiconductors, and space.",
  "/",
);

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

      <div className="cog-landing">
        <AsciiHero />
      </div>

      <CognitionSection
        title="Manifesto"
        hideTitle={false}
        className="cog-hero-section cog-manifesto-section"
      >
        <div className="cog-copy-stack">
          <p>
            AI will inhabit every machine. Robots, factories, power grids,
            vehicles, and spacecraft will sense, reason, and act.
          </p>
          <p>
            That is the machine spirit: intelligence given form and purpose.
          </p>
          <p>
            We back the founders building it across AI, robotics, semiconductors,
            energy, defense, and space.
          </p>
          <p>
            We invest in machines that make energy abundant, rebuild industry,
            defend free societies, and carry humanity beyond Earth.
          </p>
        </div>
      </CognitionSection>

      <CognitionSection wide className="cog-logo-section">
        <div className="cog-logo-mosaic" aria-label="Machine Spirit Capital companies">
          {PORTFOLIO.map((company) => {
            const logo = company.cardLogo ?? company.logo;
            return (
              <a
                key={company.name}
                href={company.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cog-logo-cell"
                aria-label={company.name}
              >
                <CompanyLogo name={company.name} src={logo} label={company.logoLabel} decorative />
              </a>
            );
          })}
        </div>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <UpdatesCarousel articles={homepageUpdates} />
        <ArrowLink href="/updates" className="mt-10">
          All updates
        </ArrowLink>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
