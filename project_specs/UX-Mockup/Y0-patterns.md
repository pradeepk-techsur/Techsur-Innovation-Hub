---

## Interaction Patterns

---

### Pattern A: Trust Badge System

**When to use:** Everywhere an innovation record is displayed (catalog cards, search results, record header, curator record list)
**Behavior:** Two independent badge families — maturity (amber/green/gray scale) and review status (indigo/purple) — render side by side but never interchange visually. Security Reviewed always carries a lock icon (SEC-11).

**Badge Rendering Rules:**
- Maturity badge: always exactly one; uses outlined treatment for early stages (Idea, Evaluated Idea), solid fill for advanced (Experiment/POC → Production); muted/strikethrough for Archived/Retired
- Review status badges: zero or more; each applicable value renders as a separate pill badge; all rendered in indigo/purple color family
- Security Reviewed badge: lock icon + label; distinct from "Technically Reviewed" (no lock icon)
- No badge is ever omitted from a result card, record header, or catalog card — trust information is always present (F2.4)

**Examples:** Catalog card, Search result card, Record header (both perspectives), Curator record list

---

### Pattern B: Active Filter Chips

**When to use:** Catalog browse and Search results screens after any filter is applied
**Behavior:** Each active filter renders as a removable chip above the results count. Chips persist across query changes. Removing a chip via × updates results without clearing other filters or the search query.

```
Active filters:
[× Azure Government Cloud]  [× Technically Reviewed]  [Clear all]
```

**Rules:**
- Chips update immediately on filter selection (no "Apply" button required)
- "Clear all" button appears as soon as any filter is active
- Filter chips use clear, human-readable labels (controlled vocabulary display labels, not internal keys)
- Screen readers announce chip removal and updated count via `aria-live`

---

### Pattern C: Perspective Toggle (Innovation Record)

**When to use:** Innovation Record detail page
**Behavior:** Segmented button / tab-style control that switches between Executive and Technical perspectives. URL updates with `?view=executive` or `?view=technical` to support sharing. No page navigation — same URL, same record data.

```
[ ● Executive View ]  [ ○ Technical View ]
```

**Rules:**
- Both options always visible; currently active option visually selected
- Trust fields (maturity, review status, disclaimer, last-reviewed date) render in both perspectives — never suppressed (F4.4)
- Toggle is keyboard-accessible: Tab to reach the control, arrow keys to switch between options, Enter/Space to select
- URL parameter change does not cause scroll reset

---

### Pattern D: Multi-Step Form with Progress Indicator

**When to use:** Opportunity Submission (4 steps), as a model for any future multi-step form
**Behavior:** Sequential steps with a visible progress indicator. Navigation between steps is possible via Back button. Validation occurs on Next click (not continuously). Fields persist across step navigation.

```
● ─── ● ─── ○ ─── ○
1     2     3     4
```

**Rules:**
- Progress indicator clearly communicates current step and total steps
- "Back" is always available on steps 2+; "Next" activates only when current step required fields are complete
- On final step, full summary of entered data is presented for review
- Non-acceptance / non-endorsement notices appear on Step 1 and are restated in the review step (Step 4) and on the confirmation page
- Abandoned mid-form: no persistent draft state for MVP (public forms); data is not recovered after tab close

---

### Pattern E: Publication Gate Check Panel

**When to use:** Record Editor, when curator clicks "Validate for Publication" or "Publish"
**Behavior:** A panel (modal or inline expansion) shows all 15 publication gate fields with ✓ (satisfied) or ✗ (missing) status. Missing fields include jump links to navigate directly to the relevant editor section.

**Rules:**
- Hard block: if any ✗ fields remain, "Publish" button remains disabled
- Non-blocking warning (not ✗): maturity/disclaimer mismatch shows a separate confirmation dialog before proceeding
- The panel does not close automatically — curator must explicitly close or resolve all issues
- Jump links move editor focus to the first empty field in the relevant section

---

### Pattern F: Contextual Inline Help (Content Model Reference)

**When to use:** Record Editor — adjacent to Maturity, Review Status, and other governance fields
**Behavior:** "?" icon or "[What does this mean?]" link appears next to controlled vocabulary fields. Opens a side panel or navigates to the Content Model Reference page. Available to Curators only.

**Rules:**
- Inline help does not close the editor or lose unsaved changes (prefer side panel over navigation)
- Content is the same for all curators — not editable in MVP
- Link text uses clear, non-jargon language: "What do these stages mean?" not just "?"

---

### Pattern G: Confirmation Dialogs for Destructive Actions

**When to use:** Lifecycle transitions (Archive, Retire, Supersede) from Record Management list or Record Editor
**Behavior:** Before executing an irreversible or significant state change, a modal confirmation dialog prompts the curator to confirm. Supersede and Retire require a text reason before proceeding.

```
┌──────────────────────────────────────────┐
│ Archive this record?                     │
│                                          │
│ The record will remain discoverable with │
│ an "Archived" indicator but will no      │
│ longer be recommended as current.        │
│                                          │
│ [Cancel]       [Confirm Archive]         │
└──────────────────────────────────────────┘
```

**Rules:**
- "Cancel" always returns to the previous state with no change; is the visually default/safe option
- Destructive confirm button is not the default focused button (to prevent accidental Enter-key confirmation)
- Reason field required for Supersede and Retire; Archive is confirmed without a required reason
- Focus trapped in dialog; Escape closes without action

---

### Pattern H: Engagement Request Pre-Population

**When to use:** Any CTA button on an Innovation Record triggers an Engagement Request
**Behavior:** The originating record's ID and title are automatically populated as read-only fields in the engagement request form. The request type is pre-selected based on which CTA was clicked.

**Rules:**
- Pre-populated fields are clearly labeled "Pre-filled from record: [Record Title]" or shown in a read-only section
- User cannot edit the originating record context (they can edit the request type if desired)
- If "Contact I&R" general CTA (not from a record), originating record fields are empty
- The routing destination display name is "TSIO Innovation & Research" — not the raw email address (F8.5)

---

### Pattern I: Empty States

**When to use:** Any content area that may render with no items — catalog, search results, curator queues

**Rules by context:**
- Catalog (no published records): "No innovation records are currently available. Check back soon." — no error styling
- Search (no results): "No records matched your search. Try different keywords or remove some filters." — with actionable suggestions
- Search (service unavailable): "Search is temporarily unavailable. You can browse the catalog instead." — with catalog link
- Curator queue (empty): "No pending [submissions / contributions / engagement requests]." — positive framing; no error
- All empty states must have a visible, descriptive heading and at least one next-action link

---

### Pattern J: Auto-Save (Draft Records)

**When to use:** Record Editor when publication_state = draft
**Behavior:** Draft records auto-save after 30 seconds of inactivity. No audit event is generated by auto-save. A visible "Auto-saved at [time]" timestamp updates in the editor header.

**Rules:**
- Auto-save is not a substitute for manual "Save" — "Save" is always available and generates a response indicator
- Auto-save failure (network issue): visible non-intrusive warning: "Auto-save failed. Click Save to try again."
- Published or Superseded record editing: auto-save is disabled (manual save only; each save generates an audit event)
- Concurrent edit conflict (409): detected on manual save, not auto-save; prompt curator to reload before losing changes

---
