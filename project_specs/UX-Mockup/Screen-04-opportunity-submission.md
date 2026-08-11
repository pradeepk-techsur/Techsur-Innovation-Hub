---

### Screen 04: Opportunity Submission

**Route:** `/submit/opportunity`
**Purpose:** Multi-step form for submitting a mission problem or workflow friction to I&R. Problem-first framing. Explicit non-acceptance statement. Distinct from contribution form (F7).
**User Stories:** US-6.1, US-6.2, US-6.3
**Personas:** PER-02 (David), PER-04 (Carlos)

#### Layout — Step 1: Request Type + Non-Acceptance Statement

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Submit a Problem to I&R                                         │
│  <h1>                                                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ℹ IMPORTANT: Submitting an opportunity does not imply      │  │
│  │   acceptance into the I&R portfolio. I&R will review       │  │
│  │   submissions and reach out if the opportunity aligns      │  │
│  │   with our current capacity and priorities.                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Step indicator: ●─○─○─○  Step 1 of 4: Request Type]           │
│                                                                  │
│  What type of opportunity are you submitting? *                  │
│  ○ Current Mission Problem                                       │
│  ○ Emerging Technology Question                                  │
│  ○ Request for Research                                          │
│  ○ Potential POC                                                 │
│  ○ Request for Demonstration                                     │
│  ○ Collaboration Opportunity                                     │
│  ○ Share Existing Innovation Work                                │
│  ○ Other                                                         │
│                                                                  │
│  [If "Share Existing Innovation Work" selected — inline banner:] │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ You selected "Share Existing Innovation Work."             │  │
│  │ There is a dedicated contribution form for teams with      │  │
│  │ existing work to share. → [Go to Contribution Form]        │  │
│  │ You may also continue here if you prefer.                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                          [Next: Problem →]       │
└──────────────────────────────────────────────────────────────────┘
```

#### Layout — Step 2: Problem Description

```
│  [Step indicator: ●─●─○─○  Step 2 of 4: Problem Description]    │
│                                                                  │
│  Problem Title *                                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input, max 200 chars]                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Describe the problem or friction you're experiencing *          │
│  (Describe the mission problem, not a requested solution.        │
│   Minimum 50 characters.)                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea, min 50 chars, max 5000 chars]                   │  │
│  │                                                            │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [0 / 5000 characters]                                           │
│                                                                  │
│  Who is affected by this problem? *                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea, roles, offices, courts affected]                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What is the operational impact? *                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — frequency, severity, scope of impact]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                          [Next: Context →]            │
```

#### Layout — Step 3: Context (Optional Fields)

```
│  [Step indicator: ●─●─●─○  Step 3 of 4: Context & Contact]      │
│                                                                  │
│  How is the work done today? (Optional)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — current workflow description]                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What outcome would improve the situation? (Optional)            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — desired outcome, not a specific solution]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Known constraints (Optional)                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — technical, policy, resource constraints]       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Related work already attempted (Optional)                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea]                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Submitting Office *                                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input]                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Your Name *                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input]                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Your Email *                                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [email input]                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Discovery participants available? (Optional)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input — names/roles]                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                          [Next: Review →]             │
```

#### Layout — Step 4: Review & Acknowledge

```
│  [Step indicator: ●─●─●─●  Step 4 of 4: Review & Acknowledge]   │
│                                                                  │
│  Review your submission                                          │
│  ─────────────────────                                           │
│  Request Type: Current Mission Problem                           │
│  Problem Title: [summary of title]                               │
│  Problem Description: [excerpt]                                  │
│  Submitting Office: [value]                                      │
│  Contact: [name] — [email]                                       │
│  [Edit ↗] (links back to relevant step)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ℹ NON-ACCEPTANCE STATEMENT                                 │  │
│  │   Submitting this opportunity does not imply acceptance    │  │
│  │   into the I&R portfolio. I&R will review submissions and  │  │
│  │   reach out if the opportunity aligns with current         │  │
│  │   capacity and priorities.                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ☐ I understand that submission does not imply I&R acceptance *  │
│                                                                  │
│  ☐ I consent to I&R contacting me at the provided email         │
│    address regarding this submission *                           │
│                                                                  │
│  [← Back]                          [Submit Opportunity]          │
│                                                                  │
│  (Rate limit: max 5 submissions per hour from this browser)      │
```

#### Submission Confirmation

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✓ Your submission has been received.                            │
│                                                                  │
│  Reference Number: OPP-2026-0047                                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ IMPORTANT: Submission does not imply acceptance into the   │  │
│  │ I&R portfolio. You will be contacted if I&R determines     │  │
│  │ the opportunity aligns with current priorities.            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What happens next:                                              │
│  • Your submission enters I&R's review queue                     │
│  • I&R will review and respond if the opportunity fits their     │
│    current capacity and priorities                               │
│  • No automated approval will be sent                           │
│                                                                  │
│  [ Browse the Catalog ]   [ Submit Another Problem ]             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Non-acceptance statement | Top of Step 1, Step 4 (always visible) |
| Primary | Required fields (problem description, who affected, impact) | Step 2 |
| Secondary | Optional context fields | Step 3 |
| Secondary | Acknowledgment checkboxes | Step 4 |
| Tertiary | Step indicator / progress | Top of each step |
| Primary (confirmation) | Reference number | Confirmation page, prominent |
| Primary (confirmation) | Non-acceptance re-statement | Confirmation, in notice box |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Step 1 with non-acceptance banner | — |
| Validation error | Red border + inline error below field | Per-field message (e.g., "Problem description must be at least 50 characters.") |
| Rate limit hit | Error message replaces submit button | "Too many submissions. Please try again later." |
| Submitting | Submit button shows spinner, disabled | "Submitting…" |
| Success | Confirmation page | Reference number + non-acceptance re-statement |
| "Share Innovation Work" selected | Inline redirect guidance | Banner with link to contribution form |

#### Accessibility Notes

- `<h1>`: "Submit a Problem to I&R"
- Non-acceptance notice: `role="note"` with `aria-label="Non-acceptance notice"` — NOT `role="alert"` (it should not interrupt on re-render)
- Step indicator: `aria-label="Step 2 of 4: Problem Description"` on the step container; each step completed has `aria-current="step"` pattern
- All required fields: marked with asterisk (*) AND `aria-required="true"` on the input
- Error messages: each error is associated with its field via `aria-describedby`; error summary at top of step on submit attempt with links to each errored field
- Acknowledgment checkboxes: `<label>` associated with `<input type="checkbox">`; both required before form can submit
- Character counter: `aria-live="polite"` so screen readers announce as user types
- "Share Existing Innovation Work" redirect banner: appears below the radio group as an `aria-live="polite"` region

---
