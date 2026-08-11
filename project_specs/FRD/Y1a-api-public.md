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
