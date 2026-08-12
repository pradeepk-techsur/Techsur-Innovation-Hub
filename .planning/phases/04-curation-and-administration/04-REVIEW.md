---
phase: 04
status: clean
blockers: 0
warnings: 1
files_reviewed: 5
files_reviewed_list:
  - src/app/api/v1/curator/audit/route.ts
  - src/app/curator/audit/page.tsx
  - src/app/unauthorized/page.tsx
  - src/app/curator/layout.tsx
  - e2e/curator-audit-rbac-gaps.spec.ts
reviewed_at: 2026-08-12T00:00:00Z
iteration: 3
---

# Phase 04 Code Review — Iteration 3 (gap-closure-2 wave, plans 04-06)

Scope: commits `8cdb766` and `b631e8b` — global audit log API + page, `/unauthorized` page,
curator layout RBAC split, and Playwright regression spec.

Prior iterations (1–2) reviewed a different file set; findings from those iterations are
preserved below the iteration-3 section unchanged.

---

## BLOCKERs

None.

---

## WARNINGs

### W4: Non-integer `page`/`page_size` query params propagate `NaN` to DB `LIMIT`/`OFFSET` — unhandled 500

- **File:** `src/app/api/v1/curator/audit/route.ts`:11–12
- **Category:** bug
- **Evidence:**
  ```ts
  const page     = Math.max(1, Number(searchParams.get('page')      ?? 1));
  const pageSize = Math.min(100, Number(searchParams.get('page_size') ?? 50));
  ```
  `searchParams.get()` returns `null` when absent (the `?? 1` / `?? 50` defaults fire) or the
  raw string when present. When the param is present but non-numeric (e.g. `?page=abc`),
  `Number('abc')` evaluates to `NaN`, and both `Math.max(1, NaN)` and `Math.min(100, NaN)`
  return `NaN` rather than the fallback integer:

  ```
  > Math.max(1, Number('abc'))  → NaN
  > Math.min(100, Number('abc')) → NaN
  ```

  `NaN` is then forwarded to Kysely's `.limit(NaN)` and `.offset(NaN)`, which will either throw a
  DB driver error or produce an invalid query — both surface as an unhandled 500 to the caller.

  This endpoint is gated by `requireRole(request, 'admin')`, so the blast radius is confined to
  admins crafting malformed requests; there is no data corruption or privilege escalation risk.
  Classified WARNING (degraded path, not a core feature failure).

- **Fix direction:** Replace `Number(x ?? fallback)` with `parseInt(x ?? '', 10) || fallback`
  (or add `|| fallback` after `Number()`), or add an explicit `isNaN` guard before using the
  values. The fix is the same pattern already in use in several other paginated routes in this
  codebase.

---

## Confirmed correct — T-04-06 test items

| Item | Finding |
|---|---|
| **T-04-06-01** ip_address never in `/api/v1/curator/audit` response | PASS — explicit `select([...])` list contains 8 named columns; `ip_address` is absent. Column is stored separately and never aliases into `event_data`. |
| **T-04-06-02** `requireRole('admin')` enforced — curators get 403 | PASS — line 7 of `route.ts`; `requireRole` rank-checks `ROLE_RANK['curator']=2 < ROLE_RANK['admin']=3` and returns 403. |
| **T-04-06-04** Layout split: `!session` → `/login`; wrong-role → `/unauthorized` | PASS — two separate `if` guards at lines 9–13 and 15–19 of `layout.tsx`; redirect targets are distinct. |
| `/unauthorized` at top-level (no redirect loop) | PASS — `src/app/unauthorized/page.tsx` exists outside `/curator` route tree; middleware `matcher` only covers `/curator/:path*` so `/unauthorized` is never re-protected. |

---

## Cross-file seams checked (iteration 3)

| Seam | Status |
|---|---|
| `layout.tsx` `getSession()` → `redirect('/login?returnTo=/curator')` / `redirect('/unauthorized')` split | OK — two distinct branches, no collapse |
| `layout.tsx` `session.role === 'admin'` sidebar guard → only admin sees "Audit Log" link | OK — curator cannot navigate to audit page via sidebar |
| `audit/page.tsx` SSR fetch → `NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'` | OK — consistent with codebase-wide pattern (`curator/page.tsx`, `records/page.tsx`, `search/page.tsx`); `reference/page.tsx`'s use of `NEXTAUTH_URL` is a pre-existing outlier, out of scope |
| `audit/page.tsx` `{ cache: 'no-store', headers: { cookie } }` → `route.ts` `getRequestSession` reads cookie | OK — same pattern as `reference/page.tsx`; cookie is forwarded via `(await headers()).get('cookie')` |
| `route.ts` `GET` export → `page.tsx` fetch path `/api/v1/curator/audit` | OK — path matches Next.js file location `src/app/api/v1/curator/audit/route.ts` |
| `route.ts` response shape `{ status, data, meta: { page, page_size, total } }` → `page.tsx` reads `json.data`, `json.meta.total` | OK — shapes match |
| `requireRole(request, 'admin')` return type `{ session } \| Response` → `if (auth instanceof Response) return auth` guard | OK — standard pattern; `auth instanceof Response` is a valid discriminant for `NextResponse` |
| E2E: `page.request.post('/api/auth/login', { data: { role: 'stakeholder' } })` → login route accepts `body.role` | OK — confirmed from login route at `src/app/api/auth/login/route.ts`:9 |
| E2E: `/unauthorized` URL tested → `src/app/unauthorized/page.tsx` exists and renders "Access Restricted" h1 | OK |
| No `src/app/curator/unauthorized/` directory created (would cause redirect loop) | OK — directory does not exist |

---

## Carry-over from iterations 1–2

The three warnings from iteration 2 (W1–W3) are unchanged and remain open:

### W1: `getRecord()` — non-404 API error swallowed by catch, renders misleading 404 page
- **File:** `src/app/curator/records/[id]/page.tsx`:17–22

### W2: `redirect('/login?returnTo=/curator/records')` in `[id]/page.tsx` discards the record URL
- **File:** `src/app/curator/records/[id]/page.tsx`:27

### W3: Playwright `beforeEach` uses `page.request.post(...)` for authentication — cookie propagation not guaranteed across all configurations
- **File:** `e2e/curator-cookie-forwarding.spec.ts`:6

*(Full evidence for W1–W3 in iteration-2 section above.)*
