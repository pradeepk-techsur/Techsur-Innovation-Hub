## Screen Designs

---

### Screen 00: Home / Landing

**Route:** `/`
**Purpose:** Hub entry point — establishes purpose, provides hero search, surfaces featured/recent records, and offers clear paths to browse, submit, and share.
**User Stories:** US-1.1, US-2.1, US-6.1, US-7.1
**Personas:** All (primary: PER-01, PER-02)

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV]                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [TechSur Innovation Hub logo/wordmark]    [Catalog] [Submit a Problem] [Share Your Work] [Contact I&R] │
│  └──────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [HERO SECTION]                                                   │
│                                                                  │
│   Discover what I&R has explored.                                │
│   Find relevant innovation work using the language               │
│   of your mission problem.                                       │
│                                                                  │
│   ┌──────────────────────────────────────────┬──────────┐       │
│   │ 🔍  Search by problem, technology, or keyword...    │ Search │
│   └──────────────────────────────────────────┴──────────┘       │
│                                                                  │
│   Example searches: "court audio security"  "Azure Gov cloud"   │
│                     "GPU separation"  "remote hearing"           │
│                                                                  │
│   [ Browse the Catalog → ]                                       │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [FEATURED RECORDS — horizontally scrollable card strip]          │
│   ┌────────────────────┐  ┌────────────────────┐  ┌──────────┐  │
│   │ [MATURITY BADGE]   │  │ [MATURITY BADGE]   │  │  ...     │  │
│   │ Record Title       │  │ Record Title       │  │          │  │
│   │ Summary text...    │  │ Summary text...    │  │          │  │
│   │ [Review Status]    │  │ [Review Status]    │  │          │  │
│   │ Office • Jun 2026  │  │ Office • Jun 2026  │  │          │  │
│   └────────────────────┘  └────────────────────┘  └──────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [ACTION PATHS — 3-column card row]                               │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │ 📋 Submit a      │  │ 🔬 Share Your    │  │ 📞 Contact I&R │ │
│  │ Problem          │  │ Innovation Work  │  │                │ │
│  │                  │  │                  │  │                │ │
│  │ Bring a mission  │  │ Existing work?   │  │ General        │ │
│  │ problem or       │  │ Contribute to    │  │ questions,     │ │
│  │ workflow friction│  │ the Hub catalog. │  │ discussions,   │ │
│  │ to I&R.          │  │                  │  │ or briefings.  │ │
│  │                  │  │                  │  │                │ │
│  │ [Submit →]       │  │ [Contribute →]   │  │ [Reach out →]  │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                         │
│  TSIO Innovation & Research  |  Administrative Office of US Courts │
│  Accessibility  |  Privacy                                       │
└──────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Hero search bar | Above fold, center |
| Primary | Value proposition text | Above fold, above search |
| Secondary | Example search terms | Below search bar |
| Secondary | Browse Catalog CTA | Below search bar |
| Secondary | Featured records strip | Below hero |
| Tertiary | Action paths (submit, contribute, contact) | Below featured records |
| Tertiary | Footer links | Bottom |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Hero + featured cards loaded | — |
| No published records | Featured strip shows "No records yet" placeholder | Empty state, not error |
| Search input focus | Search bar expands focus ring; example queries highlighted | Keyboard focus visible |
| Search typed (≥2 chars) | Search button activates; pressing Enter or clicking Search navigates to `/search?q=...` | — |
| Search < 2 chars on submit | Inline validation below field | "Please enter at least 2 characters to search." |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Search bar | Text input + submit button | Submit navigates to `/search?q={query}` |
| Browse the Catalog → | Link | Navigates to `/catalog` |
| Featured record cards | Clickable card | Navigates to `/records/:slug` |
| Submit a Problem | CTA card | Navigates to `/submit/opportunity` |
| Share Your Innovation Work | CTA card | Navigates to `/submit/contribution` |
| Contact I&R | CTA card | Opens Engagement Request form (no originating record) |
| Top Nav links | Navigation links | Navigate to respective routes |

#### Accessibility Notes

- Search bar: `role="search"` wrapping landmark; input has `aria-label="Search innovation records"`; submit button has `aria-label="Search"`
- Hero heading: `<h1>` — only one per page
- Featured cards: each card is a `<article>` with an inner `<a>` wrapping the full card; descriptive `aria-label` on the link includes record title
- Action path cards: `<section>` with visible heading; CTA buttons use descriptive text (not "Click here")
- Example search terms: `aria-label="Example search: [term]"` on each link
- Skip-to-main link at top of page for keyboard users

---
