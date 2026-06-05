import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { SitePreloader } from "@/components/site-preloader";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// metadataBase is required so Next.js can resolve the opengraph-image
// route to an absolute URL in the rendered og:image meta tag.
const SITE_URL = "https://alltogethercapital.com";
const SITE_TITLE = "The Future Is Built Together — All Together Capital";
const SITE_DESCRIPTION =
  "All Together Capital backs the founders rebuilding the hard frontier — across AI, defense, energy, robotics, semiconductors, and space.";

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
    siteName: "All Together Capital",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      style={hiddenScrollbarStyle}
    >
      <body className="min-h-full" style={hiddenScrollbarStyle}>
        <SitePreloader />
        {children}
      </body>
    </html>
  );
}
