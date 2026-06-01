import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight, LinkedInIcon, MailIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Our team — All Together Capital",
  description:
    "All Together Capital is led by founding partners Robert Neir and Hisham El-Husseini.",
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
    img: "/leadership/robert-team-studio.png",
    linkedin: "https://www.linkedin.com/in/robertmneir/",
    email: "robertneir@alltogethercapital.com",
  },
  {
    name: "Hisham El-Husseini",
    role: "Founding Partner",
    img: "/leadership/hisham-team-studio.png",
    linkedin: "https://www.linkedin.com/in/hisham-el-husseini/",
    email: "hisham@alltogethercapital.com",
  },
  {
    name: "NEO",
    role: "Head of Robotics",
    img: "/leadership/neo-team-studio.png",
    website: { label: "1x.tech", href: "https://www.1x.tech/" },
  },
];

function MemberCard({ m }: { m: Member }) {
  const profile = m.linkedin ?? m.website?.href ?? (m.email ? `mailto:${m.email}` : undefined);
  const profileLabel = m.linkedin ? "LinkedIn" : m.website ? m.website.label : "email";

  return (
    <div className="group founder-card relative grid scroll-mt-[100px] overflow-hidden rounded-2xl bg-white aspect-[674/720] grid-rows-[minmax(0,1fr)_auto] max-md:aspect-[4/5]">
      <div className="relative min-h-0 overflow-hidden bg-white">
        <Image
          src={m.img}
          alt={m.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={100}
          className="object-contain object-center"
        />

        <div className="pointer-events-none absolute bottom-4 left-4 z-[2] max-w-[calc(100%-2rem)] translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:bottom-5 md:left-5 max-lg:translate-y-0 max-lg:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <h3 className="rounded-lg border border-white/60 bg-white/70 px-3.5 py-2 text-[19px] font-medium leading-[1.02] tracking-[-0.3px] text-[#0b0b0d] shadow-[0_12px_34px_rgba(0,0,0,0.16)] backdrop-blur-md md:text-[24px]">
            {m.name}
          </h3>
        </div>
      </div>

      {profile && (
        <a
          href={profile}
          target={profile.startsWith("mailto:") ? undefined : "_blank"}
          rel={profile.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          aria-label={`${m.name} on ${profileLabel}`}
          className="absolute inset-0 z-[1]"
        />
      )}

      {profile && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 z-[2] flex size-11 items-center justify-center bg-black/[0.06] text-[#0b0b0d] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:right-5 md:top-5 md:size-12"
        >
          <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-7" />
        </span>
      )}

      <div className="pointer-events-none relative z-[2] min-h-[72px] px-5 py-4 md:px-6">
        <div className="flex h-full min-w-0 items-center">
          <p className="min-w-0 max-w-[calc(100%-4.75rem)] truncate text-[14px] font-medium text-[#0b0b0d]/70 md:text-[15px]">
            {m.role}
          </p>

          <div className="pointer-events-none absolute right-5 top-1/2 z-[3] flex -translate-y-1/2 translate-x-1 items-center gap-1.5 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 md:right-6 max-lg:pointer-events-auto max-lg:translate-x-0 max-lg:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100">
            {m.website && (
              <a
                href={m.website.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} - ${m.website.label}`}
                className="flex size-8 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/60 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <ArrowUpRight className="size-4" />
              </a>
            )}
            {m.linkedin && (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${m.name} on LinkedIn`}
                className="flex size-8 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/60 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <LinkedInIcon className="size-4" />
              </a>
            )}
            {m.email && (
              <a
                href={`mailto:${m.email}`}
                aria-label={`Email ${m.name}`}
                className="flex size-8 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/60 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <MailIcon className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0b0d]">
      <SiteNav showLogo />

      <section className="px-6 pt-[104px] md:px-[40px] md:pt-[140px]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m) => (
            <MemberCard key={m.name} m={m} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
