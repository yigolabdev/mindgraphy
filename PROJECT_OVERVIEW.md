# 🧭 MindGraphy System - Project Overview

> Wedding Photography Management System

## System Architecture

### Two Main Platforms

#### 1. Client Portal (고객용 포털)
- 고객 전용 웨딩 관리 인터페이스
- 계약서, 정보 입력, 사진 선택, 다운로드 관리
- 토큰 기반 또는 로그인 접근
- 모바일 최적화

#### 2. Back Office (내부 업무 시스템)
- 사진작가, 편집자, 관리자용 워크플로우 관리
- 스케줄, 배정, 제작, 배송 진행 관리
- 실시간 대시보드 및 분석

### Core Hub: Scheduling Calendar
- 모든 활동의 중심 데이터 허브
- 예약, 배정, 프루프, 배송이 하나의 캘린더에 매핑

---

## Core Principles

1. **All-in-One Workflow**
   - 예약 → 계약 → 촬영 → 편집 → 배송 → 백업
   - 단일 생태계에서 관리

2. **Calendar-Centric System**
   - 모든 활동이 공유 캘린더에 매핑
   - 실시간 동기화

3. **Dual Experience**
   - 고객: 개인화된 페이지 (이메일/카톡 의존성 제거)
   - 직원: Back Office를 통한 전체 워크플로우 관리

---

## Client Portal Features

### Authentication & Access
- 고유 토큰 또는 로그인을 통한 접근
- 보안 세션 관리

### Core Functions
- **Digital Contract**: PDF + 전자서명
- **Information Input**: 커플 정보, 웨딩 장소, 메이크업, 배송 주소
- **Proof Gallery**: 사진 선택 및 코멘트 태깅
- **Download Section**: 최종 사진 & 앨범 다운로드
- **Payment Tracking**: 결제 상태 및 문서 발급 (현금영수증)
- **Notifications**: 이메일/SMS 진행 상황 알림

### UX Features
- 깔끔하고 모바일 최적화된 인터페이스
- D-Day 인디케이터
- 진행률 바
- 단일 페이지 인터페이스 (외부 링크 없음)

---

## Back Office Features

### Core Modules

#### 1. Schedule Calendar (중심 모듈)
- 모든 예약, 촬영, 배송 작업의 중앙 집중식 캘린더
- 드래그 앤 드롭 배정
- 실시간 동기화
- 색상 코드로 상태 구분
- 다중 뷰: Month / Week / Day / Timeline / Kanban
- 사진작가별 개인 뷰 ("My Day / My Week")

#### 2. CRM & Reservation
- 고객 문의, 리드, 채널 추적

#### 3. Contract Management
- 전자서명
- 약관 관리
- 환불/위약금 로직

#### 4. Photographer Management
- 배정, 가용성, 성과 통계
- 개인 타임라인
- 이동 시간 배지
- 가용성 편집

#### 5. Proof & Editing
- 프루프 갤러리 연동
- 리터칭 큐 추적

#### 6. Delivery & Backup
- 자동 스토리지 라우팅 (SSD → HDD → NAS)

#### 7. Analytics Dashboard
- 전환율
- 배송 시간
- SLA 준수율
- 만족도 지수

#### 8. Notification Center
- SES/SNS를 통한 자동 메시지 (Email/SMS)

---

## Technology Stack

### Frontend
- **Framework**: React + Next.js
- **Deployment**: S3 + CloudFront
- **UI Library**: FullCalendar.js (스케줄링)
- **Responsive**: 모바일 우선 디자인

### Backend
- **Framework**: Nest.js
- **Container**: AWS ECS Fargate + ALB
- **Architecture**: RESTful API

### Database
- **Primary**: AWS RDS (PostgreSQL)
- **High-Frequency**: DynamoDB (큐 관리)

### Storage
- **Active**: S3
- **Archive**: Glacier (장기 보관)

### Authentication & Security
- AWS Cognito
- Secrets Manager
- WAF/Shield

### Messaging & Notifications
- **Email**: AWS SES
- **SMS**: SNS/Pinpoint
- **Queue**: SQS (비동기 처리)

### Automation & Scheduling
- AWS EventBridge (타임 기반 알림)

### Monitoring & Observability
- CloudWatch
- CloudTrail
- X-Ray

---

## Key User Experiences

### For Photographers
- 명확한 개인 타임라인
- 이동 시간 배지
- 가용성 편집 기능
- "My Day / My Week" 뷰

### For Managers
- 프로젝트 및 직원별 실시간 진행 상황 개요
- 분석 대시보드
- 자원 배정 최적화

### For Clients
- 모든 작업을 위한 단일 페이지 인터페이스
- 외부 링크 없음
- 모바일 우선 접근성

---

## Development Scope

Cursor will handle:

1. **UI Component Design**
   - 두 포털 모두의 레이아웃
   - 재사용 가능한 컴포넌트 라이브러리

2. **Scheduling Calendar**
   - FullCalendar.js 기반 렌더링
   - 드래그 앤 드롭 기능
   - 다중 뷰 지원

3. **Client Workflows**
   - 폼 워크플로우
   - 프루프 갤러리 인터페이스

4. **API Integration**
   - Nest.js 백엔드 연동 엔드포인트
   - REST API 구조

5. **Notification Integration**
   - AWS SNS/SES 연동 훅

6. **Access Control**
   - 역할 기반 접근 구조 (Admin / Photographer / Client)

---

## Next Steps

1. 상세 기술 명세서 작성
2. 데이터베이스 스키마 설계
3. API 엔드포인트 설계
4. UI/UX 와이어프레임
5. 개발 로드맵 수립

