# TSIO Innovation Hub — MVP Launch Checklist

**Purpose:** All items must be verified and signed off before MVP launch.
**Reference:** PRD §12 Initial Content and Launch Acceptance; PRD §9 Non-Functional Requirements

## PRD §12 Launch Content Conditions

| # | Condition | Minimum Requirement | Status | Evidence |
|---|-----------|---------------------|--------|---------|
| LC-01 | Published content threshold | ≥3 published innovation records | ✓ Target: 8 | e2e/launch-acceptance.spec.ts LC-01 |
| LC-02 | Technical reuse example | ≥1 record with significant technical findings + source artifacts | ✓ Audio Security POC | e2e/launch-acceptance.spec.ts LC-02 |
| LC-03 | Executive decision example | ≥1 record supporting exec decision or sponsorship discussion | ✓ AI Document Classification | e2e/launch-acceptance.spec.ts LC-03 |
| LC-04 | Adoption/collaboration example | ≥1 record seeking adopter, collaborator, or concrete engagement | ✓ AI Document Classification (seeking_adoption_partner) | e2e/launch-acceptance.spec.ts LC-04 |
| LC-05 | Lifecycle transparency example | ≥1 archived/retired experiment for institutional learning | ✓ Interpreter Scheduling (archived) | DB query: SELECT publication_state FROM innovation_records WHERE slug='interpreter-scheduling-poc' |
| LC-06 | Complete governance metadata | Every published record: maturity, review status, attribution, owner/steward, last-reviewed date, source basis, disclaimer | ✓ Verified via publication gate (all records passed gate before publish) | e2e/launch-acceptance.spec.ts LC-06 |

## Navigation and IA (PRD §14 — IA Requirements)

| Requirement | Status | Evidence |
|-------------|--------|---------|
| IA-01: No dead nav links | ✓ | e2e/navigation-ia.spec.ts |
| IA-02: No orphaned pages | ✓ | e2e/navigation-ia.spec.ts |
| IA-03: Navigation map documented | ✓ | docs/NAVIGATION-MAP.md |
| IA-04: Breadcrumbs on non-home pages | ✓ | e2e/navigation-ia.spec.ts |
| IA-05: Auth-state nav integration | ✓ | e2e/navigation-ia.spec.ts |

## Non-Functional Requirements (PRD §9)

| Category | Requirement | Status | Evidence |
|----------|-------------|--------|---------|
| Accessibility | WCAG 2.1 AA — 0 critical violations on all MVP journeys | ✓ | e2e/accessibility.spec.ts (axe-core) |
| Security | Protected functions inaccessible without auth | ✓ | e2e navigation tests; requireRole() RBAC |
| Security | HTTP security headers present | ✓ | See DEPLOYMENT-SECURITY.md |
| Security | No credentials in source code (SEC-08) | ✓ | See DEPLOYMENT-SECURITY.md |
| Security | Dev auth stub production guard (AUTH-07) | ✓ | See DEPLOYMENT-SECURITY.md |
| Reliability | Submissions persist before email routing (F8.3) | ✓ | e2e/engagement-routing.spec.ts |
| Auditability | Material changes traceable in audit_events | ✓ | e2e verification; DB audit_events table |
| Traceability | Requirements traceable to implementation | ✓ | .planning/REQUIREMENTS.md traceability table |

## Pre-Launch Operational Gates

| Gate | Status | Notes |
|------|--------|-------|
| Hosting environment confirmed | ⬜ Pending | TBD during discovery — operational blocker |
| Identity provider configured | ⬜ Pending | TBD — dev stub must be replaced before non-dev deployment |
| SMTP/email routing tested end-to-end | ⬜ Pending | EMAIL_ROUTING_MODE=smtp with confirmed SMTP host |
| Engagement routing address confirmed | ✓ Default set | AOml_TSO_IRB_Team@ao.uscourts.gov — verify with I&R product owner |
| Browser compatibility verified | ⬜ Pending | Test against Judiciary-approved browser list (to be confirmed during discovery) |
| Performance baselines confirmed | ⬜ Pending | Targets to be baselined during discovery before build |
| Content curator designated | ⬜ Pending | Required before curation workflow acceptance |
| Publishing authority designated | ⬜ Pending | Required before publication workflow baseline |
| Initial taxonomy values confirmed | ⬜ Pending | Mission areas and technology areas to be populated in hub_settings |

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| Content Curator | | | |
| Security/Technical Authority | | | |
