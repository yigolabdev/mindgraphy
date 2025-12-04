import type { UserRole, PagePermission } from '@/lib/types/auth'
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  Settings,
  Camera,
  ClipboardList,
  Activity,
  Users,
  UserCircle,
  CalendarCheck,
  MessageSquare,
  type LucideIcon
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: number
  roles: UserRole[] // 접근 가능한 기본 권한
  permission?: PagePermission // 직원에게 세부 권한 부여 시 사용
}

/**
 * 전체 네비게이션 아이템
 * - 관리자는 모든 페이지 접근 가능
 * - 직원은 권한이 부여된 페이지만 접근 가능
 */
export const navigationItems: NavItem[] = [
  {
    title: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'staff'],
    permission: 'dashboard',
  },
  
  {
    title: '실시간 현황판',
    href: '/admin/live-status',
    icon: Activity,
    roles: ['admin', 'staff'],
    permission: 'live-status',
  },
  
  {
    title: '촬영 캘린더',
    href: '/admin/calendar',
    icon: Camera,
    roles: ['admin', 'staff'],
    permission: 'calendar',
  },
  
  {
    title: '일정 관리',
    href: '/admin/schedule',
    icon: CalendarCheck,
    roles: ['admin', 'staff'],
    permission: 'schedule',
  },
  
  {
    title: '내 일정',
    href: '/admin/my',
    icon: ClipboardList,
    roles: ['admin', 'staff'],
    permission: 'my-schedule',
  },
  
  {
    title: '촬영 관리',
    href: '/admin/projects',
    icon: FolderOpen,
    roles: ['admin', 'staff'],
    permission: 'projects',
  },
  
  {
    title: '고객 관리',
    href: '/admin/customers',
    icon: UserCircle,
    roles: ['admin', 'staff'],
    permission: 'customers',
  },
  
  {
    title: '팀 관리',
    href: '/admin/team',
    icon: Users,
    roles: ['admin', 'staff'],
    permission: 'team',
  },
  
  {
    title: '소통게시판',
    href: '/admin/board',
    icon: MessageSquare,
    roles: ['admin', 'staff'],
    permission: 'board',
  },
  
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin', 'staff'],
    permission: 'settings',
  },
]

/**
 * 역할 및 권한에 따른 네비게이션 필터링
 * - 관리자: 모든 네비게이션 아이템 접근 가능
 * - 직원: 관리자가 부여한 권한에 따라 네비게이션 아이템 필터링
 */
export function getNavigationForRole(role: UserRole, userPermissions?: PagePermission[]): NavItem[] {
  // 관리자는 모든 네비게이션 아이템 접근 가능
  if (role === 'admin') {
    return navigationItems.filter((item) => item.roles.includes('admin'))
  }
  
  // 직원은 권한이 부여된 항목만 접근 가능
  if (role === 'staff' && userPermissions) {
    return navigationItems.filter((item) => {
      // roles에 staff가 포함되어 있어야 함
      if (!item.roles.includes('staff')) return false
      
      // permission이 정의되어 있으면 사용자 권한에 포함되어 있어야 함
      if (item.permission) {
        return userPermissions.includes(item.permission)
      }
      
      return false
    })
  }
  
  // 권한이 없는 직원은 빈 배열 반환
  return []
}

/**
 * 페이지 접근 권한 체크
 * - 관리자: 모든 페이지 접근 가능
 * - 직원: 관리자가 부여한 권한이 있는 페이지만 접근 가능
 */
export function hasPageAccess(
  path: string, 
  role: UserRole, 
  userPermissions?: PagePermission[]
): boolean {
  // 관리자는 모든 페이지 접근 가능
  if (role === 'admin') {
    return true
  }
  
  // 직원의 경우 권한 체크
  if (role === 'staff') {
    // 권한이 없으면 접근 불가
    if (!userPermissions || userPermissions.length === 0) {
      return false
    }
    
    // 웹 갤러리 업로드 페이지
    if (path.startsWith('/admin/gallery/')) {
      return userPermissions.includes('gallery-upload')
    }
    
    // 타임 테이블 페이지
    if (path.startsWith('/admin/timetable/')) {
      return userPermissions.includes('timetable')
    }
    
    // 네비게이션 아이템 찾기
    const item = navigationItems.find((item) => path.startsWith(item.href))
    
    if (item && item.permission) {
      return userPermissions.includes(item.permission)
    }
    
    // 매칭되는 네비게이션 아이템이 없으면 접근 불가
    return false
  }
  
  // 알 수 없는 역할은 접근 불가
  return false
}

// 모든 권한 목록 반환 (관리자용 UI에서 사용)
export function getAllPermissions(): { value: PagePermission; label: string; description: string }[] {
  return [
    { value: 'live-status', label: '실시간 현황판', description: '실시간 촬영 현황 모니터링' },
    { value: 'calendar', label: '촬영 캘린더', description: '전체 촬영 일정 확인' },
    { value: 'my-schedule', label: '내 일정', description: '개인 촬영 일정 관리' },
    { value: 'projects', label: '촬영 관리', description: '배정된 촬영 프로젝트 조회 및 관리' },
    { value: 'board', label: '소통게시판', description: '팀원 간 소통 게시판' },
    { value: 'gallery-upload', label: '웹 갤러리 업로드', description: '고객 웹 갤러리 사진 업로드' },
    { value: 'timetable', label: '타임 테이블 관리', description: '촬영 당일 일정 타임라인 작성' },
  ]
}
