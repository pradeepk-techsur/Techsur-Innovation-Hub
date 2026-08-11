# Jobs to Be Done
## TSIO Innovation Hub MVP

| Field | Value |
|-------|-------|
| **Product Name** | TSIO Innovation Hub MVP (TechSur Innovation Hub) |
| **Date** | 2026-08-11 |
| **Related Personas** | PERSONAS-TechSurHub.md |
| **Related PRD** | PRD-TechSurHub.md |

---

## JTBD Summary

| ID | Persona | Job Statement | Priority |
|----|---------|--------------|----------|
| JTBD-01.1 | PER-01 Margaret Holloway | When I need to decide whether to sponsor or further evaluate an I&R effort, I want to assess innovation relevance and credibility from a single governed record, so I can make or defer a sponsorship decision with confidence. | P0 |
| JTBD-01.2 | PER-01 Margaret Holloway | When preparing to brief leadership on an innovation investment, I want to access an executive perspective grounded in the same evidence as the technical record, so I can present a defensible, consistent recommendation without producing a separate document. | P0 |
| JTBD-01.3 | PER-01 Margaret Holloway | When I decide a record warrants follow-up, I want to initiate a structured engagement request directly from the record, so I can involve I&R without needing to locate the right contact through informal channels. | P1 |
| JTBD-02.1 | PER-02 David Tran | When facing an operational bottleneck, I want to discover whether I&R has already explored a relevant capability, so I can assess applicability and adoption requirements before committing organizational resources. | P0 |
| JTBD-02.2 | PER-02 David Tran | When I have a workflow friction my office cannot resolve alone, I want to submit a problem description to I&R in a structured way, so I can surface it for research consideration without it being misread as a feature request. | P1 |
| JTBD-03.1 | PER-03 Priya Suresh | When evaluating a POC for potential reuse in Judiciary infrastructure, I want to access the full technical record — architecture, tooling, findings, limitations, and artifact links — so I can determine what is genuinely portable and what the production-readiness gaps are. | P0 |
| JTBD-03.2 | PER-03 Priya Suresh | When I need to differentiate security-reviewed work from technically reviewed work from unreviewed experiments, I want review status and maturity to be independently and visibly surfaced, so I can calibrate the level of due diligence required before recommending reuse. | P0 |
| JTBD-04.1 | PER-04 Carlos Rivera | When my team has completed innovation work others could benefit from, I want to submit it through a structured contribution flow that preserves attribution, so the work enters a curation process without being misrepresented as centrally endorsed or production-ready. | P1 |
| JTBD-04.2 | PER-04 Carlos Rivera | When my program manager asks me to surface a workflow problem for I&R consideration, I want to submit a structured problem description that clearly distinguishes a research inquiry from a solution request, so I can represent the need accurately without overpromising outcomes. | P1 |
| JTBD-05.1 | PER-05 Jasmine Okafor | When working with source material from POCs, lessons-learned documents, or accepted contributions, I want to create and publish structured innovation records through a governed lifecycle interface with publication gate enforcement, so the Hub's content remains trustworthy and consistently structured. | P0 |
| JTBD-05.2 | PER-05 Jasmine Okafor | When triaging incoming submissions and tracking stakeholder engagement, I want a unified operational view of queued submissions, pending engagement activity, and records needing lifecycle action, so I can route follow-up efficiently and prevent stale content from persisting without a governance signal. | P0 |

---

## PER-01: Margaret Holloway — Jobs

### JTBD-01.1: Evaluate Innovation Relevance and Credibility for Sponsorship Decisions

**Job Statement:**
When I need to decide whether to sponsor or further evaluate an I&R effort, I want to assess innovation relevance and credibility from a single governed record, so I can make or defer a sponsorship decision with confidence.

**Current Alternatives:**
- Relies on staff to forward relevant information — discovery depends entirely on informal networks and whether someone already knows the project name
- Reviews raw technical documents or marketing summaries that either exceed her time budget or omit the constraints and risks she needs to calibrate risk
- Attends POC demonstrations without prior context, unable to distinguish a promising effort from a stalled experiment before the meeting

**Hiring Criteria:**
- Surfaces records using mission- or problem-area language without requiring knowledge of the formal project name, team, or SharePoint location
- Each record clearly communicates the problem addressed, evidence produced, primary findings, maturity stage, review status, key risks and constraints, and owner of the next step — readable in under 10 minutes
- Maturity and review status are visibly distinct so she can calibrate sponsorship level without parsing raw technical prose
- Executive perspective is derived from the same underlying record as the technical perspective — no conflicting versions or separate documents that may drift

**Success Measure:** Margaret can identify a relevant innovation record, assess its evidence quality and maturity, and determine an appropriate next step (sponsor, delegate for deeper evaluation, or no action) in under 10 minutes from catalog entry to decision.

**Related Features:** F1, F2, F3.1, F3.3, F3.4, F3.5, F3.7, F4.1, F4.2, F4.4
**Priority:** P0

---

### JTBD-01.2: Brief Leadership on Innovation Investments Using a Consistent Factual Record

**Job Statement:**
When preparing to brief leadership on an innovation investment, I want to access an executive perspective grounded in the same evidence as the technical record, so I can present a defensible, consistent recommendation without producing a separate document.

**Current Alternatives:**
- Produces a separate executive summary by manually extracting from raw POC documents — a process that introduces drift and omits constraints the technical record contains
- Delegates summary production to staff, who may apply different framing than the technical record supports
- Presents without a briefing document because producing one is more effort than the value warrants

**Hiring Criteria:**
- Executive perspective is a rendered view of the underlying record — same maturity, review status, findings, risks, and owner — not a separately authored document
- Risk, constraints, maturity stage, and recommended next step are present and readable in the executive view without requiring access to technical appendices
- Record can be shared with a staff member who reads the technical perspective from the same source, ensuring consistent evidence across both audiences

**Success Measure:** Margaret can share an innovation record with a staff member for technical evaluation and have confidence both the executive and technical perspectives reflect identical evidence, maturity, and ownership — eliminating the need to produce or reconcile a separate briefing document.

**Related Features:** F4.1, F4.2, F4.3, F4.4, F3.3, F3.5, F3.7
**Priority:** P0

---

### JTBD-01.3: Initiate a Structured Engagement Request Without Navigating Informal Channels

**Job Statement:**
When I decide a record warrants follow-up, I want to initiate a structured engagement request directly from the record, so I can involve I&R without needing to locate the right contact through informal channels.

**Current Alternatives:**
- Asks a staff member to find the right I&R contact — no governed path exists to request a briefing, demonstration, or adoption discussion
- Sends a generic email to a known I&R address without the originating record context attached, requiring follow-up exchanges to establish what the request concerns
- Defers engagement entirely because the friction of locating the right contact exceeds the urgency of the request

**Hiring Criteria:**
- Record page provides a contextual call to action (request demo, discuss adoption, request briefing) without requiring navigation away from the record
- Engagement request captures the originating record, request type, her name and office, and a description of the need — eliminating the need for a separate context-setting email
- Request routes to I&R with sufficient context for follow-up without her needing to know the team's internal contact structure

**Success Measure:** Margaret can submit an engagement request that arrives at I&R with the originating record and request context attached in a single action from the record page — no separate email required to establish context.

**Related Features:** F3.9, F8.1, F8.2, F8.4, F8.5
**Priority:** P1

---

## PER-02: David Tran — Jobs

### JTBD-02.1: Assess Whether Innovation Applies to an Operational Workflow and What Adoption Would Require

**Job Statement:**
When facing an operational bottleneck, I want to discover whether I&R has already explored a relevant capability, so I can assess applicability and adoption requirements before committing organizational resources.

**Current Alternatives:**
- Monitors informal channels (emails, hallway conversations, team presentations) to learn what I&R is working on — no systematic discovery path exists for operational leaders
- Locates the original project team and reads raw technical artifacts not designed for an operational audience, spending hours to extract what adoption would actually require
- Engages I&R speculatively before understanding whether any existing work is relevant, creating unproductive conversations without sufficient context

**Hiring Criteria:**
- Records are discoverable by problem type or workflow description without knowing the I&R project name
- Each record explicitly states what adoption would require: skills, infrastructure dependencies, organizational responsibilities, and what is versus is not transferable to another office
- Reuse guidance answers the specific question: "What would my office need to own, and what can we realistically reuse?" — not a general capability description
- Ownership and contributing office are clearly attributed so he can identify who to contact before initiating a formal discussion
- Record clearly indicates whether I&R is actively seeking an adopter, collaborator, or is not currently pursuing further engagement

**Success Measure:** David can determine whether an innovation record applies to a current operational need, what adoption would require from his team, and who to contact to begin a discussion — entirely from the record — without contacting I&R first to locate the relevant work.

**Related Features:** F1.3, F1.4, F2.1, F2.3, F3.1, F3.5, F3.6, F3.7, F3.9, F4.2
**Priority:** P0

---

### JTBD-02.2: Submit a Mission Problem to I&R for Research Consideration

**Job Statement:**
When I have a workflow friction my office cannot resolve alone, I want to submit a problem description to I&R in a structured way, so I can surface it for research consideration without it being misread as a feature request.

**Current Alternatives:**
- Composes an ad-hoc email to I&R without a standard format — I&R cannot easily assess relevance, scope, or portfolio fit from unstructured input
- Frames the problem as an application request because there is no established vocabulary or form for describing a research opportunity
- Foregoes submission entirely because there is no clear channel, no expectation of what happens next, and no guarantee attribution or context will be preserved

**Hiring Criteria:**
- Submission flow begins with the problem and workflow friction, not a solution or feature request, and provides structured fields for who is affected, how work is done today, impact, desired outcome, known constraints, and office
- Submission explicitly and unambiguously states it does not imply acceptance into the I&R portfolio — confirmation language is present at the point of submission, not only in help documentation
- Submission is recorded in an I&R queue with his office and contact information intact, so I&R can follow up even if no immediate response is possible
- Submission flow distinguishes between describing a problem for research consideration and sharing existing innovation work — the two paths are not conflated

**Success Measure:** David can submit a workflow problem with sufficient context for I&R to assess portfolio fit, feasibility, and relevance — and receive a confirmation that clearly states submission does not imply acceptance — in a single structured flow without needing to know the correct I&R contact or framing convention.

**Related Features:** F6.1, F6.2, F6.3, F6.4, F6.5, F8.1, F8.2
**Priority:** P1

---

## PER-03: Priya Suresh — Jobs

### JTBD-03.1: Evaluate Technical Reusability and Identify Production-Readiness Gaps

**Job Statement:**
When evaluating a POC for potential reuse in Judiciary infrastructure, I want to access the full technical record — architecture, tooling, findings, limitations, and artifact links — so I can determine what is genuinely portable and what the production-readiness gaps are.

**Current Alternatives:**
- Searches SharePoint and Git repositories manually without knowing whether she has the correct project folder, the right version, or complete coverage of all artifacts the team produced
- Reads polished POC write-ups that minimize or omit production-readiness gaps, testing limitations, and environmental constraints — the information she most needs to make a responsible recommendation
- Contacts I&R team members informally to request technical detail, without a structured request context, often waiting days before reaching the right person

**Hiring Criteria:**
- Technical perspective surfaces architecture decisions, tools and services used, data flow, security considerations, testing approach, known limitations, and specific production-readiness gaps — not a general capability summary
- Reuse guidance explicitly distinguishes what is genuinely portable from what is environment-specific or POC-only, and identifies the skills, services, and dependencies required
- Authoritative artifact links (POC reports, architecture diagrams, repositories, test results, security findings) are directly accessible from the record — no separate repository search required
- Record accurately represents limitations and gaps even when they reflect unfavorably on the POC — content is not polished to minimize constraints

**Success Measure:** Priya can identify authoritative technical artifacts, determine what is reusable versus environment-specific, and understand production-readiness gaps from a single innovation record — without contacting I&R or searching external repositories.

**Related Features:** F2.3, F3.2, F3.4, F3.5, F3.6, F3.8, F4.3, F4.4, F5.2, F5.3, F5.4
**Priority:** P0

---

### JTBD-03.2: Distinguish Review Status from Maturity to Calibrate Due Diligence Requirements

**Job Statement:**
When I need to differentiate security-reviewed work from technically reviewed work from unreviewed experiments, I want review status and maturity to be independently and visibly surfaced, so I can calibrate the level of due diligence required before recommending reuse.

**Current Alternatives:**
- Infers governance state from document age, file location, or informal signals — no consistent metadata structure exists across POC outputs
- Conflates maturity with review status, leading to incorrect assumptions about whether a sophisticated POC has received security review or only technical review
- Requests review status from I&R contacts directly, adding unnecessary coordination overhead for information that should be visible in the record

**Hiring Criteria:**
- Maturity (developmental stage) and review status (governance applied) are displayed as separate, labeled fields — not combined or implied by one another
- Review status values are presented in a progression that makes clear what governance has and has not occurred (e.g., "Technically Reviewed" ≠ "Security Reviewed")
- Catalog filter allows her to narrow to records that have received specific review types (e.g., security reviewed, technically reviewed) and that have available artifacts — without opening each record individually
- A record at "Experiment/POC" maturity with only "Curated for completeness" review status is visually distinguishable at a glance from one at "Prototype/Pilot" maturity with "Security reviewed" status

**Success Measure:** Priya can identify the exact governance and review state of an innovation record at a glance from the catalog card or record header — without reading descriptive prose or contacting I&R — and can filter the catalog to records meeting a specific review threshold in under 60 seconds.

**Related Features:** F1.3, F1.5, F1.6, F2.3, F2.4, F3.5, F9.7
**Priority:** P0

---

## PER-04: Carlos Rivera — Jobs

### JTBD-04.1: Share Existing Innovation Work with Attribution Preserved Through Curation

**Job Statement:**
When my team has completed innovation work others could benefit from, I want to submit it through a structured contribution flow that preserves attribution, so the work enters a curation process without being misrepresented as centrally endorsed or production-ready.

**Current Alternatives:**
- Shares work informally via email or document links — attribution is frequently lost in transit, and there is no curation process to ensure the work is accurately represented
- Submits work through I&R contacts without a standard format, leaving maturity context, artifact links, and contributor identity to be reconstructed by the recipient
- Withholds the contribution because there is no clear path that preserves the team's credit or prevents the work from being misrepresented as approved or production-ready before it warrants that label

**Hiring Criteria:**
- Contribution flow is separate from the opportunity submission flow — he is sharing work already done, not describing a problem for I&R to investigate
- Flow captures contributing office, individual contributors, current owner, current maturity, available artifact links, known limitations, and collaboration preference
- Submission confirmation explicitly states attribution and current ownership are recorded and that curation is required before any publication
- Submitted work cannot be published by I&R without curator review — the flow makes this gate visible to the contributor at the point of submission
- He can discover whether related I&R work already exists using problem-oriented search before submitting, to avoid duplicating effort

**Success Measure:** Carlos can submit an innovation contribution with attribution, artifact links, maturity context, and collaboration preference intact — and receive confirmation that curation is required before publication and that his team's credit is recorded — in a single structured flow.

**Related Features:** F7.1, F7.2, F7.3, F7.4, F1, F2.1, F2.5
**Priority:** P1

---

### JTBD-04.2: Submit a Mission Problem for I&R Consideration Without Implying a Solution Request

**Job Statement:**
When my program manager asks me to surface a workflow problem for I&R consideration, I want to submit a structured problem description that clearly distinguishes a research inquiry from a solution request, so I can represent the need accurately without overpromising outcomes.

**Current Alternatives:**
- Frames the problem as a feature request or application requirement because there is no established vocabulary or submission channel for a problem-only inquiry
- Writes an informal email to I&R without a standard structure, leaving the research framing up to the recipient's interpretation
- Delays submission because the distinction between "submitting a problem for research consideration" and "requesting I&R to build something" is not clear in any current channel

**Hiring Criteria:**
- Submission flow is problem-first: begins with the operational friction, not a requested solution, and provides labeled fields for impact, affected users, current workflow, constraints, and office
- Submission explicitly distinguishes this path from the innovation contribution flow — the UI does not conflate "I have a problem" with "I have work to share"
- Confirmation language unambiguously states submission does not imply I&R acceptance or commitment to act
- Submission is recorded with his office and contact information so I&R can follow up with appropriate framing

**Success Measure:** Carlos can submit a mission problem in a way that his program manager can review — with a submission confirmation that clearly states the request type is "research consideration" and that acceptance is not implied — without needing to draft custom framing language or coordinate with I&R in advance.

**Related Features:** F6.1, F6.2, F6.3, F6.4, F6.5
**Priority:** P1

---

## PER-05: Jasmine Okafor — Jobs

### JTBD-05.1: Create and Govern Innovation Records Through a Full Lifecycle with Publication Gate Enforcement

**Job Statement:**
When working with source material from POCs, lessons-learned documents, or accepted contributions, I want to create and publish structured innovation records through a governed lifecycle interface with publication gate enforcement, so the Hub's content remains trustworthy and consistently structured.

**Current Alternatives:**
- Works from scattered source material across SharePoint, Git repos, project folders, and individual team knowledge — no consistent structured format to work from when creating records
- Applies maturity and review status informally or inconsistently because definitions are documented outside the product, requiring external reference lookup during every curation session
- Manages lifecycle transitions (supersession, archiving, retirement) manually without systematic tracking — stale content persists without clear signals to stakeholders

**Hiring Criteria:**
- Record creation interface covers all required fields: problem statement, hypothesis, outcome, evidence, findings, maturity, review status, attribution, ownership, artifact links, last-reviewed date, applicable disclaimer, and next action
- Publication gate actively prevents publishing a record missing any required field — enforcement happens in the product, not in a separate checklist
- Content model reference (maturity stage definitions, review status values, publication gate requirements) is accessible within the curation interface without consulting an external document
- Lifecycle transitions (draft → review → publish → supersede/archive/retire) are explicit, auditable actions — not inferred from field edits
- Audit history records all material changes to content, governance, lifecycle, and configuration with timestamp and actor identity

**Success Measure:** Jasmine can create a complete, publication-gate-compliant innovation record from raw source material and move it through the full lifecycle (draft → review → publish → supersede or retire) without consulting external documentation — and zero published records are missing required trust fields.

**Related Features:** F9.1, F9.2, F9.3, F9.4, F9.5, F9.6, F9.7, F9.8, F9.9, F9.10, F9.11, F9.16, F5.1, F5.2, F5.3
**Priority:** P0

---

### JTBD-05.2: Maintain a Trustworthy Knowledge Base by Triaging Submissions and Routing Meaningful Engagement

**Job Statement:**
When triaging incoming submissions and tracking stakeholder engagement, I want a unified operational view of queued submissions, pending engagement activity, and records needing lifecycle action, so I can route follow-up efficiently and prevent stale content from persisting without a governance signal.

**Current Alternatives:**
- Receives engagement requests through informal channels (email, verbal) without standard context fields — cannot associate a request with a specific innovation record or determine the appropriate next step without back-and-forth
- Reviews opportunity submissions and contributions from multiple inboxes without a consistent workflow state, making it difficult to track what has been dispositioned and what is still pending
- Identifies stale records manually by checking dates in external documents — no in-product signal flags records due for review, update, or lifecycle action

**Hiring Criteria:**
- Curator summary dashboard shows — using live product data — records needing review or lifecycle action, new opportunity submissions, new contribution submissions, and pending engagement activity with follow-up status
- Opportunity and contribution queues display each submission with its full context fields, workflow state (new, under review, accepted, declined), and the submitting office and contact
- Engagement activity log associates each request with the originating innovation record, request type, user context, and current follow-up status — no manual cross-referencing required
- Settings management allows her to update the engagement routing destination without requiring a code change or redeployment
- Configuration changes (routing destination, other approved settings) are captured in audit history

**Success Measure:** Jasmine can open the curator dashboard and, within 5 minutes, identify every record needing lifecycle action, every unreviewed submission, and every engagement request without a recorded follow-up — with no reliance on external spreadsheets, email inboxes, or manual date tracking.

**Related Features:** F9.1, F9.2, F9.11, F9.12, F9.13, F9.14, F9.15, F8.3, F8.4, F8.6
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD ID | Feature | Expected Outcome |
|---------|---------|-----------------|
| JTBD-01.1 | F1, F2, F3.1, F3.3, F3.4, F3.5, F3.7, F4.1, F4.2, F4.4 | Decision-maker can assess innovation relevance, evidence quality, maturity, and risks from a single record in under 10 minutes without prior project knowledge |
| JTBD-01.2 | F4.1, F4.2, F4.3, F4.4, F3.3, F3.5, F3.7 | Executive perspective is derived from the same record as the technical perspective, eliminating conflicting versions and the need to produce a separate briefing document |
| JTBD-01.3 | F3.9, F8.1, F8.2, F8.4, F8.5 | Engagement request arrives at I&R with originating record context and request type attached, requiring no separate email to establish context |
| JTBD-02.1 | F1.3, F1.4, F2.1, F2.3, F3.1, F3.5, F3.6, F3.7, F3.9, F4.2 | Operational leader can determine applicability, adoption requirements, and the right engagement path without contacting I&R first |
| JTBD-02.2 | F6.1, F6.2, F6.3, F6.4, F6.5, F8.1, F8.2 | Problem submission arrives at I&R with sufficient structured context and explicit non-acceptance language, preventing misinterpretation as a feature request |
| JTBD-03.1 | F2.3, F3.2, F3.4, F3.5, F3.6, F3.8, F4.3, F4.4, F5.2, F5.3, F5.4 | Technical adopter can identify authoritative artifacts, reuse-ready components, and production-readiness gaps from one record without external repository search |
| JTBD-03.2 | F1.3, F1.5, F1.6, F2.3, F2.4, F3.5, F9.7 | Maturity and review status are visibly independent and filterable, enabling accurate due diligence calibration before recommending reuse |
| JTBD-04.1 | F7.1, F7.2, F7.3, F7.4, F1, F2.1, F2.5 | Contribution is received with attribution, maturity context, and artifact links intact; curation gate is visible to contributor at point of submission |
| JTBD-04.2 | F6.1, F6.2, F6.3, F6.4, F6.5 | Problem submission is clearly framed as research inquiry, confirmed not to imply acceptance, and recorded for I&R triage with submitter context preserved |
| JTBD-05.1 | F9.1–F9.11, F9.16, F5.1, F5.2, F5.3 | Zero published records missing required trust fields; full lifecycle transitions are auditable; governance is applied consistently without external reference lookup |
| JTBD-05.2 | F9.1, F9.2, F9.11, F9.12, F9.13, F9.14, F9.15, F8.3, F8.4, F8.6 | Curator can triage all queued submissions and pending engagement in a single dashboard view without relying on external spreadsheets or email inboxes |

---

## NaC Preview

| JTBD ID | Outcome | Candidate NaC |
|---------|---------|--------------|
| JTBD-01.1 | Decision-maker locates and assesses a relevant record in under 10 minutes without prior project knowledge | Given a mission-area keyword with no project name, when the decision-maker searches the catalog, then at least one relevant record surfaces and its maturity, review status, evidence summary, risks, and owner are readable from the record page without opening any external document |
| JTBD-01.2 | Executive and technical perspectives share identical evidence, maturity, and ownership | Given a published innovation record, when an executive views the executive perspective and a technical adopter views the technical perspective, then both perspectives reflect identical maturity, review status, outcome evidence, and current owner — with no field present in one perspective that contradicts a field in the other |
| JTBD-01.3 | Engagement request arrives at I&R with record context attached | Given a user viewing an innovation record, when they submit an engagement request, then I&R receives the request with the originating record ID, request type, user name, office, and description — and the engagement action is recorded in the system |
| JTBD-02.1 | Operational leader determines applicability and adoption requirements from the record alone | Given a published record with reuse guidance, when the operational leader reads the record, then the reuse guidance explicitly states what the adopting office must own, what dependencies apply, and whether I&R is seeking an adopter — with no required call to I&R to obtain this information |
| JTBD-02.2 | Problem submission is structured, labeled as research inquiry, and confirmed non-acceptance | Given the opportunity submission flow, when the user submits a problem description, then the submission is recorded in the I&R queue with all context fields intact and the confirmation page explicitly states submission does not imply acceptance |
| JTBD-03.1 | Technical adopter locates authoritative artifacts and production-readiness gaps from one record | Given a published record with artifact links, when the technical adopter opens the technical perspective, then at least one authoritative artifact link is present and the record explicitly states production-readiness gaps — with no artifact requiring an external search to locate |
| JTBD-03.2 | Maturity and review status are visibly independent and filterable | Given the innovation catalog, when a user applies a filter for "Security reviewed" review status, then only records with that specific review status are returned, and no record with only "Technically reviewed" status appears in results |
| JTBD-04.1 | Contribution is received with attribution and curation gate visible | Given the contribution submission flow, when the contributor submits existing innovation work, then the submission confirmation displays the contributing office, contributor name(s), and a statement that curation is required before publication |
| JTBD-04.2 | Problem submission clearly distinguished from innovation contribution | Given the submission entry point, when a user selects "Submit a problem for I&R consideration," then they enter a flow distinct from the innovation contribution flow and the confirmation clearly labels the submission as a research inquiry with explicit non-acceptance language |
| JTBD-05.1 | Publication gate prevents publishing a record with missing required fields | Given a record in draft state missing the maturity field, when the curator attempts to publish, then the system blocks publication and identifies the missing required field — the record does not reach published state |
| JTBD-05.2 | Curator dashboard surfaces all pending action items without external tools | Given the curator dashboard, when Jasmine opens it, then it displays the count of records needing review action, unreviewed opportunity submissions, unreviewed contributions, and engagement requests without a recorded follow-up — all sourced from live product data |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-08-11*
