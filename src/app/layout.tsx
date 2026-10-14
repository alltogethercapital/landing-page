import type { Metadata } from "next";
import localFont from "next/font/local";
import { type CSSProperties, type ReactNode } from "react";
import { SiteSearch } from "@/components/site-search";
import { SiteAppearance } from "@/components/site-appearance";
import { buildSearchIndex } from "@/lib/search";
import { SITE_THEME_SCRIPT } from "@/lib/site-theme";
import "./globals.css";
import "./lp-release.css";
import "./site-rails.css";

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

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk/SpaceGrotesk-Variable.ttf",
  variable: "--font-space-grotesk",
  weight: "300 700",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
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
      data-site-theme="light"
      suppressHydrationWarning
      className={`${atlasTypewriter.variable} h-full antialiased`}
      style={hiddenScrollbarStyle}
    >
      <head>
        <script id="site-theme" dangerouslySetInnerHTML={{ __html: SITE_THEME_SCRIPT }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} min-h-full`}
        style={hiddenScrollbarStyle}
      >
        <SiteAppearance />
        <SiteSearch index={buildSearchIndex()} />
        {children}
      </body>
    </html>
  );
}
