# Triage Report — TechSur Innovation Hub (TSIO)

**Run date:** 2026-08-14  
**Runner:** Autonomous (06-02 E2E Verification)  
**Total tests run:** 100  
**Passed:** 87 ✓  
**Failed:** 13 ✗  
**Skipped:** 0 ○

---

## Executive Summary

The test suite ran against the live application at `http://localhost:3000` with a fresh PostgreSQL database (migrated + seeded). Of 100 tests across 87 requirements, **87 pass (87%)** and **13 fail (13%)**.

The 13 failures split into three categories:

| Classification | Count |
|----------------|-------|
| **Bug** — feature implemented but test detects incorrect behavior | 6 |
| **Gap** — feature not implemented (test spec fails to access feature) | 5 |
| **Test Spec Issue** — test technique doesn't match app auth model | 2 |

> **Note on "Test Spec Issue":** Two failures (AUTH-01, F3.9/F8.1) are caused by the test selectors matching multiple elements (strict mode violation) — the features work correctly but the test locators need tightening. These are test spec bugs, not application bugs.

---

## Failure Triage

| REQ-ID | Description | Classification | Root Cause | Proposed Fix | Priority |
|--------|-------------|----------------|------------|--------------|----------|
| AUTH-01 | Anonymous users can use search without login | Test Spec Issue | Playwright strict mode violation: `getByRole('heading', { name: /search/i })` matches both the `<h1>Search Innovation Records</h1>` AND a search-result `<h2>` heading. The feature works correctly — anonymous search is functional. | Fix test: use `getByRole('heading', { level: 1, name: /search/i })` or `page.getByRole('heading', { name: 'Search Innovation Records' })` | Low |
| AUTH-06 | Three roles exist: curator access works | Bug | Playwright `request.post('/api/auth/login')` sets an HTTP-only cookie in the `APIRequestContext`, but `page.goto('/curator')` uses the browser page context which does NOT automatically share cookies with the APIRequestContext. The curator UI loads fine when cookies are passed correctly (verified via curl). | Fix test: Use `page.request.post(...)` (not `request.post`) so cookies flow into the browser context, or set cookies manually via `page.context().addCookies(...)` after login. | Medium |
| F3.9 | Record provides next action CTAs | Test Spec Issue | Playwright strict mode violation: the `.or()` locator matches both the `<section>` wrapper AND the inner `<div aria-label="Next action options">` — two elements. The feature is implemented correctly with both elements present. | Fix test: use `.first()` after `.or()` or target specifically `page.getByLabel('Next action options')` without `.or()`. | Low |
| F6.1 | Submission flow starts with problem description | Bug | Test uses `request.post('/api/auth/login')` for authentication, then `page.goto('/submit-opportunity')`. Cookies from the APIRequestContext are not transferred to the browser page, so the page redirects to `/login`. The form content is correct when properly authenticated. | Fix test: authenticate using page-context cookies (e.g. `await page.request.post(...)`) or use `page.context().addCookies(...)`. | Medium |
| F6.2 | Form captures all required fields | Bug | Same root cause as F6.1 — test cannot reach the form because authentication cookies don't transfer from APIRequestContext to browser page context. Form fields exist and are correct when authenticated. | Fix test: same cookie-transfer fix as F6.1. | Medium |
| F6.4 | Non-acceptance notice explicitly stated | Bug | Same root cause as F6.1 — test cannot reach the form. Non-acceptance notice text "does not commit I&R to any action" exists in the form when properly authenticated. | Fix test: same cookie-transfer fix as F6.1. | Medium |
| F7.2 | Attribution fields present and required | Bug | Same root cause as F6.1 — test cannot reach `/submit-contribution` because authentication cookies don't transfer from APIRequestContext to browser page. Attribution fields exist on the form. | Fix test: same cookie-transfer fix as F6.1. | Medium |
| F7.4 | Non-endorsement language present on contribution page | Bug | Same root cause as F6.1 — test cannot reach the contribution page. Non-endorsement language exists in the form when properly authenticated. | Fix test: same cookie-transfer fix as F6.1. | Medium |
| F8.1 | CTAs visible on record detail page | Test Spec Issue | Same strict mode issue as F3.9 — the `.or()` locator matches both the `<section>` wrapper and the inner `<div>` containing CTAs. The CTAs are present and visible. | Fix test: target a single specific locator instead of using `.or()`. | Low |
| F8.4 | Routing address configurable from hub_settings | Gap | The test expects `GET /api/v1/curator/settings` to be accessible by the curator role and return `data` as an array. Actual API: (1) the GET endpoint requires admin role (returns 403 for curator), and (2) settings are returned as a keyed object `{key: {value, type, ...}}`, not an array with `setting_key` property. | Fix implementation: either allow curator read access to GET /settings, or fix the test to match the admin-only pattern. Also fix response shape to include array format or update test to use object access. | High |
| F8.5 | Default routing address is TSIO I&R address | Gap | Same gap as F8.4 — the test uses curator auth to get settings, but GET /settings requires admin. The address IS configured correctly (AOml_TSO_IRB_Team@ao.uscourts.gov) — accessible when using admin role. Also affected by the object-vs-array response shape mismatch. | Fix together with F8.4: either allow curator GET access or update test to use admin role. | High |
| F9.9 | Publication lifecycle supports draft to archived transitions | Gap | The `POST /api/v1/curator/records` API returns only `{status: "ok", data: {id: "..."}}`. The test asserts `body.data?.state === 'draft'`, but `state` is not included in the creation response. The record IS created as draft — this is a response-shape gap. | Fix implementation: include `state` in the POST /curator/records response body (alongside `id`). | Medium |
| IA-05 | Logged-in header shows user name and Sign Out | Bug | Same cookie-transfer root cause as F6.1 family — `request.post('/api/auth/login')` sets cookie in APIRequestContext, but `page.goto('/')` uses the browser's own context (no shared cookies). The header correctly shows "Dev Stakeholder" and a "Sign Out" button when properly authenticated (verified via curl). | Fix test: use page-context login or cookie sharing to properly authenticate the browser context. | Medium |

---

## Root Cause Summary

### Cookie-Transfer Pattern (6 failures: AUTH-06, F6.1, F6.2, F6.4, F7.2, F7.4, IA-05)

**Root cause:** Playwright `{ request, page }` parameter destructuring gives two separate contexts:
- `request` = `APIRequestContext` — stores cookies in the Playwright API layer  
- `page` = `Page` — uses the Chromium browser context (separate cookie jar)

When a test does `await request.post('/api/auth/login', ...)` followed by `await page.goto('/protected-page')`, the browser page has no session cookie and redirects to `/login`.

**Fix pattern for 06-03:**
```typescript
// Instead of: await request.post('/api/auth/login', { data: { role: 'stakeholder' } });
// Use:
await page.request.post('/api/auth/login', { data: { role: 'stakeholder' } });
// This stores the cookie in the same context as page.goto()
```

### Strict Mode Locator Issues (2 failures: AUTH-01, F3.9/F8.1)

**Root cause:** `.or()` locator and generic role selectors match multiple elements. Playwright strict mode requires exactly 1 match.

**Fix pattern for 06-03:**
```typescript
// AUTH-01: Use level-specific heading
await expect(page.getByRole('heading', { level: 1, name: /search/i })).toBeVisible();

// F3.9 / F8.1: Use first() or specific locator
await expect(page.getByLabel('Next action options')).toBeVisible();
```

### API Response Shape / Access Control (3 failures: F8.4, F8.5, F9.9)

**F8.4 & F8.5:** `GET /api/v1/curator/settings` is restricted to admin role but test uses curator role. Additionally, the response returns `data` as an object keyed by `setting_key`, not an array — but the test uses `.find()` expecting an array.

**F9.9:** `POST /api/v1/curator/records` response omits the `state` field — only returns `{id}`. The test expects `{state: 'draft'}` in the response.

---

## Impact Classification for 06-03

### Priority High (must fix for requirements verification to pass)
- **F8.4 / F8.5** — Settings API access control or test role update
- **F9.9** — Include `state` in record creation response

### Priority Medium (test spec fixes — features are implemented correctly)
- **AUTH-06, F6.1, F6.2, F6.4, F7.2, F7.4, IA-05** — Cookie-transfer test pattern fix

### Priority Low (test spec fixes — features work, locators too broad)
- **AUTH-01** — Tighten heading locator
- **F3.9 / F8.1** — Tighten CTA locator

---

## What Plan 06-03 Should Fix

```
Test spec fixes (7 tests):        AUTH-06, F6.1, F6.2, F6.4, F7.2, F7.4, IA-05
Test locator fixes (3 tests):     AUTH-01, F3.9, F8.1  
Implementation fixes (3 tests):   F8.4, F8.5, F9.9
─────────────────────────────────────────────────────
Total to fix in 06-03:            13 tests
```

After 06-03 fixes, expect all 100 tests to pass.

---

## Passing Highlights

All 87 passing tests confirm correct implementation of:
- Anonymous catalog browsing and record viewing (AUTH-01 partial)
- RBAC enforcement (AUTH-02 through AUTH-05, AUTH-07–10)
- Full-text and faceted search (F2.x)
- Catalog listing with filtering (F1.x)
- Record detail page including perspectives (F3.x, F4.x)
- Executive and technical perspectives (F4.x)
- Lessons learned section (F5.x)
- Opportunity submission API (F6.5)
- Contribution submission API with validation (F7.3)
- Engagement routing API (F8.2, F8.3, F8.6)
- Full curation CRUD lifecycle (F9.1–F9.8, F9.10–F9.16)
- All 12 SEED requirements (SEED-01–12)
- Navigation and IA checks (IA-01–04)
- Accessibility and content model (SEC, F5)
