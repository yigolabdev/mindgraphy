/**
 * 고객 등록 유틸리티
 * 
 * 고객용 페이지에서 수집한 정보를 Mock 데이터에 추가합니다.
 * 향후 백엔드 API 연동 시 이 파일의 함수들을 API 호출로 대체하면 됩니다.
 */

import type { Customer, Project } from '@/lib/types'
import type { ClientFormData } from './session-storage'
import { toISODate, toStandardTime } from './format'
import { broadcastCustomerCreated, broadcastProjectCreated, broadcastCustomerStatusChanged } from './sync'
import { handleError, createValidationError } from './error-handling'

/**
 * 신규 고객 ID 생성
 */
export function generateCustomerId(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `customer-${timestamp}-${random}`
}

/**
 * 신규 프로젝트 ID 생성
 */
export function generateProjectId(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `project-${timestamp}-${random}`
}

/**
 * 프로젝트 번호 생성
 */
export function generateProjectNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000 // 1000-9999
  return `PRJ-${year}-${random}`
}

/**
 * ClientFormData를 Customer 객체로 변환
 */
export function convertToCustomer(formData: ClientFormData, customerId: string): Customer {
  return {
    id: customerId,
    groomName: formData.groomName || '',
    brideName: formData.brideName || '',
    groomPhone: formData.groomPhone || '',
    bridePhone: formData.bridePhone || '',
    email: formData.email || '',
    sourceChannel: formData.referralSource || '고객용 페이지',
    sourceType: 'client-direct', // 고객용 페이지에서 직접 문의
    leadStatus: 'inquiry', // 신규 문의 상태
    assignedManagerId: 'user-2', // 기본 담당자 (김매니저)
    notes: formData.specialRequests || '',
    createdAt: new Date().toISOString(),
  }
}

/**
 * ClientFormData를 Project 객체로 변환
 */
export function convertToProject(
  formData: ClientFormData, 
  customerId: string,
  projectId: string
): Project {
  return {
    id: projectId,
    projectNumber: generateProjectNumber(),
    customerId: customerId,
    contractId: '', // 계약 전 상태
    projectType: (formData.productType || 'wedding') as any,
    projectStatus: 'scheduled', // 일정 미확정
    packageId: formData.packageId || '',
    optionIds: formData.optionIds || [],
    weddingDate: toISODate(formData.weddingDate) || '',  // ✅ 포맷 통일
    weddingTime: toStandardTime(formData.weddingTime) || '',  // ✅ 포맷 통일
    weddingVenue: formData.weddingVenue || '',
    specialRequests: formData.specialRequests || '',
    referralSource: formData.referralSource || '고객용 페이지',
    assignedPhotographerIds: [], // 작가 미배정
    assignedPhotographers: [],
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * 고객 및 프로젝트 등록
 * 
 * 향후 백엔드 연동 시 이 함수를 API 호출로 대체:
 * 
 * ```typescript
 * export async function registerCustomerAndProject(formData: ClientFormData) {
 *   const response = await fetch('/api/customers/register', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(formData)
 *   })
 *   
 *   if (!response.ok) {
 *     throw new Error('Failed to register customer')
 *   }
 *   
 *   return await response.json()
 * }
 * ```
 */
export function registerCustomerAndProject(formData: ClientFormData): {
  customer: Customer
  project: Project
  success: boolean
} {
  try {
    // 필수 필드 검증
    if (!formData.groomName || !formData.brideName) {
      throw createValidationError('신랑/신부 이름은 필수입니다')
    }
    
    if (!formData.groomPhone && !formData.bridePhone) {
      throw createValidationError('최소 한 명의 연락처가 필요합니다')
    }
    
    const customerId = generateCustomerId()
    const projectId = generateProjectId()
    
    const customer = convertToCustomer(formData, customerId)
    const project = convertToProject(formData, customerId, projectId)
    
    // Mock 데이터에 추가 (localStorage에 저장)
    const existingCustomers = getStoredCustomers()
    const existingProjects = getStoredProjects()
    
    existingCustomers.push(customer)
    existingProjects.push(project)
    
    localStorage.setItem('mindgraphy_mock_customers', JSON.stringify(existingCustomers))
    localStorage.setItem('mindgraphy_mock_projects', JSON.stringify(existingProjects))
    
    console.log('[Customer Registration] New customer created:', customer)
    console.log('[Customer Registration] New project created:', project)
    
    // ✅ 실시간 동기화: 다른 탭에 알림
    broadcastCustomerCreated(customer.id, `${customer.groomName} & ${customer.brideName}`)
    broadcastProjectCreated(project.id, project.projectNumber)
    
    return {
      customer,
      project,
      success: true
    }
  } catch (error) {
    handleError(error, 'Customer Registration', '고객 등록에 실패했습니다')
    return {
      customer: {} as Customer,
      project: {} as Project,
      success: false
    }
  }
}

/**
 * localStorage에서 저장된 고객 목록 가져오기
 */
export function getStoredCustomers(): Customer[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('mindgraphy_mock_customers')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[Customer Registration] Error loading customers:', error)
    return []
  }
}

/**
 * localStorage에서 저장된 프로젝트 목록 가져오기
 */
export function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem('mindgraphy_mock_projects')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('[Customer Registration] Error loading projects:', error)
    return []
  }
}

/**
 * 특정 고객 조회
 */
export function getStoredCustomerById(customerId: string): Customer | undefined {
  const customers = getStoredCustomers()
  return customers.find(c => c.id === customerId)
}

/**
 * 특정 프로젝트 조회
 */
export function getStoredProjectById(projectId: string): Project | undefined {
  const projects = getStoredProjects()
  return projects.find(p => p.id === projectId)
}

/**
 * 신규 문의 고객 목록 조회
 */
export function getInquiryCustomers(): Customer[] {
  const customers = getStoredCustomers()
  return customers.filter(c => c.leadStatus === 'inquiry')
}

/**
 * 고객 상태 업데이트
 * 
 * 향후 백엔드 연동 시:
 * ```typescript
 * export async function updateCustomerStatus(customerId: string, newStatus: Customer['leadStatus']) {
 *   const response = await fetch(`/api/customers/${customerId}/status`, {
 *     method: 'PATCH',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ leadStatus: newStatus })
 *   })
 *   return await response.json()
 * }
 * ```
 */
export function updateCustomerStatus(
  customerId: string, 
  newStatus: Customer['leadStatus']
): boolean {
  try {
    const customers = getStoredCustomers()
    const index = customers.findIndex(c => c.id === customerId)
    
    if (index === -1) {
      throw createValidationError(`고객을 찾을 수 없습니다: ${customerId}`)
    }
    
    const oldStatus = customers[index].leadStatus
    customers[index].leadStatus = newStatus
    localStorage.setItem('mindgraphy_mock_customers', JSON.stringify(customers))
    
    console.log('[Customer Registration] Status updated:', customerId, newStatus)
    
    // ✅ 실시간 동기화: 다른 탭에 알림
    broadcastCustomerStatusChanged(customerId, oldStatus, newStatus)
    
    return true
  } catch (error) {
    handleError(error, 'Customer Status Update', '고객 상태 업데이트에 실패했습니다')
    return false
  }
}

/**
 * leadStatus를 고객용 포털의 currentStep으로 매핑
 * 
 * 플로우:
 * 1. 고객 신청 완료 → inquiry (신규 문의) → step 0 (일정확인중)
 * 2. 업무 시스템 확인 → consultation (상담중) → step 0 (일정확인중)
 * 3. 담당자가 일정 확정 → proposal (제안) → step 1 (일정확정)
 * 4. 계약서 작성 완료 → contracted (계약 완료) → step 2 (입금대기)
 * 5. 입금 완료 → contracted + isPaid → step 3 (촬영대기)
 * 6. 촬영 완료 → proof_ready → step 4 (사진선택)
 * 7. 편집 중 → editing → step 5 (편집중)
 * 8. 배송 완료 → completed/delivered → step 6 (배송완료)
 */
export function mapLeadStatusToCurrentStep(
  leadStatus: Customer['leadStatus'],
  projectStatus?: Project['projectStatus'],
  isPaid?: boolean
): number {
  // 취소된 경우
  if (leadStatus === 'cancelled') {
    return 0
  }
  
  // 완료된 경우 - 프로젝트 상태에 따라 세분화
  if (leadStatus === 'completed') {
    if (projectStatus === 'delivered') return 6 // 배송완료
    if (projectStatus === 'editing') return 5 // 편집중
    if (projectStatus === 'proof_ready') return 4 // 사진선택
    return 6 // 기본값: 배송완료
  }
  
  // 계약 완료 - 결제 여부와 프로젝트 상태에 따라
  if (leadStatus === 'contracted') {
    if (projectStatus === 'proof_ready') return 4 // 사진선택
    if (projectStatus === 'editing') return 5 // 편집중
    if (projectStatus === 'delivered') return 6 // 배송완료
    if (projectStatus === 'completed') return 6 // 완료
    
    // 촬영 전 단계
    if (isPaid) {
      return 3 // 촬영대기
    }
    return 2 // 입금대기
  }
  
  // 제안 단계 - 일정이 확정된 것으로 간주
  if (leadStatus === 'proposal') {
    return 1 // 일정확정
  }
  
  // 상담중 또는 신규 문의
  return 0 // 일정확인중
}

/**
 * 전화번호로 고객 조회 (고객용 로그인)
 */
export function getCustomerByPhone(phone: string): Customer | undefined {
  const customers = getStoredCustomers()
  return customers.find(c => 
    c.groomPhone === phone || c.bridePhone === phone
  )
}

/**
 * 고객 ID로 연결된 프로젝트 조회
 */
export function getProjectByCustomerId(customerId: string): Project | undefined {
  const projects = getStoredProjects()
  return projects.find(p => p.customerId === customerId)
}

