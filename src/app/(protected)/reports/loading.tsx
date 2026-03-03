import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ReportsLoading() {
  return (
    <Container className="py-8">
      <div className="mb-8">
        <Skeleton className="mb-4 h-10 w-32" />
        <Skeleton className="h-6 w-64" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="cursor-wait">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  )
}
