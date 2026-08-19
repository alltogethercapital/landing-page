import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import { SiteInteractionSounds } from "@/components/site-interaction-sounds";
import { SiteSearch } from "@/components/site-search";
import { SitePreloader } from "@/components/site-preloader";
import { buildSearchIndex } from "@/lib/search";
import "./globals.css";

const rosart = localFont({
  variable: "--font-rosart",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: "./fonts/sequoia/Rosart-Regular-HsHjFyXa.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/Rosart-Italic-H5xVVjl2.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/sequoia/Rosart-SemiBold-7isf5RfA.woff",
      weight: "600",
      style: "normal",
    },
  ],
});

const unica77 = localFont({
  variable: "--font-unica",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  src: [
    {
      path: "./fonts/sequoia/Unica77LLWeb-Regular-dxUtRmHM.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/Unica77LLWeb-Italic-x0vfYgaH.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/sequoia/Unica77LLWeb-Bold-YVLHSOyT.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const pitchSans = localFont({
  variable: "--font-pitch-sans",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  src: [
    {
      path: "./fonts/sequoia/PitchSansApp-Regular.07f66690.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/PitchSansApp-Medium.4e29e2bf.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/PitchSansApp-Bold.e62747bf.woff2",
      weight: "700",
      style: "normal",
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

// metadataBase is required so Next.js can resolve the opengraph-image
// route to an absolute URL in the rendered og:image meta tag.
const SITE_URL = "https://alltogethercapital.com";
const SITE_TITLE = "Home | All Together Capital";
const SITE_DESCRIPTION =
  "All Together backs the founders rebuilding the hard frontier across AI, defense, energy, robotics, semiconductors, and space.";

const hiddenScrollbarStyle: CSSProperties = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | All Together Capital",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "All Together",
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
      className={`${rosart.variable} ${unica77.variable} ${pitchSans.variable} ${atlasTypewriter.variable} h-full antialiased`}
      style={hiddenScrollbarStyle}
    >
      <body className="min-h-full" style={hiddenScrollbarStyle}>
        <SiteInteractionSounds />
        <SitePreloader />
        <SiteSearch index={buildSearchIndex()} />
        {children}
      </body>
    </html>
  );
}
