import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CognitionPage, CognitionSection } from "@/components/cognition-layout";
import { LpLoginForm } from "@/components/lp-login-form";
import { SiteNav } from "@/components/site-nav";
import { hasValidLpSession } from "@/lib/lp-auth";
import { pageTitle } from "@/lib/page-metadata";

export const metadata: Metadata = {
  title: pageTitle("LP Login"),
  description: "Secure limited partner access for Machine Spirit Capital.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LpLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await hasValidLpSession()) redirect("/lp");
  const { error } = await searchParams;

  return (
    <CognitionPage className="lp-login-page">
      <SiteNav />
      <CognitionSection
        title="Investor portal."
        hideTitle
        className="lp-login-section"
      >
        <LpLoginForm error={error} />
      </CognitionSection>
    </CognitionPage>
  );
}
