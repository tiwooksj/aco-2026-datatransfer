import type { AnomalyStatus, IncidentReport } from '@/types'
import { FAKE_ANOMALY_ALERTS, FAKE_INCIDENT_REPORTS } from '@/lib/fake/data'

/**
 * 상태 전이 규칙:
 * - detected → pending (AI 분석 시작)
 * - pending → resolved (승인)
 * - pending → rejected (거부)
 * 역순 전이는 불가능
 */

export function canTransition(
  currentStatus: AnomalyStatus,
  newStatus: AnomalyStatus
): boolean {
  const validTransitions: Record<AnomalyStatus, AnomalyStatus[]> = {
    detected: ['pending'],
    analyzing: ['pending'],
    pending: ['resolved', 'rejected'],
    resolved: [],
    rejected: [],
  }

  return validTransitions[currentStatus]?.includes(newStatus) ?? false
}

/**
 * 이상 감지 항목의 상태 변경
 * 상태 전이 규칙을 검증하고 반영
 */
export function updateAnomalyStatus(
  alertId: string,
  newStatus: AnomalyStatus
): boolean {
  const alert = FAKE_ANOMALY_ALERTS.find(a => a.id === alertId)

  if (!alert) {
    console.warn(`Alert ${alertId} not found`)
    return false
  }

  if (!canTransition(alert.status, newStatus)) {
    console.warn(`Cannot transition from ${alert.status} to ${newStatus}`)
    return false
  }

  // 상태 변경
  alert.status = newStatus

  return true
}

/**
 * 장애 리포트 생성
 * alertId에 해당하는 이상 감지 항목과 분석 정보로 리포트 생성
 */
export function generateIncidentReport(alertId: string): IncidentReport | null {
  const alert = FAKE_ANOMALY_ALERTS.find(a => a.id === alertId)

  if (!alert) {
    console.warn(`Alert ${alertId} not found`)
    return null
  }

  const now = new Date().toISOString()

  // 새 리포트 생성
  const report: IncidentReport = {
    id: `report-${alertId}`,
    alertId,
    title: `${alert.serviceName} 비용 급증 - ${alert.fromRegion} → ${alert.toRegion}`,
    occurredAt: alert.detectedAt,
    resolvedAt: now,
    rootCauseSummary: `${alert.serviceName} 리소스의 비정상적인 사용으로 인한 비용 ${alert.increaseRate}% 증가`,
    actionsTaken: [
      '이상 감지 알림 발송',
      'AI 분석 결과 검토',
      '관리자 승인 획득',
      '자동 조치 실행',
    ],
    currentStatus: '비용 정상화 완료, 지속적인 모니터링 진행 중',
  }

  // FAKE 데이터에 추가
  FAKE_INCIDENT_REPORTS.push(report)

  return report
}
