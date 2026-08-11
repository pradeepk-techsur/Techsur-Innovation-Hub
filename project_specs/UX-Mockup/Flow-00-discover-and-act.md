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
