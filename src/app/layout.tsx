import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import { SiteSearch } from "@/components/site-search";
import { SiteShaderLab } from "@/components/site-shader-lab";
import { SitePreloader } from "@/components/site-preloader";
import { buildSearchIndex } from "@/lib/search";
import "./globals.css";

const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Times New Roman", "Georgia", "serif"],
  src: [
    {
      path: "../../public/fonts/Newsreader-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Newsreader-SemiBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

const martinaPlantijn = localFont({
  variable: "--font-martina-plantijn",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: "./fonts/paradigm/martina-plantijn-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-light-italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-medium-italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-bold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/martina-plantijn-bold-italic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
});

const atlasTypewriter = localFont({
  variable: "--font-atlas-typewriter",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "SF Mono", "Consolas", "monospace"],
  src: [
    {
      path: "./fonts/paradigm/AtlasTypewriter-Light-Web.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-LightItalic-Web.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-Regular-Web.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-RegularItalic-Web.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-Medium-Web.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-MediumItalic-Web.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-Bold-Web.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/paradigm/AtlasTypewriter-BoldItalic-Web.woff2",
      weight: "800",
      style: "italic",
    },
  ],
});

const brandDisplay = localFont({
  variable: "--font-brand-display",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  src: [
    {
      path: "./fonts/sequoia/Unica77LLWeb-Regular.1492eabb.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/Unica77LLWeb-Bold.3928012f.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

// metadataBase is required so Next.js can resolve the opengraph-image
// route to an absolute URL in the rendered og:image meta tag.
const SITE_URL = "https://machinespirit.com";
const SITE_TITLE = "The Future Is Built Together — Machine Spirit Capital";
const SITE_DESCRIPTION =
  "Machine Spirit Capital backs the founders creating and stewarding the hard frontier across AI, defense, energy, robotics, semiconductors, and space.";

const hiddenScrollbarStyle: CSSProperties = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Machine Spirit Capital",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${martinaPlantijn.variable} ${atlasTypewriter.variable} ${brandDisplay.variable} h-full antialiased`}
      style={hiddenScrollbarStyle}
    >
      <body className="min-h-full" style={hiddenScrollbarStyle}>
        {process.env.NODE_ENV === "development" && <SiteShaderLab />}
        <SitePreloader />
        <SiteSearch index={buildSearchIndex()} />
        {children}
      </body>
    </html>
  );
}
