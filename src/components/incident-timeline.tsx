import { Check, Circle } from 'lucide-react'

export interface TimelineStep {
  label: string
  timestamp: string
  completed: boolean
  description?: string
}

interface IncidentTimelineProps {
  steps: TimelineStep[]
}

export function IncidentTimeline({ steps }: IncidentTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline Icon */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              {step.completed ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-12 w-0.5 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 pt-1">
            <h4 className="font-semibold">{step.label}</h4>
            {step.timestamp && (
              <p className="text-muted-foreground text-sm">
                {new Date(step.timestamp).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </p>
            )}
            {step.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
