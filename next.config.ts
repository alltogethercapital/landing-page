import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [90],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/hero-videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
