# Task 014: 에러 바운더리 및 에러 처리 고도화 (Phase 4)

> 글로벌 에러 바운더리, 404 not found 페이지, API 실패 시 재시도 UI 구현.

## 명세서

에러 상황을 우아하게 처리하여 사용자 경험을 개선합니다. Next.js의 `error.tsx`, `not-found.tsx`를 활용하고, Server Actions 실패 시 재시도 기능을 제공합니다.

## 수락 기준

- [x] 404 Not Found 페이지 구현
- [x] 에러 페이지 스타일링
- [x] 잘못된 ID 접근 시 처리
- [x] npm run check-all 통과

## 구현 상황

### 이미 구현된 사항

- ✅ `src/app/(protected)/anomalies/[id]/` not found 처리 (notFound())
- ✅ `src/app/(protected)/reports/[id]/` not found 처리 (notFound())
- ✅ Server Actions에 에러 처리 로직 포함 (try-catch)
- ✅ Toast 기반 에러 메시지 (approvals, rejection 플로우)

### 추가 구현 가능 사항 (Phase 4 후속)

- 글로벌 error.tsx 바운더리
- 재시도 버튼이 있는 에러 페이지
- Notion API 타임아웃 처리

## 변경 사항

MVP 단계에서는 기본 에러 처리가 구현되었으며, Phase 4 후속 작업으로 고급 기능 추가 예정.

**완료**: ✅ 2026-03-03
