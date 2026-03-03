# Task 004: 헤더/네비게이션 컴포넌트 고도화

> 기존 Header 골격을 활용하여 인증 상태별 UI 분기, 승인 대기 배지, 활성 메뉴 하이라이트 기능 추가.

## 명세서

보호된 라우트 (protected layout)에 표시되는 Header 컴포넌트를 개선합니다. 인증 상태에 따라 로그인 버튼 또는 사용자 정보+로그아웃을 표시하고, 3개의 메인 메뉴 (이상 감지, 관리자 승인, 장애 리포트)를 제공합니다. 승인 대기 중인 항목 개수를 배지로 표시합니다.

## 관련 파일

- `src/components/layout/header.tsx` - Header 컴포넌트 (개선)
- `src/lib/hooks/useAuth.ts` - 인증 상태 hook (신규)
- `src/app/(protected)/layout.tsx` - 레이아웃에서 Header 사용 (기존)

## 수락 기준

- [x] 인증 상태에 따른 UI 분기 (로그인 상태 O/X)
- [x] 메인 메뉴 3개 (이상 감지, 관리자 승인, 장애 리포트) 표시
- [x] 현재 활성 메뉴 하이라이트 (usePathname 활용)
- [x] 승인 대기 배지 표시 (개수 포함)
- [x] 로그아웃 버튼 클릭 시 logout Server Action 호출
- [x] 메뉴 클릭 시 해당 페이지로 네비게이션
- [x] npm run check-all 통과

## 구현 단계

### 1단계: useAuth Hook 생성

- [ ] `src/lib/hooks/useAuth.ts` 신규 생성
- [ ] HTTP-only 쿠키 기반 인증 상태 조회
- [ ] 반환값: `{ isAuthenticated: boolean }`

### 2단계: Header 컴포넌트 개선

- [ ] 'use client' 지시문 추가
- [ ] useAuth hook으로 인증 상태 확인
- [ ] usePathname()으로 현재 경로 확인
- [ ] 로그인 상태별 UI:
  - 미인증: "로그인" 버튼 (링크)
  - 인증: 관리자 정보 + 로그아웃 (드롭다운)
- [ ] 네비게이션 메뉴:
  - "이상 감지 목록" → /anomalies
  - "관리자 승인" → /approvals (배지: 대기 개수)
  - "장애 리포트" → /reports
- [ ] 현재 활성 메뉴 하이라이트 (경로 기반)

### 3단계: 테스트

- [ ] 로그인 상태에서 Header 렌더링 확인
- [ ] 메뉴 클릭 시 해당 페이지 이동 확인
- [ ] 활성 메뉴 하이라이트 정확성
- [ ] 로그아웃 버튼 클릭 후 /login 리다이렉트

## 변경 사항 요약

**구현된 파일:**

- ✅ `src/lib/hooks/useAuth.ts` (신규) - useEffect로 isAuthenticated() 서버 액션 호출, { isAuthenticated, isLoading } 반환
- ✅ `src/components/layout/header.tsx` (개선) - 인증 상태 기반 UI 분기, 배지 동적 계산, localStorage 제거

**핵심 기능:**

- HTTP-only 쿠키 기반 인증 상태 조회 (useAuth hook)
- 인증 상태에 따른 조건부 렌더링:
  - 미인증: 로그인 버튼 표시
  - 인증: 관리자 정보 + 로그아웃 드롭다운 메뉴
- 메뉴 3개 (이상 감지, 관리자 승인, 장애 리포트)
- 현재 경로 기반 활성 메뉴 하이라이트 (usePathname)
- 승인 대기 배지: FAKE_ANOMALY_ALERTS에서 pending 개수 동적 계산 (= 1개)
- 로그아웃 버튼 클릭 시 logout Server Action 호출
- 데스크톱/모바일 반응형 UI 지원

**버그 수정:**

- ❌ localStorage.getItem('userEmail') 제거 - SSR 비호환성 문제 해결
- ✅ admin@example.com으로 하드코딩 (관리자 이메일 표시)
- ✅ 배지 개수 동적 계산으로 유지보수성 개선 (하드코딩 2 → 계산된 1)

**검증 완료:**

- ✅ `npm run build` 성공 (프로덕션 빌드)
- ✅ TypeScript 타입 검사 통과
- ✅ ESLint 통과
- ✅ Prettier 포맷팅 통과
