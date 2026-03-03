# Notion 데이터베이스 스키마 설계

**버전:** 1.0
**최종 확정:** 2026-03-02
**상태:** 최종 확정 (3개 DB)

---

## 목차

1. [데이터베이스 구조](#데이터베이스-구조)
2. [Database 1: AnomalyAlerts](#database-1-anomalyalerts)
3. [Database 2: AiAnalysis](#database-2-aianalysis)
4. [Database 3: IncidentReports](#database-3-incidentreports)
5. [Relation 설정](#relation-설정)
6. [환경변수 설정](#환경변수-설정)

---

## 데이터베이스 구조

```
AnomalyAlerts (탐지 원본 + 승인 워크플로우)
    ├── → AiAnalysis [1:1]
    │   (AI가 생성한 분석 결과)
    └── → IncidentReports [1:1]
        (승인 후 생성되는 장애 리포트)
```

### 설계 원칙

- **AnomalyAlerts**: 탐지된 이상 항목 + 승인 상태 머신 (원본 데이터 + 메타데이터)
- **AiAnalysis**: AI가 분석한 결과 (생성 주체/시점 분리)
- **IncidentReports**: 승인 후 생성되는 장애 리포트 (별도 목록)

---

## Database 1: AnomalyAlerts

**용도**: AWS 비용 이상 감지 항목 및 승인 워크플로우 관리

### 속성 정의

| 속성명               | Notion 타입 | TypeScript               | 설명                  | 예시                                             |
| -------------------- | ----------- | ------------------------ | --------------------- | ------------------------------------------------ |
| `Name`               | Title       | -                        | 페이지 제목 (자동)    | "EKS intra-az 비용 급증"                         |
| `service_name`       | Select      | string                   | AWS 서비스명          | EC2, CloudFront, S3, RDS, EKS                    |
| `usage_type`         | Select      | string                   | 사용 유형             | intra-az, getObject, cross-region 등             |
| `detected_at`        | Date        | string (ISO 8601)        | 감지 일시             | 2026-03-01 09:00                                 |
| `normal_cost`        | Number      | number                   | 정상 비용 (USD)       | 100.50                                           |
| `anomaly_cost`       | Number      | number                   | 이상 비용 (USD)       | 300.75                                           |
| `increase_rate`      | Number      | number                   | 증가율 (%)            | 719                                              |
| `source`             | Text        | string                   | 출발 리소스           | eks::<cluster>:az-A, s3::<bucket>                |
| `source_region`      | Select      | string                   | 출발 리전             | ap-northeast-2, us-east-1 등                     |
| `destination`        | Text        | string                   | 도착 리소스/지역      | eks::<cluster>:az-B, internet                    |
| `destination_region` | Select      | string                   | 도착 리전             | ap-northeast-2, eu-west-1 등                     |
| `status`             | Select      | AnomalyStatus            | 상태                  | detected, analyzing, pending, resolved, rejected |
| `requested_at`       | Date        | string \| null           | 승인 요청 일시        | 2026-03-01 09:30                                 |
| `decided_at`         | Date        | string \| null           | 승인/거부 결정 일시   | 2026-03-01 10:00                                 |
| `decision`           | Select      | ApprovalDecision \| null | 최종 결정             | approved, rejected                               |
| `rejection_reason`   | Text        | string \| null           | 거부 사유             | "추가 검토 필요"                                 |
| `ai_analysis`        | Relation    | -                        | 1:1 → AiAnalysis      | -                                                |
| `incident_report`    | Relation    | -                        | 1:1 → IncidentReports | -                                                |

### status 옵션 및 색상

| 상태      | 색상      | 설명                         |
| --------- | --------- | ---------------------------- |
| detected  | 🔴 빨강   | 이상 감지됨, AI 분석 대기 중 |
| analyzing | ⚫ 회색   | AI 분석 진행 중              |
| pending   | 🟠 주황   | AI 분석 완료, 승인 대기 중   |
| resolved  | 🟢 초록   | 승인됨, 장애 리포트 생성됨   |
| rejected  | ⚫ 어둡게 | 거부됨, 더 이상 처리 안 함   |

### decision 옵션 및 색상

| 결정     | 색상    | 설명             |
| -------- | ------- | ---------------- |
| approved | 🟢 초록 | 관리자 승인 완료 |
| rejected | 🔴 빨강 | 관리자 거부      |

---

## Database 2: AiAnalysis

**용도**: AI가 분석한 이상 원인 및 제안 조치 관리

### 속성 정의

| 속성명               | Notion 타입 | TypeScript        | 설명                          | 예시                                 |
| -------------------- | ----------- | ----------------- | ----------------------------- | ------------------------------------ |
| `Name`               | Title       | -                 | 분석 제목                     | "analysis-alert-001"                 |
| `anomaly_alert`      | Relation    | -                 | 1:1 → AnomalyAlerts (양방향)  | -                                    |
| `root_cause`         | Rich Text   | string            | AI 분석 원인 텍스트           | "EC2 인스턴스에서..."                |
| `affected_resources` | Text        | string[]          | 영향받은 리소스 (줄바꿈 구분) | "EC2 i-0a1b2c3d\nS3 s3://bucket"     |
| `suggested_actions`  | Text        | string            | 제안 조치 목록 (줄바꿈 구분)  | "1. 네트워크 차단\n2. 스크립트 중지" |
| `analyzed_at`        | Date        | string (ISO 8601) | AI 분석 완료 일시             | 2026-03-01 09:22                     |

### 설명

- `affected_resources`: 여러 리소스를 줄바꿈으로 구분하여 저장
- `suggested_actions`: 각 조치를 "1. 제목\n2. 제목\n3. 제목" 형식으로 저장 (또는 JSON)

---

## Database 3: IncidentReports

**용도**: 승인된 이상 항목의 장애 리포트 관리

### 속성 정의

| 속성명               | Notion 타입 | TypeScript        | 설명                         | 예시                                        |
| -------------------- | ----------- | ----------------- | ---------------------------- | ------------------------------------------- |
| `Name`               | Title       | -                 | 리포트 제목                  | "S3 크로스 리전 복제 오류로 인한 비용 급증" |
| `anomaly_alert`      | Relation    | -                 | 1:1 → AnomalyAlerts (양방향) | -                                           |
| `occurred_at`        | Date        | string (ISO 8601) | 장애 발생 일시               | 2026-02-28 22:30                            |
| `resolved_at`        | Date        | string (ISO 8601) | 해결 완료 일시               | 2026-02-28 23:30                            |
| `root_cause_summary` | Text        | string            | 원인 요약 (간략)             | "운영자 실수로 CRR 활성화"                  |
| `actions_taken`      | Text        | string[]          | 실행 조치 내역 (줄바꿈 구분) | "CRR 규칙 비활성화\n복제 데이터 삭제"       |
| `current_status`     | Text        | string            | 현재 상태 및 재발 방지 계획  | "정상 운영 중, CRR 승인 프로세스 추가 예정" |

---

## Relation 설정

### AnomalyAlerts → AiAnalysis

**Notion 설정:**

1. AnomalyAlerts DB의 `ai_analysis` 속성
   - 타입: Relation
   - 연결 DB: AiAnalysis
   - 단일 항목 허용
2. AiAnalysis DB의 `anomaly_alert` 속성과 양방향 자동 연결

**API 쿼리 예시:**

```ts
// AnomalyAlert 조회 시 ai_analysis 함께 조회
const alert = await notion.pages.retrieve(pageId)
const aiAnalysis = alert.relations.ai_analysis
```

### AnomalyAlerts → IncidentReports

**Notion 설정:**

1. AnomalyAlerts DB의 `incident_report` 속성
   - 타입: Relation
   - 연결 DB: IncidentReports
   - 단일 항목 허용
2. IncidentReports DB의 `anomaly_alert` 속성과 양방향 자동 연결

**흐름:**

- status=pending일 때: incident_report 비어있음 (null)
- status=resolved일 때: incident_report 채워짐 (1:1)

---

## 환경변수 설정

`.env.local` 파일에 다음을 추가:

```env
# Notion API
NOTION_API_KEY=ntn_...                              # Notion Integration Token
NOTION_DATABASE_ID=31786d058ba880789f1bfa8...      # AnomalyAlerts DB ID
NOTION_DB_AI_ANALYSIS=...                           # AiAnalysis DB ID
NOTION_DB_INCIDENT_REPORTS=...                      # IncidentReports DB ID
```

**각 DB ID 조회 방법:**

1. Notion 웹 → 해당 DB 열기
2. URL에서 `/` 뒤 32자 문자열이 DB ID
   - `https://notion.so/workspace/{DB_ID}?v=...`

---

## TypeScript 타입 정의

`src/types/index.ts`:

```typescript
// 상태 타입
export type AnomalyStatus =
  | 'detected'
  | 'analyzing'
  | 'pending'
  | 'resolved'
  | 'rejected'
export type ApprovalDecision = 'approved' | 'rejected'

// AnomalyAlert 인터페이스
export interface AnomalyAlert {
  id: string
  serviceName: string
  usageType: string
  detectedAt: string
  normalCost: number
  anomalyCost: number
  increaseRate: number
  source: string
  sourceRegion: string
  destination: string
  destinationRegion: string
  status: AnomalyStatus
  notionPageId?: string
  // 승인 워크플로우
  requestedAt?: string
  decidedAt?: string
  decision?: ApprovalDecision
  rejectionReason?: string
}

// AiAnalysis 인터페이스
export interface AiAnalysis {
  id: string
  alertId: string
  rootCause: string
  affectedResources: string[]
  suggestedActions: string
  analyzedAt: string
}

// IncidentReport 인터페이스
export interface IncidentReport {
  id: string
  alertId: string
  title: string
  occurredAt: string
  resolvedAt: string
  rootCauseSummary: string
  actionsTaken: string[]
  currentStatus: string
}
```

---

## 데이터 흐름 예시

### 시나리오: EKS intra-az 이상 감지 → 승인 → 리포트 생성

**1단계: 이상 감지 (탐지)**

```
Notion AnomalyAlerts DB에 페이지 생성
- service_name: "EKS"
- usage_type: "intra-az"
- detected_at: "2026-03-01 09:00"
- status: "detected"
- 나머지 필드: 해당 값
```

**2단계: AI 분석 (분석)**

```
Notion AiAnalysis DB에 페이지 생성
- root_cause: "원인 분석 텍스트..."
- affected_resources: "EKS cluster-1\nVPC vpc-123"
- suggested_actions: "1. 네트워크 설정 검토\n2. 트래픽 차단"
- analyzed_at: "2026-03-01 09:15"

AnomalyAlerts 페이지의 ai_analysis 속성: AiAnalysis 페이지 연결
AnomalyAlerts 상태: "detected" → "pending"
AnomalyAlerts requested_at: "2026-03-01 09:30"
```

**3단계: 관리자 승인**

```
AnomalyAlerts 페이지 업데이트
- status: "pending" → "resolved"
- decided_at: "2026-03-01 10:00"
- decision: "approved"
```

**4단계: 리포트 생성**

```
Notion IncidentReports DB에 페이지 생성
- title: "EKS intra-az 트래픽 급증 – 네트워크 재설정"
- occurred_at: "2026-03-01 09:00"
- resolved_at: "2026-03-01 10:30"
- root_cause_summary: "VPC 설정 오류로 인한 AZ 간 트래픽 증가"
- actions_taken: "VPC 라우팅 정책 수정\n트래픽 재분산 설정"
- current_status: "정상 운영 중"

AnomalyAlerts 페이지의 incident_report 속성: IncidentReports 페이지 연결
```

---

## 부록: Notion DB 생성 순서

1. **SuggestedActions 불필요**: AiAnalysis의 `suggested_actions` Rich Text로 병합
2. **ApprovalRequests 불필요**: AnomalyAlerts의 필드로 병합
3. **1순위: AnomalyAlerts DB 생성**
4. **2순위: AiAnalysis DB 생성** (AnomalyAlerts와 Relation)
5. **3순위: IncidentReports DB 생성** (AnomalyAlerts와 Relation)

---

## 참고자료

- Notion API: https://developers.notion.com
- TypeScript 타입: `src/types/index.ts`
- Fake 데이터: `src/lib/fake/data.ts`
- Notion 쿼리 클라이언트: `src/lib/notion/` (Phase 4에서 구현)
