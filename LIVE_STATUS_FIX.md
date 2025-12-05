# Live Status 페이지 에러 수정 완료

## 🐛 문제점

`/admin/live-status` 페이지에서 **Internal Server Error** 발생

## 🔍 원인 분석

Next.js 16의 Turbopack 환경에서 **클라이언트 컴포넌트**에서 **서버 전용 모듈**을 직접 import하려고 시도하여 발생한 오류:

```typescript
// ❌ 문제가 있던 코드
import { mockScheduleEvents, mockSchedulePhotographers } from '@/lib/mock/schedules'
import { applyScheduleUpdates } from '@/lib/utils/schedule-storage'
```

클라이언트 컴포넌트(`'use client'`)에서 mock 데이터를 직접 import하면, 서버와 클라이언트 간의 hydration 문제가 발생할 수 있습니다.

## ✅ 해결 방법

### 1. Dynamic Import 사용
mock 데이터를 **동적으로 클라이언트에서 로드**:

```typescript
// ✅ 수정된 코드
const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
const [schedulePhotographers, setSchedulePhotographers] = useState<any[]>([])

useEffect(() => {
  const loadData = async () => {
    try {
      const { mockScheduleEvents, mockSchedulePhotographers } = await import('@/lib/mock/schedules')
      const { applyScheduleUpdates } = await import('@/lib/utils/schedule-storage')
      
      const updatedEvents = applyScheduleUpdates(mockScheduleEvents)
      setScheduleEvents(updatedEvents)
      setSchedulePhotographers(mockSchedulePhotographers)
    } catch (error) {
      console.error('Error loading schedule data:', error)
      setScheduleEvents([])
      setSchedulePhotographers([])
    }
  }
  
  loadData()
}, [])
```

### 2. useMemo로 성능 최적화

계산된 값들을 메모이제이션:

```typescript
const todaySchedules = useMemo(() => {
  return scheduleEvents.filter(event => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
    return eventDate === today
  })
}, [scheduleEvents, today])

const availablePhotographers = useMemo(() => 
  schedulePhotographers.filter(
    p => !photographersWithSchedules.includes(p.id) && p.availabilityStatus === 'available'
  ),
  [schedulePhotographers, photographersWithSchedules]
)
```

## 📊 수정 사항 요약

| 항목 | Before | After |
|------|--------|-------|
| **Import 방식** | Static import | Dynamic import (useEffect) |
| **데이터 저장** | 직접 사용 | State 관리 |
| **성능 최적화** | 없음 | useMemo 적용 |
| **에러 처리** | 없음 | try-catch 추가 |

## 🎯 주요 개선 사항

### 1. 클라이언트/서버 분리
- ✅ 동적 import로 클라이언트에서만 데이터 로드
- ✅ Hydration 문제 해결
- ✅ SSR 호환성 개선

### 2. 성능 최적화
- ✅ `useMemo`로 불필요한 재계산 방지
- ✅ 의존성 배열로 정확한 업데이트 제어

### 3. 에러 처리
- ✅ try-catch로 안전한 데이터 로딩
- ✅ 실패 시 빈 배열로 fallback

### 4. 타입 안전성
- ✅ 타입 명시 유지
- ✅ 린터 에러 0개

## 🚀 결과

- ✅ **Internal Server Error 해결**
- ✅ **페이지 정상 로드**
- ✅ **실시간 현황 업데이트**
- ✅ **린터 에러 0개**

## 💡 학습 포인트

### Next.js 16 + Turbopack에서의 모범 사례

1. **클라이언트 컴포넌트에서 데이터 로딩**:
   ```typescript
   // ✅ Good
   useEffect(() => {
     const loadData = async () => {
       const data = await import('./data')
       setData(data)
     }
     loadData()
   }, [])
   
   // ❌ Bad
   import { data } from './data' // 클라이언트 컴포넌트에서 직접 import
   ```

2. **성능 최적화**:
   - 계산 비용이 높은 로직은 `useMemo` 사용
   - 의존성 배열을 정확하게 지정

3. **에러 처리**:
   - 동적 import는 항상 try-catch로 감싸기
   - fallback 값 제공

---

**수정일**: 2025-12-05  
**파일**: `app/(admin)/admin/live-status/page.tsx`  
**상태**: ✅ 완료

