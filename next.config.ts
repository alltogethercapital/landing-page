import type { NextConfig } from "next";

const immutableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    qualities: [90],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/lp/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/api/lp/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
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
