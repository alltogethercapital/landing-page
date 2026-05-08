"use client";

import { motion } from "framer-motion";
import { driftUp, investments } from "@/lib/site-content";
import { PageHeader } from "@/components/site/PageHeader";
import { InvestmentLogo } from "@/components/site/InvestmentLogo";

export function PortfolioSlide() {
  return (
    <div className="at-investments-slide min-h-full overflow-y-auto text-[var(--at-paper)]">
      <div className="at-investments-scene" aria-hidden />

      <main className="relative z-[1] mx-auto max-w-[1160px] px-5 pb-24 pt-34 sm:px-6 sm:pt-40 md:px-10 lg:px-14 lg:pb-36 lg:pt-[192px]">
        <PageHeader title="Partners" className="mb-8 sm:mb-10" />

        <div className="mb-12 max-w-[820px] sm:mb-16 lg:mb-20">
          <motion.h2
            {...driftUp(0.02)}
            className="font-display text-[32px] font-normal leading-[1.06] tracking-normal text-[var(--at-paper)] min-[420px]:text-[38px] sm:text-[46px] lg:text-[52px]"
          >
            We back the best founders
            <br />
            <em className="font-normal text-[rgb(var(--at-paper-rgb)_/_0.6)]">with the boldest visions.</em>
          </motion.h2>
          <motion.p
            {...driftUp(0.08)}
            className="mt-5 max-w-[52ch] text-[15px] leading-[1.65] text-[rgb(var(--at-paper-rgb)_/_0.7)]"
          >
            Once we partner, we&apos;re in the work, for the long arcs, the hard quarters, and
            the moments that don&apos;t make the deck. These are the founders we build with
            and support.
          </motion.p>
        </div>

        <section
          className="grid grid-cols-2 border-l border-t border-[rgb(var(--at-paper-rgb)_/_0.14)] lg:grid-cols-4"
          aria-label="Portfolio"
        >
          {investments.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const,
                delay: 0.1 + index * 0.06,
              }}
              className="at-investment-cell group relative isolate flex min-h-[150px] flex-col items-center justify-center overflow-hidden border-b border-r border-[rgb(var(--at-paper-rgb)_/_0.14)] px-4 py-6 text-center sm:min-h-[220px] sm:px-5 sm:py-8"
            >
              <a
                href={company.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${company.name}`}
                className="absolute inset-0 z-[1] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--at-accent-warm)]"
              />
              <div className="pointer-events-none relative z-0 flex flex-col items-center">
                <InvestmentLogo
                  name={company.name}
                  fallback={company.fallback}
                  sources={company.logoSources}
                />
                <div className="font-display text-lg italic tracking-normal text-[rgb(var(--at-paper-rgb)_/_0.94)] transition duration-500 group-hover:text-[#ffffff]">
                  {company.name}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[rgb(var(--at-paper-rgb)_/_0.45)] transition duration-500 group-hover:text-[#ffffff]">
                  {company.meta}
                </div>
              </div>

              {(company.linkedin || company.youtube) && (
                <div className="absolute bottom-3 left-3 z-[2] flex gap-2 sm:bottom-4 sm:left-4">
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${company.name} on LinkedIn`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex h-7 w-7 items-center justify-center text-[rgb(var(--at-paper-rgb)_/_0.55)] transition-colors duration-300 hover:text-[#ffffff] focus-visible:text-[#ffffff] focus-visible:outline-none"
                    >
                      <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
                      </svg>
                    </a>
                  )}
                  {company.youtube && (
                    <a
                      href={company.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch ${company.name} on YouTube`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex h-7 w-7 items-center justify-center text-[rgb(var(--at-paper-rgb)_/_0.55)] transition-colors duration-300 hover:text-[#ffffff] focus-visible:text-[#ffffff] focus-visible:outline-none"
                    >
                      <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.5C1.6 4.3.8 5.1.5 6.2 0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              <span className="pointer-events-none absolute bottom-4 right-4 z-[2] font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--at-paper)] opacity-0 transition delay-0 duration-300 group-hover:opacity-100 group-hover:delay-200">
                Visit →
              </span>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
