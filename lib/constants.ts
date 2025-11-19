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
  ADMIN_LIVE_STATUS: '/admin/live-status',
  ADMIN_CALENDAR: '/admin/calendar',
  ADMIN_SCHEDULE: '/admin/schedule',
  ADMIN_MY: '/admin/my',
  ADMIN_TEAM: '/admin/team',
  
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

// Session Storage Keys (for client portal)
export const SESSION_KEYS = {
  // Product Selection
  PRODUCT_TYPE: 'mindgraphy_product_type',
  CLIENT_TYPE: 'mindgraphy_client_type',
  PACKAGE: 'mindgraphy_package',
  OPTIONS: 'mindgraphy_options',
  
  // Customer Information
  BRIDE_NAME: 'mindgraphy_bride_name',
  GROOM_NAME: 'mindgraphy_groom_name',
  BRIDE_PHONE: 'mindgraphy_bride_phone',
  GROOM_PHONE: 'mindgraphy_groom_phone',
  PHONE: 'mindgraphy_phone',
  EMAIL: 'mindgraphy_email',
  MAIN_CONTACT: 'mindgraphy_main_contact',
  
  // Event Details
  WEDDING_DATE: 'mindgraphy_wedding_date',
  WEDDING_TIME: 'mindgraphy_wedding_time',
  WEDDING_DATE_INFO: 'mindgraphy_wedding_date_info',
  VENUE: 'mindgraphy_venue',
  VENUE_REQUEST: 'mindgraphy_venue_request',
  
  // Referral & Misc
  REFERRAL_SOURCE: 'mindgraphy_referral_source',
  REFERRER_PAGE: 'mindgraphy_referrer_page',
  
  // Auth
  CLIENT_PHONE: 'mindgraphy_client_phone',
  CLIENT_LOGGED_IN: 'mindgraphy_client_logged_in',
} as const

// Product Type values
export const PRODUCT_TYPES = {
  WEDDING: 'wedding',
  HANBOK: 'hanbok',
  DRESS_SHOP: 'dress_shop',
  BABY: 'baby',
} as const

// Client Type values  
export const CLIENT_TYPES = {
  DIRECT: 'direct',
  VENUE_AFFILIATED: 'venue_affiliated',
} as const

