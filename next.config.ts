import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
