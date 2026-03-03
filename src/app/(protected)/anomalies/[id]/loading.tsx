import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnomalyDetailLoading() {
  return (
    <Container className="py-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="mb-4 h-10 w-40" />
          <Skeleton className="h-6 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Region Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-6 w-6" />
            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-6 w-6" />
            <div>
              <Skeleton className="mb-2 h-4 w-16" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Action Button */}
      <Skeleton className="h-10 w-40" />
    </Container>
  )
}
