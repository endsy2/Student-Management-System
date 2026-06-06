# SMS Frontend

Next.js 14 (App Router) + TypeScript + Tailwind web client for the School Management System.

## Implemented so far

- Auth: login page, Zustand auth store, session restore via `/auth/me`.
- API client (`services/api.ts`) with bearer-token injection and automatic 401 → refresh-token retry.
- Role-aware routing: login redirects to `/admin`, `/teacher`, `/student`, or `/parent`.
- `DashboardShell` — guards routes by role and renders the page chrome.
- **Admin dashboard** — live overview stat cards + recent-students table from the backend.
- Teacher / student / parent portals are scaffolded (placeholders).

## Setup

```bash
cd frontend
cp .env.example .env.local      # point NEXT_PUBLIC_API_URL at the backend
npm install
npm run dev                     # http://localhost:3000
```

The backend must be running (see `../backend/README.md`). Sign in with the seeded admin
`admin@sms.local` / `Admin@123`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm test` | Run Vitest |
| `npm run lint` | Next.js lint |

## Conventions

- Components in `src/components`, one API module per backend domain in `src/services`.
- Server state fetched in client components for now; can migrate to RSC/data fetching later.
- Path alias `@/*` → `src/*`.
