'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { KPICard, StatusBadge } from '@/components/common'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  mockTeamUsers,
  getRoleLabel,
  getJobTitleLabel,
  formatRelativeTime,
  type TeamUser,
  type TeamUserRole,
  type UserStatus
} from '@/lib/mock/users'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Plus,
  Search,
  Camera,
  Shield,
  Edit3,
  UserCog,
  UserCheck,
  UserX,
  UserCircle,
  TrendingUp,
  Award,
  DollarSign,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { PhotographerPermissionsDialog } from '@/components/team/photographer-permissions-dialog'
import type { PagePermission } from '@/lib/types/auth'

export default function TeamPage() {
  const [users, setUsers] = useState<TeamUser[]>(mockTeamUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<TeamUserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [selectedPhotographer, setSelectedPhotographer] = useState<{
    id: string
    name: string
    email: string
    currentPermissions?: PagePermission[]
  } | null>(null)
  
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'staff' as TeamUserRole,
    jobTitle: 'photographer' as 'photographer' | 'editor' | 'coordinator' | 'other',
    phone: '',
    password: ''
  })

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Statistics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const staffCount = users.filter(u => u.role === 'staff').length
  const staffWithStats = users.filter(u => u.role === 'staff' && u.stats)
  const avgStaffRating = staffWithStats.length > 0
    ? staffWithStats.reduce((sum, u) => sum + (u.stats?.averageRating || 0), 0) / staffWithStats.length
    : 0

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password) {
      toast.error('필수 항목을 모두 입력해주세요')
      return
    }

    const user: TeamUser = {
      id: `user-${Date.now()}`,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      jobTitle: newUser.role === 'staff' ? newUser.jobTitle : undefined,
      status: 'active',
      phone: newUser.phone,
      joinDate: new Date().toISOString().split('T')[0],
      permissions: newUser.role === 'staff' ? [] : undefined, // 직원은 빈 권한으로 시작
    }

    setUsers(prev => [user, ...prev])
    toast.success('새 계정이 생성되었습니다')
    setCreateDialogOpen(false)
    setNewUser({
      email: '',
      firstName: '',
      lastName: '',
      role: 'staff',
      jobTitle: 'photographer',
      phone: '',
      password: ''
    })
  }

  const handleToggleStatus = (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ))
    
    toast.success(
      newStatus === 'active' ? '계정이 활성화되었습니다' : '계정이 비활성화되었습니다'
    )
  }

  const handleOpenPermissionsDialog = (user: TeamUser) => {
    setSelectedPhotographer({
      id: user.id,
      name: `${user.lastName}${user.firstName}`,
      email: user.email,
      currentPermissions: user.permissions as PagePermission[] | undefined
    })
    setPermissionsDialogOpen(true)
  }

  const handleSavePermissions = (photographerId: string, permissions: PagePermission[]) => {
    // TODO: 실제 API 호출로 권한 업데이트
    // PATCH /api/admin/team/:id/permissions
    // Body: { permissions }
    
    setUsers(prev => prev.map(u => 
      u.id === photographerId ? { ...u, permissions } : u
    ))
    
    toast.success('권한이 업데이트되었습니다')
    setPermissionsDialogOpen(false)
    setSelectedPhotographer(null)
  }

  const getRoleIcon = (role: TeamUserRole) => {
    const icons: Record<TeamUserRole, typeof Shield> = {
      admin: Shield,
      staff: UserCog
    }
    const Icon = icons[role]
    return <Icon className="h-4 w-4" />
  }
  
  const getJobTitleIcon = (jobTitle?: string) => {
    const icons: Record<string, typeof Camera> = {
      photographer: Camera,
      editor: Edit3,
      coordinator: UserCog,
      other: UserCircle
    }
    const Icon = jobTitle && icons[jobTitle] ? icons[jobTitle] : UserCircle
    return <Icon className="h-4 w-4" />
  }

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">팀 관리</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              시스템 접근 계정을 생성하고 관리하세요
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            새 계정 생성
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom duration-300">
          <KPICard
            title="전체 계정"
            value={totalUsers}
            description="전체 팀원 수"
            icon={Users}
            onClick={() => {}}
          />

          <KPICard
            title="활성 계정"
            value={activeUsers}
            description="현재 활동중"
            icon={UserCheck}
            valueClassName="text-green-700"
            className="ring-green-200 bg-gradient-to-br from-green-50 to-white"
          />

          <KPICard
            title="직원"
            value={staffCount}
            description="총 직원 수"
            icon={Users}
            onClick={() => {}}
          />

          <KPICard
            title="평균 평점"
            value={avgStaffRating > 0 ? avgStaffRating.toFixed(1) : '-'}
            description="직원 평균 평점"
            icon={Award}
            onClick={() => {}}
          />
        </div>

        {/* Filters */}
        <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm animate-in fade-in slide-in-from-bottom duration-500">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 focus-ring"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as TeamUserRole | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 역할</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="staff">직원</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                  <SelectItem value="on_leave">휴가</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm animate-in fade-in slide-in-from-bottom duration-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[200px]">사용자</TableHead>
                    <TableHead className="min-w-[150px]">이메일</TableHead>
                    <TableHead className="min-w-[100px]">역할</TableHead>
                    <TableHead className="min-w-[100px]">직책</TableHead>
                    <TableHead className="min-w-[100px]">상태</TableHead>
                    <TableHead className="min-w-[120px]">마지막 로그인</TableHead>
                    <TableHead className="min-w-[100px]">가입일</TableHead>
                    <TableHead className="text-right min-w-[150px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7}>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                          <h3 className="text-base md:text-lg font-semibold mb-1">검색 결과가 없습니다</h3>
                          <p className="text-sm text-muted-foreground">
                            다른 검색어나 필터를 시도해보세요
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-zinc-900 text-white">
                                {user.lastName.charAt(0)}{user.firstName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.lastName}{user.firstName}
                              </div>
                              {user.phone && (
                                <div className="text-xs text-muted-foreground">
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getRoleIcon(user.role)}
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === 'staff' && user.jobTitle ? (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              {getJobTitleIcon(user.jobTitle)}
                              {getJobTitleLabel(user.jobTitle)}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin ? formatRelativeTime(user.lastLogin) : '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(user.joinDate).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* 직원에게 권한 버튼 표시 */}
                            {user.role === 'staff' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenPermissionsDialog(user)}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                  <Shield className="mr-1 h-3 w-3" />
                                  권한
                                </Button>
                                {/* 성과 통계가 있는 직원(작가, 에디터 등)의 경우 성과 버튼 표시 */}
                                {user.stats && (
                                  <Link href={`/admin/team/performance?id=${user.id}`}>
                                    <Button variant="outline" size="sm">
                                      <TrendingUp className="mr-1 h-3 w-3" />
                                      성과
                                    </Button>
                                  </Link>
                                )}
                              </>
                            )}
                            <Button
                              variant={user.status === 'active' ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleToggleStatus(user.id, user.status)}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <UserX className="mr-1 h-3 w-3" />
                                  비활성화
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-1 h-3 w-3" />
                                  활성화
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              새 계정 생성
            </DialogTitle>
            <DialogDescription>
              시스템 접근을 위한 새 계정을 생성합니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">성 *</Label>
                <Input
                  id="lastName"
                  placeholder="김"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">이름 *</Label>
                <Input
                  id="firstName"
                  placeholder="철수"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@mindgraphy.com"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-0000-0000"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">역할 *</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser({...newUser, role: v as TeamUserRole})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="staff">직원</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newUser.role === 'staff' && (
              <div className="space-y-2">
                <Label htmlFor="jobTitle">직책 *</Label>
                <Select value={newUser.jobTitle} onValueChange={(v) => setNewUser({...newUser, jobTitle: v as typeof newUser.jobTitle})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photographer">사진작가</SelectItem>
                    <SelectItem value="editor">에디터</SelectItem>
                    <SelectItem value="coordinator">코디네이터</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">임시 비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                placeholder="최소 8자 이상"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                사용자는 첫 로그인 시 비밀번호를 변경해야 합니다
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateUser}>
              <Plus className="mr-2 h-4 w-4" />
              계정 생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photographer Permissions Dialog */}
      <PhotographerPermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        photographer={selectedPhotographer}
        onSave={handleSavePermissions}
      />
    </AdminLayout>
  )
}
