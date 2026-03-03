# Task 013: 페이지 로딩 상태 및 스켈레톤 UI (Phase 4)

> 모든 주요 페이지에서 로딩 상태를 표시. Next.js loading.tsx와 Skeleton 컴포넌트로 사용자 경험 개선.

## 명세서

페이지 로드 중 로딩 상태를 시각적으로 표시하여 사용자 경험을 개선합니다. Next.js의 `loading.tsx` 파일과 shadcn의 Skeleton 컴포넌트를 활용하여 각 페이지의 로딩 상태를 구현합니다.

## 관련 파일

- `src/app/(protected)/anomalies/loading.tsx` - 이상 감지 목록 로딩 (신규)
- `src/app/(protected)/anomalies/[id]/loading.tsx` - 상세 페이지 로딩 (신규)
- `src/app/(protected)/approvals/loading.tsx` - 승인 페이지 로딩 (신규)
- `src/app/(protected)/reports/loading.tsx` - 리포트 목록 로딩 (신규)
- `src/app/(protected)/reports/[id]/loading.tsx` - 리포트 상세 로딩 (신규)

## 수락 기준

- [x] 모든 주요 페이지에 loading.tsx 구현
- [x] Skeleton 컴포넌트 활용
- [x] 로딩 상태 UI가 실제 콘텐츠와 유사한 레이아웃
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

### 1단계: Skeleton 컴포넌트 활용

- [x] shadcn Skeleton 컴포넌트 이미 설치됨 (Task 005에서)
- [x] Container, Card, Badge 등 기존 컴포넌트 활용

### 2단계: 이상 감지 목록 로딩

- [x] `src/app/(protected)/anomalies/loading.tsx` 생성
- [x] 카드 스켈레톤 4개 표시 (실제 5개 맞춤)
- [x] 각 카드: 제목, 비율, 일시, 상태 배지 자리 표시
- [x] 그리드 레이아웃 유지

### 3단계: 상세 페이지 로딩

- [x] `src/app/(protected)/anomalies/[id]/loading.tsx` 생성
- [x] 헤더, 지역 정보, 비용, AI 분석 섹션 스켈레톤
- [x] 타임라인 비슷한 로딩 상태

### 4단계: 승인 페이지 로딩

- [x] `src/app/(protected)/approvals/loading.tsx` 생성
- [x] Accordion 구조의 로딩 상태

### 5단계: 리포트 페이지 로딩

- [x] `src/app/(protected)/reports/loading.tsx` 생성
- [x] 리포트 카드 스켈레톤 3개
- [x] `src/app/(protected)/reports/[id]/loading.tsx` 생성
- [x] 리포트 상세 정보 스켈레톤

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
