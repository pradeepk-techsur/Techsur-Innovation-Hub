---
phase: 05-launch-readiness
plan: "02"
subsystem: database
tags: [seed, postgresql, innovation-records, launch-content, SEED-01, SEED-12]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: innovation_records schema (001_initial_schema.sql), artifacts table
  - phase: 04-curation-and-administration
    provides: publication gate logic (runPublicationGate), maturity lifecycle transitions

provides:
  - 8 publication-gate-compliant innovation records spanning all required SEED dimensions
  - 4 artifact rows linked to technical reuse example records
  - db:seed-launch npm script for deployment repeatability
  - Launch content integrated into docker-compose.yml startup sequence

affects: [05-launch-readiness, launch-acceptance]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Idempotent seed with ON CONFLICT (slug) DO NOTHING for record inserts"
    - "NOT EXISTS guard for artifact inserts (no unique constraint on artifacts table)"
    - "Module-level require.main === module check for direct execution via tsx"

key-files:
  created:
    - src/lib/db/seed-launch.ts
    - src/lib/db/seed-launch-artifacts.ts
  modified:
    - package.json
    - docker-compose.yml

key-decisions:
  - "Artifact idempotency via NOT EXISTS guard on (record_id, name) rather than ON CONFLICT — artifacts table has no natural unique key"
  - "interpreter-scheduling-poc uses publication_state='archived' (not 'retired') per schema CHECK constraint; maturity='archived_retired'"
  - "Placeholder artifact URLs (placeholder.ao.uscourts.gov) are intentional per T-05-02-01 threat model — must be replaced with real URLs before launch"
  - "audio-security-poc seed uses ON CONFLICT DO UPDATE to ensure gate-compliant fields are populated even when record exists from seed.ts"

patterns-established:
  - "Launch seed uses separate file from dev seed (seed-launch.ts vs seed.ts) for clean separation of concerns"
  - "Artifact seeds resolve record IDs by slug at runtime rather than hardcoding UUIDs"

# Metrics
duration: 7min
completed: 2026-08-12
---

# Phase 5 Plan 02: Launch Content Seed Summary

**8 publication-gate-compliant innovation records seeded covering all 6 maturities, 12 technology areas, 11 mission areas, 6 review statuses, and 2 contributing offices — satisfying SEED-01 through SEED-12**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-12T21:33:26Z
- **Completed:** 2026-08-12T21:40:55Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments

- Created `seed-launch.ts` with 8 publication-gate-compliant innovation records covering all SEED dimensions
- Created `seed-launch-artifacts.ts` with 4 artifact rows (Audio Security POC × 3, Cloud Migration Reference × 1)
- Integrated `db:seed-launch` into both `package.json` scripts and `docker-compose.yml` startup sequence
- Verified seed is fully idempotent (two consecutive runs produce exactly 10 total records, no duplicates)

## Task Commits

Each task was committed atomically:

1. **Task 1: 8-record launch seed** - `4878966` (feat)

**Plan metadata:** _(see docs commit below)_

## Files Created/Modified

- `src/lib/db/seed-launch.ts` — 8 publication-gate-compliant records with ON CONFLICT idempotency
- `src/lib/db/seed-launch-artifacts.ts` — 4 artifact rows for technical reuse examples
- `package.json` — Added `db:seed-launch` script
- `docker-compose.yml` — Added `npm run db:seed-launch` to app startup sequence

## Decisions Made

- **Artifact idempotency via NOT EXISTS guard** — The `artifacts` table has no natural unique key, so `ON CONFLICT DO NOTHING` without specifying a column target would fail. Used `WHERE NOT EXISTS (SELECT 1 FROM artifacts WHERE record_id = $1 AND name = ...)` to achieve idempotent inserts.
- **interpreter-scheduling-poc publication state** — Uses `publication_state='archived'` (not `'retired'`) per the schema CHECK constraint which restricts `publication_state` to `('draft', 'submitted_for_review', 'published', 'superseded', 'archived', 'retired')`. The `maturity` field is set to `'archived_retired'` per the maturity taxonomy.
- **audio-security-poc uses ON CONFLICT DO UPDATE** — This record already exists from `seed.ts`. The launch seed upserts key gate-compliance fields (publication_state, maturity, review_statuses, applicable_disclaimer, last_reviewed_date) to ensure the record is gate-compliant.
- **Placeholder artifact URLs** — Intentional per T-05-02-01 threat model. All artifact URLs use `placeholder.ao.uscourts.gov` — not real internal document paths. Must be replaced with real authoritative source URLs before launch.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Artifact idempotency NOT EXISTS guard instead of ON CONFLICT DO NOTHING**
- **Found during:** Task 1 (seed-launch-artifacts.ts authoring)
- **Issue:** The plan specified `ON CONFLICT DO NOTHING` for artifact inserts, but the `artifacts` table has no unique constraint other than the `artifact_id` UUID primary key. Since `artifact_id` is `gen_random_uuid()`, there would never be a conflict — `ON CONFLICT DO NOTHING` would be a no-op, and each seed run would insert duplicate artifacts.
- **Fix:** Replaced with `WHERE NOT EXISTS (SELECT 1 FROM artifacts WHERE record_id = $1 AND name = ...)` to check for existing artifacts by record+name before inserting.
- **Files modified:** src/lib/db/seed-launch-artifacts.ts
- **Verification:** Two consecutive seed runs produce exactly 4 artifact rows (no duplicates)
- **Committed in:** 4878966

---

**Total deviations:** 1 auto-fixed (1 missing critical — idempotency fix)
**Impact on plan:** Auto-fix was necessary for correct behavior. No scope creep.

## Known Stubs

- `placeholder.ao.uscourts.gov` URLs in artifact rows — **Cosmetic** (not blocking). These placeholder URLs are intentional per T-05-02-01 threat model. The restricted artifact (Lessons Learned Report) is correctly marked `is_restricted=true` and will have its URL redacted in the public API per SEC-04. Must be replaced with real authoritative source URLs before production launch.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Launch content seed is complete and verified — 8 records with full dimension coverage
- Seed is integrated into docker-compose startup: fresh deployments will always have launch content
- SEED-01 through SEED-12 launch acceptance conditions are satisfied
- Placeholder artifact URLs must be replaced with real URLs before production launch (operational task, not a code blocker)
- Ready for 05-03 (IA/discovery validation or remaining launch readiness plans)

## Self-Check: PASSED

- `src/lib/db/seed-launch.ts` — FOUND ✓
- `src/lib/db/seed-launch-artifacts.ts` — FOUND ✓
- Commit `4878966` — FOUND ✓ (git log confirms)
- TypeScript check: `tsc --noEmit` → exit 0 ✓
- Seed ran successfully: 8/8 records ✓, 4 artifact rows ✓
- Idempotency confirmed: two runs = same 10 total records ✓
- Catalog API: `curl /api/v1/catalog` → 9 published records ✓
- Distinct maturities: 6 (all 6 required) ✓
- Distinct tech areas: 12 (≥4 required) ✓
- Distinct mission areas: 11 (≥3 required) ✓
- Distinct contributing offices: 2 (≥2 required) ✓
- Distinct review statuses: 6 (≥3 required) ✓
- Archived record: interpreter-scheduling-poc ✓
- Audio Security POC artifacts: 3 rows (1 restricted) ✓
- Known Stubs section present: Yes ✓ (placeholder URLs = cosmetic)

---
*Phase: 05-launch-readiness*
*Completed: 2026-08-12*
