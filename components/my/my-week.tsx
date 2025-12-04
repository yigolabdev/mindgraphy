'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { MySchedule } from '@/lib/mock/me'
import {
  Calendar,
  Clock,
  MapPin,
  Camera,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MyWeekProps {
  schedule: MySchedule[]
  onAcceptanceChange?: (scheduleId: string, accept: boolean, reason?: string) => void
  onScheduleClick?: (schedule: MySchedule) => void
}

export function MyWeek({ schedule, onAcceptanceChange, onScheduleClick }: MyWeekProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    scheduleId: string
    action: 'accept' | 'reject'
    title: string
  }>({
    open: false,
    scheduleId: '',
    action: 'accept',
    title: ''
  })
  
  const [rejectionReason, setRejectionReason] = useState('')

  const handleAcceptanceClick = (item: MySchedule, action: 'accept' | 'reject') => {
    setConfirmDialog({
      open: true,
      scheduleId: item.id,
      action,
      title: `${item.groomName} & ${item.brideName}`
    })
    setRejectionReason('')
  }

  const handleConfirm = () => {
    const accept = confirmDialog.action === 'accept'
    
    console.log('[handleConfirm] Called', {
      action: confirmDialog.action,
      scheduleId: confirmDialog.scheduleId,
      accept,
      rejectionReason,
      hasOnAcceptanceChange: !!onAcceptanceChange
    })
    
    if (onAcceptanceChange) {
      onAcceptanceChange(confirmDialog.scheduleId, accept, rejectionReason)
    }
    
    const message = accept ? '일정을 수락했습니다!' : '일정을 거절했습니다.'
    toast.success(message)
    
    setConfirmDialog({ ...confirmDialog, open: false })
    setRejectionReason('')
  }

  const getProductTypeLabel = (type: string) => {
    const labels = {
      wedding: '웨딩 촬영',
      hanbok: 'HANBOK & CASUAL',
      dress_shop: 'DRESS SHOP',
      baby: 'BABY 돌스냅'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getProductTypeBadgeColor = (type: string) => {
    const colors = {
      wedding: 'bg-blue-100 text-blue-800 border-blue-200',
      hanbok: 'bg-purple-100 text-purple-800 border-purple-200',
      dress_shop: 'bg-pink-100 text-pink-800 border-pink-200',
      baby: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Schedule List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          예정된 일정
        </h2>

        {schedule.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              예정된 일정이 없습니다
            </CardContent>
          </Card>
        ) : (
          schedule.map((item) => (
            <Card key={item.id} className="transition-all hover:shadow-md cursor-pointer" onClick={() => {
              if (onScheduleClick) onScheduleClick(item)
            }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.groomName} & {item.brideName}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`text-xs ${getProductTypeBadgeColor(item.productType)}`}>
                        {getProductTypeLabel(item.productType)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(item.date), 'M월 d일 (EEE)', { locale: ko })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'upcoming' ? 'outline' : 'default'}>
                    {item.status === 'upcoming' ? '예정' : item.status === 'in_progress' ? '진행중' : '완료'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {item.startTime} - {item.endTime}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span>{item.productType === 'wedding' ? '예식' : '촬영'} {item.weddingTime}</span>
                </div>

                {item.venueName && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>{item.venueName}</span>
                  </div>
                )}

                {item.photographerNames && item.photographerNames.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Camera className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">담당 작가:</span>
                      <span className="text-muted-foreground">
                        {item.photographerNames.join(', ')}
                      </span>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {item.photographerNames.length}명
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Acceptance Buttons - Show for pending schedules */}
                {(item as any).acceptanceStatus === 'pending' && (
                  <div className="pt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-blue-900">새로운 일정이 배정되었습니다</p>
                        <p className="text-blue-700 text-xs mt-1">
                          일정을 확인하고 수락 또는 거절해 주세요
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptanceClick(item, 'accept')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <UserCheck className="mr-2 h-5 w-5" />
                        일정 수락
                      </Button>
                      <Button
                        onClick={() => handleAcceptanceClick(item, 'reject')}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                        size="lg"
                      >
                        <UserX className="mr-2 h-5 w-5" />
                        거절
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Accepted Badge */}
                {(item as any).acceptanceStatus === 'accepted' && (
                  <div className="pt-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-green-700 font-medium">일정 수락 완료</p>
                    </div>
                  </div>
                )}
                
                {/* Rejected Badge */}
                {(item as any).acceptanceStatus === 'rejected' && (
                  <div className="pt-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <UserX className="h-4 w-4 text-red-600" />
                        <p className="text-sm font-medium text-red-700">일정 거절됨</p>
                      </div>
                      {(item as any).rejectionReason && (
                        <p className="text-xs text-red-600 ml-6">
                          사유: {(item as any).rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({...confirmDialog, open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmDialog.action === 'accept' ? (
                <>
                  <UserCheck className="h-5 w-5 text-green-600" />
                  일정 수락 확인
                </>
              ) : (
                <>
                  <UserX className="h-5 w-5 text-red-600" />
                  일정 거절
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'accept' 
                ? `${confirmDialog.title} 고객님의 촬영 일정을 수락하시겠습니까?`
                : `${confirmDialog.title} 고객님의 촬영 일정을 거절하시겠습니까?`
              }
            </DialogDescription>
            <div className="space-y-3 mt-4">
              {confirmDialog.action === 'accept' ? (
                <span className="text-xs text-muted-foreground block">
                  수락 시 해당 일정이 확정되며 대표자에게 알림이 전송됩니다.
                </span>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="rejection-reason" className="text-sm font-medium">
                      거절 사유 (필수)
                    </label>
                    <textarea
                      id="rejection-reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="거절 사유를 입력해 주세요 (예: 다른 일정과 중복, 개인 사정 등)"
                      className="w-full min-h-[100px] px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground block">
                    거절 시 대표자에게 알림이 전송되며 다른 작가에게 재배정됩니다.
                  </span>
                </>
              )}
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialog({...confirmDialog, open: false})
                setRejectionReason('')
              }}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={confirmDialog.action === 'reject' && !rejectionReason.trim()}
              className={
                confirmDialog.action === 'accept' 
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {confirmDialog.action === 'accept' ? '수락하기' : '거절하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

