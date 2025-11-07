# 🧭 MindGraphy

> Comprehensive Wedding Photography Management System

MindGraphy는 웨딩 촬영 서비스를 위한 올인원 관리 시스템입니다. 예약부터 계약, 촬영, 편집, 배송, 백업까지 모든 워크플로우를 하나의 생태계에서 관리합니다.

---

## 📋 Project Structure

```
mindgraphy/
├── README.md
├── PROJECT_OVERVIEW.md           # 시스템 개요 및 주요 기능
├── TECH_STACK.md                 # 기술 스택 상세
├── DATABASE_SCHEMA.md            # 데이터베이스 스키마 설계
├── API_ENDPOINTS.md              # REST API 엔드포인트 명세
├── DEVELOPMENT_ROADMAP.md        # 개발 로드맵 (16-20주)
├── .cursorrules                  # Cursor 개발 가이드라인
├── frontend/                     # React + Next.js (예정)
├── backend/                      # Nest.js (예정)
└── infrastructure/               # AWS CDK/Terraform (예정)
```

---

## 🎯 Core Features

### Client Portal (고객용 포털)
- 🔐 토큰 기반 보안 접근
- 📝 디지털 계약서 및 전자서명
- 📷 프루프 갤러리 (사진 선택 & 코멘트)
- 📥 최종 사진 다운로드
- 💳 결제 상태 추적
- 📱 모바일 최적화

### Back Office (내부 업무 시스템)
- 📅 **스케줄 캘린더** (중심 기능)
  - 드래그 앤 드롭 배정
  - 다중 뷰 (Month/Week/Day/Timeline)
  - 사진작가별 개인 뷰
  - 실시간 동기화
- 👥 CRM & 예약 관리
- 📄 계약 관리
- 👨‍💼 사진작가 관리
- 🎨 편집 큐 관리
- 📦 배송 & 백업
- 📊 분석 대시보드
- 🔔 자동화 알림 시스템

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Calendar**: FullCalendar.js
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: Nest.js with TypeScript
- **Database**: PostgreSQL (AWS RDS) + Prisma/TypeORM
- **High-Frequency**: DynamoDB
- **Cache**: Redis (AWS ElastiCache)
- **API Docs**: Swagger (OpenAPI)

### Infrastructure (AWS)
- **Compute**: ECS Fargate + Lambda
- **Storage**: S3 + Glacier
- **CDN**: CloudFront
- **Auth**: Cognito
- **Messaging**: SES (Email), SNS (SMS), SQS (Queue)
- **Monitoring**: CloudWatch, X-Ray, CloudTrail

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- AWS CLI configured
- PostgreSQL 14+ (or use Docker)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mindgraphy.git
cd mindgraphy

# Install dependencies (예정)
# npm install

# Set up environment variables
# cp .env.example .env
# Edit .env with your configuration

# Run database migrations
# npm run migrate

# Start development servers
# npm run dev
```

---

## 📚 Documentation

- [Project Overview](./PROJECT_OVERVIEW.md) - 시스템 개요 및 원칙
- [Tech Stack](./TECH_STACK.md) - 기술 스택 상세 정보
- [Database Schema](./DATABASE_SCHEMA.md) - 데이터베이스 설계
- [API Endpoints](./API_ENDPOINTS.md) - REST API 명세
- [Development Roadmap](./DEVELOPMENT_ROADMAP.md) - 16-20주 개발 계획
- [Cursor Rules](./.cursorrules) - 코딩 가이드라인

---

## 🗓️ Development Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Week 1-2 | Foundation & Setup |
| Phase 2 | Week 3-4 | Authentication & Users |
| Phase 3 | Week 5-6 | CRM & Contracts |
| Phase 4 | Week 7 | Payments |
| Phase 5 | Week 8-10 | Projects & **Schedule Calendar** |
| Phase 6 | Week 11 | Photographer Management |
| Phase 7 | Week 12-13 | Photo Management & Proof Gallery |
| Phase 8 | Week 14 | Editing Workflow |
| Phase 9 | Week 15 | Delivery & Backup |
| Phase 10 | Week 16 | Client Portal |
| Phase 11 | Week 17 | Notifications |
| Phase 12 | Week 18 | Analytics & Reporting |
| Phase 13 | Week 19 | Testing & QA |
| Phase 14 | Week 20 | Deployment & Launch |

---

## 🏗️ Architecture Principles

1. **Calendar-Centric**: 모든 활동이 중앙 스케줄 캘린더에 매핑
2. **All-in-One Workflow**: 예약 → 촬영 → 편집 → 배송 전체 프로세스 통합
3. **Dual Experience**: 고객용 포털 + 내부 업무 시스템
4. **Mobile-First**: 양쪽 플랫폼 모두 모바일 최적화
5. **Automation**: 반복 작업의 자동화 (알림, 백업, 워크플로우)
6. **Data-Driven**: 분석 및 성과 추적

---

## 🔐 Security

- HTTPS only in production
- JWT-based authentication
- AWS Cognito for user management
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- Regular security audits
- OWASP Top 10 compliance

---

## 📊 Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **API Response Time**: < 500ms (P95)

---

## 🧪 Testing

```bash
# Run unit tests
# npm run test

# Run integration tests
# npm run test:integration

# Run E2E tests
# npm run test:e2e

# Check coverage
# npm run test:coverage
```

---

## 🚢 Deployment

### Development
```bash
# npm run deploy:dev
```

### Staging
```bash
# npm run deploy:staging
```

### Production
```bash
# npm run deploy:prod
```

---

## 🤝 Contributing

This is a private project. If you're part of the development team:

1. Create a feature branch from `develop`
2. Follow the guidelines in `.cursorrules`
3. Write tests for new features
4. Submit a pull request
5. Wait for code review and approval

---

## 📝 License

Proprietary - All rights reserved

---

## 📞 Contact

- **Project Lead**: [Name]
- **Email**: [email@example.com]
- **Slack**: [workspace]

---

## 🗂️ Quick Links

- [API Documentation](http://localhost:3000/api/docs) (when running)
- [Swagger Spec](http://localhost:3000/api/docs-json)
- AWS Console
- Sentry Dashboard
- Analytics Dashboard

---

## 📈 Current Status

**Status**: 🚧 In Planning Phase

- [x] Project Overview Complete
- [x] Tech Stack Defined
- [x] Database Schema Designed
- [x] API Endpoints Designed
- [x] Development Roadmap Created
- [ ] Infrastructure Setup
- [ ] Backend Development
- [ ] Frontend Development
- [ ] Testing
- [ ] Deployment

---

## 🎯 Next Steps

1. Review and approve all planning documents
2. Assemble development team
3. Set up AWS infrastructure
4. Initialize frontend and backend repositories
5. Begin Phase 1: Foundation & Setup

---

**Last Updated**: November 3, 2025

