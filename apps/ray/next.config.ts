import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response", "node-vibrant"],
  experimental: {
    optimizePackageImports: ["lucide-react", "shiki"],
  },
};

export default nextConfig;
