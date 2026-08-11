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
