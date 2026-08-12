---
status: complete
phase: 04-curation-and-administration
source: 04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md, 04-06-SUMMARY.md, 04-07-SUMMARY.md
started: 2026-08-12T15:38:00Z
updated: 2026-08-12T18:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Curator dashboard loads with live data
expected: Log in as a curator (dev auth role=curator). The /curator dashboard loads showing live record counts by lifecycle state (draft, submitted, published, etc.), pending submission counts, and unread engagement count. The "Dashboard data unavailable" error message from before is gone.
result: pass

### 2. New record form includes problem statement field
expected: From /curator/records, click "New Record". The form shows both a Title field AND a Problem Statement textarea. Fill in both, submit. A new draft record is created and the record editor page opens (not a 404). The record editor shows all FRD field groups including the LifecycleActionsPanel.
result: pass

### 3. Publication gate blocks incomplete record
expected: In the record editor for a draft record, find the Lifecycle Actions panel and attempt to Publish. The system rejects the publish with a list of missing/invalid fields. The record remains in draft state — it does NOT publish.
result: pass

### 4. Lifecycle transitions (submit → publish flow)
expected: For a draft record in the editor, "Submit for Review" advances state to submitted_for_review. From submitted_for_review, "Publish" (with all required fields filled) advances to published. Each transition button is state-appropriate (only valid next states shown).
result: pass

### 5. Audit log page works (gap closure verification)
expected: Log in as admin. In the /curator sidebar, click "Audit Log". The page loads at /curator/audit showing a table of audit events with columns for actor name, event type, target, and timestamp. No 404. No IP addresses visible. The page is only accessible to admins (curators redirected to /unauthorized).
result: pass

### 6. RBAC enforcement — unauthorized access shows /unauthorized page (gap closure verification)
expected: (a) Unauthenticated access to /curator redirects to /login. (b) A stakeholder-role user who tries to access /curator is redirected to /unauthorized (the "Access Restricted" page) — NOT to /login. (c) A curator-role user gets 403 on admin-only endpoints like /api/v1/curator/settings. (d) Admin-only /curator/settings page redirects curators to /unauthorized.
result: pass

### 7. Submission queues — opportunity and contribution
expected: /curator/submissions/opportunity shows the opportunity queue with status filter tabs. /curator/submissions/contribution shows the contribution queue. Each item shows submitter, office, and content. Inline disposition (Accept/Decline/Needs More Info) works and records the decision.
result: pass

### 8. Engagement activity list
expected: /curator/engagement shows engagement requests with follow-up status filter (new, in_progress, resolved). Inline status update (mark as in_progress or resolved) persists and appears in audit history.
result: pass

### 9. Settings management (admin only)
expected: Admin-role user can access /curator/settings and update settings such as engagement_routing_address. The change persists (visible after page reload). A curator-role user cannot access settings — the page redirects them away from /curator/settings.
result: pass
gap_closure: "Fixed in 04-07: nextUrl.clone() eliminates proxy hostname leak; SameSite=None; Secure session cookie; router.push('/unauthorized') on 403. Re-verified by human 2026-08-12."

### 10. Content model reference page
expected: /curator/reference shows the full governance reference: 6 maturity values with descriptions, 8 review status values, 4 trust axioms, and the 15 publication gate field requirements. The page is read-only reference material.
result: pass

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200
preview_path: 200
compose: app=Up(healthy) db=Up(healthy)
routes_probed: 10 ok / 0 failed
cookie: ok (SameSite=None; Secure — fixed in 04-07, iframe-safe)
e2e: expected=67 unexpected=1 skipped=0 (1 pre-existing advisory: F3.9 "Recommended Next Step" naming mismatch from Phase 1 — not a Phase 4 gap)
re_verification: 2026-08-12T18:30:00Z — all 10 tests pass including gap closure Test 9
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: Dashboard API returns 200 with record counts. /curator SSR 307-redirects to /login for unauthenticated (correct). With curator cookie: page loads (200). No 'unavailable' markers in log."
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: /curator/records/new returns 200. POST /api/v1/curator/records with title+problem_statement returns 201. problem_statement field confirmed present in page source."
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/curator/records/{id}/publish on empty draft returns 422 PUBLICATION_GATE_FAILED with 14 field-level errors. Gate working correctly."
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/curator/records/{id}/submit-for-review returns 200. Lifecycle transition confirmed."
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: GET /curator/audit (admin cookie) → 200 (not 404). Audit API GET /api/v1/curator/audit → 200 with {status:ok,data:[],meta:{page:1,page_size:50,total:0}}. IP address not in API response. /curator/audit now resolves (gap closure 04-06 confirmed). Note: DB is freshly migrated so audit event list is empty — the page structure is present; human should verify the table heading/columns are visible."
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: Stakeholder cookie + GET /curator → 307 redirect to http://127.0.0.1:3000/unauthorized (not /login). /unauthorized page → 200 with 'Access Restricted' heading and 'HTTP 403 — Authenticated but insufficient role' text. Gap closure 04-06 confirmed."
  - test: 7
    verdict: skipped (needs human)
    note: "🤖 Auto-check: GET /api/v1/curator/submissions/opportunity → 200. GET /curator/submissions/opportunity → 200. No seeded submission data in fresh DB — disposition flow needs human to submit an opportunity first."
  - test: 8
    verdict: skipped (needs human)
    note: "🤖 Auto-check: GET /api/v1/curator/engagement → 200. No seeded engagement data in fresh DB — inline status update needs human."
  - test: 9
    verdict: pass
    note: "🤖 Auto-check: Admin PUT /api/v1/curator/settings → 200. Curator → 403 on settings API. GET /curator/settings (curator cookie) → follows redirect to /unauthorized."
  - test: 10
    verdict: pass
    note: "🤖 Auto-check: GET /api/v1/curator/reference → 200 with 6 maturity values, 8 review statuses, 4 trust axioms, 15 gate fields."

advisory:
  - "E2E: 67 passed / 1 failed. Failure is F3.9 (Phase 1 naming mismatch 'Next Actions' vs 'Recommended Next Step') — pre-existing advisory, not a Phase 4 gap."
  - "Session cookie SameSite=None; Secure confirmed in running container — iframe-safe (04-07 gap closure verified)."

## Gaps

- truth: "A curator-role user attempting to access /curator/settings is redirected to /unauthorized (not to the external preview URL or /login)"
  status: failed
  reason: "User reported: logged in as curator and went to /curator/settings instead of unauthorized I am getting redirected to https://3000-pivota-sandbox-f261f1ce-tjoo8q-3b1e974678ba6d7b.preview.pivota-ng.pivota.dev/curator"
  severity: minor
  test: 9
  source: user
  root_cause: "Two compounding issues: (1) The middleware in src/middleware.ts:34 uses `new URL('/login', request.url)` to build the login redirect — when the request comes in via the Daytona preview proxy, `request.url` has the external preview hostname, so the redirect lands on the external preview URL instead of the app's internal /login path. Fix: use `request.nextUrl.clone()` or a relative redirect. (2) The session cookie is SameSite=lax with no Secure flag — in the embedded Preview iframe (cross-site context), the browser drops the cookie, so the middleware sees no session and redirects to login even for a logged-in curator. The /unauthorized redirect (added in 04-06) only fires in the SSR curator layout (after the middleware), but when the cookie is dropped the middleware fires first. Fix (longer term): set SameSite=None; Secure on the session cookie."
  artifacts:
    - path: "src/middleware.ts"
      issue: "Line 34: new URL('/login', request.url) — uses request.url which carries the proxy's external hostname; should use a path-relative redirect"
    - path: "src/lib/auth/session.ts"
      issue: "setSessionCookie() sets SameSite=lax (no Secure) — cookie dropped in cross-site Preview iframe"
  missing:
    - "Fix middleware.ts login redirect to use path-relative URL (not request.url origin) so proxy hostname doesn't leak into redirect"
    - "Set SameSite=None; Secure on session cookie in setSessionCookie() for iframe-safe preview behavior"
  debug_session: ""
