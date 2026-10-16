import Image from "next/image";
import Link from "next/link";
import { LEGAL, NAV, SOCIALS, X_PROFILE_URL } from "@/lib/site";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="cog-footer-link">
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="cog-footer">
      <div className="cog-footer-body">
        <div className="cog-footer-identity">
          <p className="cog-footer-copy">
            Official website of Machine Spirit
          </p>
          <div className="cog-footer-location">
            <Image
              src="/brand/us-flag.svg"
              alt="United States flag"
              width={38}
              height={20}
              unoptimized
              className="cog-footer-flag"
            />
            <p className="cog-footer-meta">Seattle, WA</p>
          </div>
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

        <nav className="cog-footer-column cog-footer-connect" aria-label="Connect">
          <p className="cog-footer-meta">Connect</p>
          <div className="cog-footer-socials">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="cog-footer-social-link"
                aria-label={href === X_PROFILE_URL ? "Machine Spirit on X" : label}
                title={label}
              >
                <Icon animateOnHover />
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="cog-footer-bottom">
        <p>© {new Date().getFullYear()} Machine Spirit Capital.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
