'use client'

import { useState, useEffect, useMemo } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Phone,
  UploadCloud
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
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [schedulePhotographers, setSchedulePhotographers] = useState<any[]>([])

  // Load mock data on client side
  useEffect(() => {
    const loadData = async () => {
      try {
        const { mockScheduleEvents, mockSchedulePhotographers } = await import('@/lib/mock/schedules')
        const { applyScheduleUpdates } = await import('@/lib/utils/schedule-storage')
        
        const updatedEvents = applyScheduleUpdates(mockScheduleEvents)
        setScheduleEvents(updatedEvents)
        setSchedulePhotographers(mockSchedulePhotographers)
      } catch (error) {
        console.error('Error loading schedule data:', error)
        setScheduleEvents([])
        setSchedulePhotographers([])
      }
    }
    
    loadData()
  }, [])

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

  // Get today's schedules with localStorage updates applied
  const today = format(new Date(), 'yyyy-MM-dd')
  const todaySchedules = useMemo(() => {
    return scheduleEvents.filter(event => {
      const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
      return eventDate === today
    })
  }, [scheduleEvents, today])

  // Group by status
  const inProgressSchedules = todaySchedules.filter(s => 
    ['on_the_way', 'in_progress', 'completed'].includes(s.status)
  )
  const upcomingSchedules = todaySchedules.filter(s => s.status === 'reserved')
  const completedSchedules = todaySchedules.filter(s => s.status === 'uploaded')

  // Find available photographers (no schedule today and status is 'available')
  const photographersWithSchedules = useMemo(() => 
    todaySchedules.flatMap(s => s.photographerIds || []).filter(Boolean),
    [todaySchedules]
  )
  
  const availablePhotographers = useMemo(() => 
    schedulePhotographers.filter(
      p => !photographersWithSchedules.includes(p.id) && p.availabilityStatus === 'available'
    ),
    [schedulePhotographers, photographersWithSchedules]
  )
  
  // Photographers on leave
  const photographersOnLeave = useMemo(() => 
    schedulePhotographers.filter(p => p.availabilityStatus === 'on_leave'),
    [schedulePhotographers]
  )

  const getPhotographerNames = (photographerIds?: string[]) => {
    if (!photographerIds || photographerIds.length === 0) return '미배정'
    return photographerIds
      .map(id => {
        const photographer = schedulePhotographers.find(p => p.id === id)
        return photographer?.name || ''
      })
      .filter(Boolean)
      .join(', ')
  }

  // Update status map for conversion
  const getDetailedStatus = (status: string) => {
    switch (status) {
      case 'on_the_way': return { label: '이동중', icon: MapPin, className: 'text-yellow-600 bg-yellow-100' }
      case 'in_progress': return { label: '촬영중', icon: Play, className: 'text-green-600 bg-green-100' }
      case 'completed': return { label: '촬영완료', icon: CheckCircle2, className: 'text-blue-600 bg-blue-100' }
      case 'uploaded': return { label: '완료', icon: UploadCloud, className: 'text-purple-600 bg-purple-100' }
      default: return { label: '예정', icon: Clock, className: 'text-zinc-600 bg-zinc-100' }
    }
  }

  const getProductTypeLabel = (productType: string) => {
    const labels = {
      wedding: '웨딩',
      hanbok: '한복 & 캐주얼',
      dress_shop: '가봉 스냅',
      baby: '돌스냅'
    }
    return labels[productType as keyof typeof labels] || productType
  }

  // Convert ScheduleEvent to Schedule for ScheduleDetailDialog
  const convertToSchedule = (event: ScheduleEvent): Schedule => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
    const daysUntil = differenceInDays(new Date(event.start), new Date())
    
    // Map status
    const statusMap: Record<string, Schedule['status']> = {
      'reserved': 'assigned',
      'on_the_way': 'confirmed',
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
      <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
        {/* Stylish Header with Clock Widget */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500">
              Live Status
            </h1>
            <p className="text-base text-muted-foreground">
              실시간 촬영 현황 모니터링
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-zinc-100 p-2 pr-4">
            <div className="bg-zinc-900 text-white rounded-xl px-4 py-2 text-center min-w-[100px]">
              <div className="text-xl font-bold font-mono tracking-widest">
                  {format(currentTime, 'HH:mm:ss')}
              </div>
            </div>
            <div className="text-sm font-medium text-zinc-600">
              {format(currentTime, 'yyyy년 M월 d일 EEEE', { locale: ko })}
            </div>
            <Button
              onClick={handleRefresh}
              size="icon"
              variant="ghost"
              disabled={isRefreshing}
              className="h-8 w-8 ml-2 hover:bg-zinc-100 rounded-full"
            >
              <RefreshCw className={cn("h-4 w-4 text-zinc-400", isRefreshing && "animate-spin text-zinc-900")} />
            </Button>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-white to-zinc-50 hover:shadow-md transition-all group">
            <div className="absolute right-0 top-0 h-24 w-24 bg-zinc-100 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-zinc-500">전체 일정</p>
                <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-zinc-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-zinc-900">{todaySchedules.length}</div>
              <p className="text-xs text-zinc-400 mt-1">Total Schedules</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-zinc-900 text-white hover:shadow-xl transition-all group">
            <div className="absolute right-0 top-0 h-32 w-32 bg-zinc-800/50 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-zinc-300">진행중</p>
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold">{inProgressSchedules.length}</div>
              <p className="text-xs text-zinc-400 mt-1">Active Now</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-all group">
            <div className="absolute right-0 bottom-0 h-24 w-24 bg-blue-50 rounded-tl-full -mr-4 -mb-4 transition-transform group-hover:scale-110" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-zinc-500">예정</p>
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-zinc-900">{upcomingSchedules.length}</div>
              <p className="text-xs text-zinc-400 mt-1">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-white hover:shadow-md transition-all group">
            <div className="absolute right-0 bottom-0 h-24 w-24 bg-purple-50 rounded-tl-full -mr-4 -mb-4 transition-transform group-hover:scale-110" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-zinc-500">완료</p>
                <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-zinc-900">{completedSchedules.length}</div>
              <p className="text-xs text-zinc-400 mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Active & Upcoming (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* In Progress Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              진행중인 촬영
            </h2>
                <Badge variant="secondary" className="font-mono">{inProgressSchedules.length}</Badge>
              </div>

              {inProgressSchedules.length > 0 ? (
                <div className="grid gap-4">
              {inProgressSchedules.map((schedule) => (
                    <div 
                  key={schedule.id} 
                  onClick={() => handleScheduleClick(schedule)}
                      className="group relative bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900" />
                      <div className="flex flex-col md:flex-row gap-6 relative z-10">
                        {/* Photographer Info */}
                        <div className="flex items-center gap-4 md:w-1/3 md:border-r md:border-zinc-100 md:pr-6">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-xl font-bold">
                              {schedule.photographerNames?.[0]?.charAt(0) || <User className="h-6 w-6" />}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                              <div className={cn(
                                "w-3 h-3 rounded-full",
                                schedule.status === 'in_progress' ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                              )} />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900">{getPhotographerNames(schedule.photographerIds)}</p>
                            <div className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1",
                              getDetailedStatus(schedule.status).className
                            )}>
                              {(() => {
                                const StatusIcon = getDetailedStatus(schedule.status).icon
                                return <StatusIcon className="h-3 w-3" />
                              })()}
                              {getDetailedStatus(schedule.status).label}
                          </div>
                        </div>
                      </div>

                        {/* Schedule Info */}
                        <div className="flex-1 grid sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg tracking-tight">
                                {schedule.groomName} <span className="text-zinc-400">&</span> {schedule.brideName}
                              </span>
                              <Badge variant="outline" className="text-[10px] h-5">
                            {getProductTypeLabel(schedule.productType)}
                          </Badge>
                        </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                              <MapPin className="h-3.5 w-3.5" />
                              {schedule.venueName}
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-center sm:items-end">
                            <div className="flex items-center gap-2 text-sm font-medium bg-zinc-50 px-3 py-1.5 rounded-lg w-fit">
                              <Clock className="h-3.5 w-3.5 text-zinc-500" />
                              {format(new Date(schedule.start), 'HH:mm')} - {format(new Date(schedule.end), 'HH:mm')}
                            </div>
                            {schedule.specialRequests && (
                              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                특이사항 있음
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
              ))}
            </div>
              ) : (
                <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                  <p className="text-zinc-500">현재 진행중인 촬영이 없습니다.</p>
          </div>
        )}
            </section>

            {/* Upcoming Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Clock className="h-5 w-5 text-zinc-400" />
                  대기중인 일정
            </h2>
                <Badge variant="secondary" className="font-mono">{upcomingSchedules.length}</Badge>
              </div>

              <div className="grid gap-3">
              {upcomingSchedules.map((schedule) => (
                  <div 
                  key={schedule.id} 
                  onClick={() => handleScheduleClick(schedule)}
                    className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100 hover:border-zinc-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <div className="text-center bg-zinc-50 rounded-lg px-3 py-2 min-w-[80px]">
                        <div className="text-lg font-bold text-zinc-900 font-mono">
                            {format(new Date(schedule.start), 'HH:mm')}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Start</div>
                      </div>
                        </div>

                    <div className="flex-1 border-l border-zinc-100 pl-4 sm:pl-0 sm:border-l-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-zinc-900">
                          {schedule.groomName} & {schedule.brideName}
                        </span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-600">{schedule.venueName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] border-zinc-200 text-zinc-500">
                          {getProductTypeLabel(schedule.productType)}
                        </Badge>
                        <span className="text-xs text-zinc-400">
                          담당: {getPhotographerNames(schedule.photographerIds)}
                        </span>
                      </div>
                    </div>
                  </div>
              ))}
                {upcomingSchedules.length === 0 && (
                  <div className="text-center py-8 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                    <p className="text-zinc-400 text-sm">대기중인 일정이 없습니다.</p>
                  </div>
                )}
            </div>
            </section>
          </div>

          {/* Right Column: Completed & Photographers (1/3 width) */}
          <div className="space-y-8">
            {/* Completed Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-zinc-700">
                  <CheckCircle2 className="h-5 w-5 text-zinc-400" />
              완료된 촬영
            </h2>
                <span className="text-xs font-medium text-zinc-500">{completedSchedules.length}건</span>
              </div>

              <div className="space-y-2">
                {completedSchedules.map((schedule) => {
                  const statusInfo = getDetailedStatus(schedule.status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <div 
                      key={schedule.id}
                      className="bg-white rounded-lg p-3 border border-zinc-100 shadow-sm flex items-center gap-3 opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", 
                        schedule.status === 'uploaded' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-zinc-900 truncate">
                          {schedule.groomName} & {schedule.brideName}
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                          {getPhotographerNames(schedule.photographerIds)}
                          <span className="w-0.5 h-0.5 bg-zinc-300 rounded-full" />
                          {format(new Date(schedule.start), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {completedSchedules.length === 0 && (
                  <p className="text-sm text-zinc-400">아직 완료된 촬영이 없습니다.</p>
                )}
              </div>
            </section>

            {/* Available Photographers */}
            <section>
              <h2 className="text-lg font-bold tracking-tight mb-4 text-zinc-700">대기 작가</h2>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                {availablePhotographers.map((photographer) => (
                  <div key={photographer.id} className="bg-white rounded-lg p-3 border border-zinc-200 flex items-center gap-3 hover:border-green-300 transition-colors group">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500">
                        {photographer.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                          </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{photographer.name}</div>
                      <div className="text-xs text-zinc-500">대기중</div>
                        </div>
                        {photographer.phone && (
                      <a href={`tel:${photographer.phone}`} className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                        <Phone className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                ))}
                {availablePhotographers.length === 0 && (
                  <p className="text-sm text-zinc-400">현재 대기중인 작가가 없습니다.</p>
                )}
              </div>
            </section>

            {/* On Leave Photographers */}
        {photographersOnLeave.length > 0 && (
              <section className="pt-4 border-t border-zinc-100">
                <h2 className="text-sm font-bold tracking-tight mb-3 text-zinc-500">휴무/휴가</h2>
                <div className="flex flex-wrap gap-2">
                {photographersOnLeave.map((photographer) => (
                    <div key={photographer.id} className="bg-zinc-50 rounded-full px-3 py-1 border border-zinc-200 flex items-center gap-2 opacity-60">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full" />
                      <span className="text-xs font-medium text-zinc-600">{photographer.name}</span>
                      </div>
                ))}
              </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Detail Dialog */}
      <ScheduleDetailDialog
        schedule={selectedSchedule}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </AdminLayout>
  )
}


