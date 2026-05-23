"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PORTFOLIO } from "@/lib/portfolio";
import { LEGAL, NAV, SOCIALS } from "@/lib/site";

// Companies per sector (a company can span more than one).
const SECTOR_GROUPS: { name: string; match: string[] }[] = [
  { name: "AI", match: ["AI"] },
  { name: "Robotics", match: ["Robotics", "Manufacturing"] },
  { name: "Defense", match: ["Defense", "Directed Energy", "Aerospace"] },
  { name: "Energy", match: ["Energy", "Nuclear", "Geothermal"] },
  { name: "Software", match: ["Software", "Audio"] },
  { name: "Semiconductors", match: ["Semiconductors"] },
  { name: "Space", match: ["Space", "Compute"] },
  { name: "Bio", match: ["Bio", "Agriculture"] },
];
const SECTOR_STATS = SECTOR_GROUPS.map((g) => ({
  name: g.name,
  count: PORTFOLIO.filter((c) => c.sectors.some((s) => g.match.includes(s))).length,
}))
  .filter((s) => s.count > 0)
  .sort((a, b) => b.count - a.count);

function NavLink({
  href,
  className,
  style,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  );
}

export function SiteNav({ showLogo = false }: { showLogo?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* MENU OVERLAY */}
      <div
        className="fixed inset-0 z-40 bg-black/85 backdrop-blur-[8px] transition-opacity duration-500"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col gap-10 overflow-y-auto px-6 pb-10 pt-[96px] md:block md:gap-0 md:overflow-visible md:p-0">
          {/* location + portfolio stats — drops below the nav on mobile */}
          <div className="order-last md:absolute md:left-[40px] md:top-[110px] md:max-w-[700px]">
            <p className="text-[40px] font-semibold leading-[1.08] tracking-[-1.6px] text-white md:text-[72px] md:leading-[79.2px] md:tracking-[-2.88px]">
              We are based in
              <br />
              <span className="text-[#ff4400]">Seattle, WA.</span>
            </p>
            <table className="mt-8 w-full max-w-[300px] md:mt-[56px]">
              <thead>
                <tr className="border-b border-white/25 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 md:text-[11px]">
                  <th className="pb-2 text-left font-normal">Sector</th>
                  <th className="pb-2 text-right font-normal">Companies</th>
                </tr>
              </thead>
              <tbody>
                {SECTOR_STATS.map((s) => (
                  <tr key={s.name} className="border-b border-white/10">
                    <td className="py-2.5 font-mono text-[12px] uppercase tracking-[0.18em] text-white/70 md:text-[13px]">
                      {s.name}
                    </td>
                    <td className="py-2.5 text-right font-mono text-[13px] tabular-nums text-white md:text-[14px]">
                      {s.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* nav + legal */}
          <div className="order-first flex flex-col items-start md:absolute md:right-[40px] md:top-[101px] md:items-end">
            <nav className="flex flex-col items-start md:items-end">
              {NAV.map((item, i) => (
                <NavLink
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[40px] font-semibold leading-[1.15] tracking-[-1.6px] text-[#f6f6f6] transition-colors duration-200 hover:text-[#ff4400] md:text-[84px] md:leading-[84px] md:tracking-[-3.36px]"
                  style={{
                    transform: open ? "translateY(0)" : "translateY(20px)",
                    opacity: open ? 1 : 0,
                    transition: `transform 0.5s cubic-bezier(0.16,0.7,0.18,1) ${0.08 + i * 0.05}s, opacity 0.5s ease ${0.08 + i * 0.05}s, color 0.2s`,
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-6 flex flex-col items-start md:mt-[72px] md:items-end">
              {LEGAL.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[16px] font-medium leading-[1.5] tracking-[-0.5px] text-[#f6f6f6] transition-colors duration-200 hover:text-[#ff4400] md:text-[28px] md:leading-[33.6px] md:tracking-[-1.12px]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HEADER (container is click-through; only the controls are interactive) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-[70px] items-center justify-between px-[40px] max-md:px-6">
        <nav className="pointer-events-auto flex items-center gap-[22px] max-md:gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-[#ff4400] transition-opacity hover:opacity-70"
            >
              <s.Icon className="size-[19px] max-md:size-[17px]" />
            </a>
          ))}
        </nav>

        {showLogo && (
          <Link
            href="/"
            aria-label="All Together Capital — home"
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[19px] font-[900] tracking-[-0.04em] text-[#ff4400] transition-opacity hover:opacity-70 max-md:text-[16px]"
          >
            All Together
          </Link>
        )}

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="pointer-events-auto relative size-[70px] max-md:size-12"
        >
          <span
            className="absolute left-1/2 top-1/2 h-[3px] w-[44px] -translate-x-1/2 bg-[#ff4400] transition-transform duration-300 max-md:w-9"
            style={{
              transform: open
                ? "translate(-50%, -50%) rotate(45deg)"
                : "translate(-50%, calc(-50% - 5px))",
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-[3px] w-[44px] -translate-x-1/2 bg-[#ff4400] transition-transform duration-300 max-md:w-9"
            style={{
              transform: open
                ? "translate(-50%, -50%) rotate(-45deg)"
                : "translate(-50%, calc(-50% + 5px))",
            }}
          />
        </button>
      </header>
    </>
  );
}
