// User & Authentication Types
export type UserRole = 'admin' | 'manager' | 'photographer' | 'editor' | 'client'

export interface User {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  status: 'active' | 'inactive'
}

// Note Types
export interface Note {
  id: string
  content: string
  author: 'customer' | 'admin'
  authorName?: string
  createdAt: string
}

// Customer & CRM Types
export interface Customer {
  id: string
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone: string
  email: string
  sourceChannel: string
  leadStatus: 'inquiry' | 'consultation' | 'proposal' | 'contracted' | 'completed' | 'cancelled'
  assignedManagerId: string
  assignedManager?: User
  notes?: string
  satisfaction?: number // 1-5점 만족도 (완료된 고객만)
  createdAt: string
}

// Contract Types (see below for full Contract interface near ContractTemplate)

// Payment Types
export interface Payment {
  id: string
  contractId: string
  paymentType: 'deposit' | 'balance' | 'additional' | 'refund'
  amount: number
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentDate?: string
  receiptUrl?: string
  cashReceiptIssued: boolean
  notes?: string
  createdAt: string
}

// Project Types
export type ProjectType = 
  | 'wedding' 
  | 'hanbok' 
  | 'dress_shop' 
  | 'baby'
  | 'studio' 
  | 'outdoor' 
  | 'pre_wedding' 
  | 'family'

export type ProjectStatus = 
  | 'scheduled' 
  | 'in_progress' 
  | 'proof_ready' 
  | 'editing' 
  | 'completed' 
  | 'delivered' 
  | 'cancelled'
  | 'archived'

export interface Project {
  id: string
  projectNumber: string
  customerId: string
  customer?: Customer
  contractId: string
  projectType: ProjectType
  projectStatus: ProjectStatus
  packageId?: string  // 선택된 상품 ID
  optionIds?: string[]  // 선택된 옵션 ID 목록
  weddingDate: string
  weddingTime: string
  weddingVenue: string
  makeupInfo?: string
  specialRequests?: string
  referralSource?: string  // 유입 경로
  assignedPhotographerIds?: string[]  // 복수 작가 지원
  assignedPhotographers?: Photographer[]  // 복수 작가 지원
  assignedEditorId?: string
  assignedEditor?: User
  progress: number
  createdAt: string
  updatedAt: string
}

// Shooting Schedule Types
export interface ShootingSchedule {
  id: string
  projectId: string
  project?: Project
  scheduleType: 'main_shoot' | 'pre_wedding' | 'makeup' | 'ceremony' | 'reception'
  startTime: string
  endTime: string
  location: string
  locationAddress: string
  travelTimeMinutes: number
  photographerId?: string
  photographer?: Photographer
  assistantIds: string[]
  equipmentNotes?: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
}

// Photographer Types
export interface Photographer {
  id: string
  userId: string
  user?: User
  portfolioUrl?: string
  experienceYears: number
  specialties: string[]
  rating: number
  totalProjects: number
  availabilityStatus: 'available' | 'busy' | 'on_leave'
  createdAt: string
}

export interface PhotographerAvailability {
  id: string
  photographerId: string
  date: string
  timeSlotStart: string
  timeSlotEnd: string
  isAvailable: boolean
  reason?: string
}

// Photo & Album Types
export type AlbumType = 'raw' | 'proof' | 'edited' | 'final' | 'backup'

export interface PhotoAlbum {
  id: string
  projectId: string
  project?: Project
  albumType: AlbumType
  storageLocation: string
  totalPhotos: number
  totalSizeBytes: number
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed'
  uploadedBy?: string
  uploadedAt?: string
  createdAt: string
}

export interface Photo {
  id: string
  albumId: string
  fileName: string
  filePath: string
  thumbnailPath: string
  fileSizeBytes: number
  width: number
  height: number
  format: string
  metadata?: Record<string, unknown>
  isSelected: boolean
  selectionOrder?: number
  clientComments?: string
  editStatus: 'pending' | 'in_progress' | 'completed' | 'approved'
  createdAt: string
}

// Proof Gallery Types
export interface ProofGallerySession {
  id: string
  projectId: string
  project?: Project
  albumId: string
  album?: PhotoAlbum
  accessToken: string
  expiresAt: string
  maxSelections: number
  currentSelections: number
  clientViewedAt?: string
  selectionCompletedAt?: string
  status: 'pending' | 'active' | 'completed' | 'expired'
  createdAt: string
}

// Editing Queue Types
export interface EditingQueue {
  id: string
  projectId: string
  project?: Project
  photoIds: string[]
  assignedEditorId?: string
  assignedEditor?: User
  priority: 'low' | 'normal' | 'high' | 'urgent'
  editingType: string
  dueDate: string
  startedAt?: string
  completedAt?: string
  status: 'queued' | 'in_progress' | 'review' | 'completed' | 'revision'
  revisionCount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

// Deliverable Types
export interface Deliverable {
  id: string
  projectId: string
  project?: Project
  deliveryType: 'digital_download' | 'usb' | 'album' | 'cloud_link'
  storagePath: string
  downloadLink?: string
  downloadToken?: string
  expiresAt?: string
  downloadCount: number
  maxDownloads: number
  deliveredAt?: string
  deliveryStatus: 'preparing' | 'ready' | 'delivered' | 'expired'
  recipientName: string
  shippingAddress?: string
  trackingNumber?: string
  createdAt: string
}

// Notification Types
export interface Notification {
  id: string
  recipientId: string
  notificationType: 'email' | 'sms' | 'push' | 'in_app'
  channel: string
  subject: string
  message: string
  sentAt?: string
  deliveryStatus: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  openedAt?: string
  clickedAt?: string
  createdAt: string
}

// Calendar Event Types (for FullCalendar)
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  projectId?: string
  photographerId?: string
  location?: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  travelTime?: number
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  extendedProps?: {
    customerName?: string
    venue?: string
    type?: string
    notes?: string
  }
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  conversionRate: number
  averageDeliveryTime: number
  customerSatisfaction: number
  revenue: {
    total: number
    deposits: number
    balance: number
  }
  upcomingShootings: number
  pendingProofs: number
  editingQueue: number
}

// Analytics Types
export interface AnalyticsData {
  period: string
  conversionRate: number[]
  deliveryTime: number[]
  satisfaction: number[]
  revenue: number[]
  labels: string[]
}

// Product Types (for client selection and admin management)
export interface Product {
  id: string
  name: string
  category: 'SNAP' | 'OPTION'
  title: string
  description: string[]
  albumIncluded: boolean
  photoCount: number
  albumPages?: number
  miniAlbums?: number
  basePrice: number
  delivery: {
    includesWebGallery: boolean
    includesRawDownload: boolean
  }
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

// Policy Types
export interface Policy {
  id: string
  name: string
  type: 'cancellation' | 'refund' | 'usage' | 'privacy'
  version: string
  content: string
  effectiveDate: string
  isActive: boolean
  createdAt: string
}

export interface ContractArticle {
  id: string
  order: number
  title: string
  content: string[]
}

// Contract Template (for admin management)
export interface ContractTemplate {
  id: string
  name: string
  version: string
  title: string
  description: string
  articles: ContractArticle[]
  footer: string
  importantNotice: string
  effectiveDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Contract (actual customer contract)
export interface Contract {
  id: string
  templateId: string
  contractNumber: string
  customerId: string
  packageType: string
  weddingDate: string
  weddingTime: string
  venue: string
  totalAmount: number
  depositAmount: number
  balanceAmount: number
  groomName?: string
  brideName?: string
  signedAt?: string
  createdAt: string
}

