---

### Screen 07: Curator Dashboard

**Route:** `/curator`
**Purpose:** Live operational summary for authenticated curators — triage view of records needing attention, pending submissions, engagement activity, and recent audit events. No stale data — all counts reflect live state at page load.
**User Stories:** US-9.1
**Personas:** PER-05 (Jasmine Okafor)
**Access:** Curator or Admin role required (SEC-01, SEC-02)

#### Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [CURATOR NAV — sidebar, persistent]                              │
│                                                                  │
│  ┌──────────────┐  ┌───────────────────────────────────────────┐ │
│  │ [Logo]       │  │ [HEADER]                                  │ │
│  │              │  │ Curator Dashboard           Jasmine O. ▾  │ │
│  │ Dashboard ●  │  └───────────────────────────────────────────┘ │
│  │ Records      │                                               │ │
│  │ Submissions  │  Welcome back, Jasmine.                       │ │
│  │  ↳ Opptys   │  Here's what needs attention today.           │ │
│  │  ↳ Contribs │                                               │ │
│  │ Engagement   │  ┌────────────────────────────────────────┐  │ │
│  │ Settings     │  │ RECORDS OVERVIEW                       │  │ │
│  │ Reference    │  │ ─────────────────────────────────────  │  │ │
│  │              │  │ Draft              12    [View →]       │  │ │
│  │ [Log out]    │  │ Submitted for Review  3  [View →]       │  │ │
│  └──────────────┘  │ Published          47    [View →]       │  │ │
│                    │ Superseded          4    [View →]       │  │ │
│                    │ Archived            6    [View →]       │  │ │
│                    │ Retired             2    [View →]       │  │ │
│                    └────────────────────────────────────────┘  │ │
│                                                                  │ │
│                    ┌──────────────────┐  ┌────────────────────┐  │ │
│                    │ ⚠ NEEDS REVIEW   │  │ 📬 SUBMISSIONS     │  │ │
│                    │                  │  │                    │  │ │
│                    │ 1 record has a   │  │ Opportunities: 2   │  │ │
│                    │ next_review_date │  │ pending            │  │ │
│                    │ within 30 days   │  │ [Review Queue →]   │  │ │
│                    │                  │  │                    │  │ │
│                    │ [View records →] │  │ Contributions: 1   │  │ │
│                    │                  │  │ pending            │  │ │
│                    │                  │  │ [Review Queue →]   │  │ │
│                    └──────────────────┘  └────────────────────┘  │ │
│                                                                  │ │
│                    ┌──────────────────────────────────────────┐  │ │
│                    │ 📞 ENGAGEMENT ACTIVITY (last 7 days)     │  │ │
│                    │ ──────────────────────────────────────── │  │ │
│                    │ 3 engagement requests received           │  │ │
│                    │ 1 without recorded follow-up ⚠           │  │ │
│                    │ [View all engagement →]                  │  │ │
│                    └──────────────────────────────────────────┘  │ │
│                                                                  │ │
│                    ┌──────────────────────────────────────────┐  │ │
│                    │ 📋 RECENT AUDIT EVENTS (last 5)          │  │ │
│                    │ ──────────────────────────────────────── │  │ │
│                    │ Aug 11  Jasmine O.  record_updated       │  │ │
│                    │         Audio Security POC               │  │ │
│                    │                                          │  │ │
│                    │ Aug 11  Jasmine O.  publication_state    │  │ │
│                    │         changed → published              │  │ │
│                    │         Cloud Infra Pilot                │  │ │
│                    │                                          │  │ │
│                    │ Aug 10  Marcus T.   maturity_changed     │  │ │
│                    │         Idea → Experiment/POC            │  │ │
│                    │         Case Routing Concept             │  │ │
│                    │                                          │  │ │
│                    │ Aug 10  Jasmine O.  attribution_updated  │  │ │
│                    │         Audio Security POC               │  │ │
│                    │                                          │  │ │
│                    │ Aug 09  System      record_created       │  │ │
│                    │         Draft — Cloud Infra Pilot        │  │ │
│                    │                                          │  │ │
│                    │ [View full audit log →]                  │  │ │
│                    └──────────────────────────────────────────┘  │ │
│                                                                  │ │
└──────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Needs Review alert (overdue records) | Prominent card, top-left of content |
| Primary | Pending submissions count | Top-right summary card |
| Primary | Engagement without follow-up | Engagement card, flagged count |
| Secondary | Records by lifecycle state (counts + links) | Records Overview table |
| Secondary | Recent engagement count (7 days) | Engagement card |
| Tertiary | Last 5 audit events | Bottom of dashboard |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All counts loaded from live data | — |
| Loading | Skeleton placeholder cards | "Loading dashboard…" |
| No pending items | Cards show "0" counts without error | Normal operational state |
| Data load error | Error state in each card | "Could not load [section]. Refresh to try again." |
| Unauthenticated access | Redirect to login | Login page with return URL |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "View →" links in Records Overview | Navigation | Navigate to `/curator/records?state={state}` |
| "View records →" (Needs Review) | Navigation | Navigate to `/curator/records?needs_review=true` |
| "Review Queue →" (Opportunities) | Navigation | Navigate to `/curator/submissions/opportunities` |
| "Review Queue →" (Contributions) | Navigation | Navigate to `/curator/submissions/contributions` |
| "View all engagement →" | Navigation | Navigate to `/curator/engagement` |
| Audit event record links | Navigation | Navigate to `/curator/records/:id/edit` |
| "View full audit log →" | Navigation | Navigate to full audit log view |
| Sidebar nav items | Navigation | Navigate to respective curator screens |

#### Accessibility Notes

- Sidebar: `<nav aria-label="Curator navigation">` with current page indicated via `aria-current="page"` on Dashboard item
- Dashboard content region: `<main>`
- Each summary card: `<section>` with visible `<h2>` heading
- Count numbers: placed in a `<strong>` or with `aria-label` context — e.g., `<span aria-label="2 opportunity submissions pending">2</span>`
- Warning indicator (⚠ 1 record needs review, 1 engagement without follow-up): `<span role="img" aria-label="Warning">⚠</span>` — not just the Unicode character alone
- Audit event list: `<table>` or `<ul>` with date, actor, event, record — each row/item labeled
- Live counts note: because counts are live at page load (not auto-refreshing), no `aria-live` region needed; a visible "Refreshed at [time]" or manual refresh button would help curator confidence
- Protected route: if unauthenticated, redirect to login — do not render a blank or broken page

---
