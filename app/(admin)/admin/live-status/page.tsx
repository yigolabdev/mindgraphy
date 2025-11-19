'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockScheduleEvents, mockSchedulePhotographers } from '@/lib/mock/schedules'
import type { ScheduleEvent } from '@/lib/mock/schedules'
import type { Schedule } from '@/lib/mock/admin'
import { ScheduleDetailDialog } from '@/components/dashboard/schedule-detail-dialog'
import {
  Activity,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  Play,
  Calendar as CalendarIcon,
  Users,
  UserCheck,
  Coffee,
  RefreshCw,
  Phone
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function LiveStatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Refresh page data
  const handleRefresh = () => {
    setIsRefreshing(true)
    toast.info('현황판을 새로고침하는 중...')
    // Simulate refresh animation
    setTimeout(() => {
      setIsRefreshing(false)
      window.location.reload()
    }, 500)
  }

  // Get today's schedules
  const today = format(new Date(), 'yyyy-MM-dd')
  const todaySchedules = mockScheduleEvents.filter(event => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
    return eventDate === today
  })

  // Group by status
  const inProgressSchedules = todaySchedules.filter(s => s.status === 'in_progress')
  const upcomingSchedules = todaySchedules.filter(s => s.status === 'reserved')
  const completedSchedules = todaySchedules.filter(s => s.status === 'completed')

  // Find available photographers (no schedule today and status is 'available')
  const photographersWithSchedules = todaySchedules.flatMap(s => s.photographerIds || []).filter(Boolean)
  const availablePhotographers = mockSchedulePhotographers.filter(
    p => !photographersWithSchedules.includes(p.id) && p.availabilityStatus === 'available'
  )
  
  // Photographers on leave
  const photographersOnLeave = mockSchedulePhotographers.filter(
    p => p.availabilityStatus === 'on_leave'
  )

  const getPhotographerNames = (photographerIds?: string[]) => {
    if (!photographerIds || photographerIds.length === 0) return '미배정'
    return photographerIds
      .map(id => {
        const photographer = mockSchedulePhotographers.find(p => p.id === id)
        return photographer?.name || ''
      })
      .filter(Boolean)
      .join(', ')
  }

  const getStatusColor = (status: string) => {
    const colors = {
      reserved: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      editing: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      reserved: '예정',
      in_progress: '진행중',
      completed: '완료',
      editing: '편집중'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getProductTypeLabel = (productType: string) => {
    const labels = {
      wedding: '일반 웨딩',
      hanbok: '한복 & 캐주얼',
      dress_shop: '가봉 스냅',
      baby: '돌스냅'
    }
    return labels[productType as keyof typeof labels] || productType
  }

  const getProductTypeColor = (productType: string) => {
    const colors = {
      wedding: 'bg-pink-100 text-pink-800 border-pink-200',
      hanbok: 'bg-purple-100 text-purple-800 border-purple-200',
      dress_shop: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      baby: 'bg-amber-100 text-amber-800 border-amber-200'
    }
    return colors[productType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Convert ScheduleEvent to Schedule for ScheduleDetailDialog
  const convertToSchedule = (event: ScheduleEvent): Schedule => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
    const daysUntil = differenceInDays(new Date(event.start), new Date())
    
    // Map status
    const statusMap: Record<string, Schedule['status']> = {
      'reserved': 'assigned',
      'in_progress': 'confirmed',
      'completed': 'completed',
      'editing': 'confirmed',
      'cancelled': 'cancelled'
    }
    
    return {
      id: event.id,
      projectId: event.projectDetailId || event.id,
      customerName: `${event.groomName} & ${event.brideName}`,
      date: eventDate,
      time: event.ceremonyTime,
      location: event.venueName,
      photographerIds: event.photographerIds,
      photographerNames: event.photographerNames,
      status: statusMap[event.status] || 'assigned',
      type: event.productType,
      daysUntil: daysUntil,
      hasProof: false, // ScheduleEvent doesn't have proof info
      proofStatus: 'pending'
    }
  }

  // Handle schedule click
  const handleScheduleClick = (event: ScheduleEvent) => {
    const schedule = convertToSchedule(event)
    setSelectedSchedule(schedule)
    setDetailDialogOpen(true)
  }

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              실시간 현황판
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              오늘의 촬영 현황을 실시간으로 확인하세요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="text-right">
                <div className="text-2xl font-bold font-mono">
                  {format(currentTime, 'HH:mm:ss')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(currentTime, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                </div>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              size="icon"
              variant="outline"
              disabled={isRefreshing}
              className="h-12 w-12"
            >
              <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
              <span className="sr-only">새로고침</span>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 일정</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySchedules.length}</div>
              <p className="text-xs text-muted-foreground">
                오늘 총 일정 수
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중</CardTitle>
              <Play className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{inProgressSchedules.length}</div>
              <p className="text-xs text-green-600">
                현재 촬영중
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">예정</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{upcomingSchedules.length}</div>
              <p className="text-xs text-blue-600">
                대기중인 일정
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-gray-200 bg-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">{completedSchedules.length}</div>
              <p className="text-xs text-gray-600">
                촬영 완료
              </p>
            </CardContent>
          </Card>
        </div>

        {/* In Progress */}
        {inProgressSchedules.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              진행중인 촬영
              <Badge className="bg-green-600 animate-pulse">{inProgressSchedules.length}</Badge>
            </h2>

            <div className="space-y-3">
              {inProgressSchedules.map((schedule) => (
                <Card 
                  key={schedule.id} 
                  className="border-2 border-green-500 shadow-lg bg-gradient-to-r from-green-50 to-white cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Left: Photographer(s) */}
                      <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white flex-shrink-0">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-semibold">{getPhotographerNames(schedule.photographerIds)}</div>
                          <Badge className={cn("text-xs pulse-badge", getStatusColor(schedule.status))}>
                            <Play className="mr-1 h-3 w-3" />
                            촬영중
                          </Badge>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="hidden md:block h-12 w-px bg-gray-200" />

                      {/* Center: Schedule Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">{schedule.groomName} & {schedule.brideName}</span>
                          <Badge className={cn("text-xs border", getProductTypeColor(schedule.productType))}>
                            {getProductTypeLabel(schedule.productType)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{format(new Date(schedule.start), 'HH:mm')} - {format(new Date(schedule.end), 'HH:mm')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{schedule.venueName}</span>
                          </div>
                        </div>
                        {schedule.specialRequests && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            💡 {schedule.specialRequests}
                          </div>
                        )}
                      </div>

                      {/* Right: Package Info */}
                      <div className="flex flex-col gap-1 md:w-32 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {schedule.packageName}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcomingSchedules.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              예정된 촬영
              <Badge className="bg-blue-600">{upcomingSchedules.length}</Badge>
            </h2>

            <div className="space-y-2">
              {upcomingSchedules.map((schedule) => (
                <Card 
                  key={schedule.id} 
                  className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      {/* Left: Time */}
                      <div className="flex items-center gap-3 md:w-40 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 font-mono">
                            {format(new Date(schedule.start), 'HH:mm')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(schedule.end), 'HH:mm')} 종료
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="hidden md:block h-12 w-px bg-gray-200" />

                      {/* Center: Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{schedule.groomName} & {schedule.brideName}</span>
                          <Badge className={cn("text-xs border", getProductTypeColor(schedule.productType))}>
                            {getProductTypeLabel(schedule.productType)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{schedule.venueName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {schedule.packageName}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Right: Photographer(s) */}
                      <div className="flex items-center gap-2 md:w-36">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{getPhotographerNames(schedule.photographerIds)}</div>
                          <div className="text-xs text-muted-foreground">담당 작가</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completedSchedules.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gray-600" />
              완료된 촬영
              <Badge variant="outline">{completedSchedules.length}</Badge>
            </h2>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {completedSchedules.map((schedule) => (
                <Card key={schedule.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {schedule.groomName} & {schedule.brideName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {getPhotographerNames(schedule.photographerIds)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs border", getProductTypeColor(schedule.productType))}>
                            {getProductTypeLabel(schedule.productType)}
                          </Badge>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(schedule.start), 'HH:mm')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Photographers */}
        {availablePhotographers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                  촬영 가능한 작가
                  <Badge className="bg-emerald-600">{availablePhotographers.length}</Badge>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  오늘 스케줄 없음 • 즉시 연락 가능
                </p>
              </div>
            </div>

            {/* 횡 스크롤 리스트 */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar">
                {availablePhotographers.map((photographer) => (
                  <Card 
                    key={photographer.id} 
                    className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white flex-shrink-0 w-[240px] snap-start hover:shadow-lg hover:scale-105 hover:border-emerald-400 transition-all duration-200"
                  >
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {/* 이름과 상태 */}
                        <div>
                          <div className="font-bold text-lg text-zinc-900 mb-2">{photographer.name}</div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full w-fit">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>촬영 가능</span>
                          </div>
                        </div>
                        
                        {/* 연락처 */}
                        {photographer.phone && (
                          <a 
                            href={`tel:${photographer.phone}`}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 -mx-2 rounded-lg transition-all font-medium group"
                          >
                            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>{photographer.phone}</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photographers on Leave */}
        {photographersOnLeave.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-amber-600" />
                  휴가/휴무 작가
                  <Badge variant="outline" className="border-amber-600 text-amber-700">{photographersOnLeave.length}</Badge>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  현재 휴무 중 • 연락 불가
                </p>
              </div>
            </div>

            {/* 횡 스크롤 리스트 */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar">
                {photographersOnLeave.map((photographer) => (
                  <Card 
                    key={photographer.id} 
                    className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white flex-shrink-0 w-[240px] snap-start hover:shadow-md transition-all duration-200 opacity-75 hover:opacity-100"
                  >
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {/* 이름과 상태 */}
                        <div>
                          <div className="font-bold text-lg text-zinc-900 mb-2">{photographer.name}</div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full w-fit">
                            <Coffee className="h-3.5 w-3.5" />
                            <span>휴무 중</span>
                          </div>
                        </div>
                        
                        {/* 연락처 (비활성화) */}
                        {photographer.phone && (
                          <div className="flex items-center gap-2 text-sm text-zinc-400 p-2 -mx-2 rounded-lg">
                            <Phone className="h-4 w-4" />
                            <span>{photographer.phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {todaySchedules.length === 0 && availablePhotographers.length === 0 && photographersOnLeave.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">오늘 일정이 없습니다</h3>
              <p className="text-sm text-muted-foreground">
                편안한 하루 보내세요!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgb(34 197 94);
          }
          50% {
            border-color: rgb(134 239 172);
          }
        }

        .pulse-badge {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>

      {/* Schedule Detail Dialog */}
      <ScheduleDetailDialog
        schedule={selectedSchedule}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </AdminLayout>
  )
}


