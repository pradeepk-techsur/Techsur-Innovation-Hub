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
