---
phase: 04-curation-and-administration
plan: "06"
subsystem: api
tags: [rbac, audit-log, curator, next.js, playwright, gap-closure, authorization]

# Dependency graph
requires:
  - phase: 04-curation-and-administration
    provides: "04-01: requireRole('admin'), getSession(), curator layout, audit_events table"
  - phase: 04-curation-and-administration
    provides: "04-04: SSR cookie forwarding pattern (reference/page.tsx)"

provides:
  - "GET /api/v1/curator/audit — paginated global audit log (admin-only, ip_address excluded)"
  - "src/app/curator/audit/page.tsx — SSR audit log page (admin-only, fetches API with cookie forwarding)"
  - "src/app/unauthorized/page.tsx — 403 Unauthorized page for authenticated non-curator users"
  - "src/app/curator/layout.tsx — RBAC split: !session→/login, wrong-role→/unauthorized"
  - "e2e/curator-audit-rbac-gaps.spec.ts — 8 Playwright regression tests covering both UAT gaps"

affects:
  - "Phase 5 (launch acceptance) — UAT Tests 5 and 6 now pass"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Two-branch RBAC layout: separate !session and wrong-role checks (not collapsed into one redirect)"
    - "Top-level /unauthorized page (outside /curator route tree) avoids redirect loop"
    - "IP redaction pattern: explicit column SELECT list excludes ip_address (T-04-06-01)"
    - "SSR cookie forwarding: audit/page.tsx follows reference/page.tsx pattern"

key-files:
  created:
    - src/app/api/v1/curator/audit/route.ts
    - src/app/curator/audit/page.tsx
    - src/app/unauthorized/page.tsx
    - e2e/curator-audit-rbac-gaps.spec.ts
  modified:
    - src/app/curator/layout.tsx

key-decisions:
  - "Unauthorized page placed at src/app/unauthorized/page.tsx (not /curator/unauthorized) to avoid infinite redirect loop — /curator route tree runs curator layout for all children"
  - "IP address excluded from global audit API via explicit SELECT column list (not wildcard) — same pattern as per-record audit"
  - "Playwright IP check uses #main-content innerText (not page.textContent('body')) to exclude RSC payload scripts that include 127.0.0.1 in x-forwarded-for debug data"

patterns-established:
  - "Auth split pattern: if (!session) redirect('/login'); if (wrong role) redirect('/unauthorized'); — not collapsed"
  - "Unauthorized page is always outside the restricted route tree to avoid redirect loops"

# Metrics
duration: 8min
completed: 2026-08-12
---

# Phase 4 Plan 06: Gap Closure (Audit Log + RBAC 403 Split) Summary

**Global audit log API and SSR page (admin-only, IP redacted), top-level /unauthorized 403 page, and curator layout RBAC split closing UAT Tests 5 (blocker) and 6 (minor)**

## Performance

- **Duration:** 8 min
- **Started:** 2026-08-12T14:59:34Z
- **Completed:** 2026-08-12T15:07:38Z
- **Tasks:** 2 completed
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments

- Created `GET /api/v1/curator/audit` — paginated global audit log, `requireRole('admin')`, explicit SELECT excludes `ip_address` (T-04-06-01)
- Created `src/app/curator/audit/page.tsx` — SSR Server Component fetching via cookie forwarding; resolves "Audit Log" sidebar link 404 (Gap 1 blocker)
- Created `src/app/unauthorized/page.tsx` — "Access Restricted" page with HTTP 403 messaging, placed at top-level to avoid redirect loop
- Fixed `src/app/curator/layout.tsx` RBAC split: `!session` → `/login?returnTo=/curator`; wrong-role → `/unauthorized` (Gap 2 minor)
- Added `e2e/curator-audit-rbac-gaps.spec.ts` — 8 Playwright tests; all pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Global audit log API + page, and unauthorized page** - `8cdb766` (feat)
2. **Task 2: Fix layout.tsx RBAC split + Playwright regression** - `b631e8b` (feat)

**Plan metadata:** (committed with SUMMARY.md)

## Files Created/Modified

- `src/app/api/v1/curator/audit/route.ts` — GET paginated global audit log (admin-only, ip_address excluded)
- `src/app/curator/audit/page.tsx` — SSR audit log page, cookie forwarding to API
- `src/app/unauthorized/page.tsx` — "Access Restricted" 403 page, Return to Hub link, top-level route
- `src/app/curator/layout.tsx` — RBAC split: unauthenticated→login, wrong-role→/unauthorized
- `e2e/curator-audit-rbac-gaps.spec.ts` — 8 Playwright regression tests (Gap 1 + Gap 2)

## Decisions Made

- **Top-level /unauthorized page:** Placing the unauthorized page at `src/app/unauthorized/page.tsx` (not `src/app/curator/unauthorized/page.tsx`) prevents infinite redirect loop — the curator layout fires for all `/curator/*` children including `/curator/unauthorized`, so putting it inside the curator tree would cause a loop.
- **IP redaction via explicit SELECT:** The `ip_address` column is simply absent from the Kysely `.select([...])` call. This is the same pattern as the per-record audit route (04-04).
- **Playwright IP check scoped to #main-content:** Using `innerText` on the `#main-content` element (not `page.textContent('body')`) avoids false positives from the Next.js RSC debug payload, which includes `127.0.0.1` from the `x-forwarded-for` header in its server component tracing data.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Playwright browser (Chromium) not installed**
- **Found during:** Task 2 (running Playwright regression spec)
- **Issue:** `npx playwright test` failed with "Executable doesn't exist" — browser not installed in sandbox
- **Fix:** Ran `npx playwright install chromium` + `npx playwright install-deps chromium` (installed libnspr4.so and other system deps)
- **Files modified:** None (system installation)
- **Verification:** All 8 tests passed after installation
- **Committed in:** Not committed (tooling installation)

**2. [Rule 1 - Bug] Database not running — API returned 500**
- **Found during:** Task 2 (running Playwright tests with DB calls)
- **Issue:** Docker compose volume was fresh (no prior data); `tsio_hub_app` role did not exist → 500 on all DB queries
- **Fix:** Ran `npm run db:migrate` and `npm run db:seed` with correct env vars
- **Files modified:** None
- **Verification:** API returned 200 after migration + seed
- **Committed in:** Not committed (operational fix)

**3. [Rule 1 - Bug] Playwright IP test matched RSC payload `127.0.0.1`**
- **Found during:** Task 2 (test 3 of Playwright spec)
- **Issue:** `page.textContent('body')` includes Next.js RSC debug scripts which contain `x-forwarded-for: 127.0.0.1` in the server component tracing JSON — causing false positive IP match
- **Fix:** Changed to `page.locator('#main-content').innerText()` to check only visible rendered content
- **Files modified:** e2e/curator-audit-rbac-gaps.spec.ts
- **Verification:** All 8 tests pass with correct IP check scope
- **Committed in:** b631e8b (Task 2 commit, updated spec before final commit)

---

**Total deviations:** 3 auto-fixed (1 blocking dependency, 1 bug/operational, 1 test bug)
**Impact on plan:** All auto-fixes were necessary for correct test execution. No scope change — plan objectives achieved as specified.

## Known Stubs

None — all API handlers perform real DB operations. The audit page fetches live data. The unauthorized page is a static 403 page (intentionally no DB queries needed).

## Issues Encountered

None — all verifications passed after the three auto-fixes above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 4 complete: all 10 UAT tests pass (Tests 5 and 6 fixed by this plan)
- UAT Test 5 (blocker): `/curator/audit` loads with audit event table, no 404 ✓
- UAT Test 6 (minor): Stakeholder → `/unauthorized` (not `/login`) ✓
- Phase 5 (Launch Acceptance) can proceed without outstanding blockers

---
*Phase: 04-curation-and-administration*
*Completed: 2026-08-12*

## Self-Check: PASSED

- `src/app/api/v1/curator/audit/route.ts` exists on disk ✓
- `src/app/curator/audit/page.tsx` exists on disk ✓
- `src/app/unauthorized/page.tsx` exists on disk ✓
- `src/app/curator/layout.tsx` has split RBAC check ✓
- `e2e/curator-audit-rbac-gaps.spec.ts` exists on disk ✓
- Task 1 commit `8cdb766` found in git log ✓
- Task 2 commit `b631e8b` found in git log ✓
- Build check: `npm run build` → exit 0 ✓
- TypeScript check: `npx tsc --noEmit` → exit 0 ✓
- Playwright tests: 8/8 pass ✓
- No blocking stubs ✓
- ip_address not in SELECT clause (only in comment) ✓
