---

### Screen 08: Record Management

**Route:** `/curator/records`
**Purpose:** Filterable list of all innovation records across all lifecycle states. Curators can browse, filter, and take governance actions (edit, publish, supersede, archive, retire). Includes records invisible to public.
**User Stories:** US-9.2
**Personas:** PER-05 (Jasmine Okafor)
**Access:** Curator or Admin role required (SEC-01)

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [CURATOR SIDEBAR — same as Dashboard]                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Innovation Records                       [+ New Record]         │
│  <h1>                                                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ FILTERS                                                     │ │
│  │ Publication State: [All ▾] [Draft] [Review] [Published]     │ │
│  │                   [Superseded] [Archived] [Retired]         │ │
│  │                                                             │ │
│  │ Maturity: [All ▾]   Review Status: [All ▾]                  │ │
│  │ Mission Area: [All ▾]   Office: [All ▾]                     │ │
│  │ □ Needs Review (next_review_date ≤ today+30)                │ │
│  │                                          [Clear filters]    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  74 records  (sorted by: Last Updated ▾)                         │
│                                                                  │
│  ┌───┬───────────────────────┬──────────────┬──────────────────┬──────────────┬─────────────────────────┬──────────────┬──────────────┬──────────────┐
│  │   │ Title                 │ Maturity     │ Review Status    │ Pub State    │ Engagement Indicator    │ Last Reviewed│ Updated      │ Actions      │
│  ├───┼───────────────────────┼──────────────┼──────────────────┼──────────────┼─────────────────────────┼──────────────┼──────────────┼──────────────┤
│  │ ☐ │ Audio Security POC    │ Exp/POC      │ Tech + Sec Rev   │ ■ Published  │ Available for Demo      │ Jun 2026     │ Aug 11, 2026 │ [Edit] [⋮]   │
│  ├───┼───────────────────────┼──────────────┼──────────────────┼──────────────┼─────────────────────────┼──────────────┼──────────────┼──────────────┤
│  │ ☐ │ Cloud Infra Pilot     │ Prototype    │ Tech Reviewed    │ ■ Published  │ Seeking Adoption Partner│ May 2026     │ Aug 11, 2026 │ [Edit] [⋮]   │
│  ├───┼───────────────────────┼──────────────┼──────────────────┼──────────────┼─────────────────────────┼──────────────┼──────────────┼──────────────┤
│  │ ☐ │ Case Routing Idea     │ Idea         │ Submitted        │ ▪ Draft      │ —                       │ Aug 2026     │ Aug 10, 2026 │ [Edit] [⋮]   │
│  ├───┼───────────────────────┼──────────────┼──────────────────┼──────────────┼─────────────────────────┼──────────────┼──────────────┼──────────────┤
│  │ ☐ │ Old Audio Processing  │ Archived     │ Superseded       │ ▒ Superseded │ Archived                │ Mar 2025     │ Jul 2026     │ [Edit] [⋮]   │
│  └───┴───────────────────────┴──────────────┴──────────────────┴──────────────┴─────────────────────────┴──────────────┴──────────────┴──────────────┘
│                                                                  │
│  Rows per page: [25 ▾]  Showing 1–25 of 74   [← 1  2  3 →]     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Row Action Menu (⋮ dropdown)

```
┌─────────────────────────────────┐
│ Edit                            │
│ View public (published only)    │
│ ─────────────────────────────── │
│ Submit for Review               │
│ Publish                         │
│ Unpublish → Draft               │
│ ─────────────────────────────── │
│ Supersede…                      │
│ Archive                         │
│ Retire…                         │
└─────────────────────────────────┘
```

Destructive actions (Supersede, Archive, Retire) require a confirmation dialog before executing.

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Publication state column (visual indicator per state) | Table, prominent column |
| Primary | Maturity column | Table |
| Primary | Actions per row | Table, right column |
| Secondary | Review status, engagement indicator | Table columns |
| Secondary | Filter controls | Above table |
| Tertiary | Last reviewed, updated dates | Table columns |
| Tertiary | Pagination | Below table |

#### Publication State Visual Indicators (in table)

| State | Visual | Color |
|-------|--------|-------|
| Draft | ▪ Draft | Gray |
| Submitted for Review | ◷ Review | Blue |
| Published | ■ Published | Green |
| Superseded | ▒ Superseded | Amber/Orange |
| Archived | ○ Archived | Muted gray |
| Retired | ✕ Retired | Red/dark gray |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All records, sorted by last updated | — |
| Filtered | Filtered results, chips showing active filters | "{n} records" count updates |
| Empty (filtered) | Empty state in table body | "No records match your filters." |
| Loading | Skeleton table rows | "Loading records…" |
| Lifecycle action in progress | Row shows spinner, actions disabled | "Updating…" |
| Lifecycle action success | Row updates inline; state column changes | Toast: "Record published." |
| Lifecycle action error | Error toast | "Could not publish record. Please try again." |

#### Accessibility Notes

- `<table>` with proper `<thead>`, `<th scope="col">` for each column header
- Sortable column headers: `aria-sort="descending"` (or `ascending`/`none`) on the active sort column; clicking re-sorts
- Row checkboxes: `aria-label="Select {record title}"`
- Action buttons in row: `[Edit]` button `aria-label="Edit {record title}"`; ⋮ menu button `aria-label="Actions for {record title}"`
- ⋮ dropdown menu: `role="menu"` with `role="menuitem"` for each action; keyboard-accessible (arrow keys to navigate, Enter to select, Escape to close)
- Confirmation dialogs (Supersede, Archive, Retire): modal dialog pattern — same as Engagement Request modal (focus trap, Escape to cancel, `aria-modal="true"`)
- Filter selects: `<label>` associated with each `<select>`
- "Needs Review" checkbox filter: `<label>` + `<input type="checkbox">` with clear label text
- Result count: `aria-live="polite"` so screen readers announce count changes after filtering

---
