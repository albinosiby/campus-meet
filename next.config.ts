import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    qualities: [75, 80, 85, 100],
  },
  trailingSlash: true,
  // Avoid Next.js 15 SegmentViewNode / Client Manifest runtime overlay errors in dev
  experimental: {
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
