# School Management System

Monorepo for a School Management System (MVP — Phase 1). See `CLAUDE.md` for the full product specification.

## Overview

The School Management System (SMS) is a full-stack platform that digitizes the day-to-day running of a school — from enrolling students to marking attendance, recording grades, and collecting fees. It serves four roles, each with a tailored portal: **Admins** oversee the whole institution, **Teachers** manage their classes, **Students** track their own progress, and **Parents** follow their child.

It ships as three coordinated applications backed by a shared API:

- **Web app (Next.js)** — the primary interface for admins and teachers, with role-aware dashboards, CRUD screens, charts, and a live attendance board.
- **Mobile app (Flutter)** — a focused companion for students and parents to check grades, attendance, and fees on the go, plus QR-based attendance.
- **Backend API (Node.js + Express)** — a modular REST API (`/api/v1`) that holds all business logic, persists to PostgreSQL via Prisma, and uses Redis for sessions, caching, and rate limiting. Socket.io powers real-time attendance updates.

### Core capabilities

| Module | What it does |
| --- | --- |
| **Authentication & RBAC** | JWT auth (short-lived access + refresh tokens), bcrypt password hashing, Redis-backed sessions and token blacklisting, and role guards for Admin / Teacher / Student / Parent. |
| **Student Management** | Full student profiles with guardian and medical info, auto-generated student IDs, search/filter/pagination, soft delete, and CSV bulk import. |
| **Attendance** | Daily per-class marking (present / absent / late / excused), staff attendance, history and analytics, and a real-time dashboard over WebSockets. |
| **Grades** | Grade book across assessment types, weighted averages, automatic letter grades, course/class analytics, and PDF report cards. |
| **Fees** | Fee structures, payment tracking with partial payments and balances, overdue detection, scholarships, and financial reports. |
| **Admin Dashboard** | Overview metrics, analytics charts, and a recent-activity feed aggregating across all modules. |

### Technology at a glance

- **Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts
- **Backend:** Node.js · Express · TypeScript · Prisma · Zod · Winston
- **Data:** PostgreSQL 15+ (15 tables with indexes & constraints) · Redis 7+
- **Mobile:** Flutter 3+ · Dart · Provider · fl_chart
- **Real-time:** Socket.io · **Infra:** Docker + Docker Compose

> **Status:** This is Phase 1 (MVP). Core modules are functional end-to-end; integrations like MFA, email/SMS notifications, and a live payment gateway are scaffolded for later phases. See the build progress and per-app READMEs below for exact details.

## Repository layout

| Path | Stack | Status |
| --- | --- | --- |
| `backend/` | Node.js + Express + TypeScript + Prisma (PostgreSQL) + Redis | ✅ 10 modules (auth, students+CSV, attendance, grades, fees, dashboard, classes, courses, enrollments, exams). Pending: Swagger, MFA, email/SMS, payment gateway, exports |
| `frontend/` | Next.js 14 + TypeScript + Tailwind | ✅ All portal pages built (admin/teacher/student/parent); charts + CRUD wired to API |
| `mobile/` | Flutter | 🚧 MVP slice — auth, dashboard, profile, grades, attendance, fees, QR (needs Flutter SDK to run) |

## Build progress

- [x] Backend project scaffold (TypeScript, Prisma, Docker)
- [x] Database schema — all 15 tables + enums + indexes (`backend/prisma/schema.prisma`)
- [x] Config: env validation, Winston logger, Prisma, Redis
- [x] Middleware: JWT auth + Redis blacklist, RBAC, Zod validation, rate limiting, error handling
- [x] **Auth module** — register / login / refresh / logout / me
- [x] **Student module** — CRUD, auto-id, pagination/search/filter, soft delete, caching
- [x] **Attendance module** — mark/bulk, by class+date, history, analytics, staff attendance, Socket.io real-time
- [x] **Grade module** — entry/bulk, weighted averages, letter grades, course analytics, PDF report cards
- [x] **Fee module** — fee structures, payments (partial/balances), overdue tracking, scholarships, financial reports
- [x] **Dashboard module** — overview metrics, analytics aggregations, recent activity
- [x] **Class / Course / Enrollment / Exam modules** — CRUD + class rosters + exam scheduling
- [x] **CSV bulk student import** — `POST /students/import` (multipart) with per-row error report
- [ ] Swagger/OpenAPI docs + broader Jest coverage
- [ ] MFA (admin), password reset (SMTP), absent→parent notifications (email/SMS)
- [ ] Payment gateway (Stripe/PayPal), invoices, reminders, dunning
- [ ] QR attendance, report exports (PDF/Excel/CSV), notification center, custom report builder
- [x] Next.js app foundation — login, token-refresh API client, role routing, **live admin dashboard**
- [x] Next.js feature screens — all 4 portals: student CRUD + **CSV import**, attendance marking + history + **real-time Socket.io board**, grade entry/book + report-card download, fee structures/ledger/payments, dashboard charts (Recharts)
- [x] Auth UI — login **+ register**; utils (format/validation/constants); `useWebSocket`/`useLocalStorage` hooks
- [ ] Frontend gaps vs spec: QR code scanner (needs camera lib + backend QR endpoint); granular component split (functionally covered by consolidated components)
- [x] Flutter app foundation — secure-token API client w/ silent refresh, Provider state, REST + Socket.io services aligned to backend contracts
- [x] Flutter screens — login, student dashboard, profile, grades (chart), attendance (analytics + history), fees (ledger + payment sheet), attendance QR
- [ ] Flutter: offline SQLite cache, push notifications, messages/chat (spec'd, not yet built); run `flutter create --platforms=android,ios .` to add native shells

## Getting started

The runnable piece today is the backend. See [`backend/README.md`](backend/README.md) for setup, commands, and a smoke test.

```bash
cd backend
cp .env.example .env
npm install
docker compose up -d        # PostgreSQL + Redis (requires Docker Desktop running)
npm run prisma:migrate
npm run db:seed
npm run dev
```
