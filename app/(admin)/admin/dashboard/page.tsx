'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DdayBadge, 
  DashboardKPISkeleton, 
  ScheduleListSkeleton,
  KPICard,
  StatusBadge
} from '@/components/common'
import { ScheduleDetailDialog } from '@/components/dashboard/schedule-detail-dialog'
import { 
  type Schedule
} from '@/lib/mock/admin'
import { ROUTES } from '@/lib/constants'
import { 
  Calendar, 
  UserX,
  Star,
  User,
  MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RevenueChart, PhotographerChart, PackageChart } from '@/components/dashboard/dashboard-charts'

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [kpi, setKpi] = useState({
    todaySchedules: 0,
    unassignedSchedules: 0,
    urgentDeadlines: 0,
    pendingProofs: 0
  })
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [avgSatisfaction, setAvgSatisfaction] = useState(0)
  const [satisfactionCount, setSatisfactionCount] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { calculateDashboardKPI, getThisWeekSchedules } = await import('@/lib/mock/admin')
        const { mockCustomers } = await import('@/lib/mock-data')
        
        // 고객만족도 계산
        const completedCustomersWithSatisfaction = mockCustomers.filter(
          c => c.leadStatus === 'completed' && c.satisfaction
        )
        const satisfaction = completedCustomersWithSatisfaction.length > 0
          ? completedCustomersWithSatisfaction.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / completedCustomersWithSatisfaction.length
          : 0
        
        setAvgSatisfaction(satisfaction)
        setSatisfactionCount(completedCustomersWithSatisfaction.length)
        setKpi(calculateDashboardKPI())
        setSchedules(getThisWeekSchedules())
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setIsLoading(false)
      }
    }
    
    // Simulate loading (reduced delay for better UX)
    setTimeout(loadData, 100)
  }, [])

  // Status utilities are now imported from common utils

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">운영 대시보드</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              오늘의 핵심 지표와 일정을 확인하세요
            </p>
          </div>
        </div>

        {/* KPI Tiles */}
        {isLoading ? (
          <DashboardKPISkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Today's Schedules */}
            <Link href={`${ROUTES.ADMIN_CALENDAR}?date=today`}>
              <KPICard
                title="오늘 일정"
                value={kpi.todaySchedules}
                description="Today's shoots"
                icon={Calendar}
                valueClassName="group-hover:text-blue-600"
                className="animate-in fade-in slide-in-from-bottom duration-300"
                onClick={() => {}}
              />
            </Link>

            {/* Unassigned Schedules */}
            <Link href={ROUTES.ADMIN_SCHEDULE}>
              <KPICard
                title="미배정 일정"
                value={kpi.unassignedSchedules}
                description={kpi.unassignedSchedules > 0 ? "⚠️ 긴급 배정 필요" : "모두 배정됨"}
                icon={UserX}
                valueClassName={kpi.unassignedSchedules > 0 ? "text-red-700" : ""}
                className={cn(
                  "animate-in fade-in slide-in-from-bottom duration-500",
                  kpi.unassignedSchedules > 0 && "ring-red-200 bg-gradient-to-br from-red-50 to-white"
                )}
                onClick={() => {}}
              />
            </Link>

            {/* Customer Satisfaction */}
            <Link href={`${ROUTES.ADMIN_CUSTOMERS}?tab=completed`}>
              <KPICard
                title="고객 평점"
                value={avgSatisfaction > 0 ? `${avgSatisfaction.toFixed(1)} / 5.0` : '-'}
                description={satisfactionCount > 0 ? `${satisfactionCount}명 평가` : '평가 없음'}
                icon={Star}
                valueClassName="text-yellow-600"
                className="animate-in fade-in slide-in-from-bottom duration-700"
                onClick={() => {}}
              />
            </Link>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: '200ms' }}>
          <RevenueChart />
          <PhotographerChart />
          <PackageChart />
        </div>

        {/* This Week's Schedules */}
        <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm animate-in fade-in slide-in-from-bottom duration-700">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">이번 주 일정 (상위 10개)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ScheduleListSkeleton />
            ) : schedules.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground animate-in fade-in duration-300">
                <Calendar className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p>이번 주 예정된 일정이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule, idx) => (
                  <div
                    key={schedule.id}
                    className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 border-b pb-3 last:border-0 last:pb-0 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-transparent -mx-2 px-2 py-2 rounded-lg transition-all duration-200 cursor-pointer group hover:shadow-sm animate-in fade-in slide-in-from-bottom focus-ring"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    tabIndex={0}
                    role="button"
                    onClick={() => {
                      setSelectedSchedule(schedule)
                      setDetailDialogOpen(true)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedSchedule(schedule)
                        setDetailDialogOpen(true)
                      }
                    }}
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm md:text-base">{schedule.customerName}</h4>
                        <StatusBadge status={schedule.status} className="text-xs" />
                        {schedule.daysUntil <= 3 && schedule.daysUntil >= 0 && (
                          <DdayBadge 
                            targetDate={schedule.date}
                            showIcon={false}
                            variant="outline"
                            className="text-orange-600 border-orange-200"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{schedule.date} {schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[150px] sm:max-w-[200px]">{schedule.location}</span>
                        </div>
                        {schedule.photographerNames && schedule.photographerNames.length > 0 && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{schedule.photographerNames.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-start sm:self-center">
                      {schedule.daysUntil === 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          오늘
                        </Badge>
                      ) : schedule.daysUntil === 1 ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          내일
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          D-{schedule.daysUntil}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
