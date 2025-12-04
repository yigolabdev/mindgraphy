'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowRight, Calendar } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'mindgraphy-last-portal'

type Portal = 'client' | 'admin' | null

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 유입 경로 자동 추적 (향후 백엔드 연동 대비)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // UTM 파라미터 확인
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    const source = searchParams.get('source')
    
    // 유입 경로 결정
    let sourceChannel = ''
    
    if (utmSource) {
      // UTM 파라미터가 있는 경우
      sourceChannel = utmSource
      if (utmMedium) sourceChannel += ` (${utmMedium})`
      if (utmCampaign) sourceChannel += ` - ${utmCampaign}`
    } else if (source) {
      // 간단한 source 파라미터
      sourceChannel = source
    } else if (document.referrer) {
      // Referrer 확인
      try {
        const referrerUrl = new URL(document.referrer)
        const referrerDomain = referrerUrl.hostname
        
        // 주요 플랫폼 매핑
        if (referrerDomain.includes('instagram.com')) {
          sourceChannel = 'Instagram'
        } else if (referrerDomain.includes('facebook.com')) {
          sourceChannel = 'Facebook'
        } else if (referrerDomain.includes('naver.com')) {
          sourceChannel = 'Naver'
        } else if (referrerDomain.includes('google.com')) {
          sourceChannel = 'Google'
        } else if (referrerDomain.includes('kakao.com')) {
          sourceChannel = 'Kakao'
        } else {
          sourceChannel = referrerDomain
        }
      } catch (e) {
        sourceChannel = '직접 방문'
      }
    } else {
      sourceChannel = '직접 방문'
    }
    
    // sessionStorage에 저장 (향후 고객 등록 시 사용)
    sessionStorage.setItem('mindgraphy_source_channel', sourceChannel)
    console.log('[HomePage] 유입 경로 추적:', sourceChannel)
  }, [searchParams])
  
  const handlePortalClick = (portal: Portal) => {
    if (portal) {
      localStorage.setItem(STORAGE_KEY, portal)
    }
  }
  
  const handleAdminPortalClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handlePortalClick('admin')
    
    // 세션 체크 후 적절한 페이지로 직접 이동
    if (typeof window !== 'undefined') {
      const adminUser = sessionStorage.getItem('mindgraphy_admin_user')
      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser)
          if (userData && userData.role) {
            // 이미 로그인되어 있으면 바로 프로젝트 페이지로
            router.push('/admin/projects')
            return
          }
        } catch (error) {
          // 파싱 오류 시 세션 제거
          sessionStorage.removeItem('mindgraphy_admin_user')
        }
      }
    }
    
    // 세션이 없으면 로그인 페이지로
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo & Brand */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg">
              <span className="text-2xl font-bold">M</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">MindGraphy</h1>
          </div>
        </div>

        {/* Portal Selection Cards */}
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          {/* Client Portal Card */}
          <Link 
            href="/c/product-type"
            onClick={() => handlePortalClick('client')}
            data-branch="client"
            data-portal="client-portal"
            className="block group"
          >
            <Card className="h-full border-2 transition-all hover:border-zinc-900 hover:shadow-xl relative overflow-hidden cursor-pointer">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-zinc-100 opacity-50 transition-transform group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 transition-all group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl mb-2">고객용 페이지</CardTitle>
                <CardDescription className="text-base">
                  Client Portal
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="pt-2">
                  <div className={cn(
                    "inline-flex items-center gap-2 font-semibold transition-all",
                    "group-hover:gap-3"
                  )}>
                    고객용 페이지 입장하기
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Portal Card */}
          <div 
            onClick={handleAdminPortalClick}
            data-branch="admin"
            data-portal="back-office"
            className="block group cursor-pointer"
          >
            <Card className="h-full border-2 transition-all hover:border-zinc-900 hover:shadow-xl relative overflow-hidden cursor-pointer">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-zinc-100 opacity-50 transition-transform group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 transition-all group-hover:bg-zinc-900 group-hover:text-white group-hover:scale-110">
                  <Calendar className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl mb-2">내부 업무 시스템</CardTitle>
                <CardDescription className="text-base">
                  Back Office
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="pt-2">
                  <div className={cn(
                    "inline-flex items-center gap-2 font-semibold transition-all",
                    "group-hover:gap-3"
                  )}>
                    내부 시스템 입장하기
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
