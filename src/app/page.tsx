import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { HeroVideoPreload } from "@/components/hero-video-preload";

export default function Home() {
  return (
    <>
      <HeroVideoPreload />
      <SiteNav />
      <Hero />
    </>
  );
}
