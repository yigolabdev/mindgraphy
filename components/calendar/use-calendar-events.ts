import { useState, useMemo, useCallback } from 'react'
import { 
  mockScheduleEvents, 
  ScheduleEvent, 
  ScheduleStatus, 
  ProductType,
  checkConflicts 
} from '@/lib/mock/schedules'
import { mockCustomers, mockContracts } from '@/lib/mock-data'
import { applyScheduleUpdates } from '@/lib/utils/schedule-storage'
import { EventDropArg } from '@fullcalendar/core'

export interface CalendarFilters {
  photographerSearch: string
  statusFilter: ScheduleStatus | 'all'
  productTypeFilter: ProductType | 'all'
}

export function useCalendarEvents() {
  const [filters, setFilters] = useState<CalendarFilters>({
    photographerSearch: '',
    statusFilter: 'all',
    productTypeFilter: 'all'
  })
  
  const [conflictWarning, setConflictWarning] = useState<{
    event: ScheduleEvent
    conflicts: ScheduleEvent[]
  } | null>(null)

  // 일정이 확정된 촬영 스케줄만 필터링 (leadStatus가 'contracted' 또는 'completed'인 고객)
  const getConfirmedSchedules = useCallback(() => {
    // localStorage 업데이트 적용
    const allSchedulesWithUpdates = applyScheduleUpdates(mockScheduleEvents)
    
    return allSchedulesWithUpdates.filter(event => {
      // contractId로 고객 찾기
      const contract = mockContracts.find(c => c.id === event.contractId)
      if (!contract) return false
      
      const customer = mockCustomers.find(c => c.id === contract.customerId)
      if (!customer) return false
      
      // leadStatus가 'contracted' 또는 'completed'인 고객의 스케줄 표시 (일정이 확정되었거나 완료된 고객)
      return customer.leadStatus === 'contracted' || customer.leadStatus === 'completed'
    })
  }, [])
  
  const [events, setEvents] = useState<ScheduleEvent[]>(getConfirmedSchedules())

  // Apply filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Photographer search filter
      if (filters.photographerSearch.trim() !== '') {
        const searchLower = filters.photographerSearch.toLowerCase()
        const photographerNames = event.photographerNames?.map(n => n.toLowerCase()).join(' ') || ''
        if (!photographerNames.includes(searchLower)) {
          return false
        }
      }
      
      if (filters.statusFilter !== 'all' && event.status !== filters.statusFilter) {
        return false
      }
      if (filters.productTypeFilter !== 'all' && event.productType !== filters.productTypeFilter) {
        return false
      }
      return true
    })
  }, [events, filters])

  const updateFilter = (key: keyof CalendarFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const addEvent = (event: ScheduleEvent) => {
    setEvents(prev => [...prev, event])
  }

  const updateEventDates = (id: string, start: string, end: string) => {
    setEvents(prevEvents => 
      prevEvents.map(e => {
        if (e.id === id) {
          const updatedEvent = {
            ...e,
            start,
            end
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
  }

  const dismissConflictWarning = () => setConflictWarning(null)

  return {
    events: filteredEvents,
    filters,
    updateFilter,
    addEvent,
    updateEventDates,
    conflictWarning,
    dismissConflictWarning
  }
}

