## Release Planning

### Release v1: MVP — "Governed Discovery, Credible Records, Structured Engagement"

This is the single MVP release. All 42 stories (36 P0 + 6 P1) are included. The v1 release delivers four complete journey paths simultaneously, with the "Discover and Act on Existing Innovation" journey fully optimized as the primary path.

**Rationale for single release:** The MVP is structured to prove the complete content, trust, lifecycle, and engagement model before additional content scale. Splitting P0 and P1 stories across releases would leave personas without complete journey paths — for example, separating F6/F7 (P1) from F8 (P0) would give David a working engagement request but no way to submit a problem, and Carlos no way to contribute work. The PRD explicitly classifies F6 and F7 as "P1 — High — MVP engagement," meaning they are part of v1.

#### Journey 1: Discover and Act on Existing Innovation (Primary)
**Persona:** PER-01, PER-02, PER-03
**JTBD Addressed:** JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-03.1, JTBD-03.2
**Stories:** US-1.1, US-1.2, US-1.3, US-2.1, US-2.2, US-2.3, US-3.1, US-3.2, US-3.3, US-3.4, US-3.5, US-3.6, US-3.7, US-4.1, US-4.2, US-4.3, US-5.1, US-5.2, US-5.3, US-8.1, US-8.2, US-8.3

**Journey completion gate:**
- [ ] Margaret can locate the Audio Security POC using "court audio" language, read the executive perspective, assess maturity and evidence, and submit a briefing request — in under 10 minutes
- [ ] David can determine adoption requirements from the reuse guidance without contacting I&R, and submit a demonstration request with originating record context attached
- [ ] Priya can filter to technically reviewed records, access the full technical perspective, follow artifact links to authoritative sources, and submit a targeted technical guidance request
- [ ] All NaC for JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-02.1, JTBD-03.1, JTBD-03.2 pass

#### Journey 2: Submit an Opportunity (Secondary)
**Persona:** PER-02, PER-04
**JTBD Addressed:** JTBD-02.2, JTBD-04.2
**Stories:** US-6.1, US-6.2, US-6.3

**Journey completion gate:**
- [ ] David can submit a workflow problem with structured context and receive a confirmation that explicitly states non-acceptance
- [ ] Carlos can submit a mission problem, select "Current Mission Problem" as request type, and show the confirmation page to his program manager as evidence that the request is framed as research inquiry only
- [ ] All NaC for JTBD-02.2, JTBD-04.2 pass

#### Journey 3: Share Existing Innovation (Secondary)
**Persona:** PER-04
**JTBD Addressed:** JTBD-04.1
**Stories:** US-7.1, US-7.2, US-7.3

**Journey completion gate:**
- [ ] Carlos can submit existing innovation work through the contribution flow (distinct from opportunity flow), with contributor attribution, maturity context, artifact links, and collaboration preference intact
- [ ] Confirmation page names his contributors, records current ownership, and explicitly states curation is required before publication
- [ ] Attribution survives the submission-to-publication pipeline: contributing office and named contributors appear in the published record and cannot be erased
- [ ] All NaC for JTBD-04.1 pass

#### Journey 4: Curate and Govern Content (Operational)
**Persona:** PER-05
**JTBD Addressed:** JTBD-05.1, JTBD-05.2
**Stories:** US-9.1, US-9.2, US-9.3, US-9.4, US-9.5, US-9.6, US-9.7, US-9.8, US-9.9, US-9.10, US-9.11, US-9.12, US-9.13, US-9.14

**Journey completion gate:**
- [ ] Jasmine can create a publication-gate-compliant Audio Security POC record from the lessons-learned document and publish it through the full lifecycle without consulting external documentation
- [ ] Dashboard surfaces all pending action items within 30 seconds of page load using live data
- [ ] Publication gate blocks any record missing any of the 15 required fields, listing missing fields specifically
- [ ] Audit history captures all material changes with actor, timestamp, and change detail
- [ ] Settings management allows routing address update without code deployment
- [ ] Zero published records are missing required trust fields (maturity, review status, owner, last-reviewed date, disclaimer)
- [ ] All NaC for JTBD-05.1, JTBD-05.2 pass

#### Launch Content Gate (PRD §12)
- [ ] At least 3 published innovation records present at launch
- [ ] At least 1 record with significant reusable technical findings and source artifacts (Audio Security POC)
- [ ] At least 1 record that supports an executive decision or sponsorship discussion
- [ ] At least 1 record seeking an adopter, collaborator, or concrete engagement
- [ ] At least 1 archived or superseded experiment retained for institutional learning
- [ ] Every published record includes: maturity, review status, attribution, owner/steward, last-reviewed date, source basis, and applicable disclaimer

---
