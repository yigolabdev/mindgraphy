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
  permissions?: import('./types/auth').PagePermission[] // 작가의 경우 허용된 페이지 권한
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
  webGallery?: {
    id: string
    galleryId: string
    title: string
    sharedUrl: string
    photoCount: number
    isActive: boolean
  }
  weddingDetails?: WeddingDetails  // 예식 상세 정보
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

// Web Gallery Types (공유 가능한 웹갤러리)
export interface WebGallery {
  id: string
  galleryId: string // 고유 공유 ID (URL에 사용)
  projectId: string
  project?: Project
  customerId: string
  customer?: Customer
  title: string // 갤러리 제목 (예: "김철수 & 이영희 웨딩 갤러리")
  password: string // 대표 번호 뒤 4자리 (해시화되어 저장)
  sharedUrl: string // 공유 URL (예: /gallery/abc123)
  photoCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string // 업로드한 작가 ID
}

export interface GalleryPhoto {
  id: string
  galleryId: string
  gallery?: WebGallery
  imageUrl: string
  thumbnailUrl: string
  fileName: string
  fileSizeBytes: number
  width: number
  height: number
  uploadedAt: string
  uploadedBy?: string
  order: number // 표시 순서
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

// Time Table Types (당일 일정표)
export type TimeModifier = 'exact' | 'estimated' | 'around' // 정확, 예상, 즈음

export interface TimeTableEntry {
  id: string
  projectId: string
  time: string // HH:MM 형식
  timeModifier: TimeModifier // 정확/예상/즈음
  event: string // 이벤트 내용
  location?: string // 장소 (선택사항)
  notes?: string // 추가 메모
  order: number // 표시 순서
  createdAt: string
  updatedAt: string
}

export interface TimeTable {
  id: string
  projectId: string
  project?: Project
  title: string // 예: "2025.06.15 (토) 타임 테이블"
  entries: TimeTableEntry[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string // 작성한 작가 ID
}

// Wedding Details Types (예식 상세 정보)
export interface WeddingDetails {
  timeConfirmed: boolean
  // 타임테이블
  makeupShop?: string
  makeupStartTime?: string
  makeupEndTime?: string
  // 예식 내용
  hasPreCeremonyPhoto?: 'yes' | 'no'
  hasOfficiant?: 'yes' | 'no'
  hasMC?: 'yes' | 'no'
  mcType?: 'professional' | 'friend'
  hasRingExchange?: 'yes' | 'no'
  hasFlowerGirl?: 'yes' | 'no'
  hasPaebaek?: 'yes' | 'no'
  // 가족 구성
  groomFamily?: string
  brideFamily?: string
  // 사진 스타일
  preferredStyle?: string
  notPreferredStyle?: string
  // 의상 정보
  mainDressInfo?: string
  receptionDressInfo?: string
  groomSuitInfo?: string
  // 협력 업체
  dressShop?: string
  suitShop?: string
  makeupShopName?: string
  planner?: string
  videoTeam?: string
  iphoneSnap?: string
  otherTeam?: string
  specialRequests?: string
  // 신혼여행
  honeymoonDeparture?: string
  honeymoonDestination?: string
  honeymoonReturn?: string
  // 미팅 방식
  meetingType?: 'direct' | 'phone' | 'list'
  // 청첩장
  invitationUrl?: string
}

