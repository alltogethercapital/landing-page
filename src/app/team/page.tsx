import Image from "next/image";
import {
  CognitionPage,
  CognitionStrip,
} from "@/components/cognition-layout";
import { AsciiReveal, PortraitRevealSession } from "@/components/ascii-reveal";
import { LinkedInIcon, MailIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { CONTACT_MAILTO } from "@/lib/site";
import { slugify } from "@/lib/portfolio";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Our team",
  "Machine Spirit Capital is led by founding partners Robert Neir and Hisham El-Husseini.",
  "/team",
);

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
    img: "/leadership/transparent/robert-team-studio.webp",
    linkedin: "https://www.linkedin.com/in/robertmneir/",
    email: "robertneir@machinespirit.com",
  },
  {
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    img: "/leadership/transparent/hisham-team-studio.webp",
    linkedin: "https://www.linkedin.com/in/hisham-el-husseini/",
    email: "hisham@machinespirit.com",
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
        <AsciiReveal src={member.img}>
          <Image
            src={member.img}
            alt={member.name}
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
          <h2 className="cog-person-title">{member.name}</h2>
          <p className="cog-article-meta">{member.role}</p>
        </div>

        {(member.linkedin || member.email) && (
          <div className="cog-person-links">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`}>
                <LinkedInIcon />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                <MailIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function TeamPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionStrip className="cog-strip--inset cog-strip--page-start">
        <h1 className="sr-only">Our team</h1>
        <PortraitRevealSession page="/team">
          <div className="cog-person-grid">
            {MEMBERS.map((member) => (
              <MemberCard key={member.name} member={member} eager />
            ))}
          </div>
        </PortraitRevealSession>
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
