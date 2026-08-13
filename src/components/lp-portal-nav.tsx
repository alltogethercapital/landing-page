import Link from "next/link";
import { LogoMark } from "@/components/cognition-layout";

export function LpPortalNav() {
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
        <Link href="/lp" aria-current="page" className="is-active">Portfolio</Link>
        <span aria-disabled="true">Documents</span>
        <span aria-disabled="true">Updates</span>
      </nav>
      <form action="/api/lp/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </aside>
  );
}
