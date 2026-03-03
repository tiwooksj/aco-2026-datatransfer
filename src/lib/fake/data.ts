import type {
  AnomalyAlert,
  AiAnalysis,
  ApprovalRequest,
  IncidentReport,
} from '@/types'

// Notion API fake 데이터 - 이상 감지 항목 목록
export const FAKE_ANOMALY_ALERTS: AnomalyAlert[] = [
  {
    id: 'alert-001',
    serviceName: 'EC2',
    detectedAt: '2026-03-01T09:15:00Z',
    normalCost: 120.5,
    anomalyCost: 987.3,
    increaseRate: 719,
    fromRegion: 'ap-northeast-2',
    toRegion: 'us-east-1',
    status: 'pending',
    notionPageId: 'notion-page-001',
  },
  {
    id: 'alert-002',
    serviceName: 'CloudFront',
    detectedAt: '2026-03-01T11:42:00Z',
    normalCost: 45.0,
    anomalyCost: 312.8,
    increaseRate: 595,
    fromRegion: 'us-east-1',
    toRegion: 'ap-southeast-1',
    status: 'detected',
    notionPageId: 'notion-page-002',
  },
  {
    id: 'alert-003',
    serviceName: 'S3',
    detectedAt: '2026-02-28T22:30:00Z',
    normalCost: 18.2,
    anomalyCost: 203.6,
    increaseRate: 1019,
    fromRegion: 'ap-northeast-2',
    toRegion: 'eu-west-1',
    status: 'resolved',
    notionPageId: 'notion-page-003',
  },
  {
    id: 'alert-004',
    serviceName: 'RDS',
    detectedAt: '2026-03-02T03:05:00Z',
    normalCost: 67.4,
    anomalyCost: 445.1,
    increaseRate: 560,
    fromRegion: 'ap-northeast-2',
    toRegion: 'ap-northeast-2',
    status: 'detected',
    notionPageId: 'notion-page-004',
  },
  {
    id: 'alert-005',
    serviceName: 'EKS',
    detectedAt: '2026-02-27T14:20:00Z',
    normalCost: 89.0,
    anomalyCost: 178.5,
    increaseRate: 100,
    fromRegion: 'ap-northeast-2',
    toRegion: 'us-west-2',
    status: 'rejected',
    notionPageId: 'notion-page-005',
  },
]

// AI 분석 결과 fake 데이터
export const FAKE_AI_ANALYSES: AiAnalysis[] = [
  {
    id: 'analysis-001',
    alertId: 'alert-001',
    rootCause:
      'EC2 인스턴스 (i-0a1b2c3d4e5f)에서 비정상적으로 대용량 데이터가 서울 리전(ap-northeast-2)에서 미국 동부 리전(us-east-1)으로 전송되었습니다. 분석 결과, 해당 인스턴스에서 실행 중인 데이터 백업 스크립트의 설정 오류로 인해 중복 전송이 발생한 것으로 확인됩니다. 약 2.3TB의 데이터가 6시간에 걸쳐 반복 전송되었습니다.',
    affectedResources: [
      'EC2 i-0a1b2c3d4e5f (prod-backup-01)',
      'S3 s3://company-backup-us-east-1',
      'VPC vpc-0987654321 (prod-vpc)',
    ],
    suggestedActions: [
      {
        id: 'action-001-1',
        title: '비정상 EC2 인스턴스 네트워크 트래픽 차단',
        description:
          '해당 인스턴스의 보안 그룹에서 아웃바운드 규칙을 수정하여 us-east-1 리전으로의 대용량 전송을 임시 차단합니다.',
        expectedEffect: '즉각적인 비용 발생 중단 및 추가 데이터 유출 방지',
      },
      {
        id: 'action-001-2',
        title: '백업 스크립트 중지 및 설정 수정',
        description:
          '오류가 발생한 백업 스크립트(backup-sync.sh)를 중지하고, 올바른 대상 버킷 경로로 설정을 수정합니다.',
        expectedEffect: '중복 전송 근본 원인 제거',
      },
      {
        id: 'action-001-3',
        title: '전송 완료된 중복 데이터 정리',
        description:
          's3://company-backup-us-east-1 버킷에서 중복 전송된 데이터를 확인하고 삭제하여 스토리지 비용을 절감합니다.',
        expectedEffect: '월 $45 내외의 S3 스토리지 비용 절감',
      },
    ],
    analyzedAt: '2026-03-01T09:22:00Z',
  },
  {
    id: 'analysis-002',
    alertId: 'alert-002',
    rootCause:
      'CloudFront 배포(E1ABCDEF123456)에서 대규모 캐시 미스(Cache Miss)가 발생하여 오리진 서버로의 요청이 급증하였습니다. 싱가포르(ap-southeast-1) 엣지 로케이션에서 미국 동부(us-east-1) 오리진으로의 트래픽이 평소 대비 약 6배 증가했습니다. TTL 설정 변경 배포 후 기존 캐시가 모두 무효화된 것이 원인으로 분석됩니다.',
    affectedResources: [
      'CloudFront E1ABCDEF123456 (prod-cdn)',
      'EC2 i-0fedcba9876 (prod-web-01)',
      'ALB arn:aws:elasticloadbalancing:us-east-1:...',
    ],
    suggestedActions: [
      {
        id: 'action-002-1',
        title: 'CloudFront TTL 설정 복구',
        description:
          '변경된 TTL 설정을 이전 값(86400초)으로 되돌려 캐시 히트율을 정상화합니다.',
        expectedEffect: '오리진 트래픽 정상화 및 데이터 전송 비용 감소',
      },
      {
        id: 'action-002-2',
        title: '캐시 워밍(Cache Warming) 실행',
        description:
          '주요 URL에 대한 캐시 워밍 스크립트를 실행하여 캐시 히트율을 빠르게 회복시킵니다.',
        expectedEffect: '1-2시간 내 캐시 히트율 80% 이상 복구',
      },
    ],
    analyzedAt: '2026-03-01T11:50:00Z',
  },
  {
    id: 'analysis-003',
    alertId: 'alert-003',
    rootCause:
      'S3 버킷(company-assets-kr)에서 유럽 리전(eu-west-1)으로의 크로스 리전 복제(Cross-Region Replication) 설정이 실수로 활성화되었습니다. 약 850GB의 미디어 파일이 대량 전송되었습니다.',
    affectedResources: [
      'S3 s3://company-assets-kr',
      'S3 s3://company-assets-eu (CRR 대상)',
    ],
    suggestedActions: [
      {
        id: 'action-003-1',
        title: '크로스 리전 복제 비활성화',
        description: '실수로 활성화된 CRR 규칙을 즉시 비활성화합니다.',
        expectedEffect: '추가적인 데이터 전송 비용 발생 중단',
      },
      {
        id: 'action-003-2',
        title: 'eu-west-1 복제 데이터 삭제',
        description:
          '불필요하게 복제된 데이터를 삭제하여 스토리지 비용을 절감합니다.',
        expectedEffect: '월 $120 내외의 스토리지 비용 절감',
      },
    ],
    analyzedAt: '2026-02-28T22:45:00Z',
  },
]

// 관리자 승인 요청 fake 데이터
export const FAKE_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: 'approval-001',
    alertId: 'alert-001',
    requestedAt: '2026-03-01T09:30:00Z',
  },
  {
    id: 'approval-003',
    alertId: 'alert-003',
    requestedAt: '2026-02-28T23:00:00Z',
    decidedAt: '2026-02-28T23:15:00Z',
    decision: 'approved',
  },
]

// 장애 리포트 fake 데이터
export const FAKE_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'report-001',
    alertId: 'alert-003',
    title: 'S3 크로스 리전 복제 설정 오류로 인한 비용 급증',
    occurredAt: '2026-02-28T22:30:00Z',
    resolvedAt: '2026-02-28T23:30:00Z',
    rootCauseSummary:
      '운영자 실수로 S3 크로스 리전 복제(CRR) 규칙이 활성화되어 약 850GB 데이터가 eu-west-1로 전송됨',
    actionsTaken: [
      'CRR 규칙 즉시 비활성화 (23:05)',
      'eu-west-1 복제 데이터 삭제 완료 (23:25)',
      'S3 버킷 정책 검토 및 권한 강화 (23:30)',
    ],
    currentStatus:
      '정상 운영 중. 재발 방지를 위해 CRR 활성화에 승인 프로세스 추가 예정.',
  },
]
