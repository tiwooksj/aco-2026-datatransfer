# Task 012: 핵심 기능 통합 테스트

> 전체 사용자 플로우를 Playwright MCP로 E2E 테스트. 로그인부터 리포트 확인까지 완전한 시나리오 및 엣지 케이스 검증.

## 명세서

Task 007~011에서 구현한 모든 기능을 통합하여 엔드-투-엔드(E2E) 테스트합니다. Playwright MCP를 활용하여 실제 브라우저 환경에서 사용자 여정 전체를 검증하고, 정상 플로우, 거부 플로우, 엣지 케이스까지 포괄적으로 테스트합니다. 최종적으로 프로덕션 빌드 성공을 확인합니다.

## 관련 파일

- `tests/e2e/full-flow.spec.ts` - E2E 테스트 스크립트 (신규)

## 수락 기준

- [ ] 정상 플로우 E2E 테스트 통과 (모든 단계)
- [ ] 거부 플로우 E2E 테스트 통과
- [ ] 상태 전이 정합성 검증 통과
- [ ] 엣지 케이스 테스트 통과
  - 미인증 사용자 리다이렉트
  - 잘못된 ID 접근 (not found)
  - 네트워크 에러 시뮬레이션 (선택사항)
- [ ] npm run check-all 통과
- [ ] npm run build 성공
- [ ] 테스트 보고서 작성 (스크린샷 포함)

## 구현 단계

### 1단계: 정상 플로우 E2E 테스트

테스트 시나리오: 로그인 → 목록 → 상세 → 승인 요청 → 승인 처리 → 리포트 확인

- [ ] 테스트 1: 로그인 페이지 로드
  - URL: /login
  - 폼 렌더링 확인 (이메일, 비밀번호 필드, 로그인 버튼)

- [ ] 테스트 2: 올바른 자격 증명으로 로그인
  - 이메일: ADMIN_EMAIL (환경 변수)
  - 비밀번호: ADMIN_PASSWORD (환경 변수)
  - submit 클릭
  - 리다이렉트 확인: /anomalies
  - HTTP-only 쿠키 설정 확인

- [ ] 테스트 3: 이상 감지 목록 페이지
  - URL: /anomalies
  - 5개 카드 렌더링 확인
  - 첫 번째 카드 (alert-001, EC2, pending 상태)
  - 클릭 → /anomalies/alert-001으로 이동

- [ ] 테스트 4: AI 분석 상세 페이지
  - URL: /anomalies/alert-001
  - 기본 정보 표시 확인 (서비스명: EC2, 상태: pending)
  - 비용 정보 표시 (normalCost → anomalyCost)
  - AI 분석 텍스트 표시
  - 제안 조치 카드 표시
  - pending 상태이므로 "관리자 승인 요청" 버튼 비활성화 확인

- [ ] 테스트 5: detected 상태 항목으로 이동
  - "목록으로 돌아가기" → /anomalies
  - alert-002 (CloudFront, detected) 클릭
  - "관리자 승인 요청" 버튼 활성화 확인

- [ ] 테스트 6: 승인 요청
  - "관리자 승인 요청" 클릭
  - Server Action 호출 확인
  - 상태 변경 (detected → pending)
  - toast 성공 메시지
  - 버튼 비활성화

- [ ] 테스트 7: 관리자 승인 페이지
  - Header "관리자 승인" 메뉴 클릭 → /approvals
  - 승인 대기 항목 리스트 표시
  - 해당 항목 찾기 (alert-002)
  - 항목 클릭/펼침 → 상세 정보 표시

- [ ] 테스트 8: 승인 처리
  - "승인" 버튼 클릭
  - Server Action 호출
  - 장애 리포트 생성
  - /reports/[reportId]로 리다이렉트

- [ ] 테스트 9: 장애 리포트 페이지
  - 리포트 세부 정보 확인 (제목, 발생 일시, 원인, 조치)
  - 타임라인 렌더링 확인 (4단계)
  - "목록으로 돌아가기" 클릭 → /reports

### 2단계: 거부 플로우 E2E 테스트

테스트 시나리오: 승인 대기 항목 거부 + 사유 입력

- [ ] 테스트 10: 다른 항목으로 거부 플로우
  - /approvals로 이동
  - pending 상태 항목 찾기 (alert-001)
  - "거부" 버튼 클릭
  - RejectionReasonModal 표시 확인
  - 거부 사유 입력 (예: "추가 검토 필요")
  - "확인" 버튼 클릭
  - Server Action 호출
  - 모달 닫기
  - 항목 상태 변경 확인 (pending → rejected)

### 3단계: 상태 전이 정합성 테스트

- [ ] 테스트 11: resolved 상태 항목
  - /anomalies로 이동
  - alert-003 (S3, resolved) 클릭
  - "관리자 승인 요청" 버튼 비활성화 확인
  - /approvals에서 resolved 항목이 "처리 완료" 섹션에 표시되는지 확인

- [ ] 테스트 12: rejected 상태 항목
  - 위 거부 플로우 완료 후
  - /anomalies에서 alert-001 (rejected) 확인
  - 배지 색상 (회색) 확인

### 4단계: 엣지 케이스 테스트

- [ ] 테스트 13: 미인증 사용자 접근
  - 모든 쿠키 삭제
  - /anomalies 직접 접근 → /login으로 리다이렉트 확인
  - /approvals 직접 접근 → /login으로 리다이렉트 확인
  - /reports 직접 접근 → /login으로 리다이렉트 확인

- [ ] 테스트 14: 잘못된 ID 접근
  - /anomalies/nonexistent-id → not found 페이지
  - /reports/nonexistent-id → not found 페이지

- [ ] 테스트 15: 잘못된 자격 증명
  - /login에서 잘못된 이메일 입력 → toast 에러
  - /login에서 잘못된 비밀번호 입력 → toast 에러

### 5단계: 최종 검증

- [ ] npm run check-all 실행
  - ESLint 통과
  - TypeScript 타입 체크 통과
  - Prettier 포맷 확인

- [ ] npm run build 실행
  - 프로덕션 빌드 성공
  - 빌드 결과 확인 (에러 없음)

- [ ] 테스트 보고서 작성
  - 모든 E2E 테스트 결과 정리
  - 스크린샷 첨부 (주요 단계)
  - 실패 여부 기록

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
