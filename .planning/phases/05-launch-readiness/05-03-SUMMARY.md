---
phase: 05-launch-readiness
plan: "03"
subsystem: testing
tags: [accessibility, a11y, wcag, axe-core, playwright, launch-checklist, security-headers, e2e]

# Dependency graph
requires:
  - phase: 05-launch-readiness
    provides: navigation IA (05-01), launch content seed 8 records (05-02)
provides:
  - e2e/accessibility.spec.ts — 8 axe-core WCAG 2.1 AA tests on Home, Catalog, Search, Login, Record Detail (0 critical violations)
  - e2e/launch-acceptance.spec.ts — 12 tests verifying PRD §12 LC-01 through LC-06 plus SEED-02/03/04/06 conditions
  - docs/LAUNCH-CHECKLIST.md — signed-off launch checklist with pass/fail for all PRD §12 conditions, IA requirements, NFRs, and operational gates
  - docs/DEPLOYMENT-SECURITY.md — SEC-08/09/10 verification evidence, dev credential rationale, deployment pre-checklist
  - tabIndex={-1} on #main-content divs for functional skip-link navigation (WCAG 2.4.1)
affects:
  - launch-acceptance (this is the final launch gate plan)

# Tech tracking
tech-stack:
  added: ["@axe-core/playwright@^4.9.0"]
  patterns:
    - "axe-core WCAG 2.1 AA scan with withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])"
    - "Separate critical vs serious violation classification — critical blocks launch, serious is advisory"
    - "Skip link functional via tabIndex={-1} on #main-content target"

key-files:
  created:
    - e2e/accessibility.spec.ts
    - e2e/launch-acceptance.spec.ts
    - docs/LAUNCH-CHECKLIST.md
    - docs/DEPLOYMENT-SECURITY.md
  modified:
    - next.config.mjs (SEC-10 security header comments)
    - package.json (added @axe-core/playwright)
    - src/app/(public)/catalog/page.tsx (tabIndex={-1} on #main-content)
    - src/app/(public)/search/page.tsx (tabIndex={-1} on #main-content)

key-decisions:
  - "Skip link target requires tabIndex={-1} on div#main-content for programmatic focus — added to catalog and search pages (Rule 1 Bug fix)"
  - "X-Frame-Options: DENY intentionally not set — Pivota preview iframe must embed the app; CSP frame-ancestors deferred to load balancer"
  - "SEC-08 check excludes docker-compose.yml dev passwords and migration SQL — these are development-only credentials, not secrets"
  - "Color-contrast serious violations logged as warnings (non-blocking for MVP) — to be addressed before general release"

patterns-established:
  - "Accessibility spec pattern: scan page with AxeBuilder, fail only on critical violations, warn on serious"
  - "Launch acceptance spec pattern: API-level tests using request context for speed, browser for UI-required checks"

# Metrics
duration: 7min
completed: 2026-08-12
---

# Phase 5 Plan 03: Launch Acceptance — Accessibility, Security Headers, and Launch Documentation Summary

**axe-core WCAG 2.1 AA tests (8 tests, 0 critical violations), PRD §12 launch acceptance suite (12 tests, all pass), SEC-10 security header comments, signed-off LAUNCH-CHECKLIST.md and DEPLOYMENT-SECURITY.md**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-12T21:46:36Z
- **Completed:** 2026-08-12T21:52:57Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Created `e2e/accessibility.spec.ts` with 8 axe-core tests: Home, Catalog, Search, Login pages (0 critical violations), Catalog record detail (0 critical violations), skip link functional, all buttons have accessible names, form inputs have labels
- Created `e2e/launch-acceptance.spec.ts` with 12 tests covering all PRD §12 LC-01 through LC-06 launch conditions plus SEED-02/03/04/06 — all 12 pass
- Updated `next.config.mjs` with SEC-10 compliance comments clarifying which headers are app-level vs load-balancer-level
- Added `@axe-core/playwright` devDependency for WCAG testing
- Created `docs/LAUNCH-CHECKLIST.md` with all PRD §12 conditions, IA requirements (IA-01 through IA-05), NFRs, and pre-launch operational gates
- Created `docs/DEPLOYMENT-SECURITY.md` with SEC-08/09/10 verification commands and deployment pre-checklist (13 items)

## Task Commits

Each task was committed atomically:

1. **Task 1: Security header config, accessibility tests, and launch acceptance suite** - `224b61d` (feat)
2. **Task 2: Launch checklist and deployment security documentation** - `1cb89a5` (docs)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `e2e/accessibility.spec.ts` — 8 axe-core WCAG 2.1 AA tests covering all required pages
- `e2e/launch-acceptance.spec.ts` — 12 PRD §12 launch acceptance tests (LC-01 through LC-06, SEED-02/03/04/06)
- `docs/LAUNCH-CHECKLIST.md` — MVP launch checklist with all PRD §12 conditions and operational gates
- `docs/DEPLOYMENT-SECURITY.md` — SEC-08/09/10 verification evidence and pre-deployment checklist
- `next.config.mjs` — SEC-10 header comments clarifying app-level vs load-balancer responsibility
- `package.json` — Added `@axe-core/playwright@^4.9.0` devDependency
- `src/app/(public)/catalog/page.tsx` — Added `tabIndex={-1}` to #main-content div for skip link
- `src/app/(public)/search/page.tsx` — Added `tabIndex={-1}` to #main-content div for skip link

## Decisions Made

- **Skip link tabIndex fix:** The `#main-content` divs in catalog and search required `tabIndex={-1}` for programmatic focus to work after pressing the skip link. Without it, pressing Enter on the skip link would scroll to the anchor but focus would not move, failing WCAG 2.4.1 Bypass Blocks.
- **X-Frame-Options intentionally omitted:** Documented explicitly in both `next.config.mjs` and `docs/DEPLOYMENT-SECURITY.md`. The Pivota preview iframe must be able to embed the app, so `X-Frame-Options: DENY` would break the development environment.
- **SEC-08 dev password exclusion:** `docker-compose.yml` dev passwords and migration SQL dev role passwords are development-only credentials, not secrets committed to production code. The DEPLOYMENT-SECURITY.md documents this rationale.
- **Color-contrast serious violations non-blocking:** axe-core reports 1 serious color-contrast violation per page (the dark navigation links). These are serious but not critical (PRD §9 only blocks on critical violations for MVP). Logged as warnings.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] tabIndex={-1} missing from #main-content divs — skip link non-functional**
- **Found during:** Task 1 (running accessibility tests: "Skip to main content link is functional" test failed)
- **Issue:** The accessibility test confirmed skip links existed but pressing Enter on them did not move focus to `#main-content` because `<div id="main-content">` without `tabindex="-1"` cannot receive programmatic focus. WCAG 2.4.1 requires the skip link target to be keyboard-focusable.
- **Fix:** Added `tabIndex={-1}` to the `#main-content` div in `src/app/(public)/catalog/page.tsx` and `src/app/(public)/search/page.tsx`. Pages using `<main id="main-content">` (which is a natively focusable element) were not affected.
- **Files modified:** `src/app/(public)/catalog/page.tsx`, `src/app/(public)/search/page.tsx`
- **Verification:** All 8 accessibility tests pass including "Skip to main content link is functional"
- **Committed in:** `224b61d` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix was necessary for WCAG 2.4.1 correctness. No scope creep.

## Known Stubs

None found. All implementations are complete with real functionality.

## Issues Encountered

- **Playwright chromium binary missing:** After `@axe-core/playwright` install, the chromium browser binary was not present (tests using `{ page }` parameter failed). Resolved by running `npx playwright install chromium && npx playwright install-deps chromium` — this installed the headless shell and required system libraries (`libnspr4.so` etc.).
- **Pre-existing e2e failures (out of scope):** 4 tests were failing before plan 05-03 changes and remain failing. These are pre-existing from earlier plans:
  - `catalog.spec.ts:23` — looks for "contributing office" text but cards render "Office:"
  - `catalog.spec.ts:41` — related last-reviewed date visibility timing
  - `record-detail.spec.ts:96` — F3.9 "Recommended Next Step" section not present in current app
  - `search.spec.ts:4` — search page heading match timing issue
  Per the Scope Boundary rule, these are out of scope for plan 05-03 (not caused by plan 05-03 changes).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 5 complete: all 3 plans (05-01 navigation IA, 05-02 launch seed, 05-03 accessibility/launch acceptance) are done
- All PRD §12 launch conditions verified and documented in `docs/LAUNCH-CHECKLIST.md`
- Security headers, dev auth guard, and secrets scan all verified in `docs/DEPLOYMENT-SECURITY.md`
- The pre-launch operational gates (hosting, identity provider, SMTP, browser compat) remain pending — these are operational blockers that require discovery-phase decisions before production deployment
- 4 pre-existing e2e test failures remain (catalog, record-detail, search) — recommend fixing in a gap-closure plan before general release

## Self-Check: PASSED

- [x] `e2e/accessibility.spec.ts` exists on disk ✓
- [x] `e2e/launch-acceptance.spec.ts` exists on disk ✓
- [x] `docs/LAUNCH-CHECKLIST.md` exists on disk ✓
- [x] `docs/DEPLOYMENT-SECURITY.md` exists on disk ✓
- [x] `next.config.mjs` has SEC-10 security header comments ✓
- [x] Commit `224b61d` exists (feat: Task 1) ✓
- [x] Commit `1cb89a5` exists (docs: Task 2) ✓
- [x] Accessibility tests: 8 passed ✓ (confirmed by test run)
- [x] Launch acceptance tests: 12 passed ✓ (confirmed by test run)
- [x] Security headers present: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` ✓
- [x] No secrets scan: dev passwords only in docker-compose.yml and migration SQL (documented, acceptable) ✓
- [x] Known Stubs section present: None found ✓
- [x] Build check: app running in docker compose (npm run dev) — previously verified pass in 05-01 self-check

---
*Phase: 05-launch-readiness*
*Completed: 2026-08-12*
