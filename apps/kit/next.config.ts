import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["kit.localhost", "*.kit.localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
