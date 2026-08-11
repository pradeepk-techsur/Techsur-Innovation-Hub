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
