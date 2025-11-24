'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // /login/ 접속 시 /admin/login/으로 리다이렉트
    router.replace('/admin/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4"></div>
        <p className="text-sm text-zinc-600">로그인 페이지로 이동 중...</p>
      </div>
    </div>
  )
}
