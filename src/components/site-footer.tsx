import Link from "next/link";
import { LogoMark } from "@/components/cognition-layout";
import { ArrowUpRight } from "@/components/icons";
import { LEGAL, NAV, SOCIALS } from "@/lib/site";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className = "cog-footer-link";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className={className}
    >
      {children}
      {!href.startsWith("mailto:") && <ArrowUpRight className="size-3" />}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="cog-footer">
      <div className="cog-footer-mark">
        <Link href="/" aria-label="All Together home">
          <LogoMark className="cog-footer-wordmark" />
        </Link>
      </div>

      <div className="cog-footer-body">
        <div>
          <p className="cog-footer-copy">
            <span className="cog-footer-copy-line">The future is built together.</span>
            <span className="cog-footer-copy-line">The future is built now.</span>
          </p>
          <p className="cog-footer-meta">Seattle, WA</p>
        </div>

        <nav className="cog-footer-column" aria-label="Footer navigation">
          <p className="cog-footer-meta">Site</p>
          {NAV.map((item) => (
            <FooterLink key={item.label} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </nav>

        <nav className="cog-footer-column" aria-label="Legal">
          <p className="cog-footer-meta">Legal</p>
          {LEGAL.map((item) => (
            <FooterLink key={item.label} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </nav>

        <nav className="cog-footer-column" aria-label="Connect">
          <p className="cog-footer-meta">Connect</p>
          {SOCIALS.map((item) => (
            <FooterLink key={item.label} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </nav>
      </div>

      <div className="cog-footer-bottom">
        <p>© {new Date().getFullYear()} All Together.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
