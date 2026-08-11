---

### Screen 02: Search Results

**Route:** `/search?q={query}&{filters}`
**Purpose:** Problem-oriented search results with faceted filtering; preserves trust signals; shows result count and allows iterative refinement without losing context.
**User Stories:** US-2.1, US-2.2, US-2.3
**Personas:** PER-01 (Margaret), PER-02 (David), PER-03 (Priya)

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────┬──────────┐        │
│  │ 🔍  court audio security                 │ Search   │        │
│  └──────────────────────────────────────────┴──────────┘        │
│                                                                  │
├────────────────────┬─────────────────────────────────────────────┤
│                    │                                             │
│ [FILTER PANEL]     │  [RESULTS AREA]                             │
│ (same as Catalog)  │                                             │
│                    │  Active filters:                            │
│  Mission Area      │  × Technically Reviewed    [Clear all]      │
│  □ Courts (4)      │                                             │
│  □ AO Ops (2)      │  14 results for "court audio security"      │
│                    │  ─────────────────────────────────────────  │
│  Technology        │                                             │
│  □ Azure Gov (3)   │  ┌─────────────────────────────────────┐   │
│  ☑ Audio (2)       │  │ ■ EXPERIMENT/POC [amber]             │   │
│  □ AI/ML (1)       │  │                                      │   │
│                    │  │ Audio Security POC                   │   │
│  Maturity          │  │                                      │   │
│  □ Idea (1)        │  │ Courtroom audio proceedings are      │   │
│  ☑ Experiment/POC  │  │ vulnerable to unauthorized access    │   │
│    (6)             │  │ and isolation failures during remote  │   │
│  □ Prototype (3)   │  │ hearings. This POC explored...       │   │
│                    │  │                                      │   │
│  Review Status     │  │ [Technically Reviewed] [Security     │   │
│  ☑ Technically     │  │  Reviewed]                           │   │
│    Reviewed (7)    │  │                                      │   │
│                    │  │ [Available for Demonstration]         │   │
│  Contributing      │  │                                      │   │
│  Office            │  │ Azure Government Cloud  Audio        │   │
│  □ I&R Team (4)    │  │                                      │   │
│  □ Court X (2)     │  │ I&R Team           Last reviewed:    │   │
│                    │  │                    June 2026         │   │
│  Reuse Potential   │  └─────────────────────────────────────┘   │
│  □ High            │                                             │
│  □ Moderate        │  ┌─────────────────────────────────────┐   │
│                    │  │ □ IDEA [gray, outlined]              │   │
│  Artifacts         │  │                                      │   │
│  □ Has artifacts   │  │ Audio Routing Optimization Idea      │   │
│                    │  │                                      │   │
│  Lifecycle State   │  │ Concept for optimizing audio routing │   │
│  ☑ Published       │  │ in large courtrooms during high-     │   │
│  □ Superseded      │  │ traffic periods. Not yet evaluated.  │   │
│  □ Archived        │  │                                      │   │
│                    │  │ [Submitted]                          │   │
│  [Clear all]       │  │                                      │   │
│                    │  │ I&R Team           Last reviewed:    │   │
│                    │  │                    Feb 2026          │   │
│                    │  └─────────────────────────────────────┘   │
│                    │                                             │
│                    │  [Pagination: ← 1  2  3 →]                 │
│                    │                                             │
└────────────────────┴─────────────────────────────────────────────┘
```

#### Search Behavior Details

- Query persists in the search bar across filter changes
- Active filters appear as removable chips above the result count
- Result count updates without clearing the search query or other active filters (US-2.3)
- Facet counts show per option before selecting; update after filter selection
- Sort options: Relevance (default), Most Recently Reviewed, Title A–Z

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Search query (persisted in bar) | Above fold, search bar |
| Primary | Result count with query context | Above results, bold |
| Primary | Result cards with trust badges | Results area |
| Secondary | Active filter chips (removable) | Above result count |
| Secondary | Filter panel | Left sidebar |
| Tertiary | Pagination | Below results |
| Tertiary | Sort control | Above results, right |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (results found) | Result cards with trust badges | "14 results for 'court audio security'" |
| Loading | Skeleton result cards | "Searching…" (aria-live) |
| No results | Empty state with suggestions | "No records matched your search. Try different keywords or remove some filters." |
| Empty query + no filters | Redirects to or shows full catalog | Full catalog result set |
| Search service unavailable | Error state | "Search is temporarily unavailable. You can browse the catalog instead." [Browse catalog link] |
| Query < 2 chars on submit | Inline validation | "Please enter at least 2 characters to search." |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Search bar | Text input | Re-submit updates results; Enter or button click |
| Filter checkboxes | Multi-select | Updates results; active filters shown as chips |
| Active filter chips (×) | Removable tag | Removes filter; updates results; keeps query |
| "Clear all" | Link button | Clears all filters; keeps query |
| Result card | Clickable card | Navigates to `/records/:slug` |
| Lifecycle State filter | Multi-select (Published default) | Anonymous: Published only; Curators: all states |
| Sort dropdown | Select | Re-ranks results |
| Pagination | Links | Loads page |

#### Accessibility Notes

- Search form: `role="search"` landmark; input `aria-label="Search innovation records"` 
- Result count region: `aria-live="polite"` — announces count changes to screen readers
- Active filter chips: `role="list"` with `role="listitem"` per chip; × button `aria-label="Remove filter: {filter name}"`
- Result cards: same pattern as Catalog screen — `<article>`, `<h2>` title, trust badges with `aria-label`
- No-results state: visible in main content area; not hidden from assistive technology
- "Search is temporarily unavailable" error: includes a visible, keyboard-accessible "Browse catalog" link

---
