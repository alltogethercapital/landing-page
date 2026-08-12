import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/cognition-layout";
import { LpLoginForm } from "@/components/lp-login-form";
import { SiteNav } from "@/components/site-nav";
import { hasValidLpSession } from "@/lib/lp-auth";

export const metadata: Metadata = {
  title: "LP Login — All Together",
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
    <main className="cog-page lp-login-page min-h-screen">
      <SiteNav />
      <section className="lp-login-shell">
        <div className="lp-login-heading">
          <p className="cog-kicker">Limited partner access</p>
          <h1>Information, clearly held.</h1>
          <p>
            A private view of the All Together portfolio, investment activity,
            and the source information behind it.
          </p>
        </div>
        <div className="lp-login-panel">
          <div className="lp-login-panel-head">
            <LogoMark />
            <span>Investor portal</span>
          </div>
          <LpLoginForm error={error} />
        </div>
      </section>
      <p className="lp-login-footnote">
        Staging · Values are preliminary until formally approved.
      </p>
    </main>
  );
}
