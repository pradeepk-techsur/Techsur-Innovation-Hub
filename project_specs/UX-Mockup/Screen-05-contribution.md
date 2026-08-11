---

### Screen 05: Share Innovation Work (Contribution Form)

**Route:** `/submit/contribution`
**Purpose:** Dedicated contribution flow for teams with existing innovation to share. Distinct from opportunity submission. Attribution preserved. Non-endorsement statement prominent. Curation required before publication.
**User Stories:** US-7.1, US-7.2, US-7.3
**Personas:** PER-04 (Carlos Rivera)

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Share Your Innovation Work                                      │
│  <h1>                                                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ℹ NON-ENDORSEMENT NOTICE                                   │  │
│  │   Submitting existing innovation work does not imply I&R   │  │
│  │   central endorsement. If I&R determines the work is       │  │
│  │   suitable for publication, attribution will be preserved  │  │
│  │   and you will be notified.                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  SECTION 1: WORK IDENTITY                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Contribution Title *                                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input, max 200 chars]                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What problem does this work address? *                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — describe the mission problem, not the solution] │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Describe the work that was done *                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — what was built, tested, or documented]         │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  SECTION 2: ATTRIBUTION (preserved through curation)            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Contributing Office *                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input — your court, AO office, or team]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ℹ This office name will be credited on any published record.    │
│                                                                  │
│  Contributor Names *                                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input — names of individuals to credit]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ℹ These names will be credited on any published record.         │
│                                                                  │
│  Current Maturity *                                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▾ Select maturity stage...                                 │  │
│  │   Idea                                                     │  │
│  │   Evaluated Idea                                           │  │
│  │   Experiment / POC                                         │  │
│  │   Prototype / Pilot                                        │  │
│  │   Production / Validated Pattern                           │  │
│  │   Archived / Retired                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [What do these stages mean? ↗]  (link to maturity reference)    │
│                                                                  │
│  Current Owner / Steward *                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input — who is responsible for this work now]        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Owner Contact Email *                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [email input]                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Collaboration Preference *                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▾ Select preference...                                     │  │
│  │   Open for Reuse                                           │  │
│  │   Seeking Collaborator                                     │  │
│  │   Informational / Reference Only                           │  │
│  │   Seeking Adopter                                          │  │
│  │   Discuss with I&R First                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  SECTION 3: ARTIFACTS & LIMITATIONS (Optional)                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Artifact Links (Optional)                                       │
│  Add links to existing documents, diagrams, or repositories.     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Artifact name:  [________________]                         │  │
│  │ URL:            [________________]  [+ Add another]        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Known Limitations (Optional)                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — what does not work, what is out of scope]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Additional Context (Optional)                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea]                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  SECTION 4: YOUR CONTACT & ACKNOWLEDGMENT                        │
│  ─────────────────────────────────────────────────────────────  │
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
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ℹ NON-ENDORSEMENT REMINDER                                 │  │
│  │   Submitting does not imply I&R endorsement. Your          │  │
│  │   attribution will be preserved if selected for curation.  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ☐ I understand that submission does not imply I&R endorsement * │
│                                                                  │
│  ☐ I consent to I&R contacting me at the email provided *        │
│                                                                  │
│  [Submit Contribution]                                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Contribution Confirmation

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✓ Your contribution has been received.                          │
│                                                                  │
│  Reference Number: CON-2026-0012                                 │
│                                                                  │
│  Attribution captured:                                           │
│  Contributing Office: [office name]                              │
│  Contributors: [contributor names]                               │
│  Current Owner: [owner name]                                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ What happens next:                                         │  │
│  │ • Your contribution enters I&R's curation review queue    │  │
│  │ • It will NOT be published without curator review          │  │
│  │ • If selected for curation, your attribution and          │  │
│  │   ownership information will be preserved                 │  │
│  │ • I&R will contact you if the work is selected            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [ Browse the Catalog ]   [ Submit Another Contribution ]        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Non-endorsement notice | Top of form, before fields |
| Primary | Attribution fields (contributing office, contributor names) | Section 2, prominently labeled |
| Primary | Non-endorsement reminder + checkboxes | Section 4, before submit |
| Secondary | Work identity fields | Section 1 |
| Secondary | Maturity + owner + collaboration preference | Section 2 |
| Tertiary | Artifact links, limitations, additional context | Section 3 (optional) |
| Primary (confirmation) | Attribution confirmed captured | Confirmation, explicit |
| Primary (confirmation) | Curation-required statement | Confirmation notice box |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Single-page form, scrolling sections | — |
| Validation error | Inline error below each field | Specific per-field message |
| Rate limit | Error on submit | "Too many submissions. Please try again later." |
| Submitting | Submit button spinner, disabled | "Submitting…" |
| Success | Confirmation page | Reference number + attribution captured + curation-required statement |

#### Accessibility Notes

- `<h1>`: "Share Your Innovation Work"
- Non-endorsement notice (top): `role="note"` with `aria-label="Non-endorsement notice"`
- Section headings: `<h2>` for each section (Work Identity, Attribution, etc.)
- Maturity dropdown: `<select>` with `<label>`; maturity reference link opens in new tab with `aria-label="What do maturity stages mean? (opens in new tab)"`
- Attribution fields: help text (e.g., "This office name will be credited on any published record") associated via `aria-describedby`
- Required fields: asterisk + `aria-required="true"`
- Dynamic artifact rows (+ Add another): new row announced via `aria-live="polite"` with focus moved to new Name field
- Acknowledgment checkboxes: `aria-required="true"`; form cannot submit if unchecked — shown as validation error, not silent block
- Confirmation: `role="status"` on confirmation heading "Your contribution has been received" for screen reader announcement

---
