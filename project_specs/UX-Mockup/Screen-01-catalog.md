---

### Screen 01: Catalog / Browse

**Route:** `/catalog`
**Purpose:** Browsable grid of all published innovation records. Cards communicate trust, maturity, review status, and actionability at a glance — without implying equal weight across records (F1.6).
**User Stories:** US-1.1, US-1.2, US-1.3
**Personas:** PER-01 (Margaret), PER-02 (David)

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV — same as Home]                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Innovation Catalog                    [Search bar — inline]     │
│  Curated innovation records from I&R.  [🔍 Search records...  ] │
│                                                                  │
├────────────────────┬─────────────────────────────────────────────┤
│                    │                                             │
│ [FILTER PANEL]     │  [RESULTS AREA]                             │
│ (left sidebar,     │                                             │
│  ~280px)           │  [Active filter chips]                      │
│                    │  × Azure Government  × Technically Reviewed │
│  Mission Area      │                                             │
│  □ Courts (4)      │  14 records                    [Sort ▾]     │
│  □ AO Ops (2)      │                                             │
│  □ Security (6)    │  ┌──────────────────┐  ┌──────────────────┐ │
│                    │  │ ■ EXPERIMENT/POC │  │ □ IDEA           │ │
│  Technology        │  │ [amber badge]    │  │ [gray badge]     │ │
│  □ Azure Gov (3)   │  │                  │  │                  │ │
│  □ Audio (2)       │  │ Audio Security   │  │ Case Routing     │ │
│  □ AI/ML (1)       │  │ POC              │  │ Automation Idea  │ │
│  □ Cloud (3)       │  │                  │  │                  │ │
│                    │  │ Defense-in-depth │  │ Exploration of   │ │
│  Maturity          │  │ audio isolation  │  │ automating case  │ │
│  □ Idea (1)        │  │ approach for     │  │ document routing │ │
│  □ Experiment/POC  │  │ court proceedings│  │ across legacy    │ │
│    (6)             │  │                  │  │ systems...       │ │
│  □ Prototype (3)   │  │ [Technically     │  │                  │ │
│  □ Production (2)  │  │  Reviewed]       │  │ [Submitted]      │ │
│  □ Archived (2)    │  │ [Security        │  │                  │ │
│                    │  │  Reviewed]       │  │ I&R Operations   │ │
│  Review Status     │  │                  │  │ Jun 2026         │ │
│  □ Technically     │  │ I&R Team         │  │                  │ │
│    Reviewed (7)    │  │ Jun 2026         │  └──────────────────┘ │
│  □ Security        │  │                  │                       │
│    Reviewed (4)    │  │ [Available for   │  ┌──────────────────┐ │
│  □ Policy          │  │  Demonstration]  │  │ ■■ SUPERSEDED    │ │
│    Reviewed (2)    │  │                  │  │ [gray + banner]  │ │
│                    │  └──────────────────┘  │                  │ │
│  Engagement        │                        │ Old Audio Proc.  │ │
│  □ Demo Available  │  ┌──────────────────┐  │ Record           │ │
│  □ Seeking Partner │  │ ■■ PROTOTYPE/    │  │ [SUPERSEDED]     │ │
│                    │  │    PILOT [teal]  │  │ Replaced by...   │ │
│  Reuse Potential   │  │                  │  │ I&R Team         │ │
│  □ High            │  │ Cloud Infra      │  │ Mar 2025         │ │
│  □ Moderate        │  │ Modernization    │  └──────────────────┘ │
│  □ Low             │  │ Pilot            │                       │
│                    │  │                  │  [Pagination]         │
│  Artifacts         │  │ Modernizing      │  ← 1  2  3 →         │
│  □ Has artifacts   │  │ cloud-native     │                       │
│                    │  │ infrastructure   │                       │
│  [Clear all]       │  │ for district     │                       │
│                    │  │ court operations │                       │
│                    │  │                  │                       │
│                    │  │ [Technically     │                       │
│                    │  │  Reviewed]       │                       │
│                    │  │ District A Court │                       │
│                    │  │ May 2026         │                       │
│                    │  │                  │                       │
│                    │  │ [Seeking         │                       │
│                    │  │  Adoption        │                       │
│                    │  │  Partner]        │                       │
│                    │  └──────────────────┘                       │
│                    │                                             │
└────────────────────┴─────────────────────────────────────────────┘
```

#### Catalog Card Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  ■ [MATURITY BADGE — color coded]   [STATE BADGE if non-published] │
│                                                                  │
│  Record Title (linked, opens record detail)                      │
│                                                                  │
│  Summary text — one to three sentences describing the problem    │
│  or outcome. Truncated at 280 characters with "…" if longer.    │
│                                                                  │
│  [Review Status Badge 1]  [Review Status Badge 2]  ...          │
│  (purple/indigo shape — distinct from maturity badge)            │
│                                                                  │
│  [Engagement Indicator Badge — if configured]                    │
│  e.g., "Available for Demonstration"  "Seeking Adoption Partner" │
│                                                                  │
│  [Technology tag 1]  [Technology tag 2]                          │
│                                                                  │
│  Contributing Office Name          Last reviewed: June 2026      │
└─────────────────────────────────────────────────────────────────┘
```

**Visual differentiation rules (F1.6, SEC-11):**
- Maturity badge: solid vs. outlined treatment by stage; amber for POC, green for Production, gray for Archived
- Review status badge: different shape (pill with left bar or distinct border), indigo/purple color family
- Security Reviewed badge: includes lock icon (SEC-11 distinction from Technically Reviewed)
- Superseded/Archived records: muted card background; bold "SUPERSEDED" or "ARCHIVED" banner across top; not styled as Published
- Engagement indicator badge: action-oriented color (blue for available, teal for seeking partner)

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Record title | Card top, linked |
| Primary | Maturity badge | Card top-left |
| Primary | Summary | Card body |
| Secondary | Review status badges | Below summary |
| Secondary | Engagement indicator | Below review status |
| Secondary | Technology tags | Above footer |
| Tertiary | Contributing office | Card footer left |
| Tertiary | Last reviewed date | Card footer right |
| Conditional | Lifecycle state badge | Top-right, only when Superseded/Archived |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Grid of cards, filter panel open | — |
| Loading | Skeleton cards (gray placeholder shapes) | "Loading records…" (aria-live) |
| Empty (no records) | Centered empty state illustration + text | "No innovation records are currently available. Check back soon." |
| Empty (filtered) | Same empty state with filter context | "No records matched your filters. Try removing some filters." |
| Error (fetch failed) | Error state with retry | "We couldn't load the catalog. Please try again." [Retry link] |
| Filter active | Chips show above results; facet count updates | "14 records" count updates live |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Filter checkboxes | Multi-select | Applies filter; updates results and facet counts; no page reload |
| Active filter chips | Removable tag | × removes individual filter |
| "Clear all" | Link button | Removes all active filters |
| Record card | Clickable card | Navigates to `/records/:slug` |
| Sort dropdown | Select | Changes result order (Relevance, Most Recent, Title A–Z) |
| Pagination | Previous/Next + page numbers | Loads next/previous page |
| Search bar | Text input | Submit navigates to `/search?q=...&{existing filters}` |

#### Accessibility Notes

- Filter panel: `<nav aria-label="Filter records">` or `<aside>` with heading "Filter by"
- Filter groups: `<fieldset>` + `<legend>` per dimension (Mission Area, Technology, etc.)
- Filter checkboxes: native `<input type="checkbox">` with associated `<label>`
- Facet counts: part of label text; e.g., `<label>Azure Government Cloud (3)</label>` — not in a separate `aria-hidden` span
- Record cards: each card is `<article>`; card title is `<h2>` (catalog `<h1>` is page heading); card link wraps the title, not the full card (avoid duplicated accessible names)
- Maturity badge: `aria-label="Maturity: Experiment / POC"` on the badge element
- Review status badges: `aria-label="Review status: Technically Reviewed"` etc.
- Engagement indicator badge: included in the card link's accessible description via `aria-describedby`
- Active filter chips: each chip's × button has `aria-label="Remove filter: Azure Government Cloud"`
- Result count: `aria-live="polite"` region so screen readers announce count updates
- Loading state: `aria-busy="true"` on results container during fetch

---
