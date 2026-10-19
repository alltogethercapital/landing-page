import type { Metadata } from "next";

const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Machine Spirit Capital — the three-row Soft Relief wing and Machine Spirit wordmark on charcoal machine static.",
};

export function pageTitle(name: string): string {
  return `${name} | Machine Spirit Cap`;
}

export function pageMetadata(name: string, description: string, path: string): Metadata {
  const title = pageTitle(name);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Machine Spirit Capital",
      type: "website",
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}
