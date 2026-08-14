# Requirements: TechSur Innovation Hub (TSIO Innovation Hub MVP)

**Defined:** 2026-08-11
**Verified:** 2026-08-14 (Phase 6 End-to-End Verification — 87/87 requirements, 100/100 tests passing)
**Core Value:** A Judiciary stakeholder can arrive with a mission problem, discover relevant I&R innovation work, understand what was learned and how mature it is, and take a concrete next step — without needing to already know the project name, team, or file location.

## v1 Requirements

Requirements for the MVP release. Each maps to roadmap phases.

### AUTH — Authentication and Authorization

- [x] **AUTH-01**: Anonymous users can browse the catalog, view published innovation records, and use search/discovery without logging in
- [x] **AUTH-02**: Curator role is required to access record creation, editing, publication lifecycle, and administration functions
- [x] **AUTH-03**: Admin role is required to manage settings (engagement routing, configurable taxonomy) and user access
- [x] **AUTH-04**: Unauthorized or unauthenticated users cannot access protected functions or restricted content (SEC-02)
- [x] **AUTH-05**: Authentication and authorization decisions are auditable (SEC-03)
- [x] **AUTH-06**: Role-based access control supports at minimum three roles: anonymous/stakeholder, curator, admin
- [x] **AUTH-07**: Development-only authentication stub raises a fatal startup error in production environments (SEC-09)
- [x] **AUTH-08**: Stakeholder/user login is available — authenticated stakeholders can log in to submit opportunities, contribute innovation work, and initiate engagement requests under their identity (not just anonymously)
- [x] **AUTH-09**: Unauthenticated users can browse, search, and view published records anonymously; login is required to submit opportunities (F6), share innovation work (F7), or initiate engagement requests (F8) — so that submissions are traceable to an office and contact
- [x] **AUTH-10**: User account supports at minimum: name, office/organization, contact email — sufficient for engagement routing and submission attribution without a full user profile product

### F1 — Innovation Catalog

- [x] **F1.1**: User can browse a catalog of curated innovation records
- [x] **F1.2**: Each catalog card shows title and one-sentence problem or outcome
- [x] **F1.3**: Each card visibly communicates technology/capability area, maturity, review status, and contributing office
- [x] **F1.4**: Each card shows reuse/engagement indicator (demo available, seeking adopter, playbook available, reference pattern, monitoring only, archived)
- [x] **F1.5**: Each card shows last-reviewed date and current lifecycle state where that state affects interpretation
- [x] **F1.6**: Catalog visual design does not imply all records are equally mature, approved, current, or reusable

### F2 — Search and Discovery

- [x] **F2.1**: User can search by problem language without knowing internal project names or repository locations
- [x] **F2.2**: Search covers record titles, problem statements, summaries, findings, tags, mission areas, technology areas, and artifact names where permitted
- [x] **F2.3**: User can filter by mission/business area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and active/superseded/retired state
- [x] **F2.4**: Search and filter results preserve visible trust information (maturity, review status) in results
- [x] **F2.5**: Problem-language queries (e.g., "protect court audio") surface relevant work without requiring the formal project title when content and metadata support that relationship

### F3 — Innovation Record

- [x] **F3.1**: Record explains problem and context (mission/operational problem, affected users, current workflow, why experimentation was appropriate)
- [x] **F3.2**: Record explains what was explored (hypothesis/approach tested, scope boundaries, technologies/methods used)
- [x] **F3.3**: Record explains outcome and evidence (what was demonstrated, evidence produced, what worked/didn't, uncertainty reduced, decision enabled)
- [x] **F3.4**: Record surfaces key findings (architectural, security, cloud/platform, performance, UX, data, testing, operational, cost, scalability where applicable)
- [x] **F3.5**: Record shows maturity and readiness (current maturity, review status, what it's ready/not ready for, requirements for next stage)
- [x] **F3.6**: Record provides reuse guidance (what another office can reuse, what to adapt, what not to copy, environment-specific assumptions, required skills/services/dependencies)
- [x] **F3.7**: Record identifies ownership and attribution (opportunity source, contributing office, I&R contribution, technical contributors, current owner, operational/production owner where applicable)
- [x] **F3.8**: Record links to authoritative artifacts (lessons learned, POC reports, decision briefs, diagrams, demo videos, repositories, test results, security findings, technical playbooks — as available and permitted)
- [x] **F3.9**: Record provides only contextually appropriate next action CTAs (demo request, related use case, adoption exploration, technical guidance, share related work, contact I&R)

### F4 — Executive and Technical Perspectives

- [x] **F4.1**: A single innovation record supports both executive and technical perspectives without creating duplicate source records
- [x] **F4.2**: Executive perspective prioritizes mission problem, strategic relevance, outcome, evidence, benefits, risks, maturity, decision recommendation, ownership, and next step
- [x] **F4.3**: Technical perspective prioritizes architecture, tools/services, data flow, security considerations, testing, known limitations, source artifacts, production-readiness gaps, reuse guidance, and dependencies
- [x] **F4.4**: Both perspectives remain grounded in the same underlying evidence, maturity, review status, ownership, and authoritative artifacts

### F5 — Existing Lessons-Learned Content

- [x] **F5.1**: Existing lessons-learned documents are treated as source of record (not rewritten or relocated)
- [x] **F5.2**: Structured innovation record created around existing source with most important reusable findings extracted
- [x] **F5.3**: Metadata, maturity, review, ownership, attribution, and review-date information applied to the curated record
- [x] **F5.4**: Record links back to authoritative source and is discoverable via problem-oriented search
- [x] **F5.5**: Audio Security POC supported as an initial seeded record — its architectural, security, performance, cloud-environment, testing, and production-readiness findings exercise the full content model

### F6 — Opportunity Submission

- [x] **F6.1**: Submission flow begins with the problem or workflow friction, not a requested application
- [x] **F6.2**: Captures who is affected, current workflow, impact, desired outcome, constraints, related work attempted, submitting office, and discovery participants
- [x] **F6.3**: Submitter can characterize request type (mission problem, emerging-technology question, research request, potential POC, demo request, collaboration opportunity, or existing innovation to share)
- [x] **F6.4**: Clearly states that submission does not imply acceptance into the I&R portfolio
- [x] **F6.5**: Submission recorded so authorized I&R users can review and disposition through the defined workflow

### F7 — Share Existing Innovation Work

- [x] **F7.1**: Separate contribution flow for teams with existing innovation work to share (distinct from F6 opportunity submission)
- [x] **F7.2**: Captures problem addressed, work description, contributing office, current maturity, current owner, available artifacts, known limitations, contact person, and collaboration/reuse preference
- [x] **F7.3**: Contributor attribution and current ownership preserved through the curation process and immutable once published
- [x] **F7.4**: Curation required before publication; language does not imply central endorsement from submission alone

### F8 — Engagement Routing

- [x] **F8.1**: Record-level and general CTAs for demonstration, related-use-case discussion, adoption exploration, technical guidance, sharing related work, or I&R contact
- [x] **F8.2**: Captures request type, originating innovation record where applicable, user name, office, contact information, description of need, and desired next step
- [x] **F8.3**: Email-first implementation acceptable for MVP; engagement action separately recorded in database before email routing (persistence is a prerequisite, not a consequence, of routing)
- [x] **F8.4**: Routing destination configurable by authorized users without requiring code change or application redeployment
- [x] **F8.5**: Configured display language directs users to TSIO I&R team (initial address: AOml_TSO_IRB_Team@ao.uscourts.gov)
- [x] **F8.6**: Suggested email subject patterns implemented for Innovation Opportunity, Demo Request, Adoption Discussion, and Technical Guidance

### F9 — Curation and Administration

- [x] **F9.1**: Curator summary view of records, submissions, engagements, review needs, and other attention items using live product data
- [x] **F9.2**: Authorized, filterable view of innovation records across all lifecycle states
- [x] **F9.3**: Authorized curator can create a complete innovation record from source material or an accepted contribution
- [x] **F9.4**: Authorized editing of all product-required record content and metadata
- [x] **F9.5**: Authorized users can add, update, and remove authoritative artifact links without creating uncontrolled copies
- [x] **F9.6**: Authorized maturity assignment and update while preserving history of material changes
- [x] **F9.7**: Authorized review status management, independent from maturity (changing maturity never automatically changes review status, and vice versa)
- [x] **F9.8**: Attribution and ownership maintenance (contributing offices, contributors, I&R contribution, current steward, operational owner, production owner where applicable)
- [x] **F9.9**: Publication lifecycle: draft → submitted for review → published → superseded/archived/retired *(Note: POST /curator/records response now includes state:'draft' — fixed in 06-03)*
- [x] **F9.10**: Publication gate: prevents publication when required fields are absent (15 required fields per FRD F03a); maturity/disclaimer mismatch surfaces a curator-visible warning
- [x] **F9.11**: Audit history: chronological record of material content, governance, and lifecycle changes
- [x] **F9.12**: Opportunity submission queue: authorized I&R review and disposition
- [x] **F9.13**: Contribution submission queue: authorized review, disposition, and record creation from accepted contributions
- [x] **F9.14**: Engagement activity view: authorized review with follow-up status tracking
- [x] **F9.15**: Settings management: authorized configuration of engagement routing and other approved configurable settings *(Note: GET /curator/settings is admin-only by AUTH-03 design — verified with admin role)*
- [x] **F9.16**: Content model reference: accessible definitions of maturity, review status, lifecycle, and publication requirements for consistent curator governance

### IA — Information Architecture and Navigation Completeness

- [x] **IA-01**: All primary navigation items point to routes the application actually serves — no dead links or 404s in the primary navigation
- [x] **IA-02**: Every page/screen reachable from the navigation is implemented and functional — no orphaned menu options
- [x] **IA-03**: A site map or navigation map is documented and verified before launch, listing every route and its inbound paths
- [x] **IA-04**: Breadcrumbs or equivalent navigation context are present on all non-home pages so users know where they are
- [x] **IA-05**: The login/authentication flow is integrated into the navigation — login and logout links are visible in the appropriate states (logged-out header shows login; logged-in header shows user identity and logout)

### SEED — Initial Content and Launch Acceptance

- [x] **SEED-01**: At least 8 published innovation records seeded at launch (exceeds PRD §12 minimum of 3; enables meaningful filtering and catalog browsing)
- [x] **SEED-02**: Seeded records must span multiple mission areas so users can filter by mission/business area and see meaningful differentiation
- [x] **SEED-03**: Seeded records must span multiple technology areas (e.g., cloud, AI/ML, security, data, user experience) so technology-area filtering returns distinct, non-overlapping results
- [x] **SEED-04**: Seeded records must span all maturity levels (Idea, Evaluated Idea, Experiment/POC, Prototype/Pilot, Production/Validated Pattern, Archived/Retired) so maturity filtering works visibly
- [x] **SEED-05**: Seeded records must span multiple review statuses so review-status filtering returns distinct results
- [x] **SEED-06**: Seeded records must span multiple contributing offices so contributing-office filtering works visibly
- [x] **SEED-07**: At least 1 seeded record must have significant reusable technical findings and source artifact links (technical reuse example — exercises F3.8 and F4.3)
- [x] **SEED-08**: At least 1 seeded record must support an executive decision or sponsorship discussion (executive decision example — exercises F4.2)
- [x] **SEED-09**: At least 1 seeded record must be actively seeking an adopter, collaborator, or concrete engagement (adoption/collaboration example — exercises F8.1 CTAs)
- [x] **SEED-10**: At least 1 seeded record must be archived, retired, or superseded, retained for institutional learning (lifecycle transparency — exercises F9.9)
- [x] **SEED-11**: Every seeded published record meets all 15 publication gate fields (maturity, applicable review status, attribution, owner/steward, last-reviewed date, source basis, applicable disclaimer)
- [x] **SEED-12**: The Audio Security POC is seeded as the primary technical reuse example (architectural, security, performance, cloud-environment, testing, and production-readiness findings)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics and Reporting
- Analytics and engagement metrics dashboard (usage and engagement metrics TBD during discovery; basic event tracking may be sufficient for MVP but full analytics deferred)

### Advanced Search
- Semantic/AI-assisted search beyond keyword and full-text matching

### Portfolio Management
- Enterprise-level portfolio management and investment tracking across I&R efforts

### Integrations
- Direct integrations with SharePoint, Git repositories for automated content ingestion (MVP links to authoritative sources; migration/sync is deferred)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Replace SharePoint or Git repositories | Hub curates and links to authoritative sources; does not replace them |
| Migrate every historical document | MVP proves model with deliberate small content set (≥3 published records); full migration is out of scope |
| Manage POC execution | Hub documents outcomes, not project management |
| Provide enterprise portfolio management | Engagement and transition focus only; portfolio tools deferred |
| Automatically determine maturity or approval | Curator-governed only — automation would undermine trust model |
| Replace architecture, security, legal, or policy review | Hub links to review evidence; does not replace substantive review processes |
| Deploy POCs into production | Hub links to outputs; does not operationalize them |
| Broad social networking or discussion forums | Engagement routing (F8) serves communication; social features out of scope |
| Autonomous investment decisions | Decision support only; humans make investment decisions |
| Publish sensitive material outside approved access boundaries | Artifact access remains governed by authoritative source system (SEC-04) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 — Foundation | Verified ✓ |
| AUTH-07 | Phase 1 — Foundation | Verified ✓ |
| F1.1 | Phase 1 — Foundation | Verified ✓ |
| F1.2 | Phase 1 — Foundation | Verified ✓ |
| F1.3 | Phase 1 — Foundation | Verified ✓ |
| F1.4 | Phase 1 — Foundation | Verified ✓ |
| F1.5 | Phase 1 — Foundation | Verified ✓ |
| F1.6 | Phase 1 — Foundation | Verified ✓ |
| F3.1 | Phase 1 — Foundation | Verified ✓ |
| F3.2 | Phase 1 — Foundation | Verified ✓ |
| F3.3 | Phase 1 — Foundation | Verified ✓ |
| F3.4 | Phase 1 — Foundation | Verified ✓ |
| F3.5 | Phase 1 — Foundation | Verified ✓ |
| F3.6 | Phase 1 — Foundation | Verified ✓ |
| F3.7 | Phase 1 — Foundation | Verified ✓ |
| F3.8 | Phase 1 — Foundation | Verified ✓ |
| F3.9 | Phase 1 — Foundation | Verified ✓ |
| F2.1 | Phase 2 — Discovery | Verified ✓ |
| F2.2 | Phase 2 — Discovery | Verified ✓ |
| F2.3 | Phase 2 — Discovery | Verified ✓ |
| F2.4 | Phase 2 — Discovery | Verified ✓ |
| F2.5 | Phase 2 — Discovery | Verified ✓ |
| F4.1 | Phase 2 — Discovery | Verified ✓ |
| F4.2 | Phase 2 — Discovery | Verified ✓ |
| F4.3 | Phase 2 — Discovery | Verified ✓ |
| F4.4 | Phase 2 — Discovery | Verified ✓ |
| F5.1 | Phase 2 — Discovery | Verified ✓ |
| F5.2 | Phase 2 — Discovery | Verified ✓ |
| F5.3 | Phase 2 — Discovery | Verified ✓ |
| F5.4 | Phase 2 — Discovery | Verified ✓ |
| F5.5 | Phase 2 — Discovery | Verified ✓ |
| AUTH-08 | Phase 3 — Engagement Flows | Verified ✓ |
| AUTH-09 | Phase 3 — Engagement Flows | Verified ✓ |
| AUTH-10 | Phase 3 — Engagement Flows | Verified ✓ |
| F6.1 | Phase 3 — Engagement Flows | Verified ✓ |
| F6.2 | Phase 3 — Engagement Flows | Verified ✓ |
| F6.3 | Phase 3 — Engagement Flows | Verified ✓ |
| F6.4 | Phase 3 — Engagement Flows | Verified ✓ |
| F6.5 | Phase 3 — Engagement Flows | Verified ✓ |
| F7.1 | Phase 3 — Engagement Flows | Verified ✓ |
| F7.2 | Phase 3 — Engagement Flows | Verified ✓ |
| F7.3 | Phase 3 — Engagement Flows | Verified ✓ |
| F7.4 | Phase 3 — Engagement Flows | Verified ✓ |
| F8.1 | Phase 3 — Engagement Flows | Verified ✓ |
| F8.2 | Phase 3 — Engagement Flows | Verified ✓ |
| F8.3 | Phase 3 — Engagement Flows | Verified ✓ |
| F8.4 | Phase 3 — Engagement Flows | Verified ✓ |
| F8.5 | Phase 3 — Engagement Flows | Verified ✓ |
| F8.6 | Phase 3 — Engagement Flows | Verified ✓ |
| AUTH-02 | Phase 4 — Curation and Administration | Verified ✓ |
| AUTH-03 | Phase 4 — Curation and Administration | Verified ✓ |
| AUTH-04 | Phase 4 — Curation and Administration | Verified ✓ |
| AUTH-05 | Phase 4 — Curation and Administration | Verified ✓ |
| AUTH-06 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.1 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.2 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.3 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.4 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.5 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.6 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.7 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.8 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.9 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.10 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.11 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.12 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.13 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.14 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.15 | Phase 4 — Curation and Administration | Verified ✓ |
| F9.16 | Phase 4 — Curation and Administration | Verified ✓ |
| IA-01 | Phase 5 — Launch Readiness | Verified ✓ |
| IA-02 | Phase 5 — Launch Readiness | Verified ✓ |
| IA-03 | Phase 5 — Launch Readiness | Verified ✓ |
| IA-04 | Phase 5 — Launch Readiness | Verified ✓ |
| IA-05 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-01 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-02 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-03 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-04 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-05 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-06 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-07 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-08 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-09 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-10 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-11 | Phase 5 — Launch Readiness | Verified ✓ |
| SEED-12 | Phase 5 — Launch Readiness | Verified ✓ |

**Coverage:**
- v1 requirements: 87 total (10 AUTH + 5 IA + 6 F1 + 5 F2 + 9 F3 + 4 F4 + 5 F5 + 5 F6 + 4 F7 + 6 F8 + 16 F9 + 12 SEED)
- Verified: 87/87 ✓ (Phase 6 End-to-End Verification, 2026-08-14)
- Remaining gaps: 0
- Test suite: 100/100 tests passing (e2e/requirements/ via Playwright)

---
*Requirements defined: 2026-08-11*
*Last updated: 2026-08-14 — Phase 6 verification complete; all 87 v1 requirements marked [x] (100/100 tests passing)*
