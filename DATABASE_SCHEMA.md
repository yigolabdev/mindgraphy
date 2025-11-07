# 🗄️ MindGraphy - Database Schema Design

## Overview

- **Primary Database**: PostgreSQL (AWS RDS)
- **Secondary Database**: DynamoDB (high-frequency data)
- **ORM**: Prisma (recommended) or TypeORM

---

## PostgreSQL Schema

### 1. Users & Authentication

#### `users`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
email             VARCHAR(255) UNIQUE NOT NULL
phone             VARCHAR(20)
password_hash     VARCHAR(255)
cognito_user_id   VARCHAR(255) UNIQUE
role              ENUM('admin', 'manager', 'photographer', 'editor', 'client')
status            ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
last_login_at     TIMESTAMP
```

#### `user_profiles`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id           UUID REFERENCES users(id) ON DELETE CASCADE
first_name        VARCHAR(100)
last_name         VARCHAR(100)
avatar_url        TEXT
preferences       JSONB
notification_settings JSONB
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

---

### 2. Customers & CRM

#### `customers`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id           UUID REFERENCES users(id) ON DELETE SET NULL
groom_name        VARCHAR(100) NOT NULL
bride_name        VARCHAR(100) NOT NULL
groom_phone       VARCHAR(20)
bride_phone       VARCHAR(20)
email             VARCHAR(255)
source_channel    VARCHAR(100) -- 유입 경로
lead_status       ENUM('inquiry', 'consultation', 'proposal', 'contracted', 'completed', 'cancelled')
assigned_manager_id UUID REFERENCES users(id)
notes             TEXT
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

#### `customer_addresses`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
customer_id       UUID REFERENCES customers(id) ON DELETE CASCADE
address_type      ENUM('home', 'delivery', 'wedding_venue')
postal_code       VARCHAR(20)
address_line1     VARCHAR(255)
address_line2     VARCHAR(255)
city              VARCHAR(100)
state             VARCHAR(100)
country           VARCHAR(100) DEFAULT 'South Korea'
is_primary        BOOLEAN DEFAULT false
created_at        TIMESTAMP DEFAULT NOW()
```

---

### 3. Contracts

#### `contracts`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
contract_number   VARCHAR(50) UNIQUE NOT NULL
customer_id       UUID REFERENCES customers(id) ON DELETE CASCADE
package_type      VARCHAR(100)
total_amount      DECIMAL(10, 2) NOT NULL
deposit_amount    DECIMAL(10, 2)
balance_amount    DECIMAL(10, 2)
contract_status   ENUM('draft', 'sent', 'signed', 'active', 'completed', 'cancelled')
contract_date     DATE
signed_at         TIMESTAMP
signed_by_client  BOOLEAN DEFAULT false
signature_url     TEXT
terms             TEXT
pdf_url           TEXT
refund_policy     JSONB
penalty_terms     JSONB
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

#### `payments`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
contract_id       UUID REFERENCES contracts(id) ON DELETE CASCADE
payment_type      ENUM('deposit', 'balance', 'additional', 'refund')
amount            DECIMAL(10, 2) NOT NULL
payment_method    VARCHAR(50)
payment_status    ENUM('pending', 'completed', 'failed', 'refunded')
payment_date      TIMESTAMP
transaction_id    VARCHAR(255)
receipt_url       TEXT
cash_receipt_issued BOOLEAN DEFAULT false
notes             TEXT
created_at        TIMESTAMP DEFAULT NOW()
```

---

### 4. Projects & Shooting Schedule

#### `projects`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_number    VARCHAR(50) UNIQUE NOT NULL
customer_id       UUID REFERENCES customers(id) ON DELETE CASCADE
contract_id       UUID REFERENCES contracts(id) ON DELETE SET NULL
project_type      ENUM('wedding', 'studio', 'outdoor', 'pre_wedding', 'family')
project_status    ENUM('scheduled', 'in_progress', 'proof_ready', 'editing', 'completed', 'delivered', 'archived')
wedding_date      DATE NOT NULL
wedding_venue     VARCHAR(255)
wedding_time      TIME
makeup_info       TEXT
special_requests  TEXT
assigned_photographer_id UUID REFERENCES users(id)
assigned_editor_id UUID REFERENCES users(id)
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

#### `shooting_schedules`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
schedule_type     ENUM('main_shoot', 'pre_wedding', 'makeup', 'ceremony', 'reception')
start_time        TIMESTAMP NOT NULL
end_time          TIMESTAMP NOT NULL
location          VARCHAR(255)
location_address  TEXT
travel_time_minutes INT
photographer_id   UUID REFERENCES users(id)
assistant_ids     UUID[] -- Array of user IDs
equipment_notes   TEXT
status            ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')
notes             TEXT
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

---

### 5. Photographer Management

#### `photographers`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id           UUID REFERENCES users(id) ON DELETE CASCADE
portfolio_url     TEXT
experience_years  INT
specialties       TEXT[]
rating            DECIMAL(3, 2)
total_projects    INT DEFAULT 0
equipment_owned   JSONB
availability_status ENUM('available', 'busy', 'on_leave')
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

#### `photographer_availability`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
photographer_id   UUID REFERENCES photographers(id) ON DELETE CASCADE
date              DATE NOT NULL
time_slot_start   TIME
time_slot_end     TIME
is_available      BOOLEAN DEFAULT true
reason            VARCHAR(255) -- 휴가, 개인 일정 등
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
UNIQUE(photographer_id, date, time_slot_start)
```

#### `photographer_performance`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
photographer_id   UUID REFERENCES photographers(id) ON DELETE CASCADE
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
client_rating     INT CHECK (client_rating >= 1 AND client_rating <= 5)
on_time           BOOLEAN
professionalism_score INT
photos_delivered  INT
retake_required   BOOLEAN
feedback          TEXT
created_at        TIMESTAMP DEFAULT NOW()
```

---

### 6. Photo Management

#### `photo_albums`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
album_type        ENUM('raw', 'proof', 'edited', 'final', 'backup')
storage_location  VARCHAR(255) -- S3 bucket path
total_photos      INT DEFAULT 0
total_size_bytes  BIGINT
upload_status     ENUM('pending', 'uploading', 'completed', 'failed')
uploaded_by       UUID REFERENCES users(id)
uploaded_at       TIMESTAMP
created_at        TIMESTAMP DEFAULT NOW()
```

#### `photos`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
album_id          UUID REFERENCES photo_albums(id) ON DELETE CASCADE
file_name         VARCHAR(255) NOT NULL
file_path         TEXT NOT NULL -- S3 URL
thumbnail_path    TEXT
file_size_bytes   BIGINT
width             INT
height            INT
format            VARCHAR(10)
metadata          JSONB -- EXIF data
is_selected       BOOLEAN DEFAULT false -- Client selection
selection_order   INT
client_comments   TEXT
edit_status       ENUM('pending', 'in_progress', 'completed', 'approved')
edited_version_id UUID REFERENCES photos(id)
created_at        TIMESTAMP DEFAULT NOW()
```

#### `proof_gallery_sessions`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
album_id          UUID REFERENCES photo_albums(id) ON DELETE CASCADE
access_token      VARCHAR(255) UNIQUE NOT NULL
expires_at        TIMESTAMP NOT NULL
max_selections    INT
current_selections INT DEFAULT 0
client_viewed_at  TIMESTAMP
selection_completed_at TIMESTAMP
status            ENUM('pending', 'active', 'completed', 'expired')
created_at        TIMESTAMP DEFAULT NOW()
```

---

### 7. Editing & Retouching

#### `editing_queue`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
photo_ids         UUID[] -- Array of photo IDs to edit
assigned_editor_id UUID REFERENCES users(id)
priority          ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal'
editing_type      VARCHAR(100) -- color correction, retouching, etc.
due_date          TIMESTAMP
started_at        TIMESTAMP
completed_at      TIMESTAMP
status            ENUM('queued', 'in_progress', 'review', 'completed', 'revision')
revision_count    INT DEFAULT 0
notes             TEXT
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

---

### 8. Delivery & Backup

#### `deliverables`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
delivery_type     ENUM('digital_download', 'usb', 'album', 'cloud_link')
storage_path      TEXT -- S3 path or physical location
download_link     TEXT
download_token    VARCHAR(255) UNIQUE
expires_at        TIMESTAMP
download_count    INT DEFAULT 0
max_downloads     INT
delivered_at      TIMESTAMP
delivery_status   ENUM('preparing', 'ready', 'delivered', 'expired')
recipient_name    VARCHAR(255)
shipping_address  TEXT
tracking_number   VARCHAR(100)
created_at        TIMESTAMP DEFAULT NOW()
```

#### `backup_records`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
backup_type       ENUM('ssd', 'hdd', 'nas', 'glacier')
storage_location  VARCHAR(255)
backup_path       TEXT
backup_size_bytes BIGINT
backup_date       TIMESTAMP NOT NULL
verification_status ENUM('pending', 'verified', 'failed')
verified_at       TIMESTAMP
retention_until   DATE
notes             TEXT
created_at        TIMESTAMP DEFAULT NOW()
```

---

### 9. Notifications & Communication

#### `notifications`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
recipient_id      UUID REFERENCES users(id) ON DELETE CASCADE
notification_type ENUM('email', 'sms', 'push', 'in_app')
channel           VARCHAR(50) -- 'ses', 'sns', etc.
subject           VARCHAR(255)
message           TEXT
template_id       VARCHAR(100)
template_data     JSONB
sent_at           TIMESTAMP
delivery_status   ENUM('pending', 'sent', 'delivered', 'failed', 'bounced')
opened_at         TIMESTAMP
clicked_at        TIMESTAMP
error_message     TEXT
created_at        TIMESTAMP DEFAULT NOW()
```

#### `email_templates`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
template_name     VARCHAR(100) UNIQUE NOT NULL
subject           VARCHAR(255)
body_html         TEXT
body_text         TEXT
variables         JSONB -- Available template variables
category          VARCHAR(50)
is_active         BOOLEAN DEFAULT true
created_at        TIMESTAMP DEFAULT NOW()
updated_at        TIMESTAMP DEFAULT NOW()
```

---

### 10. Analytics & Reporting

#### `project_milestones`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
milestone_type    VARCHAR(100) -- 'contract_signed', 'shooting_completed', etc.
milestone_date    TIMESTAMP NOT NULL
target_date       TIMESTAMP
is_on_time        BOOLEAN
notes             TEXT
created_at        TIMESTAMP DEFAULT NOW()
```

#### `satisfaction_surveys`
```sql
id                UUID PRIMARY KEY DEFAULT uuid_generate_v4()
project_id        UUID REFERENCES projects(id) ON DELETE CASCADE
customer_id       UUID REFERENCES customers(id) ON DELETE CASCADE
overall_rating    INT CHECK (overall_rating >= 1 AND overall_rating <= 5)
photographer_rating INT
editing_quality_rating INT
communication_rating INT
value_rating      INT
would_recommend   BOOLEAN
testimonial       TEXT
improvement_suggestions TEXT
submitted_at      TIMESTAMP DEFAULT NOW()
```

---

## DynamoDB Tables

### 1. Real-time Events
```
Partition Key: event_id (String)
Sort Key: timestamp (Number)

Attributes:
- event_type (String)
- user_id (String)
- resource_id (String)
- resource_type (String)
- action (String)
- metadata (Map)
- ttl (Number) -- Auto-expiration
```

### 2. Session Data
```
Partition Key: session_id (String)
Sort Key: created_at (Number)

Attributes:
- user_id (String)
- user_role (String)
- ip_address (String)
- user_agent (String)
- last_activity (Number)
- ttl (Number)
```

### 3. Task Queue
```
Partition Key: queue_name (String)
Sort Key: task_id (String)

Attributes:
- priority (Number)
- task_type (String)
- payload (Map)
- status (String)
- retry_count (Number)
- created_at (Number)
- ttl (Number)
```

---

## Indexes

### PostgreSQL Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_cognito_id ON users(cognito_user_id);

-- Customers
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_lead_status ON customers(lead_status);
CREATE INDEX idx_customers_assigned_manager ON customers(assigned_manager_id);

-- Projects
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(project_status);
CREATE INDEX idx_projects_wedding_date ON projects(wedding_date);
CREATE INDEX idx_projects_photographer ON projects(assigned_photographer_id);

-- Shooting Schedules
CREATE INDEX idx_schedules_project ON shooting_schedules(project_id);
CREATE INDEX idx_schedules_photographer ON shooting_schedules(photographer_id);
CREATE INDEX idx_schedules_time ON shooting_schedules(start_time, end_time);
CREATE INDEX idx_schedules_status ON shooting_schedules(status);

-- Photos
CREATE INDEX idx_photos_album ON photos(album_id);
CREATE INDEX idx_photos_selected ON photos(is_selected);
CREATE INDEX idx_photos_edit_status ON photos(edit_status);

-- Notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_status ON notifications(delivery_status);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);
```

---

## Data Relationships

```
users (1) ─────< (N) customers (assigned_manager)
users (1) ─────< (N) projects (assigned_photographer)
users (1) ─────< (N) projects (assigned_editor)
customers (1) ─< (N) contracts
customers (1) ─< (N) projects
contracts (1) ─< (N) payments
projects (1) ──< (N) shooting_schedules
projects (1) ──< (N) photo_albums
projects (1) ──< (N) editing_queue
projects (1) ──< (N) deliverables
projects (1) ──< (N) backup_records
photo_albums (1) < (N) photos
projects (1) ──< (N) proof_gallery_sessions
photographers (1) < (N) photographer_availability
photographers (1) < (N) photographer_performance
```

---

## Prisma Schema Example

```prisma
// This is a conceptual example - full schema to be implemented

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  admin
  manager
  photographer
  editor
  client
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String?
  cognitoUserId  String?  @unique
  role           UserRole
  status         String   @default("active")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  profile        UserProfile?
  assignedCustomers Customer[] @relation("AssignedManager")
  assignedProjects  Project[] @relation("AssignedPhotographer")
  
  @@map("users")
}

model Customer {
  id              String   @id @default(uuid())
  groomName       String
  brideName       String
  email           String?
  leadStatus      String
  assignedManagerId String?
  assignedManager   User?    @relation("AssignedManager", fields: [assignedManagerId], references: [id])
  
  projects        Project[]
  contracts       Contract[]
  
  @@map("customers")
}

// ... more models
```

---

## Migration Strategy

1. **Initial Setup**: Create all tables with constraints
2. **Seed Data**: Insert default roles, email templates, settings
3. **Indexes**: Create performance indexes
4. **Test Data**: Generate sample data for development
5. **Backup**: Set up automated backup schedules

---

## Data Retention Policy

- **Active Projects**: Full data retention
- **Completed Projects**: 3 years in primary DB
- **Archived Projects**: Migrate to Glacier after 3 years
- **Backup Photos**: Retain on NAS for 5 years
- **Session Data**: 30 days TTL in DynamoDB
- **Event Logs**: 90 days in DynamoDB
- **Notifications**: 1 year in PostgreSQL

