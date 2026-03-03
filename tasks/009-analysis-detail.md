# Task 009: AI 분석 상세 페이지 (F002, F003, F011)

> 동적 라우트 [id]로 이상 항목 상세 정보, AI 분석 결과, 제안 조치 표시. 관리자 승인 요청 버튼으로 상태 변경.

## 명세서

사용자가 선택한 이상 항목의 상세 정보를 표시합니다. 비용 급증 구간을 시각화하고, AI 분석 결과 (원인, 영향받은 리소스)와 제안 조치를 카드 리스트로 보여줍니다. "관리자 승인 요청" 버튼은 detected 상태에서만 활성화되며, 클릭 시 상태를 pending으로 변경합니다.

## 관련 파일

- `src/app/(protected)/anomalies/[id]/page.tsx` - 상세 페이지 (신규)

## 수락 기준

- [ ] 올바른 ID로 접근 시 상세 정보 표시
- [ ] 비용 비교 시각화 (before → after, Progress bar)
- [ ] AI 분석 텍스트 전체 표시
- [ ] 영향받은 리소스 목록 표시
- [ ] 제안 조치 카드 리스트 (3개 이상)
- [ ] "관리자 승인 요청" 버튼: detected 상태에서만 활성
- [ ] 버튼 클릭 시 상태를 pending으로 변경, 버튼 비활성화
- [ ] "목록으로 돌아가기" 네비게이션 (뒤로 가기 또는 /anomalies)
- [ ] 잘못된 ID: not found 페이지 (404)
- [ ] Playwright E2E 테스트
- [ ] npm run check-all 통과

## 구현 단계

### 1단계: 동적 라우트 페이지 생성

- [ ] `src/app/(protected)/anomalies/[id]/page.tsx` 신규 생성
- [ ] Server Component (async)
- [ ] params.id로 라우트 파라미터 접근
- [ ] metadata 설정 (동적):
  - title: `"{serviceName} - 이상 분석 | AWS Cost Monitor"`

### 2단계: 데이터 조회 및 구조화

- [ ] getAnomalyById(params.id) 호출
- [ ] 없으면 notFound() 호출 (404 처리)
- [ ] getAnalysisByAlertId(alert.alertId) 호출
- [ ] 데이터 구조 정리

### 3단계: 페이지 UI 구성

- [ ] Container > Card 레이아웃
- [ ] 헤더 섹션:
  - 서비스명 (제목)
  - 감지 일시 (formatDate)
  - 상태 배지 (AnomalyStatusBadge)
- [ ] 비용 정보 섹션:
  - "일반 비용" vs "급증 비용"
  - 화살표 (→)
  - 금액 (formatCost)
  - 증가율 (formatIncreaseRate)
  - Progress bar (급증 비율 시각화)
  - 리전 (fromRegion → toRegion)
- [ ] AI 분석 섹션:
  - 제목: "AI 분석 결과"
  - rootCause 텍스트 (전체 표시)
- [ ] 영향받은 리소스 섹션:
  - affectedResources 리스트 (bullet points)
- [ ] 제안 조치 섹션:
  - suggestedActions 카드 리스트
  - 각 카드: 제목, 설명, 예상 효과
- [ ] 버튼 영역:
  - "관리자 승인 요청" (detected: 활성, 다른 상태: 비활성)
  - "목록으로 돌아가기" (또는 뒤로 가기)

### 4단계: 승인 요청 Server Action

- [ ] Server Action 구현:
  - updateAnomalyStatus(alertId, "pending")
  - 성공: toast.success() + 버튼 비활성화
  - 실패: toast.error()

### 5단계: Playwright E2E 테스트

- [ ] 정상 ID (`alert-001`)로 접근:
  - 모든 정보 표시 확인
  - 상태가 detected일 때 승인 버튼 활성
- [ ] 다른 상태 항목 (`alert-003` resolved):
  - 승인 버튼 비활성 확인
- [ ] 승인 요청 버튼 클릭:
  - 상태 변경 확인
  - 버튼 비활성화 확인
  - toast 메시지 확인
- [ ] 잘못된 ID:
  - not found 페이지 표시

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
