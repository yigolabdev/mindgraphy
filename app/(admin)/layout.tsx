'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  // 로그인 페이지 체크 (trailing slash 고려)
  const isLoginPage = pathname?.startsWith('/admin/login')

  useEffect(() => {
    // 로그인 페이지는 체크하지 않음
    if (isLoginPage) {
      setIsChecking(false)
      return
    }

    // 로그인 상태 확인
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('mindgraphy_admin_user')
      
      if (!userStr) {
        // 로그인 안되어 있으면 로그인 페이지로 리다이렉트
        router.push('/admin/login')
      } else {
        try {
          JSON.parse(userStr) // 유효성 검증만 수행
          setIsChecking(false)
        } catch (error) {
          // 잘못된 데이터면 로그인 페이지로
          sessionStorage.removeItem('mindgraphy_admin_user')
          router.push('/admin/login')
        }
      }
    }
  }, [pathname, router, isLoginPage])

  // 로그인 페이지는 그대로 렌더링
  if (isLoginPage) {
    return <>{children}</>
  }

  // 로그인 확인 중이면 로딩 표시
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-zinc-600">로그인 확인 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되어 있으면 렌더링
  return (
    <div className="min-h-screen bg-zinc-50">
      {children}
    </div>
  )
}

