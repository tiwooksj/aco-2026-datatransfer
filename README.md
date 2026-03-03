# AWS Cost Monitor

AWS 데이터 전송비용이 평소보다 급증했을 때 원인을 AI가 분석하고, 관리자 승인을 거쳐 자동 조치까지 실행하는 이상 감지 및 대응 시스템입니다.

## 프로젝트 개요

**목적**: AWS 데이터 전송비용 급증 이상 감지 자동화 및 AI 기반 원인 분석, 관리자 승인 워크플로우 제공

**사용자**: AWS 인프라를 운영하는 DevOps 엔지니어 및 시스템 관리자

## 주요 페이지

1. **로그인** (`/login`) - 관리자 인증 (Supabase 연동)
2. **이상 감지 목록** (`/anomalies`) - Notion API fake 데이터 기반 비용 급증 항목 카드 리스트
3. **AI 분석 상세** (`/anomalies/[id]`) - 비용 급증 구간, AI 원인 분석, AI 조치 제안
4. **관리자 승인** (`/approvals`) - 승인/거부 처리 및 자동 조치 실행 (fake)
5. **장애 리포트** (`/reports`) - 발생 일시/원인/조치내역/현재상태 리포트

## 핵심 기능

- F001: 비용 이상 감지 목록 조회 (Notion API fake 데이터)
- F002: AI 분석 결과 표시 (비용 급증 구간, 원인, 관련 리소스)
- F003: AI 조치 제안 표시 및 관리자 승인 요청 트리거
- F004: 관리자 승인/거부 처리 (거부 사유 입력)
- F005: 자동 조치 실행 시뮬레이션 (fake)
- F006: 장애 리포트 자동 생성 및 조회
- F010: 관리자 인증 (Supabase)
- F011: 이상 항목 상태 관리 (감지됨/분석중/승인대기/조치완료/거부됨)

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.6+
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui (new-york style) + Lucide Icons
- **Forms**: React Hook Form 7.x + Zod
- **Data Source**: Notion API (Client SDK, fake 데이터)
- **Auth & DB**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 에 Supabase, Notion API 키 입력

# 개발 서버 실행 (Turbopack)
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열면 이상 감지 목록 페이지로 자동 이동합니다.

```bash
# 프로덕션 빌드
npm run build

# 전체 검사 (TypeScript + ESLint + Prettier)
npm run check-all
```

## 프로젝트 구조

```
src/
├── app/
│   ├── (protected)/          # 인증 필요 라우트 (Header+Footer 레이아웃 포함)
│   │   ├── anomalies/        # 이상 감지 목록
│   │   │   └── [id]/         # AI 분석 상세
│   │   ├── approvals/        # 관리자 승인
│   │   └── reports/          # 장애 리포트
│   ├── login/                # 로그인 (레이아웃 없음)
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # / -> /anomalies 리다이렉트
├── components/
│   ├── anomalies/            # 이상 감지 관련 컴포넌트
│   ├── approvals/            # 관리자 승인 관련 컴포넌트
│   ├── reports/              # 장애 리포트 관련 컴포넌트
│   ├── shared/               # 공통 컴포넌트
│   ├── layout/               # Header, Footer, Container
│   └── ui/                   # shadcn/ui 컴포넌트
├── lib/
│   ├── fake/                 # Fake 데이터 (Notion API 대체)
│   ├── env.ts                # 환경 변수 검증 (Zod)
│   └── utils.ts              # 공통 유틸리티
└── types/
    └── index.ts              # TypeScript 타입 정의
```

## 개발 상태

- 프로젝트 구조 설정 완료
- 핵심 타입 정의 완료 (AnomalyAlert, AiAnalysis, ApprovalRequest, IncidentReport)
- Fake 데이터 준비 완료 (5개 이상 감지 항목, 3개 AI 분석, 1개 리포트)
- 페이지별 UI 구현 예정

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항 및 기능 명세
- [개발 가이드](./CLAUDE.md) - Claude Code 개발 지침
- [프로젝트 구조](./docs/guides/project-structure.md)
- [스타일링 가이드](./docs/guides/styling-guide.md)
- [컴포넌트 패턴](./docs/guides/component-patterns.md)
