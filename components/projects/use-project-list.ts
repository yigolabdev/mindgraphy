import { useState, useMemo } from 'react'
import { mockProjects } from '@/lib/mock-data'

export interface ProjectFilterState {
  searchQuery: string
  statusFilter: string
  photographerFilter: string
  packageFilter: string
  sortBy: 'latest' | 'date' | 'progress' | 'name'
}

interface UserInfo {
  id: string
  role: string
  email: string
}

export function useProjectList(
  initialProjects: typeof mockProjects, 
  currentUser: UserInfo | null, 
  activeTab: string
) {
  const [filters, setFilters] = useState<ProjectFilterState>({
    searchQuery: '',
    statusFilter: 'all',
    photographerFilter: 'all',
    packageFilter: 'all',
    sortBy: 'latest'
  })

  // Get unique photographers
  const photographers = useMemo(() => {
    const photoSet = new Set<string>()
    initialProjects.forEach(p => {
      p.assignedPhotographers?.forEach(ph => {
        const name = ph.user ? `${ph.user.lastName}${ph.user.firstName}` : '미배정'
        photoSet.add(name)
      })
    })
    return Array.from(photoSet)
  }, [initialProjects])

  // Filtered projects
  const filteredProjects = useMemo(() => {
    let filtered = [...initialProjects]
    
    // 1. Tab & Role based filtering
    if (activeTab === 'photographer' && currentUser?.role === 'photographer') {
      // In photographer tab, photographers only see their own projects
      filtered = filtered.filter(p => 
        p.assignedPhotographers?.some(ph => 
          ph.user?.email === currentUser.email || ph.userId === currentUser.id
        )
      )
    }
    
    // 2. Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.customer?.groomName?.toLowerCase().includes(query) ||
        p.customer?.brideName?.toLowerCase().includes(query) ||
        p.projectNumber?.toLowerCase().includes(query)
      )
    }
    
    // 3. Status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(p => p.projectStatus === filters.statusFilter)
    }
    
    // 4. Photographer filter
    if (filters.photographerFilter !== 'all') {
      filtered = filtered.filter(p => 
        p.assignedPhotographers?.some(ph => {
          const name = ph.user ? `${ph.user.lastName}${ph.user.firstName}` : '미배정'
          return name === filters.photographerFilter
        })
      )
    }
    
    // 5. Package filter
    if (filters.packageFilter !== 'all') {
      filtered = filtered.filter(p => p.projectType === filters.packageFilter)
    }
    
    // 6. Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'date':
          return new Date(a.weddingDate).getTime() - new Date(b.weddingDate).getTime()
        case 'progress':
          return (b.progress || 0) - (a.progress || 0)
        case 'name':
          return (a.customer?.groomName || '').localeCompare(b.customer?.groomName || '')
        default:
          return 0
      }
    })
    
    return filtered
  }, [initialProjects, filters, currentUser, activeTab])

  const updateFilter = (key: keyof ProjectFilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: 'all',
      photographerFilter: 'all',
      packageFilter: 'all',
      sortBy: 'latest'
    })
  }

  const hasActiveFilters = 
    filters.statusFilter !== 'all' || 
    filters.photographerFilter !== 'all' || 
    filters.packageFilter !== 'all' || 
    !!filters.searchQuery

  return {
    projects: filteredProjects,
    filters,
    photographers,
    updateFilter,
    resetFilters,
    hasActiveFilters
  }
}

