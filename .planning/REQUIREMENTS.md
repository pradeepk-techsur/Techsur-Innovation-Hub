# Requirements: TechSur Innovation Hub (TSIO Innovation Hub MVP)

**Defined:** 2026-08-11
**Core Value:** A Judiciary stakeholder can arrive with a mission problem, discover relevant I&R innovation work, understand what was learned and how mature it is, and take a concrete next step — without needing to already know the project name, team, or file location.

## v1 Requirements

Requirements for the MVP release. Each maps to roadmap phases.

### AUTH — Authentication and Authorization

- [ ] **AUTH-01**: Anonymous users can browse the catalog, view published innovation records, and use search/discovery without logging in
- [ ] **AUTH-02**: Curator role is required to access record creation, editing, publication lifecycle, and administration functions
- [ ] **AUTH-03**: Admin role is required to manage settings (engagement routing, configurable taxonomy) and user access
- [ ] **AUTH-04**: Unauthorized or unauthenticated users cannot access protected functions or restricted content (SEC-02)
- [ ] **AUTH-05**: Authentication and authorization decisions are auditable (SEC-03)
- [ ] **AUTH-06**: Role-based access control supports at minimum three roles: anonymous/stakeholder, curator, admin
- [ ] **AUTH-07**: Development-only authentication stub raises a fatal startup error in production environments (SEC-09)
- [ ] **AUTH-08**: Stakeholder/user login is available — authenticated stakeholders can log in to submit opportunities, contribute innovation work, and initiate engagement requests under their identity (not just anonymously)
- [ ] **AUTH-09**: Unauthenticated users can browse, search, and view published records anonymously; login is required to submit opportunities (F6), share innovation work (F7), or initiate engagement requests (F8) — so that submissions are traceable to an office and contact
- [ ] **AUTH-10**: User account supports at minimum: name, office/organization, contact email — sufficient for engagement routing and submission attribution without a full user profile product

### F1 — Innovation Catalog

- [ ] **F1.1**: User can browse a catalog of curated innovation records
- [ ] **F1.2**: Each catalog card shows title and one-sentence problem or outcome
- [ ] **F1.3**: Each card visibly communicates technology/capability area, maturity, review status, and contributing office
- [ ] **F1.4**: Each card shows reuse/engagement indicator (demo available, seeking adopter, playbook available, reference pattern, monitoring only, archived)
- [ ] **F1.5**: Each card shows last-reviewed date and current lifecycle state where that state affects interpretation
- [ ] **F1.6**: Catalog visual design does not imply all records are equally mature, approved, current, or reusable

### F2 — Search and Discovery

- [ ] **F2.1**: User can search by problem language without knowing internal project names or repository locations
- [ ] **F2.2**: Search covers record titles, problem statements, summaries, findings, tags, mission areas, technology areas, and artifact names where permitted
- [ ] **F2.3**: User can filter by mission/business area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and active/superseded/retired state
- [ ] **F2.4**: Search and filter results preserve visible trust information (maturity, review status) in results
- [ ] **F2.5**: Problem-language queries (e.g., "protect court audio") surface relevant work without requiring the formal project title when content and metadata support that relationship

### F3 — Innovation Record

- [ ] **F3.1**: Record explains problem and context (mission/operational problem, affected users, current workflow, why experimentation was appropriate)
- [ ] **F3.2**: Record explains what was explored (hypothesis/approach tested, scope boundaries, technologies/methods used)
- [ ] **F3.3**: Record explains outcome and evidence (what was demonstrated, evidence produced, what worked/didn't, uncertainty reduced, decision enabled)
- [ ] **F3.4**: Record surfaces key findings (architectural, security, cloud/platform, performance, UX, data, testing, operational, cost, scalability where applicable)
- [ ] **F3.5**: Record shows maturity and readiness (current maturity, review status, what it's ready/not ready for, requirements for next stage)
- [ ] **F3.6**: Record provides reuse guidance (what another office can reuse, what to adapt, what not to copy, environment-specific assumptions, required skills/services/dependencies)
- [ ] **F3.7**: Record identifies ownership and attribution (opportunity source, contributing office, I&R contribution, technical contributors, current owner, operational/production owner where applicable)
- [ ] **F3.8**: Record links to authoritative artifacts (lessons learned, POC reports, decision briefs, diagrams, demo videos, repositories, test results, security findings, technical playbooks — as available and permitted)
- [ ] **F3.9**: Record provides only contextually appropriate next action CTAs (demo request, related use case, adoption exploration, technical guidance, share related work, contact I&R)

### F4 — Executive and Technical Perspectives

- [ ] **F4.1**: A single innovation record supports both executive and technical perspectives without creating duplicate source records
- [ ] **F4.2**: Executive perspective prioritizes mission problem, strategic relevance, outcome, evidence, benefits, risks, maturity, decision recommendation, ownership, and next step
- [ ] **F4.3**: Technical perspective prioritizes architecture, tools/services, data flow, security considerations, testing, known limitations, source artifacts, production-readiness gaps, reuse guidance, and dependencies
- [ ] **F4.4**: Both perspectives remain grounded in the same underlying evidence, maturity, review status, ownership, and authoritative artifacts

### F5 — Existing Lessons-Learned Content

- [ ] **F5.1**: Existing lessons-learned documents are treated as source of record (not rewritten or relocated)
- [ ] **F5.2**: Structured innovation record created around existing source with most important reusable findings extracted
- [ ] **F5.3**: Metadata, maturity, review, ownership, attribution, and review-date information applied to the curated record
- [ ] **F5.4**: Record links back to authoritative source and is discoverable via problem-oriented search
- [ ] **F5.5**: Audio Security POC supported as an initial seeded record — its architectural, security, performance, cloud-environment, testing, and production-readiness findings exercise the full content model

### F6 — Opportunity Submission

- [ ] **F6.1**: Submission flow begins with the problem or workflow friction, not a requested application
- [ ] **F6.2**: Captures who is affected, current workflow, impact, desired outcome, constraints, related work attempted, submitting office, and discovery participants
- [ ] **F6.3**: Submitter can characterize request type (mission problem, emerging-technology question, research request, potential POC, demo request, collaboration opportunity, or existing innovation to share)
- [ ] **F6.4**: Clearly states that submission does not imply acceptance into the I&R portfolio
- [ ] **F6.5**: Submission recorded so authorized I&R users can review and disposition through the defined workflow

### F7 — Share Existing Innovation Work

- [ ] **F7.1**: Separate contribution flow for teams with existing innovation work to share (distinct from F6 opportunity submission)
- [ ] **F7.2**: Captures problem addressed, work description, contributing office, current maturity, current owner, available artifacts, known limitations, contact person, and collaboration/reuse preference
- [ ] **F7.3**: Contributor attribution and current ownership preserved through the curation process and immutable once published
- [ ] **F7.4**: Curation required before publication; language does not imply central endorsement from submission alone

### F8 — Engagement Routing

- [ ] **F8.1**: Record-level and general CTAs for demonstration, related-use-case discussion, adoption exploration, technical guidance, sharing related work, or I&R contact
- [ ] **F8.2**: Captures request type, originating innovation record where applicable, user name, office, contact information, description of need, and desired next step
- [ ] **F8.3**: Email-first implementation acceptable for MVP; engagement action separately recorded in database before email routing (persistence is a prerequisite, not a consequence, of routing)
- [ ] **F8.4**: Routing destination configurable by authorized users without requiring code change or application redeployment
- [ ] **F8.5**: Configured display language directs users to TSIO I&R team (initial address: AOml_TSO_IRB_Team@ao.uscourts.gov)
- [ ] **F8.6**: Suggested email subject patterns implemented for Innovation Opportunity, Demo Request, Adoption Discussion, and Technical Guidance

### F9 — Curation and Administration

- [ ] **F9.1**: Curator summary view of records, submissions, engagements, review needs, and other attention items using live product data
- [ ] **F9.2**: Authorized, filterable view of innovation records across all lifecycle states
- [ ] **F9.3**: Authorized curator can create a complete innovation record from source material or an accepted contribution
- [ ] **F9.4**: Authorized editing of all product-required record content and metadata
- [ ] **F9.5**: Authorized users can add, update, and remove authoritative artifact links without creating uncontrolled copies
- [ ] **F9.6**: Authorized maturity assignment and update while preserving history of material changes
- [ ] **F9.7**: Authorized review status management, independent from maturity (changing maturity never automatically changes review status, and vice versa)
- [ ] **F9.8**: Attribution and ownership maintenance (contributing offices, contributors, I&R contribution, current steward, operational owner, production owner where applicable)
- [ ] **F9.9**: Publication lifecycle: draft → submitted for review → published → superseded/archived/retired
- [ ] **F9.10**: Publication gate: prevents publication when required fields are absent (15 required fields per FRD F03a); maturity/disclaimer mismatch surfaces a curator-visible warning
- [ ] **F9.11**: Audit history: chronological record of material content, governance, and lifecycle changes
- [ ] **F9.12**: Opportunity submission queue: authorized I&R review and disposition
- [ ] **F9.13**: Contribution submission queue: authorized review, disposition, and record creation from accepted contributions
- [ ] **F9.14**: Engagement activity view: authorized review with follow-up status tracking
- [ ] **F9.15**: Settings management: authorized configuration of engagement routing and other approved configurable settings
- [ ] **F9.16**: Content model reference: accessible definitions of maturity, review status, lifecycle, and publication requirements for consistent curator governance

### IA — Information Architecture and Navigation Completeness

- [ ] **IA-01**: All primary navigation items point to routes the application actually serves — no dead links or 404s in the primary navigation
- [ ] **IA-02**: Every page/screen reachable from the navigation is implemented and functional — no orphaned menu options
- [ ] **IA-03**: A site map or navigation map is documented and verified before launch, listing every route and its inbound paths
- [ ] **IA-04**: Breadcrumbs or equivalent navigation context are present on all non-home pages so users know where they are
- [ ] **IA-05**: The login/authentication flow is integrated into the navigation — login and logout links are visible in the appropriate states (logged-out header shows login; logged-in header shows user identity and logout)

### SEED — Initial Content and Launch Acceptance

- [ ] **SEED-01**: At least 8 published innovation records seeded at launch (exceeds PRD §12 minimum of 3; enables meaningful filtering and catalog browsing)
- [ ] **SEED-02**: Seeded records must span multiple mission areas so users can filter by mission/business area and see meaningful differentiation
- [ ] **SEED-03**: Seeded records must span multiple technology areas (e.g., cloud, AI/ML, security, data, user experience) so technology-area filtering returns distinct, non-overlapping results
- [ ] **SEED-04**: Seeded records must span all maturity levels (Idea, Evaluated Idea, Experiment/POC, Prototype/Pilot, Production/Validated Pattern, Archived/Retired) so maturity filtering works visibly
- [ ] **SEED-05**: Seeded records must span multiple review statuses so review-status filtering returns distinct results
- [ ] **SEED-06**: Seeded records must span multiple contributing offices so contributing-office filtering works visibly
- [ ] **SEED-07**: At least 1 seeded record must have significant reusable technical findings and source artifact links (technical reuse example — exercises F3.8 and F4.3)
- [ ] **SEED-08**: At least 1 seeded record must support an executive decision or sponsorship discussion (executive decision example — exercises F4.2)
- [ ] **SEED-09**: At least 1 seeded record must be actively seeking an adopter, collaborator, or concrete engagement (adoption/collaboration example — exercises F8.1 CTAs)
- [ ] **SEED-10**: At least 1 seeded record must be archived, retired, or superseded, retained for institutional learning (lifecycle transparency — exercises F9.9)
- [ ] **SEED-11**: Every seeded published record meets all 15 publication gate fields (maturity, applicable review status, attribution, owner/steward, last-reviewed date, source basis, applicable disclaimer)
- [ ] **SEED-12**: The Audio Security POC is seeded as the primary technical reuse example (architectural, security, performance, cloud-environment, testing, and production-readiness findings)

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

*(Populated during roadmap creation)*

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01–AUTH-10 | Phase TBD | Pending |
| F1.1–F1.6 | Phase TBD | Pending |
| F2.1–F2.5 | Phase TBD | Pending |
| F3.1–F3.9 | Phase TBD | Pending |
| F4.1–F4.4 | Phase TBD | Pending |
| F5.1–F5.5 | Phase TBD | Pending |
| F6.1–F6.5 | Phase TBD | Pending |
| F7.1–F7.4 | Phase TBD | Pending |
| F8.1–F8.6 | Phase TBD | Pending |
| F9.1–F9.16 | Phase TBD | Pending |
| IA-01–IA-05 | Phase TBD | Pending |
| SEED-01–SEED-12 | Phase TBD | Pending |

**Coverage:**
- v1 requirements: 79 total (10 AUTH + 5 IA + 6 F1 + 5 F2 + 9 F3 + 4 F4 + 5 F5 + 5 F6 + 4 F7 + 6 F8 + 16 F9 + 12 SEED)
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 79 ⚠️

---
*Requirements defined: 2026-08-11*
*Last updated: 2026-08-11 after initial definition — added AUTH-01–10 (stakeholder login + RBAC); added IA-01–05 (navigation completeness, no orphaned links); added SEED-01–12 (≥8 seeded records with overlapping metadata)*
