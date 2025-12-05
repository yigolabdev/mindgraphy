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
  
  // ✅ Mock 데이터 모듈을 서버/클라이언트 모두에서 사용 가능하도록 설정
  webpack: (config, { isServer }) => {
    // Mock 데이터를 external로 처리하지 않음
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // ✅ Turbopack에서 mock 모듈 처리
  experimental: {
    // 서버 컴포넌트 외부 패키지 처리
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
