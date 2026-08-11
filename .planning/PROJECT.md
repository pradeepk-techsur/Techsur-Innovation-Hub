# TechSur Innovation Hub (TSIO Innovation Hub MVP)

## What This Is

The TSIO Innovation Hub is a curated, governed web portal that transforms scattered Judiciary innovation outputs — proofs of concept, lessons learned, technical findings, demonstrations, reference architectures, and decision recommendations — into discoverable, understandable, and actionable institutional knowledge. It serves Judiciary stakeholders (decision-makers, operational leaders, technical adopters, and innovation contributors) who need to find relevant innovation work, assess its maturity and reuse potential, and take an informed next step toward adoption or engagement. It is not a document library; it is an engagement and transition mechanism operated by authorized I&R curators.

## Core Value

A Judiciary stakeholder can arrive with a mission problem, discover relevant I&R innovation work, understand what was learned and how mature it is, and take a concrete next step — without needing to already know the project name, team, or file location.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **F1** — Innovation Catalog: Browsable catalog of curated innovation records showing title, problem/outcome summary, technology/capability area, maturity, review status, contributing office, reuse/engagement indicator, last-reviewed date, and lifecycle state
- [ ] **F2** — Search and Discovery: Problem-oriented full-text search and faceted filtering by mission area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and lifecycle state
- [ ] **F3** — Innovation Record: Structured record with problem & context, what was explored, outcome & evidence, key findings, maturity & readiness, reuse guidance, ownership & attribution, authoritative artifact links, and contextual next action
- [ ] **F4** — Executive and Technical Perspectives: Single innovation record presenting audience-appropriate executive and technical perspectives grounded in the same underlying evidence without creating duplicate source records
- [ ] **F5** — Existing Lessons-Learned Content: Ability to curate existing I&R lessons-learned documents (e.g., Audio Security POC) into structured innovation records that link back to authoritative sources and are discoverable via problem-oriented search
- [ ] **F6** — Opportunity Submission: Structured flow for stakeholders to submit mission problems or workflow friction (not application requests) for I&R consideration, with explicit statement that submission does not imply acceptance
- [ ] **F7** — Share Existing Innovation Work: Separate contribution flow for teams with existing innovation to share, preserving attribution and requiring curation before publication
- [ ] **F8** — Engagement Routing: Record-level and general calls to action (demo, adoption, technical guidance, related work) that capture request context and route to the designated I&R team channel (AOml_TSO_IRB_Team@ao.uscourts.gov), configurable without code deployment
- [ ] **F9** — Curation and Administration: Full curator/admin interface for record creation, editing, metadata management, maturity/review status governance, publication lifecycle (draft → review → publish → supersede/archive/retire), opportunity/contribution queue management, engagement activity review, audit history, and settings management

### Out of Scope

- Replace SharePoint or Git repositories — Hub curates and links, not migrates authoritative sources
- Migrate every historical document — MVP proves the model with a small deliberate content set (≥3 published records)
- Manage POC execution — Hub documents outcomes, not project management
- Enterprise portfolio management — out of MVP scope; engagement/transition focus only
- Automatically determine maturity or approval — curator-governed only
- Broad social networking or discussion forums — MVP is engagement routing, not community platform
- Deploy POCs into production — Hub links, does not operationalize
- Autonomous investment decisions — decision support only

## Context

- **Organization:** TSIO Innovation & Research (I&R), Administrative Office of US Courts
- **Problem:** Innovation outputs (POCs, lessons learned, findings, code) are distributed across SharePoint, Git repos, project folders, and individual team knowledge. Stakeholders must already know the project name or team to find anything useful.
- **Existing content:** I&R has produced POCs including the Audio Security POC (defense-in-depth findings, GPU/CPU separation, Azure Government Cloud constraints, performance limitations, testing gaps, production-readiness requirements) — a strong first candidate for seeding the Hub.
- **Trust model:** The Hub must make clear that: POC ≠ production-ready; Published ≠ approved for adoption; Community-submitted ≠ centrally endorsed; Validated for reuse ≠ eliminates local review requirements.
- **Maturity taxonomy:** Idea → Evaluated Idea → Experiment/POC → Prototype/Pilot → Production/Validated Pattern → Archived/Retired
- **Review status taxonomy (independent from maturity):** Submitted → Curated for completeness → Technically reviewed → Security reviewed → Policy reviewed → Validated for reuse → Superseded → Retired
- **Engagement routing:** Initial shared address AOml_TSO_IRB_Team@ao.uscourts.gov; email-first acceptable for MVP if action is separately recorded
- **Launch content requirement:** At minimum 3 published records covering: 1 technical reuse example, 1 executive decision example, 1 adoption/collaboration example, plus 1 archived/retired experiment for lifecycle transparency

## Constraints

- **Hosting:** TBD during discovery — local/development deployment permitted; operational hosting is a blocker before non-development deployment
- **Identity & Access:** TBD during discovery — development-only access mechanism may be used if explicitly approved; required before non-development curator/admin deployment
- **Accessibility:** Core stakeholder and curator journeys must conform to WCAG 2.1 AA (or Judiciary-approved baseline established during discovery); unresolved critical issues block release
- **Engagement routing:** Configurable without code change or application redeployment
- **Secrets:** Credentials and sensitive configuration must not be committed to source code (SEC-08)
- **Auditability:** Material governance, lifecycle, ownership, and configuration changes must be traceable via audit history
- **Publication gate:** Records may not publish without: problem statement, owner/steward, maturity, review status, attribution, source basis, last-reviewed date, and applicable disclaimer (F9.10)
- **Content basis:** MVP must begin with a deliberate small content set; launch content is a product acceptance condition, not optional post-build activity

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hub curates and links — does not migrate or replace authoritative repositories | Avoids duplication, preserves source-of-record integrity, reduces migration risk | — Pending |
| Maturity and review status are independent fields | A sophisticated POC may lack security review; a production example may not be a Judiciary-wide validated pattern | — Pending |
| Email-first engagement routing acceptable for MVP | I&R shared address identified; action must be separately recorded | — Pending |
| Audio Security POC prioritized as first seeded record | Exercises full content model: architecture, security, performance, cloud constraints, testing gaps, production-readiness | — Pending |
| Initial hosting environment | Must be resolved before deployment architecture is baselined | — Pending |
| Identity and access approach | Must be resolved before curator/admin implementation | — Pending |

---
*Last updated: 2026-08-11 after initialization from TSIO_Innovation_Hub_MVP_PRD_v2.0*
