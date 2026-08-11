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

