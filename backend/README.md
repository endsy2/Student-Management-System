# SMS Backend

Express + TypeScript + Prisma (PostgreSQL) + Redis API for the School Management System.

## Implemented so far (Phase 1)

- **Config**: env validation (Zod), Winston logger, Prisma client, Redis client.
- **Middleware**: JWT auth (with Redis token blacklist), RBAC (`requireRole`), Zod validation, Redis-backed rate limiting, centralized error handling, request logging.
- **Auth module**: register, login, refresh (with rotation), logout (blacklist), `/me`. Sessions + refresh tokens in Redis. Audit logging on auth events.
- **Student module**: CRUD, auto student-id (`STU-00001`), pagination + search + status/class filters, 1-hour Redis cache per student, soft delete.

> Attendance, Grades, Fees, Dashboard, Socket.io, and Swagger are scheduled for the next phase.

## Prerequisites

- Node 20+ (tested on Node 24)
- Docker (for PostgreSQL + Redis)

## Setup

```bash
cd backend
cp .env.example .env            # then edit JWT secrets
npm install

# Start PostgreSQL + Redis
docker compose up -d

# Generate Prisma client + create the schema
npm run prisma:generate
npm run prisma:migrate          # name it e.g. "init"

# Seed an admin user (admin@sms.local / Admin@123)
npm run db:seed

# Run the API (http://localhost:4000/api/v1)
npm run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start API with hot reload |
| `npm run build` / `npm start` | Compile to `dist/` / run compiled output |
| `npm test` | Run Jest tests |
| `npm test -- auth.validators` | Run a single test file by name pattern |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed baseline data |
| `npm run lint` / `npm run format` | Lint / format |

## Smoke test

```bash
# Health
curl http://localhost:4000/api/v1/health

# Login as the seeded admin
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@sms.local","password":"Admin@123"}'

# Use the returned accessToken
curl http://localhost:4000/api/v1/students \
  -H "Authorization: Bearer <accessToken>"
```

## Conventions

- `*.controller.ts` handle HTTP only; business logic lives in `*.service.ts`; input shapes in `*.validators.ts` (Zod).
- All responses use the `{ success, data, message, timestamp }` / `{ success, error, code, timestamp }` envelope (see `utils/response.ts`).
- Throw `ApiError` for expected failures; the error middleware maps it (and known Prisma errors) to the envelope.
- Path alias `@/*` maps to `src/*`.
