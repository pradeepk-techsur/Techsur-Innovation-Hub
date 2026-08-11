# UX Mockup — TechSur Innovation Hub (TSIO Innovation Hub MVP)

**Project:** TechSur Innovation Hub (TSIO Innovation Hub MVP)
**Generated:** 2026-08-11
**Based on:** UserStories-TechSurHub.md, JOURNEYS-TechSurHub.md, PRD-TechSurHub.md, FRD-TechSurHub.md, PROJECT.md

---

## Overview

The TechSur Innovation Hub is a curated, governed web portal serving five personas across two access tiers — public stakeholders (anonymous) and authorized I&R curators. The UX is organized around two distinct surfaces:

1. **Public Surface** — Discovery, reading, and engagement. No authentication required. Optimizes for Margaret (Decision-Maker), David (Operational Leader), Priya (Technical Adopter), and Carlos (Contributor) to arrive with a mission problem, find relevant innovation work, understand its maturity and reuse potential, and take a next step.

2. **Curator Surface** — Governance, lifecycle management, and operational triage. Requires authentication. Optimizes for Jasmine (I&R Curator) to create, govern, and publish records; triage submission and engagement queues; and maintain audit accountability — all without external spreadsheets or email inboxes.

### Design Principles (from PRD §3)

- **Problem-Oriented Discovery** — Search and browse surface mission-problem language, not internal project names
- **Evidence Before Promotion** — Maturity, limitations, and negative results are visible and prominent, not de-emphasized
- **Visible Trust** — Maturity badge, review status badge(s), owner, and last-reviewed date appear on every record surface (cards, results, detail pages) in both perspectives
- **Actionable Pages** — Every record has a contextual next step; no record is a dead end
- **Maintainability Over Novelty** — Clean, structured layouts; no visual elaboration that creates maintenance debt
- **Accessible by Default** — WCAG 2.1 AA across all journeys; keyboard-navigable; screen-reader compatible

### Trust Model (enforced through visual design)

Four trust distinctions must be communicable from every record surface:
- POC ≠ production-ready (maturity badge always visible; applicable disclaimer present)
- Published ≠ approved for adoption (record-level disclaimer; review status distinct from maturity)
- Community-submitted ≠ centrally endorsed (attribution section; contribution source labeled)
- Validated for reuse ≠ eliminates local review (reuse guidance explicitly states local review still applies)

### Maturity Badge Visual System

Maturity badges use distinct visual treatment — color + label + icon shape — to prevent false equivalence (F1.6, SEC-11):

| Maturity | Badge Style | Intent |
|----------|------------|--------|
| Idea | Outlined, light gray | Unvalidated — lowest signal |
| Evaluated Idea | Outlined, blue | Reviewed for potential |
| Experiment / POC | Solid, amber/orange | Evidence exists; not production-ready |
| Prototype / Pilot | Solid, teal | Tested with real users/environments |
| Production / Validated Pattern | Solid, green | Suitable as reference for reuse |
| Archived / Retired | Muted, gray + strikethrough label | No longer active |

Review Status badges use a different shape and color family (purple/indigo) to remain distinguishable from maturity badges at a glance (SEC-11).

---

## Navigation Map

| Screen | Route | Reached from | Nav element |
|--------|-------|--------------|-------------|
| Home / Landing | `/` | Direct URL, shared links | Top-level entry point |
| Catalog / Browse | `/catalog` | Home hero CTA, top nav "Catalog" | Nav: "Catalog" link |
| Search Results | `/search?q=...` | Home search bar, Catalog search bar | Search form submit |
| Innovation Record | `/records/:slug` | Catalog card click, Search result click | Card / result row click |
| Opportunity Submission | `/submit/opportunity` | Home CTA "Submit a Problem", Nav "Submit" | Nav / Home CTA |
| Share Innovation Work | `/submit/contribution` | Home CTA "Share Your Work", Opportunity form redirect, Nav "Submit" | Nav / Home CTA / Inline redirect |
| Engagement Request | `/records/:slug#engage` (modal overlay) | Innovation Record CTAs, General "Contact I&R" | CTA button on record; Nav "Contact I&R" |
| Submission Confirmation | `/submit/confirmation` | Opportunity form submit, Contribution form submit | Form submit |
| Engagement Confirmation | `/engage/confirmation` | Engagement request form submit | Form submit |
| Curator Dashboard | `/curator` | Curator nav (authenticated only) | Sidebar: "Dashboard" |
| Record Management | `/curator/records` | Curator Dashboard quick-links, Curator sidebar | Sidebar: "Records" |
| Record Editor | `/curator/records/new`, `/curator/records/:id/edit` | Record Management "New Record" / "Edit" action | Record Management action button |
| Opportunity Queue | `/curator/submissions/opportunities` | Curator Dashboard "Pending Submissions", Sidebar | Sidebar: "Submissions → Opportunities" |
| Contribution Queue | `/curator/submissions/contributions` | Curator Dashboard "Pending Submissions", Sidebar | Sidebar: "Submissions → Contributions" |
| Engagement Activity | `/curator/engagement` | Curator Dashboard "Engagement Activity", Sidebar | Sidebar: "Engagement" |
| Settings | `/curator/settings` | Curator Sidebar (Admin role only) | Sidebar: "Settings" |
| Content Model Reference | `/curator/reference` | Record Editor help links, Sidebar | Sidebar: "Reference" / Editor inline link |

**Invariant:** Every screen above has at least one inbound path traceable to the app shell (top nav for public screens; curator sidebar for authenticated screens). No orphan screens.

---
## User Flows

---

### Flow 00: Discover and Act on Existing Innovation (Primary Journey)

**Trigger:** User arrives at Hub home with a mission problem or area of interest
**User Stories:** US-1.1, US-2.1, US-2.2, US-2.3, US-3.1–US-3.7, US-4.1–US-4.3, US-8.1
**Personas:** Margaret (PER-01), David (PER-02), Priya (PER-03)
**Journey Ref:** JRN-01.1, JRN-02.1, JRN-03.1

```
[Home / Landing]
    │
    ├── Types query into hero search bar ──────▶ [Search Results]
    │                                                   │
    │                                        Applies filters (facets)
    │                                                   │
    │                                           ┌───────┴────────┐
    │                                    Results found?         No results
    │                                           │                │
    │                                           │         Show no-results msg
    │                                           │         + link to Catalog
    │
    ├── Clicks "Browse Catalog" CTA ────────▶ [Catalog / Browse]
    │                                                   │
    │                                     Scans cards (maturity, review
    │                                     status, engagement indicator)
    │
    │   [Search Results] or [Catalog]
    │                │
    │        Clicks a record card
    │                │
    │                ▼
    │       [Innovation Record]
    │         Default: Executive Perspective
    │                │
    │         ┌──────┴──────────────────────┐
    │    Stays on                    Clicks perspective toggle
    │    Executive view              │
    │         │                      ▼
    │         │              [Technical Perspective]
    │         │              (same page, ?view=technical)
    │         │                      │
    │         └──────────────────────┘
    │                │
    │        Reads sections:
    │        Problem → Outcome → Findings → Maturity/Readiness
    │        → Reuse Guidance → Ownership → Artifacts → Next Action
    │                │
    │        ┌───────┴──────────────────────────────────┐
    │   Clicks artifact link              Clicks a Next Action CTA
    │   (opens in new tab to             (Request Demo / Explore Adoption /
    │    authoritative source)            Technical Guidance / Contact I&R)
    │                                              │
    │                                              ▼
    │                                    [Engagement Request Modal/Form]
    │                                    (pre-populated with record context)
    │                                              │
    │                                    Fills: name, office, contact,
    │                                    description, desired next step
    │                                              │
    │                                    Submits form
    │                                              │
    │                                              ▼
    │                                    [Engagement Confirmation]
    │                                    Reference number + "I&R will follow up"
    │
    └── Clicks "Contact I&R" (general) ─▶ [Engagement Request Form]
                                           (no originating record)
```

**Steps:**
1. User lands on Home; sees hero search bar and clear value proposition
2. User searches using mission-problem language (e.g., "court audio security")
3. Results render with trust badges visible; user scans maturity and review status
4. User clicks a record card and arrives on Innovation Record (Executive Perspective default)
5. User reads problem, outcome, evidence, maturity/readiness, and reuse guidance
6. Optionally toggles to Technical Perspective for deeper technical detail
7. Optionally follows artifact links to authoritative sources (new tab)
8. User identifies appropriate next action and clicks a CTA
9. Engagement Request form opens, pre-populated with record context
10. User fills in their details and submits; receives confirmation with reference number

**Decision Points:**
- Search returns 0 results → show helpful empty state, link to browse
- Record has no configured CTAs → always show default "Contact I&R" CTA
- Artifact is restricted → show name + access notes, no URL for anonymous users
- Search service unavailable → show error with link to catalog browse

---

### Flow 01: Submit an Opportunity (Secondary Journey)

**Trigger:** User has a mission problem or workflow friction to bring to I&R
**User Stories:** US-6.1, US-6.2, US-6.3
**Personas:** David (PER-02), Carlos (PER-04)
**Journey Ref:** JRN-04.2

```
[Home / Nav "Submit"]
    │
    ▼
[Submit Landing — Choose Path]
    │
    ├── "I have a mission problem" ──▶ [Opportunity Submission Form]
    │                                         │
    │                                  Step 1: Request Type
    │                                  + Non-acceptance statement (prominent)
    │                                         │
    │                                         ├── "Share Existing Innovation Work"
    │                                         │   selected → inline guidance +
    │                                         │   link to Contribution form
    │                                         │
    │                                  Step 2: Problem Description
    │                                  (problem title, description ≥50 chars,
    │                                   who is affected, impact)
    │                                         │
    │                                  Step 3: Context & Contact
    │                                  (workflow, desired outcome, constraints,
    │                                   related work, submitting office,
    │                                   name, email)
    │                                         │
    │                                  Step 4: Review & Acknowledge
    │                                  (acknowledgment checkbox,
    │                                   consent to contact)
    │                                         │
    │                                         ├── Validation fails ──▶ Inline errors
    │                                         │
    │                                  Submit
    │                                         │
    │                                         ├── Rate limit hit ──▶ "Too many submissions"
    │                                         │
    │                                         ▼
    │                                  [Submission Confirmation]
    │                                  Reference number
    │                                  Non-acceptance re-statement
    │
    └── "I have existing work to share" ──▶ [Share Innovation Work Form]
```

---

### Flow 02: Share Existing Innovation Work (Secondary Journey)

**Trigger:** Contributor has completed innovation work to share with I&R
**User Stories:** US-7.1, US-7.2, US-7.3
**Persona:** Carlos (PER-04)
**Journey Ref:** JRN-04.1

```
[Home / Nav / Opportunity Form redirect]
    │
    ▼
[Share Innovation Work Form]
    │
    Non-endorsement statement (prominent, before first field)
    │
    Step 1: Work Identity
    (contribution title, problem addressed, work description)
    │
    Step 2: Attribution
    (contributing office, contributor names, current owner,
     owner contact email, maturity, collaboration preference)
    │
    Step 3: Artifacts & Limitations
    (artifact links/URLs, known limitations, additional context)
    │
    Step 4: Contact & Acknowledge
    (submitter name, submitter email,
     acknowledgment of non-endorsement, consent to contact)
    │
    ├── Validation fails ──▶ Inline per-field errors (no submit)
    │
    ├── Rate limit ──▶ "Too many submissions. Try again later."
    │
    ▼
[Submission Confirmation]
    Named contributors confirmed captured
    Curation required statement
    Reference number
    Expected next steps
```

---

### Flow 03: Curator — Daily Operations Triage

**Trigger:** Curator logs in and opens Dashboard
**User Stories:** US-9.1, US-9.10, US-9.11, US-9.12
**Persona:** Jasmine (PER-05)
**Journey Ref:** JRN-05.2

```
[Curator Login]
    │
    ▼
[Curator Dashboard]
    Summary counts (live data):
    - Records by state
    - Overdue review dates (next_review_date ≤ today+30)
    - Pending opportunity submissions
    - Pending contributions
    - Recent engagement (last 7 days)
    - Last 5 audit events
    │
    ├── "N Pending Submissions" ──▶ [Opportunity Queue]
    │                                    │
    │                           View each submission in full
    │                           Disposition: Accepted / Declined /
    │                                        Needs Info / Duplicate
    │
    ├── "N Contributions" ──▶ [Contribution Queue]
    │                              │
    │                      Disposition submission
    │                      "Create Record from Contribution"
    │                           ──▶ [Record Editor]
    │                               (pre-populated, attribution locked)
    │
    ├── "N Engagement Requests" ──▶ [Engagement Activity]
    │                                    │
    │                           View requests with originating record
    │                           Update follow-up status
    │
    └── "N Records Needing Review" ──▶ [Record Management]
                                          │
                                   Filter by "Needs Review"
                                   Open record for update
                                   ──▶ [Record Editor]
```

---

### Flow 04: Curator — Create and Publish a Record

**Trigger:** Curator creates a new record or receives accepted contribution
**User Stories:** US-9.3, US-9.4, US-9.5, US-9.6, US-9.7, US-9.8, US-9.9
**Persona:** Jasmine (PER-05)
**Journey Ref:** JRN-05.1

```
[Record Management]
    │
    "New Record" button
    │
    ▼
[Record Editor — Draft]
    │
    Fill sections (auto-save every 30s for drafts):
    Problem & Context → What Was Explored → Outcome & Evidence
    → Key Findings → Maturity & Readiness → Reuse Guidance
    → Ownership & Attribution → Artifacts → Next Actions → Disclaimer
    │
    ├── Set Maturity (independent dropdown)
    │       └── System suggests disclaimer template
    │
    ├── Set Review Status (independent multi-select)
    │       └── Security Reviewed visually distinct (SEC-11)
    │
    ├── Manage Artifacts (add / edit / reorder / remove)
    │
    ├── Inline "?" links → Content Model Reference
    │
    "Validate for Publication" button
    │
    ├── Gate fails ──▶ List of missing required fields
    │                  (specific field names, not generic error)
    │
    ├── Gate passes → "Submit for Review" → pub state = submitted_for_review
    │
    ▼
[Publication Lifecycle actions]
    │
    "Publish" ──▶ pub state = published
    │
    ├── Maturity/disclaimer mismatch warning (non-blocking) if POC → Validated Pattern
    │
    "Supersede" ──▶ Requires reason + optional successor record link
    "Archive" ──▶ Requires confirmation
    "Retire" ──▶ Requires reason, confirmation; hidden from public
    "Unpublish" ──▶ Returns to Draft
    │
    ▼
[Audit History] — every transition captured with actor + timestamp
```

---
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
---

### Screen 03: Innovation Record — Full Record View

**Route:** `/records/:slug` (optional `?view=executive` or `?view=technical`)
**Purpose:** The central structured artifact — complete, governed presentation of one innovation effort. Serves all personas through a perspective toggle. Every trust field is always visible in both perspectives.
**User Stories:** US-3.1–US-3.7, US-4.1–US-4.3, US-5.1
**Personas:** All public personas

#### Layout — Page Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ← Back to Catalog                                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [RECORD HEADER]                                            │  │
│  │                                                            │  │
│  │  ■ EXPERIMENT / POC  [amber badge]                        │  │
│  │  [Technically Reviewed]  [Security Reviewed]              │  │
│  │  (distinct purple/indigo pill badges)                      │  │
│  │                                                            │  │
│  │  Audio Security POC                                        │  │
│  │  <h1>                                                      │  │
│  │                                                            │  │
│  │  Courtroom audio proceedings are vulnerable to unauthorized │  │
│  │  access during remote hearings...                          │  │
│  │                                                            │  │
│  │  Mission: Court Operations  |  Technology: Azure Gov, Audio│  │
│  │  Owner: I&R Team  |  Last reviewed: June 2026             │  │
│  │  Next review: December 2026                                │  │
│  │                                                            │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ ⚠ NOTICE: This record summarizes a proof-of-concept  │  │  │
│  │  │ effort. The findings are not production-ready and     │  │  │
│  │  │ have not been approved for adoption.                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  [Available for Demonstration]  [Seeking Adoption Partner] │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ PERSPECTIVE TOGGLE                                          │ │
│  │ ┌───────────────────┐  ┌───────────────────┐               │ │
│  │ │ ● Executive View  │  │ ○ Technical View  │               │ │
│  │ └───────────────────┘  └───────────────────┘               │ │
│  │ (Tab or radio button control; keyboard accessible)          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [RECORD BODY — sections vary by perspective, see below]         │
│                                                                  │
│  [NEXT ACTION CTAs — always visible, bottom of record]           │
│  ┌───────────────────┐ ┌───────────────────┐ ┌───────────────┐  │
│  │[Request a Demo]   │ │[Explore Adoption] │ │[Contact I&R]  │  │
│  └───────────────────┘ └───────────────────┘ └───────────────┘  │
│  "Ready to take the next step? I&R is available to discuss..."   │
└──────────────────────────────────────────────────────────────────┘
```

#### Executive Perspective — Body Sections

```
┌──────────────────────────────────────────────────────────────────┐
│  [TRUST FIELDS — always visible in executive view]               │
│  Maturity: Experiment/POC  |  Review: Technically + Security     │
│  Applicable disclaimer visible (POC notice banner)               │
│  Last reviewed: June 2026                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PROBLEM & CONTEXT                                               │
│  ─────────────────                                               │
│  [Mission problem narrative — who is affected, why it matters]   │
│  Affected stakeholders: Court clerks, remote hearing participants │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  OUTCOME                                                         │
│  ────────                                                        │
│  [Outcome summary — what was demonstrated; decision supported]   │
│  Decision enabled: [text if populated]                           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  KEY RISKS & CONSTRAINTS (from findings)                         │
│  ───────────────────────────────────────                         │
│  • [Security finding summary]                                    │
│  • [Operational finding summary]                                 │
│  • [Known limitation / production gap]                           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  MATURITY & READINESS                                            │
│  ────────────────────                                            │
│  Stage: Experiment / POC                                         │
│  Ready for: Discovery discussions, reference architecture review │
│  Not ready for: Production deployment without further review     │
│  What comes next: [next_stage_requirements text]                 │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  OWNERSHIP & ATTRIBUTION                                         │
│  ────────────────────────                                        │
│  Contributing Office: I&R Team, District Court X                │
│  Current Owner/Steward: [name]                                   │
│  Attribution: [attribution_statement]                            │
│  Opportunity Source: [if populated]                              │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  SOURCE BASIS                                                    │
│  ────────────                                                    │
│  "Audio Security POC lessons-learned document, June 2026"        │
│                                                                  │
│  Authoritative Artifacts:                                        │
│  [Lessons Learned Document — AO SharePoint]                     │
│  [POC Report — AO SharePoint (Restricted — AO network required)] │
│  (restricted artifacts: name + access notes only, no URL)        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Technical Perspective — Body Sections

```
┌──────────────────────────────────────────────────────────────────┐
│  [TRUST FIELDS — always visible in technical view]               │
│  Same maturity, review status, disclaimer, last-reviewed date    │
│  (F4.4: trust fields never suppressed in either perspective)     │
├──────────────────────────────────────────────────────────────────┤
│  WHAT WAS EXPLORED                                               │
│  ──────────────────                                              │
│  Hypothesis/Objective: [hypothesis_or_objective]                 │
│  Scope: [scope_description]                                      │
│  Technologies used: Azure Government Cloud, GPU/CPU separation,  │
│    audio isolation microservices, defense-in-depth layers        │
│  Methods: [methods_used]                                         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  OUTCOME & EVIDENCE                                              │
│  ───────────────────                                             │
│  [outcome_summary]                                               │
│  What worked: [what_worked]                                      │
│  What did not work: [what_did_not_work]  ← prominently shown     │
│  Uncertainty reduced: [uncertainty_reduced]                      │
│  Source basis: [source_basis]                                    │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  KEY FINDINGS                                                    │
│  ────────────                                                     │
│  Architecture: [findings_architectural]                          │
│  Security: [findings_security]                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🔒 SECURITY FINDINGS — distinct visual treatment (SEC-11) │  │
│  │ [findings_security text]                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  Cloud/Platform: [findings_cloud_platform]                       │
│  Performance: [findings_performance]                             │
│  Testing: [findings_testing]                                     │
│  Operational: [findings_operational]                             │
│  (only populated categories shown)                               │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  MATURITY & READINESS                                            │
│  ────────────────────                                            │
│  Stage: Experiment / POC                                         │
│  Review Status: Technically Reviewed, Security Reviewed          │
│  Ready for: [ready_for]                                          │
│  Not ready for: [not_ready_for]                                  │
│  Production-readiness gaps: [production_readiness_gaps]          │
│  What comes next: [next_stage_requirements]                      │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  REUSE GUIDANCE                                                   │
│  ─────────────                                                    │
│  Reuse Potential: High / Moderate / Low / Not Assessed           │
│  What can be reused: [what_can_be_reused]                        │
│  What should be adapted: [what_should_be_adapted]                │
│  What NOT to copy directly: [what_not_to_copy]                   │
│  Environment assumptions: [environment_assumptions]              │
│  Required skills: [required_skills]                              │
│  Required services/dependencies: [required_services]            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  AUTHORITATIVE ARTIFACTS                                         │
│  ───────────────────────                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 📄 Lessons Learned Document                               │  │
│  │    Type: Lessons Learned  |  Source: AO SharePoint        │  │
│  │    [View Document ↗]                                      │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 📐 Architecture Diagram                                   │  │
│  │    Type: Architecture Diagram  |  Source: SharePoint      │  │
│  │    Access: AO network required                            │  │
│  │    [Restricted — contact I&R for access]                  │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 🔐 Security Findings Report                               │  │
│  │    Type: Security Findings  |  Source: Internal           │  │
│  │    Access: Restricted — AO security team only             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  OWNERSHIP & ATTRIBUTION                                         │
│  ────────────────────────                                        │
│  (same as executive view)                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### States — Record Display

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (executive) | Executive perspective loaded | Perspective toggle shows ● Executive |
| Default (technical) | Technical perspective loaded; `?view=technical` in URL | Toggle shows ● Technical |
| Loading | Skeleton layout (header + section placeholders) | "Loading record…" |
| Superseded | Banner at top of page: "This record has been superseded." + link to successor | Muted card treatment; prominent notice |
| Archived | Banner: "This record is archived. It is retained for institutional learning and is not a current recommendation." | Muted treatment |
| Record not found | 404 state | "This record was not found. It may have been retired or the link may be incorrect. Browse the catalog." |
| No configured CTAs | Default CTA shown | "Contact I&R" CTA always present |

#### Perspective Toggle Behavior

| Behavior | Detail |
|----------|--------|
| Control type | Segmented button / radio group (keyboard accessible, `role="radiogroup"`) |
| URL update | Appends `?view=executive` or `?view=technical`; does not navigate to new page |
| Shareable URL | Both perspective URLs are shareable and bookmarkable |
| Trust fields | Maturity, review status, disclaimer, last-reviewed date — always shown in both perspectives (F4.4) |
| Conflict prevention | Both views read same underlying record data — no separate data source |

#### Next Action CTAs

Configured per-record by curator (F3.9). Only enabled actions show:

| CTA Label | When shown | Action |
|-----------|-----------|--------|
| Request a Demonstration | `demo_available` engagement indicator configured | Opens Engagement Request form, pre-populated, type = demo |
| Explore Adoption | `seeking_adoption_partner` configured | Opens form, type = adoption |
| Request Technical Guidance | Curator enables | Opens form, type = technical_guidance |
| Discuss a Related Use Case | Curator enables | Opens form, type = discussion |
| Share Related Work | Curator enables | Links to `/submit/contribution` |
| Contact I&R | Always shown (fallback) | Opens form, type = general, no record context override |

#### Accessibility Notes

- Page `<h1>`: record title
- Record header badges: `<span role="status" aria-label="Maturity: Experiment / POC">` (maturity); `<span aria-label="Review status: Technically Reviewed">` (review)
- Applicable disclaimer banner: `role="alert"` or `role="note"` with appropriate `aria-label`; NOT dismissible (must remain visible)
- Perspective toggle: `role="radiogroup"` with `aria-label="Record perspective"`; each option is `<input type="radio">` with visible label
- Superseded/Archived banners: `role="note"` at top of main content; clearly labeled
- Section headings: `<h2>` for each major section (Problem & Context, Outcome, etc.)
- Artifact links: open in new tab — each link has `aria-label="{artifact name} (opens in new tab)"`; restricted artifacts show a non-linked span instead
- CTAs at bottom: `<section aria-label="Next actions">` wrapping all CTA buttons
- CTA buttons: descriptive labels (not just "Click here"); keyboard-focusable; visible focus ring; `type="button"` to prevent accidental form submission

---
---

### Screen 04: Opportunity Submission

**Route:** `/submit/opportunity`
**Purpose:** Multi-step form for submitting a mission problem or workflow friction to I&R. Problem-first framing. Explicit non-acceptance statement. Distinct from contribution form (F7).
**User Stories:** US-6.1, US-6.2, US-6.3
**Personas:** PER-02 (David), PER-04 (Carlos)

#### Layout — Step 1: Request Type + Non-Acceptance Statement

```
┌──────────────────────────────────────────────────────────────────┐
│ [TOP NAV]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Submit a Problem to I&R                                         │
│  <h1>                                                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ℹ IMPORTANT: Submitting an opportunity does not imply      │  │
│  │   acceptance into the I&R portfolio. I&R will review       │  │
│  │   submissions and reach out if the opportunity aligns      │  │
│  │   with our current capacity and priorities.                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Step indicator: ●─○─○─○  Step 1 of 4: Request Type]           │
│                                                                  │
│  What type of opportunity are you submitting? *                  │
│  ○ Current Mission Problem                                       │
│  ○ Emerging Technology Question                                  │
│  ○ Request for Research                                          │
│  ○ Potential POC                                                 │
│  ○ Request for Demonstration                                     │
│  ○ Collaboration Opportunity                                     │
│  ○ Share Existing Innovation Work                                │
│  ○ Other                                                         │
│                                                                  │
│  [If "Share Existing Innovation Work" selected — inline banner:] │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ You selected "Share Existing Innovation Work."             │  │
│  │ There is a dedicated contribution form for teams with      │  │
│  │ existing work to share. → [Go to Contribution Form]        │  │
│  │ You may also continue here if you prefer.                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                          [Next: Problem →]       │
└──────────────────────────────────────────────────────────────────┘
```

#### Layout — Step 2: Problem Description

```
│  [Step indicator: ●─●─○─○  Step 2 of 4: Problem Description]    │
│                                                                  │
│  Problem Title *                                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input, max 200 chars]                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Describe the problem or friction you're experiencing *          │
│  (Describe the mission problem, not a requested solution.        │
│   Minimum 50 characters.)                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea, min 50 chars, max 5000 chars]                   │  │
│  │                                                            │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  [0 / 5000 characters]                                           │
│                                                                  │
│  Who is affected by this problem? *                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea, roles, offices, courts affected]                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What is the operational impact? *                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — frequency, severity, scope of impact]          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                          [Next: Context →]            │
```

#### Layout — Step 3: Context (Optional Fields)

```
│  [Step indicator: ●─●─●─○  Step 3 of 4: Context & Contact]      │
│                                                                  │
│  How is the work done today? (Optional)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — current workflow description]                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What outcome would improve the situation? (Optional)            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — desired outcome, not a specific solution]      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Known constraints (Optional)                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea — technical, policy, resource constraints]       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Related work already attempted (Optional)                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [textarea]                                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Submitting Office *                                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input]                                               │  │
│  └────────────────────────────────────────────────────────────┘  │
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
│  Discovery participants available? (Optional)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [text input — names/roles]                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Back]                          [Next: Review →]             │
```

#### Layout — Step 4: Review & Acknowledge

```
│  [Step indicator: ●─●─●─●  Step 4 of 4: Review & Acknowledge]   │
│                                                                  │
│  Review your submission                                          │
│  ─────────────────────                                           │
│  Request Type: Current Mission Problem                           │
│  Problem Title: [summary of title]                               │
│  Problem Description: [excerpt]                                  │
│  Submitting Office: [value]                                      │
│  Contact: [name] — [email]                                       │
│  [Edit ↗] (links back to relevant step)                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ℹ NON-ACCEPTANCE STATEMENT                                 │  │
│  │   Submitting this opportunity does not imply acceptance    │  │
│  │   into the I&R portfolio. I&R will review submissions and  │  │
│  │   reach out if the opportunity aligns with current         │  │
│  │   capacity and priorities.                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ☐ I understand that submission does not imply I&R acceptance *  │
│                                                                  │
│  ☐ I consent to I&R contacting me at the provided email         │
│    address regarding this submission *                           │
│                                                                  │
│  [← Back]                          [Submit Opportunity]          │
│                                                                  │
│  (Rate limit: max 5 submissions per hour from this browser)      │
```

#### Submission Confirmation

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ✓ Your submission has been received.                            │
│                                                                  │
│  Reference Number: OPP-2026-0047                                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ IMPORTANT: Submission does not imply acceptance into the   │  │
│  │ I&R portfolio. You will be contacted if I&R determines     │  │
│  │ the opportunity aligns with current priorities.            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  What happens next:                                              │
│  • Your submission enters I&R's review queue                     │
│  • I&R will review and respond if the opportunity fits their     │
│    current capacity and priorities                               │
│  • No automated approval will be sent                           │
│                                                                  │
│  [ Browse the Catalog ]   [ Submit Another Problem ]             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Non-acceptance statement | Top of Step 1, Step 4 (always visible) |
| Primary | Required fields (problem description, who affected, impact) | Step 2 |
| Secondary | Optional context fields | Step 3 |
| Secondary | Acknowledgment checkboxes | Step 4 |
| Tertiary | Step indicator / progress | Top of each step |
| Primary (confirmation) | Reference number | Confirmation page, prominent |
| Primary (confirmation) | Non-acceptance re-statement | Confirmation, in notice box |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Step 1 with non-acceptance banner | — |
| Validation error | Red border + inline error below field | Per-field message (e.g., "Problem description must be at least 50 characters.") |
| Rate limit hit | Error message replaces submit button | "Too many submissions. Please try again later." |
| Submitting | Submit button shows spinner, disabled | "Submitting…" |
| Success | Confirmation page | Reference number + non-acceptance re-statement |
| "Share Innovation Work" selected | Inline redirect guidance | Banner with link to contribution form |

#### Accessibility Notes

- `<h1>`: "Submit a Problem to I&R"
- Non-acceptance notice: `role="note"` with `aria-label="Non-acceptance notice"` — NOT `role="alert"` (it should not interrupt on re-render)
- Step indicator: `aria-label="Step 2 of 4: Problem Description"` on the step container; each step completed has `aria-current="step"` pattern
- All required fields: marked with asterisk (*) AND `aria-required="true"` on the input
- Error messages: each error is associated with its field via `aria-describedby`; error summary at top of step on submit attempt with links to each errored field
- Acknowledgment checkboxes: `<label>` associated with `<input type="checkbox">`; both required before form can submit
- Character counter: `aria-live="polite"` so screen readers announce as user types
- "Share Existing Innovation Work" redirect banner: appears below the radio group as an `aria-live="polite"` region

---
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
---

## Responsive Considerations

---

### Breakpoints

| Breakpoint | Range | Layout Mode |
|------------|-------|-------------|
| Desktop | > 1024px | Full two-column layout (filter sidebar + content) |
| Tablet | 768px – 1024px | Collapsible sidebar; content area full-width with filter drawer |
| Mobile | < 768px | Single column; stacked layout; filter drawer on demand |

---

### Desktop (> 1024px)

**Home:**
- Hero section full-width; search bar centered, ~600px wide
- Featured records: horizontal card strip, 3–4 cards visible
- Action paths: 3-column card row

**Catalog / Search:**
- Filter panel: visible left sidebar, ~280px fixed width
- Results: 2-column card grid, or 1-column list (user preference if implemented)
- Filter chips: single row above result count

**Innovation Record:**
- Full-width content, max ~900px centered
- Perspective toggle: segmented button, horizontally laid out
- Sections: full width with consistent left padding
- Side-by-side layout for Maturity and Review Status in both perspectives
- CTAs at bottom: horizontal row

**Curator Screens:**
- Sidebar: ~240px fixed, always visible
- Content: remaining width, max ~1200px
- Record Management table: all columns visible; horizontal scroll on narrower desktop
- Record Editor: left section nav (~200px) + right content area

---

### Tablet (768px – 1024px)

**Home:**
- Hero section full-width; search bar ~90% width
- Featured records: horizontal card strip, 2 cards visible + partial 3rd
- Action paths: 3-column or 2-column layout depending on viewport

**Catalog / Search:**
- Filter panel: **collapsed by default**; "Filters" button opens a slide-over drawer from the left
- Active filter chips visible above results even when drawer is closed
- Results: 1-column card list (not grid) for readability

**Innovation Record:**
- Full-width; single column
- Perspective toggle: same horizontal segmented button
- CTAs: may stack to 2 columns

**Curator Screens:**
- Sidebar: collapsible to icon-only rail (hamburger toggle in header)
- Content: full remaining width
- Record Management: horizontal scroll on table; priority columns (title, state, actions) remain sticky
- Record Editor: section nav moves to top tab bar; content below

---

### Mobile (< 768px)

**Home:**
- Hero section stacks vertically
- Search bar full-width
- Featured records: horizontal scroll strip, 1 card fully visible + partial next
- Action paths: single column, stacked cards

**Catalog / Search:**
- Filter panel: **hidden by default**; "Filters (3 active)" button opens full-screen drawer
- Results: single column list
- Filter chips: wrapped, scrollable row
- Result count: visible above chips

**Innovation Record:**
- Single column; sections stack vertically
- Perspective toggle: same control; ensure min touch target 44×44px
- Maturity and review status badges: stacked vertically in header if needed
- Applicable disclaimer: full-width notice block
- CTAs: full-width stacked buttons
- Artifact links: each artifact card full-width; "View" button accessible as large touch target

**Opportunity / Contribution Forms:**
- Single column; step indicator compresses to "Step 2 of 4" text label (no visual steps on very small screens)
- All form fields full-width
- Navigation buttons (Back / Next) full-width, stacked with Next on top (primary action)

**Engagement Request Modal:**
- Full-screen overlay on mobile (not a centered modal box)
- Close button top-right; large touch target
- All fields full-width, stacked

**Curator Screens (mobile — degraded but functional):**
- Sidebar: off-canvas, toggle with hamburger icon in header
- Dashboard: summary cards stack single column
- Record Management table: priority columns only (title, state, actions); tap row to expand details
- Record Editor: section nav becomes accordion; each section expands/collapses; bottom action bar remains persistent

---

### Touch Target Requirements

All interactive elements on mobile and tablet must meet WCAG 2.1 minimum touch target size:
- Minimum 44×44px effective touch target for buttons, links, checkboxes, radio buttons
- Filter checkboxes: ensure label extends the touch target
- Maturity/review status badge links (if interactive): extend padding to meet minimum

---
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
