import Image from "next/image";
import { AsciiHero } from "@/components/ascii-hero";
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

      <AsciiHero />

      <CognitionSection
        hideTitle={false}
        title="Building the AI Machine Spirit"
        className="cog-hero-section"
      >
        <div className="cog-copy-stack">
          <p>
            Machine Spirit Capital backs the founders rebuilding the hard frontier
            across AI, defense, energy, robotics, semiconductors, and space.
          </p>
          <p>
            To us, the machine spirit is the intelligence, intent, and human
            craft embedded in the systems we build. As machines become more
            capable and autonomous, we need entrepreneurs who can create and
            steward them safely, at scale, and in service of human progress.
          </p>
          <p>
            We invest with urgency in America&apos;s resurgence and the companies
            building toward a more abundant, post-scarcity future. We are based
            in Seattle, WA.
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
                {logo && company.logoLabel ? (
                  <span className="cog-logo-cell-lockup">
                    <Image src={logo} alt="" width={28} height={28} unoptimized />
                    <span>{company.logoLabel}</span>
                  </span>
                ) : logo ? (
                  <Image
                    src={logo}
                    alt={company.name}
                    fill
                    sizes="(max-width: 899px) calc((100vw - 64px) / 3), 152px"
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <span className="cog-logo-word">{company.name}</span>
                )}
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
