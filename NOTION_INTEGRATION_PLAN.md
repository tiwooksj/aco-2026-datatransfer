# Notion 통합 계획 요약

**작성일**: 2026-03-02
**상태**: 3개 DB 스키마 확정 완료

---

## ✅ 완료된 작업

### 1. 데이터베이스 스키마 설계 최종 확정

**3개 데이터베이스 구조:**

```
┌─────────────────────────────────────────┐
│         AnomalyAlerts (메인)             │
│  - 탐지 원본 데이터                      │
│  - 승인 워크플로우 필드 포함             │
│  - 15개 속성                            │
└──────────┬──────────────────────────────┘
           │ Relation (1:1 양쪽)
           ├─→ AiAnalysis (6개 속성)
           │   └─ AI 분석 결과
           └─→ IncidentReports (7개 속성)
               └─ 장애 리포트
```

### 2. 문서화

생성된 파일:

- **`docs/NOTION_SCHEMA.md`** - 완전한 Notion 스키마 설명서
  - 각 DB별 속성 정의
  - Notion 설정 방법
  - TypeScript 타입 매핑
  - 데이터 흐름 예시

업데이트된 파일:

- **`tasks/002-type-definitions.md`** - 새 스키마 반영
- **`.claude/plans/rosy-brewing-swan.md`** - 최종 설계 확정
- **`memory/MEMORY.md`** - 설계 결정 기록

---

## 📋 다음 단계 (Task 체크리스트)

### Phase 1-3: 기존 구현 (Task 001-012)

- ✅ Task 001: 프로젝트 구조 및 라우팅 설정
- ✅ Task 002: 타입 정의 및 데이터 모델 설계 (스키마 반영됨)
- ⬜ Task 003-012: 일반 구현 진행 (기존 계획대로)

### Phase 4: Notion API 연동 (미래 작업)

필요한 파일:

```
src/lib/notion/
├── client.ts          # Notion 클라이언트 초기화
├── queries.ts         # 각 DB 쿼리 함수
│   ├── getAnomalyAlerts()
│   ├── getAiAnalysis()
│   └── getIncidentReports()
└── transformers.ts    # Notion API 응답 → TypeScript 타입 변환
```

필수 패키지:

```bash
npm install @notionhq/client
```

환경변수 설정:

```env
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=...              # AnomalyAlerts
NOTION_DB_AI_ANALYSIS=...
NOTION_DB_INCIDENT_REPORTS=...
```

---

## 🎯 핵심 설계 결정 이유

### Q1: 왜 AnomalyAlerts에 승인 필드를 포함?

**A**: 승인 워크플로우는 AnomalyAlert의 상태 변화 자체입니다.

- `status='pending'` → `requested_at` 자동 채워짐
- JIRA/GitHub Issues처럼 하나의 이슈 엔티티로 관리
- null 필드가 처음에 비어있는 것은 정상적인 생명주기

### Q2: 왜 AiAnalysis를 별도 DB로?

**A**: AI 분석은 독립적인 엔티티입니다.

- 생성 주체 다름: AWS → AnomalyAlert, AI → AiAnalysis
- AnomalyAlert 생성 시 AI 필드 대부분 null (데이터 완전성 문제)
- 나중에 AI 분석 결과만 조회하는 페이지가 있을 수 있음

### Q3: 왜 SuggestedActions DB를 제거?

**A**: Demo MVP에서는 불필요합니다.

- READ ONLY 데이터 (수정/삭제 없음)
- AiAnalysis의 `suggested_actions` Rich Text로 충분
- 복잡도 감소

---

## 📞 Notion 환경 준비

### 1. Notion Workspace 생성

1. https://notion.so 접속
2. 새 Workspace 생성
3. Integration 생성 → API Token 복사

### 2. 3개 DB 생성

- `AnomalyAlerts` DB 생성
- `AiAnalysis` DB 생성
- `IncidentReports` DB 생성

### 3. 속성 추가 (docs/NOTION_SCHEMA.md 참고)

- 각 DB별로 정의된 속성 추가
- Select 옵션 설정
- Relation 연결 (양방향)

### 4. 환경변수 설정

```bash
# .env.local
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=<AnomalyAlerts DB ID>
NOTION_DB_AI_ANALYSIS=<AiAnalysis DB ID>
NOTION_DB_INCIDENT_REPORTS=<IncidentReports DB ID>
```

---

## 📚 참고자료

- **Notion API Docs**: https://developers.notion.com/reference
- **프로젝트 Notion 스키마**: `docs/NOTION_SCHEMA.md`
- **TypeScript 타입**: `src/types/index.ts`
- **설계 결정 기록**: `memory/MEMORY.md`

---

## 🚀 Notion 연동 구현 예상 코드 (Phase 4)

```typescript
// src/lib/notion/queries.ts

import { notion } from './client'
import { env } from '@/lib/env'
import type { AnomalyAlert, AiAnalysis, IncidentReport } from '@/types'

export async function getAnomalyAlerts(): Promise<AnomalyAlert[]> {
  const response = await notion.databases.query({
    database_id: env.NOTION_DATABASE_ID!,
  })

  return response.results.map((page: any) => ({
    id: page.id,
    serviceName: page.properties.service_name.select?.name ?? '',
    usageType: page.properties.usage_type.select?.name ?? '',
    detectedAt: page.properties.detected_at.date?.start ?? '',
    normalCost: page.properties.normal_cost.number ?? 0,
    anomalyCost: page.properties.anomaly_cost.number ?? 0,
    increaseRate: page.properties.increase_rate.number ?? 0,
    source: page.properties.source.rich_text[0]?.plain_text ?? '',
    sourceRegion: page.properties.source_region.select?.name ?? '',
    destination: page.properties.destination.rich_text[0]?.plain_text ?? '',
    destinationRegion: page.properties.destination_region.select?.name ?? '',
    status: page.properties.status.select?.name as AnomalyAlert['status'],
    notionPageId: page.id,
    requestedAt: page.properties.requested_at.date?.start,
    decidedAt: page.properties.decided_at.date?.start,
    decision: page.properties.decision.select?.name as any,
    rejectionReason: page.properties.rejection_reason.rich_text[0]?.plain_text,
  }))
}

export async function getAiAnalysis(
  alertId: string
): Promise<AiAnalysis | null> {
  const response = await notion.databases.query({
    database_id: env.NOTION_DB_AI_ANALYSIS!,
    filter: {
      property: 'anomaly_alert',
      relation: {
        contains: alertId,
      },
    },
  })

  if (response.results.length === 0) return null

  const page = response.results[0] as any
  return {
    id: page.id,
    alertId,
    rootCause: page.properties.root_cause.rich_text[0]?.plain_text ?? '',
    affectedResources: page.properties.affected_resources.rich_text
      .map((block: any) => block.plain_text)
      .join('\n')
      .split('\n'),
    suggestedActions:
      page.properties.suggested_actions.rich_text[0]?.plain_text ?? '',
    analyzedAt: page.properties.analyzed_at.date?.start ?? '',
  }
}
```

---

**상태**: ✅ 설계 완료, 🔄 Phase 1-3 구현 진행 중, ⏳ Phase 4 대기
