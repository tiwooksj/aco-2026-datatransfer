# Task 006: 공통 API 클라이언트 및 상태 관리 로직

> Fake 데이터 기반 상태 관리 및 CRUD 시뮬레이션 로직 구현. Server Actions로 API 클라이언트 래퍼 제공.

## 명세서

MVP 단계이므로 실제 DB 없이 메모리 기반 Fake 데이터로 상태를 시뮬레이션합니다. Server Actions로 API를 추상화하여 향후 실제 백엔드 연동 시 쉽게 교체할 수 있는 구조로 설계합니다. 상태 전이 로직 (detected → pending → resolved/rejected)을 검증합니다.

## 관련 파일

- `src/lib/actions/notion.ts` - Notion API 클라이언트 (신규)
- `src/lib/state-management.ts` - 상태 관리 유틸 (신규)
- `src/lib/fake/data.ts` - Fake 데이터 (확장)

## 수락 기준

- [x] getAnomalyAlerts() Server Action: Fake 데이터 배열 반환
- [x] getAnomalyById(id: string) Server Action: ID로 특정 항목 조회
- [x] getAnalysisByAlertId(alertId: string) Server Action: 분석 결과 조회
- [x] updateAnomalyStatus(alertId: string, status: AnomalyStatus) 함수: 상태 변경 반영
- [x] getApprovalsPending() Server Action: pending 상태 항목만 필터링
- [x] generateIncidentReport(alertId: string) 함수: 리포트 객체 생성
- [x] 상태 전이 검증: detected → pending → resolved/rejected만 허용
- [x] TypeScript 타입 검사 통과

## 구현 단계

### 1단계: Notion API 클라이언트 (Server Actions)

- [ ] `src/lib/actions/notion.ts` 신규 생성
- [ ] `getAnomalyAlerts()` Server Action:
  - Fake 데이터에서 모든 이상 항목 반환
  - 타입: AnomalyAlert[]
- [ ] `getAnomalyById(id: string)` Server Action:
  - ID로 특정 항목 조회
  - 없으면 null 반환
- [ ] `getAnalysisByAlertId(alertId: string)` Server Action:
  - alertId에 해당하는 분석 결과 반환
  - 타입: AiAnalysis | null
- [ ] `getApprovalsPending()` Server Action:
  - pending 상태 항목만 필터링
  - 타입: ApprovalRequest[]
- [ ] `getIncidentReports()` Server Action:
  - 완료된 리포트 목록 반환
  - 타입: IncidentReport[]

### 2단계: 상태 관리 유틸

- [ ] `src/lib/state-management.ts` 신규 생성
- [ ] `updateAnomalyStatus(alertId: string, newStatus: AnomalyStatus)`:
  - Fake 데이터 배열에서 해당 항목의 상태 변경
  - 상태 전이 검증 (detected → pending → resolved/rejected)
  - 역순 전이는 불가능
- [ ] `generateIncidentReport(alertId: string): IncidentReport`:
  - alertId에 해당하는 이상 항목과 분석 정보로 리포트 생성
  - 타임스탬프 자동 설정 (현재 시간)
  - 상태: resolved로 변경
- [ ] 상태 전이 검증 로직:
  - canTransition(currentStatus, newStatus): boolean

### 3단계: Fake 데이터 확장

- [ ] `src/lib/fake/data.ts`에 제약 조건 추가:
  - 상태 전이 규칙을 주석으로 문서화
  - FAKE_INCIDENT_REPORTS 추가 데이터 확인

### 4단계: Playwright 테스트

- [ ] getAnomalyAlerts()가 5개 항목 반환 확인
- [ ] getAnomalyById()로 특정 항목 조회 확인
- [ ] getAnalysisByAlertId()로 분석 결과 조회 확인
- [ ] updateAnomalyStatus()가 상태 변경 반영 확인
- [ ] generateIncidentReport()가 리포트 생성 확인

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
