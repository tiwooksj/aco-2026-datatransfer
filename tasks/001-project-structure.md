# Task 001: 프로젝트 구조 및 라우팅 설정

> Next.js 15.5.3 App Router 기반 전체 라우트 구조 생성 및 보호된 라우트 설정.

## 명세서

Next.js App Router를 활용하여 애플리케이션의 전체 라우트 구조를 설계하고 구현합니다. 공개 페이지 (로그인)와 보호된 페이지 (이상 감지, 분석, 승인, 리포트)를 (protected) 라우트 그룹으로 구분합니다. 모든 페이지에 기본 메타데이터를 포함합니다.

## 관련 파일

- `src/app/layout.tsx` - 루트 레이아웃 (완료)
- `src/app/page.tsx` - 랜딩 페이지 (완료)
- `src/app/login/page.tsx` - 로그인 페이지 (완료)
- `src/app/(protected)/layout.tsx` - 보호된 레이아웃 (완료)
- `src/app/(protected)/anomalies/page.tsx` - 이상 감지 목록 (완료)
- `src/app/(protected)/anomalies/[id]/page.tsx` - 이상 항목 상세 (완료)
- `src/app/(protected)/approvals/page.tsx` - 관리자 승인 (완료)
- `src/app/(protected)/reports/page.tsx` - 장애 리포트 (완료)
- `src/components/layout/header.tsx` - 헤더 컴포넌트 (완료)
- `src/components/layout/footer.tsx` - 푸터 컴포넌트 (완료)
- `src/components/layout/container.tsx` - 컨테이너 컴포넌트 (완료)

## 수락 기준

- [x] Next.js App Router 기반 전체 라우트 구조 생성
- [x] 보호된 라우트를 위한 (protected) 라우트 그룹 구성
- [x] 모든 주요 페이지의 빈 껍데기 파일 생성 (metadata 포함)
- [x] 공통 레이아웃 컴포넌트 골격 구현 (Header, Footer, Container)

## 구현 단계

### 1단계: 라우트 구조 설계 ✓

- [x] 공개 라우트:
  - `/` - 랜딩 페이지
  - `/login` - 로그인 페이지
- [x] 보호된 라우트 (protected 그룹):
  - `/(protected)/anomalies` - 이상 감지 목록
  - `/(protected)/anomalies/[id]` - 이상 항목 상세
  - `/(protected)/approvals` - 관리자 승인
  - `/(protected)/reports` - 장애 리포트

### 2단계: 레이아웃 파일 생성 ✓

- [x] `src/app/layout.tsx` - 루트 레이아웃 생성
- [x] `src/app/(protected)/layout.tsx` - 보호된 페이지 레이아웃

### 3단계: 페이지 파일 생성 ✓

- [x] `src/app/page.tsx` - 랜딩 페이지
- [x] `src/app/login/page.tsx` - 로그인 페이지
- [x] `src/app/(protected)/anomalies/page.tsx` - 이상 감지 목록
- [x] `src/app/(protected)/anomalies/[id]/page.tsx` - 상세 페이지
- [x] `src/app/(protected)/approvals/page.tsx` - 승인 페이지
- [x] `src/app/(protected)/reports/page.tsx` - 리포트 페이지

### 4단계: 공통 컴포넌트 생성 ✓

- [x] `src/components/layout/header.tsx` - 헤더
- [x] `src/components/layout/footer.tsx` - 푸터
- [x] `src/components/layout/container.tsx` - 컨테이너

## 변경 사항 요약

**완료된 구현:**

- Next.js 15.5.3 App Router 기반 라우트 구조 완성
- (protected) 라우트 그룹으로 보호된 페이지 분리
- 모든 페이지에 기본 메타데이터 설정
- 공통 레이아웃 컴포넌트 골격 구현
