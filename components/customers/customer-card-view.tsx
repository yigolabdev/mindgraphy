'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  PhoneCall, 
  Calendar, 
  Package, 
  CreditCard,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import type { Customer, Project, Product } from '@/lib/types'

interface CustomerWithStats extends Customer {
  totalProjects: number
  completedProjects: number
  activeProjects: number
  totalRevenue: number
  latestProject: Project | undefined
  currentStage: {
    label: string
    color: string
  }
  paymentStatus: {
    paid: number
    total: number
    percent: number
    methods: string[]
  }
  scheduleUnconfirmed: boolean
}

interface CustomerCardViewProps {
  customers: CustomerWithStats[]
  products: Product[]
  onCustomerClick: (customer: CustomerWithStats) => void
  onPaymentClick: (customer: CustomerWithStats, e: React.MouseEvent) => void
}

export function CustomerCardView({
  customers,
  products,
  onCustomerClick,
  onPaymentClick
}: CustomerCardViewProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>등록된 고객이 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {customers.map((customer, idx) => (
        <Card
          key={customer.id}
          onClick={() => onCustomerClick(customer)}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom",
            customer.scheduleUnconfirmed 
              ? "border-l-4 border-l-red-500 bg-red-50/50" 
              : "hover:border-zinc-300"
          )}
          style={{ animationDelay: `${idx * 30}ms` }}
        >
          <CardContent className="p-4 space-y-3">
            {/* Header: 이름 + 경고 */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {customer.scheduleUnconfirmed && (
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                  <h3 className="font-semibold text-base">
                    {customer.groomName} & {customer.brideName}
                  </h3>
                </div>
                
                {/* 유입 경로 배지 */}
                <div className="flex items-center gap-1 mt-1">
                  {customer.sourceType === 'client-direct' && (
                    <Badge variant="outline" className="text-xs bg-zinc-50 text-zinc-700 border-zinc-300">
                      고객문의
                    </Badge>
                  )}
                  {customer.sourceType === 'venue-referral' && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                      제휴
                    </Badge>
                  )}
                  {customer.sourceType === 'manual-registration' && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                      수동등록
                    </Badge>
                  )}
                </div>
              </div>

              {/* 현재 단계 */}
              <Badge variant="outline" className={cn("ml-2 flex-shrink-0", customer.currentStage.color)}>
                {customer.currentStage.label}
              </Badge>
            </div>

            {/* 연락처 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PhoneCall className="h-3.5 w-3.5" />
              <span className="font-medium text-zinc-700">{customer.groomPhone}</span>
            </div>

            {/* 촬영 정보 */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">촬영일</div>
                {customer.latestProject?.weddingDate ? (
                  <div className="font-medium text-blue-700">
                    {formatDate(customer.latestProject.weddingDate)}
                  </div>
                ) : (
                  <div className="text-muted-foreground">-</div>
                )}
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">상품</div>
                {customer.latestProject?.projectType ? (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    customer.latestProject.projectType === 'hanbok' ? 'bg-purple-50 text-purple-700' :
                    customer.latestProject.projectType === 'dress_shop' ? 'bg-pink-50 text-pink-700' :
                    customer.latestProject.projectType === 'baby' ? 'bg-blue-50 text-blue-700' :
                    'bg-zinc-50 text-zinc-700'
                  )}>
                    {customer.latestProject.projectType === 'wedding' ? '웨딩' :
                     customer.latestProject.projectType === 'hanbok' ? '한복' :
                     customer.latestProject.projectType === 'dress_shop' ? '가봉' :
                     customer.latestProject.projectType === 'baby' ? '돌스냅' : '-'}
                  </Badge>
                ) : (
                  <div className="text-muted-foreground">-</div>
                )}
              </div>
            </div>

            {/* 패키지 */}
            {customer.latestProject?.packageId && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">패키지</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  {products.find(p => p.id === customer.latestProject?.packageId)?.name || customer.latestProject.packageId}
                </div>
              </div>
            )}

            {/* 입금 상태 */}
            <div className="pt-3 border-t">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => onPaymentClick(customer, e)}
                className={cn(
                  "w-full justify-start h-auto py-2",
                  customer.paymentStatus.percent === 100 ? "hover:bg-green-50" :
                  customer.paymentStatus.percent > 0 ? "hover:bg-orange-50" : "hover:bg-red-50"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CreditCard className={cn(
                      "h-4 w-4",
                      customer.paymentStatus.percent === 100 ? "text-green-600" :
                      customer.paymentStatus.percent > 0 ? "text-orange-600" : "text-red-600"
                    )} />
                    <div className="text-left">
                      <div className={cn(
                        "text-sm font-semibold",
                        customer.paymentStatus.percent === 100 ? "text-green-700" :
                        customer.paymentStatus.percent > 0 ? "text-orange-700" : "text-red-700"
                      )}>
                        입금 {customer.paymentStatus.percent}%
                      </div>
                      {customer.paymentStatus.total > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {customer.paymentStatus.paid.toLocaleString()}만 / {customer.paymentStatus.total.toLocaleString()}만원
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 결제 방식 */}
                  {customer.paymentStatus.methods && customer.paymentStatus.methods.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {customer.paymentStatus.methods.map((method, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs px-1.5 py-0 h-5"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Button>
            </div>

            {/* 일정 확정 상태 */}
            <div className="pt-2 flex items-center justify-center">
              {customer.scheduleUnconfirmed ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-300 rounded-lg">
                  <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                  <span className="text-xs font-semibold text-red-700">일정 미확정 - 승인 필요</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-300 rounded-lg">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">일정 확정</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
