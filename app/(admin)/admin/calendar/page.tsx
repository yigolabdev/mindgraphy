'use client'

import { useState, useRef, useEffect } from 'react'
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
import { useAuthStore } from '@/lib/store/auth-store'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventDropArg } from '@fullcalendar/core'
import { 
  mockScheduleEvents, 
  getStatusLabel,
  getProductTypeLabel,
  checkConflicts,
  type ScheduleEvent,
  type ScheduleStatus,
  type ProductType
} from '@/lib/mock/schedules'
import { mockCustomers, mockProjects, mockContracts } from '@/lib/mock-data'
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
  Camera
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function CalendarPage() {
  const { user } = useAuthStore()
  const calendarRef = useRef<FullCalendar>(null)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  
  // 일정이 확정된 촬영 스케줄만 필터링 (leadStatus가 'contracted' 또는 'completed'인 고객)
  const getConfirmedSchedules = () => {
    return mockScheduleEvents.filter(event => {
      // contractId로 고객 찾기
      const contract = mockContracts.find(c => c.id === event.contractId)
      if (!contract) return false
      
      const customer = mockCustomers.find(c => c.id === contract.customerId)
      if (!customer) return false
      
      // leadStatus가 'contracted' 또는 'completed'인 고객의 스케줄 표시 (일정이 확정되었거나 완료된 고객)
      return customer.leadStatus === 'contracted' || customer.leadStatus === 'completed'
    })
  }
  
  const [events, setEvents] = useState<ScheduleEvent[]>(getConfirmedSchedules())
  
  // Create schedule dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<Date | undefined>()
  
  // Date click dialog
  const [dateDialogOpen, setDateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateEvents, setSelectedDateEvents] = useState<ScheduleEvent[]>([])
  
  // Filters
  const [photographerSearch, setPhotographerSearch] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('all')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productTypeFilter, setProductTypeFilter] = useState<ProductType | 'all'>('all')
  
  // Conflict warning
  const [conflictWarning, setConflictWarning] = useState<{
    event: ScheduleEvent
    conflicts: ScheduleEvent[]
  } | null>(null)

  // Apply filters
  const filteredEvents = events.filter(event => {
    // Photographer search filter
    if (photographerSearch.trim() !== '') {
      const searchLower = photographerSearch.toLowerCase()
      const photographerNames = event.photographerNames?.map(n => n.toLowerCase()).join(' ') || ''
      if (!photographerNames.includes(searchLower)) {
        return false
      }
    }
    
    if (statusFilter !== 'all' && event.status !== statusFilter) {
      return false
    }
    if (productTypeFilter !== 'all' && event.productType !== productTypeFilter) {
      return false
    }
    return true
  })

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find(e => e.id === clickInfo.event.id)
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
    const newEvent = schedule as ScheduleEvent
    setEvents(prev => [...prev, newEvent])
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

    // Update event in state (optimistic update)
    setEvents(prevEvents => 
      prevEvents.map(e => {
        if (e.id === eventId) {
          const updatedEvent = {
            ...e,
            start: newStart.toISOString(),
            end: newEnd.toISOString()
          }
          
          // Check for conflicts
          const conflicts = checkConflicts(updatedEvent)
          if (conflicts.length > 0) {
            setConflictWarning({
              event: updatedEvent,
              conflicts
            })
          }
          
          return updatedEvent
        }
        return e
      })
    )

    // Event successfully moved
    // TODO: Send update to backend API when integrated
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
      
      // Update button active states
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
              value={photographerSearch}
              onChange={(e) => setPhotographerSearch(e.target.value)}
              className="pl-9 pr-9 focus-ring"
            />
            {photographerSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setPhotographerSearch('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Active Search Info - Mobile */}
          {photographerSearch && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <Badge variant="secondary" className="gap-1">
                <Camera className="h-3 w-3" />
                {photographerSearch}
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
                  onClick={() => setConflictWarning(null)}
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
                value={photographerSearch}
                onChange={(e) => setPhotographerSearch(e.target.value)}
                className="pl-9 pr-9 focus-ring bg-white shadow-sm"
              />
              {photographerSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => setPhotographerSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Active Search Info */}
            {photographerSearch && (
              <div className="flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-md shadow-sm border border-zinc-200">
                <Badge variant="secondary" className="gap-1">
                  <Camera className="h-3 w-3" />
                  {photographerSearch}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {filteredEvents.length}개
                </span>
              </div>
            )}
          </div>

          <style jsx global>{`
            .fc {
              font-family: inherit;
            }
            .fc .fc-button {
              background-color: #18181b;
              border-color: #18181b;
              color: white;
              text-transform: capitalize;
              font-size: 14px;
              padding: 8px 16px;
            }
            .fc .fc-button:hover {
              background-color: #27272a;
              border-color: #27272a;
            }
            .fc .fc-button-primary:not(:disabled).fc-button-active {
              background-color: #27272a;
              border-color: #27272a;
            }
            .fc .fc-toolbar-title {
              font-size: 1.5rem;
              font-weight: 700;
            }
            .fc .fc-toolbar.fc-header-toolbar {
              margin-bottom: 1.5em;
              padding-right: 280px;
              gap: 12px;
            }
            @media (max-width: 768px) {
              .fc .fc-toolbar.fc-header-toolbar {
                padding-right: 0;
                flex-direction: column;
                align-items: stretch;
                gap: 12px;
              }
              .fc .fc-toolbar-chunk {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
              }
              .fc .fc-toolbar-chunk:first-child {
                order: 2;
              }
              .fc .fc-toolbar-chunk:nth-child(2) {
                order: 1;
                margin-bottom: 8px;
              }
              .fc .fc-toolbar-chunk:last-child {
                order: 3;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
              }
              .fc .fc-toolbar-title {
                font-size: 1.25rem;
              }
              .fc .fc-button {
                font-size: 13px;
                padding: 6px 12px;
              }
            }
            .fc .fc-toolbar-chunk:last-child {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .fc .fc-viewSelector-button {
              background-color: white !important;
              border: 1px solid #e4e4e7 !important;
              color: #18181b !important;
              font-size: 14px !important;
              padding: 8px 16px !important;
              margin-left: 4px !important;
            }
            .fc .fc-viewSelector-button:hover {
              background-color: #fafafa !important;
              border-color: #d4d4d8 !important;
            }
            .fc .fc-viewSelector-button.fc-button-active {
              background-color: #18181b !important;
              border-color: #18181b !important;
              color: white !important;
            }
            @media (max-width: 768px) {
              .fc .fc-viewSelector-button {
                font-size: 12px !important;
                padding: 6px 10px !important;
                margin-left: 2px !important;
              }
            }
            .fc-theme-standard td,
            .fc-theme-standard th {
              border-color: #e4e4e7;
            }
            .fc .fc-daygrid-day-number {
              padding: 10px;
              font-size: 14px;
              font-weight: 500;
            }
            .fc .fc-col-header-cell {
              background-color: #fafafa;
              font-weight: 600;
              font-size: 14px;
              padding: 12px 4px;
              border-color: #e4e4e7;
            }
            .fc .fc-daygrid-day.fc-day-today {
              background-color: #eff6ff;
            }
            .fc .fc-daygrid-day:hover {
              background-color: #fafaf9;
              cursor: pointer;
              transition: background-color 0.15s ease;
            }
            .fc .fc-scrollgrid {
              border-color: #e4e4e7;
            }
            .fc-event {
              cursor: pointer;
              border: none;
              font-size: 13px;
              padding: 3px 6px;
              margin-bottom: 2px;
              font-weight: 500;
            }
            .fc-event:hover {
              opacity: 0.85;
              transform: translateY(-1px);
              transition: all 0.2s;
            }
            .fc-timegrid-slot {
              font-size: 13px;
              height: 3em;
            }
            .fc-timegrid-slot-label {
              color: #71717a;
            }
            .fc .fc-daygrid-day-frame {
              min-height: 100px;
            }
            @media (max-width: 768px) {
              .fc .fc-daygrid-day-frame {
                min-height: 80px;
              }
              .fc .fc-daygrid-day-number {
                padding: 6px;
                font-size: 13px;
              }
              .fc .fc-col-header-cell {
                font-size: 12px;
                padding: 8px 2px;
              }
              .fc-event {
                font-size: 11px;
                padding: 2px 4px;
              }
            }
            @media (min-width: 768px) {
              .fc .fc-daygrid-day-frame {
                min-height: 120px;
              }
            }
            /* Mobile optimizations */
            @media (max-width: 640px) {
              .fc .fc-toolbar-title {
                font-size: 1.1rem;
              }
              .fc .fc-button {
                padding: 6px 10px;
                font-size: 12px;
              }
              .fc .fc-daygrid-day-number {
                padding: 6px;
                font-size: 12px;
              }
              .fc-event {
                font-size: 11px;
                padding: 2px 4px;
              }
            }
          `}</style>
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
            dayMaxEvents={3}
            weekends={true}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            eventDisplay="block"
            height="auto"
            contentHeight={750}
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
          </div>

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
