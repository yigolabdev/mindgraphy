/**
 * Mindgraphy Design System
 * 
 * 전체 시스템에서 일관된 디자인을 위한 토큰 정의
 */

/**
 * 색상 시스템
 */
export const colors = {
  // Primary
  primary: {
    DEFAULT: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  
  // Success
  success: {
    DEFAULT: '#10b981',
    light: '#34d399',
    dark: '#059669',
    50: '#d1fae5',
    100: '#a7f3d0',
    600: '#059669',
    700: '#047857',
  },
  
  // Warning
  warning: {
    DEFAULT: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    50: '#fef3c7',
    100: '#fde68a',
    600: '#d97706',
    700: '#b45309',
  },
  
  // Danger
  danger: {
    DEFAULT: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    50: '#fee2e2',
    100: '#fecaca',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  // Neutral
  neutral: {
    DEFAULT: '#71717a',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  
  // Semantic Colors
  info: '#3b82f6',
  muted: '#71717a',
} as const

/**
 * 간격 시스템 (Spacing Scale)
 */
export const spacing = {
  xs: '4px',     // 0.5rem
  sm: '8px',     // 1rem
  md: '16px',    // 2rem
  lg: '24px',    // 3rem
  xl: '32px',    // 4rem
  '2xl': '48px', // 6rem
  '3xl': '64px', // 8rem
  '4xl': '96px', // 12rem
} as const

/**
 * Typography Scale
 */
export const typography = {
  // Font Sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

/**
 * Border Radius
 */
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const

/**
 * Shadows
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const

/**
 * Z-Index Scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const

/**
 * Breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Animation Durations
 */
export const durations = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

/**
 * Component Specific Tokens
 */
export const components = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: {
      sm: '0 12px',
      md: '0 16px',
      lg: '0 24px',
    },
  },
  
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    padding: '0 12px',
    borderWidth: '2px',
  },
  
  card: {
    padding: '24px',
    borderRadius: borderRadius.lg,
  },
} as const

/**
 * Status Colors (프로젝트 상태별)
 */
export const statusColors = {
  // 일정 관련
  scheduled: colors.primary.DEFAULT,
  confirmed: colors.success.DEFAULT,
  cancelled: colors.danger.DEFAULT,
  completed: colors.neutral[400],
  
  // 입금 관련
  paid: colors.success.DEFAULT,
  partial: colors.warning.DEFAULT,
  unpaid: colors.danger.DEFAULT,
  
  // 작업 상태
  pending: colors.warning.DEFAULT,
  inProgress: colors.primary.DEFAULT,
  done: colors.success.DEFAULT,
} as const

/**
 * Helper Functions
 */
export const getStatusColor = (status: keyof typeof statusColors) => {
  return statusColors[status] || colors.neutral[400]
}

export const getSpacing = (size: keyof typeof spacing) => {
  return spacing[size]
}

export const getFontSize = (size: keyof typeof typography.fontSize) => {
  return typography.fontSize[size]
}
