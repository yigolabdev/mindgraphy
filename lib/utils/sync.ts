/**
 * BroadcastChannel을 사용한 탭 간 실시간 데이터 동기화
 * 
 * 여러 브라우저 탭에서 동시에 애플리케이션을 열었을 때
 * 한 탭에서의 데이터 변경사항을 다른 탭에 실시간으로 반영합니다.
 */

export type BroadcastMessageType =
  | 'CUSTOMER_CREATED'
  | 'CUSTOMER_UPDATED'
  | 'CUSTOMER_DELETED'
  | 'CUSTOMER_STATUS_CHANGED'
  | 'PROJECT_CREATED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'PROJECT_STATUS_CHANGED'
  | 'PHOTOGRAPHER_ASSIGNED'
  | 'DATA_REFRESHED'

export interface BroadcastMessage<T = any> {
  type: BroadcastMessageType
  payload: T
  timestamp: number
  senderId: string
}

export interface CustomerCreatedPayload {
  customerId: string
  customerName: string
}

export interface CustomerStatusChangedPayload {
  customerId: string
  oldStatus: string
  newStatus: string
}

export interface ProjectCreatedPayload {
  projectId: string
  projectNumber: string
}

export interface ProjectStatusChangedPayload {
  projectId: string
  oldStatus: string
  newStatus: string
}

export interface PhotographerAssignedPayload {
  projectId: string
  photographerIds: string[]
}

/**
 * BroadcastChannel 관리 클래스
 */
class DataSyncManager {
  private channel: BroadcastChannel | null = null
  private listeners: Map<string, Set<(message: BroadcastMessage) => void>> = new Map()
  private senderId: string
  private isInitialized: boolean = false

  constructor() {
    this.senderId = this.generateSenderId()
  }

  /**
   * BroadcastChannel 초기화
   */
  initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return
    }

    try {
      // BroadcastChannel API 지원 확인
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('mindgraphy_sync')
        
        this.channel.onmessage = (event) => {
          const message = event.data as BroadcastMessage
          
          // 자신이 보낸 메시지는 무시
          if (message.senderId === this.senderId) {
            return
          }
          
          console.log('[Sync] Message received:', message.type, message.payload)
          
          // 리스너 호출
          this.notifyListeners(message)
        }
        
        this.isInitialized = true
        console.log('[Sync] BroadcastChannel initialized')
      } else {
        console.warn('[Sync] BroadcastChannel not supported in this browser')
      }
    } catch (error) {
      console.error('[Sync] Failed to initialize BroadcastChannel:', error)
    }
  }

  /**
   * Sender ID 생성
   */
  private generateSenderId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * 메시지 브로드캐스트
   */
  broadcast<T = any>(type: BroadcastMessageType, payload: T) {
    if (!this.channel) {
      console.warn('[Sync] BroadcastChannel not initialized')
      return
    }

    const message: BroadcastMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      senderId: this.senderId,
    }

    try {
      this.channel.postMessage(message)
      console.log('[Sync] Message broadcasted:', type, payload)
    } catch (error) {
      console.error('[Sync] Failed to broadcast message:', error)
    }
  }

  /**
   * 메시지 리스너 등록
   */
  on(type: BroadcastMessageType | 'ALL', callback: (message: BroadcastMessage) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    
    this.listeners.get(type)!.add(callback)
    
    // 리스너 제거 함수 반환
    return () => {
      this.off(type, callback)
    }
  }

  /**
   * 메시지 리스너 제거
   */
  off(type: BroadcastMessageType | 'ALL', callback: (message: BroadcastMessage) => void) {
    const listeners = this.listeners.get(type)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  /**
   * 리스너에게 메시지 알림
   */
  private notifyListeners(message: BroadcastMessage) {
    // 특정 타입 리스너 호출
    const typeListeners = this.listeners.get(message.type)
    if (typeListeners) {
      typeListeners.forEach(callback => callback(message))
    }
    
    // 전체 리스너 호출
    const allListeners = this.listeners.get('ALL')
    if (allListeners) {
      allListeners.forEach(callback => callback(message))
    }
  }

  /**
   * BroadcastChannel 종료
   */
  close() {
    if (this.channel) {
      this.channel.close()
      this.channel = null
      this.isInitialized = false
      console.log('[Sync] BroadcastChannel closed')
    }
  }

  /**
   * 모든 리스너 제거
   */
  clearListeners() {
    this.listeners.clear()
  }
}

// 싱글톤 인스턴스
export const dataSyncManager = new DataSyncManager()

/**
 * React Hook: 데이터 동기화 사용
 * 
 * @example
 * ```tsx
 * const { broadcast, subscribe } = useDataSync()
 * 
 * // 메시지 구독
 * useEffect(() => {
 *   const unsubscribe = subscribe('CUSTOMER_CREATED', (message) => {
 *     console.log('New customer created:', message.payload)
 *     // 데이터 새로고침
 *     refreshCustomers()
 *   })
 *   
 *   return unsubscribe
 * }, [])
 * 
 * // 메시지 브로드캐스트
 * const handleCreate = () => {
 *   broadcast('CUSTOMER_CREATED', { customerId: 'customer-123' })
 * }
 * ```
 */
export function useDataSync() {
  // 초기화
  if (typeof window !== 'undefined' && !dataSyncManager['isInitialized']) {
    dataSyncManager.initialize()
  }

  return {
    /**
     * 메시지 브로드캐스트
     */
    broadcast: <T = any>(type: BroadcastMessageType, payload: T) => {
      dataSyncManager.broadcast(type, payload)
    },

    /**
     * 메시지 구독
     */
    subscribe: (type: BroadcastMessageType | 'ALL', callback: (message: BroadcastMessage) => void) => {
      return dataSyncManager.on(type, callback)
    },

    /**
     * 채널 종료
     */
    close: () => {
      dataSyncManager.close()
    },
  }
}

/**
 * 고객 생성 알림
 */
export function broadcastCustomerCreated(customerId: string, customerName: string) {
  dataSyncManager.broadcast('CUSTOMER_CREATED', {
    customerId,
    customerName,
  } as CustomerCreatedPayload)
}

/**
 * 고객 상태 변경 알림
 */
export function broadcastCustomerStatusChanged(
  customerId: string,
  oldStatus: string,
  newStatus: string
) {
  dataSyncManager.broadcast('CUSTOMER_STATUS_CHANGED', {
    customerId,
    oldStatus,
    newStatus,
  } as CustomerStatusChangedPayload)
}

/**
 * 프로젝트 생성 알림
 */
export function broadcastProjectCreated(projectId: string, projectNumber: string) {
  dataSyncManager.broadcast('PROJECT_CREATED', {
    projectId,
    projectNumber,
  } as ProjectCreatedPayload)
}

/**
 * 프로젝트 상태 변경 알림
 */
export function broadcastProjectStatusChanged(
  projectId: string,
  oldStatus: string,
  newStatus: string
) {
  dataSyncManager.broadcast('PROJECT_STATUS_CHANGED', {
    projectId,
    oldStatus,
    newStatus,
  } as ProjectStatusChangedPayload)
}

/**
 * 작가 배정 알림
 */
export function broadcastPhotographerAssigned(projectId: string, photographerIds: string[]) {
  dataSyncManager.broadcast('PHOTOGRAPHER_ASSIGNED', {
    projectId,
    photographerIds,
  } as PhotographerAssignedPayload)
}

/**
 * 데이터 새로고침 알림
 */
export function broadcastDataRefreshed() {
  dataSyncManager.broadcast('DATA_REFRESHED', {})
}

/**
 * 브라우저 종료 시 자동으로 채널 닫기
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    dataSyncManager.close()
  })
}

