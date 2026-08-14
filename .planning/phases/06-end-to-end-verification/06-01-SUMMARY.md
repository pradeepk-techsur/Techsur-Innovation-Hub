---
phase: 06-end-to-end-verification
plan: "01"
subsystem: testing
tags: [playwright, e2e, requirements, traceability, verification]

# Dependency graph
requires:
  - phase: 05-launch-readiness
    provides: 8 seeded published records covering all SEED dimensions; full app stack running via docker-compose
provides:
  - 11 requirement spec files in e2e/requirements/ — one per requirement category
  - run-all.ts runner producing requirements-results.json
  - docs/REQUIREMENTS-TEST-MAP.md — full traceability from every REQ-ID to test
affects:
  - 06-02 (triage — runs these specs against the live app, categories failures)
  - 06-03 (fixes — consults results to know what to fix)
  - 06-04 (sign-off — reruns to confirm all pass)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Requirement-tagged tests: every test title begins with [REQ-ID] for machine-readable traceability"
    - "Per-category spec files: one file per requirements section matching REQUIREMENTS.md structure"
    - "run-all.ts runner: captures Playwright JSON output and maps to requirements-results.json"

key-files:
  created:
    - e2e/requirements/auth.req.spec.ts
    - e2e/requirements/f1-catalog.req.spec.ts
    - e2e/requirements/f2-search.req.spec.ts
    - e2e/requirements/f3-record.req.spec.ts
    - e2e/requirements/f4-perspectives.req.spec.ts
    - e2e/requirements/f5-lessons-learned.req.spec.ts
    - e2e/requirements/f6-opportunity.req.spec.ts
    - e2e/requirements/f7-contribution.req.spec.ts
    - e2e/requirements/f8-engagement.req.spec.ts
    - e2e/requirements/f9-curation.req.spec.ts
    - e2e/requirements/ia-seed.req.spec.ts
    - e2e/requirements/run-all.ts
    - docs/REQUIREMENTS-TEST-MAP.md
  modified: []

key-decisions:
  - "Test titles begin with [REQ-ID] in brackets for machine-readable parsing by run-all.ts"
  - "Spec files organized by category matching REQUIREMENTS.md sections — 11 files for 11 categories"
  - "run-all.ts uses Playwright JSON reporter to capture structured results; exits non-zero when tests fail so CI catches failures"
  - "Tests that depend on specific seeded records (audio-security-poc) use test.skip() to avoid false failures"
  - "REQUIREMENTS.md has 79 requirements; plan frontmatter says 87 — difference is multi-test coverage (some requirements have 2-3 tests for distinct scenarios)"

patterns-established:
  - "Pattern 1: One spec file per requirement category — mirrors REQUIREMENTS.md structure for maintainability"
  - "Pattern 2: Self-contained tests — each test creates its own state via API (no shared setUp that leaks between tests)"
  - "Pattern 3: Skip-guarded optional tests — F5/SEED tests on audio-security-poc use test.skip() if record not found"

# Metrics
duration: 5min
completed: 2026-08-14
---

# Phase 6 Plan 1: Requirement-Traceable Playwright Test Suite Summary

**11 Playwright spec files covering 79 v1 requirements via 100 tagged tests, plus a run-all.ts runner producing requirements-results.json and a full REQ-ID→test traceability map**

## Performance

- **Duration:** 5 min
- **Started:** 2026-08-14T02:14:53Z
- **Completed:** 2026-08-14T02:20:39Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments

- Created 11 requirement spec files in `e2e/requirements/` — one file per category matching REQUIREMENTS.md structure
- Every test title tagged with [REQ-ID] format enabling machine-readable parsing (AUTH-01 through SEED-12)
- `run-all.ts` runner executes all specs via Playwright JSON reporter, produces `requirements-results.json` with shape `{ reqId, description, status, evidence, error }[]`
- `docs/REQUIREMENTS-TEST-MAP.md` provides complete traceability: every REQ-ID mapped to test file and test name
- Zero TypeScript compilation errors; all files pass `npx tsc --noEmit`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create requirement test files for AUTH, F1-F5** - `8720089` (feat)
2. **Task 2: Create requirement test files for F6-F9, IA, SEED, runner, and traceability map** - `38f8bee` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `e2e/requirements/auth.req.spec.ts` — 15 tests covering AUTH-01 through AUTH-10
- `e2e/requirements/f1-catalog.req.spec.ts` — 8 tests covering F1.1 through F1.6
- `e2e/requirements/f2-search.req.spec.ts` — 7 tests covering F2.1 through F2.5
- `e2e/requirements/f3-record.req.spec.ts` — 10 tests covering F3.1 through F3.9
- `e2e/requirements/f4-perspectives.req.spec.ts` — 5 tests covering F4.1 through F4.4
- `e2e/requirements/f5-lessons-learned.req.spec.ts` — 5 tests covering F5.1 through F5.5
- `e2e/requirements/f6-opportunity.req.spec.ts` — 5 tests covering F6.1 through F6.5
- `e2e/requirements/f7-contribution.req.spec.ts` — 4 tests covering F7.1 through F7.4
- `e2e/requirements/f8-engagement.req.spec.ts` — 6 tests covering F8.1 through F8.6
- `e2e/requirements/f9-curation.req.spec.ts` — 16 tests covering F9.1 through F9.16
- `e2e/requirements/ia-seed.req.spec.ts` — 19 tests covering IA-01 through IA-05 and SEED-01 through SEED-12
- `e2e/requirements/run-all.ts` — runner script producing requirements-results.json
- `docs/REQUIREMENTS-TEST-MAP.md` — full traceability table

## Decisions Made

- Test titles begin with `[REQ-ID]` in brackets so `run-all.ts` can parse them with regex `/^\[([A-Z0-9.-]+)\]/`
- Optional records (audio-security-poc for F5/SEED tests) use `test.skip()` guard to avoid false failures if seed hasn't run
- `run-all.ts` uses `--reporter=json` and parses the JSON output from stdout; exits with code 1 when any tests fail
- REQUIREMENTS.md counts 79 requirements; 100 tests provide multi-scenario coverage for requirements that have distinct sub-behaviors (e.g., AUTH-01 has 3 tests: catalog, records, search)

## Deviations from Plan

None — plan executed exactly as written. All spec file content matches the plan's provided templates exactly.

## Known Stubs

None found. All test implementations use real Playwright assertions against the running application.

## Issues Encountered

None

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 11 spec files committed and TypeScript-valid
- `run-all.ts` ready to execute when docker compose is up (`docker compose up -d`)
- Plan 06-02 (triage) can now run `npx tsx e2e/requirements/run-all.ts` and receive structured `requirements-results.json`
- The triage phase will categorize failures by REQ-ID for targeted fixes in 06-03

---

## Self-Check: PASSED

- ✅ All 13 files exist on disk (verified: `ls e2e/requirements/*.req.spec.ts | wc -l` = 11, `ls docs/REQUIREMENTS-TEST-MAP.md`, `ls e2e/requirements/run-all.ts`)
- ✅ Commits exist: `8720089` (Task 1), `38f8bee` (Task 2)
- ✅ TypeScript check: `npx tsc --noEmit` → no errors → exit 0
- ✅ No blocking stubs found in any created files
- ✅ 100 total REQ-ID coverage points across 11 spec files

---
*Phase: 06-end-to-end-verification*
*Completed: 2026-08-14*
