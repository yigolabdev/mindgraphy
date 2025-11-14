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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockPhotographers } from '@/lib/mock/schedules'
import {
  Calendar,
  Clock,
  User,
  Users,
  Package,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Search
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { ScheduleEvent, ScheduleStatus, PackageType } from '@/lib/mock/schedules'

interface CreateScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateSchedule: (schedule: Partial<ScheduleEvent>) => void
  defaultDate?: Date
}

const packageTypes: { value: PackageType; label: string; description: string }[] = [
  { value: 'basic', label: '베이직', description: '기본 촬영 패키지' },
  { value: 'standard', label: '스탠다드', description: '인기 패키지' },
  { value: 'premium', label: '프리미엄', description: '고급 패키지' },
]

export function CreateScheduleDialog({
  open,
  onOpenChange,
  onCreateSchedule,
  defaultDate
}: CreateScheduleDialogProps) {
  const [step, setStep] = useState<'basic' | 'photographer'>('basic')
  const [photographerSearch, setPhotographerSearch] = useState('')
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    groomPhone: '',
    bridePhone: '',
    weddingDate: defaultDate ? defaultDate.toISOString().split('T')[0] : '',
    ceremonyTime: '',
    venueName: '',
    venueAddress: '',
    packageType: 'standard' as PackageType,
    photographerId: '',
    photographerName: '',
    startTime: '',
    endTime: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectPhotographer = (photographerId: string) => {
    const photographer = mockPhotographers.find(p => p.id === photographerId)
    if (photographer) {
      setFormData(prev => ({
        ...prev,
        photographerId: photographer.id,
        photographerName: photographer.name
      }))
    }
  }

  const handleCreate = () => {
    // Validation
    if (!formData.groomName || !formData.brideName) {
      toast.error('신랑과 신부 이름을 입력해주세요')
      return
    }
    if (!formData.weddingDate || !formData.startTime || !formData.endTime) {
      toast.error('날짜와 시간을 입력해주세요')
      return
    }
    if (!formData.photographerId) {
      toast.error('사진작가를 선택해주세요')
      return
    }

    // Create schedule object
    const startDateTime = new Date(`${formData.weddingDate}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.weddingDate}T${formData.endTime}`)

    const newSchedule: Partial<ScheduleEvent> = {
      id: `schedule-${Date.now()}`,
      title: `${formData.groomName} & ${formData.brideName}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      groomName: formData.groomName,
      brideName: formData.brideName,
      groomPhone: formData.groomPhone,
      bridePhone: formData.bridePhone,
      ceremonyTime: formData.ceremonyTime,
      venueName: formData.venueName,
      venueAddress: formData.venueAddress,
      packageType: formData.packageType,
      photographerIds: formData.photographerId ? [formData.photographerId] : [],
      photographerNames: formData.photographerName ? [formData.photographerName] : [],
      status: 'reserved' as ScheduleStatus,
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      textColor: '#ffffff',
    }

    onCreateSchedule(newSchedule)
    toast.success('새 일정이 생성되었습니다')
    
    // Reset form
    setFormData({
      groomName: '',
      brideName: '',
      groomPhone: '',
      bridePhone: '',
      weddingDate: '',
      ceremonyTime: '',
      venueName: '',
      venueAddress: '',
      packageType: 'standard',
      photographerId: '',
      photographerName: '',
      startTime: '',
      endTime: '',
    })
    setStep('basic')
    onOpenChange(false)
  }

  const filteredPhotographers = mockPhotographers.filter(p =>
    p.name.toLowerCase().includes(photographerSearch.toLowerCase())
  )

  const getPhotographerAvailability = (photographerId: string) => {
    // TODO: Check photographer availability for selected date/time
    return 'available' // 'available' | 'busy' | 'unavailable'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            새 일정 생성
          </DialogTitle>
          <DialogDescription>
            촬영 일정을 생성하고 사진작가를 배정하세요
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            step === 'basic' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
          )}>
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
              step === 'basic' ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
            )}>1</div>
            기본정보
          </div>
          <div className="h-px flex-1 bg-gray-300" />
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            step === 'photographer' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
          )}>
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
              step === 'photographer' ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
            )}>2</div>
            작가배정
          </div>
        </div>

        <div className="space-y-6 py-4">
          {step === 'basic' ? (
            <>
              {/* Couple Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  신랑 & 신부
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groomName">신랑 이름 *</Label>
                    <Input
                      id="groomName"
                      placeholder="홍길동"
                      value={formData.groomName}
                      onChange={(e) => handleInputChange('groomName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideName">신부 이름 *</Label>
                    <Input
                      id="brideName"
                      placeholder="김영희"
                      value={formData.brideName}
                      onChange={(e) => handleInputChange('brideName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomPhone">신랑 연락처</Label>
                    <Input
                      id="groomPhone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={formData.groomPhone}
                      onChange={(e) => handleInputChange('groomPhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bridePhone">신부 연락처</Label>
                    <Input
                      id="bridePhone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={formData.bridePhone}
                      onChange={(e) => handleInputChange('bridePhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  날짜 & 시간
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">예식 날짜 *</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceremonyTime">예식 시간</Label>
                    <Input
                      id="ceremonyTime"
                      type="time"
                      value={formData.ceremonyTime}
                      onChange={(e) => handleInputChange('ceremonyTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">촬영 시작 *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">촬영 종료 *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  예식장
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueName">예식장명</Label>
                    <Input
                      id="venueName"
                      placeholder="서울웨딩홀"
                      value={formData.venueName}
                      onChange={(e) => handleInputChange('venueName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venueAddress">주소</Label>
                    <Input
                      id="venueAddress"
                      placeholder="서울시 강남구..."
                      value={formData.venueAddress}
                      onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Package */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  패키지 선택
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {packageTypes.map((pkg) => (
                    <button
                      key={pkg.value}
                      type="button"
                      onClick={() => handleInputChange('packageType', pkg.value)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        formData.packageType === pkg.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="font-semibold mb-1">{pkg.label}</div>
                      <div className="text-xs text-muted-foreground">{pkg.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Photographer Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    사진작가 선택
                  </h3>
                  {formData.photographerId && (
                    <Badge className="bg-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      선택완료
                    </Badge>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="작가명으로 검색..."
                    value={photographerSearch}
                    onChange={(e) => setPhotographerSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Selected Photographer Info */}
                {formData.photographerId && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-blue-600">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {formData.photographerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{formData.photographerName}</div>
                        <div className="text-sm text-muted-foreground">선택된 작가</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange('photographerId', '')}
                      >
                        변경
                      </Button>
                    </div>
                  </div>
                )}

                {/* Photographer List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredPhotographers.map((photographer) => {
                    const availability = getPhotographerAvailability(photographer.id)
                    const isSelected = formData.photographerId === photographer.id

                    return (
                      <button
                        key={photographer.id}
                        type="button"
                        onClick={() => selectPhotographer(photographer.id)}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 transition-all text-left",
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className={cn(
                            isSelected ? "bg-blue-600" : "bg-gray-600"
                          )}>
                            <AvatarFallback className={cn(
                              "text-white",
                              isSelected ? "bg-blue-600" : "bg-gray-600"
                            )}>
                              {photographer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{photographer.name}</span>
                              {availability === 'available' && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  가능
                                </Badge>
                              )}
                              {availability === 'busy' && (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                  바쁨
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              사진작가
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              if (step === 'photographer') {
                setStep('basic')
              } else {
                onOpenChange(false)
              }
            }}
          >
            {step === 'photographer' ? '이전' : '취소'}
          </Button>
          <Button
            onClick={() => {
              if (step === 'basic') {
                setStep('photographer')
              } else {
                handleCreate()
              }
            }}
          >
            {step === 'basic' ? '다음' : '생성하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

