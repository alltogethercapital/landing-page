"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { LogoMark } from "@/components/cognition-layout";
import type { SearchResult, SearchResultSection } from "@/lib/search";

const RESULT_LIMIT = 6;
const SECTION_ORDER: SearchResultSection[] = ["Companies", "Founders", "Updates"];

function SearchGlyph({ close = false }: { close?: boolean }) {
  if (close) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5l14 14M19 5L5 19" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.4 15.4 4.1 4.1" />
    </svg>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function scoreResult(result: SearchResult, query: string) {
  const title = normalize(result.title);
  const subtitle = normalize(result.subtitle);
  const haystack = normalize(result.searchText);
  const normalizedQuery = normalize(query.trim());
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!terms.every((term) => haystack.includes(term))) return null;
  if (title === normalizedQuery) return 0;
  if (title.startsWith(normalizedQuery)) return 1;
  if (title.includes(normalizedQuery)) return 2;
  if (subtitle.includes(normalizedQuery)) return 3;
  return 4;
}

type ResultGroup = {
  section: SearchResultSection;
  results: SearchResult[];
  total: number;
};

export function SiteSearch({ index }: { index: SearchResult[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const groups = useMemo<ResultGroup[]>(() => {
    if (query.trim().length < 2) return [];

    return SECTION_ORDER.map((section) => {
      const scored = index
        .filter((item) => item.section === section)
        .map((item, sourceIndex) => ({
          item,
          sourceIndex,
          score: scoreResult(item, query),
        }))
        .filter(
          (entry): entry is typeof entry & { score: number } => entry.score !== null,
        )
        .sort((a, b) => a.score - b.score || a.sourceIndex - b.sourceIndex);

      return {
        section,
        total: scored.length,
        results: scored.slice(0, RESULT_LIMIT).map((entry) => entry.item),
      };
    }).filter((group) => group.total > 0);
  }, [index, query]);

  const visibleResults = useMemo(
    () => groups.flatMap((group) => group.results),
    [groups],
  );
  const totalMatches = groups.reduce((total, group) => total + group.total, 0);
  const activeResult = visibleResults[activeIndex];

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
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
    window.requestAnimationFrame(() => inputRef.current?.focus());

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
      );
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
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [closeSearch, open]);

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (visibleResults.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % visibleResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + visibleResults.length) % visibleResults.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const destination = visibleResults[activeIndex];
      if (!destination) return;
      closeSearch();
      router.push(destination.href);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="cog-search-trigger"
        aria-label="Open search"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openSearch}
      >
        <SearchGlyph />
      </button>

      {open && (
        <div
          ref={modalRef}
          className="cog-search-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Search All Together"
        >
          <div className="cog-search-shell">
            <header className="cog-search-header">
              <Link href="/" aria-label="All Together home" onClick={closeSearch}>
                <LogoMark />
              </Link>
              <button
                type="button"
                className="cog-search-close"
                aria-label="Close search"
                onClick={closeSearch}
              >
                <span>Close</span>
                <SearchGlyph close />
              </button>
            </header>

            <div className="cog-search-main">
              <label className="cog-search-field" htmlFor="site-search-input">
                <span className="sr-only">Search All Together</span>
                <input
                  ref={inputRef}
                  id="site-search-input"
                  type="search"
                  value={query}
                  placeholder="Search All Together"
                  autoComplete="off"
                  spellCheck={false}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={query.trim().length >= 2}
                  aria-controls="site-search-results"
                  aria-activedescendant={activeResult ? `search-${activeResult.id}` : undefined}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                />
                <SearchGlyph />
              </label>

              <div className="cog-search-status" aria-live="polite">
                {query.trim().length < 2
                  ? "Search companies, founders, and updates. Type at least two characters."
                  : totalMatches > 0
                    ? `${totalMatches} result${totalMatches === 1 ? "" : "s"} for “${query.trim()}”`
                    : `No results for “${query.trim()}”`}
              </div>

              <div id="site-search-results" className="cog-search-results">
                {groups.map((group, groupIndex) => {
                  const groupStart = groups
                    .slice(0, groupIndex)
                    .reduce((total, precedingGroup) => total + precedingGroup.results.length, 0);

                  return (
                    <section key={group.section} className="cog-search-group">
                      <h2>
                        <span>{group.section}</span>
                        <span aria-hidden="true" />
                        <small>{group.total}</small>
                      </h2>
                      <div role="listbox" aria-label={`${group.section} results`}>
                        {group.results.map((result, indexInGroup) => {
                          const itemIndex = groupStart + indexInGroup;
                          const active = itemIndex === activeIndex;

                          return (
                            <Link
                              key={result.id}
                              id={`search-${result.id}`}
                              href={result.href}
                              role="option"
                              aria-selected={active}
                              className={`cog-search-result${active ? " is-active" : ""}`}
                              onPointerEnter={() => setActiveIndex(itemIndex)}
                              onFocus={() => setActiveIndex(itemIndex)}
                              onClick={closeSearch}
                            >
                              <span className="cog-search-result-copy">
                                <strong>{result.title}</strong>
                                <span>{result.subtitle}</span>
                                {result.description && <small>{result.description}</small>}
                              </span>
                              <span className="cog-search-result-arrow" aria-hidden="true">
                                ↗
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      {group.total > RESULT_LIMIT && (
                        <p className="cog-search-more">
                          Showing the best {RESULT_LIMIT} of {group.total}
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>

              {activeResult?.image && (
                <div className="cog-search-preview" aria-hidden="true">
                  <Image
                    src={activeResult.image}
                    alt=""
                    fill
                    sizes="260px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <footer className="cog-search-footer" aria-hidden="true">
              <span>↑↓ Select</span>
              <span>↵ Open</span>
              <span>Esc Close</span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
