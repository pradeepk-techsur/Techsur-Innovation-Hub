---
phase: 02-discovery
plan: "02"
subsystem: ui
tags: [nextjs, react, ssr, search-ui, playwright, tailwindcss, accessibility, wcag]

# Dependency graph
requires:
  - phase: 02-discovery
    provides: "GET /api/v1/search — PostgreSQL full-text search with plainto_tsquery + ts_rank; GET /api/v1/search/facets — 6-dimension facet counts"
provides:
  - "SSR /search page at /search — reads URL params for initial state (q, maturity[], mission_areas[], technology_areas[], review_statuses[], contributing_offices[], reuse_potential, page)"
  - "SearchForm client component: GET form with query input, preserves active filter URL params on submit"
  - "FilterPanel client component: 5 facet checkbox groups (maturity, mission area, technology area, review status, contributing office) with counts — fieldset/legend WCAG 2.1 AA"
  - "SearchResultCard: F2.4 trust-signal-preserving result card (MaturityBadge, ReviewStatusBadge, contributing office, last reviewed)"
  - "ActiveFilters client component: removable chips per active filter value; chip removal updates URL params"
  - "ARIA live region on result count for screen reader announcement"
  - "No-results empty state with helpful message"
  - "Search nav link in public layout — IA-01 no orphaned route"
  - "8 Playwright tests covering F2.1–F2.5 behaviors"
affects:
  - "03-records (Search page links to /records/[slug]; search result cards share MaturityBadge + ReviewStatusBadge)"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SSR page calls internal API via fetch() with no-store cache: avoids service-direct import, keeps response shape consistent with external callers"
    - "Client filter components use useRouter + useSearchParams for URL-driven state: filter changes push new URL, SSR page re-fetches"
    - "Suspense boundary wraps all client components (SearchForm, FilterPanel, ActiveFilters) that call useSearchParams: required by Next.js App Router for SSR correctness"
    - "FilterGroup + FilterCheckbox decomposition: FilterGroup owns router logic; each entry rendered independently"
    - "fieldset/legend per filter group: WCAG 2.1 AA semantic grouping for screen readers"
    - "role=status + aria-live=polite + aria-atomic=true: announces result count changes to assistive technology"

key-files:
  created:
    - "src/app/(public)/search/page.tsx"
    - "src/app/(public)/search/SearchForm.tsx"
    - "src/app/(public)/search/FilterPanel.tsx"
    - "src/app/(public)/search/SearchResultCard.tsx"
    - "src/app/(public)/search/ActiveFilters.tsx"
    - "e2e/search.spec.ts"
  modified:
    - "src/app/(public)/layout.tsx (added Search nav link)"

key-decisions:
  - "SSR page calls /api/v1/search via fetch() rather than importing searchRecords() directly: keeps API validation/response shape identical for external and internal callers; avoids coupling search page to service layer internals"
  - "Playwright test F2.1 starts from /catalog (not /) because root / is outside public layout group — no nav bar at /: test checks reachability from a public-layout page where the nav lives"

patterns-established:
  - "Public layout nav: Add href links here for all public routes (not the root app layout)"
  - "Search result cards: Always import MaturityBadge and ReviewStatusBadge from catalog — shared visual components, never reimplemented"
  - "Suspense wrapper: Any client component calling useSearchParams needs Suspense boundary in server component parent"

# Metrics
duration: 5min
completed: 2026-08-11
---

# Phase 2 Plan 02: Search Page UI Summary

**SSR /search page with SearchForm, faceted FilterPanel, ActiveFilters chips, and trust-signal-preserving SearchResultCard — wired to the public nav and verified by 8 Playwright tests covering F2.1–F2.5**

## Performance

- **Duration:** 5 min
- **Started:** 2026-08-11T16:06:21Z
- **Completed:** 2026-08-11T16:11:52Z
- **Tasks:** 1
- **Files modified:** 7

## Accomplishments

- Problem-oriented search page at /search — user types mission language, sees ranked results without knowing project names (F2.1, F2.5)
- Faceted filter panel with 5 checkbox groups (maturity, mission area, technology area, review status, contributing office) — each checkbox updates URL params, SSR page re-fetches (F2.3)
- Active filter chips with per-chip removal (F2.3)
- Every result card preserves all F2.4 trust signals: MaturityBadge (filled ▲ pill), ReviewStatusBadge (outlined ✓/🛡), contributing office, last reviewed date
- ARIA live region (`role="status" aria-live="polite"`) announces result count for screen readers (WCAG 2.1 AA)
- No-results empty state with helpful message — no blank page
- Search nav link in `(public)/layout.tsx` — /search reachable from every public page (IA-01)
- 8/8 Playwright tests pass (F2.1–F2.5)

## Task Commits

Each task was committed atomically:

1. **Task 1: Search page UI with filter panel, result cards, active filters, and nav wiring** - `8bea3df` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/app/(public)/search/page.tsx` — SSR search page reading URL params, concurrent fetch of results + facets, result count live region
- `src/app/(public)/search/SearchForm.tsx` — Client search form: role="search", GET to /search, preserves filter params on submit
- `src/app/(public)/search/FilterPanel.tsx` — 5 facet filter groups; each FilterGroup uses useRouter+useSearchParams to push updated URL on checkbox change; fieldset/legend per group (WCAG 2.1 AA)
- `src/app/(public)/search/SearchResultCard.tsx` — Result card with MaturityBadge, ReviewStatusBadge, contributing office, last reviewed (F2.4 trust preservation)
- `src/app/(public)/search/ActiveFilters.tsx` — Removable filter chips per active filter value; × button calls router.push with param removed
- `e2e/search.spec.ts` — 8 Playwright tests covering F2.1–F2.5 behaviors
- `src/app/(public)/layout.tsx` — Added `<Link href="/search">Search</Link>` to public nav

## Decisions Made

- **SSR page uses fetch() to /api/v1/search** instead of importing `searchRecords()` directly: keeps validation/response shape identical to what external callers see; no coupling between search page and service layer internals
- **Playwright F2.1 test starts from /catalog, not /**: root `/` is a "Coming Soon" page outside the `(public)` route group — no public nav bar there. Test correctly navigates from a page that has the nav bar (catalog)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Playwright F2.1 test used wrong starting URL (/ instead of /catalog)**
- **Found during:** Task 1 (Playwright test execution)
- **Issue:** The plan's provided test code starts from `/` (root page) and clicks the Search nav link. The root `/` page is the app's "Coming Soon" placeholder outside the `(public)` route group — it has no navigation bar. The Search link lives in `(public)/layout.tsx` which only wraps `/catalog`, `/search`, `/records`.
- **Fix:** Changed `page.goto('/')` to `page.goto('/catalog')` — starts from a page that actually uses the public layout containing the nav
- **Files modified:** `e2e/search.spec.ts`
- **Verification:** All 8 Playwright tests pass (0 failed)
- **Committed in:** `8bea3df` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug)
**Impact on plan:** Necessary for test correctness — no scope change. The Search nav link IS present in the public layout; the test just needed to start from a page that renders that layout.

## Known Stubs

None found. All handlers return real data from the search API. No hardcoded responses, no TODO/FIXME in created files.

## Issues Encountered

None beyond the deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- F2.1–F2.5 fully implemented and tested: problem-oriented search + faceted filtering + trust model preserved
- Phase 2 complete — both plans done (02-01 search backend + 02-02 search UI)
- Ready for Phase 3: Innovation Record detail view

## Self-Check: PASSED

- `src/app/(public)/search/page.tsx` ✓ found on disk
- `src/app/(public)/search/SearchForm.tsx` ✓ found on disk
- `src/app/(public)/search/FilterPanel.tsx` ✓ found on disk
- `src/app/(public)/search/SearchResultCard.tsx` ✓ found on disk
- `src/app/(public)/search/ActiveFilters.tsx` ✓ found on disk
- `e2e/search.spec.ts` ✓ found on disk
- Task commit: `8bea3df` ✓ present in git log
- Build check: `tsc --noEmit` → exit 0 ✓
- Playwright: 8/8 tests pass ✓
- No blocking stubs found ✓

---
*Phase: 02-discovery*
*Completed: 2026-08-11*
