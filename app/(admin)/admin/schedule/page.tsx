'use client'

import { useState, useEffect, useRef } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CreateScheduleEventDialog } from '@/components/schedule/create-schedule-event-dialog'
import { 
  CalendarCheck, 
  Plus, 
  Search,
  Clock,
  MapPin,
  Users as UsersIcon,
  Filter,
  Calendar as CalendarIcon,
  User,
  X,
  AlertTriangle,
  Camera
} from 'lucide-react'
import { 
  mockScheduleEvents,
  getTodayEvents,
  getUpcomingEvents,
  type ScheduleEvent,
  type ScheduleEventType,
  type ScheduleEventStatus
} from '@/lib/mock/schedule-events'
import { mockUsers } from '@/lib/mock-data'
import { formatDateWithWeekday, cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg, EventContentArg } from '@fullcalendar/core'

const EVENT_TYPE_LABELS: Record<ScheduleEventType, string> = {
  'meeting': '미팅',
  'conference': '회의',
  'appointment': '약속',
  'vacation': '휴가',
  'training': '교육',
  'other': '기타',
}

const EVENT_STATUS_LABELS: Record<ScheduleEventStatus, string> = {
  'scheduled': '예정',
  'confirmed': '확정',
  'cancelled': '취소',
  'completed': '완료',
}

const EVENT_TYPE_COLORS: Record<ScheduleEventType, { bg: string, border: string, text: string }> = {
  'meeting': { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
  'conference': { bg: '#e9d5ff', border: '#a855f7', text: '#6b21a8' },
  'appointment': { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
  'vacation': { bg: '#fed7aa', border: '#f97316', text: '#9a3412' },
  'training': { bg: '#fce7f3', border: '#ec4899', text: '#9f1239' },
  'other': { bg: '#f3f4f6', border: '#9ca3af', text: '#4b5563' },
}

const EVENT_STATUS_COLORS: Record<ScheduleEventStatus, string> = {
  'scheduled': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'confirmed': 'bg-green-100 text-green-800 border-green-300',
  'cancelled': 'bg-red-100 text-red-800 border-red-300',
  'completed': 'bg-gray-100 text-gray-800 border-gray-300',
}

export default function SchedulePage() {
  const calendarRef = useRef<FullCalendar>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [attendeeSearch, setAttendeeSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [eventDetailOpen, setEventDetailOpen] = useState(false)
  const [events, setEvents] = useState<ScheduleEvent[]>(mockScheduleEvents)
  
  // Statistics
  const todayCount = getTodayEvents().length
  const upcomingCount = getUpcomingEvents().length
  const confirmedCount = mockScheduleEvents.filter(e => e.status === 'confirmed').length
  
  // Apply filters
  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      if (!event.title.toLowerCase().includes(query) &&
          !event.location?.toLowerCase().includes(query) &&
          !event.description?.toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Attendee search filter
    if (attendeeSearch.trim() !== '') {
      const searchLower = attendeeSearch.toLowerCase()
      const attendeeNames = event.attendees.map(userId => {
        const user = mockUsers.find(u => u.id === userId)
        return user ? `${user.lastName}${user.firstName}`.toLowerCase() : ''
      }).join(' ')
      
      if (!attendeeNames.includes(searchLower)) {
        return false
      }
    }
    
    return true
  })
  
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId)
    return user ? `${user.lastName}${user.firstName}` : '알 수 없음'
  }
  
  const handleEventClick = (clickInfo: EventClickArg) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent as ScheduleEvent
    setSelectedEvent(originalEvent)
    setEventDetailOpen(true)
  }
  
  // Convert schedule events to FullCalendar events
  const calendarEvents = filteredEvents.map(event => {
    const colors = EVENT_TYPE_COLORS[event.type]
    return {
      id: event.id,
      title: event.title,
      start: `${event.date}T${event.startTime}`,
      end: `${event.date}T${event.endTime}`,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        originalEvent: event
      }
    }
  })

  return (
    <AdminLayout align="left">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">일정 관리</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              미팅, 회의, 교육 등 일반 일정을 관리하세요
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                일반 일정 캘린더
              </Badge>
              <a 
                href="/admin/calendar" 
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                <Camera className="h-3 w-3" />
                촬영 스케줄 보기 →
              </a>
            </div>
          </div>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            새 일정
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-300">
          <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-700">오늘 일정</CardTitle>
              <CalendarIcon className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">{todayCount}</div>
              <p className="text-xs text-muted-foreground">
                오늘 예정된 일정
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-700">예정된 일정</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground">
                다가오는 일정
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-700">확정된 일정</CardTitle>
              <CalendarCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
              <p className="text-xs text-muted-foreground">
                확정 완료
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-700">전체 일정</CardTitle>
              <Filter className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">{mockScheduleEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                총 등록된 일정
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="일정 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 focus-ring"
            />
          </div>
          
          <div className="relative">
            <UsersIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="참석자로 검색..."
              value={attendeeSearch}
              onChange={(e) => setAttendeeSearch(e.target.value)}
              className="pl-9 pr-9 focus-ring"
            />
            {attendeeSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setAttendeeSearch('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Active Search Info - Mobile */}
          {(searchQuery || attendeeSearch) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  {searchQuery}
                </Badge>
              )}
              {attendeeSearch && (
                <Badge variant="secondary" className="gap-1">
                  <UsersIcon className="h-3 w-3" />
                  {attendeeSearch}
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                {filteredEvents.length}개의 일정
              </span>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg p-3 md:p-6 relative">
          {/* Search Controls - Desktop */}
          <div className="hidden md:flex absolute top-6 right-6 z-10 flex-col items-end gap-2">
            {/* Main Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="일정 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 focus-ring bg-white shadow-sm"
              />
            </div>
            
            {/* Attendee Search */}
            <div className="relative w-64">
              <UsersIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="참석자로 검색..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="pl-9 pr-9 focus-ring bg-white shadow-sm"
              />
              {attendeeSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => setAttendeeSearch('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Active Search Info */}
            {(searchQuery || attendeeSearch) && (
              <div className="flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-md shadow-sm border border-zinc-200">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />
                    {searchQuery}
                  </Badge>
                )}
                {attendeeSearch && (
                  <Badge variant="secondary" className="gap-1">
                    <UsersIcon className="h-3 w-3" />
                    {attendeeSearch}
                  </Badge>
                )}
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
            .fc .fc-col-header-cell-cushion {
              color: #18181b;
              font-weight: 600;
              font-size: 13px;
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
            locale="ko"
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'monthView,weekView,dayView'
            }}
            customButtons={{
              monthView: {
                text: '월',
                click: () => {
                  const calendarApi = calendarRef.current?.getApi()
                  if (calendarApi) {
                    calendarApi.changeView('dayGridMonth')
                  }
                }
              },
              weekView: {
                text: '주',
                click: () => {
                  const calendarApi = calendarRef.current?.getApi()
                  if (calendarApi) {
                    calendarApi.changeView('timeGridWeek')
                  }
                }
              },
              dayView: {
                text: '일',
                click: () => {
                  const calendarApi = calendarRef.current?.getApi()
                  if (calendarApi) {
                    calendarApi.changeView('timeGridDay')
                  }
                }
              }
            }}
            buttonText={{
              today: '오늘',
              month: '월',
              week: '주',
              day: '일'
            }}
            events={calendarEvents}
            editable={true}
            selectable={false}
            dayMaxEvents={3}
            weekends={true}
            eventClick={handleEventClick}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            slotDuration="01:00:00"
            eventContent={(arg: EventContentArg) => {
              const event = arg.event.extendedProps.originalEvent as ScheduleEvent
              return (
                <div className="p-1 overflow-hidden">
                  <div className="font-medium text-xs truncate">
                    {arg.timeText && <span className="mr-1">{arg.timeText}</span>}
                    {arg.event.title}
                  </div>
                  {event.location && (
                    <div className="text-xs opacity-75 truncate">
                      📍 {event.location}
                    </div>
                  )}
                </div>
              )
            }}
          />
        </div>
      </div>

      {/* Create Schedule Event Dialog */}
      <CreateScheduleEventDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          // TODO: Refresh data after successful creation
        }}
      />
      
      {/* Event Detail Sheet */}
      <Sheet open={eventDetailOpen} onOpenChange={setEventDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedEvent && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedEvent.title}</SheetTitle>
                <SheetDescription>
                  {formatDateWithWeekday(selectedEvent.date)}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" style={{ 
                  backgroundColor: EVENT_TYPE_COLORS[selectedEvent.type].bg,
                  borderColor: EVENT_TYPE_COLORS[selectedEvent.type].border,
                  color: EVENT_TYPE_COLORS[selectedEvent.type].text
                }}>
                  {EVENT_TYPE_LABELS[selectedEvent.type]}
                </Badge>
                <Badge variant="outline" className={EVENT_STATUS_COLORS[selectedEvent.status]}>
                  {EVENT_STATUS_LABELS[selectedEvent.status]}
                </Badge>
              </div>

              <div className="mt-6 space-y-6">
                {/* Date and Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">일시</span>
                  </div>
                  <div className="ml-6">
                    <div className="font-medium">{formatDateWithWeekday(selectedEvent.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </div>
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">장소</span>
                    </div>
                    <div className="ml-6">
                      <div>{selectedEvent.location}</div>
                    </div>
                  </div>
                )}

                {/* Attendees */}
                {selectedEvent.attendees.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span className="font-medium">참석자 ({selectedEvent.attendees.length}명)</span>
                    </div>
                    <div className="ml-6 space-y-2">
                      {selectedEvent.attendees.map((userId) => {
                        const user = mockUsers.find(u => u.id === userId)
                        return user ? (
                          <div key={userId} className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{user.lastName}{user.firstName}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.role === 'admin' ? '관리자' : 
                               user.role === 'photographer' ? '작가' : 
                               user.role === 'editor' ? '편집자' : '기타'}
                            </Badge>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground font-medium">설명</div>
                    <div className="ml-6 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                      {selectedEvent.description}
                    </div>
                  </div>
                )}

                {/* Created Info */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div>생성일: {format(new Date(selectedEvent.createdAt), 'yyyy-MM-dd HH:mm', { locale: ko })}</div>
                    {selectedEvent.createdBy && (
                      <div>생성자: {getUserName(selectedEvent.createdBy)}</div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    수정
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                    삭제
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  )
}
