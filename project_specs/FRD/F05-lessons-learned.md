---

## F05: Existing Lessons-Learned Content

**PRD Reference:** F5 (F5.1–F5.5) | **Priority:** P0 — Critical (launch content)

**Description:** The Hub must explicitly support existing I&R lessons-learned documents and POC outputs as source material for innovation records. Rather than migrating or rewriting authoritative documents, curators create a structured Innovation Record around each source, extract reusable findings, and link back to the original. This feature defines the curation process for converting existing materials into Hub records. The Audio Security POC is the priority first candidate because its architectural, security, performance, cloud-environment, testing, and production-readiness findings exercise the full content model across all record sections and both perspectives.

---

### Terminology

- **Source Document** — The authoritative lessons-learned document, POC report, or other existing artifact that serves as the evidentiary basis for the Innovation Record. The Hub does not migrate or copy this document; it links to it.
- **Extraction** — The curator activity of reading a source document and populating Innovation Record fields from it. Extraction is a human curation activity — not automated processing.
- **Source Basis** — The `source_basis` field on the Innovation Record that records what authoritative source(s) the record was derived from.
- **Audio Security POC** — TSIO Innovation & Research's proof-of-concept project on court audio security (defense-in-depth architecture, GPU/CPU separation, Azure Government Cloud constraints, performance limitations, testing gaps, security recommendations, production-readiness requirements). Priority first record.

---

### Sub-features

- **F5.1** — Treat the existing source document as the source of record (no migration)
- **F5.2** — Create a structured Innovation Record around the source and extract key findings
- **F5.3** — Apply full metadata, maturity, review status, ownership, attribution, and review-date
- **F5.4** — Link back to authoritative source; make record discoverable via problem-oriented search
- **F5.5** — Audio Security POC as priority first candidate; exercises full content model

---

### Process

1. **Curator identifies a source document** — identifies an existing I&R lessons-learned document, POC report, or other authoritative source to curate into the Hub.
2. **Curator creates a new Draft Innovation Record** (F9.3) — opens the record creation form.
3. **Curator populates record fields from source material** — uses the source document as the basis for all record fields:
   - `problem_statement` — derived from the source's problem framing.
   - `hypothesis_or_objective` — derived from the source's stated objective.
   - `outcome_summary`, `what_worked`, `what_did_not_work` — derived from findings sections.
   - All `findings_*` fields — extracted from the source's findings, recommendations, and lessons learned.
   - `source_basis` — populated with a precise reference to the source document (title, date, author/office, location).
   - `technologies_used` — extracted from the source's technology descriptions.
   - `mission_areas`, `technology_areas`, `tags` — curator-assigned based on content review.
4. **Curator adds an artifact link** (F9.5, F3.8) — adds the source document as an artifact with:
   - `artifact_type` = `lessons_learned` (or `poc_report` as appropriate).
   - `name` = precise document title.
   - `url` = authoritative source URL (SharePoint, Git, network location).
   - `access_notes` = any access restrictions (e.g., "AO internal SharePoint — requires AO network").
   - `is_restricted` = true if the document is not publicly accessible.
5. **Curator assigns governance metadata:**
   - `maturity` — based on what the work has demonstrated (e.g., `experiment_poc` for the Audio Security POC).
   - `review_statuses` — applies statuses that have actually been completed (e.g., `technically_reviewed`, `security_reviewed` if a security review occurred).
   - `contributing_offices` — the office(s) that produced the source work.
   - `owner_steward` — current I&R point of contact or project lead.
   - `last_reviewed_date` — date the curator reviewed the source document and completed extraction.
   - `attribution_statement` — formal credit for the originating team.
6. **Curator assigns applicable disclaimer** — selects or writes the trust statement appropriate to the maturity stage (e.g., for a POC: "This record summarizes a proof-of-concept effort. The findings are not production-ready and do not constitute an approval for deployment.").
7. **Curator configures next actions** (F3.9) — selects appropriate CTAs for the record (e.g., for the Audio Security POC: "Request Technical Guidance", "Discuss a Related Use Case").
8. **Curator validates publication gate** — the system checks that all required publication gate fields are populated before allowing publication.
9. **Curator publishes the record** (F9.9) — record transitions to `published` state and becomes discoverable via catalog and search.

---

### Audio Security POC — Specific Content Requirements (F5.5)

The Audio Security POC record must exercise the following content areas of the Innovation Record model:

| Record Section | Audio Security POC Content |
|---|---|
| Problem & Context | Protecting court audio recordings from unauthorized access and interception; court audio security requirements |
| What Was Explored | Defense-in-depth architecture; GPU/CPU service separation; Azure Government Cloud deployment |
| Outcome & Evidence | Findings on architecture feasibility, Azure Gov constraints, performance limitations, security posture |
| Key Findings — Architectural | Defense-in-depth pattern; GPU/CPU separation design |
| Key Findings — Security | Security recommendations; identified gaps |
| Key Findings — Cloud/Platform | Azure Government Cloud-specific constraints and limitations |
| Key Findings — Performance | Performance limitations discovered during POC |
| Key Findings — Testing | Testing gaps identified; what was not tested |
| Key Findings — Operational | Production-readiness requirements identified |
| Maturity | `experiment_poc` — a controlled effort that produced findings; not production-ready |
| Review Status | At minimum `technically_reviewed`; `security_reviewed` if a security review was performed |
| Reuse Guidance | What is architecturally reusable; what requires adaptation; what is not yet ready for production |
| Artifacts | Link to the authoritative lessons-learned document in its source location |
| Applicable Disclaimer | Must clearly state POC ≠ production-ready |

---

### Inputs

All inputs are the Innovation Record field set defined in F03a and F03b. No additional fields are required by F5 beyond what is already defined on the Innovation Record.

The following fields are specifically emphasized for lessons-learned source curation:
- `source_basis` — **Publication gate field**; must reference the authoritative source precisely.
- `attribution_statement` — **Publication gate field**; must credit the originating team.
- Artifact with `artifact_type = lessons_learned` or `poc_report` — strongly expected but not a publication gate hard requirement (curator may note inaccessible source in `source_basis` and `access_notes`).

---

### Validation

- `source_basis` must be populated (publication gate) and must reference a real identifiable source (not a placeholder string like "TBD").
- If the source document is restricted and no public URL is available, `is_restricted = true` must be set on the artifact; the source must still be named in `source_basis` and `access_notes`.
- `maturity` must be accurately set; for a POC, `experiment_poc` is the expected default. If the curator assigns `production_validated` to a POC-sourced record, the system should surface a curator-visible warning (not a hard block): "You are publishing a POC-sourced record with maturity 'Production / Validated Pattern'. Please confirm this is correct."
- `applicable_disclaimer` must contain language appropriate to the maturity stage; the system must provide maturity-specific disclaimer templates (F9.16) to help curators choose the appropriate text.

---

### Error States

| Scenario | Behavior | Notes |
|---|---|---|
| Source document URL unreachable | System validates URL format but does not verify reachability at save time. Curator is responsible for providing a valid URL. Broken links should be surfaced as part of periodic curator review. | The Hub links; it does not crawl. |
| Maturity/disclaimer mismatch warning | Curator-visible warning on the publishing form; not a hard block | Prevents accidental maturity/trust mismatch |
| Missing `source_basis` at publication | Publication gate fails with: "Source Basis is required before publishing." | |

---

### API Surface (this feature)

F5 does not introduce new API endpoints. It uses the same Innovation Record and Artifact APIs defined in F03a/F03b and F9. See `Y1b-api-curator.md` §Records.

---

### Schema Surface (this feature)

Uses `innovation_records` and `artifacts` tables. No additional tables. See `Y0a-schema-core.md`.
