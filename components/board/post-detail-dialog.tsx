'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth-store'
import {
  Eye,
  MessageCircle,
  Clock,
  User,
  Pin,
  Send
} from 'lucide-react'
import type { Post, PostCategory } from '@/lib/mock/board'
import { getCommentsByPostId, type Comment } from '@/lib/mock/board'
import { formatDateWithWeekday, getRelativeTime } from '@/lib/utils'

interface PostDetailDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

export function PostDetailDialog({
  post,
  open,
  onOpenChange,
}: PostDetailDialogProps) {
  const { user } = useAuthStore()
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Comment[]>(getCommentsByPostId(post.id))

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) {
      toast.error('댓글 내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: 실제 API 호출로 변경
      // await apiService.post(`/posts/${post.id}/comments`, { content: commentText })

      // Mock: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Add new comment to local state
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        content: commentText,
        authorId: user?.id || '',
        authorName: user?.name || '익명',
        authorRole: (user?.role === 'admin' ? 'admin' : 'photographer') as 'admin' | 'photographer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setComments(prev => [...prev, newComment])
      setCommentText('')
      toast.success('댓글이 등록되었습니다.')

    } catch (error) {
      toast.error('댓글 등록에 실패했습니다.')
      console.error('Failed to create comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name.charAt(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            {/* Category and Pin */}
            <div className="flex items-center gap-2">
              <Badge className={CATEGORY_COLORS[post.category]}>
                {CATEGORY_LABELS[post.category]}
              </Badge>
              {post.isPinned && (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  <Pin className="h-3 w-3 mr-1" />
                  공지
                </Badge>
              )}
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl">{post.title}</DialogTitle>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(post.authorName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.authorName}</span>
                <span className="text-xs">
                  ({post.authorRole === 'admin' ? '관리자' : '작가'})
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDateWithWeekday(post.createdAt.split(' ')[0])}</span>
                <span className="ml-1 text-xs">
                  ({getRelativeTime(post.createdAt)})
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>조회 {post.viewCount}</span>
              </div>

              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>댓글 {comments.length}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="my-6">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>

        <Separator />

        {/* Comments Section */}
        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            댓글 {comments.length}개
          </h3>

          {/* Comment List */}
          {comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.authorName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.authorName}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.authorRole === 'admin' ? '관리자' : '작가'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? '등록 중...' : '댓글 등록'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

