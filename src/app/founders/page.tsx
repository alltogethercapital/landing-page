import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight, LinkedInIcon, XIcon } from "@/components/icons";
import {
  FOUNDERS,
  companyForFounder,
  founderAnchor,
  initialsFor,
  type Founder,
} from "@/lib/founders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our founders — All Together Capital",
  description:
    "The founders we back — building the hard frontier across AI, defense, energy, robotics, semiconductors, and space.",
};

function studioHeadshotSrc(headshot: string) {
  return headshot
    .replace("/founders/cutouts/", "/founders/studio/")
    .replace(/\.png$/, ".jpg");
}

function FounderCard({ founder }: { founder: Founder }) {
  const company = companyForFounder(founder);
  const hasHeadshot = Boolean(founder.headshot);
  // Unique anchor (name + company) so multiple founders can share a company;
  // company cards deep-link here via the same scheme.
  const anchor = founderAnchor(founder);
  // The whole card links to the founder's profile — LinkedIn first, then X.
  const profile = founder.linkedin ?? founder.x;
  const profileLabel = founder.linkedin ? "LinkedIn" : "X";

  return (
    <div
      id={anchor}
      className="group founder-card relative grid scroll-mt-[100px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] aspect-[674/720] grid-rows-[minmax(0,1fr)_auto] max-md:aspect-[4/5]"
    >
      {/* Headshot, or a clean placeholder until a photo is added */}
      <div className="relative min-h-0 overflow-hidden bg-white">
        {hasHeadshot ? (
          <Image
            src={studioHeadshotSrc(founder.headshot as string)}
            alt={founder.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[#f5f5f7]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-28 items-center justify-center rounded-full border border-black/10 bg-white text-[28px] font-semibold tracking-tight text-[#0b0b0d]/70 md:size-36 md:text-[36px]">
                {initialsFor(founder.name)}
              </span>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-4 left-4 z-[2] max-w-[calc(100%-2rem)] translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 md:bottom-5 md:left-5 max-lg:translate-y-0 max-lg:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <h3 className="rounded-lg border border-white/60 bg-white/70 px-3.5 py-2 text-[19px] font-medium leading-[1.02] tracking-[-0.3px] text-[#0b0b0d] shadow-[0_12px_34px_rgba(0,0,0,0.16)] backdrop-blur-md md:text-[24px]">
            {founder.name}
          </h3>
        </div>
      </div>

      {/* Stretched link — the whole card (except the company + social links below)
          opens the founder's profile: LinkedIn first, then X. */}
      {profile && (
        <a
          href={profile}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${founder.name} on ${profileLabel}`}
          className="absolute inset-0 z-[1]"
        />
      )}

      {/* Open affordance — arrow, top-right, signalling the card links out
          (matching the company cards). */}
      {profile && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 z-[2] flex size-11 items-center justify-center bg-black/[0.06] text-[#0b0b0d] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:right-5 md:top-5 md:size-12"
        >
          <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-7" />
        </span>
      )}

      {/* Bottom: company stays visible; social links reveal on hover/focus. */}
      <div className="pointer-events-none relative z-[2] min-h-[72px] border-t border-black/[0.06] px-5 py-4 md:px-6">
        <div className="flex h-full min-w-0 items-center">
          {company && (
            <a
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/co pointer-events-auto relative z-[3] inline-flex min-w-0 max-w-[calc(100%-4.75rem)] items-center gap-2.5 text-[#0b0b0d]/70 transition-colors hover:text-[#0b0b0d]"
            >
              {company.logo && (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-[0_2px_10px_rgba(0,0,0,0.12)] md:size-8">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={64}
                    height={64}
                    className="size-full object-contain"
                  />
                </span>
              )}
              <span className="min-w-0 truncate text-[14px] font-medium md:text-[15px]">
                {company.name}
              </span>
              <ArrowUpRight className="size-3.5 text-[#0b0b0d]/35 transition-all group-hover/co:-translate-y-0.5 group-hover/co:translate-x-0.5 group-hover/co:text-[#ff4400]" />
            </a>
          )}

          <div className="pointer-events-none absolute right-5 top-1/2 z-[3] flex -translate-y-1/2 translate-x-1 items-center gap-1.5 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 md:right-6 max-lg:pointer-events-auto max-lg:translate-x-0 max-lg:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100">
            {founder.linkedin && (
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} on LinkedIn`}
                className="flex size-8 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/60 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
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
                className="flex size-8 items-center justify-center rounded-full border border-black/10 text-[#0b0b0d]/60 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
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

// Compact tile for founders we don't have a headshot for yet — no portrait
// placeholder, just a sector-tinted backdrop with name + company + socials.
// The tile has NO intrinsic aspect ratio; it fills whatever grid row its
// parent gives it (the pair container in FoundersPage sizes it via
// `grid-rows-2`, so two stacked tiles match one photo-card cell).
function CompactFounderTile({
  founder,
  solo = false,
}: {
  founder: Founder;
  solo?: boolean;
}) {
  const company = companyForFounder(founder);
  const anchor = founderAnchor(founder);
  const profile = founder.linkedin ?? founder.x;
  const profileLabel = founder.linkedin ? "LinkedIn" : "X";

  return (
    <div
      id={anchor}
      className={cn(
        "group relative min-h-0 overflow-hidden rounded-2xl bg-[#0b0b0d] scroll-mt-[100px]",
        // Solo cell (no partner tile to share the slot with) — give it its
        // own short aspect (~half a pair) so the row sizes down to it and
        // there's no tall empty bottom. self-start prevents the grid from
        // stretching it to match any taller siblings in the same row.
        solo && "aspect-[674/350] max-md:aspect-[5/3] self-start",
      )}
    >
      <div className="absolute inset-0 bg-[#0b0b0d]" />

      {/* Stretched link to the founder's primary profile (LinkedIn first, X otherwise) */}
      {profile && (
        <a
          href={profile}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${founder.name} on ${profileLabel}`}
          className="absolute inset-0 z-[1]"
        />
      )}

      {/* Open affordance — smaller arrow than FounderCard's */}
      {profile && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 z-[2] flex size-8 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:right-4 md:top-4 md:size-9"
        >
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-[18px]" />
        </span>
      )}

      {/* Content — fills the tile, no image area */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col p-5 md:p-6">
        <h3 className="text-[20px] font-medium leading-[1.05] tracking-[-0.4px] text-white md:text-[22px]">
          {founder.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3">
          {company && (
            <a
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/co pointer-events-auto relative z-[3] inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              {company.logo && (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.4)] md:size-7">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={56}
                    height={56}
                    className="size-full object-contain"
                  />
                </span>
              )}
              <span className="text-[13px] font-medium md:text-[14px]">
                {company.name}
              </span>
            </a>
          )}
          <div className="pointer-events-auto relative z-[3] flex shrink-0 items-center gap-1.5">
            {founder.linkedin && (
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} on LinkedIn`}
                className="flex size-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <LinkedInIcon className="size-3.5" />
              </a>
            )}
            {founder.x && (
              <a
                href={founder.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} on X`}
                className="flex size-7 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#ff4400]/60 hover:text-[#ff4400]"
              >
                <XIcon className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FoundersPage() {
  // Split founders by whether we have a headshot. Photo founders take a full
  // grid cell each; photo-less founders are grouped into PAIRS that share one
  // cell as two stacked compact tiles (same height as a photo card). Pairs
  // flow into the same grid right after the photo cards, so any empty cell
  // left by the photo grid's tail gets filled by the next pair — no mid-page
  // gaps. Only the very last row of the unified grid can be partial.
  const photoFounders = FOUNDERS.filter((f) => f.headshot);
  const compactFounders = FOUNDERS.filter((f) => !f.headshot);
  const compactPairs: [Founder, Founder?][] = [];
  for (let i = 0; i < compactFounders.length; i += 2) {
    compactPairs.push([compactFounders[i], compactFounders[i + 1]]);
  }
  // If the last row of the unified 3-up grid would have only 1 cell filled
  // (i.e. (photos + pairs) % 3 === 1), split the final full pair into two
  // single-tile cells so the two compacts sit side-by-side instead of stacked.
  // Turns "1 filled, 2 empty" into "2 filled (top-half), 1 empty".
  if (
    (photoFounders.length + compactPairs.length) % 3 === 1 &&
    compactPairs.length > 0 &&
    compactPairs[compactPairs.length - 1][1]
  ) {
    const last = compactPairs.pop()!;
    compactPairs.push([last[0]], [last[1]!]);
  }

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

      {/* Grid — ONE unified 3-up grid. Photo cards take a cell each; compact
          tiles share a cell in pairs (two stacked, sized via grid-rows-2 to
          match a photo card's height). The pairs flow naturally into the
          empty cells left at the tail of the photo cards, so the only partial
          row is the very last one. */}
      <section className="px-6 pt-10 md:px-[40px]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {photoFounders.map((founder) => (
            <FounderCard key={founderAnchor(founder)} founder={founder} />
          ))}
          {compactPairs.map(([a, b]) =>
            b ? (
              <div
                key={`pair-${founderAnchor(a)}`}
                className="grid grid-rows-2 gap-3 aspect-[674/720] max-md:aspect-[4/5]"
              >
                <CompactFounderTile founder={a} />
                <CompactFounderTile founder={b} />
              </div>
            ) : (
              // Solo cell — renders at half a pair's height so the last row
              // doesn't leave a tall empty bottom below the two side-by-side
              // tiles. Inherits all the same hover + link behavior.
              <CompactFounderTile key={`solo-${founderAnchor(a)}`} founder={a} solo />
            ),
          )}
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
