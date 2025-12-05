/**
 * Mock Data Provider (Client-Safe)
 * 
 * 클라이언트 컴포넌트에서 안전하게 사용할 수 있는 Mock 데이터 제공
 * Next.js 16 + Turbopack 호환
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Customer, Project, Product, Contract, Payment } from '@/lib/types'

interface MockDataContextType {
  mockCustomers: Customer[]
  mockProjects: Project[]
  mockProducts: Product[]
  mockContracts: Contract[]
  mockPayments: Payment[]
  isLoading: boolean
}

export type { MockDataContextType }

const MockDataContext = createContext<MockDataContextType | undefined>(undefined)

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [mockCustomers, setMockCustomers] = useState<Customer[]>([])
  const [mockProjects, setMockProjects] = useState<Project[]>([])
  const [mockProducts, setMockProducts] = useState<Product[]>([])
  const [mockContracts, setMockContracts] = useState<Contract[]>([])
  const [mockPayments, setMockPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMockData = async () => {
      try {
        // Dynamic import로 안전하게 로드
        const [mockData, mockSettings] = await Promise.all([
          import('@/lib/mock-data'),
          import('@/lib/mock/settings')
        ])

        setMockCustomers(mockData.mockCustomers)
        setMockProjects(mockData.mockProjects)
        setMockContracts(mockData.mockContracts)
        setMockPayments(mockData.mockPayments)
        setMockProducts(mockSettings.mockProducts)
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading mock data:', error)
        setIsLoading(false)
      }
    }

    loadMockData()
  }, [])

  return (
    <MockDataContext.Provider
      value={{
        mockCustomers,
        mockProjects,
        mockProducts,
        mockContracts,
        mockPayments,
        isLoading,
      }}
    >
      {children}
    </MockDataContext.Provider>
  )
}

export function useMockData() {
  const context = useContext(MockDataContext)
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider')
  }
  return context
}

/**
 * 개별 Hook (필요한 데이터만 사용)
 */
export function useMockCustomers() {
  const { mockCustomers, isLoading } = useMockData()
  return { mockCustomers, isLoading }
}

export function useMockProjects() {
  const { mockProjects, isLoading } = useMockData()
  return { mockProjects, isLoading }
}

export function useMockProducts() {
  const { mockProducts, isLoading } = useMockData()
  return { mockProducts, isLoading }
}

export function useMockContracts() {
  const { mockContracts, isLoading } = useMockData()
  return { mockContracts, isLoading }
}

export function useMockPayments() {
  const { mockPayments, isLoading } = useMockData()
  return { mockPayments, isLoading }
}

