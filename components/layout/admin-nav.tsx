'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getNavigationForRole } from '@/lib/config/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/lib/constants'
import { LogOut, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User as UserType } from '@/lib/types/auth'

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)

  // sessionStorage/localStorage에서 사용자 정보 가져오기
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadUser = () => {
      // sessionStorage 먼저 확인
      let userStr = sessionStorage.getItem('mindgraphy_admin_user')
      
      // 없으면 localStorage에서 복구
      if (!userStr) {
        userStr = localStorage.getItem('mindgraphy_admin_user')
        if (userStr) {
          sessionStorage.setItem('mindgraphy_admin_user', userStr)
        }
      }

      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          setUser(userData)
        } catch (error) {
          console.error('[AdminNav] Failed to parse user data:', error)
        }
      }
    }

    loadUser()
  }, [])

  // 로딩 중이거나 사용자가 없으면 렌더링하지 않음
  // (PageAccessGuard가 이미 인증을 처리하므로 여기서는 리다이렉트 안 함)
  if (!user) {
    return null
  }

  // 사용자 권한에 따른 네비게이션 아이템
  const navigation = getNavigationForRole(user.role, user.permissions)

  const handleLogout = () => {
    // sessionStorage와 localStorage 모두 클리어
    sessionStorage.removeItem('mindgraphy_admin_user')
    localStorage.removeItem('mindgraphy_admin_user')
    
    // 로그인 페이지로 이동
    window.location.href = '/admin/login'
  }

  // 사용자 이름의 첫 글자
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  // 역할 배지
  const getRoleBadge = () => {
    if (user.role === 'admin') {
      return (
        <Badge variant="default" className="bg-blue-600">
          관리자
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-green-600 text-white">
        작가
      </Badge>
    )
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-zinc-50 to-white shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 bg-white/80 backdrop-blur-sm">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-sm transition-transform group-hover:scale-105">
            M
          </div>
          <span className="text-lg font-semibold">MindGraphy</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          // Check if the current path matches this navigation item
          const isActive = pathname === item.href || 
            (pathname.startsWith(item.href) && item.href !== ROUTES.HOME)
          
          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-zinc-900 text-white shadow-md scale-[1.02]'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 hover:scale-[1.01]',
                'focus-ring'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4 space-y-3 bg-white/50 backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-zinc-100 rounded-lg p-2 transition-all duration-200 hover:shadow-sm focus-ring">
              <Avatar className="ring-2 ring-white">
                <AvatarFallback className="bg-zinc-900 text-white text-sm font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {user.name}
                  </p>
                  {getRoleBadge()}
                </div>
                <p className="text-xs text-zinc-500 truncate">
                  {user.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="focus-ring cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>프로필</span>
            </DropdownMenuItem>
            {user.role === 'admin' && (
              <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="focus-ring cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus-ring cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

