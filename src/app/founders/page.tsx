import Image from "next/image";
import {
  ArrowLink,
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { AsciiReveal, PortraitRevealSession } from "@/components/ascii-reveal";
import { ArrowUpRight, LinkedInIcon, XIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { pageMetadata } from "@/lib/page-metadata";
import {
  FOUNDERS,
  companyForFounder,
  founderAnchor,
  type Founder,
} from "@/lib/founders";

export const metadata = pageMetadata(
  "Our entrepreneurs",
  "The entrepreneurs building and stewarding the hard frontier across AI, defense, energy, robotics, semiconductors, and space.",
  "/founders",
);

function FounderCard({ founder, eager = false }: { founder: Founder; eager?: boolean }) {
  const company = companyForFounder(founder);
  const destination = company?.href ?? "/companies";
  const destinationLabel = company ? `Visit ${company.name} website` : "View our companies";
  const external = destination.startsWith("https://");

  return (
    <article id={founderAnchor(founder)} className="cog-person-card">
      <a
        href={destination}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`${founder.name}: ${destinationLabel}`}
        className="cog-person-media"
      >
        <AsciiReveal src={founder.headshot} fit="contain">
          <Image
            src={founder.headshot}
            alt={founder.name}
            fill
            sizes="(max-width: 899px) calc((100vw - 48px) / 2), 303px"
            unoptimized
            loading={eager ? "eager" : "lazy"}
            className="object-contain object-bottom"
          />
        </AsciiReveal>
      </a>

      <div className="cog-person-copy">
        <div className="cog-person-heading">
          <div>
            <h2 className="cog-person-title">{founder.name}</h2>
            <p className="cog-article-meta">
              {company ? (
                <a className="cog-person-company" href={company.href} target="_blank" rel="noopener noreferrer">
                  {founder.companyName}
                </a>
              ) : founder.companyName}
            </p>
          </div>
          <a
            href={destination}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={`${founder.name}: ${destinationLabel}`}
            className="cog-arrow-icon"
          >
            <ArrowUpRight />
          </a>
        </div>

        {(founder.linkedin || founder.x) && (
          <div className="cog-person-links">
            {founder.linkedin && (
              <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${founder.name} on LinkedIn`}>
                <LinkedInIcon />
                LinkedIn
              </a>
            )}
            {founder.x && (
              <a href={founder.x} target="_blank" rel="noopener noreferrer" aria-label={`${founder.name} on X`}>
                <XIcon />X
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function FoundersPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Our entrepreneurs" title="Our entrepreneurs." hideTitle>
        <p className="cog-body-copy">
          The entrepreneurs we back are building and stewarding the hard
          frontier, turning new technology into durable systems that expand
          human capability.
        </p>
        <ArrowLink href="/companies" className="mt-8">
          See companies
        </ArrowLink>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <PortraitRevealSession page="/founders">
          <div className="cog-person-grid">
            {FOUNDERS.map((founder, index) => (
              <FounderCard
                key={founderAnchor(founder)}
                founder={founder}
                eager={index < 4}
              />
            ))}
          </div>
        </PortraitRevealSession>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
