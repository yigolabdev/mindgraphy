// Demo token for development
export const DEMO_TOKEN = 'demo-token-2025'

// All available tokens for static generation
export const STATIC_TOKENS = [
  'demo-token-2025',
  'token-001',
  'token-002',
  'token-003',
  'token-004',
]

// Route paths
export const ROUTES = {
  // Public
  HOME: '/',
  
  // Client Portal
  CLIENT_PORTAL: (token: string) => `/c/${token}`,
  CLIENT_DASHBOARD: (token: string) => `/c/${token}/dashboard`,
  CLIENT_CONTRACT: (token: string) => `/c/${token}/contract`,
  CLIENT_INFO: (token: string) => `/c/${token}/info`,
  CLIENT_PROOF: (token: string) => `/c/${token}/proof-gallery`,
  CLIENT_DOWNLOAD: (token: string) => `/c/${token}/download`,
  CLIENT_PAYMENT: (token: string) => `/c/${token}/payment`,
  CLIENT_INVALID: (token: string) => `/c/${token}/invalid`,
  
  // Admin - Main
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_MY: '/admin/my',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  
  // Admin - Management
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CONTRACTS: '/admin/contracts',
  ADMIN_PHOTOGRAPHERS: '/admin/photographers',
  ADMIN_PHOTOS: '/admin/photos',
  ADMIN_EDITING: '/admin/editing',
  ADMIN_DELIVERY: '/admin/delivery',
  ADMIN_ANALYTICS: '/admin/analytics',
  
  // Admin - Settings
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_SETTINGS_PRODUCTS: '/admin/settings/products',
  ADMIN_SETTINGS_NOTIFICATIONS: '/admin/settings/notifications',
  ADMIN_SETTINGS_MASTERS: '/admin/settings/masters',
} as const

// Project statuses
export const PROJECT_STATUSES = [
  'scheduled',
  'in_progress',
  'proof_ready',
  'editing',
  'completed',
  'delivered',
  'archived',
] as const

// Contract statuses
export const CONTRACT_STATUSES = [
  'draft',
  'sent',
  'signed',
  'active',
  'completed',
  'cancelled',
] as const

// Default settings
export const SETTINGS = {
  MAX_PROOF_SELECTIONS: 50,
  MAX_DOWNLOAD_COUNT: 5,
  DEFAULT_PAGE_SIZE: 20,
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'yyyy년 MM월 dd일',
  DISPLAY_WITH_TIME: 'yyyy년 MM월 dd일 HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const

