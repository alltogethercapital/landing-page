import Link from "next/link";
import { LogoMark } from "@/components/cognition-layout";

export function LpPortalNav() {
  return (
    <header className="lp-portal-nav">
      <Link href="/lp" aria-label="All Together investor portal home">
        <LogoMark />
      </Link>
      <div className="lp-portal-nav-context">
        <span className="lp-live-dot" aria-hidden="true" />
        <span>Investor portal</span>
        <small>Staging</small>
      </div>
      <nav aria-label="Investor portal">
        <Link href="/lp" aria-current="page">Portfolio</Link>
        <span aria-disabled="true">Documents</span>
        <span aria-disabled="true">Updates</span>
      </nav>
      <form action="/api/lp/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </header>
  );
}
