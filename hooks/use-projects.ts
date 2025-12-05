/**
 * 프로젝트 관련 커스텀 훅
 * 
 * 프로젝트 데이터 조회, 필터링, 검색 등의 로직을 통합 관리합니다.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllProjects, getAllCustomers, searchProjects } from '@/lib/utils/data-integration'
import { useDataSync } from '@/lib/utils/sync'
import type { Project } from '@/lib/types'

export interface UseProjectsOptions {
  initialFilters?: ProjectFilters
  autoRefresh?: boolean
}

export interface ProjectFilters {
  status?: string
  startDate?: string
  endDate?: string
  photographer?: string
  searchQuery?: string
  projectType?: string
}

export interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: Error | null
  filters: ProjectFilters
  updateFilter: (key: keyof ProjectFilters, value: string) => void
  resetFilters: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  refresh: () => Promise<void>
  hasActiveFilters: boolean
}

/**
 * 프로젝트 데이터 관리 훅
 */
export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { initialFilters = {}, autoRefresh = true } = options
  
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { subscribe } = useDataSync()

  // 데이터 로드
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock 지연 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const data = getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load projects'))
    } finally {
      setLoading(false)
    }
  }, [])

  // 초기 로드
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // 실시간 동기화
  useEffect(() => {
    if (!autoRefresh) return

    const unsubscribe = subscribe('ALL', (message) => {
      if (
        message.type.includes('PROJECT') || 
        message.type.includes('PHOTOGRAPHER') ||
        message.type === 'DATA_REFRESHED'
      ) {
        loadProjects()
      }
    })

    return unsubscribe
  }, [subscribe, autoRefresh, loadProjects])

  // 필터링된 프로젝트
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    // 검색어 필터
    if (searchQuery) {
      result = searchProjects(searchQuery)
    }

    // 상태 필터
    if (filters.status && filters.status !== 'all') {
      result = result.filter(p => p.projectStatus === filters.status)
    }

    // 프로젝트 타입 필터
    if (filters.projectType && filters.projectType !== 'all') {
      result = result.filter(p => p.projectType === filters.projectType)
    }

    // 날짜 필터
    if (filters.startDate) {
      result = result.filter(p => p.weddingDate >= filters.startDate!)
    }
    if (filters.endDate) {
      result = result.filter(p => p.weddingDate <= filters.endDate!)
    }

    // 작가 필터
    if (filters.photographer && filters.photographer !== 'all') {
      result = result.filter(p => 
        p.assignedPhotographerIds?.includes(filters.photographer!)
      )
    }

    return result
  }, [projects, filters, searchQuery])

  // 필터 업데이트
  const updateFilter = useCallback((key: keyof ProjectFilters, value: string) => {
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
      (!!filters.status && filters.status !== 'all') ||
      (!!filters.projectType && filters.projectType !== 'all') ||
      !!filters.startDate ||
      !!filters.endDate ||
      (!!filters.photographer && filters.photographer !== 'all')
    )
  }, [filters, searchQuery])

  return {
    projects: filteredProjects,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    searchQuery,
    setSearchQuery,
    refresh: loadProjects,
    hasActiveFilters,
  }
}

/**
 * 단일 프로젝트 조회 훅
 */
export function useProject(projectId: string | null) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const { subscribe } = useDataSync()

  useEffect(() => {
    if (!projectId) {
      setProject(null)
      setLoading(false)
      return
    }

    const loadProject = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const projects = getAllProjects()
        const found = projects.find(p => p.id === projectId)
        
        if (!found) {
          throw new Error(`Project not found: ${projectId}`)
        }
        
        setProject(found)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load project'))
      } finally {
        setLoading(false)
      }
    }

    loadProject()

    // 실시간 업데이트 구독
    const unsubscribe = subscribe('ALL', (message) => {
      if (message.type.includes('PROJECT')) {
        loadProject()
      }
    })

    return unsubscribe
  }, [projectId, subscribe])

  return { project, loading, error }
}

/**
 * 프로젝트 통계 훅
 */
export function useProjectStats() {
  const { projects } = useProjects()

  const stats = useMemo(() => {
    return {
      total: projects.length,
      scheduled: projects.filter(p => p.projectStatus === 'scheduled').length,
      inProgress: projects.filter(p => p.projectStatus === 'in_progress').length,
      proofReady: projects.filter(p => p.projectStatus === 'proof_ready').length,
      editing: projects.filter(p => p.projectStatus === 'editing').length,
      completed: projects.filter(p => p.projectStatus === 'completed').length,
      delivered: projects.filter(p => p.projectStatus === 'delivered').length,
      unassigned: projects.filter(p => 
        !p.assignedPhotographerIds || p.assignedPhotographerIds.length === 0
      ).length,
    }
  }, [projects])

  return stats
}

