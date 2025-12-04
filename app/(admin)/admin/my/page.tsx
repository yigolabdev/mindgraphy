'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MyDay } from '@/components/my/my-day'
import { MyWeek } from '@/components/my/my-week'
import { AvailabilityTab } from '@/components/my/availability-tab'
import {
  getTodaySchedule,
  getAllUpcomingSchedule,
  currentUser
} from '@/lib/mock/me'
import { 
  saveScheduleUpdate, 
  applyScheduleUpdates,
  saveScheduleAcceptance,
  applyScheduleAcceptances,
  clearAllScheduleUpdates
} from '@/lib/utils/schedule-storage'
import { Calendar, User, CheckSquare, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { ScheduleDetailDialog } from '@/components/dashboard/schedule-detail-dialog'
import { differenceInDays } from 'date-fns'
import type { MySchedule } from '@/lib/mock/me'
import type { Schedule } from '@/lib/mock/admin'

export default function MyPage() {
  // State
  const [activeTab, setActiveTab] = useState<'day' | 'upcoming' | 'availability'>('day')
  const [todaySchedule, setTodaySchedule] = useState<any[]>([])
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // localStorage의 업데이트를 적용한 스케줄 로드
  useEffect(() => {
    const rawTodaySchedule = getTodaySchedule()
    const rawUpcomingSchedule = getAllUpcomingSchedule()
    
    // localStorage 업데이트 적용 (상태 변경)
    const updatedTodaySchedule = applyScheduleUpdates(rawTodaySchedule as any)
    const updatedUpcomingSchedule = applyScheduleUpdates(rawUpcomingSchedule as any)
    
    // localStorage 수락/거절 상태 적용
    const acceptedTodaySchedule = applyScheduleAcceptances(updatedTodaySchedule)
    const acceptedUpcomingSchedule = applyScheduleAcceptances(updatedUpcomingSchedule)
    
    // 오늘 탭: 수락된 일정만 표시
    const filteredTodaySchedule = acceptedTodaySchedule.filter(
      (schedule: any) => schedule.acceptanceStatus === 'accepted'
    )
    
    setTodaySchedule(filteredTodaySchedule)
    setUpcomingSchedule(acceptedUpcomingSchedule)
  }, [])

  const handleStatusChange = (scheduleId: string, newStatus: 'on_the_way' | 'in_progress' | 'completed' | 'uploaded') => {
    // 로컬 상태 업데이트
    setTodaySchedule(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, status: newStatus }
          : schedule
      )
    )
    
    setUpcomingSchedule(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, status: newStatus }
          : schedule
      )
    )

    // localStorage에 스케줄 상태 업데이트 저장 (다른 페이지와 동기화)
    saveScheduleUpdate(scheduleId, newStatus, currentUser.id)
  }

  const handleAcceptanceChange = (scheduleId: string, accept: boolean, reason?: string) => {
    // 로컬 상태 업데이트
    setTodaySchedule(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? { 
              ...schedule, 
              acceptanceStatus: accept ? 'accepted' : 'rejected',
              rejectionReason: reason
            }
          : schedule
      )
    )
    
    setUpcomingSchedule(prev =>
      prev.map(schedule =>
        schedule.id === scheduleId
          ? { 
              ...schedule, 
              acceptanceStatus: accept ? 'accepted' : 'rejected',
              rejectionReason: reason
            }
          : schedule
      )
    )

    // localStorage에 수락/거절 정보 저장
    saveScheduleAcceptance(scheduleId, currentUser.id, accept, reason)
  }

  // Convert MySchedule to Schedule for DetailDialog
  const handleScheduleClick = (schedule: MySchedule) => {
    // Convert MySchedule to Schedule type
    const detailSchedule: Schedule = {
      id: schedule.id,
      projectId: schedule.eventId, // Using eventId as projectId for linking
      customerName: `${schedule.groomName} & ${schedule.brideName}`,
      date: schedule.date,
      time: schedule.startTime,
      location: schedule.venueName || '',
      photographerIds: [currentUser.id],
      photographerNames: schedule.photographerNames,
      status: schedule.status === 'upcoming' ? 'confirmed' : 
              schedule.status === 'completed' ? 'completed' : 
              schedule.status === 'uploaded' ? 'completed' : 'confirmed',
      type: schedule.productType,
      daysUntil: differenceInDays(new Date(schedule.date), new Date()),
      hasProof: false // Default
    }
    
    setSelectedSchedule(detailSchedule)
    setDetailDialogOpen(true)
  }

  return (
    <AdminLayout align="left">
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <User className="h-8 w-8" />
              {currentUser.name}님의 일정
            </h1>
            <p className="text-muted-foreground mt-1">
              나의 스케줄과 일정을 관리하세요
            </p>
          </div>
          {/* Developer Tool - Clear localStorage */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearAllScheduleUpdates()
              toast.success('일정 데이터가 초기화되었습니다. 페이지를 새로고침하세요.')
            }}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            🧪 테스트 초기화
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'day' | 'upcoming' | 'availability')}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="day">오늘</TabsTrigger>
            <TabsTrigger value="upcoming">예정된 일정</TabsTrigger>
            <TabsTrigger value="availability">일정 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="day" className="mt-6">
            <MyDay
              schedule={todaySchedule}
              onStatusChange={handleStatusChange}
              onScheduleClick={handleScheduleClick}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <MyWeek
              schedule={upcomingSchedule}
              onAcceptanceChange={handleAcceptanceChange}
              onScheduleClick={handleScheduleClick}
            />
          </TabsContent>

          <TabsContent value="availability" className="mt-6">
            <AvailabilityTab />
          </TabsContent>
        </Tabs>

        {/* Mobile Bottom Navigation - Hidden on desktop */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-white dark:bg-gray-900">
          <div className="grid grid-cols-3 gap-1 p-2">
            <button
              onClick={() => setActiveTab('day')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                activeTab === 'day'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">오늘</span>
            </button>
            
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">예정</span>
            </button>
            
            <button
              onClick={() => setActiveTab('availability')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                activeTab === 'availability'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <CheckSquare className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">일정</span>
            </button>
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

