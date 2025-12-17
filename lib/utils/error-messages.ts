/**
 * 사용자 친화적 에러 메시지 시스템
 * 
 * 기술적 에러를 이해하기 쉬운 메시지로 변환
 */

export const errorMessages = {
  // 인증 관련
  auth: {
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
    sessionExpired: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
    unauthorized: '이 작업을 수행할 권한이 없습니다.',
    accountLocked: '계정이 잠겼습니다. 관리자에게 문의해 주세요.',
  },

  // 입력 검증
  validation: {
    required: (field: string) => `${field}을(를) 입력해 주세요.`,
    minLength: (field: string, min: number) => `${field}은(는) 최소 ${min}자 이상이어야 합니다.`,
    maxLength: (field: string, max: number) => `${field}은(는) 최대 ${max}자까지 입력 가능합니다.`,
    invalidFormat: (field: string) => `올바른 ${field} 형식이 아닙니다.`,
    invalidEmail: '올바른 이메일 주소를 입력해 주세요.',
    invalidPhone: '올바른 전화번호를 입력해 주세요.',
    invalidDate: '올바른 날짜를 선택해 주세요.',
    pastDate: '과거 날짜는 선택할 수 없습니다.',
    futureDate: '미래 날짜는 선택할 수 없습니다.',
    dateRange: '시작일은 종료일보다 이전이어야 합니다.',
  },

  // 파일 업로드
  upload: {
    fileTooLarge: (maxSize: string) => `파일 크기가 너무 큽니다. (최대 ${maxSize})`,
    invalidFileType: (allowed: string) => `지원하지 않는 파일 형식입니다. (허용: ${allowed})`,
    uploadFailed: '파일 업로드에 실패했습니다. 다시 시도해 주세요.',
    tooManyFiles: (max: number) => `최대 ${max}개의 파일만 업로드할 수 있습니다.`,
  },

  // 네트워크
  network: {
    offline: '인터넷 연결을 확인해 주세요.',
    timeout: '요청 시간이 초과되었습니다. 다시 시도해 주세요.',
    serverError: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    notFound: '요청하신 정보를 찾을 수 없습니다.',
  },

  // 데이터 처리
  data: {
    notFound: (item: string) => `${item}을(를) 찾을 수 없습니다.`,
    alreadyExists: (item: string) => `이미 등록된 ${item}입니다.`,
    cannotDelete: (item: string, reason: string) => `${item}을(를) 삭제할 수 없습니다. (${reason})`,
    cannotUpdate: (item: string) => `${item}을(를) 수정할 수 없습니다.`,
  },

  // 결제
  payment: {
    processingFailed: '결제 처리 중 오류가 발생했습니다.',
    insufficientBalance: '잔액이 부족합니다.',
    cardDeclined: '카드 승인이 거부되었습니다. 카드사에 문의해 주세요.',
    invalidCardInfo: '카드 정보가 올바르지 않습니다.',
  },

  // 일정
  schedule: {
    conflictingDates: '선택한 날짜에 이미 다른 일정이 있습니다.',
    fullyBooked: '해당 날짜는 예약이 마감되었습니다.',
    tooEarly: '예약 가능한 날짜가 아닙니다.',
    tooLate: '예약 마감일이 지났습니다.',
  },

  // 일반
  general: {
    unexpectedError: '예상치 못한 오류가 발생했습니다.',
    tryAgainLater: '잠시 후 다시 시도해 주세요.',
    contactSupport: '문제가 계속되면 고객센터로 문의해 주세요.',
  },
} as const

/**
 * HTTP 상태 코드를 사용자 친화적 메시지로 변환
 */
export function getHttpErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return '잘못된 요청입니다. 입력 정보를 확인해 주세요.'
    case 401:
      return errorMessages.auth.unauthorized
    case 403:
      return errorMessages.auth.unauthorized
    case 404:
      return errorMessages.network.notFound
    case 408:
      return errorMessages.network.timeout
    case 409:
      return '이미 처리된 요청입니다.'
    case 422:
      return '입력하신 정보를 다시 확인해 주세요.'
    case 429:
      return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.'
    case 500:
    case 502:
    case 503:
    case 504:
      return errorMessages.network.serverError
    default:
      return errorMessages.general.unexpectedError
  }
}

/**
 * Error 객체를 사용자 친화적 메시지로 변환
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  // Error 객체가 아닌 경우
  if (!(error instanceof Error)) {
    return errorMessages.general.unexpectedError
  }

  const errorMessage = error.message.toLowerCase()

  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return errorMessages.network.offline
  }

  // Timeout errors
  if (errorMessage.includes('timeout')) {
    return errorMessages.network.timeout
  }

  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return '입력하신 정보를 다시 확인해 주세요.'
  }

  // Permission errors
  if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
    return errorMessages.auth.unauthorized
  }

  // Default
  return errorMessages.general.unexpectedError
}

/**
 * 폼 검증 에러 메시지 생성기
 */
export function getValidationError(
  field: string,
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom',
  options?: { min?: number; max?: number; message?: string }
): string {
  switch (type) {
    case 'required':
      return errorMessages.validation.required(field)
    case 'minLength':
      return errorMessages.validation.minLength(field, options?.min || 0)
    case 'maxLength':
      return errorMessages.validation.maxLength(field, options?.max || 0)
    case 'pattern':
      return errorMessages.validation.invalidFormat(field)
    case 'custom':
      return options?.message || errorMessages.validation.invalidFormat(field)
    default:
      return errorMessages.validation.invalidFormat(field)
  }
}

/**
 * 성공 메시지
 */
export const successMessages = {
  created: (item: string) => `${item}이(가) 성공적으로 등록되었습니다.`,
  updated: (item: string) => `${item}이(가) 성공적으로 수정되었습니다.`,
  deleted: (item: string) => `${item}이(가) 성공적으로 삭제되었습니다.`,
  saved: '저장되었습니다.',
  sent: '전송되었습니다.',
  uploaded: '업로드되었습니다.',
  completed: '완료되었습니다.',
  confirmed: '확인되었습니다.',
  cancelled: '취소되었습니다.',
} as const

/**
 * 확인 메시지
 */
export const confirmMessages = {
  delete: (item: string) => `정말 ${item}을(를) 삭제하시겠습니까?`,
  cancel: (item: string) => `정말 ${item}을(를) 취소하시겠습니까?`,
  leave: '변경사항이 저장되지 않을 수 있습니다. 페이지를 나가시겠습니까?',
  overwrite: '기존 데이터를 덮어쓰시겠습니까?',
} as const
