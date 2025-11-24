'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowRight, Calendar } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'mindgraphy-last-portal'

type Portal = 'client' | 'admin' | null

export default function HomePage() {
  const handlePortalClick = (portal: Portal) => {
    if (portal) {
      localStorage.setItem(STORAGE_KEY, portal)
    }
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
          <Link 
            href="/admin/login"
            onClick={() => handlePortalClick('admin')}
            data-branch="admin"
            data-portal="back-office"
            className="block group"
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
          </Link>
        </div>
      </div>
    </div>
  )
}
