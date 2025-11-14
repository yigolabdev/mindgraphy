'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  getStatusLabel,
  getStatusColor,
  formatRelativeTime,
  type TeamUser,
  type TeamUserRole,
  type UserStatus
} from '@/lib/mock/users'
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
  TrendingUp,
  Award,
  DollarSign,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function TeamPage() {
  const [users, setUsers] = useState<TeamUser[]>(mockTeamUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<TeamUserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'photographer' as TeamUserRole,
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
  const photographers = users.filter(u => u.role === 'photographer').length
  const avgPhotographerRating = users
    .filter(u => u.role === 'photographer' && u.photographerStats)
    .reduce((sum, u) => sum + (u.photographerStats?.averageRating || 0), 0) / 
    users.filter(u => u.role === 'photographer' && u.photographerStats).length

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
      status: 'active',
      phone: newUser.phone,
      joinDate: new Date().toISOString().split('T')[0],
    }

    setUsers(prev => [user, ...prev])
    toast.success('새 계정이 생성되었습니다')
    setCreateDialogOpen(false)
    setNewUser({
      email: '',
      firstName: '',
      lastName: '',
      role: 'photographer',
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

  const getRoleIcon = (role: TeamUserRole) => {
    const icons = {
      admin: Shield,
      photographer: Camera,
      editor: Edit3,
      coordinator: UserCog
    }
    const Icon = icons[role]
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 계정</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                전체 팀원 수
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 계정</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{activeUsers}</div>
              <p className="text-xs text-green-600">
                현재 활동중
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">사진작가</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{photographers}</div>
              <p className="text-xs text-muted-foreground">
                총 작가 수
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPhotographerRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                작가 평점
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as TeamUserRole | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 역할</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="photographer">사진작가</SelectItem>
                  <SelectItem value="editor">에디터</SelectItem>
                  <SelectItem value="coordinator">코디네이터</SelectItem>
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
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[200px]">사용자</TableHead>
                    <TableHead className="min-w-[150px]">이메일</TableHead>
                    <TableHead className="min-w-[100px]">역할</TableHead>
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
                          <Badge className={cn("border", getStatusColor(user.status))}>
                            {getStatusLabel(user.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin ? formatRelativeTime(user.lastLogin) : '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(user.joinDate).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {user.role === 'photographer' && user.photographerStats && (
                              <Link href={`/admin/team/performance?id=${user.id}`}>
                                <Button variant="outline" size="sm">
                                  <TrendingUp className="mr-1 h-3 w-3" />
                                  성과
                                </Button>
                              </Link>
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
                  <SelectItem value="photographer">사진작가</SelectItem>
                  <SelectItem value="editor">에디터</SelectItem>
                  <SelectItem value="coordinator">코디네이터</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
    </AdminLayout>
  )
}

