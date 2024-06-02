/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    optimizePackageImports: ["shiki", "@shikijs/monaco"],
  },
};
