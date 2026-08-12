---
phase: 04-curation-and-administration
plan: "07"
subsystem: auth
tags: [middleware, session-cookie, samesite, rbac, playwright, proxy]

# Dependency graph
requires:
  - phase: 04-curation-and-administration
    provides: RBAC enforcement, settings API, /unauthorized page
provides:
  - SameSite=None; Secure session cookie for cross-origin preview proxy compatibility
  - Path-relative middleware login redirect (no proxy hostname leak)
  - Curator settings page redirects to /unauthorized on 403
  - Playwright regression spec with 4 tests covering gap closure behaviors
affects: [05-launch-acceptance]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "nextUrl.clone() for middleware redirects: avoids proxy hostname leaking into Location header"
    - "SameSite=None + Secure unconditionally for cross-origin session delivery"

key-files:
  created:
    - e2e/curator-settings-rbac.spec.ts
  modified:
    - src/middleware.ts
    - src/lib/auth/session.ts
    - src/app/curator/settings/page.tsx

key-decisions:
  - "Use nextUrl.clone() in middleware redirect — preserves internal path without request.url origin"
  - "SameSite=None; Secure unconditionally — proxy runs HTTPS, old NODE_ENV condition was root cause of iframe cookie issue"
  - "Settings page client-side 403 redirect targets /unauthorized, not /curator — matches AUTH-04 contract"

patterns-established:
  - "Docker container requires direct file copy (docker cp) when hot-reload doesn't pick up changes: container has COPY of source, not bind mount"

# Metrics
duration: 6min
completed: 2026-08-12
---

# Phase 4 Plan 7: Middleware Proxy Hostname Leak & SameSite Cookie Fix Summary

**Fixed Next.js middleware proxy hostname leak via `request.nextUrl.clone()`, upgraded session cookie to `SameSite=None; Secure`, corrected settings 403 redirect to `/unauthorized`, with 4-test Playwright regression suite — all 4 pass, full e2e suite 67/68 passing.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-08-12T17:50:08Z
- **Completed:** 2026-08-12T17:56:58Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Fixed middleware login redirect using `request.nextUrl.clone()` so redirect Location header never contains the Daytona preview proxy's external hostname
- Updated `setSessionCookie()` and `clearSessionCookie()` to use `sameSite: 'none'` and `secure: true` unconditionally, enabling cross-origin session delivery through the preview proxy
- Changed settings page 403 handler to redirect to `/unauthorized` (was `/curator`) — matches AUTH-04 RBAC contract
- Created `e2e/curator-settings-rbac.spec.ts` with 4 Playwright regression tests; all 4 pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix middleware hostname leak + SameSite cookie** - `e5e2063` (fix)
2. **Task 2: Playwright regression spec** - `9a5362b` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `src/middleware.ts` — Login redirect now uses `request.nextUrl.clone()` instead of `new URL('/login', request.url)` — eliminates proxy hostname in Location header
- `src/lib/auth/session.ts` — `setSessionCookie()` and `clearSessionCookie()` use `sameSite: 'none'` + `secure: true` unconditionally
- `src/app/curator/settings/page.tsx` — 403 handler redirects to `/unauthorized` (was `/curator`)
- `e2e/curator-settings-rbac.spec.ts` — 4-test Playwright regression suite asserting gap closure behaviors

## Decisions Made

- **`nextUrl.clone()` pattern for middleware redirects**: `new URL('/login', request.url)` embeds the request's origin (which behind the Daytona proxy is the external hostname) into the redirect. `nextUrl.clone()` uses Next.js's own normalized URL, which is always the app's internal address.
- **`SameSite=None; Secure` unconditionally**: The old `secure: process.env.NODE_ENV === 'production'` caused cookies to be absent in the cross-site preview context. The app runs HTTPS in both preview and production; setting unconditionally is correct and required by browsers when `sameSite='none'`.
- **Settings 403 → `/unauthorized`**: AUTH-04 requires wrong-role users see the RBAC denial page, not silently fall back to an accessible area.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm install required before build verification**
- **Found during:** Task 1 verification (npx tsc)
- **Issue:** No `node_modules` directory in `/home/daytona/project` — project not installed on host
- **Fix:** Ran `npm install` to install dependencies; used `npm run build` for TypeScript verification
- **Files modified:** `node_modules/` (not tracked), `package-lock.json` (already committed)
- **Verification:** `npm run build` exits 0, `✓ Compiled successfully`
- **Committed in:** N/A (install only)

**2. [Rule 3 - Blocking] Playwright browsers not installed**
- **Found during:** Task 2 (first test run)
- **Issue:** `chrome-headless-shell` binary missing from cache; also missing system dependencies (`libnspr4.so`)
- **Fix:** Ran `npx playwright install chromium` then `npx playwright install-deps chromium`
- **Files modified:** None (system libraries + browser binary installed)
- **Verification:** Tests run successfully after install
- **Committed in:** N/A (browser install only)

**3. [Rule 3 - Blocking] Docker container has stale compiled bundle for settings page**
- **Found during:** Task 2 (second test run — test 2 failing)
- **Issue:** App runs in Docker container (`project-app-1`). Host source file edits are not automatically synced to the container (no bind mount). The container's dev server served the OLD compiled JavaScript with `router.push('/curator')` even after host file was updated.
- **Fix:** Used `docker cp` to copy the updated `page.tsx` (and `middleware.ts`, `session.ts`) directly into the running container. The Next.js dev server inside the container then hot-reloaded the file and served the correct bundle.
- **Files modified:** N/A (container file sync, not a new source change)
- **Verification:** `curl localhost:3000/_next/static/chunks/app/curator/settings/page.js` shows `push('/unauthorized')` after sync
- **Committed in:** N/A (container state management)

---

**Total deviations:** 3 auto-fixed (all Rule 3 - Blocking)
**Impact on plan:** All three were environment setup issues (missing install, missing browser binaries, Docker container file sync). No scope creep. All source code changes are correct as written in the plan.

## Issues Encountered

The Docker compose architecture (no bind mounts) required an explicit `docker cp` to synchronize edited source files into the running container. This is an environment-specific pattern: when editing source files on the host while Next.js dev runs inside a Docker container, changes require either `docker cp` or a container rebuild. The dev server's hot-reload only detects inotify events inside the container, not on the host filesystem. Documented as a pattern for future plans.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None found.

## Next Phase Readiness
- Phase 4 gap closure complete; AUTH-04 and AUTH-05 are now properly implemented
- All 4 regression tests pass; full e2e suite 67/68 (1 pre-existing `record-detail` F3.9 advisory failure)
- Ready for Phase 5 — Launch Acceptance

## Self-Check: PASSED

Verified:
- `src/middleware.ts` — `nextUrl.clone` present at line 38
- `src/lib/auth/session.ts` — `sameSite: 'none'` at lines 72, 82; `secure: true` at lines 71, 81
- `src/app/curator/settings/page.tsx` — `router.push('/unauthorized')` at line 69
- `e2e/curator-settings-rbac.spec.ts` — exists with 4 tests
- Commits: `e5e2063` (Task 1), `9a5362b` (Task 2) — both present in git log
- Build check: `npm run build` → `✓ Compiled successfully in 1513ms` → exit 0
- Playwright spec: 4/4 tests pass

---
*Phase: 04-curation-and-administration*
*Completed: 2026-08-12*
