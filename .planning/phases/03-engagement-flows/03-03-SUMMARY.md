---
phase: 03-engagement-flows
plan: "03"
subsystem: ui
tags: [zod, rate-limiting, next.js, forms, playwright, contribution-submission, f7, attribution]

# Dependency graph
requires:
  - phase: 03-engagement-flows
    plan: "01"
    provides: getSession, StakeholderSession, middleware route protection for /submit-contribution
  - phase: 03-engagement-flows
    plan: "02"
    provides: checkRateLimit, generateReferenceNumber from submissions.service.ts
  - phase: 01-foundation
    provides: innovation_contributions table (001_initial_schema.sql), InnovationContributionsTable Kysely type

provides:
  - POST /api/v1/submissions/contribution — Zod validation, 5/IP/hr rate limit (SEC-06 shared), DB persistence
  - /submit-contribution SSR page — session-protected, distinct from /submit-opportunity (F7.1)
  - ContributionForm — 2-step form with required attribution fields and non-endorsement checkbox (F7.3, F7.4)
  - /submit-contribution/confirmation — CONTRIB-YYYY-NNN reference number + non-endorsement language (F7.4)
  - e2e/contribution-submission.spec.ts — 5 Playwright tests, all passing

affects:
  - 04 (Phase 4 curator workflow — source_contribution_id links curation to original attribution)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Two-step contribution form: Step 1 (about the work) → Step 2 (attribution + contact)
    - F7.4 non-endorsement in 3 locations: intro banner (role=note), required Step 2 checkbox, confirmation page
    - Attribution-preserving fields (contributingOffice, contributorNames, currentOwner) labeled as permanent and public
    - Shared rate limiter (checkRateLimit(ip, 'submission')) used by both opportunity and contribution submissions

key-files:
  created:
    - src/app/api/v1/submissions/contribution/route.ts
    - src/app/(public)/submit-contribution/page.tsx
    - src/app/(public)/submit-contribution/ContributionForm.tsx
    - src/app/(public)/submit-contribution/confirmation/page.tsx
    - e2e/contribution-submission.spec.ts
  modified: []

key-decisions:
  - "Two-step form (not three): Step 1 captures work description; Step 2 captures attribution + contact — simpler than F6's 3-step, appropriate for contribution detail level"
  - "Non-endorsement language in 3 places: intro role=note banner, required checkbox in Step 2, and confirmation page — satisfies F7.4 visibility requirement"
  - "Attribution fields (contributing office, contributor names, current owner) labeled with 'preserved for attribution' to set user expectations that this data is immutable once submitted"

patterns-established:
  - "ContributionForm 2-step pattern: Step 1 (work) → Step 2 (attribution + acknowledgments)"
  - "CONTRIB-YYYY-NNN reference number via generateReferenceNumber('CONTRIB') from submissions.service.ts"
  - "Confirmation page uses async searchParams (Next.js 15 requirement) consistent with opportunity confirmation pattern"

# Metrics
duration: 3min
completed: 2026-08-11
---

# Phase 3 Plan 03: Innovation Contribution Flow Summary

**Two-step F7 contribution form for sharing existing innovation work with required attribution fields (contributingOffice, contributorNames, currentOwner), Zod-validated rate-limited POST API, DB persistence to innovation_contributions, and non-endorsement language in 3 locations; all 5 Playwright tests pass**

## Performance

- **Duration:** 3 min
- **Started:** 2026-08-11T18:29:42Z
- **Completed:** 2026-08-11T18:32:41Z
- **Tasks:** 1 completed
- **Files modified:** 5

## Accomplishments

- POST /api/v1/submissions/contribution with Zod validation (ContributionSchema), 5/IP/hr rate limiting (SEC-06 shared with opportunity), and DB persistence returning CONTRIB-YYYY-NNN reference number
- Required attribution fields: contributingOffice, contributorNames, currentOwner — all enforced as z.string().min(2) (F7.3)
- Non-endorsement language in 3 locations: role=note intro banner, required nonEndorsementAcknowledged checkbox (z.literal(true)), and confirmation page (F7.4)
- /submit-contribution is visually and structurally distinct from /submit-opportunity (F7.1)
- All 5 Playwright E2E tests pass: F7.1, F7.3, F7.4, AUTH-09, F7.5

## Task Commits

Each task was committed atomically:

1. **Task 1: Contribution API, submission page, form, and confirmation with Playwright tests** - `a550d6b` (feat)

**Plan metadata:** (to be committed with SUMMARY.md)

## Files Created/Modified

- `src/app/api/v1/submissions/contribution/route.ts` - POST endpoint: Zod validation, rate limit, DB insert, CONTRIB referenceNumber response
- `src/app/(public)/submit-contribution/page.tsx` - SSR page: getSession() redirect guard + F7.4 non-endorsement intro banner
- `src/app/(public)/submit-contribution/ContributionForm.tsx` - 2-step client form with attribution fields, non-endorsement checkbox, Back/Submit navigation
- `src/app/(public)/submit-contribution/confirmation/page.tsx` - Confirmation with CONTRIB ref number + curation-queue messaging + non-endorsement restatement
- `e2e/contribution-submission.spec.ts` - 5 Playwright tests covering F7.1, F7.3, F7.4, AUTH-09, F7.5

## Decisions Made

- **Two-step form:** Step 1 captures work description (contributionTitle, problemAddressed, workDescription, maturity, collaboration preference); Step 2 captures attribution and contact info. Simpler than F6's 3-step — appropriate for contribution detail level.
- **Attribution labeling:** Fields in Step 2 labeled with "(preserved for attribution)" helper text and a blue attribution-preservation notice box — sets user expectations that this data is permanent.
- **Rate limit shared:** checkRateLimit(ip, 'submission') used for both opportunity and contribution submissions — implements SEC-06 shared 5/IP/hr across submission types.

## Known Stubs

None found — all handlers implement real logic. HTML `placeholder` attributes in ContributionForm are UI guidance text, not implementation stubs.

## Deviations from Plan

None - plan executed exactly as written.

The plan specified the contribution flow files; all were implemented as specified. The F7.3 test for attribution fields was updated to navigate to Step 2 first (since attribution fields are on Step 2 of the 2-step form), which is consistent with the plan's form design.

## Issues Encountered

None — all verifications passed. Playwright browsers were already installed from 03-02 execution.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- F7 innovation contribution flow complete and E2E tested
- innovation_contributions table receives attributions preserved via contributing_office and contributor_names columns
- Phase 3 plan 03-04 (engagement request flow) can begin
- Phase 4 curator workflow can use source_contribution_id FK to link curated records back to original contributions

## Self-Check: PASSED

- All 5 key files exist on disk ✓
- Task commit found (a550d6b) ✓
- Build check: `npx tsc --noEmit` → exit 0 ✓
- No blocking stubs (no TODO/FIXME found, only UI placeholder text) ✓
- `## Known Stubs` section present with "None found" ✓

---
*Phase: 03-engagement-flows*
*Completed: 2026-08-11*
