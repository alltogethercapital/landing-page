import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CognitionPage, CognitionSection } from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ARTICLES, articleBySlug } from "@/lib/articles";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return { title: "Not found — All Together" };
  return {
    title: `${article.title} — All Together`,
    description: article.excerpt,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection
        label="Updates"
        title={article.title}
        wide
        bodyClassName="cog-note-body"
      >
        <p className="cog-article-meta" style={{ maxWidth: 531 }}>
          <time dateTime={article.dateISO}>{article.date}</time> · {article.category} ·{" "}
          {article.author}
        </p>

        <div className="cog-article-media" style={{ marginTop: 26 }}>
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(max-width: 899px) calc(100vw - 40px), 760px"
            unoptimized
            loading="eager"
            className="cog-cover object-cover"
          />
        </div>

        <div className="cog-legal-stack cog-note-stack" style={{ maxWidth: 531, marginTop: 42 }}>
          {article.sections.map((section, i) => (
            <section key={i} className="cog-legal-section">
              {section.heading && <h2>{section.heading}</h2>}
              {section.body.map((paragraph, j) => (
                <p key={j}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </CognitionSection>

      <SiteFooter />
    </CognitionPage>
  );
}
