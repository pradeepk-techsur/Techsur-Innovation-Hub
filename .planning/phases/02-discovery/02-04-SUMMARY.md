---
phase: 02-discovery
plan: "04"
subsystem: ui
tags: [react, typescript, postgresql, seed, lessons-learned, source-basis]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: innovation_records schema with source_basis and source_contribution_id fields; records/[slug]/page.tsx SSR route
provides:
  - SourceBasisBanner component renders "Source of Record" on record detail page when source_basis is non-empty (F5.1, F5.4)
  - audio-security-poc seed record with full F5 content model (all 8 findings dimensions, source_basis, maturity, review statuses, reuse guidance, applicable disclaimer)
  - F5 feature complete — lessons-learned content model exercised end-to-end
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SourceBasisBanner: isUrl() guard renders URL as external link (rel=noopener noreferrer target=_blank) or plain text — handles both reference types without caller differentiation"
    - "Idempotent seed enrichment: ON CONFLICT (slug) DO UPDATE enriches existing seed records without duplication; compose volumes persist across restarts"

key-files:
  created:
    - src/app/(public)/records/[slug]/SourceBasisBanner.tsx
  modified:
    - src/app/(public)/records/[slug]/page.tsx
    - src/lib/db/seed.ts

key-decisions:
  - "SourceBasisBanner placed in page <header> (above perspective tabs) so it is visible regardless of active perspective — the source attribution is a record-level fact, not perspective-specific content"
  - "source_basis for Audio Security POC is plain text (not a URL) because the lessons-learned report is internal — exercises SourceBasisBanner's plain-text rendering path (F5.1)"
  - "New slug audio-security-poc added alongside existing audio-security-poc-2024 — the new record exercises the complete F5 content model while the old record remains for catalog diversity"

patterns-established:
  - "F5.1 pattern: Hub curates and links — source_basis references authoritative source; SourceBasisBanner makes the relationship explicit without replacing the source"
  - "Threat model pattern: curator-authored external URLs rendered with rel=noopener noreferrer; open redirect risk accepted for F5.1 use case per T-02-04-01"

# Metrics
duration: 4min
completed: 2026-08-11
---

# Phase 2 Plan 4: Lessons-Learned Content Model (F5) Summary

**SourceBasisBanner component and enriched Audio Security POC seed — full F5 content model proving Hub can link to, but not replace, authoritative lessons-learned sources**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-11T16:23:12Z
- **Completed:** 2026-08-11T16:27:09Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments

- Created `SourceBasisBanner` component (F5.1, F5.4) — renders "Source of Record" aside with external link or plain-text reference depending on whether `source_basis` is a URL
- Updated `records/[slug]/page.tsx` to render `SourceBasisBanner` in the header when `source_basis` is non-empty
- Added enriched `audio-security-poc` seed record with all 8 findings dimensions populated, source_basis set to an internal document reference, maturity=experiment_poc, two review statuses (technically_reviewed, security_reviewed), reuse_potential=high, and applicable disclaimer
- F5.4 verified: `audio-security-poc` discoverable via problem-oriented search ("audio security courtroom", "protect court audio") without knowing the slug
- Seed is idempotent — running twice produces exactly 3 published records

## Task Commits

Each task was committed atomically:

1. **Task 1: SourceBasisBanner component, page integration, and enriched Audio Security POC seed** - `eb3c861` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/app/(public)/records/[slug]/SourceBasisBanner.tsx` — Source of Record banner with URL/plain-text rendering and rel=noopener noreferrer security (F5.1, F5.4)
- `src/app/(public)/records/[slug]/page.tsx` — Added SourceBasisBanner import and conditional render in header
- `src/lib/db/seed.ts` — Added audio-security-poc record with full F5 content model: all 8 findings dimensions, source_basis, maturity, review statuses, reuse guidance, ownership, attribution, applicable disclaimer; ON CONFLICT DO UPDATE for idempotency

## Decisions Made

- SourceBasisBanner placed in `<header>` above PerspectiveToggle so it appears regardless of active perspective (executive or technical) — the source attribution is a record-level fact
- `source_basis` for Audio Security POC uses a plain-text internal document reference (not a URL), which exercises the banner's text rendering path and reflects realistic I&R usage
- New slug `audio-security-poc` added (alongside existing `audio-security-poc-2024`) as the canonical F5 exercise record

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed INTERVAL syntax in SQL template literal**
- **Found during:** Task 1 (seed enrichment)
- **Issue:** Plan provided `INTERVAL ''1 year''` (SQL escape for embedded string literal) which is invalid in a JavaScript template literal — `''` sends two empty-string delimiters to PostgreSQL, causing syntax error at position 7360
- **Fix:** Changed to `INTERVAL '1 year'` (correct syntax for raw SQL in JS template literal)
- **Files modified:** src/lib/db/seed.ts
- **Verification:** Seed ran successfully, 3 records confirmed in output; `audio-security-poc` seeded with correct data
- **Committed in:** eb3c861 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Single SQL quoting fix required — the fix restores the plan's exact intended semantics. No scope change.

## Issues Encountered

None — single issue above resolved under auto-fix Rule 1.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None found. All implementations are complete:
- `SourceBasisBanner` renders real data from `source_basis` field
- `seed.ts` inserts real F5 content (not placeholder values)
- Page integration conditional on real `record.source_basis` value

## Next Phase Readiness

Phase 2 is now complete:
- F1 (Catalog), F2 (Search), F3 (Record model), F4 (Perspective toggle), F5 (Lessons-learned content model) all implemented and verified
- Ready for Phase 3 — Stakeholder Engagement (F6 opportunity submission, F7 share innovation, F8 engagement routing)
- No blockers in Phase 2 output

## Self-Check

**Files exist:**
- `src/app/(public)/records/[slug]/SourceBasisBanner.tsx` ✓
- `src/app/(public)/records/[slug]/page.tsx` (modified) ✓
- `src/lib/db/seed.ts` (modified) ✓

**Commits exist:**
- `eb3c861` feat(02-04) ✓

**Build check:** `npx tsc --noEmit` → exit 0 ✓

**Verification results:**
- F5.4 SEARCH OK: `audio-security-poc` found in search for "audio security courtroom" ✓
- F5.1 SOURCE BANNER OK: "Source of Record" / "authoritative source" in rendered HTML ✓
- All 8 findings dimensions populated: all columns = true ✓
- Seed idempotency: 2 runs → 3 records (not 4) ✓

## Self-Check: PASSED

---
*Phase: 02-discovery*
*Completed: 2026-08-11*
