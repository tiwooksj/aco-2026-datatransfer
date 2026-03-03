import { Metadata } from 'next'
import {
  getApprovalsPending,
  getAnomalyById,
  getAnalysisByAlertId,
} from '@/lib/actions/notion'
import { FAKE_APPROVAL_REQUESTS } from '@/lib/fake/data'
import { Container } from '@/components/layout/container'
import { ApprovalsList } from '@/components/approvals-list'

export const metadata: Metadata = {
  title: '관리자 승인 | AWS Cost Monitor',
  description: 'AI 제안 조치 승인 및 거부 처리',
}

export default async function ApprovalsPage() {
  // Fetch pending approvals
  const pendingApprovals = await getApprovalsPending()

  // Build pending items with alert and analysis data
  const pendingItems = await Promise.all(
    pendingApprovals.map(async approval => {
      const alert = await getAnomalyById(approval.alertId)
      const analysis = alert
        ? await getAnalysisByAlertId(approval.alertId)
        : null

      return {
        approval,
        alert: alert!,
        analysis,
      }
    })
  )

  // Get completed items (those with decisions)
  const completedItems = await Promise.all(
    FAKE_APPROVAL_REQUESTS.filter(a => a.decision).map(async approval => {
      const alert = await getAnomalyById(approval.alertId)

      return {
        approval,
        alert: alert!,
      }
    })
  )

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">관리자 승인</h1>
        <p className="text-muted-foreground mt-2">
          AI 제안 조치를 검토하고 승인 또는 거부합니다.
        </p>
      </div>

      <ApprovalsList
        pendingItems={pendingItems}
        completedItems={completedItems}
      />
    </Container>
  )
}
