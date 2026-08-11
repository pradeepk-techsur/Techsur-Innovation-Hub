## Coverage Analysis

### Persona Coverage (v1)

| Persona | Primary Journey | Stories Served | JTBD Satisfied |
|---------|----------------|----------------|----------------|
| PER-01 Margaret Holloway (Decision-Maker) | JRN-01.1: Discover and Act on Existing Innovation | US-1.1, US-1.2, US-1.3, US-2.1, US-2.3, US-3.1, US-3.2, US-3.3, US-3.5, US-4.1, US-4.2, US-5.1, US-8.1, US-8.2 | JTBD-01.1 (full), JTBD-01.2 (full), JTBD-01.3 (full) |
| PER-02 David Tran (Operational Leader) | JRN-02.1: Assess and Initiate Adoption; JRN-04.2: Submit Opportunity | US-1.1, US-1.2, US-1.3, US-2.1, US-2.3, US-3.1, US-3.3, US-3.4, US-3.5, US-3.7, US-4.2, US-6.1, US-6.2, US-6.3, US-8.1, US-8.3 | JTBD-02.1 (full), JTBD-02.2 (full) |
| PER-03 Priya Suresh (Technical Adopter) | JRN-03.1: Evaluate Technical Reusability | US-1.1, US-1.2, US-2.1, US-2.2, US-3.3, US-3.4, US-3.6, US-4.1, US-4.3, US-5.1, US-8.1 | JTBD-03.1 (full), JTBD-03.2 (full) |
| PER-04 Carlos Rivera (Innovation Contributor) | JRN-04.1: Share Existing Innovation; JRN-04.2: Submit Opportunity | US-2.1, US-6.1, US-6.2, US-6.3, US-7.1, US-7.2, US-7.3 | JTBD-04.1 (full), JTBD-04.2 (full) |
| PER-05 Jasmine Okafor (I&R Curator) | JRN-05.1: Curate and Publish; JRN-05.2: Daily Operations | US-5.2, US-5.3, US-9.1 through US-9.14 (14 stories) | JTBD-05.1 (full), JTBD-05.2 (full) |

All 5 personas are fully served in v1. All 11 JTBD jobs are addressed.

---

### JTBD Coverage (v1)

| JTBD ID | Persona | Release | Stories | NaC Count |
|---------|---------|---------|---------|-----------|
| JTBD-01.1 | PER-01 | v1 | US-1.1, US-1.2, US-2.1, US-2.3, US-3.1, US-3.2, US-3.3, US-3.5 | 8 |
| JTBD-01.2 | PER-01 | v1 | US-4.1, US-4.2, US-4.3 | 3 |
| JTBD-01.3 | PER-01 | v1 | US-8.1, US-8.2, US-8.3 | 3 |
| JTBD-02.1 | PER-02 | v1 | US-1.3, US-2.1, US-2.3, US-3.4, US-3.5, US-4.2, US-8.1, US-8.3 | 7 |
| JTBD-02.2 | PER-02 | v1 | US-6.1, US-6.2, US-6.3 | 3 |
| JTBD-03.1 | PER-03 | v1 | US-3.4, US-3.6, US-4.3, US-5.1, US-8.1 | 5 |
| JTBD-03.2 | PER-03 | v1 | US-1.1, US-1.2, US-2.2, US-4.1, US-9.5 | 5 |
| JTBD-04.1 | PER-04 | v1 | US-2.1, US-7.1, US-7.2, US-7.3 | 4 |
| JTBD-04.2 | PER-04 | v1 | US-6.1, US-6.2, US-6.3 | 3 |
| JTBD-05.1 | PER-05 | v1 | US-5.2, US-5.3, US-9.3, US-9.4, US-9.5, US-9.6, US-9.7, US-9.8, US-9.9, US-9.14 | 10 |
| JTBD-05.2 | PER-05 | v1 | US-9.1, US-9.2, US-9.4, US-9.9, US-9.10, US-9.11, US-9.12, US-9.13 | 8 |

---

### Gap Analysis

**JTBD without stories:** None. All 11 JTBD jobs are addressed by at least one story in v1.

**Journey stages without feature coverage:** None. All journey stages across JRN-01.1, JRN-02.1, JRN-03.1, JRN-04.1, JRN-04.2, JRN-05.1, and JRN-05.2 are covered by at least one story.

**Orphan stories (not mapped to a journey stage):** None. All 42 stories (US-1.1 through US-9.14) are mapped to at least one journey stage. Cross-journey coverage notes:

- **US-2.2** (faceted filters) maps to JRN-03.1 Search & Filter as primary; also serves JRN-01.1 Scan Results and JRN-02.1 Scan Catalog
- **US-3.3** (maturity and readiness) maps to JRN-01.1 Assess, JRN-02.1 Assess Adoption, and JRN-03.1 Switch to Technical Perspective — it is a shared cross-journey story
- **US-3.7** (contextual next action) maps to JRN-01.1 Act, JRN-02.1 Act, and JRN-03.1 Request Guidance
- **US-8.1** (request demo/adoption) maps to the Act stage of JRN-01.1, JRN-02.1, and JRN-03.1 — it is the single engagement routing story serving three primary journeys
- **US-9.4** (edit record and manage artifacts) maps to JRN-05.1 Apply Content Model and JRN-05.2 Update Stale Record

**Personas without a complete journey in v1:** None. Every persona has at minimum one end-to-end journey path completed in v1.

**Post-MVP deferred items:** None. The PRD §14 explicitly lists items that are out of scope and none map to stories in the UserStories document. No stories were deferred from v1 — all 42 are MVP.

---
