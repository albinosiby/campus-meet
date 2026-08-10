import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    qualities: [75, 80, 85, 100],
  },
  trailingSlash: true,
  experimental: {
    devtoolSegmentExplorer: false,
  },
  // Allow importing shared code from the monorepo `src/` folder
  transpilePackages: [],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };
    return config;
  },
};

export default nextConfig;
