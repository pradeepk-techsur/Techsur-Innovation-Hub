---
phase: 04-curation-and-administration
plan: "03"
subsystem: api
tags: [publication, lifecycle, gate, curator, audit, next.js, kysely, typescript]

# Dependency graph
requires:
  - phase: 04-curation-and-administration
    provides: "04-02: getRecordForCurator(), records.service.ts; 04-01: requireRole(), appendAuditEvent()"
  - phase: 01-foundation
    provides: "innovation_records table with publication_state, audit_events with publication_state_changed event type, Kysely DB client, InnovationRecordRow type"

provides:
  - "publication.service.ts: runPublicationGate() — all 15 FRD F9.10/TechArch §4.4 checks with field-level error map and non-blocking warnings"
  - "publication.service.ts: transitionState() — ALLOWED_TRANSITIONS enforcement, audit event emission on every transition"
  - "POST /api/v1/curator/records/:id/publish — 422 PUBLICATION_GATE_FAILED with field map when gate fails; passes gate warnings in success response"
  - "POST /api/v1/curator/records/:id/unpublish — published/submitted_for_review → draft"
  - "POST /api/v1/curator/records/:id/submit-for-review — draft → submitted_for_review (no gate)"
  - "POST /api/v1/curator/records/:id/supersede — requires supersession_reason, 422 if absent"
  - "POST /api/v1/curator/records/:id/archive — published/superseded → archived"
  - "POST /api/v1/curator/records/:id/retire — requires retirement_reason, 422 if absent"
  - "RecordEditor.tsx LifecycleActionsPanel — state-dependent buttons, gate failure display, inline reason forms"

affects:
  - 04-04 (audit log — publication_state_changed events now flowing into audit_events table)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "15-check publication gate: synchronous field-level validation in service layer; returns GateResult with errors map (blocking) and warnings map (non-blocking)"
    - "ALLOWED_TRANSITIONS map: declarative state machine preventing invalid lifecycle jumps"
    - "Mandatory reason fields: supersede and retire return 422 MISSING_REQUIRED_FIELD without body.supersession_reason / body.retirement_reason"
    - "Audit on every lifecycle transition: transitionState() always emits publication_state_changed with from/to/reason"

key-files:
  created:
    - src/lib/services/publication.service.ts
    - src/app/api/v1/curator/records/[id]/publish/route.ts
    - src/app/api/v1/curator/records/[id]/unpublish/route.ts
    - src/app/api/v1/curator/records/[id]/submit-for-review/route.ts
    - src/app/api/v1/curator/records/[id]/supersede/route.ts
    - src/app/api/v1/curator/records/[id]/archive/route.ts
    - src/app/api/v1/curator/records/[id]/retire/route.ts
  modified:
    - src/app/curator/records/[id]/RecordEditor.tsx

key-decisions:
  - "ALLOWED_TRANSITIONS map enforced in transitionState(): invalid state jumps return error without DB write, preventing out-of-sequence lifecycle moves (T-04-03-03)"
  - "Maturity/disclaimer mismatch is a non-blocking warning: gate passes but response includes warnings map so curator can make an informed decision"
  - "VALID_REVIEW_STATUSES includes both canonical DB values and editor values (legal_reviewed, privacy_reviewed etc.): editor checkboxes should pass check 11 for any selected status"
  - "supersession_reason stored via transitionState reason param mapped to supersession_reason column; retirement_reason similarly mapped — reason routing determined by target state"

patterns-established:
  - "GateResult shape: { passed, errors: Record<string,string>, warnings: Record<string,string> } — errors block publish; warnings pass through to curator"
  - "Lifecycle route pattern: requireRole → get record → business logic → transitionState → return ok or error"
  - "LifecycleActionsPanel: collapsed by default, state-aware button set, inline reason forms for destructive transitions, gate failure panel"

# Metrics
duration: 3min
completed: 2026-08-12
---

# Phase 4 Plan 03: Publication Lifecycle & 15-Check Gate Summary

**15-check publication gate (runPublicationGate) with field-level error map, full lifecycle state machine (publish/unpublish/submit-for-review/supersede/archive/retire), and curator-facing LifecycleActionsPanel in RecordEditor with gate failure display and inline reason forms**

## Performance

- **Duration:** 3 min
- **Started:** 2026-08-12T04:18:32Z
- **Completed:** 2026-08-12T04:22:16Z
- **Tasks:** 1 completed
- **Files modified:** 8

## Accomplishments

- `publication.service.ts` with `runPublicationGate()` implementing all 15 FRD F9.10 checks, returning field-level error map for every failed check and non-blocking warnings for maturity/disclaimer mismatches
- `transitionState()` with ALLOWED_TRANSITIONS enforcement, publishes at timestamp, stores supersession/retirement reasons, always emits `publication_state_changed` audit event
- 6 lifecycle route handlers (publish, unpublish, submit-for-review, supersede, archive, retire) all gated by `requireRole('curator')`
- Publish route returns 422 `PUBLICATION_GATE_FAILED` with `fields` map when any of the 15 checks fail
- Supersede and retire return 422 `MISSING_REQUIRED_FIELD` when reason is absent from request body
- `RecordEditor.tsx` updated with `LifecycleActionsPanel` (collapsed by default): state-dependent transition buttons, gate failure panel with field-level error list, amber warning notice for maturity/disclaimer mismatch, inline reason forms for supersede and retire

## Task Commits

Each task was committed atomically:

1. **Task 1: Publication lifecycle gate (15 checks), lifecycle route handlers, and RecordEditor lifecycle panel** - `74f86e7` (feat)

**Plan metadata:** (committed with SUMMARY.md)

## Files Created/Modified

- `src/lib/services/publication.service.ts` — `runPublicationGate()` (15 checks, GateResult), `transitionState()` (ALLOWED_TRANSITIONS, audit emission)
- `src/app/api/v1/curator/records/[id]/publish/route.ts` — POST: runs gate, 422 on failure with field map, 400 on invalid transition
- `src/app/api/v1/curator/records/[id]/unpublish/route.ts` — POST: published/submitted_for_review → draft
- `src/app/api/v1/curator/records/[id]/submit-for-review/route.ts` — POST: draft → submitted_for_review (no gate)
- `src/app/api/v1/curator/records/[id]/supersede/route.ts` — POST: requires supersession_reason, sets superseded_by_record_id if provided
- `src/app/api/v1/curator/records/[id]/archive/route.ts` — POST: published/superseded → archived
- `src/app/api/v1/curator/records/[id]/retire/route.ts` — POST: requires retirement_reason, published → retired
- `src/app/curator/records/[id]/RecordEditor.tsx` — Added `LifecycleActionsPanel` component before field groups

## Decisions Made

- **ALLOWED_TRANSITIONS map:** Declarative state machine in `transitionState()` means no invalid jumps can occur regardless of request body contents. Follows T-04-03-03 threat mitigation.
- **Non-blocking warnings:** Maturity/disclaimer mismatch surfaces as `warnings` field in both gate failure and success responses — curator sees it and can confirm or fix before proceeding.
- **VALID_REVIEW_STATUSES expanded:** Includes both canonical `review_status_changed` event values and the editor checkbox values so Check 11 passes for any curator-selected review status.
- **Reason routing by target state:** `transitionState()` stores the `reason` param in `supersession_reason` when transitioning to `superseded`, and `retirement_reason` when transitioning to `retired`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] VALID_REVIEW_STATUSES expanded to match editor checkbox values**
- **Found during:** Task 1 (reviewing Check 11 logic against RecordEditor.tsx REVIEW_STATUS_OPTIONS)
- **Issue:** Plan's VALID_REVIEW_STATUSES list (`submitted`, `curated_for_completeness`, `technically_reviewed`, etc.) did not include the values used in the RecordEditor checkboxes (`security_reviewed`, `legal_reviewed`, `privacy_reviewed`, `architecture_reviewed`, `accessibility_reviewed`). A record with only editor-set review statuses would fail Check 11 even with valid data.
- **Fix:** Extended VALID_REVIEW_STATUSES in `runPublicationGate()` to include all values that the editor can produce, so Check 11 correctly passes when any valid review status is present.
- **Files modified:** `src/lib/services/publication.service.ts`
- **Verification:** `npx tsc --noEmit --skipLibCheck` passes; `npm run build` succeeds
- **Committed in:** `74f86e7` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug — gate check data mismatch between service and editor values)  
**Impact on plan:** Fix required for correctness. Without it, records with legitimate review statuses from the editor would be incorrectly blocked by the publication gate. No scope creep.

## Known Stubs

None — all route handlers interact with the real PostgreSQL database via Kysely. `runPublicationGate()` performs real field-level checks. `transitionState()` performs real DB updates and inserts real audit events. No hardcoded or mocked responses.

## Issues Encountered

None — TypeScript check and Next.js build passed on first run after file creation.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `publication.service.ts` `runPublicationGate()` and `transitionState()` available for any future feature that needs lifecycle validation
- All publication_state_changed audit events flowing into `audit_events` table — plan 04-04 (audit log UI) can read them immediately
- RecordEditor now has lifecycle action panel — curators can drive publication state from the editor UI

---
*Phase: 04-curation-and-administration*
*Completed: 2026-08-12*

## Self-Check: PASSED

- `src/lib/services/publication.service.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/publish/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/unpublish/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/submit-for-review/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/supersede/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/archive/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/retire/route.ts` exists ✓
- `.planning/phases/04-curation-and-administration/04-03-SUMMARY.md` exists ✓
- Task 1 commit `74f86e7` found in git log ✓
- Build check: `npm run build` → exit 0 (all 6 lifecycle routes appear in build output) ✓
- No blocking stubs ✓
