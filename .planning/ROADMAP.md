# Roadmap: TechSur Innovation Hub (TSIO Innovation Hub MVP)

## Overview

The Hub delivers in five phases that follow the primary user journey: first building a browsable, trustworthy catalog of innovation records (Phase 1); then adding problem-oriented search and the executive/technical perspective model (Phase 2); then opening authenticated engagement flows for stakeholders to submit opportunities and initiate conversations (Phase 3); then giving curators the full governance interface to create, publish, and administer records (Phase 4); and finally seeding real content, verifying navigation completeness, and confirming the application is ready for operational launch (Phase 5). Every v1 requirement maps to exactly one phase. SEED and IA requirements are Phase 5 launch-acceptance conditions.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Database schema, application structure, anonymous catalog and full innovation record display, dev auth stub
- [ ] **Phase 2: Discovery** - Problem-oriented full-text search, faceted filtering, executive/technical perspective toggle, lessons-learned content model
- [ ] **Phase 3: Engagement Flows** - Stakeholder authentication, opportunity submission, innovation contribution, engagement routing
- [ ] **Phase 4: Curation and Administration** - Full curator/admin interface, publication lifecycle, audit history, submission and engagement queues, RBAC enforcement
- [ ] **Phase 5: Launch Readiness** - IA completeness, navigation verification, accessibility verification, content seeding (≥8 records), deployment security checks

## Phase Details

### Phase 1: Foundation
**Status**: passed
**Goal**: Anonymous users can browse a trustworthy catalog of published innovation records and open a full structured record — so the primary discovery journey is functional end-to-end before search, authentication, or curation is added
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-07, F1.1, F1.2, F1.3, F1.4, F1.5, F1.6, F3.1, F3.2, F3.3, F3.4, F3.5, F3.6, F3.7, F3.8, F3.9
**Success Criteria** (what must be TRUE):
  1. An anonymous user can open the catalog page and see a list of published innovation records with visible maturity badges, review status badges, contributing office, last-reviewed date, and engagement indicator — without logging in
  2. A user can click any catalog card and reach a full innovation record that presents all nine content sections (problem, explored, outcome, findings, maturity/readiness, reuse guidance, ownership, artifacts, next action) using the complete field model
  3. The catalog never visually implies all records are equally mature or approved — maturity and review status badges are visually distinct from each other (SEC-11) and from the publication state
  4. The development auth stub raises a fatal startup error when `NODE_ENV=production`, confirming development-only mechanisms cannot reach operational environments (AUTH-07 / SEC-09)
  5. The application deploys successfully in the containerized dev environment with database migrations applied, all required environment variables in `.env.example`, and no credentials in source code (SEC-08)
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Next.js + PostgreSQL Docker stack, full DB schema migration (8 tables), dev auth stub with production guard
- [ ] 01-02-PLAN.md — TypeScript DB types, seed fixtures, catalog API + SSR page, CatalogCard + MaturityBadge + ReviewStatusBadge components
- [ ] 01-03-PLAN.md — Record detail page with all nine content sections, TrustBanner, ArtifactList (SEC-04), NextActionCTAs

### Phase 2: Discovery
**Goal**: A user can find relevant innovation work using mission-problem language and view audience-appropriate executive or technical perspectives — so the Hub's problem-oriented discovery promise is fulfilled and existing lessons-learned content is surfaced
**Depends on**: Phase 1
**Requirements**: F2.1, F2.2, F2.3, F2.4, F2.5, F4.1, F4.2, F4.3, F4.4, F5.1, F5.2, F5.3, F5.4, F5.5
**Success Criteria** (what must be TRUE):
  1. A user can type mission-problem language (e.g., "protect court audio") into the search box and receive ranked results that surface relevant records without requiring the formal project title — search covers problem statements, findings, tags, mission areas, and technology areas with appropriate field weighting
  2. A user can progressively narrow results using faceted filters for mission area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and lifecycle state — each result card preserves full trust information (maturity, review status, lifecycle state)
  3. A user viewing an innovation record can toggle between executive perspective (problem, outcome, evidence, decision recommendation, next step) and technical perspective (architecture, tools, security, limitations, artifacts, production-readiness gaps) — both perspectives draw from the same underlying record fields with no duplicate source records
  4. A curator can create a structured innovation record that links back to an existing lessons-learned document as its source of record without migrating or rewriting the authoritative source — the resulting record is discoverable via problem-oriented search
  5. The search index never returns results that omit maturity, review status, or lifecycle state from result cards — the trust model is preserved in every search result view
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — PostgreSQL tsvector search service, GET /api/v1/search + /facets endpoints, validation layer (F2.1–F2.5)
- [ ] 02-02-PLAN.md — /search SSR page with filter panel, active-filter chips, SearchResultCard with trust badges, ARIA live region
- [ ] 02-03-PLAN.md — Executive/technical perspective toggle (ARIA tablist) on record detail page (F4.1–F4.4)
- [ ] 02-04-PLAN.md — SourceBasisBanner component, enriched Audio Security POC seed with full findings + source_basis (F5.1–F5.5)

### Phase 3: Engagement Flows
**Goal**: Authenticated stakeholders can log in under their identity and submit opportunities, share existing innovation work, and initiate engagement requests — so submissions are traceable to an office and contact, and all routing is recorded before any email is sent
**Depends on**: Phase 2
**Requirements**: AUTH-08, AUTH-09, AUTH-10, F6.1, F6.2, F6.3, F6.4, F6.5, F7.1, F7.2, F7.3, F7.4, F8.1, F8.2, F8.3, F8.4, F8.5, F8.6
**Success Criteria** (what must be TRUE):
  1. An authenticated user can log in and their identity (name, office, contact email) is associated with any opportunity submission, innovation contribution, or engagement request they initiate — so submissions are traceable to a specific office and contact, not anonymous
  2. A stakeholder can complete the opportunity submission flow starting with a problem statement (not a requested application), receive clear confirmation that submission does not imply I&R acceptance, and have the submission persisted for curator review
  3. A contributor can complete the separate innovation contribution flow capturing the problem addressed, contributing office, maturity, owner, artifacts, limitations, and collaboration preference — with attribution preserved and no language implying central endorsement before curation
  4. A user on any published innovation record can initiate an engagement request (demo, adoption discussion, technical guidance, related work, I&R contact), and the engagement action is recorded in the database before any email routing occurs — so no engagement action is silently lost even if email delivery fails
  5. The engagement routing destination is configurable via Hub settings by an authorized user without requiring a code change or redeployment — the configured address defaults to AOml_TSO_IRB_Team@ao.uscourts.gov
  6. Unauthenticated users can browse, search, and view published records anonymously but are redirected to login when attempting to submit an opportunity (F6), share innovation (F7), or initiate an engagement request (F8) — the login requirement is enforced, not merely suggested
**Plans**: TBD

Plans:
- [ ] 03-01: Stakeholder authentication (login/logout/session, account fields: name, office, email)
- [ ] 03-02: Opportunity submission form, persistence, and confirmation flow (F6)
- [ ] 03-03: Innovation contribution form, attribution preservation, and curation-gate confirmation (F7)
- [ ] 03-04: Engagement request capture, database persistence, and email routing (F8)

### Phase 4: Curation and Administration
**Goal**: Authorized curators can create, edit, govern, and publish innovation records through the full publication lifecycle with role-based access control, audit history, and submission/engagement queue management — so the Hub has a complete, auditable back-office that prevents incomplete or misleading records from reaching stakeholders
**Depends on**: Phase 3
**Requirements**: AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, F9.1, F9.2, F9.3, F9.4, F9.5, F9.6, F9.7, F9.8, F9.9, F9.10, F9.11, F9.12, F9.13, F9.14, F9.15, F9.16
**Success Criteria** (what must be TRUE):
  1. An authorized curator can create a complete innovation record, assign all required metadata (maturity, review statuses, contributing offices, owner/steward, attribution, last-reviewed date, source basis, applicable disclaimer), manage artifact links, and move the record through the full lifecycle (draft → submitted for review → published → superseded/archived/retired)
  2. The publication gate prevents a record from advancing to Published when any of the 15 required fields is absent — the system surfaces a specific list of missing fields to the curator, and a maturity/disclaimer mismatch produces a curator-visible warning (not a silent pass)
  3. Unauthenticated or unauthorized users receive an appropriate redirect or error — never silent access — when attempting to reach any `/curator/*` route or protected API endpoint; unauthorized access attempts are recorded in audit history (AUTH-04, SEC-02, SEC-03)
  4. A chronological audit history records every material content, governance, lifecycle, and configuration change — identifying who made the change, what changed, and when — and this history cannot be modified or deleted by any application role
  5. Authorized curators can review the opportunity submission queue, innovation contribution queue, and engagement activity list — and disposition each item (accept, decline, needs-more-information) with the disposition recorded and traceable
**Plans**: TBD

Plans:
- [ ] 04-01: RBAC middleware, role enforcement (curator/admin), and auth audit events (AUTH-02–06)
- [ ] 04-02: Curator dashboard, record management list, and record creation/editing interface (F9.1–F9.5)
- [ ] 04-03: Maturity, review status, attribution management, publication gate, and lifecycle transitions (F9.6–F9.10)
- [ ] 04-04: Audit history, submission queues, engagement review, settings management, and content model reference (F9.11–F9.16)

### Phase 5: Launch Readiness
**Goal**: The application has complete, verified navigation with no dead links; at least 8 published seeded records spanning all required metadata dimensions; and all accessibility, deployment security, and launch-acceptance conditions are confirmed — so the Hub is ready for stakeholder use and the product acceptance criteria are met
**Depends on**: Phase 4
**Requirements**: IA-01, IA-02, IA-03, IA-04, IA-05, SEED-01, SEED-02, SEED-03, SEED-04, SEED-05, SEED-06, SEED-07, SEED-08, SEED-09, SEED-10, SEED-11, SEED-12
**Success Criteria** (what must be TRUE):
  1. Every primary navigation link resolves to a real, functional page — no 404s, no orphaned menu items, no dead-end routes — confirmed by a verified navigation/route map listing every path and its inbound links (IA-01, IA-02, IA-03)
  2. The logged-out header shows a login link; the logged-in header shows the user's identity and a logout link — authentication state is correctly reflected in navigation on every page (IA-05)
  3. At least 8 published innovation records are seeded, spanning multiple mission areas, multiple technology areas (cloud, AI/ML, security, data, UX), all six maturity levels, multiple review statuses, and multiple contributing offices — so every filter dimension returns meaningfully distinct, non-overlapping results (SEED-01–06)
  4. The Audio Security POC is published as the primary technical reuse example with significant findings, source artifact links, an executive-decision example, and at least one record actively seeking an adopter or collaborator — and at least one record is archived/retired for lifecycle transparency (SEED-07–12)
  5. Every seeded published record satisfies all 15 publication gate fields (maturity, review status, attribution, owner/steward, last-reviewed date, source basis, applicable disclaimer) and displays an applicable trust disclaimer — no seeded record bypasses the publication gate (SEED-11)
**Plans**: TBD

Plans:
- [ ] 05-01: Navigation audit, route map verification, breadcrumb/context presence, and IA-05 auth-state header
- [ ] 05-02: Seed data authoring and publication for ≥8 records (Audio Security POC as primary; records covering all SEED dimensions)
- [ ] 05-03: Accessibility verification (WCAG 2.1 AA), deployment security checks (SEC-10 headers, SEC-08 secrets), and launch-acceptance sign-off

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Planned | - |
| 2. Discovery | 0/4 | Planned | - |
| 3. Engagement Flows | 0/4 | Not started | - |
| 4. Curation and Administration | 0/4 | Not started | - |
| 5. Launch Readiness | 0/3 | Not started | - |