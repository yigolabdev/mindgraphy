import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export', // ⚠️ 동적 라우트(/admin/timetable/[projectId], /admin/gallery/[projectId])가 있어 비활성화
  // 정적 배포가 필요한 경우:
  // 1. 동적 라우트에 generateStaticParams() 추가
  // 2. 또는 동적 라우트를 클라이언트 사이드 라우팅으로 변경
  // 3. 또는 Vercel/Netlify 등 서버사이드 렌더링 지원 플랫폼 사용
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for static hosting compatibility
};

export default nextConfig;
