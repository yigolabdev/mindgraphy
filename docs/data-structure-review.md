# 데이터 구조 검토 및 백엔드 통합 개선안

## 📊 현재 데이터 구조 분석

### 1. **실제 운영 데이터 구조**

```typescript
// Project (프로젝트)
interface Project {
  packageId?: string        // 선택된 상품 ID (예: 'new-basic', 'data', 'hanbok-a2')
  optionIds?: string[]      // 선택된 옵션 ID 목록 (예: ['option-lead-photographer', 'option-extra-gift'])
  assignedPhotographerIds?: string[]  // 배정된 작가 ID 목록
}

// Product (상품 정보)
interface Product {
  id: string                // 'new-basic', 'data', 'hanbok-a2' 등
  name: string              // 'new BASIC', 'DATA', 'A-2' 등
  category: 'SNAP' | 'OPTION'
  description: string[]     // 상세 설명 배열
  albumIncluded: boolean    // 앨범 포함 여부 (앨범형/데이터형 구분)
  photoCount: number        // 제공 사진 수
}

// Contract (계약서)
interface Contract {
  packageType: string  // 'DATA', 'PREMIUM', 'HANBOK B1' 등 - 자유 텍스트
}
```

### 2. **현재 캘린더 표시 방식의 문제점**

#### ❌ **문제 1: 데이터 소스 불일치**
```typescript
// ScheduleEvent (캘린더용 - 현재)
interface ScheduleEvent {
  packageName: string    // ❌ 자유 텍스트 ('2인 데이터형', 'DATA' 등 - 일관성 없음)
  options: string[]      // ❌ 자유 텍스트 배열 (['대표작가 지정', '야외촬영'] 등)
}
```

**문제:**
- `packageName`과 `options`가 자유 텍스트라서 파싱에 의존
- **실제 `Project`의 `packageId`와 `optionIds`를 사용하지 않음**
- **백엔드에서 전달할 정형 데이터가 아닌 표시용 문자열**

#### ❌ **문제 2: 중요 정보 누락**
```typescript
// 현재 구조에는 다음 정보가 명시적으로 없음:
- 대표작가 지정 여부
- 수석작가 지정 여부
- 작가 추가 선물 여부
- 60페이지 구성 (새로운 구성) 여부
- 이사 지정 여부
```

**문제:**
- 이러한 정보들이 `options` 문자열 배열에 섞여 있어 파싱 필요
- 백엔드에서 Boolean 필드로 전달해야 할 데이터를 문자열로 처리

---

## ✅ 개선안: 백엔드 통합 가능한 구조

### **개선된 ScheduleEvent 타입 정의**

```typescript
export interface ScheduleEvent {
  id: string
  
  // 기존 필드들...
  groomName: string
  brideName: string
  
  // ========== 개선: 정형화된 상품 정보 ==========
  projectId: string              // 프로젝트 ID 추가 (필수)
  contractId: string
  
  // 상품 정보 (Product와 연결)
  packageId: string              // ✅ 'new-basic', 'data', 'hanbok-a2' 등
  packageName: string            // ✅ 표시용 이름 (변경 불가)
  packageCategory: 'SNAP'        // ✅ 상품 카테고리
  isAlbumType: boolean           // ✅ 앨범형 여부 (true: 앨범형, false: 데이터형)
  
  // 옵션 정보 (Option IDs와 연결)
  optionIds: string[]            // ✅ ['option-lead', 'option-extra-gift'] 등
  optionLabels: string[]         // ✅ 표시용 라벨 (백엔드에서 생성)
  
  // 작가 정보
  photographerIds: string[]
  photographerNames: string[]
  photographerCount: number      // ✅ 명시적 작가 수
  
  // ========== 개선: 명시적 특수 옵션 필드 ==========
  packageOptions: {
    hasLeadPhotographer: boolean     // ✅ 대표작가 지정
    hasSeniorPhotographer: boolean   // ✅ 수석작가 지정
    hasExtraGift: boolean            // ✅ 작가 추가 선물
    hasNewStructure: boolean         // ✅ 60페이지 구성
    hasDirectorOption: boolean       // ✅ 이사 지정
  }
  
  // 기타 정보들...
}
```

### **백엔드 API 응답 예시**

```json
{
  "id": "schedule-1",
  "projectId": "project-123",
  "contractId": "contract-001",
  
  "groomName": "홍길동",
  "brideName": "김영희",
  
  "packageId": "new-basic",
  "packageName": "new BASIC",
  "packageCategory": "SNAP",
  "isAlbumType": true,
  
  "optionIds": ["option-lead-photographer", "option-60p"],
  "optionLabels": ["대표작가 지정", "60페이지 구성"],
  
  "photographerIds": ["photo-1", "photo-2"],
  "photographerNames": ["박작가", "최작가"],
  "photographerCount": 2,
  
  "packageOptions": {
    "hasLeadPhotographer": true,
    "hasSeniorPhotographer": false,
    "hasExtraGift": false,
    "hasNewStructure": true,
    "hasDirectorOption": false
  },
  
  "start": "2025-12-05T11:00:00Z",
  "end": "2025-12-05T16:00:00Z",
  "venueName": "서울 그랜드 호텔"
}
```

---

## 🔧 구현 개선 방안

### **1단계: ScheduleEvent 타입 확장**

```typescript
// lib/mock/schedules.ts 또는 lib/types.ts
export interface ScheduleEvent {
  // ... 기존 필드
  
  // 추가 필드
  projectId?: string  // 프로젝트와 연결
  packageId: string   // Product.id와 매칭
  optionIds?: string[]  // Option IDs
  isAlbumType?: boolean  // 앨범형/데이터형 구분
  
  packageOptions?: {
    hasLeadPhotographer?: boolean
    hasSeniorPhotographer?: boolean
    hasExtraGift?: boolean
    hasNewStructure?: boolean
    hasDirectorOption?: boolean
  }
}
```

### **2단계: 옵션 ID 상수 정의**

```typescript
// lib/constants/package-options.ts
export const PACKAGE_OPTIONS = {
  LEAD_PHOTOGRAPHER: 'option-lead-photographer',
  SENIOR_PHOTOGRAPHER: 'option-senior-photographer',
  EXTRA_GIFT: 'option-extra-gift',
  NEW_STRUCTURE_60P: 'option-60p',
  DIRECTOR_OPTION: 'option-director',
} as const

export const OPTION_LABELS: Record<string, string> = {
  'option-lead-photographer': '대표작가 지정',
  'option-senior-photographer': '수석작가 지정',
  'option-extra-gift': '작가 추가 선물',
  'option-60p': '60페이지 구성',
  'option-director': '이사 지정',
}
```

### **3단계: Parser 개선**

```typescript
// lib/utils/package-parser.ts (개선)
export function parsePackageInfoFromIds(
  packageId: string,
  optionIds: string[],
  photographerCount: number
): PackageInfo {
  // Product 데이터베이스에서 packageId로 조회
  const product = getProductById(packageId)
  
  return {
    photographerCount,
    packageType: product.albumIncluded ? 'album' : 'data',
    hasLeadPhotographer: optionIds.includes(PACKAGE_OPTIONS.LEAD_PHOTOGRAPHER),
    hasSeniorPhotographer: optionIds.includes(PACKAGE_OPTIONS.SENIOR_PHOTOGRAPHER),
    hasExtraGift: optionIds.includes(PACKAGE_OPTIONS.EXTRA_GIFT),
    hasNewStructure: optionIds.includes(PACKAGE_OPTIONS.NEW_STRUCTURE_60P),
    hasDirectorOption: optionIds.includes(PACKAGE_OPTIONS.DIRECTOR_OPTION),
    displayLabel: `${photographerCount}인 ${product.albumIncluded ? '앨범형' : '데이터형'}`
  }
}
```

### **4단계: 캘린더 컴포넌트 개선**

```typescript
// components/calendar/calendar-event-content.tsx
export function CalendarEventContent({ eventInfo }: CalendarEventContentProps) {
  const props = event.extendedProps as ScheduleEvent
  
  // ✅ 우선순위 1: packageOptions 사용 (백엔드가 제공하는 경우)
  if (props.packageOptions) {
    const badges = []
    if (props.packageOptions.hasSeniorPhotographer) {
      badges.push({ label: '수석작가', color: '...' })
    }
    if (props.packageOptions.hasLeadPhotographer) {
      badges.push({ label: '대표작가', color: '...' })
    }
    // ... 나머지 배지들
  }
  
  // ✅ 우선순위 2: optionIds 사용 (정형화된 ID가 있는 경우)
  else if (props.optionIds) {
    const badges = getPackageBadgesFromIds(props.optionIds)
  }
  
  // ❌ 폴백: 기존 문자열 파싱 (레거시 데이터 지원)
  else {
    const packageInfo = parsePackageInfo(
      props.packageName,
      props.options || [],
      props.photographerNames?.length || 0
    )
    const badges = getPackageBadges(packageInfo)
  }
  
  // 렌더링...
}
```

---

## 📋 마이그레이션 체크리스트

### **즉시 개선 가능 (프론트엔드)**
- [x] `parsePackageInfo` 유틸리티 함수 생성 (완료)
- [ ] `ScheduleEvent` 타입에 `packageOptions` 필드 추가
- [ ] 옵션 ID 상수 정의
- [ ] Mock 데이터에 `optionIds` 및 `packageOptions` 추가

### **백엔드 통합 시 필요**
- [ ] API 응답에 `packageId`, `optionIds`, `packageOptions` 포함
- [ ] Product 마스터 데이터 API 구축
- [ ] Option 마스터 데이터 API 구축
- [ ] ScheduleEvent 생성 시 Project와 Contract에서 데이터 자동 매핑

---

## 🎯 결론

### **현재 구조의 문제점**
1.  ❌ 자유 텍스트 기반 (`packageName`, `options`)
2.  ❌ 실제 Project/Contract 데이터와 분리됨
3.  ❌ 파싱에 의존하여 오류 가능성 높음

### **개선된 구조의 장점**
1.  ✅ 정형화된 ID 기반 (`packageId`, `optionIds`)
2.  ✅ Project/Contract와 일관성 유지
3.  ✅ 명시적 Boolean 필드로 명확한 로직
4.  ✅ 백엔드 통합 시 즉시 사용 가능

### **권장 사항**
- **단기**: 현재 파싱 방식 유지하되, `packageOptions` 필드 추가하여 점진적 마이그레이션
- **장기**: 백엔드 통합 시 `packageId` + `optionIds` 기반으로 전환하고 파싱 로직은 폴백으로만 사용

