import { Metadata } from 'next'
import Link from 'next/link'
import { getAnomalyAlerts } from '@/lib/actions/notion'
import { Container } from '@/components/layout/container'
import { AnomalyCard } from '@/components/anomaly-card'
import { AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '이상 감지 목록 | AWS Cost Monitor',
  description: 'AWS 데이터 전송비용 이상 감지 항목 목록',
}

export default async function AnomaliesPage() {
  const alerts = await getAnomalyAlerts()

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">이상 감지 목록</h1>
        <p className="text-muted-foreground mt-2">
          AWS 데이터 전송비용 이상 감지 항목을 확인합니다.
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="border-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12">
          <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">이상 감지 항목이 없습니다</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            현재 감지된 이상 항목이 없습니다. 잠시 후 다시 확인해주세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {alerts.map(alert => (
            <Link key={alert.id} href={`/anomalies/${alert.id}`}>
              <AnomalyCard alert={alert} />
            </Link>
          ))}
        </div>
      )}
    </Container>
  )
}
