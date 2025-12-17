import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Customer } from '@/lib/types'
import type { FilterState, SortState } from '@/lib/types'

/**
 * 고객 데이터 관리 훅
 * 
 * - 데이터 로딩
 * - 필터링
 * - 정렬
 * - 검색
 */
export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setIsLoading(true)
      const { mockCustomers } = await import('@/lib/mock-data')
      setCustomers(mockCustomers)
      setError(null)
    } catch (err) {
      setError('고객 데이터를 불러오는데 실패했습니다')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = useCallback(() => {
    loadCustomers()
  }, [])

  return {
    customers,
    isLoading,
    error,
    refetch
  }
}

/**
 * 고객 필터링 훅
 */
export function useCustomerFilter(customers: Customer[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    leadStatus: 'all',
    sourceType: 'all',
    satisfaction: 'all'
  })
  const [sortState, setSortState] = useState<SortState>({
    field: 'createdAt',
    direction: 'desc'
  })

  // 필터링된 고객
  const filteredCustomers = useMemo(() => {
    let result = [...customers]

    // 검색
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(customer => 
        customer.groomName.toLowerCase().includes(searchLower) ||
        customer.brideName.toLowerCase().includes(searchLower) ||
        customer.groomPhone.includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      )
    }

    // 상태 필터
    if (filters.leadStatus && filters.leadStatus !== 'all') {
      result = result.filter(c => c.leadStatus === filters.leadStatus)
    }

    // 유입 경로 필터
    if (filters.sourceType && filters.sourceType !== 'all') {
      result = result.filter(c => c.sourceType === filters.sourceType)
    }

    // 만족도 필터
    if (filters.satisfaction && filters.satisfaction !== 'all') {
      const satisfaction = Number(filters.satisfaction)
      result = result.filter(c => c.satisfaction === satisfaction)
    }

    return result
  }, [customers, filters])

  // 정렬된 고객
  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers]
    
    sorted.sort((a, b) => {
      const aValue = a[sortState.field as keyof Customer]
      const bValue = b[sortState.field as keyof Customer]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      return 0
    })

    return sorted
  }, [filteredCustomers, sortState])

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      leadStatus: 'all',
      sourceType: 'all',
      satisfaction: 'all'
    })
  }, [])

  const updateSort = useCallback((field: string) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  return {
    filteredCustomers: sortedCustomers,
    filters,
    sortState,
    updateFilter,
    clearFilters,
    updateSort,
    hasActiveFilters: filters.search !== '' || filters.leadStatus !== 'all' || filters.sourceType !== 'all' || filters.satisfaction !== 'all'
  }
}

/**
 * 고객 통계 훅
 */
export function useCustomerStats(customers: Customer[]) {
  return useMemo(() => {
    const total = customers.length
    const active = customers.filter(c => 
      c.leadStatus !== 'completed' && c.leadStatus !== 'cancelled'
    ).length
    const completed = customers.filter(c => c.leadStatus === 'completed').length
    const cancelled = customers.filter(c => c.leadStatus === 'cancelled').length

    // 만족도 평균
    const withSatisfaction = customers.filter(c => c.satisfaction)
    const avgSatisfaction = withSatisfaction.length > 0
      ? withSatisfaction.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / withSatisfaction.length
      : 0

    // 유입 경로별 집계
    const bySource: Record<string, number> = {}
    customers.forEach(c => {
      const source = c.sourceChannel || '기타'
      bySource[source] = (bySource[source] || 0) + 1
    })

    return {
      total,
      active,
      completed,
      cancelled,
      avgSatisfaction,
      satisfactionCount: withSatisfaction.length,
      bySource
    }
  }, [customers])
}
