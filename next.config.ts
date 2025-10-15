import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude CLI directory from Next.js compilation
  webpack(config, { isServer }) {
    // Exclude CLI directory from compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/cli/**", "**/node_modules/**"],
    };

    // Add raw-loader for markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    return config;
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      {
        source: "/shadcn",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vscode",
        destination: "/",
        permanent: true,
      },
    ];
  },

  turbopack: {
    rules: {
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
