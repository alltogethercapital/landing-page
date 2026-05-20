import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ArrowUpRight } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <SiteNav showLogo />

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.25em] text-[#ff4400]">
          Error
        </p>
        <div className="mt-4 select-none text-[clamp(96px,22vw,280px)] font-[900] leading-none tracking-[-0.05em] text-[#ff4400]">
          404
        </div>
        <h1 className="mt-4 text-[24px] font-medium tracking-[-0.6px] md:text-[32px]">
          This page took a different path.
        </h1>
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-white/55 md:text-[16px]">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back to building.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff4400] px-7 py-3.5 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            Back home
          </Link>
          <Link
            href="/companies"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-[15px] font-medium text-white/80 transition-colors hover:border-[#ff4400]/60 hover:text-white"
          >
            Our companies
            <ArrowUpRight className="size-4 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
