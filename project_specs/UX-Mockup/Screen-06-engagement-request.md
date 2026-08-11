---

### Screen 06: Engagement Request

**Route:** Triggered from Innovation Record CTAs (modal overlay) or general Contact I&R (modal or inline page)
**Purpose:** Captures structured engagement intent — type, context, contact, and description — and persists the request before email routing. Pre-populated from the originating record.
**User Stories:** US-8.1, US-8.2, US-8.3
**Personas:** PER-01 (Margaret), PER-02 (David), PER-03 (Priya)

#### Layout — Modal Overlay (record-initiated)

```
┌──────────────────────────────────────────────────────────────────┐
│ [MODAL OVERLAY — rendered on top of Innovation Record page]      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Request Information from I&R                   [× Close]  │  │
│  │  ─────────────────────────────────────────────────────────  │  │
│  │                                                            │  │
│  │  Pre-populated context (read-only):                        │  │
│  │  Regarding: Audio Security POC                             │  │
│  │  [read-only, from originating record]                      │  │
│  │                                                            │  │
│  │  Request Type *                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ ▾ [Pre-selected from CTA: "Request a Demonstration"] │  │  │
│  │  │   Request a Demonstration                            │  │  │
│  │  │   Explore Adoption                                   │  │  │
│  │  │   Request Technical Guidance                         │  │  │
│  │  │   Discuss a Related Use Case                         │  │  │
│  │  │   Share Related Work                                 │  │  │
│  │  │   General Contact                                    │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Suggested subject: "Demo Request – Audio Security POC"    │  │
│  │  (informational — not editable)                            │  │
│  │                                                            │  │
│  │  Your Name *                                               │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ [text input]                                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Your Office *                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ [text input]                                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Your Email *                                              │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ [email input]                                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Describe your need or question * (min 20 characters)      │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ [textarea]                                          │  │  │
│  │  │                                                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Desired next step (Optional)                              │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ [text input]                                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Preferred contact method (Optional)                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ ▾ Email / Phone / Either                            │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ☐ I consent to TSIO Innovation & Research contacting me * │  │
│  │    at the provided email address                           │  │
│  │                                                            │  │
│  │  Your request will be sent to:                             │  │
│  │  TSIO Innovation & Research                                │  │
│  │  (not the raw email address — display name only)           │  │
│  │                                                            │  │
│  │  [Cancel]                [Submit Request]                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

#### Engagement Confirmation

```
┌──────────────────────────────────────────────────────────────────┐
│ [Confirmation — replaces modal content or navigates to new view] │
│                                                                  │
│  ✓ Your request has been recorded.                               │
│                                                                  │
│  Reference Number: ENG-2026-0089                                 │
│                                                                  │
│  TSIO Innovation & Research will review your request and         │
│  reach out using the contact information you provided.           │
│                                                                  │
│  [If email routing used:                                         │
│   "Your request has been recorded. If your email client          │
│    opened, please send the pre-filled email to complete          │
│    your request."]                                               │
│                                                                  │
│  [ Return to Record ]   [ Browse Catalog ]                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Engagement — No Routing Configured

```
┌────────────────────────────────────────────────────────────────┐
│  Engagement routing is not currently configured.               │
│  Please contact I&R directly.                                  │
│  [Contact information or link to general contact page]         │
└────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Pre-populated originating record (read-only) | Top of form |
| Primary | Request type (pre-selected from CTA) | First editable field |
| Primary | Contact fields (name, office, email) | Middle of form |
| Primary | Need/question description | Middle of form |
| Secondary | Desired next step, preferred contact method | Optional fields |
| Secondary | Routing destination (display name, not email) | Before submit |
| Primary (confirmation) | "Request recorded" + reference number | Confirmation |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Modal open, record context pre-populated | Request type pre-selected from CTA |
| General contact (no record) | Same form, originating record = empty | No record context shown |
| Validation error | Inline error below each field | Per-field message |
| Submitting | Submit button spinner, disabled | "Submitting…" |
| Success (server routing) | Confirmation in modal | Reference number + follow-up expectation |
| Success (mailto routing) | Confirmation + "send the pre-filled email" note | Additional instruction shown |
| Email routing fails (server) | Request recorded; user sees standard confirmation | Email failure flagged in curator view only — user not shown error |
| No routing configured | Error message in modal (SEC-07) | "Engagement routing is not currently configured. Please contact I&R directly." |
| Rate limit exceeded | Error on submit | "Too many requests. Please try again later." |

#### Accessibility Notes

- Modal: `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to modal title
- Focus management: on modal open, focus moves to first focusable element (× Close button or first input); on close, focus returns to triggering CTA button
- Keyboard trap: Tab key cycles within modal; Escape key closes modal and returns focus
- × Close button: `aria-label="Close engagement request form"`
- Pre-populated record context: `<p>` with `aria-label="Regarding record: Audio Security POC"` in a `<fieldset>` labeled "Pre-filled context" or similar read-only group
- Required fields: `aria-required="true"` + asterisk in visible label
- Consent checkbox: `aria-required="true"`; validation error if unchecked on submit
- Confirmation: `role="status"` on main confirmation message; reference number in `<strong>`
- "No routing configured" error: `role="alert"` — should announce immediately as it replaces expected form content

---
