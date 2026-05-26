import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { PORTFOLIO, gradientFor, type Company } from "@/lib/portfolio";
import { founderForCompany, founderAnchor } from "@/lib/founders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our companies — All Together Capital",
  description:
    "Our companies — across AI, defense, energy, robotics, semiconductors, and space.",
};

function CompanyCard({
  company,
  featured = false,
}: {
  company: Company;
  featured?: boolean;
}) {
  // The /companies card prefers a card-specific image; the hero still uses `image`.
  const cardSrc = company.cardImage ?? company.image;
  const hasImage = Boolean(cardSrc);
  const founder = founderForCompany(company.name);
  return (
    <div
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-[#0b0b0d]",
        featured
          ? "aspect-[1360/720] max-md:aspect-[4/5]"
          : "aspect-[674/720] max-md:aspect-[4/5]",
      )}
    >
      {/* Background: full-color product image (gradient only as a safety fallback) */}
      {hasImage ? (
        <Image
          src={cardSrc as string}
          alt={`${company.name} — product`}
          fill
          sizes={featured ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          quality={90}
          className="object-cover brightness-[0.8] transition-[filter] duration-200 ease-out group-hover:brightness-100"
        />
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientFor(company))}>
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_18%,rgba(255,255,255,0.12),transparent_60%)]" />
          <span className="pointer-events-none absolute -right-[6%] -top-[14%] font-[900] leading-none text-white/[0.05] text-[52vw] md:text-[20vw]">
            {company.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Legibility gradient — light so the image leads */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/12 to-transparent" />

      {/* Stretched link — the whole card (except the Watch button) opens the company site */}
      <a
        href={company.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${company.name}`}
        className="absolute inset-0 z-[1]"
      />

      {/* Open affordance — bigger arrow, top-right (the whole card links out) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 z-[2] flex size-11 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:right-5 md:top-5 md:size-12"
      >
        <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-7" />
      </span>

      {/* "Newest addition" badge — featured card only */}
      {featured && (
        <span className="pointer-events-none absolute left-5 top-5 z-[2] inline-flex items-center gap-2 rounded-full bg-[#ff4400] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:left-8 md:top-8 md:text-[12px]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-black/60" />
            <span className="relative inline-flex size-2 rounded-full bg-black" />
          </span>
          Newest addition
        </span>
      )}

      {/* Bottom: compact lockup — tiny sector kicker + logo + name. The description
          and founder link stay hidden until hover, so the image leads. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[2]",
          featured ? "p-6 md:p-8" : "p-5 md:p-6",
        )}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 md:text-[11px]">
          {company.sectors.join(" · ")}
        </span>
        <div className="mt-2 flex items-center gap-2.5">
          {company.logo && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.4)]",
                featured ? "size-10 md:size-12" : "size-9 md:size-10",
              )}
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={96}
                height={96}
                className="size-full object-contain"
              />
            </span>
          )}
          <h3
            className={cn(
              "font-semibold leading-[1.05] tracking-[-0.5px] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]",
              featured ? "text-[26px] md:text-[34px]" : "text-[19px] md:text-[22px]",
            )}
          >
            {company.name}
          </h3>
        </div>
        {/* Description + founder link — revealed on hover (height + fade) */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-2.5 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="text-[13px] leading-snug text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] md:text-[14px]">
              {company.blurb ?? "Portfolio company"}
            </p>
            {founder && (
              <Link
                href={`/founders#${founderAnchor(founder)}`}
                aria-label={`Meet ${founder.name}, founder of ${company.name}`}
                className="group/founder pointer-events-auto relative z-[3] mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/90 transition-colors duration-200 hover:text-[#ff4400] md:text-[13px]"
              >
                Meet the founder
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/founder:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  const featured = PORTFOLIO[0];
  const rest = PORTFOLIO.slice(1);

  return (
    <main className="min-h-screen bg-white text-[#0b0b0d]">
      <SiteNav showLogo />

      {/* Featured */}
      <section className="px-6 pt-[104px] md:px-[40px] md:pt-[110px]">
        <CompanyCard company={featured} featured />
      </section>

      {/* Heading */}
      <section className="px-6 pt-16 md:px-[40px] md:pt-24">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-[#ff4400]" />
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#0b0b0d]/60">
            Our companies
          </span>
        </div>
        <h2 className="mt-5 max-w-[16ch] text-[40px] font-semibold leading-[1.02] tracking-[-1.7px] md:text-[56px] md:tracking-[-2.5px]">
          Our companies
        </h2>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-[#0b0b0d]/55 md:text-[18px]">
          All Together Capital partners with the founders rebuilding the hard
          frontier — across artificial intelligence, defense, energy, robotics,
          semiconductors, and space.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 pt-10 md:px-[40px]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((company) => (
            <CompanyCard key={company.name} company={company} />
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
            href="/founders"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff4400] px-7 py-4 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Meet the founders
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
