---
status: diagnosed
trigger: "Opportunity Submission Confirmation Page Not Showing — after completing all 3 steps and submitting, confirmation page with OPP-YYYY-NNN ref number is not shown"
created: 2026-08-11T00:00:00Z
updated: 2026-08-11T00:01:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — two compounding bugs prevent the confirmation page from showing
test: Full code path traced: form handleSubmit → API route → DB insert → response → navigation
expecting: N/A — root cause confirmed
next_action: Return diagnosis

## Symptoms

expected: After completing all 3 steps and submitting the opportunity form, user is navigated to /submit-opportunity/confirmation?ref=OPP-YYYY-NNN and sees the confirmation page
actual: Confirmation page did not show up after submitting
errors: none reported explicitly (likely silent JS error)
reproduction: Complete all 3 steps of /submit-opportunity form and submit
started: Reported during UAT Phase 3

## Eliminated

- hypothesis: Confirmation page not found / wrong file path
  evidence: File exists at src/app/(public)/submit-opportunity/confirmation/page.tsx, maps correctly to /submit-opportunity/confirmation
  timestamp: 2026-08-11T00:00:30Z

- hypothesis: Next.js 15 searchParams not awaited (known breaking change)
  evidence: confirmation/page.tsx line 6 correctly uses `const params = await searchParams` — CORRECT pattern
  timestamp: 2026-08-11T00:00:30Z

- hypothesis: Middleware blocking confirmation route redirect to /login for authenticated user
  evidence: Middleware checks session cookie; authenticated users pass through. The confirmation route IS protected by middleware (pathname starts with /submit-opportunity) but correctly allows through if session cookie is valid.
  timestamp: 2026-08-11T00:00:45Z

- hypothesis: router.push uses wrong URL
  evidence: OpportunityForm.tsx line 79: router.push(`/submit-opportunity/confirmation?ref=${data.referenceNumber}`) — correct URL matching the file path
  timestamp: 2026-08-11T00:00:45Z

- hypothesis: API response doesn't include referenceNumber
  evidence: route.ts line 96: `return NextResponse.json({ id, referenceNumber, message }, { status: 201 })` — referenceNumber IS in the response body
  timestamp: 2026-08-11T00:00:50Z

- hypothesis: Next.js config redirects/rewrites intercepting navigation
  evidence: next.config.mjs has only security headers, no redirects or rewrites
  timestamp: 2026-08-11T00:00:55Z

## Evidence

- timestamp: 2026-08-11T00:00:20Z
  checked: OpportunityForm.tsx lines 49-84 (handleSubmit function)
  found: handleSubmit is an async function with NO try/catch block. Calls fetch(), then res.json(), then conditionally router.push. Any thrown exception (network error, JSON parse error) causes an unhandled promise rejection.
  implication: If res.json() throws (e.g., when API returns HTML error page instead of JSON), router.push at line 79 never executes. Button stays stuck in 'Submitting...' state. Confirmation page never shown.

- timestamp: 2026-08-11T00:00:25Z
  checked: route.ts lines 63-104 (POST handler structure)
  found: generateReferenceNumber('OPP') is called at line 67, OUTSIDE the try/catch block (lines 69-104). generateReferenceNumber performs a DB query (selectFrom). If the DB connection fails, this throws an unhandled exception in the Next.js route handler, which returns an HTML 500 error page — NOT the structured JSON error response from the catch block.
  implication: HTML response body → res.json() in handleSubmit throws TypeError → no try/catch in handleSubmit → unhandled rejection → no router.push → confirmation page not shown.

- timestamp: 2026-08-11T00:00:35Z
  checked: route.ts lines 70-93 (DB INSERT values)
  found: The INSERT into opportunity_submissions does NOT include a reference_number field. The referenceNumber generated at line 67 is returned in the HTTP response but never persisted to the database.
  implication: The OPP-YYYY-NNN reference number exists only in the API response body and the URL query param. It is untraceable in the DB — curators cannot look up submissions by reference number, and refreshing the confirmation page shows the correct ref (it's in the URL) but the ref is meaningless for backend lookup. This is a data integrity bug, but NOT the direct cause of the confirmation page not showing for the immediate navigation.

- timestamp: 2026-08-11T00:00:40Z
  checked: OpportunitySubmissionsTable in types.ts (lines 163-188) and 001_initial_schema.sql (lines 304-346)
  found: No reference_number column exists in the schema. The column was never defined.
  implication: Confirms the referenceNumber is ephemeral — generated at request time, returned in response, but not stored.

- timestamp: 2026-08-11T00:00:50Z
  checked: confirmation/page.tsx (full file)
  found: Correctly implements Next.js 15 async searchParams pattern. No DB calls, no auth checks. Would render correctly if navigated to.
  implication: The confirmation page itself is correct. The failure is upstream — navigation to it never fires.

## Resolution

root_cause: |
  TWO bugs, one directly causing the symptom and one compounding it:

  BUG 1 (DIRECT CAUSE — always present): `handleSubmit` in `OpportunityForm.tsx` (lines 49–84)
  has no try/catch block. When any async operation throws — most likely `res.json()` 
  throwing a SyntaxError when the API returns an HTML error page instead of JSON — the 
  unhandled promise rejection means `router.push(...)` at line 79 never fires. 
  The button stays stuck in "Submitting..." and the confirmation page is never shown.

  BUG 2 (COMPOUNDING): In `route.ts`, `generateReferenceNumber('OPP')` is called at line 67 
  OUTSIDE the try/catch block (which begins at line 69). This DB call can throw. When it does, 
  Next.js returns an HTML 500 error page — not the structured JSON error from the catch block 
  (lines 99–104). `res.json()` in the form then throws a SyntaxError, which triggers BUG 1's 
  unhandled rejection chain.

  BUG 3 (DATA INTEGRITY, secondary): The `referenceNumber` generated at `route.ts:67` is 
  returned in the 201 response but is NEVER stored in the DB — it is absent from the 
  INSERT values (lines 72–92). The `opportunity_submissions` table has no `reference_number` 
  column (types.ts lines 163–188, SQL schema lines 305–341). The OPP-YYYY-NNN number is 
  untraceable after the HTTP response completes.

fix: |
  Fix 1 (OpportunityForm.tsx): Wrap handleSubmit body in try/catch so navigation errors 
  don't silently swallow the router.push call.

  Fix 2 (route.ts): Move generateReferenceNumber('OPP') call INSIDE the try block, or 
  add a separate outer try/catch around it so it returns structured JSON on failure.

  Fix 3 (route.ts + schema + types): Add a reference_number VARCHAR column to 
  opportunity_submissions, include it in the INSERT values, so the ref number is persisted 
  and queryable.

verification: N/A — diagnose-only mode
files_changed: []
