'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Camera, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

// Mock 작가 계정 데이터
const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@mindgraphy.com',
    password: 'admin1234',
    role: 'admin',
    name: '관리자',
    permissions: undefined,
  },
  {
    id: 'photo-1',
    email: 'photographer1@mindgraphy.com',
    password: 'photo1234',
    role: 'photographer',
    name: '박작가',
    permissions: ['live-status', 'calendar', 'my-schedule', 'projects', 'board', 'gallery-upload', 'timetable'],
  },
  {
    id: 'user-3',
    email: 'editor@mindgraphy.com',
    password: 'edit1234',
    role: 'editor',
    name: '이에디터',
    permissions: undefined,
  },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 마운트 애니메이션 활성화
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)
    
    // 이미 로그인되어 있으면 프로젝트 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      const adminUser = sessionStorage.getItem('mindgraphy_admin_user')
      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser)
          // 유효한 세션인지 확인 (role이 있어야 함)
          if (userData && userData.role) {
            console.log('[AdminLogin] Valid session found, redirecting to projects')
            router.push('/admin/projects')
          } else {
            // 잘못된 세션 데이터는 제거
            console.log('[AdminLogin] Invalid session data, clearing')
            sessionStorage.removeItem('mindgraphy_admin_user')
          }
        } catch (error) {
          // 파싱 오류 시 세션 제거
          console.error('[AdminLogin] Failed to parse session:', error)
          sessionStorage.removeItem('mindgraphy_admin_user')
        }
      }
    }

    return () => clearTimeout(timer)
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }

    setIsLoading(true)

    // TODO: 실제 API 호출로 대체
    // POST /api/admin/login
    // Body: { email, password }
    
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      )

      if (user) {
        // 로그인 성공
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('mindgraphy_admin_user', JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            permissions: user.permissions,
          }))
        }
        
        toast.success(`환영합니다, ${user.name}님!`)
        
        setTimeout(() => {
          router.push('/admin/projects')
        }, 500)
      } else {
        // 로그인 실패
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다')
        setIsLoading(false)
      }
    }, 1000)
  }

  // 테스트 계정으로 자동 로그인
  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
    
    // 짧은 지연 후 자동 로그인
    setTimeout(() => {
      setIsLoading(true)
      
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === userEmail && u.password === userPassword
        )

        if (user) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('mindgraphy_admin_user', JSON.stringify({
              id: user.id,
              email: user.email,
              role: user.role,
              name: user.name,
              permissions: user.permissions,
            }))
          }
          
          toast.success(`환영합니다, ${user.name}님!`)
          
          setTimeout(() => {
            router.push('/admin/projects')
          }, 500)
        }
      }, 800)
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-md shadow-2xl transition-all duration-700",
        isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardTitle className="text-2xl font-semibold">
              마인드그라피
            </CardTitle>
            <CardDescription className="text-base">
              내부 업무 시스템
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  이메일
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                         <Input
                          id="email"
                          type="email"
                          placeholder="photographer1@mindgraphy.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11"
                          autoComplete="email"
                          autoFocus
                        />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-11 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* Demo Accounts - Quick Login */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <p className="text-xs text-center text-zinc-500 mb-3 font-medium">
              💡 개발 환경 테스트 계정 (클릭하여 로그인)
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLogin('admin@mindgraphy.com', 'admin1234')}
                disabled={isLoading}
                className={cn(
                  "w-full text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
                  "border-2 border-blue-200 hover:border-blue-400 rounded-lg p-3 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "active:scale-[0.98]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-900">관리자</p>
                    <p className="text-xs text-blue-700 font-mono mt-0.5">admin@mindgraphy.com</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">클릭하여 로그인 →</span>
                </div>
              </button>

                    <button
                      onClick={() => handleQuickLogin('photographer1@mindgraphy.com', 'photo1234')}
                      disabled={isLoading}
                      className={cn(
                        "w-full text-left bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100",
                        "border-2 border-green-200 hover:border-green-400 rounded-lg p-3 transition-all",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-green-900">작가 (박작가)</p>
                          <p className="text-xs text-green-700 font-mono mt-0.5">photographer1@mindgraphy.com</p>
                        </div>
                        <span className="text-xs text-green-600 font-medium">클릭하여 로그인 →</span>
                      </div>
                    </button>

              <button
                onClick={() => handleQuickLogin('editor@mindgraphy.com', 'edit1234')}
                disabled={isLoading}
                className={cn(
                  "w-full text-left bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100",
                  "border-2 border-purple-200 hover:border-purple-400 rounded-lg p-3 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "active:scale-[0.98]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-900">에디터</p>
                    <p className="text-xs text-purple-700 font-mono mt-0.5">editor@mindgraphy.com</p>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">클릭하여 로그인 →</span>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-xs text-zinc-500 hover:text-zinc-700"
            >
              고객용 페이지로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

