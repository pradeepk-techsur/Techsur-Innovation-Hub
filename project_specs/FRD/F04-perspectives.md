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
