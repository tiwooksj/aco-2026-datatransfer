# Task 003: 하드코딩 인증 및 라우트 보호

> 환경 변수 기반 하드코딩 인증 시스템 구현. HTTP-only 쿠키를 활용한 라우트 보호 및 로그인/로그아웃 Server Actions 구현.

## 명세서

관리자 전용 시스템이므로 간단한 하드코딩 인증으로 충분합니다. 환경 변수에 저장된 관리자 이메일/비밀번호와 입력값을 비교하여 인증합니다. HTTP-only 쿠키를 사용하여 XSS 공격을 방어합니다.

## 관련 파일

- `.env.local` - 환경 변수 설정 (ADMIN_EMAIL, ADMIN_PASSWORD)
- `src/lib/env.ts` - 환경 변수 Zod 스키마 업데이트
- `src/middleware.ts` - 라우트 보호 미들웨어 (쿠키 검증)
- `src/lib/actions/auth.ts` - Server Actions (login, logout)

## 수락 기준

- [x] .env.local 파일 생성 및 환경 변수 설정
- [x] src/lib/env.ts에 인증 관련 변수 Zod 스키마 추가
- [x] middleware.ts 작성: 쿠키 검증 및 보호된 라우트 리다이렉션
- [x] login Server Action: 자격 증명 검증 후 HTTP-only 쿠키 설정
- [x] logout Server Action: 쿠키 삭제 후 /login으로 리다이렉트
- [ ] Playwright MCP 테스트: 로그인 성공/실패, 미인증 리다이렉트
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

### 1단계: 환경 변수 설정 및 스키마 업데이트

- [ ] `.env.local` 파일 생성:
  ```
  ADMIN_EMAIL=admin@example.com
  ADMIN_PASSWORD=password123
  ```
- [ ] `src/lib/env.ts` 업데이트: Zod 스키마에 ADMIN_EMAIL, ADMIN_PASSWORD 추가

### 2단계: Middleware 작성

- [ ] `src/middleware.ts` 생성
- [ ] 보호된 라우트 정의 (`/(protected)/*`)
- [ ] 쿠키 검증: `auth_cookie` 확인
- [ ] 미인증 사용자를 `/login`으로 리다이렉트

### 3단계: Server Actions 구현

- [ ] `src/lib/actions/auth.ts` 생성
- [ ] `login` Server Action:
  - 이메일/비밀번호 입력값 수신
  - 환경 변수와 비교
  - 일치: HTTP-only 쿠키 설정 (maxAge: 24h), 성공 반환
  - 불일치: 에러 메시지 반환
- [ ] `logout` Server Action:
  - 쿠키 삭제
  - `/login`으로 리다이렉트

### 4단계: Playwright MCP 테스트

- [ ] 정상 로그인 (올바른 자격 증명) → /anomalies로 리다이렉트 확인
- [ ] 실패 로그인 (잘못된 비밀번호) → 에러 메시지 확인
- [ ] 실패 로그인 (존재하지 않는 이메일) → 에러 메시지 확인
- [ ] 미인증 사용자가 보호된 라우트 접근 → /login으로 리다이렉트 확인
- [ ] 로그아웃 후 쿠키 삭제 확인

## 테스트 체크리스트

- [ ] 로그인 정상 플로우 (올바른 자격 증명)
- [ ] 로그인 실패 플로우 (잘못된 비밀번호)
- [ ] 미인증 사용자 라우트 보호
- [ ] 로그아웃 플로우 및 쿠키 삭제

## 변경 사항 요약

**구현된 파일:**

- ✅ `.env.local` - ADMIN_EMAIL, ADMIN_PASSWORD, Notion DB ID 추가
- ✅ `src/lib/env.ts` - Zod 스키마에 인증 변수 추가 (NOTION*DB*\* 필드 추가)
- ✅ `src/middleware.ts` (신규) - 보호된 라우트 인증 검증 미들웨어
- ✅ `src/lib/actions/auth.ts` (신규) - Server Actions (login, logout, isAuthenticated)
- ✅ `src/components/login-form.tsx` - Server Action 연동, toast 피드백 추가
- ✅ `src/app/(protected)/reports/page.tsx` (신규) - 보호된 reports 페이지 생성

**핵심 기능:**

- HTTP-only 쿠키 기반 인증 (XSS 공격 방어)
- 관리자 이메일/비밀번호 환경 변수 기반 검증
- Middleware를 통한 자동 라우트 보호
- 미인증 사용자 `/login` 자동 리다이렉트
- 로그인 성공 시 `/anomalies`로 이동
- toast로 로그인 성공/실패 피드백

**검증 완료:**

- ✅ `npm run build` 성공 (프로덕션 빌드)
- ✅ `npm run check-all` 통과 (TypeScript, ESLint, Prettier)
