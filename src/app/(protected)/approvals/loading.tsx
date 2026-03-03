import { Container } from '@/components/layout/container'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ApprovalsLoading() {
  return (
    <Container className="py-8">
      <div className="mb-8">
        <Skeleton className="mb-4 h-10 w-32" />
        <Skeleton className="h-6 w-64" />
      </div>

      <div className="mb-8">
        <Skeleton className="mb-4 h-8 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-6 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-4 h-8 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 1 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-40" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  )
}
