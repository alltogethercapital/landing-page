import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import { SitePreloader } from "@/components/site-preloader";
import "./globals.css";

const unica = localFont({
  variable: "--font-unica",
  display: "swap",
  fallback: ["BlinkMacSystemFont", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  src: [
    {
      path: "./fonts/sequoia/Unica77LLWeb-Regular.1492eabb.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/Unica77LLWeb-Italic.5bb94689.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/sequoia/Unica77LLWeb-Bold.3928012f.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

const rosart = localFont({
  variable: "--font-rosart",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  src: [
    {
      path: "./fonts/sequoia/Rosart-Regular.e5cb9549.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sequoia/Rosart-RegularItalic.b97b7c23.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/sequoia/Rosart-SemiBold.03e6f509.woff",
      weight: "500",
      style: "normal",
    },
  ],
});

const pitchSans = localFont({
  variable: "--font-pitch-sans",
  display: "swap",
  fallback: ["BlinkMacSystemFont", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
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
      weight: "600",
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
      className={`${unica.variable} ${rosart.variable} ${pitchSans.variable} h-full antialiased`}
      style={hiddenScrollbarStyle}
    >
      <body className="min-h-full" style={hiddenScrollbarStyle}>
        <SitePreloader />
        {children}
      </body>
    </html>
  );
}
