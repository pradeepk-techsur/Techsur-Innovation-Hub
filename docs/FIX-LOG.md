# Fix Log — TechSur Innovation Hub Requirement Verification

**Date:** 2026-08-14  
**Total fixes applied:** 13  
**Plan:** 06-03 (Apply triage fixes)  
**Source:** docs/TRIAGE-REPORT.md from plan 06-02  

---

## Applied Fixes

| REQ-ID | Fix Type | Root Cause | Files Changed | Verification | Status |
|--------|----------|-----------|---------------|-------------|--------|
| AUTH-01 | Test Spec Fix (strict mode) | `getByRole('heading', { name: /search/i })` matched both `<h1>` and `<h2>` search-result headings — Playwright strict mode requires exactly 1 match | `e2e/requirements/auth.req.spec.ts` | Re-ran test → PASS | ✓ |
| AUTH-06 | Test Spec Fix (cookie transfer + strict mode) | `request.post('/api/auth/login')` sets cookie in APIRequestContext; `page.goto('/curator')` uses browser context (separate cookie jar). Also `getByRole('heading')` matched 4 headings on curator dashboard. | `e2e/requirements/auth.req.spec.ts` | Re-ran test → PASS | ✓ |
| F3.9 | Test Spec Fix (strict mode) | `.or()` locator matched both `<section>` wrapper AND inner `<div aria-label="Next action options">` — 2 elements, strict mode violation | `e2e/requirements/f3-record.req.spec.ts` | Re-ran test → PASS | ✓ |
| F6.1 | Test Spec Fix (cookie transfer) | `request.post('/api/auth/login')` stores cookie in APIRequestContext; `page.goto('/submit-opportunity')` used browser context — no session cookie → redirect to /login | `e2e/requirements/f6-opportunity.req.spec.ts` | Re-ran test → PASS | ✓ |
| F6.2 | Test Spec Fix (cookie transfer) | Same root cause as F6.1 | `e2e/requirements/f6-opportunity.req.spec.ts` | Re-ran test → PASS | ✓ |
| F6.4 | Test Spec Fix (cookie transfer) | Same root cause as F6.1 | `e2e/requirements/f6-opportunity.req.spec.ts` | Re-ran test → PASS | ✓ |
| F7.2 | Test Spec Fix (cookie transfer) | Same root cause as F6.1 — test could not reach `/submit-contribution` form | `e2e/requirements/f7-contribution.req.spec.ts` | Re-ran test → PASS | ✓ |
| F7.4 | Test Spec Fix (cookie transfer) | Same root cause as F6.1 | `e2e/requirements/f7-contribution.req.spec.ts` | Re-ran test → PASS | ✓ |
| F8.1 | Test Spec Fix (strict mode) | Same `.or()` strict mode issue as F3.9 — matched both wrapper and inner div | `e2e/requirements/f8-engagement.req.spec.ts` | Re-ran test → PASS | ✓ |
| F8.4 | Test Spec Fix (access control + response shape) | Test used curator role but GET /curator/settings requires admin (returns 403 for curator). Also test used `.find()` on array but response is a keyed object `{key: {value,...}}` | `e2e/requirements/f8-engagement.req.spec.ts` | Re-ran test → PASS | ✓ |
| F8.5 | Test Spec Fix (access control + response shape) | Same root cause as F8.4 — curator role returns 403; response is object not array | `e2e/requirements/f8-engagement.req.spec.ts` | Re-ran test → PASS | ✓ |
| F9.9 | Implementation Fix (response shape) | `POST /api/v1/curator/records` returned only `{status:"ok", data:{id}}` — test asserts `body.data?.state === 'draft'`. Added `state:'draft'` to response. | `src/app/api/v1/curator/records/route.ts` | Re-ran test → PASS | ✓ |
| IA-05 | Test Spec Fix (cookie transfer) | Same root cause as F6.1 family — `request.post` + `page.goto('/')` had separate cookie contexts | `e2e/requirements/ia-seed.req.spec.ts` | Re-ran test → PASS | ✓ |

---

## Fix Details

### Cookie-Transfer Pattern (7 fixes: AUTH-06, F6.1, F6.2, F6.4, F7.2, F7.4, IA-05)

**Before:**
```typescript
async ({ page, request }) => {
  await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
  await page.goto('/submit-opportunity');  // ← no session cookie
```

**After:**
```typescript
async ({ page }) => {
  await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
  await page.goto('/submit-opportunity');  // ← cookie in same context
```

### Strict Mode Locator Fixes (3 fixes: AUTH-01, F3.9, F8.1)

**AUTH-01:** `getByRole('heading', { name: /search/i })` → `getByRole('heading', { level: 1, name: /search/i })`  
**AUTH-06:** `getByRole('heading')` → `getByRole('heading', { level: 1 })`  
**F3.9/F8.1:** `getByLabel(...).or(getByRole('region', ...))` → `getByLabel(...)` only

### Settings API Access Control Fix (2 fixes: F8.4, F8.5)

**Before:** Tests used curator role; GET /curator/settings is admin-only (403 for curator)
**After:** Tests use admin role + access keyed object response:
```typescript
// Before: body.data?.find((s: { setting_key: string }) => s.setting_key === 'engagement_routing_address')
// After: body.data?.['engagement_routing_address']
```

### Record Creation Response Fix (1 fix: F9.9)

**Before:** `return NextResponse.json({ status: 'ok', data: { id } }, { status: 201 });`  
**After:** `return NextResponse.json({ status: 'ok', data: { id, state: 'draft' } }, { status: 201 });`

---

## Regression Check

- Full suite re-run after all fixes: **100 passed, 0 failed**
- Build: n/a (Next.js dev mode — hot reload; no build step required for dev verification)
- Previous passing: 87/100
- After fixes: 100/100 ✓

---

## Commit Reference

All fixes applied in single atomic commit: `ebb560f`  
`fix(06-03): apply all 13 triage fixes — 100 tests now passing`
