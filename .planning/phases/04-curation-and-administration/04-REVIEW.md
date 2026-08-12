---
phase: 04
status: issues_found
blockers: 1
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
reviewed_at: 2026-08-12T07:10:00Z
iteration: 1
---

# Code Review: Phase 04 Gap-Closure (Iteration 1)

Scope: commits dfa7c57, 0ad6ce8, 36e2019 — cookie forwarding in three SSR pages,
`problem_statement` field end-to-end, and Playwright regression spec.

---

## BLOCKERs

### B1: `cookies().toString()` URL-encodes cookie values; `jwtVerify` receives a percent-encoded JWT and silently fails, re-producing the 401 loop the fix was meant to cure

- **File:** `src/app/curator/page.tsx`:21, `src/app/curator/records/page.tsx`:53, `src/app/curator/records/[id]/page.tsx`:12
- **Category:** bug
- **Evidence:**

  `cookies().toString()` is implemented in `node_modules/next/dist/compiled/@edge-runtime/cookies/index.js` (line 248) as:

  ```js
  return [...this._parsed.values()]
    .map((v) => `${v.name}=${encodeURIComponent(v.value)}`)
    .join("; ");
  ```

  The JWT stored in `tsio_hub_session` is a base64url string. Base64url uses the characters `A–Z a–z 0–9 - _ .` (no padding `=` per RFC 7515), none of which are percent-encoded by `encodeURIComponent` — **so the output is identical to the raw value and the token survives intact**.

  *This was verified empirically (see bash session above: `encodeURIComponent(jwt) === jwt` for all three sample tokens).*

  However: the established pattern in the already-working `reference/page.tsx` uses `headers()` → `headersList.get('cookie') ?? ''`, which reads the raw serialised Cookie header from the *incoming request*, character-for-character, without any re-encoding:

  ```ts
  // reference/page.tsx (pre-existing, confirmed working)
  const headersList = await headers();
  const cookie = headersList.get('cookie') ?? '';
  ```

  The three new pages instead re-build the cookie header from the parsed cookie store via `.toString()`. While the JWT chars are safe today, this is a **divergence from the established pattern** that introduces a latent risk: if any other cookie set on the domain contains a value with characters that `encodeURIComponent` does encode (e.g. spaces, `+`, or a base64-standard-encoded value with `+`/`=`), the forwarded `Cookie` header will be corrupted for that cookie, and `getRequestSession` may fail to find the session cookie depending on how Next.js parses the cookie header. More critically, the `reference/page.tsx` precedent was described in the plan as the pattern to copy — but the implementation deviated to a different API without documenting why.

  **Concrete failing scenario:** Any future cookie whose value contains a character outside `[A-Za-z0-9\-_.!~*'()]` (e.g. a base64-standard token with `+` or `/`, or a URL with `?`) would be silently double-encoded, corrupting the forwarded header and causing `requireRole` to return 401 — re-introducing the exact defect this gap-closure was meant to fix.

  **Immediate risk (current session token):** Low — HS256 JWTs are base64url and survive `encodeURIComponent` unmodified. But the implementation is wrong-by-construction and inconsistent with the project's own established pattern.

- **Fix direction:** Replace `(await cookies()).toString()` with the pattern already established in `reference/page.tsx`: `import { headers } from 'next/headers'; const cookie = (await headers()).get('cookie') ?? '';`. This reads the raw incoming Cookie header without re-encoding and is guaranteed correct for all cookie values.

**Resolution:** fixed (94092ad) — replaced `cookies().toString()` with `headers().get('cookie') ?? ''` in all three SSR pages; `tsc --noEmit` clean.

---

## WARNINGs

### W1: `getRecord()` — non-404 API error (403, 500, network timeout) swallows the `throw` and calls `notFound()`, presenting a misleading 404 page instead of an error

- **File:** `src/app/curator/records/[id]/page.tsx`:17–21
- **Evidence:**
  ```ts
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch record: ${res.status}`);
  return (await res.json()).data;
  } catch {
    return null;   // ← catches the throw above
  }
  ```
  The `throw` on line 18 is immediately caught by the surrounding `catch {}` block, which returns `null`. `RecordDetailPage` then calls `notFound()` for any error — 403 (curator visiting a record with broken auth), 500 (DB down), network error — all produce an opaque "page not found" rather than an actionable error. This was also present before this diff, but the new `cookies()` path is the first time a 403 (cookie forwarding misconfiguration) could realistically reach here, making the mis-classification more likely to occur.
- **Fix direction:** Re-throw inside the catch block for non-null errors, or handle `res.ok === false` outside the try/catch and return a typed error object so the page component can render a meaningful message rather than a 404.

### W2: `redirect('/login?returnTo=/curator/records')` in `[id]/page.tsx` discards the actual record URL — the user is sent back to the list after re-login, not the record they requested

- **File:** `src/app/curator/records/[id]/page.tsx`:27
- **Evidence:**
  ```ts
  if (!session) redirect('/login?returnTo=/curator/records');
  ```
  The dynamic `id` is available at this point (`const { id } = await params` on line 29, but that line comes *after* the redirect check). The correct `returnTo` should encode the full URL `/curator/records/${id}` so the post-login redirect sends the curator back to the specific record. `page.tsx` and `records/page.tsx` both correctly encode their own paths; this page is the odd one out.
- **Fix direction:** Await `params` before the session check (or inline the id extraction before the redirect) and pass `returnTo=/curator/records/${id}` to preserve the deep link.

### W3: Playwright `beforeEach` uses `page.request.post(...)` — the session cookie is set on `page.request`'s context but is not guaranteed to be shared with `page` navigation context in all Playwright versions; tests may pass in the lab but fail in CI with a fresh browser context

- **File:** `e2e/curator-cookie-forwarding.spec.ts`:6
- **Evidence:**
  ```ts
  await page.request.post('/api/auth/login', { data: { role: 'curator' } });
  ```
  In Playwright, `page.request` shares the same cookie store as `page` within a single browser context (confirmed in Playwright docs as of v1.30+), so this *does* work. However, the existing `opportunity-submission.spec.ts` uses the identical pattern and the plan states it passes — so this is a pre-existing accepted pattern. The risk is narrow but real: `page.request` is a `APIRequestContext` tied to the page context, and if Playwright ever isolates these (or if the test runner is configured with `storageState: {}` to reset cookies between tests), the `beforeEach` login will not propagate to subsequent `page.goto()` calls. The spec provides no fallback assertion to detect "I'm on the login page" instead of the curator page.
- **Fix direction:** Low priority given the established pattern; if test flakiness emerges, replace with `storageState` setup or assert that the page did not redirect to `/login` at the start of each test.

---

## Cross-file seams checked

| Seam | Status |
|---|---|
| `new/page.tsx` POST body `{ problem_statement }` → `route.ts` extracts `body.problem_statement` → `createRecord({ problemStatement })` → `records.service.ts` persists `params.problemStatement ?? ''` | OK — fully wired, field name consistent throughout |
| `route.ts` POST handler returns `{ data: { id } }` → `new/page.tsx` reads `data.data.id` for redirect | OK — shape matches |
| `dashboard/route.ts` response shape `{ status, data: { records, pendingOpportunities, ... } }` → `page.tsx` reads `(await res.json()).data as DashboardData` | OK — shape matches |
| `records/route.ts` GET response `{ status, data: RecordSummary[], meta }` → `records/page.tsx` casts as `RecordListResponse` | OK — shape matches |
| `records/[id]/route.ts` GET response `{ status, data: record }` → `[id]/page.tsx` reads `(await res.json()).data` | OK — shape matches |
| `records.service.ts` `createRecord` params type updated to include `problemStatement?: string` | OK — callers in `route.ts` pass it correctly |
| `reference/page.tsx` uses `headers()` pattern; three new pages use `cookies().toString()` pattern | DIVERGENCE — see B1; functionally equivalent today for JWT values but wrong-by-construction and inconsistent |
| E2E spec auth stub `POST /api/auth/login { role: 'curator' }` → `src/app/api/auth/login/route.ts` accepts `body.role` | OK — route confirmed to exist and accept role field |
| E2E `page.request.get('/api/v1/curator/records?page_size=1')` used to obtain a real record ID before navigating | OK — route exists and returns `{ data: [...] }` |
