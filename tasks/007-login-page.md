# Task 007: 로그인 페이지 구현 (F010)

> 이메일/비밀번호 입력 폼 기반 로그인 기능 완성. React Hook Form + Zod 검증, Server Action 연동, 로딩 상태 UI 구현.

## 명세서

기존 LoginForm 컴포넌트 골격을 활용하여 Server Action (Task 003의 loginAction)과 연동합니다. 로그인 실패 시 toast 에러 메시지를 표시하고, 성공 시 HTTP-only 쿠키 설정 후 /anomalies로 리다이렉트합니다. 로딩 중 버튼 비활성화 및 스피너를 표시합니다.

## 관련 파일

- `src/components/login-form.tsx` - LoginForm 컴포넌트 (개선)
- `src/app/login/page.tsx` - 로그인 페이지 (개선)

## 수락 기준

- [x] 올바른 자격 증명 입력 → /anomalies로 리다이렉트
- [x] 잘못된 자격 증명 입력 → toast 에러 메시지 표시
- [x] 로딩 중: 버튼 비활성화, 스피너 표시
- [x] 입력 필드 검증: Zod 스키마 적용
- [x] 에러 메시지: 모두 한글
- [x] npm run check-all 통과
- [x] npm run build 성공

## 구현 단계

### 1단계: LoginForm 컴포넌트 개선

- [ ] `src/components/login-form.tsx` 수정
- [ ] Server Action 임포트 (Task 003의 login Action)
- [ ] onSubmit 핸들러에서 Server Action 호출
- [ ] 성공 응답: `/anomalies`로 리다이렉트
- [ ] 실패 응답: toast.error() 호출 (Sonner)
- [ ] 로딩 상태:
  - `form.formState.isSubmitting` 활용
  - 버튼 disabled 처리
  - 버튼 텍스트: "로그인" → "로그인 중..." (로딩 중)
  - 입력 필드 disabled 처리

### 2단계: 로그인 페이지 레이아웃

- [ ] `src/app/login/page.tsx` 개선
- [ ] 구조: Container > Card > LoginForm
- [ ] 센터 정렬 레이아웃 (Flexbox)
- [ ] metadata 설정:
  - title: "로그인 | AWS Cost Monitor"
- [ ] 배경색, 최소 높이 (fullscreen)

### 3단계: Playwright E2E 테스트

- [ ] 페이지 로드 시 폼 렌더링 확인
- [ ] 올바른 자격 증명 (ADMIN_EMAIL, ADMIN_PASSWORD):
  - 입력 후 submit
  - /anomalies로 리다이렉트 확인
  - HTTP-only 쿠키 설정 확인
- [ ] 잘못된 비밀번호:
  - 입력 후 submit
  - toast 에러 메시지 표시 확인
  - 페이지 유지
- [ ] 존재하지 않는 이메일:
  - 입력 후 submit
  - toast 에러 메시지 표시 확인
- [ ] 로딩 상태:
  - submit 중 버튼 비활성화 확인
  - submit 중 스피너 표시 확인

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
