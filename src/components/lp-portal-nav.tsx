"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/cognition-layout";

export function LpPortalNav() {
  const pathname = usePathname();
  const isUpdate = pathname.startsWith("/lp/updates");

  return (
    <aside className="lp-portal-nav" aria-label="Investor portal navigation">
      <Link
        href="/lp"
        aria-label="All Together investor portal home"
        className="lp-portal-nav-logo"
      >
        <LogoMark />
      </Link>
      <nav aria-label="Investor portal">
        <Link href="/lp" aria-current={!isUpdate ? "page" : undefined} className={!isUpdate ? "is-active" : undefined}>Portfolio</Link>
        <Link href="/lp/updates" aria-current={isUpdate ? "page" : undefined} className={isUpdate ? "is-active" : undefined}>Letter</Link>
        <Link href="/">Home</Link>
      </nav>
      <form action="/api/lp/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </aside>
  );
}
