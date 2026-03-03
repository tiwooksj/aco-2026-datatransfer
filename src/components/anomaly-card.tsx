'use client'

import type { AnomalyAlert } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnomalyStatusBadge } from '@/components/anomaly-status-badge'
import { formatDate, formatIncreaseRate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AnomalyCardProps {
  alert: AnomalyAlert
  onClick?: () => void
}

export function AnomalyCard({ alert, onClick }: AnomalyCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        onClick && 'hover:border-primary cursor-pointer hover:shadow-lg'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{alert.serviceName}</CardTitle>
            <CardDescription>
              {alert.fromRegion} → {alert.toRegion}
            </CardDescription>
          </div>
          <AnomalyStatusBadge status={alert.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium">증가율</p>
          <p className="text-3xl font-bold text-red-600">
            {formatIncreaseRate(alert.increaseRate)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm font-medium">감지 일시</p>
          <p className="text-sm">{formatDate(alert.detectedAt)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
