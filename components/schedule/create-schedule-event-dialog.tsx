'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { ScheduleEventType, ScheduleEventStatus } from '@/lib/mock/schedule-events'
import { mockUsers } from '@/lib/mock-data'

interface CreateScheduleEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const EVENT_TYPE_OPTIONS: { value: ScheduleEventType; label: string }[] = [
  { value: 'pre-meeting', label: '사전미팅' },
  { value: 'meeting', label: '미팅' },
  { value: 'conference', label: '회의' },
  { value: 'appointment', label: '약속' },
  { value: 'vacation', label: '휴가' },
  { value: 'training', label: '교육' },
  { value: 'other', label: '기타' },
]

const EVENT_STATUS_OPTIONS: { value: ScheduleEventStatus; label: string }[] = [
  { value: 'scheduled', label: '예정' },
  { value: 'confirmed', label: '확정' },
]

export function CreateScheduleEventDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateScheduleEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting' as ScheduleEventType,
    status: 'scheduled' as ScheduleEventStatus,
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    attendees: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('일정명을 입력해주세요.')
      return
    }
    
    if (!formData.date) {
      toast.error('날짜를 선택해주세요.')
      return
    }
    
    if (!formData.startTime || !formData.endTime) {
      toast.error('시작 시간과 종료 시간을 입력해주세요.')
      return
    }
    
    if (formData.startTime >= formData.endTime) {
      toast.error('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // TODO: 실제 API 호출로 변경
      // await apiService.post('/schedule-events', formData)
      
      // Mock: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('일정이 등록되었습니다.')
      
      // Reset form
      setFormData({
        title: '',
        type: 'meeting',
        status: 'scheduled',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        attendees: [],
      })
      
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error) {
      toast.error('일정 등록에 실패했습니다.')
      console.error('Failed to create schedule event:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 일정 등록</DialogTitle>
          <DialogDescription>
            미팅, 회의, 교육 등의 일정을 등록하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              일정명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="예: 신규 고객 상담"
              required
            />
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                유형 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                상태 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                날짜 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">
                시작 시간 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                종료 시간 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">장소</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="예: 본사 상담실, 온라인 (Zoom)"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="일정에 대한 상세 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label htmlFor="attendees">참석자</Label>
            <Select
              value={formData.attendees[0] || ''}
              onValueChange={(value) => {
                if (value && !formData.attendees.includes(value)) {
                  handleChange('attendees', [...formData.attendees, value])
                }
              }}
            >
              <SelectTrigger id="attendees">
                <SelectValue placeholder="참석자를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.lastName}{user.firstName} ({user.role === 'admin' ? '관리자' : '작가'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {formData.attendees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.attendees.map((userId) => {
                  const user = mockUsers.find(u => u.id === userId)
                  if (!user) return null
                  
                  return (
                    <div
                      key={userId}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm"
                    >
                      <span>{user.lastName}{user.firstName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          handleChange(
                            'attendees',
                            formData.attendees.filter(id => id !== userId)
                          )
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              참석자를 선택하면 목록에 추가됩니다
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '일정 등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

