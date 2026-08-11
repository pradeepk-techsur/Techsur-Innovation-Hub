---
status: diagnosed
phase: 03-engagement-flows
source: 03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md
started: 2026-08-11T21:02:29Z
updated: 2026-08-11T21:18:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Login and Authentication
expected: Navigate to /login. A dev role selector appears (Stakeholder / Curator / Admin options). Select Stakeholder and sign in. The nav bar updates to show the user name and a Sign Out button. Navigating to /submit-opportunity or /submit-contribution while logged out redirects to /login?returnTo=<path>.
result: pass

### 2. Unauthenticated Redirect Enforcement
expected: While logged out, attempt to go directly to /submit-opportunity or /submit-contribution. You should be immediately redirected to /login (not shown an error, not shown the form). After login, you should be returned to the page you tried to visit.
result: pass

### 3. Opportunity Submission — 3-Step Form
expected: After logging in as a Stakeholder, navigate to /submit-opportunity. A 3-step form loads. Step 1 asks for a mission problem description (not a solution or application request). Step 2 asks for context and impact. Step 3 includes required acknowledgment checkboxes and submitter contact info. A non-acceptance notice is visible (submitting does not imply I&R acceptance). After completing all steps and submitting, a confirmation page shows an OPP-YYYY-NNN reference number and restates the non-acceptance language.
result: issue
reported: "Confirmation page did not show up after submitting"
severity: major

### 4. Innovation Contribution — 2-Step Form
expected: Navigate to /submit-contribution. A separate, visually distinct form from /submit-opportunity loads (different title, different purpose language). Step 1 asks about the innovation work. Step 2 requires attribution fields: contributing office, contributor names, current owner. A non-endorsement notice appears (submitting does not imply central endorsement). After submitting, a CONTRIB-YYYY-NNN reference number is displayed.
result: issue
reported: "Confirmation page did not show up after submission"
severity: major

### 5. Engagement Request Modal on Record Page
expected: Navigate to any published innovation record (e.g. /records/audio-security-poc). The "Next Actions" section shows engagement buttons (Request Demo, Discuss Use Case, etc.) — not plain mailto links. Clicking one opens a modal with a form asking for name, office, email, description, and a consent checkbox. After submitting the modal, a reference number (ENG-YYYY-NNN) is displayed confirming the request was recorded.
result: issue
reported: "There is no Next actions section in /records/audio-security-poc. There is only a Contact I&R button that really does not do anything."
severity: major

### 6. Logout and Session Clear
expected: While logged in, click the Sign Out button in the nav. The session ends, the nav reverts to showing "Sign In", and attempting to access /submit-opportunity redirects to /login again. The session cookie is cleared.
result: pass

## Summary

total: 6
passed: 3
issues: 3
pending: 0
skipped: 0

## Self-Check

boot: 200
preview-path: 200 (exec-server proxy reachable)
compose-health: db healthy, app running natively on port 3000
routes_probed: 8 ok / 0 failed
cookie: iframe-hostile — SameSite=lax Secure=false
e2e: 15/15 passed (opportunity-submission, contribution-submission, engagement-routing spec files)
per_test:
  - test: 1
    verdict: advisory
    note: "🤖 Auto-check: Login SUCCEEDS server-side (HTTP 200, session JWT issued). However, the session cookie is SameSite=lax with no Secure flag — it will be DROPPED in the cross-site preview iframe. Login will appear to fail *inside the embedded Preview panel*. **To test login: use 'Open in new tab' from the Preview panel** (or test directly at the app URL). The app itself is correct; this is an iframe context issue."
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: GET /submit-opportunity (unauthenticated) → 307 redirect. GET /submit-contribution (unauthenticated) → 307 redirect. Middleware working correctly."
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/submissions/opportunity → 201 with OPP-2026-001. API validated and persisted correctly. E2E Playwright tests (F6.1, F6.3, F6.4, AUTH-09, F6.5) all passed."
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/submissions/contribution → 201 with CONTRIB-2026-001. Attribution fields enforced. E2E Playwright tests (F7.1, F7.3, F7.4, AUTH-09, F7.5) all passed."
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: POST /api/v1/engagement → 201 with ENG-2026-001. DB-first persistence confirmed (record inserted before email attempt; emailSent=false in mailto mode). E2E Playwright tests (F8.1, F8.2, F8.3, F8.4, F8.6) all passed."
  - test: 6
    verdict: skipped (needs human)
    note: "Logout requires browser UI interaction — needs human to click Sign Out and confirm nav state changes."

## Gaps

- truth: "After completing all 3 steps of the opportunity submission form and submitting, a confirmation page with an OPP-YYYY-NNN reference number is shown"
  status: failed
  reason: "User reported: Confirmation page did not show up after submitting"
  severity: major
  test: 3
  source: user
  root_cause: "OpportunityForm.tsx handleSubmit (lines 49-84) has no try/catch — any exception silently prevents router.push to the confirmation page. Additionally, generateReferenceNumber DB call in route.ts sits outside try/catch block (line 67 vs line 69); if DB fails, Next.js returns HTML 500 instead of structured JSON, causing res.json() to throw SyntaxError in the form."
  artifacts:
    - path: "src/app/(public)/submit-opportunity/OpportunityForm.tsx"
      issue: "handleSubmit lacks try/catch and finally block — exceptions leave submitting=true and silently abort navigation"
    - path: "src/app/api/v1/submissions/opportunity/route.ts"
      issue: "generateReferenceNumber() call at line 67 is outside the try/catch block starting at line 69"
  missing:
    - "Add try/catch/finally to handleSubmit in OpportunityForm.tsx"
    - "Move generateReferenceNumber inside try block in route.ts"
  debug_session: ".planning/debug/opportunity-confirmation-not-shown.md"

- truth: "After completing the 2-step innovation contribution form and submitting, a confirmation page with a CONTRIB-YYYY-NNN reference number is shown"
  status: failed
  reason: "User reported: Confirmation page did not show up after submission"
  severity: major
  test: 4
  source: user
  root_cause: "ContributionForm.tsx handleSubmit (lines 56-89) has no try/catch and no finally — exceptions leave submitting=true permanently. Additionally the Step 1 Next button (line 373) performs no validation before advancing; if user advances with empty fields and submits, the API returns 422 with step-1 field errors that are set via setErrors() but those error elements are inside the step===1 conditional and invisible on step 2."
  artifacts:
    - path: "src/app/(public)/submit-contribution/ContributionForm.tsx"
      issue: "handleSubmit lacks try/catch/finally; Step 1 Next button (line 373) skips client-side validation; step-1 API errors rendered invisible when on step 2"
  missing:
    - "Add try/catch/finally to handleSubmit in ContributionForm.tsx"
    - "Add step-1 client-side validation before allowing Next button advance"
    - "Add step reset to step 1 when API returns step-1 field errors"
  debug_session: ".planning/debug/contribution-confirmation-not-showing.md"

- truth: "The record detail page Next Actions section shows engagement type buttons (Request Demo, Discuss Use Case, etc.) that open a modal form capturing name/office/email/description; submission returns an ENG-YYYY-NNN reference number"
  status: failed
  reason: "User reported: There is no Next actions section in /records/audio-security-poc. There is only a Contact I&R button that really does not do anything."
  severity: major
  test: 5
  source: user
  root_cause: "record_next_actions table is never seeded in seed.ts — NextActionCTAs receives empty actions array and falls back to a single default 'contact_ir' button (line 29 of NextActionCTAs.tsx). Additionally, the section is titled 'Recommended Next Step' (ExecutiveView.tsx line 133) not 'Next Actions'."
  artifacts:
    - path: "src/lib/db/seed.ts"
      issue: "No INSERT into record_next_actions table — engagement buttons for seeded records are never created"
    - path: "src/app/(public)/records/[slug]/ExecutiveView.tsx"
      issue: "Section title is 'Recommended Next Step' (line 133) instead of 'Next Actions'"
    - path: "src/app/(public)/records/[slug]/NextActionCTAs.tsx"
      issue: "Fallback at line 29 renders single 'contact_ir' button when actions array is empty"
  missing:
    - "Seed record_next_actions rows for audio-security-poc (request_demo, contact_ir) in seed.ts"
    - "Rename section heading in ExecutiveView.tsx line 133 to 'Next Actions'"
  debug_session: ".planning/debug/no-next-actions-engagement-modal.md"

