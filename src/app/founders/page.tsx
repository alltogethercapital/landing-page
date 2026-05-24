import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight, LinkedInIcon, XIcon } from "@/components/icons";
import { CardGlyphs } from "@/components/card-glyphs";
import {
  FOUNDERS,
  companyForFounder,
  initialsFor,
  type Founder,
} from "@/lib/founders";
import { gradientFor, slugify } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our founders — All Together Capital",
  description:
    "The founders we back — building the hard frontier across AI, defense, energy, robotics, semiconductors, and space.",
};

function FounderCard({ founder }: { founder: Founder }) {
  const company = companyForFounder(founder);
  const hasHeadshot = Boolean(founder.headshot);
  // Anchor by company name so a company card can deep-link straight here.
  const anchor = slugify(company ? company.name : founder.name);

  // The card itself is NOT a link — only the company name and the social
  // icons below the founder's name are interactive.
  return (
    <div
      id={anchor}
      className="group founder-card relative scroll-mt-[100px] overflow-hidden rounded-2xl bg-[#0b0b0d] aspect-[674/720] max-md:aspect-[4/5]"
    >
      {/* Headshot, or a clean placeholder until a photo is added */}
      {hasHeadshot ? (
        <Image
          src={founder.headshot as string}
          alt={founder.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
          className="object-cover object-top brightness-[0.8] transition-[filter] duration-200 ease-out group-hover:brightness-100"
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            company ? gradientFor(company) : "from-[#141414] via-[#1c1c1c] to-[#262626]",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_22%,rgba(255,255,255,0.12),transparent_60%)]" />
          {/* placeholder avatar */}
          <div className="absolute inset-x-0 top-0 bottom-[38%] flex items-center justify-center">
            <span className="flex size-28 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[28px] font-semibold tracking-tight text-white/80 backdrop-blur-sm md:size-36 md:text-[36px]">
              {initialsFor(founder.name)}
            </span>
          </div>
        </div>
      )}

      {/* Auto-flipping binary field over the headshot — reveals on hover */}
      <CardGlyphs />

      {/* Legibility gradient — lighter so the headshot leads; brightens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Bottom: tag, divider, founder name, then interactive company + socials */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/75">
          {company ? company.sectors.join(" · ") : "Founder"}
        </span>
        <div className="mt-4 h-px w-full bg-white/25" />
        <h3 className="mt-4 font-medium leading-[1.02] tracking-[-1px] text-white text-[26px] md:text-[38px]">
          {founder.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          {company && (
            <a
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/co inline-flex items-center gap-2.5 text-white/80 transition-colors hover:text-white"
            >
              {company.logo && (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-[0_2px_10px_rgba(0,0,0,0.4)] md:size-8">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={64}
                    height={64}
                    className="size-full object-contain"
                  />
                </span>
              )}
              <span className="text-[14px] font-medium md:text-[16px]">
                {company.name}
              </span>
              <ArrowUpRight className="size-3.5 text-white/40 transition-all group-hover/co:-translate-y-0.5 group-hover/co:translate-x-0.5 group-hover/co:text-[#ff4400]" />
            </a>
          )}

          <div className="flex shrink-0 items-center gap-1.5">
            {founder.linkedin && (
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} on LinkedIn`}
                className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <LinkedInIcon className="size-4" />
              </a>
            )}
            {founder.x && (
              <a
                href={founder.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} on X`}
                className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <XIcon className="size-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0b0d]">
      <SiteNav showLogo />

      {/* Heading */}
      <section className="px-6 pt-[104px] md:px-[40px] md:pt-[140px]">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-[#ff4400]" />
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#0b0b0d]/60">
            Our founders
          </span>
        </div>
        <h1 className="mt-5 max-w-[16ch] text-[40px] font-semibold leading-[1.02] tracking-[-1.7px] md:text-[56px] md:tracking-[-2.5px]">
          Our founders
        </h1>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-[#0b0b0d]/55 md:text-[18px]">
          The crazy, bold, visionary founders we back — building the hard
          frontier across artificial intelligence, defense, energy, robotics,
          semiconductors, and space.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 pt-10 md:px-[40px]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((founder) => (
            <FounderCard key={founder.companyName} founder={founder} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 text-center md:px-[40px] md:py-36">
        <h2 className="mx-auto max-w-[20ch] text-[36px] font-semibold leading-[1.04] tracking-[-1.4px] md:text-[68px] md:tracking-[-2.8px]">
          Crazy, bold, visionary founders are what{" "}
          <span className="text-[#ff4400]">move America forward.</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff4400] px-7 py-4 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Our companies
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
