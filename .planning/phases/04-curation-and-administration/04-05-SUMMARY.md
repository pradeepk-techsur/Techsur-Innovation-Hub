---
phase: 04-curation-and-administration
plan: "05"
subsystem: ui
tags: [next.js, ssr, cookies, playwright, curator]

# Dependency graph
requires:
  - phase: 04-curation-and-administration
    provides: curator SSR pages, curator API routes, records service
provides:
  - Cookie-forwarding SSR fix in curator dashboard page
  - Cookie-forwarding SSR fix in curator record list page
  - Cookie-forwarding SSR fix in curator record editor page
  - problem_statement field in new record form (UAT Gap 2)
  - problem_statement accepted + persisted by API route and service
  - Playwright regression spec for all three SSR curator pages
affects:
  - curator page loads
  - record creation with problem_statement
  - Playwright test suite

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SSR cookie forwarding: import { cookies } from 'next/headers'; cookieHeader forwarded in loopback fetch headers"
    - "Playwright e2e regression spec for authenticated SSR pages"

key-files:
  created:
    - e2e/curator-cookie-forwarding.spec.ts
  modified:
    - src/app/curator/page.tsx
    - src/app/curator/records/page.tsx
    - src/app/curator/records/[id]/page.tsx
    - src/app/curator/records/new/page.tsx
    - src/app/api/v1/curator/records/route.ts
    - src/lib/services/records.service.ts

key-decisions:
  - "Applied cookies() from next/headers pattern (already established in reference/page.tsx) to all three remaining SSR curator pages that were missing cookie forwarding"
  - "problem_statement field added as optional textarea in new record form — submitted with POST body and persisted by service"

patterns-established:
  - "SSR loopback fetch pattern: await cookies().toString() → { Cookie: cookieHeader } in fetch headers"

# Metrics
duration: 3min
completed: "2026-08-12"
---

# Phase 4 Plan 05: Curator SSR Cookie Forwarding & Problem Statement Field Summary

**Cookie forwarding fix for three curator SSR pages (dashboard, record list, record editor) and problem_statement textarea added to new record form, with 4-test Playwright regression spec covering all three SSR page loads and the new form field**

## Performance

- **Duration:** 3 min
- **Started:** 2026-08-12T05:54:11Z
- **Completed:** 2026-08-12T05:58:08Z
- **Tasks:** 2
- **Files modified:** 6 files modified, 1 file created (7 total)

## Accomplishments

- Fixed cookie forwarding in `getDashboardData()` — curators now see live dashboard counts instead of "Dashboard data unavailable"
- Fixed cookie forwarding in `getRecords()` — curators now see the record list instead of "Failed to load records"
- Fixed cookie forwarding in `getRecord()` — curators navigating to `/curator/records/[id]` now see the RecordEditor with LifecycleActionsPanel instead of a Next.js 404
- Added `problem_statement` textarea to new record form (UAT Gap 2) — included in POST body and persisted by the service
- Created `e2e/curator-cookie-forwarding.spec.ts` with 4 Playwright tests covering all three SSR page loads and the new form field — all 4 tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix cookie forwarding in getDashboardData() and getRecords(); add problem_statement to new record form** - `dfa7c57` (feat)
2. **Task 2: Fix cookie forwarding in getRecord(); add Playwright regression spec** - `0ad6ce8` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/app/curator/page.tsx` — Added `import { cookies }` + `cookieHeader` forwarding in `getDashboardData()`
- `src/app/curator/records/page.tsx` — Added `import { cookies }` + `cookieHeader` forwarding in `getRecords()`
- `src/app/curator/records/[id]/page.tsx` — Added `import { cookies }` + `cookieHeader` forwarding in `getRecord()`
- `src/app/curator/records/new/page.tsx` — Added `problemStatement` state, textarea field, and updated POST body to include `problem_statement`
- `src/app/api/v1/curator/records/route.ts` — Extract `problem_statement` from POST body; pass `problemStatement` to `createRecord()`
- `src/lib/services/records.service.ts` — Add `problemStatement?: string` param to `createRecord()`; persist `params.problemStatement ?? ''` to DB
- `e2e/curator-cookie-forwarding.spec.ts` — 4-test Playwright regression spec: dashboard loads, record list loads, record editor loads, new form has problem_statement textarea

## Decisions Made

- Applied the same `cookies() from next/headers` pattern already established in `src/app/curator/reference/page.tsx` to the three remaining SSR curator pages
- `problem_statement` field added as optional (not required at creation) to reduce friction; field can be completed in the record editor
- Playwright spec uses `page.request.post('/api/auth/login', { data: { role: 'curator' } })` in `beforeEach`, matching the existing stakeholder test pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm install required before tsc and playwright could run**
- **Found during:** Task 1 (TypeScript verification)
- **Issue:** `node_modules` directory absent in sandbox; `./node_modules/.bin/tsc` not found
- **Fix:** Ran `npm install --include=dev` to install all dependencies including devDependencies
- **Files modified:** node_modules (not committed), package-lock.json (no change)
- **Verification:** `./node_modules/.bin/tsc --noEmit` exited 0
- **Committed in:** Not committed separately (devDependency install is environment setup)

**2. [Rule 3 - Blocking] Playwright system library dependencies missing**
- **Found during:** Task 2 (Playwright test run)
- **Issue:** `libnspr4.so: cannot open shared object file: No such file or directory` — chromium headless shell missing system libs
- **Fix:** Ran `playwright install-deps chromium` to install required system packages
- **Files modified:** System packages (not committed)
- **Verification:** All 4 Playwright tests passed after deps installed
- **Committed in:** Environment setup, not committed

---

**Total deviations:** 2 auto-fixed (both Rule 3 - Blocking)
**Impact on plan:** Both auto-fixes were environment setup issues. No plan scope changes.

## Issues Encountered

None — all 8 plan verification criteria satisfied, all 4 Playwright tests passed (4 passed, 0 failed, 0 skipped).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three curator SSR pages now correctly forward session cookies to the curator API — authenticated curator workflows are fully functional
- `problem_statement` field is now available at record creation time, addressing UAT Gap 2
- Playwright regression spec provides permanent coverage for these bug-prone SSR authentication patterns
- Phase 4 complete (all 5 plans executed) — ready to proceed to Phase 5

---
*Phase: 04-curation-and-administration*
*Completed: 2026-08-12*

## Self-Check: PASSED

- [x] `src/app/curator/page.tsx` exists with cookies import
- [x] `src/app/curator/records/page.tsx` exists with cookies import
- [x] `src/app/curator/records/[id]/page.tsx` exists with cookies import
- [x] `src/app/curator/records/new/page.tsx` exists with problem_statement
- [x] `src/app/api/v1/curator/records/route.ts` extracts problem_statement
- [x] `src/lib/services/records.service.ts` accepts problemStatement param
- [x] `e2e/curator-cookie-forwarding.spec.ts` created with 4 tests
- [x] Commits dfa7c57 and 0ad6ce8 exist
- [x] TypeScript compilation: TSC OK
- [x] Playwright: 4 passed, 0 failed
