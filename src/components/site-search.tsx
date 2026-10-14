"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { UIIcon } from "@/components/icons";
import type { SearchResult, SearchResultSection } from "@/lib/search";

const FILTERS = ["All", "Companies", "Founders", "Updates"] as const;
type SearchFilter = "All" | SearchResultSection;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function scoreResult(result: SearchResult, query: string) {
  const title = normalize(result.title);
  const subtitle = normalize(result.subtitle);
  const haystack = normalize(result.searchText);
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return 0;
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!terms.every((term) => haystack.includes(term))) return null;
  if (title === normalizedQuery) return 0;
  if (title.startsWith(normalizedQuery)) return 1;
  if (title.includes(normalizedQuery)) return 2;
  if (subtitle.includes(normalizedQuery)) return 3;
  return 4;
}

export function SiteSearch({ index }: { index: SearchResult[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const openFrameRef = useRef(0);
  const restoreFocusRef = useRef(true);

  const visibleResults = useMemo(() => index
    .filter((item) => filter === "All" || item.section === filter)
    .map((item, sourceIndex) => ({ item, sourceIndex, score: scoreResult(item, query) }))
    .filter((entry): entry is typeof entry & { score: number } => entry.score !== null)
    .sort((a, b) => a.score - b.score || a.sourceIndex - b.sourceIndex)
    .map((entry) => entry.item), [filter, index, query]);
  const activeResult = visibleResults[activeIndex];
  const isPortalRoute = pathname === "/lp" || pathname.startsWith("/lp/");

  const closeSearch = useCallback((restoreFocus = true) => {
    window.cancelAnimationFrame(openFrameRef.current);
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
    setQuery("");
    setFilter("All");
    setFiltersOpen(false);
    setActiveIndex(0);
  }, []);

  const openSearch = useCallback(() => {
    window.cancelAnimationFrame(openFrameRef.current);
    window.dispatchEvent(
      new CustomEvent("machine-spirit-overlay-open", { detail: "search" }),
    );
    // Let the previous overlay release its focus and scroll lock first.
    openFrameRef.current = window.requestAnimationFrame(() => {
      restoreFocusRef.current = true;
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    const handleOverlayOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== "search") closeSearch(false);
    };
    const handleHistoryNavigation = () => closeSearch(false);
    window.addEventListener("machine-spirit-overlay-open", handleOverlayOpen);
    window.addEventListener("popstate", handleHistoryNavigation);
    return () => {
      window.cancelAnimationFrame(openFrameRef.current);
      window.removeEventListener("machine-spirit-overlay-open", handleOverlayOpen);
      window.removeEventListener("popstate", handleHistoryNavigation);
    };
  }, [closeSearch]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const trigger = triggerRef.current;
    const backgroundElements = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement)
      .filter((element) => element !== modalRef.current)
      .map((element) => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute("aria-hidden"),
      }));

    document.body.style.overflow = "hidden";
    backgroundElements.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.tabIndex >= 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      if (restoreFocusRef.current) {
        if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
          previouslyFocused.focus();
        } else {
          trigger?.focus();
        }
      }
    };
  }, [closeSearch, open]);

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (visibleResults.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (activeIndex + direction + visibleResults.length) % visibleResults.length;
      setActiveIndex(nextIndex);
      document.getElementById(`search-${visibleResults[nextIndex].id}`)?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    } else if (event.key === "Enter") {
      event.preventDefault();
      const destination = visibleResults[activeIndex];
      if (!destination) return;
      closeSearch(false);
      router.push(destination.href);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`cog-search-trigger${isPortalRoute ? " cog-search-trigger--portal" : ""}`}
        aria-label="Open search"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openSearch}
      >
        <UIIcon name="search" animateOnHover active={open} />
      </button>

      {open && (
        <div
          ref={modalRef}
          className="cog-search-modal"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
        >
          <div
            className="cog-search-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
          >
            <header className="cog-search-header">
              <h2 id="site-search-title">Search</h2>
              <button
                type="button"
                className="cog-search-close"
                aria-label="Close search"
                onClick={() => closeSearch()}
              >
                <UIIcon name="close" animateOnHover />
              </button>
            </header>

            <div className="cog-search-controls">
              <label className="cog-search-field" htmlFor="site-search-input">
                <UIIcon name="search" />
                <span className="sr-only">Search companies, founders, and updates</span>
                <input
                  ref={inputRef}
                  id="site-search-input"
                  type="search"
                  value={query}
                  placeholder="Search"
                  autoComplete="off"
                  spellCheck={false}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded="true"
                  aria-controls="site-search-results"
                  aria-activedescendant={activeResult ? `search-${activeResult.id}` : undefined}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                    if (resultsRef.current) resultsRef.current.scrollTop = 0;
                  }}
                  onKeyDown={handleInputKeyDown}
                />
              </label>
              <button
                type="button"
                className={`cog-search-filter-toggle${filter !== "All" ? " has-filter" : ""}`}
                aria-expanded={filtersOpen}
                aria-controls="site-search-filters"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <span>Filters</span>
                <UIIcon name={filtersOpen ? "close" : "chevron-right"} />
              </button>
            </div>

            {filtersOpen && (
              <div id="site-search-filters" className="cog-search-filters" role="group" aria-label="Filter search results">
                {FILTERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={filter === option}
                    onClick={() => {
                      setFilter(option);
                      setActiveIndex(0);
                      if (resultsRef.current) resultsRef.current.scrollTop = 0;
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            <div className="cog-search-status" role="status" aria-live="polite" aria-atomic="true">
              {visibleResults.length} result{visibleResults.length === 1 ? "" : "s"}
              {filter !== "All" && !filtersOpen && <span className="cog-search-filter-label"> · {filter}</span>}
            </div>

            <div
              ref={resultsRef}
              id="site-search-results"
              className="cog-search-results"
              role="listbox"
              aria-label="Search results"
            >
              {visibleResults.map((result, itemIndex) => (
                <Link
                  key={result.id}
                  id={`search-${result.id}`}
                  href={result.href}
                  role="option"
                  aria-label={`${result.title}, ${result.subtitle}, ${result.section}`}
                  aria-selected={itemIndex === activeIndex}
                  tabIndex={-1}
                  className={`cog-search-result${itemIndex === activeIndex ? " is-active" : ""}`}
                  onPointerEnter={() => setActiveIndex(itemIndex)}
                  onFocus={() => setActiveIndex(itemIndex)}
                  onClick={() => closeSearch(false)}
                >
                  <span className="cog-search-result-logo" aria-hidden="true">
                    <Image src={result.logoSrc} alt="" width={48} height={28} unoptimized />
                  </span>
                  <span className="cog-search-result-title">{result.title}</span>
                  {filter === "All" && <span className="cog-search-result-type">{result.section}</span>}
                  <UIIcon name="arrow-up-right" className="cog-search-result-arrow" />
                </Link>
              ))}
              {visibleResults.length === 0 && <p className="cog-search-empty">No matches. Try another name or filter.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
