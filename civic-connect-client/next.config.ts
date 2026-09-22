import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: ["lucide-react", "@react-google-maps/api"],
  },
};

export default nextConfig;
