import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export (replaces `next export`)
  output: "export",
  // When deployed to GitHub Pages under a repo path (https://<user>.github.io/<repo>/)
  // set assetPrefix so files reference /<repo>/_next/... instead of absolute root.
  assetPrefix: process.env.NODE_ENV === 'production' ? '/brew-log-app' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/brew-log-app' : '',
};

export default nextConfig;
