'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Schedule } from '@/lib/mock/admin'
import { mockProjects, mockCustomers } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Camera,
  Tag,
  Image as ImageIcon,
  Phone,
  Mail,
  Users as UsersIcon,
  Scissors,
  FileText,
  Package,
  AlertCircle,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScheduleDetailDialogProps {
  schedule: Schedule | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG = {
  unassigned: { label: '미배정', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  assigned: { label: '배정 완료', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  confirmed: { label: '확정', color: 'bg-zinc-900 text-white border-zinc-900' },
  completed: { label: '완료', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
  cancelled: { label: '취소', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
}

const TYPE_CONFIG = {
  wedding: { label: '웨딩', color: 'bg-zinc-100 text-zinc-800' },
  hanbok: { label: '한복 & 캐주얼', color: 'bg-zinc-100 text-zinc-800' },
  dress_shop: { label: '가봉 스냅', color: 'bg-zinc-100 text-zinc-800' },
  baby: { label: '돌스냅', color: 'bg-zinc-100 text-zinc-800' },
}

const PROOF_STATUS_CONFIG = {
  pending: { label: '대기중', color: 'bg-zinc-100 text-zinc-800' },
  ready: { label: '준비완료', color: 'bg-zinc-100 text-zinc-800' },
  selected: { label: '선택완료', color: 'bg-zinc-900 text-white' },
  completed: { label: '완료', color: 'bg-zinc-100 text-zinc-800' },
}

export function ScheduleDetailDialog({
  schedule,
  open,
  onOpenChange
}: ScheduleDetailDialogProps) {
  if (!schedule) return null

  // Find project and customer details
  const project = mockProjects.find(p => p.id === schedule.projectId)
  const customer = project ? mockCustomers.find(c => c.id === project.customerId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-zinc-900 mb-2">
                {schedule.customerName}
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge className={cn("border", STATUS_CONFIG[schedule.status].color)}>
                  {STATUS_CONFIG[schedule.status].label}
                </Badge>
                <Badge variant="outline">
                  {TYPE_CONFIG[schedule.type].label}
                </Badge>
                {schedule.daysUntil >= 0 && schedule.daysUntil <= 3 && (
                  <Badge variant="outline" className="border-zinc-900 text-zinc-900 font-semibold">
                    {schedule.daysUntil === 0 ? '오늘' : schedule.daysUntil === 1 ? '내일' : `D-${schedule.daysUntil}`}
                  </Badge>
                )}
              </div>
            </div>
            <Calendar className="h-8 w-8 text-zinc-400" />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">

          {/* 일정 정보 섹션 */}
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              일정 정보
            </h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <Calendar className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">촬영 날짜</div>
                    <div className="font-semibold text-zinc-900">{schedule.date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <Clock className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">촬영 시간</div>
                    <div className="font-semibold text-zinc-900">{schedule.time}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                <MapPin className="h-5 w-5 mt-0.5 text-zinc-600" />
                <div className="flex-1">
                  <div className="text-sm text-zinc-600 mb-1">촬영 장소</div>
                  <div className="font-semibold text-zinc-900">{schedule.location}</div>
                </div>
              </div>

              {schedule.photographerNames && schedule.photographerNames.length > 0 ? (
                <div className="flex items-start gap-3 p-4 bg-zinc-900 text-white rounded-lg">
                  <Camera className="h-5 w-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-300 mb-1">담당 작가</div>
                    <div className="font-semibold">{schedule.photographerNames.join(', ')}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-lg">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">담당 작가</div>
                    <div className="font-semibold text-zinc-900">미배정</div>
                  </div>
                </div>
              )}

              {project?.packageId && (
                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <Package className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">선택 패키지</div>
                    <div className="font-semibold text-zinc-900">
                      {mockProducts.find(p => p.id === project.packageId)?.name || project.packageId}
                    </div>
                  </div>
                </div>
              )}

              {project?.optionIds && project.optionIds.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                  <Tag className="h-5 w-5 mt-0.5 text-zinc-600" />
                  <div className="flex-1">
                    <div className="text-sm text-zinc-600 mb-1">선택 옵션</div>
                    <div className="font-semibold text-zinc-900">
                      {project.optionIds.map(optionId => 
                        mockProducts.find(p => p.id === optionId)?.name || optionId
                      ).join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 고객 정보 섹션 */}
          {customer ? (
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
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

                {customer.notes && (
                  <div className="p-4 bg-zinc-900 text-white rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold mb-2">고객 메모</div>
                        <div className="text-sm text-zinc-300 whitespace-pre-wrap">{customer.notes}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* 추가 정보 섹션 */}
          {(project?.specialRequests || project?.makeupInfo || project?.referralSource || schedule.hasProof) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  추가 정보
                </h3>
                <div className="grid gap-3">
                  {project?.specialRequests && (
                    <div className="p-4 bg-zinc-900 text-white rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold mb-2">특별 요청사항</div>
                          <div className="text-sm text-zinc-300">{project.specialRequests}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {project?.makeupInfo && (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <Scissors className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">메이크업 정보</div>
                        <div className="font-semibold text-zinc-900">{project.makeupInfo}</div>
                      </div>
                    </div>
                  )}

                  {project?.referralSource && (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <UsersIcon className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">유입 경로</div>
                        <div className="font-semibold text-zinc-900">{project.referralSource}</div>
                      </div>
                    </div>
                  )}

                  {schedule.hasProof && schedule.proofStatus && (
                    <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <ImageIcon className="h-5 w-5 mt-0.5 text-zinc-600" />
                      <div className="flex-1">
                        <div className="text-sm text-zinc-600 mb-1">시안 상태</div>
                        <Badge className={PROOF_STATUS_CONFIG[schedule.proofStatus].color}>
                          {PROOF_STATUS_CONFIG[schedule.proofStatus].label}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {project && (
                    <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-5 w-5 text-zinc-600" />
                        <div className="font-semibold text-zinc-900">프로젝트 진행률</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-zinc-200 rounded-full h-2.5">
                          <div 
                            className="bg-zinc-900 h-2.5 rounded-full transition-all" 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-zinc-900 min-w-[3rem] text-right">{project.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Footer Reference IDs */}
          <Separator />
          <div className="text-xs text-zinc-400 space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
            <div className="font-mono">프로젝트 ID: {schedule.projectId}</div>
            <div className="font-mono">일정 ID: {schedule.id}</div>
            {customer && <div className="font-mono">고객 ID: {customer.id}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
