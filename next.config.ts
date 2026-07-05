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
        source: "/hero-videos/:path*\\.(mp4|webm|mov)",
        headers: immutableAssetHeaders,
      },
      {
        source: "/founders/:path*\\.(png|jpg|jpeg|webp|avif)",
        headers: immutableAssetHeaders,
      },
      {
        source: "/leadership/:path*\\.(png|jpg|jpeg|webp|avif)",
        headers: immutableAssetHeaders,
      },
      {
        source: "/logos/:path*\\.(png|jpg|jpeg|webp|avif|svg)",
        headers: immutableAssetHeaders,
      },
      {
        source: "/work/:path*\\.(png|jpg|jpeg|webp|avif)",
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
