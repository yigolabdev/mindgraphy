import { useState, useEffect, useMemo } from 'react'

/**
 * Portal step types representing customer journey stages
 */
export type PortalStep = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ContractInfo {
  contractNumber: string
  contractDate: string
  isSigned: boolean
  contractUrl: string
}

export interface PaymentInfo {
  bankName: string
  accountNumber: string
  accountHolder: string
  amount: number
  depositAmount: number
  balanceAmount: number
  isPaid: boolean
}

export interface PhotographerRating {
  rating: number
  review: string
  submittedAt: string | null
}

export interface RequestHistoryItem {
  id: string
  content: string
  createdAt: string
}

export interface PortalCustomerData {
  coupleName: string
  weddingDate: string
  currentStep: PortalStep
  contractInfo: ContractInfo
  paymentInfo: PaymentInfo
  venue: string
  packageName: string
  requestHistory: RequestHistoryItem[]
  photoSelectionAvailable: boolean
  totalPhotos: number
  selectedPhotos: number
  maxSelections: number
  photographerRating: PhotographerRating
}

export interface DateInfo {
  daysUntil: number
  isPast: boolean
  formattedDate: string
}

/**
 * Custom hook for managing portal customer data and state
 * Centralizes business logic for the customer portal
 */
export function usePortalData(initialData: PortalCustomerData) {
  const [customerData, setCustomerData] = useState<PortalCustomerData>(initialData)
  const [dateInfo, setDateInfo] = useState<DateInfo>({
    daysUntil: 0,
    isPast: false,
    formattedDate: ''
  })

  // Calculate date information
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const weddingDate = new Date(customerData.weddingDate)
    weddingDate.setHours(0, 0, 0, 0)
    
    const diffTime = weddingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    setDateInfo({
      daysUntil: Math.abs(diffDays),
      isPast: diffDays < 0,
      formattedDate: formatDate(customerData.weddingDate)
    })
  }, [customerData.weddingDate])

  // Calculate progress percentage based on current step
  const progressPercentage = useMemo(() => {
    const totalSteps = 7 // 0-6
    return Math.round(((customerData.currentStep + 1) / totalSteps) * 100)
  }, [customerData.currentStep])

  // Helper functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}년 ${month}월 ${day}일`
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  // Actions
  const updateStep = (step: PortalStep) => {
    const newWeddingDate = step <= 3 ? '2024-12-01' : '2025-04-12'
    
    setCustomerData(prev => ({
      ...prev,
      currentStep: step,
      photoSelectionAvailable: step === 4,
      weddingDate: newWeddingDate
    }))
  }

  const addRequest = (content: string) => {
    const newRequest: RequestHistoryItem = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString()
    }

    setCustomerData(prev => ({
      ...prev,
      requestHistory: [newRequest, ...prev.requestHistory]
    }))
  }

  const updateRating = (rating: number, review: string) => {
    setCustomerData(prev => ({
      ...prev,
      photographerRating: {
        rating,
        review,
        submittedAt: new Date().toISOString()
      }
    }))
  }

  const signContract = () => {
    setCustomerData(prev => ({
      ...prev,
      contractInfo: {
        ...prev.contractInfo,
        isSigned: true
      }
    }))
  }

  return {
    customerData,
    dateInfo,
    progressPercentage,
    formatDate,
    formatCurrency,
    updateStep,
    addRequest,
    updateRating,
    signContract
  }
}

