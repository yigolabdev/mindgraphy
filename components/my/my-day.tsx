'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/common/empty-state'
import { ScheduleCardHeader, ScheduleCardInfo } from './schedule-card-shared'
import type { MySchedule } from '@/lib/mock/me'
import {
  Clock,
  MapPin,
  Phone,
  Calendar,
  Play,
  CheckCheck,
  UploadCloud,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface MyDayProps {
  schedule: MySchedule[]
  onStatusChange?: (scheduleId: string, newStatus: 'on_the_way' | 'in_progress' | 'completed' | 'uploaded') => void
  onScheduleClick?: (schedule: MySchedule) => void
}

type StatusAction = 'depart' | 'start' | 'complete' | 'upload'

interface ConfirmDialogState {
  open: boolean
  scheduleId: string
  action: StatusAction
  title: string
}

// 상태 변경 액션 설정
const STATUS_ACTION_CONFIG = {
  depart: {
    newStatus: 'on_the_way' as const,
    message: '촬영지로 출발했습니다!',
    icon: MapPin,
    title: '촬영지 출발 확인',
    description: (title: string) => (
      <>
        <strong>{title}</strong> 고객님 촬영지로 출발하시겠습니까?
        <br />
        <span className="text-xs text-muted-foreground mt-2 block">
          출발 시간이 기록되며 실시간 현황판에 표시됩니다.
        </span>
      </>
    ),
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    buttonText: '출발하기',
    iconColor: 'text-yellow-600'
  },
  start: {
    newStatus: 'in_progress' as const,
    message: '촬영을 시작했습니다!',
    icon: Play,
    title: '촬영 시작 확인',
    description: (title: string) => (
      <>
        <strong>{title}</strong> 고객님의 촬영을 시작하시겠습니까?
        <br />
        <span className="text-xs text-muted-foreground mt-2 block">
          시작 시간이 기록되며 실시간 현황판에 표시됩니다.
        </span>
      </>
    ),
    buttonClass: 'bg-green-600 hover:bg-green-700',
    buttonText: '시작하기',
    iconColor: 'text-green-600'
  },
  complete: {
    newStatus: 'completed' as const,
    message: '촬영이 완료되었습니다!',
    icon: CheckCheck,
    title: '촬영 완료 확인',
    description: (title: string) => (
      <>
        <strong>{title}</strong> 고객님의 촬영을 완료하시겠습니까?
        <br />
        <span className="text-xs text-muted-foreground mt-2 block">
          완료 시간이 기록되며 촬영이 종료됩니다. 다음 단계로 원본을 업로드하세요.
        </span>
      </>
    ),
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
    buttonText: '완료하기',
    iconColor: 'text-blue-600'
  },
  upload: {
    newStatus: 'uploaded' as const,
    message: '파일 업로드가 완료되었습니다!',
    icon: UploadCloud,
    title: '파일 업로드 확인',
    description: (title: string) => (
      <>
        <strong>{title}</strong> 고객님의 촬영 원본을 업로드하시겠습니까?
        <br />
        <span className="text-xs text-muted-foreground mt-2 block">
          이 작업은 모든 촬영 일정을 마무리하는 단계입니다.
        </span>
      </>
    ),
    buttonClass: 'bg-purple-600 hover:bg-purple-700',
    buttonText: '업로드 완료',
    iconColor: 'text-purple-600'
  }
}

// 상태별 액션 버튼 설정
const STATUS_TO_ACTION_BUTTON = {
  upcoming: { action: 'depart' as StatusAction, label: '촬영지 출발', icon: MapPin, className: 'bg-yellow-600 hover:bg-yellow-700' },
  on_the_way: { action: 'start' as StatusAction, label: '촬영 시작', icon: Play, className: 'bg-green-600 hover:bg-green-700' },
  in_progress: { action: 'complete' as StatusAction, label: '촬영 완료', icon: CheckCheck, className: 'bg-blue-600 hover:bg-blue-700' },
  completed: { action: 'upload' as StatusAction, label: '파일 업로드', icon: UploadCloud, className: 'bg-purple-600 hover:bg-purple-700' }
}

export function MyDay({ schedule, onStatusChange, onScheduleClick }: MyDayProps) {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    scheduleId: '',
    action: 'depart',
    title: ''
  })

  const handleStatusChangeClick = (item: MySchedule, action: StatusAction) => {
    setConfirmDialog({
      open: true,
      scheduleId: item.id,
      action,
      title: `${item.groomName} & ${item.brideName}`
    })
  }

  const handleConfirm = () => {
    const config = STATUS_ACTION_CONFIG[confirmDialog.action]
    
    if (onStatusChange) {
      onStatusChange(confirmDialog.scheduleId, config.newStatus)
    }
    
    toast.success(config.message)
    setConfirmDialog({ ...confirmDialog, open: false })
  }

  if (schedule.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="오늘 일정이 없습니다"
        description="편안한 하루 보내세요!"
      />
    )
  }

  const currentConfig = confirmDialog.action ? STATUS_ACTION_CONFIG[confirmDialog.action] : null
  const Icon = currentConfig?.icon

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          오늘의 일정
        </h2>

        {schedule.map((item) => {
          const actionButton = STATUS_TO_ACTION_BUTTON[item.status as keyof typeof STATUS_TO_ACTION_BUTTON]
          const ActionIcon = actionButton?.icon

          return (
            <Card 
              key={item.id} 
              className="overflow-hidden transition-all hover:shadow-md cursor-pointer" 
              onClick={() => {
                if (onScheduleClick) onScheduleClick(item)
              }}
            >
              <CardHeader className="pb-3">
                <ScheduleCardHeader schedule={item} showStatus={true} />
              </CardHeader>
              <CardContent className="space-y-4">
                <ScheduleCardInfo schedule={item} showDday={true} showFullDetails={true} />

                {/* Special Requests */}
                {item.specialRequests && (
                  <div className="flex items-start gap-2 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-800">{item.specialRequests}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  {item.groomPhone && (
                    <a href={`tel:${item.groomPhone}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        신랑
                      </Button>
                    </a>
                  )}
                  {item.bridePhone && (
                    <a href={`tel:${item.bridePhone}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        신부
                      </Button>
                    </a>
                  )}
                  {item.venueAddress && (
                    <a
                      href={`https://map.kakao.com/?q=${encodeURIComponent(item.venueAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" />
                        지도
                      </Button>
                    </a>
                  )}
                </div>

                {/* Status Action Button */}
                {item.status !== 'uploaded' && actionButton && (
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      onClick={() => handleStatusChangeClick(item, actionButton.action)}
                      className={`w-full ${actionButton.className}`}
                      size="lg"
                    >
                      {ActionIcon && <ActionIcon className="mr-2 h-5 w-5" />}
                      {actionButton.label}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({...confirmDialog, open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {Icon && <Icon className={`h-5 w-5 ${currentConfig?.iconColor}`} />}
              {currentConfig?.title}
            </DialogTitle>
            <DialogDescription>
              {currentConfig?.description(confirmDialog.title)}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({...confirmDialog, open: false})}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              className={currentConfig?.buttonClass}
            >
              {currentConfig?.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
