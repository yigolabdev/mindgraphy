'use client'

import { use } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, Mail, Phone } from 'lucide-react'

interface InvalidTokenPageProps {
  params: Promise<{ token: string }>
}

export default function InvalidTokenPage({ params }: InvalidTokenPageProps) {
  const { token } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              유효하지 않은 접근 링크
            </h1>
            <p className="text-sm text-muted-foreground">
              접근하신 링크가 유효하지 않거나 만료되었습니다.
            </p>
          </div>

          {/* Token Info */}
          <div className="bg-gray-100 rounded-lg p-3 text-left">
            <p className="text-xs text-muted-foreground mb-1">접근 토큰</p>
            <p className="text-sm font-mono break-all text-gray-600">
              {token}
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="text-left space-y-2 pt-2">
            <p className="text-sm font-semibold text-gray-900">
              다음과 같은 이유일 수 있습니다:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>링크 주소가 잘못 입력되었습니다</li>
              <li>링크의 유효 기간이 만료되었습니다</li>
              <li>프로젝트가 종료되어 접근이 제한되었습니다</li>
              <li>일시적인 시스템 오류가 발생했습니다</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <div className="flex flex-col gap-2">
              <Link href="/" className="w-full">
                <Button variant="default" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  홈으로 돌아가기
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                이메일로 문의하기
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-6 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              문제가 지속되면 담당자에게 연락해주세요
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a
                href="tel:02-1234-5678"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span>02-1234-5678</span>
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="mailto:support@mindgraphy.com"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span>support@mindgraphy.com</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

