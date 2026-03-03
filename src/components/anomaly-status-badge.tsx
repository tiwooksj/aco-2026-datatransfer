'use client'

import { Badge } from '@/components/ui/badge'
import { ANOMALY_STATUS_LABEL, ANOMALY_STATUS_VARIANT } from '@/types'
import type { AnomalyStatus } from '@/types'

interface AnomalyStatusBadgeProps {
  status: AnomalyStatus
  size?: 'default' | 'sm'
}

export function AnomalyStatusBadge({
  status,
  size = 'default',
}: AnomalyStatusBadgeProps) {
  const label = ANOMALY_STATUS_LABEL[status]
  const variant = ANOMALY_STATUS_VARIANT[status]

  return (
    <Badge variant={variant} className={size === 'sm' ? 'text-xs' : ''}>
      {label}
    </Badge>
  )
}
