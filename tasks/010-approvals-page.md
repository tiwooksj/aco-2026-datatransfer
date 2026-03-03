# Task 010: 관리자 승인 페이지 (F004, F005, F011)

> 승인 대기 항목 목록 표시 및 관리. 승인 시 리포트 생성 및 리다이렉트, 거부 시 모달로 사유 입력.

## 명세서

관리자가 AI 제안 조치를 검토하고 승인 또는 거부하는 전용 페이지입니다. 승인 대기 중인 항목과 처리 완료 항목을 섹션으로 나누어 표시합니다. 각 항목 클릭으로 분석 정보를 펼쳐 확인하고, 승인 시 장애 리포트를 자동 생성한 후 리포트 페이지로 이동합니다. 거부 시 RejectionReasonModal을 통해 사유를 입력받습니다.

## 관련 파일

- `src/app/(protected)/approvals/page.tsx` - 관리자 승인 페이지 (신규)
- `src/lib/actions/approvals.ts` - 승인/거부 Server Actions (신규)

## 수락 기준

- [ ] 승인 대기 항목 리스트 표시
- [ ] 각 항목 클릭으로 상세 정보 펼치기
- [ ] "승인" 버튼 클릭 → 장애 리포트 생성 → `/reports/[id]` 리다이렉트
- [ ] "거부" 버튼 클릭 → RejectionReasonModal 표시
- [ ] 거부 사유 입력 후 상태 rejected로 변경
- [ ] 처리 완료 항목 (resolved/rejected) 하단에 표시
- [ ] Header 승인 대기 배지 개수 업데이트
- [ ] 승인 성공: toast.success() 표시
- [ ] Playwright E2E 테스트: 승인/거부 플로우
- [ ] npm run check-all 통과

## 구현 단계

### 1단계: 승인/거부 Server Actions

- [ ] `src/lib/actions/approvals.ts` 신규 생성
- [ ] `approveApproval(approvalId: string)` Server Action:
  - 상태를 pending → resolved로 변경
  - generateIncidentReport() 호출
  - 생성된 리포트 ID 반환
- [ ] `rejectApproval(approvalId: string, reason: string)` Server Action:
  - 상태를 pending → rejected로 변경
  - rejectionReason 저장
  - 성공 응답 반환

### 2단계: 페이지 구조 작성

- [ ] `src/app/(protected)/approvals/page.tsx` 신규 생성
- [ ] Server Component (async)
- [ ] metadata 설정:
  - title: "관리자 승인 | AWS Cost Monitor"
- [ ] getApprovalsPending() 호출

### 3단계: 페이지 레이아웃

- [ ] Container > 제목 > 섹션 구조
- [ ] 섹션 1: "승인 대기 중인 항목"
  - 각 항목 카드 또는 리스트 항목
  - 항목명, 조치 요약, 요청 일시
  - 펼침/접힘 토글 (Accordion)
  - 펼쳤을 때: 분석 정보, 제안 조치 표시
  - 버튼 영역: "승인" / "거부"
- [ ] 섹션 2: "처리 완료 항목" (축소)
  - resolved/rejected 항목 표시
  - 상태 배지

### 4단계: 상호작용 구현

- [ ] "승인" 버튼 클릭:
  - approveApproval() Server Action 호출
  - 성공: toast.success() + 리포트 ID로 `/reports/[id]` 리다이렉트
  - 실패: toast.error()
- [ ] "거부" 버튼 클릭:
  - RejectionReasonModal 표시 (isOpen = true)
- [ ] 모달에서 거부 사유 제출:
  - rejectApproval() Server Action 호출
  - 성공: 모달 닫기, 항목이 "처리 완료" 섹션으로 이동, toast.success()
  - 실패: toast.error()

### 5단계: Playwright E2E 테스트

- [ ] 페이지 로드: 대기 항목 표시 확인
- [ ] 항목 클릭/펼침: 상세 정보 표시 확인
- [ ] "승인" 버튼 클릭:
  - 리포트 페이지로 리다이렉트 확인
  - 장애 리포트 생성 확인
- [ ] "거부" 버튼 클릭:
  - 모달 표시 확인
  - 사유 입력 후 제출
  - 항목 상태 변경 확인

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
