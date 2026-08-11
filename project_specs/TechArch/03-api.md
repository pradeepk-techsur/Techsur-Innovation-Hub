---

## 4. API Design

### 4.1 API Conventions

- **Base path:** `/api/v1`
- **Format:** JSON (`Content-Type: application/json`)
- **Auth header:** `Authorization: Bearer <token>` for all `/api/v1/curator/*` routes
- **Dates:** ISO 8601 strings (`2026-06-15` for dates, `2026-08-11T14:00:00Z` for timestamps)
- **UUIDs:** lowercase hyphenated strings
- **Pagination:** `?page=1&page_size=20`; default `page_size=20`, max `100`
- **Naming convention:** camelCase in JSON request/response bodies; snake_case in DB

#### 4.1.1 Standard Response Envelope

```typescript
// Success
interface ApiSuccess<T> {
  status: 'ok';
  data: T;
  meta?: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  page_size: number;
  total: number;
}

// Error
interface ApiError {
  status: 'error';
  error_code: string;
  message: string;
  fields?: Record<string, string>;  // field-level messages for 422
}
```

#### 4.1.2 HTTP Security Headers (SEC-10)

All responses include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains   (HTTPS deployments)
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'
```

CSP is configured per deployment and must prevent inline script injection.

### 4.2 TypeScript Interfaces

```typescript
// ── Canonical Enum Types ──────────────────────────────────────────────────

type MaturityValue =
  | 'idea'
  | 'evaluated_idea'
  | 'experiment_poc'
  | 'prototype_pilot'
  | 'production_validated'
  | 'archived_retired';

type ReviewStatusValue =
  | 'submitted'
  | 'curated'
  | 'technically_reviewed'
  | 'security_reviewed'     // SEC-11: visually distinct from technically_reviewed
  | 'policy_reviewed'
  | 'validated_for_reuse'
  | 'superseded'
  | 'retired';

type PublicationState =
  | 'draft'
  | 'submitted_for_review'
  | 'published'
  | 'superseded'
  | 'archived'
  | 'retired';

type EngagementIndicator =
  | 'demo_available'
  | 'seeking_adoption_partner'
  | 'technical_playbook_available'
  | 'reference_pattern_available'
  | 'monitoring_only'
  | 'archived'
  | 'none';

type ArtifactType =
  | 'lessons_learned'
  | 'poc_report'
  | 'decision_brief'
  | 'architecture_diagram'
  | 'demo_video'
  | 'repository'
  | 'infrastructure_definition'
  | 'test_results'
  | 'security_findings'
  | 'technical_playbook'
  | 'other';

type NextActionType =
  | 'request_demo'
  | 'discuss_use_case'
  | 'explore_adoption'
  | 'request_technical_guidance'
  | 'share_related_work'
  | 'contact_ir';

type ReusePotential = 'high' | 'moderate' | 'low' | 'not_assessed';

type OpportunityRequestType =
  | 'current_mission_problem'
  | 'emerging_tech_question'
  | 'request_for_research'
  | 'potential_poc'
  | 'request_for_demo'
  | 'collaboration_opportunity'
  | 'share_existing_work'
  | 'other';

type EngagementRequestType =
  | 'request_demo'
  | 'discuss_use_case'
  | 'explore_adoption'
  | 'request_technical_guidance'
  | 'share_related_work'
  | 'contact_ir';

type CollaborationPreference =
  | 'open_for_reuse'
  | 'seeking_collaborator'
  | 'informational_only'
  | 'seeking_adopter'
  | 'discuss_with_ir';

type OpportunityStatus = 'pending' | 'accepted' | 'declined' | 'needs_more_information' | 'duplicate';
type ContributionStatus = 'pending' | 'accepted_for_curation' | 'declined' | 'needs_more_information' | 'duplicate' | 'curated';
type EngagementFollowUpStatus = 'received' | 'in_progress' | 'completed' | 'no_action_required';

type AuditEventType =
  | 'record_created' | 'record_updated' | 'maturity_changed'
  | 'review_status_changed' | 'publication_state_changed'
  | 'attribution_updated' | 'artifact_added' | 'artifact_updated'
  | 'artifact_removed' | 'submission_dispositioned'
  | 'record_created_from_contribution' | 'engagement_status_updated'
  | 'settings_changed' | 'user_role_changed';

// ── Public Record Interfaces ──────────────────────────────────────────────

/** Catalog card — used in /api/v1/catalog and /api/v1/search responses */
interface CatalogCard {
  id: string;
  slug: string;
  title: string;
  summary: string;                      // truncated to 280 chars for card display
  technologyAreas: string[];
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  contributingOffices: string[];
  engagementIndicator: EngagementIndicator;
  lastReviewedDate: string | null;      // YYYY-MM-DD
  publicationState: PublicationState;   // only non-published when curator-scoped
}

/** Full public record — returned by /api/v1/records/:idOrSlug */
interface PublicInnovationRecord {
  id: string;
  slug: string;
  publicationState: PublicationState;
  publishedAt: string | null;

  // F3.1 — Problem and Context
  title: string;
  summary: string;
  problemStatement: string;
  affectedUsers?: string;
  currentWorkflow?: string;
  whyExperimentation?: string;
  missionAreas: string[];
  problemTypeTags: string[];

  // F3.2 — What Was Explored
  hypothesisOrObjective: string;
  scopeDescription?: string;
  technologyAreas: string[];
  technologiesUsed?: string;
  methodsUsed?: string;
  tags: string[];

  // F3.3 — Outcome and Evidence
  outcomeSummary: string;
  whatWorked?: string;
  whatDidNotWork?: string;
  uncertaintyReduced?: string;
  decisionEnabled?: string;
  evidenceSummary?: string;
  sourceBasis: string;

  // F3.4 — Key Findings
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

  // F3.5 — Maturity and Readiness
  maturity: MaturityValue | null;
  reviewStatuses: ReviewStatusValue[];
  readyFor?: string;
  notReadyFor?: string;
  nextStageRequirements?: string;
  lastReviewedDate: string | null;
  nextReviewDate?: string | null;

  // F3.6 — Reuse Guidance
  reusePotential: ReusePotential;
  whatCanBeReused?: string;
  whatShouldBeAdapted?: string;
  whatNotToCopy?: string;
  environmentAssumptions?: string;
  requiredSkills?: string;
  requiredServices?: string;
  productionReadinessGaps?: string;
  engagementIndicator: EngagementIndicator;

  // F3.7 — Ownership and Attribution
  opportunitySource?: string;
  contributingOffices: string[];
  contributorNames: string[];
  irContribution?: string;
  ownerSteward: string;
  ownerContact?: string;              // may be omitted per privacy policy
  operationalOwner?: string;
  productionOwner?: string;
  attributionStatement: string;

  // F3.8 — Governance and Trust (always rendered)
  applicableDisclaimer: string;
  supersededByRecordId?: string | null;
  supersessionReason?: string;
  retirementReason?: string;

  // F3.9 — Next Actions
  nextActionDescription?: string;

  // Relations
  artifacts: PublicArtifact[];
  nextActions: RecordNextAction[];
}

/** Artifact (public — restricted artifacts omit url) */
interface PublicArtifact {
  artifactId: string;
  artifactType: ArtifactType;
  name: string;
  url?: string;                        // omitted when isRestricted = true for non-curators
  accessNotes?: string;
  isRestricted: boolean;
  displayOrder: number;
}

/** Next Action CTA */
interface RecordNextAction {
  actionId: string;
  actionType: NextActionType;
  customLabel?: string;
  isEnabled: boolean;
  displayOrder: number;
  defaultLabel: string;               // computed from actionType
}

// ── Curator-Only Interfaces ───────────────────────────────────────────────

/** Full record — curator view (adds system fields + restricted artifact URLs) */
interface CuratorInnovationRecord extends PublicInnovationRecord {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;                    // for optimistic concurrency
  sourceContributionId?: string | null;
  maturityChangeReason?: string;

  // Curator-only: full artifact URLs regardless of is_restricted
  artifacts: CuratorArtifact[];
}

interface CuratorArtifact extends PublicArtifact {
  url: string;                        // always present for curators
  addedAt: string;
  addedBy: string;
}

// ── Submission Interfaces ─────────────────────────────────────────────────

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
  submitterEmail: string;             // SEC-05: handled per privacy policy
  discoveryParticipants?: string;
  additionalContext?: string;
  submissionDate: string;
  status: OpportunityStatus;
  dispositionedAt?: string;
  dispositionedBy?: string;
  curatorNotes?: string;              // curator-only
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
  requesterEmail: string;             // SEC-05
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
  // ipAddress: omitted from standard curator view; admin-only
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

### 4.3 Public API Endpoints (Y1a)

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| GET | `/api/v1/catalog` | None | — | Paginated published catalog cards |
| GET | `/api/v1/search` | None | — | Full-text search + faceted filter |
| GET | `/api/v1/search/facets` | None | — | Facet values and counts |
| GET | `/api/v1/records/:idOrSlug` | None | — | Full public record by ID or slug |
| GET | `/api/v1/records/:id/artifacts` | None | — | Artifact list (restricted URLs omitted) |
| POST | `/api/v1/engagement` | None | 10/IP/hr | Submit engagement request (F8) |
| POST | `/api/v1/submissions/opportunity` | None | 5/IP/hr | Submit opportunity (F6) |
| POST | `/api/v1/submissions/contribution` | None | 5/IP/hr | Submit innovation contribution (F7) |

#### GET /api/v1/catalog

**Query params:** `page` (default 1), `page_size` (default 20, max 100), `sort` (`last_reviewed_desc` | `title_asc` | `updated_desc`)

**Response 200:** `ApiSuccess<CatalogCard[]>` with `PaginationMeta`

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 503 | `CATALOG_UNAVAILABLE` | Database unavailable |

---

#### GET /api/v1/search

**Query params:** `q` (min 2, max 500 chars), `mission_areas[]`, `technology_areas[]`, `problem_type_tags[]`, `maturity[]`, `review_statuses[]`, `contributing_offices[]`, `reuse_potential`, `has_artifacts` (boolean), `publication_state[]` (public: only `published`), `page`, `page_size`, `sort` (`relevance` | `last_reviewed_desc` | `title_asc`)

**Response 200:** `ApiSuccess<CatalogCard[]>` with `PaginationMeta` + `query` + `active_filters` echoed in meta

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 400 | `QUERY_TOO_LONG` | `q` > 500 chars |
| 400 | `INVALID_FILTER` | Filter value not in canonical vocabulary |
| 503 | `SEARCH_UNAVAILABLE` | Search unavailable |

---

#### GET /api/v1/records/:idOrSlug

**Query params:** `view` (`executive` | `technical`, default `executive`) — client rendering hint

**Response 200:** `ApiSuccess<PublicInnovationRecord>`

**Logic:**
- Accepts both UUID and slug in the path parameter
- Returns 404 for draft, submitted_for_review, and retired records accessed by anonymous users
- Returns superseded/archived records with full data + state indicator
- Restricted artifact URLs (`is_restricted = true`) are omitted from `artifacts[]`

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 404 | `RECORD_NOT_FOUND` | Not found, not published, or access denied |

---

#### POST /api/v1/engagement

**Request body:**
```typescript
interface EngagementRequestBody {
  requestType: EngagementRequestType;        // required
  originatingRecordId?: string;              // UUID; required for record-level CTAs
  requesterName: string;                     // min 2, max 200 chars
  requesterOffice: string;                   // min 2, max 200 chars
  requesterEmail: string;                    // RFC 5321 email
  needDescription: string;                   // min 20, max 3000 chars
  desiredNextStep?: string;                  // max 500 chars
  preferredContactMethod?: 'email' | 'phone' | 'no_preference';
  consentToContact: true;                    // must be true
}
```

**Response 201:**
```typescript
interface EngagementRequestResponse {
  id: string;
  referenceNumber: string;                   // e.g., "ENG-2026-001"
  message: string;
}
```

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 422 | `VALIDATION_ERROR` | Missing or invalid field |
| 422 | `CONSENT_REQUIRED` | `consentToContact` not true |
| 429 | `RATE_LIMITED` | Rate limit exceeded (SEC-06) |
| 503 | `ROUTING_NOT_CONFIGURED` | No routing address in settings (SEC-07) |
| 500 | `SUBMISSION_FAILED` | Server error |

---

#### POST /api/v1/submissions/opportunity

**Request body:**
```typescript
interface OpportunitySubmissionBody {
  requestType: OpportunityRequestType;       // required
  problemTitle: string;                      // min 5, max 200 chars
  problemDescription: string;               // min 50, max 5000 chars
  affectedUsers: string;                     // min 10, max 1000 chars
  impact: string;                            // min 10, max 1000 chars
  submittingOffice: string;                  // min 2, max 200 chars
  submitterName: string;                     // min 2, max 200 chars
  submitterEmail: string;                    // RFC 5321
  currentWorkflow?: string;
  desiredOutcome?: string;
  knownConstraints?: string;
  relatedWorkAttempted?: string;
  discoveryParticipants?: string;
  additionalContext?: string;
  consentToContact: true;
  nonAcceptanceAcknowledged: true;
}
```

**Response 201:**
```typescript
interface SubmissionResponse {
  id: string;
  referenceNumber: string;                   // e.g., "OPP-2026-001"
  message: string;
}
```

**Errors:** 422 `VALIDATION_ERROR`, 422 `CONSENT_REQUIRED`, 429 `RATE_LIMITED`, 500 `SUBMISSION_FAILED`

---

#### POST /api/v1/submissions/contribution

**Request body:**
```typescript
interface ContributionSubmissionBody {
  contributionTitle: string;                 // min 5, max 200 chars
  problemAddressed: string;                  // min 30, max 3000 chars
  workDescription: string;                   // min 50, max 5000 chars
  contributingOffice: string;                // min 2, max 200 chars
  contributorNames: string;                  // min 2, max 500 chars
  currentMaturity: MaturityValue;            // canonical value
  currentOwner: string;                      // min 2, max 200 chars
  ownerContactEmail: string;                 // RFC 5321
  collaborationPreference: CollaborationPreference;
  artifactLinks?: string;
  knownLimitations?: string;
  additionalContext?: string;
  submitterName: string;
  submitterEmail: string;
  nonEndorsementAcknowledged: true;
  consentToContact: true;
}
```

**Response 201:** `SubmissionResponse` (referenceNumber format: `CONTRIB-2026-001`)

---

### 4.4 Curator API Endpoints (Y1b)

All `/api/v1/curator/*` endpoints require `Authorization: Bearer <token>` with role `curator` or `admin`.

| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/api/v1/curator/dashboard` | Curator | Dashboard summary counts (F9.1) |
| GET | `/api/v1/curator/records` | Curator | All records all states (F9.2) |
| POST | `/api/v1/curator/records` | Curator | Create new draft record (F9.3) |
| GET | `/api/v1/curator/records/:id` | Curator | Full record edit view (F9.4) |
| PATCH | `/api/v1/curator/records/:id` | Curator | Edit record fields; requires `version` |
| DELETE | `/api/v1/curator/records/:id` | Curator | Soft-delete draft record only |
| POST | `/api/v1/curator/records/:id/submit-for-review` | Curator | Advance to submitted_for_review |
| POST | `/api/v1/curator/records/:id/publish` | Curator | Publish (gate enforced — F9.10) |
| POST | `/api/v1/curator/records/:id/unpublish` | Curator | Return to draft |
| POST | `/api/v1/curator/records/:id/supersede` | Curator | Supersede (reason required) |
| POST | `/api/v1/curator/records/:id/archive` | Curator | Archive record |
| POST | `/api/v1/curator/records/:id/retire` | Curator | Retire (reason required) |
| POST | `/api/v1/curator/records/:id/reactivate` | Curator | Re-activate to draft (note required) |
| GET | `/api/v1/curator/records/:id/artifacts` | Curator | All artifacts incl. restricted URLs |
| POST | `/api/v1/curator/records/:id/artifacts` | Curator | Add artifact (F9.5) |
| PATCH | `/api/v1/curator/records/:id/artifacts/:aid` | Curator | Edit artifact |
| DELETE | `/api/v1/curator/records/:id/artifacts/:aid` | Curator | Remove artifact |
| GET | `/api/v1/curator/records/:id/audit` | Curator | Record audit history (F9.11) |
| GET | `/api/v1/curator/audit` | **Admin** | System-wide audit log |
| GET | `/api/v1/curator/submissions/opportunity` | Curator | Opportunity queue (F9.12) |
| GET | `/api/v1/curator/submissions/opportunity/:id` | Curator | Single submission |
| PATCH | `/api/v1/curator/submissions/opportunity/:id/disposition` | Curator | Record disposition |
| GET | `/api/v1/curator/submissions/contribution` | Curator | Contribution queue (F9.13) |
| GET | `/api/v1/curator/submissions/contribution/:id` | Curator | Single contribution |
| PATCH | `/api/v1/curator/submissions/contribution/:id/disposition` | Curator | Record disposition |
| POST | `/api/v1/curator/submissions/contribution/:id/create-record` | Curator | Create draft from contribution |
| GET | `/api/v1/curator/engagement` | Curator | Engagement activity (F9.14) |
| GET | `/api/v1/curator/engagement/:id` | Curator | Single engagement request |
| PATCH | `/api/v1/curator/engagement/:id/status` | Curator | Update follow-up status |
| GET | `/api/v1/curator/settings` | **Admin** | View all hub settings |
| PUT | `/api/v1/curator/settings/:key` | **Admin** | Update single setting |
| GET | `/api/v1/curator/reference` | Curator | Content model reference (F9.16) |

#### PATCH /api/v1/curator/records/:id (record edit)

Must include `version` field for optimistic concurrency:

```typescript
interface RecordEditBody {
  version: number;                    // current version — if mismatch, returns 409
  // Any subset of CuratorInnovationRecord fields
  title?: string;
  summary?: string;
  maturity?: MaturityValue;
  maturityChangeReason?: string;
  reviewStatuses?: ReviewStatusValue[];
  // ... all other record fields
}
```

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 409 | `VERSION_CONFLICT` | Submitted version ≠ current DB version |
| 400 | `INVALID_MATURITY` | Unrecognized maturity value |
| 400 | `INVALID_REVIEW_STATUS` | Unrecognized review status value |

#### POST /api/v1/curator/records/:id/publish (publication gate)

Server runs all 15 publication gate checks (F9.10). Returns 422 with `fields` listing all missing requirements:

```json
{
  "status": "error",
  "error_code": "PUBLICATION_GATE_FAILED",
  "message": "Cannot publish. Required fields are missing.",
  "fields": {
    "applicableDisclaimer": "Applicable Disclaimer is required before publishing.",
    "lastReviewedDate": "Last Reviewed Date is required before publishing.",
    "keyFindingsGateCheck": "At least one Key Findings field must be non-empty."
  }
}
```

#### Publication Gate — All 15 Checks (F9.10)

| # | Field / Condition | Error Key |
|---|---|---|
| 1 | `title` ≥ 5 chars | `title` |
| 2 | `summary` ≥ 20 chars | `summary` |
| 3 | `problem_statement` ≥ 50 chars | `problemStatement` |
| 4 | `mission_areas` ≥ 1 value | `missionAreas` |
| 5 | `hypothesis_or_objective` ≥ 20 chars | `hypothesisOrObjective` |
| 6 | `technology_areas` ≥ 1 value | `technologyAreas` |
| 7 | `outcome_summary` ≥ 50 chars | `outcomeSummary` |
| 8 | `source_basis` ≥ 10 chars | `sourceBasis` |
| 9 | At least 1 `findings_*` field non-empty | `keyFindingsGateCheck` |
| 10 | `maturity` is valid non-null canonical value | `maturity` |
| 11 | `review_statuses` ≥ 1 valid canonical value | `reviewStatuses` |
| 12 | `last_reviewed_date` valid, ≤ today | `lastReviewedDate` |
| 13 | `owner_steward` ≥ 3 chars | `ownerSteward` |
| 14 | `attribution_statement` ≥ 10 chars | `attributionStatement` |
| 15 | `applicable_disclaimer` ≥ 10 chars | `applicableDisclaimer` |

#### POST /api/v1/curator/submissions/contribution/:id/create-record

Creates a Draft Innovation Record pre-populated from the contribution. Side effects:
- Sets `innovation_contributions.created_record_id` to new record ID
- Sets `innovation_contributions.status = curated`
- Sets `innovation_records.source_contribution_id` to contribution ID
- Pre-populates: `contributing_offices`, `contributor_names`, `owner_steward`, `source_contribution_id`
- Generates `record_created_from_contribution` audit event

**Response 201:**
```json
{
  "status": "ok",
  "data": {
    "recordId": "uuid",
    "message": "Draft record created from contribution. Attribution fields pre-populated."
  }
}
```

**Errors:**

| HTTP | Code | Condition |
|---|---|---|
| 409 | `RECORD_ALREADY_CREATED` | Record already created from this contribution |

#### GET /api/v1/curator/dashboard

**Response 200:**
```typescript
interface DashboardData {
  recordCounts: {
    draft: number;
    submittedForReview: number;
    published: number;
    superseded: number;
    archived: number;
    retired: number;
  };
  recordsNeedingReview: number;           // next_review_date ≤ today + 30 days
  incompletePublishedRecords: number;     // published records missing trust fields
  pendingOpportunitySubmissions: number;
  pendingContributions: number;
  recentEngagementCount: number;          // last 7 days
  recentAuditEvents: Array<{
    auditId: string;
    eventType: AuditEventType;
    actorName: string;
    targetTitle?: string;
    occurredAt: string;
  }>;
}
```

### 4.5 Cross-Feature Error Catalog

| HTTP | Error Code | When |
|---|---|---|
| 400 | `QUERY_TOO_LONG` | Search query > 500 chars |
| 400 | `INVALID_FILTER` | Filter value not in canonical vocabulary |
| 400 | `INVALID_MATURITY` | Unrecognized maturity value |
| 400 | `INVALID_REVIEW_STATUS` | Unrecognized review status value |
| 401 | `UNAUTHORIZED` | Not authenticated or token expired |
| 403 | `FORBIDDEN` | Authenticated but insufficient role |
| 404 | `NOT_FOUND` | General not found |
| 404 | `RECORD_NOT_FOUND` | Record not found or not published |
| 404 | `ARTIFACT_NOT_FOUND` | Artifact not found |
| 404 | `SUBMISSION_NOT_FOUND` | Submission not found |
| 404 | `SETTING_NOT_FOUND` | Unknown setting key |
| 409 | `VERSION_CONFLICT` | Optimistic concurrency violation |
| 409 | `CANNOT_DELETE_PUBLISHED` | Attempt to delete non-draft record |
| 409 | `RECORD_ALREADY_CREATED` | Record already created from contribution |
| 422 | `VALIDATION_ERROR` | Field-level validation failure |
| 422 | `PUBLICATION_GATE_FAILED` | Publication gate check failed |
| 422 | `SUPERSESSION_REASON_REQUIRED` | Supersede without reason |
| 422 | `RETIREMENT_REASON_REQUIRED` | Retire without reason |
| 422 | `REACTIVATION_NOTE_REQUIRED` | Re-activate without note |
| 422 | `CONSENT_REQUIRED` | Required consent not acknowledged |
| 422 | `INVALID_EMAIL` | Invalid email format |
| 422 | `INVALID_URL` | Artifact URL invalid |
| 422 | `ATTRIBUTION_REMOVAL_WARNING` | Attribution preservation warning (soft block) |
| 429 | `RATE_LIMITED` | Rate limit exceeded (SEC-06) |
| 500 | `INTERNAL_ERROR` | Unhandled server error |
| 500 | `SUBMISSION_FAILED` | Submission persistence failure |
| 503 | `CATALOG_UNAVAILABLE` | Database unavailable for catalog |
| 503 | `SEARCH_UNAVAILABLE` | Search service unavailable |
| 503 | `ROUTING_NOT_CONFIGURED` | No routing address in settings (SEC-07) |
| 503 | `SERVICE_UNAVAILABLE` | General dependency unavailable |
| 504 | `GATEWAY_TIMEOUT` | Request exceeded timeout |

---
