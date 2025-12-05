/**
 * Mock 사용자 계정 데이터
 * 실제 프로덕션 환경에서는 API를 통해 인증해야 합니다.
 */

import type { PagePermission, UserRole } from './types/auth'

export interface MockUser {
  id: string
  email: string
  password: string
  role: UserRole // 'admin' | 'staff'
  name: string
  jobTitle?: 'photographer' | 'editor' | 'coordinator' | 'other'
  permissions?: PagePermission[]
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'admin-1',
    email: 'admin@mindgraphy.com',
    password: 'admin1234',
    role: 'admin',
    name: '김관리자',
  },
  {
    id: 'photo-1',
    email: 'photographer1@mindgraphy.com',
    password: 'photo1234',
    role: 'staff',
    jobTitle: 'photographer',
    name: '박작가',
    permissions: [
      'live-status',
      'calendar',
      'my-schedule',
      'projects',
      'board',
      'gallery-upload',
      'timetable',
    ],
  },
  {
    id: 'photo-2',
    email: 'photographer2@mindgraphy.com',
    password: 'photo1234',
    role: 'staff',
    jobTitle: 'photographer',
    name: '최작가',
    permissions: [
      'calendar',
      'my-schedule',
      'projects',
    ],
  },
  {
    id: 'editor-1',
    email: 'editor@mindgraphy.com',
    password: 'edit1234',
    role: 'staff',
    jobTitle: 'editor',
    name: '이에디터',
    permissions: ['projects', 'board'],
  },
]

/**
 * 이메일과 비밀번호로 사용자 찾기
 */
export function findUserByCredentials(email: string, password: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.email === email && user.password === password)
}

/**
 * ID로 사용자 찾기
 */
export function findUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((user) => user.id === id)
}

/**
 * 역할별 사용자 목록 가져오기
 */
export function getUsersByRole(role: MockUser['role']): MockUser[] {
  return MOCK_USERS.filter((user) => user.role === role)
}


// Alias export for backward compatibility
export const mockUsers = MOCK_USERS
