# Requirements Traceability Matrix — TSIO Innovation Hub MVP
# RTM-TechSurHub

**Project:** TechSur Innovation Hub (TSIO Innovation Hub MVP)
**Organization:** TSIO Innovation & Research (I&R), Administrative Office of US Courts
**Document Type:** Requirements Traceability Matrix (RTM)
**Version:** 1.0
**Date:** 2026-08-11
**Status:** Working Draft
**Source Documents:** PRD-TechSurHub.md v1.0 | FRD-TechSurHub.md v1.0 | TechArch-TechSurHub.md v1.0 | UserStories-TechSurHub.md v1.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements Summary](#2-requirements-summary)
3. [Traceability Matrix — Features (F1–F9)](#3-traceability-matrix--features-f1f9)
4. [Traceability Matrix — Security Requirements (SEC-01–SEC-12)](#4-traceability-matrix--security-requirements-sec-01sec-12)
5. [Traceability Matrix — Non-Functional Requirements](#5-traceability-matrix--non-functional-requirements)
6. [Traceability Matrix — Launch Content Acceptance Conditions](#6-traceability-matrix--launch-content-acceptance-conditions)
7. [Requirements Detail](#7-requirements-detail)
8. [Test Case Coverage Matrix](#8-test-case-coverage-matrix)
9. [Change Management](#9-change-management)
10. [Approval](#10-approval)

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all TSIO Innovation Hub MVP specification documents. It ensures that every product-level requirement stated in the PRD is reflected in the functional contract (FRD), implemented through the technical architecture (TechArch), and verifiable via user stories with acceptance criteria.

The Hub is a curated, governed web portal that transforms scattered Judiciary innovation outputs into discoverable, understandable, and actionable institutional knowledge. The MVP centers on nine feature groups (F1–F9) that together enable discovery, comprehension, trust, attribution, engagement routing, and curation governance. The RTM traces each feature group from its product-level definition down to the database tables, API endpoints, UI components, and acceptance criteria that implement and verify it.

Traceability runs in both directions: from product requirements down to implementation details (forward traceability), and from implementation artifacts back up to originating product requirements (backward traceability). This matrix covers functional features, security requirements (SEC-01 through SEC-12), non-functional requirements (NFRs), and the six launch content acceptance conditions defined in PRD §12.

The RTM is a living document and must be updated whenever a requirement, functional specification, architectural decision, or user story is added, changed, or removed. Discrepancies between this RTM and the source documents must be escalated to the product owner before implementation proceeds. This document is required for the Pivota delivery acceptance review (PRD §11, Pivota Delivery acceptance measure).

---

## 2. Requirements Summary

### 2.1 Functional Features by Priority

- **P0 — Critical (9 feature groups, 42 sub-features):** All nine feature groups are required for MVP. F1 (Innovation Catalog), F2 (Search and Discovery), F3 (Innovation Record), F4 (Executive and Technical Perspectives), F5 (Existing Lessons-Learned Content), F8 (Engagement Routing), and F9 (Curation and Administration) are P0. F6 (Opportunity Submission) and F7 (Share Existing Innovation Work) are P1-High.
- **Feature sub-feature count:** F1: 6 sub-features | F2: 5 | F3: 9 | F4: 4 | F5: 5 | F6: 5 | F7: 4 | F8: 6 | F9: 16 | Total: 60 sub-features

### 2.2 Security Requirements

- **SEC-01 through SEC-12:** Twelve security requirements defined in PRD §10 and FRD §Security Access Control Rules. All are cross-cutting and apply to one or more feature groups.
- **Access control** (SEC-01, SEC-02): Curator/Admin role required for all protected functions.
- **Audit and governance** (SEC-03): Material auth events captured in audit history.
- **Artifact access** (SEC-04): Hub links only — never replicates restricted artifact content.
- **Privacy** (SEC-05): Submitter contact data handled per Judiciary requirements.
- **Abuse protection** (SEC-06): Rate limiting on all public submission and engagement endpoints.
- **Fail-safe** (SEC-07): Protected state is the default when a security control is unavailable.
- **Secrets management** (SEC-08): No credentials in source code; all via environment variables.
- **Dev stubs** (SEC-09): Development-only access mechanisms disabled in operational environments.
- **HTTP security headers** (SEC-10): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Review status distinction** (SEC-11): Security review status visually and logically distinct from technical review and maturity.
- **Pre-implementation security decisions** (SEC-12): Security decisions resolved or classified before capability is built for operational use.

### 2.3 Non-Functional Requirements

- **Accessibility:** WCAG 2.1 AA across all MVP journeys; critical issues block release.
- **Performance:** Response-time targets agreed during discovery before implementation baseline.
- **Browser Compatibility:** Judiciary-approved browser set confirmed during discovery.
- **Reliability:** Submissions and changes never silently lost; success/failure feedback required.
- **Auditability:** All material governance, lifecycle, and configuration changes are traceable.
- **Maintainability:** Handoff-ready source, deployment, and operational documentation.
- **Security:** Protected functions inaccessible without authorization; security verification required.
- **Traceability:** Requirements traceable to implementation and verification evidence (this RTM).

### 2.4 Launch Content Acceptance Conditions

Six conditions from PRD §12 must be satisfied at launch. They are product acceptance conditions, not optional post-build activities:
- At least 3 published innovation records
- At least 1 technical reuse example
- At least 1 executive decision example
- At least 1 adoption/collaboration example
- At least 1 archived/retired experiment (lifecycle transparency)
- Every published record carries complete governance metadata

---

## 3. Traceability Matrix — Features (F1–F9)

### 3.1 Primary Traceability Matrix

| PRD Feature | FRD Section | TechArch Components | User Stories | Priority |
|---|---|---|---|---|
| **F1: Innovation Catalog** | F01 (F1.1–F1.6) | `CatalogCard.tsx`, `CatalogGrid.tsx`, `catalog.service.ts`, `GET /api/v1/catalog`, `innovation_records` table | US-1.1, US-1.2, US-1.3 | P0 |
| F1.1: Browsable catalog | F01 §Process | `/app/(public)/page.tsx`, `catalog.service.ts` (retrieve published records) | US-1.1 AC: catalog loads without authentication | P0 |
| F1.2: Card: title and summary | F01 §Inputs (`title`, `summary`) | `CatalogCard.tsx` (`title`, `summary` fields; 280-char truncation) | US-1.1 AC: card displays title and summary ≤ 280 chars | P0 |
| F1.3: Card: tech area, maturity, review status, contributing office | F01 §Inputs (`technology_areas`, `maturity`, `review_statuses`, `contributing_offices`) | `MaturityBadge.tsx`, `ReviewStatusBadge.tsx`, `CatalogCard.tsx` | US-1.1 AC: maturity/review badges distinct; US-1.2 | P0 |
| F1.4: Card: engagement indicator | F01 §Engagement Indicator (7 canonical values) | `CatalogCard.tsx` (engagement_indicator field), `hub_settings` for configuration | US-1.3 AC: canonical engagement badges; no free-form labels | P0 |
| F1.5: Card: last-reviewed date and lifecycle state | F01 §Inputs (`last_reviewed_date`, `publication_state`) | `CatalogCard.tsx` (ISO date → human-readable; state badge for non-Published) | US-1.2 AC: last-reviewed date, superseded/archived indicators | P0 |
| F1.6: No false visual equivalence | F01 §Outputs (distinct visual treatment for maturity/state); SEC-11 | `MaturityBadge.tsx`, `ReviewStatusBadge.tsx` (WCAG color + text labels) | US-1.1 AC: badges non-interchangeable; US-1.2 AC: uniform treatment prohibited | P0 |
| **F2: Search and Discovery** | F02 (F2.1–F2.5) | `SearchBar.tsx`, `FilterPanel.tsx`, `FacetCount.tsx`, `search.service.ts`, `GET /api/v1/search`, `GET /api/v1/search/facets`, `search_vector` tsvector index | US-2.1, US-2.2, US-2.3 | P0 |
| F2.1: Problem-oriented search | F02 §Search Behavior Rules (problem_statement, key_findings high weight) | `search.service.ts` (tsvector query with weighted fields), `idx_ir_search_vector` GIN index | US-2.1 AC: "protect court audio" surfaces Audio Security POC without exact title | P0 |
| F2.2: Full-text search scope | F02 §Search Index (15 fields, weight A–D) | `search_vector` generated column; trigger `trg_ir_search_vector`; `plainto_tsquery` | US-2.1 AC: search covers problem statements, key findings, tags, mission/technology areas | P0 |
| F2.3: Faceted filtering | F02 §Filter Dimensions (9 dimensions: mission area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, lifecycle state) | `FilterPanel.tsx`, `FacetCount.tsx`, `GET /api/v1/search/facets`, GIN indexes on array fields | US-2.2 AC: all 9 filter dimensions present; OR within dimension, AND across dimensions | P0 |
| F2.4: Trust preserved in results | F02 §Search Behavior Rules (trust fields on every result card) | `CatalogCard.tsx` rendered from search results; maturity/review badges always included | US-2.1 AC: every result card displays maturity badge, review status badge(s), lifecycle indicator | P0 |
| F2.5: Problem-language query resolution | F02 §Search Behavior Rules (problem_statement, key_findings, tags at high weight) | `ts_rank` weighted ranking; weight 'A' for problem_statement, key_findings, tags, mission_areas | US-2.3 AC: empty query returns full catalog; results count displayed | P0 |
| **F3: Innovation Record** | F03a (F3.1–F3.5), F03b (F3.6–F3.9) | `RecordDetail.tsx`, `records.service.ts`, `GET /api/v1/records/:idOrSlug`, `innovation_records` table (Groups 0–9), `artifacts` table, `record_next_actions` table | US-3.1–US-3.7 | P0 |
| F3.1: Problem and Context | F03a §Group 1 (`title`, `summary`, `problem_statement`, `affected_users`, `current_workflow`, `why_experimentation`, `mission_areas`, `problem_type_tags`) | `innovation_records` columns Group 1; `idx_ir_mission_areas` GIN index | US-3.1 AC: problem statement, affected users, mission/technology tags displayed | P0 |
| F3.2: What Was Explored | F03a §Group 2 (`hypothesis_or_objective`, `scope_description`, `technology_areas`, `technologies_used`, `methods_used`, `tags`) | `innovation_records` columns Group 2; `idx_ir_technology_areas` GIN index | US-3.1 AC: hypothesis/objective and scope displayed | P0 |
| F3.3: Outcome and Evidence | F03a §Group 3 (`outcome_summary`, `what_worked`, `what_did_not_work`, `uncertainty_reduced`, `decision_enabled`, `evidence_summary`, `source_basis`) | `innovation_records` columns Group 3; `source_basis` is publication gate field | US-3.2 AC: outcome summary, what worked/didn't, decision enabled, source basis displayed | P0 |
| F3.4: Key Findings | F03a §Group 4 (11 `findings_*` fields; gate: ≥1 non-empty) | `innovation_records` findings columns; `key_findings_gate_check` computed gate validation | US-3.2 AC: findings organized by category; at least one required for publication | P0 |
| F3.5: Maturity and Readiness | F03a §Group 5 (`maturity`, `review_statuses`, `ready_for`, `not_ready_for`, `next_stage_requirements`, `last_reviewed_date`, `next_review_date`) | `MaturityBadge.tsx`, `ReviewStatusBadge.tsx`; `idx_ir_maturity` index; canonical enum constraints in DDL | US-3.3 AC: maturity badge, review badges (distinct), ready/not-ready, last-reviewed date | P0 |
| F3.6: Reuse Guidance | F03b §Group 6 (`reuse_potential`, `what_can_be_reused`, `what_should_be_adapted`, `what_not_to_copy`, `environment_assumptions`, `required_skills`, `required_services`, `production_readiness_gaps`, `engagement_indicator`) | `innovation_records` Group 6 columns; `idx_ir_engagement_indicator` index | US-3.4 AC: reuse potential, guidance fields, production-readiness gaps displayed | P0 |
| F3.7: Ownership and Attribution | F03b §Group 7 (`contributing_offices`, `contributor_names`, `ir_contribution`, `owner_steward`, `owner_contact`, `operational_owner`, `production_owner`, `attribution_statement`, `source_contribution_id`) | `innovation_records` Group 7; `attribution_statement` and `owner_steward` are publication gate fields | US-3.5 AC: contributing offices, contributors, owner/steward, attribution statement displayed | P0 |
| F3.8: Authoritative Artifacts | F03b §Group 8 (`artifacts` child table: `artifact_type`, `name`, `url`, `access_notes`, `is_restricted`, `display_order`); SEC-04 | `ArtifactList.tsx`; `artifacts` table; `artifacts.service.ts` (is_restricted URL suppression); `GET /api/v1/records/:id/artifacts` | US-3.6 AC: artifact type, name, access notes displayed; restricted artifacts hide URL from public | P0 |
| F3.9: Next Action (CTAs) | F03b §Group 9 (`record_next_actions` table; 6 action types; default "contact_ir" CTA) | `CTAPanel.tsx`, `record_next_actions` table, `EngagementForm.tsx`; CTAs keyboard-accessible (WCAG 2.1 AA) | US-3.7 AC: only enabled CTAs shown; default "Contact I&R" always present; keyboard accessible | P0 |
| **F4: Executive and Technical Perspectives** | F04 (F4.1–F4.4) | `PerspectiveToggle.tsx`, `ExecutiveView.tsx`, `TechnicalView.tsx`; `GET /api/v1/records/:id?view=executive|technical`; ARIA `role="tablist"` | US-4.1, US-4.2, US-4.3 | P0 |
| F4.1: Single record, both perspectives | F04 §Process (same underlying record data; no duplicate records) | `PerspectiveToggle.tsx`; single `GET /api/v1/records/:id` response; `?view=` query param | US-4.1 AC: toggle present; no conflicting values across perspectives; same URL | P0 |
| F4.2: Executive perspective framing | F04 §F4.2 (13-field prioritization: summary, problem_statement, outcome_summary, decision_enabled, security/operational findings, maturity, CTAs, ownership, disclaimer) | `ExecutiveView.tsx` (fields in priority order per FRD F4.2 table) | US-4.2 AC: leads with problem summary, outcome, risks, maturity; decision_enabled shown; low-level fields de-emphasized | P0 |
| F4.3: Technical perspective framing | F04 §F4.3 (23-field prioritization: hypothesis, scope, technologies, all findings_* fields, production_readiness_gaps, full reuse guidance, full artifact list) | `TechnicalView.tsx` (fields in priority order per FRD F4.3 table); `ArtifactList.tsx` prominent | US-4.3 AC: architecture, security, cloud, performance, testing findings; full artifact list; reuse guidance | P0 |
| F4.4: Shared evidence base | F04 §Validation (no conflicting values; trust fields in both perspectives; `is_restricted` enforcement in both) | Both views read same `PublicInnovationRecord` interface; trust fields not suppressed in either view | US-4.1 AC: trust fields in both perspectives; US-4.3 AC: maturity/review badges same values as executive | P0 |
| **F5: Existing Lessons-Learned Content** | F05 (F5.1–F5.5) | `records.service.ts`, `artifacts.service.ts`; `innovation_records` + `artifacts` tables; no new API endpoints | US-5.1, US-5.2, US-5.3 | P0 |
| F5.1: Source document as source of record | F05 §Terminology (Source Document = authoritative; Hub links, does not migrate) | Artifact URL points to SharePoint/Git source; `is_restricted` flag; no file upload mechanism | US-5.3 AC: source document linked via artifact record; not copied into Hub | P0 |
| F5.2: Create structured record from source | F05 §Process (steps 1–5: curator reads source; populates record fields by extraction) | `RecordEditor.tsx`, `POST /api/v1/curator/records`; all F3 fields editable | US-5.1 AC: Audio Security POC record discoverable via problem-oriented search | P0 |
| F5.3: Apply full metadata and governance | F05 §Process (steps 5–7: maturity, review_statuses, contributing_offices, owner_steward, last_reviewed_date, attribution_statement, applicable_disclaimer) | All governance fields in `innovation_records`; publication gate enforced at publish | US-5.2 AC: all 15 publication gate fields non-empty; maturity = experiment_poc | P0 |
| F5.4: Link to authoritative source; discoverable via search | F05 §Process (step 4: artifact link; step 9: publish → discoverable) | `artifacts` table with `artifact_type = lessons_learned`; search_vector indexes source-derived content | US-5.1 AC: record links to authoritative source artifact; discoverable via "court audio", "GPU separation" | P0 |
| F5.5: Audio Security POC as priority first candidate | F05 §Audio Security POC Content Requirements (all content model sections; maturity = experiment_poc; disclaimer: POC ≠ production-ready) | Full content model coverage: Groups 0–9 in `innovation_records`; both perspectives render correctly | US-5.2 AC: all 8 content sections populated; both perspectives render; all 15 gate fields met | P0 |
| **F6: Opportunity Submission** | F06 (F6.1–F6.5) | `OpportunityForm.tsx`, `submissions.service.ts`, `opportunity_submissions` table, `POST /api/v1/submissions/opportunity`; rate limiting middleware | US-6.1, US-6.2, US-6.3 | P1 |
| F6.1: Problem-first submission flow | F06 §Process (non-acceptance statement shown before fields; problem-first framing required) | `/app/(public)/submit/opportunity/page.tsx`; non-acceptance statement as first page element | US-6.1 AC: non-acceptance statement at top; problem description required before submitting | P1 |
| F6.2: Capture full context | F06 §Inputs (16 fields: request_type, problem_title, problem_description, affected_users, current_workflow, impact, desired_outcome, known_constraints, related_work_attempted, submitting_office, submitter_name, submitter_email, discovery_participants, additional_context, consent_to_contact, non_acceptance_acknowledged) | `opportunity_submissions` DDL; `OpportunityForm.tsx`; `submissions.schema.ts` (Zod validation) | US-6.1 AC: all required and optional fields captured | P1 |
| F6.3: Request type characterization | F06 §Request Type Canonical Values (8 values including share_existing_work redirect to F7) | `request_type` CHECK constraint in DDL; `OpportunityForm.tsx` (share_existing_work inline guidance) | US-6.2 AC: 8 canonical request types; "Share Existing Innovation Work" triggers F7 redirect guidance | P1 |
| F6.4: Non-acceptance statement | F06 §Process steps 2 and 12 (displayed prominently before and after submission) | `OpportunityForm.tsx` (statement at top); confirmation page re-statement; `non_acceptance_acknowledged` checkbox | US-6.3 AC: confirmation restates non-acceptance; reference number shown | P1 |
| F6.5: Submission recorded for queue | F06 §Outputs (persisted with `status = pending`; appears in F9.12 queue) | `opportunity_submissions` table; `GET /api/v1/curator/submissions/opportunity`; `SubmissionQueue.tsx` | US-6.3 AC: rate limiting enforced; submission enters curator queue | P1 |
| **F7: Share Existing Innovation Work** | F07 (F7.1–F7.4) | `ContributionForm.tsx`, `submissions.service.ts`, `innovation_contributions` table, `POST /api/v1/submissions/contribution`, `POST /api/v1/curator/submissions/contribution/:id/create-record` | US-7.1, US-7.2, US-7.3 | P1 |
| F7.1: Separate contribution flow | F07 §Process (distinct URL from F6; non-endorsement statement before fields) | `/app/(public)/submit/contribution/page.tsx`; separate route from F6; `ContributionForm.tsx` | US-7.1 AC: distinct URL; non-endorsement statement displayed | P1 |
| F7.2: Capture contribution context | F07 §Inputs (16 fields: contribution_title, problem_addressed, work_description, contributing_office, contributor_names, current_maturity, current_owner, owner_contact_email, artifact_links, known_limitations, collaboration_preference, additional_context, submitter_name, submitter_email, non_endorsement_acknowledged, consent_to_contact) | `innovation_contributions` DDL; `submissions.schema.ts` Zod validation; 5 canonical collaboration_preference values | US-7.1 AC: all fields captured; collaboration preference from canonical set | P1 |
| F7.3: Preserve attribution through curation | F07 §Attribution Preservation Rules (1–6: contributing_offices must include original; attribution_statement immutable credit; source_contribution_id immutable) | `source_contribution_id` FK immutable once set; attribution warning in `records.service.ts`; `ATTRIBUTION_REMOVAL_WARNING` error code | US-7.2 AC: published record includes contributing office and named contributors; attribution_statement credits originating team | P1 |
| F7.4: Curation required before publication | F07 §Process (steps 11–18: curator reviews in queue; accepted_for_curation → create record → full publication lifecycle) | `POST /api/v1/curator/submissions/contribution/:id/create-record`; publication gate enforced at publish; `SubmissionQueue.tsx` | US-7.3 AC: contribution enters queue with status=pending; no automatic publication | P1 |
| **F8: Engagement Routing** | F08 (F8.1–F8.6) | `CTAPanel.tsx`, `EngagementForm.tsx`, `engagement.service.ts`, `engagement_requests` table, `hub_settings` table, `POST /api/v1/engagement`, `email/router.ts` | US-8.1, US-8.2, US-8.3 | P0 |
| F8.1: Record-level and general CTAs | F08 §CTA Configuration Rules (0–6 CTAs per record; default "Contact I&R" always shown; general CTAs site-wide) | `CTAPanel.tsx`; `record_next_actions` table; `/app/(public)/engage/page.tsx` for general CTA; keyboard accessible | US-8.1 AC: CTAs present on records; US-8.2 AC: general "Contact I&R" from navigation | P0 |
| F8.2: Capture request context | F08 §Inputs (10 fields: request_type, originating_record_id, originating_record_title, requester_name, requester_office, requester_email, need_description, desired_next_step, preferred_contact_method, consent_to_contact) | `engagement_requests` DDL; `EngagementForm.tsx` pre-populated from record context | US-8.1 AC: form pre-populated with record ID and title; suggested subject shown | P0 |
| F8.3: Email-first routing + separate recording | F08 §Routing Behavior (persistence before email trigger; email failure does not lose record; mailto fallback behavior) | `engagement.service.ts` (DB persist then email route); `email/router.ts` (SMTP or mailto); `email_routing_initiated` flag | US-8.3 AC: request persisted before email; if email fails, request remains in DB; curator alerted | P0 |
| F8.4: Configurable routing destination | F08 §Routing Address Configuration; F9.15 | `hub_settings` table (`engagement_routing_address` key); `settings.service.ts`; `PUT /api/v1/curator/settings/routing` (Admin only); `routing_address_at_submission` audit snapshot | US-8.3 AC: `routing_address_at_submission` captured; US-9.13 AC: address changeable without redeployment | P0 |
| F8.5: Display language to I&R; initial address | F08 §CTA Configuration Rules ("TSIO Innovation & Research" display name; `AOml_TSO_IRB_Team@ao.uscourts.gov` default) | `hub_settings` (`engagement_routing_display_name` key); `EngagementForm.tsx` (display name not raw email in public text) | US-8.1 AC: display label reads "TSIO Innovation & Research" | P0 |
| F8.6: Suggested email subject patterns | F08 §Engagement Request Type (6 canonical subject patterns: "Demo Request – [Title]", "Adoption Discussion – [Title]", "Technical Guidance – [Title]", etc.) | `email/templates.ts`; pre-populated subject in `EngagementForm.tsx` and mailto href | US-8.1 AC: suggested subject pre-filled (e.g., "Demo Request – [Record Title]") | P0 |
| **F9: Curation and Administration** | F09a (F9.1–F9.8), F09b (F9.9–F9.16) | All `/curator/*` routes; `RecordEditor.tsx`, `PublicationGate.tsx`, `AuditHistory.tsx`, `SubmissionQueue.tsx`, `SettingsPanel.tsx`; all curator API endpoints | US-9.1–US-9.14, US-9-SEC | P0 |
| F9.1: Curator Summary Dashboard | F09a §F9.1 (record counts by state; records needing review; pending queue counts; recent engagement; last 5 audit events) | `/app/curator/page.tsx`; `GET /api/v1/curator/dashboard`; live counts at page load (no cache) | US-9.1 AC: all dashboard elements present; counts reflect live data | P0 |
| F9.2: Record Management List | F09a §F9.2 (all lifecycle states; 9 required columns; 7 filter options; per-record actions; pagination 25/50/100) | `/app/curator/records/page.tsx`; `GET /api/v1/curator/records`; sort by updated_at default | US-9.2 AC: all states visible; all columns; filter options; per-record actions available | P0 |
| F9.3: Record Creation | F09a §F9.3 (draft on create; title required for non-empty; from contribution pre-populates; audit: record_created) | `POST /api/v1/curator/records`; `records.service.ts`; `audit.service.ts` (record_created event) | US-9.3 AC: creates as draft; only title required at start; pre-population from contribution | P0 |
| F9.4: Record Editing | F09a §F9.4 (all fields editable; optimistic concurrency via `version`; auto-save for drafts; audit events per change type) | `PATCH /api/v1/curator/records/:id`; `version` field; 409 VERSION_CONFLICT; `RecordEditor.tsx` auto-save | US-9.4 AC: all fields editable; 409 on conflict; auto-save for drafts | P0 |
| F9.5: Artifact Management | F09a §F9.5 (add, edit, reorder, remove, restrict; audit events; is_restricted URL suppression in public API) | `POST/PATCH/DELETE /api/v1/curator/records/:id/artifacts/:aid`; `artifacts.service.ts`; `artifact_removed` audit event | US-9.4 AC: add/edit/reorder/remove artifacts; restricted URL hidden from public | P0 |
| F9.6: Maturity Management | F09a §F9.6 (any value at any time; no enforced progression; maturity_changed audit; independence from review_statuses) | `records.service.ts` maturity update; `maturity_changed` audit event; canonical enum CHECK; maturity definitions from F9.16 inline | US-9.5 AC: any canonical value settable; maturity_changed audit event; maturity never affects review status | P0 |
| F9.7: Review Status Management | F09a §F9.7 (multi-value array; add/remove independently; security_reviewed visually distinct; review_status_changed audit; validated_for_reuse confirmation) | `review_statuses TEXT[]` column; `idx_ir_review_statuses` GIN index; `ReviewStatusBadge.tsx` (SEC-11); `review_status_changed` audit | US-9.5 AC: multiple values simultaneously; security_reviewed distinct; review_status_changed audit | P0 |
| F9.8: Attribution and Ownership | F09a §F9.8 (9 editable attribution fields; contributed record preservation warning; attribution_updated audit) | `records.service.ts` attribution validation; `ATTRIBUTION_REMOVAL_WARNING`; `attribution_updated` audit event | US-9.6 AC: attribution fields editable; warning before removing original contributor; audit generated | P0 |
| F9.9: Publication Lifecycle | F09b §F9.9 (9 lifecycle transitions; every transition audited; public visibility rules per state) | `POST /api/v1/curator/records/:id/{publish,unpublish,supersede,archive,retire,reactivate}`; `publication_state_changed` audit | US-9.7 AC: all transitions supported; superseded publicly discoverable; retired hidden from public | P0 |
| F9.10: Publication Gate | F09b §F9.10 (15 required fields; server-enforced; 422 PUBLICATION_GATE_FAILED with field list; warning-only conditions) | `records.service.ts` gate check; `PublicationGate.tsx` gate status display; `PUBLICATION_GATE_FAILED` 422 response | US-9.7 AC: publication blocked if any of 15 fields missing; US-9.8 AC: field list returned | P0 |
| F9.11: Audit History | F09b §F9.11 (14 canonical event types; append-only; INSERT-only DB role; per-record and system-wide views) | `audit_events` table (INSERT-only role); `AuditHistory.tsx`; `GET /api/v1/curator/records/:id/audit`; `GET /api/v1/curator/audit` | US-9.9 AC: all event types captured; append-only; actor + timestamp + change detail | P0 |
| F9.12: Opportunity Submission Queue | F09b §F9.12 (all submissions; filterable by status; full detail view; disposition actions; SEC-01, SEC-05) | `SubmissionQueue.tsx`; `GET/PATCH /api/v1/curator/submissions/opportunity`; `submission_dispositioned` audit | US-9.10 AC: pending submissions prominent; disposition actions available; curator-only access | P0 |
| F9.13: Contribution Queue | F09b §F9.13 (all contributions; 6 disposition values; "Create Record from Contribution"; pre-populate with source_contribution_id immutable) | `SubmissionQueue.tsx`; `POST /api/v1/curator/submissions/contribution/:id/create-record`; `record_created_from_contribution` audit | US-9.11 AC: full contribution detail; create record from accepted; attribution preserved | P0 |
| F9.14: Engagement Activity | F09b §F9.14 (all engagement requests; follow-up status; email failure flags; filterable; curator-only; SEC-05) | `GET/PATCH /api/v1/curator/engagement/:id/status`; `engagement_status_updated` audit; email failure highlighting | US-9.12 AC: all requests listed; follow-up status recordable; email failures highlighted | P0 |
| F9.15: Settings Management | F09b §F9.15 (engagement routing address; taxonomy; rate limits; Admin-only for routing address; settings_changed audit; no redeployment needed) | `hub_settings` table; `settings.service.ts`; `SettingsPanel.tsx`; `GET/PUT /api/v1/curator/settings`; `settings_changed` audit | US-9.13 AC: routing address updatable without redeployment; audit generated; Admin-only change | P0 |
| F9.16: Content Model Reference | F09b §F9.16 (maturity, review status, lifecycle, engagement indicator definitions; disclaimer templates; read-only in MVP) | `/app/curator/reference/page.tsx`; `GET /api/v1/curator/reference`; inline help in `RecordEditor.tsx` | US-9.14 AC: definitions accessible from curator edit UI; disclaimer templates available; curator/admin only | P0 |

---

## 4. Traceability Matrix — Security Requirements (SEC-01–SEC-12)

| Security Req | PRD §10 | FRD Rule | TechArch Implementation | Affected Features | Verification |
|---|---|---|---|---|---|
| **SEC-01** | Administrative/curation capabilities require authorized access | FRD §Security Access Control Rules: authenticated Curator or Admin role required for all protected functions | `auth.middleware.ts` (role resolution: curator \| admin); 401/403 responses; `ENABLE_DEV_AUTH_BYPASS` env var; all `/curator/*` routes protected | F9.1–F9.16 (all curator/admin) | US-9.1 AC: dashboard curator-only; US-9-SEC AC-1: startup refuses with dev stub in production |
| **SEC-02** | Unauthorized/unauthenticated must not access protected functions | FRD: Any attempted access to protected route → error or redirect, never silent access | Auth middleware returns 401 (no token) / 403 (wrong role); 404 returned for non-published records accessed by anonymous users | F3 (draft/retired record access), F9 (all curator routes) | US-9-SEC: unauthorized access never silently allows; record detail 404 for draft/retired |
| **SEC-03** | Auth/authorization events auditable | FRD: Login, role assignment, unauthorized attempts on curator routes → audit_events | `audit.service.ts` captures `user_role_changed`; auth events in audit_events table; settings changes audited | F8.4 (routing address change), F9.15 (settings), F9.6/9.7 (governance changes) | US-9.13 AC: routing address change generates audit event; US-9-SEC AC-4: signed-off security decision register |
| **SEC-04** | Publication must not broaden artifact access | FRD: `is_restricted = true` artifacts → name + access_notes only in public API; URL never in public response | `artifacts.service.ts` filters URL from public API response when `is_restricted = true`; publication does not modify `is_restricted` | F3.8 (artifact links), F5 (lessons-learned artifacts) | US-3.6 AC: restricted artifacts hide URL; US-5.3 AC: publishing does not change is_restricted |
| **SEC-05** | Contact info handled per Judiciary privacy requirements | FRD: `submitter_email`, `requester_email` per applicable data-protection requirements; not exposed in public API | `submission_ip`, `submitter_email` fields: not in public API responses; curator-only view; data retention per §3.4 | F6 (opportunity submission contact), F7 (contribution contact), F8 (engagement requester contact), F9.10/9.12/9.14 | US-9.10 AC: submitter contact info per SEC-05; US-9.12 AC: requester contact curator-only |
| **SEC-06** | Public submission capabilities protected from automated abuse | FRD: Rate limiting (5 submissions/IP/hour for F6/F7; 10 engagements/IP/hour for F8); CAPTCHA TBD; controlled dev bypass permitted | `rate-limit.middleware.ts` applied to `POST /api/v1/engagement`, `POST /api/v1/submissions/*`; limits from `hub_settings`; Redis-backed (in-memory dev fallback); `ENABLE_CAPTCHA_BYPASS` env var | F6 (opportunity form), F7 (contribution form), F8 (engagement form) | US-6.3 AC: max 5 submissions/IP/hour; 429 response with message; US-8.2 AC: max 10 requests/IP/hour |
| **SEC-07** | Security failures → protected state (deny, not allow) | FRD: If rate limit store unavailable → deny; if routing address not configured → show error, not open access | `rate-limit.middleware.ts`: store unavailable → default deny; engagement.service.ts: no routing address → 503 ROUTING_NOT_CONFIGURED | F6 (rate limit), F7 (rate limit), F8 (routing), F9 (access control) | US-8.3 AC: if no routing address configured → error message shown; rate limiter unavailable → deny |
| **SEC-08** | No credentials/secrets in source code | FRD: All secrets via environment variables or approved secrets management | `Dockerfile` / `docker-compose.yml`: all secrets via env vars; `.env.example` committed (no real values); `.env` gitignored; 13 env vars documented in TechArch §1.3 | All features (configuration applies globally) | US-9.13 AC: routing address in hub_settings not in code; US-9-SEC: pre-deployment checklist item |
| **SEC-09** | Dev/test access mechanisms not active in operational environments | FRD: `ENABLE_DEV_AUTH_BYPASS` only when `NODE_ENV=development`; startup error if both production + bypass enabled | `lib/auth/dev-stub.ts` (dev only); auth middleware: if `ENABLE_DEV_AUTH_BYPASS=true` AND `NODE_ENV=production` → startup error; dev-stub removed from production build via tree-shaking | F9 (curator/admin protected routes) | US-9-SEC AC-1: app refuses to start if dev stub enabled in production; AC-2: pre-deployment checklist |
| **SEC-10** | Operational deployments implement HTTP security headers | FRD: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy | `security-headers.ts` middleware; applied to all responses; CSP configured per deployment (prevents inline script injection); HSTS for HTTPS deployments | All public and curator routes | US-9-SEC AC-3: headers verified via automated scan before release |
| **SEC-11** | Security review status visually distinct from technical review and maturity | FRD: `security_reviewed` is visually and logically distinct from `technically_reviewed` in all display contexts | `ReviewStatusBadge.tsx` (distinct badge styling for `security_reviewed` vs `technically_reviewed`; not color-alone — text label + color per WCAG); MaturityBadge separate component | F1.6 (catalog cards), F3.5 (record detail), F4.2/F4.3 (perspectives), F9.7 (curator UI) | US-1.1 AC: review status badges visually distinct from maturity badges; US-3.3 AC: security_reviewed visually distinct; US-9.5 AC: security_reviewed distinct in curator UI |
| **SEC-12** | Security/access decisions resolved before capability built for operational use | FRD: Security and access decisions classified as blocker vs. accepted risk before implementation | TechArch §1.5 Deployment Blockers: hosting (INT-02 TBD), IAM (INT-01 TBD), CAPTCHA (INT-05 TBD) documented; `ENABLE_DEV_AUTH_BYPASS` env var documented; discovery decisions required per PRD §15.2 | F9 (curator/admin); F6/F7/F8 (CAPTCHA); All (hosting) | US-9-SEC AC-4: signed-off security decision register exists before non-development deployment |

---

## 5. Traceability Matrix — Non-Functional Requirements

| NFR Category | PRD §9 Requirement | FRD / TechArch Implementation | Verification Method | Completion Gate |
|---|---|---|---|---|
| **Accessibility** | Core stakeholder and curator journeys conform to WCAG 2.1 AA; critical issues block release | TechArch §2.3.1: semantic HTML, ARIA labels, ≥4.5:1 contrast, visible focus indicators, skip navigation (`SkipNav.tsx`); `PerspectiveToggle.tsx` ARIA tablist; form errors via `role="alert"` / `aria-describedby` | Automated accessibility scan + manual review of all MVP journeys | Unresolved critical issues block release |
| **Performance** | Catalog, search, record viewing, form interactions meet targets agreed before build | TechArch: PostgreSQL tsvector with GIN index (`idx_ir_search_vector`); SSR for initial page load; Next.js App Router; server-side rendering eliminates JS-blocking on catalog | Repeatable performance testing against agreed target; baseline confirmed during discovery | Targets baselined before build begins |
| **Browser Compatibility** | Core MVP journeys function on Judiciary-approved browser set | TechArch: Next.js (modern browser targets); legacy IE not supported; SSR ensures content available without JS | Cross-browser validation on approved set | Browser list confirmed during discovery |
| **Reliability** | Submissions and curator changes must not be silently lost; clear success/failure feedback | FRD F08 §Routing Behavior: DB persist before email; email failure → curator flag, not user error; optimistic concurrency (version field) prevents lost concurrent changes | Functional and failure-path testing: submit engagement with email down; concurrent edit conflict; form validation | All write workflows tested for success and failure paths |
| **Auditability** | Material governance, lifecycle, ownership, and configuration changes are traceable | TechArch §2.5: audit events appended synchronously in same DB transaction; `audit_events` table INSERT-only (DB role enforced); 14 canonical event types; never updated or deleted | Audit history verification: trace each material action to audit event; verify no update/delete on audit_events | All governed actions produce verifiable audit trail |
| **Maintainability** | Solution can be understood, operated, configured, and extended by receiving technical team | TechArch: TypeScript; Kysely/Drizzle (type-safe SQL); Docker + docker-compose; `migrations/` numbered SQL files; `.env.example`; service layer (no business logic in route handlers) | Independent handoff review: new team member can run, configure, and extend with source + documentation | Handoff review passes before release |
| **Security** | Protected functions and restricted content inaccessible without authorization; operational controls present | See SEC-01 through SEC-12 above; `auth.middleware.ts`; `security-headers.ts`; `rate-limit.middleware.ts`; `csrf.middleware.ts` | Security verification: negative-path testing (unauthorized access attempts, rate limit bypass attempts); HTTP header scan | All security requirements verified; no open blockers per SEC-12 |
| **Traceability** | Product requirements traceable to functional design, implementation, and verification evidence | This RTM document; all source spec documents (PRD, FRD, TechArch, UserStories); bidirectional linkage from F-IDs to FRD sections to TechArch components to user story ACs | RTM review before release; all PRD features, FRD requirements, TechArch specs, and user stories cross-referenced | RTM complete and reviewed before release acceptance |

---

## 6. Traceability Matrix — Launch Content Acceptance Conditions

These six conditions from PRD §12 are product acceptance conditions, not optional post-build activities. The Audio Security POC is the priority candidate for seeding the initial content set.

| Launch Condition | Minimum Requirement | PRD §12 | FRD Coverage | TechArch Coverage | User Story | Verification |
|---|---|---|---|---|---|---|
| **LC-01: Published content threshold** | At least 3 published innovation records | §12 row 1 | F9.10 Publication Gate (all 15 fields); F9.9 lifecycle → published | `publication_state = 'published'` constraint; `GET /api/v1/catalog` returns ≥3 records | US-5.2 (Audio Security POC published), US-9.7 (publication lifecycle) | Catalog page shows ≥3 published records at launch |
| **LC-02: Technical reuse example** | At least 1 published record with significant reusable technical findings and source artifacts | §12 row 2 | F3.4 (findings_architectural, findings_security, etc.); F3.6 (reuse guidance); F3.8 (artifacts); F5.5 (Audio Security POC) | `findings_*` fields populated; `artifacts` table with ≥1 artifact linked; technical perspective renders correctly | US-5.1 (Audio Security POC discoverable); US-5.2 (full content model); US-4.3 (technical perspective) | At least 1 published record passes: findings populated, artifact linked, technical perspective renders |
| **LC-03: Executive decision example** | At least 1 published record supporting an executive decision or sponsorship discussion | §12 row 3 | F4.2 (executive perspective fields: decision_enabled, outcome_summary, maturity, CTAs); F3.3 (decision_enabled field) | `ExecutiveView.tsx` renders `decision_enabled` field; executive perspective accessible | US-4.2 (executive perspective for decision-making) | At least 1 published record: `decision_enabled` populated; executive perspective renders decision context |
| **LC-04: Adoption/collaboration example** | At least 1 published record seeking adopter, collaborator, demonstration, or concrete engagement | §12 row 4 | F3.6 (`engagement_indicator` = demo_available, seeking_adoption_partner, or equivalent); F8.1 (CTAs present on record) | `engagement_indicator` set to active value; CTAs enabled on record; `record_next_actions` populated | US-1.3 (engagement indicators on catalog); US-3.7 (contextual CTAs) | At least 1 published record: engagement_indicator set; ≥1 CTA enabled; engagement request submittable |
| **LC-05: Lifecycle transparency example** | At least 1 archived, retired, stopped, or superseded experiment retained for institutional learning | §12 row 5 | F9.9 lifecycle (archived/superseded states publicly visible with indicators); F1.5/F1.6 (lifecycle state on card) | `publication_state = 'archived'` or `'superseded'`; supersession banner or archived indicator rendered | US-1.2 (lifecycle state without opening record); US-9.7 (publication lifecycle transitions) | At least 1 record in archived or superseded state; visible in catalog with appropriate state indicator |
| **LC-06: Complete governance metadata** | Every published record includes maturity, review status, attribution, owner/steward, last-reviewed date, source basis/artifact, and appropriate next action | §12 row 6 | F9.10 Publication Gate (15 required fields enforced at publication); F3.5 (maturity + review_statuses); F3.7 (attribution + owner_steward); F3.9 (CTAs) | Publication gate server-enforced; 422 PUBLICATION_GATE_FAILED blocks incomplete records; `TrustBanner.tsx` renders disclaimer | US-9.8 (publication gate enforcement) | All published records pass 15-field gate check; no published record missing governance fields |

---

## 7. Requirements Detail

### 7.1 PRD Features → FRD Requirements Mapping

| PRD Feature | Sub-Features | FRD Requirements | Publication Gate Fields | FRD API Endpoints |
|---|---|---|---|---|
| F1: Innovation Catalog | F1.1–F1.6 | F01: catalog card rendering rules; engagement indicator canonical values; visibility rules per publication_state | n/a (catalog consumes published records) | GET /api/v1/catalog |
| F2: Search and Discovery | F2.1–F2.5 | F02: 15-field search index; 9 filter dimensions; AND/OR logic; trust fields required in results | n/a | GET /api/v1/search, GET /api/v1/search/facets |
| F3: Innovation Record | F3.1–F3.5 (F03a) | Group 0: identity/system fields; Group 1: problem/context (8 fields); Group 2: explored (6 fields); Group 3: outcome/evidence (7 fields); Group 4: findings (11 fields + gate check); Group 5: maturity/readiness (8 fields) | title, summary, problem_statement, mission_areas, hypothesis_or_objective, technology_areas, outcome_summary, source_basis, key_findings_gate_check, maturity, review_statuses, last_reviewed_date | GET /api/v1/records/:idOrSlug |
| F3: Innovation Record | F3.6–F3.9 (F03b) | Group 6: reuse guidance (9 fields); Group 7: ownership (10 fields); Group 8: artifacts (child table); Group 8b: governance (4 fields); Group 9: next actions (record_next_actions table) | owner_steward, attribution_statement, applicable_disclaimer | POST/PATCH /api/v1/curator/records; lifecycle endpoints |
| F4: Exec/Tech Perspectives | F4.1–F4.4 | F04: perspective rendering rules (13 exec fields; 23 tech fields); shared evidence base; view query param | All F3 publication gate fields (perspectives render same record) | GET /api/v1/records/:id?view=executive|technical |
| F5: Lessons-Learned | F5.1–F5.5 | F05: source document as record basis; artifact linked as lessons_learned type; maturity = experiment_poc; disclaimer required | All 15 gate fields; source_basis emphasised | Same as F3/F9 — no new endpoints |
| F6: Opportunity Submission | F6.1–F6.5 | F06: 16 input fields; 8 request types; consents required; rate limiting | n/a (separate submissions table) | POST /api/v1/submissions/opportunity |
| F7: Share Innovation | F7.1–F7.4 | F07: 16 input fields; 5 collaboration preference values; attribution preservation rules (6 rules); 6 disposition values | attribution_statement required for contributed records at publication | POST /api/v1/submissions/contribution; create-record endpoint |
| F8: Engagement Routing | F8.1–F8.6 | F08: 10 input fields; 6 request types; 6 subject patterns; dual recording (DB + email); routing address from hub_settings | n/a (engagement_requests table) | POST /api/v1/engagement; curator engagement endpoints |
| F9: Curation/Admin | F9.1–F9.8 (F09a) | Core curator: dashboard summary; record list; creation; editing (optimistic concurrency); artifact ops; maturity/review management; attribution preservation | All 15 gate fields enforced at publication | All /api/v1/curator/* CRUD endpoints |
| F9: Curation/Admin | F9.9–F9.16 (F09b) | Lifecycle (9 transitions); gate enforcement (15 conditions + warning-only); audit (14 event types, INSERT-only); submission queues; engagement activity; settings (hub_settings); content model reference | Same 15 gate fields | All /api/v1/curator/* lifecycle, audit, settings, reference endpoints |

### 7.2 Database Tables → Feature Mapping

| Table | Primary Feature(s) | FRD Section | Key Constraints |
|---|---|---|---|
| `innovation_records` | F1, F2, F3, F4, F5, F9 | F03a, F03b, F09a, F09b | 15 publication gate fields; 6 maturity values CHECK; 6 publication_state values CHECK; self-ref FK for superseded_by; search_vector TSVECTOR with GIN index; optimistic concurrency via version |
| `artifacts` | F3.8, F5, F9.5 | F03b §Group 8, F05 | FK → innovation_records ON DELETE CASCADE; is_restricted URL suppression; artifact_type CHECK (11 values); URL format CHECK |
| `record_next_actions` | F3.9, F8.1 | F03b §Group 9, F08 | FK → innovation_records ON DELETE CASCADE; action_type CHECK (6 values); max 6 per record (application-enforced) |
| `opportunity_submissions` | F6, F9.12 | F06, F09b §F9.12 | request_type CHECK (8 values); status CHECK (5 values); consents CHECK (both must be TRUE) |
| `innovation_contributions` | F7, F9.13 | F07, F09b §F9.13 | current_maturity CHECK (6 values); collaboration_preference CHECK (5 values); status CHECK (6 values); deferred FK → innovation_records |
| `engagement_requests` | F8, F9.14 | F08, F09b §F9.14 | request_type CHECK (6 values); follow_up_status CHECK (4 values); routing_address_at_submission captured at submission; consent CHECK (must be TRUE) |
| `audit_events` | F9.11 (all features) | F09b §F9.11 | INSERT-only (DB role REVOKE UPDATE/DELETE); event_type CHECK (14 values); target_type CHECK (7 values); occurred_at immutable |
| `hub_settings` | F8.4, F9.15 | F08 §Routing, F09b §F9.15 | setting_key PK; setting_type CHECK (4 types); 9 seed settings including engagement_routing_address |

### 7.3 Key Trust Model Implementation

The trust model (POC ≠ production-ready; Published ≠ approved; Community-submitted ≠ endorsed; Validated ≠ eliminates local review) is implemented at four architectural layers:

| Trust Statement | FRD Enforcement | TechArch Component | User Story Verification |
|---|---|---|---|
| POC ≠ production-ready | `applicable_disclaimer` publication gate field (field 15); POC maturity warning at publish | `TrustBanner.tsx` (renders disclaimer on all records); disclaimer cannot be suppressed by frontend | US-3.3 AC: POC record never presents as production-ready; disclaimer visible |
| Published ≠ approved for adoption | `applicable_disclaimer` required; curator must select/write disclaimer | `TrustBanner.tsx`; F9.16 disclaimer templates; disclaimer appears in both executive and technical perspectives | US-4.1 AC: trust fields appear in both perspectives |
| Community-submitted ≠ centrally endorsed | F07 non-endorsement statement on contribution form and confirmation page; attribution_statement credits originating team, not I&R central | `ContributionForm.tsx` non-endorsement statement; `TrustBanner.tsx`; F7 attribution preservation rules | US-7.2 AC: attribution credits originating team; non-endorsement stated |
| Validated for reuse ≠ eliminates local review | Review status `validated_for_reuse` requires curator confirmation; applicable_disclaimer includes this qualification | `ReviewStatusBadge.tsx`; curator confirmation dialog for validated_for_reuse; disclaimer templates in F9.16 | US-9.5 AC: adding validated_for_reuse requires confirmation |

---

## 8. Test Case Coverage Matrix

### 8.1 Feature Test Coverage

| Feature | User Stories | Acceptance Criteria Count | Key Test Scenarios | Priority |
|---|---|---|---|---|
| **F1: Innovation Catalog** | US-1.1, US-1.2, US-1.3 | 7 + 5 + 4 = 16 ACs | Catalog loads without auth; maturity/review badges distinct (SEC-11); engagement badges from canonical set only; superseded/archived indicators visible; empty state shown | P0 |
| **F2: Search and Discovery** | US-2.1, US-2.2, US-2.3 | 6 + 6 + 5 = 17 ACs | "protect court audio" → Audio Security POC surfaced; 9 filter dimensions; OR/AND logic; anonymous cannot filter to Draft; empty query returns full catalog; search unavailable → catalog link | P0 |
| **F3: Innovation Record** | US-3.1–US-3.7 | 5+5+5+4+4+5+5 = 33 ACs | All F3 field groups display correctly; restricted artifact URL hidden from public; default "Contact I&R" CTA always present; publication gate enforced | P0 |
| **F4: Exec/Tech Perspectives** | US-4.1, US-4.2, US-4.3 | 5 + 5 + 5 = 15 ACs | Toggle keyboard accessible; no conflicting values across perspectives; trust fields in both; exec view: decision_enabled; tech view: full findings + artifact list | P0 |
| **F5: Lessons-Learned** | US-5.1, US-5.2, US-5.3 | 5 + 5 + 5 = 15 ACs | Audio Security POC discoverable via "court audio"/"GPU separation"; all 15 gate fields populated; maturity = experiment_poc; POC disclaimer present; source artifact linked (not copied) | P0 |
| **F6: Opportunity Submission** | US-6.1, US-6.2, US-6.3 | 7 + 4 + 5 = 16 ACs | Non-acceptance statement at top; all required fields captured; "Share Existing Work" redirects to F7; rate limit 5/IP/hour; reference number on confirmation; submission enters curator queue | P1 |
| **F7: Share Innovation Work** | US-7.1, US-7.2, US-7.3 | 5 + 6 + 4 = 15 ACs | Distinct URL from F6; non-endorsement statement; contributing_offices includes original on published record; source_contribution_id immutable; submission enters contribution queue; no auto-publication | P1 |
| **F8: Engagement Routing** | US-8.1, US-8.2, US-8.3 | 7 + 5 + 5 = 17 ACs | CTA opens pre-populated form; DB persisted before email; email failure → curator alert, no user error; mailto routing: confirmation note; routing_address_at_submission captured; no routing address → SEC-07 error | P0 |
| **F9: Curation/Admin** | US-9.1–US-9.14, US-9-SEC | 7+6+6+6+8+5+7+5+5+6+6+5+5+5+4 = 91 ACs | Dashboard live counts; all lifecycle states visible; 15-field gate enforced; all audit event types captured; INSERT-only audit_events; routing address changeable without redeployment; dev stub disabled in production | P0 |
| **Security (SEC-01–12)** | US-9-SEC (4 ACs) | 4 ACs | App startup refusal with dev stub + production env; HTTP headers verified; security decision register exists before protected capability deployment | Cross-cutting |

### 8.2 Test Coverage Summary by Feature

| Feature | Stories | P0 Stories | P1 Stories | Total ACs | Coverage Goal |
|---|---|---|---|---|---|
| F1: Innovation Catalog | 3 | 3 | 0 | 16 | 100% |
| F2: Search and Discovery | 3 | 3 | 0 | 17 | 100% |
| F3: Innovation Record | 7 | 7 | 0 | 33 | 100% |
| F4: Exec/Tech Perspectives | 3 | 3 | 0 | 15 | 100% |
| F5: Lessons-Learned Content | 3 | 3 | 0 | 15 | 100% |
| F6: Opportunity Submission | 3 | 0 | 3 | 16 | 100% |
| F7: Share Innovation Work | 3 | 0 | 3 | 15 | 100% |
| F8: Engagement Routing | 3 | 3 | 0 | 17 | 100% |
| F9: Curation and Administration | 14 + US-9-SEC | 14 | 0 | 91 + 4 | 100% |
| **Totals** | **43** | **36** | **6** | **≈239** | **100%** |

### 8.3 Critical Test Cases by Category

#### TEST-CAT-01: Publication Gate Enforcement
- **Covers:** F9.10, SEC-07, LC-06
- **Scenarios:** Attempt publication with each of the 15 gate fields empty (one at a time); verify 422 PUBLICATION_GATE_FAILED with correct field identified; verify draft save permitted without gate fields; verify warning-only conditions (maturity mismatch, title uniqueness) show warning but do not block; verify gate is server-side only (direct API call blocked even without UI)

#### TEST-CAT-02: Trust Model Visual Distinction
- **Covers:** F1.6, F3.5, SEC-11
- **Scenarios:** Verify MaturityBadge and ReviewStatusBadge use distinct non-interchangeable visual treatment; verify security_reviewed is distinct from technically_reviewed; verify badges use text labels not color alone (accessibility); verify POC record has applicable disclaimer; verify trust fields appear in both executive and technical perspectives

#### TEST-CAT-03: Engagement Routing Reliability
- **Covers:** F8.3, F8.4, SEC-07
- **Scenarios:** Submit engagement with SMTP available → verify DB record created AND email sent; submit with SMTP down → verify DB record created, curator admin flagged, no user error; verify routing_address_at_submission captured correctly; change routing address via settings → verify new requests use new address; verify old requests retain original address snapshot

#### TEST-CAT-04: Audit Trail Completeness
- **Covers:** F9.11, SEC-03, NFR Auditability
- **Scenarios:** Verify each of 14 canonical audit event types is generated by its triggering action; verify audit_events INSERT-only (no UPDATE/DELETE via API or DB role); verify each event captures actor_id, actor_name, target_id, event_data (before/after), occurred_at; verify maturity change captures previous and new values; verify publication state change is captured

#### TEST-CAT-05: Security Access Control
- **Covers:** SEC-01, SEC-02, SEC-09
- **Scenarios:** Unauthenticated access to /curator/* → 401; valid token, wrong role → 403; verify dev stub disabled in production (startup error); verify ENABLE_DEV_AUTH_BYPASS=true + NODE_ENV=production → app refuses to start; verify is_restricted artifact URL not in public API response; verify draft/retired records return 404 to anonymous users

#### TEST-CAT-06: Attribution Preservation for Contributions
- **Covers:** F7.3, F7.4, F9.8, F9.13
- **Scenarios:** Create record from accepted contribution; verify source_contribution_id set and immutable; attempt publication with empty attribution_statement → gate fails; curator attempts to remove original contributing office → warning surfaced; verify published record's contributing_offices includes original office; verify published record's contributor_names includes original names

#### TEST-CAT-07: Search Accuracy and Trust in Results
- **Covers:** F2.1, F2.4, F2.5
- **Scenarios:** Query "protect court audio" → Audio Security POC surfaces; query "GPU separation" → surfaces; query "Azure Government Cloud" → surfaces; verify every result card shows maturity badge, review status badge(s); verify anonymous user cannot filter to Draft; verify partial word matching (e.g., "audio sec" → surfaces audio security records)

#### TEST-CAT-08: Submission Abuse Protection
- **Covers:** SEC-06, SEC-07, F6, F7, F8
- **Scenarios:** Submit 5 opportunity submissions from same IP within 1 hour → 5th succeeds; 6th → 429 RATE_LIMITED; submit 10 engagement requests → 10th succeeds; 11th → 429; rate limit store unavailable → deny (SEC-07); verify submission_ip not exposed in public API responses (SEC-05)

---

## 9. Change Management

| Version | Date | Change | Changed By | Impact |
|---|---|---|---|---|
| 1.0 | 2026-08-11 | Initial RTM created from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | Pivota Spec Generator | Baseline |
| — | — | Future changes to be tracked here | — | — |

### Change Management Rules

- Any change to a PRD feature (addition, deletion, or scope change) requires an RTM update before implementation proceeds.
- Any change to a FRD functional contract, TechArch component name, or user story acceptance criterion that affects traceability must be reflected in this RTM within the same sprint.
- ID conventions are fixed: PRD features use F-prefixes; FRD sections use F-series (F01–F09b); TechArch uses component paths and table names; User Stories use US-n.n format; Test categories use TEST-CAT-nn.
- Conflicts between this RTM and source documents must be escalated to the product owner before implementation proceeds. The FRD is the authoritative functional contract; the PRD is the product-level intent; the TechArch is the implementation blueprint.

---

## 10. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Product Owner | ___________________________ | ___________________________ | __________ |
| Technical Lead | ___________________________ | ___________________________ | __________ |
| I&R Curator Lead | ___________________________ | ___________________________ | __________ |
| Security/Compliance | ___________________________ | ___________________________ | __________ |
| QA Lead | ___________________________ | ___________________________ | __________ |
| Delivery Team Lead | ___________________________ | ___________________________ | __________ |

### Pre-Release Checklist (RTM Gate)

Before the TSIO Innovation Hub MVP may be released to operational deployment, the following RTM-governed checks must be satisfied:

- [ ] All 60 PRD sub-features (F1.1–F9.16) are traceable to FRD requirements, TechArch components, and user story acceptance criteria in this RTM
- [ ] All 12 security requirements (SEC-01–SEC-12) are implemented and verified; open items classified per SEC-12 (blocker vs. accepted risk with documented rationale)
- [ ] All 8 non-functional requirements have verifiable completion evidence
- [ ] All 6 launch content acceptance conditions (LC-01–LC-06) are met at time of release review
- [ ] Publication gate is server-enforced and verified; at least 3 published records meet all 15 gate field conditions
- [ ] Audit trail verification passed: all 14 audit event types verified; INSERT-only enforcement confirmed on `audit_events`
- [ ] WCAG 2.1 AA accessibility verification completed for all MVP journeys; no unresolved critical issues
- [ ] HTTP security headers verified via automated scan (SEC-10)
- [ ] No credentials or secrets in committed source code (SEC-08)
- [ ] Dev auth stub disabled in production environment (SEC-09); startup error test passed
- [ ] Security decision register signed off (SEC-12); all operational blockers resolved or explicitly classified
- [ ] RTM has been reviewed and approved by all signatories above

---

*RTM generated by Pivota Spec Framework*
*Source documents: PRD-TechSurHub.md v1.0 | FRD-TechSurHub.md v1.0 | TechArch-TechSurHub.md v1.0 | UserStories-TechSurHub.md v1.0 | PROJECT.md*
*Last updated: 2026-08-11*
