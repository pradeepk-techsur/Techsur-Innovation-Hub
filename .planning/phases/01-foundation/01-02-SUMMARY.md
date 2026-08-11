---
phase: 01-foundation
plan: "02"
subsystem: api
tags: [nextjs, postgresql, kysely, typescript, playwright, tailwindcss, catalog, ssr]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Next.js 15 App Router + PostgreSQL 16 docker stack with all 8 tables and Kysely client"
provides:
  - "Kysely Database types with MaturityValue, PublicationState, EngagementIndicator enum aliases"
  - "InnovationRecordRow and CatalogCardData utility types for catalog display"
  - "GET /api/v1/catalog: published-only records with {data: CatalogCardData[], meta: {total}} shape"
  - "getPublishedCatalog() repository function filtering publication_state = 'published'"
  - "SSR /catalog page with anonymous access (AUTH-01) and 60s revalidation"
  - "CatalogCard component with F1.2-F1.5 trust signals"
  - "MaturityBadge (filled ▲ pill, 6 maturity levels with distinct colors)"
  - "ReviewStatusBadge (outlined ✓/🛡 badge, SEC-11 shield for security_reviewed)"
  - "2 idempotent seed records: audio-security-poc-2024 (experiment_poc) and nlp-docket-analytics-pilot-2024 (prototype_pilot)"
  - "Playwright e2e/catalog.spec.ts covering F1.1-F1.6 + draft exclusion (7 tests, all pass)"
affects:
  - "01-03 (Record Display — reads same published records; CatalogCardData → InnovationRecordRow context)"
  - "All future phases consuming catalog data shape"

# Tech tracking
tech-stack:
  added:
    - "@playwright/test@1.62 (E2E browser testing)"
  patterns:
    - "Public route group (public) pattern with shared layout for anonymous-accessible routes"
    - "SSR catalog page calling repository directly (no fetch overhead); revalidate=60 for freshness"
    - "MaturityBadge vs ReviewStatusBadge visual distinction: filled pill + ▲ vs outlined + ✓/🛡"
    - "SEC-11: security_reviewed uses shield emoji + purple border vs technically_reviewed blue + checkmark"
    - "ON CONFLICT (slug) DO NOTHING for idempotent seed across compose restarts"

key-files:
  created:
    - "src/lib/db/seed.ts"
    - "src/lib/repositories/innovation-records.repository.ts"
    - "src/app/api/v1/catalog/route.ts"
    - "src/app/(public)/layout.tsx"
    - "src/app/(public)/catalog/page.tsx"
    - "src/app/(public)/catalog/CatalogCard.tsx"
    - "src/app/(public)/catalog/MaturityBadge.tsx"
    - "src/app/(public)/catalog/ReviewStatusBadge.tsx"
    - "e2e/catalog.spec.ts"
    - "playwright.config.ts"
  modified:
    - "src/lib/db/types.ts (added MaturityValue, PublicationState, EngagementIndicator, InnovationRecordRow, CatalogCardData)"
    - "src/app/layout.tsx (accessible HTML: html lang=en, meta viewport, skip-to-main-content)"
    - "docker-compose.yml (added db:seed to startup command)"
    - "package.json (added db:seed script, @playwright/test devDep)"

key-decisions:
  - "SSR page calls repository directly instead of fetch('/api/v1/catalog') — avoids loopback HTTP overhead in server components"
  - "MaturityBadge: filled rounded-full pill with ▲ prefix; ReviewStatusBadge: outlined rounded badge with ✓ or 🛡 prefix — distinct by shape AND icon"
  - "security_reviewed uses shield emoji (🛡) + purple border per SEC-11, distinct from technically_reviewed (✓ + blue)"
  - "Seed uses ON CONFLICT (slug) DO NOTHING — idempotent across compose volume restarts"
  - "revalidate=60 on catalog page balances freshness vs DB load without full SSR on every request"

patterns-established:
  - "(public) route group: layout with header/nav wraps all anonymous routes; root layout is minimal HTML wrapper"
  - "Repository pattern: src/lib/repositories/*.repository.ts encapsulates Kysely queries; pages/routes import repository functions, not db directly"
  - "Trust signal badge pattern: aria-label='Maturity: {label}' and aria-label='Review status: {label}' for accessibility"

# Metrics
duration: 7min
completed: 2026-08-11
---

# Phase 1 Plan 02: Innovation Catalog Summary

**SSR catalog page at /catalog with GET /api/v1/catalog returning published-only innovation records — CatalogCard components with F1.1–F1.6 trust signals (maturity, review status, contributing office, engagement indicator, last-reviewed date) and 7 passing Playwright tests**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-11T14:29:51Z
- **Completed:** 2026-08-11T14:36:59Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments

- GET /api/v1/catalog returns published-only records with typed `{ data: CatalogCardData[], meta: { total } }` shape; draft exclusion verified programmatically (T-01-02-01)
- /catalog SSR page renders both seed records with all F1.2–F1.5 trust signals visible
- MaturityBadge and ReviewStatusBadge are visually distinct: filled pill + ▲ vs outlined badge + ✓/🛡 (F1.6, SEC-11)
- 2 idempotent seed records with different maturities: `experiment_poc` (demo_available, technically+security reviewed) and `prototype_pilot` (seeking_adoption_partner, curated)
- All 7 Playwright tests pass (F1.1–F1.6 + draft-exclusion API test)
- TypeScript compiles clean (`tsc --noEmit` exit 0)

## Task Commits

Each task was committed atomically:

1. **Task 1: TypeScript Database types and seed fixtures** - `55a966d` (feat)
2. **Task 2: Catalog API route, catalog page, and card components with Playwright tests** - `ee97b97` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/lib/db/types.ts` — Added MaturityValue, PublicationState, EngagementIndicator enum aliases; InnovationRecordRow alias; CatalogCardData projected type
- `src/lib/db/seed.ts` — Idempotent seed: 2 published records (audio-security-poc-2024, nlp-docket-analytics-pilot-2024)
- `src/lib/repositories/innovation-records.repository.ts` — getPublishedCatalog() Kysely query filtering publication_state='published'
- `src/app/api/v1/catalog/route.ts` — GET handler returning {data, meta} JSON
- `src/app/(public)/layout.tsx` — Public nav with Hub title + Browse link
- `src/app/(public)/catalog/page.tsx` — SSR catalog page, anonymous access, revalidate=60
- `src/app/(public)/catalog/CatalogCard.tsx` — Full card: title, summary, badges, office, engagement, date
- `src/app/(public)/catalog/MaturityBadge.tsx` — Filled pill ▲ with per-maturity colors
- `src/app/(public)/catalog/ReviewStatusBadge.tsx` — Outlined ✓/🛡 badge; security_reviewed = purple + shield
- `src/app/layout.tsx` — Updated: html lang=en, meta charset/viewport, skip-to-main-content link
- `docker-compose.yml` — Added db:seed to startup command sequence
- `package.json` — Added db:seed script, @playwright/test devDep
- `e2e/catalog.spec.ts` — 7 Playwright tests for F1.1–F1.6 + draft exclusion
- `playwright.config.ts` — Playwright config targeting http://localhost:3000

## Decisions Made

- **SSR page calls repository directly** (not `fetch('/api/v1/catalog')`) — avoids loopback HTTP overhead in Next.js server components; repository can be used directly from server context
- **Dual visual distinction for badges** (F1.6): shape (rounded-full vs rounded) + icon prefix (▲ vs ✓/🛡) + color scheme (amber/blue/green vs teal/blue/purple) — three-layer distinction so even color-blind users can distinguish
- **security_reviewed shield emoji** (SEC-11): 🛡 + purple border makes it unambiguous even when multiple review statuses are shown together
- **ON CONFLICT (slug) DO NOTHING** for seed: compose named volumes persist across restarts; seed runs on every app boot, so idempotency is critical

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing libnspr4.so system dependency for Playwright**
- **Found during:** Task 2 (Playwright test execution)
- **Issue:** `chrome-headless-shell: error while loading shared libraries: libnspr4.so: cannot open shared object file: No such file or directory` — browser process crashed with exit 127 on all 6 browser-based tests
- **Fix:** Ran `npx playwright install-deps chromium` to install required system libraries (libnspr4, libgbm1, libpango, xvfb, etc.)
- **Files modified:** System-level only (no project files changed)
- **Verification:** All 7 Playwright tests pass after dependency installation
- **Committed in:** System-level fix; tests committed in ee97b97

---

**Total deviations:** 1 auto-fixed (1 Rule 3 blocking)
**Impact on plan:** Missing system library would have blocked all browser E2E tests. One-time install of Playwright browser dependencies. No scope creep.

## Known Stubs

None found.

## Issues Encountered

None beyond the deviation documented above.

## User Setup Required

None - no external service configuration required. Dev stack is self-contained via Docker Compose.

## Next Phase Readiness

- Catalog foundation complete: anonymous users can browse at http://localhost:3000/catalog
- API endpoint ready: GET /api/v1/catalog returns typed CatalogCardData[] for published records
- Repository pattern established: future plans import from `@/lib/repositories/*.repository.ts`
- Badge components ready for reuse in plan 01-03 (record detail page)
- Ready for Plan 03: Innovation Record Display (F3 — full record model, uses same DB records)

## Self-Check: PASSED

- All 14 key files found on disk ✓
- 2 task commits present (55a966d, ee97b97) ✓
- TypeScript: `tsc --noEmit` exits 0, no errors ✓
- Playwright: 7/7 tests pass ✓
- API: GET /api/v1/catalog returns 200 with 2 published records ✓
- Page: /catalog renders with H1 "Innovation Catalog" and 2 cards ✓
- Draft leak check: NO DRAFT LEAK ✓
- No stubs found ✓

---
*Phase: 01-foundation*
*Completed: 2026-08-11*
