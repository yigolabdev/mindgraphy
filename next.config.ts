import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ⚠️ Vercel 배포에서는 output: 'export'를 제거해야 middleware가 작동합니다
  // S3 배포용으로는 별도 브랜치나 환경변수로 분리 필요
  
  images: {
    unoptimized: true, // Vercel 자동 이미지 최적화 사용하지 않음
  },
  
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
