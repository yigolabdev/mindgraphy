import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { PORTAL_STEPS } from '@/lib/utils/portal.utils'

interface ProgressSectionProps {
  currentStep: number
  progressPercentage: number
  className?: string
}

/**
 * Progress section component showing customer journey steps
 * Displays visual progress bar and step indicators
 */
export function ProgressSection({
  currentStep,
  progressPercentage,
  className
}: ProgressSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-lg font-medium text-zinc-900 text-center">
        진행 상황
      </h2>
      
      {/* Progress Bar Visual */}
      <div className="space-y-4">
        <Progress 
          value={progressPercentage} 
          className="h-2" 
          aria-label={`진행률 ${progressPercentage}%`}
        />
        
        {/* Steps */}
        <div className="grid grid-cols-7 gap-2">
          {PORTAL_STEPS.map((step) => {
            const Icon = getStepIcon(step.id)
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            
            return (
              <div 
                key={step.id} 
                className="flex flex-col items-center space-y-2"
                role="status"
                aria-label={`${step.label}: ${isCurrent ? '진행중' : isCompleted ? '완료' : '대기중'}`}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-zinc-900 text-white',
                  isCurrent && 'bg-zinc-900 text-white ring-4 ring-zinc-200',
                  !isCompleted && !isCurrent && 'bg-zinc-100 text-zinc-400'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={cn(
                  'text-xs text-center leading-tight transition-colors duration-300',
                  (isCompleted || isCurrent) ? 'text-zinc-900 font-medium' : 'text-zinc-400'
                )}>
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Status Message */}
      <div className="text-center pt-4">
        <p className="text-sm text-zinc-600 leading-relaxed">
          {PORTAL_STEPS[currentStep]?.description}
        </p>
      </div>
    </div>
  )
}

// Helper function to get icon component for each step
function getStepIcon(step: number) {
  // Import icons dynamically or use a map
  // For now, return a placeholder
  const { Calendar, CheckCircle2, CreditCard, Camera, Image, FileText } = require('lucide-react')
  
  const iconMap: Record<number, any> = {
    0: Calendar,
    1: CheckCircle2,
    2: CreditCard,
    3: Camera,
    4: Image,
    5: FileText,
    6: CheckCircle2
  }
  
  return iconMap[step] || Calendar
}

