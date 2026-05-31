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
}: {
  company: Company;
}) {
  const logoSrc = company.cardLogo ?? company.logo;
  return (
    <div
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f5f7]"
    >
      {logoSrc ? (
        <div className="absolute inset-x-[12%] top-1/2 h-[42%] -translate-y-1/2">
          <Image
            src={logoSrc}
            alt={`${company.name} logo`}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 25vw"
            quality={90}
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-br", gradientFor(company))}>
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_18%,rgba(255,255,255,0.12),transparent_60%)]" />
          <span className="pointer-events-none absolute -right-[6%] -top-[14%] font-[900] leading-none text-white/[0.05] text-[52vw] md:text-[20vw]">
            {company.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Stretched link — the whole card opens the company site */}
      <a
        href={company.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${company.name}`}
        className="absolute inset-0 z-[1]"
      />

      {/* Open affordance — bigger arrow, top-right; color variants for light vs dark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-4 z-[2] flex size-11 items-center justify-center bg-black/[0.06] text-[#0b0b0d] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#ff4400] group-hover:text-black md:right-5 md:top-5 md:size-12"
      >
        <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-7" />
      </span>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b0b0d]">
      <SiteNav showLogo />

      {/* Heading */}
      <section className="px-6 pt-[104px] md:px-[40px] md:pt-[118px]">
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
          {PORTFOLIO.map((company) => (
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
