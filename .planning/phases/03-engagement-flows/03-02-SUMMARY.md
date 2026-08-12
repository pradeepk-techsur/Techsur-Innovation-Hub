---
phase: 03-engagement-flows
plan: "02"
subsystem: ui
tags: [zod, rate-limiting, next.js, forms, playwright, opportunity-submission, f6]

# Dependency graph
requires:
  - phase: 03-engagement-flows
    plan: "01"
    provides: getSession, StakeholderSession, middleware route protection for /submit-opportunity
  - phase: 01-foundation
    provides: opportunity_submissions table, OpportunitySubmissionsTable Kysely type

provides:
  - POST /api/v1/submissions/opportunity — Zod validation, 5/IP/hr rate limit, DB persistence
  - /submit-opportunity SSR page — session-protected, F6.4 non-acceptance banner
  - OpportunityForm — 3-step client form starting with problem description (F6.1, F6.2, F6.3, F6.4)
  - /submit-opportunity/confirmation — reference number display + F6.4 non-acceptance restatement
  - submissions.service.ts — shared checkRateLimit() and generateReferenceNumber() helpers
  - e2e/opportunity-submission.spec.ts — 5 Playwright tests, all passing

affects:
  - 03-03 (contribution submission — can reuse checkRateLimit and generateReferenceNumber)
  - 03-04 (engagement request — can reuse checkRateLimit)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Zod schema validation for API request body (OpportunitySchema)
    - In-memory rate limiter with Map<string, { count, resetAt }> — production slot for Redis
    - Sequential reference number generation (OPP-YYYY-NNN) via DB count
    - Multi-step form with useState step management and Back/Next navigation
    - Next.js 15 async searchParams in server components (Promise<{ref?: string}>)

key-files:
  created:
    - src/app/api/v1/submissions/opportunity/route.ts
    - src/lib/services/submissions.service.ts
    - src/app/(public)/submit-opportunity/page.tsx
    - src/app/(public)/submit-opportunity/OpportunityForm.tsx
    - src/app/(public)/submit-opportunity/confirmation/page.tsx
    - e2e/opportunity-submission.spec.ts
  modified: []

key-decisions:
  - "In-memory rate limiter for dev (production: Redis-backed Map replacement annotated in submissions.service.ts)"
  - "generateReferenceNumber uses DB count for sequential numbers — safe for dev load, not atomic at scale (noted)"
  - "F6.4 non-acceptance appears in 3 places: intro banner, required Step 3 checkbox, confirmation page"

patterns-established:
  - "OpportunityForm 3-step pattern: Step 1 (problem) → Step 2 (context) → Step 3 (submitter info + acknowledgments)"
  - "Confirmation page uses async searchParams (Next.js 15 requirement) to read ref query param"

# Metrics
duration: 8min
completed: 2026-08-11
---

# Phase 3 Plan 02: Opportunity Submission Flow Summary

**Multi-step F6 opportunity submission form (problem-first, not solution-first) with Zod-validated rate-limited POST API, DB persistence, and OPP-YYYY-NNN reference number; F6.4 non-acceptance language appears in intro banner, required Step 3 checkbox, and confirmation page**

## Performance

- **Duration:** 8 min
- **Started:** 2026-08-11T18:18:32Z
- **Completed:** 2026-08-11T18:26:57Z
- **Tasks:** 2 completed
- **Files modified:** 6

## Accomplishments

- POST /api/v1/submissions/opportunity with Zod validation (OpportunitySchema), 5/IP/hr rate limiting (SEC-06), and DB persistence returning OPP-YYYY-NNN reference number (F6.5)
- Multi-step form starting with problem description step (F6.1) — placeholder explicitly says "mission problem or friction"
- Non-acceptance language in 3 locations: intro banner (`role="note"`), required checkbox in Step 3, and confirmation page (F6.4)
- All 5 Playwright E2E tests pass: F6.1, F6.3, F6.4, AUTH-09, F6.5

## Task Commits

Each task was committed atomically:

1. **Task 1: Opportunity submission API** - `fc0eb81` (feat)
2. **Task 2: Submission page, form, and confirmation** - `b96f833` (feat)

**Plan metadata:** `(to be committed with SUMMARY.md)`

## Files Created/Modified

- `src/app/api/v1/submissions/opportunity/route.ts` - POST endpoint: Zod validation, rate limit, DB insert, referenceNumber response
- `src/lib/services/submissions.service.ts` - checkRateLimit() and generateReferenceNumber() shared helpers
- `src/app/(public)/submit-opportunity/page.tsx` - SSR page: getSession() redirect guard + F6.4 intro banner
- `src/app/(public)/submit-opportunity/OpportunityForm.tsx` - 3-step client form with step progress, Back/Next navigation
- `src/app/(public)/submit-opportunity/confirmation/page.tsx` - Confirmation with ref number + F6.4 restatement
- `e2e/opportunity-submission.spec.ts` - 5 Playwright tests covering F6.1, F6.3, F6.4, AUTH-09, F6.5

## Decisions Made

- **In-memory rate limiter for dev:** submissions.service.ts uses Map for rate limiting with a comment marking the Redis replacement slot for production (SEC-06 compliant for dev).
- **F6.4 non-acceptance in 3 places:** intro banner, required checkbox (cannot submit without it), and confirmation page — satisfies the "visible on form and confirmation" must-have.
- **Next.js 15 async searchParams:** confirmation/page.tsx uses `await searchParams` (Promise) per Next.js 15 requirement, consistent with 03-01 login page pattern.

## Known Stubs

- `src/lib/services/submissions.service.ts` — In-memory rate limiter (production: Redis-backed) — **Cosmetic**: dev rate limiting fully functional; Redis replacement is Phase 5 operational readiness work.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed placeholder text to include 'mission problem' for F6.1 E2E test**
- **Found during:** Task 2 (Playwright test execution)
- **Issue:** The textarea placeholder was "Describe what you or your users experience today — the friction, gap, or mission need — not a proposed solution..." which did not contain the words "mission problem" as searched by `getByPlaceholder(/mission problem/i)` in the F6.1 test
- **Fix:** Updated placeholder to "Describe the mission problem or friction your users experience today — not a proposed solution or application."
- **Files modified:** `src/app/(public)/submit-opportunity/OpportunityForm.tsx`
- **Verification:** F6.1 Playwright test passes
- **Committed in:** b96f833 (Task 2 commit)

**2. [Rule 1 - Bug] Fixed Next button selector ambiguity in F6.5 E2E test**
- **Found during:** Task 2 (Playwright test execution)
- **Issue:** `getByRole('button', { name: /next/i })` matched both the form "Next" button AND the "Open Next.js Dev Tools" button, causing strict mode violation
- **Fix:** Changed to `getByRole('button', { name: 'Next', exact: true })` for both step navigation clicks
- **Files modified:** `e2e/opportunity-submission.spec.ts`
- **Verification:** F6.5 Playwright test advances steps correctly
- **Committed in:** b96f833 (Task 2 commit)

**3. [Rule 1 - Bug] Fixed label selectors for Step 3 checkbox assertions**
- **Found during:** Task 2 (Playwright test execution)
- **Issue:** Test used `/non.*acceptance/i` and `/consent to contact/i` but actual label text is "I understand that submitting this form does not imply acceptance..." and "I consent to I&R contacting me..."
- **Fix:** Updated to `/does not imply acceptance/i` and `/consent to.*contacting/i`
- **Files modified:** `e2e/opportunity-submission.spec.ts`
- **Verification:** F6.5 Playwright test checks Step 3 checkboxes successfully
- **Committed in:** b96f833 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 × Rule 1 - Bug)
**Impact on plan:** All fixes corrected mismatches between test selectors and actual rendered content. No scope creep. All planned features implemented as specified.

## Issues Encountered

- Playwright browsers not installed — auto-installed via `npx playwright install chromium` and `npx playwright install-deps chromium` (missing libnspr4.so system library) before tests ran successfully.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- F6 opportunity submission flow complete and E2E tested
- submissions.service.ts exports checkRateLimit() and generateReferenceNumber() — ready for reuse in 03-03 (innovation contribution) and 03-04 (engagement request)
- Phase 3 plans 03-03 and 03-04 can begin

## Self-Check: PASSED

- All 6 key files exist on disk ✓
- Both task commits found (fc0eb81, b96f833) ✓
- Build check: `npx tsc --noEmit` → exit 0 ✓
- No blocking stubs (1 cosmetic in-memory rate limiter stub noted) ✓
- `## Known Stubs` section present with no blocking entries ✓

---
*Phase: 03-engagement-flows*
*Completed: 2026-08-11*
