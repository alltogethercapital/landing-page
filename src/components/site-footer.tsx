import Link from "next/link";
import { LEGAL, NAV, SOCIALS } from "@/lib/site";
import { ArrowUpRight } from "@/components/icons";
import { SubscribeForm } from "@/components/subscribe-form";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "group inline-flex items-center gap-1.5 text-[15px] text-white/55 transition-colors hover:text-white";
  const arrow = (
    <ArrowUpRight className="size-3 text-white/25 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ff4400]" />
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {!href.startsWith("mailto:") && arrow}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0b] text-white">
      {/* Wordmark band */}
      <div className="border-b border-white/10 px-6 pb-10 pt-16 md:px-[40px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Link
            href="/"
            aria-label="All Together Capital — home"
            className="inline-block transition-opacity hover:opacity-80"
          >
            <span className="block whitespace-nowrap font-sans text-[clamp(44px,8vw,96px)] font-[900] leading-[0.9] tracking-[-0.05em] text-[#ff4400]">
              All Together
            </span>
          </Link>
          <div className="md:pb-2 md:text-right">
            <p className="[font-family:var(--font-rosart)] text-[26px] leading-[1.1] tracking-[-0.5px] text-white/90 md:text-[32px]">
              The frontier is
              <br />
              all that matters.
            </p>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-white/45">
              Seattle, WA
            </p>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-12 px-6 py-14 md:grid-cols-4 md:px-[40px]">
        <nav className="flex flex-col items-start gap-3">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            Site
          </p>
          {NAV.map((item) => (
            <FooterLink key={item.label} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </nav>

        <nav className="flex flex-col items-start gap-3">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            Legal
          </p>
          {LEGAL.map((item) => (
            <FooterLink key={item.label} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </nav>

        {/* Newsletter */}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:col-span-1">
          <p className="font-sans text-[20px] font-semibold tracking-[-0.5px]">
            Stay in the loop
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-white/55">
            Occasional notes on what we&apos;re building and backing. No spam.
          </p>
          <SubscribeForm />
        </div>

        <nav className="flex flex-col items-start gap-3">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            Connect
          </p>
          {SOCIALS.map((item) => (
            <FooterLink key={item.label} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col gap-2 border-t border-white/10 px-6 py-6 text-[13px] text-white/40 md:flex-row md:items-center md:justify-between md:px-[40px]">
        <p>
          © {new Date().getFullYear()} All Together Capital. All rights
          reserved.
        </p>
        <p>The future is built together.</p>
      </div>
    </footer>
  );
}
