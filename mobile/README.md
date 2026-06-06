# SMS Mobile (Flutter)

Student & parent mobile client for the School Management System. Talks to the
Express/Prisma backend in [`../backend`](../backend) over REST + Socket.io.

## Status

MVP slice implemented: authentication, dashboard, profile, grades (with chart),
attendance (analytics + history), fees (ledger + payment), and the per-student
attendance QR. Pure Dart — JSON is hand-mapped (no `build_runner` step needed).

### Design language

A vibrant, student-focused redesign (see `lib/config/themes.dart`):

- **Bottom-nav app shell** (`MainShell`) over an `IndexedStack` — Home / Grades /
  Attendance / Fees / Profile — instead of drilling through a list.
- **Gamified Home**: gradient hero with a time-aware greeting, two **animated
  progress rings** (attendance + grade), **achievement badges** derived from
  performance, colourful gradient quick-tiles, and a recent-grades preview.
- **Nunito** type (via `google_fonts`), rounded cards, soft tinted shadows, and
  `FadeSlideIn` entrance animations.

> `google_fonts` fetches the typeface on first run and caches it; bundle the
> font files under `assets/` if you need fully offline first-launch.

## Prerequisites

- Flutter **3.27+** / Dart **3.6+** (`flutter --version`)
- A running backend (see `../backend/README.md`). Default dev port `4000`.

## First-time setup

This folder contains the app source (`lib/`, `test/`, `pubspec.yaml`) but **not**
the generated native projects. Generate them once without touching `lib/`:

```bash
cd mobile
flutter create --platforms=android,ios .   # adds android/ + ios/ shells
cp .env.example .env                        # adjust API_BASE_URL if needed
flutter pub get
```

> `flutter create .` only fills in missing platform files; it leaves existing
> `lib/`, `pubspec.yaml`, and `.env` in place.

## Configure the API endpoint

`.env` (bundled as an asset) drives the base URLs:

| Key | Meaning | Android emulator default |
| --- | --- | --- |
| `API_BASE_URL` | REST base, includes `/api/v1` | `http://10.0.2.2:4000/api/v1` |
| `SOCKET_URL` | Socket.io origin (no `/api/v1`) | `http://10.0.2.2:4000` |

- **Android emulator** reaches the host via `10.0.2.2`.
- **iOS simulator** can use `http://localhost:4000`.
- **Physical device**: use your machine's LAN IP and ensure the same network.

## Run

```bash
flutter run            # pick a device/emulator
flutter test           # unit + widget tests
flutter analyze        # static analysis (flutter_lints)
```

## Architecture

```
lib/
  config/      environment (.env), theme, constants
  models/      plain Dart models with fromJson/toJson (mirror backend shapes)
  services/    api (http) + auth/student/attendance/grade/fee + socket + storage
  providers/   ChangeNotifier state (provider package)
  screens/     auth, dashboard, student (profile/grades/attendance/fees), settings
  widgets/     reusable UI (cards, inputs, buttons, status views)
  routes/      named routes + generator
  utils/       validators, formatters
```

- **Auth**: tokens kept in `flutter_secure_storage`; `ApiService` injects the
  bearer token and, on a `401`, silently refreshes via `/auth/refresh` and
  retries once. `AuthProvider` + an `_AuthGate` in `app.dart` switch between the
  login screen and dashboard.
- **Active student**: the backend exposes no "my profile" endpoint and the JWT
  carries only the user id/email, so `StudentProvider` resolves the linked
  `Student` by searching `/students?search=<email>`. All student-scoped screens
  read `StudentProvider.studentId`.
- **Real-time**: `SocketService` authenticates the Socket.io handshake with the
  access token and joins the `class:{classId}` room (wired for the live
  attendance feed).

## Known gaps / next steps

- Payment recording (`POST /fees/payments`) is **admin-only** on the backend, so
  a student/parent sees an authorization error — the UI surfaces it gracefully.
  A dedicated student-payment endpoint (or gateway webhook) is the real fix.
- Offline SQLite caching, push notifications, and the messages/chat screen are
  scaffolded in the spec but not yet implemented in this slice.
- Swap hand-written JSON for `json_serializable` if/when `build_runner` is added.
