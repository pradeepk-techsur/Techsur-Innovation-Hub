---
phase: 05-launch-readiness
plan: "01"
subsystem: ui
tags: [navigation, ia, breadcrumbs, auth, playwright, e2e]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: catalog page, record detail page, public layout
  - phase: 02-discovery
    provides: search page
  - phase: 03-engagement-flows
    provides: login page, submit-opportunity, submit-contribution, auth session
  - phase: 04-curation-and-administration
    provides: curator routes, RBAC middleware
provides:
  - docs/NAVIGATION-MAP.md — complete route inventory with nav parents, auth requirements, implementing plans
  - src/components/Breadcrumb.tsx — shared breadcrumb component (existed, enhanced)
  - e2e/navigation-ia.spec.ts — 9 Playwright tests covering IA-01, IA-02, IA-04, IA-05
  - Breadcrumbs on all non-home pages (catalog, record detail, search, login, submit-opportunity, submit-contribution)
  - Auth-state nav (Sign In/Sign Out/user name/Curator link) on all public pages including home
affects:
  - 05-02 onwards (IA completeness gate — all nav links verified)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Breadcrumb component with light variant for dark backgrounds"
    - "Route group (public) layout with server-side auth-state nav"
    - "E2E navigation spec pattern: iterate routes array, check for no 404/500"

key-files:
  created:
    - docs/NAVIGATION-MAP.md
    - e2e/navigation-ia.spec.ts
    - src/app/(public)/page.tsx (moved from src/app/page.tsx)
  modified:
    - src/app/(public)/submit-opportunity/page.tsx (added Breadcrumb)
    - src/app/(public)/submit-contribution/page.tsx (added Breadcrumb)

key-decisions:
  - "Moved home page from src/app/page.tsx to src/app/(public)/page.tsx so it inherits auth-state nav (IA-05 requirement)"
  - "E2E spec uses page.request.post for session setup (same pattern as existing specs)"
  - "Breadcrumb light prop used on dark-background hero sections"

patterns-established:
  - "Route inventory in docs/NAVIGATION-MAP.md is the canonical reference for all routes"
  - "All public pages including home use (public)/layout.tsx for auth-state nav"
  - "Navigation E2E spec iterates route arrays to catch dead links systematically"

# Metrics
duration: 10min
completed: 2026-08-12
---

# Phase 5 Plan 01: Navigation IA Completeness Gate Summary

**Navigation IA gate: docs/NAVIGATION-MAP.md, breadcrumbs on all non-home public pages, auth-state Sign In/Sign Out nav on all pages, and 9 Playwright tests verifying no dead links**

## Performance

- **Duration:** 10 min
- **Started:** 2026-08-12T21:32:48Z
- **Completed:** 2026-08-12T21:43:23Z
- **Tasks:** 1 (plus 1 deviation fix)
- **Files modified:** 6 (2 created, 1 moved, 3 modified)

## Accomplishments

- Created `docs/NAVIGATION-MAP.md` with complete route inventory: all 9 public routes, 9 curator routes, and 11 API routes with nav parents, auth requirements, and implementing plans
- Added `Breadcrumb` to `submit-opportunity` and `submit-contribution` pages (catalog, record detail, search, and login already had it)
- Moved home page into `(public)` route group so it gets the auth-aware PublicLayout with Sign In/Sign Out nav (IA-05)
- Created `e2e/navigation-ia.spec.ts` with 9 Playwright tests covering all IA requirements
- All public routes return HTTP 200 or auth redirect (307) — none return 404 or 500

## Task Commits

Each task was committed atomically:

1. **Task 1: Navigation map, breadcrumb component, auth-state nav, and link audit** - `71cdf8b` (feat)
2. **[Rule 2 Fix] Home page moved to (public) route group** - `eb6db96` (fix)

**Plan metadata:** (see below — in docs commit)

## Files Created/Modified

- `docs/NAVIGATION-MAP.md` - Complete route inventory: 9 public, 9 curator, 11 API routes
- `e2e/navigation-ia.spec.ts` - 9 Playwright navigation tests (IA-01, IA-02, IA-04, IA-05)
- `src/app/(public)/page.tsx` - Home page moved here from root (inherits PublicLayout auth nav)
- `src/app/(public)/submit-opportunity/page.tsx` - Added Breadcrumb (Home → Submit an Opportunity)
- `src/app/(public)/submit-contribution/page.tsx` - Added Breadcrumb (Home → Share Innovation Work)

## Decisions Made

- Home page moved from `src/app/page.tsx` to `src/app/(public)/page.tsx` so it inherits the auth-aware PublicLayout. This ensures IA-05 (Sign In link visible when logged out) applies to the home page as well as all other public pages.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Home page outside (public) route group — no auth-state nav**
- **Found during:** Task 1 verification (checking Sign In link on home page)
- **Issue:** Home page at `src/app/page.tsx` used root layout only (no auth-state nav). The IA-05 requirement "logged-out header shows Sign In link" was not met for the home page.
- **Fix:** Moved `page.tsx` to `src/app/(public)/page.tsx`. In Next.js App Router, route groups (`(public)`) don't affect URLs — the page still serves `/` but now inherits `PublicLayout` with the auth-state header and footer.
- **Files modified:** `src/app/(public)/page.tsx` (created), `src/app/page.tsx` (deleted)
- **Verification:** `curl http://localhost:3000/` response RSC payload contains `/login` href and `Sign In` text
- **Committed in:** `eb6db96`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** The fix is necessary for IA-05 compliance. No scope creep — this is the exact behavior the plan requires.

## Known Stubs

None found. All implementations are complete with real functionality.

## Issues Encountered

- Docker compose app container lost network connectivity on initial start (Port 3000 conflict with pre-existing `next dev` process). Resolved by killing the stale process and running `docker compose up --build app` to recreate the container with the updated code.
- The `(public)/layout.tsx` was already implementing auth-state nav with `getSession()` from prior phases — no changes were needed to the layout itself.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- IA completeness gate passed: all nav links resolve, breadcrumbs present on all non-home public pages, auth-state nav on all pages
- `docs/NAVIGATION-MAP.md` is the canonical route reference for remaining Phase 5 work
- E2E spec `e2e/navigation-ia.spec.ts` ready for CI integration and verify-work phase
- Ready for 05-02 (next plan in phase 5)

## Self-Check: PASSED

- [x] `docs/NAVIGATION-MAP.md` exists on disk
- [x] `e2e/navigation-ia.spec.ts` exists on disk
- [x] `src/app/(public)/page.tsx` exists on disk (home page in public group)
- [x] `src/app/(public)/submit-opportunity/page.tsx` has Breadcrumb import and usage
- [x] `src/app/(public)/submit-contribution/page.tsx` has Breadcrumb import and usage
- [x] Commit `71cdf8b` exists (feat: nav map, breadcrumbs, E2E)
- [x] Commit `eb6db96` exists (fix: home page route group)
- [x] Build: `npm run build` → `✓ Compiled successfully` (exit 0)
- [x] TypeScript: `tsc --noEmit` passes (no errors)
- [x] All public routes return 200 or auth redirect (not 404/500)
- [x] Breadcrumb exported from `src/components/Breadcrumb.tsx`
- [x] Navigation map has ≥10 pipe characters (table rows)

---
*Phase: 05-launch-readiness*
*Completed: 2026-08-12*
