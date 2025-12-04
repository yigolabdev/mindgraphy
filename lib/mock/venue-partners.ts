/**
 * 제휴 웨딩홀 및 플래너 Mock 데이터
 */

export interface VenuePartner {
  id: string
  name: string
  type: 'wedding_hall' | 'planner' | 'hotel'
  location: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  commissionRate?: number // 수수료율 (%)
  contractStartDate?: string
  contractEndDate?: string
  isActive: boolean
  notes?: string
}

export const mockVenuePartners: VenuePartner[] = [
  {
    id: 'venue-001',
    name: '서울 그랜드 웨딩홀',
    type: 'wedding_hall',
    location: '서울시 강남구',
    contactPerson: '김담당자',
    contactPhone: '02-1234-5678',
    contactEmail: 'contact@seoulgrande.com',
    commissionRate: 15,
    contractStartDate: '2024-01-01',
    contractEndDate: '2025-12-31',
    isActive: true,
    notes: '메인 제휴 웨딩홀. 월 평균 3~4건 의뢰'
  },
  {
    id: 'venue-002',
    name: '부산 해운대 그랜드 호텔',
    type: 'hotel',
    location: '부산시 해운대구',
    contactPerson: '이지배인',
    contactPhone: '051-987-6543',
    contactEmail: 'wedding@haeundaehotel.com',
    commissionRate: 12,
    contractStartDate: '2024-03-01',
    contractEndDate: '2025-12-31',
    isActive: true,
    notes: '호텔 웨딩 전문. 고급 패키지 주문 많음'
  },
  {
    id: 'venue-003',
    name: '더플래너 웨딩컨설팅',
    type: 'planner',
    location: '서울시 서초구',
    contactPerson: '박플래너',
    contactPhone: '010-1111-2222',
    contactEmail: 'info@theplanner.com',
    commissionRate: 10,
    contractStartDate: '2024-06-01',
    contractEndDate: '2025-12-31',
    isActive: true,
    notes: '웨딩 플래너. 프리미엄 고객 위주'
  },
  {
    id: 'venue-004',
    name: '인천 파라다이스 웨딩',
    type: 'wedding_hall',
    location: '인천시 연수구',
    contactPerson: '최실장',
    contactPhone: '032-555-6666',
    contactEmail: 'wedding@paradise.com',
    commissionRate: 15,
    contractStartDate: '2024-02-01',
    contractEndDate: '2025-12-31',
    isActive: true,
    notes: '중형 웨딩홀. 안정적인 거래처'
  },
  {
    id: 'venue-005',
    name: '롯데호텔 웨딩',
    type: 'hotel',
    location: '서울시 중구',
    contactPerson: '정부장',
    contactPhone: '02-777-8888',
    contactEmail: 'wedding@lotte.com',
    commissionRate: 10,
    contractStartDate: '2024-01-01',
    contractEndDate: '2025-12-31',
    isActive: true,
    notes: '특급 호텔. VIP 고객 많음'
  },
  {
    id: 'venue-006',
    name: '라벨라 웨딩플래너',
    type: 'planner',
    location: '서울시 강남구',
    contactPerson: '윤대표',
    contactPhone: '010-3333-4444',
    contactEmail: 'contact@labella.com',
    commissionRate: 12,
    contractStartDate: '2024-04-01',
    contractEndDate: '2025-12-31',
    isActive: true,
    notes: '신규 제휴 플래너. 해외 웨딩 전문'
  }
]

/**
 * 제휴처 ID로 이름 가져오기
 */
export function getVenuePartnerName(partnerId: string): string {
  const partner = mockVenuePartners.find(p => p.id === partnerId)
  return partner?.name || '알 수 없음'
}

/**
 * 제휴처 타입 라벨 가져오기
 */
export function getVenuePartnerTypeLabel(type: VenuePartner['type']): string {
  const labels = {
    wedding_hall: '웨딩홀',
    planner: '웨딩플래너',
    hotel: '호텔'
  }
  return labels[type] || type
}

/**
 * 활성 제휴처만 가져오기
 */
export function getActiveVenuePartners(): VenuePartner[] {
  return mockVenuePartners.filter(p => p.isActive)
}

