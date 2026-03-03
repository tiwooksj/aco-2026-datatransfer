'use server'

import {
  updateAnomalyStatus,
  generateIncidentReport,
} from '@/lib/state-management'
import { FAKE_APPROVAL_REQUESTS } from '@/lib/fake/data'

export async function approveApproval(
  approvalId: string
): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    const approval = FAKE_APPROVAL_REQUESTS.find(a => a.id === approvalId)

    if (!approval) {
      return { success: false, error: '승인 요청을 찾을 수 없습니다' }
    }

    // 상태를 pending → resolved로 변경
    const updated = updateAnomalyStatus(approval.alertId, 'resolved')

    if (!updated) {
      return {
        success: false,
        error: '상태 변경에 실패했습니다',
      }
    }

    // 장애 리포트 생성
    const report = generateIncidentReport(approval.alertId)

    if (!report) {
      return {
        success: false,
        error: '리포트 생성에 실패했습니다',
      }
    }

    // 승인 요청 업데이트
    approval.decidedAt = new Date().toISOString()
    approval.decision = 'approved'

    return {
      success: true,
      reportId: report.id,
    }
  } catch (error) {
    console.error('approveApproval error:', error)
    return {
      success: false,
      error: '승인 중 오류가 발생했습니다',
    }
  }
}

export async function rejectApproval(
  approvalId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const approval = FAKE_APPROVAL_REQUESTS.find(a => a.id === approvalId)

    if (!approval) {
      return { success: false, error: '승인 요청을 찾을 수 없습니다' }
    }

    // 상태를 pending → rejected로 변경
    const updated = updateAnomalyStatus(approval.alertId, 'rejected')

    if (!updated) {
      return {
        success: false,
        error: '상태 변경에 실패했습니다',
      }
    }

    // 승인 요청 업데이트
    approval.decidedAt = new Date().toISOString()
    approval.decision = 'rejected'
    approval.rejectionReason = reason

    return {
      success: true,
    }
  } catch (error) {
    console.error('rejectApproval error:', error)
    return {
      success: false,
      error: '거부 중 오류가 발생했습니다',
    }
  }
}
