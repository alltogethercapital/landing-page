import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ArrowUpRight } from "@/components/icons";
import { PORTFOLIO, type Company } from "@/lib/portfolio";

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
  const isPending = company.investmentStatus === "pending";
  return (
    <div className="group relative block aspect-[4/3] overflow-hidden border-0 bg-transparent shadow-none outline-none">
      {isPending && (
        <span className="pointer-events-none absolute left-4 top-4 z-[2] inline-flex h-8 items-center border border-[#0b0b0d]/10 bg-white/80 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0d]/70 backdrop-blur-sm md:left-5 md:top-5 md:h-9 md:text-[11px]">
          Pending
        </span>
      )}

      {logoSrc ? (
        <div className="absolute inset-x-[12%] top-1/2 h-[42%] -translate-y-1/2">
          <Image
            src={logoSrc}
            alt={`${company.name} logo`}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 430px"
            quality={100}
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
          <span className="text-[clamp(28px,4vw,52px)] font-semibold leading-none tracking-[-0.04em] text-[#0b0b0d]">
            {company.name}
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

      {/* Grid */}
      <section className="min-h-[100svh] px-6 pb-16 pt-[104px] md:px-[40px] md:pb-20 md:pt-[118px]">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((company) => (
            <CompanyCard key={company.name} company={company} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
