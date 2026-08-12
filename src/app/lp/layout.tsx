import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LpPortalNav } from "@/components/lp-portal-nav";
import { hasValidLpSession } from "@/lib/lp-auth";

export default async function LpLayout({ children }: { children: ReactNode }) {
  if (!(await hasValidLpSession())) redirect("/lp-login");

  return (
    <main className="lp-portal-page min-h-screen">
      <LpPortalNav />
      {children}
    </main>
  );
}
