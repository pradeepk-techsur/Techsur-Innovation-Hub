---
phase: 04
status: clean
blockers: 0
warnings: 3
files_reviewed: 7
files_reviewed_list:
  - src/app/curator/page.tsx
  - src/app/curator/records/page.tsx
  - src/app/curator/records/[id]/page.tsx
  - src/app/curator/records/new/page.tsx
  - src/app/api/v1/curator/records/route.ts
  - src/lib/services/records.service.ts
  - e2e/curator-cookie-forwarding.spec.ts
reviewed_at: 2026-08-12T08:00:00Z
iteration: 2
---

# Phase 04 Code Review

Scope: commits dfa7c57, 0ad6ce8, 36e2019, 94092ad — cookie forwarding in three SSR pages,
`problem_statement` field end-to-end, Playwright regression spec, and iteration-1 fix.

---

## BLOCKERs

None.

### B1 (resolved): `cookies().toString()` URL-encoded cookie values; `jwtVerify` received a percent-encoded JWT

- **Resolution commit:** 94092ad
- **Verification:** All three pages (`src/app/curator/page.tsx`:21, `src/app/curator/records/page.tsx`:53,
  `src/app/curator/records/[id]/page.tsx`:12) now use `(await headers()).get('cookie') ?? ''`.
  The `import { cookies }` import has been fully replaced with `import { headers }` in all three files
  (no residual `cookies` import anywhere under `src/app/curator/`). `tsc --noEmit` is clean.
  No regression introduced by the fix.

---

## WARNINGs

These three warnings carry over unchanged from iteration 1. None were reclassified as BLOCKERs.

### W1: `getRecord()` — non-404 API error swallowed by catch, renders misleading 404 page
- **File:** `src/app/curator/records/[id]/page.tsx`:17–22
- **Evidence:**
  ```ts
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch record: ${res.status}`);
  return (await res.json()).data;
  } catch {
    return null;   // ← catches the throw above
  }
  ```
  The `throw` on line 18 is immediately caught by the surrounding `catch {}` block, which returns
  `null`. Any 403, 500, or network error causes `notFound()` — an opaque 404 — instead of an
  actionable error message.
- **Fix direction:** Handle `!res.ok` outside the try/catch (or re-throw inside catch for
  non-network errors) so the page component can render a meaningful diagnostic instead of a 404.

### W2: `redirect('/login?returnTo=/curator/records')` in `[id]/page.tsx` discards the record URL
- **File:** `src/app/curator/records/[id]/page.tsx`:27
- **Evidence:**
  ```ts
  if (!session) redirect('/login?returnTo=/curator/records');
  ```
  The dynamic `id` is available from `params` (line 29) but is awaited *after* the redirect check.
  Post-login the curator is sent to the records list, not the specific record they requested.
- **Fix direction:** Await `params` before the session check and pass `returnTo=/curator/records/${id}`.

### W3: Playwright `beforeEach` uses `page.request.post(...)` for authentication — cookie propagation not guaranteed across all configurations
- **File:** `e2e/curator-cookie-forwarding.spec.ts`:6
- **Evidence:**
  ```ts
  await page.request.post('/api/auth/login', { data: { role: 'curator' } });
  ```
  In Playwright ≥1.30, `page.request` shares the cookie store with `page` within the same browser
  context, so this works. If the test runner ever isolates these contexts (e.g. `storageState: {}`
  reset), the login cookie will not propagate to subsequent `page.goto()` calls. This is a
  pre-existing accepted pattern in the codebase (`opportunity-submission.spec.ts`).
- **Fix direction:** Low priority; if flakiness emerges, switch to `storageState` setup or add an
  assertion that the page did not redirect to `/login`.

---

## Cross-file seams checked

| Seam | Status |
|---|---|
| All three SSR pages: `(await headers()).get('cookie') ?? ''` → forwarded as `Cookie:` header | OK — B1 resolved; pattern matches `reference/page.tsx` |
| `new/page.tsx` POST body `{ problem_statement }` → `route.ts` extracts `body.problem_statement` → `createRecord({ problemStatement })` → `records.service.ts` persists `params.problemStatement ?? ''` | OK — fully wired |
| `route.ts` POST returns `{ status: 'ok', data: { id } }` → `new/page.tsx` reads `data.data.id` for redirect | OK — shape matches |
| `route.ts` GET returns `{ status: 'ok', data: RecordSummary[], meta }` → `records/page.tsx` casts as `RecordListResponse { data, meta }` | OK — extra `status` field is ignored at runtime; `result.data` and `result.meta` accesses are correct |
| `records/[id]/route.ts` GET response `{ status, data: record }` → `[id]/page.tsx` reads `(await res.json()).data` | OK — shape matches |
| `records.service.ts` `createRecord` params type includes `problemStatement?: string` | OK — callers in `route.ts` pass it correctly |
| E2E spec auth stub `POST /api/auth/login { role: 'curator' }` → login route accepts `body.role` | OK — route confirmed |
| E2E `page.request.get('/api/v1/curator/records?page_size=1')` used to obtain a real record ID | OK — route exists and returns `{ data: [...] }` |
| No residual `import { cookies }` in any curator SSR page | OK — confirmed clean |
