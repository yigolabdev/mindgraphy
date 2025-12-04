'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScheduleDrawer } from '@/components/calendar/schedule-drawer'
import { CreateScheduleDialog } from '@/components/calendar/create-schedule-dialog'
import { CalendarEventContent } from '@/components/calendar/calendar-event-content'
import { useCalendarEvents } from '@/components/calendar/use-calendar-events'
import { useAuthStore } from '@/lib/store/auth-store'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventDropArg } from '@fullcalendar/core'
import { 
  getStatusLabel,
  getProductTypeLabel,
  type ScheduleEvent,
} from '@/lib/mock/schedules'
import { 
  Plus, 
  Calendar as CalendarIcon,
  Users,
  AlertTriangle,
  X,
  Clock,
  Phone,
  Building2,
  Search,
  Camera,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import './calendar.css' // Import external CSS

export default function CalendarPage() {
  const { user } = useAuthStore()
  const searchParams = useSearchParams()
  const calendarRef = useRef<FullCalendar>(null)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  
  // Custom Hook for Logic
  const { 
    events: filteredEvents, 
    filters, 
    updateFilter, 
    addEvent, 
    updateEventDates, 
    conflictWarning, 
    dismissConflictWarning 
  } = useCalendarEvents()

  // Create schedule dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<Date | undefined>()
  
  // Date click dialog
  const [dateDialogOpen, setDateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState<ScheduleEvent[]>([])

  // URL query parameter로부터 날짜를 읽어서 캘린더 이동
  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (dateParam && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      
      try {
        // 날짜로 이동
        calendarApi.gotoDate(dateParam)
        
        // 주간 뷰로 변경하여 더 자세히 보기
        calendarApi.changeView('timeGridWeek')
        
        console.log('[Calendar] Navigated to date from query:', dateParam)
      } catch (error) {
        console.error('[Calendar] Error navigating to date:', error)
      }
    }
  }, [searchParams])

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = filteredEvents.find(e => e.id === clickInfo.event.id)
    if (event) {
      setSelectedEvent(event)
      setDrawerOpen(true)
    }
  }

  // Handle date click (show all events for that date)
  const handleDateClick = (clickInfo: DateClickArg) => {
    const clickedDate = clickInfo.date
    const dateStr = format(clickedDate, 'yyyy-MM-dd')
    
    // Find all events on this date
    const eventsOnDate = filteredEvents.filter(event => {
      const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
      return eventDate === dateStr
    })
    
    setSelectedDate(clickedDate)
    setSelectedDateEvents(eventsOnDate)
    setDateDialogOpen(true)
  }

  // Handle create schedule
  const handleCreateSchedule = (schedule: Partial<ScheduleEvent>) => {
    addEvent(schedule as ScheduleEvent)
  }

  // Open create dialog
  const openCreateDialog = () => {
    setDefaultDate(undefined)
    setCreateDialogOpen(true)
  }

  // Open event detail from date dialog
  const handleEventClickFromDialog = (event: ScheduleEvent) => {
    setDateDialogOpen(false)
    setSelectedEvent(event)
    setDrawerOpen(true)
  }

  // Handle event drop (drag & drop)
  const handleEventDrop = (dropInfo: EventDropArg) => {
    const eventId = dropInfo.event.id
    const newStart = dropInfo.event.start
    const newEnd = dropInfo.event.end

    if (!newStart || !newEnd) return

    updateEventDates(eventId, newStart.toISOString(), newEnd.toISOString())
  }

  // Change view
  const changeView = (newView: 'month' | 'week' | 'day') => {
    setView(newView)
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      const viewMap = {
        month: 'dayGridMonth',
        week: 'timeGridWeek',
        day: 'timeGridDay'
      }
      calendarApi.changeView(viewMap[newView])
      
      // Update button active states (handled by FullCalendar classes mostly, but custom buttons need help)
      const toolbar = document.querySelector('.fc-toolbar-chunk:last-child')
      if (toolbar) {
        const buttons = toolbar.querySelectorAll('.fc-viewSelector-button')
        buttons.forEach(btn => {
          btn.classList.remove('fc-button-active')
        })
        
        const activeButtonMap = {
          month: 'monthView',
          week: 'weekView',
          day: 'dayView'
        }
        const activeButton = toolbar.querySelector(`.fc-${activeButtonMap[newView]}-button`)
        if (activeButton) {
          activeButton.classList.add('fc-button-active')
        }
      }
    }
  }

  // Set initial active button on mount
  useEffect(() => {
    const toolbar = document.querySelector('.fc-toolbar-chunk:last-child')
    if (toolbar) {
      const monthButton = toolbar.querySelector('.fc-monthView-button')
      if (monthButton) {
        monthButton.classList.add('fc-button-active')
      }
    }
  }, [])

  return (
    <AdminLayout align="left">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">촬영 스케줄</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              확정된 고객의 촬영 일정을 관리하세요
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                촬영 전용 캘린더
              </Badge>
            </div>
          </div>
          {user?.role === 'admin' && (
            <Button size="sm" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              새 촬영 일정
            </Button>
          )}
        </div>

        {/* Mobile Search */}
        <div className="md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Camera className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="작가명으로 검색..."
              value={filters.photographerSearch}
              onChange={(e) => updateFilter('photographerSearch', e.target.value)}
              className="pl-9 pr-9 focus-ring"
            />
            {filters.photographerSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => updateFilter('photographerSearch', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Active Search Info - Mobile */}
          {filters.photographerSearch && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <Badge variant="secondary" className="gap-1">
                <Camera className="h-3 w-3" />
                {filters.photographerSearch}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {filteredEvents.length}개의 일정
              </span>
            </div>
          )}
        </div>

        {/* Conflict Warning */}
        {conflictWarning && (
          <Card className="border-red-200 bg-red-50">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">
                    일정 충돌 발생
                  </h3>
                  <p className="text-sm text-red-700 mb-2">
                    {conflictWarning.event.photographerNames?.join(', ')}님의 일정이 겹칩니다:
                  </p>
                  <ul className="space-y-1">
                    {conflictWarning.conflicts.map(conflict => (
                      <li key={conflict.id} className="text-sm text-red-700">
                        • {conflict.groomName} & {conflict.brideName} 
                        ({new Date(conflict.start).toLocaleString('ko-KR', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })})
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissConflictWarning}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-lg p-3 md:p-6 relative">
          {/* Photographer Search - Top Right */}
          <div className="hidden md:flex absolute top-6 right-6 z-10 flex-col items-end gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Camera className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="작가명으로 검색..."
                value={filters.photographerSearch}
                onChange={(e) => updateFilter('photographerSearch', e.target.value)}
                className="pl-9 pr-9 focus-ring bg-white shadow-sm"
              />
              {filters.photographerSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => updateFilter('photographerSearch', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Active Search Info */}
            {filters.photographerSearch && (
              <div className="flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-md shadow-sm border border-zinc-200">
                <Badge variant="secondary" className="gap-1">
                  <Camera className="h-3 w-3" />
                  {filters.photographerSearch}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {filteredEvents.length}개
                </span>
              </div>
            )}
          </div>

          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'monthView,weekView,dayView'
            }}
            customButtons={{
              monthView: {
                text: '월',
                click: () => changeView('month')
              },
              weekView: {
                text: '주',
                click: () => changeView('week')
              },
              dayView: {
                text: '일',
                click: () => changeView('day')
              }
            }}
            locale="ko"
            buttonText={{
              today: '오늘',
              month: '월',
              week: '주',
              day: '일'
            }}
            events={filteredEvents}
            editable={true}
            selectable={false}
            dayMaxEvents={false}
            weekends={true}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            eventDisplay="block"
            eventContent={(eventInfo) => <CalendarEventContent eventInfo={eventInfo} />}
            height="auto"
            contentHeight="auto"
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </div>
      </div>

      {/* Date Dialog - Shows all events for selected date */}
      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              {selectedDate && format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })}
            </DialogTitle>
            <DialogDescription>
              {selectedDateEvents.length > 0 
                ? `${selectedDateEvents.length}개의 촬영 일정이 있습니다`
                : '예정된 일정이 없습니다'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {selectedDateEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">예정된 일정이 없습니다</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  이 날짜에는 아직 촬영 일정이 등록되지 않았습니다
                </p>
                {user?.role === 'admin' && (
                  <Button variant="outline" onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    새 일정 추가
                  </Button>
                )}
              </div>
            ) : (
              selectedDateEvents.map((event) => {
                const getStatusColor = (status: string) => {
                  const colors: Record<string, string> = {
                    reserved: 'bg-blue-100 text-blue-800 border-blue-200',
                    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    editing: 'bg-purple-100 text-purple-800 border-purple-200',
                    completed: 'bg-green-100 text-green-800 border-green-200',
                    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
                  }
                  return colors[status] || 'bg-gray-100 text-gray-800'
                }

                return (
                  <Card 
                    key={event.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                    style={{ borderLeftColor: event.borderColor }}
                    onClick={() => handleEventClickFromDialog(event)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            {event.groomName} & {event.brideName}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={cn("border text-xs", getStatusColor(event.status))}>
                              {getStatusLabel(event.status)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getProductTypeLabel(event.productType)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-muted-foreground mb-1">촬영 시간</div>
                          <div className="font-semibold">
                            {new Date(event.start).toLocaleTimeString('ko-KR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                            {' - '}
                            {new Date(event.end).toLocaleTimeString('ko-KR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{event.venueName}</div>
                            {event.ballroom && (
                              <div className="text-muted-foreground text-xs">{event.ballroom}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">예식 {event.ceremonyTime}</div>
                            {event.makeupTime && (
                              <div className="text-muted-foreground text-xs">
                                메이크업 {event.makeupTime}
                              </div>
                            )}
                          </div>
                        </div>

                        {event.photographerNames && event.photographerNames.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{event.photographerNames.join(', ')}</div>
                              <div className="text-muted-foreground text-xs">사진작가</div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">
                              {event.groomPhone} / {event.bridePhone}
                            </div>
                            <div className="text-muted-foreground text-xs">연락처</div>
                          </div>
                        </div>
                      </div>

                      {event.specialRequests && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="text-xs font-medium text-yellow-900 mb-1">특이사항</div>
                          <div className="text-sm text-yellow-800">{event.specialRequests}</div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })
            )}

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setDateDialogOpen(false)}>
                닫기
              </Button>
              {user?.role === 'admin' && (
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  새 일정 추가
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Schedule Dialog */}
      <CreateScheduleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateSchedule={handleCreateSchedule}
        defaultDate={defaultDate}
      />

      {/* Schedule Drawer */}
      <ScheduleDrawer
        event={selectedEvent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </AdminLayout>
  )
}
