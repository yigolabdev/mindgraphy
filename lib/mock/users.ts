import type { User } from '@/lib/types/auth'

export type TeamUserRole = 'admin' | 'photographer' | 'editor' | 'coordinator'
export type UserStatus = 'active' | 'inactive' | 'on_leave'

export interface TeamUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: TeamUserRole
  status: UserStatus
  phone?: string
  joinDate: string
  lastLogin?: string
  avatar?: string
  password?: string // For mock login only
  
  // Photographer specific
  photographerStats?: {
    totalProjects: number
    completedProjects: number
    ongoingProjects: number
    averageRating: number
    totalRevenue: number
    thisMonthProjects: number
    onTimeDeliveryRate: number
    customerSatisfaction: number
  }
}

// Mock team users
export const mockTeamUsers: TeamUser[] = [
  {
    id: 'user-001',
    email: 'admin@mindgraphy.com',
    firstName: '관리자',
    lastName: '김',
    role: 'admin',
    status: 'active',
    phone: '010-1234-5678',
    joinDate: '2023-01-15',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    password: 'admin123',
  },
  {
    id: 'photo-1',
    email: 'photographer1@mindgraphy.com',
    firstName: '작가',
    lastName: '박',
    role: 'photographer',
    status: 'active',
    phone: '010-2345-6789',
    joinDate: '2023-03-10',
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    password: 'photo123',
    photographerStats: {
      totalProjects: 87,
      completedProjects: 82,
      ongoingProjects: 5,
      averageRating: 4.8,
      totalRevenue: 45600000,
      thisMonthProjects: 8,
      onTimeDeliveryRate: 95,
      customerSatisfaction: 96
    }
  },
  {
    id: 'photo-2',
    email: 'choi@mindgraphy.com',
    firstName: '작가',
    lastName: '최',
    role: 'photographer',
    status: 'active',
    phone: '010-3456-7890',
    joinDate: '2023-05-20',
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    photographerStats: {
      totalProjects: 65,
      completedProjects: 60,
      ongoingProjects: 5,
      averageRating: 4.7,
      totalRevenue: 38500000,
      thisMonthProjects: 6,
      onTimeDeliveryRate: 92,
      customerSatisfaction: 94
    }
  },
  {
    id: 'photo-3',
    email: 'kim@mindgraphy.com',
    firstName: '작가',
    lastName: '김',
    role: 'photographer',
    status: 'active',
    phone: '010-4567-8901',
    joinDate: '2023-07-01',
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    photographerStats: {
      totalProjects: 52,
      completedProjects: 48,
      ongoingProjects: 4,
      averageRating: 4.9,
      totalRevenue: 32800000,
      thisMonthProjects: 5,
      onTimeDeliveryRate: 98,
      customerSatisfaction: 98
    }
  },
  {
    id: 'photo-4',
    email: 'lee@mindgraphy.com',
    firstName: '작가',
    lastName: '이',
    role: 'photographer',
    status: 'on_leave',
    phone: '010-5678-9012',
    joinDate: '2023-09-15',
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    photographerStats: {
      totalProjects: 28,
      completedProjects: 26,
      ongoingProjects: 2,
      averageRating: 4.6,
      totalRevenue: 18200000,
      thisMonthProjects: 2,
      onTimeDeliveryRate: 89,
      customerSatisfaction: 91
    }
  },
  {
    id: 'editor-1',
    email: 'editor1@mindgraphy.com',
    firstName: '에디터',
    lastName: '정',
    role: 'editor',
    status: 'active',
    phone: '010-6789-0123',
    joinDate: '2023-04-05',
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'coordinator-1',
    email: 'coord1@mindgraphy.com',
    firstName: '코디네이터',
    lastName: '윤',
    role: 'coordinator',
    status: 'active',
    phone: '010-7890-1234',
    joinDate: '2023-06-12',
    lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: 'photo-5',
    email: 'inactive@mindgraphy.com',
    firstName: '작가',
    lastName: '강',
    role: 'photographer',
    status: 'inactive',
    phone: '010-8901-2345',
    joinDate: '2023-02-20',
    lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    photographerStats: {
      totalProjects: 15,
      completedProjects: 15,
      ongoingProjects: 0,
      averageRating: 4.5,
      totalRevenue: 9500000,
      thisMonthProjects: 0,
      onTimeDeliveryRate: 87,
      customerSatisfaction: 88
    }
  }
]

// Helper functions
export const getRoleLabel = (role: TeamUserRole) => {
  const labels = {
    admin: '관리자',
    photographer: '사진작가',
    editor: '에디터',
    coordinator: '코디네이터'
  }
  return labels[role]
}

export const getStatusLabel = (status: UserStatus) => {
  const labels = {
    active: '활성',
    inactive: '비활성',
    on_leave: '휴가'
  }
  return labels[status]
}

export const getStatusColor = (status: UserStatus) => {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    on_leave: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
  return colors[status]
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 30) return `${diffDays}일 전`
  
  return date.toLocaleDateString('ko-KR')
}

// Mock login function for authentication
export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Find user by email and password
  const teamUser = mockTeamUsers.find(
    u => u.email === email && u.password === password && u.status === 'active'
  )

  if (!teamUser) {
    return null
  }

  // Convert TeamUser to User (auth type)
  const user: User = {
    id: teamUser.id,
    email: teamUser.email,
    name: `${teamUser.lastName}${teamUser.firstName}`,
    role: teamUser.role === 'admin' ? 'admin' : 'photographer', // Map role
    avatar: teamUser.avatar,
    phone: teamUser.phone,
    assignedProjects: teamUser.role === 'photographer' ? [] : undefined
  }

  return user
}
