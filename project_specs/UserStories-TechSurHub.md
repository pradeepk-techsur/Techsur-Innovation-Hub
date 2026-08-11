# User Stories
## TSIO Innovation Hub MVP (TechSur Innovation Hub)

| Field | Value |
|-------|-------|
| **Product Name** | TSIO Innovation Hub MVP (TechSur Innovation Hub) |
| **Date** | 2026-08-11 |
| **Related PRD** | PRD-TechSurHub.md |
| **Related FRD** | FRD-TechSurHub.md |

---

## Story Format

Each story follows: **As a [persona], I want to [action], so that [outcome].**

Acceptance criteria are listed beneath each story. Stories are grouped by epic and prioritized.

**Personas:**
- **Margaret Holloway** (PER-01) — Decision-Maker
- **David Tran** (PER-02) — Operational Leader
- **Priya Suresh** (PER-03) — Technical Adopter
- **Carlos Rivera** (PER-04) — Innovation Contributor
- **Jasmine Okafor** (PER-05) — I&R Curator

---

## Epic 1: Innovation Catalog (F1)

> The primary discovery surface — a browsable, governed view of curated innovation records that communicates trust, maturity, and actionability at a glance.

### US-1.1: Browse the Catalog and Assess Records at a Glance
**As a** Margaret Holloway, **I want to** browse a catalog of curated innovation records and distinguish each record's maturity, review status, and engagement availability without opening every record, **so that** I can efficiently identify which efforts are worth my time to review in depth.

**Acceptance Criteria:**
- [ ] The catalog page loads all published innovation records without requiring authentication
- [ ] Each catalog card displays: title, one-sentence problem or outcome summary (≤ 280 characters), technology/capability area, maturity badge, review status badge(s), contributing office, and last-reviewed date
- [ ] Maturity badges use visually distinct, non-interchangeable treatment — an Idea is never styled the same as a Production/Validated Pattern
- [ ] Review status badges are visually distinct from maturity badges (SEC-11)
- [ ] An engagement indicator badge appears on the card when configured (e.g., "Available for Demonstration", "Seeking Adoption Partner")
- [ ] Superseded or Archived records displayed in the catalog carry a visible state indicator and are not styled as Published records (F1.6)
- [ ] An appropriate empty-state message appears if no records are published, not an error

**Priority:** P0 | **Feature Ref:** F1.1, F1.2, F1.3, F1.4, F1.5, F1.6

---

### US-1.2: Understand Lifecycle State Without Opening a Record
**As a** David Tran, **I want to** see on each catalog card whether a record is current, superseded, or archived and when it was last reviewed, **so that** I can calibrate how current and trustworthy the information is before committing time to read it.

**Acceptance Criteria:**
- [ ] The last-reviewed date appears on every catalog card in a human-readable format (e.g., "June 2026")
- [ ] Superseded records in the catalog display a clear "Superseded" indicator visible without opening the record
- [ ] Archived records in the catalog display a clear "Archived" indicator
- [ ] Published records do not show a state label (published is the implicit default)
- [ ] The catalog never presents all records with uniform visual treatment — differences in maturity and lifecycle state are visually apparent

**Priority:** P0 | **Feature Ref:** F1.5, F1.6

---

### US-1.3: Identify Engagement Opportunities from the Catalog
**As a** David Tran, **I want to** see which records have active engagement options (demo available, seeking adoption partner, technical playbook) directly on the catalog card, **so that** I can prioritize outreach on records where I&R is actively inviting interaction.

**Acceptance Criteria:**
- [ ] Engagement indicator values (e.g., "Available for Demonstration", "Seeking Adoption Partner", "Technical Playbook Available", "Reference Pattern Available") appear as badges on catalog cards when configured by a curator
- [ ] Records with no engagement indicator show no badge (no placeholder text)
- [ ] Clicking or activating a card navigates to the full innovation record detail page
- [ ] Engagement indicator values come only from the canonical set — no free-form labels appear

**Priority:** P0 | **Feature Ref:** F1.4

---

## Epic 2: Search and Discovery (F2)

> Problem-oriented full-text search and faceted filtering so stakeholders find relevant work using mission-problem language, not internal project names.

### US-2.1: Search by Mission Problem Language
**As a** Margaret Holloway, **I want to** search for innovation records using the language of a mission problem (e.g., "protect court audio", "GPU separation", "Azure Government Cloud") rather than knowing the formal project name, **so that** I can discover relevant work without needing prior access to I&R's internal project structure.

**Acceptance Criteria:**
- [ ] A search query like "protect court audio" surfaces the Audio Security POC record without requiring the user to enter its exact title
- [ ] Search covers: titles, problem statements, summaries, key findings, tags, mission areas, technology areas, and artifact names (where not restricted)
- [ ] Results are relevance-ranked with `problem_statement` and `key_findings` weighted highest
- [ ] Every result card displays maturity badge, review status badge(s), and lifecycle state indicator — trust information is never omitted from results (F2.4)
- [ ] A minimum of 2 characters is required to trigger a search; entering fewer shows an inline validation message
- [ ] Search is case-insensitive and supports partial word matching for technology and domain terms

**Priority:** P0 | **Feature Ref:** F2.1, F2.2, F2.4, F2.5

---

### US-2.2: Refine Results with Faceted Filters
**As a** Priya Suresh, **I want to** filter catalog results by technology area, maturity level, review status, and artifact availability, **so that** I can narrow to technically substantive, reviewed records that have source artifacts I can follow.

**Acceptance Criteria:**
- [ ] Filter dimensions include: Mission/Business Area, Problem Type, Technology, Maturity, Review Status, Contributing Office, Reuse Potential, Artifact Availability, and Lifecycle State
- [ ] Multiple filters within the same dimension combine with OR logic; filters across dimensions combine with AND logic
- [ ] Active filters display as removable chips so I can see and clear individual selections
- [ ] Facet counts show per option (e.g., "Azure Government Cloud (3)") so I know how many records match before selecting
- [ ] Anonymous users can only filter to Published lifecycle state; Draft/Submitted-for-Review are inaccessible to public users
- [ ] Unknown filter values submitted via API are silently ignored — not returned as errors

**Priority:** P0 | **Feature Ref:** F2.3

---

### US-2.3: View Search Results Count and Refine Without Losing Context
**As a** David Tran, **I want to** see how many records matched my search query and adjust my filters without starting over, **so that** I can iteratively narrow results to what is operationally relevant.

**Acceptance Criteria:**
- [ ] Total result count is displayed above results (e.g., "14 results for 'audio security'")
- [ ] Adjusting a filter updates results without clearing the search query or other active filters
- [ ] An empty query with no filters returns the full catalog (equivalent to the default browse view)
- [ ] When no results match, a helpful no-results message appears: "No records matched your search. Try different keywords or remove some filters."
- [ ] If the search service is unavailable, a message appears with a link to the catalog browse page

**Priority:** P0 | **Feature Ref:** F2.1, F2.5

---

## Epic 3: Innovation Record (F3)

> The central structured artifact — a complete, governed presentation of one innovation effort that any persona can use to understand the problem, findings, maturity, reuse potential, ownership, and next action.

### US-3.1: Read the Problem and What Was Explored
**As a** Margaret Holloway, **I want to** open an innovation record and immediately understand the mission problem it addresses, who is affected, and what approach was tested, **so that** I can determine relevance to my portfolio within the first section of the record.

**Acceptance Criteria:**
- [ ] The record displays a clear problem statement explaining the mission or operational problem, affected users, and why experimentation was appropriate
- [ ] The record displays what hypothesis or capability was tested and what was in scope
- [ ] Mission area and technology area tags appear on the record
- [ ] The record title is human-readable and unique among published records
- [ ] The one-to-three sentence summary accurately describes the problem or outcome

**Priority:** P0 | **Feature Ref:** F3.1, F3.2

---

### US-3.2: Understand Outcome, Evidence, and Key Findings
**As a** Margaret Holloway, **I want to** read what evidence was produced, what worked, what did not, and what decision the work enabled, **so that** I can assess whether the findings are credible and relevant enough to warrant further sponsorship.

**Acceptance Criteria:**
- [ ] The record displays: outcome summary, what worked, what did not work, uncertainty reduced, and what decision the evidence supports (where populated)
- [ ] Key findings are organized by category (architectural, security, cloud/platform, performance, testing, operational, cost, scalability) where applicable
- [ ] At least one findings category must be populated for a record to be published (publication gate)
- [ ] The source basis is stated (e.g., "Audio Security POC lessons-learned document, June 2026")
- [ ] Evidence and findings are presented honestly — negative results and limitations are not hidden

**Priority:** P0 | **Feature Ref:** F3.3, F3.4

---

### US-3.3: Assess Maturity, Readiness, and What Comes Next
**As a** David Tran, **I want to** see clearly what maturity stage a record is at, what the work is ready for, what it is not ready for, and what would be required to advance it, **so that** I can calibrate the level of organizational commitment adoption would require.

**Acceptance Criteria:**
- [ ] The record displays: maturity stage (with canonical label and visual badge), all applicable review statuses as distinct badges, what the work is ready for, what it is not ready for, and next-stage requirements
- [ ] Maturity and review status badges use distinct visual treatment — they are never interchangeable (SEC-11)
- [ ] A POC-maturity record never presents as production-ready — the applicable disclaimer is visible on the record
- [ ] Last-reviewed date and next-review date (when set) are displayed
- [ ] Maturity is curator-assigned and never automatically inferred; the value is one of the canonical six-stage vocabulary

**Priority:** P0 | **Feature Ref:** F3.5

---

### US-3.4: Read Reuse Guidance and Understand What My Office Can Realistically Take On
**As a** David Tran, **I want to** read structured reuse guidance that tells me what is reusable, what needs adaptation, what should not be copied, and what skills and services are required, **so that** I can advise my leadership on what adoption would actually cost my office.

**Acceptance Criteria:**
- [ ] The record displays (where populated): what can be reused, what should be adapted, what should not be copied directly, environment-specific assumptions, required skills, and required services/dependencies
- [ ] Production-readiness gaps are clearly stated — not summarized away
- [ ] Reuse potential (High / Moderate / Low / Not Assessed) is displayed
- [ ] Environment-specific assumptions are visible so I can determine whether findings apply to my infrastructure

**Priority:** P0 | **Feature Ref:** F3.6

---

### US-3.5: Identify Ownership, Attribution, and Who Owns the Next Step
**As a** Margaret Holloway, **I want to** see who contributed the innovation work, who currently owns it, and who I would be engaging with as a sponsor, **so that** I can initiate a credible, prepared conversation without cold-contacting I&R.

**Acceptance Criteria:**
- [ ] The record displays: contributing office(s), named contributors, I&R's contribution (where different from originator), current owner/steward, and operational or production owner (where applicable)
- [ ] Attribution statement is visible and credits the originating team
- [ ] Opportunity source is shown where populated (e.g., "Submitted by Court X", "I&R-initiated")
- [ ] At least one contributing office and an owner/steward are present on every published record (publication gate)

**Priority:** P0 | **Feature Ref:** F3.7

---

### US-3.6: Access Authoritative Source Artifacts from a Record
**As a** Priya Suresh, **I want to** navigate directly from an innovation record to authoritative artifacts (lessons-learned document, architecture diagram, repository, test results, security findings), **so that** I can verify findings in the original source without searching SharePoint or asking I&R where things are.

**Acceptance Criteria:**
- [ ] All linked artifacts appear in a structured list with: artifact type label, human-readable name, access notes, and URL (for non-restricted artifacts)
- [ ] Restricted artifacts show the name and access notes but not the URL to anonymous users
- [ ] Publishing a record does not change the access restriction status of its artifacts (SEC-04)
- [ ] The Hub links to artifacts at authoritative source systems — it does not host or copy artifact content
- [ ] Each artifact is classified by type (lessons learned, POC report, architecture diagram, demo video, repository, test results, security findings, technical playbook, etc.)

**Priority:** P0 | **Feature Ref:** F3.8

---

### US-3.7: Take a Contextual Next Action from a Record
**As a** David Tran, **I want to** see clear, contextually appropriate next-action options on an innovation record (request a demo, discuss a related use case, explore adoption, request technical guidance), **so that** I can initiate engagement with I&R directly from the record without figuring out who to email or how to frame the request.

**Acceptance Criteria:**
- [ ] Only enabled next actions for the record are displayed (configured per-record by a curator)
- [ ] Records with no configured next actions still display a default "Contact I&R" CTA
- [ ] CTAs are accessible by keyboard and meet WCAG 2.1 AA requirements
- [ ] Clicking a CTA opens a contextual engagement request form pre-populated with the record's context and request type
- [ ] Next-action description prose (if populated by curator) appears above the CTAs

**Priority:** P0 | **Feature Ref:** F3.9

---

## Epic 4: Executive and Technical Perspectives (F4)

> A single innovation record serves both executive and technical audiences through rendered perspective views — not duplicate records — grounded in the same underlying evidence.

### US-4.1: Switch Between Executive and Technical Views of the Same Record
**As a** Priya Suresh, **I want to** toggle between an executive perspective and a technical perspective on the same innovation record, **so that** I can access the full technical detail — architecture, tools, security findings, production gaps — that the executive view de-emphasizes, without reading a different or conflicting document.

**Acceptance Criteria:**
- [ ] A visible perspective toggle (tab, radio, or equivalent control) appears on every published innovation record detail page
- [ ] The toggle is keyboard-accessible and meets WCAG 2.1 AA requirements
- [ ] Both perspectives read from the same underlying record data — no values can conflict between views
- [ ] Switching perspective does not navigate to a different URL (the same URL serves both; `?view=technical` or `?view=executive` may be appended to support link sharing)
- [ ] Trust fields (maturity badge, review status badges, applicable disclaimer, last-reviewed date, owner/steward) appear in both perspectives — they are never suppressed in either view

**Priority:** P0 | **Feature Ref:** F4.1, F4.4

---

### US-4.2: Read the Executive Perspective for Decision-Making
**As a** Margaret Holloway, **I want to** read an executive perspective on an innovation record that prioritizes mission problem, outcome, key risks, maturity, decision recommendation, ownership, and next step, **so that** I can make a sponsorship or investment decision without needing to parse low-level architecture or infrastructure details.

**Acceptance Criteria:**
- [ ] The executive perspective leads with: problem summary, mission area, outcome narrative, key risks/constraints (security and operational findings), maturity stage with descriptive label, review status, and recommended next step with prominent CTAs
- [ ] Ownership and attribution are visible in the executive perspective
- [ ] The applicable trust notice/disclaimer is visible in the executive perspective
- [ ] Low-level fields (specific tools, infrastructure details, performance benchmarks, test coverage) are de-emphasized — not foregrounded in this view
- [ ] The `decision_enabled` field is displayed in the executive perspective when populated

**Priority:** P0 | **Feature Ref:** F4.2

---

### US-4.3: Read the Technical Perspective for Implementation Evaluation
**As a** Priya Suresh, **I want to** read a technical perspective that surfaces architecture findings, specific tools and services, security findings, testing gaps, production-readiness gaps, and reuse guidance in full detail, **so that** I can evaluate what is technically reusable and what I would need to solve independently before using any component in production.

**Acceptance Criteria:**
- [ ] The technical perspective prominently displays: what was tested (hypothesis/objective), scope, technologies and services used, architecture findings, security findings (visually distinct from general technical findings, SEC-11), cloud/platform findings, performance findings, testing findings, production-readiness gaps, and full reuse guidance
- [ ] Artifact links with types and access notes (and URLs for non-restricted artifacts) are prominently shown in the technical perspective
- [ ] Required skills and required services/dependencies are displayed
- [ ] Both `what_worked` and `what_did_not_work` are shown in the technical perspective
- [ ] Maturity and review status badges show the same values as in the executive perspective

**Priority:** P0 | **Feature Ref:** F4.3, F4.4

---

## Epic 5: Existing Lessons-Learned Content (F5)

> The Hub creates structured innovation records from existing I&R source materials — linking back to authoritative sources rather than migrating or rewriting them.

### US-5.1: Discover Existing Lessons-Learned Content Without Knowing Where the Document Lives
**As a** Priya Suresh, **I want to** find and understand the reusable value of an existing I&R lessons-learned document (such as the Audio Security POC) through the Hub catalog and search, **so that** I can access the key findings and trace back to the authoritative source without searching SharePoint or asking I&R staff to locate the document.

**Acceptance Criteria:**
- [ ] A structured innovation record exists for the Audio Security POC, discoverable via problem-oriented search (e.g., "court audio", "GPU separation", "Azure Gov constraints", "defense in depth")
- [ ] The record's problem statement, key findings, maturity, review status, ownership, and source basis are all populated from the authoritative lessons-learned source
- [ ] The record links to the authoritative lessons-learned document as an artifact; if restricted, access notes explain how to obtain access
- [ ] The record clearly states its maturity as Experiment/POC and carries a disclaimer: "This record summarizes a proof-of-concept effort. The findings are not production-ready."
- [ ] The `source_basis` field cites the source document precisely (title, date, author/office, location)

**Priority:** P0 | **Feature Ref:** F5.1, F5.2, F5.4, F5.5

---

### US-5.2: The Audio Security POC Record Exercises the Full Content Model
**As a** Jasmine Okafor, **I want to** publish the Audio Security POC as a fully populated innovation record covering all content model sections, **so that** it validates the Hub's content model and serves as a reference example for future curation.

**Acceptance Criteria:**
- [ ] The Audio Security POC record populates: Problem & Context, What Was Explored, Outcome & Evidence, Key Findings (architectural, security, cloud/platform, performance, testing, operational), Maturity & Readiness, Reuse Guidance, Ownership & Attribution, and Authoritative Artifact links
- [ ] Maturity is set to `Experiment / POC`; review status includes at least `Technically Reviewed`
- [ ] The record passes the publication gate: all 15 required fields are non-empty before publishing
- [ ] Both executive and technical perspectives render correctly from this record
- [ ] The record is discoverable via search for mission problem language related to court audio security

**Priority:** P0 | **Feature Ref:** F5.3, F5.5

---

### US-5.3: Curate a Lessons-Learned Source Without Migrating or Copying It
**As a** Jasmine Okafor, **I want to** create an innovation record derived from an existing authoritative document while keeping the original document in its source location, **so that** the Hub does not create uncontrolled copies or become an alternative repository.

**Acceptance Criteria:**
- [ ] The curator can create a new draft record and populate fields from a source document without uploading or copying the source document into the Hub
- [ ] The authoritative source document is linked via an artifact record pointing to its source URL (SharePoint, Git, etc.)
- [ ] The `source_basis` field identifies the source document precisely
- [ ] If the source document is restricted, `is_restricted = true` is set on the artifact; public users see the artifact name and access notes but not the URL
- [ ] Publishing the record does not change artifact access restriction settings (SEC-04)

**Priority:** P0 | **Feature Ref:** F5.1, F5.2, F5.3, F5.4

---

## Epic 6: Opportunity Submission (F6)

> A structured, problem-first flow for stakeholders to bring mission problems and workflow friction to I&R — not solution requests — with explicit non-acceptance disclosure.

### US-6.1: Submit a Mission Problem to I&R Starting with the Problem, Not a Solution
**As a** David Tran, **I want to** submit a structured description of a workflow problem my office is experiencing — framed around the mission problem, not a requested application — so that I&R has enough context to assess whether it aligns with their research priorities.

**Acceptance Criteria:**
- [ ] The opportunity submission form is publicly accessible without authentication
- [ ] The non-acceptance statement is displayed prominently at the top of the form before any fields: "Submitting an opportunity does not imply acceptance into the I&R portfolio. I&R will review submissions and reach out if the opportunity aligns with our current capacity and priorities."
- [ ] The form requires: request type selection, problem title, problem description (≥ 50 chars), who is affected, impact, submitting office, submitter name, and submitter email
- [ ] The form captures optional context: current workflow, desired outcome, known constraints, related work attempted, discovery participants, and additional context
- [ ] The submitter must acknowledge the non-acceptance statement (checkbox) and consent to contact before the form can be submitted
- [ ] Selecting "Share Existing Innovation Work" as request type displays inline guidance and a link to the contribution form (F7) — the submitter may continue with the opportunity form if preferred
- [ ] Upon successful submission, a confirmation page shows: receipt confirmation, non-acceptance re-statement, and a reference number

**Priority:** P1 | **Feature Ref:** F6.1, F6.2, F6.3, F6.4

---

### US-6.2: Characterize the Type of Opportunity Being Submitted
**As a** Carlos Rivera, **I want to** select the type of opportunity I'm submitting (current mission problem, emerging technology question, request for research, potential POC, collaboration opportunity, etc.), **so that** I&R can triage it appropriately and I can frame my submission correctly.

**Acceptance Criteria:**
- [ ] The form provides a request type selector with canonical values: Current Mission Problem, Emerging Technology Question, Request for Research, Potential POC, Request for Demonstration, Collaboration Opportunity, Share Existing Innovation Work, and Other
- [ ] Selecting "Share Existing Innovation Work" triggers inline guidance to redirect to the contribution flow (F7)
- [ ] Request type is required — the form cannot be submitted without a selection
- [ ] The selected request type is stored with the submission and visible to curators in the queue

**Priority:** P1 | **Feature Ref:** F6.3

---

### US-6.3: Receive Clear Confirmation That Submission Does Not Imply Acceptance
**As a** Carlos Rivera, **I want to** receive an explicit confirmation after submitting that my opportunity is under review and that submission does not mean I&R will take it on, **so that** I don't misinterpret submission as a commitment from I&R.

**Acceptance Criteria:**
- [ ] The confirmation page restates: "Your submission has been received. Submission does not imply acceptance into the I&R portfolio. You will be contacted if I&R determines the opportunity aligns with current priorities."
- [ ] The confirmation page displays a submission reference number
- [ ] No automated approval or acknowledgment email is sent to the submitter for MVP (submission enters curator queue)
- [ ] Rate limiting is enforced: maximum 5 submissions per IP per hour; exceeding returns a "Too many submissions. Please try again later." message
- [ ] If a required field is missing, the form shows inline per-field validation messages and does not submit

**Priority:** P1 | **Feature Ref:** F6.4, F6.5

---

## Epic 7: Share Existing Innovation Work (F7)

> A separate contribution flow for teams with existing innovation to share — distinct from opportunity submission — with attribution preserved through curation.

### US-7.1: Submit Existing Innovation Work Through a Dedicated Contribution Flow
**As a** Carlos Rivera, **I want to** submit existing innovation work my team has completed through a dedicated contribution form (separate from the opportunity submission form), **so that** I can clearly distinguish sharing work-already-done from asking I&R to investigate a problem.

**Acceptance Criteria:**
- [ ] The contribution form lives at a distinct URL from the opportunity submission form (F6)
- [ ] The non-endorsement statement is displayed prominently before fields: "Submitting existing innovation work does not imply I&R central endorsement. If I&R determines the work is suitable for publication, attribution will be preserved and you will be notified."
- [ ] The form requires: contribution title, problem addressed, work description, contributing office, contributor names, current maturity, current owner, owner contact email, collaboration preference, submitter name, submitter email, acknowledgment of non-endorsement, and consent to contact
- [ ] The form accepts optional: artifact links (URLs/descriptions), known limitations, and additional context
- [ ] Collaboration preference is selectable from canonical values: Open for Reuse, Seeking Collaborator, Informational/Reference Only, Seeking Adopter, Discuss with I&R First

**Priority:** P1 | **Feature Ref:** F7.1, F7.2

---

### US-7.2: Preserve Attribution Through the Curation Process
**As a** Carlos Rivera, **I want to** know that my team's contribution credit will be preserved if I&R curates and publishes our work, **so that** my office gets recognition for the innovation investment we made.

**Acceptance Criteria:**
- [ ] The confirmation page states that attribution and current ownership information were captured and will be preserved through curation
- [ ] A reference number is provided for follow-up
- [ ] If I&R creates a record from the contribution, the published record's `contributing_offices` array includes the contributor's office and `contributor_names` includes the original named contributors
- [ ] The `attribution_statement` on the published record must credit the originating team — it cannot be emptied during curation
- [ ] Curators receive a warning if they attempt to remove all references to the original contributing office or contributor names
- [ ] The link from the published record back to the originating contribution (`source_contribution_id`) is immutable once set

**Priority:** P1 | **Feature Ref:** F7.3, F7.4

---

### US-7.3: Understand the Curation Process and What Happens After Submission
**As a** Carlos Rivera, **I want to** understand what happens to my contribution after I submit it — that it enters a curation review and that no record publishes without curator review, **so that** I'm not surprised to find my work published without context or review.

**Acceptance Criteria:**
- [ ] The confirmation page explains: receipt confirmed, work will not be published without I&R curation review, attribution will be preserved if selected for curation, and I&R will contact the contributor if the work is selected
- [ ] The submitted contribution appears in the curator's contribution queue (F9.13) with `status = pending`
- [ ] Submission does not trigger automatic publication — curator review is required before any publication
- [ ] Rate limiting is enforced: maximum 5 submissions per IP per hour

**Priority:** P1 | **Feature Ref:** F7.4

---

## Epic 8: Engagement Routing (F8)

> Record-level and general calls to action that capture user intent as traceable engagement requests and route them to I&R — with separate database recording independent of email delivery.

### US-8.1: Request a Demo or Adoption Discussion from an Innovation Record
**As a** David Tran, **I want to** request a demonstration or adoption discussion directly from an innovation record page with the record's context automatically attached, **so that** I&R receives a coherent, context-rich request without me having to separately look up who to contact or describe the record I'm asking about.

**Acceptance Criteria:**
- [ ] A "Request a Demonstration" or "Explore Adoption" CTA button is present on records where configured by a curator
- [ ] Clicking the CTA opens an engagement request form pre-populated with: request type, originating record ID and title, and a suggested email subject (e.g., "Demo Request – [Record Title]")
- [ ] The form requires: requester name, requester office, requester email, need description (≥ 20 chars), and consent to contact
- [ ] The form accepts optional: desired next step and preferred contact method
- [ ] Submitting the form persists the engagement request to the database before initiating email routing
- [ ] The user receives a confirmation with reference number: "I&R will review your request and reach out using the contact information you provided."
- [ ] The display label reads "TSIO Innovation & Research" — not the raw email address — in public-facing text

**Priority:** P0 | **Feature Ref:** F8.1, F8.2, F8.5, F8.6

---

### US-8.2: Contact I&R Generally Without a Specific Record
**As a** Margaret Holloway, **I want to** initiate a general engagement with I&R from a site-wide "Contact I&R" call to action (not tied to a specific record), **so that** I can ask a broader question or introduce a discussion without needing to identify a specific innovation record first.

**Acceptance Criteria:**
- [ ] A general "Contact I&R" CTA is available from the Hub navigation or an engagement page, not tied to any specific record
- [ ] The general engagement form collects the same fields as a record-level form but with `originating_record_id` null
- [ ] The engagement request is persisted and appears in the curator's engagement activity queue (F9.14)
- [ ] Email routing is initiated to the configured I&R address and separately recorded in the database (both must occur)
- [ ] Rate limiting is enforced: maximum 10 engagement requests per IP per hour

**Priority:** P0 | **Feature Ref:** F8.1, F8.3

---

### US-8.3: Trust That My Engagement Request Was Recorded Even if Email Fails
**As a** David Tran, **I want to** know that my engagement request is recorded in the system regardless of whether the email routing succeeded, **so that** my outreach is not silently lost if there is an email delivery issue.

**Acceptance Criteria:**
- [ ] The engagement request is persisted to the database before email routing is initiated — persistence and routing are separate actions
- [ ] If server-side email fails, the engagement request remains in the database and is flagged in the curator admin view for manual follow-up; the user does not see an error
- [ ] If `mailto:` client-side routing is used, the confirmation tells the user: "Your request has been recorded. If your email client opened, please send the pre-filled email to complete your request."
- [ ] The `routing_address_at_submission` is captured on the engagement record for audit purposes — preserving what address was active at the time
- [ ] If no routing address is configured, the user sees: "Engagement routing is not currently configured. Please contact I&R directly." (SEC-07)

**Priority:** P0 | **Feature Ref:** F8.3, F8.4

---

## Epic 9: Curation and Administration (F9)

> The complete back-office for authorized I&R curators — governing record lifecycle, submissions, engagement, audit history, and settings — with publication gates preventing incomplete records from reaching stakeholders.

### US-9.1: View a Curator Dashboard Showing Items Requiring Attention
**As a** Jasmine Okafor, **I want to** see a dashboard summary of records needing review, pending submissions, recent engagement, and recent audit events when I log into the curator area, **so that** I can triage my work without manually scanning every list.

**Acceptance Criteria:**
- [ ] The curator dashboard is accessible only to authenticated Curator or Admin users (SEC-01, SEC-02)
- [ ] The dashboard displays: record counts by publication state (Draft, Submitted for Review, Published, Superseded, Archived, Retired)
- [ ] The dashboard highlights records where `next_review_date` ≤ today + 30 days
- [ ] The dashboard shows counts for pending opportunity submissions and pending contribution submissions
- [ ] The dashboard shows a count of engagement requests received in the last 7 days with a link to the full queue
- [ ] The dashboard shows the last 5 audit events with actor, action, record reference, and timestamp
- [ ] All counts reflect live data at page load time — not stale cached values

**Priority:** P0 | **Feature Ref:** F9.1

---

### US-9.2: Manage All Records Across Lifecycle States from a Filterable List
**As a** Jasmine Okafor, **I want to** browse and filter all innovation records — including drafts, superseded, and archived records not visible to public users — from a curator record management list, **so that** I can locate any record and take governance action on it.

**Acceptance Criteria:**
- [ ] The curator record list shows all records in all lifecycle states, not just published ones
- [ ] Columns include: title, maturity, review status, publication state, engagement indicator, last reviewed date, created at, updated at, updated by
- [ ] Filter options include: publication state, maturity, review status, mission area, technology area, contributing office, and "Needs Review" (overdue next review date)
- [ ] Per-record actions include: edit, view public (published only), publish/unpublish, supersede, archive, retire
- [ ] Default sort is by `updated_at` descending; curator can sort by any column
- [ ] Pagination defaults to 25 records per page with options for 25, 50, 100

**Priority:** P0 | **Feature Ref:** F9.2

---

### US-9.3: Create a New Innovation Record from Source Material
**As a** Jasmine Okafor, **I want to** create a new innovation record from scratch (or pre-populated from an accepted contribution) and save it as a draft at any time, **so that** I can work incrementally without being forced to complete all fields before saving.

**Acceptance Criteria:**
- [ ] Creating a new record sets `publication_state = draft`, captures `created_by` and `created_at` automatically
- [ ] The record can be saved as a draft without all publication gate fields — only `title` is required when starting a record (to prevent empty records accumulating)
- [ ] Controlled vocabulary fields (maturity, review statuses) must use canonical values when populated
- [ ] Creating from a contribution pre-populates fields from the `innovation_contributions` record and sets `source_contribution_id` immutably
- [ ] An audit event `record_created` is generated on creation
- [ ] The curator is navigated to the record edit view after creation

**Priority:** P0 | **Feature Ref:** F9.3

---

### US-9.4: Edit Any Record Field and Manage Artifacts
**As a** Jasmine Okafor, **I want to** edit all fields on any innovation record — including adding, reordering, and removing artifact links — with optimistic concurrency protection, **so that** I can maintain record accuracy without accidentally overwriting another curator's concurrent changes.

**Acceptance Criteria:**
- [ ] All fields defined in the Innovation Record (Groups 0–9) are editable by an authorized curator
- [ ] Editing a published or superseded record automatically generates an audit event listing changed fields
- [ ] If another curator has edited the record concurrently, a 409 conflict error prompts the curator to reload and reapply changes
- [ ] Draft records support auto-save (debounced, every 30 seconds of inactivity) without generating audit events
- [ ] Curators can add, edit, reorder, and remove artifact links; removing the only artifact when no other source basis exists triggers a warning
- [ ] Restricted artifacts (`is_restricted = true`) have their URL hidden from public API responses — URL is only returned for Curator/Admin users

**Priority:** P0 | **Feature Ref:** F9.4, F9.5

---

### US-9.5: Assign and Update Maturity and Review Status Independently
**As a** Jasmine Okafor, **I want to** update a record's maturity and review status independently from each other, with in-product definitions available, **so that** I apply governance consistently across records without consulting external documentation.

**Acceptance Criteria:**
- [ ] Maturity can be set to any canonical value at any time — there is no enforced progression
- [ ] Review status is stored as an array; multiple values may apply simultaneously (e.g., a record can be both Technically Reviewed and Security Reviewed without being Policy Reviewed)
- [ ] `security_reviewed` is visually distinct from `technically_reviewed` in the curator UI (SEC-11)
- [ ] Every maturity change generates a `maturity_changed` audit event (previous value, new value, curator, timestamp, optional reason)
- [ ] Every review status change generates a `review_status_changed` audit event
- [ ] Changing maturity never automatically changes review status; changing review status never automatically changes maturity
- [ ] Maturity and review status definitions from F9.16 Content Model Reference are accessible inline in the edit UI
- [ ] Adding `validated_for_reuse` to a published record requires a confirmation step

**Priority:** P0 | **Feature Ref:** F9.6, F9.7

---

### US-9.6: Manage Attribution and Ownership with Preservation Rules for Contributed Records
**As a** Jasmine Okafor, **I want to** update ownership and attribution fields while being protected from accidentally erasing a contributor's credit on records that originated from a submitted contribution, **so that** the Hub's attribution promise to contributors is enforced by the system, not just policy.

**Acceptance Criteria:**
- [ ] Attribution fields editable: contributing offices, contributor names, I&R contribution, owner/steward, owner contact, operational owner, production owner, attribution statement, and opportunity source
- [ ] For records with `source_contribution_id` set, editing `contributing_offices` to remove the original contributing office triggers a curator warning before saving
- [ ] Attempting to publish a contributed record with an empty `attribution_statement` fails the publication gate
- [ ] Any change to owner/steward, contributing offices, or attribution statement generates an `attribution_updated` audit event
- [ ] The `source_contribution_id` link is immutable once set — it cannot be removed from a record

**Priority:** P0 | **Feature Ref:** F9.8

---

### US-9.7: Move a Record Through Its Full Publication Lifecycle
**As a** Jasmine Okafor, **I want to** move an innovation record from draft through review, publication, and eventually to supersession, archiving, or retirement — with the publication gate enforced at the point of publishing, **so that** incomplete or misleading records can never reach stakeholders.

**Acceptance Criteria:**
- [ ] Supported lifecycle transitions: Draft → Submitted for Review → Published; Published → Draft (unpublish); Published → Superseded (requires reason or successor record); Published → Archived; Published → Retired
- [ ] A record may only transition to `published` if all 15 publication gate fields are non-empty; if any are missing, the system returns a list of missing fields
- [ ] Every publication state transition generates a `publication_state_changed` audit event
- [ ] A superseded record remains publicly discoverable with a prominent supersession banner and, if available, a link to the successor record
- [ ] An archived record is visible in catalog/search with a clear "Archived" indicator — it is not presented as a current recommendation
- [ ] A retired record is hidden from public search results by default; visible to curators
- [ ] Re-activating superseded, archived, or retired records to draft requires curator confirmation and generates an audit event with a mandatory reason

**Priority:** P0 | **Feature Ref:** F9.9, F9.10

---

### US-9.8: Enforce the Publication Gate Before a Record Goes Live
**As a** Jasmine Okafor, **I want to** be prevented from publishing a record that is missing required trust fields — problem statement, owner/steward, maturity, review status, attribution, source basis, last-reviewed date, and applicable disclaimer — **so that** stakeholders never encounter a published record with gaps that undermine trust.

**Acceptance Criteria:**
- [ ] The system checks all 15 publication gate fields when a curator initiates publication
- [ ] If any required field is missing, publication is blocked and the system returns a specific list of the missing fields (e.g., "Cannot publish. Missing required fields: Source Basis, Attribution Statement")
- [ ] Records with missing fields may be saved as draft without triggering publication gate validation
- [ ] A maturity/disclaimer mismatch warning is displayed (not a hard block) when a curator publishes a POC-sourced record with maturity set to `Production / Validated Pattern`
- [ ] If a required trust field is found empty on an already-published record (data integrity failure), the record is suppressed from the public catalog and flagged for curator attention in the admin view

**Priority:** P0 | **Feature Ref:** F9.10

---

### US-9.9: Review Complete Audit History for a Record
**As a** Jasmine Okafor, **I want to** view a chronological audit history of all material changes to a record's content, governance, lifecycle, and attribution, **so that** I can trace what changed, who changed it, and when — for accountability and compliance purposes.

**Acceptance Criteria:**
- [ ] The audit history is accessible per record from the curator edit view
- [ ] Audit events captured include: `record_created`, `record_updated` (with list of changed fields), `maturity_changed` (previous + new value + optional reason), `review_status_changed` (previous + new values array), `publication_state_changed`, `attribution_updated`, `artifact_removed`, and `artifact_restricted_changed`
- [ ] Each audit event shows: event type, actor (curator name/ID), timestamp, and change detail
- [ ] Audit events are append-only — they cannot be edited or deleted by curators
- [ ] Authentication and authorization events material to governance are also captured (SEC-03)

**Priority:** P0 | **Feature Ref:** F9.11

---

### US-9.10: Triage the Opportunity Submission Queue and Disposition Submissions
**As a** Jasmine Okafor, **I want to** review incoming opportunity submissions in a queue, disposition each one, and track which are pending, accepted, declined, or need more information, **so that** I&R can respond to stakeholder submissions in an organized, traceable way.

**Acceptance Criteria:**
- [ ] The opportunity submission queue shows all submissions with `status = pending` prominently; other statuses are filterable
- [ ] Each submission is viewable in full detail: all submitted fields, request type, submitting office, contact info, and submission date
- [ ] Disposition actions available: accepted (with notes), declined (with notes), needs more information, duplicate
- [ ] Disposition is recorded per submission and visible in the queue list view
- [ ] The queue is accessible only to authenticated Curator or Admin users (SEC-01)
- [ ] Submitter contact information is handled per SEC-05 privacy requirements

**Priority:** P0 | **Feature Ref:** F9.12

---

### US-9.11: Triage the Contribution Queue and Initiate Record Creation from an Accepted Contribution
**As a** Jasmine Okafor, **I want to** review innovation contribution submissions, disposition each one, and initiate a pre-populated draft innovation record from accepted contributions, **so that** I can efficiently convert validated external innovation work into Hub records while preserving attribution.

**Acceptance Criteria:**
- [ ] The contribution queue shows all submissions with their disposition status
- [ ] Each contribution is viewable in full: problem addressed, work description, contributing office, contributors, maturity, owner, artifacts, limitations, and collaboration preference
- [ ] Disposition values: Pending Review, Accepted for Curation, Declined, Needs More Information, Duplicate, Curated into Record
- [ ] For contributions with `accepted_for_curation` disposition, a "Create Record from Contribution" action is available that creates a draft record pre-populated from the contribution and sets `source_contribution_id` immutably
- [ ] The pre-populated record retains the contributing office, contributor names, and work description — curator may enrich but must not erase original attribution
- [ ] Attribution preservation rules (F7.3) are enforced at publication on records created from contributions

**Priority:** P0 | **Feature Ref:** F9.13

---

### US-9.12: Review Engagement Activity and Record Follow-Up Status
**As a** Jasmine Okafor, **I want to** see all engagement requests associated with each record — and for general Hub contact — and record a follow-up status for each, **so that** I&R can track whether stakeholder requests have been addressed.

**Acceptance Criteria:**
- [ ] The engagement activity queue lists all received engagement requests with: request type, originating record (if any), requester name, office, email, submission date, and current follow-up status
- [ ] Curators can record a follow-up status on each engagement request (e.g., responded, in progress, no action needed, referred)
- [ ] The queue is filterable by: request type, originating record, date range, and follow-up status
- [ ] Engagement requests flagged for email routing failures are highlighted for manual curator follow-up
- [ ] Curator access only (SEC-01); submitter contact information handled per SEC-05

**Priority:** P0 | **Feature Ref:** F9.14

---

### US-9.13: Configure the Engagement Routing Destination Without Code Deployment
**As a** Jasmine Okafor, **I want to** update the I&R engagement routing email address through a settings interface, **so that** if the shared inbox changes, I can update routing immediately without involving developers or waiting for a code deployment.

**Acceptance Criteria:**
- [ ] The Settings Management interface allows an authorized Admin to view and update the engagement routing address
- [ ] Changing the routing address generates an audit event (SEC-03)
- [ ] The default routing address (`AOml_TSO_IRB_Team@ao.uscourts.gov`) is stored in Hub settings, not in application code (SEC-08)
- [ ] The `routing_address_at_submission` field on each engagement request preserves what address was active at submission time — routing address changes do not retroactively alter past records
- [ ] Only Admin-role users may change the routing address; Curators may view but not change
- [ ] The new address takes effect for all subsequent engagement requests without requiring redeployment

**Priority:** P0 | **Feature Ref:** F9.15

---

### US-9.14: Access the Content Model Reference to Apply Governance Consistently
**As a** Jasmine Okafor, **I want to** access in-product definitions of maturity stages, review status values, lifecycle states, and publication gate requirements without consulting external documents, **so that** I can apply governance labels consistently across all records.

**Acceptance Criteria:**
- [ ] The Content Model Reference is accessible from within the curator edit UI (e.g., inline help, sidebar panel, or linked reference page)
- [ ] It provides definitions for all canonical maturity values, review status values, publication state values, and engagement indicator values
- [ ] Maturity-specific disclaimer templates are provided to help curators select appropriate applicable disclaimer text
- [ ] The reference is accessible only to authenticated Curator or Admin users
- [ ] The reference content is the same for all curators — it is not editable by curators in MVP (configuration-managed)

**Priority:** P0 | **Feature Ref:** F9.16

---

### US-9-SEC: Deployment Security Verification

**As a** receiving technical team member,  
**I want** to verify that development-only access mechanisms are not active in operational environments  
**So that** the application meets SEC-09 before any non-development deployment.

**References:** PRD SEC-09, F9 (F9.15 Settings Management), PRD §9 NFRs (Security)

**Acceptance Criteria:**
- AC-1: The application startup process raises a fatal error if `NODE_ENV=production` and the development-only auth stub is still enabled — the app refuses to start rather than expose a development bypass
- AC-2: Deployment documentation includes a pre-deployment checklist item: "Confirm development auth stub is disabled and production identity provider is configured"
- AC-3 (SEC-10): The deployed application returns HTTP security headers on all responses including at minimum: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` (or `Content-Security-Policy frame-ancestors`), `Referrer-Policy`; headers are verified via automated scan before release
- AC-4 (SEC-12): A signed-off security decision register exists before any protected curator/admin feature is deployed to a non-development environment; all open security decisions are classified as Implementation Blocker, Approved Assumption, or Approved Development Stub with documented rationale

---

## Summary Table

| Epic | Stories | P0 | P1 | P2 |
|------|---------|----|----|-----|
| Epic 1: Innovation Catalog (F1) | 3 | 3 | 0 | 0 |
| Epic 2: Search and Discovery (F2) | 3 | 3 | 0 | 0 |
| Epic 3: Innovation Record (F3) | 7 | 7 | 0 | 0 |
| Epic 4: Executive & Technical Perspectives (F4) | 3 | 3 | 0 | 0 |
| Epic 5: Existing Lessons-Learned Content (F5) | 3 | 3 | 0 | 0 |
| Epic 6: Opportunity Submission (F6) | 3 | 0 | 3 | 0 |
| Epic 7: Share Existing Innovation Work (F7) | 3 | 0 | 3 | 0 |
| Epic 8: Engagement Routing (F8) | 3 | 3 | 0 | 0 |
| Epic 9: Curation and Administration (F9) | 14 | 14 | 0 | 0 |
| **Total** | **42** | **36** | **6** | **0** |

---

## Story Index

| Story ID | Title | Priority | Feature Ref | Persona |
|----------|-------|----------|-------------|---------|
| US-1.1 | Browse the Catalog and Assess Records at a Glance | P0 | F1.1–F1.6 | PER-01, PER-02 |
| US-1.2 | Understand Lifecycle State Without Opening a Record | P0 | F1.5, F1.6 | PER-02 |
| US-1.3 | Identify Engagement Opportunities from the Catalog | P0 | F1.4 | PER-02 |
| US-2.1 | Search by Mission Problem Language | P0 | F2.1, F2.2, F2.4, F2.5 | PER-01 |
| US-2.2 | Refine Results with Faceted Filters | P0 | F2.3 | PER-03 |
| US-2.3 | View Search Results Count and Refine Without Losing Context | P0 | F2.1, F2.5 | PER-02 |
| US-3.1 | Read the Problem and What Was Explored | P0 | F3.1, F3.2 | PER-01 |
| US-3.2 | Understand Outcome, Evidence, and Key Findings | P0 | F3.3, F3.4 | PER-01 |
| US-3.3 | Assess Maturity, Readiness, and What Comes Next | P0 | F3.5 | PER-02 |
| US-3.4 | Read Reuse Guidance and Understand Adoption Cost | P0 | F3.6 | PER-02 |
| US-3.5 | Identify Ownership, Attribution, and Who Owns the Next Step | P0 | F3.7 | PER-01 |
| US-3.6 | Access Authoritative Source Artifacts from a Record | P0 | F3.8 | PER-03 |
| US-3.7 | Take a Contextual Next Action from a Record | P0 | F3.9 | PER-02 |
| US-4.1 | Switch Between Executive and Technical Views of the Same Record | P0 | F4.1, F4.4 | PER-03 |
| US-4.2 | Read the Executive Perspective for Decision-Making | P0 | F4.2 | PER-01 |
| US-4.3 | Read the Technical Perspective for Implementation Evaluation | P0 | F4.3, F4.4 | PER-03 |
| US-5.1 | Discover Existing Lessons-Learned Content | P0 | F5.1, F5.2, F5.4, F5.5 | PER-03 |
| US-5.2 | Audio Security POC Record Exercises Full Content Model | P0 | F5.3, F5.5 | PER-05 |
| US-5.3 | Curate a Lessons-Learned Source Without Migrating It | P0 | F5.1–F5.4 | PER-05 |
| US-6.1 | Submit a Mission Problem Starting with the Problem | P1 | F6.1, F6.2, F6.3, F6.4 | PER-02 |
| US-6.2 | Characterize the Type of Opportunity Being Submitted | P1 | F6.3 | PER-04 |
| US-6.3 | Receive Clear Confirmation Submission Does Not Imply Acceptance | P1 | F6.4, F6.5 | PER-04 |
| US-7.1 | Submit Existing Innovation Work Through a Dedicated Flow | P1 | F7.1, F7.2 | PER-04 |
| US-7.2 | Preserve Attribution Through the Curation Process | P1 | F7.3, F7.4 | PER-04 |
| US-7.3 | Understand the Curation Process After Submission | P1 | F7.4 | PER-04 |
| US-8.1 | Request a Demo or Adoption Discussion from a Record | P0 | F8.1, F8.2, F8.5, F8.6 | PER-02 |
| US-8.2 | Contact I&R Generally Without a Specific Record | P0 | F8.1, F8.3 | PER-01 |
| US-8.3 | Trust That My Engagement Request Was Recorded | P0 | F8.3, F8.4 | PER-02 |
| US-9.1 | View a Curator Dashboard Showing Items Requiring Attention | P0 | F9.1 | PER-05 |
| US-9.2 | Manage All Records Across Lifecycle States | P0 | F9.2 | PER-05 |
| US-9.3 | Create a New Innovation Record from Source Material | P0 | F9.3 | PER-05 |
| US-9.4 | Edit Any Record Field and Manage Artifacts | P0 | F9.4, F9.5 | PER-05 |
| US-9.5 | Assign and Update Maturity and Review Status Independently | P0 | F9.6, F9.7 | PER-05 |
| US-9.6 | Manage Attribution and Ownership with Preservation Rules | P0 | F9.8 | PER-05 |
| US-9.7 | Move a Record Through Its Full Publication Lifecycle | P0 | F9.9, F9.10 | PER-05 |
| US-9.8 | Enforce the Publication Gate Before a Record Goes Live | P0 | F9.10 | PER-05 |
| US-9.9 | Review Complete Audit History for a Record | P0 | F9.11 | PER-05 |
| US-9.10 | Triage the Opportunity Submission Queue | P0 | F9.12 | PER-05 |
| US-9.11 | Triage Contribution Queue and Initiate Record Creation | P0 | F9.13 | PER-05 |
| US-9.12 | Review Engagement Activity and Record Follow-Up Status | P0 | F9.14 | PER-05 |
| US-9.13 | Configure Engagement Routing Without Code Deployment | P0 | F9.15 | PER-05 |
| US-9.14 | Access Content Model Reference for Consistent Governance | P0 | F9.16 | PER-05 |

---

## Priority Definitions

| Priority | Definition |
|----------|------------|
| **P0** | Critical — Must have for MVP; blocks launch if absent |
| **P1** | High — Important for first release; MVP engagement completeness |
| **P2** | Medium — Nice to have; may defer to post-MVP |
| **P3** | Low — Future consideration |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-08-11*
