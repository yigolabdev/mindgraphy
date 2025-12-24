/**
 * 결제 서비스 (토스페이먼츠 연동)
 * 
 * 이 파일은 토스페이먼츠 API와의 연동을 위한 서비스입니다.
 * 실제 API 연동 시 환경변수(.env)에 아래 값들을 설정해야 합니다:
 * - NEXT_PUBLIC_TOSS_CLIENT_KEY: 클라이언트 키
 * - TOSS_SECRET_KEY: 시크릿 키
 * 
 * 참고: https://docs.tosspayments.com/
 */

import type { Payment } from '@/lib/types'

// 토스페이먼츠 결제 요청 데이터 타입
export interface PaymentRequest {
  orderId: string // 주문 ID (고유값)
  orderName: string // 주문명
  amount: number // 결제 금액
  customerName: string // 고객명
  customerEmail?: string // 고객 이메일
  customerMobilePhone?: string // 고객 전화번호
  successUrl: string // 결제 성공 시 리다이렉트 URL
  failUrl: string // 결제 실패 시 리다이렉트 URL
}

// 토스페이먼츠 결제 승인 데이터 타입
export interface PaymentApproval {
  paymentKey: string
  orderId: string
  amount: number
}

// 토스페이먼츠 결제 응답 데이터 타입
export interface PaymentResponse {
  paymentKey: string
  orderId: string
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED'
  method: string
  totalAmount: number
  approvedAt?: string
  receipt?: {
    url: string
  }
}

/**
 * 토스페이먼츠 결제 링크 생성
 * 
 * @param request 결제 요청 데이터
 * @returns 결제 링크 URL
 */
export async function createPayment(request: PaymentRequest): Promise<string> {
  // TODO: 실제 토스페이먼츠 API 연동
  // 현재는 개발 환경을 위한 모의 구현
  
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
  
  if (!clientKey) {
    throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
  }
  
  // 실제 연동 시 아래 코드 사용
  /*
  const response = await fetch('https://api.tosspayments.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${clientKey}`
    },
    body: JSON.stringify(request)
  })
  
  if (!response.ok) {
    throw new Error('결제 링크 생성에 실패했습니다.')
  }
  
  const data = await response.json()
  return data.checkoutUrl
  */
  
  // 개발 환경: 모의 결제 페이지 URL 반환
  console.log('토스페이먼츠 결제 요청:', request)
  return `https://mockpay.tosspayments.com?orderId=${request.orderId}&amount=${request.amount}`
}

/**
 * 토스페이먼츠 결제 승인
 * 
 * @param approval 결제 승인 데이터
 * @returns 결제 응답 데이터
 */
export async function approvePayment(approval: PaymentApproval): Promise<PaymentResponse> {
  // TODO: 실제 토스페이먼츠 API 연동
  
  const secretKey = process.env.TOSS_SECRET_KEY
  
  if (!secretKey) {
    throw new Error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.')
  }
  
  // 실제 연동 시 아래 코드 사용
  /*
  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
    },
    body: JSON.stringify(approval)
  })
  
  if (!response.ok) {
    throw new Error('결제 승인에 실패했습니다.')
  }
  
  return await response.json()
  */
  
  // 개발 환경: 모의 결제 승인 응답 반환
  console.log('토스페이먼츠 결제 승인 요청:', approval)
  
  return {
    paymentKey: approval.paymentKey,
    orderId: approval.orderId,
    status: 'DONE',
    method: 'card',
    totalAmount: approval.amount,
    approvedAt: new Date().toISOString(),
    receipt: {
      url: `https://mockreceipt.tosspayments.com/${approval.paymentKey}`
    }
  }
}

/**
 * 토스페이먼츠 결제 취소
 * 
 * @param paymentKey 결제 키
 * @param cancelReason 취소 사유
 * @param cancelAmount 취소 금액 (부분 취소 시)
 * @returns 취소 결과
 */
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<PaymentResponse> {
  // TODO: 실제 토스페이먼츠 API 연동
  
  const secretKey = process.env.TOSS_SECRET_KEY
  
  if (!secretKey) {
    throw new Error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.')
  }
  
  // 실제 연동 시 아래 코드 사용
  /*
  const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`
    },
    body: JSON.stringify({
      cancelReason,
      cancelAmount
    })
  })
  
  if (!response.ok) {
    throw new Error('결제 취소에 실패했습니다.')
  }
  
  return await response.json()
  */
  
  // 개발 환경: 모의 결제 취소 응답 반환
  console.log('토스페이먼츠 결제 취소 요청:', { paymentKey, cancelReason, cancelAmount })
  
  return {
    paymentKey,
    orderId: 'mock-order-id',
    status: cancelAmount ? 'PARTIAL_CANCELED' : 'CANCELED',
    method: 'card',
    totalAmount: cancelAmount || 0,
    approvedAt: new Date().toISOString()
  }
}

/**
 * 결제 정보를 Payment 타입으로 변환
 * 
 * @param tossPayment 토스페이먼츠 응답 데이터
 * @param contractId 계약 ID
 * @param paymentType 결제 유형
 * @returns Payment 객체
 */
export function convertToPayment(
  tossPayment: PaymentResponse,
  contractId: string,
  paymentType: 'deposit' | 'balance' | 'additional'
): Payment {
  const paymentStatusMap = {
    'DONE': 'completed' as const,
    'WAITING_FOR_DEPOSIT': 'pending' as const,
    'CANCELED': 'refunded' as const,
    'PARTIAL_CANCELED': 'refunded' as const,
    'ABORTED': 'failed' as const,
    'EXPIRED': 'failed' as const,
    'READY': 'pending' as const,
    'IN_PROGRESS': 'pending' as const
  }
  
  return {
    id: `payment-${tossPayment.paymentKey}`,
    contractId,
    paymentType,
    amount: tossPayment.totalAmount,
    paymentMethod: tossPayment.method === 'card' ? '신용카드' : 
                   tossPayment.method === 'transfer' ? '계좌이체' : 
                   tossPayment.method === 'virtualAccount' ? '가상계좌' : '기타',
    paymentStatus: paymentStatusMap[tossPayment.status],
    paymentDate: tossPayment.approvedAt,
    receiptUrl: tossPayment.receipt?.url,
    cashReceiptIssued: false,
    notes: `토스페이먼츠 자동 등록 (결제키: ${tossPayment.paymentKey})`,
    createdAt: new Date().toISOString()
  }
}

/**
 * 웹훅 이벤트 처리
 * 토스페이먼츠로부터 결제 상태 변경 알림을 받을 때 사용
 * 
 * @param webhookData 웹훅 데이터
 */
export async function handleTossWebhook(webhookData: any) {
  // TODO: 웹훅 서명 검증
  // TODO: 결제 상태에 따른 처리
  
  console.log('토스페이먼츠 웹훅 수신:', webhookData)
  
  // 실제 구현 시:
  // 1. 웹훅 서명 검증
  // 2. 결제 상태에 따라 데이터베이스 업데이트
  // 3. 고객에게 알림 발송
  // 4. 관리자에게 알림 발송
}
