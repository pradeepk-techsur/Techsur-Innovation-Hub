---

## F02: Search and Discovery

**PRD Reference:** F2 (F2.1–F2.5) | **Priority:** P0 — Critical

**Description:** Search and Discovery enables stakeholders to find relevant innovation work using mission-problem language rather than internal project names, folder paths, or I&R terminology. It supports both free-text search across record content and faceted filtering by metadata dimensions. Search results must preserve the same trust information (maturity, review status, lifecycle state) visible in the catalog. A user who searches "protect court audio" must be able to surface the Audio Security POC record without knowing its formal title.

---

### Terminology

- **Problem-Oriented Search** — Search that indexes the language of stakeholder problems (mission area, workflow friction, user impact) rather than only formal titles or project identifiers.
- **Faceted Filter** — A sidebar or filter panel allowing progressive narrowing of results by discrete metadata categories.
- **Search Index** — The set of fields indexed for full-text matching.
- **Filter Dimension** — A discrete metadata category available as a filter facet.

---

### Sub-features

- **F2.1** — Problem-oriented full-text search
- **F2.2** — Search index covers titles, problem statements, summaries, findings, tags, mission areas, technology areas, and artifact names
- **F2.3** — Faceted filtering by mission area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and lifecycle state
- **F2.4** — Trust information preserved in search results (maturity, review status, lifecycle state)
- **F2.5** — Problem-language queries surface relevant records when content and metadata support the relationship

---

### Process

1. User types a query into the search box and/or selects filter values from the filter panel.
2. System executes full-text search against the search index fields (see §Search Index).
3. System applies any active facet filters as AND conditions on top of the full-text match (each filter within the same dimension is OR; across dimensions is AND).
4. System returns matching records in relevance-ranked order (full-text relevance primary; recency secondary for equal-score results).
5. System renders result cards with the same trust fields as the catalog (F1) — maturity badge, review status badge(s), lifecycle state when non-Published, contributing office, last-reviewed date.
6. User may refine query or adjust filters without losing prior context.
7. User clicks a result card to navigate to the full record detail (F3).
8. If no results match, system displays a no-results state with search suggestions (see §Error States).

---

### Search Index

All of the following fields must be included in the full-text search index. Fields marked **High Weight** contribute proportionally more to result ranking.

| Field | Index | Weight | Notes |
|---|---|---|---|
| `title` | Yes | High | Record title |
| `summary` | Yes | High | One-sentence problem/outcome summary |
| `problem_statement` | Yes | High | Full problem and context narrative |
| `what_was_explored` | Yes | Medium | Hypothesis, capability, approach, technologies |
| `outcome_summary` | Yes | Medium | What was demonstrated and what was learned |
| `key_findings` | Yes | High | Reusable findings; often contains domain-specific terms |
| `tags` | Yes | High | Curator-assigned free-form tags |
| `mission_areas` | Yes | High | Controlled vocabulary mission area labels |
| `technology_areas` | Yes | High | Controlled vocabulary technology area labels |
| `reuse_guidance` | Yes | Medium | What can be reused, adapted, or avoided |
| `production_readiness_gaps` | Yes | Medium | What is not yet ready |
| `next_action_description` | Yes | Low | Contextual next-step text |
| `artifact_names` | Yes | Medium | Names of linked artifacts where access is not restricted |
| `contributing_offices` | Yes | Low | Office names |
| `contributor_names` | Yes | Low | Contributor names |

Fields **not** indexed: internal IDs, raw dates, access-restricted artifact content, submission contact information.

---

### Filter Dimensions (F2.3)

Each filter dimension maps to a controlled vocabulary or field set. Filters within the same dimension are combined with OR logic; filters across dimensions are combined with AND logic.

| Filter Dimension | Source Field(s) | Type | Notes |
|---|---|---|---|
| Mission / Business Area | `mission_areas` | Multi-select | Controlled taxonomy; baselined during discovery |
| Problem Type | `problem_type_tags` | Multi-select | Controlled taxonomy; e.g., "Security", "Accessibility", "Cost Reduction" |
| Technology | `technology_areas` | Multi-select | Controlled taxonomy; e.g., "Azure Government Cloud", "AI/ML", "Audio" |
| Maturity | `maturity` | Multi-select | Uses canonical maturity values from header |
| Review Status | `review_statuses` | Multi-select | Uses canonical review status values from header |
| Contributing Office | `contributing_offices` | Multi-select | Free-form field; values derive from records |
| Reuse Potential | `reuse_potential` | Single-select | Values: `high`, `moderate`, `low`, `not_assessed` |
| Artifact Availability | `has_artifacts` | Boolean toggle | True = at least one artifact link exists |
| Lifecycle State | `publication_state` | Multi-select | Public users: Published only (default); includes Superseded, Archived when explicitly selected |

---

### Search Behavior Rules

- **F2.1 — Problem-oriented:** The search index must include the `problem_statement` and `key_findings` fields with high weight so that problem-language queries (e.g., "audio security", "protect court recordings", "GPU separation") can surface records without requiring exact title matches.
- **F2.4 — Trust preserved:** Every result card must display maturity badge, review status badge(s), and lifecycle state indicator (if non-Published). Trust information must not be omitted from result display.
- **F2.5 — Problem-language resolution:** When a query expressed in mission problem language matches content in `problem_statement`, `key_findings`, or `tags`, those fields' higher weight must surface the record ahead of tangential title-only matches.
- **Lifecycle scope:** By default, search and filter return only Published records. Anonymous users cannot filter to Draft or Submitted-for-Review records. Curators in the curator view may search across all lifecycle states.
- **Empty query:** If the user submits an empty search query with no filters, the system returns the full catalog (equivalent to the default catalog view).
- **Partial matches:** The search engine should support partial word matching (prefix search) for technology and domain terms. Exact phrase matching should be supported via quoted queries.
- **Case insensitivity:** Search must be case-insensitive.
- **Minimum query length:** 2 characters required to trigger a search. Single-character queries return an inline validation message: "Please enter at least 2 characters to search."

---

### Inputs

| Input | Type | Required | Constraints |
|---|---|---|---|
| `q` (query string) | string | No | Min 2 chars when provided; max 500 chars; sanitized for XSS |
| `mission_areas[]` | string[] | No | Values must be from taxonomy; unknown values ignored |
| `problem_type_tags[]` | string[] | No | Values must be from taxonomy; unknown values ignored |
| `technology_areas[]` | string[] | No | Values must be from taxonomy; unknown values ignored |
| `maturity[]` | string[] | No | Values must be from canonical maturity vocabulary |
| `review_statuses[]` | string[] | No | Values must be from canonical review status vocabulary |
| `contributing_offices[]` | string[] | No | Free-form; matched case-insensitively |
| `reuse_potential` | string | No | One of: `high`, `moderate`, `low`, `not_assessed` |
| `has_artifacts` | boolean | No | `true` or `false` |
| `publication_state[]` | string[] | No | Anonymous: only `published` accepted; Curator: any state |
| `page` | integer | No | Default 1; min 1 |
| `page_size` | integer | No | Default 20; max 100 |
| `sort` | string | No | One of: `relevance` (default), `last_reviewed_desc`, `title_asc` |

---

### Outputs

- Paginated list of matching catalog cards, each with the same fields as F01 catalog cards.
- Total result count displayed above results (e.g., "14 results for 'audio security'").
- Active filters displayed as removable chips/tags so the user can see and clear individual filters.
- Facet counts shown per filter option (e.g., "Technology / Azure (3)") to indicate how many results each filter would include.
- Relevance-ranked by default; secondary sort by `last_reviewed_date` descending for ties.

---

### Validation

- Query string: sanitize for injection; max 500 characters; min 2 characters when provided.
- Unknown filter values (not in taxonomy) are silently ignored on the query (not returned as an error) but are not reflected in active-filter chips.
- `page` must be ≥ 1 and ≤ total available pages; out-of-range page returns the last available page.
- `page_size` must be between 1 and 100; values outside this range are clamped silently.

---

### Error States

| Scenario | HTTP Status | Error Code | User-Facing Message | Notes |
|---|---|---|---|---|
| Query < 2 characters | 200 (inline) | — | "Please enter at least 2 characters to search." | Client-side validation; no server round-trip needed |
| Query > 500 characters | 400 | `QUERY_TOO_LONG` | "Your search query is too long. Please shorten it." | Server validates too |
| No results found | 200 | — | "No records matched your search. Try different keywords or remove some filters." | Not an error; show suggestions |
| Search service unavailable | 503 | `SEARCH_UNAVAILABLE` | "Search is temporarily unavailable. You can browse the catalog instead." | Provide link to catalog |
| Invalid filter value (server) | 400 | `INVALID_FILTER` | "One or more filter values were not recognized." | For API consumers only |

---

### API Surface (this feature)

See `Y1a-api-public.md` §Search for full schema.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/search` | None (public) | Full-text and filtered search across published records |
| GET | `/api/v1/search/facets` | None (public) | Returns available facet values and counts for current result set |

---

### Schema Surface (this feature)

Uses table `innovation_records` (all indexed fields). No separate search-specific table — the search index is built from `innovation_records` and its related tables. See `Y0a-schema-core.md`.
