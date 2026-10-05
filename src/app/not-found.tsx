import { ArrowLink, CognitionPage, CognitionSection } from "@/components/cognition-layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { GLYPH_RAMP } from "@/lib/glyphs";

export default function NotFound() {
  return (
    <CognitionPage>
      <SiteNav showLogo />

      <CognitionSection label="404" title="This cell is empty.">
        <p className="cog-body-copy">
          Nothing renders here. The page you&apos;re looking for doesn&apos;t
          exist or has moved. Let&apos;s get you back to building.
        </p>

        <p className="cog-404-ramp" aria-hidden="true">
          {GLYPH_RAMP.trim()}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ArrowLink href="/">
            Back home
          </ArrowLink>
          <ArrowLink href="/companies" className="bg-transparent text-black">
            Our companies
          </ArrowLink>
        </div>
      </CognitionSection>

      <SiteFooter />
    </CognitionPage>
  );
}
