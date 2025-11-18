'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { MySchedule } from '@/lib/mock/me'
import { mockSchedulePhotographers } from '@/lib/mock/schedules'
import { Calendar, MapPin, Clock, User } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ShiftSwapModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: MySchedule | null
  onSubmit: (scheduleId: string, reason: string, targetPhotographerId: string) => void
}

export function ShiftSwapModal({ open, onOpenChange, schedule, onSubmit }: ShiftSwapModalProps) {
  const [reason, setReason] = useState('')
  const [targetPhotographer, setTargetPhotographer] = useState<string>('')

  const handleSubmit = () => {
    if (!schedule || !reason.trim()) return

    onSubmit(schedule.eventId, reason, targetPhotographer)
    setReason('')
    setTargetPhotographer('')
    onOpenChange(false)
  }

  if (!schedule) return null

  // Exclude current photographer
  const availablePhotographers = mockSchedulePhotographers.filter(p => p.id !== 'photo-1')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>교대 요청</DialogTitle>
          <DialogDescription>
            다른 작가에게 일정 교대를 요청합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Schedule Info */}
          <div className="rounded-lg border p-4 space-y-3 bg-zinc-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{schedule.groomName} & {schedule.brideName}</h4>
                <p className="text-sm text-muted-foreground">{schedule.venueName}</p>
              </div>
              <Badge variant="outline">{schedule.packageName}</Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(parseISO(schedule.date), 'M월 d일 (EEE)', { locale: ko })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{schedule.startTime} - {schedule.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{schedule.venueAddress}</span>
              </div>
            </div>
          </div>

          {/* Target Photographer */}
          <div className="space-y-2">
            <Label htmlFor="target-photographer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              교대 요청 대상 (선택)
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={targetPhotographer === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTargetPhotographer('')}
              >
                전체 작가
              </Button>
              {availablePhotographers.map((photographer) => (
                <Button
                  key={photographer.id}
                  variant={targetPhotographer === photographer.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTargetPhotographer(photographer.id)}
                >
                  {photographer.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              특정 작가를 선택하거나, 전체 작가에게 요청할 수 있습니다.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">사유 *</Label>
            <Textarea
              id="reason"
              placeholder="교대가 필요한 사유를 입력해주세요..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!reason.trim()}>
            요청 보내기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

