---
phase: 01-foundation
plan: "03"
subsystem: ui
tags: [nextjs, postgresql, kysely, typescript, playwright, tailwindcss, record-detail, ssr, security]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Next.js 15 App Router + PostgreSQL 16 docker stack with all 8 tables and Kysely client"
  - phase: 01-foundation
    provides: "getPublishedCatalog() repository, InnovationRecordRow and CatalogCardData types (plan 01-02)"
provides:
  - "GET /api/v1/records/[slug]: full record detail with artifacts and next_actions; restricted URLs null (SEC-04)"
  - "getRecordBySlug() repository function with ArtifactRow, RecordNextActionRow, RecordDetail types"
  - "SSR /records/[slug] page rendering all nine F3.1–F3.9 content sections"
  - "TrustBanner component: maturity + review status badges + last-reviewed date + applicable disclaimer"
  - "ArtifactList component with SEC-04/T-01-03-01 restricted URL defense-in-depth"
  - "NextActionCTAs component with Contact I&R fallback (F3.9); Phase 3 wires to engagement form"
  - "RecordSection: accessible section wrapper that omits rendering when no data (no raw 'null')"
  - "13 Playwright tests in e2e/record-detail.spec.ts covering F3–F3.9, SEC-04, 404 handling"
  - "All 20 Playwright tests pass: 7 catalog (plan 01-02) + 13 record-detail (this plan)"
affects:
  - "02-search (record detail page is the landing destination for search result clicks)"
  - "03-stakeholder (F4.1–F4.4 perspective toggle builds on this page)"
  - "All future phases consuming /records/[slug]"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SEC-04 defense-in-depth: restricted artifact URL nulled at query layer (CASE WHEN) + UI layer (artifact.url check)"
    - "T-01-03-02: getRecordBySlug WHERE publication_state='published' — draft slugs → null → 404"
    - "node-postgres DATE→Date coercion guard: formatReviewDate() in TrustBanner converts Date→YYYY-MM-DD string"
    - "ON CONFLICT DO UPDATE for seed expansion: new fields added to existing records without data loss"
    - "Next.js 15 async params pattern: params: Promise<{slug: string}> with await"
    - "Kysely sql template literal: sql<string|null>`CASE WHEN is_restricted THEN NULL ELSE url END`.as('url')"
    - "RecordSection: React.Children.toArray empty-check prevents null/false children from rendering section headers"

key-files:
  created:
    - "src/app/api/v1/records/[slug]/route.ts"
    - "src/app/(public)/records/[slug]/page.tsx"
    - "src/app/(public)/records/[slug]/RecordSection.tsx"
    - "src/app/(public)/records/[slug]/TrustBanner.tsx"
    - "src/app/(public)/records/[slug]/ArtifactList.tsx"
    - "src/app/(public)/records/[slug]/NextActionCTAs.tsx"
    - "e2e/record-detail.spec.ts"
  modified:
    - "src/lib/repositories/innovation-records.repository.ts (added getRecordBySlug, ArtifactRow, RecordNextActionRow, RecordDetail)"
    - "src/lib/db/seed.ts (extended audio-security-poc-2024 with findings_*, ready_for, what_worked, etc. via ON CONFLICT DO UPDATE)"

key-decisions:
  - "Kysely sql template literal for CASE WHEN: db.raw() is not a Kysely API; used sql<T>`...`.as('url') tagged template for SEC-04 URL redaction"
  - "TrustBanner formatReviewDate guard: node-postgres returns PostgreSQL DATE columns as JavaScript Date objects at runtime even when TypeScript types them as string — must convert before React rendering"
  - "ON CONFLICT DO UPDATE in seed expansion: existing records already in compose volume (ON CONFLICT DO NOTHING would leave new fields null); DO UPDATE SET targets only the newly added fields"
  - "Next.js 15 async params: dynamic route params are Promise<{slug}> in Next.js 15 — await params before use to avoid TypeScript errors and runtime warnings"
  - "RecordSection empty-check: React.Children.toArray().some(!!child) omits sections with no data rather than rendering empty section headers"

patterns-established:
  - "Repository pattern: ArtifactRow and RecordNextActionRow are explicitly-typed result interfaces for named column selections — no selectAll() for joined/projected queries"
  - "SEC-04 pattern: URL redaction at query layer (CASE WHEN in Kysely sql) + UI layer (url && ... conditional rendering) — two independent enforcement points"
  - "Trust signal reuse: MaturityBadge and ReviewStatusBadge from catalog are imported into the record detail page — single source of truth for trust signal display"

# Metrics
duration: 11min
completed: 2026-08-11
---

# Phase 1 Plan 03: Innovation Record Detail Summary

**SSR /records/[slug] page with all nine F3.1–F3.9 content sections, TrustBanner (maturity + review + disclaimer), ArtifactList with SEC-04 restricted URL defense-in-depth, NextActionCTAs with Contact I&R fallback, and GET /api/v1/records/[slug] API returning full record with artifacts**

## Performance

- **Duration:** 11 min
- **Started:** 2026-08-11T14:41:19Z
- **Completed:** 2026-08-11T14:52:54Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- GET /api/v1/records/[slug] returns full published record with artifacts and next_actions; 404 for unknown/draft slugs; restricted artifact URLs are null (SEC-04)
- SSR /records/[slug] renders all nine content sections: Problem & Context, What Was Explored, Outcome & Evidence, Key Findings, Maturity & Readiness, Reuse Guidance, Ownership & Attribution, Authoritative Artifacts, Next Action
- TrustBanner renders prominently above the fold with MaturityBadge + ReviewStatusBadge(s) + last-reviewed date + applicable disclaimer
- ArtifactList enforces SEC-04 at the UI layer: only renders href when artifact.url is non-null (API already nulls restricted URLs)
- NextActionCTAs always provides at least one CTA (Contact I&R fallback) so Next Action section is never empty
- All 20 Playwright tests pass: 7 catalog tests (plan 01-02) + 13 new record-detail tests
- TypeScript compiles clean (`tsc --noEmit` exit 0)
- Phase 1 success criteria 1–5 all met (see below)

## Task Commits

Each task was committed atomically:

1. **Task 1: Record API route and repository extension** - `a99b328` (feat)
2. **Task 2: Record detail page, components, updated seed, Playwright tests** - `7f458e5` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/app/api/v1/records/[slug]/route.ts` — GET handler; 200 with full record or 404; async params (Next.js 15)
- `src/lib/repositories/innovation-records.repository.ts` — Added getRecordBySlug(), ArtifactRow, RecordNextActionRow, RecordDetail; Kysely sql CASE WHEN for restricted URL
- `src/app/(public)/records/[slug]/page.tsx` — SSR record detail page with all nine sections
- `src/app/(public)/records/[slug]/RecordSection.tsx` — Accessible section wrapper; omits when no content
- `src/app/(public)/records/[slug]/TrustBanner.tsx` — Maturity + review status + disclaimer; Date coercion guard
- `src/app/(public)/records/[slug]/ArtifactList.tsx` — Artifact list with SEC-04 URL protection
- `src/app/(public)/records/[slug]/NextActionCTAs.tsx` — mailto CTAs with Contact I&R fallback
- `src/lib/db/seed.ts` — Extended seed with ON CONFLICT DO UPDATE for new fields (findings_*, ready_for, what_worked, scope_description, ir_contribution, production_readiness_gaps, next_action_description)
- `e2e/record-detail.spec.ts` — 13 Playwright tests: F3–F3.9, SEC-04 restricted URL, 404 handling

## Decisions Made

- **Kysely sql tagged template for CASE WHEN:** The plan specified `db.raw(...)` but Kysely does not have a `raw()` method on the query builder. Used `sql<string | null>\`CASE WHEN is_restricted THEN NULL ELSE url END\`.as('url')` from Kysely's `sql` export — the correct Kysely approach for raw SQL expressions in selects.
- **ON CONFLICT DO UPDATE in seed expansion:** Audio-security-poc-2024 already existed in the compose volume from plan 01-02 (`ON CONFLICT DO NOTHING` would leave new fields null). Changed strategy to `ON CONFLICT DO UPDATE SET` targeting only the new plan-03 fields (findings_*, ready_for, etc.) so all nine sections would have data and Playwright tests would pass.
- **Next.js 15 async params:** Dynamic route `params` is a `Promise<{slug: string}>` in Next.js 15, not a plain object. Used `await params` before accessing `slug` — both for the API route and the page component.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Used Kysely `sql` tagged template instead of non-existent `db.raw()`**
- **Found during:** Task 1 (repository implementation)
- **Issue:** Plan specified `db.raw('CASE WHEN is_restricted THEN NULL ELSE url END AS url')` — Kysely's query builder has no `raw()` method. The correct Kysely approach is the `sql` tagged template literal imported from `kysely`.
- **Fix:** Used `import { sql } from 'kysely'` and `sql<string | null>\`CASE WHEN is_restricted THEN NULL ELSE url END\`.as('url')` — semantically identical but using the correct Kysely API.
- **Files modified:** `src/lib/repositories/innovation-records.repository.ts`
- **Verification:** TypeScript compiles clean; API returns `url: null` for restricted artifacts; API test passes
- **Committed in:** a99b328 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed node-postgres Date object rendering crash (500 error)**
- **Found during:** Task 2 (record page verification — page returned HTTP 500)
- **Issue:** `[Error: Objects are not valid as a React child (found: [object Date])]` — node-postgres returns PostgreSQL DATE columns as JavaScript Date objects at runtime even though TypeScript types them as `string | null`. The `last_reviewed_date` field (DATE type) was received as a Date object and passed to React's `<time>` element, causing a render-time crash.
- **Fix:** Added `formatReviewDate()` to `TrustBanner.tsx` that checks `value instanceof Date` and converts to `YYYY-MM-DD` string. Also added `String()` coercion in `page.tsx` for `last_reviewed_date` and `applicable_disclaimer` before passing to TrustBanner.
- **Files modified:** `src/app/(public)/records/[slug]/TrustBanner.tsx`, `src/app/(public)/records/[slug]/page.tsx`
- **Verification:** Record page returns 200; all nine sections render; 20/20 Playwright tests pass
- **Committed in:** 7f458e5 (Task 2 commit)

**3. [Rule 2 - Missing Critical] Extended seed with all nine section fields via ON CONFLICT DO UPDATE**
- **Found during:** Task 2 (checking which sections would render for seed record)
- **Issue:** The seed record `audio-security-poc-2024` from plan 01-02 lacked `findings_architectural`, `ready_for`, `not_ready_for`, `what_worked`, `scope_description`, `ir_contribution`, `production_readiness_gaps`, and `next_action_description`. Without these, Key Findings and Maturity & Readiness sections would be omitted — Playwright tests checking all nine sections would fail.
- **Fix:** Updated seed.ts to use `ON CONFLICT (slug) DO UPDATE SET` for the new plan-03 fields, ensuring all nine sections have data in the persisted compose volume even for records created by plan 01-02.
- **Files modified:** `src/lib/db/seed.ts`
- **Verification:** All nine sections render for `audio-security-poc-2024`; all 13 record-detail Playwright tests pass
- **Committed in:** 7f458e5 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 Rule 1 bugs, 1 Rule 2 missing critical)
**Impact on plan:** All three deviations were essential for correctness. Rule 1 fixes resolved a Kysely API mismatch and a node-postgres Date coercion crash. Rule 2 fixed seed completeness so all sections render. No scope creep.

## Known Stubs

- `src/app/(public)/records/[slug]/NextActionCTAs.tsx:5` — "Phase 3 will wire these to the engagement request form" — **Cosmetic** — Phase 1 uses mailto links as functional CTAs; Phase 3 plan replaces with engagement request form. The Contact I&R mailto link is fully functional for Phase 1.
- `src/app/(public)/records/[slug]/NextActionCTAs.tsx:40` — Phase 3 routing address read from hub_settings — **Cosmetic** — hardcoded from seeded value for Phase 1; Phase 3 reads from hub_settings at runtime. Value is identical to the seeded row.

No blocking stubs — all functionality required for Phase 1 is implemented.

## Issues Encountered

None beyond the deviations documented above. The node-postgres Date object coercion is a known pg v8 behavior for DATE columns — the guard in TrustBanner handles it correctly.

## User Setup Required

None - no external service configuration required. Dev stack is self-contained via Docker Compose.

## Next Phase Readiness

**Phase 1 success criteria — all met:**
1. ✅ Anonymous user browses /catalog — published records with maturity badges, review status badges, contributing office, last-reviewed date, engagement indicator
2. ✅ Clicking a catalog card opens /records/[slug] with all nine F3.1–F3.9 content sections rendered
3. ✅ Maturity and review status badges are visually distinct (different shape, icon, color — MaturityBadge filled pill + ▲ vs ReviewStatusBadge outlined + ✓/🛡)
4. ✅ NODE_ENV=production + ENABLE_DEV_AUTH_BYPASS=true → process.exit(1) (plan 01-01)
5. ✅ docker compose up starts app + db; migrations applied; .env.example committed with no real secrets
6. ✅ All 20 Playwright tests pass (7 catalog + 13 record-detail; 0 failing)

**Phase 1 is complete.** Ready for Phase 2 (Search and Discovery) or Phase 3 (Stakeholder Engagement). The record detail page provides the anchor for Phase 3's F4.1–F4.4 executive/technical perspective toggle.

## Self-Check: PASSED

- All 9 key files created/modified on disk ✓
- 2 task commits present (a99b328, 7f458e5) ✓
- TypeScript: `tsc --noEmit` exits 0, no errors ✓
- Playwright: 20/20 tests pass (7 catalog + 13 record-detail) ✓
- API: GET /api/v1/records/audio-security-poc-2024 returns 200 with record/artifacts/next_actions ✓
- API: GET /api/v1/records/non-existent-slug returns 404 ✓
- Page: /records/audio-security-poc-2024 renders all nine sections ✓
- No blocking stubs found ✓

---
*Phase: 01-foundation*
*Completed: 2026-08-11*
