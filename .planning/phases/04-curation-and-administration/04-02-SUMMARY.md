---
phase: 04-curation-and-administration
plan: "02"
subsystem: api
tags: [curator, audit, records, crud, optimistic-concurrency, artifacts, dashboard, next.js, kysely, zod]

# Dependency graph
requires:
  - phase: 04-curation-and-administration
    provides: "04-01: requireRole(), appendAuditEvent(), curator SSR layout"
  - phase: 01-foundation
    provides: "innovation_records, artifacts, audit_events tables, Kysely DB client, DB types"

provides:
  - records.service.ts: createRecord, updateRecord (optimistic concurrency), getRecordForCurator
  - audit.service.ts: re-exports appendAuditEvent for service layer
  - GET /api/v1/curator/dashboard — live summary counts (records by state, pending submissions, unread engagement)
  - GET+POST /api/v1/curator/records — filterable record list with pagination; create draft record
  - GET+PATCH+DELETE /api/v1/curator/records/:id — full record CRUD; 409 on version conflict
  - GET+POST /api/v1/curator/records/:id/artifacts — artifact list (full URLs) and add
  - PATCH+DELETE /api/v1/curator/records/:id/artifacts/:aid — artifact edit and remove
  - /curator — SSR dashboard page with live counts
  - /curator/records — SSR filterable record list with state filter buttons
  - /curator/records/new — client form that creates draft and redirects to editor
  - /curator/records/[id] — SSR + RecordEditor client component (all FRD field groups)

affects:
  - 04-03 (submission management — depends on records.service.ts createRecord for record-from-contribution)
  - 04-04 (audit log — reads audit_events created by these services)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - optimistic concurrency: updateRecord() checks version at service level AND in WHERE clause; 0 rows = conflict
    - audit on every write: appendAuditEvent() called after every insert/update/delete in service layer
    - curator sees full restricted URLs: getRecordForCurator returns unredacted artifact URLs
    - params as Promise: Next.js 15 dynamic route params use Promise<{id}> — awaited in handler body

key-files:
  created:
    - src/lib/services/audit.service.ts
    - src/lib/services/records.service.ts
    - src/app/api/v1/curator/dashboard/route.ts
    - src/app/api/v1/curator/records/route.ts
    - src/app/api/v1/curator/records/[id]/route.ts
    - src/app/api/v1/curator/records/[id]/artifacts/route.ts
    - src/app/api/v1/curator/records/[id]/artifacts/[aid]/route.ts
    - src/app/curator/records/page.tsx
    - src/app/curator/records/new/page.tsx
    - src/app/curator/records/[id]/page.tsx
    - src/app/curator/records/[id]/RecordEditor.tsx
  modified:
    - src/app/curator/page.tsx

key-decisions:
  - "Optimistic concurrency: updateRecord() uses WHERE id=? AND version=? at DB level; PostgreSQL trigger auto-increments version on UPDATE making stale-version writes no-ops"
  - "PublicationState cast: using explicit type cast for Kysely $if conditional filter on publication_state column"
  - "params as Promise<{id}>: Next.js 15 App Router dynamic params require await in handler body"

patterns-established:
  - "records.service.ts pattern: createRecord returns ID; updateRecord returns ok/conflict/error union; getRecordForCurator returns full record with artifacts"
  - "Curator artifact access: curators receive full (unreacted) URLs; public API redacts restricted URLs (plan 01-03 behavior preserved)"
  - "Maturity and review_statuses independent controls: labeled explicitly in UI with 'Independent from' labels per F9.7"

# Metrics
duration: 6min
completed: 2026-08-12
---

# Phase 4 Plan 02: Curator Dashboard & Record Management Summary

**Curator record CRUD with optimistic concurrency (version-based 409 conflicts), audit event emission on every write, artifact management with full URL access, SSR dashboard with live counts, and full FRD-field record editor client component**

## Performance

- **Duration:** 6 min
- **Started:** 2026-08-12T04:09:14Z
- **Completed:** 2026-08-12T04:16:03Z
- **Tasks:** 2 completed
- **Files modified:** 12

## Accomplishments

- `records.service.ts` with `createRecord`, `updateRecord` (optimistic concurrency), and `getRecordForCurator` — all with audit event emission
- Full curator API suite: dashboard counts, record list/create/get/patch/delete, artifact add/edit/remove — all gated by `requireRole('curator')`
- PATCH returns 409 VERSION_CONFLICT when version is stale; DB trigger increments version on every UPDATE
- Curator dashboard SSR page with live record counts by state, pending submissions, unread engagement
- Record list page with filterable state buttons, status color badges, pagination
- Full record editor (`RecordEditor.tsx`) covering all 9 FRD field groups (F3.1–F3.7 + disclaimers + next action)
- Maturity dropdown and review status checkboxes rendered as separate, labeled-independent controls (F9.7)

## Task Commits

Each task was committed atomically:

1. **Task 1: Audit service, records service, and curator API routes** - `87863f2` (feat)
2. **Task 2: Curator dashboard UI, record list, and record editor SSR pages** - `bb6599d` (feat)

**Plan metadata:** (committed with SUMMARY.md)

## Files Created/Modified

- `src/lib/services/audit.service.ts` — Re-exports appendAuditEvent for service layer use
- `src/lib/services/records.service.ts` — createRecord, updateRecord (optimistic concurrency), getRecordForCurator
- `src/app/api/v1/curator/dashboard/route.ts` — GET: live summary counts for records by state, pending submissions, engagement
- `src/app/api/v1/curator/records/route.ts` — GET: filterable paginated list; POST: create draft record
- `src/app/api/v1/curator/records/[id]/route.ts` — GET/PATCH/DELETE with version-conflict 409 and draft-only delete guard
- `src/app/api/v1/curator/records/[id]/artifacts/route.ts` — GET (full URLs)/POST with Zod validation
- `src/app/api/v1/curator/records/[id]/artifacts/[aid]/route.ts` — PATCH/DELETE artifact with audit events
- `src/app/curator/page.tsx` — Live SSR dashboard replacing placeholder from 04-01
- `src/app/curator/records/page.tsx` — SSR filterable record list with state filter, pagination, status badges
- `src/app/curator/records/new/page.tsx` — Client form for record creation with redirect to editor
- `src/app/curator/records/[id]/page.tsx` — SSR record detail page fetching via API and passing to RecordEditor
- `src/app/curator/records/[id]/RecordEditor.tsx` — Full client editor with all FRD field groups, save/conflict handling, artifact management

## Decisions Made

- **Optimistic concurrency double-check:** `updateRecord()` checks version at service layer AND in the DB `WHERE version = ?` — PostgreSQL's `trg_ir_version` trigger auto-increments version on every UPDATE, making a stale-version write a 0-row no-op. Service treats 0-row result as conflict.
- **PublicationState type cast:** Kysely `$if` conditional filter requires explicit `as PublicationState` cast for typed column equality.
- **params as Promise:** Next.js 15 App Router dynamic segment params are `Promise<{id: string}>` — all handlers `await params` before destructuring.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed `version` duplicate key in PATCH body**
- **Found during:** Task 2 (RecordEditor TypeScript compilation)
- **Issue:** `const { artifacts, ...changes } = record` still included `version` in `changes`; then `{ version: record.version, ...changes }` caused TS2783 "specified more than once" error
- **Fix:** Added `version: _ver, id: _id2` to destructuring exclusion before spreading into PATCH body
- **Files modified:** `src/app/curator/records/[id]/RecordEditor.tsx`
- **Verification:** `npx tsc --noEmit --skipLibCheck` passes
- **Committed in:** bb6599d (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug — TypeScript duplicate key in destructuring spread)  
**Impact on plan:** Fix necessary for TypeScript correctness. No behavior change to plan intent.

## Known Stubs

None — all API handlers return real DB results. All record/artifact mutations persist to PostgreSQL. Audit events written on every create/update/delete. No hardcoded responses.

## Issues Encountered

None — all verifications passed on first run after file creation.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `records.service.ts` `createRecord()` available for plan 04-03 (contribution → record creation flow)
- All curator API routes operational; plans 04-03 (submission management) and 04-04 (audit log, settings) can proceed
- Artifact management endpoints operational; plan 04-03 can assign artifacts when creating from contributions

---

*Phase: 04-curation-and-administration*
*Completed: 2026-08-12*

## Self-Check: PASSED

- `src/lib/services/audit.service.ts` exists ✓
- `src/lib/services/records.service.ts` exists ✓
- `src/app/api/v1/curator/dashboard/route.ts` exists ✓
- `src/app/api/v1/curator/records/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/artifacts/route.ts` exists ✓
- `src/app/api/v1/curator/records/[id]/artifacts/[aid]/route.ts` exists ✓
- `src/app/curator/page.tsx` exists ✓
- `src/app/curator/records/page.tsx` exists ✓
- `src/app/curator/records/new/page.tsx` exists ✓
- `src/app/curator/records/[id]/page.tsx` exists ✓
- `src/app/curator/records/[id]/RecordEditor.tsx` exists ✓
- Task 1 commit `87863f2` found in git log ✓
- Task 2 commit `bb6599d` found in git log ✓
- Build check: `npx tsc --noEmit --skipLibCheck` → exit 0 ✓
- No blocking stubs ✓
