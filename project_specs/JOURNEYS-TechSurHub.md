# User Journeys
## TSIO Innovation Hub MVP

| Field | Value |
|-------|-------|
| **Product Name** | TSIO Innovation Hub MVP (TechSur Innovation Hub) |
| **Date** | 2026-08-11 |
| **Related Personas** | PERSONAS-TechSurHub.md |
| **Related JTBD** | JTBD-TechSurHub.md |
| **Related PRD** | PRD-TechSurHub.md |

---

## Journey Index

| ID | Persona | Scenario | Key JTBD | Stages |
|----|---------|----------|----------|--------|
| JRN-01.1 | PER-01 Margaret Holloway | Discover and evaluate innovation relevance for a sponsorship decision | JTBD-01.1, JTBD-01.2, JTBD-01.3 | 6 |
| JRN-02.1 | PER-02 David Tran | Assess whether innovation applies to an office workflow and initiate adoption discussion | JTBD-02.1, JTBD-02.2 | 6 |
| JRN-03.1 | PER-03 Priya Suresh | Evaluate technical reusability of a POC and request technical guidance | JTBD-03.1, JTBD-03.2 | 6 |
| JRN-04.1 | PER-04 Carlos Rivera | Submit an existing innovation POC for curation | JTBD-04.1 | 5 |
| JRN-04.2 | PER-04 Carlos Rivera | Submit a mission problem for I&R consideration | JTBD-04.2 | 5 |
| JRN-05.1 | PER-05 Jasmine Okafor | Curate and publish an innovation record from a lessons-learned document | JTBD-05.1 | 7 |
| JRN-05.2 | PER-05 Jasmine Okafor | Manage daily curator operations | JTBD-05.2 | 5 |

---

## PER-01: Margaret Holloway

### JRN-01.1: Discover and Evaluate Innovation Relevance for a Sponsorship Decision

**Persona:** PER-01 (Margaret Holloway)
**Scenario:** Margaret has just emerged from a leadership meeting where the question of audio security in courtroom environments was raised. A colleague mentioned "something I&R did with audio," but nobody could produce a document or a contact. Margaret opens the Innovation Hub on her own to see whether I&R has produced anything relevant — she has roughly 15 minutes before her next meeting. She searches using the language of her problem, scans catalog results, opens a record, reads the executive perspective, assesses maturity and evidence, and decides whether this warrants a formal follow-up with I&R.
**Related Jobs:** JTBD-01.1, JTBD-01.2, JTBD-01.3

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Arrive | Opens Hub URL from a shared link or browser; lands on catalog or home page | Catalog (F1) | "I have about 15 minutes. Let me see if anything here is relevant." | Neutral, mildly skeptical | Has no prior experience with the Hub; does not know what to expect | Clear entry point and brief value-statement framing the catalog's purpose |
| Search | Types "court audio security" or "audio courtroom recording" into the search bar | Search (F2.1, F2.2, F2.5) | "Will this understand plain-English terms, or do I need to know their internal project name?" | Uncertain; testing the system | Prior experience with siloed document libraries that require exact file names | Problem-language query resolution surfaces the Audio Security POC without requiring the formal project name |
| Scan Results | Reads catalog cards — title, one-line summary, maturity badge, review status, contributing office | Catalog cards (F1.2, F1.3, F1.4, F1.5, F1.6) | "Is this current? Is this real work or just an idea? Which of these is worth opening?" | Cautiously interested | Cards that look similar regardless of maturity create false equivalence | Visual distinction between maturity stages (Experiment/POC vs. Production/Validated Pattern) lets her triage at a glance |
| Read Record | Opens the Audio Security POC record; selects executive perspective; reads problem, outcome, evidence, risks, maturity, and recommended next step | Innovation Record / Executive Perspective (F3.1–F3.5, F3.7, F3.9, F4.1, F4.2, F4.4) | "What problem does this solve? What did they actually prove? What are the risks and gaps? Who owns this?" | Focused, increasingly confident if content is substantive; frustrated if summary glosses over constraints | Separately authored executive summaries that omit limitations — she needs the same evidence the technical record holds | Executive perspective rendered from the same record as the technical view, with risks, constraints, maturity, and ownership all present |
| Assess | Reviews maturity stage (Experiment/POC), review status (Technically Reviewed), production-readiness gaps, and recommended next step | Maturity & Readiness (F3.5), Ownership (F3.7), Next Action (F3.9) | "Is this ready for me to sponsor an adoption, or does it need more work first? Who would own the next step?" | Thoughtful; calibrating investment level | No clear signal distinguishing governance state from developmental stage — conflated signals require reading prose to understand | Independent, labeled maturity and review-status fields let her calibrate sponsorship without parsing technical narrative |
| Act | Clicks "Request a Briefing" CTA; fills in name, office, description of interest; submits engagement request | Engagement Routing (F8.1, F8.2, F8.5) | "I want a conversation with whoever ran this. I don't want to track down an email address on my own." | Decisive, relieved that there is a governed path | No governed engagement path — historically requires a staff member to locate the right I&R contact | One-action engagement request captures originating record, request type, her office, and need — no follow-up email needed to establish context |

#### Key Moments

- **Decision Point:** Assess stage — Margaret decides whether the maturity and evidence justify a sponsorship conversation or whether the work is too early-stage to act on; unclear or conflated trust signals could cause her to dismiss a genuinely relevant record
- **Risk of Abandonment:** Search stage — if the search returns nothing or requires a formal project name she does not have, she exits and falls back to asking a staff member to locate the contact informally
- **Delight Opportunity:** Read Record stage — an executive perspective that honestly presents constraints and production-readiness gaps (rather than a polished success story) builds the credibility that makes her trust the Hub for future decisions

#### Success Outcome

Margaret identifies the Audio Security POC record using mission-area language, reads the executive perspective in under 10 minutes, determines the work is at Experiment/POC maturity and technically reviewed but not yet production-ready, and submits a briefing request that arrives at I&R with the originating record and her stated need attached — satisfying JTBD-01.1 (assess relevance and credibility from a single governed record), JTBD-01.2 (access executive perspective grounded in the same evidence as the technical record), and JTBD-01.3 (initiate a structured engagement request without navigating informal channels).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | F1 (Innovation Catalog) |
| Search | F2.1, F2.2, F2.5 (Search and Discovery) |
| Scan Results | F1.2, F1.3, F1.4, F1.5, F1.6 (Catalog Cards) |
| Read Record | F3.1, F3.3, F3.4, F3.5, F3.7, F3.9, F4.1, F4.2, F4.4 (Record + Executive Perspective) |
| Assess | F3.5, F3.7, F3.9 (Maturity, Ownership, Next Action) |
| Act | F8.1, F8.2, F8.5 (Engagement Routing) |

---

## PER-02: David Tran

### JRN-02.1: Assess Whether Innovation Applies to an Office Workflow and Initiate an Adoption Discussion

**Persona:** PER-02 (David Tran)
**Scenario:** David's district court office has been struggling with a recurring problem: audio from courtroom proceedings is difficult to secure and isolate during remote hearings, and his team does not have an internal solution. His division chief asked him to check whether any AO or I&R work addresses this before the office invests in external consulting. David opens the Hub, searches by the operational problem, browses catalog results, opens a record, reads the reuse guidance and operational applicability sections, reviews ownership and attribution, and initiates an adoption discussion — all without needing to contact I&R first to locate the right person or confirm that any relevant work exists.
**Related Jobs:** JTBD-02.1, JTBD-02.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Arrive & Search | Navigates to Hub; searches using operational language ("courtroom audio isolation," "remote hearing security") | Search (F2.1, F2.2, F2.3, F2.5) | "Does this system understand workflow problems, or will I need to guess the I&R project name?" | Hopeful but cautious; has been burned by SharePoint keyword searches returning nothing useful | Historical reliance on informal channels to discover what I&R has explored | Problem-oriented search returns results using operational vocabulary without requiring formal project names |
| Scan Catalog | Reviews catalog cards for maturity, review status, contributing office, and reuse/engagement indicator | Catalog cards (F1.2, F1.3, F1.4, F1.5, F1.6) | "Is someone actively seeking an adopter for this, or is it just archived? Who originally built it?" | Selectively focused — looking for signals that the work is relevant and actionable | Cards that display the same visual weight regardless of whether I&R is seeking an adopter vs. monitoring only | Reuse/engagement indicator on the card lets David identify "seeking adoption partner" records without opening each one |
| Read Record | Opens record; reads problem statement, outcome and evidence, maturity/readiness, and reuse guidance; switches to executive perspective for operational framing | Record (F3.1, F3.3, F3.5, F3.6, F3.7, F3.9), Executive Perspective (F4.2) | "Does this actually apply to my environment? What would my team need to own? What dependencies would we inherit?" | Engaged; absorbing detail; increasingly frustrated if reuse guidance is vague or missing | Reuse guidance that describes general capability value without answering "what would my office need to own?" | Reuse guidance structured around adopter ownership requirements: skills, infrastructure, dependencies, and what is versus is not transferable |
| Assess Adoption | Reviews ownership, contributing office, production-readiness gaps, and engagement indicator to understand what engagement level is appropriate | F3.5 (Maturity & Readiness), F3.6 (Reuse Guidance), F3.7 (Ownership), F1.4 (Engagement indicator) | "Is I&R looking for an adopter, a collaborator, or neither? Who do I actually talk to?" | Analytical; building a mental picture of what adoption would cost his office | Attribution is unclear — cannot determine who owns the next step or what engagement type makes sense | Clear "seeking adoption partner" or "available for demonstration" status on record, with ownership and contributing office named |
| Brief Leadership | Saves record URL or screenshots the executive perspective to share with his division chief before scheduling an I&R call | Record (F4.2), Catalog (F1) | "Can I present this to my chief without producing a separate write-up? Is this enough to justify requesting a meeting?" | Cautiously confident; needs credibility with his leader before investing more time | No single-source view that works for both his operational level and his division chief's executive level | Executive perspective serves as pre-brief material; one record, consistent evidence across audiences |
| Act | Clicks "Discuss Adoption" or "Request a Demonstration" CTA; fills in office, description of operational need, and desired next step; submits | Engagement Routing (F8.1, F8.2, F8.5) | "I want to come prepared. I'm attaching the record context so I&R knows exactly what we're asking about." | Decisive; relieved to have a structured path that does not require tracking down an informal contact | Initiating adoption discussions has historically required knowing the right I&R team member and framing the ask correctly | Engagement request captures originating record, request type, office, and operational need — I&R receives context without a back-and-forth setup exchange |

#### Key Moments

- **Decision Point:** Assess Adoption stage — David decides whether the evidence and reuse guidance justify investing organizational resources in a formal adoption conversation; vague or absent reuse guidance causes him to default to "not worth pursuing"
- **Risk of Abandonment:** Read Record stage — if reuse guidance is generic ("this could be useful to other courts") without specifying adopter ownership requirements, David cannot build the internal case needed to justify further engagement
- **Delight Opportunity:** Brief Leadership stage — if the executive perspective is self-contained enough to share with his division chief as pre-brief material, it eliminates the document-production work David would otherwise have to do before requesting a leadership approval to engage I&R

#### Success Outcome

David determines from the record alone whether the Audio Security POC applies to his office's courtroom audio problem, what adoption would require from his team, and that I&R is actively seeking an adoption partner — then submits a demonstration request that arrives at I&R with the originating record and his operational context attached. This satisfies JTBD-02.1 (discover relevant capability, assess adoption requirements without contacting I&R first) and sets up JTBD-02.2 (structured problem submission) if the demonstration reveals that his specific workflow variation requires a separate research inquiry.

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive & Search | F2.1, F2.2, F2.3, F2.5 (Search and Discovery) |
| Scan Catalog | F1.2, F1.3, F1.4, F1.5, F1.6 (Catalog Cards) |
| Read Record | F3.1, F3.3, F3.5, F3.6, F3.7, F3.9, F4.2 (Record + Executive Perspective) |
| Assess Adoption | F3.5, F3.6, F3.7, F1.4 (Maturity, Reuse Guidance, Ownership, Engagement Indicator) |
| Brief Leadership | F4.2 (Executive Perspective) |
| Act | F8.1, F8.2, F8.5 (Engagement Routing) |

---

## PER-03: Priya Suresh

### JRN-03.1: Evaluate Technical Reusability of a POC and Request Technical Guidance

**Persona:** PER-03 (Priya Suresh)
**Scenario:** Priya has been asked by her architecture team to evaluate whether the Audio Security POC's approach to GPU/CPU service separation and defense-in-depth audio isolation could be adapted for a new AO cloud workload. She opens the Hub, uses technical search terms and review-status filters to locate the record, switches to the technical perspective, reads through architecture decisions, known limitations, and production-readiness gaps, follows artifact links to the authoritative POC report, assesses what is genuinely reusable versus environment-specific, and submits a technical guidance request when she identifies questions the record does not answer.
**Related Jobs:** JTBD-03.1, JTBD-03.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Search & Filter | Searches for "GPU audio isolation Azure Government" and applies filters for review status ("Technically reviewed") and artifact availability | Search (F2.1, F2.2, F2.3), Catalog filters (F2.4) | "I need something with actual technical depth — I'm going to filter for records that have been technically reviewed and have artifacts attached so I'm not wading through unreviewed experiments." | Methodical; slightly skeptical of whether any record will have the depth she needs | Historical experience: polished write-ups omit the exact limitations she needs to evaluate; no consistent metadata to filter by governance state | Review-status filter independently surfaces technically reviewed records; artifact-availability filter narrows to records with linked source material |
| Scan Results | Reviews catalog cards for maturity badge, review status label, artifact indicator, and contributing office | Catalog cards (F1.2, F1.3, F1.5, F1.6, F2.4) | "Experiment/POC maturity and Technically Reviewed status — that's honest. I can work with that. Is there actually an artifact linked?" | Cautiously optimistic; relieved that maturity and review status appear as separate, labeled fields | Past experience: maturity and review status conflated in a single "status" field that tells her nothing about governance | Independent maturity and review-status badges on the card enable accurate at-a-glance governance calibration without opening each record |
| Switch to Technical Perspective | Opens the Audio Security POC record; clicks to technical perspective; reads architecture, tools, data flow, security considerations, testing approach, limitations, and production-readiness gaps | Innovation Record / Technical Perspective (F3.2, F3.4, F3.5, F3.6, F3.8, F4.3, F4.4) | "What tools and services did they actually use? What broke? What are the known gaps between what was tested and what production would require?" | Engaged and critical; reading carefully for what is not said as much as what is | Polished summaries that minimize limitations; absence of production-readiness gap disclosure | Technical perspective surfaces architecture decisions, GPU/CPU separation rationale, Azure Government Cloud constraints, testing gaps, and production-readiness requirements explicitly — not softened |
| Inspect Reuse Guidance | Reads reuse guidance section: what is portable, what is environment-specific, what is POC-only, what skills and services are required | Reuse Guidance (F3.6) | "Is the GPU/CPU separation approach actually portable, or did they build it specifically against this Azure Government environment? What would I need to stand up to reuse it?" | Analytical; building a technical feasibility picture | Reuse guidance framed as general capability description rather than adoption-specific requirements | Reuse guidance explicitly distinguishes portable architecture patterns from environment-specific configurations and POC-only scaffolding, with required services and skill dependencies named |
| Follow Artifact Links | Clicks artifact links for POC report, architecture diagram, and security findings; accesses authoritative source documents | Artifact Links (F3.8, F5.1, F5.4) | "I need to see the actual architecture diagram and the security findings, not the Hub summary. Where are these hosted? Can I access them?" | Focused; will be frustrated if links are broken, inaccessible, or point to the wrong document version | Artifact access has historically required knowing the SharePoint location and whether she has permissions; no single record links to everything produced | Artifact links in the record point directly to authoritative sources (SharePoint report, Git repo, security findings); no external repository search required |
| Request Guidance | Identifies gaps the record does not answer (e.g., specific compliance implications for her workload); clicks "Request Technical Guidance" CTA; attaches record context and specific question | Engagement Routing (F8.1, F8.2, F8.5), Next Action (F3.9) | "The record is solid, but I have a specific compliance question about SEC-05 implications for our data classification. I need to talk to whoever ran the security review." | Confident in the record's quality; targeted in her request; relieved there is a structured path to reach the right person | Informal channel navigation — reaching the actual technical author requires asking around or waiting days | Technical guidance request captures originating record ID, her specific technical question, and her office — I&R routes to the right technical contact without a context-setting exchange |

#### Key Moments

- **Decision Point:** Inspect Reuse Guidance stage — Priya decides whether the architectural pattern is worth pursuing for her specific workload or whether the environment-specificity makes reuse impractical; vague reuse guidance triggers a "not worth the risk" decision
- **Risk of Abandonment:** Follow Artifact Links stage — a broken or inaccessible artifact link causes her to lose confidence in the record's authoritative basis; she exits to locate the original source manually, never returning to the Hub as a reference
- **Delight Opportunity:** Switch to Technical Perspective stage — a technical perspective that honestly surfaces what broke, what the gaps are, and what changed from original hypothesis to actual outcome builds technical credibility and makes the Hub a trustworthy peer-review source rather than a promotional portal

#### Success Outcome

Priya locates the Audio Security POC record using technical search terms and review-status filters, reads the full technical perspective including limitations and production-readiness gaps, follows artifact links to the authoritative POC report and architecture diagram without needing to search external repositories, assesses GPU/CPU separation as a portable pattern and Azure Government-specific configurations as non-portable, and submits a targeted technical guidance request — satisfying JTBD-03.1 (access full technical record and identify production-readiness gaps from a single record) and JTBD-03.2 (distinguish review status from maturity to calibrate due diligence level at a glance).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Search & Filter | F2.1, F2.2, F2.3, F2.4 (Search, Filtering, Trust Preservation) |
| Scan Results | F1.2, F1.3, F1.5, F1.6, F2.4 (Catalog Cards, Trust Fields) |
| Switch to Technical Perspective | F3.2, F3.4, F3.5, F3.6, F3.8, F4.3, F4.4 (Record + Technical Perspective) |
| Inspect Reuse Guidance | F3.6 (Reuse Guidance) |
| Follow Artifact Links | F3.8, F5.1, F5.4 (Artifact Links, Source Traceability) |
| Request Guidance | F3.9, F8.1, F8.2, F8.5 (Next Action, Engagement Routing) |

---

## PER-04: Carlos Rivera

### JRN-04.1: Submit an Existing Innovation POC for Curation

**Persona:** PER-04 (Carlos Rivera)
**Scenario:** Carlos's court unit recently completed a small cloud-native infrastructure modernization experiment. His team produced a working prototype, documented their findings, and is now wondering whether their work could be useful to other courts. Before submitting, Carlos searches the Hub to check whether I&R has already explored the same space. Finding no directly overlapping record, he navigates to the contribution flow, fills in the problem, work description, contributing office, maturity context, artifact links, contributor names, and collaboration preference, and submits — then reads the confirmation to verify his team's attribution is recorded and that curation is required before any publication.
**Related Jobs:** JTBD-04.1

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Pre-Submission Search | Searches Hub catalog using problem-area language to check whether I&R already has overlapping work | Search (F2.1, F2.5), Catalog (F1) | "Before I invest time submitting, I want to make sure we're not duplicating something I&R already explored. Has anyone done cloud-native infrastructure work like ours?" | Prudent; mildly hopeful he finds something useful even if it means not submitting | No existing channel to check for overlapping I&R work before submitting — teams duplicate effort unknowingly | Problem-oriented search returns related records so contributors can self-identify overlap before submitting |
| Find Contribution Entry Point | Locates "Share Existing Innovation Work" entry point — distinct from the opportunity submission path | Contribution Flow Entry (F7.1) | "Is this the right path for me? I have existing work to share, not a new problem to describe. I don't want to end up in the wrong flow." | Slightly uncertain; needs clear flow distinction | Existing channels do not distinguish between "I have work to share" and "I have a problem for I&R to investigate" — submitters frequently conflate the two | Clear entry point labels distinguish contribution flow (F7) from opportunity submission flow (F6); choosing the wrong path is hard to do by accident |
| Fill Contribution Form | Completes contribution form: problem the work addressed, description of the prototype, contributing office, individual contributors, current owner, current maturity, available artifact links, known limitations, collaboration preference | Contribution Form (F7.2, F7.3) | "Am I filling this in at the right level? Will I&R know what this work actually is from what I've written? Is my team's attribution going to survive the curation process?" | Careful; invested in accuracy; anxious about attribution being preserved | No structured format — previous informal submissions arrived at I&R with incomplete context, attribution lost in email forwarding | Structured form captures all required fields; contributor names and office are explicitly labeled and required; no freeform summary that loses attribution |
| Review Submission Preview | Reviews pre-submission summary of all fields; verifies contributor names, maturity, artifact links, and collaboration preference before submitting | Contribution Form Preview (F7.2, F7.3) | "I want to make sure my team's names are attached. Is the maturity field set right — we're definitely at Experiment/POC, not Prototype/Pilot." | Thorough; slightly anxious about mistakes; reassured by preview | No review step before submission in informal channels — corrections require a follow-up email | Submission preview lets Carlos verify attribution, maturity, and artifact accuracy before committing; editable before final submit |
| Receive Confirmation | Reads submission confirmation; verifies attribution and ownership are recorded; reads curation-required statement; understands next steps and timeline expectations | Submission Confirmation (F7.3, F7.4) | "Is my team's credit actually locked in here? And is it clear that this won't be published as-is without I&R reviewing it first?" | Relieved; looking for assurance that the curation gate is real and attribution is preserved | Historical concern: informal contributions are sometimes surfaced without proper credit or presented as endorsed before curation | Confirmation page explicitly states contributing office, contributor names, current owner, and that curation is required before publication — no ambiguity about endorsement |

#### Key Moments

- **Decision Point:** Fill Contribution Form stage — Carlos decides how to characterize his team's maturity level; ambiguous maturity definitions cause him to over- or under-represent the work; in-form reference to maturity definitions prevents misclassification
- **Risk of Abandonment:** Find Contribution Entry Point stage — if the "Share Existing Innovation Work" path is not clearly distinguished from the opportunity submission path, Carlos enters the wrong flow and abandons when the questions do not match his situation
- **Delight Opportunity:** Receive Confirmation stage — a confirmation that explicitly names his contributors, confirms curation is required, and provides a clear next-step expectation gives Carlos the documentation he needs to report back to his program manager that the contribution was properly filed

#### Success Outcome

Carlos submits his team's cloud-native infrastructure POC with contributor attribution, artifact links, maturity context (Experiment/POC), and collaboration preference intact — and receives a confirmation that names his contributors, records current ownership, and explicitly states curation is required before publication — satisfying JTBD-04.1 (submit existing innovation work through a structured flow that preserves attribution and makes the curation gate visible at point of submission).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Pre-Submission Search | F2.1, F2.5, F1 (Search and Catalog) |
| Find Contribution Entry Point | F7.1 (Separate Contribution Flow) |
| Fill Contribution Form | F7.2, F7.3 (Contribution Context Fields, Attribution Preservation) |
| Review Submission Preview | F7.2, F7.3 (Preview + Attribution) |
| Receive Confirmation | F7.3, F7.4 (Attribution Preservation, Curation Gate) |

---

### JRN-04.2: Submit a Mission Problem for I&R Consideration

**Persona:** PER-04 (Carlos Rivera)
**Scenario:** Carlos's program manager has asked him to surface a workflow automation problem to I&R — specifically, the fact that court staff currently handle a manual, error-prone process for managing case document routing across legacy systems. The program manager explicitly told him: "Don't ask I&R to build something. Just describe the problem and see whether they're already looking at this space." Carlos opens the Hub, locates the opportunity submission flow, fills in the problem using structured fields, and submits — then shows his program manager the confirmation page to confirm that the submission is framed as a research inquiry and does not imply I&R acceptance.
**Related Jobs:** JTBD-04.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Find Submission Entry Point | Locates "Submit a Problem for I&R Consideration" — distinct from the contribution flow for existing innovation work | Opportunity Submission Entry (F6.1) | "My PM said 'submit a problem' but I need to make sure this is the right path. I definitely don't have existing innovation to share — I just have a workflow problem." | Slightly uncertain; cautious about framing | No existing channel distinguishes between describing a problem for I&R research and requesting that I&R build a solution; both arrive the same way | Entry point labels, descriptive copy, and flow logic make the distinction between F6 (opportunity) and F7 (contribution) unambiguous before the first question is answered |
| Fill Problem Description | Completes structured fields: problem statement, who is affected, current workflow description, operational impact, desired outcome, known constraints, related work already attempted, submitting office, and participants available for discovery | Opportunity Form (F6.1, F6.2, F6.3) | "Am I describing the problem clearly enough that I&R can assess whether it's relevant? I don't want this to read like a feature request." | Thoughtful; somewhat anxious about framing; wants the submission to represent his PM's intent accurately | Freeform problem descriptions arrive at I&R without standard fields — I&R cannot assess relevance, scope, or feasibility without a follow-up exchange | Structured problem-first fields give I&R the operational context needed to assess portfolio fit, feasibility, and relevance without a back-and-forth setup |
| Characterize Request Type | Selects request type: "Current mission problem for research consideration" — not a POC request, demonstration request, or existing innovation to share | Request Type Field (F6.3) | "I need this labeled correctly so I&R doesn't interpret it as 'please build this for us.'" | Focused; slightly relieved the form provides vocabulary he did not have to invent | No established vocabulary for "I have a problem for I&R to investigate" — submissions are frequently reinterpreted as application requests on receipt | Request-type characterization field provides pre-defined options that accurately distinguish problem framing from solution requests |
| Review Non-Acceptance Language | Reads the explicit non-acceptance statement displayed on the form before submitting | Non-Acceptance Notice (F6.4) | "Good — it says right here that submitting this doesn't mean I&R is committing to act on it. I can show this to my PM." | Reassured; prepared to communicate expectations to his program manager | No current confirmation language — submitters and PMs frequently assume submission implies I&R acceptance | Non-acceptance language displayed at point of submission (not buried in help documentation) gives Carlos the artifact he needs to manage his PM's expectations before hitting submit |
| Receive Confirmation | Submits form; reads confirmation page that labels the submission as a research inquiry, states non-acceptance explicitly, and confirms submission is recorded with his contact information | Submission Confirmation (F6.4, F6.5) | "I'll screenshot this and send it to my PM. The framing is right — 'research consideration, does not imply acceptance.' That's exactly what I needed." | Relieved; confident he represented the ask correctly; closure on the task | No structured confirmation — historically, submission happens via email with no formal acknowledgment or framing | Confirmation page serves as a stakeholder communication artifact: labeled as research inquiry, explicit non-acceptance, submitter and office recorded |

#### Key Moments

- **Decision Point:** Characterize Request Type stage — selecting the correct request type ensures I&R routes the submission appropriately; ambiguous options cause misframing and a downstream correction cycle
- **Risk of Abandonment:** Fill Problem Description stage — if the form's field labels are ambiguous about what "current workflow" or "desired outcome" means, Carlos either submits with insufficient context or abandons to send an informal email instead
- **Delight Opportunity:** Review Non-Acceptance Language stage — explicit, visible non-acceptance language at the point of submission gives Carlos an artifact he can forward to his program manager immediately, resolving a stakeholder expectation problem he had not anticipated the Hub could solve

#### Success Outcome

Carlos submits the case document routing workflow problem with sufficient structured context for I&R to assess portfolio fit and feasibility, receives a confirmation that explicitly labels the submission as a research inquiry and states non-acceptance, and can forward the confirmation to his program manager to correctly frame expectations — satisfying JTBD-04.2 (submit a structured problem description that clearly distinguishes a research inquiry from a solution request, with non-acceptance confirmed at the point of submission).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Find Submission Entry Point | F6.1 (Problem-First Submission Flow) |
| Fill Problem Description | F6.1, F6.2, F6.3 (Problem Flow, Context Fields, Request Characterization) |
| Characterize Request Type | F6.3 (Request Type Characterization) |
| Review Non-Acceptance Language | F6.4 (Explicit Non-Acceptance Statement) |
| Receive Confirmation | F6.4, F6.5 (Non-Acceptance Language, Recorded Submission) |

---

## PER-05: Jasmine Okafor

### JRN-05.1: Curate and Publish an Innovation Record from a Lessons-Learned Document

**Persona:** PER-05 (Jasmine Okafor)
**Scenario:** Jasmine has received the Audio Security POC lessons-learned document and has been asked to curate it into a full Hub innovation record. The source document is the authoritative artifact; her job is to create a structured record around it — extracting reusable findings, applying the full content model and metadata, managing maturity and review status independently, linking the source document and additional artifacts, and moving the record through the publication gate to published state. She works entirely within the curation interface and does not need to consult any external governance document because the content model reference is accessible within the product.
**Related Jobs:** JTBD-05.1

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Create Record | Opens curation interface; clicks "Create New Record"; chooses source type (Lessons-Learned Document) | Record Creation (F9.3) | "I have the source document. I'll work from it directly. Let me start with the problem statement and work through the content model section by section." | Organized; purposeful | Without a structured interface, record creation begins from a blank document with no enforced field order — important fields are missed | Record creation interface presents fields in content-model sequence: problem → what was explored → outcome and evidence → findings → maturity → review status → attribution → artifacts → next action |
| Apply Content Model | Fills all required record sections — problem statement, hypothesis, outcome and evidence, key findings (architecture, security, cloud constraints, performance), maturity, review status, reuse guidance, ownership, attribution, and next action | Record Editing (F9.4), Content Model Reference (F9.16) | "Is 'Experiment/POC' the right maturity for this? Let me check the content model reference. Yes — controlled effort that produced findings but not production-ready. Good." | Methodical; confident when the content model reference is within reach; anxious when definitions are ambiguous | Maturity and review status definitions are documented outside the product — curators consult external references inconsistently, leading to governance drift | Content model reference is accessible within the curation interface: maturity definitions, review status values, and publication gate requirements are one click away |
| Set Maturity and Review Status | Assigns maturity (Experiment/POC) and review status (Technically Reviewed) independently; verifies that the two fields are decoupled and do not auto-infer from each other | Maturity Management (F9.6), Review Status Management (F9.7) | "This POC was technically reviewed, but it has not received a security review. I need to make sure those two fields reflect that independently — I don't want 'Technically Reviewed' to imply security clearance." | Precise; alert to governance nuance | Review status and maturity conflated in previous ad-hoc systems — a field labeled "reviewed" does not communicate whether that means technical review, security review, or both | Maturity and review status are independent fields with independent histories; applying a review status does not change maturity and vice versa |
| Manage Attribution and Artifacts | Adds contributing office, individual contributor names, I&R contribution description, and current steward; links authoritative artifact (lessons-learned document URL), architecture diagram, and test results | Attribution Management (F9.8), Artifact Management (F9.5) | "I need to make sure attribution is on the record before I publish — if I miss a contributor name now, it's harder to correct after the fact. And I need to link the source document, not copy it." | Careful; attentive to attribution accuracy | Attribution is frequently lost in informal curation workflows; no single field captures contributing office, individual contributors, and I&R contribution together | Attribution section captures contributing office, contributors, I&R contribution, and steward in one structured area; artifact section links to authoritative sources without copying content |
| Verify Publication Gate | Attempts to move record from Draft to Submitted for Review; receives gate check; reviews which required fields are complete and which are missing | Publication Gate (F9.10), Publication Lifecycle (F9.9) | "Let me run the gate check before I mark this ready for review. I don't want to send it for review and have it bounced back for a missing field." | Methodical; slightly anxious about missing something | Without a publication gate, incomplete records advance to published state — stakeholders encounter records missing maturity, owner, or disclaimer | Publication gate actively checks all required fields and surfaces missing items as a list before advancing lifecycle state; record cannot advance to Review or Published state with missing required fields |
| Apply Disclaimer and Last-Reviewed Date | Adds applicable disclaimer ("This record represents an experiment/POC. It is not production-ready and has not been approved for adoption.") and sets last-reviewed date to today | Record Editing (F9.4), Publication Gate (F9.10) | "The disclaimer needs to match the maturity — Experiment/POC. And I need the last-reviewed date so stakeholders know when this was last validated." | Thorough; closing the loop on governance completeness | Disclaimers and review dates are applied inconsistently because curators must remember them rather than being prompted | Disclaimer options are tied to maturity stage — when maturity is set, the appropriate disclaimer is suggested; last-reviewed date is prompted before publication gate passes |
| Publish Record | All gate requirements satisfied; moves record to Published state; confirms publication with a final lifecycle action | Publication Lifecycle (F9.9), Audit History (F9.11) | "Everything is in. Publishing now. This will be visible to stakeholders immediately. The audit history should capture this transition." | Satisfied; confident the record is complete and trustworthy | Lifecycle transitions are not explicitly tracked — stale records persist without signals and changes are not auditable | Publication is an explicit lifecycle action captured in audit history with timestamp and actor identity; published state is visually distinct from draft and review states |

#### Key Moments

- **Decision Point:** Set Maturity and Review Status stage — Jasmine decides the exact maturity and review status values; incorrect assignment (e.g., marking "Technically Reviewed" as implying security clearance) could mislead technical adopters and undermine the trust model; in-product content model reference prevents misclassification
- **Risk of Abandonment:** Apply Content Model stage — if maturity definitions are ambiguous or unavailable in the interface, Jasmine either applies inconsistent labels or pauses the curation session to locate external documentation, introducing workflow interruption and governance drift
- **Delight Opportunity:** Verify Publication Gate stage — a gate check that surfaces exactly which fields are missing (rather than blocking with a generic error) allows Jasmine to complete the record efficiently and gives her confidence that every published record meets the trust standard

#### Success Outcome

Jasmine creates a complete, publication-gate-compliant Audio Security POC record from the lessons-learned document, assigns Experiment/POC maturity and Technically Reviewed status independently, links the authoritative source document and artifacts without copying them, applies the correct disclaimer and last-reviewed date, passes the publication gate check, and publishes the record — all without consulting an external governance document. Audit history captures the full lifecycle transition. This satisfies JTBD-05.1 (create and govern innovation records through a full lifecycle with publication gate enforcement, with zero published records missing required trust fields).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Create Record | F9.3 (Record Creation) |
| Apply Content Model | F9.4, F9.16 (Record Editing, Content Model Reference) |
| Set Maturity and Review Status | F9.6, F9.7 (Maturity Management, Review Status Management) |
| Manage Attribution and Artifacts | F9.5, F9.8 (Artifact Management, Attribution and Ownership) |
| Verify Publication Gate | F9.9, F9.10 (Publication Lifecycle, Publication Gate) |
| Apply Disclaimer and Last-Reviewed Date | F9.4, F9.10 (Record Editing, Publication Gate) |
| Publish Record | F9.9, F9.11 (Publication Lifecycle, Audit History) |

---

### JRN-05.2: Manage Daily Curator Operations

**Persona:** PER-05 (Jasmine Okafor)
**Scenario:** It is Monday morning. Jasmine opens the curation interface to begin her day. Over the weekend, two opportunity submissions arrived, one innovation contribution was filed, and a published record has passed its next-review date. An engagement request also came in on Friday afternoon without a recorded follow-up. Jasmine's goal is to work through the dashboard, triage everything that needs attention, update records, disposition submissions, and record follow-up status — ideally within 30 minutes — so nothing stale persists without a governance signal and nothing waits more than one business day for an initial I&R response.
**Related Jobs:** JTBD-05.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Open Dashboard | Opens curation interface; reads curator summary dashboard showing live counts: records needing review action (1), new opportunity submissions (2), new contribution submissions (1), engagement requests without follow-up (1) | Curator Summary Dashboard (F9.1) | "What needs attention today? Let me get a full picture before I start working anything specific." | Alert; methodical; slightly anxious on Monday because weekend volume is unknown | Currently tracks this manually in a spreadsheet and checks multiple email inboxes — counts are always stale | Dashboard aggregates all pending action items from live product data: no spreadsheet, no inbox triage, no manual date-checking |
| Work Opportunity Queue | Opens opportunity submission queue; reads each submission with full context fields; dispositions the first submission (relevant — marks as "Under Review," notes portfolio fit); dispositions the second (out of scope — marks as "Declined," records rationale) | Opportunity Submission Queue (F9.12) | "Does this submission have enough context for me to assess feasibility? Who submitted it and from which office? Is this something we can realistically explore?" | Focused; decisive on clear cases; uncertain on ambiguous ones | Submissions arrive via email without standard fields — I&R cannot assess feasibility without a back-and-forth to gather missing context | Submission queue displays all context fields (affected users, workflow description, impact, constraints, submitting office) in a standard layout; disposition options are explicit workflow states (New → Under Review → Accepted / Declined) |
| Work Contribution Queue | Opens contribution submission queue; reads the new innovation contribution; reviews contributing office, contributor names, maturity, artifact links, and collaboration preference; accepts the contribution and initiates record creation | Contribution Submission Queue (F9.13) | "This team submitted an infrastructure experiment. Attribution looks complete. The artifacts are linked. Let me accept this and kick off the curation workflow." | Engaged; satisfied that the contribution arrived with structured context | Contributions arrive informally without a standard format — attribution fields, maturity context, and artifact links must be reconstructed from the original email | Contribution queue displays all F7.2 fields in a structured layout; accepted contributions can directly seed a new record creation workflow, preserving attribution without re-entry |
| Handle Engagement Activity | Opens engagement activity log; finds Friday's engagement request without a recorded follow-up (Technical Guidance request from Priya Suresh on the Audio Security POC); reads the originating record, request type, and her technical question; marks "Follow-up in progress" and adds a note | Engagement Activity (F9.14) | "This request has the originating record attached and a specific technical question. Good. I know exactly who to route this to — the Audio Security POC lead. Let me mark this as in progress." | Organized; confident; would be frustrated if she had to cross-reference an external email thread to find the originating record | Engagement arrives through informal channels without standard context fields — associating a request with the right innovation record requires manual cross-referencing | Engagement log associates each request with the originating record, request type, user context, and follow-up status; no manual cross-referencing required |
| Update Stale Record | Opens the published record flagged for next-review action; reviews content for accuracy; updates last-reviewed date; makes a minor finding correction; saves; verifies the material change is captured in audit history | Record Editing (F9.4), Audit History (F9.11), Record Management List (F9.2) | "This record's last-reviewed date has passed. The content still looks accurate, but I should update one of the findings based on recent technical guidance we received. And I need the audit log to show what changed." | Thorough; responsible for governance continuity | Lifecycle changes and content corrections are not systematically tracked — stale records persist without signals; corrections are not auditable | Audit history captures all material changes (content, governance, lifecycle, configuration) with timestamp and actor; last-reviewed date update is an explicit action with a clear effect on the record's trust signal |

#### Key Moments

- **Decision Point:** Work Opportunity Queue stage — Jasmine decides whether a submission has sufficient context to accept for portfolio consideration or should be declined; this decision affects whether contributors receive a useful response or are left waiting without explanation
- **Risk of Abandonment:** Open Dashboard stage — if the dashboard is not live (e.g., shows stale counts because data is cached or requires manual refresh), Jasmine loses confidence in the tool and reverts to checking inboxes and spreadsheets; the dashboard must be an accurate, live view to be adopted as the primary triage surface
- **Delight Opportunity:** Work Contribution Queue stage — when an accepted contribution can directly seed a new record creation workflow (preserving all attribution fields without re-entry), Jasmine's curation time drops significantly and contributor accuracy is maintained through the full lifecycle

#### Success Outcome

Jasmine opens the curator dashboard and, within 30 minutes, identifies and dispositions all pending action items — two opportunity submissions (one accepted, one declined), one contribution (accepted and seeded into record creation), one engagement request (follow-up status recorded), and one stale record (reviewed and updated with audit history capturing the change) — entirely within the Hub interface, with no reliance on external spreadsheets, email inboxes, or manual date tracking. This satisfies JTBD-05.2 (maintain a unified operational view of queued submissions, pending engagement activity, and records needing lifecycle action, routing follow-up efficiently without external tools).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open Dashboard | F9.1 (Curator Summary Dashboard) |
| Work Opportunity Queue | F9.12 (Opportunity Submission Queue) |
| Work Contribution Queue | F9.13 (Contribution Submission Queue) |
| Handle Engagement Activity | F9.14 (Engagement Activity Review) |
| Update Stale Record | F9.2, F9.4, F9.11 (Record Management List, Record Editing, Audit History) |

---

## Cross-Journey Patterns

### Common Pain Points Appearing Across Multiple Journeys

- **Discovery depends on prior knowledge (JRN-01.1, JRN-02.1, JRN-03.1, JRN-04.1):** Every consumer persona — Margaret, David, and Priya — arrives not knowing the I&R project name, team, or file location. Carlos arrives not knowing whether overlapping work exists. The Hub's problem-oriented search and catalog (F1, F2) is the single mechanism that resolves this pain across all four journeys. Any degradation in search quality or catalog trust signals affects every primary consumer journey simultaneously.

- **Trust signals must be independently visible at the card level (JRN-01.1, JRN-02.1, JRN-03.1):** All three consumer personas scan catalog cards and make triage decisions before opening a record. If maturity and review status are conflated or visually indistinct at the card level (F1.3, F1.6), Margaret cannot calibrate sponsorship level, David cannot identify adoption-seeking records, and Priya cannot filter to technically reviewed work. False visual equivalence across cards is a cross-cutting trust failure.

- **Engagement initiation is blocked by informal channel friction (JRN-01.1, JRN-02.1, JRN-03.1):** All three consumer personas want to initiate follow-up contact with I&R from the record page (F8.1, F8.2). In each case, the current-state friction is the same: no governed path exists. Engagement Routing (F8) resolves this across all three journeys with a single pattern: CTA → structured form → routed request with originating record context attached.

- **Attribution must survive the submission-to-publication pipeline (JRN-04.1, JRN-05.1):** Carlos needs attribution preserved through the contribution form (F7.3); Jasmine needs it preserved through curation and publication (F9.8). If attribution fields are not carried forward from the contribution submission queue to the record creation interface, contributor credit is lost at the handoff — a cross-journey failure between two otherwise independent flows.

- **Reuse guidance must answer the adopter's specific question, not describe general capability (JRN-02.1, JRN-03.1):** Both David (operational applicability) and Priya (technical portability) read the reuse guidance section (F3.6) for the same underlying question: "What would my team/office need to own and do before using this?" Reuse guidance that describes general value without naming adopter responsibilities, required skills, service dependencies, and environment-specific limitations fails both personas.

### Shared Opportunities Across Multiple Journeys

- **Content Model Reference within curation interface (JRN-05.1, JRN-05.2):** Jasmine consults the content model reference (F9.16) in both curation journeys. Keeping this within the product interface rather than in an external document eliminates context-switching and ensures consistent governance application. This investment pays off across every curation session, not just the first one.

- **One record, two audiences (JRN-01.1, JRN-02.1, JRN-03.1):** Executive and technical perspectives rendered from a single record (F4.1, F4.4) benefit all three consumer personas simultaneously. Margaret reads the executive perspective; Priya reads the technical perspective; David reads both to build the operational case for his division chief. This is a structural product decision that eliminates the need for separate documents across every consumer journey.

- **Explicit non-acceptance language at point of submission (JRN-04.1, JRN-04.2):** Both of Carlos's submission journeys require clear confirmation that submission does not imply acceptance (F6.4, F7.4). Designing this as a prominent, pre-submission display element (rather than footnote or help text) serves both flows and prevents the most common submitter misunderstanding in both cases.

### Convergence Points Where Multiple Personas Interact Through the Hub

- **Innovation Record (F3) as the shared factual foundation:** The record page is where Margaret makes sponsorship decisions, David assesses operational applicability, and Priya evaluates technical reusability. All three consume the same underlying evidence — their perspectives (F4) are rendering choices, not different records. Any content quality issue in the record propagates across all three consumer journeys.

- **Engagement Routing (F8) as the shared exit action:** Every consumer persona journey ends with an engagement request (request demo, request briefing, discuss adoption, request technical guidance). All route through the same CTA → form → routing mechanism (F8.1, F8.2, F8.5). Jasmine receives all of these in the engagement activity log (F9.14) and is responsible for recording follow-up status. The quality of the engagement handoff — whether I&R receives sufficient context in the routed request — determines whether every consumer journey delivers on its promise.

- **Submission queues as the Carlos-to-Jasmine handoff:** Carlos's contribution (JRN-04.1) and opportunity submission (JRN-04.2) flow directly into Jasmine's daily operations (JRN-05.2). The quality of the structured form (F7.2, F6.2) determines whether Jasmine can disposition the submission without a follow-up exchange. A well-structured form makes JRN-04 output usable in JRN-05 without friction.

---

## Journey-to-JTBD Traceability

| Journey Stage | JTBD ID | Expected Outcome |
|--------------|---------|-----------------|
| JRN-01.1: Search | JTBD-01.1 | Margaret locates relevant innovation work using mission-area language without knowing the I&R project name |
| JRN-01.1: Scan Results | JTBD-01.1 | Margaret distinguishes maturity stage and review status from catalog cards without opening every record |
| JRN-01.1: Read Record | JTBD-01.1, JTBD-01.2 | Margaret reads problem, outcome, evidence, maturity, risks, and recommended next step from the executive perspective in under 10 minutes |
| JRN-01.1: Assess | JTBD-01.1, JTBD-01.2 | Margaret calibrates appropriate sponsorship level from independent maturity and review-status fields without parsing technical prose |
| JRN-01.1: Act | JTBD-01.3 | Engagement request arrives at I&R with originating record, request type, and Margaret's stated need — no separate context-setting email required |
| JRN-02.1: Arrive & Search | JTBD-02.1 | David locates relevant capability using operational workflow language without knowing the I&R project name |
| JRN-02.1: Scan Catalog | JTBD-02.1 | David identifies "seeking adoption partner" records from the card-level engagement indicator without opening each record |
| JRN-02.1: Read Record | JTBD-02.1 | David reads reuse guidance that specifies adopter ownership requirements, infrastructure dependencies, and transferable vs. non-transferable components |
| JRN-02.1: Assess Adoption | JTBD-02.1 | David identifies ownership and contributing office from the record and determines appropriate engagement type before initiating contact |
| JRN-02.1: Brief Leadership | JTBD-02.1 | Executive perspective serves as pre-brief material; David does not need to produce a separate write-up for his division chief |
| JRN-02.1: Act | JTBD-02.1 | Demonstration request arrives at I&R with originating record and David's operational context attached |
| JRN-03.1: Search & Filter | JTBD-03.2 | Priya filters catalog to technically reviewed records with linked artifacts without opening each record individually |
| JRN-03.1: Scan Results | JTBD-03.2 | Priya reads independent maturity and review-status badges on catalog cards and accurately calibrates governance state at a glance |
| JRN-03.1: Switch to Technical Perspective | JTBD-03.1 | Priya accesses full technical record: architecture, tools, limitations, production-readiness gaps — not a polished summary |
| JRN-03.1: Inspect Reuse Guidance | JTBD-03.1 | Priya determines what is genuinely portable vs. environment-specific vs. POC-only from the reuse guidance section |
| JRN-03.1: Follow Artifact Links | JTBD-03.1 | Priya accesses authoritative POC report, architecture diagram, and security findings directly from the record — no external repository search required |
| JRN-03.1: Request Guidance | JTBD-03.1 | Technical guidance request reaches the right I&R contact with originating record and specific technical question attached |
| JRN-04.1: Pre-Submission Search | JTBD-04.1 | Carlos identifies overlapping I&R work before submitting, avoiding duplicated effort |
| JRN-04.1: Fill Contribution Form | JTBD-04.1 | Contribution is captured with contributor attribution, maturity context, artifact links, and collaboration preference in a structured form |
| JRN-04.1: Receive Confirmation | JTBD-04.1 | Confirmation page names contributors, records current ownership, and explicitly states curation is required before publication |
| JRN-04.2: Find Submission Entry Point | JTBD-04.2 | Carlos enters the correct flow (opportunity, not contribution) because the distinction is unambiguous at the entry point |
| JRN-04.2: Fill Problem Description | JTBD-04.2 | Problem is captured with sufficient structured context for I&R to assess portfolio fit and feasibility without a follow-up exchange |
| JRN-04.2: Review Non-Acceptance Language | JTBD-04.2 | Non-acceptance statement is visible at point of submission, giving Carlos the artifact he needs to manage stakeholder expectations |
| JRN-04.2: Receive Confirmation | JTBD-04.2 | Confirmation labels submission as research inquiry with explicit non-acceptance; Carlos's program manager can be shown the confirmation immediately |
| JRN-05.1: Create Record | JTBD-05.1 | Record creation interface presents fields in content-model sequence; no required fields are missed |
| JRN-05.1: Apply Content Model | JTBD-05.1 | All required record sections are completed using in-product content model reference; no external document lookup required |
| JRN-05.1: Set Maturity and Review Status | JTBD-05.1 | Maturity and review status are independently assigned without auto-inference; a technically reviewed POC is not mistakenly presented as security reviewed |
| JRN-05.1: Manage Attribution and Artifacts | JTBD-05.1 | Attribution fields capture contributing office, contributors, and I&R contribution; artifact links point to authoritative sources without copying content |
| JRN-05.1: Verify Publication Gate | JTBD-05.1 | Gate check identifies exactly which required fields are missing before advancing lifecycle state; record cannot publish with missing required fields |
| JRN-05.1: Publish Record | JTBD-05.1 | Audit history captures the publication lifecycle transition with timestamp and actor; zero published records missing required trust fields |
| JRN-05.2: Open Dashboard | JTBD-05.2 | Live dashboard shows all pending action items from product data; no spreadsheet or inbox triage required |
| JRN-05.2: Work Opportunity Queue | JTBD-05.2 | Each submission is dispositioned with explicit workflow state; I&R can track what has been accepted, declined, or is under review without manual cross-referencing |
| JRN-05.2: Work Contribution Queue | JTBD-05.2 | Accepted contribution directly seeds record creation workflow; attribution fields are carried forward without re-entry |
| JRN-05.2: Handle Engagement Activity | JTBD-05.2 | Each engagement request is associated with the originating record, request type, and user context; follow-up status is recorded in the product |
| JRN-05.2: Update Stale Record | JTBD-05.2 | Material content correction and last-reviewed date update are captured in audit history with timestamp and actor identity |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-08-11*
