import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack for stable builds
  // typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
