# Task 002: 타입 정의 및 데이터 모델 설계

> TypeScript 인터페이스 정의 및 Fake 데이터 생성, 상태 관리 상수 정의.

## 명세서

AWS Cost Monitor 시스템의 핵심 도메인 모델을 TypeScript 인터페이스로 정의합니다. Notion 데이터베이스 스키마(3개 DB)를 기반으로 AnomalyAlert, AiAnalysis, IncidentReport 3가지 주요 엔티티를 정의하고, Fake 데이터를 생성하여 개발 단계에서 사용합니다. 상태 라벨과 배지 색상 매핑 상수를 정의하여 UI에서 재사용합니다.

## 관련 파일

- `src/types/index.ts` - 타입 정의 (완료)
- `src/lib/fake/data.ts` - Fake 데이터 생성 (완료)

## 수락 기준

- [ ] TypeScript 인터페이스 정의 (AnomalyAlert, AiAnalysis, IncidentReport)
- [ ] 상태 Enum 타입 정의 (AnomalyStatus, ApprovalDecision)
- [ ] 상태 레이블 및 배지 색상 매핑 상수 (ANOMALY_STATUS_LABEL, ANOMALY_STATUS_VARIANT)
- [ ] Fake 데이터 생성 및 관리 유틸리티 (5개 이상 항목)
- [ ] Notion 스키마 매핑: 타입 필드와 Notion DB 속성명 일치

## 구현 단계

### 1단계: 도메인 모델 정의

- [ ] `src/types/index.ts` 생성/업데이트
- [ ] **AnomalyStatus** 타입 (union type):
  - 'detected' - 이상 감지됨
  - 'analyzing' - 분석 중
  - 'pending' - 승인 대기 중
  - 'resolved' - 조치 완료
  - 'rejected' - 거부됨
- [ ] **ApprovalDecision** 타입:
  - 'approved' - 승인
  - 'rejected' - 거부
- [ ] **AnomalyAlert** 인터페이스 (탐지 + 승인 워크플로우):
  - id, serviceName, usageType, detectedAt
  - normalCost, anomalyCost, increaseRate
  - source, sourceRegion, destination, destinationRegion
  - status, notionPageId
  - (승인 워크플로우) requestedAt?, decidedAt?, decision?, rejectionReason?
- [ ] **AiAnalysis** 인터페이스:
  - id, alertId, rootCause, affectedResources[]
  - suggestedActions (Rich Text로 저장되므로 string으로 표현)
  - analyzedAt
- [ ] **IncidentReport** 인터페이스:
  - id, alertId, title, occurredAt, resolvedAt
  - rootCauseSummary, actionsTaken[], currentStatus

### 2단계: 상태 관리 상수

- [ ] **ANOMALY_STATUS_LABEL** 상수:
  - detected → "감지됨"
  - analyzing → "분석중"
  - pending → "승인대기"
  - resolved → "조치완료"
  - rejected → "거부됨"
- [ ] **ANOMALY_STATUS_VARIANT** 상수:
  - detected → "destructive" (빨강)
  - analyzing → "secondary" (회색)
  - pending → "secondary" (주황)
  - resolved → "default" (초록)
  - rejected → "outline" (회색)

### 3단계: Fake 데이터 생성

- [ ] `src/lib/fake/data.ts` 생성/업데이트
- [ ] **FAKE_ANOMALY_ALERTS**: 5개 항목 (새 필드 포함)
  - alert-001: EKS, intra-az, 719% 증가, pending 상태, 승인 요청 정보 포함
  - alert-002: CloudFront, getObject, 595% 증가, detected 상태
  - alert-003: S3, cross-region, 1019% 증가, resolved 상태, 승인 완료 정보 포함
  - alert-004: RDS, replication, 560% 증가, detected 상태
  - alert-005: EKS, egress, 100% 증가, rejected 상태, 거부 사유 포함
- [ ] **FAKE_AI_ANALYSES**: 각 이상 항목별 분석 결과 (5개)
  - rootCause: 상세한 한글 분석 텍스트
  - affectedResources: AWS 리소스 목록
  - suggestedActions: 제안 조치 (Rich Text 형식: 줄바꿈으로 구분)
  - analyzedAt: 분석 완료 일시
- [ ] **FAKE_INCIDENT_REPORTS**: 장애 리포트 (1-2개, resolved 항목만)

## Notion 스키마 매핑

이 타입 정의는 Notion 데이터베이스 3개와 매핑됩니다:

| TypeScript 타입 | Notion DB       | 속성 매핑                                                                                                                                                                                                   |
| --------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AnomalyAlert    | AnomalyAlerts   | Name, service_name, usage_type, detected_at, normal_cost, anomaly_cost, increase_rate, source, source_region, destination, destination_region, status, requested_at, decided_at, decision, rejection_reason |
| AiAnalysis      | AiAnalysis      | Name, anomaly_alert(Relation), root_cause, affected_resources, suggested_actions, analyzed_at                                                                                                               |
| IncidentReport  | IncidentReports | Name, anomaly_alert(Relation), occurred_at, resolved_at, root_cause_summary, actions_taken, current_status                                                                                                  |

## 변경 사항 요약

> 작업 완료 후 실제 변경된 파일과 내용을 기록합니다. (작업 시작 시에는 비워둡니다)
