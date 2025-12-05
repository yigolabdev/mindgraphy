/**
 * 에러 처리 고도화 유틸리티
 * 
 * 전체 애플리케이션에서 일관된 에러 처리를 제공합니다.
 */

import { toast } from 'sonner'

/**
 * 에러 타입 정의
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION = 'PERMISSION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 커스텀 에러 클래스
 */
export class AppError extends Error {
  type: ErrorType
  code?: string
  statusCode?: number
  details?: any

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    details?: any
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.code = code
    this.details = details

    // Set statusCode based on type
    this.statusCode = this.getStatusCode(type)
  }

  private getStatusCode(type: ErrorType): number {
    switch (type) {
      case ErrorType.VALIDATION:
        return 400
      case ErrorType.AUTH:
        return 401
      case ErrorType.PERMISSION:
        return 403
      case ErrorType.NOT_FOUND:
        return 404
      case ErrorType.SERVER:
        return 500
      case ErrorType.NETWORK:
        return 503
      default:
        return 500
    }
  }
}

/**
 * 에러 로그 함수
 */
export function logError(error: unknown, context?: string) {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError ? {
        type: error.type,
        code: error.code,
        details: error.details,
      } : {}),
    } : error,
  }

  console.error(`[Error ${context ? `- ${context}` : ''}]`, errorInfo)

  // TODO: 프로덕션 환경에서는 서버로 에러 로그 전송
  // if (process.env.NODE_ENV === 'production') {
  //   sendErrorToServer(errorInfo)
  // }
}

/**
 * 에러 메시지 사용자 친화적으로 변환
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    // 일반적인 에러 메시지를 사용자 친화적으로 변환
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('network')) {
      return '네트워크 연결을 확인해 주세요.'
    }
    if (errorMessage.includes('timeout')) {
      return '요청 시간이 초과되었습니다. 다시 시도해 주세요.'
    }
    if (errorMessage.includes('not found')) {
      return '요청한 정보를 찾을 수 없습니다.'
    }
    if (errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
      return '접근 권한이 없습니다.'
    }
    if (errorMessage.includes('server')) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    }

    return error.message
  }

  return '알 수 없는 오류가 발생했습니다.'
}

/**
 * 에러 처리 및 토스트 표시
 */
export function handleError(error: unknown, context?: string, customMessage?: string) {
  logError(error, context)

  const message = customMessage || getUserFriendlyMessage(error)
  toast.error(message)
}

/**
 * 비동기 함수 에러 래퍼
 * 
 * @example
 * ```ts
 * const result = await withErrorHandling(
 *   async () => {
 *     return await fetchData()
 *   },
 *   '데이터 로드',
 *   '데이터를 불러오는데 실패했습니다'
 * )
 * ```
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  customMessage?: string
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, context, customMessage)
    return null
  }
}

/**
 * Try-Catch 래퍼 (동기 함수)
 */
export function tryCatch<T>(
  fn: () => T,
  context: string,
  customMessage?: string
): T | null {
  try {
    return fn()
  } catch (error) {
    handleError(error, context, customMessage)
    return null
  }
}

/**
 * 유효성 검증 에러 생성
 */
export function createValidationError(message: string, details?: any): AppError {
  return new AppError(message, ErrorType.VALIDATION, 'VALIDATION_ERROR', details)
}

/**
 * 인증 에러 생성
 */
export function createAuthError(message: string = '로그인이 필요합니다'): AppError {
  return new AppError(message, ErrorType.AUTH, 'AUTH_ERROR')
}

/**
 * 권한 에러 생성
 */
export function createPermissionError(message: string = '접근 권한이 없습니다'): AppError {
  return new AppError(message, ErrorType.PERMISSION, 'PERMISSION_ERROR')
}

/**
 * Not Found 에러 생성
 */
export function createNotFoundError(resource: string): AppError {
  return new AppError(
    `${resource}을(를) 찾을 수 없습니다`,
    ErrorType.NOT_FOUND,
    'NOT_FOUND_ERROR'
  )
}

/**
 * 네트워크 에러 생성
 */
export function createNetworkError(message: string = '네트워크 오류가 발생했습니다'): AppError {
  return new AppError(message, ErrorType.NETWORK, 'NETWORK_ERROR')
}

/**
 * 서버 에러 생성
 */
export function createServerError(message: string = '서버 오류가 발생했습니다'): AppError {
  return new AppError(message, ErrorType.SERVER, 'SERVER_ERROR')
}

/**
 * 에러 재시도 함수
 * 
 * @param fn - 실행할 함수
 * @param maxRetries - 최대 재시도 횟수
 * @param delay - 재시도 간격 (ms)
 * @param context - 에러 컨텍스트
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1) // Exponential backoff
        console.log(`[Retry ${context ? `- ${context}` : ''}] Attempt ${attempt} failed. Retrying in ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  // 모든 재시도 실패
  logError(lastError, context)
  throw lastError
}

/**
 * Promise 타임아웃 래퍼
 * 
 * @param promise - 실행할 Promise
 * @param timeoutMs - 타임아웃 시간 (ms)
 * @param context - 에러 컨텍스트
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  context?: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => {
        const error = new AppError(
          '요청 시간이 초과되었습니다',
          ErrorType.NETWORK,
          'TIMEOUT_ERROR'
        )
        logError(error, context)
        reject(error)
      }, timeoutMs)
    )
  ])
}

/**
 * 에러 바운더리를 위한 에러 정보 추출
 */
export function extractErrorInfo(error: unknown) {
  if (error instanceof AppError) {
    return {
      type: error.type,
      code: error.code,
      message: error.message,
      details: error.details,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
      stack: error.stack,
    }
  }

  return {
    type: ErrorType.UNKNOWN,
    message: String(error),
  }
}

/**
 * 에러가 특정 타입인지 확인
 */
export function isErrorType(error: unknown, type: ErrorType): boolean {
  return error instanceof AppError && error.type === type
}

/**
 * 에러가 재시도 가능한지 확인
 */
export function isRetriableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.type === ErrorType.NETWORK || error.type === ErrorType.SERVER
  }
  return false
}

/**
 * 유효성 검증 에러 메시지 포맷터
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  const messages = Object.entries(errors)
    .map(([field, fieldErrors]) => `${field}: ${fieldErrors.join(', ')}`)
    .join('\n')
  
  return messages
}

/**
 * API 응답 에러 파서
 */
export function parseApiError(response: any): AppError {
  const status = response.status || 500
  const data = response.data || {}

  let type = ErrorType.UNKNOWN
  let message = '알 수 없는 오류가 발생했습니다'

  if (status >= 400 && status < 500) {
    type = ErrorType.CLIENT
    message = data.message || '요청이 잘못되었습니다'
    
    if (status === 401) {
      type = ErrorType.AUTH
      message = '로그인이 필요합니다'
    } else if (status === 403) {
      type = ErrorType.PERMISSION
      message = '접근 권한이 없습니다'
    } else if (status === 404) {
      type = ErrorType.NOT_FOUND
      message = '요청한 리소스를 찾을 수 없습니다'
    }
  } else if (status >= 500) {
    type = ErrorType.SERVER
    message = '서버 오류가 발생했습니다'
  }

  return new AppError(message, type, data.code, data.details)
}

