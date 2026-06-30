import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLink,
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { AsciiReveal } from "@/components/ascii-reveal";
import { ArrowUpRight, LinkedInIcon, MailIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { CONTACT_MAILTO } from "@/lib/site";
import { slugify } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Our team — All Together",
  description:
    "All Together is led by founding partners Robert Neir and Hisham El-Husseini.",
};

type Member = {
  name: string;
  role: string;
  img: string;
  linkedin?: string;
  email?: string;
  website?: { label: string; href: string };
};

const MEMBERS: Member[] = [
  {
    name: "Robert Neir",
    role: "Founding Partner",
    img: "/leadership/webp/robert-team-studio.webp",
    linkedin: "https://www.linkedin.com/in/robertmneir/",
    email: "robertneir@alltogethercapital.com",
  },
  {
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    img: "/leadership/webp/hisham-team-studio.webp",
    linkedin: "https://www.linkedin.com/in/hisham-el-husseini/",
    email: "hisham@alltogethercapital.com",
  },
  {
    name: "NEO",
    role: "Head of Robotics",
    img: "/leadership/webp/neo-team-studio.webp",
    website: { label: "1x.tech", href: "https://www.1x.tech/" },
  },
];

function MemberCard({ member, eager = false }: { member: Member; eager?: boolean }) {
  const profile =
    member.linkedin ?? member.website?.href ?? (member.email ? `mailto:${member.email}` : undefined);
  const profileLabel = member.linkedin ? "LinkedIn" : member.website ? member.website.label : "email";

  return (
    <article id={slugify(member.name)} className="cog-person-card">
      <a
        href={profile ?? CONTACT_MAILTO}
        target={profile && !profile.startsWith("mailto:") ? "_blank" : undefined}
        rel={profile && !profile.startsWith("mailto:") ? "noopener noreferrer" : undefined}
        aria-label={`${member.name} on ${profileLabel}`}
        className="cog-person-media"
      >
        <Image
          src={member.img}
          alt={member.name}
          fill
          sizes="(max-width: 899px) calc((100vw - 48px) / 2), 303px"
          unoptimized
          loading={eager ? "eager" : "lazy"}
          className="object-contain object-bottom"
        />
        <AsciiReveal src={member.img} />
      </a>

      <div className="cog-person-copy">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="cog-person-title">{member.name}</h2>
            <p className="cog-article-meta">{member.role}</p>
          </div>
          {profile && (
            <a
              href={profile}
              target={profile.startsWith("mailto:") ? undefined : "_blank"}
              rel={profile.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={`${member.name} on ${profileLabel}`}
              className="cog-arrow-icon"
            >
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>

        <div className="cog-person-links">
          {member.website && (
            <a href={member.website.href} target="_blank" rel="noopener noreferrer">
              {member.website.label}
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="size-3.5" />
              LinkedIn
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`}>
              <MailIcon className="size-3.5" />
              Email
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TeamPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Our team" title="Our team.">
        <p className="cog-body-copy">
          All Together is led by founding partners Robert Neir and
          Hisham El-Husseini.
        </p>
        <ArrowLink href={CONTACT_MAILTO} className="mt-8">
          Email
        </ArrowLink>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <div className="cog-person-grid cog-person-grid--short">
          {MEMBERS.map((member) => (
            <MemberCard key={member.name} member={member} eager />
          ))}
        </div>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
