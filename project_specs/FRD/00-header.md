# TSIO Innovation Hub MVP — Functional Requirements Document (FRD)

**Project:** TechSur Innovation Hub (TSIO Innovation Hub MVP)
**Organization:** TSIO Innovation & Research (I&R), Administrative Office of US Courts
**Document Type:** FRD — Functional Contract
**Version:** 1.0
**Date:** 2026-08-11
**Source PRD:** PRD-TechSurHub.md v1.0 (derived from TSIO_Innovation_Hub_MVP_PRD_v2.0)
**Status:** Working Draft
**Audience:** Pivota delivery team — developers, designers, QA, and technical leads

---

## Scope

This Functional Requirements Document specifies the detailed behavior of every MVP feature in the TSIO Innovation Hub. It translates the product-level outcomes defined in the PRD into precise functional contracts: input fields, validation rules, business rules, state machines, permission rules, error handling, process flows, API surface, and database schema. Downstream technical and UX specifications may add implementation detail but must not contradict this document. Conflicts must be escalated to the product owner for disposition before implementation proceeds.

This FRD covers Features F1 through F9 and all sub-features F1.1 through F9.16.

---

## Table of Contents

| Section | Feature |
|---|---|
| [F01] | Innovation Catalog (F1.1–F1.6) |
| [F02] | Search and Discovery (F2.1–F2.5) |
| [F03a] | Innovation Record — Field Definitions (F3.1–F3.5) |
| [F03b] | Innovation Record — Behavior, State Machines, Validation (F3.6–F3.9) |
| [F04] | Executive and Technical Perspectives (F4.1–F4.4) |
| [F05] | Existing Lessons-Learned Content (F5.1–F5.5) |
| [F06] | Opportunity Submission (F6.1–F6.5) |
| [F07] | Share Existing Innovation Work (F7.1–F7.4) |
| [F08] | Engagement Routing (F8.1–F8.6) |
| [F09a] | Curation and Administration — Core (F9.1–F9.8) |
| [F09b] | Curation and Administration — Lifecycle, Gates, Queues (F9.9–F9.16) |
| [Y0a] | Database Schema — Core Entities |
| [Y0b] | Database Schema — Submissions, Engagement, Audit |
| [Y1a] | REST API — Public Endpoints |
| [Y1b] | REST API — Curator Endpoints |
| [Y2] | Cross-Feature Error Catalog |
| [Y3] | External Integrations and Dependencies |

---

## How to Read This Document

- **"Must"** — required MVP behavior; implementation without it fails acceptance.
- **"Should"** — preferred behavior that may be refined during discovery but is the default expectation.
- **"May"** — implementation choice left to the delivery team.
- **Feature IDs** — F1.1 through F9.16 match the PRD Feature Index exactly.
- **Field tables** use: `Field Name | Type | Required | Constraints | Notes`.
- **State diagrams** use: `StateA → [trigger] → StateB`.
- **Error tables** use: `HTTP Status | Error Code | Message | Notes`.
- **SEC-nn** codes reference PRD Section 10 security requirements.
- **Cross-references** use `see F03a §Field Definitions` style notation.

---

## Cross-Cutting Terminology

The following terms apply across all features. Feature-specific terms are defined in each feature's chunk.

| Term | Definition |
|---|---|
| **Innovation Record** | The structured representation of one idea, experiment, POC, pilot, validated pattern, or archived learning item. The primary entity of the Hub. |
| **Artifact** | An authoritative external source linked from a record (document, diagram, video, repository, report, security finding). The Hub links to artifacts; it does not host or copy them. |
| **Contributor** | A person, court, AO office, or technical team credited for the innovation work. |
| **Owner / Steward** | The person or organizational entity responsible for current accuracy and maintenance of the record. Distinct from Contributor. |
| **Maturity** | The current developmental stage of the innovation work. Controlled vocabulary; curator-assigned. Never inferred automatically. |
| **Review Status** | A record of governance or review actions that have occurred. Maintained independently from Maturity. Never automatically inferred from Maturity. |
| **Publication State** | The lifecycle position of a record relative to stakeholder visibility. Independent from both Maturity and Review Status. |
| **Opportunity Submission** | A mission problem, research question, or collaboration need submitted by a stakeholder for I&R consideration. Does not imply acceptance. |
| **Innovation Contribution** | Existing innovation work submitted by a court, AO office, or team for curation and possible publication. Attribution preserved through curation. |
| **Engagement Request** | A request for demonstration, guidance, discussion, adoption exploration, or other follow-up captured against a record or generally. |
| **Curator** | An authorized I&R team member with write access to create, edit, and govern innovation records and submissions. |
| **Admin** | An authorized user with configuration access to Hub settings including routing and taxonomy. May overlap with Curator role. |
| **Publication Gate** | The set of required fields that must be present and non-empty before a record's publication state may advance to Published. |
| **Audit Event** | A recorded log entry capturing who made a material change, what changed, and when. |
| **CTA** | Call to Action — a contextual action button or link on a record or page that initiates an engagement request. |
| **I&R** | TSIO Innovation & Research — the organizational unit operating the Hub. |
| **AO** | Administrative Office of the US Courts. |
| **POC** | Proof of Concept. |

---

## Trust Model — Required in All Presentations

The following four statements must be communicable to users anywhere a record could be misinterpreted. They are enforced by design, copy, and visual treatment:

1. **POC ≠ production-ready** — a POC record must never be presented in a way that implies it is deployable without further review.
2. **Published ≠ approved for adoption** — publication means the record meets content and governance requirements; it does not mean I&R or AO has approved adoption.
3. **Community-submitted ≠ centrally endorsed** — a contribution from a court or office does not carry I&R endorsement unless the review status explicitly reflects a completed review.
4. **Validated for reuse ≠ eliminates local review requirements** — even the highest review status does not remove the obligation of a local office to conduct its own review.

---

## Security Access Control Rules

These rules apply across all features. Feature-specific enforcement details are noted in each feature chunk.

| Rule | Description |
|---|---|
| **SEC-01** | Administrative and curation capabilities require an authenticated, authorized Curator or Admin role. |
| **SEC-02** | Unauthenticated or unauthorized users must not access protected functions, curator-only views, or restricted content. Any attempted access to a protected route must return an appropriate error or redirect — never silent access. |
| **SEC-03** | Authentication and authorization events material to governance must be recorded in audit history (login, role assignment, unauthorized access attempts on curator routes). |
| **SEC-04** | Publishing a record must not implicitly broaden access to linked artifacts. Artifact access is governed by the authoritative source system. Hub links point to source; Hub does not replicate artifact content. |
| **SEC-05** | Submitter contact information captured in opportunity submissions and engagement requests must be handled per applicable Judiciary privacy and data-protection requirements. |
| **SEC-06** | Public-facing submission forms (F6, F7, F8) must implement appropriate protection against automated abuse (rate limiting, CAPTCHA or equivalent). The mechanism is TBD pending discovery; a controlled development bypass is permitted if explicitly approved and disabled in operational environments. |
| **SEC-07** | If a required security control is unavailable at runtime, the system must default to the protected state (deny access or submission), not silently allow it. |
| **SEC-08** | Credentials, secrets, API keys, and sensitive operational configuration must not appear in committed source code. All secrets must be injected via environment variables or an approved secrets management mechanism. |
| **SEC-09** | Development-only access mechanisms (e.g., bypassed authentication, fixture accounts) must not be active in operational environments. |
| **SEC-10** | Operational deployments must implement appropriate HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) consistent with the approved technical/security baseline. |
| **SEC-11** | Security review status (one value in the Review Status taxonomy) must remain visually and logically distinguishable from general technical review, policy review, and from Maturity. |
| **SEC-12** | Security and access decisions required for a given capability must be resolved or explicitly classified (blocker vs. accepted risk) before that capability is built for operational use. |

---

## Roles and Permissions Summary

| Role | Description | Authorized Actions |
|---|---|---|
| **Anonymous Visitor** | Any unauthenticated user accessing the public site | Browse catalog (published records only); view published record detail; use search and filters; submit engagement requests (rate-limited); submit opportunity submissions (rate-limited); submit innovation contributions (rate-limited) |
| **Curator** | Authenticated I&R team member with content governance authority | All Anonymous actions plus: create/edit/delete records; manage artifacts; assign/update maturity and review status; manage attribution and ownership; publish/unpublish/supersede/archive/retire records; review submissions and contributions; review engagement activity; view audit history |
| **Admin** | Authenticated user with settings authority (may be same person as Curator) | All Curator actions plus: manage Hub settings (routing, taxonomy); view and manage user roles (if identity system supports it) |

---

## Maturity Taxonomy — Canonical Values

These are the exact values used as a controlled vocabulary throughout the system.

| Value | Label | Description |
|---|---|---|
| `idea` | Idea | A problem, opportunity, or concept that has not yet been validated |
| `evaluated_idea` | Evaluated Idea | Reviewed for relevance, feasibility, and potential value |
| `experiment_poc` | Experiment / POC | Controlled effort that produced evidence and findings; not production-ready |
| `prototype_pilot` | Prototype / Pilot | Tested with representative users, workflows, integrations, or environments |
| `production_validated` | Production / Validated Pattern | Deployed or reviewed with sufficient evidence to serve as a reuse reference |
| `archived_retired` | Archived / Retired | Retained for institutional learning; no longer active or recommended |

---

## Review Status Taxonomy — Canonical Values

These values are independent from Maturity. Multiple values may apply simultaneously (a record may be both Technically Reviewed and Security Reviewed without being Policy Reviewed).

| Value | Label | Description |
|---|---|---|
| `submitted` | Submitted | Record or contribution has been submitted; no review completed |
| `curated` | Curated for Completeness | I&R curator has reviewed for content completeness |
| `technically_reviewed` | Technically Reviewed | Technical review has been completed |
| `security_reviewed` | Security Reviewed | Security review has been completed (SEC-11: distinct from technical review) |
| `policy_reviewed` | Policy Reviewed | Policy review has been completed |
| `validated_for_reuse` | Validated for Reuse | Meets criteria for reuse across the Judiciary; does not eliminate local review requirements |
| `superseded` | Superseded | Replaced by a newer record or artifact; retained for institutional learning |
| `retired` | Retired | No longer applicable; retained for audit completeness |

---

## Publication State Taxonomy — Canonical Values

Publication state is independent from both Maturity and Review Status.

| Value | Label | Description |
|---|---|---|
| `draft` | Draft | Record is being created or edited; not visible to non-curators |
| `submitted_for_review` | Submitted for Review | Record has been submitted by a curator for publication approval |
| `published` | Published | Record is visible to all authorized stakeholders |
| `superseded` | Superseded | Record has been replaced; remains discoverable with supersession notice |
| `archived` | Archived | Record retained for institutional learning; not presented as a current recommendation |
| `retired` | Retired | Record is no longer active; retained for audit completeness |

---

*FRD assembled from chunk files in project_specs/FRD/ — see individual F-series and Y-series files for feature detail.*
