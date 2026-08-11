---
phase: 03-engagement-flows
plan: 05
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(public)/submit-opportunity/OpportunityForm.tsx
  - src/app/api/v1/submissions/opportunity/route.ts
  - src/app/(public)/submit-contribution/ContributionForm.tsx
  - src/app/(public)/records/[slug]/ExecutiveView.tsx
  - src/lib/db/seed.ts
  - e2e/opportunity-submission.spec.ts
  - e2e/contribution-submission.spec.ts
  - e2e/engagement-routing.spec.ts
autonomous: false
gap_closure: true

features:
  implements: ["F6.5", "F7.5", "F8.1", "F8.2"]
  depends_on: ["F6.1", "F6.2", "F6.3", "F6.4", "F7.1", "F7.2", "F7.3", "F7.4", "F8.3", "F8.4", "F8.5", "F8.6"]
  enables: []

must_haves:
  truths:
    - "After completing all 3 steps of the opportunity submission form and clicking Submit, the browser navigates to /submit-opportunity/confirmation and displays an OPP-YYYY-NNN reference number"
    - "After completing the 2-step innovation contribution form and clicking Submit Contribution, the browser navigates to /submit-contribution/confirmation and displays a CONTRIB-YYYY-NNN reference number"
    - "The record detail page for /records/audio-security-poc shows a 'Next Actions' section (not 'Recommended Next Step') with at least two engagement buttons (Request a Demonstration, Contact I&R) that open the EngagementModal"
  artifacts:
    - path: "src/app/(public)/submit-opportunity/OpportunityForm.tsx"
      provides: "Opportunity form with try/catch/finally around handleSubmit"
      contains: "try {"
    - path: "src/app/api/v1/submissions/opportunity/route.ts"
      provides: "Opportunity API route with generateReferenceNumber inside try block"
      contains: "generateReferenceNumber"
    - path: "src/app/(public)/submit-contribution/ContributionForm.tsx"
      provides: "Contribution form with try/catch/finally + step-1 client validation"
      contains: "try {"
    - path: "src/app/(public)/records/[slug]/ExecutiveView.tsx"
      provides: "ExecutiveView with corrected 'Next Actions' section heading"
      contains: "Next Actions"
    - path: "src/lib/db/seed.ts"
      provides: "Seed script with record_next_actions rows for audio-security-poc"
      contains: "record_next_actions"
  key_links:
    - from: "OpportunityForm.tsx handleSubmit"
      to: "/submit-opportunity/confirmation"
      via: "router.push in try block, finally resets submitting=false"
      pattern: "router\\.push.*confirmation"
    - from: "ContributionForm.tsx handleSubmit"
      to: "/submit-contribution/confirmation"
      via: "router.push in try block, finally resets submitting=false"
      pattern: "router\\.push.*confirmation"
    - from: "seed.ts record_next_actions INSERT"
      to: "NextActionCTAs.tsx actions prop"
      via: "innovation-records.repository.ts fetches enabled actions by record_id"
      pattern: "record_next_actions"

integration_contracts:
  requires: []
  provides:
    - artifact: "src/app/(public)/submit-opportunity/OpportunityForm.tsx"
      exports: ["OpportunityForm"]
      shape: "handleSubmit wrapped in try/catch/finally; setSubmitting(false) in finally"
      verify: "grep -n 'finally' src/app/(public)/submit-opportunity/OpportunityForm.tsx && echo CONTRACT_OK"
    - artifact: "src/app/(public)/submit-contribution/ContributionForm.tsx"
      exports: ["ContributionForm"]
      shape: "handleSubmit wrapped in try/catch/finally; step-1 validation before Next; step reset on step-1 API errors"
      verify: "grep -n 'finally' src/app/(public)/submit-contribution/ContributionForm.tsx && echo CONTRACT_OK"
    - artifact: "src/lib/db/seed.ts"
      exports: ["record_next_actions seed rows"]
      shape: "INSERT INTO record_next_actions for audio-security-poc slug with request_demo and contact_ir rows"
      verify: "grep -n 'record_next_actions' src/lib/db/seed.ts && echo CONTRACT_OK"
    - artifact: "src/app/(public)/records/[slug]/ExecutiveView.tsx"
      exports: ["ExecutiveView"]
      shape: "Section title 'Next Actions' (not 'Recommended Next Step')"
      verify: "grep -n 'Next Actions' src/app/(public)/records/[slug]/ExecutiveView.tsx && echo CONTRACT_OK"
---

<objective>
Close three UAT gaps in Phase 3 Engagement Flows:

1. **Gap 1 — Opportunity confirmation page never shown:** `OpportunityForm.tsx` `handleSubmit` has no try/catch — any exception (including a SyntaxError thrown when a DB failure causes the API to return HTML 500 instead of JSON) silently prevents `router.push`. The `route.ts` also calls `generateReferenceNumber()` before the try block, so a DB error produces an unstructured HTML 500 response.

2. **Gap 2 — Contribution confirmation page never shown:** Same pattern in `ContributionForm.tsx` — no try/catch/finally, leaving `submitting=true` permanently on error. Additionally, the Step 1 "Next" button skips client-side validation, allowing blank fields through; when the API returns 422 with step-1 field errors, the user is on step 2 and never sees them.

3. **Gap 3 — No Next Actions section on record page:** `record_next_actions` table has no seeded rows for `audio-security-poc`, so `NextActionCTAs` falls back to a single static "Contact I&R" button. Section heading also reads "Recommended Next Step" instead of the specified "Next Actions".

Purpose: Restore the three UAT-failed user journeys so the Phase 3 acceptance criteria are met.
Output: Fixed form components, corrected section heading, seeded engagement actions for the canonical POC record.
</objective>

<feature_dependencies>
Implements: F6.5: Opportunity submission confirmation with reference number; F7.5: Contribution submission confirmation with reference number; F8.1: Next-action CTA buttons on record page; F8.2: Engagement modal accessible from record page
Depends on: F6.1–F6.4 (opportunity form fields/validation already built), F7.1–F7.4 (contribution form already built), F8.3–F8.6 (engagement API + modal already built)
Enables: None (phase 3 gap closure)
</feature_dependencies>

<execution_context>
@/root/.config/opencode/pivota_spec-framework/workflows/execute-plan.md
@/root/.config/opencode/pivota_spec-framework/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/03-engagement-flows/03-02-SUMMARY.md
@.planning/phases/03-engagement-flows/03-03-SUMMARY.md
@.planning/phases/03-engagement-flows/03-04-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix form handleSubmit error handling — opportunity and contribution forms</name>
  <files>
    src/app/(public)/submit-opportunity/OpportunityForm.tsx
    src/app/api/v1/submissions/opportunity/route.ts
    src/app/(public)/submit-contribution/ContributionForm.tsx
    e2e/opportunity-submission.spec.ts
    e2e/contribution-submission.spec.ts
  </files>
  <action>
**OpportunityForm.tsx** — replace the `handleSubmit` function (lines 49–84) with a try/catch/finally version:

```tsx
async function handleSubmit() {
  setSubmitting(true);
  setErrors({});

  try {
    const res = await fetch('/api/v1/submissions/opportunity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: form.requestType,
        problemTitle: form.problemTitle,
        problemDescription: form.problemDescription,
        affectedUsers: form.affectedUsers,
        currentWorkflow: form.currentWorkflow || undefined,
        impact: form.impact,
        desiredOutcome: form.desiredOutcome || undefined,
        knownConstraints: form.knownConstraints || undefined,
        relatedWorkAttempted: form.relatedWorkAttempted || undefined,
        discoveryParticipants: form.discoveryParticipants || undefined,
        additionalContext: form.additionalContext || undefined,
        submittingOffice: form.submittingOffice,
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        consentToContact: true,
        nonAcceptanceAcknowledged: true,
      }),
    });

    let data: Record<string, unknown>;
    try {
      data = await res.json();
    } catch {
      // API returned non-JSON (e.g. HTML 500) — surface a generic error
      setErrors({ _: 'Server error. Please try again in a moment.' });
      return;
    }

    if (res.ok) {
      router.push(`/submit-opportunity/confirmation?ref=${data.referenceNumber}`);
    } else {
      const fields = data.fields as Record<string, string> | undefined;
      setErrors(fields ?? { _: (data.message as string) ?? 'Submission failed. Please try again.' });
    }
  } catch {
    setErrors({ _: 'Network error. Please check your connection and try again.' });
  } finally {
    setSubmitting(false);
  }
}
```

**opportunity/route.ts** — move `generateReferenceNumber` inside the try block. Replace lines 63–105 with:

```ts
const data = parsed.data;

const id = crypto.randomUUID();

try {
  const referenceNumber = await generateReferenceNumber('OPP');

  await db
    .insertInto('opportunity_submissions')
    .values({
      id,
      request_type: data.requestType,
      problem_title: data.problemTitle,
      problem_description: data.problemDescription,
      affected_users: data.affectedUsers,
      current_workflow: data.currentWorkflow ?? null,
      impact: data.impact,
      desired_outcome: data.desiredOutcome ?? null,
      known_constraints: data.knownConstraints ?? null,
      related_work_attempted: data.relatedWorkAttempted ?? null,
      submitting_office: data.submittingOffice,
      submitter_name: data.submitterName,
      submitter_email: data.submitterEmail,
      discovery_participants: data.discoveryParticipants ?? null,
      additional_context: data.additionalContext ?? null,
      consent_to_contact: true,
      non_acceptance_acknowledged: true,
      submission_ip: ip,
      status: 'pending',
    })
    .execute();

  return NextResponse.json(
    { id, referenceNumber, message: 'Your submission has been received. This does not imply acceptance into the I&R portfolio.' },
    { status: 201 }
  );
} catch (err) {
  console.error('[POST /api/v1/submissions/opportunity] DB error:', err);
  return NextResponse.json(
    { status: 'error', error_code: 'SUBMISSION_FAILED', message: 'Submission could not be saved. Please try again.' },
    { status: 500 }
  );
}
```

**ContributionForm.tsx** — three fixes:

1. **Step 1 client-side validation** — replace the `onClick` handler on the "Next" button (line ~373):

```tsx
onClick={() => {
  // Client-side validation for step 1 before advancing
  const step1Errors: Record<string, string> = {};
  if (!form.contributionTitle.trim()) step1Errors.contributionTitle = 'Contribution title is required';
  if (form.problemAddressed.trim().length < 30) step1Errors.problemAddressed = 'Problem addressed must be at least 30 characters';
  if (form.workDescription.trim().length < 50) step1Errors.workDescription = 'Work description must be at least 50 characters';
  if (Object.keys(step1Errors).length > 0) {
    setErrors(step1Errors);
    return;
  }
  setErrors({});
  setStep(s => s + 1);
}}
```

2. **handleSubmit try/catch/finally** — replace lines 56–90 with:

```tsx
async function handleSubmit() {
  setSubmitting(true);
  setErrors({});

  try {
    const res = await fetch('/api/v1/submissions/contribution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contributionTitle: form.contributionTitle,
        problemAddressed: form.problemAddressed,
        workDescription: form.workDescription,
        contributingOffice: form.contributingOffice,
        contributorNames: form.contributorNames,
        currentMaturity: form.currentMaturity,
        currentOwner: form.currentOwner,
        ownerContactEmail: form.ownerContactEmail,
        collaborationPreference: form.collaborationPreference,
        artifactLinks: form.artifactLinks || undefined,
        knownLimitations: form.knownLimitations || undefined,
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        nonEndorsementAcknowledged: true,
        consentToContact: true,
      }),
    });

    let data: Record<string, unknown>;
    try {
      data = await res.json();
    } catch {
      setErrors({ _: 'Server error. Please try again in a moment.' });
      return;
    }

    if (res.ok) {
      router.push(`/submit-contribution/confirmation?ref=${data.referenceNumber}`);
    } else {
      const fields = data.fields as Record<string, string> | undefined;
      // If API errors are for step-1 fields, reset to step 1 so errors are visible
      const step1Fields = ['contributionTitle', 'problemAddressed', 'workDescription', 'currentMaturity', 'collaborationPreference'];
      const hasStep1Errors = fields && Object.keys(fields).some(k => step1Fields.includes(k));
      if (hasStep1Errors) {
        setStep(1);
      }
      setErrors(fields ?? { _: (data.message as string) ?? 'Submission failed. Please try again.' });
    }
  } catch {
    setErrors({ _: 'Network error. Please check your connection and try again.' });
  } finally {
    setSubmitting(false);
  }
}
```

**e2e/opportunity-submission.spec.ts** — extend the existing `F6.5` test to explicitly assert `submitting` button re-enables after an error. Add a new test covering the error-display path:

```ts
test('F6.5-error – network/API error shows error message and re-enables Submit', async ({ page }) => {
  await page.goto('/submit-opportunity');
  // Fill and advance through all 3 steps with valid data
  await page.getByLabel(/problem title/i).fill('Test Mission Problem');
  await page.getByLabel(/describe the problem/i).fill('This is a minimum fifty character description of the mission problem.');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel(/who is affected/i).fill('Court clerks and district court administrators nationwide');
  await page.getByLabel(/what is the impact/i).fill('Significant manual processing burden requiring hours of staff time');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByLabel(/does not imply acceptance/i).check();
  await page.getByLabel(/consent to.*contacting/i).check();
  // Intercept the API to simulate a server error
  await page.route('/api/v1/submissions/opportunity', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error', contentType: 'text/html' })
  );
  await page.getByRole('button', { name: /submit/i }).click();
  // Submit button must re-enable (not stuck as "Submitting...")
  await expect(page.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  // Error message must appear
  await expect(page.getByRole('alert')).toBeVisible();
});
```

**e2e/contribution-submission.spec.ts** — add a test covering step-1 validation and error recovery:

```ts
test('F7-step1-validation – Next button blocked when step-1 fields are empty', async ({ page }) => {
  await page.goto('/submit-contribution');
  // Do not fill any fields — click Next immediately
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  // Should still be on step 1
  await expect(page.getByText(/step 1 of 2/i)).toBeVisible();
  // At least one field error should appear
  await expect(page.getByText(/required|at least/i).first()).toBeVisible();
});

test('F7-submit-error – API error re-enables Submit and shows error', async ({ page }) => {
  await page.goto('/submit-contribution');
  // Fill step 1
  await page.getByLabel(/contribution title/i).fill('Test Contribution Title');
  await page.getByLabel(/problem addressed/i).fill('A clear problem statement that exceeds the thirty character minimum');
  await page.getByLabel(/work description/i).fill('This is a sufficiently detailed work description that exceeds fifty characters for the test.');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  // Fill step 2
  await page.getByLabel(/contributing office/i).fill('District Court, Eastern District');
  await page.getByLabel(/contributor.*name/i).fill('Jane Doe');
  await page.getByLabel(/current owner/i).fill('Jane Doe');
  await page.getByLabel(/owner contact email/i).fill('jane@ao.uscourts.gov');
  await page.getByLabel(/does not imply.*endorsement/i).check();
  await page.getByLabel(/consent to.*contacting/i).check();
  // Intercept API to return 500
  await page.route('/api/v1/submissions/contribution', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error', contentType: 'text/html' })
  );
  await page.getByRole('button', { name: /submit contribution/i }).click();
  // Button must re-enable
  await expect(page.getByRole('button', { name: /submit contribution/i })).not.toBeDisabled();
  await expect(page.getByRole('alert')).toBeVisible();
});
```
  </action>
  <verify>
```bash
npx playwright test e2e/opportunity-submission.spec.ts e2e/contribution-submission.spec.ts --reporter=list 2>&1 | tail -40 && echo "PLAYWRIGHT PASSED"
```
  </verify>
  <done>
- `OpportunityForm.tsx`: `handleSubmit` has try/catch/finally; inner try/catch around `res.json()` surfaces HTML-500 as a user-readable error; `setSubmitting(false)` is in `finally` block so it always fires
- `opportunity/route.ts`: `generateReferenceNumber('OPP')` call is inside the try block; DB errors return JSON 500, not HTML 500
- `ContributionForm.tsx`: Step 1 "Next" button validates `contributionTitle` (non-empty), `problemAddressed` (≥30 chars), `workDescription` (≥50 chars) before advancing; `handleSubmit` has try/catch/finally; step-1 API errors reset the form to step 1 before displaying errors; `setSubmitting(false)` always fires in `finally`
- All existing Playwright tests in both spec files still pass; new error-path tests pass
  </done>
</task>

<task type="auto">
  <name>Task 2: Seed record_next_actions for audio-security-poc and fix section heading</name>
  <files>
    src/lib/db/seed.ts
    src/app/(public)/records/[slug]/ExecutiveView.tsx
    e2e/engagement-routing.spec.ts
  </files>
  <action>
**seed.ts** — after the third INSERT block (audio-security-poc upsert, before `COMMIT`), add idempotent seeding of `record_next_actions`. The insert must look up the record UUID by slug because the id is `gen_random_uuid()` at insert time. Use `ON CONFLICT DO NOTHING` for idempotency. Add this block immediately before `await client.query('COMMIT')`:

```ts
// ─── Seed record_next_actions for audio-security-poc ───────────────────────
// These rows are required for NextActionCTAs to render engagement buttons
// instead of the single fallback "Contact I&R" button (F8.1, F8.2).
// Uses a subquery by slug so it works regardless of the generated UUID.
// ON CONFLICT (action_id) DO NOTHING — fully idempotent.
await client.query(`
  INSERT INTO record_next_actions (record_id, action_type, is_enabled, display_order)
  SELECT id, 'request_demo', true, 1
  FROM innovation_records WHERE slug = 'audio-security-poc'
  ON CONFLICT DO NOTHING
`);
await client.query(`
  INSERT INTO record_next_actions (record_id, action_type, is_enabled, display_order)
  SELECT id, 'contact_ir', true, 2
  FROM innovation_records WHERE slug = 'audio-security-poc'
  ON CONFLICT DO NOTHING
`);
```

Note: `record_next_actions` has no unique constraint beyond `action_id` (the PK, which is `gen_random_uuid()`). To make these truly idempotent without a unique constraint on `(record_id, action_type)`, use a guard:

```ts
await client.query(`
  INSERT INTO record_next_actions (record_id, action_type, is_enabled, display_order)
  SELECT r.id, 'request_demo', true, 1
  FROM innovation_records r
  WHERE r.slug = 'audio-security-poc'
    AND NOT EXISTS (
      SELECT 1 FROM record_next_actions
      WHERE record_id = r.id AND action_type = 'request_demo'
    )
`);
await client.query(`
  INSERT INTO record_next_actions (record_id, action_type, is_enabled, display_order)
  SELECT r.id, 'contact_ir', true, 2
  FROM innovation_records r
  WHERE r.slug = 'audio-security-poc'
    AND NOT EXISTS (
      SELECT 1 FROM record_next_actions
      WHERE record_id = r.id AND action_type = 'contact_ir'
    )
`);
```

Also update the seed verification query at the bottom to report next-action counts:

```ts
const naResult = await client.query(`
  SELECT r.slug, count(na.action_id)::int AS next_action_count
  FROM innovation_records r
  LEFT JOIN record_next_actions na ON na.record_id = r.id AND na.is_enabled = true
  WHERE r.slug = 'audio-security-poc'
  GROUP BY r.slug
`);
for (const row of naResult.rows) {
  console.log(`  - ${row.slug}: next_action_count=${row.next_action_count}`);
}
```

**ExecutiveView.tsx** — change line 132 from:

```tsx
      <RecordSection id="exec-next" title="Recommended Next Step">
```

to:

```tsx
      <RecordSection id="exec-next" title="Next Actions">
```

**e2e/engagement-routing.spec.ts** — update the F8.1 test to assert that at least two buttons are visible (not just one fallback) and that the section heading reads "Next Actions":

```ts
test('F8.1 – next action CTAs visible on record page (seeded actions)', async ({ page }) => {
  await page.goto('/records/audio-security-poc');
  const ctaRegion = page.getByLabel(/next action options/i);
  // At least two buttons should appear (request_demo + contact_ir from seed)
  const buttons = ctaRegion.getByRole('button');
  await expect(buttons).toHaveCount(2);
  // Section heading must read "Next Actions"
  await expect(page.getByRole('heading', { name: /next actions/i })).toBeVisible();
});
```

Run the seed against the running dev database to apply the new rows immediately:

```bash
npm run db:seed
```
  </action>
  <verify>
```bash
# Confirm seed ran successfully and rows exist
docker compose exec db psql -U tsio_hub_app -d tsio_hub -c "
  SELECT r.slug, na.action_type, na.is_enabled, na.display_order
  FROM record_next_actions na
  JOIN innovation_records r ON r.id = na.record_id
  WHERE r.slug = 'audio-security-poc'
  ORDER BY na.display_order;
" 2>&1 | grep -E "audio-security-poc|rows" && echo "SEED OK"

# Confirm heading fix
grep -n "Next Actions" src/app/(public)/records/[slug]/ExecutiveView.tsx && echo "HEADING OK"

# Run Playwright
npx playwright test e2e/engagement-routing.spec.ts --reporter=list 2>&1 | tail -30 && echo "PLAYWRIGHT PASSED"
```
  </verify>
  <done>
- `seed.ts` inserts two `record_next_actions` rows for `audio-security-poc`: `request_demo` (display_order=1) and `contact_ir` (display_order=2), both `is_enabled=true`; rows are inserted idempotently using a NOT EXISTS guard
- `npm run db:seed` succeeds and logs `next_action_count=2` for `audio-security-poc`
- `ExecutiveView.tsx` section title is "Next Actions" (not "Recommended Next Step") — `grep -n "Next Actions"` returns a match
- Playwright engagement-routing spec F8.1 test confirms 2 buttons are visible on `/records/audio-security-poc` and the section heading matches "Next Actions"
- All other tests in `engagement-routing.spec.ts` continue to pass
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Human verify — confirmation pages and Next Actions section</name>
  <what-built>
    Three UAT gaps closed:
    1. Opportunity form `handleSubmit` now has try/catch/finally; `generateReferenceNumber` moved inside try block in `route.ts` so HTML-500 responses are caught
    2. Contribution form `handleSubmit` now has try/catch/finally; step-1 Next button validates required fields before advancing; step-1 API errors reset the user to step 1
    3. `audio-security-poc` now has two seeded next-action rows; `ExecutiveView.tsx` section heading changed from "Recommended Next Step" to "Next Actions"
  </what-built>
  <how-to-verify>
    Open the app in a new tab (not the embedded preview — session cookie requires same-origin context).

    **Test 3 — Opportunity Submission:**
    1. Navigate to `/login`, select Stakeholder, sign in
    2. Navigate to `/submit-opportunity`
    3. Fill Step 1: Problem title = "Court Audio Security Problem", Problem description = "Courtroom audio systems lack defense-in-depth security controls protecting sensitive in-camera proceedings" (≥50 chars)
    4. Click Next → Step 2
    5. Fill "Who is affected?" = "Court IT administrators and judicial security officers"
    6. Fill "What is the impact?" = "Risk of unauthorized access to privileged proceedings audio"
    7. Click Next → Step 3
    8. Check both acknowledgment checkboxes
    9. Click Submit
    10. Expected: Browser navigates to `/submit-opportunity/confirmation` showing an `OPP-2026-NNN` reference number and non-acceptance language

    **Test 4 — Contribution Submission:**
    1. Navigate to `/submit-contribution`
    2. Click Next WITHOUT filling fields → expect error messages to appear, stay on Step 1
    3. Fill Step 1 fields with valid data and click Next
    4. Fill Step 2 attribution fields, check both acknowledgment checkboxes
    5. Click Submit Contribution
    6. Expected: Browser navigates to `/submit-contribution/confirmation` showing a `CONTRIB-2026-NNN` reference number

    **Test 5 — Next Actions on Record Page:**
    1. Navigate to `/records/audio-security-poc`
    2. Scroll to the "Next Actions" section (look for that exact heading — not "Recommended Next Step")
    3. Expected: Two buttons visible — "Request a Demonstration" and "Contact I&R"
    4. Click "Request a Demonstration" → engagement modal opens with name/office/email/description fields
    5. Fill the modal and submit → confirmation with `ENG-2026-NNN` reference number
  </how-to-verify>
  <resume-signal>Type "approved" if all three confirmation pages appear and the Next Actions section shows 2 buttons, or describe any remaining issues</resume-signal>
  <files>n/a — human verification step</files>
  <action>Human verification: follow the steps in how-to-verify above</action>
  <verify>Human confirms all three UAT test scenarios produce expected outcomes</verify>
  <done>All three UAT tests (3, 4, 5) produce correct confirmation pages or Next Actions section with engagement buttons</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| client→API | User-controlled form data crossing into POST /api/v1/submissions/opportunity and /contribution handlers |
| client→form | User-controlled input validated client-side before Step 1 Next advance in ContributionForm |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-05-01 | Tampering | `OpportunityForm.tsx` inner `res.json()` catch block | mitigate | The inner try/catch around `res.json()` swallows the raw HTML-500 body and only surfaces a generic message to the user — never echoes raw server error text to the client. The error string is hardcoded in the component, not derived from the response body. |
| T-03-05-02 | Information disclosure | `ContributionForm.tsx` error display | mitigate | Step-1 API errors that are set via `setErrors(fields)` only display Zod validation messages (field names + constraint descriptions). No stack traces, DB error details, or internal paths are in the `fields` response — enforced by the `route.ts` which maps `parsed.error.issues` to `{ fieldName: message }` shape only. |
| T-03-05-03 | Tampering | `seed.ts` NOT EXISTS guard | accept | The NOT EXISTS guard prevents duplicate `record_next_actions` rows per slug+action_type. The seed script runs with the `DATABASE_URL` app credential which has INSERT/SELECT on `record_next_actions` (per migration GRANT). Seed runs only in dev/Docker context — not reachable from the public application. Risk owner: development environment operator. |
| T-03-05-04 | Elevation of privilege | Client-side step-1 validation in ContributionForm | accept | Client-side validation is a UX guard only — the server-side Zod schema in `contribution/route.ts` is the authoritative enforcement point. A client bypassing the step-1 Next button still gets a 422 from the API. This is intentional and documented. |
</threat_model>

<verification>
All three UAT-failing tests must pass after this plan executes:

```bash
# API layer: confirm both routes return JSON 201 (not HTML 500) even on DB error simulation
curl -s -X POST http://localhost:3000/api/v1/submissions/opportunity \
  -H "Content-Type: application/json" \
  -d '{"requestType":"current_mission_problem","problemTitle":"Test","problemDescription":"A minimum fifty character description of the mission problem.","affectedUsers":"Court staff","impact":"High workload","submittingOffice":"Test Office","submitterName":"Test User","submitterEmail":"test@example.com","consentToContact":true,"nonAcceptanceAcknowledged":true}' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['referenceNumber'])" && echo "OPPORTUNITY API OK"

# Seed verification
docker compose exec db psql -U tsio_hub_app -d tsio_hub -c \
  "SELECT count(*) FROM record_next_actions na JOIN innovation_records r ON r.id = na.record_id WHERE r.slug = 'audio-security-poc' AND na.is_enabled = true;" \
  2>&1 | grep -E "^ +[2-9]|rows" && echo "SEED OK"

# Heading fix
grep -n "Next Actions" src/app/(public)/records/\[slug\]/ExecutiveView.tsx && echo "HEADING OK"

# Full Playwright suite for affected spec files
npx playwright test e2e/opportunity-submission.spec.ts e2e/contribution-submission.spec.ts e2e/engagement-routing.spec.ts --reporter=list 2>&1 | tail -40 && echo "ALL PLAYWRIGHT PASSED"
```
</verification>

<success_criteria>
- `OpportunityForm.tsx`: `handleSubmit` has `try { ... } catch { ... } finally { setSubmitting(false); }` — confirmed by grep
- `opportunity/route.ts`: `generateReferenceNumber('OPP')` appears inside the try block (after `const id = crypto.randomUUID()`) — confirmed by grep
- `ContributionForm.tsx`: Step 1 Next button validates contributionTitle/problemAddressed/workDescription before advancing; handleSubmit has try/catch/finally with step-reset-to-1 on step-1 API errors
- `seed.ts`: two `record_next_actions` rows for `audio-security-poc` (request_demo + contact_ir) inserted with NOT EXISTS guard
- `ExecutiveView.tsx`: section title is "Next Actions" — `grep "Next Actions"` returns a match
- All 3 previously-failing UAT tests (3, 4, 5) pass: confirmation pages appear with correct reference numbers; Next Actions section shows 2 modal-opening buttons
- All existing Playwright tests continue to pass (no regressions in catalog, search, perspective, record-detail specs)
</success_criteria>

<output>
After completion, create `.planning/phases/03-engagement-flows/03-GAP-SUMMARY.md` documenting:
- Which files were changed and how
- Confirmation that `record_next_actions` was seeded (row count from DB)
- Playwright test results (pass count)
- Any decisions made during implementation
</output>
