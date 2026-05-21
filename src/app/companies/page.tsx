import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight } from "@/components/icons";
import { PORTFOLIO, gradientFor, type Company } from "@/lib/portfolio";
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
  const hasImage = Boolean(company.image);
  return (
    <a
      href={company.href}
      target="_blank"
      rel="noopener noreferrer"
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
          src={company.image as string}
          alt={`${company.name} — product`}
          fill
          sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          quality={90}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientFor(company))}>
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_18%,rgba(255,255,255,0.12),transparent_60%)]" />
          <span className="pointer-events-none absolute -right-[6%] -top-[14%] font-[900] leading-none text-white/[0.05] text-[52vw] md:text-[20vw]">
            {company.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Legibility gradient — clear at top so the product shows, dark at the base for the lockup */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

      {/* Open affordance — bigger arrow, top-right (the whole card links out) */}
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 z-[1] flex size-11 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:right-5 md:top-5 md:size-12"
      >
        <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-7" />
      </span>

      {/* "Newest addition" badge — featured card only */}
      {featured && (
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#ff4400] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:left-8 md:top-8 md:text-[12px]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-black/60" />
            <span className="relative inline-flex size-2 rounded-full bg-black" />
          </span>
          Newest addition
        </span>
      )}

      {/* Bottom: sector tag, divider, brand lockup (logo + name), blurb */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-white/75">
          {company.sectors.join(" · ")}
        </span>
        <div className="mt-4 h-px w-full bg-white/25" />
        <div className={cn("mt-4 flex items-center", featured ? "gap-4" : "gap-3")}>
          {company.logo && (
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
                featured
                  ? "size-12 p-2 md:size-14 md:p-2.5"
                  : "size-10 p-1.5 md:size-[52px] md:p-2",
              )}
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={128}
                height={128}
                className="size-full object-contain"
              />
            </span>
          )}
          <h3
            className={cn(
              "font-medium leading-[1.02] tracking-[-1px] text-white",
              featured ? "text-[36px] md:text-[52px]" : "text-[26px] md:text-[38px]",
            )}
          >
            {company.name}
          </h3>
        </div>
        <p className="mt-2.5 text-[14px] text-white/70 md:text-[16px]">
          {company.blurb ?? "Portfolio company"}
        </p>
      </div>
    </a>
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
