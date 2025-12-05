import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // ✅ S3 정적 배포를 위해 활성화
  
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for static hosting compatibility
  
  // ✅ 동적 라우트 페이지는 fallback으로 처리
  // 정적 export 시 동적 라우트는 404로 처리됨
  
  // ✅ Turbopack 설정 (Next.js 16 기본)
  turbopack: {
    // Turbopack 활성화 (명시적 설정)
  },
  
  // ✅ TypeScript 빌드 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ✅ refactored 파일은 아직 개발 중이므로 무시
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => {
    // refactored 파일 제외하지 않음 (정규 Next.js 페이지로 인식)
    return ext
  }),
};

export default nextConfig;
