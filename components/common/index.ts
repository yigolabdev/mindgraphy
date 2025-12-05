/**
 * Common Components Index
 * 
 * 공통 컴포넌트를 편리하게 import하기 위한 barrel export
 */

// Layout Components
export { ClientLayout } from '../layout/client-layout'
export type { ClientLayoutVariant } from '../layout/client-layout'

// Common Components
export { SectionHeader } from './section-header'
export { PageHeader } from './page-header'
export { FormField } from './form-field'
export { EmptyState } from './empty-state'
export { ErrorBoundary, withErrorBoundary } from './error-boundary-client'

// Loading Components
export {
  PageLoader,
  SectionLoader,
  InlineLoader,
  ProjectCardSkeleton,
  ProjectListSkeleton,
  CustomerCardSkeleton,
  CustomerListSkeleton,
  TableSkeleton,
  FormSkeleton,
  ButtonLoader,
} from './loading'

// Loading Skeleton Components (Dashboard specific)
export {
  DashboardKPISkeleton,
  ScheduleListSkeleton,
  NotificationListSkeleton,
} from './loading-skeleton'

// Progress Components
export { ProgressBar } from './progress-bar'
export { ProgressStat } from './progress-stat'

// Status Components
export { StatusBadge } from './status-badge'
export { DdayBadge } from './dday-badge'

// Card Components
export { StatCard } from './stat-card'
export { KPICard } from './kpi-card'
