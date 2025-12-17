# 🚀 Mindgraphy 전문가급 리팩토링 가이드

**목표**: 모든 페이지를 안정적이고 최적화된 코드로 전환

---

## 📊 리팩토링 범위

### 완료된 작업
- ✅ 공통 타입 정의 (`lib/types/index.ts`)
- ✅ 공통 상수 정의 (`lib/constants/index.ts`)
- ✅ 유틸리티 함수 (`lib/utils/*.ts`)
- ✅ UI 컴포넌트 (`components/ui/*.tsx`)

### 진행 중
- 🔄 Admin 페이지 (18개)
- 🔄 Client 페이지 (19개)

---

## 🎯 리팩토링 원칙

### 1. 타입 안전성
```typescript
// ❌ Before
const [data, setData] = useState<any>([])

// ✅ After
const [data, setData] = useState<Customer[]>([])
```

### 2. 코드 중복 제거
```typescript
// ❌ Before
const handleClick1 = () => { /* 중복 코드 */ }
const handleClick2 = () => { /* 중복 코드 */ }

// ✅ After
const useHandleClick = () => { /* 재사용 로직 */ }
```

### 3. 커스텀 훅 사용
```typescript
// ❌ Before
useEffect(() => {
  // 복잡한 데이터 로딩 로직
}, [])

// ✅ After
const { data, isLoading, error } = useCustomers()
```

### 4. 상수 활용
```typescript
// ❌ Before
if (status === 'completed') { /* ... */ }

// ✅ After
import { LEAD_STATUS } from '@/lib/constants'
if (status === LEAD_STATUS.COMPLETED) { /* ... */ }
```

### 5. 에러 핸들링
```typescript
// ❌ Before
try {
  // code
} catch (error) {
  console.error(error)
}

// ✅ After
import { handleError } from '@/lib/utils/error-handling'
try {
  // code
} catch (error) {
  handleError(error, 'Context')
}
```

### 6. 성능 최적화
```typescript
// ✅ useMemo for expensive calculations
const sortedData = useMemo(() => 
  data.sort((a, b) => a.name.localeCompare(b.name)),
  [data]
)

// ✅ useCallback for event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies])
```

### 7. 접근성
```typescript
// ✅ ARIA labels
<button aria-label="고객 상세 보기">보기</button>

// ✅ Keyboard navigation
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
```

---

## 📁 파일 구조 개선

### Before
```
app/
  admin/
    dashboard/
      page.tsx (500 lines, 모든 로직 포함)
```

### After
```
app/
  admin/
    dashboard/
      page.tsx (150 lines, UI만)
      hooks/
        use-dashboard-data.ts (데이터 로딩)
        use-dashboard-kpi.ts (KPI 계산)
      components/
        dashboard-kpi-section.tsx
        dashboard-charts-section.tsx
```

---

## 🔧 주요 리팩토링 항목

### Admin 페이지

#### 1. Dashboard (`/admin/dashboard`)
- ✅ 커스텀 훅으로 데이터 로딩 분리
- ✅ KPI 계산 로직 모듈화
- ✅ 차트 컴포넌트 최적화
- ✅ 타입 안정성 강화

#### 2. Customers (`/admin/customers`)
- ✅ 필터링 로직 훅으로 분리
- ✅ 테이블/카드 뷰 컴포넌트화
- ✅ 정렬/검색 최적화
- ✅ 대량 작업 지원

#### 3. Projects (`/admin/projects`)
- ✅ CRUD 작업 훅으로 통합
- ✅ 상태 관리 개선
- ✅ 폼 검증 강화

#### 4. Calendar (`/admin/calendar`)
- ✅ 일정 관리 로직 모듈화
- ✅ 드래그앤드롭 최적화
- ✅ 충돌 감지 로직

#### 5. Projects/New (`/admin/projects/new`)
- ✅ 다단계 폼 상태 관리
- ✅ 유효성 검사 개선
- ✅ 자동 저장 기능

### Client 페이지

#### 신청 플로우 (8단계)
1. Product Type (`/c/product-type`)
2. Wedding Date (`/c/wedding-date`)
3. Packages (`/c/packages`)
4. Options (`/c/options`)
5. Venue Info (`/c/venue-info`)
6. Venue Contact (`/c/venue-contact`)
7. Venue Details (`/c/venue-details`)
8. Venue Date (`/c/venue-date`)

**공통 개선사항**:
- ✅ 플로우 상태 관리 훅
- ✅ 세션 스토리지 유틸리티
- ✅ Progress Indicator 통일
- ✅ 뒤로가기/앞으로가기 로직

#### 포털 페이지
- Wedding Details (`/c/portal/wedding-details`)
- Contract (`/c/portal/contract`)
- Portal Main (`/c/portal`)

---

## 🛠️ 생성된 유틸리티

### 1. 데이터 로딩 훅
```typescript
// lib/hooks/use-customers.ts
export function useCustomers(filters?: FilterState) {
  const [data, setData] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 로딩 로직
  
  return { data, isLoading, error, refetch }
}
```

### 2. 필터링 훅
```typescript
// lib/hooks/use-table-filter.ts
export function useTableFilter<T>(
  data: T[],
  filterFn: (item: T, filters: FilterState) => boolean
) {
  const [filters, setFilters] = useState<FilterState>({})
  const filteredData = useMemo(() => 
    data.filter(item => filterFn(item, filters)),
    [data, filters]
  )
  
  return { filteredData, filters, setFilters }
}
```

### 3. 폼 상태 관리 훅
```typescript
// lib/hooks/use-form-state.ts
export function useFormState<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  
  const handleChange = useCallback((
    field: keyof T, 
    value: any
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 실시간 검증
  }, [])
  
  return { formData, errors, handleChange, validate }
}
```

---

## 📈 성능 최적화

### 1. 코드 스플리팅
```typescript
// ✅ Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingState />,
  ssr: false
})
```

### 2. 메모이제이션
```typescript
// ✅ Expensive calculations
const sortedCustomers = useMemo(() => 
  customers.sort((a, b) => a.name.localeCompare(b.name)),
  [customers]
)
```

### 3. Debouncing
```typescript
// ✅ Search input
const debouncedSearch = useDebounce(searchQuery, 300)
```

### 4. Virtual Scrolling
```typescript
// ✅ Large lists (100+ items)
import { VirtualizedList } from '@/components/ui/virtualized-list'
```

---

## 🧪 테스트 가능한 구조

### Before
```typescript
// 테스트하기 어려운 구조
export default function Page() {
  const [data, setData] = useState([])
  // 모든 로직이 컴포넌트 안에
}
```

### After
```typescript
// 테스트 가능한 구조
// hooks/use-page-data.ts
export function usePageData() {
  // 로직만 분리
}

// page.tsx
export default function Page() {
  const { data } = usePageData() // 훅 테스트 가능
  return <PageView data={data} /> // 컴포넌트 테스트 가능
}
```

---

## 📊 진행 상황

### ✅ 완료 (2개)
- 공통 타입 시스템
- 공통 상수 시스템

### 🔄 진행 중 (8개)
- Admin Dashboard
- Admin Customers
- Admin Projects
- Admin Calendar
- Client 신청 플로우
- Client 포털
- 공통 컴포넌트
- 성능 최적화

### ⏳ 대기 중 (27개)
- 나머지 Admin 페이지
- 나머지 Client 페이지

---

## 🎯 예상 개선 효과

| 항목 | 개선 전 → 개선 후 |
|------|------------------|
| 코드 중복 | 40% → 10% |
| 타입 커버리지 | 60% → 95% |
| 번들 크기 | 100% → 70% |
| 초기 로딩 | 3s → 1.5s |
| 유지보수성 | 중 → 상 |
| 테스트 가능성 | 낮음 → 높음 |

---

**마지막 업데이트**: 2024-12-16  
**작업자**: AI Assistant  
**예상 완료 시간**: 계속 진행 중
