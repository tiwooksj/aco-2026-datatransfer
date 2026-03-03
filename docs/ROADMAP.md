# AWS Cost Monitor 개발 로드맵

AWS 데이터 전송비용 이상 감지 및 자동조치 시스템 MVP의 단계별 개발 계획

## 개요

**AWS Cost Monitor**는 AWS 인프라를 운영하는 DevOps 엔지니어 및 시스템 관리자를 위한 비용 이상 감지 및 자동 대응 시스템으로 다음 기능을 제공합니다:

- **비용 이상 감지**: Notion AnomalyAlerts DB에서 실제 데이터를 조회하여 AWS 데이터 전송비용 급증 항목을 감지하고 목록으로 표시
- **AI 분석 및 조치 제안**: 비용 급증 원인을 AI가 분석하고 구체적인 조치를 제안. 분석 결과는 Notion AiAnalysis DB에 INSERT하여 영구 저장
- **관리자 승인 워크플로우**: 관리자가 AI 제안 조치를 검토, 승인/거부하는 의사결정 프로세스. 승인 상태는 Notion AnomalyAlerts DB에 직접 업데이트
- **자동 조치 및 리포트**: 승인된 조치를 자동 실행(Fake)하고 장애 리포트를 Notion IncidentReports DB에 INSERT하여 생성

### Notion 데이터베이스 구조

```
AnomalyAlerts DB  (탐지 원본 + 승인 워크플로우 상태)
    ├── → AiAnalysis DB [1:1]
    │       (AI가 생성한 분석 결과 및 제안 조치)
    └── → IncidentReports DB [1:1]
            (승인 후 자동 생성되는 장애 리포트)
```

환경 변수 (`.env.local`):

- `NOTION_API_KEY` - Notion Integration Token
- `NOTION_DATABASE_ID` - AnomalyAlerts DB ID
- `NOTION_DB_AI_ANALYSIS` - AiAnalysis DB ID
- `NOTION_DB_INCIDENT_REPORTS` - IncidentReports DB ID

상세 스키마는 `docs/NOTION_SCHEMA.md` 참조.

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조
   - 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 표시로 표기

---

## 개발 단계

### Phase 1: 프로젝트 초기 설정 (골격 구축) -- 완료

> 목적: 개발 환경과 기본 인프라 구성. 모든 개발의 기반이 되므로 가장 먼저 완료.
> 완료 기준: 전체 라우트 구조 생성, 타입 정의 완료, 레이아웃 골격 구현

- **Task 001: 프로젝트 구조 및 라우팅 설정** -- 완료
  - See: `/tasks/001-project-structure.md`
  - [x] Next.js App Router 기반 전체 라우트 구조 생성 (`/login`, `/anomalies`, `/anomalies/[id]`, `/approvals`, `/reports`)
  - [x] 보호된 라우트를 위한 `(protected)` 라우트 그룹 구성
  - [x] 모든 주요 페이지의 빈 껍데기 파일 생성 (metadata 포함)
  - [x] 공통 레이아웃 컴포넌트 골격 구현 (Header, Footer, Container)

- **Task 002: 타입 정의 및 데이터 모델 설계** -- 완료
  - See: `/tasks/002-type-definitions.md`
  - [x] TypeScript 인터페이스 정의 (`AnomalyAlert`, `AiAnalysis`, `ApprovalRequest`, `IncidentReport`) - Notion 스키마 기반
  - [x] 상태 Enum 타입 정의 (`AnomalyStatus`, `ApprovalDecision`)
  - [x] 상태 레이블 및 배지 색상 매핑 상수 정의 (`ANOMALY_STATUS_LABEL`, `ANOMALY_STATUS_VARIANT`)
  - [x] UI 개발용 임시 Fake 데이터 파일 생성 (`src/lib/fake/data.ts`) - Phase 3에서 Notion API로 교체

---

### Phase 2: 공통 모듈/컴포넌트 개발

> 목적: 모든 페이지에서 사용할 기본 컴포넌트 및 유틸리티 완성.
> 순서 이유: 이후 페이지 개발 시 재사용 가능하므로 개발 효율 극대화.
> 완료 기준: 모든 공통 컴포넌트가 shadcn/ui 기반으로 구현되고 데모 페이지에서 확인 가능

- **Task 003: 하드코딩 인증 및 라우트 보호** -- 완료
  - See: `/tasks/003-authentication.md`
  - [x] 환경 변수 설정 (`.env.local`): `ADMIN_EMAIL`, `ADMIN_PASSWORD`, Notion 환경변수 초기 설정
  - [x] 환경변수 Zod 스키마 업데이트 (`src/lib/env.ts`)
  - [x] `middleware.ts` 작성 (쿠키 기반 보호된 라우트 리디렉션 로직)
  - [x] 로그인/로그아웃 Server Actions 구현 (`src/lib/actions/auth.ts`)
  - [x] 로그인 성공 시 HTTP-only 쿠키 설정 후 `/anomalies` 리디렉션

- **Task 004: 헤더/네비게이션 컴포넌트 고도화** - 우선순위
  - 인증 상태에 따른 헤더 UI 분기 (로그인 버튼 vs 사용자 정보 + 로그아웃)
  - 승인 대기 건수 배지 표시 (관리자 승인 메뉴) - 이 시점에는 Fake 데이터 기반으로 표시
  - 모바일 반응형 네비게이션 검증 및 개선
  - 현재 활성 메뉴 하이라이트 로직 검증

- **Task 005: 도메인 공통 컴포넌트 구현**
  - 상태 배지 컴포넌트 (`AnomalyStatusBadge`) - 감지됨(빨강)/승인대기(주황)/조치완료(초록)/거부됨(회색) 색상 매핑
  - 이상 감지 카드 컴포넌트 (`AnomalyCard`) - 서비스명, 급증 비율, 감지 일시, 상태 배지 포함
  - 거부 사유 입력 모달 컴포넌트 (`RejectionReasonModal`) - Dialog + Form + Zod 검증
  - 비용 표시 유틸리티 함수 (숫자 포맷팅, 증가율 표시)
  - 날짜/시간 포맷팅 유틸리티 함수

- **Task 006: Notion API 클라이언트 및 상태 관리 로직**
  - Notion API 클라이언트 래퍼 구현 (`src/lib/notion/client.ts`) - `@notionhq/client` 패키지 활용
  - AnomalyAlerts DB 조회/업데이트 함수 (`src/lib/notion/anomaly-alerts.ts`)
    - `getAnomalyAlerts()`: Notion AnomalyAlerts DB 전체 조회 (Server Action)
    - `getAnomalyById(id: string)`: Notion 페이지 ID로 단건 조회 (Server Action)
    - `updateAnomalyStatus(pageId, status, approvalFields?)`: 상태 + 승인 필드 업데이트 (Server Action)
  - AiAnalysis DB 읽기/쓰기 함수 (`src/lib/notion/ai-analysis.ts`)
    - `getAnalysisByAlertId(alertId: string)`: alertId로 연결된 AI 분석 조회 (Server Action)
    - `createAiAnalysis(alertId, analysisData)`: AI 분석 결과 Notion AiAnalysis DB에 INSERT (Server Action)
  - IncidentReports DB 읽기/쓰기 함수 (`src/lib/notion/incident-reports.ts`)
    - `getIncidentReports()`: 전체 리포트 목록 조회 (Server Action)
    - `createIncidentReport(alertId, reportData)`: 승인 시 리포트를 Notion IncidentReports DB에 INSERT (Server Action)
  - Notion 응답 → TypeScript 타입 변환 유틸리티 (`src/lib/notion/mappers.ts`)
  - API 에러 처리 공통 유틸리티
  - Playwright MCP를 활용한 Notion API 연동 동작 확인 테스트

---

### Phase 3: 핵심 기능 개발 (사용자 여정 순)

> 목적: MVP의 메인 워크플로우 구현. Notion API를 통해 실제 데이터로 동작하는 전체 플로우 검증.
> 데이터 흐름: AnomalyAlerts DB 조회 → AI 분석 생성 후 AiAnalysis DB INSERT → 승인 시 AnomalyAlerts 업데이트 → IncidentReports DB INSERT
> 완료 기준: 로그인 → 이상 감지 → 분석 → 승인 → 리포트의 전체 흐름이 Notion 실제 데이터로 작동

- **Task 007: 로그인 페이지 구현 (F010)** - 우선순위
  - 이메일/비밀번호 입력 폼 구현 (React Hook Form + Zod 스키마 검증)
  - 하드코딩 인증 연동 (Server Action으로 환경변수 비교)
  - 로그인 실패 시 에러 메시지 표시 (잘못된 자격 증명)
  - 로딩 상태 UI (버튼 스피너, 입력 비활성화)
  - 로그인 성공 시 HTTP-only 쿠키 설정 후 이상 감지 목록 페이지로 리디렉션
  - Playwright MCP를 활용한 로그인 플로우 E2E 테스트

- **Task 008: 이상 감지 목록 페이지 구현 (F001, F011)**
  - `getAnomalyAlerts()` Server Action으로 Notion AnomalyAlerts DB에서 실제 데이터 조회
  - AnomalyCard 컴포넌트를 활용한 항목 표시 (서비스명, 급증 비율, 감지 일시)
  - 상태별 배지 색상 구분 (detected: 빨강, pending: 주황, resolved: 초록, rejected: 회색)
  - 카드 클릭 시 AI 분석 상세 페이지(`/anomalies/[id]`)로 이동
  - 빈 상태 메시지 (Notion DB에 이상 감지 항목이 없을 때)
  - Playwright MCP를 활용한 목록 페이지 렌더링 및 네비게이션 테스트

- **Task 009: AI 분석 상세 페이지 구현 (F002, F003, F011)**
  - `getAnomalyById(id)` Server Action으로 Notion AnomalyAlerts DB에서 단건 조회
  - `getAnalysisByAlertId(alertId)` Server Action으로 Notion AiAnalysis DB에서 연결된 분석 결과 조회
  - AiAnalysis가 없는 경우 (status=detected): AI 분석 생성 트리거 제공
    - "AI 분석 시작" 버튼 클릭 시 AI 분석 결과 생성 (현재는 미리 정의된 템플릿 기반으로 생성)
    - 생성된 분석 결과를 `createAiAnalysis()` Server Action으로 Notion AiAnalysis DB에 INSERT
    - AnomalyAlerts의 status를 `detected` → `analyzing` → `pending`으로 업데이트
  - AiAnalysis가 있는 경우 (status=pending 이상): 분석 결과 표시
    - 이상 항목 기본 정보 표시 (서비스명, 감지 일시, 비용 급증 수치)
    - AI 분석 결과 표시 (rootCause 텍스트, affectedResources 목록)
    - AI 제안 조치 목록 표시 (suggestedActions 텍스트)
  - "관리자 승인 요청" 버튼 클릭 시 `updateAnomalyStatus()` Server Action으로 Notion AnomalyAlerts의 status → pending, requested_at 업데이트
  - "목록으로 돌아가기" 네비게이션
  - Playwright MCP를 활용한 상세 페이지 데이터 표시 및 AI 분석 생성/조회, 승인 요청 플로우 테스트

- **Task 010: 관리자 승인 페이지 구현 (F004, F005, F011)**
  - `getAnomalyAlerts()` Server Action으로 Notion AnomalyAlerts DB에서 pending 상태 항목 필터링하여 표시
  - 각 항목 클릭 시 AI 분석 내용 및 제안 조치 상세 확인 패널 (확장형 또는 사이드 패널)
  - "승인" 버튼 클릭 시:
    - `updateAnomalyStatus()` Server Action으로 Notion AnomalyAlerts의 status → resolved, decision → approved, decided_at 업데이트
    - `createIncidentReport()` Server Action으로 Notion IncidentReports DB에 장애 리포트 INSERT
    - AnomalyAlerts의 incident_report Relation 연결
    - 장애 리포트 페이지로 자동 이동
  - "거부" 버튼 클릭 시 RejectionReasonModal 표시, 사유 입력 후:
    - `updateAnomalyStatus()` Server Action으로 Notion AnomalyAlerts의 status → rejected, decision → rejected, rejection_reason, decided_at 업데이트
  - 처리 완료 항목은 목록 하단에 상태 배지와 함께 표시
  - Playwright MCP를 활용한 승인/거부 플로우 E2E 테스트

- **Task 011: 장애 리포트 페이지 구현 (F006)**
  - `getIncidentReports()` Server Action으로 Notion IncidentReports DB에서 실제 리포트 목록 조회
  - 리포트 상세 내용 표시 (문제 발생 일시, 원인 요약, 조치 내역 목록, 조치 후 현재 상태)
  - 워크플로우 타임라인 표시 (감지 → 분석 → 승인 → 조치완료 단계별 시각화)
  - "목록으로 돌아가기" 버튼
  - 빈 상태 메시지 (Notion DB에 리포트가 없을 때)
  - Playwright MCP를 활용한 리포트 페이지 렌더링 테스트

- **Task 012: 핵심 기능 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E 테스트
    - 로그인 → 이상 감지 목록(Notion 조회) → AI 분석 생성(Notion INSERT) → 승인 요청 → 승인 처리(Notion 업데이트) → 장애 리포트 생성(Notion INSERT) → 리포트 확인
  - 거부 플로우 테스트 (승인 요청 → 거부 + 사유 입력 → Notion AnomalyAlerts rejection_reason 업데이트 확인)
  - 상태 전이 정합성 검증 (detected → analyzing → pending → resolved/rejected)
  - Notion API 에러 시 에러 처리 동작 확인 (API 키 미설정, DB 접근 오류 등)
  - 인증되지 않은 사용자 리디렉션 테스트

---

### Phase 4: 추가 기능 및 UX 개선

> 목적: UX 개선 및 안정성 강화. 핵심 기능이 안정화된 후 추가.
> 완료 기준: 모든 페이지가 다양한 상태(로딩, 에러, 빈 상태)를 올바르게 처리

- **Task 013: 페이지 로딩 상태 및 스켈레톤 UI 구현**
  - 이상 감지 목록 페이지 로딩 스켈레톤 (카드 스켈레톤 4-6개) - Notion API 응답 대기 중 표시
  - AI 분석 상세 페이지 로딩 스켈레톤
  - 관리자 승인 페이지 로딩 스켈레톤
  - 장애 리포트 페이지 로딩 스켈레톤
  - Next.js `loading.tsx` 파일 활용

- **Task 014: 에러 바운더리 및 에러 처리 고도화**
  - 글로벌 에러 바운더리 (`error.tsx`) 구현
  - 404 Not Found 페이지 (`not-found.tsx`) 커스터마이징
  - Notion API 호출 실패 시 재시도 UI (Retry 버튼)
  - 잘못된 이상 항목 ID 접근 시 안내 메시지
  - Notion API 응답 지연 또는 오류 시 사용자 친화적 에러 메시지

- **Task 015: 빈 상태 및 사용자 피드백 개선**
  - 각 목록 페이지 빈 상태(Empty State) 일러스트 및 메시지
  - 승인/거부 처리 완료 시 토스트 알림 (Sonner)
  - AI 분석 생성 완료 및 Notion 저장 성공/실패 피드백 메시지
  - 페이지 전환 시 로딩 인디케이터

---

### Phase 5: 최적화 및 배포

> 목적: 성능 최적화 및 운영 준비. 기능 완성 후 최종 점검.
> 완료 기준: 프로덕션 빌드 성공, Lighthouse 점수 90 이상, 배포 완료

- **Task 016: 성능 최적화**
  - 이미지 최적화 (Next.js Image 컴포넌트 적용)
  - 코드 스플리팅 점검 및 동적 임포트 적용
  - 번들 크기 분석 및 최적화
  - React 컴포넌트 메모이제이션 (memo, useMemo, useCallback 적용 점검)
  - 핵심 웹 바이탈(Core Web Vitals) 측정 및 개선

- **Task 017: SEO 및 메타데이터 최적화**
  - 모든 페이지 메타데이터 완성 (title, description, og:image)
  - robots.txt 및 sitemap 설정
  - Open Graph 이미지 생성

- **Task 018: 배포 및 CI/CD 설정**
  - 환경 변수 보안 검증 (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_DB_AI_ANALYSIS`, `NOTION_DB_INCIDENT_REPORTS`)
  - Vercel 배포 설정 및 환경 변수 등록
  - CI/CD 파이프라인 구축 (빌드, 린트, 타입 체크 자동화)
  - 프로덕션 빌드 최종 검증 (`npm run build` + `npm run check-all`)
