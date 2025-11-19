/**
 * Accessibility utility functions
 * Helps improve WCAG compliance and keyboard navigation
 */

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Focus first element
  firstElement?.focus()

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Generate unique ID for ARIA attributes
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false
  if (element.hasAttribute('disabled')) return false
  if (element.getAttribute('aria-hidden') === 'true') return false

  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden') return false

  return true
}

/**
 * Get next focusable element
 */
export function getNextFocusableElement(
  current: HTMLElement,
  container: HTMLElement = document.body
): HTMLElement | null {
  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(isFocusable)

  const currentIndex = focusableElements.indexOf(current)
  return focusableElements[currentIndex + 1] || focusableElements[0] || null
}

/**
 * Get previous focusable element
 */
export function getPreviousFocusableElement(
  current: HTMLElement,
  container: HTMLElement = document.body
): HTMLElement | null {
  const focusableElements = Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(isFocusable)

  const currentIndex = focusableElements.indexOf(current)
  return (
    focusableElements[currentIndex - 1] ||
    focusableElements[focusableElements.length - 1] ||
    null
  )
}

/**
 * Create accessible button handler
 * Handles both click and keyboard activation (Enter/Space)
 */
export function createAccessibleClickHandler(
  callback: (event: React.KeyboardEvent | React.MouseEvent) => void
) {
  return {
    onClick: callback,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        callback(event)
      }
    }
  }
}

/**
 * Format number for screen readers
 */
export function formatNumberForScreenReader(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}백만`
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`
  }
  return num.toLocaleString('ko-KR')
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

/**
 * Create skip link for keyboard navigation
 */
export function createSkipLink(targetId: string, label: string = '본문으로 건너뛰기') {
  return {
    href: `#${targetId}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded',
    children: label
  }
}

/**
 * ARIA label helpers
 */
export const ariaLabels = {
  close: '닫기',
  open: '열기',
  menu: '메뉴',
  search: '검색',
  filter: '필터',
  sort: '정렬',
  previous: '이전',
  next: '다음',
  loading: '로딩 중',
  error: '오류',
  success: '성공',
  warning: '경고',
  info: '정보'
} as const

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const errors: string[] = []

  // Check for required ARIA attributes
  const role = element.getAttribute('role')
  if (role) {
    const ariaRequired = {
      button: [],
      checkbox: ['aria-checked'],
      radio: ['aria-checked'],
      tab: ['aria-selected'],
      option: ['aria-selected'],
      menuitem: [],
      link: []
    } as Record<string, string[]>

    const required = ariaRequired[role] || []
    required.forEach(attr => {
      if (!element.hasAttribute(attr)) {
        errors.push(`Missing required attribute: ${attr}`)
      }
    })
  }

  return errors
}

