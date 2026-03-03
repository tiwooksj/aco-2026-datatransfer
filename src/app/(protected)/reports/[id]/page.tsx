import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getIncidentReportById,
  getAnomalyById,
  getAnalysisByAlertId,
} from '@/lib/actions/notion'
import { FAKE_APPROVAL_REQUESTS } from '@/lib/fake/data'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IncidentTimeline } from '@/components/incident-timeline'
import { formatDate } from '@/lib/utils'
import { ChevronLeft, Check } from 'lucide-react'

interface ReportDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ReportDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const report = await getIncidentReportById(id)

  if (!report) {
    return {
      title: '리포트 없음 | AWS Cost Monitor',
    }
  }

  return {
    title: `${report.title} | AWS Cost Monitor`,
    description: report.rootCauseSummary,
  }
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { id } = await params
  const report = await getIncidentReportById(id)

  if (!report) {
    notFound()
  }

  // Get related alert and analysis for timeline
  const alert = await getAnomalyById(report.alertId)
  const analysis = alert ? await getAnalysisByAlertId(report.alertId) : null

  // Get approval info
  const approval = FAKE_APPROVAL_REQUESTS.find(
    a => a.id === `approval-${report.alertId.slice(-3)}`
  )

  // Build timeline steps
  const timelineSteps = [
    {
      label: '비용 이상 감지',
      timestamp: report.occurredAt,
      completed: true,
    },
    {
      label: 'AI 분석 완료',
      timestamp:
        analysis?.analyzedAt ||
        new Date(
          new Date(report.occurredAt).getTime() + 30 * 60000
        ).toISOString(),
      completed: true,
    },
    {
      label: '관리자 승인',
      timestamp: approval?.decidedAt || report.resolvedAt,
      completed: true,
    },
    {
      label: '자동 조치 실행',
      timestamp: report.resolvedAt,
      completed: true,
    },
  ]

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{report.title}</h1>
          <p className="text-muted-foreground mt-2">
            발생 일시: {formatDate(report.occurredAt)}
          </p>
        </div>
        <Link href="/reports">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            목록으로
          </Button>
        </Link>
      </div>

      {/* Root Cause */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>원인 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {report.rootCauseSummary}
          </p>
        </CardContent>
      </Card>

      {/* Actions Taken */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>조치 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.actionsTaken.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 pt-0.5 text-green-600" />
                <span className="text-sm">{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>현재 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {report.currentStatus}
          </p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>처리 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
          <IncidentTimeline steps={timelineSteps} />
        </CardContent>
      </Card>
    </Container>
  )
}
