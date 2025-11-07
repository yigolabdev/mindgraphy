'use client'

import { use } from 'react'
import { redirect } from 'next/navigation'
import { ClientPortalLayout } from '@/components/layout/client-portal-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/client/progress-steps'
import { DdayBadge } from '@/components/common/dday-badge'
import { getClientDataByToken, isDeadlineNear, isDeadlineOverdue, getDaysUntilDeadline } from '@/lib/mock/client'
import { 
  Heart,
  Calendar,
  MapPin,
  User,
  Package,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ClientPortalHomeProps {
  params: Promise<{ token: string }>
}

export default function ClientPortalHome({ params }: ClientPortalHomeProps) {
  const { token } = use(params)
  
  // Get client data
  const clientData = getClientDataByToken(token)
  
  // Handle invalid token
  if (!clientData || !clientData.isValid || clientData.isExpired) {
    redirect(`/c/${token}/invalid`)
  }

  // Check for urgent deadlines
  const urgentDeadlines = Object.entries(clientData.steps)
    .filter(([_, step]) => 'deadline' in step && step.deadline)
    .map(([key, step]) => {
      const deadline = (step as any).deadline as string
      return {
        step: key,
        deadline,
        days: getDaysUntilDeadline(deadline),
        isNear: isDeadlineNear(deadline),
        isOverdue: isDeadlineOverdue(deadline)
      }
    })
    .filter(d => d.isNear || d.isOverdue)

  return (
    <ClientPortalLayout token={token}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-red-300 fill-red-300" />
              <span className="text-sm font-medium text-indigo-100">환영합니다!</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {clientData.groomName} & {clientData.brideName}
            </h1>
            <p className="text-indigo-100 mb-6 text-lg">
              행복한 순간을 함께하게 되어 영광입니다
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <DdayBadge 
                targetDate={clientData.weddingDate}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-lg px-4 py-2"
                showIcon={false}
              />
              <div className="flex items-center gap-2 text-indigo-100">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(clientData.weddingDate), 'yyyy년 M월 d일 (EEE)', { locale: ko })}</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-100">
                <MapPin className="h-4 w-4" />
                <span>{clientData.venueName}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 h-64 w-64 rounded-full bg-white/10" />
        </div>

        {/* Urgent Alerts */}
        {urgentDeadlines.length > 0 && (
          <div className="space-y-3">
            {urgentDeadlines.map((deadline) => (
              <div
                key={deadline.step}
                className={cn(
                  "flex items-start gap-3 rounded-lg border-2 p-4",
                  deadline.isOverdue 
                    ? "border-red-500 bg-red-50" 
                    : "border-orange-500 bg-orange-50"
                )}
              >
                <AlertCircle className={cn(
                  "h-5 w-5 mt-0.5 flex-shrink-0",
                  deadline.isOverdue ? "text-red-600" : "text-orange-600"
                )} />
                <div className="flex-1">
                  <h3 className={cn(
                    "font-semibold mb-1",
                    deadline.isOverdue ? "text-red-900" : "text-orange-900"
                  )}>
                    {deadline.isOverdue ? '마감 기한이 지났습니다!' : '마감이 임박했습니다!'}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    deadline.isOverdue ? "text-red-700" : "text-orange-700"
                  )}>
                    {deadline.isOverdue 
                      ? `${Math.abs(deadline.days)}일 초과: 빠른 시일 내에 완료해주세요.`
                      : deadline.days === 0
                      ? '오늘이 마감일입니다. 지금 바로 완료해주세요!'
                      : `D-${deadline.days}: 서둘러 완료해주세요.`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              진행 단계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressSteps data={clientData} />
          </CardContent>
        </Card>

        {/* Contract Summary */}
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Wedding Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  예식 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">신랑 & 신부</p>
                      <p className="font-medium">{clientData.groomName} & {clientData.brideName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">예식 날짜</p>
                      <p className="font-medium">
                        {format(new Date(clientData.weddingDate), 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">예식장</p>
                      <p className="font-medium">{clientData.venueName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">패키지</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{clientData.packageName}</p>
                        <Badge variant="secondary" className="text-xs">
                          {clientData.packageType === 'premium' && '프리미엄'}
                          {clientData.packageType === 'standard' && '스탠다드'}
                          {clientData.packageType === 'basic' && '베이직'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photographer Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  담당 작가
                </h3>
                <div className="rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{clientData.photographerName}</p>
                      <p className="text-sm text-muted-foreground">웨딩 포토그래퍼</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <a
                      href={`tel:${clientData.photographerPhone}`}
                      className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{clientData.photographerPhone}</span>
                    </a>
                    <a
                      href={`mailto:${clientData.photographerEmail}`}
                      className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{clientData.photographerEmail}</span>
                    </a>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      메시지 보내기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proof Selection Status (if applicable) */}
        {clientData.steps.proof.totalPhotos && (
          <Card>
            <CardHeader>
              <CardTitle>프루프 선택 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    선택한 사진
                  </span>
                  <span className="text-lg font-bold">
                    {clientData.steps.proof.selectedPhotos} / {clientData.steps.proof.maxSelections}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{
                      width: `${((clientData.steps.proof.selectedPhotos || 0) / (clientData.steps.proof.maxSelections || 1)) * 100}%`
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  총 {clientData.steps.proof.totalPhotos}장 중 {clientData.steps.proof.maxSelections}장까지 선택 가능합니다
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientPortalLayout>
  )
}
