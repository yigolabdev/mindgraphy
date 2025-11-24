import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export', // ✅ Static export enabled - all dynamic routes converted to query params
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for static hosting compatibility
};

export default nextConfig;
