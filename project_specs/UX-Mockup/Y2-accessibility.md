---

## Accessibility Notes

**Conformance Target:** WCAG 2.1 Level AA (or Judiciary-approved baseline, whichever is more restrictive)
**Reference:** PRD §9 Non-Functional Requirements; PRD §3 Design Principles ("Accessible by Default")

---

### Color Contrast

All text and interactive elements must meet WCAG 2.1 AA contrast ratios:
- Normal text: minimum 4.5:1 contrast ratio against background
- Large text (≥18pt or ≥14pt bold): minimum 3:1 contrast ratio
- UI components and graphical objects (buttons, form borders, focus rings): minimum 3:1 against adjacent colors

**Badge-specific requirements:**
- Maturity badges (amber, green, gray): verify badge text color achieves 4.5:1 against the badge fill color — do not rely on color alone to communicate maturity; label text must always be present (e.g., "Experiment / POC", not just a color dot)
- Review status badges (indigo/purple): same contrast verification required
- Security Reviewed badge (lock icon + text): icon must meet 3:1; text must meet 4.5:1 — the visual distinction from "Technically Reviewed" must not rely solely on the icon (label text also distinguishes)
- Superseded/Archived card treatment (muted background): ensure summary text still meets 4.5:1 against the muted background

**Focus indicators:**
- All interactive elements must have a visible focus ring with at least 3:1 contrast against adjacent colors
- Never remove CSS outline without providing an equivalent custom focus indicator
- Focus ring must be visible in both light and dark mode if both are supported

---

### Keyboard Navigation

**Global requirements:**
- All interactive elements are reachable and operable via keyboard (Tab, Shift+Tab, Enter, Space, arrow keys)
- Tab order matches visual reading order; no keyboard traps outside intentional modal dialogs
- Skip-to-main content link at top of every page (visible on focus, may be visually hidden until focused)
- No keyboard shortcuts that conflict with browser or assistive technology defaults

**Screen-specific keyboard behaviors:**

| Screen | Keyboard Behavior |
|--------|------------------|
| Home — Search | Enter in search input submits; Tab to reach Browse Catalog link |
| Catalog / Search — Filters | Tab through filter checkboxes; Space to toggle; filters apply immediately |
| Catalog / Search — Results | Tab to each card; Enter on card navigates to record |
| Innovation Record — Perspective Toggle | Tab to toggle; arrow keys switch between Executive/Technical; Enter/Space selects |
| Innovation Record — CTAs | Tab to each CTA; Enter activates; opens modal with focus moved to modal |
| Engagement Request Modal | Focus trapped in modal; Tab cycles; Escape closes; focus returns to triggering CTA |
| Opportunity / Contribution Forms | Tab through fields; Shift+Tab backwards; Enter on Next/Submit buttons |
| Curator Record Editor — Section Nav | Tab to section links; Enter navigates to section (page scroll + focus to section heading) |
| Curator Record Management — Table | Tab to header sort controls; Tab to row checkboxes; Tab to action buttons; ⋮ menu: arrow keys to navigate items, Escape to close |
| Confirmation Dialogs | Focus trap; Tab cycles through dialog; Escape = Cancel; Enter on focused button = action |

---

### Screen Reader Considerations

**Page structure:**
- Every page has exactly one `<h1>` (page-level heading)
- Heading hierarchy does not skip levels (`<h1>` → `<h2>` → `<h3>`)
- Landmark regions: `<header>`, `<nav>`, `<main>`, `<footer>` on all public pages; `<aside>` for curator sidebar
- `<nav aria-label>` distinguishes multiple navigation landmarks on the same page (top nav vs. filter nav vs. curator sidebar)

**Dynamic content announcements:**
- Search/filter results count: `aria-live="polite"` region; announces updated count after filter or search change
- Auto-save status: `aria-live="polite"` region; announces "Auto-saved at [time]" updates
- Form validation errors: on submit, focus moves to an error summary at the top of the form (or the first errored field); each error is associated with its field via `aria-describedby`
- Modal open/close: focus management as described in keyboard section
- Toast notifications (record published, saved, etc.): rendered in an `aria-live="assertive"` or `aria-live="polite"` region depending on importance; do not rely solely on color to communicate success/error

**Badge elements:**
- Maturity badge: `<span role="status" aria-label="Maturity: [label]">` or equivalent; visual badge shape does not convey meaning that is not also in text
- Review status badges: each badge `<span aria-label="Review status: [label]">` — multiple badges are each individually labeled
- Engagement indicator badge: included in the record card's accessible description
- State indicator (Superseded, Archived): visible text label, not just a visual indicator

**Form fields:**
- All inputs associated with visible `<label>` elements (not `placeholder` as a substitute for label)
- Required fields: `aria-required="true"` AND visible asterisk with a legend explaining "* required"
- Character counters: `aria-live="polite"` region; announces remaining characters periodically (not on every keystroke)
- Select elements: native `<select>` with `<option>` groups where applicable
- Multi-select tag inputs (controlled vocabulary): if custom component, expose `role="listbox"` and `role="option"` with `aria-selected`

**Restricted artifacts:**
- Non-linked artifact name shown as plain text, not a disabled link — disabled links are confusing for screen readers; use `<span>` or `<p>` with explanation
- Access notes are always visible (not tooltip-only)

**Trust notices and disclaimers:**
- Applicable disclaimer on records: visible text, `role="note"` with `aria-label` — not dismissible; permanent presence announced once on page load

---

### ARIA Roles Reference

| Component | ARIA Role / Attribute |
|-----------|----------------------|
| Top navigation | `<nav aria-label="Main navigation">` |
| Filter sidebar | `<nav aria-label="Filter records">` or `<aside>` |
| Curator sidebar | `<nav aria-label="Curator navigation">` |
| Search bar | `role="search"` wrapper; input `aria-label="Search innovation records"` |
| Catalog card | `<article>` |
| Innovation Record page | `<main>` for content; `<h1>` for record title |
| Perspective toggle | `role="radiogroup" aria-label="Record perspective"` |
| Engagement modal | `role="dialog" aria-modal="true" aria-labelledby="modal-title"` |
| Confirmation dialog | Same as engagement modal |
| Active filter chips list | `role="list"` with `role="listitem"` per chip |
| Filter chip remove button | `aria-label="Remove filter: {filter name}"` |
| Result count | `aria-live="polite"` |
| Loading states | `aria-busy="true"` on loading container |
| Maturity badge | `aria-label="Maturity: {label}"` on badge span |
| Review status badge | `aria-label="Review status: {label}"` on badge span |
| Applicable disclaimer | `role="note" aria-label="Notice about this record"` |
| Superseded/Archived banner | `role="note"` |
| No-routing error | `role="alert"` (immediately announced) |
| Toast notification | `aria-live="assertive"` (errors) or `aria-live="polite"` (success/info) |
| Auto-save status | `aria-live="polite"` |
| Publication gate panel | `role="dialog"` or focus-trapped region |
| Audit history list | `<table>` or `<dl>` |
| Section navigation (editor) | `<nav aria-label="Record sections">` |
| Record editor section headings | `<h2>` per section |
| Artifact drag handle | `aria-label="Drag to reorder {name}"` + keyboard alternative |
| ⋮ action menu | `role="menu"` with `role="menuitem"` |

---

### Testing Requirements

Before any release:
1. **Automated scan** — run against all published screens using an approved automated accessibility tool (e.g., axe, Lighthouse); resolve all Critical and Serious issues
2. **Keyboard-only navigation test** — complete all primary user journeys (discover → read record → request engagement; submit opportunity; curator: create → publish record) using only a keyboard
3. **Screen reader test** — verify with at least one screen reader (e.g., NVDA + Firefox, JAWS + Chrome, or VoiceOver + Safari) for primary journeys
4. **Color contrast verification** — verify all badge color combinations and focus ring colors meet 3:1 or 4.5:1 thresholds as applicable
5. **Touch target verification** — on mobile viewport, verify all interactive elements meet 44×44px minimum

**Release gate:** Unresolved Critical-level accessibility issues block release (PRD §9).

---
