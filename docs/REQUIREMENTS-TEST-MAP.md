# Requirements → Test Traceability Map

Every v1 requirement ID mapped to its test file and test name.

**Total requirements:** 79
**Total test coverage points:** See individual columns below

---

## AUTH — Authentication and Authorization

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| AUTH-01 | Anonymous users can browse catalog without login | e2e/requirements/auth.req.spec.ts | [AUTH-01] Anonymous users can browse catalog without login |
| AUTH-01 | Anonymous users can view published records without login | e2e/requirements/auth.req.spec.ts | [AUTH-01] Anonymous users can view published records without login |
| AUTH-01 | Anonymous users can use search without login | e2e/requirements/auth.req.spec.ts | [AUTH-01] Anonymous users can use search without login |
| AUTH-02 | Curator role required for record management | e2e/requirements/auth.req.spec.ts | [AUTH-02] Curator role required for record management — unauthenticated returns 401 |
| AUTH-02 | Curator role required for record management | e2e/requirements/auth.req.spec.ts | [AUTH-02] Curator role required for record management — stakeholder returns 403 |
| AUTH-03 | Admin role required for settings — curator returns 403 | e2e/requirements/auth.req.spec.ts | [AUTH-03] Admin role required for settings — curator returns 403 |
| AUTH-04 | Unauthenticated users cannot access protected functions | e2e/requirements/auth.req.spec.ts | [AUTH-04] Unauthenticated users cannot access protected functions |
| AUTH-05 | Auth decisions are auditable — login creates audit event | e2e/requirements/auth.req.spec.ts | [AUTH-05] Auth decisions are auditable — login creates audit event |
| AUTH-06 | Three roles exist: anonymous browse works | e2e/requirements/auth.req.spec.ts | [AUTH-06] Three roles exist: anonymous browse works |
| AUTH-06 | Three roles exist: curator access works | e2e/requirements/auth.req.spec.ts | [AUTH-06] Three roles exist: curator access works |
| AUTH-07 | Dev auth stub raises fatal error in production | e2e/requirements/auth.req.spec.ts | [AUTH-07] Dev auth stub raises fatal error in production — env guard present in source |
| AUTH-08 | Stakeholder login is available | e2e/requirements/auth.req.spec.ts | [AUTH-08] Stakeholder login is available |
| AUTH-09 | Unauthenticated access to /submit-opportunity redirects | e2e/requirements/auth.req.spec.ts | [AUTH-09] Unauthenticated access to /submit-opportunity redirects to login |
| AUTH-09 | Unauthenticated access to /submit-contribution redirects | e2e/requirements/auth.req.spec.ts | [AUTH-09] Unauthenticated access to /submit-contribution redirects to login |
| AUTH-10 | User session includes name, office, email | e2e/requirements/auth.req.spec.ts | [AUTH-10] User session includes name, office, email |

---

## F1 — Innovation Catalog

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F1.1 | User can browse a catalog of curated innovation records | e2e/requirements/f1-catalog.req.spec.ts | [F1.1] User can browse a catalog of curated innovation records |
| F1.2 | Each catalog card shows title and one-sentence summary | e2e/requirements/f1-catalog.req.spec.ts | [F1.2] Each catalog card shows title and one-sentence summary |
| F1.3 | Each card shows maturity badge | e2e/requirements/f1-catalog.req.spec.ts | [F1.3] Each card shows maturity badge |
| F1.3 | Each card shows review status badge | e2e/requirements/f1-catalog.req.spec.ts | [F1.3] Each card shows review status badge |
| F1.3 | Each card shows contributing office | e2e/requirements/f1-catalog.req.spec.ts | [F1.3] Each card shows contributing office |
| F1.4 | Each card shows engagement indicator when configured | e2e/requirements/f1-catalog.req.spec.ts | [F1.4] Each card shows engagement indicator when configured |
| F1.5 | Each card shows last-reviewed date | e2e/requirements/f1-catalog.req.spec.ts | [F1.5] Each card shows last-reviewed date |
| F1.6 | Maturity badge and review status badge are visually distinct | e2e/requirements/f1-catalog.req.spec.ts | [F1.6] Maturity badge and review status badge are visually distinct |

---

## F2 — Search and Discovery

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F2.1 | User can search without knowing internal project names | e2e/requirements/f2-search.req.spec.ts | [F2.1] User can search without knowing internal project names |
| F2.1 | Search page accessible from main navigation | e2e/requirements/f2-search.req.spec.ts | [F2.1] Search page accessible from main navigation |
| F2.2 | Search API covers problem statements and findings | e2e/requirements/f2-search.req.spec.ts | [F2.2] Search API covers problem statements and findings |
| F2.3 | Filter by maturity is supported | e2e/requirements/f2-search.req.spec.ts | [F2.3] Filter by maturity is supported |
| F2.3 | Facets endpoint returns all filter dimensions | e2e/requirements/f2-search.req.spec.ts | [F2.3] Facets endpoint returns all filter dimensions |
| F2.4 | Every search result includes maturity and review_statuses | e2e/requirements/f2-search.req.spec.ts | [F2.4] Every search result includes maturity and review_statuses |
| F2.5 | Problem-language query surfaces relevant records | e2e/requirements/f2-search.req.spec.ts | [F2.5] Problem-language query surfaces relevant records |

---

## F3 — Innovation Record

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F3.1 | Record explains problem and context | e2e/requirements/f3-record.req.spec.ts | [F3.1] Record explains problem and context |
| F3.2 | Record explains what was explored | e2e/requirements/f3-record.req.spec.ts | [F3.2] Record explains what was explored |
| F3.3 | Record explains outcome and evidence | e2e/requirements/f3-record.req.spec.ts | [F3.3] Record explains outcome and evidence |
| F3.4 | Record surfaces key findings | e2e/requirements/f3-record.req.spec.ts | [F3.4] Record surfaces key findings |
| F3.5 | Record shows maturity and readiness with trust banner | e2e/requirements/f3-record.req.spec.ts | [F3.5] Record shows maturity and readiness with trust banner |
| F3.6 | Record provides reuse guidance | e2e/requirements/f3-record.req.spec.ts | [F3.6] Record provides reuse guidance |
| F3.7 | Record identifies ownership and attribution | e2e/requirements/f3-record.req.spec.ts | [F3.7] Record identifies ownership and attribution |
| F3.8 | Artifacts section is present | e2e/requirements/f3-record.req.spec.ts | [F3.8] Artifacts section is present |
| F3.8 | Restricted artifact URLs not exposed in API | e2e/requirements/f3-record.req.spec.ts | [F3.8] Restricted artifact URLs not exposed in API |
| F3.9 | Record provides next action CTAs | e2e/requirements/f3-record.req.spec.ts | [F3.9] Record provides next action CTAs |

---

## F4 — Executive and Technical Perspectives

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F4.1 | Single record supports both perspectives — toggle visible | e2e/requirements/f4-perspectives.req.spec.ts | [F4.1] Single record supports both perspectives — toggle visible |
| F4.1 | No duplicate source records — single API call serves both | e2e/requirements/f4-perspectives.req.spec.ts | [F4.1] No duplicate source records — single API call serves both views |
| F4.2 | Executive perspective shows problem, outcome, ownership | e2e/requirements/f4-perspectives.req.spec.ts | [F4.2] Executive perspective shows problem, outcome, ownership |
| F4.3 | Technical perspective shows architecture and limitations | e2e/requirements/f4-perspectives.req.spec.ts | [F4.3] Technical perspective shows architecture and limitations |
| F4.4 | Trust banner visible in both perspectives | e2e/requirements/f4-perspectives.req.spec.ts | [F4.4] Trust banner visible in both perspectives |

---

## F5 — Existing Lessons-Learned Content

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F5.1 | Lessons-learned source is linked, not migrated | e2e/requirements/f5-lessons-learned.req.spec.ts | [F5.1] Lessons-learned source is linked, not migrated — source_basis field present |
| F5.2 | Structured record wraps the source and extracts findings | e2e/requirements/f5-lessons-learned.req.spec.ts | [F5.2] Structured record wraps the source and extracts findings |
| F5.3 | Metadata applied — maturity, review status, last_reviewed | e2e/requirements/f5-lessons-learned.req.spec.ts | [F5.3] Metadata applied — maturity, review status, last_reviewed_date present |
| F5.4 | Record is discoverable via problem-oriented search | e2e/requirements/f5-lessons-learned.req.spec.ts | [F5.4] Record is discoverable via problem-oriented search |
| F5.5 | Source basis banner visible on record page | e2e/requirements/f5-lessons-learned.req.spec.ts | [F5.5] Source basis banner visible on record page |

---

## F6 — Opportunity Submission

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F6.1 | Submission flow starts with problem description | e2e/requirements/f6-opportunity.req.spec.ts | [F6.1] Submission flow starts with problem description, not application request |
| F6.2 | Form captures all required fields | e2e/requirements/f6-opportunity.req.spec.ts | [F6.2] Form captures all required fields |
| F6.3 | Request type selector present | e2e/requirements/f6-opportunity.req.spec.ts | [F6.3] Request type selector present |
| F6.4 | Non-acceptance notice explicitly stated | e2e/requirements/f6-opportunity.req.spec.ts | [F6.4] Non-acceptance notice explicitly stated |
| F6.5 | Submission persisted — API returns reference number | e2e/requirements/f6-opportunity.req.spec.ts | [F6.5] Submission persisted — API returns reference number |

---

## F7 — Share Existing Innovation Work

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F7.1 | Separate contribution flow distinct from opportunity | e2e/requirements/f7-contribution.req.spec.ts | [F7.1] Separate contribution flow distinct from opportunity submission |
| F7.2 | Attribution fields present and required | e2e/requirements/f7-contribution.req.spec.ts | [F7.2] Attribution fields present and required |
| F7.3 | Attribution preserved — API requires contributingOffice | e2e/requirements/f7-contribution.req.spec.ts | [F7.3] Attribution preserved — API requires contributingOffice |
| F7.4 | Non-endorsement language present on contribution page | e2e/requirements/f7-contribution.req.spec.ts | [F7.4] Non-endorsement language present on contribution page |

---

## F8 — Engagement Routing

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F8.1 | CTAs visible on record detail page | e2e/requirements/f8-engagement.req.spec.ts | [F8.1] CTAs visible on record detail page |
| F8.2 | Engagement modal captures requester info | e2e/requirements/f8-engagement.req.spec.ts | [F8.2] Engagement modal captures requester info |
| F8.3 | Engagement persisted before email — API returns ref num | e2e/requirements/f8-engagement.req.spec.ts | [F8.3] Engagement persisted before email — API returns reference number |
| F8.4 | Routing address configurable from hub_settings | e2e/requirements/f8-engagement.req.spec.ts | [F8.4] Routing address configurable from hub_settings |
| F8.5 | Default routing address is TSIO I&R address | e2e/requirements/f8-engagement.req.spec.ts | [F8.5] Default routing address is TSIO I&R address |
| F8.6 | Engagement without consent returns 422 | e2e/requirements/f8-engagement.req.spec.ts | [F8.6] Engagement without consent returns 422 |

---

## F9 — Curation and Administration

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| F9.1 | Curator dashboard returns live counts | e2e/requirements/f9-curation.req.spec.ts | [F9.1] Curator dashboard returns live counts |
| F9.2 | Record management list returns records across all states | e2e/requirements/f9-curation.req.spec.ts | [F9.2] Record management list returns records across all states |
| F9.3 | Curator can create a draft record | e2e/requirements/f9-curation.req.spec.ts | [F9.3] Curator can create a draft record |
| F9.4 | Curator can edit record fields with version | e2e/requirements/f9-curation.req.spec.ts | [F9.4] Curator can edit record fields with version |
| F9.5 | Artifact can be added to a record | e2e/requirements/f9-curation.req.spec.ts | [F9.5] Artifact can be added to a record |
| F9.6 | Maturity can be assigned independently | e2e/requirements/f9-curation.req.spec.ts | [F9.6] Maturity can be assigned independently |
| F9.7 | Review status independent from maturity | e2e/requirements/f9-curation.req.spec.ts | [F9.7] Review status independent from maturity — both can be set separately |
| F9.8 | Attribution fields can be set on a record | e2e/requirements/f9-curation.req.spec.ts | [F9.8] Attribution fields can be set on a record |
| F9.9 | Publication lifecycle supports draft to archived | e2e/requirements/f9-curation.req.spec.ts | [F9.9] Publication lifecycle supports draft to archived transitions |
| F9.10 | Publication gate blocks publish when required fields | e2e/requirements/f9-curation.req.spec.ts | [F9.10] Publication gate blocks publish when required fields missing |
| F9.11 | Audit history returns events for a record | e2e/requirements/f9-curation.req.spec.ts | [F9.11] Audit history returns events for a record |
| F9.12 | Opportunity submission queue accessible to curator | e2e/requirements/f9-curation.req.spec.ts | [F9.12] Opportunity submission queue accessible to curator |
| F9.13 | Contribution submission queue accessible to curator | e2e/requirements/f9-curation.req.spec.ts | [F9.13] Contribution submission queue accessible to curator |
| F9.14 | Engagement activity accessible to curator | e2e/requirements/f9-curation.req.spec.ts | [F9.14] Engagement activity accessible to curator |
| F9.15 | Settings management — admin-only update works | e2e/requirements/f9-curation.req.spec.ts | [F9.15] Settings management — admin-only update works |
| F9.16 | Content model reference returns definitions | e2e/requirements/f9-curation.req.spec.ts | [F9.16] Content model reference returns definitions |

---

## IA — Information Architecture

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| IA-01 | All primary nav links resolve without 404 | e2e/requirements/ia-seed.req.spec.ts | [IA-01] All primary nav links resolve without 404 |
| IA-02 | Catalog, search, record routes all return 200 | e2e/requirements/ia-seed.req.spec.ts | [IA-02] Catalog, search, record routes all return 200 |
| IA-03 | NAVIGATION-MAP.md exists | e2e/requirements/ia-seed.req.spec.ts | [IA-03] NAVIGATION-MAP.md exists |
| IA-04 | Breadcrumb present on catalog page | e2e/requirements/ia-seed.req.spec.ts | [IA-04] Breadcrumb present on catalog page |
| IA-04 | Breadcrumb present on record detail page | e2e/requirements/ia-seed.req.spec.ts | [IA-04] Breadcrumb present on record detail page |
| IA-05 | Logged-out header shows Sign In link | e2e/requirements/ia-seed.req.spec.ts | [IA-05] Logged-out header shows Sign In link |
| IA-05 | Logged-in header shows user name and Sign Out | e2e/requirements/ia-seed.req.spec.ts | [IA-05] Logged-in header shows user name and Sign Out |

---

## SEED — Initial Content and Launch Acceptance

| REQ-ID | Description (first 60 chars) | Test File | Test Name |
|--------|------------------------------|-----------|-----------|
| SEED-01 | At least 8 published innovation records exist | e2e/requirements/ia-seed.req.spec.ts | [SEED-01] At least 8 published innovation records exist |
| SEED-02 | Records span multiple mission areas | e2e/requirements/ia-seed.req.spec.ts | [SEED-02] Records span multiple mission areas |
| SEED-03 | Records span multiple technology areas | e2e/requirements/ia-seed.req.spec.ts | [SEED-03] Records span multiple technology areas |
| SEED-04 | Records span all 6 maturity levels | e2e/requirements/ia-seed.req.spec.ts | [SEED-04] Records span all 6 maturity levels |
| SEED-05 | Records span multiple review statuses | e2e/requirements/ia-seed.req.spec.ts | [SEED-05] Records span multiple review statuses |
| SEED-06 | Records span multiple contributing offices | e2e/requirements/ia-seed.req.spec.ts | [SEED-06] Records span multiple contributing offices |
| SEED-07 | At least 1 record has technical findings and artifacts | e2e/requirements/ia-seed.req.spec.ts | [SEED-07] At least 1 record has technical findings and artifact links |
| SEED-08 | At least 1 record supports executive decision discussion | e2e/requirements/ia-seed.req.spec.ts | [SEED-08] At least 1 record supports executive decision discussion |
| SEED-09 | At least 1 record seeking adoption or collaboration | e2e/requirements/ia-seed.req.spec.ts | [SEED-09] At least 1 record seeking adoption or collaboration |
| SEED-10 | At least 1 archived/retired record exists | e2e/requirements/ia-seed.req.spec.ts | [SEED-10] At least 1 archived/retired record exists |
| SEED-11 | All published records pass the 15-field gate check | e2e/requirements/ia-seed.req.spec.ts | [SEED-11] All published records pass the 15-field gate check |
| SEED-12 | Audio Security POC seeded with full content model | e2e/requirements/ia-seed.req.spec.ts | [SEED-12] Audio Security POC seeded with full content model |

---

## Coverage Summary

| Category | Requirements | Tests |
|----------|-------------|-------|
| AUTH | 10 | 15 |
| F1 | 6 | 8 |
| F2 | 5 | 7 |
| F3 | 9 | 10 |
| F4 | 4 | 5 |
| F5 | 5 | 5 |
| F6 | 5 | 5 |
| F7 | 4 | 4 |
| F8 | 6 | 6 |
| F9 | 16 | 16 |
| IA | 5 | 7 |
| SEED | 12 | 12 |
| **Total** | **87** | **100** |

*Note: Some requirements have multiple tests to cover distinct sub-scenarios. This provides more thorough coverage without inflating the requirement count.*

---

*Generated: 2026-08-14*
*Spec files: `e2e/requirements/*.req.spec.ts`*
*Runner: `e2e/requirements/run-all.ts`*
