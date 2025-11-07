import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // ✅ Static HTML export for AWS S3 deployment
  images: {
    unoptimized: true, // Required for static export - allows <Image> to work
  },
  trailingSlash: true, // Better for S3 hosting
};

export default nextConfig;
