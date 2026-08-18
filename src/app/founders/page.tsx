import type { Metadata } from "next";
import Image from "next/image";
import {
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { AsciiReveal } from "@/components/ascii-reveal";
import { ArrowUpRight, LinkedInIcon, XIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import {
  FOUNDERS,
  companyForFounder,
  founderAnchor,
  initialsFor,
  type Founder,
} from "@/lib/founders";

export const metadata: Metadata = {
  title: "Our entrepreneurs — All Together",
  description:
    "The entrepreneurs we back, building the hard frontier across AI, defense, energy, robotics, semiconductors, and space.",
};

function whiteHeadshotSrc(headshot: string) {
  return headshot
    .replace("/founders/cutouts/", "/founders/white-webp/")
    .replace(/\.png$/, ".webp");
}

function FounderCard({ founder, eager = false }: { founder: Founder; eager?: boolean }) {
  const company = companyForFounder(founder);
  const profile = founder.linkedin ?? founder.x;
  const profileLabel = founder.linkedin ? "LinkedIn" : "X";

  return (
    <article id={founderAnchor(founder)} className="cog-person-card">
      <a
        href={profile ?? company?.href ?? "#"}
        target={profile ? "_blank" : undefined}
        rel={profile ? "noopener noreferrer" : undefined}
        aria-label={profile ? `${founder.name} on ${profileLabel}` : founder.name}
        className="cog-person-media"
      >
        {founder.headshot ? (
          <>
            <Image
              src={whiteHeadshotSrc(founder.headshot)}
              alt={founder.name}
              fill
              sizes="(max-width: 899px) calc((100vw - 48px) / 2), 303px"
              unoptimized
              loading={eager ? "eager" : "lazy"}
              className="object-contain object-bottom"
            />
            <AsciiReveal src={whiteHeadshotSrc(founder.headshot)} />
          </>
        ) : (
          <span className="cog-person-initials">{initialsFor(founder.name)}</span>
        )}
      </a>

      <div className="cog-person-copy">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="cog-person-title">{founder.name}</h2>
            <p className="cog-article-meta">{founder.companyName}</p>
          </div>
          {profile && (
            <a
              href={profile}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${founder.name} on ${profileLabel}`}
              className="cog-arrow-icon"
            >
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>

        <div className="cog-person-links">
          {company && (
            <a href={company.href} target="_blank" rel="noopener noreferrer">
              {company.name}
            </a>
          )}
          {founder.linkedin && (
            <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="size-3.5" />
              LinkedIn
            </a>
          )}
          {founder.x && (
            <a href={founder.x} target="_blank" rel="noopener noreferrer">
              <XIcon className="size-3" />X
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FoundersPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Our entrepreneurs" title="Our entrepreneurs.">
        <p className="cog-body-copy">
          The entrepreneurs we back, building the hard frontier across AI,
          defense, energy, robotics, semiconductors, and space.
        </p>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <div className="cog-person-grid">
          {FOUNDERS.map((founder, index) => (
            <FounderCard
              key={founderAnchor(founder)}
              founder={founder}
              eager={index < 4}
            />
          ))}
        </div>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
