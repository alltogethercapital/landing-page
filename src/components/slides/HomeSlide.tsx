"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { driftUp } from "@/lib/site-content";

const subheadings = [
  "from AI to atoms.",
  "Technology is our birthright.",
];

export function HomeSlide() {
  const [subheadingIndex, setSubheadingIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSubheadingIndex((index) => (index + 1) % subheadings.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="at-home-slide relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[55%]"
        style={{
          background:
            "linear-gradient(to top, rgba(8,12,20,0.6) 0%, rgba(8,12,20,0.35) 35%, rgba(8,12,20,0.12) 65%, rgba(8,12,20,0) 100%)",
        }}
      />
      <a
        href="mailto:robertneir@alltogethercapital.com"
        aria-label="Email Robert Neir"
        className="absolute bottom-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center text-[#F4EFE6] [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.6))] transition-colors duration-200 hover:text-[var(--at-accent-primary)] sm:bottom-5 sm:right-5 md:bottom-6 md:right-6"
      >
        <svg
          className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="2.5" y="5" width="19" height="14" rx="0.5" />
          <path d="M3 6l9 7 9-7" />
        </svg>
      </a>

      <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-6 pt-16 sm:px-5 sm:pb-8 sm:pt-20 md:px-6 md:pb-10 md:pt-24">
        <div className="w-full max-w-[520px] text-[#F4EFE6]">
          <div>
            <motion.div {...driftUp(0.08)}>
              <h1
                className="m-0 text-[clamp(1.75rem,5vw,3.75rem)] font-medium uppercase leading-[0.92] tracking-normal text-[#F4EFE6] [text-shadow:0_1px_2px_rgba(0,0,0,0.45),_0_2px_18px_rgba(0,0,0,0.25)]"
                style={{ fontFamily: "var(--at-font-body)" }}
              >
                The future is built together.
              </h1>
              <p className="relative mt-2 min-h-[1.1em] font-display text-[clamp(1.4rem,3.6vw,3rem)] font-normal italic leading-[1] tracking-normal text-[#F4EFE6] [text-shadow:0_1px_2px_rgba(0,0,0,0.4),_0_2px_18px_rgba(0,0,0,0.2)]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={subheadings[subheadingIndex]}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
                    className="block"
                  >
                    {subheadings[subheadingIndex]}
                  </motion.span>
                </AnimatePresence>
              </p>
            </motion.div>

            <motion.div
              {...driftUp(0.18)}
              className="mt-6 flex flex-wrap items-center gap-5 sm:mt-7 sm:gap-7"
            >
              <Link
                href="/portfolio"
                className="relative inline-flex min-h-11 items-center justify-center bg-[rgb(var(--at-ink-rgb)_/_0.55)] backdrop-blur-sm px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#F4EFE6] transition duration-300 after:absolute after:-bottom-1 after:-right-1 after:h-full after:w-full after:border-b-4 after:border-r-4 after:border-[var(--at-accent-warm)] after:content-[''] hover:bg-[rgb(var(--at-accent-primary-rgb)_/_0.85)] hover:bg-[var(--at-accent-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--at-accent-primary)]"
              >
                Portfolio
              </Link>
              <Link
                href="/philosophy"
                className="group inline-flex min-h-11 items-center gap-3 border-b border-[rgb(244,239,230_/_0.5)] px-1 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#F4EFE6] [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] transition duration-300 hover:border-[var(--at-accent-warm)] hover:text-[var(--at-accent-warm)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--at-accent-warm)]"
              >
                <span>Philosophy</span>
                <span aria-hidden className="text-[var(--at-accent-warm)] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
