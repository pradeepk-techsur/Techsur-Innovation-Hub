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
---

## F01: Innovation Catalog

**PRD Reference:** F1 (F1.1–F1.6) | **Priority:** P0 — Critical

**Description:** The Innovation Catalog is the primary discovery surface of the Hub — a browsable, governed list of published innovation records. Stakeholders who arrive without a specific query must be able to scan the catalog and determine, at a glance, which records are relevant to their area of interest, what maturity and review state each record is in, who contributed it, and what action is available. The catalog must never visually imply that all records are equally mature, approved, current, or reusable.

---

### Terminology

- **Catalog Card** — The summary tile or list item representing one innovation record in the catalog view.
- **Engagement Indicator** — A label or badge on a catalog card that communicates the actionable status of a record (e.g., "Available for Demo", "Seeking Adoption Partner").
- **Lifecycle State** — The current publication state of a record (Published, Superseded, Archived). Only published records appear in the public catalog by default; superseded and archived records are visible with explicit indication when included.

---

### Sub-features

- **F1.1** — Browsable catalog of curated innovation records
- **F1.2** — Catalog card: title and one-sentence problem/outcome summary
- **F1.3** — Catalog card: technology/capability area, maturity, review status, contributing office
- **F1.4** — Catalog card: reuse/engagement indicator (when configured)
- **F1.5** — Catalog card: last-reviewed date and lifecycle state (when it affects interpretation)
- **F1.6** — No false visual equivalence among records

---

### Process

1. User navigates to the Hub catalog page (no authentication required for published records).
2. System retrieves all records with `publication_state = published`. If the user is a Curator or Admin, the system additionally shows `draft`, `submitted_for_review`, `superseded`, and `archived` records with clear state indicators.
3. System renders a catalog card for each record in the result set.
4. Each card renders the required fields (see Inputs below).
5. User may sort or filter the catalog (sort and filter controls connect to F2 Search and Discovery behavior).
6. User clicks a card to navigate to the full Innovation Record detail view (F3).
7. If no records are returned, the system displays an appropriate empty-state message that does not imply a system error.

---

### Inputs (fields rendered on each catalog card)

| Field | Source | Required on Card | Notes |
|---|---|---|---|
| `title` | Innovation Record | Yes | Short, human-readable title |
| `summary` | Innovation Record | Yes | One-sentence problem or outcome summary; must not exceed 280 characters for card display |
| `technology_areas` | Innovation Record | Yes | Comma-separated list of technology/capability area tags |
| `maturity` | Innovation Record | Yes | Rendered as a visually distinct badge using the canonical maturity label (see header §Maturity Taxonomy) |
| `review_statuses` | Innovation Record | Yes | All applicable review status values rendered as distinct badges |
| `contributing_offices` | Innovation Record | Yes | One or more contributing office names |
| `engagement_indicator` | Innovation Record | When configured | One of the canonical engagement indicator values (see below) |
| `last_reviewed_date` | Innovation Record | Yes | ISO 8601 date; rendered as human-readable (e.g., "June 2026") |
| `publication_state` | Innovation Record | Only when non-Published | Rendered only when state is Superseded, Archived, or Draft (curator view); Published state is implicit |

---

### Engagement Indicator — Canonical Values

These values are configured per-record by an authorized Curator (F9.4). The value is displayed on the catalog card and record detail page.

| Value | Display Label | Meaning |
|---|---|---|
| `demo_available` | Available for Demonstration | I&R can arrange a live demo |
| `seeking_adoption_partner` | Seeking Adoption Partner | I&R seeks an operational office to partner on adoption |
| `technical_playbook_available` | Technical Playbook Available | A reuse or implementation playbook exists |
| `reference_pattern_available` | Reference Pattern Available | Serves as a reference architecture or pattern |
| `monitoring_only` | Monitoring Only | No active engagement offered; informational only |
| `archived` | Archived | Work is retained for institutional learning; not active |
| `none` | (no badge shown) | No engagement indicator configured |

---

### Outputs

- A rendered list or grid of catalog cards, each showing the required fields above.
- Cards are visually differentiated by maturity badge color/style so a user can distinguish an Idea from a Production/Validated Pattern without reading text.
- Maturity and review status badges must use distinct, non-interchangeable visual treatment (F1.6, SEC-11).
- A Superseded or Archived record displayed in the catalog must carry a visible state indicator and must not be styled the same as a Published record.

---

### Validation

- A record must have `publication_state = published` (or explicitly included states for curator view) to appear in the public catalog.
- Every card must render all required fields. If a required field is null or empty on a published record, this indicates a data integrity issue — the system must surface a warning to curators in the admin view and must not display a broken card to public users (suppress the record from public catalog and flag for curator attention).
- The `summary` field must not exceed 280 characters for card display; if the stored summary is longer, truncate at the nearest word boundary before the limit and append "…".
- Maturity badge values must come from the canonical maturity taxonomy only; unknown values must be displayed as "Unknown" and flagged for curator review.
- Review status badges must come from the canonical review status taxonomy only.

---

### Error States

| Scenario | User-Facing Behavior | Curator/Admin Behavior | Notes |
|---|---|---|---|
| No published records exist | Display empty-state message: "No innovation records are currently available. Check back soon." | Show count "0 Published Records" on curator dashboard | Normal state before launch content is seeded |
| A published record has missing required fields | Record is suppressed from public catalog | Admin view flags record with "Incomplete — Missing required fields" warning | SEC-07: default to protected state |
| Catalog data fetch fails | Display error message: "We couldn't load the catalog. Please try again." with retry link | Log server error; surface in admin error log | Must not show a partial or broken catalog |
| Unknown maturity value on a record | Display "Unknown" badge | Flag record for curator attention | Data integrity issue |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Catalog for full request/response schema.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/catalog` | None (public) | Returns paginated list of published catalog cards |
| GET | `/api/v1/catalog?{filters}` | None (public) | Returns filtered catalog cards (connects to F2 filter parameters) |

---

### Schema Surface (this feature)

Uses table `innovation_records` (fields: `id`, `title`, `summary`, `technology_areas`, `maturity`, `review_statuses`, `contributing_offices`, `engagement_indicator`, `last_reviewed_date`, `publication_state`). See `Y0a-schema-core.md` §innovation_records.
---

## F02: Search and Discovery

**PRD Reference:** F2 (F2.1–F2.5) | **Priority:** P0 — Critical

**Description:** Search and Discovery enables stakeholders to find relevant innovation work using mission-problem language rather than internal project names, folder paths, or I&R terminology. It supports both free-text search across record content and faceted filtering by metadata dimensions. Search results must preserve the same trust information (maturity, review status, lifecycle state) visible in the catalog. A user who searches "protect court audio" must be able to surface the Audio Security POC record without knowing its formal title.

---

### Terminology

- **Problem-Oriented Search** — Search that indexes the language of stakeholder problems (mission area, workflow friction, user impact) rather than only formal titles or project identifiers.
- **Faceted Filter** — A sidebar or filter panel allowing progressive narrowing of results by discrete metadata categories.
- **Search Index** — The set of fields indexed for full-text matching.
- **Filter Dimension** — A discrete metadata category available as a filter facet.

---

### Sub-features

- **F2.1** — Problem-oriented full-text search
- **F2.2** — Search index covers titles, problem statements, summaries, findings, tags, mission areas, technology areas, and artifact names
- **F2.3** — Faceted filtering by mission area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and lifecycle state
- **F2.4** — Trust information preserved in search results (maturity, review status, lifecycle state)
- **F2.5** — Problem-language queries surface relevant records when content and metadata support the relationship

---

### Process

1. User types a query into the search box and/or selects filter values from the filter panel.
2. System executes full-text search against the search index fields (see §Search Index).
3. System applies any active facet filters as AND conditions on top of the full-text match (each filter within the same dimension is OR; across dimensions is AND).
4. System returns matching records in relevance-ranked order (full-text relevance primary; recency secondary for equal-score results).
5. System renders result cards with the same trust fields as the catalog (F1) — maturity badge, review status badge(s), lifecycle state when non-Published, contributing office, last-reviewed date.
6. User may refine query or adjust filters without losing prior context.
7. User clicks a result card to navigate to the full record detail (F3).
8. If no results match, system displays a no-results state with search suggestions (see §Error States).

---

### Search Index

All of the following fields must be included in the full-text search index. Fields marked **High Weight** contribute proportionally more to result ranking.

| Field | Index | Weight | Notes |
|---|---|---|---|
| `title` | Yes | High | Record title |
| `summary` | Yes | High | One-sentence problem/outcome summary |
| `problem_statement` | Yes | High | Full problem and context narrative |
| `what_was_explored` | Yes | Medium | Hypothesis, capability, approach, technologies |
| `outcome_summary` | Yes | Medium | What was demonstrated and what was learned |
| `key_findings` | Yes | High | Reusable findings; often contains domain-specific terms |
| `tags` | Yes | High | Curator-assigned free-form tags |
| `mission_areas` | Yes | High | Controlled vocabulary mission area labels |
| `technology_areas` | Yes | High | Controlled vocabulary technology area labels |
| `reuse_guidance` | Yes | Medium | What can be reused, adapted, or avoided |
| `production_readiness_gaps` | Yes | Medium | What is not yet ready |
| `next_action_description` | Yes | Low | Contextual next-step text |
| `artifact_names` | Yes | Medium | Names of linked artifacts where access is not restricted |
| `contributing_offices` | Yes | Low | Office names |
| `contributor_names` | Yes | Low | Contributor names |

Fields **not** indexed: internal IDs, raw dates, access-restricted artifact content, submission contact information.

---

### Filter Dimensions (F2.3)

Each filter dimension maps to a controlled vocabulary or field set. Filters within the same dimension are combined with OR logic; filters across dimensions are combined with AND logic.

| Filter Dimension | Source Field(s) | Type | Notes |
|---|---|---|---|
| Mission / Business Area | `mission_areas` | Multi-select | Controlled taxonomy; baselined during discovery |
| Problem Type | `problem_type_tags` | Multi-select | Controlled taxonomy; e.g., "Security", "Accessibility", "Cost Reduction" |
| Technology | `technology_areas` | Multi-select | Controlled taxonomy; e.g., "Azure Government Cloud", "AI/ML", "Audio" |
| Maturity | `maturity` | Multi-select | Uses canonical maturity values from header |
| Review Status | `review_statuses` | Multi-select | Uses canonical review status values from header |
| Contributing Office | `contributing_offices` | Multi-select | Free-form field; values derive from records |
| Reuse Potential | `reuse_potential` | Single-select | Values: `high`, `moderate`, `low`, `not_assessed` |
| Artifact Availability | `has_artifacts` | Boolean toggle | True = at least one artifact link exists |
| Lifecycle State | `publication_state` | Multi-select | Public users: Published only (default); includes Superseded, Archived when explicitly selected |

---

### Search Behavior Rules

- **F2.1 — Problem-oriented:** The search index must include the `problem_statement` and `key_findings` fields with high weight so that problem-language queries (e.g., "audio security", "protect court recordings", "GPU separation") can surface records without requiring exact title matches.
- **F2.4 — Trust preserved:** Every result card must display maturity badge, review status badge(s), and lifecycle state indicator (if non-Published). Trust information must not be omitted from result display.
- **F2.5 — Problem-language resolution:** When a query expressed in mission problem language matches content in `problem_statement`, `key_findings`, or `tags`, those fields' higher weight must surface the record ahead of tangential title-only matches.
- **Lifecycle scope:** By default, search and filter return only Published records. Anonymous users cannot filter to Draft or Submitted-for-Review records. Curators in the curator view may search across all lifecycle states.
- **Empty query:** If the user submits an empty search query with no filters, the system returns the full catalog (equivalent to the default catalog view).
- **Partial matches:** The search engine should support partial word matching (prefix search) for technology and domain terms. Exact phrase matching should be supported via quoted queries.
- **Case insensitivity:** Search must be case-insensitive.
- **Minimum query length:** 2 characters required to trigger a search. Single-character queries return an inline validation message: "Please enter at least 2 characters to search."

---

### Inputs

| Input | Type | Required | Constraints |
|---|---|---|---|
| `q` (query string) | string | No | Min 2 chars when provided; max 500 chars; sanitized for XSS |
| `mission_areas[]` | string[] | No | Values must be from taxonomy; unknown values ignored |
| `problem_type_tags[]` | string[] | No | Values must be from taxonomy; unknown values ignored |
| `technology_areas[]` | string[] | No | Values must be from taxonomy; unknown values ignored |
| `maturity[]` | string[] | No | Values must be from canonical maturity vocabulary |
| `review_statuses[]` | string[] | No | Values must be from canonical review status vocabulary |
| `contributing_offices[]` | string[] | No | Free-form; matched case-insensitively |
| `reuse_potential` | string | No | One of: `high`, `moderate`, `low`, `not_assessed` |
| `has_artifacts` | boolean | No | `true` or `false` |
| `publication_state[]` | string[] | No | Anonymous: only `published` accepted; Curator: any state |
| `page` | integer | No | Default 1; min 1 |
| `page_size` | integer | No | Default 20; max 100 |
| `sort` | string | No | One of: `relevance` (default), `last_reviewed_desc`, `title_asc` |

---

### Outputs

- Paginated list of matching catalog cards, each with the same fields as F01 catalog cards.
- Total result count displayed above results (e.g., "14 results for 'audio security'").
- Active filters displayed as removable chips/tags so the user can see and clear individual filters.
- Facet counts shown per filter option (e.g., "Technology / Azure (3)") to indicate how many results each filter would include.
- Relevance-ranked by default; secondary sort by `last_reviewed_date` descending for ties.

---

### Validation

- Query string: sanitize for injection; max 500 characters; min 2 characters when provided.
- Unknown filter values (not in taxonomy) are silently ignored on the query (not returned as an error) but are not reflected in active-filter chips.
- `page` must be ≥ 1 and ≤ total available pages; out-of-range page returns the last available page.
- `page_size` must be between 1 and 100; values outside this range are clamped silently.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Query < 2 characters | 200 (inline) | — | "Please enter at least 2 characters to search." | Client-side validation; no server round-trip needed |
| Query > 500 characters | 400 | `QUERY_TOO_LONG` | "Your search query is too long. Please shorten it." | Server validates too |
| No results found | 200 | — | "No records matched your search. Try different keywords or remove some filters." | Not an error; show suggestions |
| Search service unavailable | 503 | `SEARCH_UNAVAILABLE` | "Search is temporarily unavailable. You can browse the catalog instead." | Provide link to catalog |
| Invalid filter value (server) | 400 | `INVALID_FILTER` | "One or more filter values were not recognized." | For API consumers only |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Search for full schema.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/search` | None (public) | Full-text and filtered search across published records |
| GET | `/api/v1/search/facets` | None (public) | Returns available facet values and counts for current result set |

---

### Schema Surface (this feature)

Uses table `innovation_records` (all indexed fields). No separate search-specific table — the search index is built from `innovation_records` and its related tables. See `Y0a-schema-core.md`.
---

## F03a: Innovation Record — Field Definitions

**PRD Reference:** F3 (F3.1–F3.5), PRD §6.5 | **Priority:** P0 — Critical

**Description:** The Innovation Record is the central structured artifact of the Hub. It is a single, governed representation of one innovation effort — whether an idea, POC, pilot, validated pattern, or archived experiment. All 30+ fields defined here are the canonical field set. Executive and Technical Perspectives (F4) are rendered views of this record, not separate documents. Every field definition includes type, requirement level, validation constraints, and the section of the record it belongs to.

---

### Terminology

- **Section** — A named grouping of fields within the Innovation Record that corresponds to a user-facing content area (Problem & Context, What Was Explored, etc.).
- **Controlled Vocabulary** — A field whose value must come from a defined list of canonical values (e.g., Maturity, Review Status, Engagement Indicator).
- **Free-Form Text** — A field whose value is entered as prose by a Curator and not constrained to a controlled list.
- **Artifact Link** — A structured reference to an external authoritative source (URL + metadata); stored in the `artifacts` child table, not inline in the record.
- **Publication Gate Field** — A field that must be non-empty before the record may advance to `published` state (see F09b §Publication Gate).

---

### Sub-features Covered Here

- **F3.1** — Problem and Context section
- **F3.2** — What Was Explored section
- **F3.3** — Outcome and Evidence section
- **F3.4** — Key Findings section
- **F3.5** — Maturity and Readiness section

(F3.6–F3.9 and state machines: see F03b)

---

### Complete Field Definitions

Fields are grouped by record section. The **Record Identifier and Governance** group is not a user-visible section but contains system-managed fields.

---

#### Group 0: Record Identity and System Fields

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `id` | UUID | Yes (auto) | — | System-generated; immutable | Primary key |
| `slug` | string | Yes (auto) | — | URL-safe; derived from title; unique; max 128 chars | Used in public URLs |
| `publication_state` | enum | Yes | — | One of canonical Publication State values | Default: `draft` |
| `created_at` | timestamp | Yes (auto) | — | UTC; set on record creation | Immutable |
| `created_by` | UUID (user ref) | Yes (auto) | — | References authenticated curator who created the record | Immutable |
| `updated_at` | timestamp | Yes (auto) | — | UTC; updated on every save | System-managed |
| `updated_by` | UUID (user ref) | Yes (auto) | — | References curator who made the last edit | System-managed |
| `published_at` | timestamp | Conditional | — | UTC; set when publication_state transitions to `published`; null if not published | System-managed |
| `version` | integer | Yes (auto) | — | Increments on every save; used for optimistic concurrency | Default: 1 |

---

#### Group 1: Section F3.1 — Problem and Context

**Purpose:** Explain the mission or operational problem, affected users, current workflow or constraint, and why experimentation was appropriate.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `title` | string | Yes | **Yes** | Max 200 chars; min 5 chars; must be unique across published records | Human-readable record title |
| `summary` | string | Yes | **Yes** | Max 500 chars; min 20 chars | One- to three-sentence problem/outcome summary; used on catalog card |
| `problem_statement` | text | Yes | **Yes** | Max 5,000 chars; min 50 chars | Full narrative of the mission or operational problem |
| `affected_users` | text | No | No | Max 1,000 chars | Who is affected by the problem; roles, courts, offices |
| `current_workflow` | text | No | No | Max 2,000 chars | How the work is performed today; current constraints |
| `why_experimentation` | text | No | No | Max 1,000 chars | Why a POC or innovation approach was appropriate here |
| `mission_areas` | string[] | Yes | **Yes** | Min 1 value; values from controlled taxonomy; max 10 values | Mission / business area classification |
| `problem_type_tags` | string[] | No | No | Values from controlled taxonomy; max 10 values | Problem type classification (e.g., "Security", "Accessibility") |

---

#### Group 2: Section F3.2 — What Was Explored

**Purpose:** Explain the hypothesis, capability, or approach tested; scope boundaries; and technologies or methods used.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `hypothesis_or_objective` | text | Yes | **Yes** | Max 2,000 chars; min 20 chars | What was the POC or effort trying to prove or accomplish |
| `scope_description` | text | No | No | Max 2,000 chars | What was and was not in scope for the exploration |
| `technology_areas` | string[] | Yes | **Yes** | Min 1 value; values from controlled taxonomy; max 15 values | Technology / capability area classification |
| `technologies_used` | text | No | No | Max 2,000 chars | Prose description of specific tools, services, platforms, languages used |
| `methods_used` | text | No | No | Max 1,000 chars | Approach, methodology, or process followed |
| `tags` | string[] | No | No | Free-form; max 20 values; each tag max 50 chars | Curator-assigned keywords for search enrichment |

---

#### Group 3: Section F3.3 — Outcome and Evidence

**Purpose:** Explain what was demonstrated, what evidence was produced, what worked, what did not, what uncertainty was reduced, and what decision the work enabled.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `outcome_summary` | text | Yes | **Yes** | Max 3,000 chars; min 50 chars | What was demonstrated; high-level outcome narrative |
| `what_worked` | text | No | No | Max 2,000 chars | Specific findings on what succeeded |
| `what_did_not_work` | text | No | No | Max 2,000 chars | Failures, negative results, and unexpected constraints |
| `uncertainty_reduced` | text | No | No | Max 1,000 chars | What questions the work answered or partially answered |
| `decision_enabled` | text | No | No | Max 1,000 chars | What decision, recommendation, or next step the evidence supports |
| `evidence_summary` | text | No | No | Max 2,000 chars | Types of evidence produced (test results, benchmark data, demo recording, security findings, etc.) |
| `source_basis` | text | Yes | **Yes** | Max 500 chars; min 10 chars | Statement of what the record is based on (e.g., "Audio Security POC lessons-learned document, June 2026") |

---

#### Group 4: Section F3.4 — Key Findings

**Purpose:** Surface reusable findings by category. Fields are optional individually but at least one finding category must contain content for a record to meet the publication gate.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `findings_architectural` | text | No | No | Max 3,000 chars | Architecture, system design, or integration findings |
| `findings_security` | text | No | No | Max 3,000 chars | Security-specific findings; distinct from SEC review status |
| `findings_cloud_platform` | text | No | No | Max 3,000 chars | Cloud provider, platform, or hosting-environment findings |
| `findings_performance` | text | No | No | Max 3,000 chars | Performance, latency, throughput, resource-consumption findings |
| `findings_ux` | text | No | No | Max 3,000 chars | User-experience, accessibility, or workflow usability findings |
| `findings_data` | text | No | No | Max 3,000 chars | Data model, storage, retention, privacy, or classification findings |
| `findings_testing` | text | No | No | Max 3,000 chars | Test coverage, gaps, and quality findings |
| `findings_operational` | text | No | No | Max 3,000 chars | Operational, deployment, or maintenance findings |
| `findings_cost` | text | No | No | Max 2,000 chars | Cost, licensing, or resource-consumption findings |
| `findings_scalability` | text | No | No | Max 2,000 chars | Scalability, elasticity, or capacity findings |
| `findings_other` | text | No | No | Max 3,000 chars | Any finding category not covered above |
| `key_findings_gate_check` | computed | Yes (for gate) | **Yes** | At least one `findings_*` field must be non-empty | Publication gate validation — computed, not stored |

---

#### Group 5: Section F3.5 — Maturity and Readiness

**Purpose:** Communicate the developmental stage, what the work is ready for, what it is not ready for, and what is required before advancing.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `maturity` | enum | Yes | **Yes** | One of canonical Maturity values (see header §Maturity Taxonomy) | Curator-assigned; never automatically inferred |
| `review_statuses` | enum[] | Yes | **Yes** | One or more canonical Review Status values; stored as array | Independent from maturity; at least one value required |
| `ready_for` | text | No | No | Max 1,000 chars | What the work is currently ready for (e.g., "discovery discussions, reference architecture review") |
| `not_ready_for` | text | No | No | Max 1,000 chars | What the work is explicitly not ready for (e.g., "production deployment without further security review") |
| `next_stage_requirements` | text | No | No | Max 2,000 chars | What must happen before advancing to the next maturity stage |
| `last_reviewed_date` | date | Yes | **Yes** | ISO 8601 date (YYYY-MM-DD); must be ≤ today; must be ≥ `created_at` date | Date the record or underlying work was last reviewed |
| `next_review_date` | date | No | No | ISO 8601 date; must be > `last_reviewed_date` when provided | Scheduled next review; triggers curator reminder when supported |
| `maturity_change_reason` | text | No | No | Max 500 chars | Curator note explaining why maturity was changed (captured in audit event) |

---

### Summary: Publication Gate Fields

The following fields must all be non-empty for a record to advance to `publication_state = published`. This is enforced by the system at the point of publication — not at save. A record may be saved in Draft state with any of these fields empty.

| # | Field | Section |
|---|---|---|
| 1 | `title` | F3.1 |
| 2 | `summary` | F3.1 |
| 3 | `problem_statement` | F3.1 |
| 4 | `mission_areas` (≥1 value) | F3.1 |
| 5 | `hypothesis_or_objective` | F3.2 |
| 6 | `technology_areas` (≥1 value) | F3.2 |
| 7 | `outcome_summary` | F3.3 |
| 8 | `source_basis` | F3.3 |
| 9 | `key_findings_gate_check` (≥1 `findings_*` field non-empty) | F3.4 |
| 10 | `maturity` | F3.5 |
| 11 | `review_statuses` (≥1 value) | F3.5 |
| 12 | `last_reviewed_date` | F3.5 |
| 13 | `owner_steward` (see F03b §Group 7) | F3.7 |
| 14 | `attribution_statement` (see F03b §Group 7) | F3.7 |
| 15 | `applicable_disclaimer` (see F03b §Group 8) | (Governance) |

---

### Validation Rules — Field Level

- All `text` fields: sanitize for XSS; strip or escape HTML before storage.
- All `string[]` fields: remove duplicates; trim whitespace from each value; reject values exceeding per-value character limits.
- All controlled-vocabulary fields: reject values not present in the current taxonomy at save time; return field-specific validation error.
- `last_reviewed_date`: must not be in the future; must not predate the Hub's launch date (configurable floor); must be provided in YYYY-MM-DD format.
- `title` uniqueness: enforced across `publication_state = published` records only. Two Draft records may share a title; attempting to publish a record whose title matches an existing Published record must return a warning (not a hard block) asking the curator to confirm uniqueness or differentiate.
- `summary` on catalog card: if stored `summary` > 280 chars, truncate for card display (stored value is preserved in full on detail view).
- `maturity` and `review_statuses` may not be null or empty on a published record. If they are (data integrity failure), the record is suppressed from public views.

---

### Schema Surface (this feature)

Fields in this chunk map to the `innovation_records` table. See `Y0a-schema-core.md` §innovation_records for the full DDL.
---

## F03b: Innovation Record — Behavior, State Machines, and Remaining Field Groups

**PRD Reference:** F3 (F3.6–F3.9), PRD §6.1–§6.4 | **Priority:** P0 — Critical

**Description:** This chunk covers the remaining field groups for the Innovation Record (Reuse Guidance, Ownership & Attribution, Authoritative Artifacts, Next Action, and Governance fields), the three independent state machines (Maturity Lifecycle, Review Status, Publication Lifecycle), process and behavior rules, and error states for the Innovation Record.

---

### Sub-features Covered Here

- **F3.6** — Reuse Guidance section
- **F3.7** — Ownership and Attribution section
- **F3.8** — Authoritative Artifact links
- **F3.9** — Next Action (contextual CTAs)
- State machines for Maturity, Review Status, and Publication Lifecycle

---

### Field Definitions (continued from F03a)

---

#### Group 6: Section F3.6 — Reuse Guidance

**Purpose:** State what another office can reuse, what should be adapted, what should not be copied directly, what assumptions are environment-specific, and what skills/services/dependencies are required.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `reuse_potential` | enum | Yes | No | One of: `high`, `moderate`, `low`, `not_assessed` | Curator-assigned assessment |
| `what_can_be_reused` | text | No | No | Max 2,000 chars | Specific outputs, patterns, code, or findings available for reuse |
| `what_should_be_adapted` | text | No | No | Max 2,000 chars | Elements that require local adaptation before use |
| `what_not_to_copy` | text | No | No | Max 2,000 chars | Elements that should not be directly replicated (environment-specific, deprecated, superseded by findings) |
| `environment_assumptions` | text | No | No | Max 1,000 chars | Assumptions about environment, infrastructure, or jurisdiction that may not hold elsewhere |
| `required_skills` | text | No | No | Max 1,000 chars | Skills, certifications, or expertise required to implement |
| `required_services` | text | No | No | Max 1,000 chars | External services, platforms, or dependencies required |
| `production_readiness_gaps` | text | No | No | Max 3,000 chars | What must be addressed before production deployment |
| `engagement_indicator` | enum | No | No | One of canonical Engagement Indicator values (see F01 §Engagement Indicator); default `none` | Displayed on catalog card and record detail |

---

#### Group 7: Section F3.7 — Ownership and Attribution

**Purpose:** Identify the opportunity source, contributing office, I&R contribution, technical contributors, current owner, and operational or production owner where applicable.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `opportunity_source` | text | No | No | Max 500 chars | Where this work originated (e.g., "Submitted by Court X", "I&R-initiated", "TSIO leadership directive") |
| `contributing_offices` | string[] | Yes | **Yes** | Min 1 value; each value max 200 chars; max 10 values | Office(s) that contributed the innovation work |
| `contributor_names` | string[] | No | No | Each value max 200 chars; max 20 values | Named individuals credited for the work |
| `ir_contribution` | text | No | No | Max 1,000 chars | Description of I&R's specific contribution (if I&R was not the originator) |
| `owner_steward` | text | Yes | **Yes** | Max 200 chars; min 3 chars | Name of person or organizational entity currently responsible for the record's accuracy |
| `owner_contact` | string | No | No | Valid email format when provided; max 254 chars | Contact email for the current owner; may be omitted if contact is routed through I&R |
| `operational_owner` | text | No | No | Max 200 chars | Operational office or person responsible for any operational use of this work |
| `production_owner` | text | No | No | Max 200 chars | Production owner if the work has been operationalized |
| `attribution_statement` | text | Yes | **Yes** | Max 1,000 chars; min 10 chars | Formal attribution narrative; preserved through curation; visible on record detail |
| `source_contribution_id` | UUID | No | No | References `innovation_contributions.id` when record was created from a submitted contribution | System-set; links record to originating contribution for attribution tracing |

---

#### Group 8: Section F3.8 — Authoritative Artifacts

Artifact links are stored in a child table (`artifacts`) with a foreign key to `innovation_records.id`. They are not inline fields on the record. See `Y0a-schema-core.md §artifacts` for DDL.

**Per-artifact fields:**

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `artifact_id` | UUID | Yes (auto) | System-generated | Primary key |
| `record_id` | UUID | Yes | References `innovation_records.id` | FK |
| `artifact_type` | enum | Yes | One of: `lessons_learned`, `poc_report`, `decision_brief`, `architecture_diagram`, `demo_video`, `repository`, `infrastructure_definition`, `test_results`, `security_findings`, `technical_playbook`, `other` | Classifies the artifact |
| `name` | string | Yes | Max 200 chars; min 3 chars | Human-readable artifact name |
| `url` | string | Yes | Valid URL; max 2,048 chars; must be https when provided | Link to authoritative source |
| `access_notes` | text | No | Max 500 chars | Access restrictions or authentication requirements (e.g., "SharePoint — AO network required") |
| `is_restricted` | boolean | Yes | Default false | When true, artifact URL is visible only to Curators; public users see the artifact name and access notes but not the URL |
| `display_order` | integer | No | ≥ 0; default auto-increment within record | Controls display order on record detail |
| `added_at` | timestamp | Yes (auto) | UTC | |
| `added_by` | UUID (user ref) | Yes (auto) | References curator | |

**Business rules — artifacts:**
- The Hub must never host or copy artifact content. URLs must point to authoritative source systems.
- Publishing a record does not change `is_restricted` on its artifacts; access remains governed by the source system.
- A record may have zero artifacts. Having no artifacts does not block publication (source_basis field in F3.3 captures the source statement). However, the `source_basis` field must be non-empty at publication (publication gate).
- A restricted artifact's URL must not appear in any API response for unauthenticated or non-Curator users.

---

#### Group 8b: Section F3.8 — Governance and Trust Fields

These fields are system or curator-managed and control trust display on the record.

| Field | Type | Required | Publication Gate | Constraints | Notes |
|---|---|---|---|---|---|
| `applicable_disclaimer` | text | Yes | **Yes** | Max 1,000 chars; min 10 chars; must be selected or confirmed by curator | Required trust statement for the record; may reference a system-provided template (see F09b §F9.16) |
| `superseded_by_record_id` | UUID | Conditional | No | References `innovation_records.id` of successor; required when `publication_state = superseded` | Set by curator when superseding |
| `supersession_reason` | text | Conditional | No | Max 1,000 chars; required when `publication_state = superseded` | Explanation of why record was superseded |
| `retirement_reason` | text | Conditional | No | Max 1,000 chars; required when `publication_state = retired` or `maturity = archived_retired` | Explanation of retirement or archival |

---

#### Group 9: Section F3.9 — Next Action (Contextual CTAs)

Next actions are configured per-record by a Curator and rendered as contextual CTAs on the record detail page. They route to the Engagement Routing system (F8).

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `next_actions` | jsonb[] | No | Max 6 actions per record; each action has `type` and optional `label` | Array of configured CTA actions |
| `next_action_description` | text | No | Max 1,000 chars | Optional prose guidance about what the appropriate next step is; displayed above CTAs |

**Per-CTA action fields:**

| Sub-field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `type` | enum | Yes | One of: `request_demo`, `discuss_use_case`, `explore_adoption`, `request_technical_guidance`, `share_related_work`, `contact_ir` | CTA type; determines routing subject and form |
| `label` | string | No | Max 100 chars | Custom button label; falls back to default label for the action type if not provided |
| `is_enabled` | boolean | Yes | Default true | Curator can disable individual CTAs without removing them |

**Default CTA labels by type:**

| Type | Default Label |
|---|---|
| `request_demo` | "Request a Demonstration" |
| `discuss_use_case` | "Discuss a Related Use Case" |
| `explore_adoption` | "Explore Adoption" |
| `request_technical_guidance` | "Request Technical Guidance" |
| `share_related_work` | "Share Related Work" |
| `contact_ir` | "Contact I&R" |

---

### State Machine 1: Maturity Lifecycle

Maturity is **curator-assigned only**. The system never automatically advances or infers maturity.

```
idea
  → [curator assigns] → evaluated_idea
  → [curator assigns] → experiment_poc
  → [curator assigns] → prototype_pilot
  → [curator assigns] → production_validated

Any state:
  → [curator assigns] → archived_retired
  → [curator assigns] → any other state (curators may move maturity in any direction)
```

**Rules:**
- Any authorized Curator may change maturity to any value at any time. There is no enforced progression.
- Every maturity change must generate an audit event capturing: previous value, new value, curator ID, timestamp, and optional `maturity_change_reason`.
- Maturity value must not be null or empty on a published record.
- Maturity must remain independent from Review Status. Changing maturity must not change review statuses.

---

### State Machine 2: Review Status

Review Status is **curator-managed** and operates as a **multi-value set**, not a single linear progression. A record may simultaneously have `technically_reviewed` and `security_reviewed` without having `policy_reviewed`. Values are added or updated independently.

**Allowed Review Status values (repeating from header for clarity):**
`submitted` → `curated` → `technically_reviewed` → `security_reviewed` → `policy_reviewed` → `validated_for_reuse` → `superseded` → `retired`

**Rules:**
- Any authorized Curator may add or update any review status value at any time.
- The set of review status values is stored as an array. Adding a new review status does not remove existing ones unless the curator explicitly removes them.
- Adding `validated_for_reuse` does not automatically remove earlier statuses.
- `superseded` and `retired` review status values indicate the review record itself is superseded or retired (the record has gone through governance history that has since changed). These are distinct from the Publication State `superseded` and `retired`.
- Every review status change must generate an audit event.
- Review Status must remain independent from Maturity. Changing review status must not change maturity.
- `security_reviewed` is visually and logically distinct from `technically_reviewed` in all display contexts (SEC-11).

---

### State Machine 3: Publication Lifecycle

Publication state governs stakeholder visibility. It is independent from both Maturity and Review Status.

```
[not yet created] → draft  (on record creation)

draft
  → [curator submits for review] → submitted_for_review
  → [curator publishes directly, gate passed] → published   (allowed if workflow permits direct publish)

submitted_for_review
  → [curator approves and publishes, gate passed] → published
  → [curator returns to draft] → draft

published
  → [curator unpublishes] → draft
  → [curator supersedes] → superseded      (requires superseded_by_record_id or supersession_reason)
  → [curator archives] → archived
  → [curator retires] → retired

superseded
  → [curator retires] → retired
  → [curator re-activates to draft] → draft  (unusual; requires curator confirmation)

archived
  → [curator retires] → retired
  → [curator re-activates to draft] → draft

retired
  → [curator re-activates to draft] → draft  (unusual; requires curator confirmation and audit note)
```

**Rules:**
- A record may only transition to `published` if all Publication Gate fields are non-empty.
- Every publication state transition must generate an audit event.
- A `superseded` record must remain publicly discoverable (visible in catalog with superseded indicator and, if available, link to successor record).
- An `archived` or `retired` record must not be presented as a current or recommended pattern.
- An `archived` record may appear in search results with a clear "Archived" indicator; it is retained for institutional learning.
- A `retired` record may appear in curator search but is hidden from public results by default.
- Unpublishing (published → draft) removes the record from all public views immediately.
- Re-activating `superseded`, `archived`, or `retired` records to `draft` requires a curator confirmation step and generates an audit event with mandatory reason.

---

### Process — Viewing a Record

1. User navigates to record detail page via catalog card, search result, or direct URL.
2. System checks `publication_state`:
   - If `published`: render full record to any authenticated or anonymous user.
   - If `superseded` or `archived`: render full record with a prominent state indicator banner; show supersession/archival notice.
   - If `draft`, `submitted_for_review`, or `retired`: return 404 for anonymous users; render for authenticated Curators/Admins with a state indicator.
3. System renders the appropriate perspective (Executive or Technical — see F04).
4. System renders only enabled CTAs from `next_actions` (F3.9).
5. System renders artifact links; for `is_restricted = true` artifacts, renders name and access notes but omits URL for non-Curator users.
6. System renders trust fields: maturity badge, review status badge(s), last reviewed date, applicable disclaimer, and (if superseded) successor record link.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Record not found | 404 | `RECORD_NOT_FOUND` | "This record could not be found or may not be available." | Also returned for non-published records accessed by anonymous users |
| Publication gate validation fails | 422 | `PUBLICATION_GATE_FAILED` | "This record cannot be published. The following required fields are missing: [field list]" | Returned by API; UI surfaces list of missing fields |
| Invalid maturity value at save | 400 | `INVALID_MATURITY` | "The maturity value provided is not recognized." | |
| Invalid review status value at save | 400 | `INVALID_REVIEW_STATUS` | "One or more review status values are not recognized." | |
| Concurrent edit conflict | 409 | `VERSION_CONFLICT` | "This record was updated by another user. Please reload and reapply your changes." | Optimistic concurrency via `version` field |
| Supersede without reason | 422 | `SUPERSESSION_REASON_REQUIRED` | "A reason is required when superseding a record." | |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Records (public) and `Y1b-api-curator.md` §Records (curator) for full schemas.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/records/:id` | None (published only) | Returns full public record by ID |
| GET | `/api/v1/records/:slug` | None (published only) | Returns full public record by slug |
| GET | `/api/v1/records/:id/artifacts` | None (public; restricted artifacts filtered) | Returns artifact list for a record |
| POST | `/api/v1/curator/records` | Curator | Create new record |
| PATCH | `/api/v1/curator/records/:id` | Curator | Edit record fields |
| POST | `/api/v1/curator/records/:id/publish` | Curator | Attempt publication (validates gate) |
| POST | `/api/v1/curator/records/:id/unpublish` | Curator | Unpublish (returns to draft) |
| POST | `/api/v1/curator/records/:id/supersede` | Curator | Supersede record |
| POST | `/api/v1/curator/records/:id/archive` | Curator | Archive record |
| POST | `/api/v1/curator/records/:id/retire` | Curator | Retire record |

---

### Schema Surface (this feature)

- Table `innovation_records`: all fields from Groups 0–9 above. See `Y0a-schema-core.md`.
- Table `artifacts`: per-artifact fields from Group 8. See `Y0a-schema-core.md §artifacts`.
- Table `record_next_actions`: stores next action CTA configurations per record.
---

## F04: Executive and Technical Perspectives

**PRD Reference:** F4 (F4.1–F4.4) | **Priority:** P0 — Critical

**Description:** A single Innovation Record must serve both executive and technical audiences without creating duplicate source records or conflicting evidence. Perspectives are rendered views of the same underlying record data — not separate documents or database records. An executive and a technical adopter reading the same record share a common factual foundation while each receives the framing most useful to their job to be done.

---

### Terminology

- **Executive Perspective** — A rendered view of the Innovation Record that prioritizes mission relevance, strategic outcome, decision context, maturity, risk, ownership, and next step. Primary personas: Decision-Maker, Operational Leader.
- **Technical Perspective** — A rendered view of the Innovation Record that prioritizes architecture, tools, data flow, security considerations, testing findings, limitations, source artifacts, production-readiness gaps, reuse guidance, and dependencies. Primary persona: Technical Adopter.
- **Perspective Toggle** — A UI control (e.g., tab, radio button, or toggle) allowing a user to switch between perspectives on the same record.
- **Shared Evidence Base** — The underlying Innovation Record fields that both perspectives render from; neither perspective may contradict the stored field values.

---

### Sub-features

- **F4.1** — One innovation record supports both executive and technical perspectives without creating duplicate source records
- **F4.2** — Executive perspective framing — specific fields prioritized and specific framing applied
- **F4.3** — Technical perspective framing — specific fields prioritized and specific framing applied
- **F4.4** — Both perspectives remain grounded in the same underlying evidence, maturity, review status, ownership, and artifacts

---

### Process

1. User arrives at a published Innovation Record detail page.
2. The page renders the default perspective (Executive by default; configurable per deployment).
3. A perspective toggle is visible and accessible to all users.
4. User selects Executive or Technical perspective.
5. The page re-renders from the same underlying record data using the perspective-specific field prioritization rules (see §Perspective Rendering Rules below).
6. Trust fields (maturity, review status, last-reviewed date, applicable disclaimer) are displayed in both perspectives — not hidden in either view.
7. Ownership and attribution are displayed in both perspectives.
8. The URL does not change when toggling perspectives, but the active perspective may be reflected in a URL query parameter (e.g., `?view=technical`) so that links can be shared to a specific perspective.

---

### Perspective Rendering Rules

#### F4.2 — Executive Perspective: Fields Prioritized

The executive perspective renders the following fields prominently (in approximately this order):

| Priority | Field(s) | Display Label | Notes |
|---|---|---|---|
| 1 | `summary` | What This Is | One-sentence overview |
| 2 | `problem_statement` | The Problem | Full problem narrative |
| 3 | `mission_areas` | Mission Area | Badges |
| 4 | `outcome_summary` | What Was Learned | Outcome narrative |
| 5 | `decision_enabled` | What Decision This Supports | If populated |
| 6 | `findings_security`, `findings_operational` (summary) | Key Risks and Constraints | Security and operational findings surfaced for decision-maker context |
| 7 | `maturity` | Maturity Stage | Badge + descriptive label |
| 8 | `review_statuses` | Review Status | All values; badges |
| 9 | `ready_for` / `not_ready_for` | What It's Ready For / Not Ready For | Paired field display |
| 10 | `next_action_description` + enabled CTAs | Recommended Next Step | Prominent CTA rendering |
| 11 | `owner_steward` + `contributing_offices` | Ownership and Attribution | |
| 12 | `applicable_disclaimer` | Trust Notice | Required; must appear |
| 13 | `last_reviewed_date` | Last Reviewed | |

Fields deprioritized (still accessible via record or technical perspective, but not prominently rendered in executive view): `technologies_used`, `methods_used`, `findings_architectural`, `findings_cloud_platform`, `findings_testing`, `findings_data`, `findings_scalability`, `scope_description`, `required_skills`, `required_services`, `production_readiness_gaps` (condensed reference only), individual artifact URLs.

#### F4.3 — Technical Perspective: Fields Prioritized

The technical perspective renders the following fields prominently:

| Priority | Field(s) | Display Label | Notes |
|---|---|---|---|
| 1 | `summary` | What This Is | One-sentence overview |
| 2 | `hypothesis_or_objective` | What Was Tested | |
| 3 | `scope_description` | Scope | What was and was not in scope |
| 4 | `technologies_used` | Technologies and Services Used | Full list |
| 5 | `technology_areas` | Technology Areas | Badges |
| 6 | `findings_architectural` | Architecture Findings | |
| 7 | `findings_security` | Security Findings | SEC-11: must be distinct from general technical findings |
| 8 | `findings_cloud_platform` | Cloud / Platform Findings | |
| 9 | `findings_performance` | Performance Findings | |
| 10 | `findings_testing` | Testing Findings | |
| 11 | `findings_data` | Data Findings | |
| 12 | `findings_operational` | Operational Findings | |
| 13 | `findings_cost`, `findings_scalability`, `findings_other` | Additional Findings | |
| 14 | `what_worked` / `what_did_not_work` | What Worked / What Didn't | |
| 15 | `production_readiness_gaps` | Production-Readiness Gaps | Prominently shown |
| 16 | `what_can_be_reused` / `what_should_be_adapted` / `what_not_to_copy` | Reuse Guidance | |
| 17 | `required_skills` / `required_services` | Dependencies | |
| 18 | Artifacts list (filtered by `is_restricted`) | Authoritative Artifacts | Full artifact list |
| 19 | `maturity`, `review_statuses` | Maturity and Review Status | Badges; same values as executive view |
| 20 | `applicable_disclaimer` | Trust Notice | Required; must appear |
| 21 | `owner_steward`, `contributing_offices`, `contributor_names` | Attribution | |
| 22 | `last_reviewed_date`, `next_review_date` | Review Dates | |
| 23 | Enabled CTAs | Next Steps | |

---

### Inputs

- `view` query parameter (optional): `executive` (default) or `technical`. If absent or unrecognized, defaults to `executive`.
- The underlying record data — no additional inputs; perspectives do not accept per-view data overrides.

---

### Outputs

- A rendered record detail page with the appropriate perspective applied.
- Trust fields (maturity, review status, disclaimer) rendered visibly in both perspectives.
- Perspective toggle control accessible via keyboard (WCAG 2.1 AA requirement).
- Shared underlying values: maturity badge, review status badges, last-reviewed date, applicable disclaimer, owner/steward, and contributing offices are identical in both perspectives.

---

### Validation

- Perspectives may not display conflicting values for any shared field (maturity, review status, owner, disclaimer, last-reviewed date). Both perspectives read from the same database record.
- A perspective may not suppress or omit trust fields. Maturity, review status, and applicable disclaimer must appear in both views.
- If `view` parameter is unrecognized: silently default to `executive`. Do not return an error.
- Artifact URL visibility: `is_restricted = true` artifacts must not expose URLs in either perspective to non-Curator users.

---

### Error States

| Scenario | Behavior | Notes |
|---|---|---|
| Invalid `view` parameter value | Default to executive perspective; no error shown | Graceful degradation |
| Record is not published | 404 for anonymous users; curator sees both perspectives with draft indicator | See F03b §Process |
| A required trust field is empty on a published record | System must not allow publication with missing trust fields (publication gate). If discovered post-publication, flag in curator admin view and suppress from public catalog. | Data integrity safeguard |

---

### API Surface (this feature)

Perspectives are rendered client-side from the same API response. No separate API endpoint per perspective.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/records/:id?view=executive` | None | Returns record data; client renders executive view |
| GET | `/api/v1/records/:id?view=technical` | None | Returns same record data; client renders technical view |

The API response is identical for both `view` values — the `view` parameter is a client rendering hint only. If a server-side rendering architecture is used, the view parameter controls which template is applied server-side.

---

### Schema Surface (this feature)

No additional tables. Perspectives use the same `innovation_records` and `artifacts` tables. See `Y0a-schema-core.md`.
---

## F05: Existing Lessons-Learned Content

**PRD Reference:** F5 (F5.1–F5.5) | **Priority:** P0 — Critical (launch content)

**Description:** The Hub must explicitly support existing I&R lessons-learned documents and POC outputs as source material for innovation records. Rather than migrating or rewriting authoritative documents, curators create a structured Innovation Record around each source, extract reusable findings, and link back to the original. This feature defines the curation process for converting existing materials into Hub records. The Audio Security POC is the priority first candidate because its architectural, security, performance, cloud-environment, testing, and production-readiness findings exercise the full content model across all record sections and both perspectives.

---

### Terminology

- **Source Document** — The authoritative lessons-learned document, POC report, or other existing artifact that serves as the evidentiary basis for the Innovation Record. The Hub does not migrate or copy this document; it links to it.
- **Extraction** — The curator activity of reading a source document and populating Innovation Record fields from it. Extraction is a human curation activity — not automated processing.
- **Source Basis** — The `source_basis` field on the Innovation Record that records what authoritative source(s) the record was derived from.
- **Audio Security POC** — TSIO Innovation & Research's proof-of-concept project on court audio security (defense-in-depth architecture, GPU/CPU separation, Azure Government Cloud constraints, performance limitations, testing gaps, security recommendations, production-readiness requirements). Priority first record.

---

### Sub-features

- **F5.1** — Treat the existing source document as the source of record (no migration)
- **F5.2** — Create a structured Innovation Record around the source and extract key findings
- **F5.3** — Apply full metadata, maturity, review status, ownership, attribution, and review-date
- **F5.4** — Link back to authoritative source; make record discoverable via problem-oriented search
- **F5.5** — Audio Security POC as priority first candidate; exercises full content model

---

### Process

1. **Curator identifies a source document** — identifies an existing I&R lessons-learned document, POC report, or other authoritative source to curate into the Hub.
2. **Curator creates a new Draft Innovation Record** (F9.3) — opens the record creation form.
3. **Curator populates record fields from source material** — uses the source document as the basis for all record fields:
   - `problem_statement` — derived from the source's problem framing.
   - `hypothesis_or_objective` — derived from the source's stated objective.
   - `outcome_summary`, `what_worked`, `what_did_not_work` — derived from findings sections.
   - All `findings_*` fields — extracted from the source's findings, recommendations, and lessons learned.
   - `source_basis` — populated with a precise reference to the source document (title, date, author/office, location).
   - `technologies_used` — extracted from the source's technology descriptions.
   - `mission_areas`, `technology_areas`, `tags` — curator-assigned based on content review.
4. **Curator adds an artifact link** (F9.5, F3.8) — adds the source document as an artifact with:
   - `artifact_type` = `lessons_learned` (or `poc_report` as appropriate).
   - `name` = precise document title.
   - `url` = authoritative source URL (SharePoint, Git, network location).
   - `access_notes` = any access restrictions (e.g., "AO internal SharePoint — requires AO network").
   - `is_restricted` = true if the document is not publicly accessible.
5. **Curator assigns governance metadata:**
   - `maturity` — based on what the work has demonstrated (e.g., `experiment_poc` for the Audio Security POC).
   - `review_statuses` — applies statuses that have actually been completed (e.g., `technically_reviewed`, `security_reviewed` if a security review occurred).
   - `contributing_offices` — the office(s) that produced the source work.
   - `owner_steward` — current I&R point of contact or project lead.
   - `last_reviewed_date` — date the curator reviewed the source document and completed extraction.
   - `attribution_statement` — formal credit for the originating team.
6. **Curator assigns applicable disclaimer** — selects or writes the trust statement appropriate to the maturity stage (e.g., for a POC: "This record summarizes a proof-of-concept effort. The findings are not production-ready and do not constitute an approval for deployment.").
7. **Curator configures next actions** (F3.9) — selects appropriate CTAs for the record (e.g., for the Audio Security POC: "Request Technical Guidance", "Discuss a Related Use Case").
8. **Curator validates publication gate** — the system checks that all required publication gate fields are populated before allowing publication.
9. **Curator publishes the record** (F9.9) — record transitions to `published` state and becomes discoverable via catalog and search.

---

### Audio Security POC — Specific Content Requirements (F5.5)

The Audio Security POC record must exercise the following content areas of the Innovation Record model:

| Record Section | Audio Security POC Content |
|---|---|
| Problem & Context | Protecting court audio recordings from unauthorized access and interception; court audio security requirements |
| What Was Explored | Defense-in-depth architecture; GPU/CPU service separation; Azure Government Cloud deployment |
| Outcome & Evidence | Findings on architecture feasibility, Azure Gov constraints, performance limitations, security posture |
| Key Findings — Architectural | Defense-in-depth pattern; GPU/CPU separation design |
| Key Findings — Security | Security recommendations; identified gaps |
| Key Findings — Cloud/Platform | Azure Government Cloud-specific constraints and limitations |
| Key Findings — Performance | Performance limitations discovered during POC |
| Key Findings — Testing | Testing gaps identified; what was not tested |
| Key Findings — Operational | Production-readiness requirements identified |
| Maturity | `experiment_poc` — a controlled effort that produced findings; not production-ready |
| Review Status | At minimum `technically_reviewed`; `security_reviewed` if a security review was performed |
| Reuse Guidance | What is architecturally reusable; what requires adaptation; what is not yet ready for production |
| Artifacts | Link to the authoritative lessons-learned document in its source location |
| Applicable Disclaimer | Must clearly state POC ≠ production-ready |

---

### Inputs

All inputs are the Innovation Record field set defined in F03a and F03b. No additional fields are required by F5 beyond what is already defined on the Innovation Record.

The following fields are specifically emphasized for lessons-learned source curation:
- `source_basis` — **Publication gate field**; must reference the authoritative source precisely.
- `attribution_statement` — **Publication gate field**; must credit the originating team.
- Artifact with `artifact_type = lessons_learned` or `poc_report` — strongly expected but not a publication gate hard requirement (curator may note inaccessible source in `source_basis` and `access_notes`).

---

### Validation

- `source_basis` must be populated (publication gate) and must reference a real identifiable source (not a placeholder string like "TBD").
- If the source document is restricted and no public URL is available, `is_restricted = true` must be set on the artifact; the source must still be named in `source_basis` and `access_notes`.
- `maturity` must be accurately set; for a POC, `experiment_poc` is the expected default. If the curator assigns `production_validated` to a POC-sourced record, the system should surface a curator-visible warning (not a hard block): "You are publishing a POC-sourced record with maturity 'Production / Validated Pattern'. Please confirm this is correct."
- `applicable_disclaimer` must contain language appropriate to the maturity stage; the system must provide maturity-specific disclaimer templates (F9.16) to help curators choose the appropriate text.

---

### Error States

| Scenario | Behavior | Notes |
|---|---|---|
| Source document URL unreachable | System validates URL format but does not verify reachability at save time. Curator is responsible for providing a valid URL. Broken links should be surfaced as part of periodic curator review. | The Hub links; it does not crawl. |
| Maturity/disclaimer mismatch warning | Curator-visible warning on the publishing form; not a hard block | Prevents accidental maturity/trust mismatch |
| Missing `source_basis` at publication | Publication gate fails with: "Source Basis is required before publishing." | |

---

### API Surface (this feature)

F5 does not introduce new API endpoints. It uses the same Innovation Record and Artifact APIs defined in F03a/F03b and F9. See `Y1b-api-curator.md` §Records.

---

### Schema Surface (this feature)

Uses `innovation_records` and `artifacts` tables. No additional tables. See `Y0a-schema-core.md`.
---

## F06: Opportunity Submission

**PRD Reference:** F6 (F6.1–F6.5) | **Priority:** P1 — High

**Description:** Opportunity Submission provides a structured flow for Judiciary stakeholders to bring mission problems, emerging questions, or workflow friction to I&R's attention — starting with the problem, not a requested solution. The flow captures the context I&R needs to assess relevance, research value, feasibility, and capacity. Submission does not imply acceptance into the I&R portfolio. The resulting record enters a curator-managed queue (F9.12) for review and disposition.

---

### Terminology

- **Opportunity Submission** — A structured record describing a mission problem, research question, emerging technology need, or collaboration opportunity submitted to I&R for consideration.
- **Submitter** — The Judiciary stakeholder (anonymous or self-identified) submitting the opportunity. May be any authorized user; no Curator role required.
- **Non-Acceptance Statement** — The required explicit disclosure that submission does not imply I&R acceptance into the portfolio.
- **Request Type** — The submitter's characterization of what kind of opportunity they are bringing (e.g., current mission problem, request for research, request for demo).
- **Disposition** — The I&R curator's recorded response to a submission (accepted, declined, needs more information, etc.).

---

### Sub-features

- **F6.1** — Problem-first submission flow (not solution/application request flow)
- **F6.2** — Capture full context: who is affected, current workflow, impact, desired outcome, constraints, related work, office, contacts
- **F6.3** — Request type characterization by submitter
- **F6.4** — Non-acceptance statement explicitly visible before and after submission
- **F6.5** — Submission recorded for I&R review and disposition queue (F9.12)

---

### Process

1. User navigates to the Opportunity Submission form (public-facing page).
2. **Non-acceptance statement is displayed prominently at the top of the form** — must be visible before the user begins filling in fields: *"Submitting an opportunity does not imply acceptance into the I&R portfolio. I&R will review submissions and reach out if the opportunity aligns with our current capacity and priorities."*
3. User selects a **Request Type** (F6.3) — framing their submission before describing the problem.
4. User completes the **Problem Description** (F6.1) — explains the mission problem or workflow friction, not a proposed application.
5. User completes **Context Fields** (F6.2) — captures who is affected, current workflow, impact, desired outcome, constraints, and related work.
6. User provides **Contact and Attribution** — office name, contact name, contact email, and availability for discovery sessions.
7. User reviews non-acceptance statement a second time (confirmation screen or inline before submit).
8. User submits the form.
9. System applies SEC-06 abuse protection (rate limiting / CAPTCHA or approved equivalent).
10. System validates all required fields.
11. System persists the submission to `opportunity_submissions` table with `status = pending`.
12. System displays a success confirmation page with:
    - Confirmation that the submission was received.
    - Re-statement of non-acceptance: *"Your submission has been received. Submission does not imply acceptance into the I&R portfolio. You will be contacted if I&R determines the opportunity aligns with current priorities."*
    - Reference number (submission ID) for follow-up.
13. Submission appears in I&R curator queue (F9.12) for review and disposition.

---

### Inputs — Opportunity Submission Fields

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `request_type` | enum | Yes | One of canonical Request Type values (see below) | Framing characterization |
| `problem_title` | string | Yes | Max 200 chars; min 5 chars | Short title for the submission |
| `problem_description` | text | Yes | Max 5,000 chars; min 50 chars | Narrative of the mission problem or workflow friction; must not be a solution request |
| `affected_users` | text | Yes | Max 1,000 chars; min 10 chars | Who is affected and how (roles, courts, offices) |
| `current_workflow` | text | No | Max 2,000 chars | How the work is done today; current pain points |
| `impact` | text | Yes | Max 1,000 chars; min 10 chars | What impact the problem has — operational, financial, user experience, compliance, etc. |
| `desired_outcome` | text | No | Max 1,000 chars | What a successful resolution would look like |
| `known_constraints` | text | No | Max 1,000 chars | Known technical, organizational, budgetary, or policy constraints |
| `related_work_attempted` | text | No | Max 1,000 chars | Prior attempts to address this problem; related efforts underway |
| `submitting_office` | string | Yes | Max 200 chars; min 2 chars | Name of the submitting court, AO office, or organizational unit |
| `submitter_name` | string | Yes | Max 200 chars; min 2 chars | Name of the submitter |
| `submitter_email` | string | Yes | Valid email format; max 254 chars | Contact email; handled per SEC-05 |
| `discovery_participants` | text | No | Max 500 chars | Names/roles of people available for I&R discovery conversations |
| `additional_context` | text | No | Max 2,000 chars | Any other information the submitter wants I&R to know |
| `consent_to_contact` | boolean | Yes | Must be true to submit | Submitter acknowledges that I&R may contact them about this submission |
| `non_acceptance_acknowledged` | boolean | Yes | Must be true to submit | Submitter acknowledges the non-acceptance statement |
| `submission_date` | timestamp | Yes (auto) | UTC; set by server | System-generated |
| `submission_ip` | string | No | Server-captured; not shown to submitter | Used for SEC-06 rate limiting |

---

### Request Type — Canonical Values (F6.3)

| Value | Display Label | Description |
|---|---|---|
| `current_mission_problem` | Current Mission Problem | An active operational or mission problem I&R should consider exploring |
| `emerging_tech_question` | Emerging Technology Question | A question about whether a specific technology could address a mission area |
| `request_for_research` | Request for Research | A request for I&R to research or evaluate a topic |
| `potential_poc` | Potential POC | A problem the submitter believes warrants a proof-of-concept effort |
| `request_for_demo` | Request for Demonstration | A request to see existing I&R work demonstrated |
| `collaboration_opportunity` | Collaboration Opportunity | A proposal to collaborate on innovation work |
| `share_existing_work` | Share Existing Innovation Work | If the submitter has existing work to share, they should use the contribution flow (F7); selecting this value redirects to F7 with an explanation |
| `other` | Other | Does not fit above categories; requires description |

**Note on `share_existing_work` request type:** When selected, the system must display an in-line message explaining the distinction and provide a direct link to the F7 Contribution Submission form: *"If you have existing innovation work to share — not a problem for I&R to investigate — please use our Innovation Contribution form instead. [Link to F7]"* The submitter may continue with the opportunity form if they choose.

---

### Outputs

- Persisted `opportunity_submissions` record with `status = pending`.
- Success confirmation page with submission reference number and non-acceptance re-statement.
- Entry in I&R curator queue (F9.12).
- No automated email to submitter for MVP. (Email routing is for curator-reviewed engagement requests per F8; opportunity submissions enter the curator queue.)

---

### Validation

- All required fields must be non-empty before submission is accepted.
- `submitter_email`: must be valid RFC 5321 email format.
- `problem_description`: must be ≥ 50 characters. If it appears to be a solution request (heuristic: starts with "Build me" / "Create an app" — informational hint only, not a hard block): display inline guidance: *"We focus on mission problems first. Describe the problem you're facing, and I&R will explore whether a solution approach is appropriate."*
- `consent_to_contact` and `non_acceptance_acknowledged`: both must be `true`; unchecked checkbox blocks submission with validation message.
- Rate limiting (SEC-06): maximum 5 submissions per IP address per hour. Exceeding limit returns 429 with message: *"Too many submissions. Please try again later."*
- All text fields: sanitize for XSS before storage.
- `request_type`: must be one of the canonical values; unknown value returns 400.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Required field missing | 422 | `VALIDATION_ERROR` | "[Field name] is required." | Per-field validation messages |
| Invalid email format | 422 | `INVALID_EMAIL` | "Please enter a valid email address." | |
| Rate limit exceeded | 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | SEC-06 |
| Non-acceptance not acknowledged | 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-acceptance statement to submit." | |
| Server error during save | 500 | `SUBMISSION_FAILED` | "We were unable to save your submission. Please try again. If the problem persists, contact I&R directly at [engagement address]." | Must not silently lose the submission |
| `share_existing_work` request type selected | 200 (inline) | — | Redirect guidance to F7 form | Not an error; informational routing |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Submissions and `Y1b-api-curator.md` §Submission Queue.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/submissions/opportunity` | None (rate-limited) | Create new opportunity submission |
| GET | `/api/v1/curator/submissions/opportunity` | Curator | List opportunity submissions queue |
| GET | `/api/v1/curator/submissions/opportunity/:id` | Curator | View single opportunity submission |
| PATCH | `/api/v1/curator/submissions/opportunity/:id/disposition` | Curator | Record disposition for a submission |

---

### Schema Surface (this feature)

Uses table `opportunity_submissions`. See `Y0b-schema-submissions.md §opportunity_submissions`.
---

## F07: Share Existing Innovation Work

**PRD Reference:** F7 (F7.1–F7.4) | **Priority:** P1 — High

**Description:** Share Existing Innovation Work provides a separate contribution flow for courts, AO offices, or technical teams that already have innovation work to contribute — an idea, experiment, implementation, or lesson learned. It is explicitly distinct from Opportunity Submission (F6): the contributor is sharing work already done, not describing a problem for I&R to investigate. Attribution is preserved through the entire curation process. No record reaches publication without curator review. Submission does not imply central endorsement.

---

### Terminology

- **Innovation Contribution** — A structured submission of existing innovation work from a court, AO office, or technical team for I&R curation review and possible publication.
- **Contributor** — The person or office submitting the contribution. Attribution is preserved throughout curation and in the published record.
- **Curation Review** — The curator's assessment of a submitted contribution for completeness, accuracy, appropriate metadata, and publication readiness.
- **Attribution Preservation** — The requirement that the contributing office and named contributors are credited in the published Innovation Record, regardless of how extensively the record is edited or enriched during curation.
- **Non-Endorsement Statement** — The required explicit disclosure that submission does not imply I&R central endorsement of the work.

---

### Sub-features

- **F7.1** — Separate contribution flow (distinct from F6 Opportunity Submission)
- **F7.2** — Capture: problem addressed, work description, contributing office, maturity, current owner, artifacts, limitations, contact person, collaboration preference
- **F7.3** — Attribution and current ownership preserved through curation to publication
- **F7.4** — Curation required before publication; non-endorsement statement visible at submission and in published record

---

### Process

1. User navigates to the Innovation Contribution form (public-facing; distinct URL and page from F6).
2. **Non-endorsement statement displayed prominently** before the user begins: *"Submitting existing innovation work does not imply I&R central endorsement. If I&R determines the work is suitable for publication, attribution will be preserved in the resulting record and you will be notified."*
3. User completes the **Contribution Form** (F7.2) — describes the work, contributing office, maturity, owner, artifacts, limitations, and collaboration preference.
4. User provides **Contact and Attribution** — named contributor(s), contact email, contributing office.
5. User submits the form.
6. System applies SEC-06 abuse protection.
7. System validates all required fields.
8. System persists the contribution to `innovation_contributions` table with `status = pending`.
9. System displays confirmation page:
   - Confirmation of receipt.
   - Non-endorsement re-statement.
   - Reference number for follow-up.
   - Statement that I&R will contact the contributor if the work is selected for curation.
10. Contribution appears in I&R curator queue (F9.13) for review.

**Curator actions on a contribution (F9.13):**
11. Curator reviews contribution in the queue.
12. Curator may disposition as: `accepted_for_curation`, `declined`, `needs_more_information`, or `duplicate`.
13. If `accepted_for_curation`: the system allows the curator to initiate a new Draft Innovation Record pre-populated from the contribution fields.
14. The pre-populated record retains a link to the originating contribution (`source_contribution_id`) — this link is immutable.
15. Curator enriches and curates the record (F9.3, F9.4) while preserving attribution fields:
    - `contributing_offices` — must include the contributor's office; curator may add I&R or other offices.
    - `contributor_names` — must include named contributors from the submission; curator may add others.
    - `attribution_statement` — must credit the originating team; curator may expand but must not remove the contributor's credit.
    - `ir_contribution` — curator documents I&R's specific contribution (if different from contributor's work).
16. Curator may not publish the record without `attribution_statement` being non-empty and crediting the submitting contributor.
17. Record is published per standard Publication Lifecycle (F03b §State Machine 3).
18. Contributor is not automatically notified of publication in MVP (notification is a manual curator action).

---

### Inputs — Innovation Contribution Fields

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `contribution_title` | string | Yes | Max 200 chars; min 5 chars | Short name for the work being contributed |
| `problem_addressed` | text | Yes | Max 3,000 chars; min 30 chars | The mission problem the work addressed |
| `work_description` | text | Yes | Max 5,000 chars; min 50 chars | Description of the innovation work, experiment, implementation, or lesson learned |
| `contributing_office` | string | Yes | Max 200 chars; min 2 chars | Court, AO office, or organizational unit that did the work |
| `contributor_names` | string | Yes | Max 500 chars; min 2 chars | Names of contributing individuals; free-form for MVP |
| `current_maturity` | enum | Yes | One of canonical Maturity values (see header §Maturity Taxonomy) | Contributor's assessment; curator may revise |
| `current_owner` | string | Yes | Max 200 chars; min 2 chars | Current owner or point of contact for the work |
| `owner_contact_email` | string | Yes | Valid email format; max 254 chars | Contact email for the current owner |
| `artifact_links` | text | No | Max 2,000 chars | URLs or descriptions of available artifacts (documents, code, diagrams); free-form in submission; structured as `artifacts` records if curated |
| `known_limitations` | text | No | Max 2,000 chars | Known constraints, gaps, or limitations of the work |
| `collaboration_preference` | enum | Yes | One of canonical Collaboration Preference values (see below) | How the contributor wants the work used |
| `additional_context` | text | No | Max 2,000 chars | Any other context I&R should know |
| `submitter_name` | string | Yes | Max 200 chars; min 2 chars | Name of the person submitting |
| `submitter_email` | string | Yes | Valid email format; max 254 chars | Contact email; SEC-05 applies |
| `non_endorsement_acknowledged` | boolean | Yes | Must be true | Submitter acknowledges non-endorsement statement |
| `consent_to_contact` | boolean | Yes | Must be true | Submitter acknowledges I&R may contact them |
| `submission_date` | timestamp | Yes (auto) | UTC; set by server | System-generated |
| `submission_ip` | string | No | Server-captured | SEC-06 rate limiting |

---

### Collaboration Preference — Canonical Values (F7.2)

| Value | Display Label | Description |
|---|---|---|
| `open_for_reuse` | Open for Reuse | Others are encouraged to use and adapt the work |
| `seeking_collaborator` | Seeking Collaborator | Contributor wants to find a collaboration partner |
| `informational_only` | Informational / Reference Only | Share for awareness; contributor is not seeking active collaboration |
| `seeking_adopter` | Seeking Adopter | Contributor has work that needs an operational partner to adopt it |
| `discuss_with_ir` | Discuss with I&R First | Contributor wants a conversation before determining use |

---

### Attribution Preservation Rules (F7.3)

These rules are enforced by the system at publication:

1. A published Innovation Record created from an innovation contribution (`source_contribution_id` is non-null) must have a non-empty `attribution_statement`.
2. The `attribution_statement` must not be edited to remove the original contributor's credit. Curators may expand attribution but must not erase it.
3. The `contributing_offices` array of the published record must include the contributor's `contributing_office` value. The curator may add additional offices.
4. The `contributor_names` array must include at least one name from the original `contributor_names` field of the contribution. The curator may add names.
5. The system must surface a validation warning (not a hard block) if the curator attempts to remove all references to the original contributing office or all original contributor names during editing.
6. The `source_contribution_id` link is immutable once set; it cannot be removed from a record.

**Attribution Preservation Validation at Publication:**
- If `source_contribution_id` is non-null and `attribution_statement` is empty: publication gate fails with "Attribution Statement is required for contributed records."
- If `source_contribution_id` is non-null and `contributing_offices` array does not include the original `contributing_office`: system surfaces a curator-visible warning but does not hard-block (curator must confirm).

---

### Disposition Values for Contribution Queue (F9.13)

| Value | Label | Description |
|---|---|---|
| `pending` | Pending Review | Submitted; not yet reviewed |
| `accepted_for_curation` | Accepted for Curation | Curator has accepted and may initiate record creation |
| `declined` | Declined | Work does not meet criteria for curation at this time |
| `needs_more_information` | Needs More Information | Curator has requested additional information from contributor |
| `duplicate` | Duplicate | Similar or identical work is already in the Hub |
| `curated` | Curated into Record | A published record has been created from this contribution |

---

### Outputs

- Persisted `innovation_contributions` record with `status = pending`.
- Confirmation page with reference number and non-endorsement statement.
- Entry in I&R curator contribution queue (F9.13).
- If curated: an Innovation Record with `source_contribution_id` referencing the contribution and attribution fields populated from contribution data.

---

### Validation

- All required fields must be non-empty.
- `owner_contact_email` and `submitter_email`: valid RFC 5321 email format.
- `non_endorsement_acknowledged` and `consent_to_contact`: both must be `true`.
- Rate limiting: same as F6 — maximum 5 submissions per IP per hour; returns 429 on excess.
- `current_maturity`: must be one of the canonical maturity values; unknown value returns 400.
- `collaboration_preference`: must be one of the canonical values.
- All text fields: sanitize for XSS before storage.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Required field missing | 422 | `VALIDATION_ERROR` | "[Field name] is required." | Per-field messages |
| Invalid email format | 422 | `INVALID_EMAIL` | "Please enter a valid email address." | |
| Rate limit exceeded | 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | SEC-06 |
| Non-endorsement not acknowledged | 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-endorsement statement to submit." | |
| Server error during save | 500 | `SUBMISSION_FAILED` | "We were unable to save your submission. Please try again. If the problem persists, contact I&R directly." | Must not silently lose the submission |
| Attribution removal warning (curator) | 422 warning | `ATTRIBUTION_REMOVAL_WARNING` | "Removing the original contributing office or contributors requires confirmation. Attribution must be preserved for contributed records." | Curator-visible warning at publish time |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Contributions and `Y1b-api-curator.md` §Contribution Queue.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/submissions/contribution` | None (rate-limited) | Create new innovation contribution |
| GET | `/api/v1/curator/submissions/contribution` | Curator | List contribution queue |
| GET | `/api/v1/curator/submissions/contribution/:id` | Curator | View single contribution |
| PATCH | `/api/v1/curator/submissions/contribution/:id/disposition` | Curator | Record disposition |
| POST | `/api/v1/curator/submissions/contribution/:id/create-record` | Curator | Initiate Draft record from contribution |

---

### Schema Surface (this feature)

Uses table `innovation_contributions`. See `Y0b-schema-submissions.md §innovation_contributions`.
---

## F08: Engagement Routing

**PRD Reference:** F8 (F8.1–F8.6) | **Priority:** P0 — Critical

**Description:** Engagement Routing converts user interest into traceable, routed action. Every innovation record and the Hub generally must provide contextual calls to action allowing users to request a demonstration, discuss a use case, explore adoption, request technical guidance, share related work, or contact I&R. Routing destinations are configurable without code deployment. For MVP, email-first routing is acceptable provided engagement actions are separately recorded. The initial routing address is AOml_TSO_IRB_Team@ao.uscourts.gov.

---

### Terminology

- **Engagement Request** — A user's expression of interest in an innovation record or in I&R generally, captured as a structured record with context and routed to I&R.
- **CTA (Call to Action)** — A button or link on a record detail page or Hub-wide page that initiates an engagement request flow.
- **Record-Level CTA** — A CTA on a specific Innovation Record detail page, associated with that record's context.
- **General CTA** — A CTA available site-wide (e.g., "Contact I&R", "Submit an Opportunity") not tied to a specific record.
- **Routing Destination** — The I&R channel (email address) to which engagement notifications are sent. Configurable without code change (F9.15).
- **Email-First Routing** — MVP engagement routing approach: the system generates and initiates an email (via `mailto:` link or server-sent email) to the configured routing address; the engagement request is also separately recorded in the database.
- **Suggested Subject Pattern** — A pre-filled or suggested email subject line for the routed email.

---

### Sub-features

- **F8.1** — Record-level and general CTAs for demo, use case discussion, adoption, technical guidance, related work sharing, and I&R contact
- **F8.2** — Capture: request type, originating record (if applicable), user name, office, contact information, need description, desired next step
- **F8.3** — Email-first routing with separate database recording of engagement action (MVP)
- **F8.4** — Routing destination configurable without code change or redeployment (F9.15)
- **F8.5** — Display language directed to TSIO Innovation & Research; initial address AOml_TSO_IRB_Team@ao.uscourts.gov
- **F8.6** — Suggested email subject patterns

---

### Process

**Initiating an Engagement Request:**

1. User clicks a CTA on a record detail page or general Hub page.
2. System renders an Engagement Request form pre-populated with:
   - Request type (from the CTA type clicked).
   - Originating record ID and title (if record-level CTA).
   - Suggested email subject (F8.6).
3. User completes the form (see §Inputs).
4. User submits the form.
5. System applies SEC-06 abuse protection.
6. System validates all required fields.
7. System persists the engagement request to `engagement_requests` table with `status = received`.
8. **MVP Email Routing:** System initiates email routing to the configured routing destination (F9.15):
   - If server-side email is available: sends a notification email to the configured address containing the engagement request details.
   - If only `mailto:` client-side routing is available for MVP: opens the user's email client pre-populated with the routing address, suggested subject, and request context. **The engagement request is still separately recorded in the database before this action.**
9. System displays success confirmation to user:
   - Confirmation of receipt.
   - Next step: "I&R will review your request and reach out using the contact information you provided."
   - Reference number (engagement request ID).

**Curator reviewing engagement:**

10. Curator reviews engagement requests in the Engagement Activity queue (F9.14).
11. Curator records a follow-up status on each request.

---

### Inputs — Engagement Request Fields

| Field | Type | Required | Constraints | Notes |
|---|---|---|---|---|
| `request_type` | enum | Yes | One of canonical Engagement Request Type values (see below) | Determines routing context and subject pattern |
| `originating_record_id` | UUID | Conditional | Required for record-level CTAs; null for general CTAs | References `innovation_records.id` |
| `originating_record_title` | string | Conditional | Populated automatically from record when present; max 200 chars | Stored in the engagement request for audit; not editable by user |
| `requester_name` | string | Yes | Max 200 chars; min 2 chars | User's name |
| `requester_office` | string | Yes | Max 200 chars; min 2 chars | User's court, AO office, or organizational unit |
| `requester_email` | string | Yes | Valid email format; max 254 chars | SEC-05 applies |
| `need_description` | text | Yes | Max 3,000 chars; min 20 chars | User's description of the need, question, or context |
| `desired_next_step` | text | No | Max 500 chars | What the user hopes will happen next |
| `preferred_contact_method` | enum | No | One of: `email`, `phone`, `no_preference`; default `email` | |
| `consent_to_contact` | boolean | Yes | Must be true | User acknowledges I&R may contact them |
| `submitted_at` | timestamp | Yes (auto) | UTC | System-generated |
| `submission_ip` | string | No | Server-captured | SEC-06 rate limiting |
| `routing_address_at_submission` | string | Yes (auto) | Populated from configured routing address at time of submission; max 254 chars | Preserved for audit — captures what address was in use when the engagement was sent |
| `email_routing_initiated` | boolean | Yes (auto) | System sets to true after email routing is triggered | |

---

### Engagement Request Type — Canonical Values (F8.1)

| Value | Display Label | Default Subject Pattern (F8.6) |
|---|---|---|
| `request_demo` | Request a Demonstration | `Demo Request – [Innovation Record Title]` |
| `discuss_use_case` | Discuss a Related Use Case | `Innovation Opportunity – [Office] – [Topic]` |
| `explore_adoption` | Explore Adoption | `Adoption Discussion – [Innovation Record Title]` |
| `request_technical_guidance` | Request Technical Guidance | `Technical Guidance – [Innovation Record Title]` |
| `share_related_work` | Share Related Work | `Innovation Opportunity – [Office] – [Topic]` |
| `contact_ir` | Contact I&R | `Innovation Opportunity – [Office] – [Topic]` |

Subject patterns must be pre-populated in the form's suggested subject field. For MVP `mailto:` routing, the subject is set as the `?subject=` parameter. For server-side email, the configured subject pattern is used in the email subject header.

---

### Routing Behavior (F8.3, F8.4, F8.5)

**MVP Routing Model:**

The system must route engagement requests to the configured routing address AND separately record the request in the database. Both must occur. The routing is not considered complete if only one of these actions succeeds.

**If server-side email routing is implemented:**
- System sends an email to `routing_address` with:
  - Subject: formatted subject pattern (F8.6).
  - Body: engagement request details (request type, originating record, user name, office, email, need description, desired next step, reference number).
- On successful email send: set `email_routing_initiated = true` on the engagement request record.
- On email send failure: set `email_routing_initiated = false`; flag in curator admin view for manual follow-up; do not show an error to the user (the request is still recorded).

**If `mailto:` client-side routing is used (MVP fallback):**
- System first saves the engagement request to the database (persistence before email trigger).
- System opens the user's mail client via `mailto:` with pre-filled: `to=routing_address`, `subject=subject_pattern`, `body=formatted_context`.
- After the mailto link is activated, show a confirmation: "Your request has been recorded. If your email client opened, please send the pre-filled email to complete your request."
- `email_routing_initiated` is set based on whether the mailto link was triggered (best-effort for MVP).

**Routing Address Configuration (F8.4, F9.15):**
- The routing address is stored in the Hub settings table (F9.15), not in application code.
- Default value: `AOml_TSO_IRB_Team@ao.uscourts.gov`.
- Only Admin-role users may change the routing address via the Settings Management interface (F9.15).
- Every routing address change must generate an audit event (SEC-03).
- The `routing_address_at_submission` field on each engagement request captures what address was active at the moment of submission — for audit purposes even if the address later changes.

---

### CTA Configuration Rules (F8.1)

- Each Innovation Record has 0–6 enabled next actions configured by a Curator (see F03b §Group 9).
- A record with no configured next actions must still show a default "Contact I&R" CTA.
- General CTAs (not tied to a specific record) are available from the Hub navigation and dedicated engagement pages.
- CTAs must be accessible by keyboard and meet WCAG 2.1 AA requirements.
- The display text for the configured routing destination must say "TSIO Innovation & Research" (or the approved equivalent display name) — not the raw email address — in public-facing text. The email address itself may be shown in the `mailto:` link href.

---

### Outputs

- Persisted `engagement_requests` record.
- Email notification sent or initiated to the configured routing address.
- User confirmation page with reference number.
- Entry in Engagement Activity queue (F9.14).

---

### Validation

- `requester_email`: valid RFC 5321 email format.
- `consent_to_contact`: must be true.
- `need_description`: minimum 20 characters; maximum 3,000.
- `request_type`: must be one of canonical values.
- `originating_record_id`: if provided, must reference an existing, published record; unknown IDs return 404.
- Rate limiting: maximum 10 engagement requests per IP per hour; returns 429 on excess (SEC-06).
- All text fields: sanitize for XSS.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Required field missing | 422 | `VALIDATION_ERROR` | "[Field name] is required." | Per-field |
| Invalid email format | 422 | `INVALID_EMAIL` | "Please enter a valid email address." | |
| Rate limit exceeded | 429 | `RATE_LIMITED` | "Too many requests. Please try again later." | SEC-06 |
| Consent not given | 422 | `CONSENT_REQUIRED` | "You must consent to contact to submit this request." | |
| Server email send failure | 500 (internal) | `EMAIL_ROUTING_FAILED` | Not shown to user — request still recorded; curator admin flag | Must not result in lost engagement record |
| Referenced record not found | 404 | `RECORD_NOT_FOUND` | "The innovation record referenced by this request could not be found." | API error; UI prevents this with pre-validated CTA links |
| No routing address configured | 503 | `ROUTING_NOT_CONFIGURED` | "Engagement routing is not currently configured. Please contact I&R directly." | Fallback when address not set; SEC-07 |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Engagement and `Y1b-api-curator.md` §Engagement.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/engagement` | None (rate-limited) | Submit engagement request |
| GET | `/api/v1/curator/engagement` | Curator | List engagement requests |
| GET | `/api/v1/curator/engagement/:id` | Curator | View single engagement request |
| PATCH | `/api/v1/curator/engagement/:id/status` | Curator | Update follow-up status |
| GET | `/api/v1/curator/settings/routing` | Admin | View current routing configuration |
| PUT | `/api/v1/curator/settings/routing` | Admin | Update routing address |

---

### Schema Surface (this feature)

Uses table `engagement_requests`. See `Y0b-schema-submissions.md §engagement_requests`.
Uses table `hub_settings` (for routing address). See `Y0b-schema-submissions.md §hub_settings`.
---

## F09a: Curation and Administration — Core (F9.1–F9.8)

**PRD Reference:** F9 (F9.1–F9.8) | **Priority:** P0 — Critical

**Description:** This chunk covers the core curation and administration capabilities: the curator dashboard, record management list, record creation and editing, artifact management, maturity management, review status management, and attribution/ownership management. All capabilities in this section are restricted to authenticated Curator or Admin role users (SEC-01, SEC-02).

---

### Terminology

- **Curator Dashboard** — The authenticated landing page for curators showing a summary of current Hub state and items requiring attention.
- **Record Management List** — The filterable, searchable list of all innovation records in all lifecycle states, visible only to curators.
- **Curator Queue** — A list view within the curator interface showing items requiring curator action (submissions, contributions, engagement activity).

---

### Sub-features Covered Here

- **F9.1** — Curator Summary Dashboard
- **F9.2** — Record Management List
- **F9.3** — Record Creation
- **F9.4** — Record Editing
- **F9.5** — Artifact Management
- **F9.6** — Maturity Management
- **F9.7** — Review Status Management
- **F9.8** — Attribution and Ownership Management

---

### F9.1 — Curator Summary Dashboard

**Description:** The dashboard provides an authorized summary view of Hub state using live product data. It is the landing page for authenticated curators and must show attention items that require action.

**Required dashboard elements:**

| Element | Description |
|---|---|
| Record count by publication state | Counts for: Draft, Submitted for Review, Published, Superseded, Archived, Retired |
| Records needing review | Records where `next_review_date` ≤ today + 30 days |
| Records with incomplete data | Published records missing required trust fields (data integrity warning) |
| Opportunity submission queue count | Count of `opportunity_submissions` with `status = pending` |
| Contribution submission queue count | Count of `innovation_contributions` with `status = pending` |
| Recent engagement requests | Count of engagement requests received in the last 7 days; link to full queue |
| Recent audit events | Last 5 audit events with actor, action, record reference, and timestamp |

**Process:**
1. Authenticated curator navigates to the curator area (URL: `/curator` or `/admin`).
2. System verifies role (SEC-01, SEC-02).
3. System renders dashboard with live counts and attention items from the database.
4. Dashboard refreshes on page load; no auto-refresh required for MVP.

**Validation:** All counts must be accurate at page load time. Dashboard must not show stale data from a previous session cache.

---

### F9.2 — Record Management List

**Description:** A filterable, searchable list of all innovation records across all lifecycle states, visible to authenticated curators only.

**Required columns:**

| Column | Description |
|---|---|
| Title | Clickable; links to record edit view |
| Maturity | Displayed as badge |
| Review Status | All values displayed as badges |
| Publication State | Current state with visual indicator |
| Engagement Indicator | If configured |
| Last Reviewed Date | ISO date |
| Created At | ISO date |
| Updated At | ISO date |
| Updated By | Curator name |

**Filter options for curator record list:**
- Publication State (multi-select: all states)
- Maturity (multi-select)
- Review Status (multi-select)
- Mission Area (multi-select)
- Technology Area (multi-select)
- Contributing Office (text filter)
- Needs Review (boolean: records where `next_review_date` ≤ today)

**Actions available per record:**
- Edit record (links to F9.4 edit view)
- View public record (opens published record in a new tab; only for Published state)
- Publish / Unpublish
- Supersede / Archive / Retire

**Sorting:** Default sort by `updated_at` descending. Curator may sort by any column.

**Pagination:** Default 25 records per page; options for 25, 50, 100.

---

### F9.3 — Record Creation

**Description:** An authorized curator may create a new Innovation Record from scratch or from an accepted innovation contribution (F9.13).

**Process:**
1. Curator clicks "New Record" in the curator interface (or "Create Record from Contribution" from the contribution queue).
2. System creates a new record with `publication_state = draft`, `created_by = current_user`, `created_at = now()`.
3. If creating from a contribution: system pre-populates fields from `innovation_contributions` record and sets `source_contribution_id`.
4. Curator completes the record creation form (all fields defined in F03a, F03b).
5. Curator saves as draft at any time — no field validation required at save except: `title` must be present if the record has been given one (to prevent empty records from accumulating).
6. System persists the record and generates an audit event: `record_created`.
7. System displays confirmation and navigates curator to the record edit view.

**Validation at Save (Draft):**
- No publication gate fields are required at draft save.
- Controlled vocabulary fields (`maturity`, `review_statuses`, etc.) that are populated must use canonical values.

**Validation at Publish:**
- All publication gate fields (see F03a §Summary: Publication Gate Fields) must be non-empty.
- System returns a list of missing fields if gate check fails.

---

### F9.4 — Record Editing

**Description:** Authorized curators may edit any field on any Innovation Record in any lifecycle state. Some transitions trigger warnings or confirmation dialogs.

**Access rules:**
- Any authenticated Curator may edit any record.
- Records in `published`, `superseded`, or `archived` state may be edited; changes require an audit entry automatically.
- Editing a `retired` record requires curator confirmation: "This record is retired. Are you sure you want to edit it?"

**Optimistic concurrency:**
- The record's `version` field must be sent with every edit request.
- If the submitted `version` does not match the current database version, the server returns 409 `VERSION_CONFLICT`.
- The curator must reload the record and reapply changes.

**Auto-save:**
- Draft records should support auto-save (debounced, every 30 seconds of inactivity) if the frontend architecture permits. Auto-save events do not generate audit events.
- Manual save generates an audit event: `record_updated` with list of changed fields.

**Audit events triggered by edits (see F09b §F9.11 for full catalog):**
- Any field change on a Published record → `record_updated` audit event.
- Maturity change → `maturity_changed` audit event.
- Review status change → `review_status_changed` audit event.
- Publication state change → `publication_state_changed` audit event.
- Attribution or ownership change → `attribution_updated` audit event.

---

### F9.5 — Artifact Management

**Description:** Authorized curators may add, update, reorder, and remove authoritative artifact links on any Innovation Record.

**Operations:**

| Operation | Description | Validation |
|---|---|---|
| Add artifact | Add a new artifact to a record | `name` required; `url` required and must be valid HTTPS URL; `artifact_type` required |
| Edit artifact | Update any artifact field | Same field-level validation as add |
| Reorder artifacts | Change `display_order` of artifacts | Display order must be unique per record |
| Remove artifact | Delete an artifact link | Curator confirmation required; generates audit event `artifact_removed` |
| Restrict artifact | Toggle `is_restricted = true/false` | Curator may change; generates audit event |

**Business rules:**
- Removing the only artifact from a record that has no other `source_basis` reference: system surfaces a warning: "Removing this artifact will leave the record with no artifact links. The Source Basis field must still identify the authoritative source." (Not a hard block.)
- Publishing an artifact that links to an external URL: the system does not validate URL reachability. URL format must be valid HTTPS.
- Restricted artifacts (`is_restricted = true`): URL is not returned in public API responses; only artifact name and `access_notes` are returned.
- SEC-04: publishing a record must not change the `is_restricted` setting of its artifacts.

---

### F9.6 — Maturity Management

**Description:** Authorized curators may assign or update the maturity of any Innovation Record at any time.

**Rules:**
- Any Curator may change maturity to any canonical value.
- No enforced maturity progression — maturity may be set forward or backward.
- Maturity must not be null on a published record.
- Every maturity change must generate a `maturity_changed` audit event: previous value, new value, curator ID, timestamp, optional reason (`maturity_change_reason` field on the record — see F03a §Group 5).
- Maturity change must not affect review status values (independence rule — see F03b §State Machine 1).
- Curator is presented with maturity definitions (from F9.16 Content Model Reference) in the edit UI to support consistent application.

**Warning:** If a curator changes maturity from `production_validated` to any lower value on a Published record, system displays: "You are downgrading the maturity of a published record. This will affect how stakeholders interpret this record. Confirm this change?"

---

### F9.7 — Review Status Management

**Description:** Authorized curators may add, update, or remove review status values independently from maturity.

**Rules:**
- Review status is stored as an array; multiple values may apply simultaneously.
- Any Curator may add or remove any review status value.
- `security_reviewed` is visually distinct from `technically_reviewed` in the curator UI (SEC-11).
- Changing review status must not affect maturity (independence rule — see F03b §State Machine 2).
- Every review status change generates a `review_status_changed` audit event: previous values array, new values array, curator ID, timestamp.
- Adding `validated_for_reuse` to a Published record: system displays confirmation: "You are marking this record as 'Validated for Reuse'. Confirm that the required reviews have been completed and documented."
- Curator is presented with review status definitions (from F9.16) in the edit UI.

---

### F9.8 — Attribution and Ownership Management

**Description:** Authorized curators may update attribution and ownership fields at any time, subject to attribution preservation rules for contributed records.

**Fields editable under F9.8:**
- `contributing_offices`
- `contributor_names`
- `ir_contribution`
- `owner_steward`
- `owner_contact`
- `operational_owner`
- `production_owner`
- `attribution_statement`
- `opportunity_source`

**Attribution preservation enforcement (contributed records):**
- For records with `source_contribution_id` non-null, editing `contributing_offices` to remove the original contributing office triggers a curator warning: "Attribution Preservation: The original contributing office must be retained in the contributing offices list for contributed records. Are you sure you want to remove it?"
- Attempting to publish with `attribution_statement` empty on a contributed record fails the publication gate.

**Ownership change audit:**
- Any change to `owner_steward`, `contributing_offices`, or `attribution_statement` generates an `attribution_updated` audit event.

---

### Error States (F9.1–F9.8)

| Scenario | HTTP Status | Error Code | Curator-Facing Message | Notes |
|---|---|---|---|---|
| Unauthorized access to curator area | 401/403 | `UNAUTHORIZED` | "You must be logged in as an authorized curator to access this area." | SEC-01, SEC-02 |
| Concurrent edit conflict | 409 | `VERSION_CONFLICT` | "This record was updated by another user. Reload and reapply changes." | Optimistic concurrency |
| Invalid maturity value | 400 | `INVALID_MATURITY` | "The maturity value is not recognized." | |
| Invalid review status | 400 | `INVALID_REVIEW_STATUS` | "One or more review status values are not recognized." | |
| Invalid artifact URL | 422 | `INVALID_URL` | "Artifact URL must be a valid HTTPS URL." | |
| Publication gate fails | 422 | `PUBLICATION_GATE_FAILED` | "Cannot publish. Missing required fields: [list]" | |
| Attribution removal warning | 422 (soft) | `ATTRIBUTION_REMOVAL_WARNING` | "Attribution preservation warning. See field guidance." | Soft block |

---

### API Surface (F9.1–F9.8)

See `Y1b-api-curator.md` for full schemas.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/curator/dashboard` | Curator | Curator dashboard summary counts |
| GET | `/api/v1/curator/records` | Curator | Record management list (all states) |
| POST | `/api/v1/curator/records` | Curator | Create new record |
| GET | `/api/v1/curator/records/:id` | Curator | Get record in edit view (all fields) |
| PATCH | `/api/v1/curator/records/:id` | Curator | Edit record fields |
| DELETE | `/api/v1/curator/records/:id` | Curator | Soft-delete draft record |
| GET | `/api/v1/curator/records/:id/artifacts` | Curator | List artifacts (including restricted) |
| POST | `/api/v1/curator/records/:id/artifacts` | Curator | Add artifact |
| PATCH | `/api/v1/curator/records/:id/artifacts/:aid` | Curator | Edit artifact |
| DELETE | `/api/v1/curator/records/:id/artifacts/:aid` | Curator | Remove artifact |
| GET | `/api/v1/curator/records/:id/audit` | Curator | View record audit history |

---

### Schema Surface (F9.1–F9.8)

Uses tables `innovation_records`, `artifacts`, `audit_events`. See `Y0a-schema-core.md` and `Y0b-schema-submissions.md §audit_events`.
---

## F09b: Curation and Administration — Lifecycle, Gates, Queues, Settings (F9.9–F9.16)

**PRD Reference:** F9 (F9.9–F9.16) | **Priority:** P0 — Critical

**Description:** This chunk covers the publication lifecycle management, publication gate enforcement, audit history, submission queues, engagement activity review, settings management, and the in-product content model reference. All capabilities require Curator or Admin authentication (SEC-01, SEC-02).

---

### Sub-features Covered Here

- **F9.9** — Publication Lifecycle
- **F9.10** — Publication Gate
- **F9.11** — Audit History
- **F9.12** — Opportunity Submission Queue
- **F9.13** — Contribution Submission Queue
- **F9.14** — Engagement Activity Review
- **F9.15** — Settings Management
- **F9.16** — Content Model Reference

---

### F9.9 — Publication Lifecycle

**Description:** Supports the full governed lifecycle of innovation records: Draft → Submitted for Review → Published → Superseded / Archived / Retired, plus unpublish (Published → Draft).

**Lifecycle transitions and curator actions:**

| From State | Curator Action | To State | Gate Check | Requirements |
|---|---|---|---|---|
| (new) | Create | Draft | No | None; record created empty |
| Draft | Submit for Review | Submitted for Review | Optional pre-check | Curator submits to signal readiness for peer review |
| Submitted for Review | Approve and Publish | Published | **Yes — full gate** | All publication gate fields must be populated |
| Submitted for Review | Return to Draft | Draft | No | Optional curator note |
| Draft | Publish Directly | Published | **Yes — full gate** | All publication gate fields must be populated; bypasses Submitted for Review step |
| Published | Unpublish | Draft | No | Curator confirmation required; audit event generated |
| Published | Supersede | Superseded | No | `supersession_reason` required; `superseded_by_record_id` should be provided if successor exists |
| Published | Archive | Archived | No | `retirement_reason` optional |
| Published | Retire | Retired | No | `retirement_reason` required |
| Superseded | Retire | Retired | No | `retirement_reason` optional |
| Superseded | Re-activate to Draft | Draft | No | Curator confirmation + mandatory audit reason |
| Archived | Retire | Retired | No | |
| Archived | Re-activate to Draft | Draft | No | Curator confirmation + mandatory audit reason |
| Retired | Re-activate to Draft | Draft | No | Curator confirmation + mandatory audit reason; rare operation |

**Every lifecycle transition generates a `publication_state_changed` audit event** (see F9.11).

**Public visibility by state:**
- `published`: visible to all (anonymous and authenticated).
- `superseded`: visible publicly with supersession banner; successor link shown if `superseded_by_record_id` is set.
- `archived`: visible in public search when explicitly requested (user must select "Include Archived" filter); shown with Archived indicator.
- `draft`, `submitted_for_review`: not accessible to public; 404 for anonymous users; visible to Curators in curator interface.
- `retired`: not shown in public views; visible to Curators in curator interface.

---

### F9.10 — Publication Gate

**Description:** The publication gate is a server-enforced validation check that prevents a record from advancing to `published` state when any required field is absent. The gate is checked at every publish attempt — it cannot be bypassed by UI workarounds or direct API calls.

**Gate Implementation:**
- The gate check is server-side only. Client-side validation may mirror it as a UI convenience but cannot be the only enforcement point.
- If any required field fails the gate, the server returns HTTP 422 with `error_code = PUBLICATION_GATE_FAILED` and a list of missing fields.
- The gate does not prevent saving as Draft. Records in Draft state may be incomplete.

**Publication Gate — Required Fields (F9.10):**

The following 15 conditions must all be satisfied for publication to proceed (see F03a §Summary: Publication Gate Fields for details):

| # | Field/Condition | Table | Note |
|---|---|---|---|
| 1 | `title` non-empty (≥5 chars) | `innovation_records` | |
| 2 | `summary` non-empty (≥20 chars) | `innovation_records` | |
| 3 | `problem_statement` non-empty (≥50 chars) | `innovation_records` | |
| 4 | `mission_areas` array has ≥1 non-empty value | `innovation_records` | |
| 5 | `hypothesis_or_objective` non-empty (≥20 chars) | `innovation_records` | |
| 6 | `technology_areas` array has ≥1 non-empty value | `innovation_records` | |
| 7 | `outcome_summary` non-empty (≥50 chars) | `innovation_records` | |
| 8 | `source_basis` non-empty (≥10 chars) | `innovation_records` | |
| 9 | At least one `findings_*` field non-empty | `innovation_records` | |
| 10 | `maturity` is a valid non-null canonical value | `innovation_records` | |
| 11 | `review_statuses` array has ≥1 valid canonical value | `innovation_records` | |
| 12 | `last_reviewed_date` is a valid date, ≤ today | `innovation_records` | |
| 13 | `owner_steward` non-empty (≥3 chars) | `innovation_records` | |
| 14 | `attribution_statement` non-empty (≥10 chars) | `innovation_records` | |
| 15 | `applicable_disclaimer` non-empty (≥10 chars) | `innovation_records` | |

**Additional gate conditions for contributed records:**
- If `source_contribution_id` is non-null: `attribution_statement` must credit the original contributor (curator confirmation if warning is surfaced — not automated check; the curator affirms this is satisfied).

**Warning-only conditions (do not block publication but trigger curator acknowledgment prompt):**
- `maturity = production_validated` with source type indicating a POC-only basis.
- `maturity` is a lower stage than a previous published state (downgrade).
- `title` matches an existing published record's title (uniqueness warning).
- If `maturity` is `Production / Validated Pattern` or `Prototype / Pilot` and `applicable_disclaimer` contains the text `'Experiment / POC'`, the system MUST display a curator-visible warning: "Disclaimer language references POC/Experiment maturity but the record is set to [current maturity]. Please confirm the disclaimer is accurate." This warning applies to all records, not only lessons-learned sources. The warning does not block publication — it is a curator prompt.

---

### F9.11 — Audit History

**Description:** Every material change to content, governance, lifecycle, ownership, or configuration must be recorded in an immutable audit log. The audit log is accessible to authorized Curators and Admins.

**Audit Event Requirements:**

Every audit event must capture:

| Field | Type | Description |
|---|---|---|
| `audit_id` | UUID | Primary key; immutable |
| `event_type` | enum | Type of event (see canonical event types below) |
| `actor_id` | UUID | References the user who performed the action |
| `actor_name` | string | Snapshot of actor's display name at the time of the event |
| `target_type` | enum | The entity type affected: `innovation_record`, `artifact`, `opportunity_submission`, `innovation_contribution`, `engagement_request`, `hub_settings`, `user_role` |
| `target_id` | UUID | ID of the affected entity |
| `target_title` | string | Snapshot of entity title/name at the time of the event |
| `event_data` | jsonb | Changed fields (previous and new values); structure varies by event type |
| `occurred_at` | timestamp | UTC; immutable; set by server |
| `notes` | text | Optional curator note provided at the time of the event |
| `ip_address` | string | Server-captured; not shown to curators in standard view |

**Canonical Audit Event Types:**

| Event Type | Trigger |
|---|---|
| `record_created` | A new innovation record is created |
| `record_updated` | Any field on a record is changed and saved |
| `maturity_changed` | The `maturity` field is changed |
| `review_status_changed` | The `review_statuses` array is changed |
| `publication_state_changed` | The `publication_state` field transitions to any new value |
| `attribution_updated` | `owner_steward`, `contributing_offices`, `attribution_statement`, or `contributor_names` changes |
| `artifact_added` | An artifact link is added to a record |
| `artifact_updated` | An artifact link is edited |
| `artifact_removed` | An artifact link is removed from a record |
| `submission_dispositioned` | An opportunity submission or contribution receives a disposition |
| `record_created_from_contribution` | A draft record is initiated from an innovation contribution |
| `engagement_status_updated` | An engagement request's follow-up status is updated |
| `settings_changed` | A hub setting is changed (routing address, taxonomy, etc.) |
| `user_role_changed` | A user's role is assigned or changed (if role management is in scope) |

**Audit Log Access:**
- Curators may view the audit history for any specific record (`/curator/records/:id/audit`).
- Admins may view the full system-wide audit log (`/curator/audit`).
- The audit log is read-only; no curator may edit or delete audit events.
- Audit events are retained for the operational lifetime of the system (no TTL in MVP).

---

### F9.12 — Opportunity Submission Queue

**Description:** Authorized I&R curators may review and disposition opportunity submissions received through the F6 public form.

**Queue display:**

| Column | Description |
|---|---|
| Reference Number | Submission ID (short reference) |
| Submission Date | Date received |
| Request Type | Canonical request type label |
| Problem Title | Submitter's stated title |
| Submitting Office | Office name |
| Submitter Name | Submitter's name |
| Status | Current disposition status |

**Queue filtering:**
- Status: Pending, Accepted, Declined, Needs More Info, All
- Date range
- Request type
- Submitting office

**Curator actions per submission:**
- View full submission detail (all fields).
- Record disposition (see Disposition Values from F06 — `pending`, `accepted`, `declined`, `needs_more_information`, `duplicate`).
- Add internal curator notes (not visible to submitter; stored in `curator_notes` field on the submission).
- Generate an audit event on any disposition change.

**Disposition record-keeping:**
- Every disposition change generates a `submission_dispositioned` audit event.
- `dispositioned_by` and `dispositioned_at` are set when disposition is recorded.
- `curator_notes` field (text; max 2,000 chars) for internal use only.

---

### F9.13 — Contribution Submission Queue

**Description:** Authorized curators may review and disposition innovation contributions received through the F7 public form, and may initiate record creation from an accepted contribution.

**Queue display:** Same column structure as F9.12 opportunity queue, plus:

| Additional Column | Description |
|---|---|
| Contributing Office | Office that did the work |
| Maturity (Contributor's Assessment) | Contributor's stated maturity |
| Collaboration Preference | Contributor's stated preference |

**Curator actions per contribution:**
- View full contribution detail.
- Record disposition (see F07 §Disposition Values: `pending`, `accepted_for_curation`, `declined`, `needs_more_information`, `duplicate`, `curated`).
- Add internal curator notes.
- **Create Record from Contribution** (when `accepted_for_curation`): initiates a new Draft Innovation Record pre-populated from the contribution fields. See F9.3 §Process step 3.
- Every disposition change generates a `submission_dispositioned` audit event.

**Attribution preservation at record creation from contribution:**
- When creating a record from a contribution, the system pre-populates:
  - `contributing_offices` with the contribution's `contributing_office`.
  - `contributor_names` with the contribution's `contributor_names`.
  - `owner_steward` with the contribution's `current_owner`.
  - `source_contribution_id` with the contribution's ID.
- These pre-populated attribution fields must be present in the form when the curator first opens the new record; the curator may add to them but must not empty the originating attribution fields before publishing (see F07 §Attribution Preservation Rules).

---

### F9.14 — Engagement Activity Review

**Description:** Authorized curators may review engagement requests received through F8 and record a follow-up status on each.

**Queue display:**

| Column | Description |
|---|---|
| Reference Number | Engagement request ID |
| Received Date | `submitted_at` date |
| Request Type | Canonical type label |
| Originating Record | Title + link (if record-level; "General" if not) |
| Requester Name | |
| Requester Office | |
| Requester Email | |
| Email Routing Initiated | Boolean indicator |
| Follow-up Status | Current status |

**Queue filtering:**
- Follow-up status: All, Received, In Progress, Completed, No Action Required
- Date range
- Request type
- Originating record

**Curator actions:**
- View full engagement request.
- Record follow-up status:

| Status Value | Label | Description |
|---|---|---|
| `received` | Received | Default on submission; not yet reviewed |
| `in_progress` | In Progress | Curator is actively following up |
| `completed` | Completed | Follow-up is complete; outcome noted |
| `no_action_required` | No Action Required | Request received; no follow-up needed |

- Add internal curator notes (max 2,000 chars; not visible to requester).
- Every follow-up status change generates an `engagement_status_updated` audit event.

---

### F9.15 — Settings Management

**Description:** Authorized Admins may manage approved configurable Hub settings without code change or redeployment.

**Configurable settings — MVP scope:**

| Setting Key | Description | Type | Validation | Default |
|---|---|---|---|---|
| `engagement_routing_address` | Email address to which engagement requests are routed | string | Valid email format; must be non-empty | `AOml_TSO_IRB_Team@ao.uscourts.gov` |
| `engagement_routing_display_name` | Display name shown in CTA context ("Contact [Name]") | string | Max 100 chars; min 3 chars | `TSIO Innovation & Research` |
| `submission_rate_limit_per_hour` | Max submissions per IP per hour (F6, F7, F8) | integer | Min 1; max 100 | `5` for F6/F7; `10` for F8 |
| `hub_display_name` | Display name of the Hub in headings and titles | string | Max 100 chars | `TSIO Innovation Hub` |
| `default_applicable_disclaimer` | Default disclaimer text offered in the record editor | text | Max 2,000 chars | [Curator-configured; initial value provided in setup] |
| `taxonomy_mission_areas` | Ordered list of Mission Area taxonomy values | string[] | Min 1 value; each max 100 chars | Initial list configured during discovery |
| `taxonomy_technology_areas` | Ordered list of Technology Area taxonomy values | string[] | Min 1 value; each max 100 chars | Initial list configured during discovery |
| `taxonomy_problem_types` | Ordered list of Problem Type taxonomy values | string[] | Min 1 value; each max 100 chars | Initial list configured during discovery |

**Process:**
1. Admin navigates to Settings in the curator interface.
2. Admin views current value of each configurable setting.
3. Admin edits a setting value and saves.
4. System validates the new value against the field's validation rules.
5. System persists the new value to `hub_settings` table.
6. System generates a `settings_changed` audit event with: setting key, previous value, new value, actor, timestamp.
7. The new value is effective immediately on the next request; no application restart or redeployment required.

**Routing address change:**
- Changing `engagement_routing_address` must trigger an additional confirmation: "Changing the routing address will affect all future engagement requests. Current value: [address]. New value: [new address]. Confirm?"
- Every routing address change generates a `settings_changed` audit event (SEC-03).
- The `routing_address_at_submission` field on historical engagement requests is not retroactively changed.

---

### F9.16 — Content Model Reference

**Description:** In-product reference for authorized curators providing definitions of all controlled vocabularies, maturity stages, review statuses, lifecycle states, publication gate requirements, and applicable disclaimer templates — so governance is applied consistently across all curators.

**Required content:**
- Full maturity taxonomy with stage descriptions (from header §Maturity Taxonomy).
- Full review status taxonomy with value descriptions (from header §Review Status Taxonomy).
- Full publication state taxonomy with descriptions.
- Publication gate requirements (all 15 conditions listed with field names and descriptions).
- Engagement indicator definitions (all values from F01 §Engagement Indicator).
- CTA action type definitions (all values from F03b §Group 9).
- Applicable disclaimer templates by maturity stage (examples that curators may use or adapt):
  - For `idea` / `evaluated_idea`: "This record describes an early-stage concept. No validation or evidence has been produced. This is not a recommendation for investment or adoption."
  - For `experiment_poc`: "This record summarizes a proof-of-concept effort. Findings are exploratory. This work is not production-ready and does not constitute approval for deployment."
  - For `prototype_pilot`: "This record describes a capability tested in a limited context. Results may not generalize to all environments. Additional review is required before production adoption."
  - For `production_validated`: "This record presents a deployed or reviewed pattern. Validation for reuse does not eliminate local review requirements for your environment."
  - For `archived_retired`: "This record is retained for institutional learning. The work described is no longer active or recommended. Do not use as a current reference pattern."

**Access:** Read-only reference for Curators; editable by Admin (for disclaimer templates and custom additions).

**Implementation:** F9.16 may be implemented as a static or CMS-managed in-product reference page in the curator interface. The disclaimer templates in the settings (F9.15 `default_applicable_disclaimer`) draw from the same content but are editable per setting.

---

### Error States (F9.9–F9.16)

| Scenario | HTTP Status | Error Code | Curator-Facing Message | Notes |
|---|---|---|---|---|
| Publication gate fails | 422 | `PUBLICATION_GATE_FAILED` | "Cannot publish. Missing: [field list]" | Server-enforced; not bypassable |
| Supersede without reason | 422 | `SUPERSESSION_REASON_REQUIRED` | "Supersession reason is required." | |
| Retire without reason | 422 | `RETIREMENT_REASON_REQUIRED` | "Retirement reason is required." | |
| Re-activate without audit note | 422 | `REACTIVATION_NOTE_REQUIRED` | "A note explaining the re-activation is required." | |
| Invalid routing address format | 422 | `INVALID_EMAIL` | "The routing address must be a valid email." | F9.15 |
| Audit log access by non-curator | 403 | `FORBIDDEN` | "You do not have permission to view audit history." | SEC-01 |
| Disposition on unknown submission | 404 | `NOT_FOUND` | "Submission not found." | |

---

### API Surface (F9.9–F9.16)

See `Y1b-api-curator.md` for full schemas.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/curator/records/:id/publish` | Curator | Publish (gate enforced) |
| POST | `/api/v1/curator/records/:id/unpublish` | Curator | Unpublish to draft |
| POST | `/api/v1/curator/records/:id/supersede` | Curator | Supersede record |
| POST | `/api/v1/curator/records/:id/archive` | Curator | Archive record |
| POST | `/api/v1/curator/records/:id/retire` | Curator | Retire record |
| POST | `/api/v1/curator/records/:id/reactivate` | Curator | Re-activate to draft |
| GET | `/api/v1/curator/records/:id/audit` | Curator | Record audit history |
| GET | `/api/v1/curator/audit` | Admin | System-wide audit log |
| GET | `/api/v1/curator/submissions/opportunity` | Curator | Opportunity queue list |
| PATCH | `/api/v1/curator/submissions/opportunity/:id/disposition` | Curator | Disposition submission |
| GET | `/api/v1/curator/submissions/contribution` | Curator | Contribution queue list |
| PATCH | `/api/v1/curator/submissions/contribution/:id/disposition` | Curator | Disposition contribution |
| POST | `/api/v1/curator/submissions/contribution/:id/create-record` | Curator | Create record from contribution |
| GET | `/api/v1/curator/engagement` | Curator | Engagement activity list |
| PATCH | `/api/v1/curator/engagement/:id/status` | Curator | Update follow-up status |
| GET | `/api/v1/curator/settings` | Admin | View all settings |
| PUT | `/api/v1/curator/settings/:key` | Admin | Update a single setting |
| GET | `/api/v1/curator/reference` | Curator | Content model reference |

---

### Schema Surface (F9.9–F9.16)

- `innovation_records` — publication state fields and lifecycle fields. See `Y0a-schema-core.md`.
- `audit_events` — full audit log. See `Y0b-schema-submissions.md §audit_events`.
- `opportunity_submissions` — submission queue. See `Y0b-schema-submissions.md §opportunity_submissions`.
- `innovation_contributions` — contribution queue. See `Y0b-schema-submissions.md §innovation_contributions`.
- `engagement_requests` — engagement activity. See `Y0b-schema-submissions.md §engagement_requests`.
- `hub_settings` — configurable settings. See `Y0b-schema-submissions.md §hub_settings`.
---

## Y0a: Database Schema — Core Entities

**Scope:** Logical schema for the primary domain entities: `innovation_records`, `artifacts`, and `record_next_actions`. Physical implementation details (indexes, partitioning, specific database engine constraints) belong in the Technical Architecture specification. Foreign key notation uses `REFERENCES table(column)`.

---

### Table: `innovation_records`

Central entity. One row per innovation effort represented in the Hub.

```sql
CREATE TABLE innovation_records (
  -- Identity and system fields (Group 0)
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        VARCHAR(128) NOT NULL UNIQUE,
  publication_state           VARCHAR(32) NOT NULL DEFAULT 'draft'
                                CHECK (publication_state IN (
                                  'draft', 'submitted_for_review', 'published',
                                  'superseded', 'archived', 'retired'
                                )),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by                  UUID NOT NULL,              -- FK to users table (identity system TBD)
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by                  UUID NOT NULL,
  published_at                TIMESTAMPTZ,               -- null until first publication
  version                     INTEGER NOT NULL DEFAULT 1, -- optimistic concurrency

  -- F3.1: Problem and Context
  title                       VARCHAR(200) NOT NULL DEFAULT '',
  summary                     VARCHAR(500) NOT NULL DEFAULT '',
  problem_statement           TEXT NOT NULL DEFAULT '',
  affected_users              TEXT,
  current_workflow            TEXT,
  why_experimentation         TEXT,
  mission_areas               TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary array
  problem_type_tags           TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary array

  -- F3.2: What Was Explored
  hypothesis_or_objective     TEXT NOT NULL DEFAULT '',
  scope_description           TEXT,
  technology_areas            TEXT[] NOT NULL DEFAULT '{}',  -- controlled vocabulary array
  technologies_used           TEXT,
  methods_used                TEXT,
  tags                        TEXT[] NOT NULL DEFAULT '{}',  -- free-form keyword array

  -- F3.3: Outcome and Evidence
  outcome_summary             TEXT NOT NULL DEFAULT '',
  what_worked                 TEXT,
  what_did_not_work           TEXT,
  uncertainty_reduced         TEXT,
  decision_enabled            TEXT,
  evidence_summary            TEXT,
  source_basis                VARCHAR(500) NOT NULL DEFAULT '',

  -- F3.4: Key Findings
  findings_architectural      TEXT,
  findings_security           TEXT,
  findings_cloud_platform     TEXT,
  findings_performance        TEXT,
  findings_ux                 TEXT,
  findings_data               TEXT,
  findings_testing            TEXT,
  findings_operational        TEXT,
  findings_cost               TEXT,
  findings_scalability        TEXT,
  findings_other              TEXT,

  -- F3.5: Maturity and Readiness
  maturity                    VARCHAR(32)
                                CHECK (maturity IN (
                                  'idea', 'evaluated_idea', 'experiment_poc',
                                  'prototype_pilot', 'production_validated',
                                  'archived_retired'
                                )),
  review_statuses             TEXT[] NOT NULL DEFAULT '{}',  -- multi-value; controlled vocab array
  ready_for                   TEXT,
  not_ready_for               TEXT,
  next_stage_requirements     TEXT,
  last_reviewed_date          DATE,
  next_review_date            DATE,
  maturity_change_reason      VARCHAR(500),

  -- F3.6: Reuse Guidance
  reuse_potential             VARCHAR(16)
                                CHECK (reuse_potential IN (
                                  'high', 'moderate', 'low', 'not_assessed'
                                )),
  what_can_be_reused          TEXT,
  what_should_be_adapted      TEXT,
  what_not_to_copy            TEXT,
  environment_assumptions     TEXT,
  required_skills             TEXT,
  required_services           TEXT,
  production_readiness_gaps   TEXT,
  engagement_indicator        VARCHAR(32) NOT NULL DEFAULT 'none'
                                CHECK (engagement_indicator IN (
                                  'demo_available', 'seeking_adoption_partner',
                                  'technical_playbook_available', 'reference_pattern_available',
                                  'monitoring_only', 'archived', 'none'
                                )),

  -- F3.7: Ownership and Attribution
  opportunity_source          VARCHAR(500),
  contributing_offices        TEXT[] NOT NULL DEFAULT '{}',
  contributor_names           TEXT[] NOT NULL DEFAULT '{}',
  ir_contribution             TEXT,
  owner_steward               VARCHAR(200) NOT NULL DEFAULT '',
  owner_contact               VARCHAR(254),
  operational_owner           VARCHAR(200),
  production_owner            VARCHAR(200),
  attribution_statement       TEXT NOT NULL DEFAULT '',
  source_contribution_id      UUID REFERENCES innovation_contributions(id),  -- set if created from contribution

  -- F3.8b: Governance and Trust
  applicable_disclaimer       TEXT NOT NULL DEFAULT '',
  superseded_by_record_id     UUID REFERENCES innovation_records(id),        -- set when superseded
  supersession_reason         TEXT,
  retirement_reason           TEXT,

  -- F3.9: Next Action prose
  next_action_description     TEXT,

  CONSTRAINT chk_supersede_requires_reason
    CHECK (
      (publication_state <> 'superseded') OR
      (supersession_reason IS NOT NULL AND supersession_reason <> '')
    ),
  CONSTRAINT chk_retire_requires_reason
    CHECK (
      (publication_state NOT IN ('retired')) OR
      (retirement_reason IS NOT NULL AND retirement_reason <> '')
    ),
  CONSTRAINT chk_last_reviewed_not_future
    CHECK (last_reviewed_date IS NULL OR last_reviewed_date <= CURRENT_DATE),
  CONSTRAINT chk_next_review_after_last
    CHECK (
      next_review_date IS NULL OR last_reviewed_date IS NULL OR
      next_review_date > last_reviewed_date
    )
);

CREATE INDEX idx_ir_publication_state ON innovation_records(publication_state);
CREATE INDEX idx_ir_maturity ON innovation_records(maturity);
CREATE INDEX idx_ir_last_reviewed ON innovation_records(last_reviewed_date);
CREATE INDEX idx_ir_updated_at ON innovation_records(updated_at DESC);
CREATE INDEX idx_ir_slug ON innovation_records(slug);
CREATE INDEX idx_ir_source_contribution ON innovation_records(source_contribution_id)
  WHERE source_contribution_id IS NOT NULL;
```

**Full-text search index (application-level or DB-native):**

The following fields must be included in the search index (see F02 §Search Index for weights):
`title`, `summary`, `problem_statement`, `hypothesis_or_objective`, `outcome_summary`, `key_findings_*` (all findings fields), `tags`, `mission_areas`, `technology_areas`, `reuse_guidance fields`, `production_readiness_gaps`, `next_action_description`, `contributing_offices`, `contributor_names`.

---

### Table: `artifacts`

Child table. Each row is one authoritative artifact link associated with one innovation record.

```sql
CREATE TABLE artifacts (
  artifact_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id         UUID NOT NULL REFERENCES innovation_records(id) ON DELETE CASCADE,
  artifact_type     VARCHAR(32) NOT NULL
                      CHECK (artifact_type IN (
                        'lessons_learned', 'poc_report', 'decision_brief',
                        'architecture_diagram', 'demo_video', 'repository',
                        'infrastructure_definition', 'test_results',
                        'security_findings', 'technical_playbook', 'other'
                      )),
  name              VARCHAR(200) NOT NULL,
  url               VARCHAR(2048) NOT NULL,
  access_notes      VARCHAR(500),
  is_restricted     BOOLEAN NOT NULL DEFAULT false,
  display_order     INTEGER NOT NULL DEFAULT 0,
  added_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  added_by          UUID NOT NULL,  -- FK to users

  CONSTRAINT chk_artifact_url_https
    CHECK (url LIKE 'https://%' OR url LIKE 'http://%')
    -- Note: HTTPS preferred; HTTP allowed for intranet/internal URLs
);

CREATE INDEX idx_artifacts_record ON artifacts(record_id);
CREATE INDEX idx_artifacts_restricted ON artifacts(record_id, is_restricted);
```

---

### Table: `record_next_actions`

Child table. Each row is one configured CTA action for an innovation record.

```sql
CREATE TABLE record_next_actions (
  action_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id         UUID NOT NULL REFERENCES innovation_records(id) ON DELETE CASCADE,
  action_type       VARCHAR(32) NOT NULL
                      CHECK (action_type IN (
                        'request_demo', 'discuss_use_case', 'explore_adoption',
                        'request_technical_guidance', 'share_related_work', 'contact_ir'
                      )),
  custom_label      VARCHAR(100),
  is_enabled        BOOLEAN NOT NULL DEFAULT true,
  display_order     INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT chk_max_actions_per_record
    -- Enforced at application layer: max 6 actions per record_id
    CHECK (true)
);

CREATE INDEX idx_rna_record ON record_next_actions(record_id);
CREATE INDEX idx_rna_enabled ON record_next_actions(record_id, is_enabled);
```

---

### TypeScript Interfaces — Core Entities

```typescript
// Canonical enum types
type MaturityValue =
  | 'idea' | 'evaluated_idea' | 'experiment_poc'
  | 'prototype_pilot' | 'production_validated' | 'archived_retired';

type ReviewStatusValue =
  | 'submitted' | 'curated' | 'technically_reviewed'
  | 'security_reviewed' | 'policy_reviewed' | 'validated_for_reuse'
  | 'superseded' | 'retired';

type PublicationState =
  | 'draft' | 'submitted_for_review' | 'published'
  | 'superseded' | 'archived' | 'retired';

type EngagementIndicator =
  | 'demo_available' | 'seeking_adoption_partner'
  | 'technical_playbook_available' | 'reference_pattern_available'
  | 'monitoring_only' | 'archived' | 'none';

type ArtifactType =
  | 'lessons_learned' | 'poc_report' | 'decision_brief'
  | 'architecture_diagram' | 'demo_video' | 'repository'
  | 'infrastructure_definition' | 'test_results'
  | 'security_findings' | 'technical_playbook' | 'other';

type NextActionType =
  | 'request_demo' | 'discuss_use_case' | 'explore_adoption'
  | 'request_technical_guidance' | 'share_related_work' | 'contact_ir';

type ReusePotential = 'high' | 'moderate' | 'low' | 'not_assessed';

// Innovation Record (full — curator view)
interface InnovationRecord {
  id: string;                        // UUID
  slug: string;
  publicationState: PublicationState;
  createdAt: string;                 // ISO 8601
  createdBy: string;                 // UUID
  updatedAt: string;
  updatedBy: string;
  publishedAt: string | null;
  version: number;

  // F3.1
  title: string;
  summary: string;
  problemStatement: string;
  affectedUsers?: string;
  currentWorkflow?: string;
  whyExperimentation?: string;
  missionAreas: string[];
  problemTypeTags: string[];

  // F3.2
  hypothesisOrObjective: string;
  scopeDescription?: string;
  technologyAreas: string[];
  technologiesUsed?: string;
  methodsUsed?: string;
  tags: string[];

  // F3.3
  outcomeSummary: string;
  whatWorked?: string;
  whatDidNotWork?: string;
  uncertaintyReduced?: string;
  decisionEnabled?: string;
  evidenceSummary?: string;
  sourceBasis: string;

  // F3.4
  findingsArchitectural?: string;
  findingsSecurity?: string;
  findingsCloudPlatform?: string;
  findingsPerformance?: string;
  findingsUx?: string;
  findingsData?: string;
  findingsTesting?: string;
  findingsOperational?: string;
  findingsCost?: string;
  findingsScalability?: string;
  findingsOther?: string;

  // F3.5
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  readyFor?: string;
  notReadyFor?: string;
  nextStageRequirements?: string;
  lastReviewedDate: string | null;   // ISO date YYYY-MM-DD
  nextReviewDate?: string | null;
  maturityChangeReason?: string;

  // F3.6
  reusePotential: ReusePotential;
  whatCanBeReused?: string;
  whatShouldBeAdapted?: string;
  whatNotToCopy?: string;
  environmentAssumptions?: string;
  requiredSkills?: string;
  requiredServices?: string;
  productionReadinessGaps?: string;
  engagementIndicator: EngagementIndicator;

  // F3.7
  opportunitySource?: string;
  contributingOffices: string[];
  contributorNames: string[];
  irContribution?: string;
  ownerSteward: string;
  ownerContact?: string;
  operationalOwner?: string;
  productionOwner?: string;
  attributionStatement: string;
  sourceContributionId?: string | null; // UUID ref

  // F3.8b
  applicableDisclaimer: string;
  supersededByRecordId?: string | null;
  supersessionReason?: string;
  retirementReason?: string;

  // F3.9
  nextActionDescription?: string;
}

// Innovation Record — public catalog card
interface CatalogCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  technologyAreas: string[];
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  contributingOffices: string[];
  engagementIndicator: EngagementIndicator;
  lastReviewedDate: string | null;
  publicationState: PublicationState;
}

// Artifact (public view — restricted artifacts omit url)
interface PublicArtifact {
  artifactId: string;
  artifactType: ArtifactType;
  name: string;
  url?: string;          // omitted when is_restricted = true for non-curators
  accessNotes?: string;
  isRestricted: boolean;
  displayOrder: number;
}

// Next Action CTA
interface RecordNextAction {
  actionId: string;
  actionType: NextActionType;
  customLabel?: string;
  isEnabled: boolean;
  displayOrder: number;
  defaultLabel: string;  // computed from actionType
}
```
---

## Y0b: Database Schema — Submissions, Engagement, Audit, Settings

**Scope:** Logical schema for: `opportunity_submissions`, `innovation_contributions`, `engagement_requests`, `audit_events`, and `hub_settings`. Physical implementation details belong in the Technical Architecture specification.

---

### Table: `opportunity_submissions`

One row per F6 Opportunity Submission received.

```sql
CREATE TABLE opportunity_submissions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type                VARCHAR(32) NOT NULL
                                CHECK (request_type IN (
                                  'current_mission_problem', 'emerging_tech_question',
                                  'request_for_research', 'potential_poc',
                                  'request_for_demo', 'collaboration_opportunity',
                                  'share_existing_work', 'other'
                                )),
  problem_title               VARCHAR(200) NOT NULL,
  problem_description         TEXT NOT NULL,
  affected_users              TEXT NOT NULL,
  current_workflow            TEXT,
  impact                      TEXT NOT NULL,
  desired_outcome             TEXT,
  known_constraints           TEXT,
  related_work_attempted      TEXT,
  submitting_office           VARCHAR(200) NOT NULL,
  submitter_name              VARCHAR(200) NOT NULL,
  submitter_email             VARCHAR(254) NOT NULL,
  discovery_participants      VARCHAR(500),
  additional_context          TEXT,
  consent_to_contact          BOOLEAN NOT NULL,
  non_acceptance_acknowledged BOOLEAN NOT NULL,
  submission_date             TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip               INET,                       -- server-captured; internal only

  -- Disposition fields
  status                      VARCHAR(32) NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'accepted', 'declined',
                                  'needs_more_information', 'duplicate'
                                )),
  dispositioned_at            TIMESTAMPTZ,
  dispositioned_by            UUID,                       -- FK to users (curator who dispositioned)
  curator_notes               TEXT,                       -- internal only; not shown to submitter

  CONSTRAINT chk_opportunity_consents
    CHECK (consent_to_contact = true AND non_acceptance_acknowledged = true)
);

CREATE INDEX idx_opp_status ON opportunity_submissions(status);
CREATE INDEX idx_opp_submission_date ON opportunity_submissions(submission_date DESC);
CREATE INDEX idx_opp_submitting_office ON opportunity_submissions(submitting_office);
```

---

### Table: `innovation_contributions`

One row per F7 Innovation Contribution received.

```sql
CREATE TABLE innovation_contributions (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_title          VARCHAR(200) NOT NULL,
  problem_addressed           TEXT NOT NULL,
  work_description            TEXT NOT NULL,
  contributing_office         VARCHAR(200) NOT NULL,
  contributor_names           TEXT NOT NULL,
  current_maturity            VARCHAR(32) NOT NULL
                                CHECK (current_maturity IN (
                                  'idea', 'evaluated_idea', 'experiment_poc',
                                  'prototype_pilot', 'production_validated',
                                  'archived_retired'
                                )),
  current_owner               VARCHAR(200) NOT NULL,
  owner_contact_email         VARCHAR(254) NOT NULL,
  artifact_links              TEXT,
  known_limitations           TEXT,
  collaboration_preference    VARCHAR(32) NOT NULL
                                CHECK (collaboration_preference IN (
                                  'open_for_reuse', 'seeking_collaborator',
                                  'informational_only', 'seeking_adopter', 'discuss_with_ir'
                                )),
  additional_context          TEXT,
  submitter_name              VARCHAR(200) NOT NULL,
  submitter_email             VARCHAR(254) NOT NULL,
  non_endorsement_acknowledged BOOLEAN NOT NULL,
  consent_to_contact          BOOLEAN NOT NULL,
  submission_date             TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip               INET,

  -- Disposition fields
  status                      VARCHAR(32) NOT NULL DEFAULT 'pending'
                                CHECK (status IN (
                                  'pending', 'accepted_for_curation', 'declined',
                                  'needs_more_information', 'duplicate', 'curated'
                                )),
  dispositioned_at            TIMESTAMPTZ,
  dispositioned_by            UUID,
  curator_notes               TEXT,

  -- Link to created record (set when a record is created from this contribution)
  created_record_id           UUID REFERENCES innovation_records(id),

  CONSTRAINT chk_contribution_consents
    CHECK (non_endorsement_acknowledged = true AND consent_to_contact = true)
);

CREATE INDEX idx_contrib_status ON innovation_contributions(status);
CREATE INDEX idx_contrib_submission_date ON innovation_contributions(submission_date DESC);
CREATE INDEX idx_contrib_office ON innovation_contributions(contributing_office);
CREATE INDEX idx_contrib_created_record ON innovation_contributions(created_record_id)
  WHERE created_record_id IS NOT NULL;
```

---

### Table: `engagement_requests`

One row per F8 Engagement Request submitted.

```sql
CREATE TABLE engagement_requests (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type                VARCHAR(32) NOT NULL
                                CHECK (request_type IN (
                                  'request_demo', 'discuss_use_case', 'explore_adoption',
                                  'request_technical_guidance', 'share_related_work', 'contact_ir'
                                )),
  originating_record_id       UUID REFERENCES innovation_records(id),  -- null for general CTAs
  originating_record_title    VARCHAR(200),                             -- snapshot at submission time
  requester_name              VARCHAR(200) NOT NULL,
  requester_office            VARCHAR(200) NOT NULL,
  requester_email             VARCHAR(254) NOT NULL,
  need_description            TEXT NOT NULL,
  desired_next_step           TEXT,
  preferred_contact_method    VARCHAR(16) DEFAULT 'email'
                                CHECK (preferred_contact_method IN ('email', 'phone', 'no_preference')),
  consent_to_contact          BOOLEAN NOT NULL,
  submitted_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  submission_ip               INET,
  routing_address_at_submission VARCHAR(254) NOT NULL,   -- snapshot of routing address at submission time
  email_routing_initiated     BOOLEAN NOT NULL DEFAULT false,

  -- Follow-up tracking
  follow_up_status            VARCHAR(32) NOT NULL DEFAULT 'received'
                                CHECK (follow_up_status IN (
                                  'received', 'in_progress', 'completed', 'no_action_required'
                                )),
  follow_up_updated_at        TIMESTAMPTZ,
  follow_up_updated_by        UUID,
  curator_notes               TEXT,

  CONSTRAINT chk_engagement_consent
    CHECK (consent_to_contact = true)
);

CREATE INDEX idx_eng_follow_up_status ON engagement_requests(follow_up_status);
CREATE INDEX idx_eng_submitted_at ON engagement_requests(submitted_at DESC);
CREATE INDEX idx_eng_originating_record ON engagement_requests(originating_record_id)
  WHERE originating_record_id IS NOT NULL;
CREATE INDEX idx_eng_request_type ON engagement_requests(request_type);
```

---

### Table: `audit_events`

Immutable log of all material changes. Rows must never be deleted or updated.

```sql
CREATE TABLE audit_events (
  audit_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type        VARCHAR(64) NOT NULL
                      CHECK (event_type IN (
                        'record_created', 'record_updated', 'maturity_changed',
                        'review_status_changed', 'publication_state_changed',
                        'attribution_updated', 'artifact_added', 'artifact_updated',
                        'artifact_removed', 'submission_dispositioned',
                        'record_created_from_contribution', 'engagement_status_updated',
                        'settings_changed', 'user_role_changed'
                      )),
  actor_id          UUID NOT NULL,             -- FK to users
  actor_name        VARCHAR(200) NOT NULL,     -- snapshot
  target_type       VARCHAR(32) NOT NULL
                      CHECK (target_type IN (
                        'innovation_record', 'artifact', 'opportunity_submission',
                        'innovation_contribution', 'engagement_request',
                        'hub_settings', 'user_role'
                      )),
  target_id         UUID NOT NULL,
  target_title      VARCHAR(200),              -- snapshot of name/title at event time
  event_data        JSONB NOT NULL DEFAULT '{}', -- changed fields with before/after values
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes             TEXT,
  ip_address        INET                       -- server-captured; restricted view

  -- No update or delete allowed on this table
  -- Enforce via DB role permissions: revoke UPDATE, DELETE from app role
);

CREATE INDEX idx_audit_target ON audit_events(target_type, target_id);
CREATE INDEX idx_audit_occurred_at ON audit_events(occurred_at DESC);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_event_type ON audit_events(event_type);
```

**Business rules:**
- Application DB role must have INSERT-only on `audit_events`. UPDATE and DELETE must be revoked.
- No application code path may update or delete audit events.
- `event_data` JSONB structure per event type (abbreviated examples):

```jsonb
-- record_updated
{
  "changed_fields": {
    "summary": { "before": "old text", "after": "new text" },
    "tags": { "before": ["a"], "after": ["a", "b"] }
  }
}

-- maturity_changed
{
  "before": "experiment_poc",
  "after": "prototype_pilot",
  "reason": "Completed limited pilot with three courts"
}

-- review_status_changed
{
  "before": ["submitted", "technically_reviewed"],
  "after": ["submitted", "technically_reviewed", "security_reviewed"]
}

-- publication_state_changed
{
  "before": "draft",
  "after": "published",
  "gate_check_passed": true
}

-- settings_changed
{
  "setting_key": "engagement_routing_address",
  "before": "old@example.gov",
  "after": "new@example.gov"
}
```

---

### Table: `hub_settings`

Key-value store for configurable Hub settings managed through F9.15.

```sql
CREATE TABLE hub_settings (
  setting_key       VARCHAR(100) PRIMARY KEY,
  setting_value     TEXT NOT NULL,
  setting_type      VARCHAR(16) NOT NULL
                      CHECK (setting_type IN ('string', 'integer', 'boolean', 'json')),
  description       TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by        UUID                               -- FK to users (admin who changed it)
);

-- Seed data (initial values)
INSERT INTO hub_settings (setting_key, setting_value, setting_type, description) VALUES
  ('engagement_routing_address',  'AOml_TSO_IRB_Team@ao.uscourts.gov', 'string',  'Email address for engagement routing'),
  ('engagement_routing_display_name', 'TSIO Innovation & Research',    'string',  'Display name for routing destination'),
  ('submission_rate_limit_per_hour',  '5',                              'integer', 'Max submissions (F6/F7) per IP per hour'),
  ('engagement_rate_limit_per_hour',  '10',                             'integer', 'Max engagement requests (F8) per IP per hour'),
  ('hub_display_name',            'TSIO Innovation Hub',                'string',  'Hub display name in headings'),
  ('default_applicable_disclaimer', '',                                 'string',  'Default disclaimer template for curators'),
  ('taxonomy_mission_areas',      '[]',                                 'json',    'Ordered mission area taxonomy values'),
  ('taxonomy_technology_areas',   '[]',                                 'json',    'Ordered technology area taxonomy values'),
  ('taxonomy_problem_types',      '[]',                                 'json',    'Ordered problem type taxonomy values');
```

---

### TypeScript Interfaces — Submissions, Engagement, Audit

```typescript
type OpportunityStatus = 'pending' | 'accepted' | 'declined' | 'needs_more_information' | 'duplicate';
type ContributionStatus = 'pending' | 'accepted_for_curation' | 'declined' | 'needs_more_information' | 'duplicate' | 'curated';
type EngagementFollowUpStatus = 'received' | 'in_progress' | 'completed' | 'no_action_required';

type OpportunityRequestType =
  | 'current_mission_problem' | 'emerging_tech_question' | 'request_for_research'
  | 'potential_poc' | 'request_for_demo' | 'collaboration_opportunity'
  | 'share_existing_work' | 'other';

type EngagementRequestType =
  | 'request_demo' | 'discuss_use_case' | 'explore_adoption'
  | 'request_technical_guidance' | 'share_related_work' | 'contact_ir';

type CollaborationPreference =
  | 'open_for_reuse' | 'seeking_collaborator' | 'informational_only'
  | 'seeking_adopter' | 'discuss_with_ir';

type AuditEventType =
  | 'record_created' | 'record_updated' | 'maturity_changed'
  | 'review_status_changed' | 'publication_state_changed'
  | 'attribution_updated' | 'artifact_added' | 'artifact_updated'
  | 'artifact_removed' | 'submission_dispositioned'
  | 'record_created_from_contribution' | 'engagement_status_updated'
  | 'settings_changed' | 'user_role_changed';

interface OpportunitySubmission {
  id: string;
  requestType: OpportunityRequestType;
  problemTitle: string;
  problemDescription: string;
  affectedUsers: string;
  currentWorkflow?: string;
  impact: string;
  desiredOutcome?: string;
  knownConstraints?: string;
  relatedWorkAttempted?: string;
  submittingOffice: string;
  submitterName: string;
  submitterEmail: string;
  discoveryParticipants?: string;
  additionalContext?: string;
  submissionDate: string;
  status: OpportunityStatus;
  dispositionedAt?: string;
  dispositionedBy?: string;
  curatorNotes?: string;
}

interface InnovationContribution {
  id: string;
  contributionTitle: string;
  problemAddressed: string;
  workDescription: string;
  contributingOffice: string;
  contributorNames: string;
  currentMaturity: MaturityValue;
  currentOwner: string;
  ownerContactEmail: string;
  artifactLinks?: string;
  knownLimitations?: string;
  collaborationPreference: CollaborationPreference;
  additionalContext?: string;
  submitterName: string;
  submitterEmail: string;
  submissionDate: string;
  status: ContributionStatus;
  dispositionedAt?: string;
  dispositionedBy?: string;
  curatorNotes?: string;
  createdRecordId?: string;
}

interface EngagementRequest {
  id: string;
  requestType: EngagementRequestType;
  originatingRecordId?: string;
  originatingRecordTitle?: string;
  requesterName: string;
  requesterOffice: string;
  requesterEmail: string;
  needDescription: string;
  desiredNextStep?: string;
  preferredContactMethod: 'email' | 'phone' | 'no_preference';
  submittedAt: string;
  routingAddressAtSubmission: string;
  emailRoutingInitiated: boolean;
  followUpStatus: EngagementFollowUpStatus;
  followUpUpdatedAt?: string;
  curatorNotes?: string;
}

interface AuditEvent {
  auditId: string;
  eventType: AuditEventType;
  actorId: string;
  actorName: string;
  targetType: string;
  targetId: string;
  targetTitle?: string;
  eventData: Record<string, unknown>;
  occurredAt: string;
  notes?: string;
}

interface HubSetting {
  settingKey: string;
  settingValue: string;
  settingType: 'string' | 'integer' | 'boolean' | 'json';
  description?: string;
  updatedAt: string;
  updatedBy?: string;
}
```
---

## Y1a: REST API — Public Endpoints

**Scope:** All endpoints accessible to anonymous or general authenticated users (not requiring Curator or Admin role). Base path: `/api/v1`. All responses are JSON. All requests that accept a body use `Content-Type: application/json`. Dates are ISO 8601. UUIDs are lowercase hyphenated strings.

---

### Authentication

Public endpoints do not require authentication. Where a request is made by an authenticated Curator or Admin, the response may include additional fields (e.g., draft records, restricted artifact URLs). Token format and authentication mechanism are TBD pending identity system discovery (SEC-12). For MVP development, a placeholder mechanism is permitted if explicitly approved and disabled in operational environments (SEC-09).

---

### Common Response Envelope

All responses follow a standard envelope:

```json
// Success
{
  "status": "ok",
  "data": { ... } | [ ... ],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 47
  }
}

// Error
{
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "message": "Human-readable error message",
  "fields": { "field_name": "field-specific message" }  // optional, for 422
}
```

---

### §Catalog — GET /api/v1/catalog

Returns paginated list of published catalog cards.

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Page number |
| `page_size` | integer | 20 | Records per page; max 100 |
| `sort` | string | `last_reviewed_desc` | `last_reviewed_desc`, `title_asc`, `updated_desc` |

**Response (200):** Array of `CatalogCard` objects (see Y0a TypeScript interfaces).

```json
{
  "status": "ok",
  "data": [
    {
      "id": "uuid",
      "slug": "audio-security-poc",
      "title": "Audio Security POC",
      "summary": "Explored defense-in-depth architecture for court audio protection in Azure Government Cloud.",
      "technologyAreas": ["Azure Government Cloud", "Audio Processing"],
      "maturity": "experiment_poc",
      "reviewStatuses": ["technically_reviewed", "security_reviewed"],
      "contributingOffices": ["TSIO Innovation & Research"],
      "engagementIndicator": "demo_available",
      "lastReviewedDate": "2026-06-15",
      "publicationState": "published"
    }
  ],
  "meta": { "page": 1, "page_size": 20, "total": 3 }
}
```

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 503 | `CATALOG_UNAVAILABLE` | Database unavailable |

---

### §Search — GET /api/v1/search

Full-text search and faceted filter across published records.

**Query Parameters:** All parameters from F02 §Inputs (q, mission_areas[], technology_areas[], maturity[], review_statuses[], contributing_offices[], reuse_potential, has_artifacts, publication_state[], page, page_size, sort).

**Response (200):** Same structure as catalog, with additional `query` echo:

```json
{
  "status": "ok",
  "data": [ /* CatalogCard[] */ ],
  "meta": {
    "page": 1, "page_size": 20, "total": 5,
    "query": "audio security",
    "active_filters": { "maturity": ["experiment_poc"] }
  }
}
```

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 400 | `QUERY_TOO_LONG` | Query > 500 chars |
| 400 | `INVALID_FILTER` | Filter value not in canonical vocabulary |
| 503 | `SEARCH_UNAVAILABLE` | Search service unavailable |

---

### §Search Facets — GET /api/v1/search/facets

Returns facet values and result counts for the current filter context.

**Query Parameters:** Same filter parameters as `/search` (used to scope facet counts).

**Response (200):**

```json
{
  "status": "ok",
  "data": {
    "maturity": [
      { "value": "experiment_poc", "label": "Experiment / POC", "count": 3 },
      { "value": "prototype_pilot", "label": "Prototype / Pilot", "count": 1 }
    ],
    "technologyAreas": [
      { "value": "Azure Government Cloud", "count": 2 }
    ],
    "reviewStatuses": [
      { "value": "technically_reviewed", "label": "Technically Reviewed", "count": 4 }
    ],
    "missionAreas": [ ... ],
    "reusePotential": [ ... ]
  }
}
```

---

### §Records — GET /api/v1/records/:idOrSlug

Returns full public record by ID (UUID) or slug.

**Path Parameters:**
- `:idOrSlug` — UUID or URL-safe slug string

**Query Parameters:**
- `view` (string, optional): `executive` (default) or `technical` — rendering hint for the client

**Response (200):** Full `InnovationRecord` public fields. Restricted artifacts have `url` omitted.

```json
{
  "status": "ok",
  "data": {
    "id": "uuid",
    "slug": "audio-security-poc",
    "publicationState": "published",
    "title": "Audio Security POC",
    "summary": "...",
    "problemStatement": "...",
    "missionAreas": ["Court Operations"],
    "technologyAreas": ["Azure Government Cloud", "Audio"],
    "hypothesisOrObjective": "...",
    "outcomeSummary": "...",
    "sourceBasis": "Audio Security POC Lessons Learned Document, June 2026",
    "findingsArchitectural": "...",
    "findingsSecurity": "...",
    "maturity": "experiment_poc",
    "reviewStatuses": ["technically_reviewed", "security_reviewed"],
    "lastReviewedDate": "2026-06-15",
    "ownerSteward": "I&R Technical Lead",
    "contributingOffices": ["TSIO Innovation & Research"],
    "attributionStatement": "Produced by the TSIO I&R team...",
    "applicableDisclaimer": "This record summarizes a proof-of-concept...",
    "engagementIndicator": "demo_available",
    "artifacts": [ /* PublicArtifact[] */ ],
    "nextActions": [ /* RecordNextAction[] (enabled only) */ ]
  }
}
```

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 404 | `RECORD_NOT_FOUND` | Record not found, not published, or access denied |

---

### §Records Artifacts — GET /api/v1/records/:id/artifacts

Returns artifact list for a published record. Restricted artifact URLs are omitted for non-curator users.

**Response (200):**

```json
{
  "status": "ok",
  "data": [
    {
      "artifactId": "uuid",
      "artifactType": "lessons_learned",
      "name": "Audio Security POC Lessons Learned",
      "accessNotes": "AO internal SharePoint — requires AO network",
      "isRestricted": true,
      "displayOrder": 0
    }
  ]
}
```

**Note:** `url` field is present only when `isRestricted = false`.

---

### §Engagement — POST /api/v1/engagement

Submit an engagement request (F8).

**Rate limit:** 10 per IP per hour (configurable via hub_settings `engagement_rate_limit_per_hour`).

**Request Body:**

```json
{
  "requestType": "request_demo",
  "originatingRecordId": "uuid-or-null",
  "requesterName": "Jane Smith",
  "requesterOffice": "District Court — Southern District of New York",
  "requesterEmail": "jane.smith@example.uscourts.gov",
  "needDescription": "We are interested in seeing the audio security architecture demonstrated for our IT leadership team.",
  "desiredNextStep": "A 30-minute video demo would be ideal.",
  "preferredContactMethod": "email",
  "consentToContact": true
}
```

**Response (201):**

```json
{
  "status": "ok",
  "data": {
    "id": "uuid",
    "referenceNumber": "ENG-2026-001",
    "message": "Your engagement request has been received. I&R will review and contact you using the email provided."
  }
}
```

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing or invalid required field |
| 422 | `CONSENT_REQUIRED` | `consentToContact` not true |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 503 | `ROUTING_NOT_CONFIGURED` | No routing address configured |

---

### §Submissions Opportunity — POST /api/v1/submissions/opportunity

Submit an opportunity (F6).

**Rate limit:** 5 per IP per hour (configurable via `submission_rate_limit_per_hour`).

**Request Body:**

```json
{
  "requestType": "current_mission_problem",
  "problemTitle": "Protect audio recordings in appellate proceedings",
  "problemDescription": "Appellate audio recordings are currently stored without encryption...",
  "affectedUsers": "Clerks office staff, appellate judges, IT administrators",
  "impact": "Risk of unauthorized access to sensitive proceedings",
  "submittingOffice": "Fifth Circuit Court of Appeals",
  "submitterName": "John Doe",
  "submitterEmail": "john.doe@ca5.uscourts.gov",
  "consentToContact": true,
  "nonAcceptanceAcknowledged": true
}
```

**Response (201):**

```json
{
  "status": "ok",
  "data": {
    "id": "uuid",
    "referenceNumber": "OPP-2026-001",
    "message": "Your submission has been received. Submission does not imply acceptance into the I&R portfolio. You will be contacted if I&R determines the opportunity aligns with current priorities."
  }
}
```

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing or invalid required field |
| 422 | `CONSENT_REQUIRED` | Consents not acknowledged |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 500 | `SUBMISSION_FAILED` | Server error during save |

---

### §Submissions Contribution — POST /api/v1/submissions/contribution

Submit an innovation contribution (F7).

**Rate limit:** 5 per IP per hour.

**Request Body:**

```json
{
  "contributionTitle": "Court Scheduling Optimization Tool",
  "problemAddressed": "Manual scheduling of courtrooms leads to underutilization...",
  "workDescription": "We built a Python-based scheduling optimizer that reduced conflicts by 40%...",
  "contributingOffice": "District Court — Northern District of California",
  "contributorNames": "Alice Johnson, Bob Lee",
  "currentMaturity": "prototype_pilot",
  "currentOwner": "Alice Johnson",
  "ownerContactEmail": "alice.johnson@cand.uscourts.gov",
  "collaborationPreference": "seeking_adopter",
  "submitterName": "Alice Johnson",
  "submitterEmail": "alice.johnson@cand.uscourts.gov",
  "nonEndorsementAcknowledged": true,
  "consentToContact": true
}
```

**Response (201):**

```json
{
  "status": "ok",
  "data": {
    "id": "uuid",
    "referenceNumber": "CONTRIB-2026-001",
    "message": "Your contribution has been received. Submission does not imply I&R endorsement. If selected for curation, you will be notified and attribution will be preserved."
  }
}
```

**Error Responses:** Same pattern as opportunity submission.

---

### §HTTP Security Headers

All public responses must include (SEC-10, operational deployments):

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Configured per deployment; must prevent inline script injection |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (HTTPS deployments) |
---

## Y1b: REST API — Curator and Admin Endpoints

**Scope:** All endpoints requiring Curator or Admin authentication. Base path: `/api/v1/curator`. Authentication mechanism is TBD pending identity system discovery. All protected routes must return 401 if not authenticated and 403 if authenticated but insufficient role (SEC-01, SEC-02). All requests use `Content-Type: application/json`. Response envelope matches Y1a §Common Response Envelope.

---

### Authentication and Authorization

All `/api/v1/curator/*` endpoints require a valid authentication token. The token must encode or resolve to a user role of `curator` or `admin`. Where an endpoint requires `admin` role specifically, requests from `curator`-only users return 403.

---

### §Dashboard — GET /api/v1/curator/dashboard

Returns live summary counts for the curator dashboard (F9.1).

**Response (200):**

```json
{
  "status": "ok",
  "data": {
    "recordCounts": {
      "draft": 2,
      "submittedForReview": 1,
      "published": 3,
      "superseded": 0,
      "archived": 1,
      "retired": 0
    },
    "recordsNeedingReview": 1,
    "incompletePublishedRecords": 0,
    "pendingOpportunitySubmissions": 2,
    "pendingContributions": 1,
    "recentEngagementCount": 4,
    "recentAuditEvents": [
      {
        "auditId": "uuid",
        "eventType": "publication_state_changed",
        "actorName": "Curator A",
        "targetTitle": "Audio Security POC",
        "occurredAt": "2026-08-11T14:00:00Z"
      }
    ]
  }
}
```

---

### §Records — Record Management

#### GET /api/v1/curator/records

Returns all records across all lifecycle states (F9.2).

**Query Parameters:** All F02 filter parameters plus: `publication_state[]` accepts all states including `draft`, `submitted_for_review`, `retired`.

**Response (200):** Paginated array of full records (all fields visible to curator).

---

#### POST /api/v1/curator/records

Create a new Draft innovation record (F9.3).

**Request Body (minimum):**

```json
{
  "title": "New Record Title"
}
```

All other fields are optional at creation; defaults apply. `publicationState` defaults to `draft`.

**Response (201):**

```json
{
  "status": "ok",
  "data": {
    "id": "uuid",
    "slug": "new-record-title",
    "publicationState": "draft",
    "version": 1,
    "createdAt": "2026-08-11T10:00:00Z"
  }
}
```

---

#### GET /api/v1/curator/records/:id

Returns full record including all fields, restricted artifact URLs, and current version number.

**Response (200):** Full `InnovationRecord` with all fields including curator-only fields.

---

#### PATCH /api/v1/curator/records/:id

Edit record fields (F9.4). Partial update — only supplied fields are changed.

**Request Body:** Any subset of `InnovationRecord` fields. Must include `version` for optimistic concurrency.

```json
{
  "version": 3,
  "summary": "Updated summary text.",
  "maturity": "prototype_pilot",
  "maturityChangeReason": "Completed limited pilot with two courts."
}
```

**Response (200):** Updated record with incremented `version`.

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 409 | `VERSION_CONFLICT` | Submitted version does not match current version |
| 400 | `INVALID_MATURITY` | Unrecognized maturity value |
| 400 | `INVALID_REVIEW_STATUS` | Unrecognized review status value |
| 422 | `VALIDATION_ERROR` | Field-level validation failure |

---

#### DELETE /api/v1/curator/records/:id

Soft-delete a Draft record. Only permitted when `publicationState = draft`. Published and other states may not be deleted; use retire instead.

**Response (204):** No content.

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 409 | `CANNOT_DELETE_PUBLISHED` | Record is not in draft state |

---

### §Records — Lifecycle Transitions

#### POST /api/v1/curator/records/:id/submit-for-review

Advance record to `submitted_for_review`.

**Request Body (optional):**

```json
{ "notes": "Ready for peer review." }
```

**Response (200):** Updated record.

---

#### POST /api/v1/curator/records/:id/publish

Attempt publication. Server runs full publication gate check (F9.10).

**Request Body (optional):**

```json
{ "notes": "All requirements verified." }
```

**Response (200):** Updated record with `publicationState = published` and `publishedAt` set.

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 422 | `PUBLICATION_GATE_FAILED` | One or more gate fields missing; `fields` lists each missing field |

```json
{
  "status": "error",
  "error_code": "PUBLICATION_GATE_FAILED",
  "message": "Cannot publish. Required fields are missing.",
  "fields": {
    "applicableDisclaimer": "Applicable Disclaimer is required before publishing.",
    "lastReviewedDate": "Last Reviewed Date is required before publishing."
  }
}
```

---

#### POST /api/v1/curator/records/:id/unpublish

Return published record to draft.

**Request Body:**

```json
{ "notes": "Unpublishing for content correction." }
```

**Response (200):** Updated record with `publicationState = draft`.

---

#### POST /api/v1/curator/records/:id/supersede

Mark record as superseded.

**Request Body:**

```json
{
  "supersessionReason": "Replaced by updated Audio Security POC record v2.",
  "supersededByRecordId": "uuid-of-successor"
}
```

`supersessionReason` is required. `supersededByRecordId` is strongly recommended but not required (successor may not exist yet).

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 422 | `SUPERSESSION_REASON_REQUIRED` | `supersessionReason` missing or empty |

---

#### POST /api/v1/curator/records/:id/archive

Mark record as archived.

**Request Body (optional):**

```json
{ "retirementReason": "Work concluded; retained for institutional learning." }
```

---

#### POST /api/v1/curator/records/:id/retire

Mark record as retired. `retirementReason` is required.

**Request Body:**

```json
{ "retirementReason": "Work is no longer relevant; superseded by operational guidance." }
```

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 422 | `RETIREMENT_REASON_REQUIRED` | `retirementReason` missing |

---

#### POST /api/v1/curator/records/:id/reactivate

Re-activate a superseded, archived, or retired record to draft. Curator confirmation and mandatory note required.

**Request Body:**

```json
{ "notes": "Re-activating to incorporate new evidence before re-publishing." }
```

`notes` is required.

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 422 | `REACTIVATION_NOTE_REQUIRED` | `notes` missing |

---

### §Artifacts — Curator Artifact Management

#### GET /api/v1/curator/records/:id/artifacts

Returns all artifacts including restricted URLs.

#### POST /api/v1/curator/records/:id/artifacts

Add an artifact (F9.5).

**Request Body:**

```json
{
  "artifactType": "lessons_learned",
  "name": "Audio Security POC Lessons Learned",
  "url": "https://internal.sharepoint.example/...",
  "accessNotes": "AO network required",
  "isRestricted": true,
  "displayOrder": 0
}
```

**Response (201):** Created artifact object.

#### PATCH /api/v1/curator/records/:id/artifacts/:artifactId

Update artifact fields.

#### DELETE /api/v1/curator/records/:id/artifacts/:artifactId

Remove artifact. Requires curator confirmation (client-side); server-side this is a permanent delete with audit event.

---

### §Audit History

#### GET /api/v1/curator/records/:id/audit

Returns chronological audit events for a specific record.

**Query Parameters:**
- `page`, `page_size`
- `event_type[]` (filter by event type)

**Response (200):** Paginated array of `AuditEvent` objects.

#### GET /api/v1/curator/audit (Admin only)

Returns system-wide audit log.

**Query Parameters:**
- `page`, `page_size`
- `event_type[]`, `target_type[]`, `actor_id`, `date_from`, `date_to`

---

### §Opportunity Submission Queue

#### GET /api/v1/curator/submissions/opportunity

Returns paginated opportunity submissions (F9.12).

**Query Parameters:** `status[]`, `request_type[]`, `date_from`, `date_to`, `page`, `page_size`, `sort` (`submission_date_desc` default).

**Response (200):** Paginated array of `OpportunitySubmission` objects.

#### GET /api/v1/curator/submissions/opportunity/:id

Returns single submission.

#### PATCH /api/v1/curator/submissions/opportunity/:id/disposition

Record a disposition.

**Request Body:**

```json
{
  "status": "accepted",
  "curatorNotes": "Strong alignment with I&R audio security work. Will schedule discovery."
}
```

---

### §Contribution Submission Queue

#### GET /api/v1/curator/submissions/contribution

Returns paginated contribution submissions (F9.13).

#### GET /api/v1/curator/submissions/contribution/:id

Returns single contribution.

#### PATCH /api/v1/curator/submissions/contribution/:id/disposition

Record disposition.

```json
{
  "status": "accepted_for_curation",
  "curatorNotes": "Good candidate for curation. Will initiate record next sprint."
}
```

#### POST /api/v1/curator/submissions/contribution/:id/create-record

Initiate a Draft Innovation Record pre-populated from the contribution (F9.13).

**Request Body:** None required — server pre-populates from contribution fields.

**Response (201):**

```json
{
  "status": "ok",
  "data": {
    "recordId": "uuid",
    "message": "Draft record created from contribution. Attribution fields pre-populated."
  }
}
```

**Side effects:**
- Sets `innovation_contributions.created_record_id` to the new record ID.
- Sets `innovation_contributions.status = curated`.
- Sets `innovation_records.source_contribution_id` to contribution ID.
- Generates `record_created_from_contribution` audit event.

---

### §Engagement Activity

#### GET /api/v1/curator/engagement

Returns paginated engagement requests (F9.14).

**Query Parameters:** `follow_up_status[]`, `request_type[]`, `date_from`, `date_to`, `originating_record_id`, `page`, `page_size`.

#### GET /api/v1/curator/engagement/:id

Returns single engagement request.

#### PATCH /api/v1/curator/engagement/:id/status

Update follow-up status.

```json
{
  "followUpStatus": "in_progress",
  "curatorNotes": "Responded to requester; demo scheduled for Aug 20."
}
```

---

### §Settings Management

#### GET /api/v1/curator/settings

Returns all hub settings (Admin only).

**Response (200):** Array of `HubSetting` objects.

#### PUT /api/v1/curator/settings/:key

Update a single setting (Admin only).

**Request Body:**

```json
{ "settingValue": "AOml_TSO_IRB_Team@ao.uscourts.gov" }
```

**Validation:** Applied per setting key (see F9.15 §Configurable settings).

**Response (200):** Updated `HubSetting` object.

**Side effects:** Generates `settings_changed` audit event. New value effective immediately.

**Error Responses:**

| HTTP | Error Code | Condition |
|---|---|---|
| 404 | `SETTING_NOT_FOUND` | Unknown setting key |
| 422 | `INVALID_EMAIL` | Email setting has invalid format |
| 422 | `VALIDATION_ERROR` | Value fails setting-specific validation |

---

### §Content Model Reference

#### GET /api/v1/curator/reference

Returns the in-product content model reference data (F9.16). Read-only.

**Response (200):**

```json
{
  "status": "ok",
  "data": {
    "maturityTaxonomy": [ /* { value, label, description }[] */ ],
    "reviewStatusTaxonomy": [ /* { value, label, description }[] */ ],
    "publicationStates": [ /* { value, label, description }[] */ ],
    "engagementIndicators": [ /* { value, label, description }[] */ ],
    "publicationGateFields": [ /* { number, field, section, description }[] */ ],
    "disclaimerTemplates": [
      {
        "maturity": "experiment_poc",
        "template": "This record summarizes a proof-of-concept effort..."
      }
    ]
  }
}
```

---

### Curator API — Error Summary

| HTTP | Error Code | When |
|---|---|---|
| 401 | `UNAUTHORIZED` | Not authenticated |
| 403 | `FORBIDDEN` | Authenticated but insufficient role |
| 404 | `NOT_FOUND` | Record, artifact, submission, or setting not found |
| 409 | `VERSION_CONFLICT` | Optimistic concurrency violation |
| 409 | `CANNOT_DELETE_PUBLISHED` | Attempt to delete non-draft record |
| 422 | `PUBLICATION_GATE_FAILED` | Publication gate check failed |
| 422 | `SUPERSESSION_REASON_REQUIRED` | Supersede without reason |
| 422 | `RETIREMENT_REASON_REQUIRED` | Retire without reason |
| 422 | `REACTIVATION_NOTE_REQUIRED` | Re-activate without note |
| 422 | `VALIDATION_ERROR` | Field-level validation failure |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
---

## Y2: Cross-Feature Error Catalog

**Scope:** Consolidated catalog of all error codes, HTTP statuses, messages, and retry/recovery guidance across all MVP features. Feature-specific error tables in each F-series chunk reference this catalog. Errors are grouped by origin.

---

### Error Code Convention

All error codes are SCREAMING_SNAKE_CASE strings returned in the `error_code` field of the standard error response envelope. Error messages shown here are the canonical human-readable strings; frontends may supplement with additional contextual guidance.

---

### §Public API Errors (Anonymous Users)

#### Search and Catalog (F1, F2)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 400 | `QUERY_TOO_LONG` | "Your search query is too long. Please shorten it." | No | Query > 500 chars |
| 400 | `INVALID_FILTER` | "One or more filter values were not recognized." | No | Unknown filter value (API consumers) |
| 404 | `NOT_FOUND` | "The requested page could not be found." | No | Generic 404 for UI pages |
| 503 | `CATALOG_UNAVAILABLE` | "The catalog is temporarily unavailable. Please try again." | Yes (after delay) | Database unavailable |
| 503 | `SEARCH_UNAVAILABLE` | "Search is temporarily unavailable. You can browse the catalog instead." | Yes (after delay) | Search service down |

#### Innovation Record (F3)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `RECORD_NOT_FOUND` | "This record could not be found or may not be available." | No | Non-existent, non-published, or draft record accessed by anonymous user |

#### Engagement Requests (F8)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 422 | `VALIDATION_ERROR` | "[Field name] is required." / "[Field name] is not valid." | No — fix input | Per-field validation |
| 422 | `INVALID_EMAIL` | "Please enter a valid email address." | No — fix input | Invalid email format |
| 422 | `CONSENT_REQUIRED` | "You must consent to contact to submit this request." | No — fix input | Consent checkbox not checked |
| 429 | `RATE_LIMITED` | "Too many requests. Please try again later." | Yes (after 1 hour) | SEC-06 rate limit hit |
| 503 | `ROUTING_NOT_CONFIGURED` | "Engagement routing is not currently configured. Please contact I&R directly." | No — admin action required | No routing address in settings |
| 500 | `SUBMISSION_FAILED` | "We were unable to save your request. Please try again." | Yes (immediate retry) | Server error; engagement request must not be lost |

#### Opportunity Submissions (F6)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 422 | `VALIDATION_ERROR` | "[Field name] is required." | No | Per-field |
| 422 | `INVALID_EMAIL` | "Please enter a valid email address." | No | |
| 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-acceptance statement to submit." | No | |
| 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | Yes (after 1 hour) | |
| 500 | `SUBMISSION_FAILED` | "We were unable to save your submission. Please try again." | Yes | Must not silently drop |

#### Contribution Submissions (F7)

| HTTP Status | Error Code | User-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 422 | `VALIDATION_ERROR` | "[Field name] is required." | No | |
| 422 | `INVALID_EMAIL` | "Please enter a valid email address." | No | |
| 422 | `CONSENT_REQUIRED` | "You must acknowledge the non-endorsement statement to submit." | No | |
| 429 | `RATE_LIMITED` | "Too many submissions. Please try again later." | Yes | |
| 500 | `SUBMISSION_FAILED` | "We were unable to save your contribution. Please try again." | Yes | |

---

### §Curator API Errors (Authenticated Users)

#### Authentication and Authorization

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 401 | `UNAUTHORIZED` | "You must be logged in to access this area." | Yes (after login) | Not authenticated or token expired |
| 403 | `FORBIDDEN` | "You do not have permission to perform this action." | No | Authenticated but wrong role |

#### Record Lifecycle

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `RECORD_NOT_FOUND` | "The record could not be found." | No | Record ID not found |
| 409 | `VERSION_CONFLICT` | "This record was updated by another user. Reload and reapply your changes." | Yes (after reload) | Optimistic concurrency |
| 409 | `CANNOT_DELETE_PUBLISHED` | "Only draft records can be deleted. Use Archive or Retire for published records." | No | Attempted delete on non-draft |
| 422 | `PUBLICATION_GATE_FAILED` | "Cannot publish. Required fields are missing: [list]" | No — fill missing fields | Full gate check failed; `fields` object lists missing fields |
| 422 | `SUPERSESSION_REASON_REQUIRED` | "A reason is required when superseding a record." | No | Missing `supersessionReason` |
| 422 | `RETIREMENT_REASON_REQUIRED` | "A retirement reason is required." | No | Missing `retirementReason` |
| 422 | `REACTIVATION_NOTE_REQUIRED` | "A note is required when re-activating a record." | No | Missing `notes` on re-activate |
| 422 | `ATTRIBUTION_REMOVAL_WARNING` | "Removing the original contributing office or contributors requires confirmation for contributed records." | No — curator must confirm | Soft-block warning for attribution preservation |

#### Record Field Validation

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 400 | `INVALID_MATURITY` | "The maturity value provided is not recognized." | No | Not in canonical vocabulary |
| 400 | `INVALID_REVIEW_STATUS` | "One or more review status values are not recognized." | No | Not in canonical vocabulary |
| 422 | `INVALID_URL` | "Artifact URL must be a valid URL." | No | |
| 422 | `VALIDATION_ERROR` | "[Field] [message]" | No — fix input | Generic field-level validation |

#### Artifact Management

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `ARTIFACT_NOT_FOUND` | "The artifact could not be found." | No | |
| 422 | `INVALID_URL` | "Artifact URL must be a valid HTTPS URL." | No | |

#### Submission Queue Errors

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `SUBMISSION_NOT_FOUND` | "Submission not found." | No | |
| 409 | `RECORD_ALREADY_CREATED` | "A record has already been created from this contribution." | No | Attempt to create record twice from same contribution |

#### Settings Errors

| HTTP Status | Error Code | Curator-Facing Message | Retry? | Notes |
|---|---|---|---|---|
| 404 | `SETTING_NOT_FOUND` | "The setting key was not found." | No | |
| 422 | `INVALID_EMAIL` | "The routing address must be a valid email address." | No | |
| 422 | `VALIDATION_ERROR` | "The value is not valid for this setting." | No | General setting validation |

---

### §Server and Infrastructure Errors

| HTTP Status | Error Code | Message | Retry? | Notes |
|---|---|---|---|---|
| 500 | `INTERNAL_ERROR` | "An unexpected error occurred. Please try again. If the problem persists, contact the system administrator." | Yes | Unhandled server exception |
| 503 | `SERVICE_UNAVAILABLE` | "The service is temporarily unavailable. Please try again shortly." | Yes | Database or external dependency down |
| 504 | `GATEWAY_TIMEOUT` | "The request timed out. Please try again." | Yes | Request exceeded timeout |

---

### §Security-Failure Defaults (SEC-07)

When a required security control is unavailable, the system must default to the protected state:

| Scenario | Default Behavior | Error Code |
|---|---|---|
| Authentication service unavailable | Return 503; deny all protected route access | `SERVICE_UNAVAILABLE` |
| Rate-limiting service unavailable | Deny all form submissions (conservative) | `SERVICE_UNAVAILABLE` |
| No routing address configured | Deny engagement requests; show `ROUTING_NOT_CONFIGURED` | `ROUTING_NOT_CONFIGURED` |
| Session/token validation fails | Treat as unauthenticated; return 401 | `UNAUTHORIZED` |
| Required security header cannot be set | Log server error; do not serve response without headers in operational environments | N/A — operational safeguard |

---

### §Email Routing Failure Handling

When server-side email routing fails (F8):

| Failure Scenario | System Behavior | User Impact | Curator Alert |
|---|---|---|---|
| Email send fails (server error) | Engagement request already persisted to DB; `email_routing_initiated = false` | No error shown to user (request confirmed as received) | Flagged in curator engagement queue; curator must manually follow up |
| No routing address configured | 503 returned to user before form submission completes | Error shown: routing not configured | Curator/admin must configure routing address in settings |
| Email server returns bounce | Not detectable at MVP send-time | None | Out of scope for MVP — curator monitors inbox |

---

### §Validation Error Response Format

All 422 `VALIDATION_ERROR` responses include a `fields` object mapping field names to error messages:

```json
{
  "status": "error",
  "error_code": "VALIDATION_ERROR",
  "message": "One or more fields are invalid.",
  "fields": {
    "submitterEmail": "Please enter a valid email address.",
    "problemDescription": "Problem Description must be at least 50 characters.",
    "consentToContact": "You must consent to contact to submit this request."
  }
}
```

Field names in the `fields` object use camelCase matching the request body field names.
---

## Y3: External Integrations and Dependencies

**Scope:** External system dependencies, integration contracts, and blocker/assumption classifications for all MVP features. See PRD §15 for the authoritative dependency register. This document adds functional detail: what each integration must do, what behavior is required, and what constitutes a development stub versus an operational implementation.

---

### Stub and Blocker Governance

Per PRD §15.1:
- A temporary development stub must have explicit acceptance criteria and an explicit condition describing where it may not be used.
- A production blocker must remain visible in the decision register until resolved.
- A stub must not silently become the operational implementation because the feature appears functional in development.
- SEC-09: development-only mechanisms must not be active in operational environments.

---

### §INT-01: Identity and Access Management

**MVP Need:** Required for all protected Curator and Admin routes (F9, all curator API endpoints).

**Required Behavior:**
- The system must authenticate users before granting access to any `/api/v1/curator/*` endpoint.
- Authenticated users must carry a role claim of `curator` or `admin`.
- The authentication token must be verifiable by the Hub application without calling back to the identity provider on every request (e.g., JWT with signature verification, or session with server-side validation).
- Failed authentication must return 401. Insufficient role must return 403.
- Authentication events material to governance must be auditable (SEC-03).

**Development Stub (permitted until operational identity is confirmed):**
- A development-only authentication mechanism (e.g., fixed test credentials, header bypass, or mock JWT) may be used during development if explicitly approved by the technical authority.
- SEC-09: the stub must be disabled by a configuration flag in operational environments. It must not be deployable to operational environments without explicit removal or override.
- Acceptance criteria for stub: stub is behind a `ENABLE_DEV_AUTH_BYPASS=true` environment variable; attempting to enable this variable in a non-development environment triggers a startup error.

**Operational Blocker:** Yes — identity and access approach must be resolved and implemented before non-development deployment. (PRD §15 confirms this as a blocker.)

**Current State:** TBD during discovery. Likely candidates include Azure AD (government cloud), Judiciary SSO, or a locally managed identity store.

---

### §INT-02: Hosting Environment

**MVP Need:** Required before operational deployment.

**Required Behavior:**
- The application must be deployable to the approved hosting environment.
- The hosting environment must support: HTTPS with a valid certificate, appropriate network access controls, secrets management (SEC-08), and the approved application runtime.
- The hosting environment determines the operational deployment architecture (containerized, VM-based, PaaS, etc.).

**Development Stub:** Local/development deployment is permitted during development phase.

**Operational Blocker:** Yes — hosting environment must be resolved before operational deployment. (PRD §15.)

**Current State:** TBD during discovery.

---

### §INT-03: Engagement Email Routing

**MVP Need:** Required for MVP engagement actions (F8). The initial routing address `AOml_TSO_IRB_Team@ao.uscourts.gov` has been confirmed.

**Required Behavior (MVP — Email-First):**
- The system must route engagement requests to the configured email address (stored in `hub_settings.engagement_routing_address`).
- For MVP, email-first routing via `mailto:` client-side link OR server-side email send is acceptable provided the engagement request is separately recorded in the database before the email action is triggered.
- The routing address must be configurable without code change or redeployment (F9.15, F8.4).
- The `routing_address_at_submission` field on each engagement request records the address in use at submission time (audit trail).

**Server-Side Email Integration (if implemented above `mailto:`):**
- SMTP server or email API (e.g., SendGrid, Azure Communication Services, or AO's approved SMTP relay) must be configured via environment variables (SEC-08).
- On send failure: the engagement request is already persisted; `email_routing_initiated = false`; curator is alerted in the engagement queue.

**Development Stub:**
- `mailto:` client-side routing is acceptable as a development stub.
- A server-side email stub (log to console or local mailbox) is permitted in development if explicitly approved.
- Stub acceptance criteria: `EMAIL_ROUTING_MODE=mailto` environment variable selects mailto mode; `EMAIL_ROUTING_MODE=smtp` configures server-side routing. `mailto` mode must not be used in operational environments without product owner approval.

**Operational Blocker:** No — email-first routing with separate database recording is approved for MVP if the routing address is confirmed. (PRD §15.)

---

### §INT-04: Authoritative Artifact Repositories

**MVP Need:** Required to link evidence artifacts from Innovation Records.

**Required Behavior:**
- The Hub links to artifacts stored in authoritative source systems (SharePoint, Git repositories, network file locations, etc.). The Hub does not host, copy, or migrate artifact content.
- Artifact URLs point to the authoritative source system. Access to the artifact is governed by the source system's permissions (SEC-04).
- The Hub stores the URL and metadata (`name`, `artifact_type`, `access_notes`, `is_restricted`) but does not validate reachability at storage time.
- Restricted artifacts (`is_restricted = true`): the URL is returned only in curator API responses; public responses return only the name and access notes.

**Integration Requirements:**
- No API integration with source systems is required for MVP. Artifact links are plain URLs provided by curators.
- Curators are responsible for providing valid, current URLs. Broken link detection is out of MVP scope.

**Development Stub:** No stub required — artifact links are plain URL strings. No integration library needed.

**Operational Blocker:** No — but initial artifact URLs must be confirmed by content curators before records are published. (PRD §15.)

---

### §INT-05: Automated Submission Protection (Rate Limiting / CAPTCHA)

**MVP Need:** Required where public-facing forms are exposed (F6, F7, F8 — SEC-06).

**Required Behavior:**
- Public submission endpoints must be rate-limited per IP address.
- Rate limits are configurable via `hub_settings` (see F9.15 and Y0b §hub_settings).
- A CAPTCHA or equivalent challenge mechanism may be required in operational environments depending on the approved security baseline (TBD during discovery).

**Development Stub:**
- IP-based rate limiting may be implemented via in-memory store (e.g., Redis or application-level counter) during development.
- CAPTCHA challenge may be bypassed in development if `ENABLE_CAPTCHA_BYPASS=true` environment variable is set — SEC-06 and SEC-09 require this bypass to be disabled in operational environments.
- Acceptance criteria: CAPTCHA bypass flag triggers a startup warning log in non-development environments and a startup error if `NODE_ENV=production`.

**Operational Blocker:** Yes where the approved operational security baseline requires it. Mechanism TBD during discovery. (PRD §15.)

---

### §INT-06: Usage and Engagement Analytics

**MVP Need:** Metrics collection is required to validate product hypothesis measures (PRD §11). Collection method TBD.

**Required Behavior:**
- Basic approved event tracking may be sufficient for MVP.
- Events of interest: catalog page views, record detail page views, search queries (no PII), filter usage, CTA clicks, engagement requests submitted, opportunity submissions, contribution submissions.
- Analytics must not collect PII without explicit Judiciary privacy approval.
- Analytics must not use third-party tracking services without appropriate review.

**Development Stub:**
- Server-side event logging (structured JSON to application logs) is acceptable as a development stub.
- No third-party analytics SDK integration is required until method is decided.

**Operational Blocker:** No — analytics are not required for launch but are required before metric collection for product hypothesis validation. Decision required before implementation. (PRD §15.)

---

### §INT-07: Database

**MVP Need:** Required for all persistence (records, submissions, engagement, audit, settings).

**Required Behavior:**
- The Hub requires a relational database supporting JSONB (for `audit_events.event_data` and settings), array types (for `text[]` fields), and standard SQL with referential integrity.
- PostgreSQL (or compatible) is the strongly recommended engine given the schema requirements.
- The application DB role must have INSERT-only on `audit_events` (no UPDATE or DELETE) — enforced at database role level.
- Secrets (database credentials) must not appear in committed code (SEC-08).

**Development Stub:** Local PostgreSQL or containerized PostgreSQL is permitted for development.

**Operational Blocker:** Yes — database hosting must be confirmed as part of the overall hosting environment decision (§INT-02).

---

### §INT-08: Secrets Management

**MVP Need:** Required before any credential, API key, or sensitive configuration is used (SEC-08).

**Required Behavior:**
- All secrets (database credentials, SMTP credentials, authentication secrets, API keys) must be injected via environment variables or an approved secrets management system.
- No secret may appear in committed source code, Docker images, or configuration files committed to version control.
- The deployment documentation must specify how each secret is provided in development and operational environments.

**Development Stub:** `.env` file (gitignored) is acceptable for local development. `.env.example` with placeholder values (no real credentials) must be committed.

**Operational Blocker:** Yes — must be resolved before operational deployment. Required for SEC-08 compliance.

---

### Integration Summary Table

| ID | Integration | Operational Blocker? | MVP Stub Permitted? | Current State |
|---|---|---|---|---|
| INT-01 | Identity and Access Management | Yes | Yes (dev-only auth bypass) | TBD — discovery |
| INT-02 | Hosting Environment | Yes | Yes (local dev) | TBD — discovery |
| INT-03 | Engagement Email Routing | No (if email-first approved) | Yes (mailto or log) | Address confirmed; mechanism TBD |
| INT-04 | Authoritative Artifact Repositories | No | No (plain URLs) | URLs confirmed per record |
| INT-05 | Automated Submission Protection | Yes (if baseline requires) | Yes (in-memory rate limit) | TBD — security baseline |
| INT-06 | Usage Analytics | No (pre-launch metric collection) | Yes (structured logs) | Method TBD |
| INT-07 | Database | Yes (part of hosting) | Yes (local PostgreSQL) | TBD — hosting |
| INT-08 | Secrets Management | Yes | Yes (.env for dev) | Required before operational |
