---

### Screen 09: Record Editor

**Route:** `/curator/records/new` | `/curator/records/:id/edit`
**Purpose:** Full record creation and editing form for curators. Covers all FRD field groups (0–9). Publication gate validation. Maturity and review status as independent controls. Artifact management. Audit history view. Content model reference inline.
**User Stories:** US-9.3, US-9.4, US-9.5, US-9.6, US-9.7, US-9.8, US-9.9, US-9.14
**Personas:** PER-05 (Jasmine Okafor)
**Access:** Curator or Admin role required (SEC-01)

#### Layout — Editor Shell

```
┌──────────────────────────────────────────────────────────────────┐
│ [CURATOR SIDEBAR]                                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ← Back to Records                                               │
│                                                                  │
│  [EDITOR HEADER]                                                 │
│  Audio Security POC              ▪ Draft      [Save] [⋮ Actions]│
│  Last saved: Aug 11, 2026, 10:23 AM (auto-save)                  │
│  Last updated by: Jasmine Okafor                                 │
│  Created: Aug 08, 2026 by Jasmine Okafor                         │
│                                                                  │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐  │
│  │ [SECTION NAV]        │  │ [CONTENT AREA]                  │  │
│  │ (sticky left panel   │  │ (scrolling, ~700px wide)        │  │
│  │  or top tabs)        │  │                                 │  │
│  │                      │  │ [Active section content]        │  │
│  │ ● Problem & Context  │  │                                 │  │
│  │ ○ What Was Explored  │  │                                 │  │
│  │ ○ Outcome & Evidence │  │                                 │  │
│  │ ○ Key Findings       │  │                                 │  │
│  │ ○ Maturity &         │  │                                 │  │
│  │   Readiness          │  │                                 │  │
│  │ ○ Reuse Guidance     │  │                                 │  │
│  │ ○ Ownership &        │  │                                 │  │
│  │   Attribution        │  │                                 │  │
│  │ ○ Artifacts          │  │                                 │  │
│  │ ○ Next Actions       │  │                                 │  │
│  │ ○ Governance         │  │                                 │  │
│  │                      │  │                                 │  │
│  │ ─────────────────    │  │                                 │  │
│  │ Audit History        │  │                                 │  │
│  └──────────────────────┘  └─────────────────────────────────┘  │
│                                                                  │
│  [PUBLICATION ACTIONS — persistent bottom bar]                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Current state: Draft                                        │  │
│  │ [Validate for Publication]   [Submit for Review]            │  │
│  │ [Publish]  [Unpublish]  [Supersede]  [Archive]  [Retire]    │  │
│  │ (only applicable actions shown for current state)           │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

#### Content Area — Problem & Context Section

```
│  PROBLEM & CONTEXT                             [? Help ↗]       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Title *  (Publication gate field)                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Audio Security POC                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  Max 200 characters                                              │
│                                                                  │
│  Summary *  (Publication gate field — max 500 chars)             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Defense-in-depth audio isolation approach for courtroom    │  │
│  │ proceedings during remote hearings.                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [142 / 500]                                                     │
│                                                                  │
│  Problem Statement *  (Publication gate field)                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — full narrative, min 50 chars, max 5000]        │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Affected Users                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — optional]                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Current Workflow / Constraint                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — optional]                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Why Experimentation Was Appropriate                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — optional]                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Mission Areas *  (Publication gate — min 1 value)               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [Multi-select tag input — controlled taxonomy]             │  │
│  │ ✕ Court Operations   ✕ Security   [+ Add area]             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Problem Type Tags                                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [Multi-select tag input — controlled taxonomy, optional]   │  │
│  │ ✕ Security   ✕ Audio/Media   [+ Add tag]                   │  │
│  └────────────────────────────────────────────────────────────┘  │
```

#### Content Area — Maturity & Readiness Section (Key governance section)

```
│  MATURITY & READINESS                          [? Definitions ↗] │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐ │
│  │ MATURITY *                  │  │ REVIEW STATUS *             │ │
│  │ (independent control)       │  │ (independent multi-select) │ │
│  │                             │  │                            │ │
│  │ [Select maturity stage ▾]   │  │ ☑ Submitted                │ │
│  │ ─────────────────────       │  │ ☑ Curated for Completeness │ │
│  │ Idea                        │  │ ☑ Technically Reviewed     │ │
│  │ Evaluated Idea              │  │ ☐ Security Reviewed        │ │
│  │ ● Experiment / POC          │  │   [🔒 — distinct visual]   │ │
│  │ Prototype / Pilot           │  │ ☐ Policy Reviewed          │ │
│  │ Production / Validated      │  │ ☐ Validated for Reuse      │ │
│  │ Archived / Retired          │  │   [Requires confirmation]  │ │
│  │                             │  │ ☐ Superseded               │ │
│  │ [What does this mean? ↗]    │  │ ☐ Retired                  │ │
│  │                             │  │                            │ │
│  │ Maturity change reason      │  │ [What do these mean? ↗]    │ │
│  │ (optional — captured in     │  │                            │ │
│  │  audit event)               │  │ ─────────────────────────  │ │
│  │ [text input]                │  │ ⚠ Changing review status   │ │
│  └─────────────────────────────┘  │ does NOT change maturity.  │ │
│                                   │ Changing maturity does NOT │ │
│  ⚠ These two controls are         │ change review status.      │ │
│    INDEPENDENT. Neither auto-     └────────────────────────────┘ │
│    infers from the other.                                        │
│                                                                  │
│  Ready For                                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — what is the work currently ready for]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Not Ready For                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea]                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Production Readiness Gaps                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea]                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Next Stage Requirements                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea]                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Last Reviewed Date *  (Publication gate field)                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [date input YYYY-MM-DD — cannot be in future]              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Next Review Date (Optional — triggers curator reminder)         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [date input YYYY-MM-DD — must be after last reviewed]      │  │
│  └────────────────────────────────────────────────────────────┘  │
```

#### Content Area — Artifacts Section

```
│  AUTHORITATIVE ARTIFACTS                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Links to authoritative source documents. Hub does not host      │
│  artifact content — only links to authoritative sources.         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ≡ Artifact 1                               [Edit] [× Remove] │
│  │   Name: Lessons Learned Document                           │  │
│  │   Type: Lessons Learned                                    │  │
│  │   URL: https://sharepoint.ao.uscourts.gov/...              │  │
│  │   Access Notes: AO network access required                 │  │
│  │   Restricted: ☐ (URL visible to public)                    │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ ≡ Artifact 2                               [Edit] [× Remove] │
│  │   Name: Architecture Diagram                               │  │
│  │   Type: Architecture Diagram                               │  │
│  │   URL: [hidden — restricted]                               │  │
│  │   Access Notes: AO security team access only               │  │
│  │   Restricted: ☑ (URL hidden from public users)             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [+ Add Artifact]                                                │
│                                                                  │
│  (Artifacts can be reordered by dragging the ≡ handle)           │
│  ⚠ If removing the only artifact and source_basis is also empty,│
│    a warning is shown before saving.                             │
```

#### Content Area — Governance Section

```
│  GOVERNANCE & DISCLAIMER                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Applicable Disclaimer *  (Publication gate field)               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — or select from template]                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [Use disclaimer template for Experiment/POC ↗]                  │
│  (template suggestion appears when maturity = experiment_poc)    │
│                                                                  │
│  Engagement Indicator                                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ▾ None                                                     │  │
│  │   Available for Demonstration                               │  │
│  │   Seeking Adoption Partner                                  │  │
│  │   Technical Playbook Available                              │  │
│  │   Reference Pattern Available                               │  │
│  │   Monitoring Only                                           │  │
│  │   Archived                                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Supersession Reason (required when superseding)                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — appears only when state = superseded]          │  │
│  └────────────────────────────────────────────────────────────┘  │
```

#### Publication Gate Validation Panel

Triggered when curator clicks "Validate for Publication" or "Publish":

```
┌──────────────────────────────────────────────────────────────────┐
│ PUBLICATION GATE CHECK                                           │
│ ─────────────────────────────────────────────────────────────── │
│                                                                  │
│ ✓  Title                                                         │
│ ✓  Summary                                                       │
│ ✓  Problem Statement                                             │
│ ✓  Mission Areas (min 1)                                         │
│ ✓  Hypothesis / Objective                                        │
│ ✓  Technology Areas (min 1)                                      │
│ ✓  Outcome Summary                                               │
│ ✓  Source Basis                                                  │
│ ✓  Key Findings (at least 1 category)                            │
│ ✗  Maturity — MISSING                                            │
│ ✓  Review Status (min 1)                                         │
│ ✓  Last Reviewed Date                                            │
│ ✗  Owner / Steward — MISSING                                     │
│ ✓  Attribution Statement                                         │
│ ✗  Applicable Disclaimer — MISSING                               │
│                                                                  │
│ Publication is blocked. Complete the missing fields above.       │
│                                                                  │
│ [Go to Maturity field]  [Go to Owner/Steward]  [Go to Disclaimer]│
│                                              [Close]             │
└──────────────────────────────────────────────────────────────────┘
```

Maturity/disclaimer mismatch (non-blocking warning):
```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠ DISCLAIMER MISMATCH WARNING                                    │
│ The record's maturity is set to "Production / Validated Pattern" │
│ but the source basis suggests POC-level work. Please confirm     │
│ the maturity assignment is intentional.                          │
│ [I confirm — Publish anyway]    [Cancel — return to editor]      │
└──────────────────────────────────────────────────────────────────┘
```

#### Audit History Panel

Accessible from the "Audit History" link in the section nav:

```
┌──────────────────────────────────────────────────────────────────┐
│ AUDIT HISTORY — Audio Security POC                               │
│ ─────────────────────────────────────────────────────────────── │
│                                                                  │
│ Aug 11, 2026, 10:23 AM  Jasmine Okafor                           │
│ record_updated  Changed fields: findings_security, ready_for     │
│                                                                  │
│ Aug 10, 2026, 04:15 PM  Jasmine Okafor                           │
│ maturity_changed  Idea → Experiment / POC                        │
│ Reason: "Work completed; findings documented from lessons-learned"│
│                                                                  │
│ Aug 10, 2026, 03:00 PM  Jasmine Okafor                           │
│ review_status_changed  [submitted] → [curated, technically_reviewed] │
│                                                                  │
│ Aug 09, 2026, 11:00 AM  Jasmine Okafor                           │
│ attribution_updated  contributing_offices updated                │
│                                                                  │
│ Aug 08, 2026, 02:00 PM  Jasmine Okafor                           │
│ record_created  Draft created                                    │
│                                                                  │
│ (Audit events are append-only — they cannot be edited or deleted) │
└──────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Publication state + action buttons | Header + bottom persistent bar |
| Primary | Section navigation | Left panel (sticky) |
| Primary | Publication gate field indicators | Adjacent to each gate field |
| Primary | Maturity and review status controls (separate, independent) | Maturity & Readiness section, side-by-side |
| Secondary | Optional fields | Within each section |
| Secondary | Artifact management | Artifacts section |
| Tertiary | Audit history | Section nav link, separate panel view |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| New record | All fields empty; only title required to save | "New Record" heading; save as Draft |
| Draft auto-save | Saves every 30s of inactivity | "Auto-saved at [time]" indicator; no audit event |
| Published record edits | Normal edit; audit event generated on save | Save confirmation + "Changes will appear on the published record." |
| Concurrent edit conflict | 409 warning prompt | "Another curator edited this record. Reload to see their changes before saving." |
| Publication gate fail | Gate check panel opens with specific missing fields | List of missing fields with jump links |
| Disclaimer mismatch | Non-blocking warning modal | Confirm or cancel |
| Attribution removal warning | Inline warning on contributing offices field | "Removing the original contributing office from a contributed record. Confirm?" |
| Validated for Reuse added | Confirmation step required | "Adding 'Validated for Reuse' to a published record is significant. Confirm?" |

#### Accessibility Notes

- Page `<h1>`: Record title (or "New Record" for creation)
- Section nav: `<nav aria-label="Record sections">` with `aria-current="page"` on active section; scrolls content to section on click
- Section headings in content: `<h2>` per section; no heading skips
- Publication gate field labels: publication gate fields carry a `(required to publish)` visible hint AND `aria-describedby` pointing to that hint text
- Maturity and review status side-by-side: `role="group"` with `aria-label` for each; independence note is in visible text associated with both controls via `aria-describedby`
- Review status checkboxes: `<fieldset>` + `<legend>` "Review Status"; Security Reviewed checkbox has additional visual indicator (lock icon) and `aria-label="Security Reviewed (distinct from technical review)"`
- "Validated for Reuse" add confirmation: modal dialog with focus trap
- Artifact list: each artifact is a visually grouped card; drag handle (≡) has `aria-label="Drag to reorder {artifact name}"` and keyboard alternative for reordering
- Restricted artifact toggle: `<input type="checkbox">` with `<label>` "Restrict URL (hide from public users)"
- Publication gate check panel: dialog or focus-trapped panel; missing fields listed as `<ul>` with `<li>` per field; each jump link moves focus to the field
- Audit history list: `<table>` or `<dl>` with clear timestamp, actor, event type, and change detail
- Bottom action bar: `<footer>` or `<aside>` with `aria-label="Publication actions"`; buttons use descriptive labels and are grouped; destructive actions trigger confirmation dialogs before executing

---
