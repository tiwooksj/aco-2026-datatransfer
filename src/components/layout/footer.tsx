import { Container } from './container'

export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-6">
          <p className="text-muted-foreground text-center text-sm">
            AWS Cost Monitor &mdash; AWS 데이터 전송비용 이상 감지 및 자동조치
            시스템
          </p>
        </div>
      </Container>
    </footer>
  )
}
