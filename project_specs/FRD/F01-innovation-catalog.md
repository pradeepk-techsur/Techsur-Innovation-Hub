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
