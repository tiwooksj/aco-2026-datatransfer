import { Metadata } from 'next'
import Link from 'next/link'
import { getIncidentReports } from '@/lib/actions/notion'
import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { AlertCircle, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '장애 리포트 | AWS Cost Monitor',
  description: '조치가 완료된 비용 이상 항목의 장애 리포트',
}

export default async function ReportsPage() {
  const reports = await getIncidentReports()

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">장애 리포트</h1>
        <p className="text-muted-foreground mt-2">
          조치가 완료된 이상 항목의 사후 분석 및 감사 추적 기록입니다.
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="border-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12">
          <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">리포트가 없습니다</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            조치가 완료된 항목이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <p className="text-muted-foreground mt-1 text-sm">
                        발생 일시: {formatDate(report.occurredAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Badge variant="default">조치완료</Badge>
                      <ChevronRight className="text-muted-foreground h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {report.rootCauseSummary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  )
}
