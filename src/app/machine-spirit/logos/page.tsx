import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageTitle } from "@/lib/page-metadata";

export const metadata: Metadata = {
  title: pageTitle("Logos"),
  robots: { index: false, follow: false },
};

export default async function MonogramGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[] }>;
}) {
  const theme = (await searchParams).theme;
  const query = theme === "light" || theme === "dark" ? `?theme=${theme}` : "";
  redirect(`/brand/machine-spirit-monograms/index.html${query}`);
}
