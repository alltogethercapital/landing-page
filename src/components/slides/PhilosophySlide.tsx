"use client";

import { motion } from "framer-motion";
import { driftUp, philosophyTenets } from "@/lib/site-content";
import { PageHeader } from "@/components/site/PageHeader";

export function PhilosophySlide() {
  return (
    <div className="at-philosophy-slide min-h-full text-[var(--at-ink)]">
      <div className="at-philosophy-scene" aria-hidden />

      <main className="relative z-[1] mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-8 px-6 pb-14 pt-28 sm:px-8 md:pt-32 lg:px-14 lg:pb-12 lg:pt-[128px]">
        <PageHeader title="Philosophy" tone="dark" />

        <div className="w-full min-w-0 max-w-[820px]">
          <motion.h1
            {...driftUp(0.02)}
            className="mb-5 font-display text-[32px] font-normal leading-[1.06] tracking-normal text-[var(--at-ink)] min-[420px]:text-[38px] sm:text-[46px] sm:leading-[1.04] lg:text-[52px]"
          >
            We invest in bold founders
            <br />
            <em className="font-normal text-[var(--at-ink-3)]">rebuilding America with AI.</em>
          </motion.h1>

          <motion.p
            {...driftUp(0.08)}
            className="max-w-[44ch] text-[15px] leading-[1.65] text-[var(--at-ink-3)]"
          >
            Five convictions about what comes next. AI is a once-in-a-century
            reset, and the founders making the most of it are rebuilding the
            country from the inside out.
          </motion.p>

          <div className="mt-8 border-t border-[rgb(var(--at-ink-rgb)_/_0.2)]">
            {philosophyTenets.map((tenet, index) => (
              <motion.article
                key={tenet.title}
                {...driftUp(0.14 + index * 0.05)}
                className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[rgb(var(--at-ink-rgb)_/_0.2)] py-5 sm:grid-cols-[2.25rem_1fr]"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center bg-[var(--at-marker)] font-mono text-[11px] font-medium text-[var(--at-paper-tint)]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="m-0 font-display text-[19px] font-medium leading-[1.15] text-[var(--at-ink)] lg:text-[21px]">
                    {tenet.title}
                  </h2>
                  <p className="m-0 mt-2 max-w-[58ch] text-[13px] leading-[1.55] text-[var(--at-ink-3)] lg:text-[13.5px]">
                    {tenet.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
