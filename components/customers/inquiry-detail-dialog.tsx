'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomerStatusSelect } from './customer-status-select'
import { User, Phone, Mail, Calendar, Clock, MapPin, Package, Tag, FileText, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Customer, Project } from '@/lib/types'
import { mockProducts } from '@/lib/mock/settings'
import { format } from 'date-fns'

interface InquiryDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  project?: Project
  onStatusChange?: () => void
}

export function InquiryDetailDialog({ 
  open, 
  onOpenChange, 
  customer, 
  project,
  onStatusChange
}: InquiryDetailDialogProps) {
  const [currentStatus, setCurrentStatus] = useState(customer?.leadStatus || 'inquiry')
  
  // customer가 null이면 다이얼로그를 열지 않음
  if (!customer) {
    return null
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'yyyy년 MM월 dd일 (E)', { locale: require('date-fns/locale/ko') })
    } catch (e) {
      return dateString
    }
  }
  
  const getProductName = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    return product ? product.name : productId
  }
  
  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'wedding': '웨딩',
      'hanbok': '한복 & 캐주얼',
      'dress_shop': '가봉 스냅',
      'baby': '돌스냅',
    }
    return labels[type] || type
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-zinc-900 mb-2">
                {customer.groomName} & {customer.brideName}
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-zinc-900 text-zinc-900">
                  신규 문의
                </Badge>
                {project && (
                  <Badge variant="outline">
                    {getProjectTypeLabel(project.projectType)}
                  </Badge>
                )}
              </div>
            </div>
            <Heart className="h-8 w-8 text-zinc-400" />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* 고객 상태 관리 */}
          <CustomerStatusSelect
            customerId={customer.id}
            currentStatus={currentStatus}
            onStatusChange={(newStatus) => {
              setCurrentStatus(newStatus)
              onStatusChange?.()
            }}
          />
          
          <Separator />
          
          {/* 고객 정보 */}
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              고객 정보
            </h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <User className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">신랑</div>
                    <div className="font-semibold text-zinc-900">{customer.groomName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <User className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">신부</div>
                    <div className="font-semibold text-zinc-900">{customer.brideName}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customer.groomPhone && (
                  <a 
                    href={`tel:${customer.groomPhone}`}
                    className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-900 transition-all group"
                  >
                    <Phone className="h-5 w-5 mt-0.5 text-zinc-600 group-hover:text-zinc-900" />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-600 mb-1">신랑 연락처</div>
                      <div className="font-semibold text-zinc-900 group-hover:underline">
                        {customer.groomPhone}
                      </div>
                    </div>
                  </a>
                )}

                {customer.bridePhone && (
                  <a 
                    href={`tel:${customer.bridePhone}`}
                    className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-900 transition-all group"
                  >
                    <Phone className="h-5 w-5 mt-0.5 text-zinc-600 group-hover:text-zinc-900" />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-600 mb-1">신부 연락처</div>
                      <div className="font-semibold text-zinc-900 group-hover:underline">
                        {customer.bridePhone}
                      </div>
                    </div>
                  </a>
                )}
              </div>

              {customer.email && (
                <a 
                  href={`mailto:${customer.email}`}
                  className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-900 transition-all group"
                >
                  <Mail className="h-5 w-5 mt-0.5 text-zinc-600 group-hover:text-zinc-900" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">이메일</div>
                    <div className="font-semibold text-zinc-900 group-hover:underline break-all">
                      {customer.email}
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
          
          {project && (
            <>
              <Separator />
              
              {/* 촬영 정보 */}
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  촬영 정보
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                    <Tag className="h-5 w-5 mt-0.5 text-zinc-600" />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-600 mb-1">상품 타입</div>
                      <div className="font-semibold text-zinc-900">
                        {getProjectTypeLabel(project.projectType)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <Calendar className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">촬영 날짜</div>
                        <div className="font-semibold text-zinc-900">
                          {formatDate(project.weddingDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <Clock className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">촬영 시간</div>
                        <div className="font-semibold text-zinc-900">
                          {project.weddingTime || '미정'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {project.weddingVenue && (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <MapPin className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">촬영 장소</div>
                        <div className="font-semibold text-zinc-900">
                          {project.weddingVenue}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.packageId && (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <Package className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">선택 패키지</div>
                        <div className="font-semibold text-zinc-900">
                          {getProductName(project.packageId)}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.optionIds && project.optionIds.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <Tag className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">선택 옵션</div>
                        <div className="font-semibold text-zinc-900">
                          {project.optionIds.map(id => getProductName(id)).join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          {(customer.notes || project?.specialRequests) && (
            <>
              <Separator />
              
              {/* 메모 및 요청사항 */}
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  메모 및 요청사항
                </h3>
                <div className="p-4 bg-zinc-900 text-white rounded-lg">
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap">
                    {customer.notes || project?.specialRequests || '없음'}
                  </div>
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          {/* 유입 경로 및 메타 정보 */}
          <div className="grid grid-cols-2 gap-4 text-xs text-zinc-500">
            <div>
              <p className="mb-1">유입 경로</p>
              <p className="font-medium text-zinc-900">{customer.sourceChannel}</p>
            </div>
            <div>
              <p className="mb-1">접수일시</p>
              <p className="font-medium text-zinc-900">
                {format(new Date(customer.createdAt), 'yyyy.MM.dd HH:mm')}
              </p>
            </div>
          </div>
          
          {/* Footer Reference IDs */}
          <div className="text-xs text-zinc-400 space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
            <div className="font-mono">고객 ID: {customer.id}</div>
            {project && <div className="font-mono">프로젝트 ID: {project.id}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

