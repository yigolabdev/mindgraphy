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

export function PageAccessGuard({ children }: PageAccessGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // 로그인 페이지는 권한 체크 제외
    if (pathname.includes('/login')) {
      setHasAccess(true)
      setIsChecking(false)
      return
    }

    // 세션에서 사용자 정보 가져오기
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('mindgraphy_admin_user')
      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
          
          console.log('[PageAccessGuard] User data:', userData)
          console.log('[PageAccessGuard] Pathname:', pathname)
          console.log('[PageAccessGuard] User role:', userData.role)
          
          // 관리자는 모든 페이지 접근 가능
          if (userData.role === 'admin') {
            console.log('[PageAccessGuard] Admin detected - granting access')
            setHasAccess(true)
          } else {
            // 작가 등 다른 역할은 권한 체크
            const access = hasPageAccess(
              pathname,
              userData.role,
              userData.permissions
            )
            console.log('[PageAccessGuard] Non-admin access check:', access)
            setHasAccess(access)
          }
          setIsChecking(false)
        } catch (error) {
          console.error('Failed to parse user data:', error)
          setHasAccess(false)
          setIsChecking(false)
        }
      } else {
        // 로그인하지 않은 경우 - 리다이렉트
        console.log('[PageAccessGuard] No user session - redirecting to login')
        console.log('[PageAccessGuard] Current path:', pathname)
        
        // 로그인 페이지가 아닌 경우에만 리다이렉트 (무한 루프 방지)
        if (!pathname.includes('/login')) {
          setIsRedirecting(true)
          router.push('/admin/login')
        } else {
          // 이미 로그인 페이지에 있는데 세션이 없는 경우 - 정상 상태
          setHasAccess(true)
          setIsChecking(false)
        }
      }
    }
  }, [pathname, router])

  // 리다이렉트 중이거나 권한 체크 중
  if (isChecking || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4"></div>
          <p className="text-sm text-zinc-600">
            {isRedirecting ? '로그인 페이지로 이동 중...' : '페이지 로딩 중...'}
          </p>
        </div>
      </div>
    )
  }

  // 접근 권한 없음
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <ShieldAlert className="h-12 w-12 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">
                접근 권한 없음
              </h2>
              <p className="text-sm text-zinc-600">
                이 페이지에 접근할 권한이 없습니다.
              </p>
              <p className="text-xs text-zinc-500">
                {user?.role === 'photographer' 
                  ? '관리자에게 페이지 접근 권한을 요청하세요.'
                  : '관리자에게 문의하세요.'}
              </p>
              <div className="mt-2 p-2 bg-zinc-100 rounded text-xs font-mono text-left">
                <p><strong>현재 URL:</strong> {pathname}</p>
                <p className="mt-1"><strong>브라우저 콘솔을 확인하세요</strong></p>
              </div>
            </div>

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
                onClick={() => router.push(user ? '/admin/projects' : '/admin/login')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                {user ? '홈으로' : '로그인'}
              </Button>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong>현재 역할:</strong> {user?.role || '없음'}
              </p>
              {user?.role === 'photographer' && (
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
                onClick={() => {
                  sessionStorage.clear()
                  router.push('/admin/login')
                }}
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

  // 접근 권한 있음 - 자식 컴포넌트 렌더링
  return <>{children}</>
}

