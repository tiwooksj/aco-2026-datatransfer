'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { AnomalyAlert, AiAnalysis } from '@/types'
import { approveApproval, rejectApproval } from '@/lib/actions/approvals'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnomalyStatusBadge } from '@/components/anomaly-status-badge'
import { RejectionReasonModal } from '@/components/rejection-reason-modal'
import { formatCost, formatDate, formatIncreaseRate } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface ApprovalsListProps {
  pendingItems: Array<{
    approval: { id: string; alertId: string; requestedAt: string }
    alert: AnomalyAlert
    analysis: AiAnalysis | null
  }>
  completedItems: Array<{
    approval: {
      id: string
      alertId: string
      requestedAt: string
      decidedAt?: string
      decision?: 'approved' | 'rejected'
      rejectionReason?: string
    }
    alert: AnomalyAlert
  }>
}

export function ApprovalsList({
  pendingItems,
  completedItems,
}: ApprovalsListProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleApprove = (approvalId: string) => {
    startTransition(async () => {
      try {
        const result = await approveApproval(approvalId)

        if (result.success && result.reportId) {
          toast.success('승인이 완료되었습니다. 리포트 페이지로 이동합니다.')
          router.push(`/reports/${result.reportId}`)
        } else {
          toast.error(result.error || '승인에 실패했습니다')
        }
      } catch (error) {
        console.error('Approve error:', error)
        toast.error('승인 중 오류가 발생했습니다')
      }
    })
  }

  const handleRejectClick = (approvalId: string) => {
    setRejectingId(approvalId)
    setIsModalOpen(true)
  }

  const handleRejectSubmit = async (reason: string) => {
    if (!rejectingId) return

    startTransition(async () => {
      try {
        const result = await rejectApproval(rejectingId, reason)

        if (result.success) {
          toast.success('거부가 완료되었습니다.')
          setIsModalOpen(false)
          setRejectingId(null)
          router.refresh()
        } else {
          toast.error(result.error || '거부에 실패했습니다')
        }
      } catch (error) {
        console.error('Reject error:', error)
        toast.error('거부 중 오류가 발생했습니다')
      }
    })
  }

  if (pendingItems.length === 0 && completedItems.length === 0) {
    return (
      <div className="border-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12">
        <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">승인 대기 항목이 없습니다</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          현재 승인 대기 중인 항목이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Pending Section */}
      {pendingItems.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            승인 대기 중인 항목 ({pendingItems.length})
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {pendingItems.map(({ approval, alert, analysis }) => (
              <AccordionItem
                key={approval.id}
                value={approval.id}
                className="rounded-lg border px-4"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="flex flex-1 items-center gap-4 text-left">
                    <div className="flex-1">
                      <h3 className="font-semibold">{alert.serviceName}</h3>
                      <p className="text-muted-foreground text-sm">
                        요청 일시: {formatDate(approval.requestedAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      승인 대기
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-4 pt-4">
                  {/* Cost Info */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">비용 정보</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">정상 비용</p>
                        <p className="font-semibold">
                          ${formatCost(alert.normalCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">급증 비용</p>
                        <p className="font-semibold text-red-600">
                          ${formatCost(alert.anomalyCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">증가율</p>
                        <p className="font-semibold text-red-600">
                          {formatIncreaseRate(alert.increaseRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">감지 일시</p>
                        <p className="text-sm font-semibold">
                          {formatDate(alert.detectedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Info */}
                  {analysis && (
                    <>
                      <div className="space-y-2 border-t pt-4">
                        <p className="text-sm font-semibold">AI 분석 결과</p>
                        <p className="text-muted-foreground text-sm">
                          {analysis.rootCause.slice(0, 200)}...
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold">영향받은 리소스</p>
                        <ul className="space-y-1">
                          {analysis.affectedResources.map((resource, idx) => (
                            <li
                              key={idx}
                              className="text-muted-foreground text-sm"
                            >
                              • {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 border-t pt-4">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(approval.id)}
                      disabled={isPending}
                    >
                      {isPending ? '처리 중...' : '승인'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectClick(approval.id)}
                      disabled={isPending}
                    >
                      거부
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Completed Section */}
      {completedItems.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            처리 완료 항목 ({completedItems.length})
          </h2>
          <div className="space-y-2">
            {completedItems.map(({ approval, alert }) => (
              <Card key={approval.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {alert.serviceName}
                    </CardTitle>
                    <AnomalyStatusBadge status={alert.status} />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    처리 일시: {formatDate(approval.decidedAt || '')}
                  </p>
                </CardHeader>
                <CardContent>
                  {approval.decision === 'rejected' &&
                    approval.rejectionReason && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">거부 사유:</p>
                        <p className="mt-1 text-sm">
                          {approval.rejectionReason}
                        </p>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setRejectingId(null)
        }}
        onSubmit={handleRejectSubmit}
      />
    </>
  )
}
