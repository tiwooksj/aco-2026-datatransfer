# Task 008: 이상 감지 목록 페이지 (F001, F011)

> Fake 데이터 로드하여 AnomalyCard 컴포넌트로 카드 리스트 렌더링. 상태별 색상 구분, 카드 클릭 시 상세 페이지 네비게이션.

## 명세서

AWS 비용 급증 이상 항목 목록을 대시보드 형식으로 표시합니다. Task 006의 getAnomalyAlerts() Server Action으로 Fake 데이터를 로드하고, Task 005의 AnomalyCard 컴포넌트로 카드 리스트를 렌더링합니다. 각 카드 클릭 시 `/anomalies/[id]` 상세 페이지로 네비게이션합니다.

## 관련 파일

- `src/app/(protected)/anomalies/page.tsx` - 이상 감지 목록 페이지 (개선)

## 수락 기준

- [x] 페이지 로드 시 5개 카드 렌더링
- [x] 각 카드: 서비스명, 비율(%), 일시, 상태 배지 표시
- [x] 상태별 배지 색상 정확
- [x] 카드 클릭 시 `/anomalies/[id]` 페이지 이동
- [x] 빈 상태: 이상 감지 항목 없을 때 메시지 표시
- [x] Header 네비게이션: "이상 감지 목록" 활성 표시
- [x] 그리드 레이아웃: 반응형 (1/2/3열)
- [x] TypeScript 타입 검사 통과

## 구현 단계

### 1단계: 페이지 구조 작성

- [ ] `src/app/(protected)/anomalies/page.tsx` 개선
- [ ] Server Component (async)
- [ ] metadata 설정:
  - title: "이상 감지 목록 | AWS Cost Monitor"
- [ ] getAnomalyAlerts() Server Action 호출

### 2단계: 카드 리스트 렌더링

- [ ] Container > 제목 > 그리드 레이아웃
- [ ] 그리드: grid grid-cols-3 gap-4 (3열 고정)
- [ ] 각 항목에서 AnomalyCard 컴포넌트 렌더링
- [ ] AnomalyCard에 onClick 핸들러:
  - router.push(`/anomalies/${alert.id}`)

### 3단계: 빈 상태 처리

- [ ] 데이터 길이 확인
- [ ] 빈 상태: Empty State 메시지 + 아이콘
  - 텍스트: "이상 감지 항목이 없습니다"
  - 추가 설명 가능

### 4단계: Playwright E2E 테스트

- [ ] 페이지 로드 시 카드 5개 렌더링 확인
- [ ] 각 카드에 정보 표시 확인
- [ ] 첫 번째 카드 클릭 → `/anomalies/alert-001` 이동 확인
- [ ] Header "이상 감지 목록" 메뉴 활성 표시 확인
- [ ] 빈 상태 페이지: 항목 없을 때 메시지 표시 확인

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
