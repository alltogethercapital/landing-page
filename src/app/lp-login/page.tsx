import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CognitionPage, CognitionSection } from "@/components/cognition-layout";
import { LpLoginForm } from "@/components/lp-login-form";
import { SiteNav } from "@/components/site-nav";
import { hasValidLpSession } from "@/lib/lp-auth";

export const metadata: Metadata = {
  title: "LP Login",
  description: "Secure limited partner access for All Together.",
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
        label="Limited partner access"
        title="Investor portal."
        className="lp-login-section"
      >
        <p className="cog-body-copy lp-login-intro">
          Sign in to view All Together&apos;s private investment portfolio and
          supporting records.
        </p>
        <LpLoginForm error={error} />
      </CognitionSection>
    </CognitionPage>
  );
}
