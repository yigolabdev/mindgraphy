import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export', // ⚠️ 동적 라우트 때문에 비활성화
  // S3 배포: .next 폴더를 직접 업로드 (권장하지 않음)
  // 권장: Vercel/Netlify 사용
  
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for static hosting compatibility
};

export default nextConfig;
