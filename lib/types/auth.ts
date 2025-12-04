/**
 * 권한 및 인증 관련 타입 정의
 */

/**
 * 사용자 역할 타입
 * - admin: 관리자 (대표) - 모든 권한 보유
 * - staff: 직원 (작가, 에디터, 코디네이터 등) - 관리자가 페이지별 권한 부여
 */
export type UserRole = 'admin' | 'staff'

/**
 * 페이지별 접근 권한 정의
 * 관리자는 모든 페이지 접근 가능
 * 직원은 관리자가 부여한 권한만 접근 가능
 */
export type PagePermission = 
  | 'dashboard'           // 대시보드
  | 'live-status'         // 실시간 현황판
  | 'calendar'            // 촬영 캘린더
  | 'schedule'            // 일정 관리
  | 'my-schedule'         // 내 일정
  | 'projects'            // 촬영 관리
  | 'customers'           // 고객 관리
  | 'team'                // 팀 관리
  | 'board'               // 소통게시판
  | 'settings'            // 설정
  | 'gallery-upload'      // 웹 갤러리 업로드
  | 'timetable'           // 타임 테이블 관리

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  jobTitle?: string // 직원의 직책 (작가, 에디터, 코디네이터 등)
  assignedProjects?: string[] // 직원의 경우 배정된 프로젝트 ID들
  permissions?: PagePermission[] // 직원의 경우 관리자가 부여한 페이지 권한
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

/**
 * 직원 권한 설정 인터페이스
 * 관리자가 직원에게 부여한 페이지별 접근 권한
 */
export interface StaffPermissions {
  staffId: string
  permissions: PagePermission[]
  updatedAt: string
  updatedBy: string // 관리자 ID
}

// 하위 호환성을 위한 타입 별칭
export type PhotographerPermissions = StaffPermissions
