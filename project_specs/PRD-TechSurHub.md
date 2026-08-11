# TSIO Innovation Hub MVP — Product Requirements Document

**Project:** TechSur Innovation Hub (TSIO Innovation Hub MVP)
**Organization:** TSIO Innovation & Research (I&R), Administrative Office of US Courts
**Document Type:** PRD — Product Contract
**Version:** 1.0 (derived from TSIO_Innovation_Hub_MVP_PRD_v2.0, August 10, 2026)
**Status:** Working Draft
**Date:** August 11, 2026
**Audience:** Pivota delivery team

> **Requirements language.** "Must" identifies an MVP requirement or release condition. "Should" identifies a preferred behavior that may be refined during discovery. "May" identifies an optional implementation choice. Product requirements define required outcomes; functional and technical specifications define the detailed implementation contract.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Primary Personas](#4-primary-personas)
5. [Core MVP Experience and User Journeys](#5-core-mvp-experience-and-user-journeys)
6. [Content, Maturity, Trust, and Lifecycle Model](#6-content-maturity-trust-and-lifecycle-model)
7. [Technical Architecture](#7-technical-architecture)
8. [Feature Requirements](#8-feature-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Security Requirements](#10-security-requirements)
11. [Success Metrics and Acceptance Measures](#11-success-metrics-and-acceptance-measures)
12. [Launch Content Requirements](#12-launch-content-requirements)
13. [Risks and Mitigations](#13-risks-and-mitigations)
14. [Explicit MVP Boundaries](#14-explicit-mvp-boundaries)
15. [External Integrations and Dependencies](#15-external-integrations-and-dependencies)
16. [Feature Index](#16-feature-index)

---

## 1. Executive Summary

The TSIO Innovation Hub is a curated, governed web portal that transforms scattered Judiciary innovation outputs — proofs of concept, lessons learned, technical findings, demonstrations, reference architectures, and decision recommendations — into discoverable, understandable, and actionable institutional knowledge. It serves Judiciary stakeholders (decision-makers, operational leaders, technical adopters, and innovation contributors) who need to find relevant innovation work, assess its maturity and reuse potential, and take an informed next step toward adoption or engagement.

The Hub is not a document library. It is an engagement and transition mechanism operated by authorized I&R curators, designed to convert scattered innovation outputs into institutional knowledge without replacing the repositories that currently hold authoritative documents, code, and media.

The MVP must prove that existing I&R work can be curated into a useful product experience, beginning with a deliberate small content set seeded from real POC outputs (starting with the Audio Security POC), and validating whether structured presentation materially improves awareness, discovery, reuse, and engagement between I&R and Judiciary stakeholders.

---

## 2. Problem Statement

TSIO Innovation & Research produces proofs of concept, lessons learned, technical findings, demonstrations, reference architectures, code, and decision recommendations. Much of this work is valuable beyond the project that produced it — but it is currently inaccessible to most of the people who could benefit from it.

The problem is not that the work is undocumented. The problem is distribution and discoverability:

- Innovation outputs are scattered across project folders, SharePoint locations, code repositories, demonstration videos, and individual team knowledge
- A Judiciary stakeholder must often already know the project name, the original team, or the document location before they can find anything useful
- There is no governed, consistent entry point for discovering what I&R has explored, what was learned, and what is available for reuse or adoption
- Stakeholders cannot distinguish an idea from a POC, a pilot from a validated pattern, or an experiment from production-ready guidance
- Mature POC findings with real reuse value — such as the Audio Security POC's defense-in-depth architecture, Azure Government Cloud constraints, and GPU/CPU separation findings — are effectively invisible to the offices that need them
- Engagement with I&R requires prior knowledge of who to contact and for what; there is no governed path for requesting a demonstration, exploring adoption, or submitting a new opportunity

The result is that innovation investment produces outputs that do not compound — each effort starts with limited institutional awareness of what came before, and lessons learned are not systematically transferred to the offices best positioned to act on them.

---

## 3. Product Vision

**Vision statement:** A Judiciary stakeholder can arrive with a mission problem, discover relevant I&R innovation work, understand what was learned and how mature it is, and take a concrete next step — without needing to already know the project name, team, or file location.

### Strategic Goals

- Provide a single, governed entry point where Judiciary stakeholders can discover innovation work relevant to a mission problem
- Enable stakeholders to understand what was tested and learned, distinguish an idea from a POC from a production pattern, and see risks, constraints, and readiness
- Surface authoritative supporting artifacts and identify original contributors and current owners without migrating or replacing those authoritative sources
- Create a governed engagement path for demonstrations, adoption discussions, technical guidance, and opportunity submissions — routed to I&R with sufficient context for follow-up
- Prove the content, trust, lifecycle, and engagement model with a deliberate initial content set, establishing the pattern for future curation at scale
- Preserve institutional credit for innovation contributions from across the Judiciary without implying I&R central ownership of all innovation

### Design Principles

- **Problem-Oriented Discovery** — Users should not need to understand I&R's internal project naming or folder structures
- **Evidence Before Promotion** — The Hub communicates findings and maturity honestly; it does not make every POC look like a success story
- **One Record, Multiple Audiences** — Executive and technical views remain grounded in the same underlying evidence
- **Curate and Link** — The Hub summarizes and organizes authoritative content rather than creating uncontrolled copies
- **Visible Trust** — Maturity, review status, owner, and review date are visible and understandable
- **Actionable Pages** — Every relevant record helps the user take a next step
- **Attribution Without Centralization** — The Hub amplifies work from across the Judiciary and preserves contributor credit without suggesting I&R owns all innovation
- **Maintainability Over Novelty** — The MVP favors a clear, supportable internal product over a visually elaborate but difficult-to-maintain portal
- **Accessible by Default** — Core product journeys are usable by people with disabilities and conform to the approved accessibility baseline
- **Governance in the Experience** — Trust, ownership, review, lifecycle, and readiness information is visible where it affects user interpretation or action

### Trust Model

The Hub must make clear at all times that:

- POC ≠ production-ready
- Published ≠ approved for adoption
- Community-submitted ≠ centrally endorsed
- Validated for reuse ≠ eliminates local review requirements

---

## 4. Primary Personas

### 4.1 Decision-Maker

A TSIO or AO leader who wants to understand whether an innovation effort is relevant, credible, and worth further investment.

**Key questions:**
- What problem does this address, and why does it matter?
- What evidence was produced, and what are the main benefits, risks, and constraints?
- How mature is the work, and what decision or sponsorship is needed next?
- Who would own the next step?

**Desired outcome:** Determine whether the effort is relevant and credible enough to justify sponsorship, additional evaluation, adoption exploration, or no further action.

**Authorized product actions:** Search or browse; view executive perspective; review evidence, maturity, risk, ownership, and next step; open permitted artifacts; initiate an engagement request.

---

### 4.2 Operational Leader

An application owner, service owner, program manager, or branch chief who wants to know whether innovation work could address a real operational need.

**Key questions:**
- Does this apply to my office or workflow?
- What would adoption require, and what responsibilities would my team assume?
- What dependencies, skills, or infrastructure are needed?
- Is I&R looking for an adopter or collaborator, and how do I begin a discussion?

**Desired outcome:** Determine whether the work applies to an operational need and what organizational, technical, or ownership commitments would be required to advance it.

**Authorized product actions:** Search or browse; view applicability and reuse guidance; review ownership and dependencies; request a demonstration, adoption discussion, or related-problem discussion.

---

### 4.3 Technical Adopter

An architect, developer, cloud engineer, security engineer, or DevSecOps practitioner who wants to evaluate innovation work for technical reuse.

**Key questions:**
- How was the POC designed, and what tools and services were used?
- What code or infrastructure assets are available?
- What technical decisions were made, and what limitations were discovered?
- What is suitable for reuse, and what must change before production?
- What security and data constraints apply, and where are the authoritative technical artifacts?

**Desired outcome:** Determine what is technically reusable, what remains uncertain, and what must change before use in a production or office-specific environment.

**Authorized product actions:** View technical perspective; inspect architecture, findings, limitations, dependencies, and permitted source artifacts; request technical guidance or an adoption discussion.

---

### 4.4 Innovation Contributor

A court, AO office, or technical team that wants to share an idea, experiment, implementation, or lesson learned.

**Key activities:**
- Describe the problem and work completed
- Identify the contributing office and people; retain attribution
- Indicate maturity and ownership; link existing artifacts
- Submit the work for curation without implying formal approval

**Desired outcome:** Submit useful innovation work or a lesson learned while preserving attribution, ownership, maturity context, and the distinction between contribution and endorsement.

**Authorized product actions:** Submit existing innovation work; provide source links, owners, contributors, limitations, and collaboration preferences; receive clear confirmation of the curation process.

---

### 4.5 I&R Curator

An authorized I&R team member who manages the quality and lifecycle of Hub content.

**Key activities:**
- Create and edit innovation records; summarize source material
- Apply consistent metadata; assign maturity and review labels
- Link authoritative artifacts; preserve contribution history
- Publish and unpublish records; track review dates
- Archive, supersede, or retire stale content
- Review engagement associated with each record

**Desired outcome:** Maintain a trustworthy, current, consistently structured body of innovation knowledge and route meaningful stakeholder engagement.

**Authorized product actions:** Create, edit, review, publish, unpublish, supersede, archive, or retire records; manage metadata and artifacts; review submissions and engagement; manage approved configuration.

---

## 5. Core MVP Experience and User Journeys

The MVP must center on one primary experience: a user arrives with a mission problem or area of interest, discovers relevant innovation work, understands its status and applicability, and takes an informed next step. The MVP must optimize for this journey before adding portfolio management, collaboration spaces, social features, or advanced automation.

### 5.1 Primary Journey — Discover and Act on Existing Innovation

1. The user arrives with a mission problem, operational need, technology question, or area of interest
2. The user searches or browses by problem, mission area, technology, contributing office, maturity, review status, or keyword
3. The user sees clearly labeled innovation records and identifies one or more relevant records
4. The user opens a record and immediately understands the problem, outcome, maturity, review status, primary findings, ownership, and recommended next step
5. The user uses the executive or technical perspective as appropriate without creating a duplicate record or conflicting version of the evidence
6. The user opens authoritative supporting artifacts where additional evidence is needed and access is permitted
7. The user determines whether the work is relevant for reuse, further discussion, demonstration, adoption exploration, or no action
8. The user takes an action such as requesting a demo, discussing a related problem, requesting technical guidance, exploring adoption, sharing related work, or contacting I&R
9. The request is associated with the originating context and routed to I&R with enough information for follow-up

### 5.2 Secondary Journey — Submit an Opportunity

1. A user describes a mission problem or workflow friction rather than beginning with a requested application
2. The user identifies who is affected, the current workflow, impact, desired outcome, constraints, related attempts, office, and discovery participants
3. The user submits the opportunity and receives confirmation that submission does not imply I&R acceptance
4. The submission enters an I&R review process and remains traceable to its originating office and contact

### 5.3 Secondary Journey — Share Existing Innovation

1. A contributor describes the problem addressed, work completed, contributing office, maturity, current owner, artifacts, limitations, and collaboration preference
2. The contribution is submitted with attribution intact
3. The contribution enters a curation workflow before any publication
4. If published, the resulting innovation record remains linked to its source contribution and authoritative artifacts

### 5.4 Secondary Journey — Curate and Govern Content

1. An authorized curator creates a record from source material or an accepted contribution
2. The curator applies the content model, metadata, maturity, review information, attribution, source links, and next action
3. The record is reviewed against publication requirements
4. The record is published, updated, superseded, archived, retired, or unpublished through a governed lifecycle
5. Material changes and review dates remain auditable

---

## 6. Content, Maturity, Trust, and Lifecycle Model

### 6.1 Maturity Taxonomy

Maturity describes the current developmental stage of the innovation work. The six stages are:

| Stage | Description |
|---|---|
| **Idea** | A problem, opportunity, or concept that has not yet been validated |
| **Evaluated Idea** | An idea that has been reviewed for relevance, feasibility, and potential value |
| **Experiment / POC** | A controlled effort that produced evidence and findings, but is not production-ready |
| **Prototype / Pilot** | A capability tested with representative users, workflows, integrations, or environments |
| **Production / Validated Pattern** | A deployed capability or reviewed approach with sufficient evidence to serve as a reference for reuse |
| **Archived / Retired** | Work retained for institutional learning but no longer active or recommended |

### 6.2 Review Status Taxonomy

Review status must remain **separate from maturity**. A sophisticated POC may still lack security or policy review. A production example from another office may not be validated as a Judiciary-wide pattern.

Review status values, in progression:

- Submitted
- Curated for completeness
- Technically reviewed
- Security reviewed
- Policy reviewed
- Validated for reuse
- Superseded
- Retired

### 6.3 Conceptual Data Model

| Product Concept | Business Meaning |
|---|---|
| **Innovation Record** | The structured representation of one idea, experiment, POC, pilot, validated pattern, production example, or archived learning item |
| **Artifact** | An authoritative source associated with an innovation record (lessons-learned document, report, architecture diagram, demo video, repository, test result, security finding) |
| **Contributor** | A person, court, AO office, or technical team credited for the work |
| **Owner / Steward** | The person or organizational entity responsible for the current accuracy, maintenance, or advancement of the record |
| **Opportunity Submission** | A mission problem, research question, collaboration need, or other opportunity submitted to I&R for consideration |
| **Innovation Contribution** | Existing innovation work submitted for curation and possible publication |
| **Engagement Request** | A request for demonstration, guidance, discussion, adoption exploration, or other follow-up |
| **Maturity** | The current developmental stage of the innovation work |
| **Review Status** | A representation of governance or review that has occurred, maintained independently from maturity |
| **Mission / Technology Taxonomy** | Controlled metadata used to support problem-oriented discovery and filtering |
| **Audit Event** | A material change to product content, governance status, ownership, configuration, or lifecycle that requires traceability |

### 6.4 Lifecycle and Governance Rules

- Maturity and review status are independent and must not be automatically inferred from one another
- Publication state is separate from maturity and review status
- A published record must meet the publication gate defined in F9.10
- A record may be unpublished when its content is no longer appropriate for stakeholder access or requires material correction
- A superseded record should remain discoverable when it has institutional learning value, but must clearly identify it has been superseded and, where known, the successor record or artifact
- A retired or archived record must not be presented as a recommended current pattern
- Material lifecycle or governance changes must be captured in audit history
- The product supports a workflow of: Draft → Submitted for Review → Published → Superseded / Archived / Retired

### 6.5 Core Innovation Record Information Fields

Every innovation record holds: title and unique identifier, short summary, problem statement, target users, mission area, technology areas, scope, hypothesis or objective, outcome, evidence, key findings, benefits, risks, limitations, maturity, review statuses, reuse potential, production-readiness gaps, recommended next step, contributing offices, contributors, I&R contribution, current owner/steward, operational owner (where applicable), production owner (where applicable), artifact links, engagement actions, created date, last-reviewed date, next-review date, publication state, and retirement or supersession reason (where applicable).

---

## 7. Technical Architecture

Technology stack and hosting decisions are partially TBD pending discovery. The constraints below are product-level requirements that bound the architecture; implementation-specific choices belong in the Technical Architecture specification.

| Area | Requirement / Constraint | Status |
|---|---|---|
| **Hosting environment** | TBD during discovery; local/development deployment permitted; operational hosting is a blocker before non-development deployment | Pending |
| **Identity & Access** | TBD during discovery; development-only access mechanism may be used if explicitly approved; required before non-development curator/admin deployment | Pending |
| **Engagement routing** | Must be configurable without code change or application redeployment; initial address: AOml_TSO_IRB_Team@ao.uscourts.gov | Confirmed address; mechanism TBD |
| **Artifact storage** | Hub links to authoritative sources (SharePoint, Git repos, etc.); does not migrate or create uncontrolled copies | By design |
| **Secrets management** | Credentials and sensitive configuration must not be committed to source code (SEC-08) | Required |
| **Accessibility baseline** | WCAG 2.1 AA or Judiciary-approved baseline established during discovery | Pending baseline confirmation |
| **Browser compatibility** | Core journeys must function on Judiciary-approved browser set (confirmed during discovery) | Pending list confirmation |
| **Automated-submission protection** | Mechanism TBD; controlled development bypass may be allowed; operational security baseline governs whether it is launch-blocking | Pending |
| **Analytics** | Metrics and collection method TBD; basic approved event tracking may be sufficient for MVP | Decision required before metric collection |

---

## 8. Feature Requirements

Each feature group below is an independently traceable part of the MVP. A partial implementation of one capability must not be treated as completion of another. Detailed fields, validation rules, error behavior, API design, and persistence design belong in the downstream functional and technical specifications.

---

### F1: Innovation Catalog

**Description:** The Innovation Catalog provides a browsable, governed view of curated innovation records. It is the primary discovery surface for stakeholders who arrive without a specific search query, and it must communicate trust, maturity, and actionability at a glance — without implying that all records are equally mature, approved, current, or reusable.

**Capabilities:**

- **F1.1** — Provide a browsable catalog of curated innovation records
- **F1.2** — Each catalog card must show the title and a one-sentence problem or outcome summary
- **F1.3** — Each card must visibly communicate technology or capability area, maturity, review status, and contributing office
- **F1.4** — Each card must show an appropriate reuse or engagement indicator when one is configured (e.g., available for demonstration, seeking adoption partner, technical playbook available, reference pattern available, monitoring only, or archived)
- **F1.5** — Each card must show last-reviewed date and current lifecycle state where that state affects interpretation
- **F1.6** — The catalog must not visually imply that all records are equally mature, approved, current, or reusable

**Completion criterion:** A user can browse multiple records and distinguish relevance, maturity, review status, contributor context, and actionability without opening every record.

**Priority:** P0 (Critical — MVP core)

---

### F2: Search and Discovery

**Description:** Search and Discovery enables problem-oriented access to innovation records so that stakeholders can find relevant work using the language of their mission problem — not internal project names, folder paths, or I&R terminology. Faceted filtering allows progressive refinement by metadata dimensions that matter to each persona.

**Capabilities:**

- **F2.1** — Support problem-oriented search so users do not need to know internal project names or repository locations
- **F2.2** — Search must cover record titles, problem statements, summaries, findings, tags, mission areas, technology areas, and artifact names where permitted
- **F2.3** — Support filtering by mission or business area, problem type, technology, maturity, review status, contributing office, reuse potential, artifact availability, and active/superseded/retired state
- **F2.4** — Search and filter behavior must preserve visible trust information in results
- **F2.5** — A query expressed in user problem language (e.g., "protect court audio") must be able to surface relevant work without requiring the formal project title when the content and metadata support that relationship

**Completion criterion:** A user can locate relevant innovation work from problem-oriented language and refine results using product metadata.

**Priority:** P0 (Critical — MVP core)

---

### F3: Innovation Record

**Description:** The Innovation Record is the central structured artifact of the Hub — a consistent, governed presentation of one innovation effort. It must allow any of the five personas to arrive and immediately understand what was explored, what was found, how mature it is, what can be reused, who owns it, and what to do next. The record is a single source of truth; executive and technical perspectives (F4) are rendered from it, not duplicated.

**Capabilities:**

- **F3.1 Problem and Context** — Explain the mission or operational problem, affected users, current workflow or constraint, and why experimentation was appropriate
- **F3.2 What Was Explored** — Explain the hypothesis, capability, or approach tested; scope boundaries; and technologies or methods used
- **F3.3 Outcome and Evidence** — Explain what was demonstrated, what evidence was produced, what worked, what did not, what uncertainty was reduced, and what decision the work enabled
- **F3.4 Key Findings** — Surface reusable architectural, security, cloud/platform, performance, user-experience, data, testing, operational, cost, or scalability findings where applicable
- **F3.5 Maturity and Readiness** — Show current maturity, review status, what the work is ready for, what it is not ready for, and what is required before the next stage
- **F3.6 Reuse Guidance** — State what another office can reuse, what should be adapted, what should not be copied directly, what assumptions are environment-specific, and what skills/services/dependencies are required
- **F3.7 Ownership and Attribution** — Identify opportunity source, contributing office, I&R contribution, technical contributors, current owner, and operational or production owner where applicable
- **F3.8 Authoritative Artifacts** — Link to authoritative lessons learned, POC reports, decision briefs, diagrams, demo videos, repositories, infrastructure definitions, test results, security findings, and technical playbooks as available and permitted
- **F3.9 Next Action** — Provide only appropriate next actions for the record (request a demonstration, discuss a related use case, explore adoption, request technical guidance, share related work, or contact I&R)

**Completion criterion:** From one coherent record, the user can understand the problem, evidence, maturity, review context, reuse potential, ownership, source artifacts, and appropriate next action.

**Priority:** P0 (Critical — MVP core)

---

### F4: Executive and Technical Perspectives

**Description:** A single innovation record must serve both executive and technical audiences without creating duplicate source records or conflicting evidence. The perspectives are rendered views of the same underlying record — not separate documents — ensuring that an executive and a technical adopter reading the same record share a common factual foundation while each receiving the framing most useful to their job to be done.

**Capabilities:**

- **F4.1** — One innovation record must support both executive and technical perspectives without creating duplicate source records
- **F4.2** — The executive perspective should prioritize: mission problem, strategic relevance, outcome, evidence, benefits, risks, maturity, decision recommendation, ownership, and next step
- **F4.3** — The technical perspective should prioritize: architecture, tools/services, data flow, security considerations, testing, known limitations, source artifacts, production-readiness gaps, reuse guidance, and dependencies
- **F4.4** — Both perspectives must remain grounded in the same underlying evidence, maturity, review status, ownership, and authoritative artifacts

**Completion criterion:** An executive and a technical adopter can obtain audience-appropriate information without encountering conflicting versions of the underlying record.

**Priority:** P0 (Critical — MVP core)

---

### F5: Existing Lessons-Learned Content

**Description:** The MVP must explicitly support lessons-learned documents already produced through the I&R POC process. Rather than migrating or rewriting authoritative documents, the Hub creates a structured innovation record around each source, extracts the most important reusable findings, and links back to the original. The Audio Security POC is the priority first candidate for this feature, as it exercises the full content model across architecture, security, performance, cloud constraints, testing, and production-readiness.

**Capabilities:**

- **F5.1** — Treat the existing lessons-learned document or other authoritative source as the source of record
- **F5.2** — Create a structured innovation record around the source and extract the most important reusable findings
- **F5.3** — Apply metadata, maturity, review, ownership, attribution, and review-date information
- **F5.4** — Link back to the authoritative source and make the record discoverable through problem-oriented search
- **F5.5** — Use the Audio Security POC as the priority initial candidate because its architectural, security, performance, cloud-environment, testing, and production-readiness findings can exercise the full content model

**Completion criterion:** A user can discover and understand the reusable value of an existing lessons-learned artifact without first knowing where the original document is stored or reading it in full.

**Priority:** P0 (Critical — MVP launch content)

---

### F6: Opportunity Submission

**Description:** Opportunity Submission provides a structured flow for Judiciary stakeholders to bring mission problems, emerging questions, or workflow friction to I&R's attention — starting with the problem, not a requested solution. The flow captures the context I&R needs to assess relevance, research value, feasibility, and capacity, while making unambiguously clear that submission does not imply acceptance into the I&R portfolio.

**Capabilities:**

- **F6.1** — Provide a structured submission flow that begins with the problem or workflow friction, not a requested application
- **F6.2** — Capture who is affected, how the work is performed today, impact, desired outcome, known constraints, related work attempted, submitting office, and participants available for discovery
- **F6.3** — Allow the submitter to characterize the request as a current mission problem, emerging-technology question, request for research, potential POC, request for demonstration, collaboration opportunity, or existing innovation work to share
- **F6.4** — Clearly state that submission does not imply acceptance into the I&R portfolio
- **F6.5** — Record the submission so authorized I&R users can review and disposition it through the defined workflow

**Completion criterion:** A user can submit a problem with sufficient context for I&R to determine fit, relevance, research value, feasibility, and capacity without the submission implying approval.

**Priority:** P1 (High — MVP engagement)

---

### F7: Share Existing Innovation Work

**Description:** Share Existing Innovation Work is a separate contribution flow for courts, AO offices, or technical teams that already have innovation to contribute — an idea, experiment, implementation, or lesson learned. It is distinct from Opportunity Submission (F6) because the contributor is sharing work already done, not describing a problem for I&R to investigate. Attribution is preserved through the curation process, and no record publishes without curator review.

**Capabilities:**

- **F7.1** — Provide a separate contribution flow for teams that already have innovation work to share
- **F7.2** — Capture the problem addressed, description of the work, contributing office, current maturity, current owner, available artifacts, known limitations, contact person, and whether collaboration or reuse is encouraged
- **F7.3** — Preserve contributor attribution and current ownership through the curation process
- **F7.4** — Require curation before publication and avoid language that implies central endorsement merely because a contribution was submitted

**Completion criterion:** Existing innovation work can enter the Hub through a governed contribution path without losing attribution or being presented as approved before curation.

**Priority:** P1 (High — MVP engagement)

---

### F8: Engagement Routing

**Description:** Engagement Routing converts user interest into traceable, routed action. Every innovation record and the Hub generally must provide contextual calls to action that allow users to request a demonstration, discuss a use case, explore adoption, or request technical guidance. Routing destinations are configurable without code deployment. For MVP, email-first routing is acceptable if engagement actions are separately recorded. The initial shared address is AOml_TSO_IRB_Team@ao.uscourts.gov.

**Capabilities:**

- **F8.1** — Provide record-level and general calls to action for demonstration, related-use-case discussion, adoption exploration, technical guidance, sharing related work, or contact with I&R
- **F8.2** — Capture request type, originating innovation record where applicable, user name, office, contact information, description of the need, and desired next step
- **F8.3** — Allow the first MVP implementation to use email for the conversation while separately recording that the engagement action occurred
- **F8.4** — The routing destination must be configurable by authorized users or approved configuration without requiring a code change or application redeployment
- **F8.5** — The configured display language should direct users to the TSIO Innovation & Research team; initial shared address is AOml_TSO_IRB_Team@ao.uscourts.gov unless changed through approved configuration
- **F8.6** — Suggested subject patterns may include: *Innovation Opportunity – [Office] – [Topic]*, *Demo Request – [Innovation Record]*, *Adoption Discussion – [Innovation Record]*, and *Technical Guidance – [Innovation Record]*

**Completion criterion:** User interest becomes a traceable engagement associated with the correct context and routed to the designated I&R channel.

**Priority:** P0 (Critical — MVP engagement)

---

### F9: Curation and Administration

**Description:** Curation and Administration is the complete back-office capability that enables authorized I&R curators to govern every aspect of Hub content and operations. It covers the full lifecycle of innovation records, management of submissions and contributions, review of engagement activity, and configuration of settings — all with auditability. Publication gates prevent incomplete or misleading records from reaching stakeholders. This feature group has 16 distinct sub-features, each independently traceable.

**Capabilities:**

- **F9.1 Curator Summary** — Provide an authorized summary view of records, submissions, engagements, review needs, and other attention items using live product data
- **F9.2 Record Management List** — Provide an authorized, filterable view of innovation records across lifecycle states
- **F9.3 Record Creation** — Allow an authorized curator to create a complete innovation record from source material or an accepted contribution
- **F9.4 Record Editing** — Allow authorized editing of all product-required record content and metadata
- **F9.5 Artifact Management** — Allow authorized users to add, update, and remove authoritative artifact links without creating uncontrolled copies
- **F9.6 Maturity Management** — Allow authorized assignment and update of maturity while preserving the history of material changes
- **F9.7 Review Status Management** — Allow authorized management of applicable review statuses independently from maturity
- **F9.8 Attribution and Ownership** — Allow maintenance of contributing offices, contributors, I&R contribution, current steward, operational owner, and production owner where applicable
- **F9.9 Publication Lifecycle** — Support draft, review, publish/unpublish, supersede, archive, and retire behaviors consistent with the lifecycle rules in this PRD
- **F9.10 Publication Gate** — Prevent publication when required product information is absent, including: problem statement, owner/steward, maturity, review status, attribution, source basis, last-reviewed date, and applicable disclaimer. The complete enumeration of all 15 required fields is defined in FRD F03a §Publication Gate Fields, which is the authoritative contract. The description above identifies the key governance categories; the FRD provides the field-level implementation specification.
- **F9.11 Audit History** — Provide a chronological history of material content, governance, and lifecycle changes
- **F9.12 Opportunity Submission Queue** — Allow authorized I&R users to review and disposition opportunity submissions
- **F9.13 Contribution Submission Queue** — Allow authorized I&R users to review, disposition, and where appropriate initiate record creation from innovation contributions
- **F9.14 Engagement Activity** — Allow authorized I&R users to review engagement activity and record an appropriate follow-up status
- **F9.15 Settings Management** — Allow authorized management of approved configurable settings, including engagement-routing destination
- **F9.16 Content Model Reference** — Provide authorized users with accessible definitions of maturity, review status, lifecycle, and publication requirements so governance is applied consistently

**Completion criterion:** Authorized curators can govern the complete content and engagement lifecycle using product data, with publication gates and auditability that prevent incomplete or misleading records from being treated as complete.

**Priority:** P0 (Critical — MVP foundation)

---

## 9. Non-Functional Requirements

The MVP must treat non-functional requirements as verifiable product requirements. Specific test tools may be selected by the delivery team, but verification evidence must demonstrate the required outcome.

| Category | Product Requirement | MVP Target | Verification Expectation |
|---|---|---|---|
| **Accessibility** | Core stakeholder and curator journeys conform to WCAG 2.1 AA unless a different Judiciary-approved baseline is established during discovery | All MVP journeys | Automated and manual accessibility verification; unresolved critical issues block release |
| **Performance** | Catalog, search, record viewing, and form interactions meet response-time targets agreed during discovery before implementation baseline | Targets baselined before build | Repeatable performance verification against the agreed target |
| **Browser Compatibility** | Core MVP journeys function on the Judiciary-approved browser set | Browser list confirmed during discovery | Cross-browser validation on the approved set |
| **Reliability** | User submissions and curator changes must not be silently lost and must produce clear success/failure feedback | All write workflows | Functional and failure-path testing |
| **Auditability** | Material governance, lifecycle, ownership, and configuration changes are traceable | All governed actions | Audit-history verification |
| **Maintainability** | The delivered solution can be understood, operated, configured, and extended by a receiving technical team | MVP handoff | Independent handoff review using source, deployment, configuration, and operational documentation |
| **Security** | Protected functions and restricted content are inaccessible without appropriate authorization and operational security controls are present | All protected capabilities | Security verification and negative-path testing |
| **Traceability** | Product requirements are traceable to functional design, implementation, and verification evidence | All MVP requirements | RTM review before release |

---

## 10. Security Requirements

Security requirements define required product outcomes. The exact control implementation, framework, header configuration, environment-variable names, authentication protocol, and infrastructure mechanism belong in the technical and security specifications.

- **SEC-01** — Administrative and curation capabilities must require authorized access
- **SEC-02** — Unauthorized or unauthenticated users must not gain access to protected functions or restricted content
- **SEC-03** — Authentication and authorization decisions must be auditable where required for governance and investigation
- **SEC-04** — Publication of an innovation record must not implicitly broaden access to a restricted artifact; artifact access remains governed by the authoritative source system and applicable permissions
- **SEC-05** — User-submitted contact and opportunity information must be handled according to applicable Judiciary privacy and data-protection requirements
- **SEC-06** — Public or broadly accessible submission capabilities must include appropriate protection against automated abuse and excessive requests
- **SEC-07** — Security-sensitive failure conditions must default to a protected state rather than allowing access or submission when a required security control is unavailable
- **SEC-08** — Credentials, secrets, and sensitive operational configuration must not be embedded in committed application source code
- **SEC-09** — Development or test-only access mechanisms must not be active in operational environments
- **SEC-10** — Operational deployments must implement appropriate application and HTTP security protections consistent with the approved technical/security baseline
- **SEC-11** — Security review status must remain distinguishable from general technical review and from maturity
- **SEC-12** — Security and access decisions required for a capability must be resolved or explicitly classified before that capability is ready for implementation or deployment

---

## 11. Success Metrics and Acceptance Measures

MVP acceptance is based on whether intended users can complete the product jobs defined in this PRD. Usage and engagement metrics that measure the broader product hypothesis must be selected during discovery and supported by an approved collection method.

| User / Area | Acceptance Measure | Evidence |
|---|---|---|
| **Decision-Maker** | Can locate a relevant innovation record using mission/problem language without knowing the formal project name; can identify problem, outcome, evidence, maturity, review context, risks/constraints, owner, and recommended next step from the record | Task-based usability review and requirement verification |
| **Operational Leader** | Can determine whether a record may apply to an office/workflow, what adoption would require, who owns the next step, and how to initiate a relevant discussion | Task-based usability review and call-to-action verification |
| **Technical Adopter** | Can find technical perspective, authoritative artifacts, reusable elements, limitations, production-readiness gaps, security/data constraints, dependencies, and technical contact path | Task-based technical-adopter review |
| **Contributor** | Can submit an opportunity or existing innovation example, understand what happens next, and see that attribution/ownership information is captured without implying endorsement | Submission workflow verification |
| **Curator** | Can create, edit, review, publish, unpublish, supersede/retire, and update a complete record; manage submissions, engagement, required metadata, source links, and approved configuration; and review material audit history | Curator acceptance testing across all F9 sub-features |
| **Engagement** | A demo, discussion, adoption, guidance, or related request reaches the designated I&R channel with user/context information and is recorded with originating record and request type where applicable | End-to-end engagement test |
| **Pivota Delivery** | Requirements are traceable; user journeys and design decisions are reviewable; source code is standard and maintainable; primary workflows have automated tests; deployment/configuration instructions exist; major requirements/approvals are auditable; handoff can be understood by a separate technical team | RTM, test, documentation, and handoff review |

### Broader Product Hypothesis Measures

MVP success will be evaluated by whether intended users can discover, understand, assess, reuse, and act on innovation work with materially less reliance on prior project knowledge or direct I&R assistance. The following dimensions frame the hypothesis:

- Increased awareness of I&R capabilities among Judiciary stakeholders
- Improved discovery of prior innovation work without requiring prior project knowledge
- Better understanding of POC outcomes and their applicability
- Increased reuse of lessons and technical patterns across offices
- More structured engagement between I&R and operational offices
- Identification of potential adoption partners for mature innovation work
- Greater visibility into I&R's contribution to downstream outcomes

---

## 12. Launch Content Requirements

The MVP must begin with a deliberately small content set that proves the content, trust, lifecycle, and engagement model. Launch content is a **product acceptance condition**, not an optional post-build activity.

| Launch Condition | Minimum Requirement | Why It Matters |
|---|---|---|
| **Published content threshold** | At least 3 published innovation records | Demonstrates a usable catalog rather than an empty shell |
| **Technical reuse example** | At least 1 published record with significant reusable technical findings and source artifacts | Exercises technical perspective, reuse guidance, and artifact linkage |
| **Executive decision example** | At least 1 published record that supports an executive decision or sponsorship discussion | Exercises executive perspective and decision-oriented content |
| **Adoption/collaboration example** | At least 1 published record seeking an adopter, collaborator, demonstration, or other concrete engagement | Exercises actionable next steps and routing |
| **Lifecycle transparency example** | At least 1 archived, retired, stopped, or superseded experiment retained for institutional learning | Demonstrates that the Hub does not present every experiment as a success or current pattern |
| **Complete governance metadata** | Every published record includes maturity, applicable review status, attribution, owner/steward, last-reviewed date, source basis/artifact, and appropriate next action | Ensures visible trust and publication integrity |

The **Audio Security POC** is the priority candidate for the initial content set. Its findings — defense-in-depth architecture, GPU/CPU service separation, Azure Government Cloud constraints, infrastructure state-management guidance, performance limitations, testing gaps, security recommendations, production-readiness requirements, and future development paths — exercise the full content model across all record sections and perspectives.

---

## 13. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Hosting environment not resolved before operational deployment | Medium | High — blocks production release | Explicit blocker in decision register; confirmed before deployment architecture is baselined |
| Identity and access approach unresolved before curator/admin implementation | Medium | High — blocks protected workflows | Explicit blocker; security/technical authority must confirm before implementation begins |
| Launch content not ready by MVP acceptance | Medium | High — launch condition, not post-build | Content curation treated as parallel workstream; Audio Security POC prioritized as first record |
| Maturity or review status displayed without visual distinction, implying false equivalence | Medium | High — undermines trust model | Design principle enforced in F1.6; catalog card design reviewed against trust requirements |
| Engagement routing silently fails; requests not recorded | Low | High — core MVP promise | F8.3 and F8.4 require separate recording of engagement actions regardless of email delivery |
| Authoritative artifact access inadvertently broadened by publication | Low | High — SEC-04 violation | Artifact links point to authoritative source systems; Hub does not host or copy restricted content |
| Development stubs mistaken for operational implementation | Medium | Medium | Stub governance rules (Section 15.1); each stub requires documented acceptance criteria and scope condition |
| POC content curated as production-ready guidance by mistake | Low | High — violates trust model; misleads stakeholders | Publication gate (F9.10) enforces required fields; maturity and review status fields are mandatory |
| Secrets committed to source code | Low | High — SEC-08 violation | SEC-08 is a hard requirement; enforced in delivery practices and code review |
| Accessibility issues discovered post-build | Medium | Medium | Accessibility verification is a release gate; unresolved critical issues block release |
| Taxonomy inconsistency across records degrades search quality | Medium | Medium | Initial taxonomy baselined during discovery; applied consistently by curators using F9.16 Content Model Reference |
| Engagement email address misconfigured | Low | Medium | Address is configurable via F9.15 without code deployment; confirmed before engagement routing is baselined |

---

## 14. Explicit MVP Boundaries

The MVP **will not** initially:

- Replace SharePoint or Git repositories — the Hub curates and links, not migrates authoritative sources
- Migrate every historical document — MVP proves the model with a deliberate small content set (≥3 published records)
- Manage POC execution — the Hub documents outcomes, not project management
- Provide enterprise portfolio management — engagement and transition focus only for MVP
- Automatically determine maturity or approval — curator-governed only
- Replace architecture, security, legal, or policy review processes
- Deploy POCs into production — the Hub links, does not operationalize
- Provide broad social networking or discussion forums — MVP is engagement routing, not a community platform
- Make autonomous investment decisions — the Hub provides decision support only
- Publish sensitive material outside approved access boundaries
- Attempt to operationalize the entire Innovation & Research Pipeline

The MVP must prove: discovery, understanding, trust, attribution, curation, lifecycle transparency, and engagement. Capabilities outside these boundaries require explicit product-owner approval and a traceable PRD scope change before inclusion in the MVP.

---

## 15. External Integrations and Dependencies

Every unresolved integration or external dependency must be explicitly classified as an implementation blocker, an accepted assumption, or an approved temporary development stub. Temporary mechanisms must have a documented condition that prevents them from being treated as operationally complete.

| Dependency | MVP Need | Current State | Temporary Approach | Operational Blocker? |
|---|---|---|---|---|
| **Identity and access** | Required for protected curator/admin workflows | TBD during discovery | Development-only access mechanism may be permitted if explicitly approved | Yes, before non-development deployment |
| **Hosting environment** | Required for deployment and operational controls | TBD during discovery | Local/development deployment permitted | Yes, before operational deployment |
| **Engagement routing** | Required for MVP actions | Shared I&R address identified; confirm | Email routing acceptable for MVP if action is separately recorded | No, if approved address and routing are confirmed |
| **Authoritative artifact repositories** | Required to link evidence | Multiple existing repositories expected | Link to authoritative source; do not migrate by default | No, but initial source locations must be confirmed |
| **Automated-submission protection** | Required where exposure warrants it | Mechanism TBD | Controlled development bypass may be allowed | Yes where approved operational security baseline requires the control |
| **Usage and engagement analytics** | Required to test approved success measures | Metrics and collection method TBD | Basic approved event tracking may be sufficient for MVP | Decision required before analytics implementation; not necessarily launch-blocking |

### 15.1 Stub and Blocker Governance

- A temporary development stub must have explicit acceptance criteria and an explicit condition describing where it may not be used
- A production blocker must remain visible in the decision register and release review until resolved
- A stub must not silently become the operational implementation merely because the feature appears functional in development
- The technical specification must document the approved mechanism, configuration, security behavior, and verification evidence for each resolved integration

### 15.2 Decisions Required During Discovery

| Decision | Blocking? | Decision Owner |
|---|---|---|
| Initial hosting environment | Yes — before deployment architecture is baselined | Product owner + technical authority |
| Identity and access approach | Yes — before protected curator/admin implementation | Security/technical authority + product owner |
| Shared contact address | Yes for engagement release | I&R product owner |
| Initial POC content set | Yes for launch | I&R product owner / curator |
| Authoritative artifact locations | Yes for affected records | Content curator / source owner |
| Product owner designation | Yes — before requirements baseline | TSIO/I&R leadership |
| Content curator designation | Yes — before curation workflow acceptance | TSIO/I&R leadership |
| Publishing authority designation | Yes — before publication workflow baseline | TSIO/I&R leadership |
| Required review roles | Yes — before trust/governance workflow baseline | Product owner + governance stakeholders |
| Initial taxonomy | Yes — before catalog/search baseline | Product owner + curator |
| Email routing sufficient for MVP engagement tracking | Yes for engagement design | Product owner |
| Usage and engagement metrics | No for all development; required before metric collection | Product owner |
| Receiving technical team | Yes for handoff acceptance | TSIO technical leadership |

---

## 16. Feature Index

| Feature ID | Feature Name | Priority | Personas | MVP Requirement |
|---|---|---|---|---|
| **F1** | Innovation Catalog | P0 — Critical | All | Required |
| F1.1 | Browsable catalog of curated records | P0 | All | Required |
| F1.2 | Card: title and problem/outcome summary | P0 | All | Required |
| F1.3 | Card: technology area, maturity, review status, contributing office | P0 | All | Required |
| F1.4 | Card: reuse/engagement indicator | P0 | Decision-Maker, Operational Leader, Technical Adopter | Required |
| F1.5 | Card: last-reviewed date and lifecycle state | P0 | All | Required |
| F1.6 | No false visual equivalence among records | P0 | All | Required |
| **F2** | Search and Discovery | P0 — Critical | All | Required |
| F2.1 | Problem-oriented search | P0 | All | Required |
| F2.2 | Full-text search scope | P0 | All | Required |
| F2.3 | Faceted filtering (mission, technology, maturity, status, etc.) | P0 | All | Required |
| F2.4 | Trust information preserved in results | P0 | All | Required |
| F2.5 | Problem-language query resolution | P0 | All | Required |
| **F3** | Innovation Record | P0 — Critical | All | Required |
| F3.1 | Problem and Context section | P0 | All | Required |
| F3.2 | What Was Explored section | P0 | All | Required |
| F3.3 | Outcome and Evidence section | P0 | All | Required |
| F3.4 | Key Findings section | P0 | Technical Adopter, Decision-Maker | Required |
| F3.5 | Maturity and Readiness section | P0 | All | Required |
| F3.6 | Reuse Guidance section | P0 | Technical Adopter, Operational Leader | Required |
| F3.7 | Ownership and Attribution section | P0 | All | Required |
| F3.8 | Authoritative Artifact links | P0 | Technical Adopter, I&R Curator | Required |
| F3.9 | Next Action (contextual CTAs) | P0 | All | Required |
| **F4** | Executive and Technical Perspectives | P0 — Critical | Decision-Maker, Technical Adopter | Required |
| F4.1 | Single record supports both perspectives | P0 | Decision-Maker, Technical Adopter | Required |
| F4.2 | Executive perspective framing | P0 | Decision-Maker, Operational Leader | Required |
| F4.3 | Technical perspective framing | P0 | Technical Adopter | Required |
| F4.4 | Both perspectives share same underlying evidence | P0 | All | Required |
| **F5** | Existing Lessons-Learned Content | P0 — Critical | All | Required (launch content) |
| F5.1 | Treat source document as source of record | P0 | I&R Curator | Required |
| F5.2 | Create structured record around source | P0 | I&R Curator | Required |
| F5.3 | Apply full metadata and governance fields | P0 | I&R Curator | Required |
| F5.4 | Link back to authoritative source | P0 | All | Required |
| F5.5 | Audio Security POC as priority first candidate | P0 | I&R Curator | Required |
| **F6** | Opportunity Submission | P1 — High | Innovation Contributor, I&R Curator | Required |
| F6.1 | Problem-first submission flow | P1 | Innovation Contributor | Required |
| F6.2 | Capture full context fields | P1 | Innovation Contributor | Required |
| F6.3 | Request type characterization | P1 | Innovation Contributor | Required |
| F6.4 | Explicit non-acceptance statement | P1 | Innovation Contributor | Required |
| F6.5 | Submission recorded for I&R queue | P1 | I&R Curator | Required |
| **F7** | Share Existing Innovation Work | P1 — High | Innovation Contributor, I&R Curator | Required |
| F7.1 | Separate contribution flow | P1 | Innovation Contributor | Required |
| F7.2 | Capture contribution context fields | P1 | Innovation Contributor | Required |
| F7.3 | Preserve attribution through curation | P1 | I&R Curator | Required |
| F7.4 | Curation required before publication | P1 | I&R Curator | Required |
| **F8** | Engagement Routing | P0 — Critical | All | Required |
| F8.1 | Record-level and general CTAs | P0 | All | Required |
| F8.2 | Capture request context fields | P0 | All | Required |
| F8.3 | Email-first routing with separate recording | P0 | I&R Curator | Required (MVP) |
| F8.4 | Configurable routing destination (no code deploy) | P0 | I&R Curator | Required |
| F8.5 | Display language directed to I&R; initial address confirmed | P0 | All | Required |
| F8.6 | Suggested email subject patterns | P1 | All | Should |
| **F9** | Curation and Administration | P0 — Critical | I&R Curator | Required |
| F9.1 | Curator summary dashboard | P0 | I&R Curator | Required |
| F9.2 | Record management list (filterable) | P0 | I&R Curator | Required |
| F9.3 | Record creation | P0 | I&R Curator | Required |
| F9.4 | Record editing | P0 | I&R Curator | Required |
| F9.5 | Artifact management | P0 | I&R Curator | Required |
| F9.6 | Maturity management with history | P0 | I&R Curator | Required |
| F9.7 | Review status management (independent of maturity) | P0 | I&R Curator | Required |
| F9.8 | Attribution and ownership management | P0 | I&R Curator | Required |
| F9.9 | Publication lifecycle (draft → review → publish → supersede/archive/retire) | P0 | I&R Curator | Required |
| F9.10 | Publication gate (required fields enforced) | P0 | I&R Curator | Required |
| F9.11 | Audit history | P0 | I&R Curator | Required |
| F9.12 | Opportunity submission queue | P1 | I&R Curator | Required |
| F9.13 | Contribution submission queue | P1 | I&R Curator | Required |
| F9.14 | Engagement activity review | P1 | I&R Curator | Required |
| F9.15 | Settings management (incl. routing config) | P0 | I&R Curator | Required |
| F9.16 | Content model reference (in-product) | P1 | I&R Curator | Required |

### Priority Summary

| Priority | Count | Description |
|---|---|---|
| **P0** | F1, F2, F3, F4, F5, F8, F9 (core) | Critical — MVP cannot launch without these |
| **P1** | F6, F7, F9.12–F9.14, F9.16, F8.6 | High — required for MVP but can be sequenced after P0 foundation |
| **P2** | None in MVP scope | Post-MVP features |
| **P3** | None in MVP scope | Future roadmap |

---

## Specification Governance

This PRD is the product contract. It defines the product problem, scope, users, required behavior, governance, boundaries, product-level quality expectations, and acceptance conditions. It intentionally does not duplicate detailed functional, UX, API, data, or technical implementation specifications.

### Required Downstream Artifacts

| Artifact | Scope | Authority |
|---|---|---|
| **PRD — Product Contract** (this document) | Product intent, users, scope, feature outcomes, governance, boundaries, acceptance, release conditions | Governs what the product must accomplish and why |
| **FRD — Functional Contract** | Detailed functional behavior, fields, validation, permissions, business rules, exceptions, and detailed acceptance criteria | Governs how product behavior works from the user/business perspective |
| **UX Specification — Experience Contract** | Information architecture, journeys, screens, interaction patterns, responsive behavior, content hierarchy, and accessibility treatment | Governs the intended experience and interaction behavior |
| **Technical Architecture — Implementation Contract** | Application architecture, integrations, authentication implementation, infrastructure, deployment, technical controls, and major technology choices | Governs how the solution is implemented and operated |
| **API and Data Specifications** | Exact interface paths/methods/payloads, logical/physical schemas, canonical enum/state values, and persistence details | Governs precise machine-level contracts |
| **RTM / Test Plan — Verification Contract** | Requirement-to-design-to-test traceability, verification methods, test cases, results, and release evidence | Governs proof that requirements were implemented and verified |
| **Deployment / Configuration / Handoff Package** | Deployment instructions, environment configuration, operational guidance, known limitations, support assumptions, and receiving-team information | Governs operational transfer and maintainability |

### Conflict and Change Rule

- Downstream specifications may add detail but must not silently change the product intent, scope, trust model, or acceptance conditions in this PRD
- When governing documents conflict, implementers must not silently choose one interpretation — the conflict must be escalated, resolved, and reflected in the authoritative specifications
- Material product changes require PRD update or documented product-owner disposition and must remain traceable through the RTM and change history

---

*This PRD is the primary governing document for the TSIO Innovation Hub MVP. Pivota must preserve the intent and governance expressed here through implementation — not merely produce a functional portal.*

*Source reference: TSIO_Innovation_Hub_MVP_PRD_v2.0.pdf (August 10, 2026) | Initialized: August 11, 2026*
