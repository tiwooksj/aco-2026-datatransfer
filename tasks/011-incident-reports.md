# Task 011: 장애 리포트 페이지 (F006)

> 조치가 완료된 이상 항목에 대한 장애 리포트 목록 및 상세 내용 표시. 발생 일시, 원인, 조치 내역, 타임라인 시각화.

## 명세서

조치가 완료된 이상 항목에 대한 사후 분석 및 감사 추적용 장애 리포트를 표시합니다. 리포트 목록 페이지에서 각 항목을 클릭하면 상세 페이지로 이동하며, 발생 일시, 원인 요약, 조치 내역, 현재 상태를 정리되고 타임라인으로 전체 워크플로우를 시각화합니다.

## 관련 파일

- `src/app/(protected)/reports/page.tsx` - 장애 리포트 목록 (신규)
- `src/app/(protected)/reports/[id]/page.tsx` - 장애 리포트 상세 (신규)
- `src/components/incident-timeline.tsx` - 타임라인 컴포넌트 (신규)

## 수락 기준

- [ ] 리포트 목록 페이지: 항목 리스트 렌더링
- [ ] 각 항목: 제목, 발생 일시, 상태 표시
- [ ] 항목 클릭 → `/reports/[id]` 상세 페이지 이동
- [ ] 상세 페이지: 원인 요약, 조치 내역 (리스트), 현재 상태 표시
- [ ] 타임라인 컴포넌트: 4단계 시각화 (감지 → 분석 → 승인 → 조치완료)
- [ ] 빈 상태: 리포트 없을 때 메시지 표시
- [ ] "목록으로 돌아가기" 네비게이션
- [ ] 잘못된 ID: not found 처리
- [ ] Playwright E2E 테스트
- [ ] npm run check-all 통과

## 구현 단계

### 1단계: 타임라인 컴포넌트

- [ ] `src/components/incident-timeline.tsx` 신규 생성
- [ ] Props: steps (단계 정보 배열)
- [ ] 단계 구조:
  ```
  {
    label: "감지",
    timestamp: "2026-02-28T22:30:00Z",
    completed: true
  }
  ```
- [ ] Vertical timeline 또는 horizontal timeline
- [ ] 완료된 단계: 체크 아이콘, 활성 색상
- [ ] 대기 단계: 대기 상태 표시

### 2단계: 리포트 목록 페이지

- [ ] `src/app/(protected)/reports/page.tsx` 신규 생성
- [ ] Server Component (async)
- [ ] metadata 설정:
  - title: "장애 리포트 | AWS Cost Monitor"
- [ ] getIncidentReports() 호출
- [ ] 레이아웃:
  - Container > 제목 > 리스트 또는 그리드
- [ ] 각 항목:
  - 제목 (큰 텍스트)
  - 발생 일시 (formatDate)
  - 상태 배지 (resolved)
  - 클릭 가능 (cursor-pointer, hover)
- [ ] 빈 상태: 리포트 없을 때 메시지

### 3단계: 리포트 상세 페이지

- [ ] `src/app/(protected)/reports/[id]/page.tsx` 신규 생성
- [ ] Server Component (async)
- [ ] params.id로 리포트 조회
- [ ] 없으면 notFound() 호출
- [ ] metadata 설정 (동적):
  - title: `"{title} | AWS Cost Monitor"`
- [ ] 페이지 구조:
  - Container > Card 레이아웃
  - 헤더: 제목, 발생 일시
  - 원인 섹션: rootCauseSummary (긴 텍스트)
  - 조치 내역 섹션: actionsTaken (리스트, 체크마크)
  - 현재 상태 섹션: currentStatus (텍스트)
  - 타임라인 섹션: IncidentTimeline 컴포넌트
  - 네비게이션: "목록으로 돌아가기" 버튼

### 4단계: 타임라인 데이터 구성

- [ ] 리포트의 alertId로 원본 이상 항목 조회
- [ ] 타임라인 단계 구성:
  1. "비용 이상 감지" - alert.detectedAt
  2. "AI 분석 완료" - analysis.analyzedAt (or alert.detectedAt + 시간차)
  3. "관리자 승인" - approval.decidedAt (또는 현재 시간)
  4. "자동 조치 실행" - report.resolvedAt
- [ ] 각 단계 상태: true (모두 완료)

### 5단계: Playwright E2E 테스트

- [ ] 리포트 목록 페이지:
  - 항목 렌더링 확인
  - 첫 번째 항목 클릭 → 상세 페이지 이동
- [ ] 리포트 상세 페이지:
  - 제목, 일시, 원인, 조치 내역 표시 확인
  - 타임라인 렌더링 확인 (4단계)
  - "목록으로 돌아가기" 클릭 → 목록 페이지 이동
- [ ] 잘못된 ID:
  - not found 페이지 표시

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
