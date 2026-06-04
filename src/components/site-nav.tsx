"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowUpRight } from "@/components/icons";
import { FOUNDERS, founderAnchor } from "@/lib/founders";
import { isCompleteInvestment, PORTFOLIO, slugify } from "@/lib/portfolio";
import { LEGAL, NAV, SOCIALS } from "@/lib/site";
import { cn } from "@/lib/utils";

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
  { name: "Education", match: ["Education"] },
];
const SECTOR_STATS = SECTOR_GROUPS.map((g) => ({
  name: g.name,
  count: PORTFOLIO.filter(
    (c) => isCompleteInvestment(c) && c.sectors.some((s) => g.match.includes(s)),
  ).length,
}))
  .filter((s) => s.count > 0)
  .sort((a, b) => b.count - a.count);

const MENU_DIALOG_ID = "site-menu";
const SEARCH_DIALOG_ID = "site-search";

type SearchItem = {
  title: string;
  href: string;
  category: string;
  description: string;
  keywords?: string;
  featured?: boolean;
  searchText: string;
};

type SearchItemInput = Omit<SearchItem, "searchText">;

const TEAM_SEARCH_ITEMS: SearchItemInput[] = [
  {
    title: "Robert Neir",
    href: "/team#robert-neir",
    category: "Team",
    description: "Founding Partner",
    keywords: "leadership partner email",
  },
  {
    title: "Hisham El-Husseini",
    href: "/team#hisham-el-husseini",
    category: "Team",
    description: "Founding Partner",
    keywords: "leadership partner email",
  },
  {
    title: "NEO",
    href: "/team#neo",
    category: "Team",
    description: "Head of Robotics",
    keywords: "robotics 1x",
  },
];

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function withSearchText(item: SearchItemInput): SearchItem {
  return {
    ...item,
    searchText: normalizeSearch(
      [item.title, item.category, item.description, item.keywords].join(" "),
    ),
  };
}

function resultRank(item: SearchItem, query: string) {
  const title = normalizeSearch(item.title);
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (item.searchText.startsWith(query)) return 2;
  if (title.includes(query)) return 3;
  return 4;
}

function isNavItemActive(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SEARCH_INDEX: SearchItem[] = [
  {
    title: "Home",
    href: "/",
    category: "Page",
    description: "All Together Capital",
    keywords: "frontier hard tech venture capital",
    featured: true,
  },
  {
    title: "Our companies",
    href: "/companies",
    category: "Page",
    description: "Portfolio across AI, defense, energy, robotics, semiconductors, and space.",
    keywords: "portfolio investments startups",
    featured: true,
  },
  {
    title: "Our founders",
    href: "/founders",
    category: "Page",
    description: "Founders backed by All Together Capital.",
    keywords: "entrepreneurs builders people",
    featured: true,
  },
  {
    title: "Our team",
    href: "/team",
    category: "Page",
    description: "The All Together Capital team.",
    keywords: "robert neir hisham el-husseini neo",
    featured: true,
  },
  {
    title: "Contact",
    href:
      NAV.find((item) => item.label === "Contact")?.href ??
      "mailto:robertneir@alltogethercapital.com",
    category: "Connect",
    description: "Reach the All Together Capital team.",
    keywords: "email mail",
    featured: true,
  },
  ...LEGAL.map<SearchItemInput>((item) => ({
    title: item.label,
    href: item.href,
    category: "Legal",
    description: "Legal information for All Together Capital.",
    keywords: "privacy terms disclaimer",
  })),
  ...PORTFOLIO.map<SearchItemInput>((company) => ({
    title: company.name,
    href: `/companies#${slugify(company.name)}`,
    category: "Company",
    description: company.sectors.join(" / "),
    keywords: company.blurb,
  })),
  ...FOUNDERS.map<SearchItemInput>((founder) => ({
    title: founder.name,
    href: `/founders#${founderAnchor(founder)}`,
    category: "Founder",
    description: founder.companyName,
    keywords: founder.companyName,
  })),
  ...TEAM_SEARCH_ITEMS,
].map(withSearchText);

function NavLink({
  href,
  className,
  style,
  onClick,
  ariaCurrent,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  ariaCurrent?: "page";
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className={className}
        style={style}
        onClick={onClick}
        aria-current={ariaCurrent}
      >
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={onClick}
      aria-current={ariaCurrent}
    >
      {children}
    </a>
  );
}

export function SiteNav({ showLogo = false }: { showLogo?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const bodyOverflowRef = useRef<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const normalizedQuery = normalizeSearch(query.trim());

    if (!normalizedQuery) {
      return SEARCH_INDEX.filter((item) => item.featured).slice(0, 8);
    }

    return SEARCH_INDEX.filter((item) => item.searchText.includes(normalizedQuery))
      .sort(
        (a, b) =>
          resultRank(a, normalizedQuery) - resultRank(b, normalizedQuery) ||
          a.title.localeCompare(b.title),
      )
      .slice(0, 12);
  }, [query]);

  const openSearch = () => {
    setOpen(false);
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const locked = open || searchOpen;

    if (locked) {
      if (bodyOverflowRef.current === null) {
        bodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = "hidden";
    } else if (bodyOverflowRef.current !== null) {
      document.body.style.overflow = bodyOverflowRef.current;
      bodyOverflowRef.current = null;
    }

    return () => {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      }
    };
  }, [open, searchOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1180px)");
    const closeMenuOnDesktop = () => {
      if (desktopQuery.matches) setOpen(false);
    };

    closeMenuOnDesktop();
    desktopQuery.addEventListener("change", closeMenuOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
        setQuery("");
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(false);
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [searchOpen]);

  return (
    <>
      {/* MENU OVERLAY */}
      <div
        id={MENU_DIALOG_ID}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label="Site menu"
        className="fixed inset-0 z-40 bg-black/85 backdrop-blur-[8px] transition-opacity duration-500 min-[1180px]:hidden"
        inert={!open ? true : undefined}
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden",
        }}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col gap-10 overflow-y-auto px-6 pb-10 pt-[96px] md:px-10 md:pt-[104px] xl:block xl:overflow-visible xl:p-0">
          {/* location + portfolio stats — drops below the nav on mobile */}
          <div className="order-last xl:absolute xl:left-[var(--site-frame-x)] xl:top-[110px] xl:max-w-[560px] 2xl:max-w-[700px]">
            <p className="text-[36px] font-semibold leading-[1.08] tracking-normal text-white min-[360px]:text-[40px] md:text-[54px] lg:text-[60px] xl:text-[64px] 2xl:text-[72px] 2xl:leading-[79.2px]">
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
          <div className="order-first flex flex-col items-start xl:absolute xl:right-[var(--site-frame-x)] xl:top-[101px] xl:items-end">
            <nav className="flex flex-col items-start xl:items-end">
              {NAV.map((item, i) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    ariaCurrent={active ? "page" : undefined}
                    className={cn(
                      "text-[34px] font-semibold leading-[1.16] tracking-normal text-[#f6f6f6] transition-colors duration-200 hover:text-[#ff4400] min-[360px]:text-[38px] md:text-[56px] md:leading-[1.04] lg:text-[62px] xl:text-[76px] xl:leading-[1] 2xl:text-[84px] 2xl:leading-[84px]",
                      active && "text-[#ff4400]",
                    )}
                    style={{
                      transform: open ? "translateY(0)" : "translateY(20px)",
                      opacity: open ? 1 : 0,
                      transition: `transform 0.5s cubic-bezier(0.16,0.7,0.18,1) ${0.08 + i * 0.05}s, opacity 0.5s ease ${0.08 + i * 0.05}s, color 0.2s`,
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              aria-controls={SEARCH_DIALOG_ID}
              aria-label="Open search"
              title="Search"
              onClick={openSearch}
              className="mt-6 inline-flex h-12 items-center gap-3 border border-transparent bg-white/[0.06] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 transition-colors duration-200 hover:border-[#ff4400] hover:bg-[#ff4400] hover:text-black focus-visible:border-[#ff4400] focus-visible:bg-[#ff4400] focus-visible:text-black focus-visible:outline-none md:mt-8 md:h-14 md:px-5"
              style={{
                transform: open ? "translateY(0)" : "translateY(20px)",
                opacity: open ? 1 : 0,
                transition:
                  "transform 0.5s cubic-bezier(0.16,0.7,0.18,1) 0.32s, opacity 0.5s ease 0.32s, border-color 0.2s, color 0.2s",
              }}
            >
              <Search className="size-4" aria-hidden="true" />
              Search
            </button>
            <div className="mt-6 flex flex-col items-start md:mt-8 xl:mt-[72px] xl:items-end">
              {LEGAL.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[16px] font-medium leading-[1.5] tracking-normal text-[#f6f6f6] transition-colors duration-200 hover:text-[#ff4400] md:text-[22px] md:leading-[1.35] xl:text-[24px] 2xl:text-[28px] 2xl:leading-[33.6px]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HEADER (container is click-through; only the controls are interactive) */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-[70px] items-center justify-between px-[var(--site-frame-x)] max-md:px-6 min-[1180px]:h-[78px] min-[1280px]:h-[82px]">
        <div
          aria-hidden="true"
          className="absolute right-0 top-3 hidden h-[54px] w-[min(760px,74vw)] bg-[#08090a] shadow-[0_18px_48px_rgba(0,0,0,0.22)] min-[1180px]:block min-[1280px]:h-[58px] min-[1280px]:w-[min(820px,74vw)]"
        />

        <nav className="pointer-events-auto relative z-10 flex items-center gap-[22px] max-md:gap-5 min-[1180px]:gap-[18px]">
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
            className="pointer-events-auto absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[19px] font-[900] tracking-normal text-[#ff4400] transition-opacity hover:opacity-70 max-md:text-[16px] min-[1180px]:hidden"
          >
            All Together
          </Link>
        )}

        <div className="pointer-events-auto relative z-10 ml-auto flex items-center gap-2">
          <nav
            aria-label="Primary"
            className="hidden h-11 items-center gap-1 pl-2 min-[1180px]:flex min-[1280px]:h-12 min-[1280px]:gap-1.5 min-[1280px]:pl-3"
          >
            {NAV.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <NavLink
                  key={item.label}
                  href={item.href}
                  ariaCurrent={active ? "page" : undefined}
                  className={cn(
                    "group flex h-10 items-center border border-transparent bg-transparent px-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.11em] transition-[background-color,border-color,color] duration-200 focus-visible:border-[#ff4400] focus-visible:bg-[#ff4400] focus-visible:text-black focus-visible:outline-none min-[1280px]:h-11 min-[1280px]:px-3 min-[1440px]:px-3.5 min-[1440px]:text-[14px]",
                    active
                      ? "border-[#ff4400]/70 bg-[#ff4400]/[0.07] text-[#ff4400] hover:border-[#ff4400] hover:bg-[#ff4400]/10 hover:text-[#ff4400]"
                      : "text-white/[0.88] hover:border-white/75 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="Open search"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            aria-controls={SEARCH_DIALOG_ID}
            title="Search"
            onClick={openSearch}
            className="hidden size-11 items-center justify-center border border-transparent bg-transparent text-white/90 transition-[background-color,border-color,color] duration-200 hover:border-[#ff4400] hover:bg-[#ff4400] hover:text-black focus-visible:border-[#ff4400] focus-visible:bg-[#ff4400] focus-visible:text-black focus-visible:outline-none min-[1180px]:inline-flex min-[1280px]:size-12"
          >
            <Search className="size-[18px]" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={MENU_DIALOG_ID}
            title={open ? "Close menu" : "Menu"}
            onClick={() => setOpen((o) => !o)}
            className="relative size-[70px] max-md:size-12 min-[1180px]:hidden"
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
        </div>
      </header>

      {searchOpen && (
        <div
          id={SEARCH_DIALOG_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[60] bg-black/70 px-4 pt-[78px] backdrop-blur-[10px] min-[380px]:px-6 md:pt-[94px] min-[1180px]:px-[var(--site-frame-x)]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
        >
          <div className="ml-auto w-full border border-[#ff4400]/35 bg-[#050505]/95 shadow-[0_28px_90px_rgba(0,0,0,0.5)] min-[1180px]:max-w-[680px] min-[1440px]:max-w-[720px]">
            <div className="flex h-16 items-center border-b border-white/10 px-4 md:h-[72px] md:px-5">
              <Search className="mr-3 size-5 shrink-0 text-[#ff4400]" aria-hidden="true" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search All Together"
                className="h-full min-w-0 flex-1 bg-transparent text-[20px] font-semibold tracking-normal text-white outline-none placeholder:text-white/25 md:text-[28px]"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="ml-3 flex size-10 shrink-0 items-center justify-center border border-white/15 text-white/70 transition-colors duration-200 hover:border-[#ff4400] hover:bg-[#ff4400] hover:text-black focus-visible:border-[#ff4400] focus-visible:bg-[#ff4400] focus-visible:text-black focus-visible:outline-none"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[min(620px,calc(100svh-164px))] overflow-y-auto overscroll-contain">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <NavLink
                    key={`${result.href}-${result.title}`}
                    href={result.href}
                    onClick={closeSearch}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 px-4 py-4 text-left transition-colors duration-200 first:border-t-0 hover:bg-[#ff4400] focus-visible:bg-[#ff4400] focus-visible:outline-none md:px-5 md:py-5"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff4400]/80 transition-colors duration-200 group-hover:text-black/55 group-focus-visible:text-black/55">
                        {result.category}
                      </span>
                      <span className="mt-1 block truncate text-[18px] font-semibold leading-tight tracking-normal text-white transition-colors duration-200 group-hover:text-black group-focus-visible:text-black md:text-[22px]">
                        {result.title}
                      </span>
                      <span className="mt-1 block truncate text-[13px] leading-relaxed text-white/45 transition-colors duration-200 group-hover:text-black/65 group-focus-visible:text-black/65 md:text-[14px]">
                        {result.description}
                      </span>
                    </span>
                    <ArrowUpRight className="size-5 text-white/35 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-black" />
                  </NavLink>
                ))
              ) : (
                <div className="px-4 py-10 md:px-5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff4400]/75">
                    No results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
