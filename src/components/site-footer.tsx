import Link from "next/link";
import { LogoMark } from "@/components/cognition-layout";
import { ArrowUpRight } from "@/components/icons";
import { COMPANY_BY_GLYPH, GLYPH_RAMP } from "@/lib/glyphs";
import { slugify } from "@/lib/portfolio";
import { LEGAL, NAV, SOCIALS } from "@/lib/site";

// The index strip: the hero's full luminance ramp, with each portfolio
// company's assigned character rendered live as a link. The rest stay dim —
// characters the firm hasn't written yet.
function GlyphIndex() {
  // A few characters repeat inside the ramp — link only the first occurrence
  // so each company lights up exactly once.
  const linked = new Set<string>();
  return (
    <div className="cog-footer-ramp" aria-label="Portfolio index">
      <p className="cog-footer-ramp-strip">
        {[...GLYPH_RAMP].map((glyph, i) => {
          const company = COMPANY_BY_GLYPH.get(glyph);
          if (!company || linked.has(company)) {
            return (
              <span key={i} aria-hidden="true">
                {glyph === " " ? " " : glyph}
              </span>
            );
          }
          linked.add(company);
          return (
            <Link
              key={i}
              href={`/companies#${slugify(company)}`}
              title={company}
              aria-label={company}
            >
              {glyph}
            </Link>
          );
        })}
      </p>
      <p className="cog-footer-ramp-note">
        Every company is a character. The picture appears all together.
      </p>
    </div>
  );
}

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
            The future is built together. The future is built now.
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

      <GlyphIndex />

      <div className="cog-footer-bottom">
        <p>© {new Date().getFullYear()} All Together.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
