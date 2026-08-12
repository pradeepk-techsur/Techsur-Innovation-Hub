---
phase: 04
status: issues_found
blockers: 0
warnings: 8
files_reviewed: 4
files_reviewed_list:
  - src/middleware.ts
  - src/lib/auth/session.ts
  - src/app/curator/settings/page.tsx
  - e2e/curator-settings-rbac.spec.ts
reviewed_at: 2026-08-12T10:00:00Z
iteration: 4
---

# Phase 04 Code Review — Iteration 4 (gap-closure-3 wave, plan 04-07)

Scope: commits `e5e2063` and `9a5362b` — proxy hostname leak fix in middleware, SameSite=None
session cookie, curator settings 403 redirect to `/unauthorized`, and new Playwright regression spec.

Prior iterations (1–3) reviewed different file sets; their findings are preserved
unchanged in the carry-over section at the bottom of this document.

---

## BLOCKERs

None.

---

## WARNINGs

### W5: `nextUrl.clone()` carries original request query params into the `/login` redirect URL

- **File:** `src/middleware.ts`:38–40
- **Category:** bug
- **Evidence:**
  `request.nextUrl.clone()` produces a copy of the full `nextUrl` object — including any
  query string already on the incoming request. After `loginUrl.pathname = '/login'` the
  original params remain, so a request to `/curator/settings?debug=1&foo=bar` produces a
  redirect to `/login?debug=1&foo=bar&returnTo=%2Fcurator%2Fsettings`.

  The login page (`src/app/(public)/login/page.tsx:7–10`) reads only `searchParams.returnTo`
  and ignores all other params, so there is no functional breakage and no open-redirect
  risk (`searchParams.set('returnTo', pathname)` always overwrites any attacker-supplied
  `returnTo` value). The issue is cosmetic: arbitrary query params from protected-route
  requests are leaked verbatim into the login URL visible to the user and recorded in
  server access logs.

  The old `new URL('/login', request.url)` approach produced a clean `/login` URL (no
  carry-over params) despite its hostname-leak bug. The fix correctly solves the hostname
  problem but introduces this side-effect.

- **Fix direction:** After cloning, clear the search params before setting `returnTo`:
  `loginUrl.search = ''; loginUrl.searchParams.set('returnTo', pathname);`

---

### W6: `secure: true` unconditionally breaks session cookies for non-Chrome browsers on plain `http://localhost`

- **File:** `src/lib/auth/session.ts`:71, 81
- **Category:** bug
- **Evidence:**
  Both `setSessionCookie()` and `clearSessionCookie()` now set `secure: true`
  unconditionally. The `Secure` attribute tells the browser to transmit the cookie only
  over HTTPS. The local development environment runs on `http://localhost:3000`
  (`NEXT_PUBLIC_APP_URL=http://localhost:3000` in `.env.local`; Playwright
  `baseURL: 'http://localhost:3000'`).

  RFC 6265bis / browser behaviour:
  - **Chromium:** treats `localhost` as a "potentially trustworthy origin" and accepts
    `Secure` cookies over `http://localhost`. The Playwright test suite (Chromium-only)
    is therefore unaffected.
  - **Firefox / Safari:** do **not** extend this exemption unconditionally; a `Secure`
    cookie set by an `http://` response is silently dropped. Any developer testing with
    Firefox or Safari on a plain-http local stack will be unable to log in — the cookie
    is set by the login response but the browser discards it, making every subsequent
    request look unauthenticated.

  The STRIDE notes in the plan acknowledge that `NODE_ENV=production` was wrong but
  assert "the app runs HTTPS in both the Daytona preview and any real deployment". That
  is true for CI/prod, but the local `.env.local` is explicitly `http://`. The comment
  "always on for preview proxy" is accurate for the proxy use-case yet the blanket
  `secure: true` is too aggressive for the local dev case on non-Chrome browsers.

- **Fix direction:** Use `secure: process.env.NODE_ENV === 'production' || process.env.HTTPS === 'true'`
  (or a dedicated env flag `SESSION_COOKIE_SECURE`). This preserves the proxy-compatibility
  goal without silently breaking Firefox/Safari local development.

---

### W7: `setLoading(false)` omitted on the 403 branch — `accessDenied` guard is unreachable dead code

- **File:** `src/app/curator/settings/page.tsx`:67–71, 115–121
- **Category:** bug
- **Evidence:**
  ```ts
  // useEffect (line 65–84):
  if (res.status === 403) {
    setAccessDenied(true);   // sets accessDenied = true
    router.push('/unauthorized');
    return;                  // setLoading(false) is never reached
  }
  // ...
  setLoading(false);         // only runs on non-403 paths
  ```
  The render function checks `loading` first:
  ```ts
  if (loading) return <p>Loading settings…</p>;   // line 115-117
  if (accessDenied) return <p>Redirecting…</p>;   // line 119-121
  ```
  Because `loading` starts as `true` and is never set to `false` on the 403 path,
  the `accessDenied` branch (line 119) is dead code — it can never be reached. The
  page displays "Loading settings…" throughout the navigation, not the intended
  "Redirecting…" message. The `router.push('/unauthorized')` call fires correctly
  regardless (it is not gated on React render), so the redirect still works. The
  observable defect is purely cosmetic: the user sees "Loading settings…" rather
  than "Redirecting…" during the brief transition.

- **Fix direction:** Add `setLoading(false)` before `router.push('/unauthorized')` on the
  403 branch, or simply call it immediately after `setAccessDenied(true)`.

---

### W8: E2E tests 2 and 3 rely on client-side async redirect completing without an explicit wait

- **File:** `e2e/curator-settings-rbac.spec.ts`:21–24, 30–33
- **Category:** bug
- **Evidence:**
  Test 2 ("curator visiting /curator/settings → redirected to /unauthorized") and test 3
  ("admin visiting /curator/settings → settings page loads") both do:
  ```ts
  await page.goto('/curator/settings');
  await expect(page).toHaveURL(/\/unauthorized/);   // test 2
  await expect(page).toHaveURL(/\/curator\/settings/);  // test 3
  ```
  `page.goto()` resolves when the browser fires the `load` event for the initially
  navigated URL, which is `/curator/settings`. For test 2, the redirect to `/unauthorized`
  is triggered client-side: the page mounts → `useEffect` fires → `fetch` returns 403 →
  `router.push('/unauthorized')`. This is an async chain that starts *after* `page.goto()`
  has already resolved. `toHaveURL` does have an internal retry/polling mechanism (default
  5 s timeout), so the assertion will usually pass, but there is no explicit
  `page.waitForURL(/\/unauthorized/)` call that would make the intent and the wait
  semantics unambiguous. Under CI load or slow DB response, the `fetch` can take long
  enough that the assertion flakes before `router.push` fires.

  Test 3 is the inverse — it asserts the URL has NOT changed — which is less flaky but
  still relies on timing to confirm the happy-path admin load completes before the URL
  assertion is evaluated.

- **Fix direction:** Insert `await page.waitForURL(/\/unauthorized/)` (test 2) and
  `await page.waitForLoadState('networkidle')` (test 3) before the URL assertions, making
  the intended timing contract explicit and eliminating the implicit race.

---

## Confirmed correct — 04-07 items

| Item | Finding |
|---|---|
| **SameSite=None requires Secure=true** | PASS — `secure: true` is set unconditionally in both `setSessionCookie()` (line 71) and `clearSessionCookie()` (line 81). The RFC requirement is met; see W6 for the local-http side-effect. |
| **No open redirect via cloned `returnTo` param** | PASS — `loginUrl.searchParams.set('returnTo', pathname)` always overwrites any incoming `returnTo` value with the actual middleware-computed pathname. |
| **`/unauthorized` page exists outside `/curator` route tree** | PASS — `src/app/unauthorized/page.tsx` confirmed at the app root; middleware matcher does not cover `/unauthorized`. No redirect loop. |
| **Settings API returns 403 for curator role** | PASS — `src/app/api/v1/curator/settings/route.ts` calls `requireRole(request, 'admin')`; curator role rank is below admin rank → returns 403. |
| **Layout does not block curator from `/curator/settings` at SSR** | PASS — `layout.tsx` allows `session.role === 'curator'`; RBAC enforcement is delegated to the settings API 403 → client-side redirect chain. |
| **Playwright test 1 (unauthenticated redirect)** | PASS — uses `page.request.get(..., { maxRedirects: 0 })` entirely in the API context; no page-vs-request cookie jar split. Hostname pattern assertions cover the known proxy patterns. |
| **Playwright test 4 (curator API 403)** | PASS — uses `page.request.post` then `page.request.get`; same API request context shares cookies. |
| **TypeScript compilation** | PASS — `npx tsc --noEmit` exits 0 with no output. |

---

## Cross-file seams checked (iteration 4)

| Seam | Status |
|---|---|
| `middleware.ts` `nextUrl.clone()` → `NextResponse.redirect(loginUrl)` — internal hostname preserved | OK — `nextUrl` always carries the app's own origin, not the proxy's external origin. W5 notes a side-effect. |
| `middleware.ts` `loginUrl.searchParams.set('returnTo', pathname)` → `login/page.tsx` reads `searchParams.returnTo` | OK — login page only consumes `returnTo`; extra params from W5 are silently ignored. |
| `session.ts` `setSessionCookie` / `clearSessionCookie` → `api/auth/login/route.ts` + `api/auth/logout/route.ts` callers | OK — both callers pass a `NextResponse`; no signature drift. |
| `settings/page.tsx` `router.push('/unauthorized')` on 403 → `src/app/unauthorized/page.tsx` exists | OK — destination page is confirmed. |
| E2E `page.request.post('/api/auth/login', { data: { role: ... } })` → login route reads `body.role` | OK — `src/app/api/auth/login/route.ts` line 9: `const credential = body.role ?? body.credential ?? 'stakeholder'`. |
| E2E `page.request.get('/api/v1/curator/settings')` → settings route `GET` export at matching path | OK — `src/app/api/v1/curator/settings/route.ts` exports `GET`. |

---

## Carry-over from iterations 1–3 (unchanged)

### W4: Non-integer `page`/`page_size` query params propagate `NaN` to DB `LIMIT`/`OFFSET` — unhandled 500
- **File:** `src/app/api/v1/curator/audit/route.ts`:11–12
- **Category:** bug
- *(Full evidence in iteration-3 section.)*

### W1: `getRecord()` — non-404 API error swallowed by catch, renders misleading 404 page
- **File:** `src/app/curator/records/[id]/page.tsx`:17–22

### W2: `redirect('/login?returnTo=/curator/records')` in `[id]/page.tsx` discards the record URL
- **File:** `src/app/curator/records/[id]/page.tsx`:27

### W3: Playwright `beforeEach` uses `page.request.post(...)` for authentication — cookie propagation not guaranteed across all configurations
- **File:** `e2e/curator-cookie-forwarding.spec.ts`:6
- **Note (iteration 4):** In Playwright 1.x, `page.request` is the context-bound
  `APIRequestContext` and shares cookies with the browser context; cookie propagation to
  `page.goto()` does work. W3 is therefore lower severity than originally assessed — it
  is a documentation/clarity issue, not a functional defect in the Chromium-only CI suite.
  The concern remains open for environments that use isolated request contexts.

*(Full evidence for W1–W3 in iteration-2 section — file history.)*
