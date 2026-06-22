import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import { SitePreloader } from "@/components/site-preloader";
import "./globals.css";

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

const brandSerif = localFont({
  variable: "--font-brand-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: "./fonts/brand/YoungSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

// metadataBase is required so Next.js can resolve the opengraph-image
// route to an absolute URL in the rendered og:image meta tag.
const SITE_URL = "https://alltogethercapital.com";
const SITE_TITLE = "The Future Is Built Together — All Together";
const SITE_DESCRIPTION =
  "All Together backs the founders rebuilding the hard frontier across AI, defense, energy, robotics, semiconductors, and space.";

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
      className={`${martinaPlantijn.variable} ${atlasTypewriter.variable} ${brandSerif.variable} h-full antialiased`}
      style={hiddenScrollbarStyle}
    >
      <body className="min-h-full" style={hiddenScrollbarStyle}>
        <SitePreloader />
        {children}
      </body>
    </html>
  );
}
