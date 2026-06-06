# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

This repository is **empty** — no source code, build configuration, dependency manifest, or version control history exists yet (as of 2026-06-06). The sections below are placeholders to be filled in as the project takes shape. Treat any instruction here as provisional until real code backs it up.

When code is added, re-run `/init` (or update this file directly) so the guidance below reflects the actual stack, commands, and architecture rather than placeholders.

## Project intent

"School Management" — a school management application. Scope, technology stack, and architecture are not yet decided. Do not assume a stack (language, framework, database) until a dependency manifest or source files establish one; ask before scaffolding.

## Commands

_None yet — no build system, package manager, or test runner is configured._

Once tooling exists, record here the exact commands for:
- Install dependencies
- Build / run the app locally
- Run the full test suite, and run a single test
- Lint / format / type-check

## Architecture

_None yet — no source files exist._

Once there is code, document the big-picture structure here: the major modules and how they interact, where the domain logic for school management lives (e.g. students, staff, enrollment, scheduling, grading), and any cross-cutting concerns (auth, persistence, configuration) that span multiple files.

## Notes for the next session

- This is not a git repository yet. Initialize version control before substantial work, and confirm with the user before the first commit.
- The working directory path contains spaces (`D:\Project Explore\School Management`) — quote paths in shell commands.
# Build a School Management System (SMS) - MVP Phase

## Project Overview
Create a scalable School Management System with Next.js (frontend + backend API), Node.js/Express (microservices), PostgreSQL (database), Redis (cache), and Flutter (mobile app). This is Phase 1 (MVP) focusing on core functionality.

## Technology Stack Requirements
- **Frontend**: Next.js 14+ with App Router, TypeScript, React Server Components, Tailwind CSS
- **Backend API**: Node.js + Express.js + TypeScript (RESTful API, modular architecture)
- **Database**: PostgreSQL 15+ with Prisma ORM (type-safe queries)
- **Cache**: Redis 7+ (session management, rate limiting, data caching)
- **Mobile**: Flutter 3+ with Dart (iOS & Android)
- **Authentication**: JWT tokens with bcrypt (12 rounds) password hashing
- **Real-time**: Socket.io for live attendance dashboard
- **Containerization**: Docker + Docker Compose
- **Testing**: Jest (backend), Next.js Testing (frontend), integration tests
- **API Docs**: Swagger/OpenAPI auto-generated documentation

## MVP Features to Implement (Phase 1)

### 1. Authentication & RBAC
- User registration/login with JWT (15min access token + refresh token)
- Role-based access control: Admin, Teacher, Student, Parent
- Multi-Factor Authentication (MFA) for admin role
- Session management stored in Redis
- Password reset via email (SMTP integration)
- Middleware guards: authenticate() and requireRole([...roles])
- Logout with token blacklisting in Redis
- Audit logging for all auth events

### 2. Student Management
- Student registration with fields: firstName, lastName, studentId, email, dateOfBirth, gender, address, phone
- Guardian information: guardianName, guardianPhone, guardianEmail, guardianAddress
- Medical history (optional): allergies, conditions, medications
- Student profile CRUD operations (create, read, update, delete)
- Course/class enrollment per academic session
- Student search with pagination (page, limit) and filters (search, status, classId)
- Bulk student import via CSV upload
- Student status tracking: active, graduated, suspended, transferred
- Unique student ID generation (auto-increment with prefix)
- Soft delete for students (preserve data history)

### 3. Attendance Management
- Daily attendance marking per class: present, absent, late, excused
- Attendance record fields: studentId, classId, date, status, markedBy (teacherId), notes
- QR code attendance scanning (generate unique QR per student)
- Real-time attendance dashboard using WebSocket (Socket.io)
- Attendance reports: daily, weekly, monthly with export to PDF/Excel
- Auto notifications to parents via SMS/email when student is absent
- Staff/teacher attendance tracking (separate from student attendance)
- Attendance analytics: attendance rate per student, class, month
- Late mark threshold (e.g., after 15 minutes = late)
- Attendance history with date range filtering

### 4. Grade Management
- Grade book for different assessment types: assignment, quiz, project, exam, midterm, final
- Grade entry fields: studentId, courseId, assessmentType, score, maxScore, weight, submittedDate
- Auto-calculate weighted averages (e.g., 30% homework + 70% exam)
- Grade scale configuration (e.g., A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: 0-59)
- Auto-convert scores to letter grades based on scale
- Report card generation as PDF with student info, grades, teacher comments
- Exam scheduling: examId, courseId, date, time, duration, location
- Teacher result entry portal with bulk grade entry
- Parent grade portal: real-time grade viewing for their child
- Grade history across all semesters/academic years
- Class performance analytics: average, median, pass rate, distribution chart
- Flag students at risk (below 60%) or excellent performers (above 90%)

### 5. Fee Management
- Fee structure setup: feeType (tuition, admission, exam, transport, library), amount, frequency (monthly, quarterly, yearly), dueDate
- Fee collection with payment tracking: paymentId, studentId, feeId, amount, paymentMethod (cash, online, bank), paymentDate, transactionId
- Online payment gateway integration ready (accept Stripe/PayPal API structure)
- Auto invoice generation per student per fee type
- Payment reminder notifications (SMS/email) 3 days before due date
- Fee history per student with all payments and balances
- Financial reports: total income, expenses, revenue by fee type, monthly trends
- Overdue payment tracking with days overdue calculation
- Scholarship management: scholarshipId, studentId, percentage, reason, startDate, endDate
- Debt management: flag overdue payments, generate dunning letters
- Partial payment support with balance tracking

### 6. Admin Dashboard
- Overview metrics cards: total students, total teachers, today's attendance rate, pending fees, overdue fees
- Real-time analytics charts: attendance trends (line chart), fee collection (bar chart), grade distribution (pie chart)
- Recent activity log: recent enrollments, attendance marks, grade entries, fee payments
- Quick stats: students by gender, students by class, average attendance rate, total revenue this month
- Custom report builder with filters (date range, class, student, fee type)
- Export reports to PDF, Excel, CSV
- Notification center: pending tasks, alerts, reminders
- System health monitor: database connection, Redis status, API response time

## Database Schema Requirements (PostgreSQL with Prisma)

Create these tables with proper relationships:
- users (id, email, password, role, firstName, lastName, isActive, createdAt, updatedAt)
- students (id, studentId,斯特firstName, lastName, dateOfBirth, gender, address, phone, email, status, guardianId, createdAt, updatedAt)
- guardians (id, firstName, lastName, phone, email, address, createdAt, updatedAt)
- attendance (id, studentId, classId, date, status, markedBy, notes, createdAt)
- staff_attendance (id, staffId, date, status, notes, createdAt)
- grades (id, studentId, courseId, assessmentType, score, maxScore, weight, submittedDate, letterGrade, createdAt)
- exams (id, courseId, title, date, time, duration, location, maxScore, createdAt)
- courses (id, code, name, description, creditHours, teacherId, createdAt)
- classes (id, name, grade_level, capacity, teacherId, academicYear, createdAt)
- enrollments (id, studentId, classId, courseId, academicYear, status, createdAt)
- fees (id, feeType, amount, frequency, dueDate, description, isActive, createdAt)
- fee_payments (id, studentId, feeId, amountPaid, paymentMethod, paymentDate, transactionId, status, createdAt)
- scholarships (id, studentId, percentage, reason, startDate, endDate, createdAt)
- notifications (id, userId, type, title, message, isRead, createdAt)
- audit_logs (id, userId, action, entity, entityId, timestamp, details)

Index requirements:
- Index on students.studentId (unique)
- Index on users.email (unique)
- Index on attendance(studentId, date)
- Index on grades(studentId, courseId)
- Index on fee_payments(studentId, paymentDate)
- Foreign keys with proper constraints

## API Design Requirements

RESTful API structure:
- Base URL: /api/v1
- Authentication endpoints: /api/v1/auth/register, /login, /refresh, /logout, /forgot-password, /reset-password
- Student endpoints: /api/v1/students (GET, POST, PATCH, DELETE), /api/v1/students/:id
- Attendance endpoints: /api/v1/attendance (GET, POST), /api/v1/attendance/class/:classId/date/:date
- Grade endpoints: /api/v1/grades (GET, POST), /api/v1/grades/student/:studentId, /api/v1/grades/course/:courseId
- Fee endpoints: /api/v1/fees (GET, POST), /api/v1/fees/student/:studentId, /api/v1/fees/payments
- Dashboard endpoints: /api/v1/dashboard/overview, /api/v1/dashboard/analytics

Response format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2026-06-06T08:00:00Z"
}
```

Error format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-06-06T08:00:00Z"
}
```

## Redis Cache Strategy

Cache keys and TTL:
- Session: session:{userId} → JWT token, TTL: 15 minutes
- Refresh token: refresh:{token} → userId, TTL: 7 days
- Student data: student:{studentId} → student object, TTL: 1 hour
- Attendance today: attendance:{classId}:{date} → attendance array, TTL: 24 hours
- Dashboard stats: dashboard:overview → stats object, TTL: 5 minutes
- Rate limiting: rate:{ipAddress} → request count, TTL: 1 minute

## Flutter Mobile App Requirements

Screens to build:
- Login screen with email/password
- Student dashboard with quick stats
- Student profile view
- Attendance QR code scanner
- Attendance history with calendar
- Grade viewer with charts (use fl_chart package)
- Fee list with payment status
- Fee payment screen with payment method selection
- Messages/chat screen
- Push notification handler
- Offline mode with local SQLite caching

Flutter packages to use:
- http for API calls
- flutter_secure_storage for token storage
- provider or riverpod for state management
- flutter_socketio_client for WebSocket
- fl_chart for charts
- image_picker for QR scanning
- qr_flutter for QR generation
- intl for date formatting

## Project Structure Requirements

Create this folder structure:

school-management-system/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── models/
│ │ ├── validators/
│ │ ├── utils/
│ │ ├── types/
│ │ ├── database/
│ │ ├── websocket/
│ │ ├── tests/
│ │ ├── app.ts
│ │ └── index.ts
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ ├── tsconfig.json
│ ├── jest.config.ts
│ ├── docker-compose.yml
│ ├── Dockerfile
│ └── README.md
│
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ ├── components/
│ │ ├── services/
│ │ ├── hooks/
│ │ ├── store/
│ │ ├── utils/
│ │ ├── types/
│ │ ├── styles/
│ │ └── tests/
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ ├── tsconfig.json
│ ├── next.config.js
│ ├── tailwind.config.js
│ ├── docker-compose.yml
│ ├── Dockerfile
│ └── README.md
│
├── mobile/
│ ├── lib/
│ │ ├── main.dart
│ │ ├── app.dart
│ │ ├── config/
│ │ ├── models/
│ │ ├── services/
│ │ ├── providers/
│ │ ├── screens/
│ │ ├── widgets/
│ │ ├── utils/
│ │ ├── routes/
│ │ └── tests/
│ ├── android/
│ ├── ios/
│ ├── pubspec.yaml
│ ├── .env
│ └── README.md
│
├── database/
│ ├── migrations/
│ ├── prisma.schema.ts
│ └── seed.ts
│
├── docker/
│ ├── docker-compose.yml
│ └── Dockerfile
│
├── docs/
│ ├── API_DOCUMENTATION.md
│ ├── ARCHITECTURE.md
│ └── SETUP_GUIDE.md
│
├── .gitignore
├── README.md
└── package.json


## Coding Style Requirements

### Backend (Node.js/Express/TypeScript)
- Use camelCase for variables and functions
- Use PascalCase for classes, interfaces, types
- Use snake_case for file names (student.controller.ts)
- Use UPPER_CASE for constants (MAX_RETRY = 3)
- Prefix booleans with is/has/can (isActive, hasPermission)
- Use verb+noun pattern for functions (createStudent, getStudentById)
- Async functions should return Promise<Type>
- Use ES6 imports/exports
- Add TypeScript types for all function parameters and returns
- Use Zod for input validation
- Implement centralized error handling
- Add logging with Winston
- Write unit tests with Jest (80%+ coverage)

### Frontend (Next.js/React/TypeScript)
- Use Functional Components with TypeScript
- Use camelCase for variables, PascalCase for components
- Use snake_case for file names (student-list.tsx)
- 'use client' directive for client-side components
- Use React hooks (useState, useEffect, useContext)
- Create custom hooks for API calls
- Use Zustand or Context for state management
- Tailwind CSS for styling (no custom CSS files)
- Server Components for data fetching where possible
- Client Components for interactive UI
- Add PropTypes or TypeScript types for all props
- Implement error handling and loading states
- Write tests with React Testing Library

### Flutter (Dart)
- Use camelCase for variables and functions
- Use PascalCase for classes, models, widgets
- Use snake_case for file names (student_model.dart)
- Use UPPER_CASE for constants
- Use @JsonSerializable for models
- Implement proper error handling
- Use async/await for API calls
- Add typedef for callback functions
- Use Flutter Provider/Riverpod for state management
- Follow Flutter widget tree best practices
- Add comments for complex logic
- Write widget tests

## Security Requirements
- JWT with short expiration (15min) + refresh tokens (7 days)
- bcrypt password hashing (12 rounds)
- HTTPS everywhere (configure in production)
- CORS configuration (allow specific origins)
- SQL injection prevention (Prisma ORM)
- XSS protection (helmet package)
- Rate limiting (100 requests/minute per IP)
- Role-based middleware guards
- Input validation on all endpoints
- Sanitize user inputs
- Audit logging for sensitive operations
- Environment variables for secrets (never hardcode)

## Performance Requirements
- API response time < 200ms for cached queries
- Support 10,000+ concurrent users
- Database query optimization with indexes
- Redis cache for session data and frequently accessed records
- Pagination for large datasets (default 20 items per page)
- Lazy loading for dashboard charts
- Connection pooling for PostgreSQL
- Optimize bundle size for frontend

## Testing Requirements
- Backend: Jest with 80%+ test coverage
- Frontend: React Testing Library + Vitest
- Mobile: Flutter widget tests
- Integration tests for critical APIs
- API endpoint tests with mock data
- Database migration tests
- Load testing for performance validation

## Deliverables Checklist
✅ Backend API with all 6 modules (auth, students, attendance, grades, fees, dashboard)
✅ Frontend Web App (Next.js) with admin/teacher/student/parent portals
✅ Mobile App (Flutter) for students/parents
✅ PostgreSQL database schema with Prisma
✅ Redis cache implementation
✅ Docker configuration for all services
✅ Swagger API documentation
✅ Jest test suite
✅ Setup and deployment guide
✅ Environment variable examples

## Timeline
- Week 1-2: Project setup, database schema, authentication
- Week 3-4: Student Management + Attendance Management
- Week 5-6: Grade Management + Fee Management
- Week 7-8: Admin Dashboard + Flutter mobile app
- Week 9-10: Testing, documentation, deployment

Start by creating the project structure, then implement backend API endpoints, followed by frontend components, and finally the Flutter mobile app. Provide step-by-step code for each module.

school-management-system/
├── backend/                           # Node.js + Express API
│   ├── src/
│   │   ├── config/                    # Configuration files
│   │   │   ├── database.ts            # Prisma client setup
│   │   │   ├── redis.ts               # Redis client setup
│   │   │   ├── env.ts                 # Environment variables
│   │   │   ├── swagger.ts             # Swagger documentation config
│   │   │   └── logger.ts              # Winston logger setup
│   │   │
│   │   ├── controllers/               # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── student.controller.ts
│   │   │   ├── attendance.controller.ts
│   │   │   ├── grade.controller.ts
│   │   │   ├── fee.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── student.service.ts
│   │   │   ├── attendance.service.ts
│   │   │   ├── grade.service.ts
│   │   │   ├── fee.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── email.service.ts
│   │   │
│   │   ├── middleware/                # Express middleware
│   │   │   ├── auth.middleware.ts     # JWT verification
│   │   │   ├── rbac.middleware.ts     # Role-based access control
│   │   │   ├── rateLimit.middleware.ts # Rate limiting
│   │   │   ├── error.middleware.ts    # Centralized error handling
│   │   │   ├── validate.middleware.ts # Input validation
│   │   │   └── logger.middleware.ts   # Request logging
│   │   │
│   │   ├── routes/                    # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── student.routes.ts
│   │   │   ├── attendance.routes.ts
│   │   │   ├── grade.routes.ts
│   │   │   ├── fee.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── index.routes.ts        # Route aggregator
│   │   │
│   │   ├── models/                    # Prisma models (generated)
│   │   │   ├── User.model.ts
│   │   │   ├── Student.model.ts
│   │   │   ├── Attendance.model.ts
│   │   │   ├── Grade.model.ts
│   │   │   ├── Fee.model.ts
│   │   │   └── Course.model.ts
│   │   │
│   │   ├── validators/                # Zod schemas
│   │   │   ├── auth.validators.ts
│   │   │   ├── student.validators.ts
│   │   │   ├── attendance.validators.ts
│   │   │   ├── grade.validators.ts
│   │   │   └── fee.validators.ts
│   │   │
│   │   ├── utils/                     # Helper functions
│   │   │   ├── jwt.utils.ts
│   │   │   ├── bcrypt.utils.ts
│   │   │   ├── redis.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   ├── email.utils.ts
│   │   │   ├── pdf.utils.ts           # PDF generation (report cards)
│   │   │   └── csv.utils.ts           # CSV import/export
│   │   │
│   │   ├── types/                     # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── student.types.ts
│   │   │   ├── attendance.types.ts
│   │   │   ├── grade.types.ts
│   │   │   ├── fee.types.ts
│   │   │   ├── dashboard.types.ts
│   │   │   └── express.types.ts       # Express namespace extensions
│   │   │
│   │   ├── database/                  # Database setup
│   │   │   ├── migrations/
│   │   │   │   ├── 20260101_create_users_table.ts
│   │   │   │   ├── 20260102_create_students_table.ts
│   │   │   │   ├── 20260103_create_attendance_table.ts
│   │   │   │   ├── 20260104_create_grades_table.ts
│   │   │   │   └── ...
│   │   │   ├── prisma.schema.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── websocket/                 # Socket.io handlers
│   │   │   ├── attendance.socket.ts   # Real-time attendance
│   │   │   └── notification.socket.ts # Push notifications
│   │   │
│   │   ├── tests/                     # Test files
│   │   │   ├── unit/
│   │   │   │   ├── auth.test.ts
│   │   │   │   ├── student.test.ts
│   │   │   │   └── ...
│   │   │   ├── integration/
│   │   │   │   ├── auth.integration.test.ts
│   │   │   │   └── ...
│   │   │   └── fixtures/
│   │   │       ├── mockUsers.ts
│   │   │       └── mockStudents.ts
│   │   │
│   │   ├── app.ts                     # Express app setup
│   │   ├── index.ts                   # Entry point
│   │   └── socket.ts                  # Socket.io setup
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                          # Next.js 14+ Web App
│   ├── src/
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── (auth)/                # Auth route group
│   │   │   │   ├── login/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── LoginForm.tsx
│   │   │   │   └── register/
│   │   │   │       ├── page.tsx
│   │   │   │       └── RegisterForm.tsx
│   │   │   │
│   │   │   ├── (dashboard)/           # Dashboard route group
│   │   │   │   ├── admin/
│   │   │   │   │   ├── page.tsx       # Admin Dashboard
│   │   │   │   │   ├── students/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── StudentList.tsx
│   │   │   │   │   ├── attendance/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── AttendanceDashboard.tsx
│   │   │   │   │   ├── grades/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── GradeManagement.tsx
│   │   │   │   │   ├── fees/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── FeeManagement.tsx
│   │   │   │   │   └── settings/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── teacher/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── my-classes/
│   │   │   │   │   ├── attendance/
│   │   │   │   │   └── grades/
│   │   │   │   ├── student/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── my-schedule/
│   │   │   │   │   ├── my-grades/
│   │   │   │   │   ├── attendance/
│   │   │   │   │   └── fees/
│   │   │   │   └── parent/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── child-profile/
│   │   │   │       ├── child-grades/
│   │   │   │       ├── child-attendance/
│   │   │   │       └── child-fees/
│   │   │   │
│   │   │   ├── api/                   # Next.js API routes
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/                # React components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── Alert.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── Chart.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── StudentList.tsx
│   │   │   │   ├── StudentForm.tsx
│   │   │   │   ├── StudentDetail.tsx
│   │   │   │   └── StudentSearch.tsx
│   │   │   │
│   │   │   ├── attendance/
│   │   │   │   ├── AttendanceForm.tsx
│   │   │   │   ├── AttendanceDashboard.tsx
│   │   │   │   ├── AttendanceReport.tsx
│   │   │   │   └── QRCodeScanner.tsx
│   │   │   │
│   │   │   ├── grades/
│   │   │   │   ├── GradeBook.tsx
│   │   │   │   ├── GradeForm.tsx
│   │   │   │   ├── ReportCard.tsx
│   │   │   │   └── GradeChart.tsx
│   │   │   │
│   │   │   ├── fees/
│   │   │   │   ├── FeeList.tsx
│   │   │   │   ├── FeeForm.tsx
│   │   │   │   ├── PaymentModal.tsx
│   │   │   │   └── FeeReport.tsx
│   │   │   │
│   │   │   └── charts/
│   │   │       ├── AttendanceChart.tsx
│   │   │       ├── FeeChart.tsx
│   │   │       └── PerformanceChart.tsx
│   │   │
│   │   ├── services/                  # API client (axios)
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── student.service.ts
│   │   │   ├── attendance.service.ts
│   │   │   ├── grade.service.ts
│   │   │   ├── fee.service.ts
│   │   │   └── dashboard.service.ts
│   │   │
│   │   ├── hooks/                     # React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useStudents.ts
│   │   │   ├── useAttendance.ts
│   │   │   ├── useGrades.ts
│   │   │   ├── useFees.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useLocalStorage.ts
│   │   │
│   │   ├── store/                     # Zustand state
│   │   │   ├── auth.store.ts
│   │   │   ├── student.store.ts
│   │   │   └── dashboard.store.ts
│   │   │
│   │   ├── utils/                     # Helper functions
│   │   │   ├── format.utils.ts
│   │   │   ├── validation.utils.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── types/                     # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── student.types.ts
│   │   │   ├── attendance.types.ts
│   │   │   ├── grade.types.ts
│   │   │   └── fee.types.ts
│   │   │
│   │   ├── styles/                    # Global styles
│   │   │   └── globals.css
│   │   │
│   │   └── tests/
│   │
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
│
├── mobile/                            # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart
│   │   ├── app.dart
│   │   │
│   │   ├── config/
│   │   │   ├── environment.dart
│   │   │   ├── themes.dart
│   │   │   └── constants.dart
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.dart
│   │   │   ├── user.model.g.dart
│   │   │   ├── student.model.dart
│   │   │   ├── student.model.g.dart
│   │   │   ├── attendance.model.dart
│   │   │   ├── grade.model.dart
│   │   │   ├── fee.model.dart
│   │   │   └── course.model.dart
│   │   │
│   │   ├── services/
│   │   │   ├── api.service.dart
│   │   │   ├── auth.service.dart
│   │   │   ├── student.service.dart
│   │   │   ├── attendance.service.dart
│   │   │   ├── grade.service.dart
│   │   │   ├── fee.service.dart
│   │   │   ├── notification.service.dart
│   │   │   └── local_storage.service.dart
│   │   │
│   │   ├── providers/                 # Provider state management
│   │   │   ├── auth.provider.dart
│   │   │   ├── student.provider.dart
│   │   │   ├── attendance.provider.dart
│   │   │   ├── grade.provider.dart
│   │   │   └── fee.provider.dart
│   │   │
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── login_screen.dart
│   │   │   │   └── register_screen.dart
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── student_dashboard.dart
│   │   │   │   └── parent_dashboard.dart
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── profile_screen.dart
│   │   │   │   ├── schedule_screen.dart
│   │   │   │   ├── grades_screen.dart
│   │   │   │   ├── attendance_screen.dart
│   │   │   │   └── fees_screen.dart
│   │   │   │
│   │   │   ├── parent/
│   │   │   │   ├── child_profile_screen.dart
│   │   │   │   ├── child_grades_screen.dart
│   │   │   │   ├── child_attendance_screen.dart
│   │   │   │   └── child_fees_screen.dart
│   │   │   │
│   │   │   ├── attendance/
│   │   │   │   ├── qrscanner_screen.dart
│   │   │   │   └── attendance_history_screen.dart
│   │   │   │
│   │   │   ├── messages/
│   │   │   │   ├── messages_screen.dart
│   │   │   │   └── chat_screen.dart
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── settings_screen.dart
│   │   │       └── notification_settings_screen.dart
│   │   │
│   │   ├── widgets/
│   │   │   ├── common/
│   │   │   │   ├── custom_button.dart
│   │   │   │   ├── custom_input.dart
│   │   │   │   ├── custom_card.dart
│   │   │   │   └── loading_widget.dart
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── stats_card.dart
│   │   │   │   └── chart_widget.dart
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── student_card.dart
│   │   │   │   └── grade_card.dart
│   │   │   │
│   │   │   └── attendance/
│   │   │       ├── attendance_card.dart
│   │   │       └── qr_scanner_widget.dart
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.dart
│   │   │   ├── formats.dart
│   │   │   └── constants.dart
│   │   │
│   │   ├── routes/
│   │   │   ├── app_routes.dart
│   │   │   └── route_generator.dart
│   │   │
│   │   └── tests/
│   │
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   ├── .env
│   ├── .env.example
│   └── README.md
│
├── database/                          # Database scripts
│   ├── migrations/
│   ├── prisma.schema.ts
│   └── seed.ts
│
├── docker/                            # Docker configurations
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   ├── mobile/
│   │   └── Dockerfile
│   └── docker-compose.yml
│
├── docs/                              # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── SETUP_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── README.md
└── package.json

✍️ Coding Style Guide
Backend - TypeScript/Node.js/Express
File Naming Convention
typescript
// ✅ Use snake_case for all files
student.controller.ts
attendance.service.ts
auth.middleware.ts
fee.validators.ts
jwt.utils.ts
Variable & Function Naming
typescript
// ✅ camelCase for variables
const studentId = '123';
const attendanceRecord = {};
const feeAmount = 500;

// ✅ PascalCase for classes/interfaces/types
class Student { }
interface Attendance { }
type GradeRecord = { };

// ✅ UPPER_CASE for constants
const MAX_RETRY = 3;
const JWT_EXPIRATION = '15m';
const ROLE_ADMIN = 'admin';

// ✅ Prefix booleans with is/has/can
const isActive = true;
const hasPermission = false;
const canEdit = true;

// ✅ Verb+noun pattern for functions
async function createStudent(data: StudentData) { }
async function getStudentById(id: string) { }
async function updateStudent(id: string, data: StudentData) { }
async function deleteStudent(id: string) { }
Controller Pattern Example
typescript
// ✅ student.controller.ts
import { Request, Response } from 'express';
import { studentService } from '../services/student.service';
import { catchAsyncError } from '../middleware/error.middleware';

export const studentController = {
  createStudent: catchAsyncError(async (req: Request, res: Response) => {
    const studentData = req.body;
    const student = await studentService.createStudent(studentData);
    
    res.status(201).json({
      success: true,
      data: student,
      message: 'Student created successfully',
      timestamp: new Date().toISOString()
    });
  }),

  getStudentById: catchAsyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
        code: 'STUDENT_NOT_FOUND',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      data: student,
      timestamp: new Date().toISOString()
    });
  })
};
Frontend - Next.js/React/TypeScript
Component Naming
tsx
// ✅ Use PascalCase for components
export const StudentList: React.FC<StudentListProps> = ({ searchQuery }) => {
  // Component logic
};

// ✅ snake_case for file names
student-list.tsx
attendance-form.tsx
grade-book.tsx
Hook Pattern Example
typescript
// ✅ useStudents.hook.ts
import { useState, useEffect } from 'react';
import { studentService } from '@/services/student.service';

interface UseStudentsReturn {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
}

export const useStudents = (): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const result = await studentService.getStudents();
      setStudents(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, isLoading, error, fetchStudents };
};
Flutter - Dart
Model Pattern Example
dart
// ✅ Use snake_case for files, PascalCase for classes
// student_model.dart
import 'package:json_annotation/json_annotation.dart';

part 'student_model.g.dart';

@JsonSerializable()
class Student {
  final String id;
  final String studentId;
  final String firstName;
  final String lastName;
  final DateTime dateOfBirth;
  final String gender;
  final String? guardianName;
  final String? guardianPhone;

  Student({
    required this.id,
    required this.studentId,
    required this.firstName,
    required this.lastName,
    required this.dateOfBirth,
    required this.gender,
    this.guardianName,
    this.guardianPhone,
  });

  factory Student.fromJson(Map<String, dynamic> json) => _$StudentFromJson(json);
  
  Map<String, dynamic> toJson() => _$StudentToJson(this);
}
Service Pattern Example
dart
// ✅ Use snake_case for files
// student.service.dart
class StudentService {
  final ApiService _api = ApiService();

  Future<List<Student>> getStudents() async {
    final response = await _api.get('/students');
    return (response as List).map((json) => Student.fromJson(json)).toList();
  }

  Future<Student> createStudent(Student student) async {
    final response = await _api.post('/students', student.toJson());
    return Student.fromJson(response);
  }
}