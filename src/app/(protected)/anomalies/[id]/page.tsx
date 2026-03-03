import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAnomalyById, getAnalysisByAlertId } from '@/lib/actions/notion'
import { Container } from '@/components/layout/container'
import { AnomalyStatusBadge } from '@/components/anomaly-status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCost, formatDate, formatIncreaseRate } from '@/lib/utils'
import { ArrowRight, ChevronLeft } from 'lucide-react'

interface AnomalyDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: AnomalyDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const alert = await getAnomalyById(id)

  if (!alert) {
    return {
      title: '항목 없음 | AWS Cost Monitor',
    }
  }

  return {
    title: `${alert.serviceName} - 이상 분석 | AWS Cost Monitor`,
    description: `${alert.serviceName} 서비스의 비용 이상 감지 분석 상세 페이지`,
  }
}

export default async function AnomalyDetailPage({
  params,
}: AnomalyDetailPageProps) {
  const { id } = await params
  const alert = await getAnomalyById(id)

  if (!alert) {
    notFound()
  }

  const analysis = await getAnalysisByAlertId(id)

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-4">
            <h1 className="text-3xl font-bold">{alert.serviceName}</h1>
            <AnomalyStatusBadge status={alert.status} />
          </div>
          <p className="text-muted-foreground">
            감지 일시: {formatDate(alert.detectedAt)}
          </p>
        </div>
        <Link href="/anomalies">
          <Button variant="outline" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            목록으로
          </Button>
        </Link>
      </div>

      {/* Region Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">지역 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-muted-foreground text-sm">발신 지역</p>
              <p className="text-lg font-semibold">{alert.fromRegion}</p>
            </div>
            <ArrowRight className="text-muted-foreground h-6 w-6" />
            <div>
              <p className="text-muted-foreground text-sm">수신 지역</p>
              <p className="text-lg font-semibold">{alert.toRegion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Comparison */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>비용 비교</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-muted-foreground text-sm">정상 비용</p>
              <p className="text-2xl font-bold">
                ${formatCost(alert.normalCost)}
              </p>
            </div>
            <ArrowRight className="text-muted-foreground h-6 w-6" />
            <div>
              <p className="text-muted-foreground text-sm">급증 비용</p>
              <p className="text-2xl font-bold text-red-600">
                ${formatCost(alert.anomalyCost)}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between">
              <p className="text-sm font-medium">증가율</p>
              <p className="text-lg font-bold text-red-600">
                {formatIncreaseRate(alert.increaseRate)}
              </p>
            </div>
            <Progress value={Math.min(100, alert.increaseRate / 10)} />
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      {analysis && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI 분석 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {analysis.rootCause}
              </p>
            </CardContent>
          </Card>

          {/* Affected Resources */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>영향받은 리소스</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.affectedResources.map((resource, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="bg-primary mt-1 h-1.5 w-1.5 rounded-full" />
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Suggested Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>제안 조치</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {analysis.suggestedActions.map(action => (
                  <li
                    key={action.id}
                    className="border-primary border-l-2 pl-4"
                  >
                    <h4 className="text-sm font-semibold">{action.title}</h4>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {action.description}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="text-muted-foreground">예상 효과: </span>
                      <span className="font-medium text-green-600">
                        {action.expectedEffect}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* Action Button */}
      <div className="flex gap-2">
        {alert.status === 'detected' && (
          <Button size="lg">관리자 승인 요청</Button>
        )}
        {alert.status !== 'detected' && (
          <Button size="lg" disabled>
            {alert.status === 'pending' ? '승인 대기 중' : '처리 완료'}
          </Button>
        )}
      </div>
    </Container>
  )
}
