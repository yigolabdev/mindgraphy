/**
 * Portal API Service
 * Handles all portal-related API calls
 */

import type { 
  PortalCustomerData, 
  RequestHistoryItem,
  PhotographerRating 
} from '@/hooks/use-portal-data'
import { ERROR_MESSAGES } from '@/lib/config/portal.config'

/**
 * API response wrapper
 */
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.timeout
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(ERROR_MESSAGES.timeout, 408, 'TIMEOUT')
    }
    throw error
  }
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(
      error.message || ERROR_MESSAGES.server,
      response.status,
      error.code
    )
  }

  return response.json()
}

/**
 * Portal API Service class
 */
export class PortalApiService {
  /**
   * Get customer portal data
   */
  static async getCustomerData(customerId: string): Promise<PortalCustomerData> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.baseURL}/portal/customer/${customerId}`,
        {
          method: 'GET',
          headers: API_CONFIG.headers
        }
      )

      return handleResponse<PortalCustomerData>(response)
    } catch (error) {
      console.error('Failed to fetch customer data:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Submit request
   */
  static async submitRequest(
    customerId: string,
    content: string
  ): Promise<RequestHistoryItem> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.baseURL}/portal/requests`,
        {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify({ customerId, content })
        }
      )

      return handleResponse<RequestHistoryItem>(response)
    } catch (error) {
      console.error('Failed to submit request:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Submit rating
   */
  static async submitRating(
    customerId: string,
    rating: number,
    review: string
  ): Promise<PhotographerRating> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.baseURL}/portal/rating`,
        {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify({ customerId, rating, review })
        }
      )

      return handleResponse<PhotographerRating>(response)
    } catch (error) {
      console.error('Failed to submit rating:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Sign contract
   */
  static async signContract(
    contractId: string,
    groomName: string,
    brideName: string
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.baseURL}/portal/contract/sign`,
        {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify({ contractId, groomName, brideName })
        }
      )

      return handleResponse<{ success: boolean }>(response)
    } catch (error) {
      console.error('Failed to sign contract:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Download contract
   */
  static async downloadContract(contractId: string): Promise<Blob> {
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.baseURL}/portal/contract/${contractId}/download`,
        {
          method: 'GET'
        }
      )

      if (!response.ok) {
        throw new ApiError(ERROR_MESSAGES.server, response.status)
      }

      return response.blob()
    } catch (error) {
      console.error('Failed to download contract:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   */
  private static handleError(error: unknown): Error {
    if (error instanceof ApiError) {
      return error
    }

    if (error instanceof Error) {
      return new ApiError(error.message)
    }

    return new ApiError(ERROR_MESSAGES.unknown)
  }
}

/**
 * Mock API Service for development
 * Remove this when backend is ready
 */
export class MockPortalApiService {
  private static delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async getCustomerData(customerId: string): Promise<PortalCustomerData> {
    await this.delay()
    
    // Return mock data
    return {
      coupleName: '김철수 & 이영희',
      weddingDate: '2024-12-01',
      currentStep: 2,
      contractInfo: {
        contractNumber: 'MG-2025-001',
        contractDate: '2025-01-15',
        isSigned: false,
        contractUrl: '/contracts/sample.pdf'
      },
      paymentInfo: {
        bankName: '신한은행',
        accountNumber: '110-123-456789',
        accountHolder: '마인드그라피',
        amount: 1210000,
        depositAmount: 500000,
        balanceAmount: 710000,
        isPaid: false
      },
      venue: '서울 그랜드 웨딩홀',
      packageName: 'new BASIC',
      requestHistory: [],
      photoSelectionAvailable: false,
      totalPhotos: 0,
      selectedPhotos: 0,
      maxSelections: 60,
      photographerRating: {
        rating: 0,
        review: '',
        submittedAt: null
      }
    }
  }

  static async submitRequest(
    customerId: string,
    content: string
  ): Promise<RequestHistoryItem> {
    await this.delay(500)
    
    return {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString()
    }
  }

  static async submitRating(
    customerId: string,
    rating: number,
    review: string
  ): Promise<PhotographerRating> {
    await this.delay(500)
    
    return {
      rating,
      review,
      submittedAt: new Date().toISOString()
    }
  }

  static async signContract(
    contractId: string,
    groomName: string,
    brideName: string
  ): Promise<{ success: boolean }> {
    await this.delay(1000)
    
    return { success: true }
  }

  static async downloadContract(contractId: string): Promise<Blob> {
    await this.delay(1000)
    
    // Return empty PDF blob
    return new Blob([], { type: 'application/pdf' })
  }
}

