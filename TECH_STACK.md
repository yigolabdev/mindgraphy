# 🛠️ MindGraphy - Technology Stack

## Frontend Stack

### Core Framework
- **React 18+**: UI 라이브러리
- **Next.js 14+**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성

### UI & Styling
- **TailwindCSS**: 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 컴포넌트 라이브러리
- **Radix UI**: 접근성 있는 헤드리스 컴포넌트
- **Lucide React**: 아이콘 라이브러리

### Calendar & Scheduling
- **FullCalendar**: 스케줄링 캘린더 라이브러리
- **React DnD** 또는 **dnd-kit**: 드래그 앤 드롭 기능

### State Management
- **React Query (TanStack Query)**: 서버 상태 관리
- **Zustand** 또는 **Jotai**: 클라이언트 상태 관리

### Form Management
- **React Hook Form**: 폼 상태 관리
- **Zod**: 스키마 검증

### Data Visualization
- **Recharts** 또는 **Chart.js**: 분석 대시보드 차트

### File Upload
- **React Dropzone**: 파일 드래그 앤 드롭 업로드
- **AWS S3 SDK**: 직접 업로드

---

## Backend Stack

### Core Framework
- **Nest.js**: Node.js 프레임워크
- **TypeScript**: 타입 안정성

### API & Communication
- **REST API**: HTTP 기반 통신
- **GraphQL** (Optional): 복잡한 쿼리용
- **Socket.io** (Optional): 실시간 알림

### Authentication & Authorization
- **AWS Cognito**: 사용자 인증
- **JWT**: 토큰 기반 인증
- **Passport.js**: Nest.js 인증 미들웨어

### Validation & Documentation
- **class-validator**: DTO 검증
- **class-transformer**: 데이터 변환
- **Swagger (OpenAPI)**: API 문서화

### Task Scheduling
- **@nestjs/schedule**: Cron 작업
- **Bull** + **Redis**: 작업 큐 관리

---

## Database Stack

### Primary Database
- **PostgreSQL** (AWS RDS)
  - 관계형 데이터 (사용자, 계약, 예약, 프로젝트)
  - ACID 트랜잭션 보장

### ORM
- **Prisma** 또는 **TypeORM**
  - 타입 안전 데이터베이스 액세스
  - 마이그레이션 관리

### High-Frequency Data
- **DynamoDB**
  - 큐 관리
  - 세션 데이터
  - 실시간 이벤트 로그

### Caching
- **Redis** (AWS ElastiCache)
  - 세션 캐싱
  - 작업 큐
  - 실시간 데이터 캐싱

---

## Storage & CDN

### File Storage
- **AWS S3**
  - 사진 원본 및 편집본
  - 계약서 PDF
  - 프루프 갤러리 이미지

### Long-term Archive
- **AWS Glacier**
  - 장기 백업 (SSD → HDD → NAS → Glacier)

### Content Delivery
- **AWS CloudFront**
  - 전역 CDN
  - 이미지 및 정적 파일 배포
  - 엣지 캐싱

---

## Infrastructure (AWS)

### Compute
- **AWS ECS Fargate**
  - 컨테이너 오케스트레이션
  - 서버리스 컨테이너 실행
- **AWS Lambda** (Optional)
  - 이벤트 기반 함수 (이미지 리사이징 등)

### Load Balancing
- **AWS Application Load Balancer (ALB)**
  - HTTP/HTTPS 트래픽 분산
  - 헬스 체크

### Networking
- **AWS VPC**
  - 격리된 네트워크 환경
- **AWS Route 53**
  - DNS 관리

### Security
- **AWS WAF**: 웹 애플리케이션 방화벽
- **AWS Shield**: DDoS 보호
- **AWS Secrets Manager**: 민감한 정보 관리
- **AWS IAM**: 액세스 제어

---

## Messaging & Notifications

### Email
- **AWS SES (Simple Email Service)**
  - 계약서 발송
  - 진행 상황 알림
  - 프루프 준비 알림

### SMS
- **AWS SNS (Simple Notification Service)**
  - 긴급 알림
- **AWS Pinpoint** (Optional)
  - 마케팅 메시지

### Queue & Async Processing
- **AWS SQS (Simple Queue Service)**
  - 비동기 작업 큐
  - 이미지 처리 큐

---

## Automation & Scheduling

### Event-driven Automation
- **AWS EventBridge**
  - 타임 기반 알림
  - 배송 마감일 리마인더
  - 자동 백업 트리거

### Workflow Orchestration
- **AWS Step Functions** (Optional)
  - 복잡한 워크플로우 오케스트레이션

---

## Monitoring & Observability

### Logging & Monitoring
- **AWS CloudWatch**
  - 로그 수집
  - 메트릭 모니터링
  - 알람 설정

### Audit & Compliance
- **AWS CloudTrail**
  - API 호출 감사
  - 보안 이벤트 추적

### Distributed Tracing
- **AWS X-Ray**
  - 분산 추적
  - 성능 병목 지점 식별

### Error Tracking
- **Sentry** (Optional)
  - 프론트엔드/백엔드 에러 추적
  - 실시간 에러 알림

---

## Development & DevOps

### Version Control
- **Git**
- **GitHub** 또는 **GitLab**

### CI/CD
- **GitHub Actions** 또는 **AWS CodePipeline**
  - 자동 테스트
  - 자동 배포

### Containerization
- **Docker**
  - 일관된 개발/배포 환경
  - **Docker Compose**: 로컬 개발

### Infrastructure as Code
- **AWS CDK** 또는 **Terraform**
  - 인프라 코드화
  - 버전 관리

### Testing
- **Jest**: 단위 테스트
- **React Testing Library**: 컴포넌트 테스트
- **Cypress** 또는 **Playwright**: E2E 테스트

---

## Development Tools

### Code Quality
- **ESLint**: 코드 린팅
- **Prettier**: 코드 포맷팅
- **Husky**: Git 훅 관리

### API Testing
- **Postman** 또는 **Insomnia**
- **Thunder Client** (VS Code)

### Database Management
- **Prisma Studio**: 데이터베이스 GUI
- **DBeaver** 또는 **pgAdmin**: PostgreSQL 관리

---

## Browser & Device Support

### Browsers
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### Devices
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (375px+)
- iOS Safari
- Android Chrome

---

## Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time**: < 500ms (P95)

---

## Security Standards

- HTTPS only
- OWASP Top 10 준수
- GDPR 및 개인정보보호법 준수
- 정기적인 보안 감사
- 암호화된 데이터 저장 및 전송

