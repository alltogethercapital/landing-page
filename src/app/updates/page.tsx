import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CognitionPage,
  CognitionSection,
  CognitionStrip,
} from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Updates — All Together",
  description:
    "Writing from All Together: letters, theses, and updates on the hard frontier.",
};

export default function NotesPage() {
  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Updates" title="Updates.">
        <p className="cog-body-copy">
          Letters, theses, and updates on the hard frontier. We write when we
          have something to say.
        </p>
      </CognitionSection>

      <CognitionStrip className="cog-strip--inset">
        <div className="cog-article-grid">
          {ARTICLES.map((article, index) => (
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
                  sizes="(max-width: 899px) calc((100vw - 48px) / 2), 303px"
                  unoptimized
                  loading={index < 4 ? "eager" : "lazy"}
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
      </CognitionStrip>

      <SiteFooter />
    </CognitionPage>
  );
}
