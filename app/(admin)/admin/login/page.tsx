'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Camera, Lock, User, Shield, Users } from 'lucide-react'
import { toast } from 'sonner'
import { findUserByCredentials, getUsersByRole, type MockUser } from '@/lib/mock-users'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // 페이지 마운트 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // 세션 저장 및 리다이렉트 (강화된 디버깅 버전)
  const loginUser = (user: MockUser) => {
    console.log('[Login] loginUser called with:', user.email)
    
    try {
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        permissions: user.permissions,
      }
      
      console.log('[Login] userData prepared:', userData)
      
      // sessionStorage와 localStorage 모두에 저장 (이중 보호)
      sessionStorage.setItem('mindgraphy_admin_user', JSON.stringify(userData))
      localStorage.setItem('mindgraphy_admin_user', JSON.stringify(userData))
      
      console.log('[Login] Storage save attempted')
      
      // 저장 확인
      const savedSession = sessionStorage.getItem('mindgraphy_admin_user')
      const savedLocal = localStorage.getItem('mindgraphy_admin_user')
      
      console.log('[Login] SessionStorage check:', savedSession ? 'EXISTS' : 'NULL')
      console.log('[Login] LocalStorage check:', savedLocal ? 'EXISTS' : 'NULL')
      
      if (!savedSession && !savedLocal) {
        throw new Error('세션 저장 실패')
      }
      
      console.log('[Login] Storage verification passed')
      
      toast.success(`환영합니다, ${user.name}님!`)
      
      console.log('[Login] About to redirect to /admin/projects in 300ms')
      
      // 약간의 지연 후 리다이렉트 (저장 완료 보장)
      setTimeout(() => {
        console.log('[Login] Executing redirect now...')
        console.log('[Login] Current location:', window.location.href)
        window.location.href = '/admin/projects'
        console.log('[Login] window.location.href set to /admin/projects')
      }, 300)
      
    } catch (error) {
      console.error('[Login] Error caught:', error)
      toast.error('로그인 처리 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  // 폼 제출 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }

    setIsLoading(true)

    // 약간의 지연으로 로딩 UI 표시
    setTimeout(() => {
      const user = findUserByCredentials(email, password)

      if (user) {
        loginUser(user)
      } else {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다')
        setIsLoading(false)
      }
    }, 400)
  }

  // 테스트 계정 빠른 로그인
  const handleQuickLogin = (userEmail: string, userPassword: string) => {
    console.log('[QuickLogin] Button clicked:', userEmail)
    setIsLoading(true)
    setEmail(userEmail)
    setPassword(userPassword)
    
    console.log('[QuickLogin] Finding user credentials...')
    const user = findUserByCredentials(userEmail, userPassword)

    if (user) {
      console.log('[QuickLogin] User found:', user.name)
      loginUser(user)
    } else {
      console.log('[QuickLogin] User NOT found')
      toast.error('로그인 정보를 찾을 수 없습니다')
      setIsLoading(false)
    }
  }

  // 관리자 및 직원 목록 가져오기
  const adminUsers = getUsersByRole('admin')
  const staffUsers = getUsersByRole('staff')

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-xl shadow-2xl transition-all duration-700",
        isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <CardHeader className="space-y-4 text-center pb-6">
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

        <CardContent className="pb-8">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                관리자
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                직원
              </TabsTrigger>
            </TabsList>

            {/* 관리자 로그인 탭 */}
            <TabsContent value="admin" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  {/* 이메일 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-sm font-medium">
                      이메일
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@mindgraphy.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* 비밀번호 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-sm font-medium">
                      비밀번호
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-11 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoading ? '로그인 중...' : '관리자 로그인'}
                </Button>
              </form>

              {/* 관리자 빠른 로그인 */}
              <div className="pt-4 border-t border-zinc-200">
                <p className="text-xs text-center text-zinc-500 mb-3 font-medium">
                  💡 테스트 계정 (클릭하여 로그인)
                </p>
                <div className="space-y-2">
                  {adminUsers.map((user) => (
                    <QuickLoginButton
                      key={user.id}
                      onClick={() => handleQuickLogin(user.email, user.password)}
                      disabled={isLoading}
                      label={user.name}
                      email={user.email}
                      role="관리자"
                      icon={<Shield className="h-4 w-4" />}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* 직원 로그인 탭 */}
            <TabsContent value="staff" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-4">
                  {/* 이메일 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="staff-email" className="text-sm font-medium">
                      이메일
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="staff-email"
                        type="email"
                        placeholder="photographer1@mindgraphy.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* 비밀번호 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="staff-password" className="text-sm font-medium">
                      비밀번호
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="staff-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-11 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoading ? '로그인 중...' : '직원 로그인'}
                </Button>
              </form>

              {/* 직원 빠른 로그인 */}
              <div className="pt-4 border-t border-zinc-200">
                <p className="text-xs text-center text-zinc-500 mb-3 font-medium">
                  💡 테스트 계정 (클릭하여 로그인)
                </p>
                <div className="space-y-2">
                  {staffUsers.map((user) => (
                    <QuickLoginButton
                      key={user.id}
                      onClick={() => handleQuickLogin(user.email, user.password)}
                      disabled={isLoading}
                      label={user.name}
                      email={user.email}
                      role={user.jobTitle === 'photographer' ? '작가' : user.jobTitle === 'editor' ? '에디터' : '직원'}
                      icon={<User className="h-4 w-4" />}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* 고객용 페이지 링크 */}
          <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-xs text-zinc-500 hover:text-zinc-700"
              disabled={isLoading}
            >
              고객용 페이지로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 빠른 로그인 버튼 컴포넌트
interface QuickLoginButtonProps {
  onClick: () => void
  disabled: boolean
  label: string
  email: string
  role: string
  icon: React.ReactNode
}

function QuickLoginButton({ onClick, disabled, label, email, role, icon }: QuickLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left",
        "bg-zinc-50 hover:bg-zinc-100",
        "border-2 border-zinc-200 hover:border-zinc-900",
        "rounded-lg p-3.5 transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        "group"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white flex-shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-zinc-900">{label}</p>
            <span className="text-xs px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded-full font-medium">
              {role}
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-600 truncate">{email}</p>
        </div>
        <span className="text-xs font-medium text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </div>
    </button>
  )
}
