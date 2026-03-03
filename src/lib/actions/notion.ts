'use server'

import type {
  AnomalyAlert,
  AiAnalysis,
  ApprovalRequest,
  IncidentReport,
} from '@/types'
import {
  FAKE_ANOMALY_ALERTS,
  FAKE_AI_ANALYSES,
  FAKE_APPROVAL_REQUESTS,
  FAKE_INCIDENT_REPORTS,
} from '@/lib/fake/data'

/**
 * 모든 이상 감지 항목 조회
 */
export async function getAnomalyAlerts(): Promise<AnomalyAlert[]> {
  // MVP: Fake 데이터 반환 (Phase 4에서 Notion API 연동)
  return FAKE_ANOMALY_ALERTS
}

/**
 * 특정 이상 감지 항목 조회
 */
export async function getAnomalyById(id: string): Promise<AnomalyAlert | null> {
  const alert = FAKE_ANOMALY_ALERTS.find(a => a.id === id)
  return alert || null
}

/**
 * 특정 이상에 대한 AI 분석 결과 조회
 */
export async function getAnalysisByAlertId(
  alertId: string
): Promise<AiAnalysis | null> {
  const analysis = FAKE_AI_ANALYSES.find(a => a.alertId === alertId)
  return analysis || null
}

/**
 * 승인 대기 중인 항목 조회
 */
export async function getApprovalsPending(): Promise<ApprovalRequest[]> {
  return FAKE_APPROVAL_REQUESTS.filter(req => !req.decision)
}

/**
 * 모든 장애 리포트 조회
 */
export async function getIncidentReports(): Promise<IncidentReport[]> {
  return FAKE_INCIDENT_REPORTS
}

/**
 * 특정 승인 요청 조회
 */
export async function getApprovalById(
  id: string
): Promise<ApprovalRequest | null> {
  const approval = FAKE_APPROVAL_REQUESTS.find(a => a.id === id)
  return approval || null
}

/**
 * 특정 장애 리포트 조회
 */
export async function getIncidentReportById(
  id: string
): Promise<IncidentReport | null> {
  const report = FAKE_INCIDENT_REPORTS.find(r => r.id === id)
  return report || null
}
