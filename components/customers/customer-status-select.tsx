'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { updateCustomerStatus } from '@/lib/utils/customer-registration'
import { toast } from 'sonner'
import type { Customer } from '@/lib/types'
import { cn } from '@/lib/utils'

interface CustomerStatusSelectProps {
  customerId: string
  currentStatus: Customer['leadStatus']
  onStatusChange?: (newStatus: Customer['leadStatus']) => void
}

const STATUS_CONFIG: Record<Customer['leadStatus'], {
  label: string
  color: string
  description: string
}> = {
  inquiry: {
    label: '신규 문의',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: '고객이 문의를 접수한 상태'
  },
  consultation: {
    label: '상담중',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: '담당자가 상담을 진행중인 상태'
  },
  proposal: {
    label: '제안',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: '견적서 및 제안서를 발송한 상태'
  },
  contracted: {
    label: '계약 완료',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: '계약이 체결된 상태'
  },
  completed: {
    label: '완료',
    color: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    description: '촬영 및 납품이 완료된 상태'
  },
  cancelled: {
    label: '취소',
    color: 'bg-zinc-200 text-zinc-600 border-zinc-400',
    description: '계약이 취소된 상태'
  }
}

export function CustomerStatusSelect({ 
  customerId, 
  currentStatus, 
  onStatusChange 
}: CustomerStatusSelectProps) {
  const handleStatusChange = (newStatus: string) => {
    const status = newStatus as Customer['leadStatus']
    
    // localStorage의 Mock 데이터 업데이트
    const success = updateCustomerStatus(customerId, status)
    
    if (success) {
      toast.success('고객 상태가 변경되었습니다', {
        description: `${STATUS_CONFIG[currentStatus].label} → ${STATUS_CONFIG[status].label}`
      })
      
      // 부모 컴포넌트에 알림
      if (onStatusChange) {
        onStatusChange(status)
      }
    } else {
      toast.error('상태 변경에 실패했습니다')
    }
  }

  const currentConfig = STATUS_CONFIG[currentStatus]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700">고객 상태</label>
        <Badge className={cn('border', currentConfig.color)}>
          {currentConfig.label}
        </Badge>
      </div>
      
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-3 py-1">
                <div className={cn('h-2 w-2 rounded-full', config.color)} />
                <div>
                  <p className="font-medium">{config.label}</p>
                  <p className="text-xs text-zinc-500">{config.description}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-zinc-500 leading-relaxed">
        {currentConfig.description}
      </p>
    </div>
  )
}

