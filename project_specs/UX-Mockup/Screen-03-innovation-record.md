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
