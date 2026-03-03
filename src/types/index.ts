// 이상 감지 항목 상태
export type AnomalyStatus =
  | 'detected'
  | 'analyzing'
  | 'pending'
  | 'resolved'
  | 'rejected'

// 관리자 승인 결정
export type ApprovalDecision = 'approved' | 'rejected'

// 이상 감지 항목 (AnomalyAlert)
export interface AnomalyAlert {
  id: string
  serviceName: string
  detectedAt: string
  normalCost: number
  anomalyCost: number
  increaseRate: number
  fromRegion: string
  toRegion: string
  status: AnomalyStatus
  notionPageId?: string
}

// AI 제안 조치 항목
export interface SuggestedAction {
  id: string
  title: string
  description: string
  expectedEffect: string
}

// AI 분석 결과 (AiAnalysis)
export interface AiAnalysis {
  id: string
  alertId: string
  rootCause: string
  affectedResources: string[]
  suggestedActions: SuggestedAction[]
  analyzedAt: string
}

// 관리자 승인 요청 (ApprovalRequest)
export interface ApprovalRequest {
  id: string
  alertId: string
  requestedAt: string
  decidedAt?: string
  decision?: ApprovalDecision
  rejectionReason?: string
}

// 장애 리포트 (IncidentReport)
export interface IncidentReport {
  id: string
  alertId: string
  title: string
  occurredAt: string
  resolvedAt: string
  rootCauseSummary: string
  actionsTaken: string[]
  currentStatus: string
}

// 상태 레이블 및 색상 매핑
export const ANOMALY_STATUS_LABEL: Record<AnomalyStatus, string> = {
  detected: '감지됨',
  analyzing: '분석중',
  pending: '승인대기',
  resolved: '조치완료',
  rejected: '거부됨',
}

export const ANOMALY_STATUS_VARIANT: Record<
  AnomalyStatus,
  'destructive' | 'secondary' | 'default' | 'outline'
> = {
  detected: 'destructive',
  analyzing: 'secondary',
  pending: 'secondary',
  resolved: 'default',
  rejected: 'outline',
}
