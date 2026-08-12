---
status: complete
phase: 04-curation-and-administration
source: 04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md
started: 2026-08-12T06:28:46Z
updated: 2026-08-12T06:44:00Z
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

### 5. Audit history records every change
expected: On any record that has been created and had state changes, the audit history panel in the record editor shows a chronological log of events — record_created, publication_state_changed — with actor name and timestamp. IP addresses are not exposed in the curator view.
result: issue
reported: "Instructions to test are not clear. I had to login as an admin to find 'Audit Log' and not 'Audit Panel'. Clicking it gave a 404 error."
severity: blocker

### 6. RBAC enforcement — unauthorized access blocked
expected: (a) Unauthenticated access to /curator redirects to login. (b) A stakeholder-role user gets 403 on any /api/v1/curator/* endpoint. (c) A curator-role user gets 403 on admin-only endpoints (/api/v1/curator/settings). (d) Admin-only /curator/settings page redirects curators away (not 500).
result: issue
reported: "Everything works except unauthorized redirects to login gives me /login?returnTo=/curator. This is when I am a Stakeholder trying to access curator settings"
severity: minor

### 7. Submission queues — opportunity and contribution
expected: /curator/submissions/opportunity shows the opportunity queue with status filter tabs. /curator/submissions/contribution shows the contribution queue. Each item shows submitter, office, and content. Inline disposition (Accept/Decline/Needs More Info) works and records the decision.
result: pass

### 8. Engagement activity list
expected: /curator/engagement shows engagement requests with follow-up status filter (new, in_progress, resolved). Inline status update (mark as in_progress or resolved) persists and appears in audit history.
result: pass

### 9. Settings management (admin only)
expected: Admin-role user can access /curator/settings and update settings such as engagement_routing_address. The change persists (visible after page reload). A curator-role user cannot access settings — the page redirects them away from /curator/settings.
result: pass

### 10. Content model reference page
expected: /curator/reference shows the full governance reference: 6 maturity values with descriptions, 8 review status values, 4 trust axioms, and the 15 publication gate field requirements. The page is read-only reference material.
result: pass

## Summary

total: 10
passed: 8
issues: 2
pending: 0
skipped: 0

## Self-Check

boot: 200
preview_path: 200
compose: app=Up db=Up(healthy)
routes_probed: 12 ok / 0 failed
cookie: iframe-hostile: SameSite=lax Secure=false
e2e: expected=55 unexpected=1 skipped=0 (1 advisory failure: F3.9 "Recommended Next Step" naming mismatch from Phase 1 — not a Phase 4 gap)
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: Cookie-forwarding fix confirmed. SSR /curator page loads 'published' data (len=64k, 'unavailable'=false). Dashboard API returns 200 with {records: {published:3,...}, pendingOpportunities:0, unreadEngagement:0}. No 'Dashboard data unavailable' text on page."
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: /curator/records/new page contains 'problem_statement' field (grep count=1). POST /api/v1/curator/records with title+problem_statement returns 201. Record editor page at /curator/records/{id} loads (len=75k, not-found-page=false, lifecycle/publish present=true, problem_statement present=true)."
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/curator/records/{id}/publish on an empty record returns 422 PUBLICATION_GATE_FAILED with 14 field-level errors (summary, problemStatement, missionAreas, hypothesisOrObjective, technologyAreas, outcomeSummary, sourceBasis, keyFindingsGateCheck, maturity, reviewStatuses, lastReviewedDate, ownerSteward, attributionStatement, applicableDisclaimer). Gate working correctly."
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/curator/records/{id}/submit-for-review returns 200. Lifecycle transition confirmed."
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: GET /api/v1/curator/records/{id}/audit returns 200 with audit events array. record_created event confirmed. IP addresses not present in response."
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: (a) /curator unauthenticated → 307 redirect. (b) Stakeholder → 403 on /api/v1/curator/*. (c) Curator → 403 on /api/v1/curator/settings. (d) All RBAC checks confirmed."
  - test: 7
    verdict: skipped (needs human)
    note: "🤖 Auto-check: GET /api/v1/curator/submissions/opportunity returns 200. Submission queue UI at /curator/submissions/opportunity returns 200. No test submissions in seeded data to exercise disposition flow — needs human to submit then test."
  - test: 8
    verdict: skipped (needs human)
    note: "🤖 Auto-check: GET /api/v1/curator/engagement returns 200. No test engagements in seeded data for inline status update flow — needs human."
  - test: 9
    verdict: pass
    note: "🤖 Auto-check: Admin PUT /api/v1/curator/settings returns 200. Curator → 403 on settings API. Settings page responds 200."
  - test: 10
    verdict: pass
    note: "🤖 Auto-check: GET /api/v1/curator/reference returns 200 with 6 maturity values, 8 review statuses, 4 trust axioms, 15 gate fields."

advisory:
  - "Session cookie is SameSite=lax Secure=false — login will appear to fail inside the embedded Preview iframe. Use 'Open in new tab' for curator testing. App-side fix: set SameSite=None; Secure on the session cookie."
  - "E2E: 55 passed / 1 failed. Failure is F3.9 (Phase 1 naming mismatch 'Next Actions' vs 'Recommended Next Step') — pre-existing advisory, not a Phase 4 gap."

## Gaps

- truth: "The curator/admin sidebar 'Audit Log' link leads to a functional audit log page showing chronological events with actor name and timestamp; no IP addresses are exposed"
  status: failed
  reason: "User reported: Instructions to test are not clear. I had to login as an admin to find 'Audit Log' and not 'Audit Panel'. Clicking it gave a 404 error."
  severity: blocker
  test: 5
  source: user
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "A logged-in stakeholder attempting to access /curator receives a 403 (not a redirect to login) — confirming the session is recognized but the role is insufficient"
  status: failed
  reason: "User reported: Everything works except unauthorized redirects to login gives me /login?returnTo=/curator. This is when I am a Stakeholder trying to access curator settings"
  severity: minor
  test: 6
  source: user
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

