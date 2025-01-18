/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during both development and production builds
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  basePath: `${process.env.NEXT_PUBLIC_ASSET_URL}`,
  assetPrefix: `${process.env.NEXT_PUBLIC_ASSET_URL}`,
};

module.exports = nextConfig;
