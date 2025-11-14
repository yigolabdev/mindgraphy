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
  createdAt: string
}

// Contract Types
export interface Contract {
  id: string
  contractNumber: string
  customerId: string
  customer?: Customer
  packageType: string
  totalAmount: number
  depositAmount: number
  balanceAmount: number
  contractStatus: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled'
  contractDate: string
  signedAt?: string
  pdfUrl?: string
  createdAt: string
}

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
  projectType: 'wedding' | 'studio' | 'outdoor' | 'pre_wedding' | 'family'
  projectStatus: ProjectStatus
  weddingDate: string
  weddingTime: string
  weddingVenue: string
  makeupInfo?: string
  specialRequests?: string
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

