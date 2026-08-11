# User Story Map
## TSIO Innovation Hub MVP (TechSur Innovation Hub)

| Field | Value |
|-------|-------|
| **Product Name** | TSIO Innovation Hub MVP (TechSur Innovation Hub) |
| **Date** | 2026-08-11 |
| **Related Personas** | PERSONAS-TechSurHub.md |
| **Related Journeys** | JOURNEYS-TechSurHub.md |
| **Related JTBD** | JTBD-TechSurHub.md |
| **Related User Stories** | UserStories-TechSurHub.md |
| **Related PRD** | PRD-TechSurHub.md |

---

## Overview

This story map organizes all 42 user stories (US-1.1 through US-9.14) along two axes:

- **Horizontal axis (lanes):** User journey stages drawn from JOURNEYS-TechSurHub.md — one lane per primary journey
- **Vertical axis (rows):** Activities within each stage, mapped to epics (F1–F9) and individual stories

The map is structured around four primary user journeys, prioritized as defined in PRD §5:

| Priority | Journey | Primary Persona |
|----------|---------|-----------------|
| Primary | Discover and Act on Existing Innovation | PER-01, PER-02, PER-03 |
| Secondary | Submit an Opportunity | PER-02, PER-04 |
| Secondary | Share Existing Innovation | PER-04 |
| Operational | Curate and Govern Content | PER-05 |

**Release structure:** MVP has a single release (v1). All P0 stories are v1 MVP. P1 stories (F6 and F7) are also v1 MVP per the product requirements ("P1 — High, MVP engagement"). No stories are deferred to a post-MVP release.

### NaC Concept

NaC (Natural Acceptance Criteria) bridges JTBD outcomes to testable story criteria by deriving each criterion from the intersection of:

1. **JTBD outcome** — the measurable result the persona is hiring the product to produce
2. **Journey stage** — the specific context (when/where) the criterion applies
3. **User Story** — the implemented capability that enables the outcome

NaC are not invented. Every NaC in this document is traceable to a JTBD outcome from JTBD-TechSurHub.md. NaC derivation chains are in the NaC Derivation Table section.

---
## Story Map Matrix

### Discover and Act on Existing Innovation
**Journeys:** JRN-01.1 (Margaret), JRN-02.1 (David), JRN-03.1 (Priya)
**Epics:** F1 (Catalog), F2 (Search), F3 (Record), F4 (Perspectives), F5 (Lessons-Learned), F8 (Engagement)

| Activity | Persona | Epic | Stories | NaC | Release |
|----------|---------|------|---------|-----|---------|
| Arrive at catalog / browse records | PER-01, PER-02, PER-03 | Epic 1: Innovation Catalog (F1) | US-1.1: Browse the Catalog and Assess Records at a Glance | JTBD-01.1: Given a mission-area keyword, when the user browses the catalog, then each card shows maturity badge, review status badge(s), contributing office, and lifecycle state — no two records appear visually equivalent regardless of maturity | v1 |
| Assess lifecycle state and currency of records without opening them | PER-02, PER-03 | Epic 1: Innovation Catalog (F1) | US-1.2: Understand Lifecycle State Without Opening a Record | JTBD-01.1: Given a catalog with superseded and published records, when a user scans cards, then superseded records carry a distinct visual indicator and last-reviewed date is visible on every card | v1 |
| Identify records with active engagement options | PER-01, PER-02 | Epic 1: Innovation Catalog (F1) | US-1.3: Identify Engagement Opportunities from the Catalog | JTBD-02.1: Given catalog cards, when David scans for adoption-seeking records, then engagement indicator badges (e.g., "Seeking Adoption Partner") appear on configured records without opening each one | v1 |
| Search using mission/problem language | PER-01, PER-02, PER-03 | Epic 2: Search and Discovery (F2) | US-2.1: Search by Mission Problem Language | JTBD-01.1: Given the query "protect court audio," when the user searches, then the Audio Security POC surfaces without requiring the formal project title — results show maturity, review status, and lifecycle state | v1 |
| Refine results with faceted filters | PER-03 | Epic 2: Search and Discovery (F2) | US-2.2: Refine Results with Faceted Filters | JTBD-03.2: Given the catalog filter for "Security reviewed" review status, when Priya applies the filter, then only security-reviewed records appear and no "Technically reviewed" only record is included in results | v1 |
| Iterate search without losing query context | PER-02 | Epic 2: Search and Discovery (F2) | US-2.3: View Search Results Count and Refine Without Losing Context | JTBD-02.1: Given an active search query, when David adjusts a filter, then the result count updates, the query is preserved, and an empty-results state displays a helpful message rather than an error | v1 |
| Read problem statement and what was explored | PER-01, PER-02 | Epic 3: Innovation Record (F3) | US-3.1: Read the Problem and What Was Explored | JTBD-01.1: Given an open innovation record, when Margaret reads the first section, then the problem statement, affected users, and hypothesis are present — relevance to portfolio can be assessed from this section alone | v1 |
| Understand outcome, evidence, and key findings | PER-01, PER-02 | Epic 3: Innovation Record (F3) | US-3.2: Understand Outcome, Evidence, and Key Findings | JTBD-01.1: Given a published record, when a decision-maker reads the outcome section, then evidence produced, what worked, what did not work, and the decision the evidence supports are all present — negative results are not hidden | v1 |
| Assess maturity, readiness, and advancement requirements | PER-01, PER-02 | Epic 3: Innovation Record (F3) | US-3.3: Assess Maturity, Readiness, and What Comes Next | JTBD-01.1 / JTBD-02.1: Given a record at Experiment/POC maturity, when a user reads the maturity section, then maturity badge, all review status badges (distinct from maturity), what the work is ready for, what it is not ready for, and next-stage requirements are all visible — no inferring from prose | v1 |
| Read reuse guidance and adoption requirements | PER-02, PER-03 | Epic 3: Innovation Record (F3) | US-3.4: Read Reuse Guidance and Understand Adoption Cost | JTBD-02.1: Given reuse guidance, when David reads it, then it explicitly names what his office must own, required skills, service dependencies, environment-specific assumptions, and what is not transferable — not a general capability description | v1 |
| Identify ownership, attribution, and contact path | PER-01, PER-02 | Epic 3: Innovation Record (F3) | US-3.5: Identify Ownership, Attribution, and Who Owns the Next Step | JTBD-01.1: Given a published record, when Margaret reads the ownership section, then contributing office, named contributors, current owner/steward, and opportunity source are present — she can initiate a conversation without cold-contacting I&R | v1 |
| Access authoritative source artifacts | PER-03 | Epic 3: Innovation Record (F3) | US-3.6: Access Authoritative Source Artifacts from a Record | JTBD-03.1: Given a record with artifact links, when Priya opens the technical perspective, then at least one authoritative artifact link (POC report, architecture diagram, or security findings) is directly accessible — no external repository search required | v1 |
| Take a contextual next action from a record | PER-01, PER-02, PER-03 | Epic 3: Innovation Record (F3) | US-3.7: Take a Contextual Next Action from a Record | JTBD-01.3 / JTBD-02.1: Given a record page, when a user identifies a relevant next step, then only configured CTAs are displayed and each opens a pre-populated engagement form with originating record context attached | v1 |
| Switch between executive and technical views | PER-01, PER-02, PER-03 | Epic 4: Executive & Technical Perspectives (F4) | US-4.1: Switch Between Executive and Technical Views of the Same Record | JTBD-01.2: Given a published record, when an executive and a technical adopter each select their perspective, then both views reflect identical maturity, review status, ownership, and evidence — no field conflicts between perspectives | v1 |
| Read executive perspective for decision-making | PER-01, PER-02 | Epic 4: Executive & Technical Perspectives (F4) | US-4.2: Read the Executive Perspective for Decision-Making | JTBD-01.2: Given the executive perspective, when Margaret reads it, then problem summary, outcome, key risks/constraints, maturity, review status, decision recommendation, and ownership are all present without requiring access to technical appendices | v1 |
| Read technical perspective for implementation evaluation | PER-03 | Epic 4: Executive & Technical Perspectives (F4) | US-4.3: Read the Technical Perspective for Implementation Evaluation | JTBD-03.1: Given the technical perspective, when Priya reads it, then architecture decisions, tools/services, security findings (visually distinct), testing gaps, production-readiness gaps, and full reuse guidance are all surfaced — limitations are not softened | v1 |
| Discover existing lessons-learned content via search | PER-01, PER-03 | Epic 5: Lessons-Learned Content (F5) | US-5.1: Discover Existing Lessons-Learned Content Without Knowing Where the Document Lives | JTBD-03.1: Given the query "court audio GPU separation," when a user searches, then the Audio Security POC record surfaces, its source basis cites the authoritative document, and the record links to the authoritative artifact | v1 |
| Publish Audio Security POC as full-model reference record | PER-05 | Epic 5: Lessons-Learned Content (F5) | US-5.2: The Audio Security POC Record Exercises the Full Content Model | JTBD-05.1: Given the Audio Security POC record, when published, then all content model sections are populated, both perspectives render correctly, and the record is discoverable via problem-oriented search | v1 |
| Curate a lessons-learned source without migrating or copying it | PER-05 | Epic 5: Lessons-Learned Content (F5) | US-5.3: Curate a Lessons-Learned Source Without Migrating It | JTBD-05.1: Given a source document in SharePoint, when a curator creates an innovation record, then the Hub links to the authoritative URL rather than copying content — publishing the record does not change the artifact's access restriction | v1 |
| Request a demo or adoption discussion from a record | PER-01, PER-02, PER-03 | Epic 8: Engagement Routing (F8) | US-8.1: Request a Demo or Adoption Discussion from an Innovation Record | JTBD-01.3 / JTBD-02.1: Given a record with configured CTAs, when a user submits an engagement request, then I&R receives the originating record ID, request type, requester name, office, and description — and the request is persisted in the database before email routing | v1 |
| Contact I&R without a specific record | PER-01 | Epic 8: Engagement Routing (F8) | US-8.2: Contact I&R Generally Without a Specific Record | JTBD-01.3: Given a general "Contact I&R" CTA, when Margaret submits a general inquiry, then the request is persisted with null originating record and routed to the configured I&R address — she does not see the raw email address | v1 |
| Trust that engagement request was recorded | PER-02 | Epic 8: Engagement Routing (F8) | US-8.3: Trust That My Engagement Request Was Recorded | JTBD-02.1: Given an engagement submission, when email routing fails, then the request remains in the database and is flagged for curator manual follow-up — the user sees a success confirmation with reference number | v1 |

### Submit an Opportunity
**Journeys:** JRN-04.2 (Carlos), JRN-02.1 Submit leg (David)
**Epic:** F6 (Opportunity Submission)

| Activity | Persona | Epic | Stories | NaC | Release |
|----------|---------|------|---------|-----|---------|
| Find and enter the opportunity submission flow (not the contribution flow) | PER-02, PER-04 | Epic 6: Opportunity Submission (F6) | US-6.1: Submit a Mission Problem Starting with the Problem | JTBD-02.2 / JTBD-04.2: Given the submission entry point, when a user selects "Submit a Problem for I&R Consideration," then the non-acceptance statement is displayed prominently before any fields and the flow is unambiguously distinct from the contribution flow | v1 |
| Characterize the type of opportunity being submitted | PER-02, PER-04 | Epic 6: Opportunity Submission (F6) | US-6.2: Characterize the Type of Opportunity Being Submitted | JTBD-04.2: Given the opportunity form, when Carlos selects "Current Mission Problem," then the request type is stored with the submission and visible to curators — the form cannot be submitted without a request type selection | v1 |
| Receive explicit non-acceptance confirmation | PER-04 | Epic 6: Opportunity Submission (F6) | US-6.3: Receive Clear Confirmation That Submission Does Not Imply Acceptance | JTBD-04.2: Given a submitted opportunity, when Carlos reads the confirmation page, then it explicitly states submission does not imply acceptance, displays a reference number, and provides language Carlos can show his program manager | v1 |

---

### Share Existing Innovation
**Journey:** JRN-04.1 (Carlos)
**Epic:** F7 (Share Existing Innovation Work)

| Activity | Persona | Epic | Stories | NaC | Release |
|----------|---------|------|---------|-----|---------|
| Find and enter the contribution flow (distinct from opportunity submission) | PER-04 | Epic 7: Share Existing Innovation Work (F7) | US-7.1: Submit Existing Innovation Work Through a Dedicated Contribution Flow | JTBD-04.1: Given the contribution entry point, when Carlos navigates to "Share Existing Innovation Work," then the flow is at a distinct URL from the opportunity form and the non-endorsement statement appears before any fields | v1 |
| Preserve attribution through the curation process | PER-04 | Epic 7: Share Existing Innovation Work (F7) | US-7.2: Preserve Attribution Through the Curation Process | JTBD-04.1: Given an accepted contribution seeded into a published record, when a curator publishes the record, then the contributing office and named contributors are present in the published record and the attribution_statement cannot be emptied — attribution survives the full pipeline | v1 |
| Understand what happens after submission | PER-04 | Epic 7: Share Existing Innovation Work (F7) | US-7.3: Understand the Curation Process and What Happens After Submission | JTBD-04.1: Given a submitted contribution, when Carlos reads the confirmation page, then it states the work will not be published without curation review, attribution will be preserved, and I&R will contact the contributor if the work is selected — no automatic publication | v1 |

---

### Curate and Govern Content
**Journeys:** JRN-05.1 (Jasmine — curation), JRN-05.2 (Jasmine — daily operations)
**Epic:** F9 (Curation and Administration)

| Activity | Persona | Epic | Stories | NaC | Release |
|----------|---------|------|---------|-----|---------|
| Open curator dashboard and triage all pending action items | PER-05 | Epic 9: Curation and Administration (F9) | US-9.1: View a Curator Dashboard Showing Items Requiring Attention | JTBD-05.2: Given the curator dashboard, when Jasmine opens it, then live counts appear for: records needing review, pending opportunity submissions, pending contribution submissions, and engagement requests without follow-up — all from live product data, no stale cache | v1 |
| Browse and filter all records across lifecycle states | PER-05 | Epic 9: Curation and Administration (F9) | US-9.2: Manage All Records Across Lifecycle States from a Filterable List | JTBD-05.2: Given the curator record list, when Jasmine filters for "Needs Review," then only records with overdue next-review dates appear — drafts, superseded, and archived records are visible (not just published) | v1 |
| Create a new innovation record from source material or contribution | PER-05 | Epic 9: Curation and Administration (F9) | US-9.3: Create a New Innovation Record from Source Material | JTBD-05.1: Given a new record creation action, when Jasmine creates from an accepted contribution, then fields are pre-populated from the contribution and source_contribution_id is set immutably — only title is required to save as draft | v1 |
| Edit all record fields and manage artifacts | PER-05 | Epic 9: Curation and Administration (F9) | US-9.4: Edit Any Record Field and Manage Artifacts | JTBD-05.1: Given a published record under concurrent edit, when a second curator saves changes, then a 409 conflict prompts the first curator to reload — no silent overwrites; all field edits on published records generate audit events | v1 |
| Assign maturity and review status independently using in-product definitions | PER-05 | Epic 9: Curation and Administration (F9) | US-9.5: Assign and Update Maturity and Review Status Independently | JTBD-05.1 / JTBD-03.2: Given maturity and review status fields, when Jasmine sets maturity to Experiment/POC and review status to Technically Reviewed, then changing maturity never auto-changes review status and vice versa — both generate independent audit events with previous and new values | v1 |
| Manage attribution and ownership with preservation rules | PER-05 | Epic 9: Curation and Administration (F9) | US-9.6: Manage Attribution and Ownership with Preservation Rules for Contributed Records | JTBD-05.1: Given a record with source_contribution_id set, when a curator attempts to remove the contributing office, then the system displays a warning before saving — the attribution_statement cannot be emptied at publication | v1 |
| Move a record through full publication lifecycle | PER-05 | Epic 9: Curation and Administration (F9) | US-9.7: Move a Record Through Its Full Publication Lifecycle | JTBD-05.1: Given a record in Draft state, when Jasmine initiates publication, then the system checks all 15 gate fields before allowing transition to Published — every lifecycle transition generates a publication_state_changed audit event | v1 |
| Enforce publication gate before a record goes live | PER-05 | Epic 9: Curation and Administration (F9) | US-9.8: Enforce the Publication Gate Before a Record Goes Live | JTBD-05.1: Given a record with the maturity field empty, when Jasmine attempts to publish, then publication is blocked and the system returns a specific list of missing required fields — the record does not reach Published state | v1 |
| Review complete audit history for a record | PER-05 | Epic 9: Curation and Administration (F9) | US-9.9: Review Complete Audit History for a Record | JTBD-05.1 / JTBD-05.2: Given a record's audit history view, when Jasmine reviews it, then all material changes (content, governance, lifecycle, attribution) appear in chronological order with actor, timestamp, and change detail — audit events are append-only | v1 |
| Triage opportunity submission queue and disposition submissions | PER-05 | Epic 9: Curation and Administration (F9) | US-9.10: Triage the Opportunity Submission Queue and Disposition Submissions | JTBD-05.2: Given the opportunity queue, when Jasmine opens a submission, then all context fields (affected users, workflow, impact, constraints, office, contact) are visible in a standard layout — disposition actions (accepted, declined, needs info, duplicate) update workflow state without back-and-forth with submitter | v1 |
| Triage contribution queue and initiate record creation from accepted contributions | PER-05 | Epic 9: Curation and Administration (F9) | US-9.11: Triage the Contribution Queue and Initiate Record Creation from an Accepted Contribution | JTBD-05.2: Given an accepted contribution, when Jasmine clicks "Create Record from Contribution," then a draft record is pre-populated with contributing office, contributor names, work description, and source_contribution_id set immutably — no re-entry of attribution fields required | v1 |
| Review engagement activity and record follow-up status | PER-05 | Epic 9: Curation and Administration (F9) | US-9.12: Review Engagement Activity and Record Follow-Up Status | JTBD-05.2: Given the engagement activity log, when Jasmine opens it, then every request displays originating record (if any), request type, requester name, office, and follow-up status — no manual cross-referencing with email threads required | v1 |
| Configure engagement routing destination without code deployment | PER-05 | Epic 9: Curation and Administration (F9) | US-9.13: Configure the Engagement Routing Destination Without Code Deployment | JTBD-05.2: Given the Settings Management interface, when an Admin updates the routing address, then the change takes effect for all subsequent engagement requests without redeployment and a configuration-change audit event is generated | v1 |
| Access in-product content model reference for consistent governance | PER-05 | Epic 9: Curation and Administration (F9) | US-9.14: Access the Content Model Reference to Apply Governance Consistently | JTBD-05.1: Given the curator edit UI, when Jasmine is unsure of a maturity definition, then the Content Model Reference is accessible inline — no external document lookup required; governance is applied consistently across all records | v1 |

---

## NaC Derivation Table

Every NaC is derived from the intersection of a JTBD outcome, a journey stage, and a user story. No NaC is invented outside this traceability chain.

| JTBD ID | Outcome | Journey Stage | NaC | Stories |
|---------|---------|---------------|-----|---------|
| JTBD-01.1 | Decision-maker locates and assesses a relevant record in under 10 minutes without prior project knowledge | JRN-01.1: Arrive | Catalog loads all published records; each card shows maturity badge, review status badge(s), contributing office, and last-reviewed date without opening the record | US-1.1, US-1.2 |
| JTBD-01.1 | Decision-maker locates and assesses a relevant record in under 10 minutes without prior project knowledge | JRN-01.1: Search | Query "protect court audio" surfaces Audio Security POC without requiring the formal project title; trust fields are preserved in every result card | US-2.1, US-2.3 |
| JTBD-01.1 | Decision-maker locates and assesses a relevant record in under 10 minutes without prior project knowledge | JRN-01.1: Scan Results | Maturity badges and review status badges use visually distinct treatment — an Experiment/POC is never styled the same as a Production/Validated Pattern | US-1.1, US-1.2 |
| JTBD-01.1 | Decision-maker locates and assesses a relevant record in under 10 minutes without prior project knowledge | JRN-01.1: Read Record | Problem statement, outcome, evidence produced, what worked, what did not, maturity, review status, risks, and ownership are all present from the executive perspective — negative results are not hidden | US-3.1, US-3.2, US-3.3, US-3.5 |
| JTBD-01.2 | Executive and technical perspectives share identical evidence, maturity, and ownership | JRN-01.1: Read Record | Both executive and technical perspectives reflect identical maturity, review status, outcome evidence, and current owner — no field in one perspective contradicts a field in the other | US-4.1, US-4.2, US-4.3 |
| JTBD-01.2 | Executive and technical perspectives share identical evidence, maturity, and ownership | JRN-01.1: Assess | Executive perspective contains risks/constraints, maturity label with descriptive text, review status, and recommended next step — readable without technical appendices | US-4.2 |
| JTBD-01.3 | Engagement request arrives at I&R with record context attached | JRN-01.1: Act | I&R receives originating record ID, request type, requester name, office, and description in a single action from the record page — no separate context-setting email required | US-8.1, US-8.2, US-8.3 |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | JRN-02.1: Arrive & Search | Problem-oriented search returns records using operational workflow language without requiring formal project names; result count and filters are visible | US-2.1, US-2.3 |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | JRN-02.1: Scan Catalog | Reuse/engagement indicator on catalog card identifies "Seeking Adoption Partner" records without opening each one | US-1.3 |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | JRN-02.1: Read Record | Reuse guidance explicitly states what the adopting office must own, what dependencies apply, what skills are required, and whether I&R is seeking an adopter | US-3.4 |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | JRN-02.1: Assess Adoption | Ownership and contributing office are named; engagement indicator states current engagement posture (seeking adopter, available for demo, etc.) | US-3.3, US-3.5 |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | JRN-02.1: Brief Leadership | Executive perspective is self-contained — can be shared with a division chief without producing a separate write-up | US-4.2 |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | JRN-02.1: Act | Demonstration request arrives at I&R with originating record ID and David's operational context — I&R can prepare a response without a context-setting exchange | US-8.1, US-8.3 |
| JTBD-02.2 | Problem submission is structured, labeled as research inquiry, and confirmed non-acceptance | JRN-04.2: Find Submission Entry Point | Opportunity flow entry is distinct from contribution flow entry; choosing the wrong path is made difficult by explicit labeling | US-6.1 |
| JTBD-02.2 | Problem submission is structured, labeled as research inquiry, and confirmed non-acceptance | JRN-04.2: Fill Problem Description | Form captures: problem title, description, who is affected, impact, current workflow, desired outcome, constraints, submitting office, and contact — I&R can assess portfolio fit without a back-and-forth | US-6.1, US-6.2 |
| JTBD-02.2 | Problem submission is structured, labeled as research inquiry, and confirmed non-acceptance | JRN-04.2: Receive Confirmation | Confirmation page explicitly states submission does not imply acceptance, displays reference number, and labels the submission as a research inquiry | US-6.3 |
| JTBD-03.1 | Technical adopter locates authoritative artifacts and production-readiness gaps from one record | JRN-03.1: Switch to Technical Perspective | Technical perspective surfaces architecture decisions, tools/services used, security findings (visually distinct), testing gaps, production-readiness gaps, and full reuse guidance — limitations not softened | US-4.3, US-3.6 |
| JTBD-03.1 | Technical adopter locates authoritative artifacts and production-readiness gaps from one record | JRN-03.1: Inspect Reuse Guidance | Reuse guidance distinguishes portable architecture patterns from environment-specific configurations and POC-only scaffolding; required skills and service dependencies are named | US-3.4 |
| JTBD-03.1 | Technical adopter locates authoritative artifacts and production-readiness gaps from one record | JRN-03.1: Follow Artifact Links | Authoritative artifact links (POC report, architecture diagram, security findings) are directly accessible from the record — no external repository search required; restricted artifacts show name and access notes but not URL | US-3.6, US-5.1 |
| JTBD-03.1 | Technical adopter locates authoritative artifacts and production-readiness gaps from one record | JRN-03.1: Request Guidance | Technical guidance request captures originating record ID and specific technical question — I&R routes to the right contact without a context-setting exchange | US-8.1 |
| JTBD-03.2 | Maturity and review status are visibly independent and filterable | JRN-03.1: Search & Filter | Applying filter for "Security reviewed" returns only security-reviewed records; "Technically reviewed" only records are excluded from that filtered result set | US-2.2 |
| JTBD-03.2 | Maturity and review status are visibly independent and filterable | JRN-03.1: Scan Results | Maturity and review status appear as separate, labeled badges on every catalog card — a technically reviewed Experiment/POC is visually distinguishable from a security-reviewed Prototype/Pilot at a glance | US-1.1, US-1.2 |
| JTBD-03.2 | Maturity and review status are visibly independent and filterable | JRN-03.1: Switch to Technical Perspective | In the technical perspective, maturity and review status badges show identical values as in the executive perspective — independent fields, consistent display across both views | US-4.1, US-9.5 |
| JTBD-04.1 | Contribution is received with attribution and curation gate visible | JRN-04.1: Pre-Submission Search | Problem-oriented search returns related records so contributors can self-identify overlap before submitting | US-2.1 |
| JTBD-04.1 | Contribution is received with attribution and curation gate visible | JRN-04.1: Find Contribution Entry Point | Contribution flow entry (F7) is at a distinct URL from opportunity submission (F6); flow labels and descriptive copy make the distinction unambiguous before the first question is answered | US-7.1 |
| JTBD-04.1 | Contribution is received with attribution and curation gate visible | JRN-04.1: Fill Contribution Form | Form requires: contributing office, contributor names, current maturity, current owner, artifact links, known limitations, and collaboration preference — all attribution fields are explicitly required and labeled | US-7.1 |
| JTBD-04.1 | Contribution is received with attribution and curation gate visible | JRN-04.1: Receive Confirmation | Confirmation page names contributing office, contributor names, and explicitly states curation is required before publication — no record publishes automatically from a contribution | US-7.2, US-7.3 |
| JTBD-04.2 | Problem submission clearly distinguished from innovation contribution | JRN-04.2: Characterize Request Type | Request type selector provides pre-defined options including "Current Mission Problem" and "Share Existing Innovation Work" — selecting the latter triggers guidance to redirect to the contribution flow | US-6.2 |
| JTBD-04.2 | Problem submission clearly distinguished from innovation contribution | JRN-04.2: Review Non-Acceptance Language | Non-acceptance statement is displayed at the point of submission (not in help documentation) — Carlos can show this to his program manager before hitting submit | US-6.1, US-6.3 |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | JRN-05.1: Create Record | Record creation interface presents fields in content-model sequence; only title is required to save as draft — no empty records accumulate | US-9.3 |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | JRN-05.1: Apply Content Model | Content model reference is accessible inline in the edit UI — maturity definitions, review status values, and publication gate requirements are one click away, no external document required | US-9.4, US-9.14 |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | JRN-05.1: Set Maturity and Review Status | Changing maturity never auto-changes review status and vice versa; both fields generate independent audit events — a technically reviewed POC cannot be mistakenly presented as security-reviewed | US-9.5 |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | JRN-05.1: Manage Attribution and Artifacts | Contributing office and contributor names are required on contributed records; attempting to remove original contributing office triggers a curator warning — attribution_statement cannot be emptied at publication | US-9.6 |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | JRN-05.1: Verify Publication Gate | System checks all 15 gate fields before allowing transition to Published; if any field is missing, publication is blocked and missing fields are listed specifically | US-9.7, US-9.8 |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | JRN-05.1: Publish Record | Publication is an explicit lifecycle action captured in audit history with timestamp and actor identity — zero published records can be missing required trust fields | US-9.7, US-9.9 |
| JTBD-05.2 | Curator dashboard surfaces all pending action items without external tools | JRN-05.2: Open Dashboard | Dashboard shows live counts for: records needing review action, new opportunity submissions, new contribution submissions, engagement requests without follow-up — all sourced from live product data | US-9.1 |
| JTBD-05.2 | Curator dashboard surfaces all pending action items without external tools | JRN-05.2: Work Opportunity Queue | Queue displays each submission with full context fields, workflow state, submitting office, and contact — disposition options are explicit workflow states | US-9.10 |
| JTBD-05.2 | Curator dashboard surfaces all pending action items without external tools | JRN-05.2: Work Contribution Queue | Accepted contribution can directly seed a new record creation workflow with all attribution fields pre-populated — no re-entry required | US-9.11 |
| JTBD-05.2 | Curator dashboard surfaces all pending action items without external tools | JRN-05.2: Handle Engagement Activity | Engagement log associates each request with originating record, request type, user context, and follow-up status — no manual cross-referencing with email threads | US-9.12 |
| JTBD-05.2 | Curator dashboard surfaces all pending action items without external tools | JRN-05.2: Update Stale Record | Material content corrections and last-reviewed date updates are captured in audit history with timestamp and actor identity | US-9.4, US-9.9 |

---
## Release Planning

### Release v1: MVP — "Governed Discovery, Credible Records, Structured Engagement"

This is the single MVP release. All 42 stories (36 P0 + 6 P1) are included. The v1 release delivers four complete journey paths simultaneously, with the "Discover and Act on Existing Innovation" journey fully optimized as the primary path.

**Rationale for single release:** The MVP is structured to prove the complete content, trust, lifecycle, and engagement model before additional content scale. Splitting P0 and P1 stories across releases would leave personas without complete journey paths — for example, separating F6/F7 (P1) from F8 (P0) would give David a working engagement request but no way to submit a problem, and Carlos no way to contribute work. The PRD explicitly classifies F6 and F7 as "P1 — High — MVP engagement," meaning they are part of v1.

#### Journey 1: Discover and Act on Existing Innovation (Primary)
**Persona:** PER-01, PER-02, PER-03
**JTBD Addressed:** JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-03.1, JTBD-03.2
**Stories:** US-1.1, US-1.2, US-1.3, US-2.1, US-2.2, US-2.3, US-3.1, US-3.2, US-3.3, US-3.4, US-3.5, US-3.6, US-3.7, US-4.1, US-4.2, US-4.3, US-5.1, US-5.2, US-5.3, US-8.1, US-8.2, US-8.3

**Journey completion gate:**
- [ ] Margaret can locate the Audio Security POC using "court audio" language, read the executive perspective, assess maturity and evidence, and submit a briefing request — in under 10 minutes
- [ ] David can determine adoption requirements from the reuse guidance without contacting I&R, and submit a demonstration request with originating record context attached
- [ ] Priya can filter to technically reviewed records, access the full technical perspective, follow artifact links to authoritative sources, and submit a targeted technical guidance request
- [ ] All NaC for JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-03.1, JTBD-03.2 pass

#### Journey 2: Submit an Opportunity (Secondary)
**Persona:** PER-02, PER-04
**JTBD Addressed:** JTBD-02.2, JTBD-04.2
**Stories:** US-6.1, US-6.2, US-6.3

**Journey completion gate:**
- [ ] David can submit a workflow problem with structured context and receive a confirmation that explicitly states non-acceptance
- [ ] Carlos can submit a mission problem, select "Current Mission Problem" as request type, and show the confirmation page to his program manager as evidence that the request is framed as research inquiry only
- [ ] All NaC for JTBD-02.2, JTBD-04.2 pass

#### Journey 3: Share Existing Innovation (Secondary)
**Persona:** PER-04
**JTBD Addressed:** JTBD-04.1
**Stories:** US-7.1, US-7.2, US-7.3

**Journey completion gate:**
- [ ] Carlos can submit existing innovation work through the contribution flow (distinct from opportunity flow), with contributor attribution, maturity context, artifact links, and collaboration preference intact
- [ ] Confirmation page names his contributors, records current ownership, and explicitly states curation is required before publication
- [ ] Attribution survives the submission-to-publication pipeline: contributing office and named contributors appear in the published record and cannot be erased
- [ ] All NaC for JTBD-04.1 pass

#### Journey 4: Curate and Govern Content (Operational)
**Persona:** PER-05
**JTBD Addressed:** JTBD-05.1, JTBD-05.2
**Stories:** US-9.1, US-9.2, US-9.3, US-9.4, US-9.5, US-9.6, US-9.7, US-9.8, US-9.9, US-9.10, US-9.11, US-9.12, US-9.13, US-9.14

**Journey completion gate:**
- [ ] Jasmine can create a publication-gate-compliant Audio Security POC record from the lessons-learned document and publish it through the full lifecycle without consulting external documentation
- [ ] Dashboard surfaces all pending action items within 30 seconds of page load using live data
- [ ] Publication gate blocks any record missing any of the 15 required fields, listing missing fields specifically
- [ ] Audit history captures all material changes with actor, timestamp, and change detail
- [ ] Settings management allows routing address update without code deployment
- [ ] Zero published records are missing required trust fields (maturity, review status, owner, last-reviewed date, disclaimer)
- [ ] All NaC for JTBD-05.1, JTBD-05.2 pass

#### Launch Content Gate (PRD §12)
- [ ] At least 3 published innovation records present at launch
- [ ] At least 1 record with significant reusable technical findings and source artifacts (Audio Security POC)
- [ ] At least 1 record that supports an executive decision or sponsorship discussion
- [ ] At least 1 record seeking an adopter, collaborator, or concrete engagement
- [ ] At least 1 archived or superseded experiment retained for institutional learning
- [ ] Every published record includes: maturity, review status, attribution, owner/steward, last-reviewed date, source basis, and applicable disclaimer

---
## Coverage Analysis

### Persona Coverage (v1)

| Persona | Primary Journey | Stories Served | JTBD Satisfied |
|---------|----------------|----------------|----------------|
| PER-01 Margaret Holloway (Decision-Maker) | JRN-01.1: Discover and Act on Existing Innovation | US-1.1, US-1.2, US-1.3, US-2.1, US-2.3, US-3.1, US-3.2, US-3.3, US-3.5, US-4.1, US-4.2, US-5.1, US-8.1, US-8.2 | JTBD-01.1 (full), JTBD-01.2 (full), JTBD-01.3 (full) |
| PER-02 David Tran (Operational Leader) | JRN-02.1: Assess and Initiate Adoption; JRN-04.2: Submit Opportunity | US-1.1, US-1.2, US-1.3, US-2.1, US-2.3, US-3.1, US-3.3, US-3.4, US-3.5, US-3.7, US-4.2, US-6.1, US-6.2, US-6.3, US-8.1, US-8.3 | JTBD-02.1 (full), JTBD-02.2 (full) |
| PER-03 Priya Suresh (Technical Adopter) | JRN-03.1: Evaluate Technical Reusability | US-1.1, US-1.2, US-2.1, US-2.2, US-3.3, US-3.4, US-3.6, US-4.1, US-4.3, US-5.1, US-8.1 | JTBD-03.1 (full), JTBD-03.2 (full) |
| PER-04 Carlos Rivera (Innovation Contributor) | JRN-04.1: Share Existing Innovation; JRN-04.2: Submit Opportunity | US-2.1, US-6.1, US-6.2, US-6.3, US-7.1, US-7.2, US-7.3 | JTBD-04.1 (full), JTBD-04.2 (full) |
| PER-05 Jasmine Okafor (I&R Curator) | JRN-05.1: Curate and Publish; JRN-05.2: Daily Operations | US-5.2, US-5.3, US-9.1 through US-9.14 (14 stories) | JTBD-05.1 (full), JTBD-05.2 (full) |

All 5 personas are fully served in v1. All 11 JTBD jobs are addressed.

---

### JTBD Coverage (v1)

| JTBD ID | Persona | Release | Stories | NaC Count |
|---------|---------|---------|---------|-----------|
| JTBD-01.1 | PER-01 | v1 | US-1.1, US-1.2, US-2.1, US-2.3, US-3.1, US-3.2, US-3.3, US-3.5 | 8 |
| JTBD-01.2 | PER-01 | v1 | US-4.1, US-4.2, US-4.3 | 3 |
| JTBD-01.3 | PER-01 | v1 | US-8.1, US-8.2, US-8.3 | 3 |
| JTBD-02.1 | PER-02 | v1 | US-1.3, US-2.1, US-2.3, US-3.4, US-3.5, US-4.2, US-8.1, US-8.3 | 7 |
| JTBD-02.2 | PER-02 | v1 | US-6.1, US-6.2, US-6.3 | 3 |
| JTBD-03.1 | PER-03 | v1 | US-3.4, US-3.6, US-4.3, US-5.1, US-8.1 | 5 |
| JTBD-03.2 | PER-03 | v1 | US-1.1, US-1.2, US-2.2, US-4.1, US-9.5 | 5 |
| JTBD-04.1 | PER-04 | v1 | US-2.1, US-7.1, US-7.2, US-7.3 | 4 |
| JTBD-04.2 | PER-04 | v1 | US-6.1, US-6.2, US-6.3 | 3 |
| JTBD-05.1 | PER-05 | v1 | US-5.2, US-5.3, US-9.3, US-9.4, US-9.5, US-9.6, US-9.7, US-9.8, US-9.9, US-9.14 | 10 |
| JTBD-05.2 | PER-05 | v1 | US-9.1, US-9.2, US-9.4, US-9.9, US-9.10, US-9.11, US-9.12, US-9.13 | 8 |

---

### Gap Analysis

**JTBD without stories:** None. All 11 JTBD jobs are addressed by at least one story in v1.

**Journey stages without feature coverage:** None. All journey stages across JRN-01.1, JRN-02.1, JRN-03.1, JRN-04.1, JRN-04.2, JRN-05.1, and JRN-05.2 are covered by at least one story.

**Orphan stories (not mapped to a journey stage):** None. All 42 stories (US-1.1 through US-9.14) are mapped to at least one journey stage. Cross-journey coverage notes:

- **US-2.2** (faceted filters) maps to JRN-03.1 Search & Filter as primary; also serves JRN-01.1 Scan Results and JRN-02.1 Scan Catalog
- **US-3.3** (maturity and readiness) maps to JRN-01.1 Assess, JRN-02.1 Assess Adoption, and JRN-03.1 Switch to Technical Perspective — it is a shared cross-journey story
- **US-3.7** (contextual next action) maps to JRN-01.1 Act, JRN-02.1 Act, and JRN-03.1 Request Guidance
- **US-8.1** (request demo/adoption) maps to the Act stage of JRN-01.1, JRN-02.1, and JRN-03.1 — it is the single engagement routing story serving three primary journeys
- **US-9.4** (edit record and manage artifacts) maps to JRN-05.1 Apply Content Model and JRN-05.2 Update Stale Record

**Personas without a complete journey in v1:** None. Every persona has at minimum one end-to-end journey path completed in v1.

**Post-MVP deferred items:** None. The PRD §14 explicitly lists items that are out of scope and none map to stories in the UserStories document. No stories were deferred from v1 — all 42 are MVP.

---
## NaC-to-Acceptance Criteria Mapping

This table verifies that each NaC aligns with the acceptance criteria stated in UserStories-TechSurHub.md. Where the NaC is a restatement or specialization of an AC, alignment is marked Yes. Where an NaC adds a journey-stage context not explicitly in the AC (but implied), it is marked Yes with a note.

| NaC | Story | AC from UserStories (key criterion) | Aligned? |
|-----|-------|-------------------------------------|----------|
| Catalog cards show maturity badge, review status badge(s), contributing office, and last-reviewed date without opening the record | US-1.1 | "Each catalog card displays: title, one-sentence summary, technology/capability area, maturity badge, review status badge(s), contributing office, and last-reviewed date" | Yes |
| Maturity badges and review status badges use visually distinct treatment — Experiment/POC never styled the same as Production/Validated Pattern | US-1.1 | "Maturity badges use visually distinct, non-interchangeable treatment"; "Review status badges are visually distinct from maturity badges (SEC-11)" | Yes |
| Superseded records carry a distinct visual indicator; last-reviewed date visible on every card | US-1.2 | "Superseded records in the catalog display a clear 'Superseded' indicator visible without opening the record"; "The last-reviewed date appears on every catalog card" | Yes |
| Engagement indicator badges appear on configured records; no placeholder on unconfigured records | US-1.3 | "Engagement indicator values appear as badges on catalog cards when configured by a curator"; "Records with no engagement indicator show no badge" | Yes |
| Query "protect court audio" surfaces Audio Security POC without requiring formal project title; trust fields in every result | US-2.1 | "A search query like 'protect court audio' surfaces the Audio Security POC record without requiring the user to enter its exact title"; "Every result card displays maturity badge, review status badge(s), and lifecycle state indicator" | Yes |
| Filter for "Security reviewed" returns only security-reviewed records; no "Technically reviewed" only records appear | US-2.2 | "Filter dimensions include: ... Review Status"; "Multiple filters across dimensions combine with AND logic" | Yes — AC covers filter mechanics; NaC adds specific security-reviewed exclusivity from JTBD-03.2 |
| Result count displayed; adjusting filter preserves query; empty-results shows helpful message | US-2.3 | "Total result count is displayed above results"; "Adjusting a filter updates results without clearing the search query"; "When no results match, a helpful no-results message appears" | Yes |
| Problem statement, affected users, and hypothesis are present; relevance can be assessed from first section alone | US-3.1 | "The record displays a clear problem statement explaining the mission or operational problem, affected users, and why experimentation was appropriate"; "The record displays what hypothesis or capability was tested and what was in scope" | Yes |
| Outcome, what worked, what did not work, decision the evidence supports are all present; negative results not hidden | US-3.2 | "The record displays: outcome summary, what worked, what did not work, uncertainty reduced, and what decision the evidence supports"; "Evidence and findings are presented honestly — negative results and limitations are not hidden" | Yes |
| Maturity badge, all review status badges (distinct from maturity), what ready for, what not ready for, and next-stage requirements are all visible | US-3.3 | "The record displays: maturity stage (with canonical label and visual badge), all applicable review statuses as distinct badges, what the work is ready for, what it is not ready for, and next-stage requirements" | Yes |
| Reuse guidance names what office must own, required skills, service dependencies, environment-specific assumptions, and what is not transferable | US-3.4 | "The record displays: what can be reused, what should be adapted, what should not be copied directly, environment-specific assumptions, required skills, and required services/dependencies"; "Production-readiness gaps are clearly stated" | Yes |
| Contributing office, named contributors, current owner/steward, and opportunity source are present | US-3.5 | "The record displays: contributing office(s), named contributors, I&R's contribution, current owner/steward, and operational or production owner"; "At least one contributing office and an owner/steward are present on every published record" | Yes |
| Authoritative artifact links directly accessible from record; restricted artifacts show name and access notes but not URL | US-3.6 | "All linked artifacts appear in a structured list with: artifact type label, human-readable name, access notes, and URL (for non-restricted artifacts)"; "Restricted artifacts show the name and access notes but not the URL to anonymous users" | Yes |
| Only configured CTAs displayed; each CTA opens pre-populated engagement form with record context | US-3.7 | "Only enabled next actions for the record are displayed (configured per-record by a curator)"; "Clicking a CTA opens a contextual engagement request form pre-populated with the record's context and request type" | Yes |
| Both perspectives reflect identical maturity, review status, ownership, and evidence — no field conflicts | US-4.1 | "Both perspectives read from the same underlying record data — no values can conflict between views"; "Trust fields appear in both perspectives — they are never suppressed in either view" | Yes |
| Executive perspective contains problem summary, outcome, key risks/constraints, maturity, review status, decision recommendation, and ownership | US-4.2 | "The executive perspective leads with: problem summary, mission area, outcome narrative, key risks/constraints, maturity stage with descriptive label, review status, and recommended next step" | Yes |
| Technical perspective surfaces architecture, tools/services, security findings (visually distinct), testing gaps, production-readiness gaps, and full reuse guidance | US-4.3 | "The technical perspective prominently displays: what was tested, technologies/services used, architecture findings, security findings (visually distinct, SEC-11), testing findings, production-readiness gaps, and full reuse guidance" | Yes |
| Audio Security POC discoverable via "court audio GPU separation"; source basis cites authoritative document; links to authoritative artifact | US-5.1 | "A structured innovation record exists for the Audio Security POC, discoverable via problem-oriented search (e.g., 'court audio', 'GPU separation')"; "The record links to the authoritative lessons-learned document as an artifact" | Yes |
| Audio Security POC populates all content model sections; both perspectives render; discoverable via problem-oriented search | US-5.2 | "The Audio Security POC record populates: Problem & Context, What Was Explored, Outcome & Evidence, Key Findings (all categories), Maturity & Readiness, Reuse Guidance, Ownership & Attribution, and Authoritative Artifact links"; "Both executive and technical perspectives render correctly" | Yes |
| Hub links to authoritative URL; publishing does not change artifact access restriction | US-5.3 | "The authoritative source document is linked via an artifact record pointing to its source URL"; "Publishing the record does not change artifact access restriction settings (SEC-04)" | Yes |
| Non-acceptance statement displayed prominently before fields; flow distinct from contribution flow | US-6.1 | "The non-acceptance statement is displayed prominently at the top of the form before any fields"; "Selecting 'Share Existing Innovation Work' as request type displays inline guidance and a link to the contribution form (F7)" | Yes |
| Request type selector includes "Current Mission Problem"; selecting "Share Existing Innovation Work" triggers redirect guidance; type stored with submission | US-6.2 | "The form provides a request type selector with canonical values: Current Mission Problem, Emerging Technology Question, Request for Research, Potential POC, Request for Demonstration, Collaboration Opportunity, Share Existing Innovation Work, and Other"; "Request type is required" | Yes |
| Confirmation page explicitly states non-acceptance; displays reference number; language Carlos can show to PM | US-6.3 | "The confirmation page restates: 'Your submission has been received. Submission does not imply acceptance into the I&R portfolio.'" | Yes |
| Contribution flow at distinct URL from opportunity form; non-endorsement statement before fields | US-7.1 | "The contribution form lives at a distinct URL from the opportunity submission form (F6)"; "The non-endorsement statement is displayed prominently before fields" | Yes |
| Contributing office and named contributors present in published record; attribution_statement cannot be emptied | US-7.2 | "If I&R creates a record from the contribution, the published record's contributing_offices array includes the contributor's office and contributor_names includes the original named contributors"; "The attribution_statement on the published record must credit the originating team — it cannot be emptied during curation" | Yes |
| Confirmation states work will not publish without curation review; attribution preserved; I&R will contact if selected | US-7.3 | "The confirmation page explains: receipt confirmed, work will not be published without I&R curation review, attribution will be preserved if selected for curation, and I&R will contact the contributor if the work is selected" | Yes |
| I&R receives originating record ID, request type, requester name, office, and description; request persisted before email routing | US-8.1 | "Submitting the form persists the engagement request to the database before initiating email routing"; "Clicking the CTA opens an engagement request form pre-populated with: request type, originating record ID and title" | Yes |
| General Contact I&R CTA available; engagement request persisted with null originating_record_id; routed and recorded | US-8.2 | "A general 'Contact I&R' CTA is available from the Hub navigation or an engagement page, not tied to any specific record"; "The engagement request is persisted and appears in the curator's engagement activity queue" | Yes |
| If email routing fails, request remains in database and flagged for curator manual follow-up; user sees success confirmation | US-8.3 | "If server-side email fails, the engagement request remains in the database and is flagged in the curator admin view for manual follow-up; the user does not see an error" | Yes |
| Live counts for records needing review, submissions, and engagement without follow-up — sourced from live data | US-9.1 | "All counts reflect live data at page load time — not stale cached values"; "The dashboard displays: record counts by publication state, records where next_review_date ≤ today + 30 days, counts for pending submissions, count of recent engagement requests" | Yes |
| Filter for "Needs Review" returns only overdue records; drafts and archived visible to curator | US-9.2 | "The curator record list shows all records in all lifecycle states"; "Filter options include: ... 'Needs Review' (overdue next review date)" | Yes |
| Creating from contribution pre-populates fields and sets source_contribution_id immutably; only title required for draft | US-9.3 | "Creating from a contribution pre-populates fields from the innovation_contributions record and sets source_contribution_id immutably"; "The record can be saved as a draft without all publication gate fields — only title is required" | Yes |
| Concurrent edit triggers 409 conflict; all field edits on published records generate audit events | US-9.4 | "If another curator has edited the record concurrently, a 409 conflict error prompts the curator to reload and reapply changes"; "Editing a published or superseded record automatically generates an audit event listing changed fields" | Yes |
| Changing maturity never auto-changes review status; both generate independent audit events with previous and new values | US-9.5 | "Changing maturity never automatically changes review status; changing review status never automatically changes maturity"; "Every maturity change generates a maturity_changed audit event (previous value, new value, curator, timestamp, optional reason)" | Yes |
| Removing contributing office from contributed record triggers curator warning; attribution_statement cannot be emptied at publication | US-9.6 | "For records with source_contribution_id set, editing contributing_offices to remove the original contributing office triggers a curator warning before saving"; "Attempting to publish a contributed record with an empty attribution_statement fails the publication gate" | Yes |
| System checks all 15 gate fields before Published transition; every lifecycle transition generates audit event | US-9.7 | "A record may only transition to published if all 15 publication gate fields are non-empty"; "Every publication state transition generates a publication_state_changed audit event" | Yes |
| Publication blocked if any required field is missing; system returns specific list of missing fields | US-9.8 | "If any required field is missing, publication is blocked and the system returns a specific list of the missing fields (e.g., 'Cannot publish. Missing required fields: Source Basis, Attribution Statement')" | Yes |
| All material changes in chronological order with actor, timestamp, and change detail; append-only | US-9.9 | "Each audit event shows: event type, actor (curator name/ID), timestamp, and change detail"; "Audit events are append-only — they cannot be edited or deleted by curators" | Yes |
| Opportunity queue shows all context fields; disposition actions update workflow state | US-9.10 | "Each submission is viewable in full detail: all submitted fields, request type, submitting office, contact info, and submission date"; "Disposition actions available: accepted, declined, needs more information, duplicate" | Yes |
| Accepted contribution seeds pre-populated draft record with source_contribution_id set immutably | US-9.11 | "For contributions with accepted_for_curation disposition, a 'Create Record from Contribution' action is available that creates a draft record pre-populated from the contribution and sets source_contribution_id immutably" | Yes |
| Engagement log shows originating record, request type, requester, office, and follow-up status; no manual cross-referencing | US-9.12 | "The engagement activity queue lists all received engagement requests with: request type, originating record (if any), requester name, office, email, submission date, and current follow-up status" | Yes |
| Routing address update takes effect without redeployment; configuration-change audit event generated | US-9.13 | "The new address takes effect for all subsequent engagement requests without requiring redeployment"; "Changing the routing address generates an audit event (SEC-03)" | Yes |
| Content Model Reference accessible inline in edit UI; governance applied without external document | US-9.14 | "The Content Model Reference is accessible from within the curator edit UI (e.g., inline help, sidebar panel, or linked reference page)"; "It provides definitions for all canonical maturity values, review status values, publication state values, and engagement indicator values" | Yes |

**Alignment summary:** All 42 story NaC are fully aligned with UserStory acceptance criteria. No NaC contradicts an AC. Where NaC adds journey-stage specificity (e.g., "in under 10 minutes," "without contacting I&R"), this specializes the AC for the journey context rather than conflicting with it.

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-08-11*
