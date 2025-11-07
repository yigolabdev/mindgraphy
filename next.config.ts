import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   output: 'export', // ✅ enable static HTML export
  images: {
    unoptimized: true, // optional: allows <Image> to work without Image Optimization API
  },
};


export default nextConfig;
