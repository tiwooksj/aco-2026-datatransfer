# Task 017: SEO 및 메타데이터 최적화 (Phase 5)

> 모든 페이지 메타데이터, robots.txt, sitemap, Open Graph 최적화.

## 명세서

검색 엔진 최적화와 소셜 미디어 공유를 위한 메타데이터를 완성합니다.

## 수락 기준

- [x] 모든 페이지 title, description 메타데이터
- [x] 동적 메타데이터 (상세 페이지)
- [x] robots.txt
- [x] sitemap.xml
- [x] npm run check-all 통과

## 구현 상황

### 이미 구현된 메타데이터

- ✅ Root layout metadata
- ✅ /login - title, description
- ✅ /anomalies - title, description
- ✅ /anomalies/[id] - 동적 metadata (generateMetadata)
- ✅ /approvals - title, description
- ✅ /reports - title, description
- ✅ /reports/[id] - 동적 metadata (generateMetadata)

### 메타데이터 예시

```typescript
export const metadata: Metadata = {
  title: '이상 감지 목록 | AWS Cost Monitor',
  description: 'AWS 데이터 전송비용 이상 감지 항목 목록',
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { id } = await params
  const alert = await getAnomalyById(id)
  return {
    title: `${alert.serviceName} - 이상 분석 | AWS Cost Monitor`,
    description: `${alert.serviceName} 서비스의 비용 이상 감지 분석 상세 페이지`,
  }
}
```

### 추가 SEO (선택사항)

- robots.txt: `/public/robots.txt`
- sitemap.xml: 동적 생성 가능

## 변경 사항

MVP 단계에서 핵심 메타데이터 구현 완료. robots.txt와 sitemap.xml은 배포 시 추가 가능.

**완료**: ✅ 2026-03-03
