---
phase: 04-curation-and-administration
plan: "01"
subsystem: auth
tags: [rbac, middleware, jwt, audit, curator, next.js, role-hierarchy]

# Dependency graph
requires:
  - phase: 03-engagement-flows
    provides: StakeholderSession type, getSession(), JWT cookie auth (session.ts)
  - phase: 01-foundation
    provides: audit_events table, db client

provides:
  - requireRole('curator'|'admin') — RBAC guard for all curator API handlers
  - getRequestSession() — Bearer token + cookie dual-mode session extraction
  - appendAuthAuditEvent() — best-effort audit INSERT for auth events
  - appendAuditEvent() — general audit helper for service layer (plans 04-02/03/04)
  - src/app/curator/layout.tsx — SSR session guard + curator sidebar nav
  - src/app/curator/page.tsx — placeholder dashboard
  - src/app/api/v1/curator/[...path]/route.ts — catch-all curator API with RBAC enforcement

affects:
  - 04-02 (curator dashboard — uses requireRole and appendAuditEvent)
  - 04-03 (curator submission management — uses requireRole and appendAuditEvent)
  - 04-04 (curator settings/audit — uses requireRole('admin') and appendAuditEvent)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - requireRole() pattern: returns { session } or Response — callers check instanceof Response
    - Role rank hierarchy: admin(3) > curator(2) > stakeholder(1) > anonymous(0)
    - Dual-mode session: Bearer header for API routes, cookie for SSR
    - Audit-on-denial: appendAuthAuditEvent() called in both 401 and 403 paths; best-effort (never throws)

key-files:
  created:
    - src/lib/auth/middleware.ts
    - src/app/curator/layout.tsx
    - src/app/curator/page.tsx
    - src/app/api/v1/curator/[...path]/route.ts
  modified:
    - src/middleware.ts

key-decisions:
  - "user_role_changed event_type for auth denials: DB CHECK constraint does not allow 'unauthorized_access_attempt'; event_data.reason field distinguishes 'unauthenticated' vs 'insufficient_role'"
  - "requireRole returns { session } or Response (not throws): callers use instanceof Response guard — consistent with Next.js handler idiom"
  - "Catch-all /api/v1/curator/[...path] route: enables RBAC testing before individual handlers land in 04-02/03/04"

patterns-established:
  - "requireRole usage: const auth = await requireRole(request, 'curator'); if (auth instanceof Response) return auth; const { session } = auth;"
  - "appendAuditEvent() used in service layer for record mutations (plans 04-02+); appendAuthAuditEvent() for auth-layer events only"

# Metrics
duration: 4min
completed: 2026-08-12
---

# Phase 4 Plan 01: RBAC Enforcement Layer Summary

**Role-based access control with requireRole() middleware, server-side curator SSR guard, dual-mode Bearer/cookie session extraction, and best-effort auth-denial audit recording**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-12T04:01:37Z
- **Completed:** 2026-08-12T04:05:56Z
- **Tasks:** 1 completed
- **Files modified:** 5

## Accomplishments

- `requireRole()` RBAC guard returns 401 (unauthenticated) or 403 (insufficient role); verified against all three identity tiers (anonymous, stakeholder, curator)
- Auth-denial audit events recorded to `audit_events` (both 401 and 403 paths) with reason field in event_data
- Curator SSR layout with server-side session guard redirects unauthenticated users; admin-only nav items (settings, audit log) conditionally rendered
- Catch-all `/api/v1/curator/[...path]` route enforces RBAC; enables plans 04-02/03/04 to add handlers without re-implementing auth

## Task Commits

Each task was committed atomically:

1. **Task 1: RBAC middleware, audit helper, curator layout, and middleware update** - `5316697` (feat)

**Plan metadata:** (committed with SUMMARY.md)

## Files Created/Modified

- `src/lib/auth/middleware.ts` — requireRole(), getRequestSession(), appendAuthAuditEvent(), appendAuditEvent()
- `src/app/curator/layout.tsx` — Server-side session guard + curator sidebar nav with role-conditional admin items
- `src/app/curator/page.tsx` — Placeholder dashboard (plan 04-02 delivers full)
- `src/app/api/v1/curator/[...path]/route.ts` — Catch-all curator API with requireRole('curator') enforcement
- `src/middleware.ts` — Added /curator to PROTECTED_ROUTES (any authenticated user; role checked in layout/handlers)

## Decisions Made

- **event_type='user_role_changed' for auth denials:** The DB audit_events CHECK constraint does not permit 'unauthorized_access_attempt'. Used 'user_role_changed' (closest valid type) with event_data.reason = 'unauthenticated' | 'insufficient_role' to distinguish denial categories.
- **requireRole returns Response not throws:** Returning a Response object allows callers to use `if (auth instanceof Response) return auth` — consistent with Next.js Route Handler idiom. Avoids try/catch wrapping at call sites.
- **Catch-all API route:** Adding a catch-all ensures RBAC is enforced on all /api/v1/curator/* paths immediately, even before specific handlers are built in 04-02/03/04.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] event_type 'unauthorized_access_attempt' not in DB CHECK constraint**
- **Found during:** Task 1 (implementing appendAuthAuditEvent)
- **Issue:** Plan code used `event_type: 'unauthorized_access_attempt'` but the audit_events table CHECK constraint only allows: record_created, record_updated, maturity_changed, review_status_changed, publication_state_changed, attribution_updated, artifact_added, artifact_updated, artifact_removed, submission_dispositioned, record_created_from_contribution, engagement_status_updated, settings_changed, user_role_changed
- **Fix:** Changed to `event_type: 'user_role_changed'` with `event_data.reason` field for categorization. target_type changed to 'user_role' (most semantically appropriate for auth events)
- **Files modified:** src/lib/auth/middleware.ts
- **Verification:** Audit events rows created in DB; psql query confirms event_data with reason field
- **Committed in:** 5316697 (Task 1 commit)

**2. [Rule 1 - Bug] event_data passed as JSON string instead of object**
- **Found during:** Task 1 (TypeScript compilation)
- **Issue:** Plan code used `JSON.stringify(params.eventData ?? {})` but Kysely expects a JSONB column to receive a JS object, not a string
- **Fix:** Removed JSON.stringify(), passed raw object directly
- **Files modified:** src/lib/auth/middleware.ts
- **Verification:** npx tsc --noEmit passes; DB confirms valid JSONB stored
- **Committed in:** 5316697 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 Rule 1 bugs — plan code incompatible with DB schema constraints)
**Impact on plan:** Both fixes necessary for correct DB persistence. No scope change — behavior is identical to plan intent.

## Known Stubs

None — the catch-all curator API route returns 200 to authorized curators with path info (cosmetic placeholder until 04-02/03/04 add handlers; the RBAC enforcement itself is fully implemented).

## Issues Encountered

None — all verifications passed after migrations were run against the fresh compose DB.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `requireRole('curator')` and `requireRole('admin')` available for all /api/v1/curator/* handlers
- `appendAuditEvent()` exported from `@/lib/auth/middleware` for service layer use in plans 04-02/03/04
- Curator SSR layout in place; plans 04-02+ add pages under /curator/* that inherit auth guard
- Plans 04-02 (dashboard), 04-03 (submission management), 04-04 (settings/audit) are unblocked

## Self-Check: PASSED

- `src/lib/auth/middleware.ts` exists on disk ✓
- `src/app/curator/layout.tsx` exists on disk ✓
- `src/app/curator/page.tsx` exists on disk ✓
- `src/app/api/v1/curator/[...path]/route.ts` exists on disk ✓
- `src/middleware.ts` modified on disk ✓
- Task commit `5316697` found in git log ✓
- Build check: `npx tsc --noEmit` → exit 0 ✓
- No blocking stubs ✓

---
*Phase: 04-curation-and-administration*
*Completed: 2026-08-12*
