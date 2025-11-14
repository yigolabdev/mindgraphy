/**
 * Status utility functions
 * 상태 관련 유틸리티 함수
 */

import type { ProjectStatus } from '../types'

/**
 * Status color mappings for Tailwind CSS
 */
const STATUS_COLORS: Record<string, string> = {
  // Project statuses
  'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
  'in_progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'proof_ready': 'bg-purple-100 text-purple-800 border-purple-200',
  'editing': 'bg-orange-100 text-orange-800 border-orange-200',
  'completed': 'bg-green-100 text-green-800 border-green-200',
  'delivered': 'bg-teal-100 text-teal-800 border-teal-200',
  'archived': 'bg-gray-100 text-gray-800 border-gray-200',
  
  // Contract statuses
  'draft': 'bg-gray-100 text-gray-800 border-gray-200',
  'sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'signed': 'bg-green-100 text-green-800 border-green-200',
  'active': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'cancelled': 'bg-red-100 text-red-800 border-red-200',
  
  // Payment statuses
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'failed': 'bg-red-100 text-red-800 border-red-200',
  'refunded': 'bg-orange-100 text-orange-800 border-orange-200',
  
  // Schedule statuses
  'confirmed': 'bg-green-100 text-green-800 border-green-200',
  'upcoming': 'bg-blue-100 text-blue-800 border-blue-200',
  'reserved': 'bg-purple-100 text-purple-800 border-purple-200',
  
  // User statuses
  'available': 'bg-green-100 text-green-800 border-green-200',
  'busy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'on_leave': 'bg-gray-100 text-gray-800 border-gray-200',
}

/**
 * Status label mappings (Korean)
 */
const STATUS_LABELS: Record<string, string> = {
  // Project statuses
  'scheduled': '예정',
  'in_progress': '진행중',
  'proof_ready': '프루프 준비',
  'editing': '편집중',
  'completed': '완료',
  'delivered': '배송완료',
  'archived': '보관',
  
  // Contract statuses
  'draft': '초안',
  'sent': '발송됨',
  'signed': '서명완료',
  'active': '활성',
  'cancelled': '취소',
  
  // Payment statuses
  'pending': '대기중',
  'failed': '실패',
  'refunded': '환불',
  
  // Schedule statuses
  'confirmed': '확정',
  'upcoming': '예정',
  'reserved': '예약',
  
  // User statuses
  'available': '촬영 가능',
  'busy': '촬영중',
  'on_leave': '휴무',
}

/**
 * Get Tailwind CSS classes for status badge
 */
export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get Korean label for status
 */
export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status
}

/**
 * Get status variant for Badge component
 */
export function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (['completed', 'delivered', 'signed', 'confirmed'].includes(status)) {
    return 'default'
  }
  if (['cancelled', 'failed'].includes(status)) {
    return 'destructive'
  }
  if (['in_progress', 'pending'].includes(status)) {
    return 'outline'
  }
  return 'secondary'
}

/**
 * Check if status is final (cannot be changed)
 */
export function isFinalStatus(status: string): boolean {
  return ['completed', 'delivered', 'archived', 'cancelled'].includes(status)
}

/**
 * Check if status is in progress
 */
export function isInProgressStatus(status: string): boolean {
  return ['in_progress', 'editing', 'proof_ready'].includes(status)
}

/**
 * Check if status is upcoming
 */
export function isUpcomingStatus(status: string): boolean {
  return ['scheduled', 'reserved', 'upcoming'].includes(status)
}

/**
 * Get next possible statuses for a given status
 */
export function getNextStatuses(currentStatus: ProjectStatus): ProjectStatus[] {
  const statusFlow: Record<ProjectStatus, ProjectStatus[]> = {
    'scheduled': ['in_progress', 'cancelled', 'archived'],
    'in_progress': ['proof_ready', 'cancelled', 'archived'],
    'proof_ready': ['editing', 'cancelled', 'archived'],
    'editing': ['completed', 'proof_ready'],
    'completed': ['delivered'],
    'delivered': ['archived'],
    'cancelled': ['archived'],
    'archived': [],
  }
  
  return statusFlow[currentStatus] || []
}

/**
 * Check if status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: ProjectStatus,
  nextStatus: ProjectStatus
): boolean {
  const allowedTransitions = getNextStatuses(currentStatus)
  return allowedTransitions.includes(nextStatus)
}

/**
 * Get status progress percentage
 */
export function getStatusProgress(status: ProjectStatus): number {
  const progressMap: Record<ProjectStatus, number> = {
    'scheduled': 0,
    'in_progress': 20,
    'proof_ready': 40,
    'editing': 60,
    'completed': 80,
    'delivered': 100,
    'cancelled': 0,
    'archived': 100,
  }
  
  return progressMap[status] || 0
}

/**
 * Get status icon name (for lucide-react)
 */
export function getStatusIcon(status: string): string {
  const iconMap: Record<string, string> = {
    'scheduled': 'Calendar',
    'in_progress': 'Camera',
    'proof_ready': 'Image',
    'editing': 'Edit',
    'completed': 'CheckCircle',
    'delivered': 'Package',
    'archived': 'Archive',
    'cancelled': 'XCircle',
    'pending': 'Clock',
    'failed': 'AlertCircle',
  }
  
  return iconMap[status] || 'Circle'
}

/**
 * Sort statuses by priority
 */
export function sortByStatusPriority(statuses: string[]): string[] {
  const priorityOrder = [
    'in_progress',
    'proof_ready',
    'editing',
    'scheduled',
    'pending',
    'completed',
    'delivered',
    'cancelled',
    'archived',
  ]
  
  return statuses.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a)
    const bIndex = priorityOrder.indexOf(b)
    
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    
    return aIndex - bIndex
  })
}

