/**
 * 고객 관련 커스텀 훅
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllCustomers, searchCustomers, getCustomersByStatus } from '@/lib/utils/data-integration'
import { useDataSync } from '@/lib/utils/sync'
import type { Customer } from '@/lib/types'

export interface UseCustomersOptions {
  initialFilters?: CustomerFilters
  autoRefresh?: boolean
}

export interface CustomerFilters {
  stage?: Customer['leadStatus'] | 'all'
  satisfaction?: string
  source?: string
  sortBy?: 'latest' | 'name' | 'projects' | 'revenue'
}

export interface UseCustomersReturn {
  customers: Customer[]
  loading: boolean
  error: Error | null
  filters: CustomerFilters
  updateFilter: (key: keyof CustomerFilters, value: string) => void
  resetFilters: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  refresh: () => Promise<void>
  hasActiveFilters: boolean
}

/**
 * 고객 데이터 관리 훅
 */
export function useCustomers(options: UseCustomersOptions = {}): UseCustomersReturn {
  const { initialFilters = {}, autoRefresh = true } = options
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { subscribe } = useDataSync()

  // 데이터 로드
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const data = getAllCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load customers'))
    } finally {
      setLoading(false)
    }
  }, [])

  // 초기 로드
  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // 실시간 동기화
  useEffect(() => {
    if (!autoRefresh) return

    const unsubscribe = subscribe('ALL', (message) => {
      if (
        message.type.includes('CUSTOMER') || 
        message.type === 'DATA_REFRESHED'
      ) {
        loadCustomers()
      }
    })

    return unsubscribe
  }, [subscribe, autoRefresh, loadCustomers])

  // 필터링된 고객
  const filteredCustomers = useMemo(() => {
    let result = [...customers]

    // 검색어 필터
    if (searchQuery) {
      result = searchCustomers(searchQuery)
    }

    // 상태 필터
    if (filters.stage && filters.stage !== 'all') {
      result = result.filter(c => c.leadStatus === filters.stage)
    }

    // 유입 경로 필터
    if (filters.source && filters.source !== 'all') {
      result = result.filter(c => c.sourceChannel === filters.source)
    }

    // 정렬
    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.groomName.localeCompare(b.groomName, 'ko'))
        break
      case 'latest':
      default:
        result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return result
  }, [customers, filters, searchQuery])

  // 필터 업데이트
  const updateFilter = useCallback((key: keyof CustomerFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
    setSearchQuery('')
  }, [initialFilters])

  // 활성 필터 확인
  const hasActiveFilters = useMemo(() => {
    return (
      !!searchQuery ||
      (!!filters.stage && filters.stage !== 'all') ||
      (!!filters.source && filters.source !== 'all') ||
      !!filters.sortBy
    )
  }, [filters, searchQuery])

  return {
    customers: filteredCustomers,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    searchQuery,
    setSearchQuery,
    refresh: loadCustomers,
    hasActiveFilters,
  }
}

/**
 * 단일 고객 조회 훅
 */
export function useCustomer(customerId: string | null) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const { subscribe } = useDataSync()

  useEffect(() => {
    if (!customerId) {
      setCustomer(null)
      setLoading(false)
      return
    }

    const loadCustomer = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const customers = getAllCustomers()
        const found = customers.find(c => c.id === customerId)
        
        if (!found) {
          throw new Error(`Customer not found: ${customerId}`)
        }
        
        setCustomer(found)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load customer'))
      } finally {
        setLoading(false)
      }
    }

    loadCustomer()

    // 실시간 업데이트 구독
    const unsubscribe = subscribe('ALL', (message) => {
      if (message.type.includes('CUSTOMER')) {
        loadCustomer()
      }
    })

    return unsubscribe
  }, [customerId, subscribe])

  return { customer, loading, error }
}

/**
 * 고객 통계 훅
 */
export function useCustomerStats() {
  const { customers } = useCustomers()

  const stats = useMemo(() => {
    return {
      total: customers.length,
      inquiry: customers.filter(c => c.leadStatus === 'inquiry').length,
      consultation: customers.filter(c => c.leadStatus === 'consultation').length,
      proposal: customers.filter(c => c.leadStatus === 'proposal').length,
      contracted: customers.filter(c => c.leadStatus === 'contracted').length,
      completed: customers.filter(c => c.leadStatus === 'completed').length,
      cancelled: customers.filter(c => c.leadStatus === 'cancelled').length,
    }
  }, [customers])

  return stats
}

