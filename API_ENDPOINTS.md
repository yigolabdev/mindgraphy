# 🌐 MindGraphy - API Endpoints Design

## Base URLs

- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.mindgraphy.com/api`
- **Production**: `https://api.mindgraphy.com/api`

## API Version: v1

All endpoints are prefixed with `/v1`

---

## Authentication

### Auth Endpoints

```
POST   /v1/auth/register
POST   /v1/auth/login
POST   /v1/auth/logout
POST   /v1/auth/refresh-token
POST   /v1/auth/forgot-password
POST   /v1/auth/reset-password
POST   /v1/auth/verify-email
GET    /v1/auth/me
```

**Example: Login**
```json
POST /v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "photographer"
  }
}
```

---

## Users

### User Management

```
GET    /v1/users
GET    /v1/users/:id
POST   /v1/users
PATCH  /v1/users/:id
DELETE /v1/users/:id
GET    /v1/users/:id/profile
PATCH  /v1/users/:id/profile
PATCH  /v1/users/:id/settings
```

**Query Parameters (GET /v1/users)**
```
?role=photographer
&status=active
&page=1
&limit=20
&sort=createdAt:desc
&search=john
```

---

## Customers (CRM)

### Customer Endpoints

```
GET    /v1/customers
GET    /v1/customers/:id
POST   /v1/customers
PATCH  /v1/customers/:id
DELETE /v1/customers/:id
GET    /v1/customers/:id/contracts
GET    /v1/customers/:id/projects
GET    /v1/customers/:id/addresses
POST   /v1/customers/:id/addresses
PATCH  /v1/customers/:id/addresses/:addressId
DELETE /v1/customers/:id/addresses/:addressId
```

**Example: Create Customer**
```json
POST /v1/customers
{
  "groomName": "홍길동",
  "brideName": "김영희",
  "groomPhone": "010-1234-5678",
  "bridePhone": "010-8765-4321",
  "email": "couple@example.com",
  "sourceChannel": "instagram",
  "leadStatus": "inquiry",
  "assignedManagerId": "manager_uuid",
  "notes": "웨딩홀 미정"
}

Response 201:
{
  "id": "customer_uuid",
  "groomName": "홍길동",
  "brideName": "김영희",
  ...
  "createdAt": "2025-11-03T10:00:00Z"
}
```

---

## Contracts

### Contract Endpoints

```
GET    /v1/contracts
GET    /v1/contracts/:id
POST   /v1/contracts
PATCH  /v1/contracts/:id
DELETE /v1/contracts/:id
POST   /v1/contracts/:id/send
POST   /v1/contracts/:id/sign
GET    /v1/contracts/:id/pdf
POST   /v1/contracts/:id/generate-pdf
GET    /v1/contracts/:id/payments
POST   /v1/contracts/:id/payments
```

**Example: Sign Contract**
```json
POST /v1/contracts/:id/sign
{
  "signatureDataUrl": "data:image/png;base64,...",
  "agreedToTerms": true,
  "signerName": "홍길동",
  "signedAt": "2025-11-03T11:00:00Z"
}

Response 200:
{
  "contractId": "contract_uuid",
  "status": "signed",
  "signedAt": "2025-11-03T11:00:00Z",
  "pdfUrl": "https://s3.../contract-signed.pdf"
}
```

---

## Payments

### Payment Endpoints

```
GET    /v1/payments
GET    /v1/payments/:id
POST   /v1/payments
PATCH  /v1/payments/:id
POST   /v1/payments/:id/refund
POST   /v1/payments/:id/issue-receipt
GET    /v1/payments/:id/receipt
```

---

## Projects

### Project Endpoints

```
GET    /v1/projects
GET    /v1/projects/:id
POST   /v1/projects
PATCH  /v1/projects/:id
DELETE /v1/projects/:id
GET    /v1/projects/:id/timeline
GET    /v1/projects/:id/status-history
PATCH  /v1/projects/:id/status
POST   /v1/projects/:id/assign-photographer
POST   /v1/projects/:id/assign-editor
```

**Query Parameters (GET /v1/projects)**
```
?status=in_progress
&photographerId=photographer_uuid
&weddingDateFrom=2025-11-01
&weddingDateTo=2025-11-30
&page=1
&limit=20
```

**Example: Update Project Status**
```json
PATCH /v1/projects/:id/status
{
  "status": "proof_ready",
  "notes": "프루프 사진 업로드 완료"
}
```

---

## Schedule Calendar

### Calendar Endpoints

```
GET    /v1/calendar/events
GET    /v1/calendar/events/:id
POST   /v1/calendar/events
PATCH  /v1/calendar/events/:id
DELETE /v1/calendar/events/:id
POST   /v1/calendar/events/:id/move
GET    /v1/calendar/availability
GET    /v1/calendar/photographer/:id
GET    /v1/calendar/conflicts
```

**Example: Get Calendar Events**
```json
GET /v1/calendar/events?start=2025-11-01&end=2025-11-30&photographerId=uuid

Response 200:
[
  {
    "id": "event_uuid",
    "title": "홍길동 & 김영희 웨딩촬영",
    "start": "2025-11-15T14:00:00Z",
    "end": "2025-11-15T18:00:00Z",
    "projectId": "project_uuid",
    "photographerId": "photographer_uuid",
    "location": "서울 웨딩홀",
    "status": "confirmed",
    "travelTime": 30
  }
]
```

### Shooting Schedules

```
GET    /v1/schedules
GET    /v1/schedules/:id
POST   /v1/schedules
PATCH  /v1/schedules/:id
DELETE /v1/schedules/:id
POST   /v1/schedules/:id/confirm
POST   /v1/schedules/:id/complete
```

---

## Photographers

### Photographer Endpoints

```
GET    /v1/photographers
GET    /v1/photographers/:id
POST   /v1/photographers
PATCH  /v1/photographers/:id
DELETE /v1/photographers/:id
GET    /v1/photographers/:id/schedule
GET    /v1/photographers/:id/availability
POST   /v1/photographers/:id/availability
PATCH  /v1/photographers/:id/availability/:availabilityId
GET    /v1/photographers/:id/performance
GET    /v1/photographers/:id/projects
```

**Example: Get Photographer Availability**
```json
GET /v1/photographers/:id/availability?date=2025-11-15

Response 200:
{
  "photographerId": "photographer_uuid",
  "date": "2025-11-15",
  "timeSlots": [
    {
      "start": "09:00",
      "end": "12:00",
      "isAvailable": true
    },
    {
      "start": "14:00",
      "end": "18:00",
      "isAvailable": false,
      "reason": "촬영 예정"
    }
  ]
}
```

---

## Photos & Albums

### Photo Management

```
GET    /v1/albums
GET    /v1/albums/:id
POST   /v1/albums
PATCH  /v1/albums/:id
DELETE /v1/albums/:id
GET    /v1/albums/:id/photos
POST   /v1/albums/:id/photos
GET    /v1/photos/:id
PATCH  /v1/photos/:id
DELETE /v1/photos/:id
POST   /v1/photos/:id/select
DELETE /v1/photos/:id/deselect
POST   /v1/photos/:id/comment
```

### Upload Endpoints

```
POST   /v1/upload/presigned-url
POST   /v1/upload/complete
POST   /v1/upload/batch
```

**Example: Get Presigned URL**
```json
POST /v1/upload/presigned-url
{
  "fileName": "IMG_1234.jpg",
  "fileType": "image/jpeg",
  "fileSize": 5242880,
  "albumId": "album_uuid"
}

Response 200:
{
  "uploadUrl": "https://s3.presigned-url...",
  "photoId": "photo_uuid",
  "expiresIn": 3600
}
```

---

## Proof Gallery

### Proof Gallery Endpoints

```
GET    /v1/proof-gallery/:token
GET    /v1/proof-gallery/:token/photos
POST   /v1/proof-gallery/:token/select
DELETE /v1/proof-gallery/:token/select/:photoId
POST   /v1/proof-gallery/:token/comment
POST   /v1/proof-gallery/:token/submit
GET    /v1/proof-gallery/:token/status
```

**Public Endpoint (No Auth Required for Valid Token)**

**Example: Client Photo Selection**
```json
POST /v1/proof-gallery/:token/select
{
  "photoIds": ["photo_uuid_1", "photo_uuid_2", "photo_uuid_3"],
  "selectionOrder": [1, 2, 3],
  "comments": {
    "photo_uuid_1": "이 사진 좋아요!",
    "photo_uuid_2": "보정 부탁드려요"
  }
}

Response 200:
{
  "selectedCount": 3,
  "maxSelections": 50,
  "remaining": 47
}
```

---

## Editing Queue

### Editing Endpoints

```
GET    /v1/editing/queue
GET    /v1/editing/queue/:id
POST   /v1/editing/queue
PATCH  /v1/editing/queue/:id
DELETE /v1/editing/queue/:id
POST   /v1/editing/queue/:id/start
POST   /v1/editing/queue/:id/complete
POST   /v1/editing/queue/:id/request-revision
GET    /v1/editing/my-queue
```

**Example: Get Editing Queue**
```json
GET /v1/editing/queue?status=queued&priority=high

Response 200:
[
  {
    "id": "queue_uuid",
    "projectId": "project_uuid",
    "customerName": "홍길동 & 김영희",
    "photoCount": 150,
    "assignedEditorId": "editor_uuid",
    "priority": "high",
    "dueDate": "2025-11-10T23:59:59Z",
    "status": "queued",
    "createdAt": "2025-11-03T10:00:00Z"
  }
]
```

---

## Deliverables

### Delivery Endpoints

```
GET    /v1/deliverables
GET    /v1/deliverables/:id
POST   /v1/deliverables
PATCH  /v1/deliverables/:id
DELETE /v1/deliverables/:id
POST   /v1/deliverables/:id/generate-link
GET    /v1/deliverables/download/:token
GET    /v1/deliverables/:id/status
```

**Example: Generate Download Link**
```json
POST /v1/deliverables/:id/generate-link
{
  "expiresIn": 604800,  // 7 days in seconds
  "maxDownloads": 5
}

Response 200:
{
  "downloadLink": "https://download.mindgraphy.com/d/unique_token",
  "expiresAt": "2025-11-10T10:00:00Z",
  "maxDownloads": 5
}
```

---

## Backup

### Backup Endpoints

```
GET    /v1/backups
GET    /v1/backups/:id
POST   /v1/backups
PATCH  /v1/backups/:id
POST   /v1/backups/:id/verify
GET    /v1/backups/project/:projectId
```

---

## Notifications

### Notification Endpoints

```
GET    /v1/notifications
GET    /v1/notifications/:id
POST   /v1/notifications
PATCH  /v1/notifications/:id/read
POST   /v1/notifications/send-email
POST   /v1/notifications/send-sms
GET    /v1/notifications/templates
GET    /v1/notifications/templates/:id
POST   /v1/notifications/templates
PATCH  /v1/notifications/templates/:id
```

---

## Analytics & Reports

### Analytics Endpoints

```
GET    /v1/analytics/dashboard
GET    /v1/analytics/conversion-rate
GET    /v1/analytics/delivery-time
GET    /v1/analytics/photographer-performance
GET    /v1/analytics/project-statistics
GET    /v1/analytics/revenue
GET    /v1/analytics/customer-satisfaction
```

**Example: Dashboard Stats**
```json
GET /v1/analytics/dashboard?period=30days

Response 200:
{
  "totalProjects": 45,
  "activeProjects": 12,
  "completedProjects": 30,
  "conversionRate": 68.5,
  "averageDeliveryTime": 14.2,
  "customerSatisfaction": 4.7,
  "revenue": {
    "total": 150000000,
    "deposits": 80000000,
    "balance": 70000000
  }
}
```

---

## Client Portal Endpoints

### Client-Specific Endpoints

```
GET    /v1/client/dashboard
GET    /v1/client/project
GET    /v1/client/contract
GET    /v1/client/proof-gallery
GET    /v1/client/deliverables
GET    /v1/client/payments
POST   /v1/client/update-info
```

**Example: Client Dashboard**
```json
GET /v1/client/dashboard

Response 200:
{
  "customer": {
    "groomName": "홍길동",
    "brideName": "김영희",
    "weddingDate": "2025-12-15"
  },
  "project": {
    "id": "project_uuid",
    "status": "proof_ready",
    "daysUntilWedding": 42,
    "progress": 60
  },
  "contract": {
    "status": "signed",
    "totalAmount": 5000000,
    "paidAmount": 2000000,
    "remainingAmount": 3000000
  },
  "nextActions": [
    {
      "type": "proof_selection",
      "title": "프루프 사진 선택",
      "dueDate": "2025-11-10T23:59:59Z"
    }
  ]
}
```

---

## Webhooks

### Webhook Endpoints

```
POST   /v1/webhooks/payment
POST   /v1/webhooks/s3-upload
POST   /v1/webhooks/notification-status
```

---

## Error Responses

### Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2025-11-03T10:00:00Z",
  "path": "/v1/users"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no response body
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Business logic error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

---

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authenticated**: 500 requests per minute per user
- **Upload**: 20 requests per minute per user

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699012800
```

---

## Pagination

### Standard Pagination

```
GET /v1/projects?page=1&limit=20

Response Headers:
X-Total-Count: 150
X-Total-Pages: 8
X-Current-Page: 1
X-Per-Page: 20

Response Body:
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## Filtering & Sorting

### Filter Examples

```
GET /v1/projects?status=in_progress,editing
GET /v1/projects?weddingDate[gte]=2025-11-01&weddingDate[lte]=2025-11-30
GET /v1/projects?photographer.id=photographer_uuid
```

### Sort Examples

```
GET /v1/projects?sort=weddingDate:asc
GET /v1/projects?sort=-createdAt  (descending)
GET /v1/projects?sort=status:asc,weddingDate:desc
```

---

## API Documentation

- **Swagger UI**: Available at `/api/docs`
- **OpenAPI Spec**: Available at `/api/docs-json`
- **Postman Collection**: Export available

---

## Security

- All endpoints require HTTPS in production
- JWT-based authentication
- API key for webhook endpoints
- Request signing for sensitive operations
- CORS configuration for allowed origins
- Input validation and sanitization
- SQL injection prevention
- XSS protection

