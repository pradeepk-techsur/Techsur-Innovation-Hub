---
phase: 03-engagement-flows
plan: "01"
subsystem: auth
tags: [jwt, jose, session, authentication, middleware, next.js, cookies]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: db client (src/lib/db/client.ts), audit_events table, dev-stub.ts guard

provides:
  - AuthProvider interface + DevAuthProvider implementation (src/lib/auth/provider.ts)
  - StakeholderSession type with name, office, email (AUTH-10 attribution)
  - Session JWT management: createSession, getSession, setSessionCookie, clearSessionCookie
  - POST /api/auth/login — credential validation, session creation
  - POST /api/auth/logout — session invalidation
  - GET /api/auth/session — session state for UI
  - /login page with dev role selector
  - Middleware protecting /submit-opportunity and /submit-contribution

affects:
  - 03-02 (opportunity submission — requires auth session)
  - 03-03 (contribution submission — requires auth session)
  - 03-04 (engagement request — requires auth session)
  - 04 (Phase 4 RBAC/OIDC — replaces DevAuthProvider)

# Tech tracking
tech-stack:
  added: [jose@^5.10.0]
  patterns:
    - HTTP-only JWT cookie session (HS256, AUTH_SECRET min 32 chars)
    - AuthProvider interface abstraction for swappable auth backends
    - Middleware route protection with returnTo redirect param
    - Dev bypass pattern gated on ENABLE_DEV_AUTH_BYPASS=true (not production)

key-files:
  created:
    - src/lib/db/migrations/002_users_table.sql
    - src/lib/auth/provider.ts
    - src/lib/auth/session.ts
    - src/app/api/auth/login/route.ts
    - src/app/api/auth/logout/route.ts
    - src/app/api/auth/session/route.ts
    - src/app/(public)/login/page.tsx
    - src/app/(public)/login/LoginForm.tsx
    - src/app/(public)/LogoutButton.tsx
    - .env.local
  modified:
    - src/middleware.ts
    - src/app/(public)/layout.tsx
    - package.json (added jose)

key-decisions:
  - "AuthProvider interface abstraction: DevAuthProvider now, OIDC provider wired in Phase 4 when identity system confirmed"
  - "HTTP-only cookie prevents JS access to session token (SEC-08); HS256 JWT signed with AUTH_SECRET (min 32 chars enforced at runtime)"
  - ".env.local created for local dev overrides (ENABLE_DEV_AUTH_BYPASS=true, localhost DB); .env retains production-safe defaults"
  - "Middleware reads JWT directly via jose (no DB round-trip per request); session payload contains name/office/email for AUTH-10"

patterns-established:
  - "Auth session shape: StakeholderSession with id, userId, name, office, email, role, expiresAt — used by all Phase 3 submission flows"
  - "Protected routes redirect to /login?returnTo=<path>; LoginForm reads returnTo from server props (relative path only, no open redirect)"
  - "Dev auth role selector rendered only when NODE_ENV !== production; production replaces with OIDC redirect button"

# Metrics
duration: 4min
completed: 2026-08-11
---

# Phase 3 Plan 01: Stakeholder Authentication Summary

**HS256 JWT session in HTTP-only cookie with AuthProvider abstraction, DevAuthProvider dev stub, middleware route protection for submission flows, and /login page with role selector**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-11T18:11:04Z
- **Completed:** 2026-08-11T18:14:57Z
- **Tasks:** 2 completed
- **Files modified:** 12

## Accomplishments

- Users table migration (002) with 3 dev seed users (stakeholder, curator, admin) — idempotent ON CONFLICT DO NOTHING
- AuthProvider interface + DevAuthProvider: swappable auth backend (OIDC slot open for Phase 4)
- StakeholderSession with name, office, email, role (AUTH-10 attribution fields for submission flows)
- Full login/logout/session API endpoints with HTTP-only JWT cookie (SEC-08 compliant)
- Middleware protecting /submit-opportunity and /submit-contribution with returnTo redirect (AUTH-09)
- /login page with dev role selector (server component wrapping client LoginForm)
- Public layout nav updated to show authenticated user name + Sign Out vs anonymous Sign In

## Task Commits

Each task was committed atomically:

1. **Task 1: Users table migration, AuthProvider interface, and session management** - `090a776` (feat)
2. **Task 2: Login/logout API routes, login page, and middleware route protection** - `93f8fd0` (feat)

**Plan metadata:** (to be committed with SUMMARY.md)

## Files Created/Modified

- `src/lib/db/migrations/002_users_table.sql` - Users table with external_id for OIDC, 3 dev seed users
- `src/lib/auth/provider.ts` - AuthProvider interface + DevAuthProvider + getAuthProvider factory
- `src/lib/auth/session.ts` - JWT session: createSession, getSession, setSessionCookie, clearSessionCookie
- `src/app/api/auth/login/route.ts` - POST /api/auth/login: credential → session JWT cookie
- `src/app/api/auth/logout/route.ts` - POST /api/auth/logout: clear session cookie
- `src/app/api/auth/session/route.ts` - GET /api/auth/session: auth state for UI
- `src/app/(public)/login/page.tsx` - Login page server component with returnTo param
- `src/app/(public)/login/LoginForm.tsx` - Client component: dev role selector + POST to /api/auth/login
- `src/app/(public)/LogoutButton.tsx` - Client component: POST logout + router refresh
- `src/app/(public)/layout.tsx` - Nav updated with session-aware auth state
- `src/middleware.ts` - Route protection: /submit-opportunity, /submit-contribution → /login?returnTo=<path>
- `.env.local` - Local dev overrides: ENABLE_DEV_AUTH_BYPASS=true, localhost DB connection

## Decisions Made

- **AuthProvider abstraction:** Phase 4 wires OidcAuthProvider when identity system (Azure Entra ID or Judiciary SSO) is confirmed. DevAuthProvider uses ENABLE_DEV_AUTH_BYPASS guard.
- **JWT in HTTP-only cookie:** Middleware reads JWT directly via jose without DB round-trip per request (performance) while session payload carries name/office/email for AUTH-10 attribution.
- **.env.local for dev overrides:** .env keeps production-safe defaults (ENABLE_DEV_AUTH_BYPASS=false); .env.local sets dev-specific values (higher Next.js priority).
- **returnTo as relative path only:** Middleware sets returnTo from `request.nextUrl.pathname` (always same-origin path); prevents open redirect.

## Known Stubs

- `src/lib/auth/provider.ts:63` — `// TODO Phase 4: return OidcAuthProvider when identity system is confirmed` — **Cosmetic**: planned Phase 4 work, DevAuthProvider fully functional for Phase 3.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Created .env.local for local dev auth bypass**
- **Found during:** Task 2 (verification step)
- **Issue:** Running Next.js dev server read `.env` which had `ENABLE_DEV_AUTH_BYPASS=false` and `NODE_ENV=production`, causing POST /api/auth/login to return 500 (no provider configured)
- **Fix:** Created `.env.local` with `ENABLE_DEV_AUTH_BYPASS=true` and `NODE_ENV=development` (Next.js gives `.env.local` higher priority than `.env`)
- **Files modified:** `.env.local` (created)
- **Verification:** POST /api/auth/login returned `{"ok":true,...}` after Next.js reloaded env
- **Committed in:** 93f8fd0 (Task 2 commit)

**2. [Rule 2 - Missing Critical] Async searchParams in login page for Next.js 15 compatibility**
- **Found during:** Task 2 (login page creation)
- **Issue:** Next.js 15 requires `searchParams` to be awaited as a Promise in server components
- **Fix:** Added `async` to `LoginPage` and `const params = await searchParams` before accessing `.returnTo`
- **Files modified:** `src/app/(public)/login/page.tsx`
- **Verification:** TypeScript check passed (npx tsc --noEmit)
- **Committed in:** 93f8fd0 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both essential for the auth system to function correctly in the local dev environment. No scope creep.

## Issues Encountered

None — all verifications passed.

## User Setup Required

None — no external service configuration required. Auth uses dev stub with `.env.local` defaults.

## Next Phase Readiness

- Auth foundation complete: POST /api/auth/login, GET /api/auth/session, StakeholderSession type all available
- Plans 03-02, 03-03, 03-04 can use `getSession()` from `@/lib/auth/session` to get authenticated user name/office/email for submission attribution
- Protected routes /submit-opportunity and /submit-contribution redirect unauthenticated users to /login?returnTo=<path>
- Phase 4: OIDC provider replaces DevAuthProvider by implementing AuthProvider interface

## Self-Check: PASSED

- All 10 key files exist on disk ✓
- Both task commits found (090a776, 93f8fd0) ✓
- Build check: `npx tsc --noEmit` → exit 0 ✓
- No blocking stubs (1 cosmetic TODO for Phase 4 OIDC provider) ✓

---
*Phase: 03-engagement-flows*
*Completed: 2026-08-11*
