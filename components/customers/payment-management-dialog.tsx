'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import type { Payment, Contract } from '@/lib/types'
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, Plus, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: Contract | null
  payments: Payment[]
  onPaymentUpdate: (payments: Payment[]) => void
}

export function PaymentManagementDialog({
  open,
  onOpenChange,
  contract,
  payments,
  onPaymentUpdate
}: PaymentManagementDialogProps) {
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [formData, setFormData] = useState({
    paymentType: 'deposit' as 'deposit' | 'balance' | 'additional',
    amount: '',
    paymentMethod: 'transfer',
    paymentStatus: 'completed' as 'pending' | 'completed' | 'failed',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // 계약 정보에서 입금 상태 계산
  const contractPayments = payments.filter(p => p.contractId === contract?.id)
  const completedPayments = contractPayments.filter(p => p.paymentStatus === 'completed')
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0)
  const depositPaid = contractPayments.find(p => p.paymentType === 'deposit' && p.paymentStatus === 'completed')
  const balancePaid = contractPayments.find(p => p.paymentType === 'balance' && p.paymentStatus === 'completed')

  const paymentProgress = contract ? (totalPaid / contract.totalAmount) * 100 : 0

  // 결제 방식별 통계
  const paymentMethodStats = completedPayments.reduce((acc, p) => {
    const method = p.paymentMethod
    if (!acc[method]) {
      acc[method] = { count: 0, amount: 0 }
    }
    acc[method].count += 1
    acc[method].amount += p.amount
    return acc
  }, {} as Record<string, { count: number; amount: number }>)

  const handleAddPayment = () => {
    if (!contract) return

    // 유효성 검사
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('입금액을 입력해주세요')
      return
    }

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      contractId: contract.id,
      paymentType: formData.paymentType,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod === 'transfer' ? '계좌이체' : 
                     formData.paymentMethod === 'card' ? '신용카드' : 
                     formData.paymentMethod === 'cash' ? '현금' : '기타',
      paymentStatus: formData.paymentStatus,
      paymentDate: formData.paymentStatus === 'completed' ? formData.paymentDate : undefined,
      cashReceiptIssued: false,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    }

    const updatedPayments = [...payments, newPayment]
    onPaymentUpdate(updatedPayments)

    toast.success('입금 정보가 등록되었습니다')
    
    // 폼 초기화
    setFormData({
      paymentType: 'deposit',
      amount: '',
      paymentMethod: 'transfer',
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setIsAddingPayment(false)
  }

  const handlePayment = () => {
    // TODO: 토스페이먼츠 결제 연동
    toast.info('토스페이먼츠 연동 준비 중입니다', {
      description: '추후 결제 링크 생성 및 자동 입금 확인 기능이 추가될 예정입니다'
    })
  }

  if (!contract) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            입금 관리 - {contract.groomName} & {contract.brideName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 계약 정보 요약 */}
          <Card className="border-0 ring-1 ring-zinc-200/50 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">계약 번호</div>
                  <div className="font-semibold">{contract.contractNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">총 금액</div>
                  <div className="font-semibold text-blue-700">{contract.totalAmount.toLocaleString()}원</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">입금 완료</div>
                  <div className="font-semibold text-green-700">{totalPaid.toLocaleString()}원</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">미입금</div>
                  <div className="font-semibold text-red-700">{(contract.totalAmount - totalPaid).toLocaleString()}원</div>
                </div>
              </div>

              {/* 입금 진행률 */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">입금 진행률</span>
                  <span className="text-xs font-semibold text-blue-700">{paymentProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2.5">
                  <div
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-500",
                      paymentProgress >= 100 ? "bg-green-600" :
                      paymentProgress >= 50 ? "bg-blue-600" : "bg-orange-600"
                    )}
                    style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                  />
                </div>
              </div>

              {/* 결제 방식별 통계 */}
              {Object.keys(paymentMethodStats).length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs font-medium mb-2 text-muted-foreground">결제 방식</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(paymentMethodStats).map(([method, stats]) => (
                      <Badge 
                        key={method} 
                        variant="outline"
                        className="bg-white text-zinc-700 border-zinc-300"
                      >
                        {method}: {stats.amount.toLocaleString()}원 ({stats.count}건)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 입금 내역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">입금 내역</h3>
              <Button
                size="sm"
                onClick={handlePayment}
                variant="outline"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                토스페이먼츠 결제
              </Button>
            </div>

            <div className="space-y-3">
              {contractPayments.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>등록된 입금 내역이 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                contractPayments.map((payment) => (
                  <Card key={payment.id} className="border-0 ring-1 ring-zinc-200/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={
                              payment.paymentType === 'deposit' ? 'default' :
                              payment.paymentType === 'balance' ? 'secondary' : 'outline'
                            }>
                              {payment.paymentType === 'deposit' ? '계약금' :
                               payment.paymentType === 'balance' ? '잔금' : '추가금'}
                            </Badge>
                            {payment.paymentStatus === 'completed' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                입금완료
                              </Badge>
                            ) : payment.paymentStatus === 'pending' ? (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                                <Clock className="h-3 w-3 mr-1" />
                                입금대기
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                                <XCircle className="h-3 w-3 mr-1" />
                                입금실패
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">금액: </span>
                              <span className="font-semibold">{payment.amount.toLocaleString()}원</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">결제수단: </span>
                              <span>{payment.paymentMethod}</span>
                            </div>
                            {payment.paymentDate && (
                              <div>
                                <span className="text-muted-foreground">입금일: </span>
                                <span>{formatDate(payment.paymentDate)}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">등록일: </span>
                              <span>{formatDate(payment.createdAt)}</span>
                            </div>
                          </div>

                          {payment.notes && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              메모: {payment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* 입금 등록 폼 */}
          <div>
            {!isAddingPayment ? (
              <Button
                onClick={() => setIsAddingPayment(true)}
                variant="outline"
                className="w-full border-dashed border-2 h-12"
              >
                <Plus className="h-4 w-4 mr-2" />
                입금 내역 추가
              </Button>
            ) : (
              <Card className="border-0 ring-2 ring-blue-200 bg-blue-50/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">새 입금 내역 등록</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsAddingPayment(false)}
                    >
                      취소
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentType">입금 구분</Label>
                      <Select
                        value={formData.paymentType}
                        onValueChange={(value: any) => setFormData({ ...formData, paymentType: value })}
                      >
                        <SelectTrigger id="paymentType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deposit">계약금</SelectItem>
                          <SelectItem value="balance">잔금</SelectItem>
                          <SelectItem value="additional">추가금</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">입금액</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">결제 수단</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      >
                        <SelectTrigger id="paymentMethod">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transfer">계좌이체</SelectItem>
                          <SelectItem value="card">신용카드</SelectItem>
                          <SelectItem value="cash">현금</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">입금 상태</Label>
                      <Select
                        value={formData.paymentStatus}
                        onValueChange={(value: any) => setFormData({ ...formData, paymentStatus: value })}
                      >
                        <SelectTrigger id="paymentStatus">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">입금완료</SelectItem>
                          <SelectItem value="pending">입금대기</SelectItem>
                          <SelectItem value="failed">입금실패</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentDate">입금일</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        disabled={formData.paymentStatus !== 'completed'}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">메모</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="입금 관련 메모를 입력하세요"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingPayment(false)}
                    >
                      취소
                    </Button>
                    <Button onClick={handleAddPayment}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      등록
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
