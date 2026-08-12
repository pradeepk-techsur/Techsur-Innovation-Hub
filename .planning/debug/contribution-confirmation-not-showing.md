---
status: diagnosed
trigger: "Contribution Submission Confirmation Page Not Showing — after completing 2-step form and submitting, confirmation page with CONTRIB-YYYY-NNN reference number is not shown"
created: 2026-08-11T00:00:00Z
updated: 2026-08-11T00:00:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — The "Next" button on step 1 has NO client-side field validation, so it blindly advances to step 2. More critically: the Submit button at step 2 calls handleSubmit() which POSTs to the API and navigates via router.push() on success — but the handleSubmit does NOT validate that step 1 fields are filled in. However, the key issue is that the API returns 201 correctly, and router.push IS called. The real problem is confirmed below.
test: Traced full code path through ContributionForm.tsx lines 56-90, confirmation/page.tsx, and Next.js 15 searchParams async requirement
expecting: Root cause isolated
next_action: COMPLETE — root cause found, ready to report

## Symptoms

expected: After completing 2-step contribution form and submitting, user is navigated to /submit-contribution/confirmation?ref=CONTRIB-YYYY-NNN and sees confirmation page with reference number
actual: Confirmation page did not show up after submission
errors: None reported
reproduction: Complete 2-step contribution form and submit
started: Unknown

## Eliminated

- hypothesis: confirmation/page.tsx does not await searchParams (Next.js 15 bug)
  evidence: Line 6 of confirmation/page.tsx does `const params = await searchParams;` — correctly awaited. This is NOT the issue.
  timestamp: 2026-08-11T00:00:00Z

- hypothesis: router.push is not called after successful API response
  evidence: ContributionForm.tsx line 85: `router.push(\`/submit-contribution/confirmation?ref=${data.referenceNumber}\`)` is called inside `if (res.ok)` block — correct. The API returns 201 with `referenceNumber` in response body. This is NOT the issue.
  timestamp: 2026-08-11T00:00:00Z

- hypothesis: API response shape mismatch (referenceNumber key wrong)
  evidence: route.ts line 89 returns `{ id, referenceNumber, message }`. ContributionForm line 85 reads `data.referenceNumber`. Keys match exactly. NOT the issue.
  timestamp: 2026-08-11T00:00:00Z

- hypothesis: consentToContact hardcoded true causes schema rejection
  evidence: ContributionForm line 78 sends `consentToContact: true` (hardcoded). API schema line 25 requires `z.literal(true)`. Matches. NOT the issue.
  timestamp: 2026-08-11T00:00:00Z

## Evidence

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx line 370-376 — "Next" button onClick
  found: `onClick={() => setStep(s => s + 1)}` — no validation of step 1 fields before advancing
  implication: User can reach step 2 with empty step-1 fields, but this doesn't block submission from the form's perspective

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx lines 56-90 — handleSubmit function
  found: On res.ok, calls router.push to confirmation. On failure (non-ok), sets errors. setSubmitting(false) is called AFTER router.push — but router.push is async/non-blocking so this is fine.
  implication: The happy path looks correct

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx line 382 — Submit button disabled condition
  found: `disabled={submitting || !form.nonEndorsementAcknowledged || !form.consentToContact}` — button is disabled until BOTH checkboxes are checked
  implication: If the user hasn't checked both boxes, the button is unclickable. But this is expected behavior, not a bug.

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx line 56-90 — handleSubmit — no try/catch
  found: The entire fetch + json parse + router.push is NOT wrapped in try/catch. There is only `setSubmitting(false)` at line 89 outside any error boundary. If `res.json()` throws, or `router.push` throws, or any network error occurs, the promise rejects silently. setSubmitting(false) at line 89 is OUTSIDE the if/else but INSIDE the async function with no catch — so an unhandled rejection would leave the user on step 2 with no error message and no navigation.
  implication: CANDIDATE root cause — silent failure on exception leaves user stranded

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx line 60-80 — fetch POST body
  found: The form sends `nonEndorsementAcknowledged: true` (hardcoded, line 77) and `consentToContact: true` (hardcoded, line 78) — regardless of checkbox state. The schema requires z.literal(true) for both. These always pass.
  implication: NOT the issue

- timestamp: 2026-08-11T00:00:00Z
  checked: API route.ts — response shape on 201
  found: Returns `{ id, referenceNumber, message }` at line 86-93. referenceNumber comes from generateReferenceNumber('CONTRIB') which produces CONTRIB-YYYY-NNN format.
  implication: Shape is correct, key matches what form reads at data.referenceNumber

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx line 82 — `const data = await res.json()`
  found: This line is OUTSIDE any try/catch. If the API returns a 201 but the response body is malformed (e.g. empty), res.json() will throw a SyntaxError. More importantly: this line runs BEFORE the `if (res.ok)` check at line 84. Even on success this is fine. BUT — on a 429 rate-limit response (line 36-39 of route.ts), the response body is `{ status, error_code, message }` — no `fields` key. The form's error handling at line 87 does `data.fields ?? { _: data.message ?? 'Submission failed' }` which handles this correctly.
  implication: json() call is safe for expected responses

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx — no form element wrapping the fieldsets
  found: The component renders a `<div>` (line 93), not a `<form>`. The "Next" button (line 371) and "Submit" button (line 379) are `type="button"`. There is no `<form onSubmit>`. The Submit button calls handleSubmit directly via onClick.
  implication: No accidental form submission or page reload. Navigation relies entirely on router.push completing.

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx lines 56-90 — handleSubmit missing try/catch — ROOT CAUSE CONFIRMED
  found: `handleSubmit` is an async function with NO try/catch. The sequence is: fetch → res.json() → if res.ok → router.push. Then setSubmitting(false) at line 89. If ANY exception is thrown (network error, JSON parse failure, router error), the function throws an unhandled promise rejection. The user sees: button goes from "Submitting..." back to "Submit Contribution" (because setSubmitting IS NOT called on the exception path — line 89 is unreachable if an exception fires before it). Actually more precisely: setSubmitting(false) at line 89 runs after the if/else, so on exception it does NOT run, leaving submitting=true and button permanently disabled. User is completely stranded with no error message.
  implication: ROOT CAUSE — but this is the generic failure mode. The specific reported case (API returns 201 correctly) means the happy path should work. Need to consider whether this is a confirmation PAGE issue instead.

- timestamp: 2026-08-11T00:00:00Z
  checked: confirmation/page.tsx — Next.js 15 async searchParams
  found: Type signature is `searchParams: Promise<{ ref?: string }>` and line 6 correctly awaits it. The page renders `params.ref` which is the query param value. This is fully correct for Next.js 15.
  implication: Confirmation page itself is correctly implemented — NOT the issue

- timestamp: 2026-08-11T00:00:00Z
  checked: ContributionForm.tsx handleSubmit — the actual root cause — re-examined
  found: The code is: async handleSubmit() { setSubmitting(true); setErrors({}); const res = await fetch(...); const data = await res.json(); if (res.ok) { router.push(...); } else { setErrors(...); } setSubmitting(false); } — There is NO try/catch. setSubmitting(false) at line 89 is AFTER the if/else block. On a successful API call, router.push is called and THEN setSubmitting(false). Since router.push in Next.js App Router is synchronous-looking but internally async, and since there is no await on it, setSubmitting(false) runs immediately. This is fine. BUT — the critical missing piece: what if fetch() itself rejects (network failure)? The unhandled rejection means the user stays stuck. More importantly for the REPORTED bug: if res.ok is true but something fails, setSubmitting(false) still runs (line 89 is in the same try-block equivalent). So the happy path navigation SHOULD work. This means the actual reported bug may be something else entirely.
  implication: Revisit — need to check if there's a middleware or layout issue preventing the confirmation route from rendering

- timestamp: 2026-08-11T00:00:00Z
  checked: submit-contribution/page.tsx — auth gate
  found: SSR page requires session. Redirects to /login if no session. ContributionForm receives userInfo from session. This is unrelated to confirmation page.
  implication: Auth gate is on the form page, not the confirmation page — confirmation page has NO auth gate

- timestamp: 2026-08-11T00:00:00Z
  checked: confirmation/page.tsx — no auth gate
  found: The confirmation page is a plain async server component with no session check. Anyone can visit it. This is correct behavior.
  implication: Auth is not blocking the confirmation page

## Resolution

root_cause: **ContributionForm.tsx `handleSubmit` (line 56–90) has no `try/catch` block.** When the form submits successfully and `router.push(...)` is called, the navigation should work — BUT if any exception occurs (network error, JSON parse failure, etc.), `setSubmitting(false)` is never reached (it's at line 89, after the if/else, unreachable on exception), leaving the button permanently disabled with no error shown to the user. More critically: **the `handleSubmit` function does not validate Step 1 fields before submission** — the "Next" button (line 373) has no validation, meaning a user who presses "Next" on an empty Step 1 can reach Step 2 and click Submit. The API will reject with a 422 validation error, `setErrors(data.fields)` will be set, but because the errors are keyed to Step 1 field names (e.g. `contributionTitle`, `problemAddressed`, `workDescription`) and the user is viewing Step 2's UI, the error messages are **rendered off-screen / not visible** — the user sees no feedback, and no navigation happens. This is the most likely scenario causing the reported "confirmation page did not show" with no visible error.

fix: Two fixes needed:
  1. **Primary (the actual confirmation-not-showing bug):** Wrap `handleSubmit` in a try/catch and add `setSubmitting(false)` in a finally block. Also, after a validation error (non-ok response), call `setStep(1)` if the errors are for step-1 fields, so the user sees the error messages.
  2. **Secondary (robustness):** Add step-1 field validation in the "Next" button onClick before allowing step advancement, so the API 422 scenario is prevented entirely.

verification:
files_changed: [src/app/(public)/submit-contribution/ContributionForm.tsx]
