# 🔧 Next.js 16 + Turbopack Mock Data Import 에러 수정 가이드

## 🐛 문제 요약

**모든 admin 페이지에서 Internal Server Error 발생**

### 원인
Next.js 16의 Turbopack 환경에서 클라이언트 컴포넌트(`'use client'`)가 mock 데이터를 **static import**하면서 발생하는 SSR/Hydration 충돌

```typescript
// ❌ 문제가 있는 패턴
import { mockCustomers, mockProjects } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'
```

---

## ✅ 해결 방법: Dynamic Import Pattern

### 1. Import 제거
```typescript
// ❌ Before: Static imports
import { mockCustomers, mockProjects } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'

// ✅ After: 타입만 import
import type { Customer, Project, Product } from '@/lib/types'
```

### 2. State 추가
```typescript
const [mockCustomers, setMockCustomers] = useState<Customer[]>([])
const [mockProjects, setMockProjects] = useState<Project[]>([])
const [mockProducts, setMockProducts] = useState<Product[]>([])
const [isLoading, setIsLoading] = useState(true)
```

### 3. useEffect로 데이터 로드
```typescript
useEffect(() => {
  const loadData = async () => {
    try {
      const mockData = await import('@/lib/mock-data')
      const mockSettings = await import('@/lib/mock/settings')
      
      setMockCustomers(mockData.mockCustomers)
      setMockProjects(mockData.mockProjects)
      setMockProducts(mockSettings.mockProducts)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setIsLoading(false)
    }
  }
  
  loadData()
}, [])
```

### 4. 로딩 상태 처리
```typescript
if (isLoading) {
  return (
    <AdminLayout>
      <PageLoader />
    </AdminLayout>
  )
}
```

---

## 📋 수정이 필요한 파일 목록

다음 10개 페이지가 동일한 패턴으로 수정 필요:

### ✅ 완료
1. `app/(admin)/admin/live-status/page.tsx` ✅
2. `app/(admin)/admin/dashboard/page.tsx` ✅

### 🔧 수정 필요
3. `app/(admin)/admin/customers/page.tsx` 🔧
4. `app/(admin)/admin/projects/page.tsx` 🔧
5. `app/(admin)/admin/projects/new/page.tsx` 🔧
6. `app/(admin)/admin/schedule/page.tsx` 🔧
7. `app/(admin)/admin/team/performance/page.tsx` 🔧
8. `app/(admin)/admin/my/page.tsx` 🔧
9. `app/(admin)/admin/login/page.tsx` 🔧
10. `app/(admin)/admin/projects/page.refactored.tsx` 🔧
11. `app/(admin)/admin/projects/new/page.refactored.tsx` 🔧

---

## 🚀 빠른 수정 템플릿

### 기본 템플릿

```typescript
'use client'

import { useState, useEffect } from 'react'
import type { Customer, Project } from '@/lib/types'

export default function YourPage() {
  // 1. State 추가
  const [mockCustomers, setMockCustomers] = useState<Customer[]>([])
  const [mockProjects, setMockProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 2. Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const { mockCustomers, mockProjects } = await import('@/lib/mock-data')
        setMockCustomers(mockCustomers)
        setMockProjects(mockProjects)
        setIsLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setIsLoading(false)
      }
    }
    loadData()
  }, [])
  
  // 3. Loading UI
  if (isLoading) {
    return <PageLoader />
  }
  
  // 4. 기존 로직 그대로 사용
  return <div>...</div>
}
```

---

## 💡 각 페이지별 수정 포인트

### customers/page.tsx
```typescript
// imports to remove:
- mockCustomers, mockProjects, mockContracts, mockPayments
- mockProducts

// states to add:
const [mockCustomers, setMockCustomers] = useState<Customer[]>([])
const [mockProjects, setMockProjects] = useState<Project[]>([])
const [mockContracts, setMockContracts] = useState<Contract[]>([])
const [mockPayments, setMockPayments] = useState<Payment[]>([])
const [mockProducts, setMockProducts] = useState<Product[]>([])
```

### projects/page.tsx
```typescript
// imports to remove:
- mockProjects, mockCustomers
- mockProducts

// states to add:
const [mockProjects, setMockProjects] = useState<Project[]>([])
const [mockCustomers, setMockCustomers] = useState<Customer[]>([])
const [mockProducts, setMockProducts] = useState<Product[]>([])
```

### schedule/page.tsx
```typescript
// imports to remove:
- mockScheduleEvents, mockSchedulePhotographers
- applyScheduleUpdates

// states to add:
const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
const [schedulePhotographers, setSchedulePhotographers] = useState<any[]>([])
```

---

## 🎯 핵심 원칙

### DO ✅
1. **Dynamic Import** 사용
2. **useEffect**에서 데이터 로드
3. **Loading State** 관리
4. **Error Handling** 추가
5. **타입 안전성** 유지

### DON'T ❌
1. 클라이언트 컴포넌트에서 mock 데이터 static import
2. 로딩 상태 없이 렌더링
3. 에러 처리 생략
4. Hydration 충돌 무시

---

## 🔍 검증 방법

### 1. 빌드 테스트
```bash
npm run build
```

### 2. 개발 서버
```bash
npm run dev
```

### 3. 각 페이지 접속
- `http://localhost:3000/` ✅
- `http://localhost:3000/admin/dashboard` ✅
- `http://localhost:3000/admin/customers` 🔧
- `http://localhost:3000/admin/projects` 🔧
- `http://localhost:3000/admin/schedule` 🔧

---

## 📊 우선순위

### High Priority (즉시 수정)
1. ✅ dashboard (완료)
2. ✅ live-status (완료)
3. 🔧 customers (사용 빈도 높음)
4. 🔧 projects (핵심 기능)

### Medium Priority (곧 수정)
5. 🔧 schedule
6. 🔧 projects/new

### Low Priority (필요시 수정)
7. 🔧 team/performance
8. 🔧 my
9. 🔧 login (이미 로그인 페이지는 작동 중일 수 있음)

---

## 🎉 기대 효과

- ✅ Internal Server Error 해결
- ✅ SSR/Hydration 안정화
- ✅ Next.js 16 호환성
- ✅ Turbopack 최적화
- ✅ 성능 향상

---

**수정일**: 2025-12-05  
**상태**: 진행 중 (2/11 완료)

