'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { hasPageAccess } from '@/lib/config/navigation'
import type { User } from '@/lib/types/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'

interface PageAccessGuardProps {
  children: React.ReactNode
}

/**
 * 페이지 접근 권한을 검증하는 가드 컴포넌트
 */
export function PageAccessGuard({ children }: PageAccessGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log('[PageAccessGuard] useEffect triggered for pathname:', pathname)
    
    // 로그인 페이지는 항상 허용 (Guard 완전 우회)
    if (pathname.includes('/login')) {
      console.log('[PageAccessGuard] Login page detected, BYPASSING all checks')
      setIsChecking(false)
      setUser(null) // 명시적으로 user를 null로 설정
      return
    }
    
    console.log('[PageAccessGuard] Not a login page, proceeding with session check')

    // 세션 체크 (sessionStorage와 localStorage 모두 확인)
    const checkSession = () => {
      if (typeof window === 'undefined') {
        console.log('[PageAccessGuard] Window undefined, skipping check')
        return
      }

      try {
        // sessionStorage 먼저 확인, 없으면 localStorage에서 복구
        let userStr = sessionStorage.getItem('mindgraphy_admin_user')
        
        if (!userStr) {
          console.log('[PageAccessGuard] No sessionStorage, checking localStorage')
          userStr = localStorage.getItem('mindgraphy_admin_user')
          
          // localStorage에서 복구
          if (userStr) {
            console.log('[PageAccessGuard] Restored from localStorage')
            sessionStorage.setItem('mindgraphy_admin_user', userStr)
          }
        }
        
        console.log('[PageAccessGuard] Session string:', userStr ? 'exists' : 'null')
        
        if (!userStr) {
          console.log('[PageAccessGuard] No session found, redirecting to login')
          router.replace('/admin/login')
          return
        }

        const userData = JSON.parse(userStr)
        console.log('[PageAccessGuard] Session valid, user role:', userData.role)
        setUser(userData)
        setIsChecking(false)
        
      } catch (error) {
        console.error('[PageAccessGuard] Session parse error:', error)
        sessionStorage.removeItem('mindgraphy_admin_user')
        localStorage.removeItem('mindgraphy_admin_user')
        router.replace('/admin/login')
      }
    }

    checkSession()
  }, [pathname, router])

  // 로딩 중
  if (isChecking) {
    return <LoadingScreen />
  }

  // 로그인 페이지 또는 세션 없음 (리다이렉트 중)
  if (pathname.includes('/login') || !user) {
    return <>{children}</>
  }

  // 권한 체크 (완화됨 - 기본적으로 접근 허용)
  const userHasAccess = hasPageAccess(pathname, user.role, user.permissions)

  console.log('[PageAccessGuard] Access check result:', {
    pathname,
    role: user.role,
    hasAccess: userHasAccess
  })

  // 권한 없음 (매우 제한적인 경우만)
  if (!userHasAccess) {
    return <AccessDeniedScreen user={user} pathname={pathname} router={router} />
  }

  // 접근 권한 있음 (기본값)
  return <>{children}</>
}

/**
 * 로딩 화면 컴포넌트
 */
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4"></div>
        <p className="text-sm text-zinc-600">페이지 로딩 중...</p>
      </div>
    </div>
  )
}

/**
 * 접근 거부 화면 컴포넌트
 */
interface AccessDeniedScreenProps {
  user: User
  pathname: string
  router: ReturnType<typeof useRouter>
}

function AccessDeniedScreen({ user, pathname, router }: AccessDeniedScreenProps) {
  const handleClearSession = () => {
    sessionStorage.removeItem('mindgraphy_admin_user')
    localStorage.removeItem('mindgraphy_admin_user')
    window.location.href = '/admin/login'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-6">
          {/* 아이콘 */}
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          {/* 메시지 */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">
              접근 권한 없음
            </h2>
            <p className="text-sm text-zinc-600">
              이 페이지에 접근할 권한이 없습니다.
            </p>
            <p className="text-xs text-zinc-500">
              {user.role === 'staff' 
                ? '관리자에게 페이지 접근 권한을 요청하세요.'
                : '관리자에게 문의하세요.'}
            </p>
            <div className="mt-2 p-2 bg-zinc-100 rounded text-xs font-mono text-left">
              <p><strong>현재 URL:</strong> {pathname}</p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              이전 페이지
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/projects'}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Button>
          </div>

          {/* 디버그 정보 */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>현재 역할:</strong> {user.role} {user.jobTitle && `(${user.jobTitle})`}
            </p>
            {user.role === 'staff' && (
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong>현재 권한:</strong>{' '}
                {user.permissions && user.permissions.length > 0
                  ? user.permissions.join(', ')
                  : '권한 없음'}
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSession}
              className="w-full text-xs"
            >
              세션 초기화 후 다시 로그인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
