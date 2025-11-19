'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreatePostDialog } from '@/components/board/create-post-dialog'
import { PostDetailDialog } from '@/components/board/post-detail-dialog'
import {
  MessageSquare,
  Plus,
  Search,
  Eye,
  MessageCircle,
  Pin,
  Clock,
  User
} from 'lucide-react'
import {
  mockPosts,
  getPostsByCategory,
  type Post,
  type PostCategory
} from '@/lib/mock/board'
import { getRelativeTime } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/auth-store'

const CATEGORY_LABELS: Record<PostCategory, string> = {
  'notice': '공지사항',
  'general': '자유게시판',
  'question': '질문',
  'tips': '팁/노하우',
  'event': '이벤트',
}

const CATEGORY_COLORS: Record<PostCategory, string> = {
  'notice': 'bg-red-100 text-red-800',
  'general': 'bg-blue-100 text-blue-800',
  'question': 'bg-green-100 text-green-800',
  'tips': 'bg-purple-100 text-purple-800',
  'event': 'bg-orange-100 text-orange-800',
}

export default function BoardPage() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Get filtered posts
  const getFilteredPosts = () => {
    let posts = selectedCategory === 'all' 
      ? [...mockPosts] 
      : getPostsByCategory(selectedCategory)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query)
      )
    }

    // Sort: pinned first, then by date
    return posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  const filteredPosts = getFilteredPosts()

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setDetailDialogOpen(true)
  }

  // Statistics
  const totalPosts = mockPosts.length
  const noticeCount = mockPosts.filter(p => p.category === 'notice').length
  const questionCount = mockPosts.filter(p => p.category === 'question').length

  return (
    <AdminLayout align="left">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              소통게시판
            </h1>
            <p className="text-muted-foreground mt-1">
              팀원들과 정보를 공유하고 소통하세요
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            글 작성
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">전체 글</p>
                  <p className="text-2xl font-bold">{totalPosts}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">공지사항</p>
                  <p className="text-2xl font-bold text-red-600">{noticeCount}</p>
                </div>
                <Pin className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">질문</p>
                  <p className="text-2xl font-bold text-green-600">{questionCount}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">내가 쓴 글</p>
                  <p className="text-2xl font-bold">
                    {mockPosts.filter(p => p.authorId === user?.id).length}
                  </p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="notice">공지사항</TabsTrigger>
            <TabsTrigger value="general">자유게시판</TabsTrigger>
            <TabsTrigger value="question">질문</TabsTrigger>
            <TabsTrigger value="tips">팁/노하우</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  게시글이 없습니다
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Pin icon for pinned posts */}
                        {post.isPinned && (
                          <Pin className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Category and Title */}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={CATEGORY_COLORS[post.category]}>
                              {CATEGORY_LABELS[post.category]}
                            </Badge>
                            {post.isPinned && (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                공지
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          {/* Preview */}
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.content}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.authorName}</span>
                              <span className="text-xs">
                                ({post.authorRole === 'admin' ? '관리자' : '작가'})
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{getRelativeTime(post.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.viewCount}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.commentCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          // TODO: Refresh posts
        }}
      />

      {/* Post Detail Dialog */}
      {selectedPost && (
        <PostDetailDialog
          post={selectedPost}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      )}
    </AdminLayout>
  )
}

