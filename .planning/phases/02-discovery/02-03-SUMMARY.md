---
phase: 02-discovery
plan: "03"
subsystem: ui
tags: [nextjs, typescript, react, playwright, tailwindcss, aria, accessibility, perspective-toggle, executive-view, technical-view]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "InnovationRecordRow type from src/lib/db/types.ts (plan 01-02)"
  - phase: 01-foundation
    provides: "SSR /records/[slug] page, TrustBanner, ArtifactList, NextActionCTAs, RecordSection, getRecordBySlug() (plan 01-03)"
provides:
  - "PerspectiveToggle ('use client'): ARIA tablist with Executive and Technical tabs (F4.1)"
  - "ExecutiveView: F4.2 fields — problem, outcome, maturity/readiness, ownership, next step + TrustBanner"
  - "TechnicalView: F4.3 fields — architecture, tools, security, limitations, readiness gaps, reuse, artifacts + TrustBanner"
  - "Updated /records/[slug] page: replaces flat nine-section layout with PerspectiveToggle"
  - "e2e/perspective.spec.ts: 6 Playwright tests for F4.1–F4.4"
  - "All 34 Playwright tests pass: 7 catalog + 13 record-detail (updated) + 8 search + 6 perspective"
affects:
  - "03-stakeholder (builds on /records/[slug] page with PerspectiveToggle)"
  - "All future phases consuming the record detail page"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client component toggle on SSR page: PerspectiveToggle is 'use client' for useState; all data passed as props from SSR parent — no client-side data fetching"
    - "ARIA tablist pattern: role=tablist, role=tab, aria-selected, aria-controls, tabIndex managed so only active tab is in tab order (WCAG 2.1 AA)"
    - "Perspective-gated rendering: same InnovationRecordRow prop used by both views; conditional render by active tab state — no duplicate API calls (F4.4)"
    - "TrustBanner reused in both perspectives: same component instance per perspective ensures consistent trust signal display"

key-files:
  created:
    - "src/app/(public)/records/[slug]/PerspectiveToggle.tsx"
    - "src/app/(public)/records/[slug]/ExecutiveView.tsx"
    - "src/app/(public)/records/[slug]/TechnicalView.tsx"
    - "e2e/perspective.spec.ts"
  modified:
    - "src/app/(public)/records/[slug]/page.tsx (replaced flat nine-section layout with PerspectiveToggle)"
    - "e2e/record-detail.spec.ts (updated F3 test assertions to match perspective-toggle structure)"

key-decisions:
  - "PerspectiveToggle is a Client Component ('use client') for useState only; SSR page passes all data as props — keeps SSR benefits while enabling interactive tabs"
  - "TrustBanner rendered in both ExecutiveView and TechnicalView (not in PerspectiveToggle above tabs): ensures F4.4 trust signals visible regardless of active perspective"
  - "Updated e2e/record-detail.spec.ts (Rule 1 Bug fix): replaced stale F3 section name assertions with perspective-aware equivalents; all F3 content is still verified, just in the correct perspective"

patterns-established:
  - "Perspective toggle pattern: 'use client' component wrapping server-data view components — no re-fetching on perspective switch"
  - "ARIA tab panel pattern: executive-tab/executive-panel + technical-tab/technical-panel IDs; aria-selected boolean on active tab"

# Metrics
duration: 5min
completed: 2026-08-11
---

# Phase 2 Plan 03: Executive/Technical Perspective Toggle Summary

**ARIA tablist PerspectiveToggle on /records/[slug] page with ExecutiveView (F4.2: problem, outcome, maturity, ownership, next step) and TechnicalView (F4.3: architecture, tools, security, limitations, reuse, artifacts), both drawing from the same InnovationRecordRow and always showing TrustBanner (F4.4)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-08-11T16:14:46Z
- **Completed:** 2026-08-11T16:20:10Z
- **Tasks:** 1
- **Files modified:** 6

## Accomplishments

- PerspectiveToggle renders ARIA tablist with "Executive Perspective" and "Technical Perspective" tabs; keyboard-accessible (WCAG 2.1 AA); executive is the default
- ExecutiveView displays F4.2 audience-appropriate sections: The Problem, What Was Demonstrated, Maturity and Readiness, Ownership, Recommended Next Step + TrustBanner
- TechnicalView displays F4.3 audience-appropriate sections: Architecture, Tools and Services, Security Considerations, Known Limitations, Production-Readiness Gaps, Reuse Guidance, Authoritative Source Artifacts + TrustBanner
- Both perspectives use the same `InnovationRecordRow` prop — no second API call, no duplicate data source (F4.4)
- Record detail page updated: PerspectiveToggle replaces nine flat RecordSection calls; page remains SSR with client tab state only in PerspectiveToggle
- All 34 Playwright tests pass: 7 catalog + 13 record-detail (updated) + 8 search + 6 perspective

## Task Commits

Each task was committed atomically:

1. **Task 1: Perspective toggle components and updated record page with Playwright tests** - `1bb1673` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/app/(public)/records/[slug]/PerspectiveToggle.tsx` — 'use client' ARIA tablist toggle; manages active tab state; renders ExecutiveView or TechnicalView
- `src/app/(public)/records/[slug]/ExecutiveView.tsx` — F4.2 executive perspective with TrustBanner; renders from InnovationRecordRow prop
- `src/app/(public)/records/[slug]/TechnicalView.tsx` — F4.3 technical perspective with TrustBanner and ArtifactList; renders from InnovationRecordRow prop
- `src/app/(public)/records/[slug]/page.tsx` — Updated: replaces flat nine-section layout with `<PerspectiveToggle>` component
- `e2e/perspective.spec.ts` — 6 new Playwright tests for F4.1–F4.4 behaviors
- `e2e/record-detail.spec.ts` — Updated F3 test assertions to match perspective-toggle structure (Rule 1 Bug fix)

## Decisions Made

- **PerspectiveToggle as 'use client' wrapper:** The toggle needs `useState` for active perspective; all other record components are server-friendly. Using 'use client' only on PerspectiveToggle keeps SSR benefits for the data-fetching page.tsx.
- **TrustBanner in each view (not above tabs):** F4.4 requires TrustBanner visible in both perspectives. Rendering it inside each view (not above the tablist in the toggle) ensures it appears regardless of active tab, and the test can locate it in the active tabpanel.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated stale F3 Playwright tests in record-detail.spec.ts**
- **Found during:** Task 1 (running full Playwright suite after implementation)
- **Issue:** The 8 existing F3 tests in `e2e/record-detail.spec.ts` asserted for old flat section names ("Problem and Context", "What Was Explored", "Outcome and Evidence", "Key Findings", "Reuse Guidance", "Ownership and Attribution", "Authoritative Artifacts", "Next Action") that no longer exist after replacing the flat layout with PerspectiveToggle. Plan 02-03 explicitly replaces that layout — the test assertions became stale.
- **Fix:** Updated 8 failing F3 tests to assert for the new perspective-aware sections. Content coverage maintained: F3.1 checks "The Problem" in executive (default); F3.2 checks "Tools and Services" in technical; F3.3 checks "What Was Demonstrated" in executive; F3.4 checks "Architecture" in technical; F3.5–F3.9 similarly updated. All F3 content is still verified.
- **Files modified:** `e2e/record-detail.spec.ts`
- **Verification:** All 34 Playwright tests pass (0 failing)
- **Committed in:** 1bb1673 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug)
**Impact on plan:** The fix was essential — plan 02-03 explicitly replaces the flat layout, making the F3 test assertions stale. Updated tests still verify all F3 content is present, now in the correct audience-specific perspective.

## Known Stubs

None found — all perspective toggle functionality fully implemented with real data from InnovationRecordRow.

## Issues Encountered

None — implementation proceeded cleanly. TypeScript compiled clean on first attempt.

## User Setup Required

None - no external service configuration required. Dev stack is self-contained via Docker Compose.

## Next Phase Readiness

**Phase 2 success criteria — all met:**
1. ✅ Search page with full-text search, facet filtering, active filter chips (Plan 02-01)
2. ✅ Search UI with SearchForm, FilterPanel, SearchResultCard, ActiveFilters (Plan 02-02)
3. ✅ Record detail page with executive/technical perspective toggle from same underlying record fields (this plan)

**Phase 2 is complete.** Ready for Phase 3 (Stakeholder Engagement) — record detail page provides the anchor for engagement request forms and stakeholder login.

## Self-Check: PASSED

- All 6 key files created/modified on disk ✓
- Task commit 1bb1673 present ✓
- TypeScript: `tsc --noEmit` exits 0, no errors ✓
- Playwright: 34/34 tests pass (7 catalog + 13 record-detail + 8 search + 6 perspective) ✓
- Record page: `/records/audio-security-poc-2024` renders tablist with Executive and Technical tabs ✓
- ExecutiveView: "The Problem", "What Was Demonstrated", "Maturity and Readiness", "Ownership", "Recommended Next Step" sections render ✓
- TechnicalView: "Architecture", "Tools and Services", "Security Considerations", "Known Limitations", "Production-Readiness Gaps", "Reuse Guidance", "Authoritative Source Artifacts" sections render ✓
- TrustBanner visible in both perspectives ✓
- No blocking stubs found ✓

---
*Phase: 02-discovery*
*Completed: 2026-08-11*
