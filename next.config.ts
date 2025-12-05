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
  
  // ✅ Turbopack 설정 (Next.js 16 기본)
  turbopack: {
    // Turbopack 활성화 (명시적 설정)
  },
  
  // ✅ TypeScript 빌드에서 refactored 파일 제외
  typescript: {
    // ⚠️ 빌드 시 타입 체크 무시 (개발 중)
    ignoreBuildErrors: false,
  },
  
  // ✅ refactored 파일은 아직 개발 중이므로 무시
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => {
    // refactored 파일 제외하지 않음 (정규 Next.js 페이지로 인식)
    return ext
  }),
};

export default nextConfig;
