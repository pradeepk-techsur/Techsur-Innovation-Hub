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
