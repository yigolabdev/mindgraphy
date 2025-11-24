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
  permission?: PagePermission // 작가에게 세부 권한 부여 시 사용
}

// 전체 네비게이션 아이템
export const navigationItems: NavItem[] = [
  // 관리자 전용
  {
    title: '대시보드',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['admin'],
    permission: 'dashboard',
  },
  
  // 실시간 현황판
  {
    title: '실시간 현황판',
    href: '/admin/live-status',
    icon: Activity,
    roles: ['admin', 'photographer'],
    permission: 'live-status',
  },
  
  // 공통 (권한에 따라 기능 차이)
  {
    title: '촬영 캘린더',
    href: '/admin/calendar',
    icon: Camera,
    roles: ['admin', 'photographer'],
    permission: 'calendar',
  },
  
  // 관리자 전용
  {
    title: '일정 관리',
    href: '/admin/schedule',
    icon: CalendarCheck,
    roles: ['admin'],
    permission: 'schedule',
  },
  
  // 작가 전용
  {
    title: '내 일정',
    href: '/admin/my',
    icon: ClipboardList,
    roles: ['photographer'],
    permission: 'my-schedule',
  },
  
  // 관리자 + 작가 (작가는 배정된 프로젝트만)
  {
    title: '촬영 관리',
    href: '/admin/projects',
    icon: FolderOpen,
    roles: ['admin', 'photographer'],
    permission: 'projects',
  },
  
  // 관리자 전용
  {
    title: '고객 관리',
    href: '/admin/customers',
    icon: UserCircle,
    roles: ['admin'],
    permission: 'customers',
  },
  
  {
    title: '팀 관리',
    href: '/admin/team',
    icon: Users,
    roles: ['admin'],
    permission: 'team',
  },
  
  {
    title: '소통게시판',
    href: '/admin/board',
    icon: MessageSquare,
    roles: ['admin', 'photographer'],
    permission: 'board',
  },
  
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin'],
    permission: 'settings',
  },
]

// 역할 및 권한에 따른 네비게이션 필터링
export function getNavigationForRole(role: UserRole, userPermissions?: PagePermission[]): NavItem[] {
  // 관리자는 모든 네비게이션 아이템 접근 가능
  if (role === 'admin') {
    return navigationItems.filter((item) => item.roles.includes(role))
  }
  
  // 작가의 경우 권한 체크
  if (role === 'photographer' && userPermissions) {
    return navigationItems.filter((item) => {
      // 기본적으로 작가 역할이 포함되어 있어야 함
      if (!item.roles.includes(role)) return false
      
      // permission이 정의되어 있으면 사용자 권한에 포함되어 있어야 함
      if (item.permission) {
        return userPermissions.includes(item.permission)
      }
      
      return true
    })
  }
  
  // 권한이 없는 작가는 기본 역할만으로 필터링
  return navigationItems.filter((item) => item.roles.includes(role))
}

// 페이지 접근 권한 체크
export function hasPageAccess(
  path: string, 
  role: UserRole, 
  userPermissions?: PagePermission[]
): boolean {
  // 관리자는 모든 페이지 접근 가능
  if (role === 'admin') {
    return true
  }
  
  // 웹 갤러리 업로드 페이지
  if (path.startsWith('/admin/gallery/')) {
    if (role === 'photographer') {
      return userPermissions?.includes('gallery-upload') ?? false
    }
    return true
  }
  
  // 타임 테이블 페이지
  if (path.startsWith('/admin/timetable/')) {
    if (role === 'photographer') {
      return userPermissions?.includes('timetable') ?? false
    }
    return true
  }
  
  // 네비게이션 아이템 찾기
  const item = navigationItems.find((item) => path.startsWith(item.href))
  
  // 네비게이션에 없는 경로
  if (!item) {
    // 설정 페이지는 관리자만
    if (path.startsWith('/admin/settings')) {
      return role === 'admin'
    }
    return true
  }
  
  // 기본 역할 체크
  if (!item.roles.includes(role)) {
    return false
  }
  
  // 작가의 경우 세부 권한 체크
  if (role === 'photographer' && item.permission && userPermissions) {
    return userPermissions.includes(item.permission)
  }
  
  return true
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
