import { cn } from '@/lib/utils'

interface DDayCounterProps {
  daysUntil: number
  isPast: boolean
  formattedDate: string
  title: string
  subtitle: string
  showDDay: boolean
  className?: string
}

/**
 * D-Day counter component for portal pages
 * Displays countdown or date based on shooting status
 */
export function DDayCounter({
  daysUntil,
  isPast,
  formattedDate,
  title,
  subtitle,
  showDDay,
  className
}: DDayCounterProps) {
  return (
    <div className={cn('text-center space-y-4 py-8', className)}>
      {showDDay ? (
        <>
          <p className="text-sm text-zinc-500 tracking-wide">
            {title}
          </p>
          <div className="space-y-2">
            <p className="text-6xl font-light text-zinc-900 tracking-tight">
              D-{daysUntil}
            </p>
            <p className="text-sm text-zinc-500">
              {formattedDate}
            </p>
          </div>
          <p className="text-xs text-zinc-400 pt-4 leading-relaxed">
            {subtitle}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-500 tracking-wide">
            {title}
          </p>
          <div className="space-y-2">
            <p className="text-3xl font-light text-zinc-900 tracking-tight">
              {formattedDate}
            </p>
          </div>
          <p className="text-xs text-zinc-400 pt-4 leading-relaxed">
            {subtitle}
          </p>
        </>
      )}
    </div>
  )
}

