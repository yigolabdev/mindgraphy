/**
 * Mock 데이터와 localStorage 데이터 통합 유틸리티
 * 
 * Mock 데이터와 사용자가 생성한 데이터(localStorage)를 통합하여 제공합니다.
 */

import { mockCustomers as mockCustomersBase, mockProjects as mockProjectsBase } from '@/lib/mock-data'
import { getStoredCustomers, getStoredProjects } from '@/lib/utils/customer-registration'
import type { Customer, Project } from '@/lib/types'

/**
 * 모든 고객 데이터 가져오기 (Mock + localStorage)
 * 
 * @returns 통합된 고객 목록
 */
export function getAllCustomers(): Customer[] {
  try {
    const mockCustomers = [...mockCustomersBase]
    const storedCustomers = getStoredCustomers()
    
    // 중복 제거 (ID 기준)
    const customerMap = new Map<string, Customer>()
    
    // Mock 데이터 먼저 추가
    mockCustomers.forEach(customer => {
      customerMap.set(customer.id, customer)
    })
    
    // localStorage 데이터 추가 (덮어쓰기)
    storedCustomers.forEach(customer => {
      customerMap.set(customer.id, customer)
    })
    
    // 배열로 변환 및 최신순 정렬
    return Array.from(customerMap.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('[Data Integration] Error getting all customers:', error)
    return mockCustomersBase
  }
}

/**
 * 모든 프로젝트 데이터 가져오기 (Mock + localStorage)
 * 
 * @returns 통합된 프로젝트 목록
 */
export function getAllProjects(): Project[] {
  try {
    const mockProjects = [...mockProjectsBase]
    const storedProjects = getStoredProjects()
    
    // 중복 제거 (ID 기준)
    const projectMap = new Map<string, Project>()
    
    // Mock 데이터 먼저 추가
    mockProjects.forEach(project => {
      projectMap.set(project.id, project)
    })
    
    // localStorage 데이터 추가 (덮어쓰기)
    storedProjects.forEach(project => {
      projectMap.set(project.id, project)
    })
    
    // 배열로 변환 및 최신순 정렬
    return Array.from(projectMap.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  } catch (error) {
    console.error('[Data Integration] Error getting all projects:', error)
    return mockProjectsBase
  }
}

/**
 * 특정 상태의 고객 필터링
 * 
 * @param leadStatus - 고객 상태
 * @returns 필터링된 고객 목록
 */
export function getCustomersByStatus(leadStatus: Customer['leadStatus']): Customer[] {
  const allCustomers = getAllCustomers()
  return allCustomers.filter(customer => customer.leadStatus === leadStatus)
}

/**
 * 특정 상태의 프로젝트 필터링
 * 
 * @param projectStatus - 프로젝트 상태
 * @returns 필터링된 프로젝트 목록
 */
export function getProjectsByStatus(projectStatus: Project['projectStatus']): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter(project => project.projectStatus === projectStatus)
}

/**
 * 고객 ID로 프로젝트 조회
 * 
 * @param customerId - 고객 ID
 * @returns 고객의 프로젝트 목록
 */
export function getProjectsByCustomerId(customerId: string): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter(project => project.customerId === customerId)
}

/**
 * 프로젝트 ID로 고객 조회
 * 
 * @param projectId - 프로젝트 ID
 * @returns 고객 정보
 */
export function getCustomerByProjectId(projectId: string): Customer | undefined {
  const allProjects = getAllProjects()
  const allCustomers = getAllCustomers()
  
  const project = allProjects.find(p => p.id === projectId)
  if (!project) return undefined
  
  return allCustomers.find(c => c.id === project.customerId)
}

/**
 * 신규 문의 고객 조회 (inquiry 상태)
 * 
 * @returns 신규 문의 고객 목록
 */
export function getInquiryCustomers(): Customer[] {
  return getCustomersByStatus('inquiry')
}

/**
 * 계약 완료 고객 조회 (contracted 상태)
 * 
 * @returns 계약 완료 고객 목록
 */
export function getContractedCustomers(): Customer[] {
  return getCustomersByStatus('contracted')
}

/**
 * 완료된 고객 조회 (completed 상태)
 * 
 * @returns 완료된 고객 목록
 */
export function getCompletedCustomers(): Customer[] {
  return getCustomersByStatus('completed')
}

/**
 * 작가가 배정된 프로젝트 조회
 * 
 * @param photographerId - 작가 ID
 * @returns 작가가 배정된 프로젝트 목록
 */
export function getProjectsByPhotographer(photographerId: string): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter(project => 
    project.assignedPhotographerIds?.includes(photographerId)
  )
}

/**
 * 작가가 미배정된 프로젝트 조회
 * 
 * @returns 작가 미배정 프로젝트 목록
 */
export function getUnassignedProjects(): Project[] {
  const allProjects = getAllProjects()
  return allProjects.filter(project => 
    !project.assignedPhotographerIds || project.assignedPhotographerIds.length === 0
  )
}

/**
 * 고객 검색
 * 
 * @param query - 검색어 (이름, 전화번호, 이메일)
 * @returns 검색 결과
 */
export function searchCustomers(query: string): Customer[] {
  if (!query.trim()) return getAllCustomers()
  
  const allCustomers = getAllCustomers()
  const lowerQuery = query.toLowerCase().trim()
  
  return allCustomers.filter(customer => {
    const searchText = [
      customer.groomName,
      customer.brideName,
      customer.groomPhone,
      customer.bridePhone,
      customer.email,
      customer.sourceChannel,
    ].join(' ').toLowerCase()
    
    return searchText.includes(lowerQuery)
  })
}

/**
 * 프로젝트 검색
 * 
 * @param query - 검색어 (프로젝트 번호, 고객 이름, 장소)
 * @returns 검색 결과
 */
export function searchProjects(query: string): Project[] {
  if (!query.trim()) return getAllProjects()
  
  const allProjects = getAllProjects()
  const allCustomers = getAllCustomers()
  const lowerQuery = query.toLowerCase().trim()
  
  return allProjects.filter(project => {
    const customer = allCustomers.find(c => c.id === project.customerId)
    
    const searchText = [
      project.projectNumber,
      project.weddingVenue,
      project.weddingDate,
      customer?.groomName,
      customer?.brideName,
    ].join(' ').toLowerCase()
    
    return searchText.includes(lowerQuery)
  })
}

/**
 * 데이터 통계 계산
 * 
 * @returns 전체 데이터 통계
 */
export function getDataStatistics() {
  const allCustomers = getAllCustomers()
  const allProjects = getAllProjects()
  
  return {
    totalCustomers: allCustomers.length,
    inquiryCustomers: allCustomers.filter(c => c.leadStatus === 'inquiry').length,
    consultationCustomers: allCustomers.filter(c => c.leadStatus === 'consultation').length,
    proposalCustomers: allCustomers.filter(c => c.leadStatus === 'proposal').length,
    contractedCustomers: allCustomers.filter(c => c.leadStatus === 'contracted').length,
    completedCustomers: allCustomers.filter(c => c.leadStatus === 'completed').length,
    cancelledCustomers: allCustomers.filter(c => c.leadStatus === 'cancelled').length,
    
    totalProjects: allProjects.length,
    scheduledProjects: allProjects.filter(p => p.projectStatus === 'scheduled').length,
    inProgressProjects: allProjects.filter(p => p.projectStatus === 'in_progress').length,
    proofReadyProjects: allProjects.filter(p => p.projectStatus === 'proof_ready').length,
    editingProjects: allProjects.filter(p => p.projectStatus === 'editing').length,
    completedProjects: allProjects.filter(p => p.projectStatus === 'completed').length,
    deliveredProjects: allProjects.filter(p => p.projectStatus === 'delivered').length,
    cancelledProjects: allProjects.filter(p => p.projectStatus === 'cancelled').length,
    
    unassignedProjects: getUnassignedProjects().length,
  }
}

/**
 * 데이터 새로고침 트리거
 * 다른 탭이나 컴포넌트에서 이 함수를 호출하여 데이터를 새로고침할 수 있습니다.
 */
export function refreshData() {
  // 커스텀 이벤트 발생
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mindgraphy:data-updated'))
  }
}

/**
 * 데이터 업데이트 리스너 등록
 * 
 * @param callback - 데이터 업데이트 시 호출될 콜백 함수
 * @returns 리스너 제거 함수
 */
export function onDataUpdate(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }
  
  const handler = () => callback()
  window.addEventListener('mindgraphy:data-updated', handler)
  
  return () => {
    window.removeEventListener('mindgraphy:data-updated', handler)
  }
}

