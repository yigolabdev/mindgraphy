// 권한 및 인증 관련 타입

export type UserRole = 'admin' | 'photographer'

// 페이지별 접근 권한 정의
export type PagePermission = 
  | 'dashboard'           // 대시보드
  | 'live-status'         // 실시간 현황판
  | 'calendar'            // 촬영 캘린더
  | 'schedule'            // 일정 관리 (관리자만)
  | 'my-schedule'         // 내 일정 (작가만)
  | 'projects'            // 촬영 관리
  | 'customers'           // 고객 관리 (관리자만)
  | 'team'                // 팀 관리 (관리자만)
  | 'board'               // 소통게시판
  | 'settings'            // 설정 (관리자만)
  | 'gallery-upload'      // 웹 갤러리 업로드
  | 'timetable'           // 타임 테이블 관리

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  assignedProjects?: string[] // 작가의 경우 배정된 프로젝트 ID들
  permissions?: PagePermission[] // 작가의 경우 허용된 페이지 권한
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

// 작가 권한 설정 인터페이스
export interface PhotographerPermissions {
  photographerId: string
  permissions: PagePermission[]
  updatedAt: string
  updatedBy: string // 관리자 ID
}
