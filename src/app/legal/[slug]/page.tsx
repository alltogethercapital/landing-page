import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
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
  if (!doc) return { title: "Not found — All Together Capital" };
  return {
    title: `${doc.title} — All Together Capital`,
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
    <main className="min-h-screen bg-black text-white">
      <SiteNav showLogo />

      <article className="mx-auto max-w-[760px] px-6 pb-24 pt-[136px] md:pt-[176px]">
        <p className="font-mono text-[13px] uppercase tracking-[0.25em] text-[#ff4400]">
          Legal
        </p>
        <h1 className="mt-5 text-[40px] font-medium leading-[1.05] tracking-[-1.5px] md:text-[60px] md:tracking-[-2.5px]">
          {doc.title}
        </h1>
        <p className="mt-4 font-mono text-[13px] uppercase tracking-[0.12em] text-white/40">
          Last updated: {doc.updated}
        </p>
        <p className="mt-8 text-[16px] leading-relaxed text-white/65 md:text-[17px]">
          {doc.intro}
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[20px] font-semibold tracking-[-0.4px] text-white md:text-[24px]">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-3 text-[15px] leading-relaxed text-white/60 md:text-[16px]"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
