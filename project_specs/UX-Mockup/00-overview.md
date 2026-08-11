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
