import { AsciiHero } from "@/components/ascii-hero";
import { CognitionPage } from "@/components/cognition-layout";
import { SiteNav } from "@/components/site-nav";

export default function Home() {
  return (
    <CognitionPage>
      <SiteNav />
      <AsciiHero />
    </CognitionPage>
  );
}
