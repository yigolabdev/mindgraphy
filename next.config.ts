import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Note: 'output: export' removed because this app uses dynamic routes (/c/[token])
  // and server-side features that are not compatible with static HTML export
  images: {
    unoptimized: true, // allows <Image> to work without Image Optimization API
  },
};

export default nextConfig;
