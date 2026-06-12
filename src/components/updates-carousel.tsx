"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type UpdateCarouselArticle = {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  category: string;
  image: string;
};

export function UpdatesCarousel({
  articles,
}: {
  articles: UpdateCarouselArticle[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollPrevious(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();

    const handleResize = () => updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", handleResize);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollState);
    resizeObserver?.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="cog-updates-carousel">
      <div className="cog-updates-head">
        <h2 className="cog-strip-heading">Updates</h2>
        <div className="cog-carousel-controls" aria-label="Updates navigation">
          <button
            type="button"
            className="cog-carousel-button"
            aria-label="Previous updates"
            disabled={!canScrollPrevious}
            onClick={() => move(-1)}
          >
            <ChevronLeft className="size-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            className="cog-carousel-button"
            aria-label="Next updates"
            disabled={!canScrollNext}
            onClick={() => move(1)}
          >
            <ChevronRight className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="cog-updates-track" aria-label="Latest updates">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/updates/${article.slug}`}
            className="cog-article-card"
          >
            <span className="cog-article-media">
              <Image
                src={article.image}
                alt=""
                fill
                sizes="(max-width: 768px) 82vw, 303px"
                unoptimized
                className="cog-cover object-cover"
              />
            </span>
            <span className="cog-article-title">{article.title}</span>
            <span className="cog-article-meta">
              <time dateTime={article.dateISO}>{article.date}</time> ·{" "}
              {article.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
