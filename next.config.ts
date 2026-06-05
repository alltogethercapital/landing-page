import type { NextConfig } from "next";

const immutableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [90],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/hero-videos/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/founders/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/leadership/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/logos/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/work/:path*",
        headers: immutableAssetHeaders,
      },
      {
        source: "/hero-drones.jpg",
        headers: immutableAssetHeaders,
      },
      {
        source: "/hero-robots.jpg",
        headers: immutableAssetHeaders,
      },
      {
        source: "/logo-orange.png",
        headers: immutableAssetHeaders,
      },
      {
        source: "/logo-white.png",
        headers: immutableAssetHeaders,
      },
      {
        source: "/logo-black.png",
        headers: immutableAssetHeaders,
      },
    ];
  },
};

export default nextConfig;
