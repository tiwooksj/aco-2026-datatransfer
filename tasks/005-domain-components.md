# Task 005: 도메인 공통 컴포넌트 구현

> 이상 감지 및 승인 워크플로우에서 재사용할 도메인 컴포넌트 4개 및 유틸 함수 구현.

## 명세서

이상 감지 항목 카드, 상태 배지, 거부 사유 모달 등 도메인 특화 컴포넌트를 구현합니다. 각 컴포넌트는 shadcn/ui를 기반으로 하며, 모든 UI 텍스트는 한글입니다. 유틸 함수로 금액, 날짜, 증가율 포맷팅을 제공합니다.

## 관련 파일

- `src/components/anomaly-status-badge.tsx` - 상태 배지 컴포넌트 (신규)
- `src/components/anomaly-card.tsx` - 이상 감지 카드 컴포넌트 (신규)
- `src/components/rejection-reason-modal.tsx` - 거부 사유 모달 (신규)
- `src/lib/utils.ts` - 유틸 함수 (확장)

## 수락 기준

- [x] AnomalyStatusBadge: 4가지 상태별 색상 정확 (detected: 빨강, analyzing: 회색, pending: 주황, resolved: 초록, rejected: 회색)
- [x] AnomalyCard: 서비스명, 급증 비율(%), 감지 일시, 상태 배지 표시
- [x] AnomalyCard: onClick 콜백 작동
- [x] RejectionReasonModal: Dialog + Form 구조, Zod 검증
- [x] RejectionReasonModal: onSubmit 콜백 작동
- [x] formatCost: "$1,234.56" 형식
- [x] formatDate: "2026-03-02 15:30" 형식
- [x] formatIncreaseRate: "719%" 형식
- [x] npm run check-all 통과

## 구현 단계

### 1단계: AnomalyStatusBadge 컴포넌트

- [ ] `src/components/anomaly-status-badge.tsx` 신규 생성
- [ ] Props: status (AnomalyStatus), size? ('default' | 'sm')
- [ ] ANOMALY_STATUS_LABEL, ANOMALY_STATUS_VARIANT 매핑 활용
- [ ] shadcn/ui Badge 컴포넌트 래핑
- [ ] 'use client' 지시문

### 2단계: AnomalyCard 컴포넌트

- [ ] `src/components/anomaly-card.tsx` 신규 생성
- [ ] Props: alert (AnomalyAlert), onClick?: () => void
- [ ] Card > CardHeader + CardContent 구조
- [ ] 표시 항목:
  - 서비스명 (CardTitle)
  - 급증 비율 (% 단위, 큰 텍스트)
  - 감지 일시 (formatDate 활용)
  - 상태 배지 (AnomalyStatusBadge)
- [ ] onClick 이벤트 핸들러
- [ ] hover 효과 (cursor-pointer)
- [ ] 'use client' 지시문

### 3단계: RejectionReasonModal 컴포넌트

- [ ] `src/components/rejection-reason-modal.tsx` 신규 생성
- [ ] Props: isOpen (boolean), onClose: () => void, onSubmit: (reason: string) => void
- [ ] Dialog + Form (React Hook Form) + Zod 검증
- [ ] Zod 스키마: reason (문자열, 최소 10자, 최대 500자)
- [ ] 입력 필드: Textarea (여러 줄)
- [ ] 버튼: 취소, 제출
- [ ] 'use client' 지시문

### 4단계: 유틸 함수 확장

- [ ] `src/lib/utils.ts`에 함수 추가:
  - `formatCost(amount: number): string`
    - 소수점 2자리, 천의 자리 쉼표
    - 예: 1234.56 → "$1,234.56"
  - `formatDate(dateString: string): string`
    - ISO 8601 입력 → "YYYY-MM-DD HH:mm" 출력
    - 예: "2026-03-01T09:15:00Z" → "2026-03-01 09:15"
  - `formatIncreaseRate(rate: number): string`
    - 정수값, % 기호 추가
    - 예: 719 → "719%"

## 변경 사항 요약

**구현된 파일:**

- ✅ `src/lib/utils.ts` (확장) - 3개 유틸 함수 추가
  - `formatCost(amount)` - 금액을 "$1,234.56" 형식으로
  - `formatDate(dateString)` - ISO 8601을 "YYYY-MM-DD HH:mm" 형식으로
  - `formatIncreaseRate(rate)` - 증가율을 "719%" 형식으로
- ✅ `src/components/anomaly-status-badge.tsx` (신규) - 상태별 배지 컴포넌트
  - shadcn Badge 래퍼
  - ANOMALY_STATUS_LABEL, ANOMALY_STATUS_VARIANT 매핑
  - size prop 지원 (default, sm)
- ✅ `src/components/anomaly-card.tsx` (신규) - 이상 감지 카드 컴포넌트
  - 서비스명, 리전, 증가율, 감지 일시 표시
  - AnomalyStatusBadge 통합
  - onClick 콜백 지원
  - hover 효과 (cursor-pointer, shadow-lg, border-primary)
- ✅ `src/components/rejection-reason-modal.tsx` (신규) - 거부 사유 모달
  - Dialog + React Hook Form + Zod 검증
  - Textarea 입력 (10-500자)
  - 취소/제출 버튼
  - 비동기 onSubmit 콜백
- ✅ `src/components/ui/textarea.tsx` (신규) - shadcn textarea 컴포넌트

**핵심 기능:**

- 도메인 특화 UI 컴포넌트 4개 모두 shadcn/ui 기반
- 재사용 가능한 유틸 함수 3개
- TypeScript 타입 안전성 보장
- 모든 텍스트 한글화

**검증 완료:**

- ✅ TypeScript 컴파일 통과
- ✅ ESLint 통과 (린팅)
- ✅ Prettier 포맷팅 적용
- ✅ `npm run build` 성공 (프로덕션 빌드)
