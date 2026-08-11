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
