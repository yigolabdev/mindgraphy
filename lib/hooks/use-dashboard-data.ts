import { useState, useEffect } from 'react'
import type { DashboardStats } from '@/lib/types'

interface DashboardKPI {
  todaySchedules: number
  unassignedSchedules: number
  urgentDeadlines: number
  pendingProofs: number
}

interface SourceChannelData {
  name: string
  value: number
  color: string
}

/**
 * 대시보드 데이터 로딩 훅
 */
export function useDashboardData() {
  const [kpi, setKpi] = useState<DashboardKPI>({
    todaySchedules: 0,
    unassignedSchedules: 0,
    urgentDeadlines: 0,
    pendingProofs: 0
  })
  const [schedules, setSchedules] = useState<any[]>([])
  const [avgSatisfaction, setAvgSatisfaction] = useState(0)
  const [satisfactionCount, setSatisfactionCount] = useState(0)
  const [sourceChannelData, setSourceChannelData] = useState<SourceChannelData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Mock 데이터 import
      const { calculateDashboardKPI, getThisWeekSchedules } = await import('@/lib/mock/admin')
      const { mockCustomers } = await import('@/lib/mock-data')

      // KPI 계산
      setKpi(calculateDashboardKPI())
      
      // 일정 데이터
      setSchedules(getThisWeekSchedules())

      // 고객 만족도 계산
      const completedCustomersWithSatisfaction = mockCustomers.filter(
        c => c.leadStatus === 'completed' && c.satisfaction
      )
      const satisfaction = completedCustomersWithSatisfaction.length > 0
        ? completedCustomersWithSatisfaction.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / completedCustomersWithSatisfaction.length
        : 0

      setAvgSatisfaction(satisfaction)
      setSatisfactionCount(completedCustomersWithSatisfaction.length)

      // 고객 유입경로 집계
      const sourceChannelMap = new Map<string, number>()
      mockCustomers.forEach(customer => {
        const channel = customer.sourceChannel || '기타'
        sourceChannelMap.set(channel, (sourceChannelMap.get(channel) || 0) + 1)
      })

      // 색상 팔레트
      const colors = [
        '#10b981', // emerald
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#f59e0b', // amber
        '#ef4444', // red
        '#06b6d4', // cyan
        '#ec4899', // pink
        '#84cc16', // lime
      ]

      const sourceData = Array.from(sourceChannelMap.entries())
        .map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value)

      setSourceChannelData(sourceData)
      setError(null)
    } catch (err) {
      setError('대시보드 데이터를 불러오는데 실패했습니다')
      console.error('Error loading dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    kpi,
    schedules,
    avgSatisfaction,
    satisfactionCount,
    sourceChannelData,
    isLoading,
    error,
    refetch: loadDashboardData
  }
}
