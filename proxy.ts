import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy for route protection and access control
 * (Previously called middleware in Next.js 15)
 * 
 * 배포 환경별 접근 제어:
 * - SHOP_ONLY=true: 쇼핑몰만 공개 (토스페이먼츠 심사용)
 * - CLIENT_ONLY=true: 고객용 페이지만 공개
 * - ADMIN_ONLY=true: 관리자 페이지만 공개
 * - 설정 없음: 모든 페이지 접근 가능 (개발 환경)
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 환경변수로 배포 모드 확인
  const isShopOnly = process.env.NEXT_PUBLIC_DEPLOY_MODE === 'shop'
  const isClientOnly = process.env.NEXT_PUBLIC_DEPLOY_MODE === 'client'
  const isAdminOnly = process.env.NEXT_PUBLIC_DEPLOY_MODE === 'admin'
  
  // 🛍️ 쇼핑몰 전용 배포 (토스페이먼츠 심사용)
  if (isShopOnly) {
    // /shop 경로만 허용
    if (pathname.startsWith('/shop') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return NextResponse.next()
    }
    
    // 루트 경로는 /shop으로 리다이렉트
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/shop', request.url))
    }
    
    // /c, /admin 접근 차단
    if (pathname.startsWith('/c') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/shop', request.url))
    }
    
    // 기타 경로는 쇼핑몰 홈으로 리다이렉트
    return NextResponse.redirect(new URL('/shop', request.url))
  }
  
  // 👥 고객용 페이지 전용 배포
  if (isClientOnly) {
    // /c 경로만 허용
    if (pathname.startsWith('/c') || pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return NextResponse.next()
    }
    
    // /shop, /admin 접근 차단
    if (pathname.startsWith('/shop') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/c/packages', request.url))
    }
    
    return NextResponse.redirect(new URL('/c/packages', request.url))
  }
  
  // 🔐 관리자 페이지 전용 배포
  if (isAdminOnly) {
    // /admin 경로만 허용
    if (pathname.startsWith('/admin') || pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return NextResponse.next()
    }
    
    // /shop, /c 접근 차단
    if (pathname.startsWith('/shop') || pathname.startsWith('/c')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  
  // 개발 환경: 모든 경로 허용
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
