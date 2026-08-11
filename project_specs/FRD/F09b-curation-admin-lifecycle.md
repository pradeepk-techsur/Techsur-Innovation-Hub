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
