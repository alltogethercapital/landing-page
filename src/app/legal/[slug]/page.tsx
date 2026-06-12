import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CognitionPage, CognitionSection } from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { LEGAL_DOCS } from "@/lib/legal";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) return { title: "Not found — All Together" };
  return {
    title: `${doc.title} — All Together`,
    description: doc.intro,
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) notFound();

  return (
    <CognitionPage>
      <SiteNav />

      <CognitionSection label="Legal" title={doc.title}>
        <p className="cog-article-meta">Last updated: {doc.updated}</p>
        <p className="cog-body-copy mt-8">{doc.intro}</p>

        <div className="cog-legal-stack">
          {doc.sections.map((section) => (
            <section key={section.heading} className="cog-legal-section">
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </CognitionSection>

      <SiteFooter />
    </CognitionPage>
  );
}
